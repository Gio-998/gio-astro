import type { QuizId } from "@/lib/quiz-defs";
import type { Cosmos } from "./ArtCard";
export const QUIZ_ART: Record<QuizId, { img: Cosmos; tint: "violet" | "rose" | "gold" | "aqua" }> = {
  "big-five": { img: "orion", tint: "violet" }, attachment: { img: "twinjet", tint: "rose" }, nine: { img: "helix", tint: "violet" }, care: { img: "storm", tint: "rose" },
  shadow: { img: "pillars", tint: "gold" }, dosha: { img: "mountain", tint: "aqua" }, explorer: { img: "cliffs", tint: "gold" },
};
