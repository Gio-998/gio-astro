import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";
export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots {
  // Personal pages (profile, people, today) hold only local data and are noindex via page metadata.
  // Private beta: keep the whole site out of search engines until NEXT_PUBLIC_BETA=0.
  if (process.env.NEXT_PUBLIC_BETA !== "0") return { rules: [{ userAgent: "*", disallow: "/" }] };
  return { rules: [{ userAgent: "*", allow: "/" }], sitemap: `${SITE_URL}/sitemap.xml` };
}
