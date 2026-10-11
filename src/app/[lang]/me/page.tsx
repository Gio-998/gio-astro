import { pageMeta } from "@/lib/page-meta";
import { Suspense } from "react";
import { MePage } from "@/components/pages/MePage";
export const generateMetadata = pageMeta("me", { robots: { index: false } });
export default function Page() { return <Suspense><MePage /></Suspense>; }
