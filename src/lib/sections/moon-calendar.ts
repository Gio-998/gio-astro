import { DateTime } from "luxon";
import { getContent } from "@/content";
import { calendarCopy, MOON_CALENDAR_DATE } from "@/content/calendars";
import { addDays, publishedDates, SKY_ZONE, todayIso } from "@/engine/skyday";
import { monthDays, monthLunations, moonDay, mercuryYear, nextLunations, nextNewMoon, QUARTER_ANGLE, spanPhase, sunIngress, yearLunations, type Lunation, type MoonDay, type Quarter } from "@/engine/sky-calendar";
import { SIGN_GLYPH, type Sign } from "@/engine/zodiac";
import { bankFor } from "@/lib/horoscope";
import { formatDate } from "@/lib/dates";
import { localizedPath } from "@/lib/i18n-routes";
import type { Block, TableCell } from "@/lib/numerology";
import type { Section, SectionModel } from "./types";

const H = "/moon-calendar/";
export const MOON_YEARS = [2026, 2027];
/** One page per local calendar month, November 2026 through December 2027. */
export const MOON_MONTHS: string[] = [...["11", "12"].map((m) => `2026-${m}`), ...Array.from({ length: 12 }, (_, i) => `2027-${String(i + 1).padStart(2, "0")}`)];

const cap = (s: string) => s.charAt(0).toLocaleUpperCase() + s.slice(1);
const key = (l: Lunation) => `${l.quarter}:${l.sign}`;
/** All lunations on the month pages. A phase can fall in the same sign twice, so each gets its own written text. */
export const windowLunations = (): Lunation[] => MOON_MONTHS.flatMap(monthLunations);
const nth = new Map<string, number>();
export function reflectionOf(lang: string, l: Lunation): string {
  if (!nth.size) { const seen: Record<string, number> = {}; for (const x of windowLunations()) { const k = key(x); nth.set(x.at, seen[k] ?? 0); seen[k] = (seen[k] ?? 0) + 1; } }
  return calendarCopy(lang).moon.reflect[key(l)]?.[nth.get(l.at) ?? 0] ?? "";
}

/** Date links reach a daily page only once that page exists: the build publishes up to three days ahead. */
const published = (() => { let day = ""; let set = new Set<string>(); return () => { const t = todayIso(); if (t !== day) { day = t; set = new Set(publishedDates()); } return set; }; })();

function ctx(lang: string) {
  const c = getContent(lang); const C = calendarCopy(lang); const lp = (p: string) => localizedPath(lang, p); const months = c.site.months;
  const name = (s: Sign) => c.astro.signs[s].name; const sign = (s: Sign) => `${SIGN_GLYPH[s]} ${name(s)}`;
  const day = (iso: string) => formatDate(iso, months, { year: false }); const full = (iso: string) => formatDate(iso, months); const week = (iso: string) => formatDate(iso, months, { year: false, weekday: c.site.weekdays });
  const list = (a: string[]) => (a.length > 1 ? `${a.slice(0, -1).join(", ")} ${C.and} ${a.at(-1)}` : a[0] ?? "");
  const home: [string, string] = [c.site.brand, `/${lang}/`]; const hub: [string, string] = [C.moon.crumb, lp(H)];
  const base = { sectionName: C.moon.crumb, published: MOON_CALENDAR_DATE, modified: MOON_CALENDAR_DATE };
  return { c, C, M: C.moon, lp, months, name, sign, day, full, week, list, home, hub, base };
}
type Ctx = ReturnType<typeof ctx>;

const rowOf = (x: Ctx, l: Lunation): TableCell[] => [{ text: x.C.quarter[l.quarter], moon: QUARTER_ANGLE[l.quarter] }, x.week(l.iso), l.time, `${x.sign(l.sign)} ${l.degree}°`];
const of = (L: Lunation[], ...q: Quarter[]) => L.filter((l) => q.includes(l.quarter));

/** Which clock a month's times are on, from the zone itself. */
function zoneNote(x: Ctx, ym: string): string {
  const off = (iso: string) => DateTime.fromISO(iso, { zone: SKY_ZONE }).plus({ hours: 12 }).offset; const first = `${ym}-01`; const Z = x.M.zone;
  for (let d = first; d.startsWith(ym); d = addDays(d, 1)) if (off(d) !== off(first)) return Z.change(x.day(d));
  return off(first) === 60 ? Z.winter : Z.summer;
}

function dayRow(x: Ctx, d: MoonDay, lang: string): TableCell[] {
  const iso = d.iso; const n = Number(iso.slice(8)); const wd = x.C.dayShort[new Date(`${iso}T12:00:00Z`).getUTCDay()];
  const signCell = d.moves ? `${x.name(d.sign)} → ${x.name(d.moves.to)} ${d.moves.time}` : x.name(d.sign);
  const href = x.lp(published().has(iso) ? `/horoscope/${d.noon}/${iso}/` : `/horoscope/${d.noon}/`);
  return [`${wd} ${n}${lang === "de" || lang === "sr" ? "." : ""}`, { text: d.lunation ? `${x.C.quarter[d.lunation.quarter]} ${d.lunation.time}` : x.C.pct(d.illumination), moon: d.angle }, signCell, { text: x.sign(d.noon), href }];
}

function monthModel(lang: string, path: string, ym: string): SectionModel {
  const x = ctx(lang); const { C, M, lp } = x; const [y, mo] = ym.split("-").map(Number); const m = x.months[mo - 1];
  const L = monthLunations(ym); const news = of(L, "new"), fulls = of(L, "full"); const D = monthDays(ym);
  const i = MOON_MONTHS.indexOf(ym); const prev = MOON_MONTHS[i - 1], next = MOON_MONTHS[i + 1]; const label = (k: string) => { const [a, b] = k.split("-").map(Number); return `${x.months[b - 1]} ${a}`; };
  const phrase = (l: Lunation) => `${x.day(l.iso)} ${C.signIn[l.sign]}`;
  const whenAll = (ls: Lunation[]) => x.list(ls.map((l) => C.when(x.week(l.iso), l.time, C.signIn[l.sign])));
  const first = news[0]; const close = nextNewMoon(first); const hours = Math.round((Date.parse(close.at) - Date.parse(first.at)) / 36e5); const sun = sunIngress(ym);
  const mercury = mercuryYear(y).filter((p) => p.retro.iso.slice(0, 7) <= ym && p.direct.iso.slice(0, 7) >= ym);
  const facts = [
    M.month.cycle(x.full(first.iso), C.span(Math.floor(hours / 24), hours % 24), x.full(close.iso)),
    M.month.sun(x.full(sun.iso), C.signTo[sun.to]),
    M.month.changes(m, y, D.filter((d) => d.moves).length, C.signIn[D[0].sign], C.signIn[D.at(-1)!.moves?.to ?? D.at(-1)!.sign]),
    ...mercury.map((p) => M.month.mercury(m, y, x.full(p.retro.iso), x.full(p.direct.iso))),
    ...L.filter((l) => l.eclipse).map((l) => M.month.eclipse(C.quarter[l.quarter], x.full(l.iso), C.eclipse[l.eclipse!])),
    ...(news.length > 1 ? [M.twoInMonth(M.plural.new, m, y, x.list(news.map((l) => x.day(l.iso))))] : []), ...(fulls.length > 1 ? [M.twoInMonth(M.plural.full, m, y, x.list(fulls.map((l) => x.day(l.iso))))] : []),
  ];
  const blocks: Block[] = [
    { id: "phases", title: M.month.phasesTitle(m, y), table: { head: [M.head.phase, M.head.date, M.head.time, M.head.sign], rows: L.map((l) => rowOf(x, l)), caption: zoneNote(x, ym) } },
    ...L.map((l) => ({ id: `l-${l.iso}`, title: M.month.lunationTitle(C.quarter[l.quarter], C.signIn[l.sign], x.day(l.iso)), paras: [reflectionOf(lang, l)] })),
    { id: "facts", title: M.month.factsTitle(m, y), list: facts },
    { id: "days", title: M.month.daysTitle(m, y), table: { head: [M.head.day, M.head.moon, M.head.moonSign, M.head.horoscope], rows: D.map((d) => dayRow(x, d, lang)), caption: M.month.daysCaption } },
  ];
  const faq: [string, string][] = [
    [M.month.qFull(m, y), M.month.aFull(m, y, whenAll(fulls))], [M.month.qNew(m, y), M.month.aNew(m, y, whenAll(news))],
    [M.month.qHalf(m, y), M.month.aHalf(whenAll(of(L, "first-quarter")), whenAll(of(L, "last-quarter")))],
  ];
  const signs = [...new Set([...news, ...fulls].map((l) => l.sign))];
  return { ...x.base, path, kind: "article", eyebrow: `${M.crumb} · ${y}`, h1: M.month.h1(m, y), title: M.month.title(m, y), big: "☾",
    description: M.month.description({ newMoon: phrase(first), full: phrase(fulls[0]), m, y }), lead: M.month.lead({ newMoons: x.list(news.map(phrase)), fulls: x.list(fulls.map(phrase)), m, y }),
    crumbs: [x.home, x.hub, [`${m} ${y}`, lp(path)]], blocks, faq,
    prev: prev ? { href: lp(`${H}${prev}/`), label: label(prev) } : undefined, next: next ? { href: lp(`${H}${next}/`), label: label(next) } : undefined,
    related: [{ href: lp(`${H}${y}/`), label: C.links.moonYear(y), big: "☾" }, { href: lp(`/mercury-retrograde/${y}/`), label: C.links.mercuryYear(y), big: "☿" },
      ...signs.flatMap((s) => [{ href: lp(`/horoscope/${s}/`), label: C.links.horoscopeOf(x.name(s)), big: SIGN_GLYPH[s] }, { href: lp(`/zodiac/${s}/`), label: C.links.zodiacOf(x.name(s)), big: SIGN_GLYPH[s] }]),
      { href: lp("/monthly-horoscope/"), label: C.links.monthly }, { href: lp("/moon-sign/"), label: C.links.moonSign }] };
}

function yearModel(lang: string, path: string, y: number): SectionModel {
  const x = ctx(lang); const { C, M, lp } = x; const L = yearLunations(y); const fulls = of(L, "full"), news = of(L, "new"); const Y = M.year;
  const rows = (ls: Lunation[]): TableCell[][] => ls.map((l) => { const ym = l.iso.slice(0, 7); return [{ text: x.week(l.iso), moon: QUARTER_ANGLE[l.quarter], ...(MOON_MONTHS.includes(ym) ? { href: lp(`${H}${ym}/`) } : {}) }, l.time, x.sign(l.sign), l.eclipse ? C.eclipse[l.eclipse] : "·"]; });
  const head = [M.head.date, M.head.time, M.head.sign, M.head.note];
  const twoIn = (q: "new" | "full", ls: Lunation[]) => [...new Set(ls.map((l) => l.iso.slice(0, 7)))].flatMap((ym) => { const hit = ls.filter((l) => l.iso.startsWith(ym)); return hit.length > 1 ? [M.twoInMonth(M.plural[q], x.months[Number(ym.slice(5)) - 1], y, x.list(hit.map((l) => x.day(l.iso))))] : []; });
  const twice = (q: "new" | "full", ls: Lunation[]) => [...new Set(ls.map((l) => l.sign))].flatMap((s) => { const hit = ls.filter((l) => l.sign === s); return hit.length > 1 ? [Y.twice(M.plural[q], C.signIn[s], y, x.list(hit.map((l) => x.day(l.iso))))] : []; });
  const ecl = L.filter((l) => l.eclipse);
  const facts = [...twoIn("full", fulls), ...twoIn("new", news), ...twice("full", fulls), ...twice("new", news)];
  const blocks: Block[] = [
    { id: "about", title: Y.aboutTitle(y), paras: Y.intro[y], list: facts },
    { id: "full", title: Y.fullTitle(y), table: { head, rows: rows(fulls), caption: Y.tableCaption } },
    { id: "new", title: Y.newTitle(y), table: { head, rows: rows(news) } },
    { id: "eclipses", title: Y.eclipseTitle(y), list: ecl.map((l) => Y.eclipseLine(x.full(l.iso), C.eclipse[l.eclipse!], C.quarter[l.quarter], C.signIn[l.sign])) },
  ];
  const faq: [string, string][] = [
    [Y.qFull(y), Y.aCount(y, fulls.length, M.plural.full, x.full(fulls[0].iso), x.full(fulls.at(-1)!.iso))],
    [Y.qNew(y), Y.aCount(y, news.length, M.plural.new, x.full(news[0].iso), x.full(news.at(-1)!.iso))],
    [Y.qEclipse(y), Y.aEclipse(x.list(ecl.map((l) => `${x.full(l.iso)} (${C.eclipse[l.eclipse!]})`)))],
  ];
  const other = MOON_YEARS.find((v) => v !== y)!; const months = MOON_MONTHS.filter((k) => k.startsWith(`${y}-`));
  return { ...x.base, path, kind: "article", eyebrow: M.crumb, h1: Y.h1(y), title: Y.title(y), description: Y.description(y, fulls.length, news.length), lead: Y.lead(y, fulls.length, news.length), big: String(y),
    crumbs: [x.home, x.hub, [String(y), lp(path)]], blocks, faq,
    related: [...months.map((k) => ({ href: lp(`${H}${k}/`), label: `${x.months[Number(k.slice(5)) - 1]} ${y}`, big: "☾" })), { href: lp(`${H}${other}/`), label: C.links.moonYear(other), big: "☾" }, { href: lp(`/mercury-retrograde/${y}/`), label: C.links.mercuryYear(y), big: "☿" }, { href: lp("/horoscope/"), label: C.links.daily, sub: C.links.dailySub }] };
}

function hubModel(lang: string, path: string): SectionModel {
  const x = ctx(lang); const { C, M, lp } = x; const now = new Date(); const iso = todayIso(now); const t = moonDay(iso); const exact = monthLunations(iso.slice(0, 7)).find((l) => l.iso === iso); const phase = bankFor(lang).phases[exact?.quarter ?? spanPhase(t.angle)];
  const upcoming = nextLunations(now, 4);
  const nextOf = (q: Quarter) => nextLunations(now, 5).find((l) => l.quarter === q)!;
  const whenOf = (l: Lunation) => C.when(x.week(l.iso), l.time, C.signIn[l.sign]);
  const cell = (ls: Lunation[]) => ls.map((l) => `${x.day(l.iso)}, ${x.sign(l.sign)}`).join(" · ");
  const blocks: Block[] = [
    { id: "now", title: M.nowTitle, table: { head: [M.head.phase, M.head.date, M.head.time, M.head.sign], rows: [[{ text: cap(phase), moon: t.angle }, `${M.todayLabel}, ${x.day(iso)}`, "·", x.sign(t.noon)], ...upcoming.map((l) => rowOf(x, l))], caption: C.mercury.clock } },
    { id: "months", title: M.monthsTitle, table: { head: [M.head.month, M.head.newMoon, M.head.fullMoon], rows: MOON_MONTHS.map((k) => { const L = monthLunations(k); const [a, b] = k.split("-").map(Number); return [{ text: `${x.months[b - 1]} ${a}`, href: lp(`${H}${k}/`) }, cell(of(L, "new")), cell(of(L, "full"))]; }) } },
    ...M.hub.blocks,
  ];
  const faq: [string, string][] = [[M.faqNext.qFull, M.faqNext.a(whenOf(nextOf("full")))], [M.faqNext.qNew, M.faqNext.a(whenOf(nextOf("new")))], ...M.hub.faq];
  return { ...x.base, modified: iso, path, kind: "hub", eyebrow: M.crumb, h1: M.hub.h1, title: M.hub.title, description: M.hub.description, lead: M.today(x.full(iso), phase, t.illumination, C.signIn[t.noon]), big: "☾",
    crumbs: [x.home, x.hub], blocks, faq,
    related: [...MOON_YEARS.map((y) => ({ href: lp(`${H}${y}/`), label: C.links.moonYear(y), big: "☾" })), { href: lp("/mercury-retrograde/"), label: C.mercury.crumb, big: "☿" }, { href: lp("/horoscope/"), label: C.links.daily, sub: C.links.dailySub }, { href: lp("/moon-sign/"), label: C.links.moonSign }] };
}

function model(lang: string, path: string): SectionModel | null {
  const item = path.split("/").filter(Boolean)[1];
  if (!item) return hubModel(lang, path);
  if (MOON_MONTHS.includes(item)) return monthModel(lang, path, item);
  const y = Number(item); return MOON_YEARS.includes(y) ? yearModel(lang, path, y) : null;
}
/** The hub shows today's Moon, so it changes daily. Everything else only changes when the copy does: the dates are fixed sky facts. */
const modified = (path: string) => (path === H ? todayIso() : MOON_CALENDAR_DATE);
export const moonCalendar: Section = { key: "moon-calendar", paths: () => [H, ...MOON_YEARS.map((y) => `${H}${y}/`), ...MOON_MONTHS.map((k) => `${H}${k}/`)], model, modified };
