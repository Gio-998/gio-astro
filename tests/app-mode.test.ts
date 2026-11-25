import { describe, it, expect } from "vitest";
import { isBundled, APP_SECTIONS } from "@/app-mode/routes";
import { APP_COPY } from "@/app-mode/copy";
import { reading } from "@/lib/horoscope";
import { addDays, todayIso } from "@/engine/skyday";

describe("store app: which routes ship in out-app/", () => {
  it("keeps today, sign pages, tools and account in every language", () => {
    for (const p of ["/", "/en/", "/en/today/", "/mk/dneven-horoskop/oven/", "/de/tageshoroskop/widder/", "/sr/dnevni-horoskop/ovan/", "/en/account/", "/mk/ascendent-kalkulator/", "/en/quiz/big-five/", "/sr/auth/callback/"]) expect(isBundled(p), p).toBe(true);
  });
  it("leaves out the dated archive, blog, admin, payment and date-bound SEO sections", () => {
    for (const p of ["/en/horoscope/aries/2026-11-20/", "/mk/dneven-horoskop/oven/2026-10-01/", "/en/blog/", "/en/admin/", "/en/pricing/", "/mk/ceni/", "/en/premium/", "/en/upgrade/", "/mk/numerologija/", "/en/weekly-horoscope/", "/de/mondkalender/", "/en/partners/"]) expect(isBundled(p), p).toBe(false);
  });
  it("never lists a payment section", () => { for (const s of ["pricing", "premium", "upgrade"]) expect(APP_SECTIONS).not.toContain(s); });
});

describe("store app: daily text is computed per date, not frozen at build time", () => {
  it("gives different text for two different dates", () => {
    const t = todayIso(); const a = reading("mk", "aries", t); const b = reading("mk", "aries", addDays(t, 1)); const c = reading("en", "leo", addDays(t, -14));
    expect(a.iso).not.toBe(b.iso);
    expect(`${a.headline} ${a.overview}`).not.toBe(`${b.headline} ${b.overview}`);
    expect(c.overview.length).toBeGreaterThan(20);
  });
});

describe("store app copy", () => {
  it("has every key in all four languages, and no slash forms in Macedonian", () => {
    const keys = (o: object): string[] => Object.entries(o).flatMap(([k, v]) => (v && typeof v === "object" ? keys(v).map((x) => `${k}.${x}`) : [k]));
    const en = keys(APP_COPY.en).sort();
    for (const l of ["mk", "de", "sr"] as const) expect(keys(APP_COPY[l]).sort(), l).toEqual(en);
    const mk = JSON.stringify(APP_COPY.mk) + APP_COPY.mk.reminder.notifTitle("Овен");
    expect(mk).not.toMatch(/[а-ш]\/[а-ш]/i);
  });
});
