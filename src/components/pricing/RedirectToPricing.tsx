import { inline } from "@/content/sr/inline";
import type { Metadata } from "next";
import { pricingPath } from "@/lib/pricing";
import { ClientRedirect } from "./ClientRedirect";

/** Old /premium and /upgrade URLs: static export can't send a 301, so meta refresh + client replace + canonical. */
export const redirectMeta = (lang: string): Metadata => ({ robots: { index: false, follow: true }, alternates: { canonical: `/${lang}${pricingPath(lang)}` } });
export function RedirectToPricing({ lang }: { lang: string }) {
  const to = `/${lang}${pricingPath(lang)}`;
  return (<><meta httpEquiv="refresh" content={`0; url=${to}`} /><ClientRedirect to={to} /><p className="py-20 text-center text-dim"><a className="text-gold underline" href={to}>{lang === "mk" ? "Цени" : lang === "de" ? "Preise" : lang === "sr" ? inline.pricing : "Pricing"} →</a></p></>);
}
