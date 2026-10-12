import type { Content } from "@/content";
import type { QuizResults } from "@/engine/profile";
import { BIG_FIVE_ITEMS, scoreBigFive } from "@/engine/bigfive";
import { ATTACH_ITEMS, scoreAttachment, scoreNine, CARE_PAIRS, CARE_ORDER, CARE, scoreCare, DOSHA_ITEMS, scoreDosha, EXPLORER_ITEMS, STANCE_ITEMS, scoreExplorer } from "@/engine/quizzes";
import { SHADOW_ORDER, scoreShadow } from "@/engine/shadow";
import type { Evidence } from "@/engine/compat";
import { FOUR_LETTER_ITEMS, scoreFourLetter } from "@/engine/fourletter-quiz";
import { BIG_FIVE_LONG_ITEMS, scoreBigFiveLong } from "@/engine/bigfive-long";

export type Q =
  | { kind: "likert"; id: string; text: string; scale: string[] }
  | { kind: "choice"; id: string; text: string; options: string[] }
  | { kind: "poles"; id: string; text: string; left: string; right: string }
  /** Forced choice between two statements on a 4-point scale (1 = clearly a ... 4 = clearly b). */
  | { kind: "pair"; id: string; text: string; a: string; b: string; scale: string[]; hint: string };

export const QUIZ_IDS = ["big-five", "attachment", "nine", "care", "shadow", "dosha", "explorer"] as const;
export type QuizId = (typeof QUIZ_IDS)[number];
/** Longer "sharper results" quizzes. Kept out of QUIZ_IDS so the seven core layers stay as they are. */
export const PRECISION_QUIZ_IDS = ["four-letter", "big-five-long"] as const;
export type PrecisionQuizId = (typeof PRECISION_QUIZ_IDS)[number];
export type AnyQuizId = QuizId | PrecisionQuizId;
export const ALL_QUIZ_IDS: readonly AnyQuizId[] = [...QUIZ_IDS, ...PRECISION_QUIZ_IDS];
export const isPrecisionQuiz = (id: string): id is PrecisionQuizId => (PRECISION_QUIZ_IDS as readonly string[]).includes(id);
export interface QuizDef {
  id: AnyQuizId; title: string; tagline: string; minutes: number; evidence: Evidence; resultKey: keyof QuizResults;
  intro: string; unlocks: string; items: Q[]; score: (a: Record<string, number>) => Partial<QuizResults>; note?: string;
}

export function quizDefs(c: Content): Record<AnyQuizId, QuizDef> {
  const q = c.quizzes; const T = c.types;
  return {
    "four-letter": {
      id: "four-letter", title: T.meta["four-letter"].title, tagline: T.meta["four-letter"].tagline, minutes: 4, evidence: "popular", resultKey: "fourLetter",
      intro: T.meta["four-letter"].intro, unlocks: T.meta["four-letter"].unlocks,
      items: FOUR_LETTER_ITEMS.map((i) => ({ kind: "pair", id: i.id, text: T.fourLetterItems[i.id].q, a: T.fourLetterItems[i.id].a, b: T.fourLetterItems[i.id].b, scale: T.pairScale, hint: T.pairHint })),
      score: (a) => ({ fourLetter: scoreFourLetter(a) }),
      note: T.meta["four-letter"].note,
    },
    "big-five-long": {
      id: "big-five-long", title: T.meta["big-five-long"].title, tagline: T.meta["big-five-long"].tagline, minutes: 6, evidence: "research", resultKey: "bigFiveLong",
      intro: T.meta["big-five-long"].intro, unlocks: T.meta["big-five-long"].unlocks,
      items: BIG_FIVE_LONG_ITEMS.map((i) => ({ kind: "likert", id: i.id, text: T.bigFiveLongItems[i.id], scale: q.scale5 })),
      score: (a) => ({ bigFiveLong: scoreBigFiveLong(a).pct }),
      note: T.meta["big-five-long"].note,
    },
    "big-five": {
      id: "big-five", title: q.meta["big-five"].title, tagline: q.meta["big-five"].tagline, minutes: 3, evidence: "research", resultKey: "bigFive",
      intro: q.meta["big-five"].intro, unlocks: q.meta["big-five"].unlocks,
      items: BIG_FIVE_ITEMS.map((i) => ({ kind: "likert", id: i.id, text: q.bigFive[i.id], scale: q.scale5 })),
      score: (a) => ({ bigFive: scoreBigFive(a).pct }),
      note: q.meta["big-five"].note,
    },
    attachment: {
      id: "attachment", title: q.meta["attachment"].title, tagline: q.meta["attachment"].tagline, minutes: 2, evidence: "research", resultKey: "attachment",
      intro: q.meta["attachment"].intro, unlocks: q.meta["attachment"].unlocks,
      items: ATTACH_ITEMS.map((i) => ({ kind: "likert", id: i.id, text: q.attachment[i.id], scale: q.scale5 })),
      score: (a) => ({ attachment: scoreAttachment(a) }),
      note: q.meta["attachment"].note,
    },
    nine: {
      id: "nine", title: q.meta["nine"].title, tagline: q.meta["nine"].tagline, minutes: 2, evidence: "popular", resultKey: "nine",
      intro: q.meta["nine"].intro, unlocks: q.meta["nine"].unlocks,
      items: q.nineOrder.map((id) => ({ kind: "likert", id, text: q.nine[id], scale: q.scaleTrue })),
      score: (a) => ({ nine: scoreNine(a) }), note: c.psych.nineNote,
    },
    care: {
      id: "care", title: q.meta["care"].title, tagline: q.meta["care"].tagline, minutes: 1, evidence: "popular", resultKey: "care",
      intro: q.meta["care"].intro, unlocks: q.meta["care"].unlocks,
      items: [
        ...CARE_ORDER.map((i) => {
          const [x, y] = CARE_PAIRS[i]; const s = q.careScenes[`${x}-${y}`];
          // ids stay p{pairIndex} so scoring and saved answers are unchanged; options as [x, y] map to 0/1.
          return { kind: "choice" as const, id: `p${i}`, text: s.q, options: [s.a, s.b] };
        }),
        { kind: "choice" as const, id: "give", text: q.careGive, options: CARE.map((k) => c.psych.care[k].name) },
      ],
      score: (a) => ({ care: scoreCare(a) }), note: c.psych.careNote,
    },
    shadow: {
      id: "shadow", title: q.meta["shadow"].title, tagline: q.meta["shadow"].tagline, minutes: 2, evidence: "popular", resultKey: "shadow",
      intro: q.meta["shadow"].intro, unlocks: q.meta["shadow"].unlocks,
      items: SHADOW_ORDER.map((id) => ({ kind: "likert", id, text: q.shadow[id], scale: q.scale5 })),
      score: (a) => ({ shadow: scoreShadow(a) }), note: q.meta["shadow"].note,
    },
    dosha: {
      id: "dosha", title: q.meta["dosha"].title, tagline: q.meta["dosha"].tagline, minutes: 2, evidence: "traditional", resultKey: "dosha",
      intro: q.meta["dosha"].intro, unlocks: q.meta["dosha"].unlocks,
      items: DOSHA_ITEMS.map((id) => ({ kind: "choice", id, text: q.dosha[id].q, options: [...q.dosha[id].options] })),
      score: (a) => ({ dosha: scoreDosha(a) }), note: c.psych.doshaNote,
    },
    explorer: {
      id: "explorer", title: q.meta["explorer"].title, tagline: q.meta["explorer"].tagline, minutes: 2, evidence: "popular", resultKey: "explorer",
      intro: q.meta["explorer"].intro, unlocks: q.meta["explorer"].unlocks,
      items: [
        ...EXPLORER_ITEMS.map((id) => ({ kind: "poles" as const, id, text: q.explorer[id].q, left: q.explorer[id].left, right: q.explorer[id].right })),
        ...STANCE_ITEMS.map((i) => ({ kind: "likert" as const, id: i.id, text: q.stance[i.id], scale: q.scale5 })),
      ],
      score: (a) => ({ explorer: scoreExplorer(a) }), note: c.psych.explorer.note,
    },
  };
}
