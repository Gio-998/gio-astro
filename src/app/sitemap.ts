import type { MetadataRoute } from "next";
import { LOCALES } from "@/content";
import { SITE_URL } from "@/lib/site-url";
export const dynamic = "force-static";
import { QUIZ_IDS } from "@/lib/quiz-defs";
import { languageAlternates, isIndexable } from "@/lib/seo";
import { SIGNS } from "@/engine/zodiac";
import { BLOG_SLUGS } from "@/content/blog";
import { HORO_LOCALES, horoPath, horoAlternates } from "@/lib/horoscope";
import { publishedDates } from "@/engine/skyday";
import type { Sign } from "@/engine/zodiac";
// Indexable routes (locale-less). Personal pages (profile, people, today, account) are left out on purpose.
const PUBLIC = ["/", "/start/", "/match/", "/bond/", "/quizzes/", "/deep/", "/play/", "/you/", "/partners/", ...QUIZ_IDS.map((q) => `/quiz/${q}/`), "/learn/", "/how-it-works/", "/promise/", "/privacy/", "/terms/", "/credits/", "/daily/", ...SIGNS.map((s) => `/daily/${s}/`), "/blog/", ...BLOG_SLUGS.map((s) => `/blog/${s}/`)];
// Daily horoscope: each locale has its own slugs, so alternates come from horoAlternates, not languageAlternates.
function horoscopeEntries(): MetadataRoute.Sitemap {
  const abs = (o: Record<string, string>) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, `${SITE_URL}${v}`]));
  const keys: [Sign | undefined, string | undefined][] = [[undefined, undefined], ...SIGNS.map((s): [Sign, undefined] => [s, undefined]), ...SIGNS.flatMap((s) => publishedDates().map((d): [Sign, string] => [s, d]))];
  return HORO_LOCALES.flatMap((l) => keys.map(([s, d]) => ({ url: `${SITE_URL}${horoPath(l, s, d)}`, changeFrequency: (d ? "yearly" : "daily") as "yearly" | "daily", priority: d ? 0.5 : 0.7, ...(d ? { lastModified: d } : {}), alternates: { languages: abs(horoAlternates(s, d)) } })));
}
export default function sitemap(): MetadataRoute.Sitemap {
  // One <url> per locale, each listing every language version (xhtml:link hreflang) + x-default.
  return [...horoscopeEntries(), ...LOCALES.flatMap((l) => PUBLIC.filter(isIndexable).map((p) => ({
    url: `${SITE_URL}/${l}${p}`, changeFrequency: (p.startsWith("/daily/") ? "daily" : "monthly") as "daily" | "monthly", priority: p === "/" ? 1 : 0.6,
    alternates: { languages: Object.fromEntries(Object.entries(languageAlternates(p)).map(([k, v]) => [k, `${SITE_URL}${v}`])) },
  })))];
}
