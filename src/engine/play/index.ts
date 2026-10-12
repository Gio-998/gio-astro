/**
 * Play Mirror: behavioural mini-games for adults. Every game records raw behaviour (choices, timings, retries,
 * erratic taps) and a pure, deterministic function turns it into 0-10 dimension scores. Nothing here is random:
 * game events (which bridge breaks, how the partner behaves, what the group votes) follow fixed schedules, so the
 * same behaviour always gives the same score. Ideas adapted from the Oracle rubric (D2 risk, D6 resilience,
 * D3 trust, D4 empathy, D7 dominance, D10 memory type, D11 conformity, D12 processing speed), rewritten for adults.
 * These are behavioural signals from a few minutes of play, not a diagnosis.
 */

export const PLAY_GAMES = ["bridge", "faces", "trust", "memory", "lead", "wait", "focus"] as const;
export type PlayGameId = (typeof PLAY_GAMES)[number];
export const PLAY_DIMS = ["risk", "resilience", "read", "empathy", "trust", "fairness", "detail", "speed", "lead", "conform", "patience", "control"] as const;
export type PlayDim = (typeof PLAY_DIMS)[number];
export type PlayFlag = "erratic" | "quit" | "rushed";
export type PlayKey = `play_${PlayGameId}`;
export const playKey = (g: PlayGameId): PlayKey => `play_${g}`;

/** Which dimensions each game measures. */
export const GAME_DIMS: Record<PlayGameId, PlayDim[]> = {
  bridge: ["risk", "resilience"],
  faces: ["read", "empathy"],
  trust: ["trust", "fairness"],
  memory: ["detail", "speed"],
  lead: ["lead", "conform"],
  wait: ["patience"],
  focus: ["control"],
};

/** Stored per game (QuizResults key `play_<game>`, Supabase quiz_results.quiz_id `play_<game>`). */
export interface PlayGameResult {
  v: 1;
  game: PlayGameId;
  ms: number;
  scores: Partial<Record<PlayDim, number>>;
  /** Flat numeric summary of raw behaviour (also stored as the quiz "answers"). */
  raw: Record<string, number>;
  flags: PlayFlag[];
}
import type { AnswerTiming } from "./timing";
/** Everything Play Mirror adds to QuizResults (all optional). */
export interface PlayResults extends Partial<Record<PlayKey, PlayGameResult>> {
  /** Per-quiz answer timing (certainty signal), keyed by quiz id. */
  timing?: Record<string, AnswerTiming>;
}

const r1 = (x: number) => Math.round(x * 10) / 10;
export const clamp10 = (x: number) => r1(Math.min(10, Math.max(0, x)));
const mean = (xs: number[]) => (xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : 0);
export const median = (xs: number[]) => { if (!xs.length) return 0; const s = [...xs].sort((a, b) => a - b); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

/** More than 5 taps inside any 1-second window counts as one erratic burst. */
export function erraticBursts(tapTimes: number[]): number {
  const t = [...tapTimes].sort((a, b) => a - b); let bursts = 0; let i = 0;
  for (let j = 0; j < t.length; j++) {
    while (t[j] - t[i] > 1000) i++;
    if (j - i + 1 > 5) { bursts++; i = j + 1; }
  }
  return bursts;
}

// ——————————————————— 1. The Bridge (risk + resilience) ———————————————————
export type BridgeLevel = 0 | 1 | 2; // stone, rope, glass
export const BRIDGE_ROUNDS = 8;
export const BRIDGE_REWARD: Record<BridgeLevel, number> = { 0: 1, 1: 2, 2: 4 };
/**
 * Fixed break schedule. Glass breaks on its 2nd and 4th crossing, rope on its 3rd, stone never.
 * A wind gust knocks you off in round 3 if you haven't fallen yet, so everyone meets at least one fall.
 */
export function bridgeBreaks(prevLevels: BridgeLevel[], prevFalls: boolean[], level: BridgeLevel): boolean {
  const uses = prevLevels.filter((l) => l === level).length + 1;
  if (level === 2 && (uses === 2 || uses === 4)) return true;
  if (level === 1 && uses === 3) return true;
  return prevLevels.length === 2 && !prevFalls.some(Boolean);
}
export interface BridgeStep { level: BridgeLevel; ms: number; fell: boolean }
export interface BridgeRaw { steps: BridgeStep[]; quit: boolean; taps: number[]; ms: number }

export function scoreBridge(raw: BridgeRaw): PlayGameResult {
  const { steps } = raw;
  const risk = clamp10((mean(steps.map((s) => s.level)) / 2) * 10);
  const firstFall = steps.findIndex((s) => s.fell);
  const before = steps.slice(0, firstFall < 0 ? steps.length : firstFall + 1).map((s) => s.ms);
  const baseline = Math.max(400, median(before));
  let res = 6; let postN = 0; let backToRisk = 0; const postMs: number[] = [];
  steps.forEach((s, i) => {
    if (i === 0 || !steps[i - 1].fell) return;
    const prev = steps[i - 1].level; postN++; postMs.push(s.ms);
    if (s.level >= prev) { res += prev > 0 ? 1.2 : 0.4; if (prev > 0) backToRisk++; }
    else if (s.level === 0) res -= 1.2;
    else res -= 0.6;
    const ratio = s.ms / baseline;
    if (ratio <= 1.4) res += 0.6; else if (ratio >= 2.5) res -= 1.5; else if (ratio >= 1.8) res -= 0.7;
  });
  if (raw.quit) res -= 3.5;
  const bursts = erraticBursts(raw.taps);
  const flags: PlayFlag[] = [];
  if (bursts > 0) flags.push("erratic");
  if (raw.quit) flags.push("quit");
  if (steps.length >= 4 && median(steps.map((s) => s.ms)) < 350) flags.push("rushed");
  const falls = steps.filter((s) => s.fell).length;
  return {
    v: 1, game: "bridge", ms: raw.ms, scores: { risk, resilience: clamp10(res) }, flags,
    raw: { crossings: steps.length, glass: steps.filter((s) => s.level === 2).length, rope: steps.filter((s) => s.level === 1).length, stone: steps.filter((s) => s.level === 0).length, falls, afterFall: postN, backToRisk, quit: raw.quit ? 1 : 0, baselineMs: Math.round(baseline), afterFallMs: Math.round(median(postMs)), bursts, stars: steps.reduce((t, s) => t + (s.fell ? 0 : BRIDGE_REWARD[s.level]), 0) },
  };
}

// ——————————————————— 2. Feeling Room (emotion reading + empathy) ———————————————————
export const EMOTIONS = ["joy", "sadness", "anger", "fear", "surprise", "disgust", "contempt", "calm"] as const;
export type Emotion = (typeof EMOTIONS)[number];
/** Fixed sequence: target emotion, intensity (subtle micro-expressions count more), and the 4 options shown. */
export const FACE_TRIALS: { e: Emotion; subtle: boolean; options: Emotion[] }[] = [
  { e: "joy", subtle: false, options: ["joy", "surprise", "calm", "contempt"] },
  { e: "sadness", subtle: false, options: ["fear", "sadness", "calm", "disgust"] },
  { e: "anger", subtle: true, options: ["disgust", "contempt", "anger", "sadness"] },
  { e: "surprise", subtle: false, options: ["fear", "joy", "surprise", "anger"] },
  { e: "contempt", subtle: true, options: ["joy", "contempt", "calm", "disgust"] },
  { e: "fear", subtle: true, options: ["surprise", "sadness", "anger", "fear"] },
  { e: "disgust", subtle: false, options: ["anger", "disgust", "contempt", "fear"] },
  { e: "sadness", subtle: true, options: ["calm", "contempt", "fear", "sadness"] },
];
/** Responses in the three "a friend is struggling" scenes, from most to least attuned. */
export const CARE_MOVES = ["name", "stay", "fix", "distract", "leave"] as const;
export type CareMove = (typeof CARE_MOVES)[number];
export const CARE_VALUE: Record<CareMove, number> = { name: 3, stay: 2.5, fix: 1.5, distract: 1, leave: 0.5 };
export const FACE_SCENES: CareMove[][] = [
  ["fix", "name", "distract", "leave"],
  ["stay", "fix", "leave", "distract"],
  ["distract", "leave", "name", "fix"],
];
export interface FacesRaw { picks: { chosen: Emotion | null; ms: number }[]; scenes: { move: CareMove; ms: number }[]; taps: number[]; ms: number }

export function scoreFaces(raw: FacesRaw): PlayGameResult {
  let got = 0, max = 0, subtleHit = 0, clearHit = 0;
  raw.picks.forEach((p, i) => {
    const t = FACE_TRIALS[i]; if (!t) return;
    const w = t.subtle ? 1.5 : 1; max += w;
    if (p.chosen === t.e) { got += w; if (t.subtle) subtleHit++; else clearHit++; }
  });
  const read = clamp10(max ? (got / max) * 10 : 0);
  const care = raw.scenes.length ? mean(raw.scenes.map((s) => CARE_VALUE[s.move])) / 3 : 0.5;
  const empathy = clamp10(0.6 * care * 10 + 0.4 * read);
  const flags: PlayFlag[] = [];
  if (erraticBursts(raw.taps) > 0) flags.push("erratic");
  const ms = raw.picks.map((p) => p.ms);
  if (ms.length >= 4 && median(ms) < 450) flags.push("rushed");
  return {
    v: 1, game: "faces", ms: raw.ms, scores: { read, empathy }, flags,
    raw: { correct: subtleHit + clearHit, subtleCorrect: subtleHit, clearCorrect: clearHit, trials: raw.picks.length, medianMs: Math.round(median(ms)), named: raw.scenes.filter((s) => s.move === "name").length, stayed: raw.scenes.filter((s) => s.move === "stay").length, fixed: raw.scenes.filter((s) => s.move === "fix").length, distracted: raw.scenes.filter((s) => s.move === "distract").length, left: raw.scenes.filter((s) => s.move === "leave").length },
  };
}

// ——————————————————— 3. Split (trust + fairness) ———————————————————
/** Rounds in order. "send": you send 0-10 coins, they triple, Moss returns a fixed share. "back": Moss sent you
 *  4 coins (now 12); you choose how many to send back. "split": you found 10 coins; share any amount. */
export type TrustRound = { kind: "send"; back: number } | { kind: "back"; pot: number } | { kind: "split"; pot: number };
export const TRUST_ROUNDS: TrustRound[] = [
  { kind: "send", back: 0.5 },
  { kind: "send", back: 0.5 },
  { kind: "back", pot: 12 },
  { kind: "send", back: 0.6 },
  { kind: "send", back: 0 }, // Moss keeps everything once
  { kind: "send", back: 0.5 },
  { kind: "split", pot: 10 },
  { kind: "send", back: 0.5 },
];
export const BETRAYAL_ROUND = 4;
export interface TrustRaw { amounts: { v: number; ms: number }[]; taps: number[]; ms: number }

export function scoreTrust(raw: TrustRaw): PlayGameResult {
  const a = raw.amounts;
  const sendsBefore: number[] = [], sendsAfter: number[] = [], backShares: number[] = []; let split = 5;
  TRUST_ROUNDS.forEach((r, i) => {
    const v = a[i]?.v; if (v == null) return;
    if (r.kind === "send") (i < BETRAYAL_ROUND ? sendsBefore : i > BETRAYAL_ROUND ? sendsAfter : sendsBefore).push(v);
    else if (r.kind === "back") backShares.push(v / r.pot);
    else split = v;
  });
  const base = mean(sendsBefore) / 10;
  const after = sendsAfter.length ? mean(sendsAfter) / 10 : base;
  const trust = clamp10(10 * (0.6 * base + 0.4 * after));
  const backFair = backShares.length ? Math.min(1, mean(backShares) / 0.5) : 0.5;
  const fairness = clamp10(10 * (0.65 * backFair + 0.35 * Math.min(1, split / 5)));
  const flags: PlayFlag[] = [];
  if (erraticBursts(raw.taps) > 0) flags.push("erratic");
  if (a.length >= 4 && median(a.map((x) => x.ms)) < 500) flags.push("rushed");
  return {
    v: 1, game: "trust", ms: raw.ms, scores: { trust, fairness }, flags,
    raw: { sentBefore: r1(mean(sendsBefore)), sentAfter: r1(mean(sendsAfter)), betrayalSend: a[BETRAYAL_ROUND]?.v ?? 0, backShare: Math.round(mean(backShares) * 100), split, recovery: base > 0 ? Math.round((after / base) * 100) : 100 },
  };
}
/** Coins Moss returns in a send round (rounded down, deterministic). */
export const mossReturn = (sent: number, share: number) => Math.floor(sent * 3 * share);

// ——————————————————— 4. Flash Memory (pattern vs detail + speed) ———————————————————
export interface MemoryRaw { trials: { kind: "pattern" | "detail"; correct: boolean; ms: number }[]; taps: number[]; ms: number }
export const MEMORY_SPEED = { fast: 900, slow: 3800 };

export function scoreMemory(raw: MemoryRaw): PlayGameResult {
  const acc = (k: "pattern" | "detail") => { const t = raw.trials.filter((x) => x.kind === k); return t.length ? t.filter((x) => x.correct).length / t.length : 0; };
  const pa = acc("pattern"), da = acc("detail");
  const detail = clamp10(5 + (da - pa) * 10);
  const all = raw.trials.length ? raw.trials.filter((x) => x.correct).length / raw.trials.length : 0;
  const med = median(raw.trials.map((x) => x.ms));
  const rawSpeed = 10 * (MEMORY_SPEED.slow - med) / (MEMORY_SPEED.slow - MEMORY_SPEED.fast);
  const speed = clamp10(Math.min(10, Math.max(0, rawSpeed)) * (0.5 + 0.5 * all));
  const flags: PlayFlag[] = [];
  if (erraticBursts(raw.taps) > 0) flags.push("erratic");
  if (raw.trials.length >= 4 && med < 400) flags.push("rushed");
  return {
    v: 1, game: "memory", ms: raw.ms, scores: { detail, speed }, flags,
    raw: { patternPct: Math.round(pa * 100), detailPct: Math.round(da * 100), accuracyPct: Math.round(all * 100), medianMs: Math.round(med) },
  };
}

// ——————————————————— 5. Lead or Follow (dominance + conformity) ———————————————————
/** "taste": no right answer, friends' votes arrive slowly. "line": which line matches? The group picks a wrong one,
 *  fast and unanimous (Asch-style). "stuck": the group can't decide; you can step up. */
export type LeadRound = { kind: "taste"; group: number[]; at: number[] } | { kind: "line"; correct: number; group: number; at: number[] } | { kind: "stuck"; volunteerAt: number };
export const LEAD_ROUNDS: LeadRound[] = [
  { kind: "taste", group: [1, 1, 0], at: [1700, 2700, 3700] },
  { kind: "line", correct: 2, group: 0, at: [700, 1250, 1800] },
  { kind: "taste", group: [2, 0, 2], at: [1500, 2600, 3500] },
  { kind: "stuck", volunteerAt: 3200 },
  { kind: "line", correct: 0, group: 1, at: [700, 1250, 1800] },
  { kind: "taste", group: [0, 0, 1], at: [1600, 2500, 3600] },
  { kind: "line", correct: 1, group: 2, at: [700, 1250, 1800] },
];
export interface LeadRaw { picks: { choice: number; ms: number; seen: number }[]; taps: number[]; ms: number }
const majority = (g: number[]) => { const c = new Map<number, number>(); g.forEach((x) => c.set(x, (c.get(x) ?? 0) + 1)); return [...c.entries()].sort((a, b) => b[1] - a[1])[0][0]; };

export function scoreLead(raw: LeadRaw): PlayGameResult {
  let tasteN = 0, first = 0, seenSum = 0, tasteMatch = 0, tasteMatchN = 0, lineN = 0, lineConform = 0, lineCorrect = 0, stuckTook = 0, stuckFast = 0;
  LEAD_ROUNDS.forEach((r, i) => {
    const p = raw.picks[i]; if (!p) return;
    if (r.kind === "taste") {
      tasteN++; seenSum += p.seen; if (p.seen === 0) first++;
      if (p.seen >= 2) { tasteMatchN++; if (p.choice === majority(r.group.slice(0, p.seen))) tasteMatch++; }
    } else if (r.kind === "line") {
      if (p.choice === r.correct) lineCorrect++;
      if (p.seen >= 2) { lineN++; if (p.choice === r.group) lineConform++; }
    } else {
      // choice 1 = "I'll decide"; seen 1 = someone else volunteered first
      if (p.choice === 1 && p.seen === 0) { stuckTook = 1; if (p.ms < 2500) stuckFast = 1; }
    }
  });
  const firstRate = tasteN ? first / tasteN : 0;
  const quiet = tasteN ? 1 - seenSum / (3 * tasteN) : 0.5;
  const step = stuckTook ? (stuckFast ? 1 : 0.7) : 0;
  const lead = clamp10(10 * (0.45 * firstRate + 0.2 * quiet + 0.35 * step));
  const lineRate = lineN ? lineConform / lineN : 0.15; // never waited for the group: treat as independent
  const tasteRate = tasteMatchN ? tasteMatch / tasteMatchN : 0.4;
  const conform = clamp10(10 * (0.75 * lineRate + 0.25 * tasteRate));
  const flags: PlayFlag[] = [];
  if (erraticBursts(raw.taps) > 0) flags.push("erratic");
  if (raw.picks.length >= 4 && median(raw.picks.map((x) => x.ms)) < 300) flags.push("rushed");
  return {
    v: 1, game: "lead", ms: raw.ms, scores: { lead, conform }, flags,
    raw: { votedFirst: first, tasteRounds: tasteN, lineMeasured: lineN, lineWentWithGroup: lineConform, lineCorrect, steppedUp: stuckTook, steppedUpFast: stuckFast },
  };
}

// ——————————————————— 6. The Lantern (patience / delay of reward) ———————————————————
/** Each round: take the small prize now, or wait for the big one. You can give up mid-wait and take the small one. */
export const WAIT_ROUNDS: { now: number; later: number; secs: number }[] = [
  { now: 2, later: 5, secs: 4 }, { now: 2, later: 6, secs: 6 }, { now: 3, later: 6, secs: 8 },
  { now: 2, later: 7, secs: 10 }, { now: 3, later: 5, secs: 5 }, { now: 2, later: 8, secs: 12 },
];
export interface WaitRaw { rounds: { choice: "now" | "wait"; waitedMs: number; gaveUp: boolean; ms: number }[]; taps: number[]; ms: number }
export function scoreWait(raw: WaitRaw): PlayGameResult {
  const per = raw.rounds.map((r, i) => {
    if (r.choice === "now") return 0;
    if (!r.gaveUp) return 1;
    return 0.6 * Math.min(1, r.waitedMs / (WAIT_ROUNDS[i].secs * 1000));
  });
  // Longer waits count a little more: holding out for 12 seconds says more than holding out for 4.
  const w = WAIT_ROUNDS.slice(0, per.length).map((r) => r.secs);
  const tot = w.reduce((a, b) => a + b, 0) || 1;
  const patience = clamp10((10 * per.reduce((s, x, i) => s + x * w[i], 0)) / tot);
  const bursts = erraticBursts(raw.taps); const flags: PlayFlag[] = [];
  if (bursts > 0) flags.push("erratic");
  const waits = raw.rounds.filter((r) => r.choice === "wait").length;
  return {
    v: 1, game: "wait", ms: raw.ms, scores: { patience }, flags,
    raw: { waits, tookNow: raw.rounds.length - waits, gaveUp: raw.rounds.filter((r) => r.gaveUp).length, decideMs: Math.round(median(raw.rounds.map((r) => r.ms))), stars: raw.rounds.reduce((s, r, i) => s + (r.choice === "wait" && !r.gaveUp ? WAIT_ROUNDS[i].later : WAIT_ROUNDS[i].now), 0), bursts },
  };
}

// ——————————————————— 7. Star Catch (focus / impulse control, go/no-go) ———————————————————
/** Fixed sequence: 1 = gold star (tap it), 0 = red moon (hold back). 24 flashes, 7 moons, never two moons in a row at the start. */
export const FOCUS_SEQ = [1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0];
export const FOCUS_SHOW_MS = 800;
export interface FocusRaw { trials: { go: boolean; tapped: boolean; rt: number | null }[]; taps: number[]; ms: number }
export function scoreFocus(raw: FocusRaw): PlayGameResult {
  const go = raw.trials.filter((t) => t.go), nogo = raw.trials.filter((t) => !t.go);
  const commissions = nogo.filter((t) => t.tapped).length, omissions = go.filter((t) => !t.tapped).length;
  const cr = nogo.length ? commissions / nogo.length : 0, or = go.length ? omissions / go.length : 0;
  const control = clamp10(10 * (1 - 0.85 * cr - 0.45 * or));
  const rts = go.filter((t) => t.tapped && t.rt != null).map((t) => t.rt!);
  const flags: PlayFlag[] = []; if (erraticBursts(raw.taps) > 0) flags.push("erratic");
  return {
    v: 1, game: "focus", ms: raw.ms, scores: { control }, flags,
    raw: { caught: go.length - omissions, missed: omissions, moonsTapped: commissions, moons: nogo.length, medianRt: Math.round(median(rts)) },
  };
}

// ——————————————————— Aggregate profile ———————————————————
export interface PlayProfile { dims: Partial<Record<PlayDim, number>>; games: PlayGameId[]; flags: PlayFlag[]; complete: boolean }
export function playProfile(q: PlayResults | undefined | null): PlayProfile | null {
  if (!q) return null;
  const games = PLAY_GAMES.filter((g) => q[playKey(g)]?.scores);
  if (!games.length) return null;
  const dims: Partial<Record<PlayDim, number>> = {}; const flags = new Set<PlayFlag>();
  for (const g of games) { const r = q[playKey(g)]!; Object.assign(dims, r.scores); r.flags?.forEach((f) => flags.add(f)); }
  return { dims, games, flags: [...flags], complete: games.length === PLAY_GAMES.length };
}

// ——————————————————— Say vs play ———————————————————
/** What questionnaires imply for each dimension (0-10), from Big Five (0-100) and attachment where available. */
export interface SelfReport { bigFive?: { O: number; C: number; E: number; A: number; N: number }; attachment?: { anxiety: number; avoidance: number } }
export function saidDims(q: SelfReport): Partial<Record<PlayDim, number>> {
  const out: Partial<Record<PlayDim, number>> = {}; const b = q.bigFive;
  if (b) {
    out.risk = r1((0.55 * b.O + 0.45 * (100 - b.C)) / 10);
    out.resilience = r1((100 - b.N) / 10);
    out.empathy = r1(b.A / 10);
    out.lead = r1(b.E / 10);
    out.conform = r1((0.5 * (100 - b.O) + 0.5 * b.C) / 10);
    out.fairness = r1(b.A / 10);
  }
  if (q.attachment) out.trust = r1((100 - q.attachment.avoidance) / 10);
  else if (b) out.trust = r1(b.A / 10);
  return out;
}
export interface SayPlayGap { dim: PlayDim; said: number; played: number; gap: number }
/** Dimensions where play and self-report differ by 2.5+ points, biggest first. */
export function sayVsPlay(play: PlayProfile, q: SelfReport): { gaps: SayPlayGap[]; matches: PlayDim[] } {
  const said = saidDims(q); const gaps: SayPlayGap[] = []; const matches: PlayDim[] = [];
  for (const d of PLAY_DIMS) {
    const p = play.dims[d], s = said[d]; if (p == null || s == null) continue;
    const gap = r1(p - s);
    if (Math.abs(gap) >= 2.5) gaps.push({ dim: d, said: s, played: p, gap }); else matches.push(d);
  }
  return { gaps: gaps.sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap)), matches };
}

export type Level = "low" | "mid" | "high";
export const levelOf10 = (x: number): Level => (x >= 6.5 ? "high" : x <= 3.5 ? "low" : "mid");
