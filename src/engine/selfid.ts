/**
 * "Does this sound like you?" Self-identified results and how they combine with measured ones.
 * Rule: a self-identified pick always wins for display and matching, but the measured result is kept
 * and shown next to it ("You chose INFJ. The quiz suggested INFP.").
 * Priority for the four-letter style: self pick > dedicated 28-item quiz > estimate from the Big Five.
 * Priority for the Big Five: the 50-item version when taken, else the 20-item Mini-IPIP.
 */
import type { BigFive, FourLetter, Temperament } from "./bigfive";
import { fourLetter as fourLetterFromBigFive, temperament as temperamentFromBigFive } from "./bigfive";
import type { AttachResult, AttachStyle, NineResult } from "./quizzes";
import { GROWTH, STRESS } from "./quizzes";
import type { FourLetterQuizResult } from "./fourletter-quiz";

export const FOUR_LETTER_CODES = [
  "ISTJ", "ISFJ", "INFJ", "INTJ", "ISTP", "ISFP", "INFP", "INTP",
  "ESTP", "ESFP", "ENFP", "ENTP", "ESTJ", "ESFJ", "ENFJ", "ENTJ",
] as const;
export const TEMPERAMENTS: Temperament[] = ["sanguine", "choleric", "phlegmatic", "melancholic"];
export const ATTACH_STYLES: AttachStyle[] = ["secure", "anxious", "avoidant", "fearful"];

export type SelfIdKind = "fourLetter" | "temperament" | "nine" | "attachment";
export interface SelfId {
  fourLetter?: string;
  temperament?: Temperament;
  nine?: number;
  attachment?: AttachStyle;
  /** Kinds the user confirmed as accurate ("Yes, that's me"). */
  confirmed?: SelfIdKind[];
}

export type FourLetterSource = "self" | "quiz" | "big-five";
export interface EffectiveFourLetter extends FourLetter { source: FourLetterSource; measured: string | null; measuredSource: "quiz" | "big-five" | null }

export function effectiveFourLetter(bigFive: BigFive | undefined, quiz: FourLetterQuizResult | undefined, self: SelfId | undefined): EffectiveFourLetter | null {
  const measured: FourLetter | null = quiz ? { code: quiz.code, clarity: quiz.clarity } : bigFive ? fourLetterFromBigFive(bigFive) : null;
  const measuredSource = quiz ? "quiz" : bigFive ? "big-five" : null;
  const pick = self?.fourLetter && (FOUR_LETTER_CODES as readonly string[]).includes(self.fourLetter) ? self.fourLetter : null;
  if (pick) {
    const clarity = measured ? measured.clarity : { EI: 0, SN: 0, TF: 0, JP: 0 };
    return { code: pick, clarity, source: "self", measured: measured?.code ?? null, measuredSource };
  }
  if (!measured) return null;
  return { ...measured, source: measuredSource!, measured: measured.code, measuredSource };
}

export interface EffectiveTemperament { primary: Temperament; secondary: Temperament; strength: number; source: "self" | "big-five"; measured: Temperament }
export function effectiveTemperament(bigFive: BigFive, self: SelfId | undefined): EffectiveTemperament {
  const t = temperamentFromBigFive(bigFive);
  const pick = self?.temperament && TEMPERAMENTS.includes(self.temperament) ? self.temperament : null;
  if (!pick || pick === t.primary) return { ...t, source: "big-five", measured: t.primary };
  return { primary: pick, secondary: t.primary, strength: t.strength, source: "self", measured: t.primary };
}

export function effectiveNine(n: NineResult | undefined, self: SelfId | undefined): (NineResult & { source: "self" | "quiz"; measured: number }) | undefined {
  if (!n) return undefined;
  const pick = self?.nine && self.nine >= 1 && self.nine <= 9 ? self.nine : null;
  if (!pick || pick === n.type) return { ...n, source: "quiz", measured: n.type };
  const left = pick === 1 ? 9 : pick - 1, right = pick === 9 ? 1 : pick + 1;
  const wing = (n.scores[left - 1] ?? 0) >= (n.scores[right - 1] ?? 0) ? left : right;
  return { ...n, type: pick, wing, growth: GROWTH[pick], stress: STRESS[pick], source: "self", measured: n.type };
}

export function effectiveAttachment(a: AttachResult | undefined, self: SelfId | undefined): (AttachResult & { source: "self" | "quiz"; measured: AttachStyle }) | undefined {
  if (!a) return undefined;
  const pick = self?.attachment && ATTACH_STYLES.includes(self.attachment) ? self.attachment : null;
  if (!pick || pick === a.style) return { ...a, source: "quiz", measured: a.style };
  return { ...a, style: pick, source: "self", measured: a.style };
}

/** Patch to store when the user picks a different result (null clears the pick). */
export function selfIdPatch(cur: SelfId | undefined, kind: SelfIdKind, value: string | number | null): SelfId {
  const next: SelfId = { ...(cur ?? {}) };
  if (value == null) delete next[kind];
  else (next as Record<string, unknown>)[kind] = value;
  next.confirmed = (cur?.confirmed ?? []).filter((k) => k !== kind);
  return next;
}
/** Patch to store when the user says "Yes, that's me". */
export function selfConfirmPatch(cur: SelfId | undefined, kind: SelfIdKind): SelfId {
  const next: SelfId = { ...(cur ?? {}) };
  delete next[kind];
  next.confirmed = Array.from(new Set([...(cur?.confirmed ?? []), kind]));
  return next;
}
