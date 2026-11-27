/**
 * Locales that are live as a small test, not as a full translation. They have their own folder under src/app/<locale>/,
 * are not in LOCALES or ROUTE_LOCALES, and only the routes listed here exist in them. Light and safe for client bundles.
 */
export const PARTIAL_LOCALES = ["sl"] as const;
export type PartialLocale = (typeof PARTIAL_LOCALES)[number];
export const isPartialLocale = (l: string): l is PartialLocale => (PARTIAL_LOCALES as readonly string[]).includes(l);

/** Routes (locale-less internal paths) that exist in a partial locale and are linked with hreflang from the other languages. */
const SIGN_IDS = "aries|taurus|gemini|cancer|leo|virgo|libra|scorpio|sagittarius|capricorn|aquarius|pisces";
const SCOPE = new RegExp(`^/(horoscope|monthly-horoscope)/(?:(?:${SIGN_IDS})/)?$`);
/** True when `path` has a page in `locale`. The partial locale's own home is not included: it has no counterpart in the other languages. */
export const inPartialScope = (locale: string, path: string) => isPartialLocale(locale) && SCOPE.test(path);
/** Every route a partial locale serves, home included. */
export const partialPaths = (): string[] => ["/", ...["horoscope", "monthly-horoscope"].flatMap((s) => [`/${s}/`, ...SIGN_IDS.split("|").map((x) => `/${s}/${x}/`)])];
