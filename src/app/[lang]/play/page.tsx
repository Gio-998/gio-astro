import { Suspense } from "react";
import { getContent } from "@/content";
import { localizedMeta } from "@/lib/seo";
import { playFor } from "@/components/play/content";
import { PlayHub } from "@/components/play/PlayHub";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params; const c = getContent(lang); const P = playFor(lang);
  return { title: P.meta.title, description: P.meta.description, ...localizedMeta(lang, "/play/", { title: `${P.meta.title} · ${c.site.brand}`, description: P.meta.description, siteName: c.site.brand }) };
}
export default function Page() { return <Suspense><PlayHub /></Suspense>; }
