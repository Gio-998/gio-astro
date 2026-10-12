import { Suspense } from "react";
import { pageMeta } from "@/lib/page-meta";
import { CallbackPage } from "@/components/auth/Auth";
export const generateMetadata = pageMeta("account", { robots: { index: false } });
export default function Page() { return <Suspense><CallbackPage /></Suspense>; }
