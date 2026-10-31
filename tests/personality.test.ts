import { describe, it, expect } from "vitest";
import { FOUR_LETTER_ITEMS, scoreFourLetter } from "../src/engine/fourletter-quiz";
import { BIG_FIVE_LONG_ITEMS, scoreBigFiveLong } from "../src/engine/bigfive-long";
import { effectiveFourLetter, effectiveTemperament, effectiveNine, effectiveAttachment, selfIdPatch, selfConfirmPatch } from "../src/engine/selfid";
import { buildProfile, type PersonInput } from "../src/engine/profile";
import { comparePair } from "../src/engine/compat";
import { quizDefs, PRECISION_QUIZ_IDS } from "../src/lib/quiz-defs";
import { getContent } from "../src/content";
import { QUIZ_KEYS } from "../src/lib/sync-map";

const all = (v: number) => Object.fromEntries(FOUR_LETTER_ITEMS.map((i) => [i.id, v]));

describe("four-letter preference quiz", () => {
  it("has 28 items, 7 per letter pair", () => {
    expect(FOUR_LETTER_ITEMS).toHaveLength(28);
    for (const d of ["EI", "SN", "TF", "JP"]) expect(FOUR_LETTER_ITEMS.filter((i) => i.dim === d)).toHaveLength(7);
  });
  it("all 'clearly first' = ESTJ at 100% clarity; all 'clearly second' = INFP", () => {
    expect(scoreFourLetter(all(1))).toMatchObject({ code: "ESTJ", clarity: { EI: 100, SN: 100, TF: 100, JP: 100 } });
    expect(scoreFourLetter(all(4)).code).toBe("INFP");
    expect(scoreFourLetter(all(2)).clarity.EI).toBe(50);
  });
  it("scores each pair independently", () => {
    const a: Record<string, number> = {};
    for (const it of FOUR_LETTER_ITEMS) a[it.id] = it.dim === "EI" ? 4 : it.dim === "SN" ? 4 : it.dim === "TF" ? 1 : 2;
    expect(scoreFourLetter(a).code).toBe("INTJ");
  });
  it("breaks a zero sum by the majority of picks (7 items, never ties)", () => {
    // EI: 4x "rather first" (+1) and 2x "rather second" (-1) and 1x "clearly second" (-2): sum 0, 4 of 7 first → E
    const a = all(1); ["ei1", "ei2", "ei3", "ei4"].forEach((k) => (a[k] = 2)); ["ei5", "ei6"].forEach((k) => (a[k] = 3)); a.ei7 = 4;
    const r = scoreFourLetter(a);
    expect(r.sums.EI).toBe(0); expect(r.code[0]).toBe("E"); expect(r.clarity.EI).toBe(0);
  });
});

describe("IPIP-50 Big Five", () => {
  it("has 50 items, 10 per trait, keyed like the IPIP codebook", () => {
    expect(BIG_FIVE_LONG_ITEMS).toHaveLength(50);
    const k = (id: string) => BIG_FIVE_LONG_ITEMS.find((i) => i.id === id)!.keyed;
    // spot checks against ipip.ori.org / openpsychometrics codebook
    expect([k("E1"), k("E2"), k("N1"), k("N2"), k("N4"), k("A1"), k("A2"), k("C2"), k("C10"), k("O2"), k("O8")]).toEqual([1, -1, 1, -1, -1, -1, 1, -1, 1, -1, 1]);
    for (const t of ["E", "A", "C", "N", "O"]) expect(BIG_FIVE_LONG_ITEMS.filter((i) => i.trait === t)).toHaveLength(10);
  });
  it("max keyed answers give the top percentile; neutral sits near the population middle", () => {
    const hi = Object.fromEntries(BIG_FIVE_LONG_ITEMS.map((i) => [i.id, i.keyed === 1 ? 5 : 1]));
    const r = scoreBigFiveLong(hi);
    expect(Object.values(r.pct).every((p) => p >= 95)).toBe(true);
    const mid = scoreBigFiveLong(Object.fromEntries(BIG_FIVE_LONG_ITEMS.map((i) => [i.id, 3])));
    expect(mid.pct.E).toBeGreaterThan(40); expect(mid.pct.E).toBeLessThan(60);
    expect(mid.answered).toBe(50);
  });
});

const B5 = { O: 80, C: 30, E: 75, A: 60, N: 40 }; // → ENFP estimate
const base: PersonInput = { name: "T", date: "1992-05-14", time: "08:30", place: { name: "Skopje", lat: 41.9981, lon: 21.4254, tz: "Europe/Skopje" } };

describe("self-identified overrides and priority", () => {
  it("four-letter priority: self pick > dedicated quiz > Big Five estimate", () => {
    const quiz = scoreFourLetter(all(1)); // ESTJ
    expect(effectiveFourLetter(B5, undefined, undefined)).toMatchObject({ code: "ENFP", source: "big-five" });
    expect(effectiveFourLetter(B5, quiz, undefined)).toMatchObject({ code: "ESTJ", source: "quiz", measured: "ESTJ" });
    expect(effectiveFourLetter(B5, quiz, { fourLetter: "INFJ" })).toMatchObject({ code: "INFJ", source: "self", measured: "ESTJ", measuredSource: "quiz" });
    expect(effectiveFourLetter(undefined, undefined, { fourLetter: "INFJ" })).toMatchObject({ code: "INFJ", source: "self", measured: null });
    expect(effectiveFourLetter(B5, undefined, { fourLetter: "XXXX" })!.source).toBe("big-five"); // invalid pick ignored
  });
  it("temperament, nine, attachment overrides keep the measured result", () => {
    const t = effectiveTemperament(B5, { temperament: "melancholic" });
    expect(t).toMatchObject({ primary: "melancholic", source: "self" });
    expect(t.measured).not.toBe("melancholic");
    const nine = { type: 2, wing: 3, scores: [1, 9, 6, 2, 3, 4, 5, 2, 7], growth: 4, stress: 8 };
    expect(effectiveNine(nine, { nine: 5 })).toMatchObject({ type: 5, wing: 6, growth: 8, stress: 7, source: "self", measured: 2 });
    expect(effectiveNine(nine, { nine: 2 })).toMatchObject({ type: 2, source: "quiz" });
    const att = { style: "anxious" as const, anxiety: 70, avoidance: 30 };
    expect(effectiveAttachment(att, { attachment: "secure" })).toMatchObject({ style: "secure", source: "self", measured: "anxious" });
  });
  it("patches: picking clears the confirmation, confirming clears the pick", () => {
    let s = selfConfirmPatch(undefined, "nine");
    expect(s.confirmed).toEqual(["nine"]);
    s = selfIdPatch(s, "nine", 4);
    expect(s).toEqual({ nine: 4, confirmed: [] });
    s = selfConfirmPatch(s, "nine");
    expect(s).toEqual({ confirmed: ["nine"] });
    expect(selfIdPatch({ fourLetter: "INTJ" }, "fourLetter", null).fourLetter).toBeUndefined();
  });
  it("buildProfile uses the long Big Five and the dedicated four-letter quiz, and matching follows the self pick", () => {
    const p1 = buildProfile({ ...base, quiz: { bigFive: B5 } });
    expect(p1.bigFiveSource).toBe("short"); expect(p1.psych!.fourLetter.code).toBe("ENFP");
    const long = { O: 20, C: 85, E: 20, A: 40, N: 30 };
    const p2 = buildProfile({ ...base, quiz: { bigFive: B5, bigFiveLong: long, fourLetter: scoreFourLetter(all(1)) } });
    expect(p2.bigFiveSource).toBe("long"); expect(p2.quiz.bigFive).toEqual(long); expect(p2.psych!.fourLetter.code).toBe("ESTJ");
    const p3 = buildProfile({ ...base, quiz: { bigFive: B5, selfId: { fourLetter: "INTJ" } } });
    expect(p3.psych!.fourLetter).toMatchObject({ code: "INTJ", source: "self", measured: "ENFP" });
    const p4 = buildProfile({ ...base, quiz: { fourLetter: scoreFourLetter(all(4)) } });
    expect(p4.psych).toBeNull(); expect(p4.fourLetter!.code).toBe("INFP");
    const other = buildProfile({ ...base, name: "O", quiz: { bigFive: B5, selfId: { fourLetter: "INTJ" } } });
    const r = comparePair(p3, other, "friend");
    expect(JSON.stringify(r)).toContain("INTJ");
  });
});

describe("precision quiz content", () => {
  for (const lang of ["en", "mk", "de", "sr"]) {
    it(`${lang}: every item has wording`, () => {
      const defs = quizDefs(getContent(lang));
      for (const id of PRECISION_QUIZ_IDS) {
        const d = defs[id];
        expect(d.items.length).toBe(id === "four-letter" ? 28 : 50);
        for (const it of d.items) {
          expect(it.text, `${lang} ${it.id}`).toBeTruthy();
          if (it.kind === "pair") { expect(it.a).toBeTruthy(); expect(it.b).toBeTruthy(); }
        }
      }
    });
  }
  it("mk wording differs from en (translated)", () => {
    const en = quizDefs(getContent("en"))["four-letter"].items[0].text, mk = quizDefs(getContent("mk"))["four-letter"].items[0].text;
    expect(mk).not.toBe(en);
  });
  it("new quiz results sync to Supabase", () => {
    for (const k of ["fourLetter", "bigFiveLong", "selfId"]) expect(QUIZ_KEYS as readonly string[]).toContain(k);
  });
});
