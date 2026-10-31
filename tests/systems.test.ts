import { describe, it, expect } from "vitest";
import { chironLongitude } from "../src/engine/systems/chiron";
import { meanLilith } from "../src/engine/systems/lilith";
import { tzolkin, longCount } from "../src/engine/systems/mayan";
import { celticTree, egyptianSign, birthRune, slavicMonth } from "../src/engine/systems/calendars";
import { birthHexagram, hexagramOf } from "../src/engine/systems/iching";
import { treeOfLife } from "../src/engine/systems/kabbalah";
import { nineStarKi, yearStar, nineStarPair } from "../src/engine/systems/ninestar";
import { biorhythm, biorhythmSync } from "../src/engine/systems/biorhythm";
import { solarReturn } from "../src/engine/systems/solarreturn";
import { degreeSymbol } from "../src/engine/systems/degree";
import { CHARUBEL } from "../src/engine/systems/charubel-degrees";
import { nameDay, feastDate, birthFeast } from "../src/engine/systems/feasts";
import { orthodoxEaster, jdn } from "../src/engine/systems/util";
import { cultureOrder, suggestMk } from "../src/engine/systems/culture";
import { computeSystems } from "../src/engine/systems";
import { buildProfile } from "../src/engine/profile";
import { longitude } from "../src/engine/astro";

const angDiff = (a: number, b: number) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };

describe("Chiron (vs NASA/JPL Horizons apparent geocentric ecliptic longitude, quantity 31, fetched 12 Oct 2026)", () => {
  it.each([
    ["1920-02-02T00:00Z", 3.5311724], ["1950-06-15T12:00Z", 258.2846891], ["1975-01-01T00:00Z", 19.9524532], ["1990-07-04T12:00Z", 108.0473259],
    ["2000-01-01T00:00Z", 251.5603761], ["2010-04-20T06:00Z", 329.998997], ["2024-03-30T18:00Z", 18.8737176], ["2040-09-01T00:00Z", 110.2156006],
  ])("%s", (iso, ref) => { expect(angDiff(chironLongitude(new Date(iso))!, ref)).toBeLessThan(0.02); });
  it("matches the Astrodienst ephemeris for 1 Jan 2000 (11°34′ Sagittarius)", () => { expect(angDiff(chironLongitude(new Date("2000-01-01T00:00Z"))!, 240 + 11 + 34 / 60)).toBeLessThan(0.03); });
  it("returns null outside the tabulated range", () => { expect(chironLongitude(new Date("1850-01-01T00:00Z"))).toBeNull(); });
});

describe("Black Moon Lilith (mean apogee) and mean node", () => {
  it("1 Jan 2000 0h UT ≈ 23°25′ Sagittarius (Astrodienst ephemeris 2000, mean apogee)", () => { expect(angDiff(meanLilith(new Date("2000-01-01T00:00Z")), 263 + 25 / 60)).toBeLessThan(0.2); });
  it("moves about 40.7° per year", () => { const a = meanLilith(new Date("2000-01-01T00:00Z")), b = meanLilith(new Date("2001-01-01T00:00Z")); expect(((b - a + 360) % 360)).toBeCloseTo(40.7, 0); });
  it("mean node 1 Jan 2000 = 5°04′ Leo (Astrodienst)", () => { expect(angDiff(longitude("node", new Date("2000-01-01T00:00Z")), 125 + 4 / 60)).toBeLessThan(0.05); });
});

describe("Maya Tzolk'in, GMT correlation 584283", () => {
  it("21 Dec 2012 = 13.0.0.0.0, 4 Ajaw", () => { const t = tzolkin("2012-12-21"); expect([t.tone, t.sign]).toEqual([4, "ajaw"]); expect(longCount("2012-12-21")).toBe("13.0.0.0.0"); });
  it("1 Jan 2000 = 12.19.6.15.2, 11 Ik'", () => { const t = tzolkin("2000-01-01"); expect([t.tone, t.sign]).toEqual([11, "ik"]); expect(longCount("2000-01-01")).toBe("12.19.6.15.2"); });
  it("kin numbers run 1..260 and repeat every 260 days", () => { expect(tzolkin("2000-01-01").kin).toBe(tzolkin("2000-09-17").kin); });
  it("JDN of 2000-01-01 is 2451545", () => { expect(jdn(2000, 1, 1)).toBe(2451545); });
});

describe("Date calendars (boundaries from the published tables)", () => {
  it.each([["1990-12-24", "birch"], ["1991-01-20", "birch"], ["1991-01-21", "rowan"], ["1990-06-10", "oak"], ["1990-12-23", "nameless"], ["1990-11-25", "elder"], ["1990-10-27", "ivy"]])("Celtic tree %s → %s", (d, t) => { expect(celticTree(d)).toBe(t); });
  it.each([["1990-01-01", "nile"], ["1990-01-08", "amun-ra"], ["1990-02-05", "amun-ra"], ["1990-02-29", "geb"], ["1990-07-20", "bastet"], ["1990-12-31", "isis"], ["1990-09-29", "seth"]])("Egyptian %s → %s", (d, t) => { expect(egyptianSign(d)).toBe(t); });
  it.each([["1990-06-29", "fehu"], ["1990-06-28", "dagaz"], ["1990-01-01", "eihwaz"], ["1990-01-13", "perthro"], ["1990-12-13", "jera"]])("rune %s → %s", (d, r) => { expect(birthRune(d)).toBe(r); });
  it("Slavic folk month", () => { expect(slavicMonth("1998-05-06")).toBe("kosar"); expect(slavicMonth("1998-01-31")).toBe("kolozheg"); });
});

describe("I Ching birth hexagram (Plum Blossom year-month-day-hour)", () => {
  it("King Wen table spot checks", () => { expect(hexagramOf("qian", "qian")).toBe(1); expect(hexagramOf("kun", "kun")).toBe(2); expect(hexagramOf("kan", "zhen")).toBe(3); expect(hexagramOf("li", "kan")).toBe(64); expect(hexagramOf("kan", "li")).toBe(63); });
  it("Lunar New Year 2000 (5 Feb 2000, Dragon year, month 1 day 1) at noon → Gen over Kan = 4, moving line 2 → 23", () => {
    const h = birthHexagram("2000-02-05", "12:00");
    expect(h.inputs).toEqual({ Y: 5, M: 1, D: 1, H: 7 });
    expect([h.upper, h.lower, h.number, h.movingLine, h.changed]).toEqual(["gen", "kan", 4, 2, 23]);
  });
  it("unknown time uses the Wu hour and is flagged", () => { const h = birthHexagram("2000-02-05", null); expect(h.approximate).toBe(true); expect(h.number).toBe(4); });
});

describe("Tree of Life (Golden Dawn)", () => {
  it("life path 7 → Netzach; Strength → path 19 (Teth)", () => { const t = treeOfLife(7, [8]); expect(t.sephirah).toBe("netzach"); expect([t.card, t.path, t.letter]).toEqual(["strength", 19, "ט"]); });
  it("master 11 → Chokmah, noted", () => { const t = treeOfLife(11, [0]); expect(t.sephirah).toBe("chokmah"); expect(t.fromMaster).toBe(11); expect(t.path).toBe(11); });
  it("22 (Fool) maps to path 11", () => { expect(treeOfLife(4, [22]).card).toBe("fool"); });
});

describe("Nine Star Ki", () => {
  it.each([[2024, 3], [2025, 2], [2026, 1], [2018, 9], [2000, 9], [1990, 1]])("year %i → star %i", (y, s) => { expect(yearStar(y)).toBe(s); });
  it("15 Mar 2024 → year 3, month 4", () => { const n = nineStarKi("2024-03-15", "12:00"); expect([n.year, n.month]).toEqual([3, 4]); });
  it("20 Jan 2024 belongs to solar year 2023 → year 4, month 6", () => { const n = nineStarKi("2024-01-20", "12:00"); expect([n.solarYear, n.year, n.month]).toEqual([2023, 4, 6]); });
  it("pair relation", () => { expect(nineStarPair(1, 3).relation).toBe("supports"); expect(nineStarPair(1, 9).relation).toBe("controls"); });
});

describe("Biorhythms", () => {
  it("all cycles start at zero on the birth day", () => { const b = biorhythm("2000-01-01", "2000-01-01"); expect([b.physical, b.emotional, b.intellectual]).toEqual([0, 0, 0]); });
  it("day 7 of the 28-day emotional cycle is the peak", () => { expect(biorhythm("2000-01-01", "2000-01-08").emotional).toBe(100); });
  it("sync is 100 for twins and 0 at half a cycle", () => { expect(biorhythmSync("2000-01-01", "2000-01-01").physical).toBe(100); expect(biorhythmSync("2000-01-01", "2000-01-15").emotional).toBe(0); });
});

describe("Solar return", () => {
  it("Sun is back at the natal longitude within a day of the birthday", () => {
    const natal = longitude("sun", new Date("1990-07-04T10:00Z"));
    const sr = solarReturn(natal, 2026, 7, { lat: 41.9981, lon: 21.4254, name: "Skopje" });
    expect(angDiff(longitude("sun", sr.utc), natal)).toBeLessThan(0.001);
    expect(Math.abs(sr.utc.getTime() - Date.UTC(2026, 6, 4, 10))).toBeLessThan(86400000);
    expect(sr.asc).not.toBeNull();
  });
});

describe("Degree symbols (Charubel 1898)", () => {
  it("has 360 slots; 1st degree of Aries is the ploughman", () => { expect(CHARUBEL.length).toBe(360); expect(degreeSymbol(0.4).image).toMatch(/ploughing/); expect(degreeSymbol(0.4).degree).toBe(1); });
  it("29°30′ Pisces is the 30th degree", () => { expect(degreeSymbol(359.5).degree).toBe(30); });
  it("flags harsh pictures", () => { expect(degreeSymbol(36.5).heavy).toBe(true); });
});

describe("Orthodox Easter and name days (Macedonian Orthodox Church calendar)", () => {
  it.each([[2023, 4, 16], [2024, 5, 5], [2025, 4, 20], [2026, 4, 12]])("Easter %i = %i/%i", (y, m, d) => { expect(orthodoxEaster(y)).toEqual({ m, d }); });
  it("Goce, Gjorgji and Ѓорѓи → St George, 6 May", () => { for (const n of ["Goce Delev", "Gjorgji", "Ѓорѓи", "George"]) expect(nameDay(n, new Date(2026, 0, 1))?.feast).toBe("gjurgjovden"); expect(feastDate("gjurgjovden", 2026)).toEqual({ m: 5, d: 6 }); });
  it("Nikola → 19 Dec, Todor (2026) → Todorova sabota 28 Feb", () => { expect(nameDay("Nikola", new Date(2026, 0, 1))?.date).toEqual({ m: 12, d: 19 }); expect(nameDay("Todor", new Date(2026, 0, 1))?.date).toEqual({ m: 2, d: 28 }); });
  it("unknown names return null", () => { expect(nameDay("Xyzzy")).toBeNull(); });
  it("birth feast within 20 days", () => { expect(birthFeast("1998-05-06")?.feast).toBe("gjurgjovden"); });
});

describe("Cultural lens ordering", () => {
  it("born in Skopje → Slavic month and name day featured first", () => { const r = cultureOrder({ birthTz: "Europe/Skopje", locale: "en" }); expect(r.country).toBe("MK"); expect(r.order.slice(0, 2)).toEqual(["slavic", "nameday"]); expect(r.why.slavic).toEqual(["birthplace"]); });
  it("born in Tokyo → Nine Star Ki first; Kolkata → Vedic first", () => { expect(cultureOrder({ birthTz: "Asia/Tokyo" }).order[0]).toBe("ninestar"); expect(cultureOrder({ birthTz: "Asia/Kolkata" }).order[0]).toBe("vedic"); });
  it("no match keeps the default order", () => { const r = cultureOrder({ birthTz: "America/New_York", locale: "en" }); expect(r.featured).toEqual([]); expect(r.order[0]).toBe("chiron"); });
  it("suggests Macedonian for MK births", () => { expect(suggestMk({ birthTz: "Europe/Skopje", locale: "en" })).toBe(true); expect(suggestMk({ birthTz: "Europe/Skopje", locale: "mk" })).toBe(false); });
});

describe("computeSystems on a full profile", () => {
  it("Skopje 1998-05-06 10:30", () => {
    const p = buildProfile({ date: "1998-05-06", time: "10:30", place: { name: "Skopje", lat: 41.9981, lon: 21.4254, tz: "Europe/Skopje" }, name: "Gjorgji Delev" });
    const s = computeSystems(p, { firstName: "Goce", today: new Date(2026, 9, 12) });
    expect(s.chiron?.sign).toBe("scorpio"); // Chiron was in Scorpio 1996-1999 (Horizons)
    expect(Math.abs(s.northNode.lon - s.southNode.lon)).toBeCloseTo(180, 5);
    expect(s.nameDay?.feast).toBe("gjurgjovden");
    expect(s.chiron?.house).not.toBeNull();
  });
});

import { pairExtras } from "../src/engine/systems/pair";
import { profileSummary, bookOpeners, bondOpeners, dayLines } from "../src/story/voice";
import { buildSystemCards } from "../src/story/systems";
import { contents } from "../src/content";
describe("Pair extras, voice layer and cards", () => {
  const P = (date: string, time: string | null, name: string) => buildProfile({ date, time, place: { name: "Skopje", lat: 41.9981, lon: 21.4254, tz: "Europe/Skopje" }, name });
  const a = P("1998-05-06", "10:30", "Gjorgji Delev"), b = P("1997-11-20", null, "Ana Petrova");
  const sa = computeSystems(a, { firstName: "Goce" }), sb = computeSystems(b, { firstName: "Ana" });
  it("pair extras are bounded and deterministic", () => { const x = pairExtras(a, sa, b, sb); expect(x.harmony).toBeGreaterThanOrEqual(20); expect(x.spark).toBeLessThanOrEqual(95); expect(pairExtras(a, sa, b, sb)).toEqual(x); });
  for (const loc of ["en", "mk", "de", "sr"] as const) {
    const c = contents[loc];
    it(`[${loc}] every voice line carries at least one why`, () => {
      const lines = [...profileSummary({ c, p: a, sys: sa, name: "Goce", placeName: "Skopje" }), ...Object.values(bookOpeners({ c, p: a, sys: sa, name: "Goce" }, "x")), ...Object.values(bondOpeners({ c, p: a, sys: sa, name: "Goce" }, { c, p: b, sys: sb, name: "Ana" })),
        ...dayLines({ c, p: a, sys: sa, name: "Goce", aura: { weather: "stormy" } }, { bio: { physical: 90, emotional: -90, intellectual: 0, critical: [] }, feast: "gjurgjovden", isNameDay: true, personalDay: 3 })];
      expect(lines.length).toBeGreaterThan(5);
      for (const l of lines) { expect(l.why.filter(Boolean).length).toBeGreaterThan(0); expect(l.text).not.toMatch(/undefined|NaN|\[object/); }
      const summary = profileSummary({ c, p: a, sys: sa, name: "Goce", placeName: "Skopje" });
      expect(summary.filter((l) => l.text.includes("Goce")).length).toBe(1);
    });
    it(`[${loc}] every system card builds with text`, () => {
      const cards = buildSystemCards(b, sb, c, { placeName: "Skopje", firstName: "Ana", locale: loc, today: new Date(2026, 9, 12) });
      for (const [k, card] of Object.entries(cards)) { expect(card, k).not.toBeNull(); expect(card!.value.length).toBeGreaterThan(0); expect(card!.line).not.toMatch(/undefined|NaN/); expect(JSON.stringify(card!.blocks)).not.toMatch(/undefined|NaN/); }
    });
  }
});

describe("Macedonian systems text", () => {
  const en = contents.en.systems, mk = contents.mk.systems;
  const tables = ["chiron", "nodes", "lilith", "solarYear", "daySigns", "tones", "trees", "egypt", "runes", "slavicMonths", "feasts", "trigrams", "hexagrams", "nineStars", "sephirot", "biorhythm", "meta", "chironTheme", "attachLens", "attachNervous"] as const;
  for (const t of tables) it(`mk.${t} is fully translated`, () => {
    for (const k of Object.keys(en[t])) expect(JSON.stringify((mk[t] as Record<string, unknown>)[k]), `${t}.${k}`).not.toBe(JSON.stringify((en[t] as Record<string, unknown>)[k]));
  });
  it("mk ui strings are Cyrillic", () => { for (const [k, v] of Object.entries(mk.ui)) if (typeof v === "string") expect(v, k).toMatch(/[\u0400-\u04FF]/); });
});

describe("lots, number extras and rarity", async () => {
  const { lots, isDayChart } = await import("../src/engine/systems/arabic");
  const { numExtra } = await import("../src/engine/systems/numextra");
  const { lifePathShares } = await import("../src/engine/rarity");
  it("day/night Fortune formula", () => {
    expect(isDayChart(250, 0)).toBe(true); expect(isDayChart(90, 0)).toBe(false);
    expect(lots(250, 100, 0).fortune).toBeCloseTo(210); expect(lots(90, 100, 0).fortune).toBeCloseTo(350);
  });
  it("personal month/day and karmic debt", () => {
    const x = numExtra("1990-03-16", 2, 7, 5, new Date(2026, 9, 12));
    expect(x.personalMonth).toBe(6); expect(x.personalDay).toBe(9); expect(x.karmicDebt).toBe(16); expect(x.maturity).toBe(9);
  });
  it("life path shares sum to 1", () => { expect(Object.values(lifePathShares()).reduce((a, b) => a + b, 0)).toBeCloseTo(1); });
});
