import { describe, it, expect } from "vitest";
import { isBundled, APP_SECTIONS } from "@/app-mode/routes";
import { APP_COPY } from "@/app-mode/copy";
import { shouldOfferReminder } from "@/app-mode/prefs";
import { auth as enAuth } from "@/content/en/ui";
import { auth as mkAuth } from "@/content/mk/ui";
import { auth as deAuth } from "@/content/de/ui";
import { auth as srAuth } from "@/content/sr/ui";
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

describe("store app: notification pre-prompt timing", () => {
  const base = { hasSign: true, reminderOn: false, dismissed: false, permission: "prompt" };
  it("does not offer on the first Today visit", () => {
    expect(shouldOfferReminder({ ...base, visitCount: 1 })).toBe(false);
  });
  it("offers on a later Today visit when a sign is known and permission is still a prompt", () => {
    expect(shouldOfferReminder({ ...base, visitCount: 2 })).toBe(true);
  });
  it("does not offer when there is no sign, the reminder is on, the prompt was dismissed, or permission is already decided", () => {
    expect(shouldOfferReminder({ ...base, visitCount: 2, hasSign: false })).toBe(false);
    expect(shouldOfferReminder({ ...base, visitCount: 2, reminderOn: true })).toBe(false);
    expect(shouldOfferReminder({ ...base, visitCount: 2, dismissed: true })).toBe(false);
    expect(shouldOfferReminder({ ...base, visitCount: 2, permission: "granted" })).toBe(false);
    expect(shouldOfferReminder({ ...base, visitCount: 2, permission: "denied" })).toBe(false);
  });
});

describe("delete-account confirmation mentions store subscriptions", () => {
  it("tells the person in every language that App Store and Google Play billing continue until cancelled in the store", () => {
    for (const A of [enAuth, mkAuth, deAuth, srAuth]) {
      expect(A.deleteConfirmSub).toMatch(/App Store/);
      expect(A.deleteConfirmSub).toMatch(/Google Play/);
      expect(A.deleteManageApple.length).toBeGreaterThan(8);
      expect(A.deleteManageGoogle.length).toBeGreaterThan(8);
    }
    const mk = mkAuth.deleteConfirm + mkAuth.deleteConfirmSub + mkAuth.deleteManageApple + mkAuth.deleteManageGoogle + mkAuth.deleteKeep;
    expect(mk).not.toMatch(/[а-ш]\/[а-ш]/i);
  });
});
