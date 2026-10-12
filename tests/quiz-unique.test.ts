import { describe, it, expect } from "vitest";
import { getContent } from "../src/content";
import { quizDefs, ALL_QUIZ_IDS } from "../src/lib/quiz-defs";
import { CARE_PAIRS, CARE_ORDER, scoreCare } from "../src/engine/quizzes";

const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();

describe.each(["en", "mk"] as const)("quiz items are unique (%s)", (lang) => {
  const defs = quizDefs(getContent(lang));
  it.each([...ALL_QUIZ_IDS])("%s has no repeated questions or options", (id) => {
    const items = defs[id].items;
    const ids = items.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    const shared = new Set([getContent(lang).ui.quiz.whichMore]);
    const texts = items.map((i) => norm(i.text)).filter((t) => !shared.has(t));
    expect(new Set(texts).size, `duplicate question text in ${id}`).toBe(texts.length);
    const opts = items.flatMap((i) => (i.kind === "choice" && i.id !== "give" && id === "care" ? i.options : [])).map(norm);
    expect(new Set(opts).size, `duplicate option in ${id}`).toBe(opts.length);
  });
});

describe("care pair order", () => {
  it("uses every pair exactly once", () => {
    expect([...CARE_ORDER].sort((a, b) => a - b)).toEqual(CARE_PAIRS.map((_, i) => i));
    const keys = CARE_ORDER.map((i) => CARE_PAIRS[i].join("-"));
    expect(new Set(keys).size).toBe(keys.length);
  });
  it("never shows a style in back-to-back questions", () => {
    for (let n = 1; n < CARE_ORDER.length; n++) {
      const a = CARE_PAIRS[CARE_ORDER[n - 1]], b = CARE_PAIRS[CARE_ORDER[n]];
      expect(a.some((x) => b.includes(x))).toBe(false);
    }
  });
  it("each style appears 4 times and option 0 scores the first style", () => {
    const ans: Record<string, number> = {}; CARE_PAIRS.forEach((_, i) => (ans[`p${i}`] = 0));
    const r = scoreCare(ans);
    expect(r.receive).toEqual({ words: 4, time: 3, gifts: 2, help: 1, touch: 0 });
  });
});
