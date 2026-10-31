import { describe, it, expect } from "vitest";
import { CALCULATORS, type CalcKey, type CalcPage } from "../src/content/calculators";
import { CALC_KEYS } from "../src/lib/sections/calculators";
import { SECTIONS, sectionModel } from "../src/lib/sections";
import { numModel } from "../src/lib/numerology";
import { localizedPath } from "../src/lib/i18n-routes";
import { SIGNS } from "../src/engine/zodiac";

/** The three calculators sit close together in subject, so each one must carry its own weight. */
const LANGS = ["en", "mk", "de", "sr"] as const;
const MIN_WORDS = 1200;
const MAX_JACCARD = 0.1;

const page = (l: string, k: CalcKey): CalcPage => CALCULATORS[l].pages[k];
const text = (p: CalcPage) => [p.h1, p.lead, ...p.sections.flatMap((s) => [s.title, ...(s.paras ?? []), ...(s.list ?? [])]), ...p.faq.flat()].join(" ");
const words = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(Boolean);
const shingles = (w: string[], k = 5) => { const o = new Set<string>(); for (let i = 0; i + k <= w.length; i++) o.add(w.slice(i, i + k).join(" ")); return o; };
const jaccard = (a: Set<string>, b: Set<string>) => { let n = 0; for (const x of a) if (b.has(x)) n++; return n / (a.size + b.size - n || 1); };
const sentences = (s: string) => s.split(/(?<=[.!?])\s+/).map((x) => x.trim().toLowerCase()).filter((x) => x.split(" ").length >= 6);

describe("calculator pages: overlap and depth", () => {
  for (const l of LANGS) {
    it(`${l}: each page has at least ${MIN_WORDS} words`, () => {
      const short = CALC_KEYS.map((k) => [k, words(text(page(l, k))).length]).filter(([, n]) => (n as number) < MIN_WORDS);
      expect(short).toEqual([]);
    });
    it(`${l}: titles and descriptions fit a search result and are unique`, () => {
      const bad = CALC_KEYS.filter((k) => page(l, k).title.length > 55 || page(l, k).description.length < 120 || page(l, k).description.length > 155);
      expect(bad).toEqual([]);
      expect(new Set(CALC_KEYS.map((k) => page(l, k).description)).size).toBe(3);
    });
    it(`${l}: no two pages share more than ${MAX_JACCARD * 100}% of their phrasing`, () => {
      const sh = Object.fromEntries(CALC_KEYS.map((k) => [k, shingles(words(text(page(l, k))))]));
      const bad: string[] = [];
      CALC_KEYS.forEach((a, i) => CALC_KEYS.slice(i + 1).forEach((b) => { const j = jaccard(sh[a], sh[b]); if (j > MAX_JACCARD) bad.push(`${a}/${b}: ${j.toFixed(3)}`); }));
      expect(bad).toEqual([]);
    });
    it(`${l}: sentences are not reused across pages`, () => {
      const seen = new Map<string, string[]>();
      for (const k of CALC_KEYS) for (const s of new Set(sentences(text(page(l, k))))) seen.set(s, [...(seen.get(s) ?? []), k]);
      expect([...seen.entries()].filter(([, ks]) => ks.length > 1).map(([s, ks]) => `${ks.join(",")}: ${s.slice(0, 70)}`)).toEqual([]);
    });
    it(`${l}: every page has an entry for each of the twelve signs`, () => {
      for (const k of CALC_KEYS) expect(page(l, k).sections.filter((s) => (s.list?.length ?? 0) === 12).length).toBeGreaterThanOrEqual(1);
      expect(page(l, "rising-sign").faq.length).toBeGreaterThanOrEqual(5);
    });
    it(`${l}: the language is written, not copied from English`, () => {
      if (l === "en") return;
      const en = CALC_KEYS.flatMap((k) => sentences(text(page("en", k))));
      for (const k of CALC_KEYS) for (const s of sentences(text(page(l, k)))) expect(en).not.toContain(s);
    });
    it(`${l}: the life path calculator page has real depth`, () => {
      const m = numModel(l, "/numerology/calculator/life-path/")!;
      const all = [m.lead, ...m.blocks.flatMap((b) => [...(b.paras ?? []), ...(b.list ?? [])]), ...m.faq.flat()].join(" ");
      expect(words(all).length).toBeGreaterThanOrEqual(600);
      expect(m.description.length).toBeGreaterThanOrEqual(120); expect(m.description.length).toBeLessThanOrEqual(155);
    });
  }
  it("mk: no Latin letters hiding inside Cyrillic words", () => {
    const mixed = /[\p{Script=Cyrillic}][a-zA-Z]|[a-zA-Z][\p{Script=Cyrillic}]/u;
    for (const k of CALC_KEYS) expect(text(page("mk", k)).match(mixed)).toBeNull();
  });
  it("every page routes through the section registry as a calculator", () => {
    for (const k of CALC_KEYS) {
      expect(SECTIONS[k].paths()).toEqual([`/${k}/`]);
      for (const l of LANGS) {
        const m = sectionModel(l, `/${k}/`)!;
        expect([m.kind, m.widget, m.calc]).toEqual(["calc", k, undefined]);
        expect(m.related!.map((r) => r.href)).toContain(localizedPath(l, `/zodiac/${SIGNS[0]}/`));
      }
    }
  });
  it("public URLs match the plan", () => {
    expect(["en", "de", "mk", "sr"].map((l) => localizedPath(l, "/rising-sign/"))).toEqual(["/en/rising-sign-calculator/", "/de/aszendent-berechnen/", "/mk/ascendent-kalkulator/", "/sr/podznak-kalkulator/"]);
    expect(["en", "de", "mk", "sr"].map((l) => localizedPath(l, "/moon-sign/"))).toEqual(["/en/moon-sign-calculator/", "/de/mondzeichen-berechnen/", "/mk/mesecev-znak-kalkulator/", "/sr/mesecev-znak-kalkulator/"]);
    expect(["en", "de", "mk", "sr"].map((l) => localizedPath(l, "/birth-chart/"))).toEqual(["/en/birth-chart-calculator/", "/de/geburtshoroskop-berechnen/", "/mk/natalna-karta-kalkulator/", "/sr/natalna-karta-kalkulator/"]);
  });
});
