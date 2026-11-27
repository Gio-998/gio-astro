import { localizedPath } from "@/lib/i18n-routes";
import { getContent } from "@/content";
import { SIGNS, SIGN_GLYPH, type Sign } from "@/engine/zodiac";
import { YEARLY, YEARLY_ANSWER, YEARLY_FRAME, YEARLY_HUB, YEARLY_DATE, type YearlyHub } from "@/content/yearly2027";
import { houseFrom } from "@/engine/skyday";
import { SKY2027 } from "@/lib/sky2027";
import type { Section, SectionModel } from "./types";

const S = "/horoscope-2027/";
/** Signs written in every language (gated by tests/yearly2027-overlap.test.ts). */
export const YEARLY_SIGNS: Sign[] = SIGNS.filter((s) => YEARLY.en[s] && YEARLY.mk[s] && YEARLY.de[s] && YEARLY.sr[s]);

const fill = (t: string, v: Record<string, string>) => t.replace(/\{(\w+)\}/g, (_, k: string) => v[k]);
/** A sky date in the reader's language, with the year only when it is not 2027. */
export function skyDate(H: YearlyHub, iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${fill(H.sky.date, { m: H.sky.months[m - 1], d: String(d) })}${y === 2027 ? "" : ` ${y}`}`;
}
/** Sky events of 2027 as dated lines, with the sign each one happens in. The hub lists them as they are; a sign page adds its own house. */
function skyRows(H: YearlyHub, aspects: boolean): { date: string; text: string; sign: Sign }[] {
  const X = H.sky; const place = (deg: number, s: Sign) => `${deg}° ${X.signsIn[s]}`; const rows: { date: string; text: string; sign: Sign }[] = [];
  for (const x of SKY2027.stations) if (x.body in X.bodies && x.date.startsWith("2027")) rows.push({ date: x.date, text: fill(x.dir === "retro" ? X.retro : X.direct, { a: X.bodies[x.body], p: place(x.deg, x.sign) }), sign: x.sign });
  for (const x of SKY2027.ingresses) if (x.body === "jupiter" || x.body === "saturn") rows.push({ date: x.date, text: fill(X.enters, { a: X.bodies[x.body], s: X.signsIn[x.sign] }), sign: x.sign });
  for (const x of SKY2027.eclipses) rows.push({ date: x.date, text: fill(X.eclipses[`${x.type}-${x.kind}`], { p: place(x.deg, x.sign) }), sign: x.sign });
  if (aspects) for (const x of SKY2027.slowAspects) if (x.a === "jupiter" && (x.type === "trine" || x.type === "square")) rows.push({ date: x.date, text: fill(x.type === "trine" ? X.trine : X.square, { p: `${place(x.degA, x.signA)}, ${place(x.degB, x.signB)}` }), sign: x.signA });
  return rows.sort((a, b) => a.date.localeCompare(b.date));
}
/** The hub's date list, built from the computed sky so no date here is typed by hand. */
export const mainDates = (H: YearlyHub): string[] => skyRows(H, true).map((r) => `${skyDate(H, r.date)}: ${r.text}`);
/** One sign's dates: each event of the year with the house of that sign it lands in. */
export function signDates(lang: string, sign: Sign): [string, string, string][] {
  const H = YEARLY_HUB[lang] ?? YEARLY_HUB.en; const F = YEARLY_FRAME[lang] ?? YEARLY_FRAME.en;
  return skyRows(H, false).map((r) => [skyDate(H, r.date), r.text, F.house(houseFrom(sign, r.sign))]);
}

function model(lang: string, path: string): SectionModel | null {
  const c = getContent(lang); const H = YEARLY_HUB[lang] ?? YEARLY_HUB.en; const F = YEARLY_FRAME[lang] ?? YEARLY_FRAME.en; const brand = c.site.brand; const L = H.links;
  const lp = (p: string) => localizedPath(lang, p); const name = (s: Sign) => c.astro.signs[s].name;
  const home: [string, string] = [brand, `/${lang}/`]; const hub: [string, string] = [H.crumb, lp(S)];
  const item = path.split("/").filter(Boolean)[1] as Sign | undefined;
  const base = { sectionName: H.crumb, published: YEARLY_DATE, modified: YEARLY_DATE };
  const common = [{ href: lp("/numerology/personal-year-2027/"), label: L.personalYear, sub: L.personalYearSub }, { href: lp("/mercury-retrograde/"), label: L.mercury, sub: L.mercurySub }, { href: lp("/rising-sign/"), label: L.rising, sub: L.risingSub }];
  if (!item) return { ...base, path, kind: "hub", eyebrow: H.crumb, h1: H.h1, title: H.metaTitle, description: H.description, lead: H.lead, crumbs: [home, hub], faq: H.faq,
    blocks: [{ id: "big-picture", title: H.bigPicture.title, paras: H.bigPicture.paras }, { id: "dates", title: H.datesTitle, paras: [H.datesIntro], list: mainDates(H) }, { id: "how-to-read", title: H.howTo.title, paras: H.howTo.paras }],
    items: YEARLY_SIGNS.map((s) => ({ href: lp(`${S}${s}/`), label: name(s), sub: YEARLY[lang][s]!.hubLine, big: SIGN_GLYPH[s] })), related: common };
  if (!YEARLY_SIGNS.includes(item)) return null;
  const P = YEARLY[lang][item]!; const i = YEARLY_SIGNS.indexOf(item); const at = (n: number) => YEARLY_SIGNS[(n + YEARLY_SIGNS.length) % YEARLY_SIGNS.length]; const glyph = SIGN_GLYPH[item];
  return { ...base, path, kind: "article", eyebrow: `${H.crumb} · ${name(item)}`, h1: P.h1, title: P.metaTitle, description: P.description, lead: P.lead, big: glyph, crumbs: [home, hub, [name(item), lp(path)]],
    answer: { label: F.answerLabel, text: YEARLY_ANSWER[lang]?.[item] ?? YEARLY_ANSWER.en[item] },
    blocks: [...P.sections.map((s, k) => ({ id: `s${k}`, title: s.title, paras: s.paras, list: s.list })), { id: "method", title: H.method.title, paras: [H.method.para] }].flatMap((b, k) => k === 0 ? [b, { id: "key-dates", title: F.datesTitle(name(item)), table: { head: F.head, rows: signDates(lang, item), caption: F.caption } }] : [b]), faq: P.faq,
    related: [{ href: lp(`/zodiac/${item}/`), label: name(item), sub: L.zodiac, big: glyph }, { href: lp(`/horoscope/${item}/`), label: name(item), sub: L.daily, big: glyph }, { href: lp(`/weekly-horoscope/${item}/`), label: name(item), sub: L.weekly, big: glyph }, { href: lp(`/monthly-horoscope/${item}/`), label: name(item), sub: L.monthly, big: glyph }, ...common],
    prev: { href: lp(`${S}${at(i - 1)}/`), label: name(at(i - 1)) }, next: { href: lp(`${S}${at(i + 1)}/`), label: name(at(i + 1)) } };
}
/** 2027 yearly horoscopes: /horoscope-2027/, /horoscope-2027/<sign>/. */
export const yearly: Section = { key: "horoscope-2027", paths: () => (YEARLY_SIGNS.length ? [S, ...YEARLY_SIGNS.map((s) => `${S}${s}/`)] : []), model, modified: () => YEARLY_DATE };
