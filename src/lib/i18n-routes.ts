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
export const ROUTE_LOCALES = ["en", "mk", "de", "sr"] as const;
export type RouteLocale = (typeof ROUTE_LOCALES)[number];
export const X_DEFAULT: RouteLocale = "en";

/** First path segment: internal folder name → public slug per locale. */
export const SECTION_SLUGS: Record<string, Partial<Record<RouteLocale, string>>> = {
  pricing: { en: "pricing", mk: "ceni", de: "preise", sr: "cene" },
  horoscope: { en: "horoscope", mk: "dneven-horoskop", de: "tageshoroskop", sr: "dnevni-horoskop" },
  numerology: { en: "numerology", mk: "numerologija", de: "numerologie", sr: "numerologija" },
  zodiac: { en: "zodiac-signs", mk: "horoskopski-znaci", de: "sternzeichen", sr: "horoskopski-znakovi" },
  "weekly-horoscope": { en: "weekly-horoscope", mk: "nedelen-horoskop", de: "wochenhoroskop", sr: "nedeljni-horoskop" },
  "monthly-horoscope": { en: "monthly-horoscope", mk: "mesecen-horoskop", de: "monatshoroskop", sr: "mesecni-horoskop" },
  "horoscope-2027": { en: "horoscope-2027", mk: "horoskop-2027", de: "jahreshoroskop-2027", sr: "horoskop-2027" },
  "sign-compatibility": { en: "zodiac-compatibility", mk: "kompatibilnost-na-znaci", de: "partnerhoroskop", sr: "kompatibilnost-znakova" },
  "rising-sign": { en: "rising-sign-calculator", mk: "ascendent-kalkulator", de: "aszendent-berechnen", sr: "podznak-kalkulator" },
  "moon-sign": { en: "moon-sign-calculator", mk: "mesecev-znak-kalkulator", de: "mondzeichen-berechnen", sr: "mesecev-znak-kalkulator" },
  "birth-chart": { en: "birth-chart-calculator", mk: "natalna-karta-kalkulator", de: "geburtshoroskop-berechnen", sr: "natalna-karta-kalkulator" },
  "moon-calendar": { en: "moon-calendar", mk: "mesecev-kalendar", de: "mondkalender", sr: "mesecev-kalendar" },
  "mercury-retrograde": { en: "mercury-retrograde", mk: "retrograden-merkur", de: "merkur-ruecklaeufig", sr: "retrogradni-merkur" },
};
/** Second (and calculator third) segment inside /numerology/. Numbers stay digits; pairs use a localized joiner. */
export const NUM_SLUGS: Record<string, Partial<Record<RouteLocale, string>>> = {
  "angel-numbers": { mk: "angelski-broevi", de: "engelszahlen", sr: "andjeoski-brojevi" },
  "life-path": { mk: "pateka-na-zivotot", de: "lebenszahl", sr: "zivotni-put" },
  "master-numbers": { mk: "master-broevi", de: "meisterzahlen", sr: "master-brojevi" },
  "personal-year": { mk: "licna-godina", de: "persoenliches-jahr", sr: "licna-godina" },
  "personal-day": { mk: "licen-den", de: "persoenlicher-tag", sr: "licni-dan" },
  "expression-number": { mk: "broj-na-izrazot", de: "ausdruckszahl", sr: "broj-izraza" },
  "soul-urge-number": { mk: "broj-na-dusata", de: "seelenzahl", sr: "broj-duse" },
  "personality-number": { mk: "broj-na-licnosta", de: "persoenlichkeitszahl", sr: "broj-licnosti" },
  "birthday-number": { mk: "broj-na-rodendenot", de: "geburtstagszahl", sr: "broj-rodjendana" },
  "maturity-number": { mk: "broj-na-zrelosta", de: "reifezahl", sr: "broj-zrelosti" },
  "karmic-debt": { mk: "karmicki-dolg", de: "karmische-schuld", sr: "karmicki-dug" },
  compatibility: { mk: "kompatibilnost", de: "kompatibilitaet", sr: "kompatibilnost" },
  calculator: { mk: "kalkulator", de: "rechner", sr: "kalkulator" },
  "mirror-hours": { mk: "ogledalni-casovi", de: "spiegelzahlen", sr: "ogledalni-sati" },
  "personal-year-2027": { mk: "licna-godina-2027", de: "persoenliches-jahr-2027", sr: "licna-godina-2027" },
  name: { mk: "ime", de: "name", sr: "ime" },
};
const PAIR_JOIN: Record<RouteLocale, string> = { en: "and", mk: "i", de: "und", sr: "i" };
const numSlug = (l: RouteLocale, k: string) => NUM_SLUGS[k]?.[l] ?? k;
const numKey = (l: RouteLocale, slug: string) => Object.keys(NUM_SLUGS).find((k) => numSlug(l, k) === slug);
/** Second segment inside sections that list zodiac signs. */
export const SIGN_SLUGS: Record<RouteLocale, Record<Sign, string>> = {
  en: { aries: "aries", taurus: "taurus", gemini: "gemini", cancer: "cancer", leo: "leo", virgo: "virgo", libra: "libra", scorpio: "scorpio", sagittarius: "sagittarius", capricorn: "capricorn", aquarius: "aquarius", pisces: "pisces" },
  mk: { aries: "oven", taurus: "bik", gemini: "blizanci", cancer: "rak", leo: "lav", virgo: "devica", libra: "vaga", scorpio: "skorpija", sagittarius: "strelec", capricorn: "jarec", aquarius: "vodolija", pisces: "ribi" },
  de: { aries: "widder", taurus: "stier", gemini: "zwillinge", cancer: "krebs", leo: "loewe", virgo: "jungfrau", libra: "waage", scorpio: "skorpion", sagittarius: "schuetze", capricorn: "steinbock", aquarius: "wassermann", pisces: "fische" },
  sr: { aries: "ovan", taurus: "bik", gemini: "blizanci", cancer: "rak", leo: "lav", virgo: "devica", libra: "vaga", scorpio: "skorpija", sagittarius: "strelac", capricorn: "jarac", aquarius: "vodolija", pisces: "ribe" },
};
const SIGN_SECTIONS = new Set(["horoscope", "zodiac", "weekly-horoscope", "monthly-horoscope", "horoscope-2027"]);
const isSign = (s: string): s is Sign => s in SIGN_SLUGS.en;
const isRouteLocale = (l: string): l is RouteLocale => (ROUTE_LOCALES as readonly string[]).includes(l);

export const sectionSlug = (locale: string, section: string) => (isRouteLocale(locale) ? SECTION_SLUGS[section]?.[locale] : undefined) ?? section;
/** Does `locale` serve the folder `owner` has for this section? Two locales can share a slug (mk and sr both use numerologija), so a route folder asks this rather than comparing with one owner. */
export const servesFolder = (locale: string, section: string, owner: string) => locale === owner || (isRouteLocale(locale) && sectionSlug(locale, section) === sectionSlug(owner, section));

/** Internal route path ("/pricing/") → public URL for a locale ("/mk/ceni/"). */
export function localizedPath(locale: string, path: string): string {
  const l = isRouteLocale(locale) ? locale : X_DEFAULT;
  const parts = path.split("/"); // ["", section, sub, ..., ""]
  const section = parts[1];
  if (section && SECTION_SLUGS[section]) {
    parts[1] = sectionSlug(l, section);
    if (SIGN_SECTIONS.has(section) && parts[2] && parts[2] in SIGN_SLUGS.en) parts[2] = SIGN_SLUGS[l][parts[2] as Sign];
    if (section === "sign-compatibility" && parts[2]) { const [a, b] = parts[2].split("-and-"); if (a && b && isSign(a) && isSign(b)) parts[2] = `${SIGN_SLUGS[l][a]}-${PAIR_JOIN[l]}-${SIGN_SLUGS[l][b]}`; }
    if (section === "numerology") for (let i = 2; i < parts.length; i++) {
      if (NUM_SLUGS[parts[i]]) parts[i] = numSlug(l, parts[i]);
      else if (/^\d+-and-\d+$/.test(parts[i])) parts[i] = parts[i].replace("-and-", `-${PAIR_JOIN[l]}-`);
    }
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
    const signOf = (slug: string) => (Object.keys(SIGN_SLUGS[l]) as Sign[]).find((x) => SIGN_SLUGS[l][x] === slug);
    if (SIGN_SECTIONS.has(section)) { const s = signOf(parts[2]); if (s) parts[2] = s; }
    if (section === "sign-compatibility" && parts[2]) { const [a, b] = parts[2].split(`-${PAIR_JOIN[l]}-`).map(signOf); if (a && b) parts[2] = `${a}-and-${b}`; }
    if (section === "numerology") for (let i = 2; i < parts.length; i++) {
      const k = numKey(l, parts[i]); if (k) parts[i] = k;
      else if (new RegExp(`^\\d+-${PAIR_JOIN[l]}-\\d+$`).test(parts[i])) parts[i] = parts[i].replace(`-${PAIR_JOIN[l]}-`, "-and-");
    }
  }
  return [l, parts.join("/")];
}

/** A path inside a locale that is safe to send a visitor to after sign-in or checkout. */
export const isLocalPath = (p: string) => new RegExp(`^/(${ROUTE_LOCALES.join("|")})/[\\w\\-/]*$`).test(p);

/**
 * Pages a locale does not have yet, though the route still renders because the footer links it. These keep their text inside the page file, in en, mk and de,
 * so /sr/privacy/ shows English. That is not a Serbian page: no sr hreflang, no sitemap row, noindex. Delete a path here once its Serbian text lands.
 */
const NOT_WRITTEN: Partial<Record<RouteLocale, readonly string[]>> = { sr: ["/privacy/", "/terms/", "/promise/", "/learn/"] };
export const hasPage = (locale: string, path: string) => !NOT_WRITTEN[locale as RouteLocale]?.includes(path);

/** hreflang map (locale → public URL, plus x-default) for an internal route path. Lists only the locales that have the page. */
export function routeAlternates(path: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const l of ROUTE_LOCALES) if (hasPage(l, path)) out[l] = localizedPath(l, path);
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
