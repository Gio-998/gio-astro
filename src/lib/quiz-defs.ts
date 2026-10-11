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
      id: "big-five", title: "Big Five personality", tagline: "The most researched personality model — 20 quick statements.", minutes: 3, evidence: "research", resultKey: "bigFive",
      intro: "Rate how well each statement describes you as you generally are now — not as you wish to be.", unlocks: "Big Five · four temperaments · four-letter style · yin–yang refinement",
      items: BIG_FIVE_ITEMS.map((i) => ({ kind: "likert", id: i.id, text: q.bigFive[i.id], scale: q.scale5 })),
      score: (a) => ({ bigFive: scoreBigFive(a).pct }),
      note: "Items: Mini-IPIP (Donnellan et al., 2006) from the public-domain International Personality Item Pool (ipip.ori.org).",
    },
    attachment: {
      id: "attachment", title: "Attachment style", tagline: "How you handle closeness and distance — 9 statements.", minutes: 2, evidence: "research", resultKey: "attachment",
      intro: "Think about your close relationships in general (partners, close friends or family).", unlocks: "Attachment lens · pursue–withdraw insight",
      items: ATTACH_ITEMS.map((i) => ({ kind: "likert", id: i.id, text: q.attachment[i.id], scale: q.scale5 })),
      score: (a) => ({ attachment: scoreAttachment(a) }),
      note: "Our own items measuring the two well-studied dimensions (anxiety and avoidance). A short reflection tool, not a clinical test.",
    },
    nine: {
      id: "nine", title: "Nine motivations", tagline: "What drives you underneath it all — 18 statements.", minutes: 2, evidence: "popular", resultKey: "nine",
      intro: "How much is each statement like you?", unlocks: "Nine-motivation style · wing · growth & stress directions",
      items: q.nineOrder.map((id) => ({ kind: "likert", id, text: q.nine[id], scale: q.scaleTrue })),
      score: (a) => ({ nine: scoreNine(a) }), note: c.psych.nineNote,
    },
    care: {
      id: "care", title: "Care styles", tagline: "How you like to receive — and give — care. 11 quick picks.", minutes: 1, evidence: "popular", resultKey: "care",
      intro: "Pick the one that would mean more to you. No wrong answers.", unlocks: "Care styles · translation map in compatibility",
      items: [
        ...CARE_PAIRS.map(([x, y], i) => ({ kind: "choice" as const, id: `p${i}`, text: "Which would mean more to you?", options: [q.careOptions[x][i % 2], q.careOptions[y][(i + 1) % 2]] })),
        { kind: "choice" as const, id: "give", text: q.careGive, options: CARE.map((k) => c.psych.care[k].name) },
      ],
      score: (a) => ({ care: scoreCare(a) }), note: c.psych.careNote,
    },
    shadow: {
      id: "shadow", title: "Shadow & Light", tagline: "Seven classic shadows and their hidden gifts — 14 statements.", minutes: 2, evidence: "popular", resultKey: "shadow",
      intro: "Be honest — this is private and for growth. Every shadow carries a gift.", unlocks: "Shadow & Light profile · shadow dance in compatibility",
      items: SHADOW_ORDER.map((id) => ({ kind: "likert", id, text: q.shadow[id], scale: q.scale5 })),
      score: (a) => ({ shadow: scoreShadow(a) }), note: "Our own items, inspired by research on envy, greed, anger and self-control. Reflection only — never a moral verdict.",
    },
    dosha: {
      id: "dosha", title: "Body & energy type", tagline: "Ayurveda-inspired constitution — 12 quick picks.", minutes: 2, evidence: "traditional", resultKey: "dosha",
      intro: "Choose what has been most true for you over most of your life. You can skip this one — it's optional.", unlocks: "Body & energy type · balancing rituals",
      items: DOSHA_ITEMS.map((id) => ({ kind: "choice", id, text: q.dosha[id].q, options: [...q.dosha[id].options] })),
      score: (a) => ({ dosha: scoreDosha(a) }), note: c.psych.doshaNote,
    },
    explorer: {
      id: "explorer", title: "Autopilot vs Explorer", tagline: "Your mind's two modes + your social stance — 10 items.", minutes: 2, evidence: "popular", resultKey: "explorer",
      intro: "Slide toward the side that's more like you.", unlocks: "Autopilot/Explorer mind · social stance map",
      items: [
        ...EXPLORER_ITEMS.map((id) => ({ kind: "poles" as const, id, text: q.explorer[id].q, left: q.explorer[id].left, right: q.explorer[id].right })),
        ...STANCE_ITEMS.map((i) => ({ kind: "likert" as const, id: i.id, text: q.stance[i.id], scale: q.scale5 })),
      ],
      score: (a) => ({ explorer: scoreExplorer(a) }), note: c.psych.explorer.note,
    },
  };
}
