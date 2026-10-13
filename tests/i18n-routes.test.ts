import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { LOCALES } from "@/content";
import { ROUTE_LOCALES, localizedPath, parsePath, routeAlternates, switchLocale, wrongLocaleRedirects } from "@/lib/i18n-routes";

describe("i18n route map", () => {
  it("covers exactly the content locales", () => expect([...ROUTE_LOCALES]).toEqual([...LOCALES]));
  it("keeps every existing EN/MK URL unchanged", () => {
    expect(localizedPath("en", "/pricing/")).toBe("/en/pricing/");
    expect(localizedPath("mk", "/pricing/")).toBe("/mk/ceni/");
    expect(localizedPath("mk", "/horoscope/")).toBe("/mk/dneven-horoskop/");
    expect(localizedPath("mk", "/horoscope/scorpio/2026-10-13/")).toBe("/mk/dneven-horoskop/skorpija/2026-10-13/");
    expect(localizedPath("en", "/horoscope/scorpio/")).toBe("/en/horoscope/scorpio/");
    expect(localizedPath("mk", "/how-it-works/")).toBe("/mk/how-it-works/");
    expect(localizedPath("mk", "/daily/scorpio/")).toBe("/mk/daily/scorpio/");
    expect(localizedPath("en", "/")).toBe("/en/");
  });
  it("round-trips public URLs", () => {
    for (const p of ["/", "/pricing/", "/horoscope/", "/horoscope/leo/", "/horoscope/leo/2026-10-13/", "/blog/x/"]) for (const l of ROUTE_LOCALES) expect(parsePath(localizedPath(l, p))).toEqual([l, p]);
  });
  it("gives German its own slugs", () => {
    expect(localizedPath("de", "/pricing/")).toBe("/de/preise/");
    expect(localizedPath("de", "/horoscope/scorpio/")).toBe("/de/tageshoroskop/skorpion/");
    expect(localizedPath("de", "/horoscope/leo/2026-10-13/")).toBe("/de/tageshoroskop/loewe/2026-10-13/");
    expect(localizedPath("de", "/blog/x/")).toBe("/de/blog/x/");
  });
  it("builds hreflang with x-default", () => expect(routeAlternates("/pricing/")).toEqual({ en: "/en/pricing/", mk: "/mk/ceni/", de: "/de/preise/", "x-default": "/en/pricing/" }));
  it("switches language to German", () => expect(switchLocale("/mk/dneven-horoskop/oven/", "de")).toBe("/de/tageshoroskop/widder/"));
  it("geo/cookie redirect only touches the bare root, cookie first, temporary status", () => {
    const cfg = JSON.parse(readFileSync("vercel.json", "utf8")) as { routes: { src?: string; status?: number; has?: { type: string; key: string; value: string }[]; headers?: Record<string, string> }[] };
    const root = cfg.routes.filter((r) => r.src === "/");
    expect(root.length).toBeGreaterThan(0);
    for (const r of root) expect([302, 307]).toContain(r.status);
    const firstGeo = root.findIndex((r) => r.has?.[0]?.type === "header");
    const lastCookie = root.map((r) => r.has?.[0]?.type).lastIndexOf("cookie");
    expect(lastCookie).toBeLessThan(firstGeo);
    const to = (country: string) => root.find((r) => r.has?.[0]?.key === "x-vercel-ip-country" && r.has[0].value === country)?.headers?.Location;
    expect(to("MK")).toBe("/mk/"); for (const c of ["DE", "AT", "CH", "LI"]) expect(to(c)).toBe("/de/");
    expect(root.at(-1)).toMatchObject({ headers: { Location: "/en/" } }); expect(root.at(-1)!.has).toBeUndefined();
    // No rule redirects an already-prefixed URL by country or cookie.
    expect(cfg.routes.filter((r) => r.has && r.src !== "/")).toEqual([]);
  });
  it("switches language on localized pages", () => expect(switchLocale("/mk/dneven-horoskop/oven/", "en")).toBe("/en/horoscope/aries/"));
  it("vercel.json 308s every wrong-locale slug", () => {
    const cfg = JSON.parse(readFileSync("vercel.json", "utf8")) as { routes: { src: string; status?: number; headers?: { Location: string } }[] };
    for (const r of wrongLocaleRedirects()) {
      const rule = cfg.routes.find((x) => x.status === 308 && new RegExp(`^${x.src}$`).test(r.source));
      expect(rule, r.source).toBeTruthy();
      expect(rule!.headers!.Location.startsWith(r.destination), r.source).toBe(true);
    }
  });
});
