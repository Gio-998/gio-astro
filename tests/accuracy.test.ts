/**
 * Accuracy audit (golden tests). Every reference value below comes from an independent, published source:
 *  - Planet longitudes: NASA/JPL Horizons (tests/fixtures/horizons.json, fetched by scripts/ref/fetch-horizons.mjs).
 *  - Birth charts: astrotheme.com (Swiss Ephemeris, birth data rated AA/A/B from Astro-Databank), fetched 12 Oct 2026.
 *  - Solar terms and Lunar New Year: Hong Kong Observatory tables (hko.gov.hk, "24 Solar Terms" / Gregorian-Lunar calendar).
 *  - Lahiri ayanamsa: Jagannatha Hora / Swiss Ephemeris table (jagannathhora.com/historical-lahiri-ayanamsa-values-tables).
 *  - Koota tables: onlinejyotish.com (Varna, Vashya, Tara, Graha Maitri, Gana) and saravali.github.io (Yoni 14x14).
 *  - Moon phases: US Naval Observatory phases of the Moon, 2024 (aa.usno.navy.mil).
 */
import { describe, it, expect } from "vitest";
import horizons from "./fixtures/horizons.json";
import { computeChart, longitude, Planet, Point } from "../src/engine/astro";
import { resolveBirthTime } from "../src/engine/time";
import { SIGNS } from "../src/engine/zodiac";
import { chineseProfile, lunarNewYearDate } from "../src/engine/chinese";
import { lahiriAyanamsa, vashyaOf, vashyaPoints, yoniPoints, maitriPoints, gunaMilan, vedicMoon } from "../src/engine/vedic";
import { lifePath, personalYear } from "../src/engine/numerology";
import { moonPhase, dailyGuidance } from "../src/engine/daily";
import { buildProfile } from "../src/engine/profile";
import { Solar, Lunar } from "lunar-javascript";

const diffDeg = (a: number, b: number) => { const x = Math.abs(a - b) % 360; return x > 180 ? 360 - x : x; };
const toLon = (sign: string, d: number, m: number) => SIGNS.indexOf(sign as never) * 30 + d + m / 60;

describe("planets vs NASA/JPL Horizons (30 instants, 1901-2056)", () => {
  const H = horizons as { instants: string[]; lon: Record<string, number[]> };
  for (const [p, arr] of Object.entries(H.lon)) {
    it(`${p} within 30″`, () => {
      arr.forEach((v, i) => expect(diffDeg(longitude(p as Planet, new Date(H.instants[i])), v) * 3600, `${p} @ ${H.instants[i]}`).toBeLessThan(30));
    });
  }
});

type Ref = { name: string; input: Parameters<typeof computeChart>[0]; offset: number; expect: Partial<Record<Point, [string, number, number]>> };
const charts: Ref[] = [
  {
    name: "Pope Francis, 17 Dec 1936 21:00, Buenos Aires (southern hemisphere, Argentine summer time UTC-3)",
    input: { date: "1936-12-17", time: "21:00", place: { name: "Buenos Aires", lat: -34.6, lon: -58.45, tz: "America/Argentina/Buenos_Aires" } }, offset: -180,
    expect: { sun: ["sagittarius", 25, 54], moon: ["aquarius", 12, 33], mercury: ["capricorn", 11, 49], venus: ["aquarius", 7, 36], mars: ["libra", 19, 31], asc: ["cancer", 10, 0], mc: ["taurus", 0, 4] },
  },
  {
    name: "Mick Jagger, 26 Jul 1943 02:30, Dartford (British Double Summer Time, UTC+2)",
    input: { date: "1943-07-26", time: "02:30", place: { name: "Dartford", lat: 51.45, lon: 0.2167, tz: "Europe/London" } }, offset: 120,
    expect: { sun: ["leo", 2, 10], moon: ["taurus", 23, 58], mercury: ["leo", 10, 55], venus: ["virgo", 13, 34], mars: ["taurus", 12, 12], asc: ["gemini", 13, 6], mc: ["aquarius", 8, 9] },
  },
  {
    name: "Jimi Hendrix, 27 Nov 1942 10:15, Seattle (US War Time, UTC-7 in winter)",
    input: { date: "1942-11-27", time: "10:15", place: { name: "Seattle", lat: 47.6064, lon: -122.3319, tz: "America/Los_Angeles" } }, offset: -420,
    expect: { sun: ["sagittarius", 4, 50], moon: ["cancer", 28, 5], mercury: ["sagittarius", 2, 57], venus: ["sagittarius", 7, 36], mars: ["scorpio", 17, 31], asc: ["sagittarius", 24, 41], mc: ["libra", 24, 12] },
  },
  {
    name: "Lorde, 7 Nov 1996 10:00, Takapuna NZ (southern hemisphere DST, UTC+13)",
    input: { date: "1996-11-07", time: "10:00", place: { name: "Takapuna", lat: -36.7833, lon: 174.7667, tz: "Pacific/Auckland" } }, offset: 780,
    expect: { sun: ["scorpio", 14, 44], moon: ["virgo", 23, 36], mercury: ["scorpio", 17, 42], venus: ["libra", 10, 9], mars: ["virgo", 4, 9], asc: ["capricorn", 13, 17], mc: ["virgo", 25, 47] },
  },
  {
    name: "Kylie Minogue, 28 May 1968 11:00, Melbourne (southern hemisphere, AEST)",
    input: { date: "1968-05-28", time: "11:00", place: { name: "Melbourne", lat: -37.8167, lon: 144.9667, tz: "Australia/Melbourne" } }, offset: 600,
    expect: { sun: ["gemini", 6, 46], moon: ["gemini", 14, 43], mercury: ["gemini", 28, 49], venus: ["gemini", 0, 24], mars: ["gemini", 13, 33], asc: ["cancer", 26, 22], mc: ["taurus", 18, 4] },
  },
  {
    name: "Nicole Kidman, 20 Jun 1967 15:15, Honolulu (HST, UTC-10)",
    input: { date: "1967-06-20", time: "15:15", place: { name: "Honolulu", lat: 21.3069, lon: -157.8583, tz: "Pacific/Honolulu" } }, offset: -600,
    expect: { sun: ["gemini", 29, 0], moon: ["sagittarius", 13, 43], venus: ["leo", 14, 23], mars: ["libra", 18, 50], asc: ["scorpio", 6, 20], mc: ["leo", 7, 3] },
  },
];

describe("natal charts vs astrotheme.com (Swiss Ephemeris) incl. southern hemisphere and DST edge cases", () => {
  for (const r of charts) {
    it(r.name, () => {
      const c = computeChart(r.input);
      expect(Math.round(c.time.offsetMinutes)).toBe(r.offset);
      for (const [p, [sign, d, m]] of Object.entries(r.expect)) {
        const got = c.placements[p as Point]!;
        expect(got.sign, `${p} sign`).toBe(sign);
        const tol = p === "asc" || p === "mc" ? 6 / 60 : p === "moon" ? 3 / 60 : 2 / 60;
        expect(diffDeg(got.lon, toLon(sign, d, m)), `${p} longitude`).toBeLessThan(tol);
      }
    });
  }
  it("whole-sign houses count from the rising sign", () => {
    const c = computeChart(charts[4].input); // Cancer rising
    expect(c.placements.asc!.house).toBe(1);
    expect(c.placements.sun!.house).toBe(12); // Gemini
    expect(c.placements.jupiter!.house).toBe(2); // Leo
  });
});

describe("time-zone history", () => {
  const warsaw = { name: "Warsaw", lat: 52.23, lon: 21.01, tz: "Europe/Warsaw" };
  it("flags a clock time that never existed (spring-forward gap)", () => {
    const t = resolveBirthTime({ date: "2021-03-28", time: "02:30", place: warsaw });
    expect(t.tzNote).toBe("gap");
  });
  it("flags a clock time that happened twice and uses the first (summer-time) occurrence", () => {
    const t = resolveBirthTime({ date: "2021-10-31", time: "02:30", place: warsaw });
    expect(t.tzNote).toBe("ambiguous");
    expect(t.offsetMinutes).toBe(120);
  });
  it("normal times carry no note", () => expect(resolveBirthTime({ date: "2021-07-01", time: "12:00", place: warsaw }).tzNote).toBeNull());
  it("Poland 1977 had summer time from April (UTC+2)", () => expect(resolveBirthTime({ date: "1977-06-01", time: "12:00", place: warsaw }).offsetMinutes).toBe(120));
  it("uses the birthplace's own mean time while a zone was still on LMT (not the reference city's)", () => {
    // Europe/Moscow was on Moscow mean time (+2:30:17) in 1890; Kazan (49.1°E) had its own mean time, +3:16.
    const t = resolveBirthTime({ date: "1890-05-01", time: "12:00", place: { name: "Kazan", lat: 55.79, lon: 49.12, tz: "Europe/Moscow" } });
    expect(t.offsetSource).toBe("local-mean-time");
    expect(t.offsetMinutes).toBeCloseTo(196.5, 0);
  });
  it("keeps legal mean times that really were on the clocks after LMT ended (Istanbul 1905)", () => {
    const t = resolveBirthTime({ date: "1905-05-01", time: "12:00", place: { name: "Ankara", lat: 39.93, lon: 32.86, tz: "Europe/Istanbul" } });
    expect(t.offsetSource).toBe("tzdb");
  });
});

describe("Chinese calendar: solar terms, Lunar New Year, four pillars", () => {
  it("Li Chun / Jing Zhe instants match the Hong Kong Observatory (China time)", () => {
    const t24 = Lunar.fromYmd(2024, 1, 1) as unknown as { getJieQiTable(): Record<string, { toYmdHms(): string }> };
    expect(t24.getJieQiTable()["立春"].toYmdHms().slice(0, 16)).toBe("2024-02-04 16:27"); // HKO: 4 Feb 2024 16:27
    expect(t24.getJieQiTable()["惊蛰"].toYmdHms().slice(0, 16)).toBe("2024-03-05 10:22"); // HKO: 10:23 (rounded)
  });
  it("Lunar New Year dates match HKO", () => {
    expect(lunarNewYearDate(1985)).toBe("1985-02-20");
    expect(lunarNewYearDate(2023)).toBe("2023-01-22");
    expect(lunarNewYearDate(2024)).toBe("2024-02-10");
    expect(lunarNewYearDate(2026)).toBe("2026-02-17");
  });
  it("day pillar of 1 Jan 2000 is 戊午", () => expect(chineseProfile("2000-01-01", "12:00").pillars.split(" ")[2]).toBe("戊午"));
  it("year/month pillars switch at the exact Li Chun instant, wherever you were born", () => {
    // Warsaw 4 Feb 2024 12:00 CET = 11:00 UT = 19:00 China time: after Li Chun (16:27), so Jia Chen year, Bing Yin month.
    const w = chineseProfile("2024-02-04", "12:00", { utc: new Date(Date.UTC(2024, 1, 4, 11, 0)), lon: 21.01, lat: 52.23 });
    expect(w.pillars.split(" ").slice(0, 2)).toEqual(["甲辰", "丙寅"]);
    expect(w.animalLiChun).toBe("dragon");
    // New York 4 Feb 2024 02:00 EST = 07:00 UT = 15:00 China time: before Li Chun.
    const ny = chineseProfile("2024-02-04", "02:00", { utc: new Date(Date.UTC(2024, 1, 4, 7, 0)), lon: -74, lat: 40.7 });
    expect(ny.pillars.split(" ").slice(0, 2)).toEqual(["癸卯", "乙丑"]);
  });
  it("hour pillar uses true solar time (Madrid 14:00 CEST is about 11:41 solar: Horse hour, not Goat)", () => {
    const m = chineseProfile("2024-07-01", "14:00", { utc: new Date(Date.UTC(2024, 6, 1, 12, 0)), lon: -3.7, lat: 40.4 });
    expect(m.hourBasis).toBe("true-solar");
    expect(m.solarTime).toBe("11:41");
    expect(m.pillars.split(" ")[3][1]).toBe("午");
  });
  it("flags an unknown-time birth on a solar-term day", () => {
    expect(chineseProfile("2024-02-04", null).monthAmbiguous).toBe(true);
    expect(chineseProfile("2024-02-10", null).monthAmbiguous).toBe(false);
  });
  it("buildProfile passes the birth instant through", () => {
    const p = buildProfile({ date: "2024-02-04", time: "12:00", place: { name: "Warsaw", lat: 52.23, lon: 21.01, tz: "Europe/Warsaw" } });
    expect(p.chinese.animalLiChun).toBe("dragon");
    expect(p.chinese.animal).toBe("rabbit"); // Lunar New Year was 10 Feb 2024
  });
  it("Solar sanity: lunar-javascript reads the same day as the Gregorian input", () => expect(Solar.fromYmd(2024, 2, 10).getLunar().getMonth()).toBe(1));
});

describe("Vedic: Lahiri ayanamsa and Ashtakoota tables", () => {
  const JH: [number, string][] = [[1900, "22 27 55"], [1950, "23 09 28"], [1980, "23 34 32"], [2000, "23 51 12"], [2010, "24 00 05"], [2020, "24 07 55"], [2024, "24 11 27"], [2025, "24 12 23"], [2026, "24 13 19"]];
  for (const [y, v] of JH) it(`Lahiri 1 Jan ${y} = ${v.replace(/ /g, ":")} (±2″)`, () => {
    const [d, m, s] = v.split(" ").map(Number);
    expect(Math.abs(lahiriAyanamsa(new Date(Date.UTC(y, 0, 1))) - (d + m / 60 + s / 3600)) * 3600).toBeLessThan(2);
  });
  it("Vashya splits Sagittarius and Capricorn at 15°", () => {
    expect(vashyaOf(240 + 10)).toBe("manava");
    expect(vashyaOf(240 + 20)).toBe("chatushpada");
    expect(vashyaOf(270 + 10)).toBe("chatushpada");
    expect(vashyaOf(270 + 20)).toBe("jalachara");
    expect(vashyaOf(300 + 5)).toBe("manava"); // Aquarius
  });
  it("classical directional tables (bride row × groom column)", () => {
    expect(vashyaPoints("manava", "jalachara")).toBe(0.5);
    expect(vashyaPoints("vanachara", "jalachara")).toBe(1);
    expect(vashyaPoints("keeta", "manava")).toBe(0);
    expect(yoniPoints("horse", "buffalo")).toBe(0); // sworn enemies
    expect(yoniPoints("cat", "rat")).toBe(0);
    expect(yoniPoints("horse", "serpent")).toBe(3);
    expect(yoniPoints("elephant", "lion")).toBe(0);
    expect(yoniPoints("tiger", "cow")).toBe(0);
    expect(maitriPoints("moon", "mercury")).toBe(1); // friend/enemy
    expect(maitriPoints("mars", "venus")).toBe(3); // neutral/neutral
    expect(maitriPoints("mars", "mercury")).toBe(0.5); // enemy/neutral
    expect(maitriPoints("sun", "saturn")).toBe(0);
  });
  it("Gana Deva with Rakshasa averages 0 and 1 (= 0.5), Nadi same = 0, totals stay in 0..36", () => {
    const base = { date: "1990-01-01", time: "12:00", place: { name: "Delhi", lat: 28.61, lon: 77.21, tz: "Asia/Kolkata" } };
    for (let i = 0; i < 40; i++) {
      const a = vedicMoon(computeChart({ ...base, date: `19${70 + (i % 30)}-0${1 + (i % 9)}-1${i % 10}` }));
      const b = vedicMoon(computeChart({ ...base, date: `19${60 + ((i * 7) % 40)}-0${1 + ((i * 3) % 9)}-2${(i * 3) % 9}` }));
      const g = gunaMilan(a, b), g2 = gunaMilan(b, a);
      expect(g.total).toBeGreaterThanOrEqual(0); expect(g.total).toBeLessThanOrEqual(36);
      expect(g.total).toBeCloseTo(g2.total, 6); // same score whichever way round
      const gana = g.kootas.find((k) => k.id === "gana")!.points;
      if ((a.gana === "deva" && b.gana === "rakshasa") || (a.gana === "rakshasa" && b.gana === "deva")) expect(gana).toBe(0.5);
      if (a.nadi === b.nadi) expect(g.kootas.find((k) => k.id === "nadi")!.points).toBe(0);
    }
  });
});

describe("numerology master numbers", () => {
  it("29 Nov 1987: 11 + 11 + 7 = 29 → 11 (master kept)", () => expect(lifePath("1987-11-29").value).toBe(11));
  it("22 Dec 1993: 3 + 22 (day kept) + 22 (1993 → 22) = 47 → 11", () => expect(lifePath("1993-12-22").value).toBe(11));
  it("a year reducing to 22 stays 22 before the final sum: 4 Apr 1984 → 4 + 4 + 22 = 30 → 3", () => expect(lifePath("1984-04-04").value).toBe(3));
  it("total of 33 is kept: 11 Nov 2009 → 11 + 11 + 11 = 33", () => expect(lifePath("2009-11-11").value).toBe(33));
  it("total of 22 is kept: 11 Sep 2000 → 9 + 11 + 2 = 22; 4 Aug 1990 → 8 + 4 + 1 = 13 → 4", () => { expect(lifePath("2000-09-11").value).toBe(22); expect(lifePath("1990-08-04").value).toBe(4); });
  it("personal year reduces fully (no masters)", () => expect(personalYear("1990-07-15", 2026)).toBe(5));
});

describe("moon phase vs USNO 2024", () => {
  const at = (s: string) => moonPhase(new Date(s));
  it("new moon 8 Apr 2024 18:21 UT", () => { const m = at("2024-04-08T18:21:00Z"); expect(m.phase).toBe("new"); expect(m.illumination).toBe(0); });
  it("first quarter 15 Apr 2024 19:13 UT", () => { const m = at("2024-04-15T19:13:00Z"); expect(m.phase).toBe("first-quarter"); expect(Math.abs(m.angle - 90)).toBeLessThan(0.2); });
  it("full moon 23 Apr 2024 23:49 UT", () => { const m = at("2024-04-23T23:49:00Z"); expect(m.phase).toBe("full"); expect(Math.abs(m.angle - 180)).toBeLessThan(0.2); });
  it("last quarter 1 May 2024 11:27 UT", () => { const m = at("2024-05-01T11:27:00Z"); expect(m.phase).toBe("last-quarter"); expect(Math.abs(m.angle - 270)).toBeLessThan(0.2); });
});

describe("daily guidance uses the user's local calendar day", () => {
  it("date key is local, not UTC", () => {
    const p = buildProfile({ date: "1990-07-15", time: null });
    const local = new Date(2026, 9, 12, 0, 30); // 00:30 local time on 12 Oct
    expect(dailyGuidance(p, local, 10).date).toBe("2026-10-12");
  });
});
