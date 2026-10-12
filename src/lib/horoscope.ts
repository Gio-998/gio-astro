/** Assembles the public daily horoscope text for a sign + date + locale from live sky data and the hand-written banks. */
import { getContent } from "@/content";
import { en } from "@/content/horoscope/en";
import { mk } from "@/content/horoscope/mk";
import type { HoroBank } from "@/content/horoscope/types";
import { skyDay, addDays, nextEvents, BODIES, type SkyDay, type Body } from "@/engine/skyday";
import { SIGNS, type Sign, type Element } from "@/engine/zodiac";
import { formatDate } from "./dates";
import { SITE_URL } from "./site-url";

export const HORO_LOCALES = ["en", "mk"] as const;
export type HoroLocale = (typeof HORO_LOCALES)[number];
export const BANKS: Record<HoroLocale, HoroBank> = { en, mk };
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
export const horoAlternates = (sign?: Sign, iso?: string) => ({ ...Object.fromEntries(HORO_LOCALES.map((l) => [l, horoPath(l, sign, iso)])), "x-default": horoPath("en", sign, iso) });
export const ogPath = (lang: string, sign: Sign, iso: string, fmt: "wide" | "story") => `/og/horoscope/${lang}/${sign}/${iso}-${fmt}.png`;
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

export function reading(lang: string, sign: Sign, iso: string): Reading {
  const L = (HORO_LOCALES as readonly string[]).includes(lang) ? (lang as HoroLocale) : "en";
  const B = BANKS[L]; const c = getContent(L); const sky = skyDay(iso, sign);
  const N = (s: Sign) => c.astro.signs[s].name; const T = (h: number) => B.topics[h - 1];
  const signName = N(sign); const dateLabel = formatDate(iso, c.site.months);
  const [y, m, d] = iso.split("-").map(Number); const weekday = B.weekdays[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  const headline = B.headline[sky.moon.house - 1][sky.seed % 3];
  const love = [B.love[sky.moon.house - 1], sky.retro.includes("venus") ? `${B.venus[sky.houses.venus - 1]} ${B.venusRetro}` : B.venus[sky.houses.venus - 1]];
  const work = [B.work[sky.houses.mercury - 1]];
  if (sky.retro.includes("mercury")) work.push(B.mercuryRetro); else if (sky.retro.includes("mars")) work.push(B.marsRetro); else work.push(B.mars[sky.houses.mars - 1]);
  const well = [B.well[sky.moon.phase], B.wellEl[sky.moon.element]];
  const S = B.sky; const lines: string[] = [];
  const moonLine = S.moonIn(N(sky.moon.sign), B.phases[sky.moon.phase], sky.moon.illumination) + (sky.moon.moves ? ` ${S.moonMoves(N(sky.moon.moves.to), sky.moon.moves.time)}` : "");
  lines.push(`${moonLine} ${S.forYou(T(sky.moon.house))}`); const usedHouses = new Set<number>([sky.moon.house]);
  const stationed = new Set<string>();
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
  const overview = [...M.theme[mh - 1], M.phaseMood[sky.moon.phase], M.elMood[sky.moon.element], M.signNote[sign], M.close[v(4, 7)]].join(" ");
  const single = [...M.single[mh - 1]].join(" "); const couple = [...M.couple[mh - 1]].join(" ");
  const money = [M.money[sky.houses.venus - 1], M.jupiter[sky.houses.jupiter - 1], M.saturn[sky.houses.saturn - 1]];
  const why: string[] = [`${M.why.moon(M.ordinal[mh - 1], N(sky.moon.sign))} ${M.houseWhy[mh - 1]} ${M.why.pace}`];
  const drv = sky.events.find((e) => e.kind !== "aspect");
  const hw = (h: number) => (h === mh ? "" : ` ${M.houseWhy[h - 1]}`);
  if (drv?.kind === "quarter") why.push(M.why.quarter(M.quarterName[drv.quarter], M.ordinal[drv.house - 1]) + hw(drv.house));
  else if (drv?.kind === "station") why.push(M.why.station(B.bodies[drv.body], M.planetWhy[drv.body], drv.dir, M.ordinal[drv.house - 1]) + hw(drv.house));
  else if (drv?.kind === "ingress") why.push(M.why.ingress(B.bodies[drv.body], M.planetWhy[drv.body], N(drv.to), M.ordinal[drv.house - 1]) + hw(drv.house));
  else { const r = (["mercury", "venus", "mars"] as const).find((p) => sky.retro.includes(p)); if (r) why.push(M.why.retro(B.bodies[r], M.planetWhy[r], M.ordinal[sky.houses[r] - 1]) + hw(sky.houses[r])); }
  why.push(M.sunWhy(N(sky.signs.sun), M.ordinal[sky.houses.sun - 1]) + (sky.houses.sun === mh ? "" : ` ${M.houseWhy[sky.houses.sun - 1]}`));
  const retroP = (["mercury", "venus", "mars"] as const).find((p) => sky.retro.includes(p));
  const avoid = [M.avoid[sky.moon.phase], retroP ? M.avoidRetro[retroP] : ""].filter(Boolean).join(" ");
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
    lucky: { color: B.colors[el][sky.lucky.color], hex: COLOR_HEX[el][sky.lucky.color], number: sky.lucky.number, window: `${pad(sky.lucky.window[0])} ${L === "mk" ? "до" : "to"} ${pad(sky.lucky.window[1])}` },
    prev: addDays(iso, -1), next: addDays(iso, 1),
    overview, single, couple, money, body: M.body[sky.moon.sign], friends: [...M.friends[mh - 1], M.family[sky.moon.phase]].join(" "), why,
    best: `${pad(sky.lucky.window[0])} ${L === "mk" ? "до" : "to"} ${pad(sky.lucky.window[1])}. ${M.bestBy[sky.lucky.window[0] < 12 ? 0 : sky.lucky.window[0] < 17 ? 1 : 2]}`,
    avoid, prompt: M.prompt[mh - 1][v(2, 11)], week, planets,
  };
}
