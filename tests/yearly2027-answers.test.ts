import { describe, it, expect } from "vitest";
import { YEARLY_ANSWER, YEARLY_FRAME } from "../src/content/yearly2027";
import { YEARLY_SIGNS, signDates, yearly } from "../src/lib/sections/horoscope-2027";
import { houseFrom } from "../src/engine/skyday";
import { SIGNS } from "../src/engine/zodiac";
import { SKY2027 } from "../src/lib/sky2027";
import { LANGS, lintChunk, sentences } from "./yearly2027-lint";

/** The short answer on each 2027 sign page, and the table of that sign's key dates. */
describe("yearly 2027: short answers", () => {
  for (const l of LANGS) {
    it(`${l}: every sign has a 40 to 60 word answer that passes the fact, house and style rules`, () => {
      expect(Object.keys(YEARLY_ANSWER[l]).sort()).toEqual([...SIGNS].sort());
      const bad = SIGNS.flatMap((s) => { const t = YEARLY_ANSWER[l][s]; const n = t.split(/\s+/).length; return [...(n < 40 || n > 60 ? [`${s}: ${n} words`] : []), ...lintChunk(l, s, t).map((b) => `${s}: ${b}`)]; });
      expect(bad).toEqual([]);
    });
    it(`${l}: no answer repeats a sentence of another sign's answer`, () => {
      const all = SIGNS.flatMap((s) => [...new Set(sentences(YEARLY_ANSWER[l][s]))]);
      expect(all.filter((x, i) => all.indexOf(x) !== i)).toEqual([]);
    });
    it(`${l}: the page shows the answer under the header and the dates table after the first section`, () => {
      for (const s of YEARLY_SIGNS) {
        const m = yearly.model(l, `/horoscope-2027/${s}/`)!;
        expect(m.answer).toEqual({ label: YEARLY_FRAME[l].answerLabel, text: YEARLY_ANSWER[l][s] });
        expect(m.blocks[1].id).toBe("key-dates");
        expect(m.blocks[1].table!.rows.length).toBeGreaterThanOrEqual(15);
      }
    });
  }
  it("the dates table lists every 2027 station and eclipse once, with the right house for each sign", () => {
    const stations = SKY2027.stations.filter((x) => ["mars", "mercury", "jupiter", "saturn"].includes(x.body) && x.date.startsWith("2027")).length;
    const expected = stations + SKY2027.eclipses.length + SKY2027.ingresses.filter((x) => x.body === "jupiter" || x.body === "saturn").length;
    for (const s of SIGNS) {
      const rows = signDates("en", s); expect(rows.length).toBe(expected);
      // Jupiter enters Virgo on July 26: Aries gets its 6th house, Virgo its 1st, Pisces its 7th.
      const row = rows.find((r) => r[1] === "Jupiter enters Virgo")!; expect(row[0]).toBe("July 26");
      const h = houseFrom(s, "virgo"); const ord: Record<number, string> = { 1: "1st", 2: "2nd", 3: "3rd" };
      expect(row[2]).toBe(`${ord[h] ?? `${h}th`} house`);
    }
  });
  it("the rules do catch a wrong house and a wrong date", () => {
    expect(lintChunk("en", "aries", "Saturn stays in your 7th house all year.").length).toBeGreaterThan(0);
    expect(lintChunk("en", "aries", "Mars turns retrograde on January 11.").length).toBeGreaterThan(0);
    expect(lintChunk("en", "aries", "Mars turns retrograde on January 10 in your 6th house.")).toEqual([]);
  });
});
