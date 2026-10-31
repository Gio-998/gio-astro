/**
 * The real sky over a span of days (a week or a month) in Europe/Skopje: lunar quarters and eclipses, sign changes,
 * retrograde stations and exact aspects, plus where the Moon sits each day. Everything is computed, nothing is a table.
 * Sign independent; src/lib/horoscope-period.ts maps it to each sign's houses with houseFrom.
 */
import * as Astronomy from "astronomy-engine";
import { DateTime } from "luxon";
import { longitude } from "./astro";
import { moonPhase, type MoonPhase } from "./daily";
import { BODIES, SKY_ZONE, addDays, dayBounds, type AspectKind, type Body } from "./skyday";
import { signFromLongitude, type Sign } from "./zodiac";

export type Quarter = "new" | "first-quarter" | "full" | "last-quarter";
export const QUARTERS: Quarter[] = ["new", "first-quarter", "full", "last-quarter"];
export type PeriodEvent =
  | { kind: "lunation"; iso: string; time: string; quarter: Quarter; sign: Sign; eclipse?: "solar" | "lunar" }
  | { kind: "ingress"; iso: string; time: string; body: Body; from: Sign; to: Sign }
  | { kind: "station"; iso: string; body: Body; dir: "retro" | "direct"; sign: Sign }
  | { kind: "aspect"; iso: string; time: string; a: Body; b: Body; type: AspectKind };
export type MoonDay = { iso: string; sign: Sign; phase: MoonPhase; illumination: number };
/** A planet that spends some of the period retrograde. `until` is the day it turns direct, when that is within reach. */
export type RetroSpell = { body: Body; sign: Sign; until?: string };
export interface PeriodSky {
  start: string; end: string;
  /** Every lunation, sign change and station plus every exact aspect, in time order. */
  events: PeriodEvent[];
  moon: MoonDay[];
  /** Signs at noon on the first day. */
  signs: Record<Body, Sign>;
  retro: RetroSpell[];
  /** First lunation after the period, for quiet weeks that hold none. */
  next: Extract<PeriodEvent, { kind: "lunation" }>;
}

const TRACKED_RETRO: Body[] = ["mercury", "venus", "mars", "jupiter", "saturn"];
const ANGLES: [number, AspectKind][] = [[0, "conjunction"], [60, "sextile"], [300, "sextile"], [90, "square"], [270, "square"], [120, "trine"], [240, "trine"], [180, "opposition"]];
const norm = (x: number) => ((x % 360) + 360) % 360;
const offset = (x: number, ang: number) => ((x - ang + 540) % 360) - 180;
const hhmm = (t: Date) => DateTime.fromJSDate(t, { zone: SKY_ZONE }).toFormat("HH:mm");
const isoOf = (t: Date) => DateTime.fromJSDate(t, { zone: SKY_ZONE }).toISODate()!;
const speed = (b: Body, t: Date) => { const d = norm(longitude(b, new Date(t.getTime() + 432e5)) - longitude(b, new Date(t.getTime() - 432e5))); return d > 180 ? d - 360 : d; };

/** First moment in [lo, hi] where `past` turns true. */
function bisect(lo: number, hi: number, past: (t: Date) => boolean): Date {
  for (let i = 0; i < 14; i++) { const mid = (lo + hi) / 2; if (past(new Date(mid))) hi = mid; else lo = mid; }
  return new Date(hi);
}

function eclipseAt(q: Quarter, peak: Date): "solar" | "lunar" | undefined {
  const near = (t: Date) => Math.abs(t.getTime() - peak.getTime()) < 864e5;
  if (q === "new") return near(Astronomy.SearchGlobalSolarEclipse(new Date(peak.getTime() - 2 * 864e5)).peak.date) ? "solar" : undefined;
  if (q === "full") return near(Astronomy.SearchLunarEclipse(new Date(peak.getTime() - 2 * 864e5)).peak.date) ? "lunar" : undefined;
  return undefined;
}

function lunationsIn(from: Date, to: Date): PeriodEvent[] {
  const out: PeriodEvent[] = [];
  for (let q = Astronomy.SearchMoonQuarter(from); q.time.date < to; q = Astronomy.NextMoonQuarter(q)) {
    const quarter = (["new", "first-quarter", "full", "last-quarter"] as const)[q.quarter]; const t = q.time.date;
    out.push({ kind: "lunation", iso: isoOf(t), time: hhmm(t), quarter, sign: signFromLongitude(longitude("moon", t)), eclipse: eclipseAt(quarter, t) });
  }
  return out;
}

/** The day a retrograde planet turns direct, searched up to 200 days ahead. */
function directDate(b: Body, from: string): string | undefined {
  let d = from;
  for (let i = 0; i < 200; i++) { d = addDays(d, 1); if (speed(b, dayBounds(d).end) > 0) return d; }
  return undefined;
}

const cache = new Map<string, PeriodSky>();
/** Sky for the inclusive local dates start..end. */
export function periodSky(start: string, end: string): PeriodSky {
  const key = `${start}|${end}`; const hit = cache.get(key); if (hit) return hit;
  const days: string[] = []; for (let d = start; d <= end; d = addDays(d, 1)) days.push(d);
  const edges = [...days.map((d) => dayBounds(d).start), dayBounds(end).end];
  const lon = Object.fromEntries(BODIES.map((b) => [b, edges.map((t) => longitude(b, t))])) as Record<Body, number[]>;
  const events: PeriodEvent[] = lunationsIn(edges[0], edges[edges.length - 1]);
  for (const b of BODIES) {
    const v = b === "sun" ? [] : edges.map((t) => speed(b, t));
    days.forEach((iso, k) => {
      const a = signFromLongitude(lon[b][k]), c = signFromLongitude(lon[b][k + 1]);
      if (a !== c) { const t = bisect(edges[k].getTime(), edges[k + 1].getTime(), (x) => signFromLongitude(longitude(b, x)) !== a); events.push({ kind: "ingress", iso, time: hhmm(t), body: b, from: a, to: c }); }
      if (b !== "sun" && Math.sign(v[k]) !== Math.sign(v[k + 1]) && v[k] !== 0) events.push({ kind: "station", iso, body: b, dir: v[k + 1] < 0 ? "retro" : "direct", sign: signFromLongitude(lon[b][k + 1]) });
    });
  }
  for (let i = 0; i < BODIES.length; i++) for (let j = i + 1; j < BODIES.length; j++) {
    if (i >= 5 && j >= 5) continue; // outer-to-outer aspects last for years, not weeks
    const a = BODIES[i], b = BODIES[j]; const gap = (t: Date) => norm(longitude(a, t) - longitude(b, t));
    for (const [ang, type] of ANGLES) days.forEach((iso, k) => {
      const g0 = offset(norm(lon[a][k] - lon[b][k]), ang), g1 = offset(norm(lon[a][k + 1] - lon[b][k + 1]), ang);
      if (Math.abs(g0) > 30 || Math.abs(g1) > 30 || Math.sign(g0) === Math.sign(g1)) return;
      const t = bisect(edges[k].getTime(), edges[k + 1].getTime(), (x) => Math.sign(offset(gap(x), ang)) !== Math.sign(g0));
      events.push({ kind: "aspect", iso, time: hhmm(t), a, b, type });
    });
  }
  const order = (e: PeriodEvent) => `${e.iso} ${"time" in e ? e.time : "12:00"}`;
  events.sort((x, y) => order(x).localeCompare(order(y)));
  const moon = days.map((iso): MoonDay => { const m = moonPhase(dayBounds(iso).noon); return { iso, sign: m.moonSign, phase: m.phase, illumination: m.illumination }; });
  const noon = dayBounds(start).noon; const signs = Object.fromEntries(BODIES.map((b) => [b, signFromLongitude(longitude(b, noon))])) as Record<Body, Sign>;
  const retro: RetroSpell[] = [];
  for (const b of TRACKED_RETRO) {
    const turns = events.find((e) => e.kind === "station" && e.body === b && e.dir === "retro");
    if (speed(b, edges[0]) < 0 || turns) retro.push({ body: b, sign: turns?.kind === "station" ? turns.sign : signs[b], until: directDate(b, turns?.iso ?? start) });
  }
  const next = lunationsIn(edges[edges.length - 1], new Date(edges[edges.length - 1].getTime() + 10 * 864e5))[0] as PeriodSky["next"];
  const sky = { start, end, events, moon, signs, retro, next };
  if (cache.size > 200) cache.clear();
  cache.set(key, sky);
  return sky;
}

/** How newsworthy an aspect is, sign independent: main aspects between personal planets first. */
export function aspectWeight(e: Extract<PeriodEvent, { kind: "aspect" }>): number {
  const personal = (b: Body) => b === "sun" || b === "mercury" || b === "venus" || b === "mars";
  const mainType = e.type === "sextile" ? 0 : 4;
  const heart = e.a === "venus" || e.a === "mars" || e.b === "venus" || e.b === "mars" ? 2 : 0;
  const both = personal(e.a) && personal(e.b) ? 1 : 0;
  const giant = e.a === "jupiter" || e.a === "saturn" || e.b === "jupiter" || e.b === "saturn" ? 1 : 0;
  const dull = e.a === "sun" && (e.b === "mercury" || e.b === "venus") ? -3 : 0;
  return mainType + heart + both + giant + dull;
}
