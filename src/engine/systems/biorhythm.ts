import { ymd } from "./util";
/**
 * Classic biorhythms (Wilhelm Fliess and Hermann Swoboda, c. 1900; popularised in the 1970s):
 * sine waves of 23 (physical), 28 (emotional) and 33 (intellectual) days, starting at zero on the day of birth.
 * Controlled studies found no predictive value (e.g. Hines, Psychological Reports 1998, a review of 134 studies).
 * We show them as a playful rhythm prompt, never as advice.
 */
export const CYCLES = { physical: 23, emotional: 28, intellectual: 33 } as const;
export type Cycle = keyof typeof CYCLES;
export function daysAlive(birth: string, on: string): number {
  const [a, b, c] = ymd(birth), [x, y, z] = ymd(on);
  return Math.round((Date.UTC(x, y - 1, z) - Date.UTC(a, b - 1, c)) / 86400000);
}
export function biorhythm(birth: string, on: string): Record<Cycle, number> & { days: number; critical: Cycle[] } {
  const n = daysAlive(birth, on);
  const v = (p: number) => Math.round(Math.sin((2 * Math.PI * n) / p) * 100);
  const out = { physical: v(23), emotional: v(28), intellectual: v(33) };
  // "Critical" (zero-crossing) day: the wave changes sign between today and tomorrow (or is exactly zero).
  const critical = (Object.keys(CYCLES) as Cycle[]).filter((k) => { const p = CYCLES[k]; const s0 = Math.sin((2 * Math.PI * n) / p), s1 = Math.sin((2 * Math.PI * (n + 1)) / p); return n % p === 0 || s0 * s1 < 0; });
  return { ...out, days: n, critical };
}
/** Pair "sync" per cycle: 100 = same phase, 0 = opposite (the classic biorhythm compatibility). */
export function biorhythmSync(a: string, b: string): Record<Cycle, number> {
  const diff = Math.abs(daysAlive(a, b));
  const s = (p: number) => Math.round(Math.abs(Math.cos((Math.PI * (diff % p)) / p)) * 100);
  return { physical: s(23), emotional: s(28), intellectual: s(33) };
}
