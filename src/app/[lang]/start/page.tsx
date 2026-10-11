import { pageMeta } from "@/lib/page-meta";
import { Suspense } from "react";
import { QuickStart } from "@/components/pages/QuickStart";
export const generateMetadata = pageMeta("start");
export default function Page() { return <Suspense><QuickStart /></Suspense>; }
