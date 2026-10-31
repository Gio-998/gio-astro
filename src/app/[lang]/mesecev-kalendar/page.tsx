import { notFound } from "next/navigation";
import { servesFolder } from "@/lib/i18n-routes";
import { SectionPage, sectionMeta } from "@/components/sections/SectionRoute";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) { const { lang } = await params; return servesFolder(lang, "moon-calendar", "mk") ? sectionMeta("moon-calendar", lang) : {}; }
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params; if (!servesFolder(lang, "moon-calendar", "mk")) notFound();
  return <SectionPage section="moon-calendar" lang={lang} />;
}
