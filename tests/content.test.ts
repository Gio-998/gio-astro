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

describe("Macedonian coverage", () => {
  const MODULES = ["astro", "chinese", "nums", "psych", "vedic", "quizzes", "compat", "daily", "site", "landing", "book", "lensInfo", "lensUi", "ui"] as const;
  // Strings that legitimately stay the same in both languages (codes, brand, citations, glyphs).
  const SAME_OK = /^(Mirrorstar|[A-Z]{2,4}|[A-Z]{4}|.{0,3})$|ipip|Mini-IPIP|MS1|^[\W\d\s]+$/;
  const leaves = (o: unknown, path: string, out: [string, string][]) => {
    if (typeof o === "string") out.push([path, o]);
    else if (Array.isArray(o)) o.forEach((v, i) => leaves(v, `${path}[${i}]`, out));
    else if (o && typeof o === "object") for (const [k, v] of Object.entries(o)) leaves(v, `${path}.${k}`, out);
    return out;
  };
  for (const m of MODULES) {
    it(`mk.${m}: every English string has a Macedonian translation`, () => {
      const en = leaves(contents.en[m], m, []); const mk = new Map(leaves(contents.mk[m], m, []));
      const untranslated = en.filter(([p, s]) => mk.get(p) === s && /[a-z]{3,} [a-z]{2,}/i.test(s) && !SAME_OK.test(s)).map(([p]) => p);
      expect(untranslated).toEqual([]);
    });
  }
  it("mk text uses Cyrillic, not look-alike Latin letters inside words", () => {
    const all = MODULES.flatMap((m) => leaves(contents.mk[m], m, []));
    const mixed = all.filter(([, s]) => /[а-шѓќљњџѕј][a-z]|[a-z][а-шѓќљњџѕј]/i.test(s)).map(([p]) => p);
    expect(mixed).toEqual([]);
  });
  it("UI functions produce Macedonian text", () => {
    expect(contents.mk.ui.profile.sunIn("Вага")).toBe("Сонце во Вага");
    expect(contents.mk.compat.pairCopy.convergence(3, "x")).toContain("леќи");
  });
});
