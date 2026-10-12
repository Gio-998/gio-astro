import { jdn, ymd } from "./util";
/**
 * Maya Tzolk'in (260-day count): day sign (1 of 20) + number 1-13.
 * Correlation: GMT (Goodman-Martinez-Thompson) constant 584283, the one used by most Mayanists and still
 * matching the count kept by K'iche' daykeepers in highland Guatemala. Long Count 0.0.0.0.0 = 4 Ajaw 8 Kumk'u.
 * Uses the civil birth date (the traditional day starts at sunset; we note that in the method text).
 * We do NOT use the 1987 "Dreamspell" count, which runs on a different day.
 */
export const GMT = 584283;
export const DAY_SIGNS = ["imix", "ik", "akbal", "kan", "chikchan", "kimi", "manik", "lamat", "muluk", "ok", "chuwen", "eb", "ben", "ix", "men", "kib", "kaban", "etznab", "kawak", "ajaw"] as const;
export type DaySign = (typeof DAY_SIGNS)[number];
export interface Tzolkin { tone: number; sign: DaySign; signIndex: number; kin: number; daysFromCreation: number }

export function tzolkin(date: string): Tzolkin {
  const [y, m, d] = ymd(date);
  const n = jdn(y, m, d) - GMT;
  const tone = (((n + 3) % 13) + 13) % 13 + 1;
  const signIndex = (((n + 19) % 20) + 20) % 20;
  // Kin 1..260 (1 Imix = kin 1), via CRT of tone and sign.
  let kin = 0;
  for (let k = 1; k <= 260; k++) if (((k - 1) % 13) + 1 === tone && (k - 1) % 20 === signIndex) { kin = k; break; }
  return { tone, sign: DAY_SIGNS[signIndex], signIndex, kin, daysFromCreation: n };
}
/** Long Count date (baktun.katun.tun.winal.kin) for display. */
export function longCount(date: string): string {
  const [y, m, d] = ymd(date); let n = jdn(y, m, d) - GMT;
  const parts = [144000, 7200, 360, 20, 1].map((u) => { const q = Math.floor(n / u); n -= q * u; return q; });
  return parts.join(".");
}
/** Pair reading in the Tzolk'in: same sign, same number, or signs 10 apart ("opposite" in the 20-day wheel). Symbolic. */
export function tzolkinPair(a: Tzolkin, b: Tzolkin): { kind: "same-sign" | "same-tone" | "opposite" | "neighbour" | "other"; harmony: number; spark: number } {
  const ds = Math.abs(a.signIndex - b.signIndex), dist = Math.min(ds, 20 - ds);
  if (a.sign === b.sign) return { kind: "same-sign", harmony: 78, spark: 50 };
  if (a.tone === b.tone) return { kind: "same-tone", harmony: 72, spark: 55 };
  if (dist === 10) return { kind: "opposite", harmony: 58, spark: 82 };
  if (dist === 1) return { kind: "neighbour", harmony: 70, spark: 60 };
  return { kind: "other", harmony: 64, spark: 62 };
}
