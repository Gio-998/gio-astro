import { answersDe } from "./de";
import { answersEn } from "./en";
import { answersSr } from "./sr";
import type { AnswerSet, QuickAnswer } from "./types";
export type { AnswerSet, QuickAnswer };

/** Pages with a written direct answer. Others lead with their first meaning paragraph under the same question. */
export const ANSWERS: Record<string, AnswerSet> = { de: answersDe, en: answersEn, sr: answersSr };
export const quickAnswer = (lang: string, key: string): QuickAnswer | undefined => ANSWERS[lang]?.[key];
