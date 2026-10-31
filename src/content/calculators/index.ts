import { calcEn } from "./en";
import { calcMk } from "./mk";
import { calcDe } from "./de";
import { calcSr } from "./sr";
import type { CalcSet } from "./types";
export type { CalcKey, CalcPage, CalcSection } from "./types";

/** Public calculator pages, written per language. Server only: the client tool imports ./ui, never this file. */
export const CALCULATORS: Record<string, CalcSet> = { en: calcEn, mk: calcMk, de: calcDe, sr: calcSr };
/** Bump when this family's copy changes. */
export const CALC_DATE = "2026-10-31";
