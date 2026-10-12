import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "fs";
import { join } from "path";
import { CHIRON_ELEMENTS } from "../src/engine/systems/chiron-elements";
import { chironLongitude } from "../src/engine/systems/chiron";
import { computeChart, sunSignForDate } from "../src/engine/astro";
import { chineseProfile, lunarNewYearDate } from "../src/engine/chinese";
import { feastDate } from "../src/engine/systems/feasts";
import { orthodoxEaster } from "../src/engine/systems/util";

// Any data table that stops in time must reach at least 5 years past today, and the app must work for 1900 to 2100.
const minEndYear = new Date().getFullYear() + 5;
const jdToYear = (jd: number) => 2000 + (jd - 2451545) / 365.25;

describe("date coverage", () => {
  it("Chiron element table covers 1900 to 2100 and well past today", () => {
    const end = jdToYear(CHIRON_ELEMENTS[CHIRON_ELEMENTS.length - 1][0]);
    expect(jdToYear(CHIRON_ELEMENTS[0][0])).toBeLessThanOrEqual(1900);
    expect(end).toBeGreaterThanOrEqual(Math.max(minEndYear, 2100.8));
  });

  it("no source file hardcodes a year list that ends within 5 years of today", () => {
    const files: string[] = [];
    const walk = (d: string) => readdirSync(d).forEach((f) => { const p = join(d, f); if (statSync(p).isDirectory()) walk(p); else if (/\.(ts|tsx)$/.test(p)) files.push(p); });
    walk(join(__dirname, "../src/engine"));
    for (const f of files) {
      // A table keyed by year looks like `2031: ...` or a run of `[2030, ...` rows.
      const years = [...readFileSync(f, "utf8").matchAll(/(?:^|[\s[{,])((?:19|20)\d\d)\s*[:,]/gm)].map((m) => +m[1]);
      if (years.length < 5) continue;
      expect(Math.max(...years), `${f} looks like a year table`).toBeGreaterThanOrEqual(minEndYear);
    }
  });

  it("computations work for sampled dates from 1900 to 2100", () => {
    for (let y = 1900; y <= 2100; y += 7) {
      const date = `${y}-06-15`;
      expect(sunSignForDate(date)).toBeTruthy();
      const chart = computeChart({ date, time: "12:00", lat: 41.99, lon: 21.43, tz: "Europe/Skopje" } as never);
      expect(chart).toBeTruthy();
      expect(chineseProfile(date, "12:00").animal).toBeTruthy();
      expect(lunarNewYearDate(y)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      const c = chironLongitude(new Date(Date.UTC(y, 5, 15)));
      expect(c).not.toBeNull();
      expect(c!).toBeGreaterThanOrEqual(0); expect(c!).toBeLessThan(360);
      expect(feastDate("velikden", y).m).toBeGreaterThanOrEqual(4);
    }
  });

  it("Orthodox Easter is right on both sides of 2100", () => {
    expect(orthodoxEaster(2026)).toEqual({ m: 4, d: 12 });
    expect(orthodoxEaster(2099)).toEqual({ m: 4, d: 12 });
    expect(orthodoxEaster(2100)).toEqual({ m: 5, d: 2 });
  });
});
