import { pageMeta } from "@/lib/page-meta";
import { Suspense } from "react";
import { LensPageView } from "@/components/pages/LensPage";
export const generateMetadata = pageMeta("lens", { robots: { index: false } });
export default function Page() { return <Suspense><LensPageView /></Suspense>; }
