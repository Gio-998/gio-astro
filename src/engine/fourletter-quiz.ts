/**
 * Dedicated four-letter preference quiz: our own 28 forced-choice items, 7 per letter pair.
 * Each item has two statements (first = E, S, T or J pole; second = I, N, F or P pole) answered on a
 * 4-point forced choice with no middle: 1 = clearly the first, 2 = rather the first, 3 = rather the second,
 * 4 = clearly the second. Scored per pair: sum of +2/+1/-1/-2, clarity = |sum| / 14 as a percentage.
 * Ties (sum 0) go to the pole picked on more items (7 items, so that count never ties).
 * Wording lives in src/content/<locale>/extra/types.ts keyed by id. Not an official type test.
 */
export type Dichotomy = "EI" | "SN" | "TF" | "JP";
export const DICHOTOMIES: Dichotomy[] = ["EI", "SN", "TF", "JP"];
export interface FlItem { id: string; dim: Dichotomy }
/** Interleaved so the pairs alternate (EI, SN, TF, JP, EI, ...). */
export const FOUR_LETTER_ITEMS: FlItem[] = [];
for (let i = 1; i <= 7; i++) for (const d of DICHOTOMIES) FOUR_LETTER_ITEMS.push({ id: `${d.toLowerCase()}${i}`, dim: d });

export interface FourLetterQuizResult {
  code: string;
  /** 0-100 per pair: how clearly you leaned to the chosen letter. */
  clarity: Record<Dichotomy, number>;
  /** Raw sums, -14..14 (positive = first letter of the pair). */
  sums: Record<Dichotomy, number>;
}

const POINTS: Record<number, number> = { 1: 2, 2: 1, 3: -1, 4: -2 };

export function scoreFourLetter(answers: Record<string, number>): FourLetterQuizResult {
  const sums = { EI: 0, SN: 0, TF: 0, JP: 0 } as Record<Dichotomy, number>;
  const firstCount = { EI: 0, SN: 0, TF: 0, JP: 0 } as Record<Dichotomy, number>;
  const n = { EI: 0, SN: 0, TF: 0, JP: 0 } as Record<Dichotomy, number>;
  for (const it of FOUR_LETTER_ITEMS) {
    const v = answers[it.id];
    if (v == null || !POINTS[v]) continue;
    sums[it.dim] += POINTS[v];
    n[it.dim]++;
    if (v <= 2) firstCount[it.dim]++;
  }
  const clarity = {} as Record<Dichotomy, number>;
  let code = "";
  for (const d of DICHOTOMIES) {
    const first = sums[d] > 0 || (sums[d] === 0 && firstCount[d] * 2 > n[d]);
    code += first ? d[0] : d[1];
    clarity[d] = n[d] ? Math.round((Math.abs(sums[d]) / (2 * n[d])) * 100) : 0;
  }
  return { code, clarity, sums };
}
