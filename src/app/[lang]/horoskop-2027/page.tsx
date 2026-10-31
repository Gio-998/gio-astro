import { notFound } from "next/navigation";
import { servesFolder } from "@/lib/i18n-routes";
import { SectionPage, sectionMeta } from "@/components/sections/SectionRoute";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) { const { lang } = await params; return servesFolder(lang, "horoscope-2027", "mk") ? sectionMeta("horoscope-2027", lang) : {}; }
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params; if (!servesFolder(lang, "horoscope-2027", "mk")) notFound();
  return <SectionPage section="horoscope-2027" lang={lang} />;
}
