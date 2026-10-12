import type { Metadata } from "next";
import { AdminPremium } from "@/components/premium/AdminPremium";
export const metadata: Metadata = { title: "Monetization demo", robots: { index: false, follow: false } };
export default function Page() { return <AdminPremium />; }
