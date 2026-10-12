import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";
export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots {
  // Crawling is allowed everywhere so Google can read each page's own robots meta:
  // public pages are index,follow; private app pages (profile, people, results, admin, code page) are noindex.
  return { rules: [{ userAgent: "*", allow: "/" }], sitemap: `${SITE_URL}/sitemap.xml` };
}
