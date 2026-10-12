import * as Astronomy from "astronomy-engine";
import { Chart, longitude } from "./astro";
import { resolveBirthTime } from "./time";
import { SIGNS, Sign } from "./zodiac";

/**
 * Vedic (sidereal) Moon data + Ashtakoota / Guna Milan (36 points).
 * Ayanamsa: Lahiri (Chitrapaksha) as defined by the Indian Calendar Reform Committee and implemented in
 * Swiss Ephemeris: 23°15′00.658″ (true) on 21 Mar 1956 0h TT, carried forward with IAU 1976 general
 * precession, plus nutation in longitude (true ayanamsa). Matches Jagannatha Hora / Swiss Ephemeris to ~1″.
 * Koota tables: the classical tables as published by onlinejyotish.com and saravali.github.io
 * (Varna, Vashya, Tara, Yoni 14×14, Graha Maitri 7×7, Gana, Bhakoot, Nadi). The classical tables are
 * written bride-row × groom-column; we average both directions so the score is the same for any pair.
 */
export const NAKSHATRAS = [
  "ashwini", "bharani", "krittika", "rohini", "mrigashira", "ardra", "punarvasu", "pushya", "ashlesha",
  "magha", "purva-phalguni", "uttara-phalguni", "hasta", "chitra", "swati", "vishakha", "anuradha", "jyeshtha",
  "mula", "purva-ashadha", "uttara-ashadha", "shravana", "dhanishta", "shatabhisha", "purva-bhadrapada", "uttara-bhadrapada", "revati",
] as const;
export type Nakshatra = (typeof NAKSHATRAS)[number];

type Gana = "deva" | "manushya" | "rakshasa";
type Yoni = "horse" | "elephant" | "sheep" | "serpent" | "dog" | "cat" | "rat" | "cow" | "buffalo" | "tiger" | "deer" | "monkey" | "mongoose" | "lion";
const LORDS = ["ketu", "venus", "sun", "moon", "mars", "rahu", "jupiter", "saturn", "mercury"];
const GANA: Gana[] = ["deva", "manushya", "rakshasa", "manushya", "deva", "manushya", "deva", "deva", "rakshasa", "rakshasa", "manushya", "manushya", "deva", "rakshasa", "deva", "rakshasa", "deva", "rakshasa", "rakshasa", "manushya", "manushya", "deva", "rakshasa", "rakshasa", "manushya", "manushya", "deva"];
const YONI: Yoni[] = ["horse", "elephant", "sheep", "serpent", "serpent", "dog", "cat", "sheep", "cat", "rat", "rat", "cow", "buffalo", "tiger", "buffalo", "tiger", "deer", "deer", "dog", "monkey", "mongoose", "monkey", "lion", "horse", "lion", "cow", "elephant"];
const YONI_ORDER: Yoni[] = ["horse", "elephant", "sheep", "serpent", "dog", "cat", "rat", "cow", "buffalo", "tiger", "deer", "monkey", "mongoose", "lion"];
/** Classical Yoni matrix, bride row × groom column (saravali.github.io/astrology/koota_yoni.html). */
const YONI_TABLE: number[][] = [
  [4, 2, 2, 3, 2, 2, 2, 1, 0, 1, 3, 3, 2, 1],
  [2, 4, 3, 3, 2, 2, 2, 2, 3, 1, 2, 3, 2, 0],
  [2, 3, 4, 2, 1, 2, 1, 3, 3, 1, 2, 0, 3, 1],
  [3, 3, 2, 4, 2, 1, 1, 1, 1, 2, 2, 2, 0, 2],
  [2, 2, 1, 2, 4, 2, 1, 2, 2, 1, 0, 2, 1, 1],
  [2, 2, 2, 1, 2, 4, 0, 2, 2, 1, 3, 3, 2, 1],
  [2, 2, 1, 1, 1, 0, 4, 2, 2, 2, 2, 2, 1, 2],
  [1, 2, 3, 1, 2, 2, 2, 4, 3, 0, 3, 2, 2, 1],
  [0, 3, 3, 1, 2, 2, 2, 3, 4, 1, 2, 2, 2, 1],
  [1, 1, 1, 2, 1, 1, 2, 0, 1, 4, 1, 1, 2, 1],
  [1, 2, 2, 2, 0, 3, 2, 3, 2, 1, 4, 2, 2, 1],
  [3, 3, 0, 2, 2, 3, 2, 2, 2, 1, 2, 4, 3, 2],
  [2, 2, 3, 0, 1, 2, 1, 2, 2, 2, 2, 3, 4, 2],
  [1, 0, 1, 2, 1, 1, 2, 1, 2, 1, 1, 2, 2, 4],
];
export const yoniPoints = (bride: Yoni, groom: Yoni) => YONI_TABLE[YONI_ORDER.indexOf(bride)][YONI_ORDER.indexOf(groom)];
const NADI_CYCLE = ["adi", "madhya", "antya", "antya", "madhya", "adi"] as const;
export const nadiOf = (i: number) => NADI_CYCLE[i % 6];

const LAHIRI_T0 = 2435553.5; // 21 Mar 1956 0h TT (JD)
const LAHIRI_MEAN_T0 = 23.250182778 - 0.004658035; // true value minus nutation at t0 (Swiss Ephemeris SE_SIDM_LAHIRI)
/** IAU 1976 general precession in longitude since J2000, arcseconds (T in Julian centuries TT). */
const pA = (T: number) => 5029.0966 * T + 1.11113 * T * T - 0.000006 * T * T * T;
/** Mean Lahiri ayanamsa (degrees) for a UT instant. */
export function lahiriMean(date: Date): number {
  const tt = Astronomy.MakeTime(date).tt; // days since J2000 TT
  const T = tt / 36525, T0 = (LAHIRI_T0 - 2451545.0) / 36525;
  return LAHIRI_MEAN_T0 + (pA(T) - pA(T0)) / 3600;
}
/** True Lahiri ayanamsa (mean + nutation in longitude), degrees. Subtract from apparent tropical longitudes. */
export const lahiriAyanamsa = (date: Date) => lahiriMean(date) + Astronomy.e_tilt(Astronomy.MakeTime(date)).dpsi / 3600;

export interface VedicMoon {
  siderealMoon: number;
  rashi: Sign; // sidereal Moon sign
  nakshatra: Nakshatra;
  nakshatraIndex: number;
  pada: number;
  gana: Gana;
  yoni: Yoni;
  /** Vashya group of the sidereal Moon (Sagittarius and Capricorn split at 15°). */
  vashya: VashyaGroup;
  nadi: string;
  lord: string;
  ambiguous: boolean; // nakshatra could differ (unknown birth time)
  manglik: { fromLagna: boolean | null; fromMoon: boolean };
  lagna: Sign | null;
}

const norm = (x: number) => ((x % 360) + 360) % 360;
const MANGLIK_HOUSES = new Set([1, 2, 4, 7, 8, 12]);

export function vedicMoon(chart: Chart): VedicMoon {
  const utc = chart.time.utc;
  const ay = lahiriAyanamsa(utc);
  const sm = norm(chart.placements.moon!.lon - ay);
  const idx = Math.floor(sm / (360 / 27));
  let ambiguous = false;
  if (!chart.time.timeKnown) {
    for (const t of ["00:00", "23:59"]) {
      const u = resolveBirthTime({ ...chart.input, time: t }).utc;
      const i2 = Math.floor(norm(longitude("moon", u) - lahiriAyanamsa(u)) / (360 / 27));
      if (i2 !== idx) ambiguous = true;
    }
  }
  const rashiIdx = Math.floor(sm / 30);
  const marsIdx = Math.floor(norm(chart.placements.mars!.lon - ay) / 30);
  const lagnaIdx = chart.placements.asc ? Math.floor(norm(chart.placements.asc.lon - ay) / 30) : null;
  const houseFrom = (from: number) => ((marsIdx - from + 12) % 12) + 1;
  return {
    siderealMoon: sm, rashi: SIGNS[rashiIdx], nakshatra: NAKSHATRAS[idx], nakshatraIndex: idx,
    pada: Math.floor((sm % (360 / 27)) / (360 / 108)) + 1,
    gana: GANA[idx], yoni: YONI[idx], vashya: vashyaOf(sm), nadi: nadiOf(idx), lord: LORDS[idx % 9], ambiguous,
    manglik: { fromLagna: lagnaIdx == null ? null : MANGLIK_HOUSES.has(houseFrom(lagnaIdx)), fromMoon: MANGLIK_HOUSES.has(houseFrom(rashiIdx)) },
    lagna: lagnaIdx == null ? null : SIGNS[lagnaIdx],
  };
}

// ——— Guna Milan ———
const SIGN_LORD: Record<Sign, string> = { aries: "mars", taurus: "venus", gemini: "mercury", cancer: "moon", leo: "sun", virgo: "mercury", libra: "venus", scorpio: "mars", sagittarius: "jupiter", capricorn: "saturn", aquarius: "saturn", pisces: "jupiter" };
const FRIENDS: Record<string, { f: string[]; e: string[] }> = {
  sun: { f: ["moon", "mars", "jupiter"], e: ["venus", "saturn"] },
  moon: { f: ["sun", "mercury"], e: [] },
  mars: { f: ["sun", "moon", "jupiter"], e: ["mercury"] },
  mercury: { f: ["sun", "venus"], e: ["moon"] },
  jupiter: { f: ["sun", "moon", "mars"], e: ["mercury", "venus"] },
  venus: { f: ["mercury", "saturn"], e: ["sun", "moon"] },
  saturn: { f: ["mercury", "venus"], e: ["sun", "moon", "mars"] },
};
const rel = (a: string, b: string) => (FRIENDS[a].f.includes(b) ? 2 : FRIENDS[a].e.includes(b) ? 0 : 1);
const GRAHA_ORDER = ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn"];
/** Graha Maitri, bride row × groom column (onlinejyotish.com). Equals the naisargika friendship rule: 5/4/3/1/0.5/0. */
const MAITRI_TABLE: number[][] = [
  [5, 5, 5, 4, 5, 0, 0],
  [5, 5, 4, 1, 4, 0.5, 0.5],
  [5, 4, 5, 0.5, 5, 3, 0.5],
  [4, 1, 0.5, 5, 0.5, 5, 4],
  [5, 4, 5, 0.5, 5, 0.5, 3],
  [0, 0.5, 3, 5, 0.5, 5, 5],
  [0, 0.5, 0.5, 4, 3, 5, 5],
];
export const maitriPoints = (lordA: string, lordB: string) => MAITRI_TABLE[GRAHA_ORDER.indexOf(lordA)][GRAHA_ORDER.indexOf(lordB)];
const VARNA: Record<Sign, number> = { cancer: 4, scorpio: 4, pisces: 4, aries: 3, leo: 3, sagittarius: 3, taurus: 2, virgo: 2, capricorn: 2, gemini: 1, libra: 1, aquarius: 1 };
export type VashyaGroup = "chatushpada" | "manava" | "jalachara" | "vanachara" | "keeta";
/** Vashya group from the sidereal Moon longitude. Sagittarius: 0-15° human, 15-30° quadruped; Capricorn: 0-15° quadruped, 15-30° water. */
export function vashyaOf(siderealLon: number): VashyaGroup {
  const l = norm(siderealLon), sign = Math.floor(l / 30), deg = l % 30;
  switch (SIGNS[sign]) {
    case "aries": case "taurus": return "chatushpada";
    case "gemini": case "virgo": case "libra": case "aquarius": return "manava";
    case "cancer": case "pisces": return "jalachara";
    case "leo": return "vanachara";
    case "scorpio": return "keeta";
    case "sagittarius": return deg < 15 ? "manava" : "chatushpada";
    default: return deg < 15 ? "chatushpada" : "jalachara"; // capricorn
  }
}
const VASHYA_ORDER: VashyaGroup[] = ["chatushpada", "manava", "jalachara", "vanachara", "keeta"];
/** Vashya, bride row × groom column (onlinejyotish.com, Vashya Kootam). */
const VASHYA_TABLE: number[][] = [
  [2, 1, 1, 0, 1],
  [1, 2, 0.5, 0, 1],
  [1, 0.5, 2, 1, 1],
  [0, 0, 1, 2, 0],
  [1, 0, 1, 0, 2],
];
export const vashyaPoints = (bride: VashyaGroup, groom: VashyaGroup) => VASHYA_TABLE[VASHYA_ORDER.indexOf(bride)][VASHYA_ORDER.indexOf(groom)];
/** Gana, bride row × groom column (onlinejyotish.com, Gana Kootam). */
const GANA_TABLE: Record<Gana, Record<Gana, number>> = {
  deva: { deva: 6, manushya: 6, rakshasa: 0 }, manushya: { deva: 5, manushya: 6, rakshasa: 0 }, rakshasa: { deva: 1, manushya: 0, rakshasa: 6 },
};
/** Tara for one direction: count from one nakshatra to the other (inclusive), remainder mod 9; 3, 5, 7 are unfavourable. */
const taraDir = (from: number, to: number) => { const r = (((to - from + 27) % 27) + 1) % 9; return [3, 5, 7].includes(r) ? 0 : 1.5; };

export interface Koota { id: "varna" | "vashya" | "tara" | "yoni" | "maitri" | "gana" | "bhakoot" | "nadi"; points: number; max: number }
export interface GunaMilan { kootas: Koota[]; total: number; cautions: ("nadi" | "bhakoot" | "manglik")[]; cancellations: string[] }

export function gunaMilan(a: VedicMoon, b: VedicMoon): GunaMilan {
  const sa = SIGNS.indexOf(a.rashi), sb = SIGNS.indexOf(b.rashi);
  // Varna, Vashya, Yoni, Maitri and Gana are directional in the classical tables (bride row × groom column).
  // This app is for every kind of pair, so each koota is the average of both directions.
  const both = (f: (x: VedicMoon, y: VedicMoon) => number) => (f(a, b) + f(b, a)) / 2;
  const varna = both((x, y) => (VARNA[y.rashi] >= VARNA[x.rashi] ? 1 : 0));
  const vashya = both((x, y) => vashyaPoints(x.vashya ?? vashyaOf(x.siderealMoon), y.vashya ?? vashyaOf(y.siderealMoon)));
  const tara = taraDir(a.nakshatraIndex, b.nakshatraIndex) + taraDir(b.nakshatraIndex, a.nakshatraIndex);
  const yoni = both((x, y) => yoniPoints(x.yoni, y.yoni));
  const la = SIGN_LORD[a.rashi], lb = SIGN_LORD[b.rashi];
  const maitri = both((x, y) => maitriPoints(SIGN_LORD[x.rashi], SIGN_LORD[y.rashi]));
  const gana = both((x, y) => GANA_TABLE[x.gana][y.gana]);
  const d = ((sb - sa + 12) % 12) + 1;
  const bhakootOk = [1, 7, 3, 11, 4, 10].includes(d);
  const bhakoot = bhakootOk ? 7 : 0;
  const nadi = a.nadi === b.nadi ? 0 : 8;
  const kootas: Koota[] = [
    { id: "varna", points: varna, max: 1 }, { id: "vashya", points: vashya, max: 2 }, { id: "tara", points: tara, max: 3 },
    { id: "yoni", points: yoni, max: 4 }, { id: "maitri", points: maitri, max: 5 }, { id: "gana", points: gana, max: 6 },
    { id: "bhakoot", points: bhakoot, max: 7 }, { id: "nadi", points: nadi, max: 8 },
  ];
  const cautions: GunaMilan["cautions"] = [];
  const cancellations: string[] = [];
  if (nadi === 0) {
    cautions.push("nadi");
    if (a.nakshatra === b.nakshatra && a.pada !== b.pada) cancellations.push("nadi-different-pada");
    else if (a.rashi === b.rashi && a.nakshatra !== b.nakshatra) cancellations.push("nadi-same-sign");
  }
  if (!bhakootOk) {
    cautions.push("bhakoot");
    if (la === lb || rel(la, lb) === 2) cancellations.push("bhakoot-friendly-lords");
  }
  const mA = a.manglik.fromLagna ?? a.manglik.fromMoon, mB = b.manglik.fromLagna ?? b.manglik.fromMoon;
  if (mA !== mB) cautions.push("manglik");
  if (mA && mB) cancellations.push("manglik-both");
  return { kootas, total: kootas.reduce((s, k) => s + k.points, 0), cautions, cancellations };
}
