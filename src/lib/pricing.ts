/**
 * Public price list for the Pricing page (EUR, incl. VAT). Change prices here only.
 * Source: OFFER-PLAN.md section 4 (Balkan-friendly tier). Payments are not live yet.
 */
export const PRICING_PATHS = { en: "/pricing/", mk: "/ceni/" } as const;
export type PricingLocale = keyof typeof PRICING_PATHS;
export const pricingPath = (lang: string) => PRICING_PATHS[(lang as PricingLocale)] ?? PRICING_PATHS.en;
/** hreflang map for the page (each locale has its own slug). */
export const pricingAlternates = () => ({ en: `/en${PRICING_PATHS.en}`, mk: `/mk${PRICING_PATHS.mk}`, "x-default": `/en${PRICING_PATHS.en}` });

export type PlanId = "free" | "plus" | "duo";
/** Prices in euro cents. */
export const PLAN_PRICES: Record<PlanId, { month: number; year: number }> = {
  free: { month: 0, year: 0 },
  plus: { month: 299, year: 2400 },
  duo: { month: 449, year: 3600 },
};
export const RECOMMENDED: PlanId = "plus";
export type ReportId = "match" | "year" | "deep";
export const REPORT_PRICES: Record<ReportId, number> = { match: 499, year: 699, deep: 499 };

/** Yearly saving vs 12 monthly payments, whole percent rounded down (24 vs 35.88 → 33%). */
export const yearlySaving = (p: PlanId) => { const { month, year } = PLAN_PRICES[p]; return month ? Math.floor((1 - year / (month * 12)) * 100) : 0; };
/** Yearly price expressed per month, in cents (rounded). */
export const perMonthOfYear = (p: PlanId) => Math.round(PLAN_PRICES[p].year / 12);
