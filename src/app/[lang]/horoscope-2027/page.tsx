import { notFound } from "next/navigation";
import { SectionPage, sectionMeta } from "@/components/sections/SectionRoute";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) { const { lang } = await params; return lang === "en" ? sectionMeta("horoscope-2027", lang) : {}; }
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params; if (lang !== "en") notFound();
  return <SectionPage section="horoscope-2027" lang={lang} />;
}
