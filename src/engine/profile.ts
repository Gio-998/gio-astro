import { computeChart, Chart } from "./astro";
import { BirthInput } from "./time";
import { chineseProfile, ChineseProfile } from "./chinese";
import { lifePath, nameNumbers, NameNumbers, personalYear, birthdayNumber } from "./numerology";
import { birthCards } from "./tarot";
import { BigFive } from "./bigfive";
import { vedicMoon, VedicMoon } from "./vedic";
import type { AttachResult, NineResult, CareResult, DoshaResult, ExplorerResult } from "./quizzes";
import type { scoreShadow } from "./shadow";
import type { FourLetterQuizResult } from "./fourletter-quiz";
import { SelfId, effectiveFourLetter, effectiveTemperament, effectiveNine, effectiveAttachment, EffectiveFourLetter, EffectiveTemperament } from "./selfid";
import type { PlayResults } from "./play";
import type { AdaptiveResult } from "./adaptive";

export type ShadowResult = ReturnType<typeof scoreShadow>;
/** Results of the optional questionnaire lenses ("unlocked layers"). */
export interface QuizResults extends PlayResults {
  bigFive?: BigFive;
  attachment?: AttachResult;
  nine?: NineResult;
  care?: CareResult;
  shadow?: ShadowResult;
  dosha?: DoshaResult;
  explorer?: ExplorerResult;
  /** Dedicated 28-item four-letter preference quiz. */
  fourLetter?: FourLetterQuizResult;
  /** 50-item IPIP Big Five (percentiles). Used instead of the 20-item version when present. */
  bigFiveLong?: BigFive;
  /** "Does this sound like you?" picks and confirmations. */
  selfId?: SelfId;
  /** Deep Read: adaptive dilemma test (Big Five traits with per-trait confidence). */
  adaptive?: AdaptiveResult;
}
import { Element, SIGN_ELEMENT, Sign, isYangSign } from "./zodiac";

export interface PersonInput extends BirthInput {
  name?: string; // full birth name, for numerology
  quiz?: QuizResults;
}

/** The part of a profile that comes from tests alone. It needs no birth date. */
export interface QuizLayer {
  quiz: QuizResults;
  psych: { bigFive: BigFive; fourLetter: EffectiveFourLetter; temperament: EffectiveTemperament } | null;
  /** Effective four-letter style (self pick > dedicated quiz > Big Five estimate), also without a Big Five. */
  fourLetter: EffectiveFourLetter | null;
  /** Which Big Five version feeds the results. */
  bigFiveSource: "long" | "short" | null;
}

export interface Profile extends QuizLayer {
  input: PersonInput;
  chart: Chart;
  sun: Sign;
  moon: Sign;
  rising: Sign | null;
  chinese: ChineseProfile;
  vedic: VedicMoon;
  numbers: { lifePath: number; lifePathSteps: string; birthday: number; personalYear: number; name: NameNumbers | null };
  tarot: { number: number; cards: number[] };
  yang: number; // 0–100 balance point (50 = centered)
  dominantElement: Element;
  archetypeAnimal: ArchetypeAnimal;
  palette: string[]; // 5 hex colours
}

export type ArchetypeAnimal =
  | "lion" | "hawk" | "horse-wild" | "fox" | "stag" | "bear" | "tortoise" | "elephant"
  | "raven" | "dolphin" | "eagle" | "hummingbird" | "owl" | "whale" | "otter" | "wolf";

// Archetype animal table: dominant Western element × energy (yang/yin lean). Symbolic flavour, unscored.
const ANIMAL_TABLE: Record<Element, [ArchetypeAnimal, ArchetypeAnimal, ArchetypeAnimal, ArchetypeAnimal]> = {
  //            very yang     yang          yin           very yin
  fire: ["lion", "hawk", "horse-wild", "fox"],
  earth: ["stag", "bear", "elephant", "tortoise"],
  air: ["eagle", "hummingbird", "raven", "dolphin"],
  water: ["otter", "wolf", "whale", "owl"],
};

const ELEMENT_PALETTES: Record<Element, string[]> = {
  fire: ["#F25C54", "#F7B267", "#F4845F", "#FFD6A5", "#7A1E3A"],
  earth: ["#6B8F71", "#A3B18A", "#DDB892", "#7F5539", "#3A5A40"],
  air: ["#A9DEF9", "#E4C1F9", "#D0F4DE", "#FCF6BD", "#6C8EBF"],
  water: ["#3D5A80", "#98C1D9", "#5E548E", "#9FD8CB", "#1B263B"],
};
const WUXING_ACCENT: Record<string, string> = { wood: "#52B788", fire: "#E85D75", earth: "#C9A227", metal: "#C0C7D1", water: "#355C7D" };

/** Effective test results: the long Big Five replaces the short one; self-identified picks replace measured types. */
export function quizLayer(rq: QuizResults = {}): QuizLayer {
  const bigFiveSource: QuizLayer["bigFiveSource"] = rq.bigFiveLong ? "long" : rq.bigFive ? "short" : null;
  const quiz: QuizResults = { ...rq, bigFive: rq.bigFiveLong ?? rq.bigFive, nine: effectiveNine(rq.nine, rq.selfId), attachment: effectiveAttachment(rq.attachment, rq.selfId) };
  for (const k of ["bigFive", "nine", "attachment"] as const) if (quiz[k] === undefined) delete quiz[k];
  const b5 = quiz.bigFive;
  const fourLetter = effectiveFourLetter(b5, rq.fourLetter, rq.selfId);
  const psych = b5 && fourLetter ? { bigFive: b5, fourLetter, temperament: effectiveTemperament(b5, rq.selfId) } : null;
  return { quiz, psych, fourLetter, bigFiveSource };
}

export function buildProfile(rawInput: PersonInput): Profile {
  const layer = quizLayer(rawInput.quiz);
  const input: PersonInput = { ...rawInput, quiz: layer.quiz };
  const chart = computeChart(input);
  const sun = chart.placements.sun!.sign;
  const moon = chart.placements.moon!.sign;
  const rising = chart.placements.asc?.sign ?? null;
  const chinese = chineseProfile(input.date, input.time, chart.time.timeKnown && chart.time.offsetSource !== "assumed-utc"
    ? { utc: chart.time.utc, lon: input.place?.lon ?? undefined, lat: input.place?.lat ?? undefined } : {});
  const lp = lifePath(input.date);
  const name = input.name ? nameNumbers(input.name) : null;
  const thisYear = new Date().getFullYear();

  // Yin–yang balance point: blend of Western polarity, Chinese year/day polarity and (if known) Extraversion.
  const polarityPts: [number, number][] = [];
  const westernPts = (["sun", "moon", "mercury", "venus", "mars", "asc"] as const).map((p) => chart.placements[p]).filter(Boolean);
  const yangShare = westernPts.filter((p) => isYangSign(p!.sign)).length / westernPts.length;
  polarityPts.push([yangShare * 100, 3]);
  polarityPts.push([chinese.yinYang === "yang" ? 65 : 35, 1]);
  polarityPts.push([chinese.dayMaster.yinYang === "yang" ? 65 : 35, 1]);
  const b5 = input.quiz?.bigFive;
  if (b5) polarityPts.push([b5.E * 0.8 + b5.O * 0.2, 3]);
  const dosha = input.quiz?.dosha;
  if (dosha) polarityPts.push([50 + (dosha.pct.pitta + dosha.pct.vata - 2 * dosha.pct.kapha) / 4, 1]);
  const yang = Math.round(polarityPts.reduce((s, [v, w]) => s + v * w, 0) / polarityPts.reduce((s, [, w]) => s + w, 0));

  const bal = chart.elementBalance;
  const dominantElement = (Object.keys(bal) as Element[]).sort((a, b) => bal[b] - bal[a] || (a === SIGN_ELEMENT[sun] ? -1 : 1))[0];
  const tier = yang >= 65 ? 0 : yang >= 50 ? 1 : yang >= 35 ? 2 : 3;
  const archetypeAnimal = ANIMAL_TABLE[dominantElement][tier];
  const base = ELEMENT_PALETTES[dominantElement];
  const palette = [base[0], base[1], WUXING_ACCENT[chinese.element], base[3], base[4]];

  return {
    ...layer, input, chart, sun, moon, rising, chinese, vedic: vedicMoon(chart),
    numbers: { lifePath: lp.value, lifePathSteps: lp.steps, birthday: birthdayNumber(input.date), personalYear: personalYear(input.date, thisYear), name },
    tarot: birthCards(input.date),
    yang, dominantElement, archetypeAnimal, palette,
  };
}
