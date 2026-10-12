import { Solar } from "lunar-javascript";
/**
 * Birth hexagram by the "Plum Blossom" (梅花易數, attributed to Shao Yong, 11th c.) year-month-day-hour method:
 *   Y = earthly branch number of the lunar year (Rat 1 … Pig 12), M = lunar month (1-12, a leap month counts as its month),
 *   D = lunar day (1-30), H = branch number of the double hour (Zi 23:00-01:00 = 1 … Hai = 12).
 *   upper trigram = (Y+M+D) mod 8, lower trigram = (Y+M+D+H) mod 8 (0 counts as 8), moving line = (Y+M+D+H) mod 6 (0 = 6).
 *   Trigram numbers follow the Early Heaven order: 1 Qian ☰, 2 Dui ☱, 3 Li ☲, 4 Zhen ☳, 5 Xun ☴, 6 Kan ☵, 7 Gen ☶, 8 Kun ☷.
 * Unknown birth time → the Wu hour (11:00-13:00, H = 7) and the result is flagged as approximate.
 * The lunar date comes from lunar-javascript (local civil date and clock time).
 */
export const TRIGRAMS = ["qian", "dui", "li", "zhen", "xun", "kan", "gen", "kun"] as const;
export type Trigram = (typeof TRIGRAMS)[number];
export const TRIGRAM_GLYPH: Record<Trigram, string> = { qian: "☰", dui: "☱", li: "☲", zhen: "☳", xun: "☴", kan: "☵", gen: "☶", kun: "☷" };
/** Lines bottom → top, 1 = solid (yang). */
export const TRIGRAM_LINES: Record<Trigram, [number, number, number]> = { qian: [1, 1, 1], dui: [1, 1, 0], li: [1, 0, 1], zhen: [1, 0, 0], xun: [0, 1, 1], kan: [0, 1, 0], gen: [0, 0, 1], kun: [0, 0, 0] };
const KW_ORDER: Trigram[] = ["qian", "zhen", "kan", "gen", "kun", "xun", "li", "dui"];
// King Wen number, rows = upper trigram, columns = lower trigram (both in KW_ORDER).
const KING_WEN = [
  [1, 25, 6, 33, 12, 44, 13, 10], [34, 51, 40, 62, 16, 32, 55, 54], [5, 3, 29, 39, 8, 48, 63, 60], [26, 27, 4, 52, 23, 18, 22, 41],
  [11, 24, 7, 15, 2, 46, 36, 19], [9, 42, 59, 53, 20, 57, 37, 61], [14, 21, 64, 56, 35, 50, 30, 38], [43, 17, 47, 31, 45, 28, 49, 58],
];
export const hexagramOf = (upper: Trigram, lower: Trigram) => KING_WEN[KW_ORDER.indexOf(upper)][KW_ORDER.indexOf(lower)];
const fromLines = (l: number[]): Trigram => TRIGRAMS.find((t) => TRIGRAM_LINES[t].every((v, i) => v === l[i]))!;
const ZHI = "子丑寅卯辰巳午未申酉戌亥";

export interface BirthHexagram { number: number; upper: Trigram; lower: Trigram; movingLine: number; changed: number; lines: number[]; approximate: boolean; inputs: { Y: number; M: number; D: number; H: number } }

export function birthHexagram(date: string, time: string | null): BirthHexagram {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mi] = (time ?? "12:00").split(":").map(Number);
  const lunar = Solar.fromYmdHms(y, m, d, hh, mi || 0, 0).getLunar();
  const Y = ZHI.indexOf(lunar.getYearZhi()) + 1;
  const M = Math.abs(lunar.getMonth()), D = lunar.getDay();
  const H = Math.floor(((hh + 1) % 24) / 2) + 1;
  const up = (Y + M + D) % 8 || 8, lo = (Y + M + D + H) % 8 || 8, mv = (Y + M + D + H) % 6 || 6;
  const upper = TRIGRAMS[up - 1], lower = TRIGRAMS[lo - 1];
  const lines = [...TRIGRAM_LINES[lower], ...TRIGRAM_LINES[upper]];
  const flipped = lines.map((v, i) => (i === mv - 1 ? 1 - v : v));
  return { number: hexagramOf(upper, lower), upper, lower, movingLine: mv, changed: hexagramOf(fromLines(flipped.slice(3)), fromLines(flipped.slice(0, 3))), lines, approximate: !time, inputs: { Y, M, D, H } };
}
