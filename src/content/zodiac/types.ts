import type { Element, Modality, Sign } from "@/engine/zodiac";

/** What a section covers. Every page has one of each required kind, in the order that suits that sign. "extra" is a topic only this sign gets. */
export const REQUIRED_KINDS = ["core", "strengths", "friction", "love", "man", "woman", "friendship", "work", "needs", "matches"] as const;
export type SectionKind = (typeof REQUIRED_KINDS)[number] | "extra";
export type ZodiacSection = { kind: SectionKind; title: string; paras?: string[]; list?: string[]; quote?: string };

/** One sign in one language. Written by hand per language, never assembled. `{dates}` in any string becomes the engine's date range. */
export type SignProfile = {
  metaTitle: string; description: string; h1: string; lead: string;
  sections: ZodiacSection[]; faq: [string, string][];
  /** Very short line for each sign in ZODIAC_MATCHES, shown under its link. */
  matchNotes: Partial<Record<Sign, string>>;
  /** 150 to 200 words shown only on the /horoscope/<sign>/ today page. Must not repeat the profile. */
  daily: { title: string; paras: string[] };
};

export type ZodiacLabels = {
  /** Joins two dates: "21 March to 19 April". */
  to: string;
  factsTitle: (name: string) => string; dates: string; element: string; modality: string; ruler: string; opposite: string; traditional: string; modern: string;
  bestMatch: string; hardestMatch: string;
  profileLink: (name: string) => string; daily: (name: string) => string; weekly: (name: string) => string; monthly: (name: string) => string; yearly: (name: string) => string;
  compatHub: string; compatHubSub: string; dailyHub: string; dailyHubSub: string; rising: string; risingSub: string; moon: string; moonSub: string; chart: string; chartSub: string; numerology: string; numerologySub: string;
};

export type ZodiacHub = {
  metaTitle: string; description: string; h1: string; crumb: string; lead: string; intro: string[];
  elementsTitle: string; elementsIntro: string; elements: Record<Element, string>;
  modalitiesTitle: string; modalitiesIntro: string; modalities: Record<Modality, string>;
  /** Plain extra sections, such as reading your sign beyond the Sun or what to do on a cusp. */
  more: { title: string; paras: string[] }[]; faq: [string, string][];
};

export type ZodiacLang = { hub: ZodiacHub; labels: ZodiacLabels; signs: Partial<Record<Sign, SignProfile>> };
