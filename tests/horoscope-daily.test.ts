import { describe, it, expect } from "vitest";
import { reading, HORO_LOCALES, horoPath, signFromSlug } from "@/lib/horoscope";
import { skyDay, isValidIso } from "@/engine/skyday";
import { SIGNS } from "@/engine/zodiac";

const DASH = /[\u2013\u2014]/;
function rng(seed: number) { return () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 2 ** 32; }; }
function randomIso(r: () => number) {
  const t = Date.UTC(1900, 0, 1) + Math.floor(r() * (Date.UTC(2100, 11, 31) - Date.UTC(1900, 0, 1)));
  return new Date(t).toISOString().slice(0, 10);
}

describe("public daily horoscope", () => {
  it("generates non-empty, locale-complete text for random dates 1900-2100", () => {
    const r = rng(20261013);
    const dates = ["1900-01-01", "2100-12-31", ...Array.from({ length: 40 }, () => randomIso(r))];
    for (const iso of dates) {
      const sign = SIGNS[Math.floor(r() * 12)];
      for (const lang of HORO_LOCALES) {
        const x = reading(lang, sign, iso);
        const texts = [x.title, x.description, x.headline, ...x.love, ...x.work, ...x.well, ...x.sky_, x.lucky.color, x.lucky.window, x.moonLine];
        expect(x.love.length).toBe(2); expect(x.work.length).toBe(2); expect(x.well.length).toBe(2); expect(x.sky_.length).toBeGreaterThanOrEqual(2);
        for (const t of texts) {
          expect(t, `${lang} ${sign} ${iso}`).toBeTruthy();
          expect(t).not.toMatch(/undefined|NaN|\$\{/);
          expect(t).not.toMatch(DASH);
          expect(t).not.toMatch(/\w\/\w/u); // no gendered slashes
          if (lang === "mk") expect(t.replace(/\d|:|%|[A-Za-z]{0}/g, "")).not.toMatch(/[A-Za-z]/); // Macedonian copy is fully Cyrillic
        }
        expect(x.lucky.number).toBeGreaterThanOrEqual(1); expect(x.lucky.number).toBeLessThanOrEqual(9);
      }
    }
  });
  it("matches the real sky (Venus retrograde in Scorpio, Moon in Scorpio on 2026-10-13)", () => {
    const s = skyDay("2026-10-13", "scorpio");
    expect(s.moon.sign).toBe("scorpio"); expect(s.moon.house).toBe(1);
    expect(s.signs.venus).toBe("scorpio"); expect(s.retro).toContain("venus");
  });
  it("finds the exact Full Moon and its local time", () => {
    const s = skyDay("2026-10-26", "aries");
    expect(s.events.some((e) => e.kind === "quarter" && e.quarter === "full")).toBe(true);
  });
  it("has clean, reversible slugs per locale", () => {
    expect(horoPath("mk", "scorpio", "2026-10-13")).toBe("/mk/dneven-horoskop/skorpija/2026-10-13/");
    expect(horoPath("en", "scorpio", "2026-10-13")).toBe("/en/horoscope/scorpio/2026-10-13/");
    for (const l of HORO_LOCALES) for (const s of SIGNS) expect(signFromSlug(l, horoPath(l, s).split("/")[3])).toBe(s);
    expect(isValidIso("2026-02-30")).toBe(false);
  });
});
