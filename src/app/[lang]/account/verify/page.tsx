import { Suspense } from "react";
import { pageMeta } from "@/lib/page-meta";
import { VerifyPage } from "@/components/auth/Auth";
export const generateMetadata = pageMeta("verify", { robots: { index: false } });
export default function Page() { return <Suspense><VerifyPage /></Suspense>; }
