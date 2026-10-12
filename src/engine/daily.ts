import * as Astronomy from "astronomy-engine";
import { findAspect, longitude, Planet, Point, AspectType } from "./astro";
import { signFromLongitude, Sign } from "./zodiac";
import { reduce, personalYear } from "./numerology";
import type { Profile } from "./profile";

export type MoonPhase = "new" | "waxing-crescent" | "first-quarter" | "waxing-gibbous" | "full" | "waning-gibbous" | "last-quarter" | "waning-crescent";
const PHASES: MoonPhase[] = ["new", "waxing-crescent", "first-quarter", "waxing-gibbous", "full", "waning-gibbous", "last-quarter", "waning-crescent"];

export function moonPhase(date: Date): { phase: MoonPhase; angle: number; illumination: number; moonSign: Sign } {
  const angle = Astronomy.MoonPhase(date);
  const phase = PHASES[Math.floor(((angle + 22.5) % 360) / 45)];
  const illumination = Math.round(((1 - Math.cos((angle * Math.PI) / 180)) / 2) * 100);
  return { phase, angle, illumination, moonSign: signFromLongitude(longitude("moon", date)) };
}

export interface Transit { transiting: Planet; natal: Point; type: AspectType; orb: number; score: number }
const TRANSITING: Planet[] = ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto"];
const NATAL: Point[] = ["sun", "moon", "mercury", "venus", "mars", "asc"];
const TRANSIT_ORB: Partial<Record<Planet, number>> = { moon: 3, sun: 2, mercury: 2, venus: 2, mars: 2, jupiter: 1.5, saturn: 1.5, uranus: 1, neptune: 1, pluto: 1 };
const SLOW_WEIGHT: Partial<Record<Planet, number>> = { moon: 1, sun: 2, mercury: 2, venus: 2, mars: 2.5, jupiter: 3, saturn: 3.5, uranus: 3, neptune: 3, pluto: 3 };

export function transitsFor(profile: Profile, date: Date): Transit[] {
  const out: Transit[] = [];
  for (const t of TRANSITING) {
    const lt = longitude(t, date);
    for (const n of NATAL) {
      const pl = profile.chart.placements[n];
      if (!pl) continue;
      const a = findAspect(lt, pl.lon, t, n);
      const max = TRANSIT_ORB[t]!;
      if (a && a.orb <= max) out.push({ transiting: t, natal: n, type: a.type, orb: a.orb, score: (SLOW_WEIGHT[t]! * (1 - a.orb / max)) * (n === "sun" || n === "moon" || n === "asc" ? 1.3 : 1) });
    }
  }
  return out.sort((a, b) => b.score - a.score).slice(0, 4);
}

/** Small deterministic hash so "card of the day" / prompts are stable for a person+date. */
export function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

export interface Daily {
  date: string;
  moon: ReturnType<typeof moonPhase>;
  transits: Transit[];
  cardOfDay: number;
  promptIndex: number;
  personalDay: number;
  personalYear: number;
  sunSignToday: Sign;
}

export function dailyGuidance(profile: Profile, now: Date, promptCount: number): Daily {
  // The user's own calendar day (not the UTC day, which is "yesterday" before 02:00 in Warsaw).
  const iso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const key = `${profile.input.date}|${iso}`;
  const py = personalYear(profile.input.date, now.getFullYear());
  return {
    date: iso,
    moon: moonPhase(now),
    transits: transitsFor(profile, now),
    cardOfDay: hash(key + "card") % 22,
    promptIndex: hash(key + "prompt") % promptCount,
    personalDay: reduce(py + reduce(now.getMonth() + 1) + reduce(now.getDate()), false),
    personalYear: py,
    sunSignToday: signFromLongitude(longitude("sun", now)),
  };
}
