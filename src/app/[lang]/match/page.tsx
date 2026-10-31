import { pageMeta } from "@/lib/page-meta";
import { Suspense } from "react";
import { getContent } from "@/content";
import { MatchPage } from "@/components/pages/MatchPage";
import { StaticIntro } from "@/components/tests/StaticIntro";
export const generateMetadata = pageMeta("match");
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const c = getContent((await params).lang); const U = c.ui.match;
  return <Suspense fallback={<StaticIntro title={`${U.titleA}${U.titleB}`} text={U.sub} />}><MatchPage /></Suspense>;
}
