import { notFound } from "next/navigation";
import { SectionPage, sectionMeta, sectionParams } from "@/components/sections/SectionRoute";

export const dynamicParams = false;
export async function generateStaticParams({ params }: { params: { lang: string } }) { return sectionParams("zodiac", params.lang, "en"); }
export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string[] }> }) { const { lang, slug } = await params; return lang === "en" ? sectionMeta("zodiac", lang, slug) : {}; }
export default async function Page({ params }: { params: Promise<{ lang: string; slug: string[] }> }) {
  const { lang, slug } = await params; if (lang !== "en") notFound();
  return <SectionPage section="zodiac" lang={lang} slug={slug} />;
}
