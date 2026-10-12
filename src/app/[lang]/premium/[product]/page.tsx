import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContent } from "@/content";
import { localizedMeta } from "@/lib/seo";
import { OFFERS } from "@/lib/payments";
import { premiumText } from "@/components/premium/text";
import { ProductPage } from "@/components/premium/ProductPage";

type Offer = (typeof OFFERS)[number];
type P = { params: Promise<{ lang: string; product: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return OFFERS.map((product) => ({ product })); }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { lang, product } = await params; const T = premiumText(lang); const o = T.products[product]; const brand = getContent(lang).site.brand;
  if (!o) return {};
  return { title: o.name, description: o.short, ...localizedMeta(lang, `/premium/${product}/`, { title: `${o.name} · ${brand}`, description: o.short, siteName: brand }), robots: { index: false, follow: true } };
}
export default async function Page({ params }: P) {
  const { product } = await params;
  if (!(OFFERS as string[]).includes(product)) notFound();
  return <ProductPage id={product as Offer} />;
}
