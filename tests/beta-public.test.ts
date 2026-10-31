import { describe, it, expect, vi, afterEach } from "vitest";
import { isPublicRoute, routeGated } from "@/components/auth/Beta";
import { ROUTE_LOCALES, localizedPath } from "@/lib/i18n-routes";
import { settleFlags, type Flags } from "@/lib/flags";

const on: Flags = { private_beta: true, signups_open: false, captcha: true, loaded: true };

describe("beta public routes follow the slug map", () => {
  const pub = ["/", "/pricing/", "/horoscope/", "/horoscope/scorpio/", "/horoscope/scorpio/2026-10-13/", "/blog/", "/play/", "/quizzes/", "/learn/", "/how-it-works/", "/daily/"];
  const priv = ["/me/", "/match/", "/chart/", "/premium/checkout/"];
  for (const l of ROUTE_LOCALES) {
    it(`${l}: public pages stay public`, () => { for (const p of pub) expect(isPublicRoute(localizedPath(l, p)), localizedPath(l, p)).toBe(true); });
    it(`${l}: personal pages stay gated on a beta build`, () => { for (const p of priv) expect(routeGated(localizedPath(l, p), true), localizedPath(l, p)).toBe(true); });
  }
  it("works without trailing slash", () => { expect(isPublicRoute("/de")).toBe(true); expect(isPublicRoute("/de/preise")).toBe(true); });
});

describe("the private beta is over", () => {
  afterEach(() => { vi.unstubAllEnvs(); vi.resetModules(); });
  const build = async (v: string | undefined) => {
    vi.resetModules();
    if (v === undefined) vi.stubEnv("NEXT_PUBLIC_BETA", undefined as unknown as string); else vi.stubEnv("NEXT_PUBLIC_BETA", v);
    const [seo, sb, flags] = await Promise.all([import("@/lib/seo"), import("@/lib/supabase"), import("@/lib/flags")]);
    return { seo, sb, flags };
  };

  it.each([[undefined], ["0"], [""], ["true"]])("is off with NEXT_PUBLIC_BETA=%s", async (v) => {
    const { seo, sb, flags } = await build(v);
    expect(seo.betaOn).toBe(false); expect(sb.betaMode).toBe(false); expect(flags.getFlags().private_beta).toBe(false);
  });
  it('comes back only with NEXT_PUBLIC_BETA="1"', async () => {
    const { seo, sb, flags } = await build("1");
    expect(seo.betaOn).toBe(true); expect(sb.betaMode).toBe(true); expect(flags.getFlags().private_beta).toBe(true);
  });
  it("opens the app routes to search engines by default, and keeps them closed on a beta build", async () => {
    const tools = ["/start/", "/match/", "/bond/", "/deep/", "/quiz/big-five/", "/quiz/four-letter/"];
    const open = await build(undefined);
    for (const p of tools) expect(open.seo.isIndexable(p), p).toBe(true);
    const closed = await build("1");
    for (const p of tools) expect(closed.seo.isIndexable(p), p).toBe(false);
  });
  it("keeps pages that need local data out of the index", async () => {
    const { seo } = await build(undefined);
    for (const p of ["/me/", "/today/", "/people/", "/you/", "/person/", "/book/", "/chart/", "/lens/", "/account/"]) expect(seo.isIndexable(p), p).toBe(false);
  });

  it("does not let a stale or remote switch close the app on a normal build", () => {
    expect(settleFlags(on, false).private_beta).toBe(false);
    expect(settleFlags(on, false).signups_open).toBe(false); // sign-up is decided on the server, so the client keeps telling the truth about it
    expect(settleFlags(on, true).private_beta).toBe(true);
  });
  it("gates no route for a guest on a normal build", () => {
    for (const l of ROUTE_LOCALES) for (const p of ["/me/", "/start/", "/match/", "/bond/", "/deep/", "/quiz/big-five/", "/today/", "/people/", "/chart/", "/book/"]) {
      expect(routeGated(localizedPath(l, p), settleFlags(on, false).private_beta), p).toBe(false);
    }
  });
});
