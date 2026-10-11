import { pageMeta } from "@/lib/page-meta";
import { Suspense } from "react";
import { BookPage } from "@/components/pages/BookPage";
export const generateMetadata = pageMeta("book", { robots: { index: false } });
export default function Page() { return <Suspense><BookPage /></Suspense>; }
