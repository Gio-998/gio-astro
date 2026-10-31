import { describe, it, expect, vi, beforeEach } from "vitest";
import { getContent } from "@/content";
import { ALL_QUIZ_IDS, quizDefs } from "@/lib/quiz-defs";
import { MAX_ITEMS, nextItem, scoreAdaptive, type AAnswer } from "@/engine/adaptive";
import { PLAY_GAMES, playKey } from "@/engine/play";
import { QUIZ_KEYS } from "@/lib/sync-map";
import { localRepo, onLocalChange, progressKey, repo, type Change, type StoredPerson } from "@/lib/store";
import { RESULT_KEY, TEST_RUN, cleanSeq, cleanValues, nextTest, resumeIndex, runFraction, runStatus, testPath, testState, type TestId } from "@/lib/test-run";

const mem = new Map<string, string>();
vi.stubGlobal("localStorage", { getItem: (k: string) => mem.get(k) ?? null, setItem: (k: string, v: string) => void mem.set(k, v), removeItem: (k: string) => void mem.delete(k) });
const reloaded = async () => { vi.resetModules(); return import("@/lib/store"); };

const defs = quizDefs(getContent("en"));
const items = defs["big-five"].items;
const someAnswers = (n: number) => Object.fromEntries(items.slice(0, n).map((q) => [q.id, 3]));
const me: StoredPerson = { id: "me", name: "Ana", date: "1995-10-12", time: null, place: null, quiz: {}, createdAt: "2026-10-01T00:00:00Z" };
const saved = () => repo.getState().progress[progressKey("me", "big-five")];

beforeEach(() => { localRepo.deleteAll(); mem.clear(); });

describe("saving progress", () => {
  it("keeps answers, timing and a time stamp after every answer, through a reload", async () => {
    const timing = { [items[0].id]: { ms: 1200, words: 5, changes: 0 } };
    repo.saveProgress({ personId: "me", testId: "big-five", values: someAnswers(1), timing });
    repo.saveProgress({ personId: "me", testId: "big-five", values: someAnswers(2), timing });
    const p = (await reloaded()).repo.getState().progress[progressKey("me", "big-five")];
    expect(p.values).toEqual(someAnswers(2)); expect(p.timing).toEqual(timing); expect(p.at).toBeTruthy();
  });
  it("works for a guest, with no profile", () => {
    repo.saveProgress({ personId: "me", testId: "big-five", values: someAnswers(3) });
    expect(repo.getState().me).toBeNull(); expect(saved().values).toEqual(someAnswers(3));
  });
  it("survives a profile being created in the middle of a test", () => {
    repo.saveProgress({ personId: "me", testId: "big-five", values: someAnswers(3) });
    repo.saveMe(me);
    expect(saved().values).toEqual(someAnswers(3));
  });
  it("stays on this device: no sync change is sent", () => {
    const seen: Change[] = []; const off = onLocalChange((c) => seen.push(c));
    repo.saveProgress({ personId: "me", testId: "big-five", values: someAnswers(1) });
    repo.clearProgress("me", "big-five"); off();
    expect(seen).toEqual([]);
  });
  it("is dropped in the same write that saves the result", () => {
    repo.saveProgress({ personId: "me", testId: "big-five", values: someAnswers(3) });
    repo.saveProgress({ personId: "me", testId: "care", values: { p0: 1 } });
    const all = Object.fromEntries(items.map((q) => [q.id, 3]));
    repo.saveQuiz("me", defs["big-five"].score(all), { quizId: "big-five", values: all });
    expect(saved()).toBeUndefined();
    expect(repo.getState().progress[progressKey("me", "care")]).toBeTruthy();
    expect(JSON.parse(mem.get("mirrorstar:v1")!).progress).toEqual(repo.getState().progress);
  });
  it("can be cleared to start over", () => {
    repo.saveProgress({ personId: "me", testId: "big-five", values: someAnswers(3) });
    repo.clearProgress("me", "big-five");
    expect(saved()).toBeUndefined();
  });
  it("keeps one person's test apart from another's, and goes when the person goes", () => {
    repo.savePerson({ ...me, id: "p1", name: "Mila" });
    repo.saveProgress({ personId: "p1", testId: "big-five", values: someAnswers(1) });
    repo.saveProgress({ personId: "me", testId: "big-five", values: someAnswers(5) });
    expect(repo.getState().progress[progressKey("p1", "big-five")].values).toEqual(someAnswers(1));
    repo.deletePerson("p1");
    expect(repo.getState().progress[progressKey("p1", "big-five")]).toBeUndefined();
    expect(saved().values).toEqual(someAnswers(5));
  });
});

describe("resuming", () => {
  it("opens at the first unanswered question", () => {
    expect(resumeIndex(items, {})).toBe(0);
    expect(resumeIndex(items, someAnswers(7))).toBe(7);
  });
  it("finds a gap left by going back", () => {
    const v = someAnswers(7); delete v[items[3].id];
    expect(resumeIndex(items, v)).toBe(3);
  });
  it("stays on the last question if everything is somehow answered", () => {
    expect(resumeIndex(items, someAnswers(items.length))).toBe(items.length - 1);
  });
  it("drops answers to questions that no longer exist and bad values", () => {
    const v = cleanValues(items, { ...someAnswers(2), gone: 3, [items[2].id]: Number.NaN, [items[3].id]: "x" as unknown as number });
    expect(v).toEqual(someAnswers(2));
  });
  it("scores a resumed test the same as an uninterrupted one", () => {
    const all = Object.fromEntries(items.map((q, i) => [q.id, (i % 5) + 1]));
    const firstHalf = Object.fromEntries(items.slice(0, 10).map((q) => [q.id, all[q.id]]));
    const resumed = { ...cleanValues(items, firstHalf) };
    for (let i = resumeIndex(items, resumed); i < items.length; i++) resumed[items[i].id] = all[items[i].id];
    expect(defs["big-five"].score(resumed)).toEqual(defs["big-five"].score(all));
  });
});

describe("resuming Deep Read", () => {
  const play = (seq: AAnswer[], n: number) => { for (let i = 0; i < n; i++) { const it = nextItem(seq); if (!it) break; seq.push({ id: it.id, v: seq.length % 2 ? 1 : 2, ms: 2000 }); } return seq; };
  it("asks the same next question after a reload", () => {
    const a = play([], 6);
    expect(nextItem(cleanSeq(JSON.parse(JSON.stringify(a))))?.id).toBe(nextItem(a)?.id);
  });
  it("reaches the same result when interrupted halfway", () => {
    const whole = play([], 99); const half = cleanSeq(JSON.parse(JSON.stringify(play([], 7))));
    expect(scoreAdaptive(play(half, 99))).toEqual(scoreAdaptive(whole));
  });
  it("drops items that are not part of the test", () => {
    expect(cleanSeq([{ id: "nope", v: 1, ms: 1 }, { id: "o1", v: 9 as never, ms: 1 }, { id: "o1", v: 1, ms: 1 }, null as never])).toEqual([{ id: "o1", v: 1, ms: 1 }]);
    expect(cleanSeq("x" as never)).toEqual([]);
  });
});

describe("the take-all run", () => {
  it("covers every test and Deep Read, once, with no games and no Bond Check", () => {
    expect([...TEST_RUN].sort()).toEqual([...ALL_QUIZ_IDS, "adaptive"].sort());
    expect(new Set(TEST_RUN).size).toBe(10);
    for (const g of PLAY_GAMES) expect(TEST_RUN).not.toContain(playKey(g));
  });
  it("knows where each result lives", () => {
    for (const id of ALL_QUIZ_IDS) expect(RESULT_KEY[id]).toBe(defs[id].resultKey);
    expect(RESULT_KEY.adaptive).toBe("adaptive");
    for (const id of TEST_RUN) expect(QUIZ_KEYS, id).toContain(RESULT_KEY[id]);
  });
  it("points each test at its page", () => {
    expect(testPath("adaptive")).toBe("/deep/"); expect(testPath("big-five")).toBe("/quiz/big-five/");
  });
  it("starts at the first test", () => {
    const r = runStatus({}, {}); expect(r.next).toBe(TEST_RUN[0]); expect(r.done).toBe(0); expect(r.total).toBe(10); expect(r.complete).toBe(false); expect(r.started).toBe(false);
  });
  it("goes back to a test left half done before any new one", () => {
    const r = runStatus({ bigFive: {} as never }, { [progressKey("me", "dosha")]: { personId: "me", testId: "dosha", values: { a: 1 }, at: "x" } });
    expect(r.next).toBe("dosha"); expect(r.done).toBe(1); expect(r.started).toBe(true);
  });
  it("skips tests already done, whenever they were taken", () => {
    const q = Object.fromEntries(TEST_RUN.slice(0, 3).map((id) => [RESULT_KEY[id], {}]));
    expect(runStatus(q, {}).next).toBe(TEST_RUN[3]);
  });
  it("is complete when every test has a result", () => {
    const r = runStatus(Object.fromEntries(TEST_RUN.map((id) => [RESULT_KEY[id], {}])), {});
    expect(r.complete).toBe(true); expect(r.next).toBeNull(); expect(r.done).toBe(10);
  });
  it("ignores another person's unfinished test", () => {
    expect(runStatus({}, { [progressKey("p1", "dosha")]: { personId: "p1", testId: "dosha", values: { a: 1 }, at: "x" } }).next).toBe(TEST_RUN[0]);
  });
  it("reports status per test", () => {
    const p = { [progressKey("me", "care")]: { personId: "me", testId: "care", values: { a: 1, b: 2 }, at: "x" } };
    expect(testState({}, {}, "me", "care")).toBe("todo");
    expect(testState({}, p, "me", "care")).toBe("started");
    expect(testState({ care: {} as never }, p, "me", "care")).toBe("done");
    expect(runStatus({}, p).rows.find((r) => r.id === "care")?.answered).toBe(2);
  });
  it("moves the overall bar with every answer", () => {
    const sizes = Object.fromEntries(TEST_RUN.map((id) => [id, id === "adaptive" ? MAX_ITEMS : defs[id as Exclude<TestId, "adaptive">].items.length])) as Record<TestId, number>;
    const one = runFraction(runStatus({}, { [progressKey("me", "big-five")]: { personId: "me", testId: "big-five", values: someAnswers(1), at: "x" } }), sizes);
    const two = runFraction(runStatus({}, { [progressKey("me", "big-five")]: { personId: "me", testId: "big-five", values: someAnswers(2), at: "x" } }), sizes);
    expect(two).toBeGreaterThan(one); expect(one).toBeGreaterThan(0); expect(two).toBeLessThan(0.1);
    expect(runFraction(runStatus(Object.fromEntries(TEST_RUN.map((id) => [RESULT_KEY[id], {}])), {}), sizes)).toBe(1);
  });
  it("names the next test to offer after a result", () => {
    expect(nextTest({}, "big-five")).toBe("attachment");
    expect(nextTest({ attachment: {} as never }, "big-five")).toBe("nine");
    expect(nextTest(Object.fromEntries(TEST_RUN.map((id) => [RESULT_KEY[id], {}])), "big-five")).toBeNull();
    expect(nextTest({}, "big-five-long")).toBe("big-five"); // wraps round to what is still open
  });
});
