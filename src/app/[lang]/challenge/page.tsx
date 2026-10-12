import type { Metadata } from "next";
import { Suspense } from "react";
import { ChallengePage } from "@/components/bonds/Challenge";
export const metadata: Metadata = { title: "Horoscop", robots: { index: false, follow: false } };
export default function Page() { return <Suspense><ChallengePage /></Suspense>; }
