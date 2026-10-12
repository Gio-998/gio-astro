/**
 * The "Play" compatibility lens: how two people actually behaved in Play Mirror, side by side.
 * Harmony leans on shared trust, fairness and care plus complementary leading; Spark rises with different risk
 * appetite, tempo and two strong leaders. Research-inspired (trust games, emotion recognition, conformity studies),
 * but these are a few minutes of play: a behavioural signal, never a verdict on a relationship.
 */
import type { PlayDim, PlayProfile } from "./index";
import type { Theme, ThemeHit } from "../compat";
import calibration from "./calibration.json";

export const PLAY_CAL = calibration as { h: number[]; s: number[] };

export interface PlayLensDetail { shared: PlayDim[]; a: Partial<Record<PlayDim, number>>; b: Partial<Record<PlayDim, number>>; notes: string[] }

export function playLens(A: PlayProfile | null, B: PlayProfile | null) {
  if (!A || !B) return null;
  const has = (d: PlayDim) => A.dims[d] != null && B.dims[d] != null;
  const a = (d: PlayDim) => A.dims[d]!, b = (d: PlayDim) => B.dims[d]!;
  const shared = (Object.keys(A.dims) as PlayDim[]).filter(has);
  if (shared.length < 2) return null;
  const H: [number, number][] = [], S: [number, number][] = [];
  const themes: ThemeHit[] = []; const notes: string[] = [];
  const hit = (theme: Theme, valence: 1 | -1, salience: number, note: string) => { themes.push({ theme, valence, salience }); notes.push(note); };
  const avg = (d: PlayDim) => (a(d) + b(d)) / 2, gap = (d: PlayDim) => Math.abs(a(d) - b(d));

  if (has("trust")) {
    H.push([10 * (0.6 * avg("trust") + 0.4 * (10 - gap("trust"))), 3]); S.push([10 * gap("trust"), 1]);
    if (a("trust") >= 6.5 && b("trust") >= 6.5) hit("stability", 1, 7, "bothTrust");
    else if (gap("trust") >= 4) hit("emotional", -1, 6, "trustGap");
  }
  if (has("fairness")) {
    H.push([10 * (0.6 * avg("fairness") + 0.4 * (10 - gap("fairness"))), 2.5]);
    if (a("fairness") >= 6.5 && b("fairness") >= 6.5) hit("values", 1, 6, "bothFair");
    else if (gap("fairness") >= 4) hit("values", -1, 5, "fairGap");
  }
  if (has("empathy")) {
    H.push([10 * avg("empathy"), 2.5]);
    if (a("empathy") >= 6.5 && b("empathy") >= 6.5) hit("nurturing", 1, 6, "bothCare");
  }
  if (has("read")) { H.push([10 * avg("read"), 1]); if (gap("read") >= 4) hit("communication", -1, 4, "readGap"); }
  if (has("risk")) {
    H.push([10 * (10 - gap("risk")), 1.5]); S.push([10 * gap("risk"), 2.5]);
    if (gap("risk") >= 4) hit("pace", -1, 6, "riskGap");
    else if (a("risk") >= 6.5 && b("risk") >= 6.5) hit("play", 1, 5, "bothBold");
  }
  if (has("resilience")) {
    H.push([10 * avg("resilience"), 1.5]);
    if (a("resilience") >= 6.5 && b("resilience") >= 6.5) hit("conflict", 1, 5, "bothBounce");
    else if (a("resilience") <= 3.5 && b("resilience") <= 3.5) hit("conflict", -1, 5, "bothTender");
  }
  if (has("lead")) {
    const sum = a("lead") + b("lead");
    H.push([Math.max(0, 100 - Math.abs(sum - 10) * 8), 2]);
    S.push([Math.max(0, Math.min(100, (Math.min(a("lead"), b("lead")) - 4) * 20)), 2]);
    if (a("lead") >= 6.5 && b("lead") >= 6.5) hit("power", -1, 7, "twoLeaders");
    else if (Math.abs(sum - 10) <= 2.5 && gap("lead") >= 3) hit("power", 1, 5, "leadFollow");
  }
  if (has("conform")) { H.push([10 * (10 - gap("conform")), 1]); S.push([10 * gap("conform"), 1]); }
  if (has("speed")) {
    H.push([10 * (10 - gap("speed")), 1]); S.push([10 * gap("speed"), 1.5]);
    if (gap("speed") >= 4) hit("communication", -1, 4, "tempoGap");
  }
  if (has("detail")) { H.push([70 + 2 * gap("detail"), 0.5]); S.push([10 * gap("detail"), 1]); if (gap("detail") >= 4) hit("growth", 1, 4, "memoryMix"); }

  const wm = (xs: [number, number][]) => { const w = xs.reduce((s, [, k]) => s + k, 0); return w ? xs.reduce((s, [v, k]) => s + v * k, 0) / w : 50; };
  const games = A.games.filter((g) => B.games.includes(g)).length;
  const detail: PlayLensDetail = { shared, a: A.dims, b: B.dims, notes };
  return { rawH: wm(H), rawS: S.length ? wm(S) : 30, themes, confidence: Math.max(0.4, games / 5), detail: detail as unknown as Record<string, unknown> };
}
