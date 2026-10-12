import type { Metadata } from "next";
import { getContent } from "@/content";
import { localizedMeta } from "@/lib/seo";
import { premiumText } from "@/components/premium/text";
import { PremiumPage } from "@/components/premium/PremiumPage";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params; const T = premiumText(lang); const brand = getContent(lang).site.brand;
  return { title: T.meta.title, description: T.meta.description, ...localizedMeta(lang, "/premium/", { title: `${T.meta.title} · ${brand}`, description: T.meta.description, siteName: brand }), robots: { index: false, follow: true } };
}
export default function Page() { return <PremiumPage />; }
