import { Suspense } from "react";
import { ChartPage } from "@/components/pages/ChartPage";
export const metadata = { title: "Birth chart", robots: { index: false } };
export default function Page() { return <Suspense><ChartPage /></Suspense>; }
