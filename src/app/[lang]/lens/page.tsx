import { Suspense } from "react";
import { LensPageView } from "@/components/pages/LensPage";
export const metadata = { title: "Meaning", robots: { index: false } };
export default function Page() { return <Suspense><LensPageView /></Suspense>; }
