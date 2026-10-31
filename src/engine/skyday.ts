/**
 * Public daily horoscope engine. Everything is computed live from the real sky for a calendar date in
 * Europe/Skopje (no tables that go stale): Moon sign + phase, exact lunar phases, sign ingresses, stations,
 * exact planet-to-planet aspects. Relevance per sun sign uses whole-sign houses counted from that sign.
 * Works for any date astronomy-engine supports (tested 1900-2100).
 */
import * as Astronomy from "astronomy-engine";
import { DateTime } from "luxon";
import { longitude, type Planet } from "./astro";
import { SIGNS, signFromLongitude, SIGN_ELEMENT, type Sign, type Element } from "./zodiac";
import { moonPhase, hash, type MoonPhase } from "./daily";

export const SKY_ZONE = "Europe/Skopje";
export type Body = Exclude<Planet, "node" | "moon"> ;
export const BODIES: Body[] = ["sun", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto"];
export type AspectKind = "conjunction" | "sextile" | "square" | "trine" | "opposition";
const ASPECT_ANGLE: Record<AspectKind, number> = { conjunction: 0, sextile: 60, square: 90, trine: 120, opposition: 180 };

export type SkyEvent =
  | { kind: "quarter"; quarter: "new" | "first-quarter" | "full" | "last-quarter"; time: string; sign: Sign; house: number }
  | { kind: "station"; body: Body; dir: "retro" | "direct"; sign: Sign; house: number }
  | { kind: "ingress"; body: Body; to: Sign; house: number }
  | { kind: "aspect"; a: Body; b: Body; type: AspectKind; exact: boolean };

export type MoonAspect = { body: Body; type: AspectKind; time: string };
const MOON_TARGETS: Body[] = ["sun", "mercury", "venus", "mars", "jupiter", "saturn"];
const MOON_ANGLES: [number, AspectKind][] = [[0, "conjunction"], [60, "sextile"], [90, "square"], [120, "trine"], [180, "opposition"], [240, "trine"], [270, "square"], [300, "sextile"]];
/** Moments when the Moon's angle to a planet crosses an exact aspect, found hourly then refined by bisection. */
function moonAspectsOf(start: Date, end: Date): MoonAspect[] {
  const out: (MoonAspect & { t: number })[] = [];
  const t0 = start.getTime(), span = end.getTime() - t0, steps = 24;
  const rel = (b: Body, t: number) => norm(longitude("moon", new Date(t)) - longitude(b, new Date(t)));
  for (const b of MOON_TARGETS) {
    const r = Array.from({ length: steps + 1 }, (_, k) => rel(b, t0 + (span * k) / steps));
    for (const [ang, type] of MOON_ANGLES) {
      const g = (x: number) => ((x - ang + 540) % 360) - 180;
      for (let k = 0; k < steps; k++) {
        if (!(g(r[k]) < 0 && g(r[k + 1]) >= 0)) continue;
        let lo = t0 + (span * k) / steps, hi = t0 + (span * (k + 1)) / steps;
        for (let i = 0; i < 16; i++) { const mid = (lo + hi) / 2; if (g(rel(b, mid)) < 0) lo = mid; else hi = mid; }
        out.push({ body: b, type, time: hhmm(new Date(hi)), t: hi });
      }
    }
  }
  return out.sort((a, b) => a.t - b.t).map(({ body, type, time }) => ({ body, type, time }));
}

export interface SkyDay {
  iso: string; sign: Sign;
  moon: { sign: Sign; phase: MoonPhase; angle: number; illumination: number; house: number; element: Element; moves?: { to: Sign; time: string; house: number } };
  houses: Record<Body, number>; signs: Record<Body, Sign>; retro: Body[];
  events: SkyEvent[]; seed: number;
  /** Exact Moon aspects to Sun through Saturn during the local day, in time order. */
  moonAspects: MoonAspect[];
  lucky: { color: number; number: number; window: [number, number] };
}

const norm = (x: number) => ((x % 360) + 360) % 360;
const sep = (a: number, b: number) => { const d = Math.abs(norm(a - b)); return d > 180 ? 360 - d : d; };
export const houseFrom = (sun: Sign, s: Sign) => ((SIGNS.indexOf(s) - SIGNS.indexOf(sun) + 12) % 12) + 1;
const speed = (b: Planet, t: Date) => { const d = norm(longitude(b, new Date(t.getTime() + 432e5)) - longitude(b, new Date(t.getTime() - 432e5))); return d > 180 ? d - 360 : d; };

export function isValidIso(iso: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  return DateTime.fromISO(iso, { zone: SKY_ZONE }).isValid;
}
/** Start, noon and end of the local calendar day. */
export function dayBounds(iso: string) {
  const d = DateTime.fromISO(iso, { zone: SKY_ZONE }).startOf("day");
  return { start: d.toJSDate(), noon: d.plus({ hours: 12 }).toJSDate(), end: d.plus({ days: 1 }).toJSDate() };
}
const hhmm = (t: Date) => DateTime.fromJSDate(t, { zone: SKY_ZONE }).toFormat("HH:mm");

/** Computed once per (date); sign-independent part. */
const cache = new Map<string, ReturnType<typeof skyOfDate>>();
function skyOfDate(iso: string) {
  const { start, noon, end } = dayBounds(iso);
  const signs = {} as Record<Body, Sign>; const retro: Body[] = [];
  type Raw = { kind: "ingress" | "station" | "quarter"; sign?: Sign; to?: Sign } & Record<string, unknown>;
  const raw: Raw[] = [];
  const aspects: { a: Body; b: Body; type: AspectKind; orb: number; exact: boolean }[] = [];
  const lon0 = {} as Record<Body, number>, lonN = {} as Record<Body, number>, lon1 = {} as Record<Body, number>;
  for (const b of BODIES) {
    lon0[b] = longitude(b, start); lonN[b] = longitude(b, noon); lon1[b] = longitude(b, end);
    signs[b] = signFromLongitude(lonN[b]);
    if (signFromLongitude(lon0[b]) !== signFromLongitude(lon1[b])) raw.push({ kind: "ingress", body: b, to: signFromLongitude(lon1[b]) } as never);
    if (b !== "sun") {
      const v0 = speed(b, start), v1 = speed(b, end);
      if (v1 < 0) retro.push(b);
      if (Math.sign(v0) !== Math.sign(v1) && v0 !== 0) raw.push({ kind: "station", body: b, dir: v1 < 0 ? "retro" : "direct", sign: signs[b] } as never);
    }
  }
  for (let i = 0; i < BODIES.length; i++) for (let j = i + 1; j < BODIES.length; j++) {
    const a = BODIES[i], b = BODIES[j];
    if (i >= 5 && j >= 5) continue; // outer-to-outer aspects last for years, not daily news
    for (const [type, ang] of Object.entries(ASPECT_ANGLE) as [AspectKind, number][]) {
      const f0 = sep(lon0[a], lon0[b]) - ang, f1 = sep(lon1[a], lon1[b]) - ang, fn = Math.abs(sep(lonN[a], lonN[b]) - ang);
      const exact = (f0 <= 0 && f1 >= 0) || (f0 >= 0 && f1 <= 0);
      if (exact || fn <= 1) aspects.push({ a, b, type, orb: exact ? 0 : fn, exact });
    }
  }
  aspects.sort((x, y) => x.orb - y.orb);
  const q = Astronomy.SearchMoonQuarter(start);
  if (q && q.time.date < end) {
    const QN = ["new", "first-quarter", "full", "last-quarter"] as const;
    raw.push({ kind: "quarter", quarter: QN[q.quarter], time: hhmm(q.time.date), sign: signFromLongitude(longitude("moon", q.time.date)) } as never);
  }
  const mp = moonPhase(noon);
  const m0 = signFromLongitude(longitude("moon", start)), m1 = signFromLongitude(longitude("moon", end));
  let moves: { to: Sign; time: string } | undefined;
  if (m0 !== m1) {
    let lo = start.getTime(), hi = end.getTime();
    for (let k = 0; k < 30; k++) { const mid = (lo + hi) / 2; if (signFromLongitude(longitude("moon", new Date(mid))) === m0) lo = mid; else hi = mid; }
    moves = { to: m1, time: hhmm(new Date(hi)) };
  }
  return { signs, retro, raw, aspects: aspects.slice(0, 3), moon: mp, moves, moon0: m0, moonAspects: moonAspectsOf(start, end) };
}

const RANK: Record<SkyEvent["kind"], number> = { quarter: 40, station: 30, ingress: 20, aspect: 10 };
const KEY_HOUSE = [1, 7, 10, 4, 5];

export function skyDay(iso: string, sign: Sign): SkyDay {
  if (!isValidIso(iso)) throw new Error(`bad date ${iso}`);
  let s = cache.get(iso); if (!s) { s = skyOfDate(iso); if (cache.size > 400) cache.clear(); cache.set(iso, s); }
  const houses = Object.fromEntries(BODIES.map((b) => [b, houseFrom(sign, s.signs[b])])) as Record<Body, number>;
  const events: SkyEvent[] = [
    ...s.raw.map((e) => ({ ...e, house: houseFrom(sign, (e.kind === "ingress" ? e.to : e.sign)!) }) as unknown as SkyEvent),
    ...s.aspects.map(({ a, b, type, exact }) => ({ kind: "aspect" as const, a, b, type, exact })),
  ];
  const score = (e: SkyEvent) => RANK[e.kind] + ("house" in e && KEY_HOUSE.includes(e.house) ? 5 : 0) + (e.kind === "ingress" && e.to === sign ? 8 : 0) + (e.kind === "aspect" && e.exact ? 3 : 0);
  events.sort((x, y) => score(y) - score(x));
  const moonSign = s.moon.moonSign; const seed = hash(`${iso}|${sign}`);
  const mh = houseFrom(sign, moonSign);
  // Lucky window: two hours that follow the Moon's house rhythm (morning for 1-4, midday for 5-8, evening for 9-12) + a daily shift.
  const base = mh <= 4 ? 7 : mh <= 8 ? 12 : 17; const startH = base + (seed % 3);
  const [y, mo, d] = iso.split("-").map(Number);
  const digits = String(y).split("").map(Number).reduce((a, b) => a + b, 0) + mo + d + SIGNS.indexOf(sign) + 1;
  let n = digits; while (n > 9) n = String(n).split("").map(Number).reduce((a, b) => a + b, 0);
  return {
    iso, sign, houses, signs: s.signs, retro: s.retro, events: events.slice(0, 4), seed, moonAspects: s.moonAspects,
    moon: { sign: moonSign, phase: s.moon.phase, angle: s.moon.angle, illumination: s.moon.illumination, house: mh, element: SIGN_ELEMENT[moonSign], moves: s.moves ? { ...s.moves, house: houseFrom(sign, s.moves.to) } : undefined },
    lucky: { color: (seed >>> 4) % 3, number: n, window: [startH, startH + 2] },
  };
}

export const addDays = (iso: string, n: number) => DateTime.fromISO(iso, { zone: SKY_ZONE }).plus({ days: n }).toISODate()!;
export const todayIso = (now = new Date()) => DateTime.fromJSDate(now, { zone: SKY_ZONE }).toISODate()!;
/** First date the site ever published. Every day from here on stays online, so a date that earned clicks never disappears. */
export const ARCHIVE_START = "2026-09-27";
/** Dates published by the current build: every day since ARCHIVE_START, through today in Skopje plus `ahead` (3) days. */
export function publishedDates(now = new Date(), ahead = Number(process.env.DAILY_DAYS_AHEAD ?? 3)): string[] {
  const end = addDays(todayIso(now), ahead); const out: string[] = [];
  for (let d = ARCHIVE_START; d <= end; d = addDays(d, 1)) out.push(d);
  return out;
}

const PERSONAL = new Set(["sun", "mercury", "venus", "mars"]);
/** The most notable sky events (lunar quarters, stations, sign changes) in the 7 days after `iso`, in date order, with houses for `sign`. */
export function nextEvents(iso: string, sign: Sign, max = 2): { iso: string; event: Exclude<SkyEvent, { kind: "aspect" }> }[] {
  const all: { iso: string; d: number; score: number; event: Exclude<SkyEvent, { kind: "aspect" }> }[] = [];
  for (let d = 1; d <= 7; d++) {
    const day = addDays(iso, d);
    let s = cache.get(day); if (!s) { s = skyOfDate(day); cache.set(day, s); }
    for (const e of s.raw) {
      const personal = e.kind === "quarter" || PERSONAL.has(e.body as string);
      const score = (e.kind === "quarter" ? 40 : e.kind === "station" ? 30 : 20) + (personal ? 10 : 0) - d * 0.1;
      all.push({ iso: day, d, score, event: { ...e, house: houseFrom(sign, (e.kind === "ingress" ? e.to : e.sign)!) } as unknown as Exclude<SkyEvent, { kind: "aspect" }> });
    }
  }
  return all.sort((a, b) => b.score - a.score).slice(0, max).sort((a, b) => a.d - b.d).map(({ iso, event }) => ({ iso, event }));
}
