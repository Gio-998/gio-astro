import { DayPage, dayMeta } from "@/components/horoscope/routes";
import { partialSignParams } from "@/components/partial/routes";

export const dynamicParams = false;
export const generateStaticParams = partialSignParams;
export async function generateMetadata({ params }: { params: Promise<{ sign: string }> }) { const { sign } = await params; return dayMeta("sl", sign); }
export default async function Page({ params }: { params: Promise<{ sign: string }> }) {
  const { sign } = await params;
  return <DayPage lang="sl" slug={sign} />;
}
