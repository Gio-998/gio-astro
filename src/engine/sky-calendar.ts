/**
 * Computed data behind the public moon calendar and Mercury retrograde pages. Nothing here is typed by hand: every date
 * comes from astronomy-engine through the same functions the daily horoscope uses, on the Skopje clock (same as Berlin).
 * tests/sky-calendar.test.ts recomputes all of it another way, through skyDay() and raw longitudes.
 */
import * as Astronomy from "astronomy-engine";
import { DateTime } from "luxon";
import { longitude, type Planet } from "./astro";
import { moonPhase, type MoonPhase } from "./daily";
import { addDays, dayBounds, SKY_ZONE } from "./skyday";
import { signFromLongitude, type Sign } from "./zodiac";

export type Quarter = "new" | "first-quarter" | "full" | "last-quarter";
export const QUARTERS: Quarter[] = ["new", "first-quarter", "full", "last-quarter"];
/** Phase angle of each quarter, for drawing it with moonPath. */
export const QUARTER_ANGLE: Record<Quarter, number> = { new: 0, "first-quarter": 90, full: 180, "last-quarter": 270 };
export type Eclipse = "solar-total" | "solar-annular" | "solar-partial" | "lunar-total" | "lunar-partial" | "lunar-penumbral";

/** A moment on the Skopje clock. */
export interface Moment { at: string; iso: string; time: string }
export const moment = (t: Date): Moment => { const d = DateTime.fromJSDate(t, { zone: SKY_ZONE }); return { at: t.toISOString(), iso: d.toISODate()!, time: d.toFormat("HH:mm") }; };

export interface Lunation extends Moment { quarter: Quarter; sign: Sign; degree: number; eclipse?: Eclipse }
/** `sign` holds at midnight, `noon` at midday (the Moon sign the daily horoscope uses). */
export interface MoonDay { iso: string; sign: Sign; noon: Sign; moves?: { to: Sign; time: string }; phase: MoonPhase; angle: number; illumination: number; lunation?: Lunation }

const HOUR = 36e5, DAY = 864e5;
const yearBounds = (year: number) =>({ start: dayBounds(`${year}-01-01`).start, end: dayBounds(`${year + 1}-01-01`).start });
const monthEnd = (ym: string) => DateTime.fromISO(`${ym}-01`, { zone: SKY_ZONE }).plus({ months: 1 }).toJSDate();

const eclipseMemo = new Map<number, { t: number; type: Eclipse }[]>();
/** Solar and lunar eclipses that peak in a calendar year. */
function eclipses(year: number): { t: number; type: Eclipse }[] {
  const hit = eclipseMemo.get(year); if (hit) return hit;
  const { start, end } = yearBounds(year); const out: { t: number; type: Eclipse }[] = [];
  for (let e = Astronomy.SearchLunarEclipse(start); e.peak.date < end; e = Astronomy.NextLunarEclipse(e.peak)) out.push({ t: e.peak.date.getTime(), type: `lunar-${e.kind}` as Eclipse });
  for (let e = Astronomy.SearchGlobalSolarEclipse(start); e.peak.date < end; e = Astronomy.NextGlobalSolarEclipse(e.peak)) out.push({ t: e.peak.date.getTime(), type: `solar-${e.kind}` as Eclipse });
  eclipseMemo.set(year, out); return out;
}

const lunationMemo = new Map<string, Lunation[]>();
/** Every lunar quarter between two instants, in order. */
export function lunationsBetween(start: Date, end: Date): Lunation[] {
  const key = `${start.getTime()}|${end.getTime()}`; const hit = lunationMemo.get(key); if (hit) return hit;
  const out: Lunation[] = [];
  for (let q = Astronomy.SearchMoonQuarter(start); q.time.date < end; q = Astronomy.NextMoonQuarter(q)) {
    const t = q.time.date; const lon = longitude("moon", t); const quarter = QUARTERS[q.quarter]; const m = moment(t);
    const body = quarter === "new" ? "solar" : quarter === "full" ? "lunar" : null;
    const near = body ? eclipses(Number(m.iso.slice(0, 4))).find((e) => Math.abs(e.t - t.getTime()) < DAY && e.type.startsWith(body)) : undefined;
    out.push({ ...m, quarter, sign: signFromLongitude(lon), degree: Math.floor(lon % 30), ...(near ? { eclipse: near.type } : {}) });
  }
  lunationMemo.set(key, out); return out;
}
/** Lunar quarters of a local calendar month, "2026-11". */
export const monthLunations = (ym: string): Lunation[] => lunationsBetween(dayBounds(`${ym}-01`).start, monthEnd(ym));
export function yearLunations(year: number): Lunation[] { const { start, end } = yearBounds(year); return lunationsBetween(start, end); }
/** The next `n` lunar quarters after an instant. */
export const nextLunations = (from: Date, n: number): Lunation[] => lunationsBetween(from, new Date(from.getTime() + (n + 1) * 8 * DAY)).slice(0, n);
/** The new moon that closes the cycle opened by `l`. */
export const nextNewMoon = (l: Lunation): Lunation => nextLunations(new Date(Date.parse(l.at) + 6e4), 4).find((x) => x.quarter === "new")!;

/** First moment in [lo, hi] where `past` is true, assuming it stays true after that. */
function bisect(lo: number, hi: number, past: (t: number) => boolean): number {
  for (let k = 0; k < 40 && hi - lo > 1; k++) { const mid = (lo + hi) / 2; if (past(mid)) hi = mid; else lo = mid; }
  return hi;
}
const signOf = (p: Planet, t: number) => signFromLongitude(longitude(p, new Date(t)));

/** One local day of the Moon. */
export function moonDay(iso: string): Omit<MoonDay, "lunation"> {
  const { start, noon, end } = dayBounds(iso); const a = start.getTime(), b = end.getTime(); const sign = signOf("moon", a), later = signOf("moon", b);
  const moves = later === sign ? undefined : { to: later, time: moment(new Date(bisect(a, b, (t) => signOf("moon", t) !== sign))).time };
  const m = moonPhase(noon);
  return { iso, sign, noon: m.moonSign, moves, phase: m.phase, angle: m.angle, illumination: m.illumination };
}
/** A day with no exact quarter: the four named moments belong to their own day, so anything else is one of the four spans between them. */
export const spanPhase = (angle: number): MoonPhase => (angle < 90 ? "waxing-crescent" : angle < 180 ? "waxing-gibbous" : angle < 270 ? "waning-gibbous" : "waning-crescent");
export function monthDays(ym: string): MoonDay[] {
  const L = monthLunations(ym); const out: MoonDay[] = [];
  for (let d = `${ym}-01`; d.startsWith(ym); d = addDays(d, 1)) out.push({ ...moonDay(d), lunation: L.find((l) => l.iso === d) });
  return out;
}
/** The moment the Sun changes sign inside a local calendar month. */
export function sunIngress(ym: string): Moment & { to: Sign } {
  const a = dayBounds(`${ym}-01`).start.getTime(), b = monthEnd(ym).getTime(); const from = signOf("sun", a);
  const t = bisect(a, b, (x) => signOf("sun", x) !== from);
  return { ...moment(new Date(t)), to: signOf("sun", t) };
}

export interface MercuryPeriod {
  /** Pre-shadow start: Mercury first reaches the degree where it will later station direct. */
  shadowStart: Moment;
  /** Station retrograde and station direct, with Mercury's sign and degree there. */
  retro: Moment & { sign: Sign; degree: number };
  direct: Moment & { sign: Sign; degree: number };
  /** Post-shadow end: Mercury passes the degree of the retrograde station again. */
  shadowEnd: Moment;
  /** Signs in the order the planet moves through them while retrograde. */
  signs: Sign[];
  /** Sign changes between the two stations. */
  ingresses: (Moment & { to: Sign })[];
}

const wrap =(d: number) => ((d + 540) % 360) - 180;
/** Mercury's daily motion in degrees: negative while it appears to move backwards. Same measure as skyDay. */
const mercurySpeed = (t: number) => wrap(longitude("mercury", new Date(t + DAY / 2)) - longitude("mercury", new Date(t - DAY / 2)));
const station = (t: number) => { const lon = longitude("mercury", new Date(t)); return { ...moment(new Date(t)), sign: signFromLongitude(lon), degree: Math.floor(lon % 30) }; };

const periodMemo = new Map<string, MercuryPeriod[]>();
/** Every retrograde period that both starts and ends between two instants, with shadow dates computed from the station degrees. */
function periodsBetween(from: Date, to: Date): MercuryPeriod[] {
  const key = `${from.getTime()}|${to.getTime()}`; const hit = periodMemo.get(key); if (hit) return hit;
  const stations: { t: number; retro: boolean }[] = [];
  for (let t = from.getTime(); t < to.getTime(); t += DAY) {
    const a = mercurySpeed(t), b = mercurySpeed(t + DAY);
    if (Math.sign(a) !== Math.sign(b)) stations.push({ t: bisect(t, t + DAY, (x) => Math.sign(mercurySpeed(x)) === Math.sign(b)), retro: b < 0 });
  }
  const out: MercuryPeriod[] = [];
  stations.forEach((s, i) => {
    const d = stations[i + 1]; if (!s.retro || !d) return;
    const lonR = longitude("mercury", new Date(s.t)), lonD = longitude("mercury", new Date(d.t));
    const shadowStart = bisect(s.t - 40 * DAY, s.t, (t) => wrap(longitude("mercury", new Date(t)) - lonD) >= 0);
    const shadowEnd = bisect(d.t, d.t + 40 * DAY, (t) => wrap(longitude("mercury", new Date(t)) - lonR) >= 0);
    const ingresses: MercuryPeriod["ingresses"] = []; const signs: Sign[] = [signFromLongitude(lonR)];
    for (let t = s.t; t < d.t; t += HOUR) {
      const a = signOf("mercury", t), b = signOf("mercury", Math.min(t + HOUR, d.t));
      if (a !== b) { ingresses.push({ ...moment(new Date(bisect(t, t + HOUR, (x) => signOf("mercury", x) === b))), to: b }); signs.push(b); }
    }
    out.push({ shadowStart: moment(new Date(shadowStart)), retro: station(s.t), direct: station(d.t), shadowEnd: moment(new Date(shadowEnd)), signs, ingresses });
  });
  periodMemo.set(key, out); return out;
}
/** Periods that touch a calendar year, counting their shadow, so a page never hides one that starts or ends across New Year. */
export function mercuryYear(year: number): MercuryPeriod[] {
  const { start, end } = yearBounds(year);
  return periodsBetween(new Date(start.getTime() - 80 * DAY), new Date(end.getTime() + 80 * DAY)).filter((p) => p.shadowEnd.iso >= `${year}-01-01` && p.shadowStart.iso <= `${year}-12-31`);
}
/** Periods from the one in progress on, at most `n`. */
export function mercuryNext(now: Date, n: number): MercuryPeriod[] {
  const t = now.getTime(); const day = DateTime.fromJSDate(now, { zone: SKY_ZONE }).startOf("day").toMillis();
  return periodsBetween(new Date(day - 120 * DAY), new Date(day + (n + 1) * 130 * DAY)).filter((p) => Date.parse(p.shadowEnd.at) > t).slice(0, n);
}

export type MercuryState = { state: "retrograde" | "pre-shadow" | "post-shadow" | "clear"; period: MercuryPeriod; since: string };
/** Where Mercury stands at an instant, the period that answer belongs to (in "clear" the next one) and the local day the answer last changed. */
export function mercuryNow(now: Date): MercuryState {
  const t = now.toISOString(); const period = mercuryNext(now, 1)[0];
  if (t < period.shadowStart.at) {
    const day = DateTime.fromJSDate(now, { zone: SKY_ZONE }).startOf("day").toMillis();
    const last = periodsBetween(new Date(day - 120 * DAY), new Date(day + 130 * DAY)).filter((p) => p.shadowEnd.at <= t).at(-1);
    return { state: "clear", period, since: last?.shadowEnd.iso ?? period.shadowStart.iso };
  }
  if (t < period.retro.at) return { state: "pre-shadow", period, since: period.shadowStart.iso };
  if (t < period.direct.at) return { state: "retrograde", period, since: period.retro.iso };
  return { state: "post-shadow", period, since: period.direct.iso };
}
