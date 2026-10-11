import { Suspense } from "react";
import { PersonPage } from "@/components/pages/MePage";
export const metadata = { title: "Profile", robots: { index: false } };
export default function Page() { return <Suspense><PersonPage /></Suspense>; }
