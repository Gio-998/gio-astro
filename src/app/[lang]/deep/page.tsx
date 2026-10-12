import { Suspense } from "react";
import { getContent } from "@/content";
import { localizedMeta } from "@/lib/seo";
import { adaptive as en } from "@/content/en/adaptive";
import { adaptive as mk } from "@/content/mk/adaptive";
import { DeepRead } from "@/components/adaptive/DeepRead";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params; const c = getContent(lang); const A = lang === "mk" ? mk : en;
  return { title: A.meta.title, description: A.meta.description, ...localizedMeta(lang, "/deep/", { title: `${A.meta.title} · ${c.site.brand}`, description: A.meta.description, siteName: c.site.brand }) };
}
export default function Page() { return <Suspense><DeepRead /></Suspense>; }
