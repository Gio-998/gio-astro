import { numerology as en, type NumContent } from "./en";
import { numerology as mk } from "./mk";
import { numerology as de } from "./de";
const ALL: Record<string, NumContent> = { en, mk, de };
export const numContent = (lang: string): NumContent => ALL[lang] ?? en;
export type { NumContent };
