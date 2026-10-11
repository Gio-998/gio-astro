import type { Metadata } from "next";
import { getContent } from "@/content";
import type { Content } from "@/content";

/** Localized <title>/<description> for a static route: `export const generateMetadata = pageMeta("bond")`. */
export function pageMeta(key: keyof Content["ui"]["pageMeta"], extra: Metadata = {}) {
  return async ({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> => {
    const { lang } = await params;
    const m = getContent(lang).ui.pageMeta[key] as { title: string; description?: string };
    return { title: m.title, ...(m.description ? { description: m.description } : {}), ...extra };
  };
}
