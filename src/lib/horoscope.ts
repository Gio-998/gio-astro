/** Assembles the public daily horoscope text for a sign + date + locale from live sky data and the hand-written banks. */
import { inline } from "@/content/sr/inline";
import { getContent } from "@/content";
import { en } from "@/content/horoscope/en";
import { mk } from "@/content/horoscope/mk";
import { de } from "@/content/horoscope/de";
import { sr } from "@/content/horoscope/sr";
import type { HoroBank } from "@/content/horoscope/types";
import type { HoroVariety, DayCtx, LeadSection } from "@/content/horoscope/variety-types";
import { enVariety } from "@/content/horoscope/en-variety";
import { mkVariety } from "@/content/horoscope/mk-variety";
import { deVariety } from "@/content/horoscope/de-variety";
import { srVariety } from "@/content/horoscope/sr-variety";
import { hash } from "@/engine/daily";
import { skyDay, addDays, todayIso, nextEvents, BODIES, type SkyDay, type Body } from "@/engine/skyday";
import { SIGNS, type Sign, type Element } from "@/engine/zodiac";
import { formatDate } from "./dates";
import { SITE_URL } from "./site-url";
import { routeAlternates } from "./i18n-routes";

export const HORO_LOCALES = ["en", "mk", "de", "sr"] as const;
export type HoroLocale = (typeof HORO_LOCALES)[number];
export const BANKS: Record<HoroLocale, HoroBank> = { en, mk, de, sr };
export const VARIETY: Record<HoroLocale, HoroVariety> = { en: enVariety, mk: mkVariety, de: deVariety, sr: srVariety };
export const bankFor = (lang: string): HoroBank => BANKS[(lang as HoroLocale)] ?? en;
export const COLOR_HEX: Record<Element, [string, string, string]> = {
  fire: ["#d9573b", "#f2a33a", "#e9c78a"], earth: ["#6f8f4e", "#b8643e", "#d8c29a"], air: ["#8ec5ff", "#b9a7f5", "#c9cbd6"], water: ["#1f9a95", "#5b5fd6", "#e8e4f0"],
};

export const signFromSlug = (lang: string, slug: string): Sign | undefined => SIGNS.find((s) => bankFor(lang).signSlug[s] === slug);
/** Locale path, e.g. /mk/dneven-horoskop/skorpija/2026-10-13/ or /en/horoscope/scorpio/ (no date = today index). */
export function horoPath(lang: string, sign?: Sign, iso?: string): string {
  const b = bankFor(lang);
  return `/${lang}/${b.slug}/${sign ? `${b.signSlug[sign]}/` : ""}${iso ? `${iso}/` : ""}`;
}
/** hreflang map from the shared slug map (internal route /horoscope/<sign>/<date>/). */
export const horoAlternates = (sign?: Sign, iso?: string) => routeAlternates(`/horoscope/${sign ? `${sign}/` : ""}${iso ? `${iso}/` : ""}`);
export const ogPath = (lang: string, sign: Sign, iso: string, fmt: "wide" | "story") => `/og/horoscope/${lang}/${sign}/${iso}-${fmt}.png`;
/** Days that get their own generated share image (today + tomorrow); every other date uses the lean per-sign JPEG. */
export const ogUniqueDays = (now = new Date()) => { const t = todayIso(now); return new Set([t, addDays(t, 1)]); };
/** Share image for a sign + date: unique PNG for today/tomorrow, else /og/sign/<lang>-<sign>.jpg (~50 KB). */
export const ogImage = (lang: string, sign: Sign, iso: string) => (ogUniqueDays().has(iso) ? ogPath(lang, sign, iso, "wide") : `/og/sign/${(HORO_LOCALES as readonly string[]).includes(lang) ? lang : "en"}-${sign}.jpg`);
export const absolute = (p: string) => `${SITE_URL}${p}`;

export interface Reading {
  lang: HoroLocale; sign: Sign; iso: string; sky: SkyDay; signName: string; dateLabel: string; weekday: string;
  title: string; description: string; headline: string; love: string[]; work: string[]; well: string[]; sky_: string[];
  lucky: { color: string; hex: string; number: number; window: string };
  moonLine: string; prev: string; next: string;
  overview: string; single: string; couple: string; money: string[]; body: string; friends: string; why: string[];
  best: string; avoid: string; prompt: string; week: { date: string; text: string }[];
  planets: { body: Body; name: string; sign: Sign; signName: string; retro: boolean }[];
}

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
/** Days since 1970-01-01 for an ISO date. */
export const dayNumber = (iso: string) => { const [y, m, d] = iso.split("-").map(Number); return Math.floor(Date.UTC(y, m - 1, d) / 864e5); };
/**
 * Deterministic rotation through a pool of n: a sign and slot specific offset plus a step coprime to n per day,
 * so consecutive days never share a pick and pools of 7+ never repeat within a week.
 */
export function rotate(n: number, iso: string, salt: string): number {
  const step = [3, 5, 7, 11, 13, 2].find((k) => k % n !== 0 && gcd(k, n) === 1) ?? 1;
  return (((dayNumber(iso) * step + hash(salt)) % n) + n) % n;
}
const lower = (s: string) => s.replace(/^(The|Die) /, (m) => m.toLowerCase());

export function reading(lang: string, sign: Sign, iso: string): Reading {
  const L = (HORO_LOCALES as readonly string[]).includes(lang) ? (lang as HoroLocale) : "en";
  const B = BANKS[L]; const c = getContent(L); const sky = skyDay(iso, sign);
  const N = (s: Sign) => c.astro.signs[s].name; const T = (h: number) => B.topics[h - 1];
  const signName = N(sign); const dateLabel = formatDate(iso, c.site.months);
  const [y, m, d] = iso.split("-").map(Number); const weekday = B.weekdays[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  const V = VARIETY[L]; const prevSky = skyDay(addDays(iso, -1), sign); const dn = dayNumber(iso); const alt = ((dn % 2) + 2) % 2;
  const R = (n: number, slot: string) => rotate(n, iso, `${sign}|${slot}`);
  const pick = <T,>(arr: T[], slot: string) => arr[R(arr.length, slot)];
  const ctx: DayCtx = { day: weekday, moon: N(sky.moon.sign), phase: (V.phaseForm ?? B.phases)[sky.moon.phase], topic: T(sky.moon.house) };
  const lead = (sec: LeadSection) => pick(V.lead[sec], `lead-${sec}`)(ctx);
  const planetLine = (p: "mercury" | "venus" | "mars" | "jupiter" | "saturn", extra?: string) => { const pool = [...V.planet[p].map((f) => f(T(sky.houses[p]))), ...(extra ? [extra] : [])]; return pool[R(pool.length, p)]; };
  const moonChanged = sky.moon.sign !== prevSky.moon.sign; const phaseChanged = sky.moon.phase !== prevSky.moon.phase; const houseChanged = sky.moon.house !== prevSky.moon.house;
  const prev2 = skyDay(addDays(iso, -2), sign);
  // Slow moving notes (phase mood, element mood) show on the day they change and then every other day, never two days running.
  const showPhase = phaseChanged || (alt === 0 && prevSky.moon.phase === prev2.moon.phase);
  const showHouse = houseChanged || (alt === 0 && prevSky.moon.house === prev2.moon.house);
  const showEl = moonChanged || (alt === 1 && prevSky.moon.sign === prev2.moon.sign);
  const ma = sky.moonAspects[R(Math.max(1, sky.moonAspects.length), "ma")];
  const moonAspectLine = ma ? pick(V.moonAspect[ma.type], `ma-${ma.type}`)(lower(B.bodies[ma.body]), ma.time) : "";
  const headline = pick(V.headline, "headline")(ctx);
  const love = [[lead("love"), showHouse ? B.love[sky.moon.house - 1] : ""].filter(Boolean).join(" "), [planetLine("venus", B.venus[sky.houses.venus - 1]), sky.retro.includes("venus") ? pick(V.retro.venus, "rv") : ""].filter(Boolean).join(" ")];
  const work = [`${lead("work")} ${planetLine("mercury", B.work[sky.houses.mercury - 1])}`];
  if (sky.retro.includes("mercury")) work.push(pick(V.retro.mercury, "rm")); else if (sky.retro.includes("mars")) work.push(pick(V.retro.mars, "rma")); else work.push(planetLine("mars", B.mars[sky.houses.mars - 1]));
  const well = [lead("well"), moonChanged ? B.wellEl[sky.moon.element] : phaseChanged ? B.well[sky.moon.phase] : pick(V.tip, "tip")];
  const S = B.sky; const lines: string[] = [];
  const moonLine = S.moonIn(N(sky.moon.sign), B.phases[sky.moon.phase], sky.moon.illumination) + (sky.moon.moves ? ` ${S.moonMoves(N(sky.moon.moves.to), sky.moon.moves.time)}` : "");
  lines.push(`${moonLine} ${S.forYou(T(sky.moon.house))}`); const usedHouses = new Set<number>([sky.moon.house]);
  const stationed = new Set<string>();
  if (ma) lines.push(moonAspectLine);
  for (const e of sky.events) {
    if ("house" in e) usedHouses.add(e.house);
    if (e.kind === "quarter") lines.push(S.quarter[e.quarter](N(e.sign), e.time, T(e.house)));
    else if (e.kind === "station") { stationed.add(e.body); lines.push(S.station[e.dir](B.bodies[e.body], N(e.sign), T(e.house))); }
    else if (e.kind === "ingress") lines.push(S.ingress(B.bodies[e.body], N(e.to), T(e.house)));
    else lines.push(S.aspect[e.type](B.bodies[e.a], B.bodies[e.b]) + (e.exact ? ` ${S.exactToday}` : ""));
  }
  for (const p of ["mercury", "venus", "mars"] as const) if (sky.retro.includes(p) && !stationed.has(p)) { const h = sky.houses[p]; lines.push(usedHouses.has(h) ? S.retroSame(B.bodies[p], N(sky.signs[p])) : S.retroOngoing(B.bodies[p], N(sky.signs[p]), T(h))); usedHouses.add(h); }
  const inSign = (["sun", "mercury", "venus", "mars", "jupiter", "saturn"] as const).filter((p) => sky.signs[p] === sign && !stationed.has(p) && !sky.events.some((e) => e.kind === "ingress" && e.body === p));
  if (inSign.length) { const names = inSign.map((p) => B.bodies[p]); lines.push(S.inSign(names.length > 1 ? `${names.slice(0, -1).join(", ")} ${S.and} ${names.at(-1)}` : names[0], names.length > 1, N(sign))); }
  if (lines.length === 1) lines.push(S.calm);
  // Long-form blocks.
  const M = B.more; const mh = sky.moon.house; const v = (n: number, k: number) => (sky.seed >>> k) % n;
  void v;
  const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  const overview = [lead("overview"), M.theme[mh - 1][alt], V.weekday[new Date(Date.UTC(y, m - 1, d)).getUTCDay()], moonAspectLine, showPhase ? M.phaseMood[sky.moon.phase] : "", showEl ? M.elMood[sky.moon.element] : "", pick(M.close, "close")].filter(Boolean).join(" ");
  const single = `${lead("single")} ${M.single[mh - 1][alt]} ${V.dayLove[new Date(Date.UTC(y, m - 1, d)).getUTCDay()]}`; const ma2 = sky.moonAspects.find((x) => x !== ma);
  const couple = [lead("couple"), M.couple[mh - 1][alt], ma2 ? pick(V.moonAspect[ma2.type], `ma2-${ma2.type}`)(lower(B.bodies[ma2.body]), ma2.time) : ""].filter(Boolean).join(" ");
  const money = [lead("money"), planetLine("jupiter", M.jupiter[sky.houses.jupiter - 1]), planetLine("saturn", M.saturn[sky.houses.saturn - 1])];
  const why: string[] = [`${pick(V.whyMoon, "wm")(M.ordinal[mh - 1], N(sky.moon.sign))}${showHouse ? ` ${M.houseWhy[mh - 1]}` : ""}`];
  const drv = sky.events.find((e) => e.kind !== "aspect");
  if (drv?.kind === "quarter") why.push(M.why.quarter(M.quarterName[drv.quarter], M.ordinal[drv.house - 1]));
  else if (drv?.kind === "station") why.push(M.why.station(B.bodies[drv.body], M.planetWhy[drv.body], drv.dir, M.ordinal[drv.house - 1]));
  else if (drv?.kind === "ingress") why.push(M.why.ingress(B.bodies[drv.body], M.planetWhy[drv.body], N(drv.to), M.ordinal[drv.house - 1]));
  else { const r = (["mercury", "venus", "mars"] as const).find((p) => sky.retro.includes(p)); if (r && alt === 0) why.push(M.why.retro(B.bodies[r], M.planetWhy[r], M.ordinal[sky.houses[r] - 1])); }
  why.push(pick(V.whySun, "ws")(N(sky.signs.sun), M.ordinal[sky.houses.sun - 1]));
  const retroP = (["mercury", "venus", "mars"] as const).find((p) => sky.retro.includes(p));
  const avoid = [pick(V.avoid, "avoid")(ctx.phase), phaseChanged ? M.avoid[sky.moon.phase] : "", retroP && alt === 1 ? M.avoidRetro[retroP] : ""].filter(Boolean).join(" ");
  const week = nextEvents(iso, sign, 3).map(({ iso: wi, event: e }) => {
    const text = e.kind === "quarter" ? M.week.quarter(M.quarterName[e.quarter], N(e.sign), T(e.house)) : e.kind === "station" ? M.week.station(B.bodies[e.body], e.dir, N(e.sign)) : M.week.ingress(B.bodies[e.body], N(e.to), T(e.house));
    const [yy, mm, dd] = wi.split("-").map(Number);
    return { date: `${B.weekdays[new Date(Date.UTC(yy, mm - 1, dd)).getUTCDay()]}, ${formatDate(wi, c.site.months, { year: false })}`, text };
  });
  const planets = BODIES.map((b) => ({ body: b, name: B.bodies[b], sign: sky.signs[b], signName: N(sky.signs[b]), retro: sky.retro.includes(b) }));
  const el = sky.moon.element; const pad = (h: number) => `${String(h).padStart(2, "0")}:00`;
  return {
    lang: L, sign, iso, sky, signName, dateLabel, weekday,
    title: B.ui.title(signName, dateLabel), description: B.ui.description(signName, dateLabel, headline),
    headline, love, work, well, sky_: lines.slice(0, 5), moonLine,
    lucky: { color: B.colors[el][sky.lucky.color], hex: COLOR_HEX[el][sky.lucky.color], number: sky.lucky.number, window: `${pad(sky.lucky.window[0])} ${({ mk: "до", de: "bis", sr: inline.rangeTo } as Record<string, string>)[L] ?? "to"} ${pad(sky.lucky.window[1])}` },
    prev: addDays(iso, -1), next: addDays(iso, 1),
    overview, single, couple, money, body: [moonChanged ? M.body[sky.moon.sign] : "", pick(V.bodyTip, "body"), well[1] === pick(V.tip, "tip") ? "" : pick(V.tip, "tip")].filter(Boolean).join(" "), friends: [lead("friends"), M.friends[mh - 1][alt], V.dayPeople[dow], showPhase ? M.family[sky.moon.phase] : ""].filter(Boolean).join(" "), why,
    best: `${pad(sky.lucky.window[0])} ${({ mk: "до", de: "bis", sr: inline.rangeTo } as Record<string, string>)[L] ?? "to"} ${pad(sky.lucky.window[1])}: ${pick(V.best[sky.lucky.window[0] < 12 ? 0 : sky.lucky.window[0] < 17 ? 1 : 2], "best")} ${V.dayTip[dow]}`,
    avoid, prompt: M.prompt[mh - 1][alt], week, planets,
  };
}
