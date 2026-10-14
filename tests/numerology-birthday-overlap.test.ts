import { describe, it, expect } from "vitest";
import { BIRTHDAYS } from "../src/content/numerology/birthdays";
import { BDAY_DAYS } from "../src/lib/numerology";

/** Birthday pages (1 to 31) are a generated family: each page must stand on its own before it joins the sitemap. */
const LANGS = ["en", "mk", "de"] as const;
const MIN_WORDS = 450;
const MAX_JACCARD = 0.12; // share of 5 word shingles two pages may have in common
const MAX_SHARED_SENTENCES = 1;

const text = (lang: string, d: number) => { const b = BIRTHDAYS[lang][d]; return [b.title, b.lead, ...b.sections.flatMap((s) => [s.title, ...s.paras])].join(" "); };
const words = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(Boolean);
const shingles = (w: string[], k = 5) => { const o = new Set<string>(); for (let i = 0; i + k <= w.length; i++) o.add(w.slice(i, i + k).join(" ")); return o; };
const jaccard = (a: Set<string>, b: Set<string>) => { let n = 0; for (const x of a) if (b.has(x)) n++; return n / (a.size + b.size - n || 1); };
const sentences = (s: string) => s.split(/(?<=[.!?])\s+/).map((x) => x.trim().toLowerCase()).filter((x) => x.split(" ").length >= 6);

describe("birthday pages: overlap and depth", () => {
  it("every language has the same set of days, all in 1 to 31", () => {
    expect(BDAY_DAYS.length).toBeGreaterThan(0);
    for (const l of LANGS) expect(Object.keys(BIRTHDAYS[l]).map(Number).sort((a, b) => a - b)).toEqual(BDAY_DAYS);
    for (const d of BDAY_DAYS) expect(d >= 1 && d <= 31).toBe(true);
  });
  for (const l of LANGS) {
    it(`${l}: each page has at least ${MIN_WORDS} words`, () => {
      const short = BDAY_DAYS.map((d) => [d, words(text(l, d)).length]).filter(([, n]) => n < MIN_WORDS);
      expect(short).toEqual([]);
    });
    it(`${l}: no two pages share more than ${MAX_JACCARD * 100}% of their phrasing`, () => {
      const sh = Object.fromEntries(BDAY_DAYS.map((d) => [d, shingles(words(text(l, d)))]));
      const bad: string[] = [];
      for (const a of BDAY_DAYS) for (const b of BDAY_DAYS) if (a < b) { const j = jaccard(sh[a], sh[b]); if (j > MAX_JACCARD) bad.push(`${a}-${b}: ${j.toFixed(3)}`); }
      expect(bad).toEqual([]);
    });
    it(`${l}: sentences are not reused across pages`, () => {
      const seen = new Map<string, number[]>();
      for (const d of BDAY_DAYS) for (const s of new Set(sentences(text(l, d)))) seen.set(s, [...(seen.get(s) ?? []), d]);
      const reused = [...seen.entries()].filter(([, ds]) => ds.length > MAX_SHARED_SENTENCES).map(([s, ds]) => `${ds.join(",")}: ${s.slice(0, 60)}`);
      expect(reused).toEqual([]);
    });
  }
});
