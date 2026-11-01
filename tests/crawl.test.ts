/**
 * Static crawl: walks every sitemap page through the links we can read from page models, the header and the footer, and
 * fails on pages no link reaches. It needs no build. `npm run check:site` runs the same check on the real HTML in out/.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { LOCALES } from "@/content";
import { postsFor } from "@/content/blog";
import { SIGNS } from "@/engine/zodiac";
import { publishedDates } from "@/engine/skyday";
import { parsePath, localizedPath, ROUTE_LOCALES } from "@/lib/i18n-routes";
import { numModel, numPaths, type NumModel } from "@/lib/numerology";
import { SECTIONS, sectionModel } from "@/lib/sections";
import { ALL_QUIZ_IDS } from "@/lib/quiz-defs";
import { siteLinks, navFor } from "@/lib/site-links";
import sitemap from "@/app/sitemap";

const internal = (href: string) => parsePath(href.split(/[?#]/)[0])?.[1];
const hrefsOf = (m: NumModel | null) => (m ? [...(m.items ?? []), ...(m.related ?? []), ...(m.prev ? [m.prev] : []), ...(m.next ? [m.next] : [])].map((x) => x.href).concat(m.crumbs.map((c) => c[1])) : []);
/** Paths the header and footer put on every page, read from their source so a removed link cannot go unnoticed. Pricing is built by pricingPath in the header. */
const chrome = [...new Set(["src/components/Chrome.tsx", "src/content/en/nav.ts"].flatMap((f) => [...readFileSync(f, "utf8").matchAll(/"(\/[a-z0-9/-]*\/)"/g)].map((m) => m[1])))].concat("/pricing/");
const sitemapPaths = (lang: string) => sitemap().filter((e) => e.url.includes(`/${lang}/`)).map((e) => parsePath(new URL(e.url).pathname)?.[1]).filter((p): p is string => !!p);

function reachable(lang: string): Set<string> {
  const dates = publishedDates();
  const out = (p: string): string[] => {
    const links = [...hrefsOf(p.startsWith("/numerology/") ? numModel(lang, p) : sectionModel(lang, p))].map(internal).filter((x): x is string => !!x);
    if (p === "/") links.push("/numerology/", "/horoscope/", "/numerology/calculator/life-path/", "/numerology/angel-numbers/", ...SIGNS.map((s) => `/horoscope/${s}/`));
    if (p === "/blog/") links.push(...postsFor(lang).map((x) => `/blog/${x.slug}/`));
    if (p === "/quizzes/") links.push(...ALL_QUIZ_IDS.map((q) => `/quiz/${q}/`), "/deep/", "/bond/"); // the hub in components/pages/QuizHub.tsx
    if (p === "/horoscope/") links.push(...SIGNS.map((s) => `/horoscope/${s}/`));
    const h = p.match(/^\/horoscope\/([a-z]+)\/(?:(\d{4}-\d{2}-\d{2})\/)?$/);
    if (h) { // DailyHoroscope links yesterday and tomorrow when published; the sign page sits on today, whose yesterday is in the archive.
      const i = h[2] ? dates.indexOf(h[2]) : dates.length - 1;
      for (const d of [dates[i - 1], dates[i + 1]]) if (d) links.push(`/horoscope/${h[1]}/${d}/`);
    }
    return links;
  };
  const seen = new Set<string>(["/", ...chrome, ...siteLinks(lang).map((l) => l.href)]);
  const queue = [...seen];
  while (queue.length) for (const n of out(queue.pop()!)) if (!seen.has(n)) { seen.add(n); queue.push(n); }
  return seen;
}

describe("crawlability", () => {
  it.each([...LOCALES])("reaches every sitemap page in %s through links", (lang) => {
    const seen = reachable(lang);
    expect(sitemapPaths(lang).filter((p) => !seen.has(p))).toEqual([]);
  });
  it("links from page models never point at a page that does not exist", () => {
    const known = new Set([...sitemapPaths("en"), ...chrome]); // chrome adds the app routes that stay out of the sitemap
    const empty = Object.values(SECTIONS).filter((s) => !s.paths().length).map((s) => `/${s.key}/`); // filled in by their own workstreams
    const allowed = (p: string) => known.has(p) || empty.some((e) => p.startsWith(e));
    const models = [...numPaths().map((p) => [p, numModel]), ...Object.values(SECTIONS).flatMap((s) => s.paths().map((p) => [p, sectionModel]))] as [string, typeof numModel][];
    const dead = ROUTE_LOCALES.flatMap((l) => models.flatMap(([p, f]) => hrefsOf(f(l, p)).filter((h) => { const i = internal(h); return !i || !allowed(i); }).map((h) => `${l} ${p} -> ${h}`)));
    expect(dead).toEqual([]);
  });
});

describe("site-wide section links", () => {
  const WANT = ["/horoscope/", "/weekly-horoscope/", "/monthly-horoscope/", "/horoscope-2027/", "/zodiac/", "/sign-compatibility/", "/birth-chart/", "/rising-sign/", "/moon-sign/", "/moon-calendar/", "/mercury-retrograde/", "/numerology/"];
  it.each([...LOCALES])("links every section in %s with a label and a line of its own", (lang) => {
    const links = siteLinks(lang);
    expect(links.map((l) => l.href).sort()).toEqual([...WANT].sort());
    for (const l of links) { expect(l.title.length, l.href).toBeGreaterThan(3); expect(l.desc.length, l.href).toBeGreaterThan(10); }
    expect(new Set(links.map((l) => l.title)).size).toBe(links.length);
  });
  it("includes every family in the section registry", () => {
    for (const key of Object.keys(SECTIONS)) expect(WANT).toContain(`/${key}/`);
  });
  it("writes each language natively, in its own words", () => {
    const en = siteLinks("en");
    for (const lang of ["mk", "de", "sr"]) for (const [i, l] of siteLinks(lang).entries()) expect(l.desc, l.href).not.toBe(en[i].desc);
    expect(siteLinks("mk").every((l) => /\p{Script=Cyrillic}/u.test(l.title))).toBe(true);
    expect(siteLinks("de").find((l) => l.href === "/sign-compatibility/")!.title).toBe("Partnerhoroskop");
    expect(siteLinks("de").find((l) => l.href === "/rising-sign/")!.title).toBe("Aszendent berechnen");
  });
  it("adds the footer column title and header group in every language", () => {
    for (const lang of LOCALES) expect(navFor(lang).groups.astrology.linksTitle.length).toBeGreaterThan(10);
    expect(localizedPath("de", siteLinks("de")[0].href)).toBe("/de/tageshoroskop/");
  });
});
