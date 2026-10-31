import { Suspense } from "react";
import { getContent } from "@/content";
import { localizedMeta } from "@/lib/seo";
import { adaptive as en } from "@/content/en/adaptive";
import { adaptive as mk } from "@/content/mk/adaptive";
import { adaptive as de } from "@/content/de/adaptive";
import { adaptive as sr } from "@/content/sr/adaptive";
import { DeepRead } from "@/components/adaptive/DeepRead";
import { StaticIntro } from "@/components/tests/StaticIntro";

const textFor = (lang: string) => (lang === "mk" ? mk : lang === "de" ? de : lang === "sr" ? sr : en);
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params; const c = getContent(lang); const A = textFor(lang);
  return { title: A.meta.title, description: A.meta.description, ...localizedMeta(lang, "/deep/", { title: `${A.meta.title} · ${c.site.brand}`, description: A.meta.description, siteName: c.site.brand }) };
}
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const A = textFor((await params).lang);
  return <Suspense fallback={<StaticIntro title={A.hub.title} lead={A.hub.tagline} text={A.hero.sub} />}><DeepRead /></Suspense>;
}
