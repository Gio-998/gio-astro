import { describe, it, expect } from "vitest";
import { computeChart, Point } from "../src/engine/astro";
import { SIGNS } from "../src/engine/zodiac";

/**
 * Reference values: astrotheme.com celebrity charts (Swiss-Ephemeris based, data rating AA from
 * birth records), fetched 11 Oct 2026. Positions are tropical, geocentric, in sign degrees/minutes.
 */
type Ref = { name: string; input: Parameters<typeof computeChart>[0]; expect: Partial<Record<Point, [string, number, number]>> };

const refs: Ref[] = [
  {
    name: "Albert Einstein — 14 Mar 1879, 11:30 local mean time, Ulm (48°24′N 9°59′E)",
    input: { date: "1879-03-14", time: "11:30", place: { name: "Ulm", lat: 48.4, lon: 9.9833, tz: "Europe/Berlin" } },
    expect: {
      sun: ["pisces", 23, 30], moon: ["sagittarius", 14, 32], asc: ["cancer", 11, 38], mc: ["pisces", 12, 50],
      mercury: ["aries", 3, 9], venus: ["aries", 16, 59], mars: ["capricorn", 26, 55], jupiter: ["aquarius", 27, 29],
      saturn: ["aries", 4, 11], neptune: ["taurus", 7, 52], pluto: ["taurus", 24, 44],
    },
  },
  {
    name: "Queen Elizabeth II — 21 Apr 1926, 02:40 BST, Mayfair, London (51°31′N 0°09′W)",
    input: { date: "1926-04-21", time: "02:40", place: { name: "London", lat: 51.5167, lon: -0.15, tz: "Europe/London" } },
    expect: {
      sun: ["taurus", 0, 12], moon: ["leo", 12, 7], asc: ["capricorn", 21, 24], mc: ["scorpio", 25, 34],
      mercury: ["aries", 4, 40], venus: ["pisces", 13, 57], mars: ["aquarius", 20, 52], jupiter: ["aquarius", 22, 31],
      uranus: ["pisces", 27, 21], pluto: ["cancer", 12, 42],
    },
  },
  {
    name: "Barack Obama — 4 Aug 1961, 19:24 HST, Honolulu (21°18′N 157°52′W)",
    input: { date: "1961-08-04", time: "19:24", place: { name: "Honolulu", lat: 21.3, lon: -157.8667, tz: "Pacific/Honolulu" } },
    expect: {
      sun: ["leo", 12, 33], moon: ["gemini", 3, 21], asc: ["aquarius", 18, 3], mc: ["scorpio", 28, 53],
      mercury: ["leo", 2, 20], venus: ["cancer", 1, 47], mars: ["virgo", 22, 35], uranus: ["leo", 25, 16],
      neptune: ["scorpio", 8, 36], pluto: ["virgo", 6, 59],
    },
  },
];

const toLon = (sign: string, d: number, m: number) => SIGNS.indexOf(sign as never) * 30 + d + m / 60;
const diff = (a: number, b: number) => { const x = Math.abs(a - b) % 360; return x > 180 ? 360 - x : x; };

describe("natal chart vs. reference charts", () => {
  for (const r of refs) {
    it(r.name, () => {
      const c = computeChart(r.input);
      for (const [p, [sign, d, m]] of Object.entries(r.expect)) {
        const got = c.placements[p as Point]!;
        expect(got.sign, `${p} sign`).toBe(sign);
        // Tolerances: planets 3′ (Moon 5′), angles 10′ (sensitive to exact coordinates/time rounding)
        const tol = p === "asc" || p === "mc" ? 10 / 60 : p === "moon" ? 5 / 60 : 3 / 60;
        expect(diff(got.lon, toLon(sign, d, m)), `${p} longitude`).toBeLessThan(tol);
      }
    });
  }

  it("uses local mean time for 19th-century births", () => {
    const c = computeChart(refs[0].input);
    expect(c.time.offsetSource).toBe("local-mean-time");
    expect(c.time.offsetMinutes).toBeCloseTo(39.93, 1);
  });

  it("applies historical DST (UK 1926 = BST, UTC+1)", () => {
    const c = computeChart(refs[1].input);
    expect(c.time.offsetMinutes).toBe(60);
  });

  it("drops the Ascendant when time is unknown and flags Moon ambiguity", () => {
    const c = computeChart({ ...refs[2].input, time: null });
    expect(c.placements.asc).toBeUndefined();
    expect(c.hasAngles).toBe(false);
    expect(c.moonAlternatives.length).toBeGreaterThanOrEqual(1);
  });
});
