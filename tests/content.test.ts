import { describe, it, expect } from "vitest";
import { contents } from "../src/content";
import { buildProfile } from "../src/engine/profile";
import { comparePair, REL_TYPES } from "../src/engine/compat";
import { dailyGuidance } from "../src/engine/daily";
import { SIGNS } from "../src/engine/zodiac";
import { ANIMALS } from "../src/engine/chinese";
import { NAKSHATRAS } from "../src/engine/vedic";
import { MAJOR_ARCANA } from "../src/engine/tarot";

const flat = (o: unknown): string => (typeof o === "string" ? o : typeof o === "function" ? "" : o && typeof o === "object" ? Object.values(o).map(flat).join(" ") : "");

describe("content tables", () => {
  for (const [loc, c] of Object.entries(contents)) {
    const text = flat(c);
    it(`${loc}: no trademarks or doom words`, () => {
      for (const bad of [/\bMBTI\b/i, /Myers/i, /Briggs/i, /love language/i, /\bincompatible\b/i, /Enneagram/i]) expect(text, String(bad)).not.toMatch(bad);
    });
    it(`${loc}: every table is complete`, () => {
      for (const s of SIGNS) expect(c.astro.signs[s].sun.length).toBeGreaterThan(20);
      for (const a of ANIMALS) expect(c.chinese.animals[a].essence.length).toBeGreaterThan(20);
      for (const n of NAKSHATRAS) expect(c.vedic.nakshatras[n].name).toBeTruthy();
      for (const m of MAJOR_ARCANA) expect(c.nums.tarot[m].birth).toBeTruthy();
      for (const n of [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33]) expect(c.nums.numbers[n].lifePath).toBeTruthy();
      expect(Object.keys(c.psych.fourLetterStyles)).toHaveLength(16);
      expect(c.daily.prompts.length).toBeGreaterThanOrEqual(30);
    });
  }
});

describe("engine robustness sweep", () => {
  const places = [
    { name: "Tromsø", lat: 69.65, lon: 18.96, tz: "Europe/Oslo" }, { name: "Sydney", lat: -33.87, lon: 151.21, tz: "Australia/Sydney" },
    { name: "Quito", lat: -0.22, lon: -78.51, tz: "America/Guayaquil" }, null,
  ];
  const dates = ["1850-06-01", "1899-12-31", "1912-02-29", "1944-07-04", "1970-01-01", "1999-12-31", "2000-02-29", "2024-02-10", "2099-11-30"];
  const people = dates.flatMap((d, i) => [buildProfile({ date: d, time: i % 2 ? "03:15" : null, place: places[i % 4], name: i % 3 ? "Zoë Łaska-O'Brien" : undefined })]);
  it("builds profiles and daily guidance everywhere", () => {
    for (const p of people) {
      expect(p.sun).toBeTruthy();
      const d = dailyGuidance(p, new Date(Date.UTC(2026, 9, 11, 12)), 30);
      expect(d.personalDay).toBeGreaterThanOrEqual(1);
    }
  });
  it("compares every pair for every relationship type within 45–100", () => {
    for (const a of people) for (const b of people) if (a !== b) for (const rel of REL_TYPES) {
      const r = comparePair(a, b, rel);
      expect(r.resonance).toBeGreaterThanOrEqual(45); expect(r.resonance).toBeLessThanOrEqual(100);
      expect(Number.isFinite(r.spark)).toBe(true);
    }
  });
});
