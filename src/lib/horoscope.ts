/** Assembles the public daily horoscope text for a sign + date + locale from live sky data and the hand-written banks. */
import { getContent } from "@/content";
import { en } from "@/content/horoscope/en";
import { mk } from "@/content/horoscope/mk";
import type { HoroBank } from "@/content/horoscope/types";
import { skyDay, addDays, type SkyDay } from "@/engine/skyday";
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
}

export function reading(lang: string, sign: Sign, iso: string): Reading {
  const L = (HORO_LOCALES as readonly string[]).includes(lang) ? (lang as HoroLocale) : "en";
  const B = BANKS[L]; const c = getContent(L); const sky = skyDay(iso, sign);
  const N = (s: Sign) => c.astro.signs[s].name; const T = (h: number) => B.topics[h - 1];
  const signName = N(sign); const dateLabel = formatDate(iso, c.site.months);
  const [y, m, d] = iso.split("-").map(Number); const weekday = B.weekdays[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  const headline = B.headline[sky.moon.house - 1][sky.seed % 3];
  const love = [B.love[sky.moon.house - 1], sky.retro.includes("venus") ? B.venusRetro : B.venus[sky.houses.venus - 1]];
  const work = [B.work[sky.houses.mercury - 1]];
  if (sky.retro.includes("mercury")) work.push(B.mercuryRetro); else if (sky.retro.includes("mars")) work.push(B.marsRetro); else work.push(B.mars[sky.houses.mars - 1]);
  const well = [B.well[sky.moon.phase], B.wellEl[sky.moon.element]];
  const S = B.sky; const lines: string[] = [];
  const moonLine = S.moonIn(N(sky.moon.sign), B.phases[sky.moon.phase], sky.moon.illumination) + (sky.moon.moves ? ` ${S.moonMoves(N(sky.moon.moves.to), sky.moon.moves.time)}` : "");
  lines.push(`${moonLine} ${S.forYou(T(sky.moon.house))}`);
  const stationed = new Set<string>();
  for (const e of sky.events) {
    if (e.kind === "quarter") lines.push(S.quarter[e.quarter](N(e.sign), e.time, T(e.house)));
    else if (e.kind === "station") { stationed.add(e.body); lines.push(S.station[e.dir](B.bodies[e.body], N(e.sign), T(e.house))); }
    else if (e.kind === "ingress") lines.push(S.ingress(B.bodies[e.body], N(e.to), T(e.house)));
    else lines.push(S.aspect[e.type](B.bodies[e.a], B.bodies[e.b]) + (e.exact ? ` ${S.exactToday}` : ""));
  }
  for (const p of ["mercury", "venus", "mars"] as const) if (sky.retro.includes(p) && !stationed.has(p)) lines.push(S.retroOngoing(B.bodies[p], N(sky.signs[p]), T(sky.houses[p])));
  const inSign = (["sun", "mercury", "venus", "mars", "jupiter", "saturn"] as const).filter((p) => sky.signs[p] === sign && !stationed.has(p) && !sky.events.some((e) => e.kind === "ingress" && e.body === p));
  if (inSign.length) { const names = inSign.map((p) => B.bodies[p]); lines.push(S.inSign(names.length > 1 ? `${names.slice(0, -1).join(", ")} ${S.and} ${names.at(-1)}` : names[0], names.length > 1, N(sign))); }
  if (lines.length === 1) lines.push(S.calm);
  const el = sky.moon.element; const pad = (h: number) => `${String(h).padStart(2, "0")}:00`;
  return {
    lang: L, sign, iso, sky, signName, dateLabel, weekday,
    title: B.ui.title(signName, dateLabel), description: B.ui.description(signName, dateLabel, headline),
    headline, love, work, well, sky_: lines.slice(0, 5), moonLine,
    lucky: { color: B.colors[el][sky.lucky.color], hex: COLOR_HEX[el][sky.lucky.color], number: sky.lucky.number, window: `${pad(sky.lucky.window[0])} ${L === "mk" ? "до" : "to"} ${pad(sky.lucky.window[1])}` },
    prev: addDays(iso, -1), next: addDays(iso, 1),
  };
}
