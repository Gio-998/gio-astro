import { describe, expect, it } from "vitest";
import { buildProfile } from "../src/engine/profile";
import { comparePair, REL_TYPES } from "../src/engine/compat";
import { buildFullReport } from "../src/report/pair";
import { reportEn } from "../src/content/report/en";
import { reportMk } from "../src/content/report/mk";
import { contents } from "../src/content";

const S = { name: "Strumica", lat: 41.44, lon: 22.64, tz: "Europe/Skopje" };
const a = buildProfile({ date: "1997-05-10", time: "11:00", place: S, quiz: {
  bigFive: { A: 3, C: 1, E: 59, N: 29, O: 78 }, attachment: { style: "avoidant", anxiety: 50, avoidance: 75 },
  care: { give: "help", receive: { help: 1, time: 4, gifts: 3, touch: 2, words: 0 }, topReceive: ["time", "gifts"] },
} as never });
const b = buildProfile({ date: "2000-12-10", time: null, place: S });

describe("full relationship report", () => {
  for (const [loc, R] of [["en", reportEn], ["mk", reportMk]] as const) {
    it.each(REL_TYPES)(`${loc} %s: nine chapters, no gaps, no dashes`, (rel) => {
      const doc = buildFullReport(R, contents[loc], comparePair(a, b, rel), a, b, "Mile", "Gordana");
      expect(doc.chapters).toHaveLength(9);
      const text = JSON.stringify(doc);
      expect(text).not.toMatch(/undefined|NaN|\[object/);
      expect(text).not.toMatch(/[—–]/);
      for (const ch of doc.chapters) expect(ch.blocks.length).toBeGreaterThan(1);
      if (loc === "mk") expect(text).not.toMatch(/[а-яА-ЯјЈ][a-zA-Z]|[a-zA-Z][а-яА-ЯјЈ]/);
    });
  }
});
