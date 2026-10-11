import type { Content } from "@/content";
import type { QuizResults } from "@/engine/profile";
import { BIG_FIVE_ITEMS, scoreBigFive } from "@/engine/bigfive";
import { ATTACH_ITEMS, scoreAttachment, scoreNine, CARE_PAIRS, CARE, scoreCare, DOSHA_ITEMS, scoreDosha, EXPLORER_ITEMS, STANCE_ITEMS, scoreExplorer } from "@/engine/quizzes";
import { SHADOW_ORDER, scoreShadow } from "@/engine/shadow";
import type { Evidence } from "@/engine/compat";

export type Q =
  | { kind: "likert"; id: string; text: string; scale: string[] }
  | { kind: "choice"; id: string; text: string; options: string[] }
  | { kind: "poles"; id: string; text: string; left: string; right: string };

export const QUIZ_IDS = ["big-five", "attachment", "nine", "care", "shadow", "dosha", "explorer"] as const;
export type QuizId = (typeof QUIZ_IDS)[number];
export interface QuizDef {
  id: QuizId; title: string; tagline: string; minutes: number; evidence: Evidence; resultKey: keyof QuizResults;
  intro: string; unlocks: string; items: Q[]; score: (a: Record<string, number>) => Partial<QuizResults>; note?: string;
}

export function quizDefs(c: Content): Record<QuizId, QuizDef> {
  const q = c.quizzes;
  return {
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
        ...CARE_PAIRS.map(([x, y], i) => ({ kind: "choice" as const, id: `p${i}`, text: c.ui.quiz.whichMore, options: [q.careOptions[x][i % 2], q.careOptions[y][(i + 1) % 2]] })),
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
