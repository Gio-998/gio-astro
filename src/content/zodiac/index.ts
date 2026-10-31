import type { Sign } from "@/engine/zodiac";
import { en } from "./en";
import { mk } from "./mk";
import { de } from "./de";
import { sr } from "./sr";
import type { ZodiacLang } from "./types";

export * from "./types";
/** Zodiac sign profiles per language. Each sign is a separate file under ./<lang>/, so no page shares a skeleton. */
export const ZODIAC: Record<string, ZodiacLang> = { en, mk, de, sr };
/** Bump when this family's copy changes. */
export const ZODIAC_DATE = "2026-10-31";

/**
 * Traditional pairings, the same in every language: `best` is the two signs of the same element plus one friendly sextile, `hardest` the two square signs.
 * tests/zodiac-overlap.test.ts checks the distances against the engine.
 */
export const ZODIAC_MATCHES: Record<Sign, { best: [Sign, Sign, Sign]; hardest: [Sign, Sign] }> = {
  aries: { best: ["leo", "sagittarius", "gemini"], hardest: ["cancer", "capricorn"] },
  taurus: { best: ["virgo", "capricorn", "cancer"], hardest: ["leo", "aquarius"] },
  gemini: { best: ["libra", "aquarius", "aries"], hardest: ["virgo", "pisces"] },
  cancer: { best: ["scorpio", "pisces", "taurus"], hardest: ["aries", "libra"] },
  leo: { best: ["aries", "sagittarius", "libra"], hardest: ["taurus", "scorpio"] },
  virgo: { best: ["taurus", "capricorn", "scorpio"], hardest: ["gemini", "sagittarius"] },
  libra: { best: ["gemini", "aquarius", "leo"], hardest: ["cancer", "capricorn"] },
  scorpio: { best: ["cancer", "pisces", "virgo"], hardest: ["leo", "aquarius"] },
  sagittarius: { best: ["aries", "leo", "aquarius"], hardest: ["virgo", "pisces"] },
  capricorn: { best: ["taurus", "virgo", "pisces"], hardest: ["aries", "libra"] },
  aquarius: { best: ["gemini", "libra", "sagittarius"], hardest: ["taurus", "scorpio"] },
  pisces: { best: ["cancer", "scorpio", "capricorn"], hardest: ["gemini", "sagittarius"] },
};
