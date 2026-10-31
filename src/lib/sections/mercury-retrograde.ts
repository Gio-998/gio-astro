import { getContent } from "@/content";
import { calendarCopy, MERCURY_RETROGRADE_DATE } from "@/content/calendars";
import type { MercuryDates } from "@/content/calendars/types";
import { houseFrom, todayIso } from "@/engine/skyday";
import { mercuryNext, mercuryNow, mercuryYear, type MercuryPeriod } from "@/engine/sky-calendar";
import { SIGNS, SIGN_GLYPH, type Sign } from "@/engine/zodiac";
import { formatDate } from "@/lib/dates";
import { localizedPath } from "@/lib/i18n-routes";
import type { Block, TableCell } from "@/lib/numerology";
import type { Section, SectionModel } from "./types";

const H = "/mercury-retrograde/";
export const MERCURY_YEARS = [2026, 2027];
/** Copy key of a period: its year and the signs the engine found it in. A shifted result finds no text and fails the test. */
export const periodKey = (y: number, p: MercuryPeriod) => `${y}:${p.signs.join(">")}`;

function ctx(lang: string) {
  const c = getContent(lang); const C = calendarCopy(lang); const Z = C.mercury; const lp = (p: string) => localizedPath(lang, p); const months = c.site.months;
  const name = (s: Sign) => c.astro.signs[s].name; const sign = (s: Sign) => `${SIGN_GLYPH[s]} ${name(s)}`;
  const day = (iso: string) => formatDate(iso, months, { year: false }); const full = (iso: string) => formatDate(iso, months); const week = (iso: string) => formatDate(iso, months, { year: false, weekday: c.site.weekdays });
  const list = (a: string[]) => (a.length > 1 ? `${a.slice(0, -1).join(", ")} ${C.and} ${a.at(-1)}` : a[0] ?? "");
  const range = (p: MercuryPeriod) => Z.range(p.retro.iso.slice(0, 4) === p.direct.iso.slice(0, 4) ? day(p.retro.iso) : full(p.retro.iso), full(p.direct.iso));
  const chain = (p: MercuryPeriod) => p.signs.map(name).join(" → ");
  const home: [string, string] = [c.site.brand, `/${lang}/`]; const hub: [string, string] = [Z.crumb, lp(H)];
  const base = { sectionName: Z.crumb, published: MERCURY_RETROGRADE_DATE, modified: MERCURY_RETROGRADE_DATE };
  return { c, C, Z, lp, name, sign, day, full, week, list, range, chain, home, hub, base };
}
type Ctx = ReturnType<typeof ctx>;

const dates = (x: Ctx, p: MercuryPeriod, since: string): MercuryDates => ({ since: x.full(since), retro: x.full(p.retro.iso), direct: x.full(p.direct.iso), shadowStart: x.full(p.shadowStart.iso), shadowEnd: x.full(p.shadowEnd.iso), signIn: x.C.signIn[p.signs[0]] });

/** The four stages of a period plus any sign change while it runs backwards. */
function stages(x: Ctx, p: MercuryPeriod): TableCell[][] {
  const S = x.Z.stage; const pos = (s: Sign, d: number) => `${x.sign(s)} ${d}°`;
  const rows: [string, TableCell[]][] = [
    [p.shadowStart.at, [S.preShadow, x.full(p.shadowStart.iso), p.shadowStart.time, pos(p.direct.sign, p.direct.degree)]],
    [p.retro.at, [S.retro, x.full(p.retro.iso), p.retro.time, pos(p.retro.sign, p.retro.degree)]],
    ...p.ingresses.map((g): [string, TableCell[]] => [g.at, [S.moves(x.C.signTo[g.to]), x.full(g.iso), g.time, x.sign(g.to)]]),
    [p.direct.at, [S.direct, x.full(p.direct.iso), p.direct.time, pos(p.direct.sign, p.direct.degree)]],
    [p.shadowEnd.at, [S.postShadow, x.full(p.shadowEnd.iso), p.shadowEnd.time, pos(p.retro.sign, p.retro.degree)]],
  ];
  return rows.sort((a, b) => a[0].localeCompare(b[0])).map(([, r]) => r);
}
const stageTable = (x: Ctx, p: MercuryPeriod) => ({ head: [x.Z.head.stage, x.Z.head.date, x.Z.head.time, x.Z.head.position], rows: stages(x, p), caption: x.Z.clock });

function yearModel(lang: string, path: string, y: number): SectionModel {
  const x = ctx(lang); const { C, Z, lp } = x; const Y = Z.year; const P = mercuryYear(y); const ranges = P.map((p) => x.range(p));
  const blocks: Block[] = [
    { id: "dates", title: Y.overviewTitle(y), paras: Y.intro[y], table: { head: [Z.head.period, Z.head.signs, Z.head.shadow], rows: P.map((p, i) => [{ text: ranges[i], href: `#p${i}` }, x.chain(p), Z.range(x.day(p.shadowStart.iso), x.day(p.shadowEnd.iso))]) } },
    ...P.flatMap((p, i): Block[] => {
      const T = Z.periods[periodKey(y, p)];
      return [
        { id: `p${i}`, title: Y.periodTitle(ranges[i], x.chain(p)), paras: T.paras, table: stageTable(x, p) },
        { id: `h${i}`, title: Y.bySignTitle(x.chain(p)), table: { head: [Z.head.sign, Z.head.house, Z.head.focus], rows: SIGNS.map((s, k) => [{ text: x.sign(s), href: lp(`/horoscope/${s}/`) }, p.signs.map((v) => houseFrom(s, v)).join(" → "), T.bySign[k]]), caption: Y.bySignCaption } },
      ];
    }),
  ];
  const faq: [string, string][] = [
    [Y.qWhen(y), Y.aWhen(y, x.list(P.map((p) => `${x.range(p)} ${C.signIn[p.signs[0]]}`)))],
    [Y.qShadow(y), Y.aShadow(x.list(P.map((p) => Z.range(x.day(p.shadowStart.iso), x.day(p.shadowEnd.iso)))))],
    [Y.qSigns(y), Y.aSigns(x.list([...new Set(P.flatMap((p) => p.signs))].map(x.name)))],
  ];
  const other = MERCURY_YEARS.find((v) => v !== y)!;
  return { ...x.base, path, kind: "article", eyebrow: Z.crumb, h1: Y.h1(y), title: Y.title(y), description: Y.description(y, C.times(P.length)), lead: Y.lead(y, C.times(P.length), x.list(ranges)), big: "☿",
    crumbs: [x.home, x.hub, [String(y), lp(path)]], blocks, faq,
    related: [{ href: lp(`${H}${other}/`), label: C.links.mercuryYear(other), big: "☿" }, { href: lp(`/moon-calendar/${y}/`), label: C.links.moonYear(y), big: "☾" }, { href: lp("/horoscope/"), label: C.links.daily, sub: C.links.dailySub }, { href: lp("/monthly-horoscope/"), label: C.links.monthly }, { href: lp("/rising-sign/"), label: C.links.rising }] };
}

function hubModel(lang: string, path: string): SectionModel {
  const x = ctx(lang); const { C, Z, lp } = x; const now = new Date(); const st = mercuryNow(now); const iso = todayIso(now);
  const yearLink = (p: MercuryPeriod) => { const y = Number(p.retro.iso.slice(0, 4)); return MERCURY_YEARS.includes(y) ? { href: lp(`${H}${y}/`) } : {}; };
  const blocks: Block[] = [
    { id: "now", title: Z.nowTitle, paras: [Z.asOf(x.full(iso))], table: stageTable(x, st.period) },
    { id: "next", title: Z.nextTitle, table: { head: [Z.head.period, Z.head.signs, Z.head.shadow], rows: mercuryNext(now, 4).map((p) => [{ text: x.range(p), ...yearLink(p) }, x.chain(p), Z.range(x.day(p.shadowStart.iso), x.day(p.shadowEnd.iso))]) } },
    ...Z.hub.blocks,
  ];
  return { ...x.base, modified: modified(H), path, kind: "hub", eyebrow: Z.crumb, h1: Z.hub.h1, title: Z.hub.title, description: Z.hub.description, lead: Z.answer[st.state](dates(x, st.period, st.since)), big: "☿",
    crumbs: [x.home, x.hub], blocks, faq: Z.hub.faq,
    related: [...MERCURY_YEARS.map((y) => ({ href: lp(`${H}${y}/`), label: C.links.mercuryYear(y), big: "☿" })), { href: lp("/moon-calendar/"), label: C.moon.crumb, big: "☾" }, { href: lp("/horoscope/"), label: C.links.daily, sub: C.links.dailySub }, { href: lp("/rising-sign/"), label: C.links.rising }] };
}

function model(lang: string, path: string): SectionModel | null {
  const item = path.split("/").filter(Boolean)[1];
  if (!item) return hubModel(lang, path);
  const y = Number(item); return MERCURY_YEARS.includes(y) ? yearModel(lang, path, y) : null;
}
/** The hub's answer changes the day Mercury changes stage, so that day is its real date. Year pages only change with their copy. */
function modified(path: string): string {
  if (path !== H) return MERCURY_RETROGRADE_DATE;
  const since = mercuryNow(new Date()).since;
  return since > MERCURY_RETROGRADE_DATE ? since : MERCURY_RETROGRADE_DATE;
}
export const mercuryRetrograde: Section = { key: "mercury-retrograde", paths: () => [H, ...MERCURY_YEARS.map((y) => `${H}${y}/`)], model, modified };
