import { Suspense } from "react";
import { BondPage } from "@/components/pages/BondPage";
export const metadata = { title: "Bond Check — a 3-minute check-in for two", description: "Both of you answer eight questions about your relationship and see strengths, perception gaps and practices." };
export default function Page() { return <Suspense><BondPage /></Suspense>; }
