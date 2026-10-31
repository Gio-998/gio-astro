import { localizedPath } from "@/lib/i18n-routes";
import { getContent } from "@/content";
import { isoOf, formatDate } from "@/lib/dates";
import { SIGNS, SIGN_DATES, SIGN_ELEMENT, SIGN_GLYPH, SIGN_MODALITY, SIGN_RULER, signPairSlug, type Element, type Modality, type Sign } from "@/engine/zodiac";
import { ZODIAC, ZODIAC_DATE, ZODIAC_MATCHES, type ZodiacLang } from "@/content/zodiac";
import type { Block, LinkItem } from "@/lib/numerology";
import type { Section, SectionModel } from "./types";

const Z = "/zodiac/";
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const ELEMENTS: Element[] = ["fire", "earth", "air", "water"];
const MODALITIES: Modality[] = ["cardinal", "fixed", "mutable"];

/** Signs written in every language (gated by tests/zodiac-overlap.test.ts). */
export const ZODIAC_SIGNS: Sign[] = SIGNS.filter((s) => ZODIAC.en.signs[s] && ZODIAC.mk.signs[s] && ZODIAC.de.signs[s]);

const langOf = (lang: string): ZodiacLang => ZODIAC[lang] ?? ZODIAC.en;
const day = (s: string, months: string[]) => { const [m, d] = s.split(" "); return formatDate(isoOf(2001, MONTHS.indexOf(m) + 1, Number(d)), months, { year: false }); };
/** The engine's date range in reader's words, e.g. "21. März bis 19. April". */
export function signDates(lang: string, s: Sign): string {
  const months = getContent(lang).site.months; const [a, b] = SIGN_DATES[s];
  return `${day(a, months)} ${langOf(lang).labels.to} ${day(b, months)}`;
}
const rulers = (s: Sign) => SIGN_RULER[s].split(" & ").map((n) => n.toLowerCase() as "mars");
/** Localized ruling planets from the engine's table: "Mars", or "Mars (traditional), Pluto (modern)". */
function rulerLine(lang: string, s: Sign): string {
  const names = rulers(s).map((p) => getContent(lang).astro.points[p].name); const L = langOf(lang).labels;
  return names.length === 1 ? names[0] : `${names[0]} (${L.traditional}), ${names[1]} (${L.modern})`;
}
/** Ruling planet names of a sign, in one language. */
export const signRulerNames = (lang: string, s: Sign) => rulers(s).map((p) => getContent(lang).astro.points[p].name);

export function hubModel(lang: string, path: string): SectionModel {
  const c = getContent(lang); const { hub: H, labels: L, signs } = langOf(lang); const A = c.astro; const lp = (p: string) => localizedPath(lang, p);
  const name = (s: Sign) => A.signs[s].name;
  const join = (list: Sign[]) => list.map(name).join(", ");
  const blocks: Block[] = [
    { id: "intro", title: H.crumb, paras: H.intro },
    { id: "elements", title: H.elementsTitle, paras: [H.elementsIntro], list: ELEMENTS.map((e) => `${A.elements[e].name} (${join(SIGNS.filter((s) => SIGN_ELEMENT[s] === e))}): ${H.elements[e]}`) },
    { id: "modalities", title: H.modalitiesTitle, paras: [H.modalitiesIntro], list: MODALITIES.map((m) => `${A.modalities[m].name} (${join(SIGNS.filter((s) => SIGN_MODALITY[s] === m))}): ${H.modalities[m]}`) },
    ...H.more.map((x, i) => ({ id: `more-${i}`, title: x.title, paras: x.paras })),
  ];
  return { sectionName: H.crumb, published: ZODIAC_DATE, modified: ZODIAC_DATE, path, kind: "hub", eyebrow: H.crumb, h1: H.h1, title: H.metaTitle, description: H.description, lead: H.lead,
    crumbs: [[c.site.brand, `/${lang}/`], [H.crumb, lp(Z)]], faq: H.faq, blocks,
    items: SIGNS.filter((s) => signs[s]).map((s) => ({ href: lp(`${Z}${s}/`), label: name(s), sub: `${signDates(lang, s)} · ${A.elements[SIGN_ELEMENT[s]].name}`, big: SIGN_GLYPH[s] })),
    related: [{ href: lp("/horoscope/"), label: L.dailyHub, sub: L.dailyHubSub }, { href: lp("/sign-compatibility/"), label: L.compatHub, sub: L.compatHubSub }, { href: lp("/rising-sign/"), label: L.rising, sub: L.risingSub }, { href: lp("/moon-sign/"), label: L.moon, sub: L.moonSub }, { href: lp("/birth-chart/"), label: L.chart, sub: L.chartSub }, { href: lp("/numerology/"), label: L.numerology, sub: L.numerologySub }] };
}

function model(lang: string, path: string): SectionModel | null {
  const item = path.split("/").filter(Boolean)[1];
  if (!item) return ZODIAC_SIGNS.length ? hubModel(lang, path) : null;
  const s = item as Sign; const { hub: H, labels: L, signs } = langOf(lang); const P = signs[s]; if (!P) return null;
  const c = getContent(lang); const A = c.astro; const lp = (p: string) => localizedPath(lang, p);
  const name = (x: Sign) => A.signs[x].name; const i = SIGNS.indexOf(s); const at = (n: number) => SIGNS[(n + 12) % 12];
  const dates = signDates(lang, s); const fill = (t: string) => t.replaceAll("{dates}", dates);
  const match = (o: Sign, tag: string): LinkItem => ({ href: lp(`/sign-compatibility/${signPairSlug(s, o)}/`), label: `${name(s)} + ${name(o)}`, sub: `${tag}: ${P.matchNotes[o] ?? ""}`, big: SIGN_GLYPH[o] });
  const facts: Block = { id: "facts", title: L.factsTitle(name(s)), list: [`${L.dates}: ${dates}`, `${L.element}: ${A.elements[SIGN_ELEMENT[s]].name}`, `${L.modality}: ${A.modalities[SIGN_MODALITY[s]].name}`, `${L.ruler}: ${rulerLine(lang, s)}`, `${L.opposite}: ${name(at(i + 6))}`] };
  const blocks: Block[] = P.sections.map((x, k) => ({ id: x.kind === "extra" ? `extra-${k}` : x.kind, title: x.title, paras: x.paras?.map(fill), list: x.list?.map(fill), quote: x.quote && fill(x.quote) }));
  const { best, hardest } = ZODIAC_MATCHES[s];
  return { sectionName: H.crumb, published: ZODIAC_DATE, modified: ZODIAC_DATE, path, kind: "article", eyebrow: `${H.crumb} · ${name(s)}`, h1: P.h1, title: P.metaTitle, description: fill(P.description), lead: fill(P.lead), big: SIGN_GLYPH[s],
    crumbs: [[c.site.brand, `/${lang}/`], [H.crumb, lp(Z)], [name(s), lp(path)]],
    blocks: [facts, ...blocks], faq: P.faq.map(([q, a]) => [fill(q), fill(a)]),
    related: [...best.map((o) => match(o, L.bestMatch)), ...hardest.map((o) => match(o, L.hardestMatch)),
      { href: lp(`/horoscope/${s}/`), label: L.daily(name(s)), big: SIGN_GLYPH[s] }, { href: lp(`/weekly-horoscope/${s}/`), label: L.weekly(name(s)), big: SIGN_GLYPH[s] }, { href: lp(`/monthly-horoscope/${s}/`), label: L.monthly(name(s)), big: SIGN_GLYPH[s] }, { href: lp(`/horoscope-2027/${s}/`), label: L.yearly(name(s)), big: SIGN_GLYPH[s] },
      { href: lp("/sign-compatibility/"), label: L.compatHub, sub: L.compatHubSub }, { href: lp("/rising-sign/"), label: L.rising, sub: L.risingSub }, { href: lp("/numerology/"), label: L.numerology, sub: L.numerologySub }],
    prev: { href: lp(`${Z}${at(i - 1)}/`), label: name(at(i - 1)) }, next: { href: lp(`${Z}${at(i + 1)}/`), label: name(at(i + 1)) } };
}

/** Zodiac sign profiles: /zodiac/, /zodiac/<sign>/. */
export const zodiac: Section = { key: "zodiac", paths: () => (ZODIAC_SIGNS.length ? [Z, ...ZODIAC_SIGNS.map((s) => `${Z}${s}/`)] : []), model, modified: () => ZODIAC_DATE };
