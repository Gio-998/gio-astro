/**
 * Planned prices (EUR, incl. VAT). Change prices here only.
 * Source: OFFER-PLAN.md section 4 (Balkan-friendly tier). Payments are not live: the Pricing page shows these as planned, and everything is free for now.
 */
import { ROUTE_LOCALES, localizedPath, routeAlternates, type RouteLocale } from "./i18n-routes";
/** Locale-less pricing path per locale (from the shared slug map), e.g. { en: "/pricing/", mk: "/ceni/" }. */
export const PRICING_PATHS = Object.fromEntries(ROUTE_LOCALES.map((l) => [l, localizedPath(l, "/pricing/").slice(l.length + 1)])) as Record<RouteLocale, string>;
export type PricingLocale = RouteLocale;
export const pricingPath = (lang: string) => PRICING_PATHS[(lang as PricingLocale)] ?? PRICING_PATHS.en;
/** hreflang map for the page (each locale has its own slug). */
export const pricingAlternates = () => routeAlternates("/pricing/");

export type PlanId = "free" | "plus";
/** Prices in euro cents. */
export const PLAN_PRICES: Record<PlanId, { month: number; year: number }> = {
  free: { month: 0, year: 0 },
  plus: { month: 749, year: 5900 },
};
export type ReportId = "match" | "year" | "deep";
export const REPORT_PRICES: Record<ReportId, number> = { match: 499, year: 699, deep: 499 };

/** Yearly saving vs 12 monthly payments, whole percent rounded down (59 vs 89.88 → 34%). */
export const yearlySaving = (p: PlanId) => { const { month, year } = PLAN_PRICES[p]; return month ? Math.floor((1 - year / (month * 12)) * 100) : 0; };

/** Other catalog items (premium product pages, sessions, gift cards), euro cents. Used by src/lib/payments.ts. */
export const EXTRA_PRICES = {
  "soul-blueprint": 4900, "couple-deep-dive": 5900, constellation: 7900, hardcover: 6900,
  "session-partner": 9900, "session-founder": 14900, "gift-25": 2500, "gift-49": 4900, "gift-99": 9900,
} as const;
