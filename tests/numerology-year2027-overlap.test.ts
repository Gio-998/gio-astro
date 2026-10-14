import { describe, it, expect } from "vitest";
import { YEAR2027 } from "../src/content/numerology/year2027";
import { YEARS, Y27_KEYS, numPaths } from "../src/lib/numerology";
import { PAIRS } from "../src/content/numerology/pairs";
import { MIRRORS } from "../src/content/numerology/mirror";

/** Personal year 2027 pages (1 to 9) are a family of near neighbours: each must stand on its own before it joins the sitemap. */
const LANGS = ["en", "mk", "de"] as const;
const MIN_WORDS = 400;
const MAX_JACCARD = 0.12;

const text = (lang: string, k: string) => { const p = YEAR2027[lang][k]; return [p.title, p.lead, ...p.sections.flatMap((s) => [s.title, ...s.paras])].join(" "); };
const words = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(Boolean);
const shingles = (w: string[], k = 5) => { const o = new Set<string>(); for (let i = 0; i + k <= w.length; i++) o.add(w.slice(i, i + k).join(" ")); return o; };
const jaccard = (a: Set<string>, b: Set<string>) => { let n = 0; for (const x of a) if (b.has(x)) n++; return n / (a.size + b.size - n || 1); };
const sentences = (s: string) => s.split(/(?<=[.!?])\s+/).map((x) => x.trim().toLowerCase()).filter((x) => x.split(" ").length >= 6);

describe("personal year 2027 pages: overlap and depth", () => {
  it("keys are 1 to 9 and every language has the same set", () => {
    for (const l of LANGS) for (const k of Object.keys(YEAR2027[l])) expect(YEARS.map(String)).toContain(k);
    for (const l of LANGS) expect(Object.keys(YEAR2027[l]).filter((k) => !Y27_KEYS.includes(k))).toEqual([]);
  });
  it("only finished pages are routed, and the hub only when there is at least one", () => {
    const routed = numPaths().filter((p) => /\/personal-year-2027\/\d\/$/.test(p)).length;
    expect(routed).toBe(Y27_KEYS.length);
    expect(numPaths().includes("/numerology/personal-year-2027/")).toBe(Y27_KEYS.length > 0);
  });
  for (const l of LANGS) {
    it(`${l}: each page has at least ${MIN_WORDS} words`, () => {
      const short = Y27_KEYS.map((k) => [k, words(text(l, k)).length]).filter(([, n]) => (n as number) < MIN_WORDS);
      expect(short).toEqual([]);
    });
    it(`${l}: no two pages share more than ${MAX_JACCARD * 100}% of their phrasing`, () => {
      const sh = Object.fromEntries(Y27_KEYS.map((k) => [k, shingles(words(text(l, k)))]));
      const bad: string[] = [];
      Y27_KEYS.forEach((a, i) => Y27_KEYS.slice(i + 1).forEach((b) => { const j = jaccard(sh[a], sh[b]); if (j > MAX_JACCARD) bad.push(`${a}/${b}: ${j.toFixed(3)}`); }));
      expect(bad).toEqual([]);
    });
    it(`${l}: sentences are not reused across 2027 pages or copied from pair pages`, () => {
      const seen = new Map<string, string[]>();
      for (const k of Y27_KEYS) for (const s of new Set(sentences(text(l, k)))) seen.set(s, [...(seen.get(s) ?? []), k]);
      const reused = [...seen.entries()].filter(([, ks]) => ks.length > 1).map(([s, ks]) => `${ks.join(",")}: ${s.slice(0, 60)}`);
      expect(reused).toEqual([]);
      const pairText = [...Object.values(PAIRS[l]), ...Object.values(MIRRORS[l])].map((p) => [p.lead, ...p.sections.flatMap((s) => s.paras)].join(" ")).join(" ");
      const pairSent = new Set(sentences(pairText));
      expect([...seen.keys()].filter((s) => pairSent.has(s))).toEqual([]);
    });
  }
});
