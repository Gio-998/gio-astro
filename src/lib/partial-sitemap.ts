import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";
import { languageAlternates } from "@/lib/seo";
import { localizedPath } from "@/lib/i18n-routes";
import { PARTIAL_LOCALES, partialPaths } from "@/lib/partial-scope";

/** Sitemap entries of the partial locales: only the pages that exist there. Each lists the full hreflang set of its path (core languages plus itself); the home has no counterpart elsewhere, so it lists none. */
export function partialSitemap(lastModified: string): MetadataRoute.Sitemap {
  const abs = (o: Record<string, string>) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, `${SITE_URL}${v}`]));
  return PARTIAL_LOCALES.flatMap((l) => partialPaths().map((p) => {
    const alt = languageAlternates(p);
    return {
      url: `${SITE_URL}${localizedPath(l, p)}`, lastModified,
      changeFrequency: (p === "/" || p.startsWith("/horoscope/") ? "daily" : "monthly") as "daily" | "monthly", priority: p === "/" ? 0.8 : 0.6,
      ...(alt.sl ? { alternates: { languages: abs(alt) } } : {}),
    };
  }));
}
