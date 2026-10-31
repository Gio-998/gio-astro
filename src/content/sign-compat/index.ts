import { aEn } from "./en/a"; import { bEn } from "./en/b"; import { cEn } from "./en/c";
import { aMk } from "./mk/a"; import { bMk } from "./mk/b"; import { cMk } from "./mk/c";
import { aDe } from "./de/a"; import { bDe } from "./de/b"; import { cDe } from "./de/c";
import { HUB } from "./hub";

/** Zodiac sign pair pages, keyed "aries-and-leo" in zodiac order. Written per language, not assembled. */
export type SignPair = { title: string; metaTitle: string; description: string; lead: string; sections: { title: string; paras: string[] }[]; faq: [string, string][] };
export type SignPairSet = Record<string, SignPair>;
export type SignPairHub = { title: string; metaTitle: string; description: string; crumb: string; sub: string; dailyLabel: string; intro: string[]; faq: [string, string][] };
export const SIGN_PAIRS: Record<string, SignPairSet> = { en: { ...aEn, ...bEn, ...cEn }, mk: { ...aMk, ...bMk, ...cMk }, de: { ...aDe, ...bDe, ...cDe } };
export const SIGN_PAIR_HUB: Record<string, SignPairHub> = HUB;
/** Bump when this family's copy changes. */
export const SIGN_PAIR_DATE = "2026-10-31";
