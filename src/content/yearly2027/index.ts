import { yearlyEn } from "./en";
import { yearlyMk } from "./mk";
import { yearlyDe } from "./de";
import { yearlySr } from "./sr";
import { HUB } from "./hub";
import { hubSr } from "./hub-sr";
import type { YearlyHub, YearlySet } from "./types";

export type { YearlyHub, YearlyPage, YearlyRole, YearlySection, YearlySet } from "./types";
/** 2027 yearly horoscopes keyed by sign. Written per language from the computed sky in src/lib/sky2027.ts, not assembled. */
export const YEARLY: Record<string, YearlySet> = { en: yearlyEn, mk: yearlyMk, de: yearlyDe, sr: yearlySr };
export const YEARLY_HUB: Record<string, YearlyHub> = { ...HUB, sr: hubSr };
/** Bump when this family's copy changes. */
export const YEARLY_DATE = "2026-10-31";
