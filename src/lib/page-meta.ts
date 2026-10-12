import type { Metadata } from "next";
import { getContent } from "@/content";
import type { Content } from "@/content";
import { localizedMeta } from "./seo";

// Route for each pageMeta key (locale-less). Default: `/${key}/`.
const ROUTE: Partial<Record<string, string>> = { verify: "/account/verify/" };

/** Localized <title>/<description> for a static route: `export const generateMetadata = pageMeta("bond")`. */
export function pageMeta(key: keyof Content["ui"]["pageMeta"], extra: Metadata = {}) {
  return async ({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> => {
    const { lang } = await params;
    const c = getContent(lang); const m = c.ui.pageMeta[key] as { title: string; description?: string };
    const path = ROUTE[key as string] ?? `/${String(key)}/`;
    return { title: m.title, ...(m.description ? { description: m.description } : {}), ...localizedMeta(lang, path, { title: `${m.title} · ${c.site.brand}`, description: m.description, siteName: c.site.brand }), ...extra };
  };
}
