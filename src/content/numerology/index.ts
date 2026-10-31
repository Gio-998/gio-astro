import { numerology as en, type NumContent } from "./en";
import { numerology as mk } from "./mk";
import { numerology as de } from "./de";
import { numerology as sr } from "./sr";
const ALL: Record<string, NumContent> = { en, mk, de, sr };
export const numContent = (lang: string): NumContent => ALL[lang] ?? en;
export type { NumContent };
