import { describe, it, expect } from "vitest";
import { moonPhase } from "@/engine/daily";
import { dayBounds, skyDay, addDays } from "@/engine/skyday";
import { reading, HORO_LOCALES } from "@/lib/horoscope";
import { getContent } from "@/content";

describe("home Moon badge and daily Moon line agree", () => {
  it("both use the Moon at noon of the day, so the percentage is the same", () => {
    for (let i = 0; i < 60; i++) {
      const iso = addDays("2026-11-01", i);
      const badge = moonPhase(dayBounds(iso).noon); const sky = skyDay(iso, "aries").moon;
      expect([badge.illumination, badge.phase, badge.moonSign], iso).toEqual([sky.illumination, sky.phase, sky.sign]);
    }
  });
  it("25 Nov 2026: badge and daily copy show the same number, and both say when it was measured", () => {
    const pct = moonPhase(dayBounds("2026-11-25").noon).illumination;
    for (const lang of HORO_LOCALES) {
      const c = getContent(lang); const badge = c.sky.hero.tonight("X", "Y", pct); const line = reading(lang, "aries", "2026-11-25").moonLine;
      expect(line, lang).toContain(`${pct}`); expect(badge, lang).toContain(`${pct}`);
      const noon = { en: /noon/, mk: /напладне/, de: /Mittag/, sr: /u podne/ }[lang]!;
      expect(badge, lang).toMatch(noon); expect(line, lang).toMatch(noon);
    }
  });
});
