import { notFound } from "next/navigation";
import { HubPage, hubMeta } from "@/components/horoscope/routes";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) { const { lang } = await params; return hubMeta(lang); }
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params; if (lang !== "mk") notFound();
  return <HubPage lang={lang} />;
}
