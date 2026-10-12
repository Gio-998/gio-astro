/**
 * Deep Read: an adaptive personality test. Instead of a fixed list of 1-5 ratings, it serves real dilemmas
 * (forced choice, both options cost something) and picks the next question from what it still doesn't know:
 * the trait with the most uncertainty gets the next scene. Every few items a timed gut-reaction statement
 * (reaction time recorded) and a "twin" scene (same question, new framing) check how consistent the answers are.
 * Traits follow the Big Five (O C E A N). Deterministic: the same answers always give the same path and score.
 * Own items, research-inspired (forced-choice and computerized adaptive testing); not a clinical instrument.
 */
import { TRAITS, type Trait } from "./bigfive";

export type ATrait = Trait;
/** Option a is always the high pole of the trait (more open, planned, outgoing, accommodating, reactive). */
export interface Dilemma { id: string; kind: "dilemma"; trait: ATrait; twin?: string }
export interface Gut { id: string; kind: "gut"; trait: ATrait; keyed: 1 | -1 }
export type AItem = Dilemma | Gut;

const D = (id: string, trait: ATrait, twin?: string): Dilemma => ({ id, kind: "dilemma", trait, twin });
const G = (id: string, trait: ATrait, keyed: 1 | -1): Gut => ({ id, kind: "gut", trait, keyed });

/** 4 dilemmas per trait, plus one twin each (same question, new scene), plus 2 gut statements per trait. */
export const ADAPTIVE_ITEMS: AItem[] = [
  D("o1", "O"), D("o2", "O"), D("o3", "O"), D("o4", "O"), D("o1t", "O", "o1"),
  D("c1", "C"), D("c2", "C"), D("c3", "C"), D("c4", "C"), D("c1t", "C", "c1"),
  D("e1", "E"), D("e2", "E"), D("e3", "E"), D("e4", "E"), D("e1t", "E", "e1"),
  D("a1", "A"), D("a2", "A"), D("a3", "A"), D("a4", "A"), D("a1t", "A", "a1"),
  D("n1", "N"), D("n2", "N"), D("n3", "N"), D("n4", "N"), D("n1t", "N", "n1"),
  G("go1", "O", 1), G("go2", "O", -1), G("gc1", "C", 1), G("gc2", "C", -1), G("ge1", "E", 1), G("ge2", "E", -1),
  G("ga1", "A", 1), G("ga2", "A", -1), G("gn1", "N", 1), G("gn2", "N", -1),
];
export const ITEM_BY_ID: Record<string, AItem> = Object.fromEntries(ADAPTIVE_ITEMS.map((i) => [i.id, i]));
export const GUT_LIMIT_MS = 5000;
export const MIN_ITEMS = 12;
export const MAX_ITEMS = 16;

/**
 * One answer. Dilemma: v 1 = option a (high pole), 2 = option b (low pole).
 * Gut: v 1 = "that's me", 2 = "not me", 0 = ran out of time. ms = time from showing to answering.
 */
export interface AAnswer { id: string; v: 0 | 1 | 2; ms: number }

/** Weight of a gut answer by speed: instant answers are the clearest signal. */
export const gutWeight = (ms: number) => (ms <= 1500 ? 1 : ms <= 3000 ? 0.75 : 0.5);

export interface TraitState { sum: number; w: number; n: number }
export function traitStates(ans: AAnswer[]): Record<ATrait, TraitState> {
  const out = Object.fromEntries(TRAITS.map((t) => [t, { sum: 0, w: 0, n: 0 }])) as Record<ATrait, TraitState>;
  for (const a of ans) {
    const it = ITEM_BY_ID[a.id]; if (!it || a.v === 0) continue;
    const s = out[it.trait]; const x = a.v === 1 ? 1 : -1;
    if (it.kind === "dilemma") { s.sum += x; s.w += 1; }
    else { const w = gutWeight(a.ms); s.sum += x * it.keyed * w; s.w += w; }
    s.n++;
  }
  return out;
}
/** Shrunk estimate in -1..1 (a neutral prior worth one answer keeps a single answer from looking extreme). */
export const estimate = (s: TraitState) => s.sum / (s.w + 1);
/** How unsure we still are about a trait, 0..1. Few answers or mixed answers = unsure. */
export const uncertainty = (s: TraitState) => (1 - Math.abs(estimate(s)) * 0.6) / Math.sqrt(s.w + 1);

/** Twins whose original was answered at least 3 items ago and that haven't been asked yet. */
function readyTwins(ans: AAnswer[]): Dilemma[] {
  const asked = new Set(ans.map((a) => a.id));
  return ADAPTIVE_ITEMS.filter((i): i is Dilemma => i.kind === "dilemma" && !!i.twin && !asked.has(i.id))
    .filter((t) => { const k = ans.findIndex((a) => a.id === t.twin); return k >= 0 && ans.length - k >= 3; });
}

/** Should the test stop? At least MIN_ITEMS, then stop once every trait is clear enough (or at MAX_ITEMS). */
export function isDone(ans: AAnswer[]): boolean {
  if (ans.length >= MAX_ITEMS) return true;
  if (ans.length < MIN_ITEMS) return false;
  const st = traitStates(ans);
  return TRAITS.every((t) => uncertainty(st[t]) < 0.42) && ans.some((a) => ITEM_BY_ID[a.id]?.kind === "dilemma" && (ITEM_BY_ID[a.id] as Dilemma).twin);
}

/**
 * Pick the next item. Positions 3, 7, 11 and 15 (1-based 4th, 8th, ...) are gut reactions; positions 6 and 10
 * are consistency twins when one is ready. Otherwise: the most uncertain trait (never the same trait twice in
 * a row), and its first unasked dilemma.
 */
export function nextItem(ans: AAnswer[]): AItem | null {
  if (isDone(ans)) return null;
  const asked = new Set(ans.map((a) => a.id)); const k = ans.length;
  const last = k ? ITEM_BY_ID[ans[k - 1].id]?.trait : undefined;
  const st = traitStates(ans);
  const ranked = [...TRAITS].sort((a, b) => uncertainty(st[b]) - uncertainty(st[a]) || TRAITS.indexOf(a) - TRAITS.indexOf(b));
  const order = ranked.filter((t) => t !== last).concat(last ? [last] : []);
  if (k % 4 === 3) {
    for (const t of order) { const g = ADAPTIVE_ITEMS.find((i) => i.kind === "gut" && i.trait === t && !asked.has(i.id)); if (g) return g; }
  }
  if (k === 6 || k === 10 || k === 13) {
    const tw = readyTwins(ans).sort((a, b) => order.indexOf(a.trait) - order.indexOf(b.trait))[0];
    if (tw && tw.trait !== last) return tw;
  }
  for (const t of order) {
    const d = ADAPTIVE_ITEMS.find((i) => i.kind === "dilemma" && i.trait === t && !i.twin && !asked.has(i.id));
    if (d) return d;
  }
  for (const t of order) { const g = ADAPTIVE_ITEMS.find((i) => i.kind === "gut" && i.trait === t && !asked.has(i.id)); if (g) return g; }
  return readyTwins(ans)[0] ?? null;
}

export interface AdaptiveResult {
  v: 1;
  /** Percentile-like 1..99 per trait (50 = middle). */
  pct: Record<ATrait, number>;
  /** 0..1 per trait: how sure the test is. */
  conf: Record<ATrait, number>;
  /** 0..1: share of twin pairs answered the same way (1 when none were asked). */
  consistency: number;
  twins: number;
  /** Median gut reaction time in ms (0 when none). */
  gutMs: number;
  timeouts: number;
  /** Four-letter style from the traits: E/I, N/S (openness), F/T (agreeableness), J/P (conscientiousness). */
  code: string;
  items: number;
  flags: ("rushed" | "mixed")[];
}

const median = (xs: number[]) => { if (!xs.length) return 0; const s = [...xs].sort((a, b) => a - b); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

export function scoreAdaptive(ans: AAnswer[]): AdaptiveResult {
  const st = traitStates(ans);
  const byId = Object.fromEntries(ans.map((a) => [a.id, a]));
  const pairs = ADAPTIVE_ITEMS.filter((i): i is Dilemma => i.kind === "dilemma" && !!i.twin && !!byId[i.id] && !!byId[i.twin!]);
  const same = pairs.filter((t) => byId[t.id].v === byId[t.twin!].v).length;
  const consistency = pairs.length ? same / pairs.length : 1;
  const pct = {} as Record<ATrait, number>; const conf = {} as Record<ATrait, number>;
  for (const t of TRAITS) {
    pct[t] = Math.round(Math.min(99, Math.max(1, 50 + 49 * estimate(st[t]))));
    conf[t] = Math.round(Math.min(1, (1 - Math.exp(-st[t].w / 2.2)) * (0.6 + 0.4 * consistency)) * 100) / 100;
  }
  const guts = ans.filter((a) => ITEM_BY_ID[a.id]?.kind === "gut");
  const gutMs = Math.round(median(guts.filter((a) => a.v !== 0).map((a) => a.ms)));
  const dil = ans.filter((a) => ITEM_BY_ID[a.id]?.kind === "dilemma");
  const flags: AdaptiveResult["flags"] = [];
  if (dil.length >= 6 && median(dil.map((a) => a.ms)) < 1200) flags.push("rushed");
  if (pairs.length >= 2 && consistency < 0.5) flags.push("mixed");
  const code = (pct.E >= 50 ? "E" : "I") + (pct.O >= 50 ? "N" : "S") + (pct.A >= 50 ? "F" : "T") + (pct.C >= 50 ? "J" : "P");
  return { v: 1, pct, conf, consistency: Math.round(consistency * 100) / 100, twins: pairs.length, gutMs, timeouts: guts.filter((a) => a.v === 0).length, code, items: ans.length, flags };
}

/** Flatten answers for storage (quiz_results.answers): `<id>` = choice, `<id>_ms` = time, `_order` kept implicit by keys. */
export const flattenAnswers = (ans: AAnswer[]): Record<string, number> => Object.fromEntries(ans.flatMap((a, i) => [[a.id, a.v], [`${a.id}_ms`, a.ms], [`${a.id}_i`, i]]));
