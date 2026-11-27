import { MonthlyPage, monthlyMeta, partialSign, partialSignParams } from "@/components/partial/routes";
import { notFound } from "next/navigation";

export const dynamicParams = false;
export const generateStaticParams = partialSignParams;
export async function generateMetadata({ params }: { params: Promise<{ sign: string }> }) { const { sign } = await params; const id = partialSign(sign); return id ? monthlyMeta("sl", id) : {}; }
export default async function Page({ params }: { params: Promise<{ sign: string }> }) {
  const { sign } = await params; const id = partialSign(sign); if (!id) notFound();
  return <MonthlyPage lang="sl" sign={id} />;
}
