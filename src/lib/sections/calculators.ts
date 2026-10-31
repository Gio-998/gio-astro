import { CALCULATORS, CALC_DATE, type CalcKey } from "@/content/calculators";
import { getContent } from "@/content";
import { SIGNS, SIGN_GLYPH } from "@/engine/zodiac";
import { localizedPath } from "@/lib/i18n-routes";
import type { LinkItem } from "@/lib/numerology";
import type { Section, SectionModel } from "./types";

export const CALC_KEYS: CalcKey[] = ["rising-sign", "moon-sign", "birth-chart"];

function model(key: CalcKey, lang: string, path: string): SectionModel | null {
  if (path !== `/${key}/`) return null;
  const S = CALCULATORS[lang] ?? CALCULATORS.en; const P = S.pages[key]; const L = S.links; const c = getContent(lang); const A = c.astro;
  const lp = (p: string) => localizedPath(lang, p);
  const others: LinkItem[] = CALC_KEYS.filter((k) => k !== key).map((k) => ({ href: lp(`/${k}/`), label: S.pages[k].crumb, sub: S.pages[k].sub, big: S.pages[k].big }));
  const near: LinkItem = key === "birth-chart" ? { href: lp("/mercury-retrograde/"), ...L.mercury } : key === "moon-sign" ? { href: lp("/moon-calendar/"), ...L.moonCalendar } : { href: lp("/horoscope/"), ...L.horoscope };
  return { path, kind: "calc", widget: key, sectionName: P.crumb, published: CALC_DATE, modified: CALC_DATE,
    eyebrow: P.eyebrow, h1: P.h1, title: P.title, description: P.description, lead: P.lead, big: P.big,
    crumbs: [[c.site.brand, `/${lang}/`], [P.crumb, lp(path)]], faq: P.faq,
    blocks: P.sections.map((s, k) => ({ id: `s${k}`, title: s.title, paras: s.paras, list: s.list })),
    related: [...others, near, { href: lp("/sign-compatibility/"), ...L.compat }, { href: lp("/numerology/calculator/life-path/"), ...L.lifePath },
      ...SIGNS.map((s) => ({ href: lp(`/zodiac/${s}/`), label: A.signs[s].name, sub: A.signs[s].essence, big: SIGN_GLYPH[s] }))] };
}
/** One public calculator page. Each of the three lives at its section root, so a family has exactly one path. */
export const calcSection = (key: CalcKey): Section => ({ key, paths: () => [`/${key}/`], model: (lang, path) => model(key, lang, path), modified: () => CALC_DATE });
