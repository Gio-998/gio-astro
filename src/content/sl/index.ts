/** Slovenian test locale (see src/lib/partial-scope.ts): only what the daily and monthly horoscope pages and the slim header read. Anything else falls back to English through deepMerge in ../index.ts. */
import type { Sign } from "@/engine/zodiac";

const NAMES: Record<Sign, string> = { aries: "Oven", taurus: "Bik", gemini: "Dvojčka", cancer: "Rak", leo: "Lev", virgo: "Devica", libra: "Tehtnica", scorpio: "Škorpijon", sagittarius: "Strelec", capricorn: "Kozorog", aquarius: "Vodnar", pisces: "Ribi" };

export const sl = {
  astro: { signs: Object.fromEntries(Object.entries(NAMES).map(([k, name]) => [k, { name }])) },
  site: {
    brand: "Horoscop",
    months: ["januar", "februar", "marec", "april", "maj", "junij", "julij", "avgust", "september", "oktober", "november", "december"],
    language: "Jezik",
    languages: { en: "English", mk: "Македонски", de: "Deutsch", sr: "Srpski", sl: "Slovenščina" },
  },
};
