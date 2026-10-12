import type { Metadata } from "next";
import { getContent } from "@/content";
import { localizedMeta } from "@/lib/seo";
import { YouPage } from "@/components/pages/YouPage";
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params; const Y = getContent(lang).you; const c = getContent(lang);
  return { title: Y.metaTitle, description: Y.metaDescription, ...localizedMeta(lang, "/you/", { title: `${Y.metaTitle} · ${c.site.brand}`, description: Y.metaDescription, siteName: c.site.brand }), robots: { index: false } };
}
export default function Page() { return <YouPage />; }
