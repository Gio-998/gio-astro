/**
 * Single source of truth for localized URL slugs (tiny, safe for client bundles).
 *
 * Every page has one canonical, locale-less "route path" written with the internal (English) folder names,
 * e.g. "/pricing/", "/horoscope/scorpio/2026-10-13/", "/blog/my-post/". `localizedPath(locale, path)` turns it into
 * the public URL for a locale (/mk/ceni/, /mk/dneven-horoskop/skorpija/2026-10-13/), and `routeAlternates(path)` gives
 * the hreflang map. Links, the language switch, hreflang tags and the sitemap all go through these two functions.
 *
 * To localize another section: add it to SECTION_SLUGS (internal folder → slug per locale) and add the matching
 * route folder for each locale (see I18N.md). Locales missing from a row fall back to the internal name.
 */
import type { Sign } from "@/engine/zodiac";

/** Keep in sync with LOCALES in src/content (asserted in tests/i18n-routes.test.ts). */
export const ROUTE_LOCALES = ["en", "mk"] as const;
export type RouteLocale = (typeof ROUTE_LOCALES)[number];
export const X_DEFAULT: RouteLocale = "en";

/** First path segment: internal folder name → public slug per locale. */
export const SECTION_SLUGS: Record<string, Partial<Record<RouteLocale, string>>> = {
  pricing: { en: "pricing", mk: "ceni" },
  horoscope: { en: "horoscope", mk: "dneven-horoskop" },
};
/** Second segment inside sections that list zodiac signs. */
export const SIGN_SLUGS: Record<RouteLocale, Record<Sign, string>> = {
  en: { aries: "aries", taurus: "taurus", gemini: "gemini", cancer: "cancer", leo: "leo", virgo: "virgo", libra: "libra", scorpio: "scorpio", sagittarius: "sagittarius", capricorn: "capricorn", aquarius: "aquarius", pisces: "pisces" },
  mk: { aries: "oven", taurus: "bik", gemini: "blizanci", cancer: "rak", leo: "lav", virgo: "devica", libra: "vaga", scorpio: "skorpija", sagittarius: "strelec", capricorn: "jarec", aquarius: "vodolija", pisces: "ribi" },
};
const SIGN_SECTIONS = new Set(["horoscope"]);
const isRouteLocale = (l: string): l is RouteLocale => (ROUTE_LOCALES as readonly string[]).includes(l);

export const sectionSlug = (locale: string, section: string) => (isRouteLocale(locale) ? SECTION_SLUGS[section]?.[locale] : undefined) ?? section;

/** Internal route path ("/pricing/") → public URL for a locale ("/mk/ceni/"). */
export function localizedPath(locale: string, path: string): string {
  const l = isRouteLocale(locale) ? locale : X_DEFAULT;
  const parts = path.split("/"); // ["", section, sub, ..., ""]
  const section = parts[1];
  if (section && SECTION_SLUGS[section]) {
    parts[1] = sectionSlug(l, section);
    if (SIGN_SECTIONS.has(section) && parts[2] && parts[2] in SIGN_SLUGS.en) parts[2] = SIGN_SLUGS[l][parts[2] as Sign];
  }
  return `/${l}${parts.join("/")}`;
}

/** Public URL ("/mk/ceni/") → [locale, internal route path] or null if it is not under a locale. */
export function parsePath(url: string): [RouteLocale, string] | null {
  const m = url.match(/^\/([a-z]{2})(\/.*)?$/);
  if (!m || !isRouteLocale(m[1])) return null;
  const l = m[1]; const parts = (m[2] ?? "/").split("/");
  const section = Object.keys(SECTION_SLUGS).find((k) => sectionSlug(l, k) === parts[1]);
  if (section) {
    parts[1] = section;
    if (SIGN_SECTIONS.has(section)) { const s = (Object.keys(SIGN_SLUGS[l]) as Sign[]).find((x) => SIGN_SLUGS[l][x] === parts[2]); if (s) parts[2] = s; }
  }
  return [l, parts.join("/")];
}

/** hreflang map (locale → public URL, plus x-default) for an internal route path. */
export function routeAlternates(path: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const l of ROUTE_LOCALES) out[l] = localizedPath(l, path);
  out["x-default"] = localizedPath(X_DEFAULT, path);
  return out;
}

/** Same page in another locale (language switch). */
export function switchLocale(url: string, target: string): string {
  const p = parsePath(url);
  return p ? localizedPath(target, p[1]) : url;
}

/** Public URLs that use another locale's slug (e.g. /mk/pricing/, /en/ceni/) → the correct URL. Used to check vercel.json redirects. */
export function wrongLocaleRedirects(): { source: string; destination: string }[] {
  const out: { source: string; destination: string }[] = [];
  for (const [section, row] of Object.entries(SECTION_SLUGS)) for (const l of ROUTE_LOCALES) for (const other of ROUTE_LOCALES) {
    const wrong = row[other] ?? section; const right = sectionSlug(l, section);
    if (wrong !== right) out.push({ source: `/${l}/${wrong}/`, destination: `/${l}/${right}/` });
  }
  return out;
}
