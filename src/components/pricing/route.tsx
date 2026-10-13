import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContent } from "@/content";
import { LOCALE_META, defaultOgImage } from "@/lib/seo";
import { SITE_URL } from "@/lib/site-url";
import { pricingAlternates, pricingPath, type PricingLocale } from "@/lib/pricing";
import { pricingText } from "./text";
import { PricingPage } from "./PricingPage";
import { PLAN_PRICES } from "@/lib/pricing";
import { LdJson, breadcrumb, faqPage, ORG_REF } from "@/lib/schema";

export function pricingMeta(lang: string): Metadata {
  const T = pricingText(lang); const brand = getContent(lang).site.brand; const l = (lang === "mk" ? "mk" : "en") as PricingLocale;
  const canonical = `/${l}${pricingPath(l)}`; const title = `${T.meta.title} · ${brand}`;
  return {
    title: T.meta.title, description: T.meta.description, robots: { index: true, follow: true },
    alternates: { canonical, languages: pricingAlternates() },
    openGraph: { type: "website", siteName: brand, title, description: T.meta.description, url: `${SITE_URL}${canonical}`, locale: LOCALE_META[l].og, images: [defaultOgImage(l)] },
    twitter: { card: "summary_large_image", images: [defaultOgImage(l).url], title, description: T.meta.description },
  };
}
/** Each locale owns its slug (/en/pricing, /mk/ceni); the other locale 404s there. */
export function PricingRoute({ lang, owner }: { lang: string; owner: PricingLocale }) {
  if (lang !== owner) notFound();
  const T = pricingText(lang); const brand = getContent(lang).site.brand; const url = `${SITE_URL}/${lang}${pricingPath(lang)}`;
  const offer = (name: string, cents: number, unit: "MON" | "ANN") => ({ "@type": "Offer", name, price: (cents / 100).toFixed(2), priceCurrency: "EUR", url, availability: "https://schema.org/PreOrder", ...(cents ? { priceSpecification: { "@type": "UnitPriceSpecification", price: (cents / 100).toFixed(2), priceCurrency: "EUR", unitCode: unit, referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: unit } } } : {}) });
  const product = { "@context": "https://schema.org", "@type": "Product", name: `${brand} Plus`, description: T.meta.description, brand: ORG_REF, url,
    offers: (["free", "plus", "duo"] as const).flatMap((id) => PLAN_PRICES[id].month === 0 ? [offer(T.plans[id].name, 0, "MON")] : [offer(`${T.plans[id].name} (month)`, PLAN_PRICES[id].month, "MON"), offer(`${T.plans[id].name} (year)`, PLAN_PRICES[id].year, "ANN")]) };
  return <><LdJson data={[product, faqPage(T.faq.items), breadcrumb([[brand, `/${lang}/`], [T.meta.title, `/${lang}${pricingPath(lang)}`]])]} /><PricingPage /></>;
}
