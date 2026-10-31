import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContent } from "@/content";
import { LOCALE_META, defaultOgImage } from "@/lib/seo";
import { SITE_URL } from "@/lib/site-url";
import { pricingAlternates, pricingPath, type PricingLocale } from "@/lib/pricing";
import { ROUTE_LOCALES } from "@/lib/i18n-routes";
import { pricingText } from "./text";
import { PricingPage } from "./PricingPage";
import { LdJson, breadcrumb, faqPage, ORG_REF } from "@/lib/schema";

export function pricingMeta(lang: string): Metadata {
  const T = pricingText(lang); const brand = getContent(lang).site.brand; const l = ((ROUTE_LOCALES as readonly string[]).includes(lang) ? lang : "en") as PricingLocale;
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
  // Only the free offer exists. Planned prices stay out of the schema until something is really on sale.
  const app = { "@context": "https://schema.org", "@type": "WebApplication", name: brand, url, inLanguage: lang, applicationCategory: "LifestyleApplication", operatingSystem: "Any", description: T.meta.description, publisher: ORG_REF, offers: { "@type": "Offer", name: T.free.name, price: "0", priceCurrency: "EUR", url, availability: "https://schema.org/InStock" } };
  return <><LdJson data={[app, faqPage(T.faq.items), breadcrumb([[brand, `/${lang}/`], [T.eyebrow, `/${lang}${pricingPath(lang)}`]])]} /><PricingPage /></>;
}
