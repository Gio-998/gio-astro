/**
 * Bond Check — a two-person check-in about the relationship itself. The dimensions follow the
 * relationship-specific perceptions that predicted relationship quality best across 43 couple
 * datasets (Joel et al., 2020, PNAS): appreciation, commitment, trust, conflict & repair, fun,
 * feeling understood. Our own wording; works for partners, friends, family and colleagues.
 */
export const BOND_DIMS = ["appreciation", "trust", "commitment", "repair", "fun", "understood", "safety", "growth"] as const;
export type BondDim = (typeof BOND_DIMS)[number];
export const CARE_STYLES = ["words", "time", "gifts", "help", "touch"] as const;
export type CareStyle = (typeof CARE_STYLES)[number];

export interface BondAnswers { dims: Partial<Record<BondDim, number>>; receive: CareStyle | null; give: CareStyle | null }

export interface BondResult {
  index: number; // 0–100
  dims: { dim: BondDim; a: number; b: number; avg: number; gap: number }[];
  strengths: BondDim[];
  growth: BondDim[];
  perceptionGaps: BondDim[];
  care: { aGivesWhatBNeeds: boolean; bGivesWhatANeeds: boolean };
}

export function scoreBond(a: BondAnswers, b: BondAnswers): BondResult {
  const dims = BOND_DIMS.map((dim) => {
    const x = a.dims[dim] ?? 3, y = b.dims[dim] ?? 3;
    return { dim, a: x, b: y, avg: (x + y) / 2, gap: Math.abs(x - y) };
  });
  const index = Math.round((dims.reduce((s, d) => s + (d.avg - 1) / 4, 0) / dims.length) * 100);
  const sorted = [...dims].sort((p, q) => q.avg - p.avg);
  const strengths = sorted.filter((d) => d.avg >= 3.5).slice(0, 3).map((d) => d.dim);
  const growth = [...dims].sort((p, q) => p.avg - q.avg).filter((d) => !strengths.includes(d.dim)).slice(0, 2).map((d) => d.dim);
  const perceptionGaps = dims.filter((d) => d.gap >= 2).map((d) => d.dim);
  return {
    index, dims, strengths: strengths.length ? strengths : [sorted[0].dim], growth, perceptionGaps,
    care: { aGivesWhatBNeeds: !!a.give && a.give === b.receive, bGivesWhatANeeds: !!b.give && b.give === a.receive },
  };
}
