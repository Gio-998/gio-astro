import { describe, it, expect } from "vitest";
import { ANGEL, CALCS, LIFE, MIRROR_KEYS, YEARS, numModel, numPaths } from "../src/lib/numerology";
import { SNIPPETS, pageSnippet } from "../src/content/numerology/snippets";
import { HOME_META } from "../src/content/home-meta";
import { bankFor } from "../src/lib/horoscope";

/** What a page shows in search results. Pages ranked well and drew no clicks while one template wrote every snippet, so these rules guard against that coming back. */
const LANGS = ["en", "de", "sr"] as const;
const TITLE_MAX = 55; const DESC_MIN = 110; const DESC_MAX = 158;
const keyOf = (p: string) => p.split("/").filter(Boolean).slice(1).join("/") || "hub";
const pages = (l: string) => numPaths().map((p) => ({ p, m: numModel(l, p)! }));
const dupes = (rows: [string, string][]) => { const seen = new Map<string, string[]>(); for (const [v, p] of rows) seen.set(v, [...(seen.get(v) ?? []), p]); return [...seen.entries()].filter(([, ps]) => ps.length > 1).map(([v, ps]) => `${ps.join(" + ")}: ${v}`); };
/** The last few words of a description: where a template's closing clause shows up. */
const ending = (d: string, n = 4) => d.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(Boolean).slice(-n).join(" ");

describe("numerology search snippets", () => {
  for (const l of LANGS) {
    it(`${l}: every title is at most ${TITLE_MAX} characters`, () => {
      expect(pages(l).filter(({ m }) => m.title.length > TITLE_MAX).map(({ p, m }) => `${p} (${m.title.length}): ${m.title}`)).toEqual([]);
    });
    it(`${l}: every description is ${DESC_MIN} to ${DESC_MAX} characters`, () => {
      expect(pages(l).filter(({ m }) => m.description.length < DESC_MIN || m.description.length > DESC_MAX).map(({ p, m }) => `${p} (${m.description.length})`)).toEqual([]);
    });
    it(`${l}: no two pages share a description or a title`, () => {
      expect(dupes(pages(l).map(({ p, m }) => [m.description, p]))).toEqual([]);
      expect(dupes(pages(l).map(({ p, m }) => [m.title, p]))).toEqual([]);
    });
    it(`${l}: no shared closing clause`, () => {
      expect(dupes(pages(l).map(({ p, m }) => [ending(m.description), p]))).toEqual([]);
    });
    it(`${l}: every description is a finished sentence, not a cut off lead`, () => {
      expect(pages(l).filter(({ m }) => !/[.!?]$/.test(m.description)).map(({ p, m }) => `${p}: ${m.description}`)).toEqual([]);
    });
    it(`${l}: every page has its own snippet, and every snippet belongs to a page`, () => {
      const keys = numPaths().map(keyOf);
      expect(keys.filter((k) => !pageSnippet(l, k))).toEqual([]);
      expect(Object.keys(SNIPPETS[l]).filter((k) => !keys.includes(k))).toEqual([]);
    });
    it(`${l}: angel number and mirror hour titles use the words people type`, () => {
      const word = l === "de" ? /Bedeutung/ : l === "sr" ? /značenje/i : /meaning/;
      const bad = [...ANGEL.map((a) => [`/numerology/angel-numbers/${a}/`, a]), ...MIRROR_KEYS.map((k) => [`/numerology/mirror-hours/${k}/`, k.replace("-", ":")])]
        .map(([p, n]) => [p, n, numModel(l, p)!.title]).filter(([, n, t]) => !t.includes(n) || !word.test(t));
      expect(bad).toEqual([]);
    });
    it(`${l}: the number leads each of its pages' descriptions or names it`, () => {
      const need = [...ANGEL.map((a) => [`/numerology/angel-numbers/${a}/`, a]), ...LIFE.map((n) => [`/numerology/life-path/${n}/`, String(n)]), ...YEARS.map((n) => [`/numerology/personal-year/${n}/`, String(n)]), ...MIRROR_KEYS.map((k) => [`/numerology/mirror-hours/${k}/`, k.replace("-", ":")])];
      expect(need.filter(([p, n]) => !numModel(l, p)!.description.includes(n)).map(([p]) => p)).toEqual([]);
    });
    it(`${l}: calculator pages say what they calculate`, () => {
      for (const c of CALCS) expect(numModel(l, `/numerology/calculator/${c}/`)!.title.toLowerCase()).toMatch(l === "de" ? /berechnen/ : l === "sr" ? /kalkulator/ : /calculator/);
    });
  }
});

describe("home and daily horoscope hub snippets", () => {
  for (const l of LANGS) {
    it(`${l}: home title and description fit`, () => {
      expect(HOME_META[l].title.length).toBeLessThanOrEqual(TITLE_MAX);
      expect(HOME_META[l].description.length).toBeGreaterThanOrEqual(DESC_MIN);
      expect(HOME_META[l].description.length).toBeLessThanOrEqual(DESC_MAX);
    });
    it(`${l}: horoscope hub fits on the longest date and is more than the on page line`, () => {
      const U = bankFor(l).ui; const longest = l === "de" ? "30. September 2026" : l === "sr" ? "30. septembar 2026." : "30 September 2026";
      expect(`${U.hubSeoTitle}, ${longest}`.length).toBeLessThanOrEqual(TITLE_MAX);
      expect(U.hubMeta!.length).toBeGreaterThanOrEqual(DESC_MIN);
      expect(U.hubMeta!.length).toBeLessThanOrEqual(DESC_MAX);
      expect(U.hubMeta).not.toBe(U.hubSub);
    });
  }
});
