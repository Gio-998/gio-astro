import { findAspect, Point, AspectType } from "./astro";
import { SIGN_ELEMENT, Element } from "./zodiac";
import { animalRelation, elementRelation, AnimalRelation, WUXING, WuXing } from "./chinese";
import { numberHarmony } from "./numerology";
import { CARD_ELEMENT, MAJOR_ARCANA, relationshipCard } from "./tarot";
import { gunaMilan, GunaMilan } from "./vedic";
import { nineLinked } from "./quizzes";
import type { Profile } from "./profile";
import type { Temperament } from "./bigfive";
import { normCdf, normInv, clamp } from "./stats";
import calibration from "./calibration.json";
import { playProfile } from "./play";
import { playLens, PLAY_CAL } from "./play/compat";

export type RelType = "romantic" | "friend" | "family" | "colleague";
export const REL_TYPES: RelType[] = ["romantic", "friend", "family", "colleague"];
export type Evidence = "research" | "popular" | "traditional";
export type LensId =
  | "western" | "vedic" | "chinese" | "numerology" | "tarot" | "bigfive" | "attachment" | "care"
  | "temperament" | "nine" | "fourletter" | "shadow" | "dosha" | "yinyang" | "play";

export const LENS_EVIDENCE: Record<LensId, Evidence> = {
  western: "traditional", vedic: "traditional", chinese: "traditional", numerology: "traditional", tarot: "traditional",
  dosha: "traditional", yinyang: "traditional", bigfive: "research", attachment: "research",
  care: "popular", play: "popular", temperament: "popular", nine: "popular", fourletter: "popular", shadow: "popular",
};

/** Default weights per relationship type (design doc §5.2; each column sums to 100). */
export const WEIGHTS: Record<LensId, Record<RelType, number>> = {
  western: { romantic: 18, friend: 15, family: 15, colleague: 12 },
  vedic: { romantic: 10, friend: 4, family: 4, colleague: 2 },
  chinese: { romantic: 8, friend: 8, family: 8, colleague: 8 },
  numerology: { romantic: 6, friend: 6, family: 6, colleague: 6 },
  tarot: { romantic: 2, friend: 3, family: 3, colleague: 2 },
  bigfive: { romantic: 14, friend: 18, family: 16, colleague: 24 },
  attachment: { romantic: 12, friend: 10, family: 14, colleague: 4 },
  care: { romantic: 6, friend: 8, family: 8, colleague: 4 },
  temperament: { romantic: 4, friend: 6, family: 6, colleague: 8 },
  nine: { romantic: 6, friend: 7, family: 6, colleague: 10 },
  fourletter: { romantic: 4, friend: 6, family: 4, colleague: 10 },
  shadow: { romantic: 5, friend: 5, family: 6, colleague: 6 },
  dosha: { romantic: 3, friend: 2, family: 2, colleague: 2 },
  yinyang: { romantic: 2, friend: 2, family: 2, colleague: 2 },
  // Play Mirror (behavioural signal from mini-games); added on top, weights are relative.
  play: { romantic: 6, friend: 6, family: 5, colleague: 7 },
};

export const THEMES = [
  "communication", "emotional", "passion", "stability", "freedom", "growth",
  "nurturing", "power", "play", "values", "conflict", "pace",
] as const;
export type Theme = (typeof THEMES)[number];
export interface ThemeHit { theme: Theme; valence: 1 | -1; salience: number }

export interface LensResult {
  id: LensId;
  rawH: number; rawS: number;
  harmony: number; spark: number; // calibrated 45–100
  confidence: number;
  evidence: Evidence;
  themes: ThemeHit[];
  detail: Record<string, unknown>;
}

// ——————————————————— Western synastry ———————————————————
const SYN_POINTS: Point[] = ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn", "asc"];
const pairKey = (a: Point, b: Point) => [a, b].sort().join("-");
const BASE_W: Record<string, number> = {
  "moon-sun": 10, "mars-venus": 10, "moon-moon": 8, "moon-venus": 7, "venus-venus": 6, "sun-sun": 5, "mercury-mercury": 5,
  "asc-sun": 6, "asc-moon": 6, "asc-venus": 6,
  "saturn-sun": 5, "moon-saturn": 5, "mercury-saturn": 5, "saturn-venus": 5, "mars-saturn": 5,
};
function synWeight(a: Point, b: Point, rel: RelType): number {
  const k = pairKey(a, b);
  let w = BASE_W[k] ?? 2.5;
  const has = (p: Point) => a === p || b === p;
  if (rel === "friend") { if (has("mercury")) w *= 1.6; if (has("jupiter")) w *= 1.8; if (k === "sun-sun") w *= 1.6; if (k === "mars-venus") w *= 0.4; }
  if (rel === "family") { if (has("moon")) w *= 1.4; if (has("saturn")) w *= 1.4; if (k === "mars-venus") w *= 0.3; }
  if (rel === "colleague") { if (has("mercury")) w *= 1.8; if (has("saturn")) w *= 1.6; if (has("mars")) w *= 1.3; if (has("sun")) w *= 1.2; if (k === "mars-venus") w *= 0.3; if (k === "moon-venus") w *= 0.6; }
  return w;
}
function valence(type: AspectType, a: Point, b: Point): [number, number] {
  switch (type) {
    case "trine": return [1, 0.3];
    case "sextile": return [0.8, 0.3];
    case "conjunction": return a === "mars" || b === "mars" || a === "saturn" || b === "saturn" ? [0.2, 1] : [0.7, 0.8];
    case "opposition": return [-0.2, 1];
    case "square": return [-0.5, 1];
  }
}
const PAIR_THEME: Record<string, Theme> = {
  "moon-sun": "nurturing", "moon-moon": "emotional", "mars-venus": "passion", "venus-venus": "play", "mercury-mercury": "communication",
  "sun-sun": "values", "mars-mars": "conflict", "moon-venus": "nurturing", "sun-venus": "play", "mars-sun": "power",
  "mars-saturn": "conflict", "jupiter-jupiter": "growth", "asc-sun": "play", "asc-moon": "emotional", "asc-venus": "passion",
};
function themeForPair(a: Point, b: Point): Theme {
  const k = pairKey(a, b);
  if (PAIR_THEME[k]) return PAIR_THEME[k];
  if (a === "mercury" || b === "mercury") return "communication";
  if (a === "saturn" || b === "saturn") return "stability";
  if (a === "jupiter" || b === "jupiter") return "growth";
  if (a === "mars" || b === "mars") return "passion";
  if (a === "moon" || b === "moon") return "emotional";
  return "values";
}
const COMPLEMENT = (x: Element, y: Element) => (x === "fire" && y === "air") || (x === "air" && y === "fire") || (x === "earth" && y === "water") || (x === "water" && y === "earth");

export interface SynAspect { a: Point; b: Point; type: AspectType; orb: number; weight: number; h: number; s: number }

function western(A: Profile, B: Profile, rel: RelType) {
  const both = A.chart.hasAngles && B.chart.hasAngles;
  const pts = SYN_POINTS.filter((p) => p !== "asc" || both);
  let H = 0, S = 0;
  const list: SynAspect[] = [];
  const themes: ThemeHit[] = [];
  for (const i of pts) for (const j of pts) {
    const pa = A.chart.placements[i], pb = B.chart.placements[j];
    if (!pa || !pb) continue;
    const asp = findAspect(pa.lon, pb.lon, i, j);
    if (!asp) continue;
    const max = asp.type === "sextile" ? 4 : i === "sun" || i === "moon" || j === "sun" || j === "moon" ? 8 : 6;
    const tight = 1 - asp.orb / max;
    const W = synWeight(i, j, rel);
    const [vh, vs] = valence(asp.type, i, j);
    H += W * tight * vh; S += W * tight * vs;
    list.push({ a: i, b: j, type: asp.type, orb: asp.orb, weight: W * tight, h: W * tight * vh, s: W * tight * vs });
    themes.push({ theme: themeForPair(i, j), valence: vh > 0.3 ? 1 : -1, salience: W * tight });
  }
  const elems: { point: Point; a: Element; b: Element; kind: "same" | "complement" | "contrast" }[] = [];
  for (const p of ["sun", "moon", "venus"] as Point[]) {
    const ea = SIGN_ELEMENT[A.chart.placements[p]!.sign], eb = SIGN_ELEMENT[B.chart.placements[p]!.sign];
    const kind = ea === eb ? "same" : COMPLEMENT(ea, eb) ? "complement" : "contrast";
    if (kind === "same") H += 4; else if (kind === "complement") { H += 3; S += 1.5; } else S += 2.5;
    elems.push({ point: p, a: ea, b: eb, kind });
  }
  const supportive = list.filter((x) => x.h > 0).sort((x, y) => y.h - x.h).slice(0, 3);
  const growth = list.filter((x) => x.h <= 0.2 * x.weight).sort((x, y) => y.s - x.s).slice(0, 3);
  return { rawH: H, rawS: S, themes, confidence: both ? 1 : A.chart.time.timeKnown && B.chart.time.timeKnown ? 0.8 : 0.6, detail: { supportive, growth, elements: elems, aspectCount: list.length, usedAsc: both } };
}

// ——————————————————— Other lenses ———————————————————
const ANIMAL_H: Record<AnimalRelation, number> = { "six-harmony": 95, trine: 90, same: 75, neutral: 65, harm: 50, clash: 45 };
const ANIMAL_S: Record<AnimalRelation, number> = { "six-harmony": 50, trine: 55, same: 60, neutral: 65, harm: 78, clash: 92 };
function chinese(A: Profile, B: Profile) {
  const ar = animalRelation(A.chinese.animal, B.chinese.animal);
  const useDay = A.chart.time.timeKnown && B.chart.time.timeKnown;
  const ea = useDay ? A.chinese.dayMaster.element : A.chinese.element, eb = useDay ? B.chinese.dayMaster.element : B.chinese.element;
  const er = elementRelation(ea, eb);
  const eH = er.rel === "generating" ? 85 : er.rel === "same" ? 75 : 55;
  const eS = er.rel === "controlling" ? 80 : er.rel === "same" ? 55 : 60;
  const lacking = (p: Profile) => WUXING.filter((w) => p.chinese.balance[w] === 0);
  const strongest = (p: Profile) => [...WUXING].sort((x, y) => p.chinese.balance[y] - p.chinese.balance[x])[0];
  const fills: { giver: "a" | "b"; element: WuXing }[] = [];
  if (lacking(B).includes(strongest(A))) fills.push({ giver: "a", element: strongest(A) });
  if (lacking(A).includes(strongest(B))) fills.push({ giver: "b", element: strongest(B) });
  const H = Math.min(100, 0.6 * ANIMAL_H[ar] + 0.4 * eH + (fills.length ? 10 : 0));
  const S = 0.6 * ANIMAL_S[ar] + 0.4 * eS;
  const themes: ThemeHit[] = [];
  if (ar === "six-harmony" || ar === "trine") themes.push({ theme: "stability", valence: 1, salience: 6 });
  if (ar === "clash") themes.push({ theme: "freedom", valence: -1, salience: 6 });
  if (ar === "harm") themes.push({ theme: "communication", valence: -1, salience: 4 });
  if (ar === "same") themes.push({ theme: "values", valence: 1, salience: 4 });
  if (er.rel === "generating") themes.push({ theme: "nurturing", valence: 1, salience: 4 });
  if (er.rel === "controlling") themes.push({ theme: "power", valence: -1, salience: 4 });
  if (fills.length) themes.push({ theme: "growth", valence: 1, salience: 3 });
  return { rawH: H, rawS: S, themes, confidence: 1, detail: { animalRelation: ar, elementRelation: er, elementA: ea, elementB: eb, usedDayMaster: useDay, fills } };
}

function numerology(A: Profile, B: Profile) {
  const lp = numberHarmony(A.numbers.lifePath, B.numbers.lifePath);
  const parts: [number, { harmony: number; spark: number }][] = [[0.5, lp]];
  let soul, expr;
  if (A.numbers.name && B.numbers.name) {
    soul = numberHarmony(A.numbers.name.soulUrge, B.numbers.name.soulUrge);
    expr = numberHarmony(A.numbers.name.expression, B.numbers.name.expression);
    parts.push([0.3, soul], [0.2, expr]);
  }
  const tw = parts.reduce((s, [w]) => s + w, 0);
  const H = parts.reduce((s, [w, r]) => s + w * r.harmony, 0) / tw;
  const S = parts.reduce((s, [w, r]) => s + w * r.spark, 0) / tw;
  const themes: ThemeHit[] = [{ theme: lp.kind === "contrast" ? "pace" : "values", valence: lp.kind === "contrast" ? -1 : 1, salience: 4 }];
  if (soul) themes.push({ theme: "emotional", valence: soul.kind === "contrast" ? -1 : 1, salience: 2 });
  return { rawH: H, rawS: S, themes, confidence: soul ? 1 : 0.8, detail: { lifePath: lp, soul, expression: expr } };
}

function tarot(A: Profile, B: Profile) {
  const ca = A.tarot.cards[0] === 22 ? 0 : A.tarot.cards[0], cb = B.tarot.cards[0] === 22 ? 0 : B.tarot.cards[0];
  const ea = CARD_ELEMENT[MAJOR_ARCANA[ca]], eb = CARD_ELEMENT[MAJOR_ARCANA[cb]];
  const kind = ea === eb ? "same" : COMPLEMENT(ea, eb) ? "complement" : "contrast";
  const H = kind === "same" ? 85 : kind === "complement" ? 80 : 65;
  const S = kind === "same" ? 55 : kind === "complement" ? 62 : 80;
  return { rawH: H, rawS: S, themes: [{ theme: "play" as Theme, valence: (kind === "contrast" ? -1 : 1) as 1 | -1, salience: 2 }], confidence: 1, detail: { relationshipCard: relationshipCard(A.tarot.number, B.tarot.number), kind } };
}

function yinyang(A: Profile, B: Profile) {
  const a = A.yang, b = B.yang;
  const H = 100 - Math.abs((a + b) / 2 - 50) * 1.2 - Math.max(0, 25 - Math.abs(a - b)) * 0.4;
  const S = 40 + Math.abs(a - b);
  return { rawH: H, rawS: S, themes: [{ theme: "pace" as Theme, valence: (Math.abs((a + b) / 2 - 50) < 12 ? 1 : -1) as 1 | -1, salience: 2 }], confidence: 1, detail: { a, b, center: Math.round((a + b) / 2) } };
}

function vedic(A: Profile, B: Profile) {
  const g: GunaMilan = gunaMilan(A.vedic, B.vedic);
  const H = (100 * g.total) / 36;
  const S = 45 + g.cautions.length * 15 + (36 - g.total) / 2;
  const k = Object.fromEntries(g.kootas.map((x) => [x.id, x.points / x.max]));
  const themes: ThemeHit[] = [
    { theme: "communication", valence: k.maitri >= 0.6 ? 1 : -1, salience: 3 },
    { theme: "conflict", valence: k.gana >= 0.6 ? 1 : -1, salience: 3 },
    { theme: "stability", valence: k.bhakoot > 0 ? 1 : -1, salience: 3 },
  ];
  const conf = A.chart.time.timeKnown && B.chart.time.timeKnown ? 1 : A.vedic.ambiguous || B.vedic.ambiguous ? 0.3 : 0.5;
  return { rawH: H, rawS: S, themes, confidence: conf, detail: { guna: g } };
}

function bigfive(A: Profile, B: Profile) {
  const a = A.quiz.bigFive, b = B.quiz.bigFive;
  if (!a || !b) return null;
  const f = (x: typeof a) => 0.4 * (100 - x.N) + 0.3 * x.A + 0.2 * x.C + 0.1 * x.E;
  const foundation = (f(a) + f(b)) / 2;
  const similarity = 100 - (Math.abs(a.O - b.O) + Math.abs(a.C - b.C)) / 2;
  const H = 0.8 * foundation + 0.2 * similarity;
  const S = (Math.abs(a.E - b.E) + Math.abs(a.O - b.O)) / 2 + 30;
  const themes: ThemeHit[] = [];
  if (a.A >= 55 && b.A >= 55) themes.push({ theme: "nurturing", valence: 1, salience: 8 });
  if (a.N >= 65 || b.N >= 65) themes.push({ theme: "conflict", valence: -1, salience: 8 });
  if (a.N < 45 && b.N < 45) themes.push({ theme: "conflict", valence: 1, salience: 6 });
  if (Math.abs(a.C - b.C) >= 40) themes.push({ theme: "pace", valence: -1, salience: 6 });
  if (a.C >= 55 && b.C >= 55) themes.push({ theme: "stability", valence: 1, salience: 6 });
  if (a.O >= 60 && b.O >= 60) themes.push({ theme: "growth", valence: 1, salience: 5 });
  if (Math.abs(a.E - b.E) >= 40) themes.push({ theme: "play", valence: -1, salience: 4 });
  return { rawH: H, rawS: S, themes, confidence: 1, detail: { foundation: Math.round(foundation), similarity: Math.round(similarity), a, b } };
}

function attachment(A: Profile, B: Profile) {
  const a = A.quiz.attachment, b = B.quiz.attachment;
  if (!a || !b) return null;
  const styles = [a.style, b.style].sort().join("+");
  let H: number;
  if (styles === "secure+secure") H = 90;
  else if (styles.includes("secure")) H = 75;
  else if (styles === "anxious+avoidant") H = 50;
  else H = 60;
  // continuous refinement
  H = H - 0.1 * ((a.anxiety + b.anxiety) / 2 - 50) - 0.1 * ((a.avoidance + b.avoidance) / 2 - 50);
  const loop = (a.anxiety > 50 && b.avoidance > 50) || (b.anxiety > 50 && a.avoidance > 50);
  const S = 45 + Math.abs(a.anxiety - b.anxiety) / 4 + Math.abs(a.avoidance - b.avoidance) / 4 + (loop ? 25 : 0);
  const themes: ThemeHit[] = [];
  if (styles.includes("secure")) themes.push({ theme: "stability", valence: 1, salience: 8 });
  if (loop) themes.push({ theme: "conflict", valence: -1, salience: 10 }, { theme: "emotional", valence: -1, salience: 6 });
  if (!styles.includes("secure") && !loop) themes.push({ theme: "emotional", valence: -1, salience: 5 });
  return { rawH: H, rawS: S, themes, confidence: 1, detail: { a, b, pursueWithdraw: loop } };
}

function care(A: Profile, B: Profile) {
  const a = A.quiz.care, b = B.quiz.care;
  if (!a || !b) return null;
  const aToB = b.topReceive.includes(a.give), bToA = a.topReceive.includes(b.give);
  const shared = a.topReceive.filter((c) => b.topReceive.includes(c));
  const H = 60 + (aToB ? 15 : 0) + (bToA ? 15 : 0) + shared.length * 3;
  const S = 50 + (aToB ? 0 : 12) + (bToA ? 0 : 12) + (2 - shared.length) * 5;
  return { rawH: H, rawS: S, themes: [{ theme: "nurturing" as Theme, valence: (aToB && bToA ? 1 : -1) as 1 | -1, salience: 6 }], confidence: 1, detail: { aToB, bToA, shared, a, b } };
}

const TEMP_H: Record<string, number> = {
  "phlegmatic+sanguine": 88, "choleric+phlegmatic": 85, "melancholic+sanguine": 80, "melancholic+phlegmatic": 78,
  "choleric+sanguine": 75, "choleric+melancholic": 65, "sanguine+sanguine": 78, "phlegmatic+phlegmatic": 80,
  "melancholic+melancholic": 70, "choleric+choleric": 60,
};
function temperamentLens(A: Profile, B: Profile) {
  const a = A.psych?.temperament, b = B.psych?.temperament;
  if (!a || !b) return null;
  const key = [a.primary, b.primary].sort().join("+");
  const H = TEMP_H[key];
  const S = 150 - H;
  const themes: ThemeHit[] = [{ theme: key === "choleric+choleric" ? "power" : "pace", valence: (H >= 75 ? 1 : -1) as 1 | -1, salience: 4 }];
  return { rawH: H, rawS: S, themes, confidence: 0.9, detail: { a: a.primary as Temperament, b: b.primary as Temperament } };
}

function fourletter(A: Profile, B: Profile) {
  const a = A.fourLetter?.code, b = B.fourLetter?.code;
  if (!a || !b) return null;
  let H = 70, S = 50;
  if (a[1] === b[1]) H += 10; else S += 18;
  if (a[3] === b[3]) H += 8; else S += 8;
  if (a[0] !== b[0]) { H += 4; S += 6; }
  if (a[2] !== b[2]) { H -= 8; S += 15; }
  const themes: ThemeHit[] = [{ theme: "communication", valence: (a[1] === b[1] ? 1 : -1) as 1 | -1, salience: 4 }];
  if (a[3] !== b[3]) themes.push({ theme: "pace", valence: -1, salience: 3 });
  return { rawH: clamp(H, 55, 90), rawS: S, themes, confidence: 0.8, detail: { a, b } };
}

const TRIAD = (t: number) => ([2, 3, 4].includes(t) ? "heart" : [5, 6, 7].includes(t) ? "head" : "gut");
function nine(A: Profile, B: Profile) {
  const a = A.quiz.nine?.type, b = B.quiz.nine?.type;
  if (!a || !b) return null;
  const linked = nineLinked(a, b), same = a === b, sameTriad = TRIAD(a) === TRIAD(b);
  const H = 72 + (linked ? 6 : 0) + (same ? -4 : 0) + (sameTriad ? 6 : 0);
  const S = (sameTriad ? 60 : 80) + (linked ? 10 : 0);
  const themes: ThemeHit[] = [{ theme: "growth", valence: 1, salience: linked ? 5 : 2 }];
  if (!sameTriad) themes.push({ theme: "communication", valence: -1, salience: 3 });
  return { rawH: H, rawS: S, themes, confidence: 0.8, detail: { a, b, linked, sameTriad } };
}

const SHADOW_DANCES: { pair: [string, string]; penalty: number; theme: Theme; id: string }[] = [
  { pair: ["pride", "pride"], penalty: 12, theme: "power", id: "power-struggle" },
  { pair: ["anger", "inertia"], penalty: 10, theme: "conflict", id: "chase-stonewall" },
  { pair: ["envy", "pride"], penalty: 10, theme: "power", id: "competition" },
  { pair: ["anger", "anger"], penalty: 12, theme: "conflict", id: "double-fire" },
  { pair: ["greed", "greed"], penalty: 8, theme: "values", id: "scarcity" },
  { pair: ["excess", "excess"], penalty: 6, theme: "pace", id: "double-indulgence" },
  { pair: ["inertia", "inertia"], penalty: 6, theme: "growth", id: "stuck-together" },
  { pair: ["envy", "envy"], penalty: 8, theme: "values", id: "comparison-loop" },
  { pair: ["anger", "pride"], penalty: 9, theme: "conflict", id: "no-backing-down" },
  { pair: ["desire", "desire"], penalty: 0, theme: "passion", id: "high-heat" },
];
function shadow(A: Profile, B: Profile) {
  const a = A.quiz.shadow, b = B.quiz.shadow;
  if (!a || !b) return null;
  const hi = (r: typeof a, axis: string) => (r.axes.find((x) => x.axis === axis)?.shadow ?? 0) >= 60;
  const dances = SHADOW_DANCES.filter(({ pair: [x, y] }) => (hi(a, x) && hi(b, y)) || (hi(a, y) && hi(b, x)));
  const penalty = dances.reduce((s, d) => s + d.penalty, 0);
  const light = (a.axes.reduce((s, x) => s + x.light, 0) + b.axes.reduce((s, x) => s + x.light, 0)) / 14;
  const H = clamp(80 - penalty + (light - 50) * 0.3, 50, 100);
  const S = 50 + penalty + (dances.some((d) => d.id === "high-heat") ? 15 : 0);
  const themes: ThemeHit[] = dances.map((d) => ({ theme: d.theme, valence: (d.penalty ? -1 : 1) as 1 | -1, salience: 4 }));
  if (light >= 65) themes.push({ theme: "values", valence: 1, salience: 4 });
  return { rawH: H, rawS: S, themes, confidence: 1, detail: { dances: dances.map((d) => d.id), sharedLight: a.strongestLight === b.strongestLight ? a.strongestLight : null, lightA: a.strongestLight, lightB: b.strongestLight } };
}

function dosha(A: Profile, B: Profile) {
  const a = A.quiz.dosha, b = B.quiz.dosha;
  if (!a || !b) return null;
  let H: number, S: number, kind: string;
  if (a.constitution === "tridoshic" || b.constitution === "tridoshic") { H = 85; S = 55; kind = "tridoshic"; }
  else if (a.dominant === b.dominant) { H = 65; S = 85; kind = "same"; }
  else { H = 80; S = 60; kind = "complement"; }
  return { rawH: H, rawS: S, themes: [{ theme: "pace" as Theme, valence: (kind === "same" ? -1 : 1) as 1 | -1, salience: 3 }], confidence: 0.9, detail: { a: a.constitution, b: b.constitution, kind } };
}

// ——————————————————— Calibration + aggregation ———————————————————
type Cal = Record<string, { h: number[]; s: number[] }>;
const CAL = calibration as unknown as Cal;

/** Percentile of x within a sorted quantile array (mid-rank for ties). */
export function percentileOf(x: number, q: number[]): number {
  if (!q?.length) return 0.5;
  const n = q.length - 1;
  if (x <= q[0]) return q[0] === x ? 0.5 / n : 0.25 / n;
  if (x >= q[n]) return q[n] === x ? 1 - 0.5 / n : 1 - 0.25 / n;
  let lo = 0; while (lo < n && q[lo + 1] < x) lo++;
  let hi = lo; while (hi < n && q[hi + 1] <= x) hi++;
  if (hi > lo) return ((lo + 1 + hi) / 2) / n; // ties
  const t = (x - q[lo]) / (q[lo + 1] - q[lo] || 1);
  return (lo + t) / n;
}
export const toDisplay = (p: number) => Math.round(45 + 55 * Math.min(1, Math.max(0, p)));

export type Band = "kindred-flow" | "natural-allies" | "complementary-path" | "catalyst-bond" | "deep-teacher";
export const bandOf = (r: number): Band => (r >= 90 ? "kindred-flow" : r >= 78 ? "natural-allies" : r >= 66 ? "complementary-path" : r >= 55 ? "catalyst-bond" : "deep-teacher");
export type Archetype = "harbor" | "wildfire" | "forge" | "garden";
export const archetypeOf = (r: number, s: number): Archetype => (r >= 72 ? (s >= 72 ? "wildfire" : "harbor") : s >= 72 ? "forge" : "garden");

export interface PairReport {
  rel: RelType;
  lenses: LensResult[];
  missing: LensId[];
  resonance: number;
  spark: number;
  band: Band;
  archetype: Archetype;
  evidenceOnly: number | null;
  superpowers: { theme: Theme; lenses: LensId[] }[];
  growthEdges: { theme: Theme; lenses: LensId[] }[];
}

type Raw = { rawH: number; rawS: number; themes: ThemeHit[]; confidence: number; detail: Record<string, unknown> } | null;

export function rawLenses(A: Profile, B: Profile, rel: RelType): Partial<Record<LensId, Raw>> {
  return {
    western: western(A, B, rel), vedic: vedic(A, B), chinese: chinese(A, B), numerology: numerology(A, B),
    tarot: tarot(A, B), yinyang: yinyang(A, B), bigfive: bigfive(A, B), attachment: attachment(A, B),
    care: care(A, B), temperament: temperamentLens(A, B), fourletter: fourletter(A, B), nine: nine(A, B),
    shadow: shadow(A, B), dosha: dosha(A, B), play: playLens(playProfile(A.quiz), playProfile(B.quiz)),
  };
}

function combine(items: { w: number; p: number }[]): number {
  const sw = Math.sqrt(items.reduce((s, i) => s + i.w * i.w, 0));
  if (!sw) return 0.5;
  const z = items.reduce((s, i) => s + i.w * normInv(i.p), 0) / sw;
  return normCdf(z);
}

export function comparePair(A: Profile, B: Profile, rel: RelType): PairReport {
  const raw = rawLenses(A, B, rel);
  const lenses: LensResult[] = [];
  const missing: LensId[] = [];
  for (const id of Object.keys(WEIGHTS) as LensId[]) {
    const r = raw[id];
    if (!r) { missing.push(id); continue; }
    const cal = id === "play" ? PLAY_CAL : CAL[id === "western" ? `western-${rel}` : id];
    const ph = percentileOf(r.rawH, cal?.h), ps = percentileOf(r.rawS, cal?.s);
    lenses.push({ id, rawH: r.rawH, rawS: r.rawS, harmony: toDisplay(ph), spark: toDisplay(ps), confidence: r.confidence, evidence: LENS_EVIDENCE[id], themes: r.themes, detail: { ...r.detail, ph, ps } });
  }
  const items = (key: "ph" | "ps", filter?: (l: LensResult) => boolean) =>
    lenses.filter((l) => !filter || filter(l)).map((l) => ({ w: WEIGHTS[l.id][rel] * l.confidence, p: l.detail[key] as number }));
  const resonance = toDisplay(combine(items("ph")));
  const spark = toDisplay(combine(items("ps")));
  const ev = items("ph", (l) => l.evidence === "research");
  const evidenceOnly = ev.length ? toDisplay(combine(ev)) : null;

  const agg: Record<string, { score: number; lenses: Set<LensId> }> = {};
  for (const l of lenses) {
    const w = WEIGHTS[l.id][rel] * l.confidence;
    for (const t of l.themes) {
      const k = `${t.theme}|${t.valence}`;
      agg[k] ??= { score: 0, lenses: new Set() };
      agg[k].score += w * t.salience;
      agg[k].lenses.add(l.id);
    }
  }
  const pick = (v: 1 | -1, exclude: Set<string>) => Object.entries(agg)
    .filter(([k]) => k.endsWith(`|${v}`) && !exclude.has(k.split("|")[0]))
    .sort((a, b) => b[1].score - a[1].score).slice(0, 3)
    .map(([k, x]) => ({ theme: k.split("|")[0] as Theme, lenses: [...x.lenses] }));
  const superpowers = pick(1, new Set());
  const growthEdges = pick(-1, new Set(superpowers.map((s) => s.theme)));
  if (!growthEdges.length) growthEdges.push({ theme: "growth", lenses: [] });

  return { rel, lenses, missing, resonance, spark, band: bandOf(resonance), archetype: archetypeOf(resonance, spark), evidenceOnly, superpowers, growthEdges };
}
