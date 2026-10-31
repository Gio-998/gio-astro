import { describe, it, expect } from "vitest";
import { SIGN_PAIRS } from "../src/content/sign-compat";
import { SIGN_PAIR_KEYS, ALL_SIGN_PAIRS, signCompatibility } from "../src/lib/sections/sign-compatibility";

/** Zodiac pair pages are a large family: each must stand on its own before it joins the sitemap. */
const LANGS = ["en", "mk", "de"] as const;
const MIN_WORDS = 450;
const MAX_JACCARD = 0.1; // share of 5 word shingles two pages may have in common
const MAX_SHARED_SENTENCES = 1;

const text = (lang: string, k: string) => { const p = SIGN_PAIRS[lang][k]; return [p.title, p.lead, ...p.sections.flatMap((s) => [s.title, ...s.paras]), ...p.faq.flat()].join(" "); };
const words = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(Boolean);
const shingles = (w: string[], k = 5) => { const o = new Set<string>(); for (let i = 0; i + k <= w.length; i++) o.add(w.slice(i, i + k).join(" ")); return o; };
const jaccard = (a: Set<string>, b: Set<string>) => { let n = 0; for (const x of a) if (b.has(x)) n++; return n / (a.size + b.size - n || 1); };
const sentences = (s: string) => s.split(/(?<=[.!?])\s+/).map((x) => x.trim().toLowerCase()).filter((x) => x.split(" ").length >= 6);

describe("zodiac pair pages: overlap and depth", () => {
  it("there are exactly 78 possible pairs", () => expect(ALL_SIGN_PAIRS.length).toBe(78));
  it("every key is a valid pair and every language has the same set", () => {
    for (const l of LANGS) for (const k of Object.keys(SIGN_PAIRS[l])) expect(ALL_SIGN_PAIRS).toContain(k);
    for (const l of LANGS) expect(Object.keys(SIGN_PAIRS[l]).filter((k) => !SIGN_PAIR_KEYS.includes(k))).toEqual([]);
  });
  it("only finished pairs are routed", () => {
    const routed = signCompatibility.paths().filter((p) => p !== "/sign-compatibility/").length;
    expect(routed).toBe(SIGN_PAIR_KEYS.length);
  });
  for (const l of LANGS) {
    it(`${l}: each page has at least ${MIN_WORDS} words`, () => {
      const short = SIGN_PAIR_KEYS.map((k) => [k, words(text(l, k)).length]).filter(([, n]) => (n as number) < MIN_WORDS);
      expect(short).toEqual([]);
    });
    it(`${l}: titles fit a search result`, () => {
      const bad = SIGN_PAIR_KEYS.filter((k) => SIGN_PAIRS[l][k].metaTitle.length > 60 || SIGN_PAIRS[l][k].description.length > 158);
      expect(bad).toEqual([]);
    });
    it(`${l}: no two pages share more than ${MAX_JACCARD * 100}% of their phrasing`, () => {
      const sh = Object.fromEntries(SIGN_PAIR_KEYS.map((k) => [k, shingles(words(text(l, k)))]));
      const bad: string[] = [];
      SIGN_PAIR_KEYS.forEach((a, i) => SIGN_PAIR_KEYS.slice(i + 1).forEach((b) => { const j = jaccard(sh[a], sh[b]); if (j > MAX_JACCARD) bad.push(`${a}/${b}: ${j.toFixed(3)}`); }));
      expect(bad).toEqual([]);
    });
    it(`${l}: sentences are not reused across pages`, () => {
      const seen = new Map<string, string[]>();
      for (const k of SIGN_PAIR_KEYS) for (const s of new Set(sentences(text(l, k)))) seen.set(s, [...(seen.get(s) ?? []), k]);
      const reused = [...seen.entries()].filter(([, ks]) => ks.length > MAX_SHARED_SENTENCES).map(([s, ks]) => `${ks.join(",")}: ${s.slice(0, 60)}`);
      expect(reused).toEqual([]);
    });
  }
});
