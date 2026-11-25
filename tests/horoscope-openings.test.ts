import { describe, it, expect } from "vitest";
import { reading, spread, VARIETY, HORO_LOCALES } from "@/lib/horoscope";
import { addDays } from "@/engine/skyday";
import { SIGNS } from "@/engine/zodiac";

const first = (t: string) => t.split(/(?<=[.!?])\s+/)[0].trim();

describe("daily openings are unique across the 12 signs", () => {
  it("every language has at least 12 headlines", () => {
    for (const lang of HORO_LOCALES) expect(VARIETY[lang].headline.length, lang).toBeGreaterThanOrEqual(12);
  });
  it("the 12 signs land on 12 different headline lines every day", () => {
    for (const lang of HORO_LOCALES) {
      const n = VARIETY[lang].headline.length;
      for (let i = 0; i < 2 * 366; i++) {
        const iso = addDays("2026-01-01", i);
        expect(new Set(SIGNS.map((s) => spread(n, iso, s))).size, `${lang} ${iso}`).toBe(12);
      }
    }
  });
  it("headline and first overview sentence never match between two signs on the same day (2 years, 4 languages)", async () => {
    for (const lang of HORO_LOCALES) for (let i = 0; i < 2 * 366; i++) {
      if (i % 30 === 0) await new Promise((go) => setImmediate(go)); // keep vitest's worker heartbeat alive
      const iso = addDays("2026-01-01", i);
      const days = SIGNS.map((s) => reading(lang, s, iso));
      const heads = days.map((r) => r.headline);
      expect(new Set(heads).size, `${lang} ${iso}: ${heads.join(" | ")}`).toBe(12);
      const opens = days.map((r) => first(r.overview));
      expect(new Set(opens).size, `${lang} ${iso}: ${opens.join(" | ")}`).toBe(12);
      if (i > 0) for (const s of SIGNS) expect(reading(lang, s, addDays(iso, -1)).headline, `${lang} ${s} ${iso}`).not.toBe(days[SIGNS.indexOf(s)].headline);
    }
  }, 600_000);
  it("25 Nov 2026 no longer gives Aries, Libra and Sagittarius the same opening", () => {
    for (const lang of HORO_LOCALES) {
      const h = (["aries", "libra", "sagittarius", "gemini", "pisces"] as const).map((s) => reading(lang, s, "2026-11-25").headline);
      expect(new Set(h).size, lang).toBe(5);
    }
  });
});
