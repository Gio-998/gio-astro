import { notFound } from "next/navigation";
import { servesFolder } from "@/lib/i18n-routes";
import { SectionPage, sectionMeta } from "@/components/sections/SectionRoute";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) { const { lang } = await params; return servesFolder(lang, "moon-sign", "mk") ? sectionMeta("moon-sign", lang) : {}; }
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params; if (!servesFolder(lang, "moon-sign", "mk")) notFound();
  return <SectionPage section="moon-sign" lang={lang} />;
}
