/**
 * "You, all in one": one combined profile from every source we have (birth chart, questionnaires, Deep Read,
 * Play Mirror). Six everyday axes, each a weighted blend of whatever sources exist, with a confidence that grows
 * as more independent sources agree. Weights reflect evidence: behaviour and research questionnaires count most,
 * the birth chart counts a little (a traditional lens, kept as a gentle starting point).
 */
import type { QuizResults } from "./profile";
import { playProfile, type PlayResults } from "./play";
import type { Element } from "./zodiac";

export const AXES = ["energy", "curiosity", "structure", "warmth", "steadiness", "daring"] as const;
export type Axis = (typeof AXES)[number];
export type SourceId = "chart" | "bigFive" | "bigFiveLong" | "fourLetter" | "adaptive" | "play";
export interface AxisSignal { value: number; sure: number; sources: SourceId[]; spread: number }
export interface Unified {
  axes: Record<Axis, AxisSignal | null>;
  /** 0..1 overall: how sure we are about the whole picture. */
  sure: number;
  level: 0 | 1 | 2 | 3;
  sources: SourceId[];
  /** The single step that would add the most certainty. */
  next: "deep" | "bigFive" | "play" | "playMore" | "bigFiveLong" | null;
}

type Pt = { v: number; w: number; s: SourceId };
const clamp = (x: number, a = 0, b = 100) => Math.min(b, Math.max(a, x));

export function unifiedProfile(q: QuizResults | null | undefined, elements?: Record<Element, number> | null): Unified {
  q = q ?? {};
  const pts: Record<Axis, Pt[]> = { energy: [], curiosity: [], structure: [], warmth: [], steadiness: [], daring: [] };
  const add = (a: Axis, v: number | undefined | null, w: number, s: SourceId) => { if (v != null && Number.isFinite(v) && w > 0) pts[a].push({ v: clamp(v), w, s }); };

  if (elements) {
    const tot = Object.values(elements).reduce((x, y) => x + y, 0) || 1;
    const e = (k: Element) => (elements[k] / tot) * 100;
    // Fire and air lean outward and bold, earth leans planned, water leans warm and sensitive.
    add("energy", 50 + (e("fire") + e("air") - 50) * 0.6, 0.25, "chart");
    add("structure", 50 + (e("earth") - 25) * 0.9, 0.2, "chart");
    add("warmth", 50 + (e("water") - 25) * 0.9, 0.2, "chart");
    add("daring", 50 + (e("fire") - 25) * 0.9, 0.2, "chart");
  }
  const b5 = (b: { O: number; C: number; E: number; A: number; N: number } | undefined, w: number, s: SourceId) => {
    if (!b) return;
    add("energy", b.E, w, s); add("curiosity", b.O, w, s); add("structure", b.C, w, s); add("warmth", b.A, w, s); add("steadiness", 100 - b.N, w, s);
    add("daring", (b.O + (100 - b.C)) / 2, w * 0.35, s);
  };
  b5(q.bigFive, 1, "bigFive");
  b5(q.bigFiveLong, 1.6, "bigFiveLong");
  if (q.adaptive) {
    const A = q.adaptive; const w = (t: keyof typeof A.conf) => 1.5 * Math.max(0.2, A.conf[t]);
    add("energy", A.pct.E, w("E"), "adaptive"); add("curiosity", A.pct.O, w("O"), "adaptive"); add("structure", A.pct.C, w("C"), "adaptive");
    add("warmth", A.pct.A, w("A"), "adaptive"); add("steadiness", 100 - A.pct.N, w("N"), "adaptive");
    add("daring", (A.pct.O + (100 - A.pct.C)) / 2, 0.5, "adaptive");
  }
  if (q.fourLetter) {
    const F = q.fourLetter; const pole = (first: boolean, cl: number) => 50 + (first ? 1 : -1) * cl / 2;
    add("energy", pole(F.code[0] === "E", F.clarity.EI), 0.7, "fourLetter");
    add("curiosity", pole(F.code[1] === "N", F.clarity.SN), 0.6, "fourLetter");
    add("warmth", pole(F.code[2] === "F", F.clarity.TF), 0.6, "fourLetter");
    add("structure", pole(F.code[3] === "J", F.clarity.JP), 0.7, "fourLetter");
  }
  const P = playProfile(q as PlayResults);
  if (P) {
    const d = P.dims; const x = (k: keyof typeof d) => (d[k] == null ? null : d[k]! * 10);
    add("daring", x("risk"), 1.4, "play");
    add("steadiness", x("resilience"), 0.9, "play");
    add("energy", x("lead"), 0.7, "play");
    add("warmth", x("empathy"), 0.6, "play"); add("warmth", x("fairness"), 0.4, "play"); add("warmth", x("trust"), 0.3, "play");
    add("curiosity", d.conform == null ? null : 100 - d.conform * 10, 0.4, "play");
    add("structure", x("patience"), 0.8, "play"); add("structure", x("control"), 0.7, "play"); add("structure", x("detail"), 0.3, "play");
  }

  const axes = {} as Record<Axis, AxisSignal | null>;
  for (const a of AXES) {
    const L = pts[a]; const W = L.reduce((s, p) => s + p.w, 0);
    if (!W) { axes[a] = null; continue; }
    const value = L.reduce((s, p) => s + p.v * p.w, 0) / W;
    const spread = Math.sqrt(L.reduce((s, p) => s + p.w * (p.v - value) ** 2, 0) / W);
    const srcs = [...new Set(L.map((p) => p.s))];
    // More weight = surer; independent sources agreeing = surer still; sources pulling apart = less sure.
    const sure = clamp((1 - Math.exp(-W / 1.6)) * (1 - Math.min(0.45, spread / 70)) * (srcs.length > 1 ? 1 : 0.85), 0, 1);
    axes[a] = { value: Math.round(value), sure: Math.round(sure * 100) / 100, sources: srcs, spread: Math.round(spread) };
  }
  const sure = Math.round((AXES.reduce((s, a) => s + (axes[a]?.sure ?? 0), 0) / AXES.length) * 100) / 100;
  const level = (sure >= 0.72 ? 3 : sure >= 0.5 ? 2 : sure >= 0.25 ? 1 : 0) as Unified["level"];
  const sources = [...new Set(AXES.flatMap((a) => axes[a]?.sources ?? []))];
  const games = P?.games.length ?? 0;
  const next: Unified["next"] = !q.adaptive ? "deep" : games === 0 ? "play" : !q.bigFive && !q.bigFiveLong ? "bigFive" : games < 7 ? "playMore" : !q.bigFiveLong ? "bigFiveLong" : null;
  return { axes, sure, level, sources, next };
}
