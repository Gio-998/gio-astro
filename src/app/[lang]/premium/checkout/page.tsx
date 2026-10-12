import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutPage } from "@/components/premium/Checkout";
export const metadata: Metadata = { title: "Checkout", robots: { index: false, follow: false } };
export default function Page() { return <Suspense><CheckoutPage /></Suspense>; }
