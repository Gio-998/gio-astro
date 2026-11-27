/** Daily horoscope slugs per locale, derived from the shared route map (src/lib/i18n-routes.ts). */
import { SECTION_SLUGS, SIGN_SLUGS, SL_SIGN_SLUGS, ROUTE_LOCALES, sectionSlug, switchLocale, type AnyLocale } from "./i18n-routes";
import type { Sign } from "@/engine/zodiac";

export const HORO_SLUGS = {
  ...Object.fromEntries(ROUTE_LOCALES.map((l) => [l, { section: sectionSlug(l, "horoscope"), signs: SIGN_SLUGS[l] }])),
  sl: { section: sectionSlug("sl", "horoscope"), signs: SL_SIGN_SLUGS },
} as Record<AnyLocale, { section: string; signs: Record<Sign, string> }>;
export const HORO_SECTIONS = [...new Set(Object.values(SECTION_SLUGS.horoscope))] as string[];
/** Same page in another locale (kept for existing imports). */
export const localePath = (path: string, target: string) => switchLocale(path, target);
