import { normCdf } from "./stats";

/**
 * Mini-IPIP (Donnellan, Oswald, Baird & Lucas, 2006): 20 items from the International
 * Personality Item Pool (ipip.ori.org) — public domain, free for commercial use.
 * Item wording lives in src/content/<locale>/quizzes.ts keyed by id.
 */
export type Trait = "E" | "A" | "C" | "N" | "O";
export const TRAITS: Trait[] = ["O", "C", "E", "A", "N"];
export interface Item { id: string; trait: Trait; keyed: 1 | -1 }

export const BIG_FIVE_ITEMS: Item[] = [
  { id: "e1", trait: "E", keyed: 1 }, { id: "a1", trait: "A", keyed: 1 }, { id: "c1", trait: "C", keyed: 1 }, { id: "n1", trait: "N", keyed: 1 }, { id: "o1", trait: "O", keyed: 1 },
  { id: "e2", trait: "E", keyed: -1 }, { id: "a2", trait: "A", keyed: -1 }, { id: "c2", trait: "C", keyed: -1 }, { id: "n2", trait: "N", keyed: -1 }, { id: "o2", trait: "O", keyed: -1 },
  { id: "e3", trait: "E", keyed: 1 }, { id: "a3", trait: "A", keyed: 1 }, { id: "c3", trait: "C", keyed: 1 }, { id: "n3", trait: "N", keyed: 1 }, { id: "o3", trait: "O", keyed: -1 },
  { id: "e4", trait: "E", keyed: -1 }, { id: "a4", trait: "A", keyed: -1 }, { id: "c4", trait: "C", keyed: -1 }, { id: "n4", trait: "N", keyed: -1 }, { id: "o4", trait: "O", keyed: -1 },
];

/**
 * Reference norms (1-5 scale) for these exact 20 items, computed from the Open-Source Psychometrics Project
 * IPIP Big-Five dataset (openpsychometrics.org/_rawdata, ~2012, n = 18,175 complete answers, ages 16-80),
 * which contains all 50 IPIP Big-Five markers including the Mini-IPIP subset. Online volunteers, so still
 * approximate; we will switch to our own opt-in user norms later. Previous hand-picked norms overstated
 * Openness (3.70 vs 4.03) and Neuroticism (2.70 vs 2.94) percentiles.
 */
const NORMS: Record<Trait, { mean: number; sd: number }> = {
  E: { mean: 2.91, sd: 1.03 }, A: { mean: 3.93, sd: 0.86 }, C: { mean: 3.22, sd: 0.90 },
  N: { mean: 2.94, sd: 0.90 }, O: { mean: 4.03, sd: 0.77 },
};

export type Answers = Record<string, number>; // item id → 1..5
export type BigFive = Record<Trait, number>; // percentile 1..99

export function scoreBigFive(answers: Answers): { raw: Record<Trait, number>; pct: BigFive } {
  const sums: Record<Trait, number[]> = { E: [], A: [], C: [], N: [], O: [] };
  for (const it of BIG_FIVE_ITEMS) {
    const v = answers[it.id];
    if (v == null) continue;
    sums[it.trait].push(it.keyed === 1 ? v : 6 - v);
  }
  const raw = {} as Record<Trait, number>;
  const pct = {} as BigFive;
  for (const t of TRAITS) {
    const arr = sums[t];
    raw[t] = arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 3;
    pct[t] = Math.round(Math.min(99, Math.max(1, normCdf((raw[t] - NORMS[t].mean) / NORMS[t].sd) * 100)));
  }
  return { raw, pct };
}

export type Band = "very-low" | "low" | "mid" | "high" | "very-high";
export const band = (p: number): Band => (p < 15 ? "very-low" : p < 35 ? "low" : p <= 65 ? "mid" : p <= 85 ? "high" : "very-high");

/**
 * Four-letter style derived from Big Five (McCrae & Costa, 1989 correlations):
 * E/I ← Extraversion, N/S ← Openness, F/T ← Agreeableness, J/P ← Conscientiousness.
 * These letters are widely used generically; this is NOT an official type test.
 */
export interface FourLetter { code: string; clarity: Record<"EI" | "SN" | "TF" | "JP", number> }
export function fourLetter(b: BigFive): FourLetter {
  const code = (b.E >= 50 ? "E" : "I") + (b.O >= 50 ? "N" : "S") + (b.A >= 50 ? "F" : "T") + (b.C >= 50 ? "J" : "P");
  const cl = (p: number) => Math.round(Math.abs(p - 50) * 2);
  return { code, clarity: { EI: cl(b.E), SN: cl(b.O), TF: cl(b.A), JP: cl(b.C) } };
}

/** Classical temperaments via Eysenck's Extraversion × Neuroticism quadrants. */
export type Temperament = "sanguine" | "choleric" | "phlegmatic" | "melancholic";
export function temperament(b: BigFive): { primary: Temperament; secondary: Temperament; strength: number } {
  const x = (b.E - 50) / 50, y = (b.N - 50) / 50; // y>0 = less stable
  const centers: Record<Temperament, [number, number]> = { sanguine: [0.5, -0.5], choleric: [0.5, 0.5], phlegmatic: [-0.5, -0.5], melancholic: [-0.5, 0.5] };
  const dist = (Object.keys(centers) as Temperament[]).map((t) => ({ t, d: Math.hypot(x - centers[t][0], y - centers[t][1]) })).sort((a, b) => a.d - b.d);
  return { primary: dist[0].t, secondary: dist[1].t, strength: Math.round(Math.min(1, Math.hypot(x, y)) * 100) };
}

/** Compact, shareable result code so a partner's Big Five can be entered in the calculator. */
export const encodeBigFive = (b: BigFive) => `B5-${TRAITS.map((t) => String(b[t]).padStart(2, "0")).join("")}`;
export function decodeBigFive(code: string): BigFive | null {
  const m = code.trim().toUpperCase().match(/^B5-?(\d{10})$/);
  if (!m) return null;
  const v = m[1].match(/\d{2}/g)!.map(Number);
  const out = {} as BigFive;
  TRAITS.forEach((t, i) => (out[t] = Math.min(99, Math.max(1, v[i]))));
  return out;
}
