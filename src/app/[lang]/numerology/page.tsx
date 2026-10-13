import { notFound } from "next/navigation";
import { NumPage, numMeta } from "@/components/numerology/NumPage";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) { const { lang } = await params; return numMeta(lang); }
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params; if (lang !== "en") notFound();
  return <NumPage lang={lang} />;
}
