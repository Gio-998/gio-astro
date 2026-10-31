import { pageMeta } from "@/lib/page-meta";
import { Suspense } from "react";
import { getContent } from "@/content";
import { BondPage } from "@/components/pages/BondPage";
import { StaticIntro } from "@/components/tests/StaticIntro";
export const generateMetadata = pageMeta("bond");
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const m = getContent((await params).lang).ui.pageMeta.bond;
  return <Suspense fallback={<StaticIntro title={m.title} text={m.description} />}><BondPage /></Suspense>;
}
