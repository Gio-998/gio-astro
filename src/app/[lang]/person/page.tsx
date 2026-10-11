import { pageMeta } from "@/lib/page-meta";
import { Suspense } from "react";
import { PersonPage } from "@/components/pages/MePage";
export const generateMetadata = pageMeta("person", { robots: { index: false } });
export default function Page() { return <Suspense><PersonPage /></Suspense>; }
