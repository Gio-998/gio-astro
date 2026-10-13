import { PricingRoute, pricingMeta } from "@/components/pricing/route";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) { const { lang } = await params; return pricingMeta(lang); }
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <PricingRoute lang={lang} owner="de" />;
}
