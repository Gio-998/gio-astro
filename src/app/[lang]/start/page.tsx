import { Suspense } from "react";
import { QuickStart } from "@/components/pages/QuickStart";
export const metadata = { title: "Free birth chart & profile in 90 seconds", description: "Enter your birth date to get your Western, Vedic and Chinese signs, numerology, tarot birth card, archetype animal and colour palette — free." };
export default function Page() { return <Suspense><QuickStart /></Suspense>; }
