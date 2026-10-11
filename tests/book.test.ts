import { describe, it, expect } from "vitest";
import { contents } from "../src/content";
import { buildProfile } from "../src/engine/profile";
import { buildBook } from "../src/story/book";
import { scoreBigFive } from "../src/engine/bigfive";
import { scoreAttachment, scoreNine, scoreCare, scoreDosha, scoreExplorer } from "../src/engine/quizzes";
import { scoreShadow } from "../src/engine/shadow";

export const fullQuiz = (seed: number) => {
  const r = (i: number) => ((seed * 7 + i * 13) % 5) + 1;
  const ids = (p: string, n: number) => Object.fromEntries(Array.from({ length: n }, (_, i) => [`${p}${i + 1}`, r(i)]));
  return {
    bigFive: scoreBigFive({ ...ids("e", 4), ...ids("a", 4), ...ids("c", 4), ...ids("n", 4), ...ids("o", 4) }).pct,
    attachment: scoreAttachment({ ...ids("ax", 5), ...ids("av", 4) }),
    nine: scoreNine(Object.fromEntries(Array.from({ length: 9 }, (_, i) => [`t${i + 1}`, r(i)]))),
    care: scoreCare({ ...Object.fromEntries(Array.from({ length: 10 }, (_, i) => [`p${i}`, (seed + i) % 2])), give: seed % 5 }),
    shadow: scoreShadow(Object.fromEntries(["pride", "greed", "desire", "envy", "excess", "anger", "inertia"].flatMap((a, i) => [[`${a}-s`, r(i)], [`${a}-l`, r(i + 3)]]))),
    dosha: scoreDosha(Object.fromEntries(["frame", "skin", "appetite", "digestion", "sleep", "climate", "pace", "speech", "stress", "memory", "energy", "weather-mood"].map((k, i) => [k, (seed + i) % 3]))),
    explorer: scoreExplorer({ routine: r(1), persistence: r(2), simplify: r(3), certainty: r(4), evidence: r(5), image: r(6), conf1: r(7), conf2: r(8), trust1: r(9), trust2: r(10) }),
  };
};
const place = { name: "Skopje", lat: 41.99, lon: 21.43, tz: "Europe/Skopje" };

describe("Book of You", () => {
  for (const [loc, c] of Object.entries(contents)) {
    it(`${loc}: birth-only book renders, quiz chapters show locks`, () => {
      const p = buildProfile({ date: "1995-10-12", time: null, place: null });
      const b = buildBook(p, c, "Ana", new Date(Date.UTC(2026, 9, 12)));
      expect(b.chapters.length).toBe(11);
      expect(b.words).toBeGreaterThan(1500);
    });
    it(`${loc}: fully unlocked book reaches 4,000+ words with no empty text`, () => {
      let min = Infinity, max = 0;
      for (let s = 0; s < 24; s++) {
        const d = `19${70 + s}-${String((s % 12) + 1).padStart(2, "0")}-${String((s * 3) % 27 + 1).padStart(2, "0")}`;
        const p = buildProfile({ date: d, time: "08:30", place, name: "Elena Petrova", quiz: fullQuiz(s) });
        const b = buildBook(p, c, "Elena", new Date(Date.UTC(2026, 9, 12)));
        min = Math.min(min, b.words); max = Math.max(max, b.words);
        const txt = JSON.stringify(b.chapters);
        expect(txt).not.toMatch(/undefined|NaN|\[object/);
        for (const ch of b.chapters) for (const bl of ch.blocks) if ("text" in bl && bl.t !== "lock") expect(bl.text.trim().length, `${ch.id}`).toBeGreaterThan(0);
      }
      console.log(loc, "book words min/max", min, max);
      expect(min).toBeGreaterThan(4000);
    });
  }
});

import { comparePair, REL_TYPES } from "../src/engine/compat";
import { buildBondStory } from "../src/story/bond";
describe("Bond Story", () => {
  for (const [loc, c] of Object.entries(contents)) it(`${loc}: renders for every relationship type`, () => {
    let min = Infinity, max = 0;
    for (let s = 0; s < 16; s++) {
      const A = buildProfile({ date: `19${80 + s}-0${(s % 9) + 1}-1${s % 9}`, time: "10:00", place, quiz: fullQuiz(s) });
      const B = buildProfile({ date: `19${84 + (s % 10)}-1${s % 3}-2${s % 8}`, time: s % 2 ? null : "21:15", place, quiz: fullQuiz(s + 7) });
      for (const rel of REL_TYPES) {
        const b = buildBondStory(A, B, "Ana", "Marko", comparePair(A, B, rel), c);
        expect(JSON.stringify(b)).not.toMatch(/undefined|NaN/);
        min = Math.min(min, b.words); max = Math.max(max, b.words);
      }
    }
    console.log(loc, "bond words", min, max);
    expect(min).toBeGreaterThan(1600);
  });
});
