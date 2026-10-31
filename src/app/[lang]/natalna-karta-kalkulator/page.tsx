import { notFound } from "next/navigation";
import { servesFolder } from "@/lib/i18n-routes";
import { SectionPage, sectionMeta } from "@/components/sections/SectionRoute";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) { const { lang } = await params; return servesFolder(lang, "birth-chart", "mk") ? sectionMeta("birth-chart", lang) : {}; }
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params; if (!servesFolder(lang, "birth-chart", "mk")) notFound();
  return <SectionPage section="birth-chart" lang={lang} />;
}
