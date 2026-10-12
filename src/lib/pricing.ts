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
  plus: { month: 749, year: 5900 },
  duo: { month: 1499, year: 11800 },
};
export const RECOMMENDED: PlanId = "plus";
export type ReportId = "match" | "year" | "deep";
export const REPORT_PRICES: Record<ReportId, number> = { match: 499, year: 699, deep: 499 };

/** Yearly saving vs 12 monthly payments, whole percent rounded down (59 vs 89.88 → 34%). */
export const yearlySaving = (p: PlanId) => { const { month, year } = PLAN_PRICES[p]; return month ? Math.floor((1 - year / (month * 12)) * 100) : 0; };
/** Yearly price expressed per month, in cents (rounded). */
export const perMonthOfYear = (p: PlanId) => Math.round(PLAN_PRICES[p].year / 12);

/** Other catalog items (premium product pages, sessions, gift cards), euro cents. Used by src/lib/payments.ts. */
export const EXTRA_PRICES = {
  "soul-blueprint": 4900, "couple-deep-dive": 5900, constellation: 7900, hardcover: 6900,
  "session-partner": 9900, "session-founder": 14900, "gift-25": 2500, "gift-49": 4900, "gift-99": 9900,
} as const;
