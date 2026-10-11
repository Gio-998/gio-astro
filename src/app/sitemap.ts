import type { MetadataRoute } from "next";
import { LOCALES } from "@/content";
import { SITE_URL } from "@/lib/site-url";
export const dynamic = "force-static";
const PUBLIC = ["", "start/", "match/", "bond/", "quizzes/", "learn/", "promise/", "privacy/", "terms/"];
export default function sitemap(): MetadataRoute.Sitemap {
  return LOCALES.flatMap((l) => PUBLIC.map((p) => ({ url: `${SITE_URL}/${l}/${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.6 })));
}
