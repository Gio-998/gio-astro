import { translitName } from "./translit";
export const LIFE_PATHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33] as const;
export type LifePath = (typeof LIFE_PATHS)[number];
const MASTER = new Set([11, 22, 33]);

const digitSum = (n: number) => String(Math.abs(n)).split("").reduce((s, c) => s + Number(c), 0);

/** Reduce to a single digit, keeping master numbers 11, 22, 33. */
export function reduce(n: number, keepMasters = true): number {
  while (n > 9 && !(keepMasters && MASTER.has(n))) n = digitSum(n);
  return n;
}

/** Life Path: reduce month, day and year separately, then add and reduce (keeps masters). */
export function lifePath(date: string): { value: number; steps: string; sum: string } {
  const [y, m, d] = date.split("-").map(Number);
  const rm = reduce(m), rd = reduce(d), ry = reduce(y);
  const total = rm + rd + ry;
  const value = reduce(total);
  return { value, steps: `month ${m}→${rm}, day ${d}→${rd}, year ${y}→${ry}; ${rm}+${rd}+${ry}=${total}→${value}`, sum: `${m} → ${rm}, ${d} → ${rd}, ${y} → ${ry}: ${rm} + ${rd} + ${ry} = ${total}${total === value ? "" : ` → ${value}`}` };
}

const LETTER: Record<string, number> = {};
"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach((c, i) => (LETTER[c] = (i % 9) + 1));
const VOWELS = new Set(["A", "E", "I", "O", "U"]);

/** Normalize a name: strip diacritics (ł→l, ö→o, ß→ss…) and keep A–Z letters. The locale only matters for Cyrillic, see translitName. */
export function normalizeName(name: string, locale?: string): string {
  name = translitName(name, locale);
  return name
    .replace(/ł/g, "l").replace(/Ł/g, "L").replace(/ß/g, "ss").replace(/æ/gi, "ae").replace(/ø/gi, "o").replace(/đ/gi, "d")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toUpperCase().replace(/[^A-Z ]/g, "");
}

function isVowelAt(s: string, i: number): boolean {
  const c = s[i];
  if (VOWELS.has(c)) return true;
  if (c === "Y") {
    // Y counts as a vowel when no vowel is next to it (e.g. "Lynn", "Mary" → vowel; "Yvonne" start → consonant)
    const prev = s[i - 1], next = s[i + 1];
    return !(prev && VOWELS.has(prev)) && !(next && VOWELS.has(next));
  }
  return false;
}

export interface NameNumbers { expression: number; soulUrge: number; personality: number }

export function nameNumbers(fullName: string, locale?: string): NameNumbers | null {
  const words = normalizeName(fullName, locale).split(/\s+/).filter(Boolean);
  if (!words.length) return null;
  let all = 0, vowels = 0, cons = 0;
  // Reduce per name part, then add (traditional), keeping masters.
  let eSum = 0, vSum = 0, cSum = 0;
  for (const w of words) {
    all = 0; vowels = 0; cons = 0;
    for (let i = 0; i < w.length; i++) {
      const v = LETTER[w[i]];
      all += v;
      if (isVowelAt(w, i)) vowels += v; else cons += v;
    }
    eSum += reduce(all); vSum += reduce(vowels); cSum += reduce(cons);
  }
  return { expression: reduce(eSum), soulUrge: reduce(vSum) || 0, personality: reduce(cSum) || 0 };
}

export const birthdayNumber = (date: string) => Number(date.split("-")[2]);

export function personalYear(date: string, year: number): number {
  const [, m, d] = date.split("-").map(Number);
  return reduce(reduce(m) + reduce(d) + reduce(digitSum(year)), false);
}

export const rootOf = (n: number) => (n === 11 ? 2 : n === 22 ? 4 : n === 33 ? 6 : n);
export type NumFamily = "mind" | "heart" | "builder";
export function family(n: number): NumFamily {
  const r = rootOf(n);
  return [1, 5, 7].includes(r) ? "mind" : [3, 6, 9].includes(r) ? "heart" : "builder";
}

/** Traditional "friendly" pairs beyond family (our own transparent table). */
const FRIENDLY = new Set(["1-3", "1-9", "2-6", "2-8", "3-5", "4-8", "4-6", "5-7", "6-9", "7-9", "2-4", "3-9"]);

export function numberHarmony(a: number, b: number): { harmony: number; spark: number; kind: "mirror" | "family" | "friendly" | "contrast" } {
  if (a === b) return { harmony: 75, spark: 55, kind: "mirror" };
  const ra = rootOf(a), rb = rootOf(b);
  if (ra === rb) return { harmony: 82, spark: 60, kind: "family" };
  if (family(a) === family(b)) return { harmony: 85, spark: 50, kind: "family" };
  const key = [ra, rb].sort((x, y) => x - y).join("-");
  if (FRIENDLY.has(key)) return { harmony: 75, spark: 70, kind: "friendly" };
  return { harmony: 60, spark: 85, kind: "contrast" };
}
