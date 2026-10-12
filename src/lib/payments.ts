/**
 * Paid-extras placeholders. v1 is 100% free. When payments go live (Lemon Squeezy — merchant of record,
 * handles EU VAT), wire checkout URLs here. Rules we commit to (see /promise):
 * published prices, no auto-converting trials, one-click cancel, renewal reminder, refunds in money.
 */
export interface PaidExtra { id: string; name: string; price: string; description: string; checkoutUrl: string | null }
export const PAID_EXTRAS: PaidExtra[] = [
  { id: "pair-pdf", name: "Deep relationship report (PDF)", price: "€9-19 one-time (planned)", description: "A long, printable write-up of one relationship across every lens.", checkoutUrl: null },
  { id: "year-ahead", name: "Your year ahead", price: "€15 one-time (planned)", description: "Month-by-month themes from transits, personal year and Chinese year.", checkoutUrl: null },
  { id: "premium", name: "Premium membership", price: "≈€5/month or €39/year (planned)", description: "Unlimited deep pair reports, sync across devices, extra daily guidance. Cancel in one click.", checkoutUrl: null },
];
export const paymentsEnabled = false;
export function startCheckout(id: string): string | null {
  return PAID_EXTRAS.find((x) => x.id === id)?.checkoutUrl ?? null;
}
