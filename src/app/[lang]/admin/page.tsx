import type { Metadata } from "next";
import { BetaAdmin } from "@/components/auth/Beta";
export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export default function Page() { return <BetaAdmin />; }
