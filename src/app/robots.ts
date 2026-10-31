import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";
export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots {
  // Crawling is allowed everywhere so Google can read each page's own robots meta:
  // public pages are index,follow; private app pages (profile, people, results, admin, code page) are noindex.
  // The one exception is the router's payload files. They are data for the page's own script, not pages, and every date adds more of them.
  // /sitemap.xml is a sitemap index (scripts/split-sitemap.mjs); it lists one file per language and section.
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/*index.txt$", "/*__next."] }], sitemap: `${SITE_URL}/sitemap.xml` };
}
