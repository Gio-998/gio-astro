import { Suspense } from "react";
import { pageMeta } from "@/lib/page-meta";
import { ResetPage } from "@/components/auth/Auth";
export const generateMetadata = pageMeta("account", { robots: { index: false } });
export default function Page() { return <Suspense><ResetPage /></Suspense>; }
