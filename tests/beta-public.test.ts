import { describe, it, expect } from "vitest";
import { isPublicRoute } from "@/components/auth/Beta";
import { ROUTE_LOCALES, localizedPath } from "@/lib/i18n-routes";

describe("beta public routes follow the slug map", () => {
  const pub = ["/", "/pricing/", "/horoscope/", "/horoscope/scorpio/", "/horoscope/scorpio/2026-10-13/", "/blog/", "/play/", "/quizzes/", "/learn/", "/how-it-works/", "/daily/"];
  const priv = ["/me/", "/match/", "/chart/", "/premium/checkout/"];
  for (const l of ROUTE_LOCALES) {
    it(`${l}: public pages stay public`, () => { for (const p of pub) expect(isPublicRoute(localizedPath(l, p)), localizedPath(l, p)).toBe(true); });
    it(`${l}: personal pages stay gated`, () => { for (const p of priv) expect(isPublicRoute(localizedPath(l, p)), localizedPath(l, p)).toBe(false); });
  }
  it("works without trailing slash", () => { expect(isPublicRoute("/de")).toBe(true); expect(isPublicRoute("/de/preise")).toBe(true); });
});
