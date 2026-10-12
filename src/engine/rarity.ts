/**
 * "How rare are you": the chance that a random person shares your exact mix of independent markers.
 * Markers: Sun, Moon and rising sign (1/12 each), Chinese element + animal (1/60), life path (true frequency
 * over 1940-2019 birthdays), Tzolk'in day (1/260) and four-letter style (published population shares, only
 * when the person took a test). Treated as independent, which they are close to (different cycles).
 */
import type { Profile } from "./profile";
import { lifePath } from "./numerology";

/** Approximate population shares of the 16 four-letter styles (Myers & McCaulley 1985 / CAPT US samples). */
export const FOUR_LETTER_SHARE: Record<string, number> = {
  ISTJ: 0.116, ISFJ: 0.138, INFJ: 0.015, INTJ: 0.021, ISTP: 0.054, ISFP: 0.088, INFP: 0.044, INTP: 0.033,
  ESTP: 0.043, ESFP: 0.085, ENFP: 0.081, ENTP: 0.032, ESTJ: 0.087, ESFJ: 0.123, ENFJ: 0.025, ENTJ: 0.018,
};
let LP: Record<number, number> | null = null;
/** Share of birthdays 1940-2019 with each life path number (computed once, exact). */
export function lifePathShares(): Record<number, number> {
  if (LP) return LP;
  const counts: Record<number, number> = {}; let n = 0;
  for (let t = Date.UTC(1940, 0, 1); t < Date.UTC(2020, 0, 1); t += 86400000) {
    const v = lifePath(new Date(t).toISOString().slice(0, 10)).value; counts[v] = (counts[v] ?? 0) + 1; n++;
  }
  LP = Object.fromEntries(Object.entries(counts).map(([k, v]) => [k, v / n]));
  return LP;
}
export type RarityKey = "sun" | "moon" | "rising" | "chinese" | "lifePath" | "tzolkin" | "fourLetter";
export interface RarityFactor { key: RarityKey; oneIn: number }
export interface Rarity { factors: RarityFactor[]; oneIn: number; sharers: number; rarest: RarityFactor; level: 1 | 2 | 3 | 4 | 5 }
export const WORLD = 8.2e9;

export function rarity(p: Profile): Rarity {
  const f: RarityFactor[] = [{ key: "sun", oneIn: 12 }, { key: "moon", oneIn: 12 }];
  if (p.rising) f.push({ key: "rising", oneIn: 12 });
  f.push({ key: "chinese", oneIn: 60 });
  f.push({ key: "lifePath", oneIn: Math.round(1 / (lifePathShares()[p.numbers.lifePath] ?? 1 / 11)) });
  f.push({ key: "tzolkin", oneIn: 260 });
  const code = p.fourLetter?.code; if (code && FOUR_LETTER_SHARE[code]) f.push({ key: "fourLetter", oneIn: Math.round(1 / FOUR_LETTER_SHARE[code]) });
  const oneIn = f.reduce((a, x) => a * x.oneIn, 1);
  const rarest = f.reduce((a, b) => (b.oneIn > a.oneIn ? b : a));
  const sharers = Math.max(0, Math.round(WORLD / oneIn));
  const level = (oneIn >= 5e9 ? 5 : oneIn >= 5e8 ? 4 : oneIn >= 5e7 ? 3 : oneIn >= 5e6 ? 2 : 1) as Rarity["level"];
  return { factors: f.sort((a, b) => b.oneIn - a.oneIn), oneIn, sharers, rarest, level };
}
/** Short human number: 1.2 million, 34 billion. */
export function bigNumber(n: number, locale: string): string {
  const mk = locale === "mk";
  const units: [number, string, string][] = [[1e12, "trillion", "трилиони"], [1e9, "billion", "милијарди"], [1e6, "million", "милиони"]];
  for (const [v, en, m] of units) if (n >= v) return `${(n / v).toLocaleString(mk ? "mk-MK" : "en-GB", { maximumFractionDigits: n / v < 10 ? 1 : 0 })} ${mk ? m : en}`;
  return Math.round(n).toLocaleString(mk ? "mk-MK" : "en-GB");
}
