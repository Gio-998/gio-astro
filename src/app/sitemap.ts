import type { MetadataRoute } from "next";
import { LOCALES } from "@/content";
import { SITE_URL } from "@/lib/site-url";
export const dynamic = "force-static";
import { QUIZ_IDS } from "@/lib/quiz-defs";
import { languageAlternates, isIndexable } from "@/lib/seo";
// Indexable routes (locale-less). Personal pages (profile, people, today, account) are left out on purpose.
const PUBLIC = ["/", "/start/", "/match/", "/bond/", "/quizzes/", ...QUIZ_IDS.map((q) => `/quiz/${q}/`), "/learn/", "/promise/", "/privacy/", "/terms/", "/credits/"];
export default function sitemap(): MetadataRoute.Sitemap {
  // One <url> per locale, each listing every language version (xhtml:link hreflang) + x-default.
  return LOCALES.flatMap((l) => PUBLIC.filter(isIndexable).map((p) => ({
    url: `${SITE_URL}/${l}${p}`, changeFrequency: "monthly" as const, priority: p === "/" ? 1 : 0.6,
    alternates: { languages: Object.fromEntries(Object.entries(languageAlternates(p)).map(([k, v]) => [k, `${SITE_URL}${v}`])) },
  })));
}
