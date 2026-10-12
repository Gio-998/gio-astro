import { describe, expect, it } from "vitest";
import { PLAN_PRICES, yearlySaving } from "@/lib/pricing";
import { SKUS, OFFERS, yearlySavePct, eur, skusOf, PAYWALL_LIVE } from "@/lib/payments";
import { premium as en } from "@/content/en/premium";
import { premium as mk } from "@/content/mk/premium";

describe("premium catalog", () => {
  it("has the agreed prices", () => {
    expect(SKUS["premium-monthly"].cents).toBe(PLAN_PRICES.plus.month);
    expect(SKUS["premium-yearly"].cents).toBe(PLAN_PRICES.plus.year);
    expect(yearlySavePct).toBe(yearlySaving("plus"));
    expect(eur(499, "en")).toBe("€4.99"); expect(eur(3900, "mk")).toBe("39 €"); expect(eur(14900, "en")).toBe("€149");
  });
  it("every offer has copy in both languages, with options for each sku", () => {
    for (const id of OFFERS) {
      for (const T of [en, mk]) {
        const o = T.products[id];
        expect(o?.name, id).toBeTruthy();
        expect(o.sample.length).toBeGreaterThan(0);
        if (skusOf(id).length > 1) for (const s of skusOf(id)) expect(o.options?.[s]?.label, s).toBeTruthy();
      }
    }
  });
  it("paywall stays off for regular users during the demo", () => { expect(PAYWALL_LIVE).toBe(false); });
});
