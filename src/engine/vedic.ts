import * as Astronomy from "astronomy-engine";
import { Chart, longitude } from "./astro";
import { resolveBirthTime } from "./time";
import { SIGNS, Sign } from "./zodiac";

/**
 * Vedic (sidereal) Moon data + Ashtakoota / Guna Milan (36 points).
 * Ayanamsa: Lahiri (Chitrapaksha) linear approximation — 23.853° at J2000 + 50.29″/year.
 * Tables are traditional knowledge (B.V. Raman, standard practice). Yoni and Vashya use a
 * simplified version of the classical tables (documented on the methodology page).
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
const YONI_ENEMIES = [["horse", "buffalo"], ["elephant", "lion"], ["sheep", "monkey"], ["serpent", "mongoose"], ["dog", "deer"], ["cat", "rat"], ["cow", "tiger"]];
const NADI_CYCLE = ["adi", "madhya", "antya", "antya", "madhya", "adi"] as const;
export const nadiOf = (i: number) => NADI_CYCLE[i % 6];

export const lahiriAyanamsa = (date: Date) => {
  const years = (Astronomy.MakeTime(date).tt) / 365.25;
  return 23.853 + (50.29 / 3600) * years;
};

export interface VedicMoon {
  siderealMoon: number;
  rashi: Sign; // sidereal Moon sign
  nakshatra: Nakshatra;
  nakshatraIndex: number;
  pada: number;
  gana: Gana;
  yoni: Yoni;
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
    gana: GANA[idx], yoni: YONI[idx], nadi: nadiOf(idx), lord: LORDS[idx % 9], ambiguous,
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
const VARNA: Record<Sign, number> = { cancer: 4, scorpio: 4, pisces: 4, aries: 3, leo: 3, sagittarius: 3, taurus: 2, virgo: 2, capricorn: 2, gemini: 1, libra: 1, aquarius: 1 };
const VASHYA: Record<Sign, string> = { aries: "quadruped", taurus: "quadruped", gemini: "human", cancer: "water", leo: "wild", virgo: "human", libra: "human", scorpio: "insect", sagittarius: "human", capricorn: "quadruped", aquarius: "human", pisces: "water" };
const GANA_TABLE: Record<Gana, Record<Gana, number>> = {
  deva: { deva: 6, manushya: 6, rakshasa: 1 }, manushya: { deva: 5, manushya: 6, rakshasa: 0 }, rakshasa: { deva: 1, manushya: 0, rakshasa: 6 },
};

export interface Koota { id: "varna" | "vashya" | "tara" | "yoni" | "maitri" | "gana" | "bhakoot" | "nadi"; points: number; max: number }
export interface GunaMilan { kootas: Koota[]; total: number; cautions: ("nadi" | "bhakoot" | "manglik")[]; cancellations: string[] }

export function gunaMilan(a: VedicMoon, b: VedicMoon): GunaMilan {
  const sa = SIGNS.indexOf(a.rashi), sb = SIGNS.indexOf(b.rashi);
  // Varna & Vashya are directional in tradition; we average both directions (gender-neutral).
  const varna = ((VARNA[a.rashi] >= VARNA[b.rashi] ? 1 : 0) + (VARNA[b.rashi] >= VARNA[a.rashi] ? 1 : 0)) / 2;
  const va = VASHYA[a.rashi], vb = VASHYA[b.rashi];
  const vashyaPair = [va, vb].sort().join("-");
  const vashya = va === vb ? 2 : ["human-water", "quadruped-water", "human-quadruped", "insect-water"].includes(vashyaPair) ? 1 : vashyaPair === "quadruped-wild" ? 0.5 : vashyaPair.includes("wild") ? 0 : 1;
  const taraDir = (x: number, y: number) => { const r = (((y - x + 27) % 27) + 1) % 9; return [3, 5, 7].includes(r) ? 0 : 1.5; };
  const tara = taraDir(a.nakshatraIndex, b.nakshatraIndex) + taraDir(b.nakshatraIndex, a.nakshatraIndex);
  const yoni = a.yoni === b.yoni ? 4 : YONI_ENEMIES.some((p) => p.includes(a.yoni) && p.includes(b.yoni)) ? 0 : 2;
  const la = SIGN_LORD[a.rashi], lb = SIGN_LORD[b.rashi];
  const m = la === lb ? 4 : rel(la, lb) + rel(lb, la); // 0..4 → map
  const maitri = la === lb ? 5 : ({ 4: 5, 3: 4, 2: 3, 1: 1, 0: 0 } as Record<number, number>)[m] ?? 0;
  const gana = (GANA_TABLE[a.gana][b.gana] + GANA_TABLE[b.gana][a.gana]) / 2;
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
