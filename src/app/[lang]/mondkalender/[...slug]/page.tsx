import { notFound } from "next/navigation";
import { SectionPage, sectionMeta, sectionParams } from "@/components/sections/SectionRoute";

export const dynamicParams = false;
export async function generateStaticParams({ params }: { params: { lang: string } }) { return sectionParams("moon-calendar", params.lang, "de"); }
export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string[] }> }) { const { lang, slug } = await params; return lang === "de" ? sectionMeta("moon-calendar", lang, slug) : {}; }
export default async function Page({ params }: { params: Promise<{ lang: string; slug: string[] }> }) {
  const { lang, slug } = await params; if (lang !== "de") notFound();
  return <SectionPage section="moon-calendar" lang={lang} slug={slug} />;
}
