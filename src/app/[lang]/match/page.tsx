import { Suspense } from "react";
import { MatchPage } from "@/components/pages/MatchPage";
export const metadata = { title: "Compatibility across every lens — free", description: "Compare any two people — partner, friend, family or colleague — through astrology, Vedic matching, Chinese zodiac, numerology, Big Five, attachment and more. Harmony, Spark and Resonance, with practices." };
export default function Page() { return <Suspense><MatchPage /></Suspense>; }
