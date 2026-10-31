import { notFound } from "next/navigation";
import { SectionPage, sectionMeta, sectionParams } from "@/components/sections/SectionRoute";

export const dynamicParams = false;
export async function generateStaticParams({ params }: { params: { lang: string } }) { return sectionParams("horoscope-2027", params.lang, "mk"); }
export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string[] }> }) { const { lang, slug } = await params; return lang === "mk" ? sectionMeta("horoscope-2027", lang, slug) : {}; }
export default async function Page({ params }: { params: Promise<{ lang: string; slug: string[] }> }) {
  const { lang, slug } = await params; if (lang !== "mk") notFound();
  return <SectionPage section="horoscope-2027" lang={lang} slug={slug} />;
}
