/**
 * Computes the sky of 2027 from the engine. Nothing here is typed in by hand: src/lib/sky2027.ts is the frozen output
 * (regenerate with `npx tsx scripts/gen-sky2027.ts`) and tests/sky2027.test.ts proves the two still match.
 * Server and test only: it pulls in astronomy-engine, while the data module stays light.
 */
import * as Astronomy from "astronomy-engine";
import { DateTime } from "luxon";
import { longitude, type Planet } from "@/engine/astro";
import { SKY_ZONE, BODIES, type Body } from "@/engine/skyday";
import { signFromLongitude, type Sign } from "@/engine/zodiac";
import type { SkyData, SkyEclipse, SkyEclipseView, SkyIngress, SkyMoon, SkySlowAspect, SkyStation } from "./sky2027-types";

const norm = (x: number) => ((x % 360) + 360) % 360;
const wrap = (x: number) => ((x + 540) % 360) - 180;
const zoned = (t: Date) => DateTime.fromJSDate(t, { zone: SKY_ZONE });
const iso = (t: Date) => zoned(t).toISODate()!;
const hm = (t: Date) => zoned(t).toFormat("HH:mm");
const at = (s: string) => DateTime.fromISO(s, { zone: SKY_ZONE }).toJSDate();
const deg = (lon: number) => Math.floor(norm(lon) % 30);
const HOUR = 36e5;

/** Same 24 hour central difference skyDay uses, so a station lands on the same calendar day as the daily horoscope. */
const speed = (b: Planet, t: number) => wrap(longitude(b, new Date(t + 12 * HOUR)) - longitude(b, new Date(t - 12 * HOUR)));
function bisect(lo: number, hi: number, same: (t: number) => boolean) {
  for (let i = 0; i < 32 && hi - lo > 500; i++) { const mid = (lo + hi) / 2; if (same(mid)) lo = mid; else hi = mid; }
  return new Date(hi);
}

/** Every sign change of a body between two instants, retrograde re-entries included. */
export function ingressesOf(b: Body, from: Date, to: Date, stepH = 6): SkyIngress[] {
  const out: SkyIngress[] = []; const step = stepH * HOUR;
  const signAt = (t: number) => signFromLongitude(longitude(b, new Date(t)));
  for (let t = from.getTime(); t < to.getTime(); t += step) {
    const a = signAt(t), z = signAt(t + step);
    if (a === z) continue;
    const when = bisect(t, t + step, (x) => signAt(x) === a);
    out.push({ body: b, sign: z, date: iso(when), time: hm(when), retro: speed(b, when.getTime()) < 0 });
  }
  return out;
}

/** Every station of a body between two instants. */
export function stationsOf(b: Body, from: Date, to: Date, stepH = 6): SkyStation[] {
  const out: SkyStation[] = []; const step = stepH * HOUR;
  for (let t = from.getTime(); t < to.getTime(); t += step) {
    const v0 = speed(b, t), v1 = speed(b, t + step);
    if (Math.sign(v0) === Math.sign(v1) || v0 === 0) continue;
    const when = bisect(t, t + step, (x) => Math.sign(speed(b, x)) === Math.sign(v0));
    const lon = longitude(b, when);
    out.push({ body: b, dir: v1 < 0 ? "retro" : "direct", date: iso(when), time: hm(when), sign: signFromLongitude(lon), deg: deg(lon) });
  }
  return out;
}

/** New and full moons between two instants, from the same search skyDay uses. */
export function moonsOf(from: Date, to: Date): SkyMoon[] {
  const out: SkyMoon[] = [];
  let q = Astronomy.SearchMoonQuarter(from);
  while (q.time.date < to) {
    if (q.quarter === 0 || q.quarter === 2) {
      const lon = longitude("moon", q.time.date);
      out.push({ kind: q.quarter === 0 ? "new" : "full", date: iso(q.time.date), time: hm(q.time.date), sign: signFromLongitude(lon), deg: deg(lon) });
    }
    q = Astronomy.NextMoonQuarter(q);
  }
  return out;
}

/** Solar and lunar eclipses between two instants, with their peak in local time and the Moon's place at peak. */
export function eclipsesOf(from: Date, to: Date): SkyEclipse[] {
  const out: SkyEclipse[] = [];
  const push = (kind: "solar" | "lunar", type: string, t: Date) => { const lon = longitude("moon", t); out.push({ kind, type: type as SkyEclipse["type"], date: iso(t), time: hm(t), sign: signFromLongitude(lon), deg: deg(lon) }); };
  for (let e = Astronomy.SearchGlobalSolarEclipse(from); e.peak.date < to; e = Astronomy.NextGlobalSolarEclipse(e.peak)) push("solar", e.kind, e.peak.date);
  for (let e = Astronomy.SearchLunarEclipse(from); e.peak.date < to; e = Astronomy.NextLunarEclipse(e.peak)) push("lunar", e.kind, e.peak.date);
  return out.sort((a, b) => a.date.localeCompare(b.date));
}

const PLACES: [string, number, number][] = [["Skopje", 41.9981, 21.4254], ["Belgrade", 44.8176, 20.4633], ["Berlin", 52.52, 13.405], ["Munich", 48.137, 11.575], ["Vienna", 48.2082, 16.3738], ["Zurich", 47.3769, 8.5417], ["London", 51.5074, -0.1278]];
/** How the eclipses look from the cities our readers live in: Moon or Sun height at peak, and the share of the Sun's disc covered. */
export function eclipseViewsOf(eclipses: SkyEclipse[], from: Date, to: Date): SkyEclipseView[] {
  const out: SkyEclipseView[] = [];
  for (const [place, lat, lon] of PLACES) {
    const o = new Astronomy.Observer(lat, lon, 0);
    for (let e = Astronomy.SearchLocalSolarEclipse(from, o); e.peak.time.date < to; e = Astronomy.NextLocalSolarEclipse(e.peak.time, o)) {
      out.push({ place, kind: "solar", date: iso(e.peak.time.date), time: hm(e.peak.time.date), alt: Math.round(e.peak.altitude), covered: Math.round((e.obscuration ?? 0) * 100) });
    }
    for (const x of eclipses.filter((c) => c.kind === "lunar")) {
      const t = at(`${x.date}T${x.time}`); const eq = Astronomy.Equator(Astronomy.Body.Moon, Astronomy.MakeTime(t), o, true, true);
      out.push({ place, kind: "lunar", date: x.date, time: x.time, alt: Math.round(Astronomy.Horizon(Astronomy.MakeTime(t), o, eq.ra, eq.dec, "normal").altitude) });
    }
  }
  return out.sort((a, b) => a.date.localeCompare(b.date) || a.place.localeCompare(b.place));
}

const SLOW: Body[] = ["jupiter", "saturn", "uranus", "neptune", "pluto"];
const SLOW_ANGLES: [number, SkySlowAspect["type"]][] = [[0, "conjunction"], [60, "sextile"], [90, "square"], [120, "trine"], [180, "opposition"], [240, "trine"], [270, "square"], [300, "sextile"]];
/** Exact aspects between the slow planets, each pass listed. */
export function slowAspectsOf(from: Date, to: Date): SkySlowAspect[] {
  const out: SkySlowAspect[] = []; const step = 24 * HOUR;
  for (let i = 0; i < SLOW.length; i++) for (let j = i + 1; j < SLOW.length; j++) {
    const a = SLOW[i], b = SLOW[j];
    for (const [ang, type] of SLOW_ANGLES) {
      const g = (t: number) => wrap(longitude(a, new Date(t)) - longitude(b, new Date(t)) - ang);
      for (let t = from.getTime(); t < to.getTime(); t += step) {
        const v0 = g(t), v1 = g(t + step);
        if (Math.sign(v0) === Math.sign(v1) || Math.abs(v0) > 10) continue;
        const when = bisect(t, t + step, (x) => Math.sign(g(x)) === Math.sign(v0));
        const la = longitude(a, when), lb = longitude(b, when);
        out.push({ a, b, type, date: iso(when), signA: signFromLongitude(la), signB: signFromLongitude(lb), degA: deg(la), degB: deg(lb) });
      }
    }
  }
  return out.sort((x, y) => x.date.localeCompare(y.date));
}

const placed = (b: Body, t: Date) => { const lon = longitude(b, t); return { body: b, sign: signFromLongitude(lon), deg: deg(lon), retro: b !== "sun" && speed(b, t.getTime()) < 0 }; };

/** Margins around the year, so a retrograde that spans New Year keeps both of its stations. */
const SPAN = { from: "2027-01-01", to: "2028-01-01", stationsFrom: "2026-10-01", stationsTo: "2028-04-01" };

export function computeSky2027(): SkyData {
  const from = at(SPAN.from), to = at(SPAN.to), sFrom = at(SPAN.stationsFrom), sTo = at(SPAN.stationsTo);
  const eclipses = eclipsesOf(from, to);
  return {
    zone: SKY_ZONE,
    start: BODIES.map((b) => placed(b, from)), end: BODIES.map((b) => placed(b, to)),
    ingresses: BODIES.flatMap((b) => ingressesOf(b, from, to)).sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)),
    stations: BODIES.filter((b) => b !== "sun").flatMap((b) => stationsOf(b, sFrom, sTo)).sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)),
    moons: moonsOf(from, to), eclipses, eclipseViews: eclipseViewsOf(eclipses, from, to), slowAspects: slowAspectsOf(from, to),
  };
}
