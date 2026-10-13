import type { MetadataRoute } from "next";
import { LOCALES } from "@/content";
import { SITE_URL } from "@/lib/site-url";
export const dynamic = "force-static";
import { QUIZ_IDS } from "@/lib/quiz-defs";
import { languageAlternates, isIndexable } from "@/lib/seo";
import { localizedPath } from "@/lib/i18n-routes";
import { SIGNS } from "@/engine/zodiac";
import { BLOG_SLUGS, postFor } from "@/content/blog";
import { publishedDates } from "@/engine/skyday";

// Every URL comes from one internal (locale-less) route path; localizedPath/languageAlternates turn it into each
// locale's public URL and hreflang set, so localized slugs (/mk/ceni/, /mk/dneven-horoskop/…) need no special cases.
// Personal pages (profile, people, today, account) are left out on purpose.
const PUBLIC = ["/", "/start/", "/match/", "/bond/", "/quizzes/", "/deep/", "/play/", "/you/", "/partners/", ...QUIZ_IDS.map((q) => `/quiz/${q}/`), "/learn/", "/how-it-works/", "/promise/", "/privacy/", "/terms/", "/credits/", "/daily/", ...SIGNS.map((s) => `/daily/${s}/`), "/blog/", ...BLOG_SLUGS.map((s) => `/blog/${s}/`)].filter(isIndexable);
const DATES = publishedDates();
const HORO = ["/horoscope/", ...SIGNS.map((s) => `/horoscope/${s}/`), ...SIGNS.flatMap((s) => DATES.map((d) => `/horoscope/${s}/${d}/`))];
const BUILD = new Date().toISOString().slice(0, 10);

type Entry = { path: string; lastModified: (l: string) => string; changeFrequency: "daily" | "monthly" | "yearly"; priority: number };
function entries(): Entry[] {
  const dated = (p: string) => p.match(/\/(\d{4}-\d{2}-\d{2})\/$/)?.[1];
  // Evergreen pages: build date (daily sections change every build); blog posts: their own updated/published date.
  const blogDate = (l: string, p: string) => { const m = p.match(/^\/blog\/([^/]+)\/$/); const post = m ? postFor(l, m[1]) : undefined; return post ? (post.updated ?? post.date) : BUILD; };
  return [
    ...HORO.map((p): Entry => { const d = dated(p); return { path: p, lastModified: () => d ?? BUILD, changeFrequency: d ? "yearly" : "daily", priority: d ? 0.5 : 0.7 }; }),
    { path: "/pricing/", lastModified: () => BUILD, changeFrequency: "monthly", priority: 0.7 },
    ...PUBLIC.map((p): Entry => ({ path: p, lastModified: (l) => blogDate(l, p), changeFrequency: p.startsWith("/daily/") ? "daily" : "monthly", priority: p === "/" ? 1 : 0.6 })),
  ];
}
export default function sitemap(): MetadataRoute.Sitemap {
  // One <url> per locale, each listing every language version (xhtml:link hreflang) + x-default.
  const abs = (o: Record<string, string>) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, `${SITE_URL}${v}`]));
  return entries().flatMap((e) => LOCALES.map((l) => ({ url: `${SITE_URL}${localizedPath(l, e.path)}`, lastModified: e.lastModified(l), changeFrequency: e.changeFrequency, priority: e.priority, alternates: { languages: abs(languageAlternates(e.path)) } })));
}
