import { Suspense } from "react";
import { BookPage } from "@/components/pages/BookPage";
export const metadata = { title: "The Book of You", robots: { index: false } };
export default function Page() { return <Suspense><BookPage /></Suspense>; }
