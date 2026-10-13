import { DayPage, dayMeta, signParams } from "@/components/horoscope/routes";

export const dynamicParams = false;
export async function generateStaticParams({ params }: { params: { lang: string } }) { return signParams(params.lang, "de"); }
export async function generateMetadata({ params }: { params: Promise<{ lang: string; sign: string }> }) { const { lang, sign } = await params; return dayMeta(lang, sign); }
export default async function Page({ params }: { params: Promise<{ lang: string; sign: string }> }) {
  const { lang, sign } = await params;
  return <DayPage lang={lang} slug={sign} />;
}
