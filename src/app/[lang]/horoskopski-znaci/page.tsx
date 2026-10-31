import { notFound } from "next/navigation";
import { SectionPage, sectionMeta } from "@/components/sections/SectionRoute";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) { const { lang } = await params; return lang === "mk" ? sectionMeta("zodiac", lang) : {}; }
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params; if (lang !== "mk") notFound();
  return <SectionPage section="zodiac" lang={lang} />;
}
