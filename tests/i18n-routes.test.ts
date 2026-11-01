import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { LOCALES } from "@/content";
import { NUM_SLUGS, ROUTE_LOCALES, SECTION_SLUGS, SIGN_SLUGS, isLocalPath, localizedPath, parsePath, routeAlternates, servesFolder, switchLocale, wrongLocaleRedirects } from "@/lib/i18n-routes";
import { languageAlternates } from "@/lib/seo";
import sitemap from "@/app/sitemap";
import { SECTIONS } from "@/lib/sections";
import { ALL_SIGN_PAIRS } from "@/lib/sections/sign-compatibility";
import { modelMeta } from "@/components/numerology/NumPage";
import type { NumModel } from "@/lib/numerology";

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
  it("builds hreflang with x-default", () => expect(routeAlternates("/pricing/")).toEqual({ en: "/en/pricing/", mk: "/mk/ceni/", de: "/de/preise/", sr: "/sr/cene/", "x-default": "/en/pricing/" }));
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
    for (const c of ["RS", "BA", "ME", "HR"]) expect(to(c)).toBe("/sr/");
    expect(root.find((r) => r.has?.[0]?.key === "lang" && r.has[0].value === "sr")?.headers?.Location).toBe("/sr/");
    expect(root.at(-1)).toMatchObject({ headers: { Location: "/en/" } }); expect(root.at(-1)!.has).toBeUndefined();
    // No rule redirects an already-prefixed URL by country or cookie.
    expect(cfg.routes.filter((r) => r.has && r.src !== "/")).toEqual([]);
  });
  it("redirects no real page: a slug shared by two locales stays put in both", () => {
    const cfg = JSON.parse(readFileSync("vercel.json", "utf8")) as { routes: { src?: string; status?: number; handle?: string }[] };
    const before = cfg.routes.slice(0, cfg.routes.findIndex((r) => r.handle === "filesystem")).filter((r) => r.status === 308);
    const rules = before.map((r) => new RegExp(`^${r.src}$`));
    const hit = sitemap().map((e) => new URL(e.url).pathname).filter((p) => rules.some((rx) => rx.test(p)));
    expect(hit).toEqual([]);
    for (const p of ["/mk/numerologija/", "/sr/numerologija/", "/mk/horoskop-2027/oven/", "/sr/horoskop-2027/ovan/", "/mk/mesecev-kalendar/", "/sr/mesecev-kalendar/", "/mk/mesecev-znak-kalkulator/", "/sr/mesecev-znak-kalkulator/", "/mk/natalna-karta-kalkulator/", "/sr/natalna-karta-kalkulator/"]) expect(rules.some((rx) => rx.test(p)), p).toBe(false);
  });
  it("sends every other locale away from a shared folder", () => {
    const cfg = JSON.parse(readFileSync("vercel.json", "utf8")) as { routes: { src: string; status?: number; headers?: { Location: string } }[] };
    const to = (p: string) => cfg.routes.find((r) => r.status === 308 && new RegExp(`^${r.src}$`).test(p))?.headers?.Location;
    expect(to("/de/numerologija/")).toBe("/de/numerologie/"); expect(to("/en/horoskop-2027/ovan/")).toBe("/en/horoscope-2027/");
    expect(to("/sr/numerology/")).toBe("/sr/numerologija/"); expect(to("/sr/ceni/")).toBe("/sr/cene/"); expect(to("/mk/cene/")).toBe("/mk/ceni/");
    expect(to("/sr/dneven-horoskop/oven/")).toBe("/sr/dnevni-horoskop/ovan/"); expect(to("/sr/horoscope/pisces/2026-10-13/")).toBe("/sr/dnevni-horoskop/ribe/");
    expect(to("/mk/dnevni-horoskop/ovan/")).toBe("/mk/dneven-horoskop/oven/"); expect(to("/sr/premium/")).toBe("/sr/cene/");
    expect(to("/sr/dnevni-horoskop/ovan/2026-10-13/")).toBe("/sr/dnevni-horoskop/$1/"); // the dated rule, after the filesystem
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

describe("Serbian", () => {
  it("has the slugs from the brief", () => {
    expect(localizedPath("sr", "/pricing/")).toBe("/sr/cene/");
    expect(localizedPath("sr", "/horoscope/capricorn/2026-10-13/")).toBe("/sr/dnevni-horoskop/jarac/2026-10-13/");
    expect(localizedPath("sr", "/numerology/angel-numbers/111/")).toBe("/sr/numerologija/andjeoski-brojevi/111/");
    expect(localizedPath("sr", "/numerology/calculator/name/")).toBe("/sr/numerologija/kalkulator/ime/");
    expect(localizedPath("sr", "/numerology/compatibility/1-and-22/")).toBe("/sr/numerologija/kompatibilnost/1-i-22/");
    expect(localizedPath("sr", "/numerology/mirror-hours/11-11/")).toBe("/sr/numerologija/ogledalni-sati/11-11/");
    expect(localizedPath("sr", "/sign-compatibility/sagittarius-and-pisces/")).toBe("/sr/kompatibilnost-znakova/strelac-i-ribe/");
    expect(localizedPath("sr", "/mercury-retrograde/2027/")).toBe("/sr/retrogradni-merkur/2027/");
    expect(Object.values(NUM_SLUGS).every((row) => row.sr)).toBe(true);
    expect(Object.values(SECTION_SLUGS).every((row) => row.sr)).toBe(true);
    expect(Object.values(SIGN_SLUGS.sr)).toEqual(["ovan", "bik", "blizanci", "rak", "lav", "devica", "vaga", "skorpija", "strelac", "jarac", "vodolija", "ribe"]);
  });
  it("switches between Macedonian and Serbian on a shared slug", () => {
    expect(switchLocale("/mk/numerologija/angelski-broevi/111/", "sr")).toBe("/sr/numerologija/andjeoski-brojevi/111/");
    expect(switchLocale("/sr/horoskop-2027/ovan/", "mk")).toBe("/mk/horoskop-2027/oven/");
  });
  it("gives a shared folder to both locales and nobody else", () => {
    for (const [section, owner] of [["numerology", "mk"], ["horoscope-2027", "mk"], ["moon-calendar", "mk"], ["moon-sign", "mk"], ["birth-chart", "mk"]]) {
      expect(servesFolder("mk", section, owner), section).toBe(true); expect(servesFolder("sr", section, owner), section).toBe(true);
      expect(servesFolder("en", section, owner), section).toBe(false); expect(servesFolder("de", section, owner), section).toBe(false);
    }
    expect(servesFolder("sr", "pricing", "mk")).toBe(false); expect(servesFolder("sr", "pricing", "sr")).toBe(true); expect(servesFolder("mk", "zodiac", "sr")).toBe(false);
  });
  it("names no owner in a shared folder, so neither locale can 404 there", () => {
    for (const f of ["numerologija/page.tsx", "numerologija/[...slug]/page.tsx", "horoskop-2027/page.tsx", "horoskop-2027/[...slug]/page.tsx", "mesecev-kalendar/page.tsx", "mesecev-kalendar/[...slug]/page.tsx", "mesecev-znak-kalkulator/page.tsx", "natalna-karta-kalkulator/page.tsx"]) {
      expect(readFileSync(`src/app/[lang]/${f}`, "utf8"), f).not.toMatch(/lang [!=]== "mk"/);
    }
  });
  it("keeps a shared folder in the export for both locales", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "prune-"));
    for (const d of ["sr/numerologija", "mk/numerologija", "de/numerologija", "en/numerologija", "sr/ceni", "mk/cene", "sr/cene"]) mkdirSync(path.join(dir, "out", d), { recursive: true });
    execFileSync(process.execPath, [path.resolve("scripts/prune-locale-shells.mjs")], { cwd: dir });
    const has = (d: string) => existsSync(path.join(dir, "out", d));
    expect([has("sr/numerologija"), has("mk/numerologija"), has("sr/cene")]).toEqual([true, true, true]);
    expect([has("de/numerologija"), has("en/numerologija"), has("sr/ceni"), has("mk/cene")]).toEqual([false, false, false, false]);
    rmSync(dir, { recursive: true, force: true });
  });
  it("has every page in Serbian, legal pages and open tools included", () => {
    for (const p of ["/privacy/", "/terms/", "/promise/", "/learn/", "/deep/", "/quiz/big-five/", "/start/", "/match/", "/bond/", "/email/"]) expect(languageAlternates(p).sr, p).toBe(`/sr${p}`);
    for (const f of ["privacy", "terms", "promise", "learn"]) expect(readFileSync(`src/app/[lang]/${f}/page.tsx`, "utf8"), f).toContain("function PageSr");
  });
  it("accepts a return path in every locale, and nothing off the site", () => {
    for (const l of ROUTE_LOCALES) expect(isLocalPath(`/${l}/me/`), l).toBe(true);
    for (const p of ["/fr/me/", "//evil.example/", "https://evil.example/", "/sr/../x?y=1"]) expect(isLocalPath(p), p).toBe(false);
  });
});

describe("new URL families", () => {
  const PAGES = ["/zodiac/", "/zodiac/aries/", "/zodiac/capricorn/", "/weekly-horoscope/", "/weekly-horoscope/leo/", "/monthly-horoscope/", "/monthly-horoscope/leo/", "/horoscope-2027/", "/horoscope-2027/pisces/", "/sign-compatibility/", "/sign-compatibility/aries-and-leo/", "/sign-compatibility/leo-and-leo/", "/sign-compatibility/sagittarius-and-capricorn/", "/rising-sign/", "/moon-sign/", "/birth-chart/", "/moon-calendar/", "/moon-calendar/2026-11/", "/mercury-retrograde/", "/mercury-retrograde/2027/"];
  it("round-trips every family in every locale", () => {
    for (const p of PAGES) for (const l of ROUTE_LOCALES) expect(parsePath(localizedPath(l, p)), `${l} ${p}`).toEqual([l, p]);
  });
  it("uses the native slug per locale", () => {
    expect(localizedPath("en", "/zodiac/aries/")).toBe("/en/zodiac-signs/aries/");
    expect(localizedPath("mk", "/zodiac/aries/")).toBe("/mk/horoskopski-znaci/oven/");
    expect(localizedPath("de", "/zodiac/aries/")).toBe("/de/sternzeichen/widder/");
    expect(localizedPath("de", "/weekly-horoscope/scorpio/")).toBe("/de/wochenhoroskop/skorpion/");
    expect(localizedPath("mk", "/monthly-horoscope/scorpio/")).toBe("/mk/mesecen-horoskop/skorpija/");
    expect(localizedPath("de", "/horoscope-2027/leo/")).toBe("/de/jahreshoroskop-2027/loewe/");
    expect(localizedPath("de", "/rising-sign/")).toBe("/de/aszendent-berechnen/");
    expect(localizedPath("de", "/moon-sign/")).toBe("/de/mondzeichen-berechnen/");
    expect(localizedPath("de", "/birth-chart/")).toBe("/de/geburtshoroskop-berechnen/");
    expect(localizedPath("mk", "/moon-calendar/")).toBe("/mk/mesecev-kalendar/");
    expect(localizedPath("de", "/mercury-retrograde/")).toBe("/de/merkur-ruecklaeufig/");
  });
  it("localizes both signs and the joiner in a pair slug", () => {
    expect(localizedPath("en", "/sign-compatibility/aries-and-leo/")).toBe("/en/zodiac-compatibility/aries-and-leo/");
    expect(localizedPath("de", "/sign-compatibility/aries-and-leo/")).toBe("/de/partnerhoroskop/widder-und-loewe/");
    expect(localizedPath("mk", "/sign-compatibility/aries-and-leo/")).toBe("/mk/kompatibilnost-na-znaci/oven-i-lav/");
    expect(parsePath("/de/partnerhoroskop/widder-und-loewe/")).toEqual(["de", "/sign-compatibility/aries-and-leo/"]);
    expect(parsePath("/mk/kompatibilnost-na-znaci/oven-i-lav/")).toEqual(["mk", "/sign-compatibility/aries-and-leo/"]);
    expect(switchLocale("/de/partnerhoroskop/widder-und-loewe/", "mk")).toBe("/mk/kompatibilnost-na-znaci/oven-i-lav/");
  });
  it("gives every pair page a distinct URL per locale that reads back to the same pair", () => {
    for (const k of ALL_SIGN_PAIRS) for (const l of ROUTE_LOCALES) expect(parsePath(localizedPath(l, `/sign-compatibility/${k}/`))).toEqual([l, `/sign-compatibility/${k}/`]);
  });
  it("switches language on every family", () => {
    for (const p of PAGES) for (const from of ROUTE_LOCALES) for (const to of ROUTE_LOCALES) expect(switchLocale(localizedPath(from, p), to)).toBe(localizedPath(to, p));
  });
  it("builds hreflang for all locales plus x-default on English", () => {
    for (const p of PAGES) {
      const a = languageAlternates(p);
      expect(Object.keys(a).sort()).toEqual(["de", "en", "mk", "sr", "x-default"]);
      expect(a["x-default"]).toBe(a.en);
      for (const l of ROUTE_LOCALES) expect(a[l]).toBe(localizedPath(l, p));
    }
  });
  it("registers every family with a slug row and a route folder for each locale", () => {
    for (const key of Object.keys(SECTIONS)) for (const l of ROUTE_LOCALES) {
      const slug = SECTION_SLUGS[key]?.[l];
      expect(slug, `${key} ${l}`).toBeTruthy();
      expect(existsSync(`src/app/[lang]/${slug}/page.tsx`), `${key} ${l}`).toBe(true);
    }
  });
  it("prunes every wrong-locale folder", () => {
    const prune = readFileSync("scripts/prune-locale-shells.mjs", "utf8");
    for (const row of Object.values(SECTION_SLUGS)) for (const slug of Object.values(row)) expect(prune, slug).toContain(`"${slug}"`);
  });
  it("gives a section page a self canonical and the full hreflang set", () => {
    const m = { path: "/sign-compatibility/aries-and-leo/", kind: "article", eyebrow: "", h1: "", title: "T", description: "D", lead: "", blocks: [], faq: [], crumbs: [] } as NumModel;
    for (const l of ROUTE_LOCALES) {
      const a = modelMeta(l, m).alternates!;
      expect(a.canonical).toBe(localizedPath(l, m.path));
      expect(a.languages).toEqual(routeAlternates(m.path));
    }
  });
  it("sets html lang from the route locale", () => {
    expect(readFileSync("src/app/[lang]/layout.tsx", "utf8")).toContain("<html lang={lang}");
  });
});
