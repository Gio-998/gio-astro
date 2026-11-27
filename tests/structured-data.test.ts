import { describe, it, expect } from "vitest";
import { LOCALES } from "../src/content";
import { numModel, numPaths, type NumModel } from "../src/lib/numerology";
import { SECTIONS, sectionModel } from "../src/lib/sections";
import { numLd } from "../src/lib/num-ld";
import { localizedPath } from "../src/lib/i18n-routes";
import { SITE_URL } from "../src/lib/site-url";
import { checkPage } from "../scripts/check-schema.mjs";

type Node = Record<string, unknown> & { "@type": string };
const ISO = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2})?([+-]\d{2}:\d{2}|Z))?$/;
const paths: { lang: string; path: string; m: NumModel }[] = [];
for (const lang of LOCALES) {
  for (const p of numPaths()) { const m = numModel(lang, p); if (m) paths.push({ lang, path: p, m }); }
  for (const s of Object.values(SECTIONS)) for (const p of s.paths()) { const m = sectionModel(lang, p); if (m) paths.push({ lang, path: p, m }); }
}
const FAQ_FAMILY = [/^\/numerology\/angel-numbers\//, /^\/mercury-retrograde\//, /^\/numerology\/personal-year(-2027)?\//];

describe("structured data of every numerology and section page", () => {
  it("covers all four languages and over a thousand pages", () => { expect(new Set(paths.map((p) => p.lang)).size).toBe(4); expect(paths.length).toBeGreaterThan(1000); });
  it("parses as JSON, and every node has a schema.org context and type", () => {
    for (const { lang, m, path } of paths) {
      const ld = JSON.parse(JSON.stringify(numLd(lang, m))) as Node[];
      for (const n of ld) { expect(n["@context"], `${lang}${path}`).toBe("https://schema.org"); expect(typeof n["@type"]).toBe("string"); }
    }
  });
  it("every BreadcrumbList item has a name, a position and an absolute URL, and ends on the page itself", () => {
    const bad: string[] = [];
    for (const { lang, m, path } of paths) {
      const b = (numLd(lang, m) as Node[]).find((n) => n["@type"] === "BreadcrumbList")!;
      const items = b.itemListElement as { position: number; name: string; item: string }[];
      if (items.length < 2) bad.push(`${lang}${path}: ${items.length} items`);
      items.forEach((it, i) => { if (!it.name?.trim()) bad.push(`${lang}${path}: item ${i + 1} has no name`); if (it.position !== i + 1) bad.push(`${lang}${path}: position`); if (!it.item.startsWith(`${SITE_URL}/`)) bad.push(`${lang}${path}: item URL`); });
      if (items.at(-1)!.item !== `${SITE_URL}${localizedPath(lang, path)}`) bad.push(`${lang}${path}: last item is ${items.at(-1)!.item}`);
    }
    expect(bad.slice(0, 20)).toEqual([]);
  });
  it("angel number, Mercury retrograde and personal year pages carry a FAQPage with at least 2 questions that are on the page", () => {
    const bad: string[] = [];
    for (const { lang, m, path } of paths.filter((p) => FAQ_FAMILY.some((rx) => rx.test(p.path)))) {
      const f = (numLd(lang, m) as Node[]).find((n) => n["@type"] === "FAQPage");
      const q = (f?.mainEntity ?? []) as { name: string; acceptedAnswer: { text: string } }[];
      if (q.length < 2) bad.push(`${lang}${path}: ${q.length} questions`);
      if (q.some((x) => !x.name.trim() || x.acceptedAnswer.text.split(/\s+/).length < 5)) bad.push(`${lang}${path}: empty or one-word answer`);
      if (!m.faq.every(([a]) => q.some((x) => x.name === a))) bad.push(`${lang}${path}: FAQ differs from the page`);
    }
    expect(bad.slice(0, 20)).toEqual([]);
    expect(paths.filter((p) => FAQ_FAMILY.some((rx) => rx.test(p.path))).length).toBeGreaterThan(200);
  });
  it("every page has an Article (or a WebPage) with real dates, modified never before published", () => {
    const bad: string[] = [];
    for (const { lang, m, path } of paths) {
      const a = (numLd(lang, m) as Node[]).find((n) => n["@type"] === (m.kind === "article" ? "Article" : "WebPage"));
      if (!a) { bad.push(`${lang}${path}: no ${m.kind === "article" ? "Article" : "WebPage"}`); continue; }
      const { datePublished: p, dateModified: d } = a as { datePublished: string; dateModified: string };
      if (!ISO.test(p) || !ISO.test(d)) bad.push(`${lang}${path}: ${p} ${d}`); else if (d < p) bad.push(`${lang}${path}: modified before published`);
    }
    expect(bad.slice(0, 20)).toEqual([]);
  });
});

describe("check:schema rules added for coverage and breadcrumb names", () => {
  const page = (...nodes: object[]) => `<script type="application/ld+json">${JSON.stringify(nodes.map((n) => ({ "@context": "https://schema.org", ...n })))}</script><body>x</body>`;
  const crumbs = (name: string) => ({ "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://horoscop.si/en/" }, { "@type": "ListItem", position: 2, name, item: "https://horoscop.si/en/x/" }] });
  it("flags a breadcrumb item without a name", () => {
    expect(checkPage(page(crumbs("Page")), "en").filter(([k]) => k === "breadcrumb")).toEqual([]);
    expect(checkPage(page(crumbs("")), "en").filter(([k]) => k === "breadcrumb")).toEqual([["breadcrumb", "an item has no name"]]);
  });
  it("flags an angel number page without FAQPage, and a dated daily page without Article dates", () => {
    expect(checkPage(page(crumbs("1111")), "de", "numerologie/engelszahlen/1111/").filter(([k]) => k === "coverage")).toEqual([["coverage", "FAQPage missing"]]);
    expect(checkPage(page(crumbs("Widder")), "de", "tageshoroskop/widder/2026-11-27/").filter(([k]) => k === "coverage")).toEqual([["coverage", "Article missing"]]);
    expect(checkPage(page(crumbs("Widder")), "de", "tageshoroskop/widder/").filter(([k]) => k === "coverage")).toEqual([]);
    expect(checkPage(page(crumbs("Lebenszahl")), "de", "numerologie/lebenszahl/1/").filter(([k]) => k === "coverage")).toEqual([]);
  });
});
