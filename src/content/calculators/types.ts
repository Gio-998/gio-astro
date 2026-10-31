/** Written content of the public calculator pages. Server only: the tools' own labels live in ./ui so they stay out of this weight. */
export type CalcKey = "rising-sign" | "moon-sign" | "birth-chart";
export type CalcSection = { title: string; paras?: string[]; list?: string[] };
export type CalcPage = {
  /** At most 55 characters, main search phrase first. */
  title: string;
  /** 120 to 155 characters. */
  description: string;
  h1: string; crumb: string; eyebrow: string; lead: string; big: string;
  /** One line for links to this page from elsewhere. */
  sub: string;
  sections: CalcSection[];
  faq: [string, string][];
};
type LinkCopy = { label: string; sub: string };
export type CalcSet = { pages: Record<CalcKey, CalcPage>; links: Record<"horoscope" | "compat" | "lifePath" | "moonCalendar" | "mercury", LinkCopy> };
