import { describe, it, expect } from "vitest";
import {
  bridgeBreaks, scoreBridge, scoreFaces, scoreTrust, scoreMemory, scoreLead, erraticBursts, playProfile, sayVsPlay, saidDims,
  FACE_TRIALS, FACE_SCENES, TRUST_ROUNDS, LEAD_ROUNDS, PLAY_DIMS, PLAY_GAMES, GAME_DIMS, type BridgeLevel, type BridgeStep, type PlayResults, type PlayGameResult,
} from "../src/engine/play";
import { playLens } from "../src/engine/play/compat";
import { buildProfile } from "../src/engine/profile";
import { comparePair } from "../src/engine/compat";
import { buildBook } from "../src/story/book";
import { getContent } from "../src/content";
import { play as en } from "../src/content/en/play";
import { play as mk } from "../src/content/mk/play";

/** Play the bridge with a fixed strategy, applying the real break schedule. */
function playBridge(choose: (round: number, lastFell: boolean, prev: BridgeLevel | null) => BridgeLevel, ms: (r: number, lastFell: boolean) => number = (_r, lastFell) => (lastFell ? 900 : 800)) {
  const steps: BridgeStep[] = [];
  for (let r = 0; r < 8; r++) {
    const last = steps[steps.length - 1];
    const level = choose(r, !!last?.fell, last?.level ?? null);
    const fell = bridgeBreaks(steps.map((s) => s.level), steps.map((s) => s.fell), level);
    steps.push({ level, ms: ms(r, !!last?.fell), fell });
  }
  return steps;
}

describe("Play Mirror: The Bridge", () => {
  it("break schedule is fixed: glass breaks on its 2nd and 4th crossing, a gust in round 3 if nobody fell", () => {
    expect(bridgeBreaks([], [], 2)).toBe(false);
    expect(bridgeBreaks([2], [false], 2)).toBe(true);
    expect(bridgeBreaks([0, 0], [false, false], 0)).toBe(true); // gust
    expect(bridgeBreaks([2, 2], [false, true], 0)).toBe(false);
    expect(bridgeBreaks([1, 1], [false, false], 1)).toBe(true); // rope 3rd use
  });
  it("everyone meets at least one fall", () => {
    for (const lv of [0, 1, 2] as BridgeLevel[]) expect(playBridge(() => lv).some((s) => s.fell)).toBe(true);
  });
  it("bold + quick return after a fall scores high risk and resilience; careful + slow scores low", () => {
    const bold = scoreBridge({ steps: playBridge(() => 2), quit: false, taps: [], ms: 60000 });
    const careful = scoreBridge({ steps: playBridge((r, fell) => (fell ? 0 : r < 2 ? 1 : 0), (r, fell) => (fell ? 4000 : 900)), quit: false, taps: [], ms: 60000 });
    expect(bold.scores.risk).toBe(10);
    expect(bold.scores.resilience!).toBeGreaterThanOrEqual(8);
    expect(careful.scores.risk!).toBeLessThan(2);
    expect(careful.scores.resilience!).toBeLessThan(5);
  });
  it("quitting after a fall lowers bounce-back and is flagged", () => {
    const steps = playBridge(() => 2).slice(0, 2);
    const r = scoreBridge({ steps, quit: true, taps: [], ms: 9000 });
    expect(r.flags).toContain("quit");
    expect(r.scores.resilience!).toBeLessThan(4);
  });
  it("is deterministic", () => {
    const s = playBridge((r) => (r % 3) as BridgeLevel);
    expect(scoreBridge({ steps: s, quit: false, taps: [], ms: 1 })).toEqual(scoreBridge({ steps: s, quit: false, taps: [], ms: 1 }));
  });
});

describe("Play Mirror: erratic taps", () => {
  it("counts more than 5 taps inside one second as a burst", () => {
    expect(erraticBursts([0, 100, 200, 300, 400])).toBe(0);
    expect(erraticBursts([0, 100, 200, 300, 400, 500])).toBe(1);
    expect(erraticBursts([0, 100, 200, 300, 400, 500, 3000, 3100, 3150, 3200, 3300, 3400])).toBe(2);
    expect(erraticBursts([0, 400, 800, 1200, 1600, 2000, 2400])).toBe(0);
  });
});

describe("Play Mirror: Feeling Room", () => {
  it("perfect reading + naming feelings = high read and empathy", () => {
    const r = scoreFaces({ picks: FACE_TRIALS.map((t) => ({ chosen: t.e, ms: 1500 })), scenes: FACE_SCENES.map((ms) => ({ move: ms.includes("name") ? "name" : "stay", ms: 3000 })), taps: [], ms: 1 });
    expect(r.scores.read).toBe(10);
    expect(r.scores.empathy!).toBeGreaterThanOrEqual(9);
  });
  it("wrong picks + leaving = low", () => {
    const r = scoreFaces({ picks: FACE_TRIALS.map((t) => ({ chosen: t.options.find((o) => o !== t.e)!, ms: 1500 })), scenes: FACE_SCENES.map((ms) => ({ move: ms.includes("leave") ? "leave" : ms[0], ms: 3000 })), taps: [], ms: 1 });
    expect(r.scores.read).toBe(0);
    expect(r.scores.empathy!).toBeLessThan(2);
  });
  it("every trial offers its own emotion and every scene has text for its moves", () => {
    for (const t of FACE_TRIALS) expect(t.options).toContain(t.e);
    for (const C of [en, mk]) FACE_SCENES.forEach((moves, k) => moves.forEach((m) => expect(C.scenes[k].moves[m].length).toBeGreaterThan(5)));
  });
});

describe("Play Mirror: Split (trust game)", () => {
  const sendAll = TRUST_ROUNDS.map((r) => ({ v: r.kind === "send" ? 10 : r.kind === "back" ? 6 : 5, ms: 1200 }));
  const sendNone = TRUST_ROUNDS.map(() => ({ v: 0, ms: 1200 }));
  it("generous truster + fair sharer scores high", () => {
    const r = scoreTrust({ amounts: sendAll, taps: [], ms: 1 });
    expect(r.scores.trust).toBe(10); expect(r.scores.fairness).toBe(10);
  });
  it("keeping everything scores low", () => {
    const r = scoreTrust({ amounts: sendNone, taps: [], ms: 1 });
    expect(r.scores.trust).toBe(0); expect(r.scores.fairness).toBe(0);
  });
  it("pulling back after the betrayal round lowers trust", () => {
    const after = TRUST_ROUNDS.map((r, i) => ({ v: r.kind === "send" ? (i > 4 ? 2 : 10) : 6, ms: 1200 }));
    expect(scoreTrust({ amounts: after, taps: [], ms: 1 }).scores.trust!).toBeLessThan(8);
  });
});

describe("Play Mirror: Flash memory", () => {
  const trials = (p: boolean, d: boolean, ms: number) => Array.from({ length: 10 }, (_, i) => ({ kind: (i % 2 ? "detail" : "pattern") as "pattern" | "detail", correct: i % 2 ? d : p, ms }));
  it("detail-only accuracy leans detail, pattern-only leans big picture", () => {
    expect(scoreMemory({ trials: trials(false, true, 1500), taps: [], ms: 1 }).scores.detail).toBe(10);
    expect(scoreMemory({ trials: trials(true, false, 1500), taps: [], ms: 1 }).scores.detail).toBe(0);
    expect(scoreMemory({ trials: trials(true, true, 1500), taps: [], ms: 1 }).scores.detail).toBe(5);
  });
  it("fast and accurate = quick tempo; fast guessing is discounted", () => {
    const fast = scoreMemory({ trials: trials(true, true, 900), taps: [], ms: 1 }).scores.speed!;
    const guess = scoreMemory({ trials: trials(false, false, 900), taps: [], ms: 1 }).scores.speed!;
    const slow = scoreMemory({ trials: trials(true, true, 3800), taps: [], ms: 1 }).scores.speed!;
    expect(fast).toBe(10); expect(guess).toBe(5); expect(slow).toBe(0);
  });
});

describe("Play Mirror: The Group", () => {
  it("voting first + stepping up = high lead, independent", () => {
    const picks = LEAD_ROUNDS.map((r) => (r.kind === "line" ? { choice: r.correct, ms: 500, seen: 0 } : r.kind === "stuck" ? { choice: 1, ms: 900, seen: 0 } : { choice: 0, ms: 600, seen: 0 }));
    const s = scoreLead({ picks, taps: [], ms: 1 }).scores;
    expect(s.lead).toBe(10); expect(s.conform!).toBeLessThan(3);
  });
  it("waiting for everyone and going with the wrong group answer = follower, high conformity", () => {
    const picks = LEAD_ROUNDS.map((r) => (r.kind === "line" ? { choice: r.group, ms: 2500, seen: 3 } : r.kind === "stuck" ? { choice: 0, ms: 4000, seen: 1 } : { choice: r.group[0], ms: 4000, seen: 3 }));
    const s = scoreLead({ picks, taps: [], ms: 1 }).scores;
    expect(s.lead).toBe(0); expect(s.conform).toBe(10);
  });
});

const fake = (scores: Record<string, number>): PlayResults => {
  const out: PlayResults = {};
  for (const g of PLAY_GAMES) { const sc = Object.fromEntries(GAME_DIMS[g].map((d) => [d, scores[d] ?? 5])); out[`play_${g}`] = { v: 1, game: g, ms: 1, scores: sc, raw: {}, flags: [] } as PlayGameResult; }
  return out;
};

describe("Play Mirror: profile, say vs play, compatibility, book", () => {
  it("aggregates all games into ten dimensions", () => {
    const p = playProfile(fake({ risk: 9 }))!;
    expect(p.complete).toBe(true); expect(Object.keys(p.dims).sort()).toEqual([...PLAY_DIMS].sort()); expect(p.dims.risk).toBe(9);
  });
  it("finds 'you say careful, you play bold'", () => {
    const p = playProfile(fake({ risk: 9.5 }))!;
    const self = { bigFive: { O: 20, C: 90, E: 50, A: 50, N: 50 } };
    expect(saidDims(self).risk!).toBeLessThan(2);
    const { gaps } = sayVsPlay(p, self);
    expect(gaps[0].dim).toBe("risk"); expect(gaps[0].gap).toBeGreaterThan(0);
  });
  it("play lens: similar trusting pair beats a mismatched pair on harmony", () => {
    const a = playProfile(fake({ trust: 9, fairness: 9, empathy: 9, risk: 5, lead: 7 }))!;
    const b = playProfile(fake({ trust: 8.5, fairness: 9, empathy: 8, risk: 5.5, lead: 3 }))!;
    const c = playProfile(fake({ trust: 1, fairness: 1, empathy: 2, risk: 10, lead: 9 }))!;
    expect(playLens(a, b)!.rawH).toBeGreaterThan(playLens(a, c)!.rawH);
    expect(playLens(a, c)!.rawS).toBeGreaterThan(playLens(a, b)!.rawS);
    expect(playLens(a, null)).toBeNull();
  });
  it("shows up in comparePair only when both played", () => {
    const base = { date: "1994-05-12", time: "08:30", place: { name: "Skopje", lat: 42, lon: 21.43, tz: "Europe/Skopje" } };
    const A = buildProfile({ ...base, quiz: fake({ trust: 8 }) }), B = buildProfile({ ...base, date: "1992-11-02", quiz: fake({ trust: 6 }) });
    const r = comparePair(A, B, "romantic"); const l = r.lenses.find((x) => x.id === "play")!;
    expect(l).toBeTruthy(); expect(l.harmony).toBeGreaterThanOrEqual(45); expect(l.harmony).toBeLessThanOrEqual(100);
    const r2 = comparePair(buildProfile(base), B, "romantic");
    expect(r2.missing).toContain("play");
  });
  it("adds a 'How you play' chapter to the Book of You (en + mk)", () => {
    const p = buildProfile({ date: "1994-05-12", time: "08:30", place: { name: "Skopje", lat: 42, lon: 21.43, tz: "Europe/Skopje" }, quiz: fake({ risk: 9 }) });
    const e = buildBook(p, getContent("en"), "A").chapters.find((c) => c.id === "play")!;
    const m = buildBook(p, getContent("mk"), "A").chapters.find((c) => c.id === "play")!;
    expect(e.title).toBe(en.book.title); expect(m.title).toBe(mk.book.title);
    expect(m.blocks.length).toBeGreaterThan(5);
    expect(buildBook(buildProfile({ date: "1994-05-12", time: null, place: null }), getContent("en"), "A").chapters.some((c) => c.id === "play")).toBe(false);
  });
  it("Macedonian copy covers every dimension and game", () => {
    for (const d of PLAY_DIMS) for (const lv of ["low", "mid", "high"] as const) expect(mk.dims[d].text[lv]).toMatch(/\p{Script=Cyrillic}/u);
    for (const g of PLAY_GAMES) expect(mk.games[g].intro).toMatch(/\p{Script=Cyrillic}/u);
  });
});
