import { pageMeta } from "@/lib/page-meta";
import { Suspense } from "react";
import { BondPage } from "@/components/pages/BondPage";
export const generateMetadata = pageMeta("bond");
export default function Page() { return <Suspense><BondPage /></Suspense>; }
