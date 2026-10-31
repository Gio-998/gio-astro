import { describe, it, expect } from "vitest";
import { lintPage, splitSentences, datesIn, type Lang } from "./yearly2027-lint";
import type { YearlyPage } from "../src/content/yearly2027/types";

/** The checker guards every date on 3,000 lines of copy, so prove it fails when it should: a checker that cannot fail once passed fake German dates. */
const page = (para: string): YearlyPage => ({ metaTitle: "x 2027", h1: "x", description: "x", lead: "x", hubLine: "x", sections: [{ role: "year", title: "x", paras: [para] }], faq: [] });
const has = (lang: Lang, para: string, want: string) => lintPage(lang, "capricorn", page(para), "x").some((b) => b.includes(want));

describe("yearly 2027 lint catches what it claims to", () => {
  it("splits German sentences without eating dates or house ordinals", () => {
    expect(splitSentences("Am 26. Juli zieht Jupiter weiter. Das 9. Haus öffnet sich.")).toEqual(["Am 26. Juli zieht Jupiter weiter.", "Das 9. Haus öffnet sich."]);
    expect(datesIn("de", "Am 26. Juli und am 13. Dezember 2026.")).toEqual(["2027-07-26", "2026-12-13"]);
    expect(datesIn("mk", "на 26 јули и 13 декември 2026")).toEqual(["2027-07-26", "2026-12-13"]);
    expect(datesIn("en", "on July 26 and December 13, 2026")).toEqual(["2027-07-26", "2026-12-13"]);
  });
  for (const [lang, fake, wrongPlanet, wrongHouse, loose] of [
    ["en", "Jupiter moves on July 25.", "Saturn moves on July 26.", "Jupiter enters your 3rd house.", "Mercury turns on March 3 to 12."],
    ["de", "Jupiter zieht am 25. Juli weiter.", "Saturn zieht am 26. Juli weiter.", "Jupiter steht im 3. Haus.", "Merkur dreht vom 3. bis 12. März."],
    ["mk", "Јупитер се движи на 25 јули.", "Сатурн се движи на 26 јули.", "Јупитер е во 3-тиот дом.", "Меркур се врти од 3 до 12 март."],
  ] as const) {
    it(`${lang}: rejects a date the sky does not have`, () => expect(has(lang, fake, "not in sky2027")).toBe(true));
    it(`${lang}: rejects a real date on the wrong planet`, () => expect(has(lang, wrongPlanet, "belongs to")).toBe(true));
    it(`${lang}: rejects a planet in a house it never reaches`, () => expect(has(lang, wrongHouse, "is not there in 2027")).toBe(true));
    it(`${lang}: rejects a date shape it cannot trace`, () => expect(has(lang, loose, "date shape")).toBe(true));
  }
  it("accepts a true sentence in every language", () => {
    expect(lintPage("en", "capricorn", page("Jupiter enters Virgo, your 9th house, on July 26."), "x").filter((b) => /sky2027|belongs|not there/.test(b))).toEqual([]);
    expect(lintPage("de", "capricorn", page("Jupiter wechselt am 26. Juli in dein 9. Haus."), "x").filter((b) => /sky2027|belongs|not there/.test(b))).toEqual([]);
    expect(lintPage("mk", "capricorn", page("Јупитер влегува во 9-тиот дом на 26 јули."), "x").filter((b) => /sky2027|belongs|not there/.test(b))).toEqual([]);
  });
});
