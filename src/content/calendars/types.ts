import type { Eclipse, Quarter } from "@/engine/sky-calendar";
import type { Sign } from "@/engine/zodiac";

export type CopyBlock = { id: string; title: string; paras?: string[]; list?: string[] };
export type Faq = [string, string][];
/** Dates reach the copy as finished strings from the computed data, so no date is ever typed into a text. */
export type MercuryDates = { since: string; retro: string; direct: string; shadowStart: string; shadowEnd: string; signIn: string };

export interface MoonCopy {
  crumb: string;
  hub: { h1: string; title: string; description: string; blocks: CopyBlock[]; faq: Faq };
  today: (date: string, phase: string, illumination: number, signIn: string) => string;
  todayLabel: string; nowTitle: string; monthsTitle: string;
  head: { phase: string; date: string; time: string; sign: string; day: string; moon: string; moonSign: string; horoscope: string; month: string; newMoon: string; fullMoon: string; note: string };
  /** Asked with the computed date of the next one. */
  faqNext: { qFull: string; qNew: string; a: (when: string) => string };
  zone: { winter: string; summer: string; change: (date: string) => string };
  month: {
    h1: (m: string, y: number) => string; title: (m: string, y: number) => string;
    description: (a: { newMoon: string; full: string; m: string; y: number }) => string;
    lead: (a: { newMoons: string; fulls: string; m: string; y: number }) => string;
    phasesTitle: (m: string, y: number) => string; factsTitle: (m: string, y: number) => string; daysTitle: (m: string, y: number) => string;
    lunationTitle: (quarter: string, signIn: string, date: string) => string;
    daysCaption: string;
    cycle: (start: string, length: string, next: string) => string;
    sun: (date: string, signTo: string) => string;
    changes: (m: string, y: number, n: number, from: string, to: string) => string;
    mercury: (m: string, y: number, from: string, to: string) => string;
    eclipse: (quarter: string, date: string, eclipse: string) => string;
    qFull: (m: string, y: number) => string; qNew: (m: string, y: number) => string; qHalf: (m: string, y: number) => string;
    aFull: (m: string, y: number, list: string) => string; aNew: (m: string, y: number, list: string) => string;
    aHalf: (first: string, last: string) => string;
  };
  /** Same calendar month holding a second new or full moon. */
  plural: { new: string; full: string };
  twoInMonth: (plural: string, m: string, y: number, dates: string) => string;
  year: {
    h1: (y: number) => string; title: (y: number) => string; description: (y: number, full: number, newM: number) => string;
    lead: (y: number, full: number, newM: number) => string;
    aboutTitle: (y: number) => string; fullTitle: (y: number) => string; newTitle: (y: number) => string; eclipseTitle: (y: number) => string;
    intro: Record<number, string[]>;
    twice: (plural: string, signIn: string, y: number, dates: string) => string;
    eclipseLine: (date: string, eclipse: string, quarter: string, signIn: string) => string;
    tableCaption: string;
    qFull: (y: number) => string; qNew: (y: number) => string; qEclipse: (y: number) => string;
    aCount: (y: number, n: number, plural: string, first: string, last: string) => string;
    aEclipse: (list: string) => string;
  };
  /** "quarter:sign" to the text for each time that lunation falls in the published window, in date order. */
  reflect: Record<string, string[]>;
}

export interface MercuryCopy {
  crumb: string;
  hub: { h1: string; title: string; description: string; blocks: CopyBlock[]; faq: Faq };
  answer: Record<"retrograde" | "pre-shadow" | "post-shadow" | "clear", (d: MercuryDates) => string>;
  asOf: (date: string) => string; nowTitle: string; nextTitle: string;
  head: { stage: string; date: string; time: string; position: string; period: string; signs: string; shadow: string; sign: string; house: string; focus: string };
  stage: { preShadow: string; retro: string; direct: string; postShadow: string; moves: (signTo: string) => string };
  clock: string;
  range: (from: string, to: string) => string;
  year: {
    h1: (y: number) => string; title: (y: number) => string; description: (y: number, times: string) => string;
    lead: (y: number, times: string, list: string) => string; overviewTitle: (y: number) => string;
    periodTitle: (range: string, signs: string) => string; bySignTitle: (signs: string) => string; bySignCaption: string;
    intro: Record<number, string[]>;
    qWhen: (y: number) => string; aWhen: (y: number, list: string) => string;
    qShadow: (y: number) => string; aShadow: (list: string) => string;
    qSigns: (y: number) => string; aSigns: (list: string) => string;
  };
  /** Keyed "year:sign>sign", so a text can only attach to the period the engine computed. bySign follows SIGNS order. */
  periods: Record<string, { paras: string[]; bySign: string[] }>;
}

export interface CalendarCopy {
  dayShort: string[]; and: string;
  signIn: Record<Sign, string>; signTo: Record<Sign, string>;
  quarter: Record<Quarter, string>;
  eclipse: Record<Eclipse, string>;
  span: (days: number, hours: number) => string;
  pct: (n: number) => string;
  /** "three times", from 1 upward. */
  times: (n: number) => string;
  when: (date: string, time: string, signIn: string) => string;
  links: { daily: string; dailySub: string; monthly: string; moonSign: string; rising: string; zodiacOf: (name: string) => string; horoscopeOf: (name: string) => string; moonYear: (y: number) => string; mercuryYear: (y: number) => string };
  moon: MoonCopy;
  mercury: MercuryCopy;
}
