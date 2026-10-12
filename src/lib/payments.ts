/**
 * Payments: product catalog + a provider interface. DEMO PHASE: no money moves anywhere.
 *
 * Rules we commit to (see /promise and MONETIZATION.md): published prices incl. VAT, no auto-converting trials,
 * one-click cancel, 7-day money-back on Premium, refunds in money, no fake scarcity or countdowns.
 *
 * Going live = implement one PaymentProvider (Lemon Squeezy or Paddle overlay), set NEXT_PUBLIC_PAYMENTS_PROVIDER,
 * and deploy the webhook Edge Function that writes public.entitlements with the service role. The browser never
 * writes entitlements; it only reads its own rows (RLS).
 */
export type ProductId = "premium" | "soul-blueprint" | "couple-deep-dive" | "year-ahead" | "constellation" | "hardcover" | "session" | "gift-card";
export type Sku =
  | "premium-monthly" | "premium-yearly"
  | "soul-blueprint" | "couple-deep-dive" | "year-ahead" | "constellation" | "hardcover"
  | "session-partner" | "session-founder"
  | "gift-25" | "gift-49" | "gift-99";

export interface SkuInfo { sku: Sku; product: ProductId; cents: number; interval?: "month" | "year" }
export const SKUS: Record<Sku, SkuInfo> = {
  "premium-monthly": { sku: "premium-monthly", product: "premium", cents: 499, interval: "month" },
  "premium-yearly": { sku: "premium-yearly", product: "premium", cents: 3900, interval: "year" },
  "soul-blueprint": { sku: "soul-blueprint", product: "soul-blueprint", cents: 4900 },
  "couple-deep-dive": { sku: "couple-deep-dive", product: "couple-deep-dive", cents: 5900 },
  "year-ahead": { sku: "year-ahead", product: "year-ahead", cents: 2900 },
  constellation: { sku: "constellation", product: "constellation", cents: 7900 },
  hardcover: { sku: "hardcover", product: "hardcover", cents: 6900 },
  "session-partner": { sku: "session-partner", product: "session", cents: 9900 },
  "session-founder": { sku: "session-founder", product: "session", cents: 14900 },
  "gift-25": { sku: "gift-25", product: "gift-card", cents: 2500 },
  "gift-49": { sku: "gift-49", product: "gift-card", cents: 4900 },
  "gift-99": { sku: "gift-99", product: "gift-card", cents: 9900 },
};
/** High-ticket product pages, in display order. */
export const OFFERS: Exclude<ProductId, "premium">[] = ["soul-blueprint", "couple-deep-dive", "year-ahead", "constellation", "hardcover", "session", "gift-card"];
export const skusOf = (p: ProductId): Sku[] => (Object.values(SKUS).filter((s) => s.product === p).map((s) => s.sku));
export const isSku = (s: string | null | undefined): s is Sku => !!s && s in SKUS;
export const isProduct = (s: string): s is ProductId => s === "premium" || (OFFERS as string[]).includes(s);

/** Yearly saving vs 12 × monthly, rounded down (39 vs 59.88 → 34%). */
export const yearlySavePct = Math.floor((1 - SKUS["premium-yearly"].cents / (SKUS["premium-monthly"].cents * 12)) * 100);

/** Deterministic (no Intl): server and browser ICU data differ for "mk", which caused hydration mismatches. */
export function groupThousands(n: number, sep: string): string { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, sep); }
export function eur(cents: number, locale: string): string {
  const whole = Math.floor(cents / 100), frac = cents % 100;
  if (locale === "mk") return `${groupThousands(whole, ".")}${frac ? `,${String(frac).padStart(2, "0")}` : ""} €`;
  return `€${groupThousands(whole, ",")}${frac ? `.${String(frac).padStart(2, "0")}` : ""}`;
}

/** While false, regular users never see locks (the beta is free) and checkout shows "coming soon". */
export const PAYWALL_LIVE = false;
export const paymentsEnabled = false;

// ---------- provider interface ----------
export interface CheckoutRequest {
  sku: Sku;
  userId: string;            // passed to the provider as custom data so the webhook can write the entitlement
  email?: string;
  locale: string;
  successUrl: string;
  meta?: Record<string, string>; // e.g. person ids for couple / constellation, gift recipient
}
export type CheckoutResult = { status: "success"; orderId: string } | { status: "cancelled" } | { status: "error"; message: string };
export interface PaymentProvider {
  id: "demo" | "lemonsqueezy" | "paddle" | "stripe";
  /** Opens the provider's overlay (Lemon.js / Paddle.js) and resolves when it closes. */
  openCheckout(req: CheckoutRequest): Promise<CheckoutResult>;
  /** Customer portal for cancel / change card / invoices (one-click cancel lives there). */
  manageUrl(userId: string): Promise<string | null>;
}

/** Demo: waits a moment, never charges, records a local demo grant (admins only, see components/premium/access). */
export const demoProvider: PaymentProvider = {
  id: "demo",
  async openCheckout(req) {
    await new Promise((r) => setTimeout(r, 900));
    return { status: "success", orderId: `demo_${req.sku}_${Date.now().toString(36)}` };
  },
  async manageUrl() { return null; },
};

/*
 * Lemon Squeezy (merchant of record) sketch:
 *   <script src="https://app.lemonsqueezy.com/js/lemon.js" defer>; window.createLemonSqueezy();
 *   const url = `${VARIANT_CHECKOUT_URL[sku]}?embed=1&checkout[email]=${email}&checkout[custom][user_id]=${userId}`;
 *   LemonSqueezy.Url.Open(url); LemonSqueezy.Setup({ eventHandler: (e) => e.event === "Checkout.Success" && resolve(...) });
 *   Webhook (order_created, subscription_created/updated/cancelled/expired) → Edge Function → upsert entitlements
 *   on (provider, provider_ref) with status + period_end (subscription.renews_at / ends_at).
 * Paddle Billing (merchant of record) sketch:
 *   Paddle.Initialize({ token: CLIENT_TOKEN, eventCallback }); Paddle.Checkout.open({ items: [{ priceId: PRICE_ID[sku] }],
 *   customer: { email }, customData: { user_id: userId } }); webhook transaction.completed / subscription.* → same upsert.
 */
const PROVIDER = process.env.NEXT_PUBLIC_PAYMENTS_PROVIDER ?? "demo";
export function getProvider(): PaymentProvider {
  // Only the demo exists today. Add the real provider here when going live.
  return PROVIDER === "demo" ? demoProvider : demoProvider;
}
