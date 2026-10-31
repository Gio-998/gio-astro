/** One-glance result summaries (Big Five shape, quick headlines, show/hide details). */
import type { Trait } from "@/engine/bigfive";

export type Level = "vlow" | "low" | "mid" | "high" | "vhigh";
export const glance = {
  levels: { vlow: "very low", low: "low", mid: "balanced", high: "high", vhigh: "very high" } as Record<Level, string>,
  /** Short words used in the one-line Big Five headline, per trait and direction. */
  words: {
    O: { hi: "curious", lo: "grounded" },
    C: { hi: "dependable", lo: "free-spirited" },
    E: { hi: "outgoing", lo: "inward" },
    A: { hi: "warm", lo: "frank" },
    N: { hi: "feels everything fully", lo: "calm under pressure" },
  } as Record<Trait, { hi: string; lo: string }>,
  short: { O: "Openness", C: "Reliability", E: "Social energy", A: "Warmth", N: "Sensitivity" } as Record<Trait, string>,
  headline: (w: string[]) => {
    if (!w.length) return "Balanced across the board: you adapt to the room you're in.";
    const s = w.length === 1 ? w[0] : `${w.slice(0, -1).join(", ")} and ${w[w.length - 1]}`;
    return s.charAt(0).toUpperCase() + s.slice(1) + ".";
  },
  shapeLabel: "Your personality shape",
  tapTrait: "Tap a trait to see what it means for you.",
  inLove: "In relationships:",
  showMore: "Show details", showLess: "Hide details",
  showNumbers: "Show exact scores", hideNumbers: "Hide exact scores",
  // Attachment map
  closeness: "closeness", distance: "space", calm: "calm", worry: "worry",
  attachMap: "Where you sit: worry about closeness (up) and need for space (right).",
  // Nine
  nineWing: (t: number, w: number) => `Type ${t}, with a touch of ${w}`,
  nineArrows: (g: number, s: number) => `Grows toward ${g} · stress pulls toward ${s}`,
  // Care
  careHead: (a: string, b: string) => `You feel loved through ${a.toLowerCase()} and ${b.toLowerCase()}.`,
  careGives: (g: string) => `You show love with ${g.toLowerCase()}.`,
  // Shadow
  shadowHead: (light: string, shadow: string) => `Your light is ${light.toLowerCase()}. Your shadow to befriend is ${shadow.toLowerCase()}.`,
  // Dosha
  doshaMix: "Your mix",
  // Explorer
  explorerHead: { low: "You lean autopilot", mid: "You switch between both", high: "You lean explorer" } as Record<"low" | "mid" | "high", string>,
  // Compatibility
  pairHead: (sp: string, gr: string) => `Strongest together in ${sp.toLowerCase()}. Growing into ${gr.toLowerCase()}.`,
  pairDetails: "Strengths and growth edges", pairLenses: "Reading by reading",
};
export type Glance = typeof glance;
