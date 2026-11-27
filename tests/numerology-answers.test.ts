import { describe, it, expect } from "vitest";
import { ANSWERS } from "@/content/numerology/answers";
import { numModel, numPaths, ANGEL, MIRROR_KEYS } from "@/lib/numerology";
import { numContent } from "@/content/numerology";

const words = (s: string) => s.split(/\s+/).filter(Boolean).length;
const pathOf = (key: string) => `/numerology/${key}/`;
const numberOf = (key: string) => key.split("/")[1]?.replace("-", ":");

describe("direct answers on angel number and mirror hour pages", () => {
  for (const [lang, set] of Object.entries(ANSWERS)) {
    it(`${lang}: every answer belongs to a page, is 40 to 60 words, names its number and reads without dashes`, () => {
      const paths = numPaths();
      for (const [key, q] of Object.entries(set)) {
        expect(paths, key).toContain(pathOf(key));
        expect(words(q.answer), `${key}: ${words(q.answer)} words`).toBeGreaterThanOrEqual(40);
        expect(words(q.answer), `${key}: ${words(q.answer)} words`).toBeLessThanOrEqual(60);
        const n = numberOf(key); if (n) expect(q.answer, key).toContain(n);
        for (const t of [q.answer, q.question ?? "", q.love?.title ?? "", ...(q.love?.paras ?? [])]) expect(t, key).not.toMatch(/[\u2013\u2014]| - /);
      }
    });
    it(`${lang}: the answer is the first section of its page and the first question in its FAQ`, () => {
      for (const [key, q] of Object.entries(set)) {
        const m = numModel(lang, pathOf(key))!;
        expect(m.blocks[0].id, key).toBe("answer");
        expect(m.blocks[0].paras, key).toEqual([q.answer]);
        expect(m.faq[0]?.[1], key).toBe(q.answer);
        if (q.love) {
          expect(q.love.paras.length, key).toBeGreaterThanOrEqual(2);
          expect(m.blocks.find((b) => b.id === "love-life")?.paras, key).toEqual(q.love.paras);
        }
      }
    });
  }
  it("covers the pages Search Console asks for: German angel numbers, spiegelzahlen, 21:21, 1414 and 11:11 in Serbian", () => {
    for (const n of ["1313", "1212", "1551", "1001", "0000", "1010", "1234", "333", "555", "666", "777", "888"]) expect(ANSWERS.de[`angel-numbers/${n}`]?.love, n).toBeTruthy();
    expect(ANSWERS.de["mirror-hours"]).toBeTruthy();
    expect(ANSWERS.en["mirror-hours/21-21"]?.love).toBeTruthy();
    expect(ANSWERS.sr["angel-numbers/1414"]?.love).toBeTruthy();
    expect(ANSWERS.sr["mirror-hours/11-11"]?.love).toBeTruthy();
    expect(ANSWERS.de["angel-numbers/666"].answer.startsWith("Was bedeutet 666?")).toBe(true);
  });
  it("every angel number page in every language opens with the answer to what the number means", () => {
    for (const lang of ["en", "mk", "de", "sr"]) for (const a of ANGEL) {
      const m = numModel(lang, `/numerology/angel-numbers/${a}/`)!; const U = numContent(lang).ui;
      expect(m.blocks[0].title, `${lang} ${a}`).toBe(ANSWERS[lang]?.[`angel-numbers/${a}`]?.question ?? U.faq.angelMean(a));
    }
    expect(MIRROR_KEYS.length).toBe(24);
  });
});
