import type { MetadataRoute } from "next";
import { LOCALES } from "@/content";
import { SITE_URL } from "@/lib/site-url";
export const dynamic = "force-static";
import { QUIZ_IDS } from "@/lib/quiz-defs";
import { languageAlternates, isIndexable } from "@/lib/seo";
import { SIGNS } from "@/engine/zodiac";
import { BLOG_SLUGS } from "@/content/blog";
// Indexable routes (locale-less). Personal pages (profile, people, today, account) are left out on purpose.
const PUBLIC = ["/", "/start/", "/match/", "/bond/", "/quizzes/", ...QUIZ_IDS.map((q) => `/quiz/${q}/`), "/learn/", "/how-it-works/", "/promise/", "/privacy/", "/terms/", "/credits/", "/daily/", ...SIGNS.map((s) => `/daily/${s}/`), "/blog/", ...BLOG_SLUGS.map((s) => `/blog/${s}/`)];
export default function sitemap(): MetadataRoute.Sitemap {
  // One <url> per locale, each listing every language version (xhtml:link hreflang) + x-default.
  return LOCALES.flatMap((l) => PUBLIC.filter(isIndexable).map((p) => ({
    url: `${SITE_URL}/${l}${p}`, changeFrequency: (p.startsWith("/daily/") ? "daily" : "monthly") as "daily" | "monthly", priority: p === "/" ? 1 : 0.6,
    alternates: { languages: Object.fromEntries(Object.entries(languageAlternates(p)).map(([k, v]) => [k, `${SITE_URL}${v}`])) },
  })));
}
