/**
 * Weekly and monthly horoscopes: reads the real sky of a period (src/engine/skyperiod.ts), maps it to a sign's houses and
 * assembles the page from the hand-written banks in src/content/horoscope-period. Server only. The site rebuilds nightly,
 * so the evergreen pages move on to the next week or month by themselves.
 */
import { DateTime } from "luxon";
import { getContent } from "@/content";
import { de } from "@/content/horoscope-period/de";
import { en } from "@/content/horoscope-period/en";
import { mk } from "@/content/horoscope-period/mk";
import { sr } from "@/content/horoscope-period/sr";
import type { PeriodBank, PeriodKind, Placed, Three } from "@/content/horoscope-period/types";
import { hash } from "@/engine/daily";
import { SKY_ZONE, addDays, houseFrom, todayIso, type Body } from "@/engine/skyday";
import { QUARTERS, aspectWeight, periodSky, type MoonDay, type PeriodEvent, type PeriodSky, type Quarter } from "@/engine/skyperiod";
import { SIGNS, SIGN_GLYPH, type Sign } from "@/engine/zodiac";
import { daysInMonth, formatDate, isoOf } from "./dates";
import { HORO_LOCALES, bankFor, dayNumber, type HoroLocale } from "./horoscope";
import { localizedPath } from "./i18n-routes";
import type { Block, LinkItem, NumModel } from "./numerology";

export const PERIOD_BANKS: Record<HoroLocale, PeriodBank> = { en, mk, de, sr };
export const periodBank = (lang: string): PeriodBank => PERIOD_BANKS[lang as HoroLocale] ?? en;

/** The first dated monthly pages. Every month from here on stays online. */
export const FIRST_MONTH = "2026-11";
export const WEEKLY_PATH = "/weekly-horoscope/";
export const MONTHLY_PATH = "/monthly-horoscope/";
const FIRST_PUBLISHED: Record<PeriodKind, string> = { week: "2026-10-26", month: "2026-10-01" };

export interface Period { kind: PeriodKind; start: string; end: string; /** Counts up by one per period, drives the phrase rotation. */ index: number }
export function weekPeriod(iso: string): Period {
  const start = DateTime.fromISO(iso, { zone: SKY_ZONE }).startOf("week").toISODate()!;
  return { kind: "week", start, end: addDays(start, 6), index: Math.floor(dayNumber(start) / 7) };
}
export function monthPeriod(ym: string): Period {
  const [y, m] = ym.split("-").map(Number);
  return { kind: "month", start: `${ym}-01`, end: isoOf(y, m, daysInMonth(y, m)), index: y * 12 + m - 1 };
}
/** Weeks run Monday to Sunday in Skopje. */
export const currentWeek = (now = new Date()) => weekPeriod(todayIso(now));
export const currentMonth = (now = new Date()) => monthPeriod(todayIso(now).slice(0, 7));
const shiftMonth = (ym: string, n: number) => { const [y, m] = ym.split("-").map(Number); const t = y * 12 + m - 1 + n; return `${Math.floor(t / 12)}-${String((t % 12) + 1).padStart(2, "0")}`; };
/** Months with a dated page in this build: every month since FIRST_MONTH, through next month. */
export function publishedMonths(now = new Date()): string[] {
  const out: string[] = []; const last = shiftMonth(todayIso(now).slice(0, 7), 1);
  for (let m = FIRST_MONTH; m <= last; m = shiftMonth(m, 1)) out.push(m);
  return out;
}

export interface PeriodReading {
  lang: HoroLocale; sign: Sign; signName: string; period: Period;
  /** "2 to 8 November" or "November 2026". */
  label: string;
  lead: string; description: string; descriptionDated: string;
  short: string[]; sky: string[]; steps: string[]; love: string[]; work: string[]; well: string[]; best: string[]; prompt: string;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const lower = (s: string) => s.replace(/^(The|Die) /, (m) => m.toLowerCase());
/** First candidate that fits a search snippet, else the one closest to fitting. */
function fit(options: string[]): string {
  const miss = (s: string) => Math.max(120 - s.length, s.length - 155, 0);
  return [...options].sort((a, b) => miss(a) - miss(b))[0];
}
const isLunation = (e: PeriodEvent): e is Extract<PeriodEvent, { kind: "lunation" }> => e.kind === "lunation";
const INNER: Body[] = ["mercury", "venus", "mars"];
const GIANT: Body[] = ["jupiter", "saturn"];
/** How strongly each house carries a "best day": Moon in signs that flow with yours first, its quiet houses last. */
const DAY_WEIGHT = [3, 2, 2.5, 1.5, 3, 1.5, 2, 1, 2.5, 2.5, 3, 0.5];
const KEY_HOUSE = [1, 7, 10, 4, 5];

function eventScore(e: PeriodEvent, h: number, sign: Sign): number {
  const near = KEY_HOUSE.includes(h) ? 6 : 0;
  if (e.kind === "aspect") return 20 + aspectWeight(e);
  if (e.kind === "lunation") return 60 + (e.quarter === "new" || e.quarter === "full" ? 6 : 0) + (e.eclipse ? 30 : 0) + near;
  if (e.kind === "station") return (GIANT.includes(e.body) ? 66 : INNER.includes(e.body) ? 62 : 50) + near;
  return (e.body === "sun" ? 48 : INNER.includes(e.body) ? 52 : 72) + near + (e.to === sign ? 8 : 0);
}
/** Every sign change, station and lunation, plus only the strongest aspects. */
function shownEvents(sky: PeriodSky, kind: PeriodKind): PeriodEvent[] {
  const aspects = sky.events.filter((e): e is Extract<PeriodEvent, { kind: "aspect" }> => e.kind === "aspect").sort((a, b) => aspectWeight(b) - aspectWeight(a)).slice(0, kind === "week" ? 3 : 5);
  return sky.events.filter((e) => e.kind !== "aspect" || aspects.includes(e));
}
/** Runs of days the Moon spends in one sign. */
function moonRuns(days: MoonDay[]): { sign: Sign; from: string; to: string }[] {
  const out: { sign: Sign; from: string; to: string }[] = [];
  for (const d of days) { const l = out[out.length - 1]; if (l?.sign === d.sign) l.to = d.iso; else out.push({ sign: d.sign, from: d.iso, to: d.iso }); }
  return out;
}

const memo = new Map<string, PeriodReading>();
export function periodReading(lang: string, sign: Sign, p: Period): PeriodReading {
  const L = (HORO_LOCALES as readonly string[]).includes(lang) ? (lang as HoroLocale) : "en";
  const id = `${L}|${sign}|${p.kind}|${p.start}`; const hit = memo.get(id); if (hit) return hit;
  const B = PERIOD_BANKS[L]; const D = bankFor(L); const c = getContent(L); const sky = periodSky(p.start, p.end);
  const months = c.site.months; const N = (s: Sign) => c.astro.signs[s].name; const signName = N(sign);
  const date = (iso: string) => formatDate(iso, months, { year: false }); const dateW = (iso: string) => formatDate(iso, months, { year: false, weekday: D.weekdays });
  const dayPart = (iso: string) => [Number(iso.slice(8)), months[Number(iso.slice(5, 7)) - 1]] as const;
  const on = (iso: string) => B.dates.on(date(iso));
  const when = (from: string, to: string) => (from === to ? on(from) : B.dates.span(...dayPart(from), ...dayPart(to)));
  const label = p.kind === "week" ? B.dates.range(...dayPart(p.start), ...dayPart(p.end)) : B.dates.monthYear(months[Number(p.start.slice(5, 7)) - 1], Number(p.start.slice(0, 4)));
  const H = (s: Sign) => houseFrom(sign, s); const HN = (h: number) => B.houses[h - 1]; const T = (h: number) => D.topics[h - 1];
  const body = (b: Body) => lower(D.bodies[b]);
  /** Rotation through a pool: a sign and slot offset, plus one step per period, so consecutive periods never share a pick. */
  const spin = (n: number, slot: string) => (p.index + hash(`${sign}|${p.kind}|${slot}`)) % n;
  const pick = <X,>(arr: X[], slot: string): X => arr[spin(arr.length, slot)];
  const entry = (bank: Three[], h: number, slot: string) => pick(bank[h - 1], slot);

  const phrase = (e: PeriodEvent) => e.kind === "lunation" ? B.sky.lunation(e.eclipse ? B.eclipse[e.eclipse] : B.lunation[e.quarter], N(e.sign))
    : e.kind === "ingress" ? B.sky.ingress(body(e.body), N(e.to)) : e.kind === "station" ? B.sky.station[e.dir](body(e.body), N(e.sign)) : B.sky.aspect[e.type](body(e.a), body(e.b));
  const evHouse = (e: PeriodEvent) => (e.kind === "ingress" ? H(e.to) : e.kind === "aspect" ? H(sky.signs.sun) : H(e.sign));
  const leadOf = (e: PeriodEvent) => cap(e.kind === "aspect" ? B.sky.leadAspect(phrase(e), on(e.iso)) : B.sky.lead(phrase(e), on(e.iso), HN(evHouse(e))));

  const shown = shownEvents(sky, p.kind);
  const key = [...shown].sort((a, b) => eventScore(b, evHouse(b), sign) - eventScore(a, evHouse(a), sign))[0];
  const keyHouse = key ? evHouse(key) : H(sky.signs.sun);
  const lunations = sky.events.filter(isLunation);
  const running = sky.retro.find((r) => INNER.includes(r.body) && r.until);
  const nextLine = cap(B.sky.next(phrase(sky.next), on(sky.next.iso), HN(H(sky.next.sign))));
  const retroLead = running ? cap(B.sky.leadRetro(body(running.body), HN(H(running.sign)), date(running.until!))) : "";
  // A lone aspect is thin news: on a quiet week a retrograde still running says more.
  const lead = key && key.kind !== "aspect" ? leadOf(key) : retroLead || (key ? leadOf(key) : nextLine);
  const focus: Quarter = p.kind === "month" ? QUARTERS[(p.index + hash(sign)) % 4] : (lunations[0] ?? sky.next).quarter;
  const twin = QUARTERS[(QUARTERS.indexOf(focus) + 2) % 4];

  const sunEnd = sky.events.filter((e) => e.kind === "ingress" && e.body === "sun").at(-1);
  const sunHouse = H(sky.signs.sun);
  const open = pick(B.open[p.kind], "open")({ sign: signName, range: label, topic: T(sunHouse), sunSign: N(sky.signs.sun), house: HN(sunHouse) });
  const sunParas = p.kind === "month" && sunEnd?.kind === "ingress" ? [`${open} ${entry(B.sun, sunHouse, "sun")}`, `${cap(B.sky.lead(phrase(sunEnd), on(sunEnd.iso), HN(H(sunEnd.to))))} ${entry(B.sun, H(sunEnd.to), "sun2")}`] : [`${open} ${entry(B.sun, sunHouse, "sun")}`];
  const short = [...sunParas];
  if (p.kind === "week") {
    for (const e of lunations) short.push(`${leadOf(e)} ${B.lunations[e.quarter][H(e.sign) - 1]}`);
    if (!lunations.length) short.push([...new Set([lead, key ? leadOf(key) : "", nextLine])].filter(Boolean).join(" "));
    else if (key && !isLunation(key)) short.push(lead);
    short.push(B.voice[sign][focus]);
  } else {
    if (key) short.push(`${lead} ${B.voice[sign][focus]}`); else short.push(B.voice[sign][focus]);
  }
  const steps = p.kind === "month" ? lunations.map((e) => [leadOf(e), B.lunations[e.quarter][H(e.sign) - 1], e.quarter === twin ? B.voice[sign][twin] : ""].filter(Boolean).join(" ")) : [];

  /** A planet's place in the period: the opening sentence and the houses it touches. */
  const placed = (b: Placed) => {
    // sky.signs is noon on day one, so a change earlier that morning is already behind us.
    const moves = sky.events.filter((e): e is Extract<PeriodEvent, { kind: "ingress" }> => e.kind === "ingress" && e.body === b && !(e.iso === p.start && e.time < "12:00"));
    const from = sky.signs[b]; const hf = H(from); const last = moves.at(-1);
    // A retrograde can leave a sign and come back within the period: then the first departure is the news.
    const move = last?.to === from ? moves[0] : last;
    if (!move) return { line: pick(B.place[b], `place-${b}`)(N(from), HN(hf), B.per[p.kind]), houses: [hf] };
    const ht = H(move.to);
    return { line: B.move(D.bodies[b], N(from), HN(hf), N(move.to), HN(ht), on(move.iso)), houses: p.kind === "month" ? [hf, ht] : [ht] };
  };
  const planet = (b: Placed, bank: Three[]) => { const x = placed(b); return [x.line, ...x.houses.map((h, k) => entry(bank, h, `${b}${k}`))].join(" "); };
  const isRetro = (b: Body) => sky.retro.some((r) => r.body === b);
  const retroNote = (b: "mercury" | "venus" | "mars") => (isRetro(b) ? ` ${pick(B.retroNote[b], `retro-${b}`)}` : "");
  const pass = (h: number) => { const r = moonRuns(sky.moon).find((x) => H(x.sign) === h); return r ? when(r.from, r.to) : ""; };
  const moonLine = (slot: keyof PeriodBank["moon"], h: number) => { const w = pass(h); return w ? cap(pick(B.moon[slot], `moon-${slot}`)(w)) : ""; };
  const moonPara = (lines: string[], fallback: keyof PeriodBank["moonFallback"]) => lines.filter(Boolean).join(" ") || pick(B.moonFallback[fallback], `fb-${fallback}`);

  const love = [planet("venus", B.venus) + retroNote("venus"), B.love[keyHouse - 1][spin(2, "love")], moonPara([moonLine("love5", 5), moonLine("love7", 7)], "love"), `${pick(B.single, "single")} ${pick(B.couple, "couple")}`];
  const work = [planet("mercury", B.mercury) + retroNote("mercury"), planet("mars", B.mars) + retroNote("mars"), `${planet("jupiter", B.jupiter)} ${planet("saturn", B.saturn)}`, moonPara([moonLine("work10", 10), moonLine("money2", 2)], "work")];
  const m0 = sky.moon[0], m1 = sky.moon[sky.moon.length - 1];
  const well = [`${B.sky.phaseArc[p.kind](D.phases[m0.phase], m0.illumination, D.phases[m1.phase], m1.illumination)} ${pick(B.phaseWell[focus], "phase")}`, pick(B.well[sign], "well"), moonPara([moonLine("self1", 1), moonLine("rest12", 12)], "well")];

  const dayScore = (d: MoonDay) => {
    let s = DAY_WEIGHT[H(d.sign) - 1] + (hash(`${sign}|${d.iso}`) % 100) / 1000;
    for (const e of sky.events) if (e.iso === d.iso) { if (e.kind === "station") s -= 1; if (e.kind === "aspect") s += e.type === "square" || e.type === "opposition" ? -0.75 : 0.5; }
    return s;
  };
  const gap = p.kind === "month" ? 3 : 1; const wanted = p.kind === "month" ? 5 : 3; const chosen: MoonDay[] = [];
  for (const d of [...sky.moon].sort((a, b) => dayScore(b) - dayScore(a))) {
    if (chosen.length >= wanted) break;
    if (chosen.some((x) => x.sign === d.sign || Math.abs(dayNumber(x.iso) - dayNumber(d.iso)) < gap)) continue;
    chosen.push(d);
  }
  chosen.sort((a, b) => a.iso.localeCompare(b.iso));
  const best = chosen.map((d) => cap(B.bestLine(dateW(d.iso), N(d.sign), entry(B.best, H(d.sign), `best-${H(d.sign)}`))));
  const eventLine = (e: PeriodEvent) => {
    const at = cap("time" in e ? B.dates.timed(dateW(e.iso), e.time) : dateW(e.iso));
    if (e.kind !== "aspect") return `${at}: ${phrase(e)}. ${B.sky.house(HN(evHouse(e)), T(evHouse(e)))}`;
    const tone = e.type === "conjunction" ? "conj" : e.type === "square" || e.type === "opposition" ? "hard" : "soft";
    return `${at}: ${phrase(e)}. ${cap(B.sky.note[tone](B.rules[e.a], B.rules[e.b]))}`;
  };
  const skyList = [...shown.map(eventLine), ...sky.retro.filter((r) => r.until).map((r) => cap(B.sky.retro[r.body as Placed](N(r.sign), date(r.until!)))), ...(lunations.length ? [] : [nextLine])];
  const keyText = key ? B.sky.key(phrase(key), on(key.iso), date(key.iso)) : T(sunHouse);
  const descCtx = { sign: signName, range: label, key: keyText, best: chosen[0] ? date(chosen[0].iso) : date(p.start) };
  const r: PeriodReading = {
    lang: L, sign, signName, period: p, label, lead, short, sky: skyList, steps, love, work, well, best, prompt: entry(B.prompts, keyHouse, "prompt"),
    description: fit((p.kind === "week" ? B.ui.descWeek : B.ui.descMonth).map((f) => f(descCtx))), descriptionDated: p.kind === "month" ? fit(B.ui.descDated.map((f) => f(descCtx))) : "",
  };
  if (memo.size > 2000) memo.clear();
  memo.set(id, r);
  return r;
}

/** Sign independent list of the period's sky, for hub pages. */
export function skyLines(lang: string, p: Period): string[] {
  const L = (HORO_LOCALES as readonly string[]).includes(lang) ? (lang as HoroLocale) : "en";
  const B = PERIOD_BANKS[L]; const D = bankFor(L); const c = getContent(L); const sky = periodSky(p.start, p.end); const N = (s: Sign) => c.astro.signs[s].name;
  const dateW = (iso: string) => formatDate(iso, c.site.months, { year: false, weekday: D.weekdays }); const body = (b: Body) => lower(D.bodies[b]);
  const phrase = (e: PeriodEvent) => e.kind === "lunation" ? B.sky.lunation(e.eclipse ? B.eclipse[e.eclipse] : B.lunation[e.quarter], N(e.sign))
    : e.kind === "ingress" ? B.sky.ingress(body(e.body), N(e.to)) : e.kind === "station" ? B.sky.station[e.dir](body(e.body), N(e.sign)) : B.sky.aspect[e.type](body(e.a), body(e.b));
  return [...shownEvents(sky, p.kind).map((e) => `${cap("time" in e ? B.dates.timed(dateW(e.iso), e.time) : dateW(e.iso))}: ${phrase(e)}.`),
    ...sky.retro.filter((r) => r.until).map((r) => cap(B.sky.retro[r.body as Placed](N(r.sign), formatDate(r.until!, c.site.months, { year: false }))))];
}

/** Page blocks of a reading, in reading order. */
export function periodBlocks(lang: string, r: PeriodReading): Block[] {
  const U = periodBank(lang).ui; const k = r.period.kind; const h = U.heads;
  return [
    { id: "short", title: h.short[k], paras: r.short },
    { id: "sky", title: h.sky, paras: [U.skyNote[k]], list: r.sky },
    ...(r.steps.length ? [{ id: "steps", title: h.steps, paras: r.steps }] : []),
    { id: "love", title: h.love, paras: r.love },
    { id: "work", title: h.work, paras: r.work },
    { id: "well", title: h.well, paras: r.well },
    { id: "best", title: h.best, list: r.best },
    { id: "prompt", title: h.prompt[k], quote: r.prompt },
  ];
}

/** Links every period page carries. The other family's sign page comes first. */
export function periodLinks(lang: string, sign: Sign, kind: PeriodKind): LinkItem[] {
  const U = periodBank(lang).ui.related; const name = getContent(lang).astro.signs[sign].name; const lp = (p: string) => localizedPath(lang, p); const big = SIGN_GLYPH[sign];
  return [
    kind === "week" ? { href: lp(`${MONTHLY_PATH}${sign}/`), label: `${U.month}: ${name}`, big } : { href: lp(`${WEEKLY_PATH}${sign}/`), label: `${U.week}: ${name}`, big },
    { href: lp(`/horoscope/${sign}/`), label: U.daily(name), big },
    { href: lp(`/zodiac/${sign}/`), label: U.zodiac(name), big },
    { href: lp(`/horoscope-2027/${sign}/`), label: U.year(name), big },
    { href: lp("/moon-calendar/"), label: U.moon, big: "☾" },
  ];
}

/** Hub page shared by both families. */
export function periodHub(lang: string, p: Period, root: string): NumModel {
  const B = periodBank(lang); const c = getContent(lang); const k = p.kind; const H = B.hub[k]; const lp = (x: string) => localizedPath(lang, x); const crumb = B.ui.section[k];
  const label = periodReading(lang, "aries", p).label;
  return { path: root, kind: "hub", eyebrow: crumb, h1: H.h1(label), title: H.title, description: H.description, lead: H.lead(label), crumbs: [[c.site.brand, `/${lang}/`], [crumb, lp(root)]], faq: H.faq,
    sectionName: crumb, published: FIRST_PUBLISHED[k], modified: p.start,
    blocks: [{ id: "intro", title: crumb, paras: H.intro }, { id: "sky", title: H.skyHead, list: skyLines(lang, p) }, { id: "how", title: H.howHead, paras: H.how }],
    items: SIGNS.map((s) => ({ href: lp(`${root}${s}/`), label: c.astro.signs[s].name, sub: periodReading(lang, s, p).lead, big: SIGN_GLYPH[s] })),
    related: [{ href: lp(k === "week" ? MONTHLY_PATH : WEEKLY_PATH), label: B.ui.related.hub[k === "week" ? "month" : "week"] }, { href: lp("/horoscope/"), label: B.ui.related.hubDaily }, { href: lp("/moon-calendar/"), label: B.ui.related.moon, big: "☾" }] };
}

/** One sign page. `dated` is the month key of a dated page; without it this is the evergreen page. */
export function periodPage(lang: string, path: string, sign: Sign, p: Period, root: string, opts: { dated?: string; modified: string; extra?: LinkItem[]; prev?: LinkItem; next?: LinkItem }): NumModel {
  const B = periodBank(lang); const U = B.ui; const c = getContent(lang); const k = p.kind; const r = periodReading(lang, sign, p); const lp = (x: string) => localizedPath(lang, x);
  const crumb = U.section[k]; const signPage: [string, string] = [r.signName, lp(`${root}${sign}/`)]; const at = (n: number) => SIGNS[(SIGNS.indexOf(sign) + n + 12) % 12];
  const near = (s: Sign): LinkItem => ({ href: lp(`${root}${s}/`), label: c.astro.signs[s].name });
  return { path, kind: "article", eyebrow: `${crumb} · ${r.signName}`, big: SIGN_GLYPH[sign], lead: r.lead, faq: [],
    h1: k === "week" ? U.h1Week(r.signName, r.label) : U.h1Month(r.signName, r.label),
    title: k === "week" ? U.titleWeek(r.signName) : opts.dated ? U.titleDated(r.signName, r.label) : U.titleMonth(r.signName),
    description: opts.dated ? r.descriptionDated : r.description,
    crumbs: [[c.site.brand, `/${lang}/`], [crumb, lp(root)], signPage, ...(opts.dated ? [[r.label, lp(path)] as [string, string]] : [])],
    sectionName: crumb, published: opts.dated ? opts.modified : FIRST_PUBLISHED[k], modified: opts.modified, blocks: periodBlocks(lang, r),
    related: [...(opts.dated ? [{ href: signPage[1], label: `${U.related.month}: ${r.signName}`, big: SIGN_GLYPH[sign] }] : []), ...periodLinks(lang, sign, k), ...(opts.extra ?? [])],
    prev: opts.prev ?? near(at(-1)), next: opts.next ?? near(at(1)) };
}
