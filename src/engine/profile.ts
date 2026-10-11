import { computeChart, Chart } from "./astro";
import { BirthInput } from "./time";
import { chineseProfile, ChineseProfile } from "./chinese";
import { lifePath, nameNumbers, NameNumbers, personalYear, birthdayNumber } from "./numerology";
import { birthCards } from "./tarot";
import { BigFive, fourLetter, temperament, FourLetter, Temperament } from "./bigfive";
import { vedicMoon, VedicMoon } from "./vedic";
import type { AttachResult, NineResult, CareResult, DoshaResult, ExplorerResult } from "./quizzes";
import type { scoreShadow } from "./shadow";

export type ShadowResult = ReturnType<typeof scoreShadow>;
/** Results of the optional questionnaire lenses ("unlocked layers"). */
export interface QuizResults {
  bigFive?: BigFive;
  attachment?: AttachResult;
  nine?: NineResult;
  care?: CareResult;
  shadow?: ShadowResult;
  dosha?: DoshaResult;
  explorer?: ExplorerResult;
}
import { Element, SIGN_ELEMENT, Sign, isYangSign } from "./zodiac";

export interface PersonInput extends BirthInput {
  name?: string; // full birth name, for numerology
  quiz?: QuizResults;
}

export interface Profile {
  input: PersonInput;
  chart: Chart;
  sun: Sign;
  moon: Sign;
  rising: Sign | null;
  chinese: ChineseProfile;
  vedic: VedicMoon;
  quiz: QuizResults;
  numbers: { lifePath: number; lifePathSteps: string; birthday: number; personalYear: number; name: NameNumbers | null };
  tarot: { number: number; cards: number[] };
  yang: number; // 0–100 balance point (50 = centered)
  dominantElement: Element;
  archetypeAnimal: ArchetypeAnimal;
  palette: string[]; // 5 hex colours
  psych: { bigFive: BigFive; fourLetter: FourLetter; temperament: { primary: Temperament; secondary: Temperament; strength: number } } | null;
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

export function buildProfile(input: PersonInput): Profile {
  const chart = computeChart(input);
  const sun = chart.placements.sun!.sign;
  const moon = chart.placements.moon!.sign;
  const rising = chart.placements.asc?.sign ?? null;
  const chinese = chineseProfile(input.date, input.time);
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

  const psych = b5 ? { bigFive: b5, fourLetter: fourLetter(b5), temperament: temperament(b5) } : null;

  return {
    input, chart, sun, moon, rising, chinese, vedic: vedicMoon(chart), quiz: input.quiz ?? {},
    numbers: { lifePath: lp.value, lifePathSteps: lp.steps, birthday: birthdayNumber(input.date), personalYear: personalYear(input.date, thisYear), name },
    tarot: birthCards(input.date),
    yang, dominantElement, archetypeAnimal, palette, psych,
  };
}
