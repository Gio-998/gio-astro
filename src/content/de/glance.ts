import type { Trait } from "@/engine/bigfive";
import type { Glance, Level } from "../en/glance";

export const glance: Glance = {
  levels: { vlow: "sehr niedrig", low: "niedrig", mid: "ausgewogen", high: "hoch", vhigh: "sehr hoch" } as Record<Level, string>,
  words: {
    O: { hi: "neugierig", lo: "bodenständig" },
    C: { hi: "verlässlich", lo: "freigeistig" },
    E: { hi: "gesellig", lo: "nach innen gekehrt" },
    A: { hi: "warmherzig", lo: "direkt" },
    N: { hi: "fühlst alles ganz", lo: "ruhig unter Druck" },
  } as Record<Trait, { hi: string; lo: string }>,
  short: { O: "Offenheit", C: "Verlässlichkeit", E: "Soziale Energie", A: "Wärme", N: "Empfindsamkeit" } as Record<Trait, string>,
  headline: (w: string[]) => {
    if (!w.length) return "Rundum ausgewogen: Du passt dich dem Raum an, in dem du bist.";
    const s = w.length === 1 ? w[0] : `${w.slice(0, -1).join(", ")} und ${w[w.length - 1]}`;
    return s.charAt(0).toUpperCase() + s.slice(1) + ".";
  },
  shapeLabel: "Die Form deiner Persönlichkeit",
  tapTrait: "Tippe auf einen Wesenszug, um zu sehen, was er für dich bedeutet.",
  inLove: "In Beziehungen:",
  showMore: "Details zeigen", showLess: "Details ausblenden",
  showNumbers: "Genaue Werte zeigen", hideNumbers: "Genaue Werte ausblenden",
  closeness: "Nähe", distance: "Raum", calm: "Ruhe", worry: "Sorge",
  attachMap: "Wo du stehst: Sorge um Nähe (oben) und Bedürfnis nach Raum (rechts).",
  nineWing: (t: number, w: number) => `Typ ${t}, mit einem Hauch ${w}`,
  nineArrows: (g: number, s: number) => `Wächst Richtung ${g} · Stress zieht Richtung ${s}`,
  careHead: (a: string, b: string) => `Du fühlst dich geliebt durch ${a} und ${b}.`,
  careGives: (g: string) => `Du zeigst Liebe durch ${g}.`,
  shadowHead: (light: string, shadow: string) => `Dein Licht ist ${light}. Dein Schatten, mit dem du dich anfreunden darfst: ${shadow}.`,
  doshaMix: "Deine Mischung",
  explorerHead: { low: "Du neigst zum Autopiloten", mid: "Du wechselst zwischen beiden", high: "Du neigst zum Entdecken" } as Record<"low" | "mid" | "high", string>,
  pairHead: (sp: string, gr: string) => `Am stärksten zusammen in: ${sp}. Ihr wachst in: ${gr}.`,
  pairDetails: "Stärken und Wachstumsfelder", pairLenses: "Blickwinkel für Blickwinkel",
};
