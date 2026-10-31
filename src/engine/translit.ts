/** Macedonian/Serbian Cyrillic → Latin so "Скопје" finds "Skopje" (city names are stored in Latin script). */
const CYR: Record<string, string> = { а: "a", б: "b", в: "v", г: "g", д: "d", ѓ: "gj", е: "e", ж: "zh", з: "z", ѕ: "dz", и: "i", ј: "j", к: "k", л: "l", љ: "lj", м: "m", н: "n", њ: "nj", о: "o", п: "p", р: "r", с: "s", т: "t", ќ: "kj", у: "u", ф: "f", х: "h", ц: "c", ч: "ch", џ: "dzh", ш: "sh", ђ: "dj", ћ: "c", й: "j", ы: "y", э: "e", ю: "yu", я: "ya", щ: "shch", ъ: "", ь: "" };
export function translit(q: string): string {
  return /[\u0400-\u04FF]/.test(q) ? q.toLowerCase().replace(/[\u0400-\u04FF]/g, (ch) => CYR[ch] ?? ch) : q;
}
/** Serbian writes these letters one to one in Latin. Everything else matches CYR. */
const SR_LATIN: Record<string, string> = { ђ: "đ", ж: "ž", ћ: "ć", ч: "č", џ: "dž", ш: "š" };
/**
 * Cyrillic in a name. Serbian has two scripts for one spelling, so Милош has to count as Miloš: the letters come out as real Serbian Latin and go down
 * the same path as a name typed in Latin. Macedonian keeps CYR (ж is zh there, and those numbers must not move). Милош is the same string in both languages,
 * so the page's language decides, unless a letter settles it: ђ and ћ exist only in Serbian, ѓ, ќ and ѕ only in Macedonian.
 */
export function translitName(q: string, locale?: string): string {
  if (!/[\u0400-\u04FF]/.test(q)) return q;
  const serbian = /[ђћ]/i.test(q) || (locale === "sr" && !/[ѓќѕ]/i.test(q));
  return serbian ? q.toLowerCase().replace(/[\u0400-\u04FF]/g, (ch) => SR_LATIN[ch] ?? CYR[ch] ?? ch) : translit(q);
}
