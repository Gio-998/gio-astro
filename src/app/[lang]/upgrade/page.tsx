import type { Metadata } from "next";
import { PremiumPage } from "@/components/premium/PremiumPage";
// Old "Extras" URL: same content as /premium, canonical points there.
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return { robots: { index: false, follow: true }, alternates: { canonical: `/${lang}/premium/` } };
}
export default function Page() { return <PremiumPage />; }
