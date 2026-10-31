/** Pure rules for test status, resuming and the take-all run (unit-tested, no React). */
import type { QuizResults } from "@/engine/profile";
import { ADAPTIVE_ITEMS, type AAnswer } from "@/engine/adaptive";
import type { AnyQuizId } from "./quiz-defs";
import { progressKey, type State, type TestProgress } from "./store";

/** A test in the run: every questionnaire plus Deep Read. Games and Bond Check are extras, so they are not listed. */
export type TestId = AnyQuizId | "adaptive";
/** The order of the take-all run: the short core tests, then the longer, sharper ones. */
export const TEST_RUN: readonly TestId[] = ["big-five", "attachment", "nine", "care", "shadow", "dosha", "explorer", "four-letter", "adaptive", "big-five-long"];
export const RESULT_KEY: Record<TestId, keyof QuizResults> = {
  "big-five": "bigFive", attachment: "attachment", nine: "nine", care: "care", shadow: "shadow", dosha: "dosha", explorer: "explorer",
  "four-letter": "fourLetter", "big-five-long": "bigFiveLong", adaptive: "adaptive",
};
export const testPath = (id: TestId) => (id === "adaptive" ? "/deep/" : `/quiz/${id}/`);
/** Lead source of the take-all run, which gates once at the end. */
export const RUN_SOURCE = "take-all";

export type TestState = "todo" | "started" | "done";
type Progress = State["progress"];
const answeredIn = (p?: TestProgress) => (p ? p.seq?.length ?? Object.keys(p.values ?? {}).length : 0);

export function testState(quiz: QuizResults, progress: Progress, personId: string, id: TestId): TestState {
  return quiz[RESULT_KEY[id]] ? "done" : progress[progressKey(personId, id)] ? "started" : "todo";
}
export interface RunRow { id: TestId; state: TestState; answered: number }
export interface RunStatus { rows: RunRow[]; done: number; total: number; next: TestId | null; complete: boolean; started: boolean }

export function runStatus(quiz: QuizResults, progress: Progress, personId = "me"): RunStatus {
  const rows = TEST_RUN.map((id) => ({ id, state: testState(quiz, progress, personId, id), answered: answeredIn(progress[progressKey(personId, id)]) }));
  const done = rows.filter((r) => r.state === "done").length;
  // A test left half way comes first: that is where the visitor stopped.
  const next = (rows.find((r) => r.state === "started") ?? rows.find((r) => r.state === "todo"))?.id ?? null;
  return { rows, done, total: rows.length, next, complete: next === null, started: done > 0 || rows.some((r) => r.state === "started") };
}
/** Share of the run done, counting the answers in the test left half way. `sizes` is the number of questions per test. */
export function runFraction(r: RunStatus, sizes: Record<TestId, number>): number {
  const open = r.rows.find((x) => x.state === "started");
  return Math.min(1, (r.done + (open ? Math.min(1, open.answered / sizes[open.id]) : 0)) / r.total);
}
/** The next open test after `after`, going round the run once. */
export function nextTest(quiz: QuizResults, after: TestId): TestId | null {
  const i = TEST_RUN.indexOf(after);
  return [...TEST_RUN.slice(i + 1), ...TEST_RUN.slice(0, i)].find((id) => !quiz[RESULT_KEY[id]]) ?? null;
}

/** Answers still valid for this test: a question can be dropped between visits. */
export function cleanValues(items: readonly { id: string }[], values: Record<string, number> = {}): Record<string, number> {
  return Object.fromEntries(items.filter((q) => Number.isFinite(values[q.id])).map((q) => [q.id, values[q.id]]));
}
/** Where to reopen a test: the first question with no answer. */
export function resumeIndex(items: readonly { id: string }[], values: Record<string, number>): number {
  const i = items.findIndex((q) => values[q.id] === undefined);
  return i < 0 ? Math.max(0, items.length - 1) : i;
}
/** Deep Read answers still valid for this test. The order matters, because each answer picks the next question. */
export function cleanSeq(seq: AAnswer[] | undefined): AAnswer[] {
  const known = new Set(ADAPTIVE_ITEMS.map((i) => i.id));
  return Array.isArray(seq) ? seq.filter((a) => a && known.has(a.id) && (a.v === 0 || a.v === 1 || a.v === 2) && Number.isFinite(a.ms)) : [];
}
