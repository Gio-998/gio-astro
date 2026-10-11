import type { QuizId } from "@/lib/quiz-defs";

export type ListKind = "daily" | "strengths" | "shadows" | "practices" | "journal" | "focus";
export type Block =
  | { t: "lead"; text: string }
  | { t: "p"; text: string }
  | { t: "h"; text: string }
  | { t: "quote"; text: string }
  | { t: "list"; kind: ListKind; title: string; items: string[] }
  | { t: "facets"; items: { label: string; text: string }[] }
  | { t: "callout"; tone: "agree" | "differ" | "note"; title?: string; text: string }
  | { t: "deep"; title: string; blocks: Block[] }
  | { t: "palette"; colors: string[]; labels: string[] }
  | { t: "lock"; quizzes: QuizId[]; text: string };

export type ArtKey = { kind: "sign"; sign: import("@/engine/zodiac").Sign } | { kind: "emblem"; id: import("@/components/art/Emblem").EmblemId };

export interface Chapter {
  id: string;
  title: string;
  kicker: string;
  art: ArtKey;
  blocks: Block[];
  locked: boolean;
  missing: QuizId[]; // quizzes that would enrich this chapter
}
export interface Book { chapters: Chapter[]; words: number; minutes: number; lenses: number }

const words = (s: string) => (s.match(/\S+/g) ?? []).length;
export function countWords(blocks: Block[]): number {
  let n = 0;
  for (const b of blocks) {
    if (b.t === "lead" || b.t === "p" || b.t === "h" || b.t === "quote" || b.t === "callout") n += words(b.text) + (b.t === "callout" && b.title ? words(b.title) : 0);
    else if (b.t === "list") n += words(b.title) + b.items.reduce((s, i) => s + words(i), 0);
    else if (b.t === "facets") n += b.items.reduce((s, i) => s + words(i.label) + words(i.text), 0);
    else if (b.t === "deep") n += words(b.title) + countWords(b.blocks);
  }
  return n;
}
