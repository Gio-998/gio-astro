import { pageMeta } from "@/lib/page-meta";
import { Suspense } from "react";
import { MatchPage } from "@/components/pages/MatchPage";
export const generateMetadata = pageMeta("match");
export default function Page() { return <Suspense><MatchPage /></Suspense>; }
