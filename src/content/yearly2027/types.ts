import type { Sign } from "@/engine/zodiac";

/** What a section does on the page. Every page needs each role at least once; the order is the sign's own. */
export type YearlyRole = "year" | "focus" | "periods" | "love" | "work" | "money" | "wellbeing" | "windows" | "practice";
export type YearlySection = { role: YearlyRole; title: string; paras: string[]; list?: string[] };
/** A 2027 yearly horoscope, written per language and per sign, not assembled. */
export type YearlyPage = { metaTitle: string; h1: string; description: string; lead: string; hubLine: string; sections: YearlySection[]; faq: [string, string][] };
export type YearlySet = Partial<Record<Sign, YearlyPage>>;
/** Hub page copy. Main dates are built from src/lib/sky2027.ts in the section file, so only their labels live here. */
export type YearlyHub = {
  crumb: string; h1: string; metaTitle: string; description: string; lead: string;
  bigPicture: { title: string; paras: string[] }; datesTitle: string; datesIntro: string;
  howTo: { title: string; paras: string[] }; signsLabel: string; method: { title: string; para: string }; faq: [string, string][];
  /** Labels for the related links on sign pages. */
  links: { zodiac: string; daily: string; weekly: string; monthly: string; personalYear: string; personalYearSub: string; mercury: string; mercurySub: string; rising: string; risingSub: string };
  /** Labels for the generated date list. */
  sky: { bodies: Record<string, string>; signsIn: Record<string, string>; months: string[]; date: string; enters: string; retro: string; direct: string; eclipses: Record<string, string>; trine: string; square: string };
};
