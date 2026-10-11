/** Macedonian/Serbian Cyrillic → Latin so "Скопје" finds "Skopje" (city names are stored in Latin script). */
const CYR: Record<string, string> = { а: "a", б: "b", в: "v", г: "g", д: "d", ѓ: "gj", е: "e", ж: "zh", з: "z", ѕ: "dz", и: "i", ј: "j", к: "k", л: "l", љ: "lj", м: "m", н: "n", њ: "nj", о: "o", п: "p", р: "r", с: "s", т: "t", ќ: "kj", у: "u", ф: "f", х: "h", ц: "c", ч: "ch", џ: "dzh", ш: "sh", ђ: "dj", ћ: "c", й: "j", ы: "y", э: "e", ю: "yu", я: "ya", щ: "shch", ъ: "", ь: "" };
export function translit(q: string): string {
  return /[\u0400-\u04FF]/.test(q) ? q.toLowerCase().replace(/[\u0400-\u04FF]/g, (ch) => CYR[ch] ?? ch) : q;
}
