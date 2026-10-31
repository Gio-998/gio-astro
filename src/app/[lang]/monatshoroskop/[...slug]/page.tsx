import { notFound } from "next/navigation";
import { SectionPage, sectionMeta, sectionParams } from "@/components/sections/SectionRoute";

export const dynamicParams = false;
export async function generateStaticParams({ params }: { params: { lang: string } }) { return sectionParams("monthly-horoscope", params.lang, "de"); }
export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string[] }> }) { const { lang, slug } = await params; return lang === "de" ? sectionMeta("monthly-horoscope", lang, slug) : {}; }
export default async function Page({ params }: { params: Promise<{ lang: string; slug: string[] }> }) {
  const { lang, slug } = await params; if (lang !== "de") notFound();
  return <SectionPage section="monthly-horoscope" lang={lang} slug={slug} />;
}
