import type { AnyQuizId } from "@/lib/quiz-defs";
import type { Cosmos } from "./ArtCard";
import type { EmblemId } from "./Emblem";
import { QUIZ_ART } from "./quizArt";

type Art = { img: Cosmos; tint: "violet" | "rose" | "gold" | "aqua" };
const EXTRA: Record<string, Art> = { "four-letter": { img: "milkyway", tint: "aqua" }, "big-five-long": { img: "orion", tint: "gold" } };
export const artOf = (id: AnyQuizId): Art => (QUIZ_ART as Record<string, Art>)[id] ?? EXTRA[id];
export const emblemOf = (id: AnyQuizId): EmblemId => (id === "four-letter" ? "fourletter" : id === "big-five-long" ? "big-five" : id);
