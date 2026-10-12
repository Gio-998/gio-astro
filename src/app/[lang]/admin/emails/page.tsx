import type { Metadata } from "next";
import { EmailPreview } from "@/components/auth/EmailPreview";
export const metadata: Metadata = { title: "Email previews", robots: { index: false, follow: false } };
export default function Page() { return <EmailPreview />; }
