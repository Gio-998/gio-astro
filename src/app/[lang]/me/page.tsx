import { Suspense } from "react";
import { MePage } from "@/components/pages/MePage";
export const metadata = { title: "My profile", robots: { index: false } };
export default function Page() { return <Suspense><MePage /></Suspense>; }
