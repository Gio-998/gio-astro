import { Solar } from "lunar-javascript";
/**
 * Nine Star Ki (九星氣學), Japanese form of the Chinese nine-star system.
 * Year star: the solar year starts at Li Chun (~4 Feb). star = ((10 - year mod 9) mod 9) + 1 → 2024 = 3, 2025 = 2, 2026 = 1.
 * Month star: from the solar month (starts at each "jie" term: Li Chun, Jing Zhe, …) and the year group:
 *   years 1/4/7 start the Tiger month (Feb) at 8, years 2/5/8 at 2, years 3/6/9 at 5, then count down by one per month.
 * Solar terms come from lunar-javascript's eight-char month pillar (China Standard Time tables; the error at a
 * term boundary is at most a few hours and only matters for births on that day).
 */
export const STAR_ELEMENT = ["", "water", "earth", "wood", "wood", "earth", "metal", "metal", "earth", "fire"] as const;
const ZHI_FROM_TIGER = "寅卯辰巳午未申酉戌亥子丑";

export interface NineStar { year: number; month: number; solarYear: number; element: (typeof STAR_ELEMENT)[number] }

export function yearStar(solarYear: number): number { return ((10 - (solarYear % 9)) % 9 + 9) % 9 + 1; }

export function nineStarKi(date: string, time: string | null): NineStar {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mi] = (time ?? "12:00").split(":").map(Number);
  const ec = Solar.fromYmdHms(y, m, d, hh, mi || 0, 0).getLunar().getEightChar();
  const k = ZHI_FROM_TIGER.indexOf(ec.getMonthZhi()); // 0 = Tiger month (~4 Feb - 5 Mar)
  // Solar year: before Li Chun (Jan or early Feb, month Rat/Ox) belongs to the previous year.
  const solarYear = m <= 2 && k >= 10 ? y - 1 : y;
  const ys = yearStar(solarYear);
  const start = [1, 4, 7].includes(ys) ? 8 : [2, 5, 8].includes(ys) ? 2 : 5;
  const month = (((start - 1 - k) % 9) + 9) % 9 + 1;
  return { year: ys, month, solarYear, element: STAR_ELEMENT[ys] };
}
/** Five-element relation between two year stars (generating / same / controlling), symbolic pair reading. */
const GEN: Record<string, string> = { water: "wood", wood: "fire", fire: "earth", earth: "metal", metal: "water" };
export function nineStarPair(a: number, b: number): { relation: "same" | "supports" | "supported" | "controls" | "controlled"; harmony: number; spark: number } {
  const ea = STAR_ELEMENT[a], eb = STAR_ELEMENT[b];
  if (ea === eb) return { relation: "same", harmony: 76, spark: 52 };
  if (GEN[ea] === eb) return { relation: "supports", harmony: 84, spark: 58 };
  if (GEN[eb] === ea) return { relation: "supported", harmony: 84, spark: 58 };
  if (GEN[GEN[ea]] === eb) return { relation: "controls", harmony: 56, spark: 80 };
  return { relation: "controlled", harmony: 56, spark: 80 };
}
