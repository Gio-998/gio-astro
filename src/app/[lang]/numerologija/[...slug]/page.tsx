import { notFound } from "next/navigation";
import { servesFolder } from "@/lib/i18n-routes";
import { NumPage, numMeta, numParams } from "@/components/numerology/NumPage";

export const dynamicParams = false;
export async function generateStaticParams({ params }: { params: { lang: string } }) { return numParams(params.lang, "mk"); }
export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string[] }> }) { const { lang, slug } = await params; return numMeta(lang, slug); }
export default async function Page({ params }: { params: Promise<{ lang: string; slug: string[] }> }) {
  const { lang, slug } = await params; if (!servesFolder(lang, "numerology", "mk")) notFound();
  return <NumPage lang={lang} slug={slug} />;
}
