import { describe, it, expect } from "vitest";
import { ANGEL, numModel } from "../src/lib/numerology";

/** Angel numbers added from Search Console demand must match the depth of the family and read as their own page against every other angel page. */
const LANGS = ["en", "mk", "de", "sr"] as const;
const NEW = ["1331", "1551", "1616", "1818", "6666"];
const MIN_WORDS = 1400;
const MAX_JACCARD = 0.12;

// The digits block is built from shared character lines, so it stays out of the comparison.
const text = (lang: string, n: string) => numModel(lang, `/numerology/angel-numbers/${n}/`)!.blocks.filter((b) => b.id !== "digits").flatMap((b) => [b.title, ...(b.paras ?? []), ...(b.list ?? []), b.quote ?? ""]).join(" ");
const words = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(Boolean);
const shingles = (w: string[], k = 5) => { const o = new Set<string>(); for (let i = 0; i + k <= w.length; i++) o.add(w.slice(i, i + k).join(" ")); return o; };
const jaccard = (a: Set<string>, b: Set<string>) => { let n = 0; for (const x of a) if (b.has(x)) n++; return n / (a.size + b.size - n || 1); };
const sentences = (s: string) => s.split(/(?<=[.!?])\s+/).map((x) => x.trim().toLowerCase()).filter((x) => x.split(" ").length >= 6);

describe("new angel number pages: depth and overlap", () => {
  it("every new number is routed", () => { for (const n of NEW) expect(ANGEL as readonly string[]).toContain(n); });
  for (const l of LANGS) {
    it(`${l}: each new page has at least ${MIN_WORDS} words`, () => {
      expect(NEW.map((n) => [n, words(text(l, n)).length]).filter(([, c]) => (c as number) < MIN_WORDS)).toEqual([]);
    });
    it(`${l}: no new page shares more than ${MAX_JACCARD * 100}% of its phrasing with any other angel page`, () => {
      const sh = Object.fromEntries(ANGEL.map((n) => [n, shingles(words(text(l, n)))]));
      const bad: string[] = [];
      for (const a of NEW) for (const b of ANGEL) { if (a === b || (NEW.includes(b) && b < a)) continue; const j = jaccard(sh[a], sh[b]); if (j > MAX_JACCARD) bad.push(`${a}/${b}: ${j.toFixed(3)}`); }
      expect(bad).toEqual([]);
    });
    it(`${l}: new pages reuse no sentence from any other angel page`, () => {
      const own = Object.fromEntries(ANGEL.map((n) => [n, new Set(sentences(text(l, n)))]));
      const reused: string[] = [];
      for (const a of NEW) for (const b of ANGEL) { if (a === b) continue; for (const s of own[a]) if (own[b].has(s)) reused.push(`${a}/${b}: ${s.slice(0, 60)}`); }
      expect(reused).toEqual([]);
    });
  }
});
