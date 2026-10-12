import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContent } from "@/content";
import { LOCALE_META } from "@/lib/seo";
import { SITE_URL } from "@/lib/site-url";
import { pricingAlternates, pricingPath, type PricingLocale } from "@/lib/pricing";
import { pricingText } from "./text";
import { PricingPage } from "./PricingPage";

export function pricingMeta(lang: string): Metadata {
  const T = pricingText(lang); const brand = getContent(lang).site.brand; const l = (lang === "mk" ? "mk" : "en") as PricingLocale;
  const canonical = `/${l}${pricingPath(l)}`; const title = `${T.meta.title} · ${brand}`;
  return {
    title: T.meta.title, description: T.meta.description, robots: { index: true, follow: true },
    alternates: { canonical, languages: pricingAlternates() },
    openGraph: { type: "website", siteName: brand, title, description: T.meta.description, url: `${SITE_URL}${canonical}`, locale: LOCALE_META[l].og },
    twitter: { card: "summary_large_image", title, description: T.meta.description },
  };
}
/** Each locale owns its slug (/en/pricing, /mk/ceni); the other locale 404s there. */
export function PricingRoute({ lang, owner }: { lang: string; owner: PricingLocale }) {
  if (lang !== owner) notFound();
  return <PricingPage />;
}
