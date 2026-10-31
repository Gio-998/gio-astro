/**
 * International SEO helpers. Every page gets: a self-referencing canonical for its locale, hreflang alternates for
 * every locale plus x-default (→ default locale), localized OG tags with og:locale. To add a locale, add it to
 * LOCALES in src/content/index.ts and a row here.
 */
import type { Metadata } from "next";
import { LOCALES, DEFAULT_LOCALE } from "@/content";
import { SITE_URL } from "./site-url";
import { localizedPath, routeAlternates } from "./i18n-routes";

export const LOCALE_META: Record<(typeof LOCALES)[number], { hreflang: string; og: string; name: string }> = {
  en: { hreflang: "en", og: "en_US", name: "English" },
  mk: { hreflang: "mk", og: "mk_MK", name: "Македонски" },
  de: { hreflang: "de", og: "de_DE", name: "Deutsch" },
};
/** Private beta flag (accounts are invite-only while on). */
export const betaOn = process.env.NEXT_PUBLIC_BETA !== "0";
/** Pages anyone can read during the beta: indexable now. Gated app pages become indexable when the beta ends. */
export const PUBLIC_PATHS = ["/", "/learn/", "/how-it-works/", "/quizzes/", "/promise/", "/privacy/", "/terms/", "/credits/", "/blog/"];
/** Public content sections (blog articles): always indexable. /daily/ is a visitor feature that overlaps the horoscope pages, so it stays out of the index. */
export const PUBLIC_PREFIXES = ["/blog/"];
/** Gated during beta, public tools afterwards. */
export const TOOL_PATHS = ["/start/", "/match/", "/bond/"];
/** Indexable routes right now (used by the sitemap and robots meta). */
export function isIndexable(path: string): boolean {
  if (PUBLIC_PATHS.includes(path) || PUBLIC_PREFIXES.some((p) => path.startsWith(p))) return true;
  if (betaOn) return false;
  return TOOL_PATHS.includes(path) || path.startsWith("/quiz/");
}

/** `path` is the locale-less route, starting and ending with "/" (e.g. "/", "/match/", "/quiz/big-five/"). */
export function languageAlternates(path: string): Record<string, string> {
  const r = routeAlternates(path); const out: Record<string, string> = {};
  for (const l of LOCALES) out[LOCALE_META[l].hreflang] = r[l];
  out["x-default"] = localizedPath(DEFAULT_LOCALE, path);
  return out;
}
/** Lean default share image per locale (public/og/default/<lang>.jpg, built by scripts/build-og-defaults.py). */
export const defaultOgImage = (lang: string) => ({ url: `${SITE_URL}/og/default/${(LOCALES as readonly string[]).includes(lang) ? lang : DEFAULT_LOCALE}.jpg`, width: 1200, height: 630 });
export function localizedMeta(lang: string, path: string, m: { title?: string; description?: string; siteName: string }): Metadata {
  const l = (LOCALES as readonly string[]).includes(lang) ? (lang as (typeof LOCALES)[number]) : DEFAULT_LOCALE;
  return {
    // Private pages pass their own robots via pageMeta(extra), which wins over this default.
    robots: isIndexable(path) ? { index: true, follow: true } : { index: false, follow: true },
    alternates: { canonical: localizedPath(l, path), languages: languageAlternates(path) },
    openGraph: {
      siteName: m.siteName, type: "website", url: `${SITE_URL}${localizedPath(l, path)}`, locale: LOCALE_META[l].og,
      alternateLocale: LOCALES.filter((x) => x !== l).map((x) => LOCALE_META[x].og),
      images: [defaultOgImage(l)],
      ...(m.title ? { title: m.title } : {}), ...(m.description ? { description: m.description } : {}),
    },
    twitter: { card: "summary_large_image", images: [defaultOgImage(l).url], ...(m.title ? { title: m.title } : {}), ...(m.description ? { description: m.description } : {}) },
  };
}
