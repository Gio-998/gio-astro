import { normCdf } from "./stats";
import type { Trait, BigFive } from "./bigfive";
import { TRAITS } from "./bigfive";

/**
 * IPIP 50-item Big-Five Factor Markers (Goldberg, 1992; ipip.ori.org), public domain, free for commercial use.
 * Factor IV is keyed here as Neuroticism (the reverse of IPIP's "Emotional Stability"), Factor V as Openness
 * (IPIP "Intellect/Imagination"). Wording lives in src/content/<locale>/extra/types.ts keyed by id (E1..O10,
 * same numbering as the openpsychometrics.org codebook). Presented interleaved E, N, A, C, O.
 */
export interface LongItem { id: string; trait: Trait; keyed: 1 | -1 }
const KEYS: Record<Trait, (1 | -1)[]> = {
  E: [1, -1, 1, -1, 1, -1, 1, -1, 1, -1],
  N: [1, -1, 1, -1, 1, 1, 1, 1, 1, 1],
  A: [-1, 1, -1, 1, -1, 1, -1, 1, 1, 1],
  C: [1, -1, 1, -1, 1, -1, 1, -1, 1, 1],
  O: [1, -1, 1, -1, 1, -1, 1, 1, 1, 1],
};
export const BIG_FIVE_LONG_ITEMS: LongItem[] = [];
for (let i = 0; i < 10; i++) for (const t of ["E", "N", "A", "C", "O"] as Trait[]) BIG_FIVE_LONG_ITEMS.push({ id: `${t}${i + 1}`, trait: t, keyed: KEYS[t][i] });

/** Norms for the full 10-item scales, openpsychometrics.org IPIP-50 dataset, n = 18,175 (ages 16-80). */
const NORMS_LONG: Record<Trait, { mean: number; sd: number }> = {
  E: { mean: 3.03, sd: 0.92 }, A: { mean: 3.86, sd: 0.71 }, C: { mean: 3.37, sd: 0.73 },
  N: { mean: 3.08, sd: 0.86 }, O: { mean: 3.91, sd: 0.62 },
};

export function scoreBigFiveLong(answers: Record<string, number>): { raw: Record<Trait, number>; pct: BigFive; answered: number } {
  const sums: Record<Trait, number[]> = { E: [], A: [], C: [], N: [], O: [] };
  let answered = 0;
  for (const it of BIG_FIVE_LONG_ITEMS) {
    const v = answers[it.id];
    if (v == null) continue;
    answered++;
    sums[it.trait].push(it.keyed === 1 ? v : 6 - v);
  }
  const raw = {} as Record<Trait, number>;
  const pct = {} as BigFive;
  for (const t of TRAITS) {
    const arr = sums[t];
    raw[t] = arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 3;
    pct[t] = Math.round(Math.min(99, Math.max(1, normCdf((raw[t] - NORMS_LONG[t].mean) / NORMS_LONG[t].sd) * 100)));
  }
  return { raw, pct, answered };
}
