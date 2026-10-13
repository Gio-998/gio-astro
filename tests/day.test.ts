import { describe, it, expect } from "vitest";
import { buildProfile } from "../src/engine/profile";
import { dayStory, weekAhead, signDay, rotate } from "../src/story/day";
import { getContent } from "../src/content";
import { SIGNS } from "../src/engine/zodiac";

const people = [
  buildProfile({ name: "Ana", date: "1992-05-14", time: "08:30", place: { name: "Skopje", lat: 41.9981, lon: 21.4254, tz: "Europe/Skopje" }, quiz: { bigFive: { O: 80, C: 20, E: 75, A: 70, N: 70 } } }),
  buildProfile({ name: "Ben", date: "1975-11-30", time: null, place: null }),
  buildProfile({ name: "Cleo", date: "2001-02-03", time: "23:10", place: { name: "Sydney", lat: -33.87, lon: 151.21, tz: "Australia/Sydney" }, quiz: { bigFive: { O: 30, C: 85, E: 20, A: 40, N: 25 } } }),
];
const names = (lang: string) => { const c = getContent(lang); return { point: (k: string) => c.day.ui.yourPoint(c.astro.points[k as "sun"].name), planet: (k: string) => c.astro.points[k as "sun"].name, sign: (s: string) => c.astro.signs[s as "aries"].name, weekday: (d: Date) => d.toLocaleDateString(lang, { weekday: "long" }) }; };

describe("Your day", () => {
  for (const lang of ["en", "mk", "de"]) {
    it(`${lang}: 150-300 words, no unfilled placeholders, every day of a year`, () => {
      const c = getContent(lang); const N = names(lang); let lo = 999, hi = 0;
      for (const p of people) for (let i = 0; i < 365; i += 1) {
        const d = new Date(2026, 0, 1 + i, 9);
        const s = dayStory(p, d, c.day, N);
        expect(s.words, `${p.input.name} ${s.date}`).toBeGreaterThanOrEqual(150);
        expect(s.words).toBeLessThanOrEqual(300); lo = Math.min(lo, s.words); hi = Math.max(hi, s.words);
        expect(JSON.stringify(s)).not.toMatch(/\{\w+\}|undefined/);
      }
      console.log(lang, "day words", lo, hi);
    });
  }
  it("is deterministic for a person and date, and different for different people", () => {
    const c = getContent("en"); const N = names("en"); const d = new Date(2026, 9, 12, 8);
    expect(dayStory(people[0], d, c.day, N)).toEqual(dayStory(people[0], new Date(2026, 9, 12, 21), c.day, N));
    expect(dayStory(people[0], d, c.day, N).paragraphs.join()).not.toBe(dayStory(people[2], d, c.day, N).paragraphs.join());
  });
  it("motto, practice and question don't repeat for 75+ days", () => {
    const c = getContent("en"); const N = names("en");
    const seen = { motto: new Set<string>(), practice: new Set<string>(), question: new Set<string>() };
    for (let i = 0; i < 75; i++) { const s = dayStory(people[0], new Date(2026, 0, 1 + i, 9), c.day, N); seen.motto.add(s.motto); seen.practice.add(s.practice); seen.question.add(s.question); }
    expect(seen.motto.size).toBe(75); expect(seen.practice.size).toBe(75); expect(seen.question.size).toBe(75);
    const full = new Set(Array.from({ length: 100 }, (_, i) => rotate(c.day.motto, "x", 20000 + i)));
    expect(full.size).toBe(100);
  });
  it("mk pools mirror en sizes", () => {
    const en = getContent("en").day, mk = getContent("mk").day;
    for (const k of ["motto", "practice", "question", "close", "quiet"] as const) expect(mk[k].length, k).toBe(en[k].length);
    expect(mk.motto[0]).not.toBe(en.motto[0]);
    for (const n of [1, 5, 9]) expect(mk.number[n].length).toBe(en.number[n].length);
  });
  it("week ahead has 7 days, a best day and tones", () => {
    const w = weekAhead(people[0], new Date(2026, 9, 12));
    expect(w.days).toHaveLength(7); expect(w.best).toBeGreaterThanOrEqual(0);
    expect(w.days.every((d) => d.personalDay >= 1 && d.personalDay <= 9)).toBe(true);
  });
  it("sign day exists for every sign in both languages", () => {
    for (const lang of ["en", "mk", "de"]) for (const s of SIGNS) {
      const r = signDay(s, new Date(2026, 9, 12), getContent(lang).day, names(lang));
      expect(r.paragraphs.length).toBeGreaterThanOrEqual(3);
      expect(JSON.stringify(r)).not.toMatch(/\{\w+\}|undefined/);
    }
  });
});
