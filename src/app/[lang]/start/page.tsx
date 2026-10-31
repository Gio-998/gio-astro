import { pageMeta } from "@/lib/page-meta";
import { Suspense } from "react";
import { getContent } from "@/content";
import { QuickStart } from "@/components/pages/QuickStart";
import { StaticIntro } from "@/components/tests/StaticIntro";
export const generateMetadata = pageMeta("start");
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const c = getContent((await params).lang); const U = c.ui.quickStart;
  return <Suspense fallback={<StaticIntro title={`${U.newA}${U.newB}`} text={U.sub} />}><QuickStart /></Suspense>;
}
