import { DayPage, dayMeta, dateParams } from "@/components/horoscope/routes";

export const dynamicParams = false;
export async function generateStaticParams({ params }: { params: { lang: string } }) { return dateParams(params.lang, "mk"); }
export async function generateMetadata({ params }: { params: Promise<{ lang: string; sign: string; date: string }> }) { const { lang, sign, date } = await params; return dayMeta(lang, sign, date); }
export default async function Page({ params }: { params: Promise<{ lang: string; sign: string; date: string }> }) {
  const { lang, sign, date } = await params;
  return <DayPage lang={lang} slug={sign} date={date} />;
}
