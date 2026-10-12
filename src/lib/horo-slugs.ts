/** URL slugs of the public daily horoscope per locale (tiny, safe for client bundles). */
import type { Sign } from "@/engine/zodiac";

export const HORO_SLUGS = {
  en: { section: "horoscope", signs: { aries: "aries", taurus: "taurus", gemini: "gemini", cancer: "cancer", leo: "leo", virgo: "virgo", libra: "libra", scorpio: "scorpio", sagittarius: "sagittarius", capricorn: "capricorn", aquarius: "aquarius", pisces: "pisces" } },
  mk: { section: "dneven-horoskop", signs: { aries: "oven", taurus: "bik", gemini: "blizanci", cancer: "rak", leo: "lav", virgo: "devica", libra: "vaga", scorpio: "skorpija", sagittarius: "strelec", capricorn: "jarec", aquarius: "vodolija", pisces: "ribi" } },
} satisfies Record<string, { section: string; signs: Record<Sign, string> }>;
export const HORO_SECTIONS = Object.values(HORO_SLUGS).map((x) => x.section);

/** Same page in another locale: swaps the /en|/mk prefix and, inside the daily horoscope, the section and sign slugs. */
export function localePath(path: string, target: string): string {
  const m = path.match(/^\/(en|mk)(\/.*)?$/);
  if (!m) return path;
  const from = HORO_SLUGS[m[1] as keyof typeof HORO_SLUGS]; const to = HORO_SLUGS[target as keyof typeof HORO_SLUGS];
  const rest = m[2] ?? "";
  const parts = rest.split("/");
  if (to && parts[1] === from.section) {
    parts[1] = to.section;
    const sign = (Object.keys(from.signs) as Sign[]).find((s) => from.signs[s] === parts[2]);
    if (sign) parts[2] = to.signs[sign];
  }
  return `/${target}${parts.join("/")}`;
}
