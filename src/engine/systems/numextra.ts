/** Numerology extras: maturity number, personal month and day, karmic debt in the birthday. Pure, any date. */
import { reduce } from "../numerology";
export const KARMIC_DEBT = [13, 14, 16, 19] as const;
export interface NumExtra { maturity: number | null; personalMonth: number; personalDay: number; karmicDebt: number | null }
export function numExtra(birth: string, lifePath: number, expression: number | null, personalYear: number, today: Date): NumExtra {
  const d = Number(birth.split("-")[2]);
  const pm = reduce(personalYear + today.getMonth() + 1, false);
  return {
    maturity: expression == null ? null : reduce(lifePath + expression),
    personalMonth: pm,
    personalDay: reduce(pm + today.getDate(), false),
    karmicDebt: (KARMIC_DEBT as readonly number[]).includes(d) ? d : null,
  };
}
