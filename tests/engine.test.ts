import { describe, it, expect } from "vitest";
import { chineseProfile, animalRelation, lunarNewYearDate } from "../src/engine/chinese";
import { lifePath, nameNumbers, reduce } from "../src/engine/numerology";
import { birthCards } from "../src/engine/tarot";
import { buildProfile } from "../src/engine/profile";
import { comparePair, REL_TYPES } from "../src/engine/compat";
import { gunaMilan, lahiriAyanamsa } from "../src/engine/vedic";
import { scoreBigFive, fourLetter, temperament, encodeBigFive, decodeBigFive } from "../src/engine/bigfive";
import { scoreAttachment, scoreNine, scoreDosha } from "../src/engine/quizzes";
import { moonPhase, dailyGuidance } from "../src/engine/daily";

describe("Chinese zodiac — Lunar New Year cutoff", () => {
  it.each([
    ["1990-01-26", "snake", "earth"], // day before LNY 1990 (27 Jan)
    ["1990-01-27", "horse", "metal"], // LNY 1990
    ["1990-02-03", "horse", "metal"],
    ["2024-02-09", "rabbit", "water"], // LNY 2024 = 10 Feb
    ["2024-02-10", "dragon", "wood"],
    ["2000-02-04", "rabbit", "earth"], // LNY 2000 = 5 Feb
    ["2000-02-05", "dragon", "metal"],
    ["1985-02-19", "rat", "wood"], // LNY 1985 = 20 Feb
    ["1985-02-20", "ox", "wood"],
  ])("%s → %s (%s)", (date, animal, element) => {
    const c = chineseProfile(date, null);
    expect(c.animal).toBe(animal);
    expect(c.element).toBe(element);
  });
  it("reports when Li Chun and Lunar New Year conventions differ", () => {
    const c = chineseProfile("1990-02-03", null); // after LNY (Horse), before Li Chun 4 Feb (Snake)
    expect(c.animal).toBe("horse");
    expect(c.animalLiChun).toBe("snake");
    expect(c.conventionsDiffer).toBe(true);
  });
  it("knows LNY dates", () => {
    expect(lunarNewYearDate(1990)).toBe("1990-01-27");
    expect(lunarNewYearDate(2024)).toBe("2024-02-10");
  });
  it("classic relations", () => {
    expect(animalRelation("rat", "ox")).toBe("six-harmony");
    expect(animalRelation("rat", "dragon")).toBe("trine");
    expect(animalRelation("rat", "horse")).toBe("clash");
    expect(animalRelation("rat", "goat")).toBe("harm");
  });
});

describe("numerology", () => {
  it("life path keeps master numbers and reduces parts separately", () => {
    expect(lifePath("1990-07-15").value).toBe(5); // 7 + 6 + 1 = 14 → 5
    expect(lifePath("1985-11-29").value).toBe(reduce(11 + 11 + 5)); // 11 + 11 + 1985→23→5 = 27 → 9
    expect(lifePath("1987-11-29").value).toBe(11); // 11 + 11 + 1987→25→7 = 29 → 11 (master kept)
    expect(lifePath("1970-03-11").value).toBe(22); // 3 + 11 + 1970→17→8 = 22 (master kept)
  });
  it("normalizes Polish diacritics", () => {
    expect(nameNumbers("Łucja Żółć")).toEqual(nameNumbers("Lucja Zolc"));
  });
});

describe("tarot birth cards (Greer method)", () => {
  it("1990-07-15 → 5 (Hierophant)", () => expect(birthCards("1990-07-15").cards).toEqual([5]));
  it("sum reducing to 19 gives Sun / Wheel / Magician", () => {
    expect(birthCards("1970-01-01").cards).toEqual([19, 10, 1]); // 1972 → 19 → 10 → 1
    expect(birthCards("1981-01-01").cards).toEqual([21, 3]); // 1983 → 21 → 3
    expect(birthCards("1970-01-28").cards).toEqual([10, 1]);
  });
});

describe("Vedic", () => {
  it("Lahiri ayanamsa ≈ 23°51′ at J2000 and ≈ 24°12′ in 2026", () => {
    expect(lahiriAyanamsa(new Date(Date.UTC(2000, 0, 1, 12)))).toBeCloseTo(23.853, 2);
    expect(Math.abs(lahiriAyanamsa(new Date(Date.UTC(2026, 0, 1))) - 24.216)).toBeLessThan(0.02);
  });
  it("Guna Milan totals stay within 0–36 and identical charts get full Nadi caution", () => {
    const p = buildProfile({ date: "1990-07-15", time: "10:00", place: { name: "Warsaw", lat: 52.23, lon: 21.01, tz: "Europe/Warsaw" } });
    const g = gunaMilan(p.vedic, p.vedic);
    expect(g.total).toBeGreaterThanOrEqual(0);
    expect(g.total).toBeLessThanOrEqual(36);
    expect(g.cautions).toContain("nadi");
  });
});

describe("psychometrics", () => {
  it("Big Five scoring with reverse keys, derived letters and temperament", () => {
    const ans: Record<string, number> = {};
    for (const id of ["e1", "e3", "a1", "a3", "c1", "c3", "o1"]) ans[id] = 5;
    for (const id of ["e2", "e4", "a2", "a4", "c2", "c4", "o2", "o3", "o4"]) ans[id] = 1;
    for (const id of ["n1", "n3"]) ans[id] = 1;
    for (const id of ["n2", "n4"]) ans[id] = 5;
    const { pct } = scoreBigFive(ans);
    expect(pct.E).toBeGreaterThan(90); expect(pct.N).toBeLessThan(10);
    expect(fourLetter(pct).code).toBe("ENFJ");
    expect(temperament(pct).primary).toBe("sanguine");
    expect(decodeBigFive(encodeBigFive(pct))).toEqual(pct);
  });
  it("attachment styles", () => {
    expect(scoreAttachment({ ax1: 1, ax2: 1, ax3: 1, ax4: 5, ax5: 1, av1: 1, av2: 5, av3: 1, av4: 5 }).style).toBe("secure");
    expect(scoreAttachment({ ax1: 5, ax2: 5, ax3: 5, ax4: 1, ax5: 5, av1: 1, av2: 5, av3: 1, av4: 5 }).style).toBe("anxious");
  });
  it("nine-style + dosha", () => {
    expect(scoreNine({ t4: 5, t4b: 5, t5: 4, t3: 2 }).type).toBe(4);
    expect(scoreNine({ t4: 5, t4b: 5, t5: 4, t3: 2 }).wing).toBe(5);
    expect(scoreDosha(Object.fromEntries(Array.from({ length: 12 }, (_, i) => [["frame", "skin", "appetite", "digestion", "sleep", "climate", "pace", "speech", "stress", "memory", "energy", "weather-mood"][i], 1]))).constitution).toBe("pitta");
  });
});

describe("compatibility invariants", () => {
  const W = { name: "Warsaw", lat: 52.23, lon: 21.01, tz: "Europe/Warsaw" };
  const a = buildProfile({ date: "1990-07-15", time: "10:00", place: W, name: "Anna Kowalska" });
  const b = buildProfile({ date: "1988-02-03", time: null, place: W, name: "Jan Nowak" });
  it.each(REL_TYPES)("%s: all scores in 45–100, positive band, no evidence-only score without quizzes", (rel) => {
    const r = comparePair(a, b, rel);
    expect(r.resonance).toBeGreaterThanOrEqual(45);
    expect(r.resonance).toBeLessThanOrEqual(100);
    for (const l of r.lenses) { expect(l.harmony).toBeGreaterThanOrEqual(45); expect(l.spark).toBeGreaterThanOrEqual(45); }
    expect(["kindred-flow", "natural-allies", "complementary-path", "catalyst-bond", "deep-teacher"]).toContain(r.band);
    expect(r.evidenceOnly).toBeNull();
    expect(r.growthEdges.length).toBeGreaterThan(0);
    expect(r.missing).toContain("bigfive");
  });
  it("is symmetric enough (A,B) vs (B,A)", () => {
    const x = comparePair(a, b, "romantic"), y = comparePair(b, a, "romantic");
    expect(Math.abs(x.resonance - y.resonance)).toBeLessThanOrEqual(3);
  });
});

describe("daily guidance", () => {
  it("moon phase: full moon 2026-10-26 04:12 UT", () => {
    expect(moonPhase(new Date(Date.UTC(2026, 9, 26, 4, 12))).phase).toBe("full");
    expect(moonPhase(new Date(Date.UTC(2026, 9, 10, 15, 50))).phase).toBe("new");
  });
  it("is deterministic per person and day", () => {
    const p = buildProfile({ date: "1990-07-15", time: null });
    const d1 = dailyGuidance(p, new Date(Date.UTC(2026, 9, 11, 12)), 30);
    const d2 = dailyGuidance(p, new Date(Date.UTC(2026, 9, 11, 12)), 30);
    expect(d1).toEqual(d2);
  });
});
