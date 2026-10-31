import { describe, it, expect } from "vitest";
import { DateTime } from "luxon";
import { computeChart, longitude } from "../src/engine/astro";
import { dayChange, moonOfBirth, risingOfBirth, withDeviceZone } from "../src/engine/calculators";
import { resolveBirthTime } from "../src/engine/time";
import { formatDegree, signFromLongitude } from "../src/engine/zodiac";
import { lifePath } from "../src/engine/numerology";
import { CALCULATORS } from "../src/content/calculators";
import { pageLong } from "../src/content/numerology/long";

const place = (name: string, lat: number, lon: number, tz: string) => ({ name, lat, lon, tz });
const MANCHESTER = place("Manchester", 53.4808, -2.2426, "Europe/London");
const MUNICH = place("Munich", 48.1372, 11.5755, "Europe/Berlin");
const SKOPJE = place("Skopje", 41.9981, 21.4254, "Europe/Skopje");
const LONDON = place("London", 51.5074, -0.1278, "Europe/London");
const NEW_YORK = place("New York", 40.7, -74, "America/New_York");
const SYDNEY = place("Sydney", -33.87, 151.21, "Australia/Sydney");
const HAMBURG = place("Hamburg", 53.5511, 9.9937, "Europe/Berlin");
const BITOLA = place("Bitola", 41.0297, 21.3292, "Europe/Skopje");

describe("rising sign", () => {
  it("matches published reference charts", () => {
    // Astrotheme values, see tests/chart.test.ts.
    expect(risingOfBirth({ date: "1926-04-21", time: "02:40", place: place("London", 51.5167, -0.15, "Europe/London") }).sign).toBe("capricorn");
    expect(risingOfBirth({ date: "1961-08-04", time: "19:24", place: place("Honolulu", 21.3, -157.8667, "Pacific/Honolulu") }).sign).toBe("aquarius");
    expect(risingOfBirth({ date: "1996-11-07", time: "10:00", place: place("Takapuna", -36.7833, 174.7667, "Pacific/Auckland") }).sign).toBe("capricorn");
  });
  it("gives the window of birth times that share the sign", () => {
    const r = risingOfBirth({ date: "1992-09-21", time: "08:15", place: MANCHESTER });
    expect([r.sign, r.from, r.to, r.near]).toEqual(["libra", "07:08", "10:03", null]);
    const just = (time: string) => risingOfBirth({ date: "1992-09-21", time, place: MANCHESTER }).sign;
    expect(just("07:08")).toBe("libra"); expect(just("07:07")).toBe("virgo");
    expect(just("10:02")).toBe("libra"); expect(just("10:03")).toBe("scorpio");
  });
  it("warns when the birth minute is close to the next sign", () => {
    expect(risingOfBirth({ date: "1994-03-09", time: "06:20", place: SKOPJE }).near).toBe("aries");
    expect(risingOfBirth({ date: "1996-08-18", time: "11:10", place: BITOLA }).near).toBe("scorpio");
  });
  it("agrees with the chart engine and leaves polar latitudes open instead of inventing a window", () => {
    const input = { date: "1988-06-14", time: "07:40", place: MUNICH };
    expect(risingOfBirth(input).lon).toBeCloseTo(computeChart(input).placements.asc!.lon, 6);
    expect(() => risingOfBirth({ date: "1990-06-21", time: "12:00", place: place("Svalbard", 78.2, 15.6, "Arctic/Longyearbyen") })).not.toThrow();
  });
});

describe("moon sign", () => {
  it("reports the minute the Moon changed sign on the birth day", () => {
    expect(dayChange("moon", { date: "1993-05-03", time: null, place: LONDON })).toEqual({ from: "virgo", to: "libra", at: "02:20" });
  });
  it("finds the change where the Moon's longitude crosses a sign boundary", () => {
    const input = { date: "1993-05-03", time: null, place: LONDON };
    const lonAt = (time: string) => longitude("moon", resolveBirthTime({ ...input, time }).utc);
    expect(lonAt("02:19")).toBeLessThan(180); expect(lonAt("02:20")).toBeGreaterThanOrEqual(180);
  });
  it("needs no birth time when the Moon stayed put, and agrees with the chart engine", () => {
    const input = { date: "1993-05-04", time: null, place: LONDON };
    expect(moonOfBirth(input).change).toBeNull();
    expect(computeChart(input).moonAmbiguous).toBe(false);
    expect(computeChart({ date: "1993-05-03", time: null, place: LONDON }).moonAmbiguous).toBe(true);
  });
  it("a known time decides the sign on a change day", () => {
    const at = (time: string) => moonOfBirth({ date: "1993-05-03", time, place: LONDON });
    expect(at("01:00").sign).toBe("virgo"); expect(at("08:00").sign).toBe("libra"); expect(at("08:00").change?.at).toBe("02:20");
  });
  it("the same event falls on another calendar day in another zone", () => {
    expect(dayChange("moon", { date: "1993-05-02", time: null, place: NEW_YORK })).toEqual({ from: "virgo", to: "libra", at: "21:20" });
    expect(dayChange("moon", { date: "1993-05-02", time: null, place: LONDON })).toBeNull();
  });
  it("reads a place-less day in the device zone without inventing a place", () => {
    const zoned = withDeviceZone({ date: "1993-05-03", time: null }, "Europe/London");
    expect([zoned.place, zoned.utcOffsetOverride]).toEqual([undefined, 1]);
    expect(dayChange("moon", zoned)?.at).toBe("02:20");
    expect(computeChart({ ...zoned, time: "12:00" }).hasAngles).toBe(false);
  });
  it("leaves an input with a place or a manual offset alone", () => {
    const a = { date: "1993-05-03", time: null, place: LONDON }; const b = { date: "1993-05-03", time: null, utcOffsetOverride: 2 };
    expect(withDeviceZone(a, "Asia/Tokyo")).toBe(a); expect(withDeviceZone(b, "Asia/Tokyo")).toBe(b);
  });
});

describe("birth chart", () => {
  it("places planets, houses and retrograde marks", () => {
    const P = computeChart({ date: "1990-11-03", time: "21:05", place: LONDON }).placements;
    expect([P.sun!.sign, P.sun!.house, P.moon!.sign, P.moon!.house, P.asc!.sign]).toEqual(["scorpio", 5, "taurus", 11, "cancer"]);
    expect([P.mars!.sign, P.mars!.house, P.mars!.retrograde]).toEqual(["gemini", 12, true]);
    expect(P.jupiter!.retrograde).toBe(false);
  });
  it("gives no rising sign or houses without a birth time", () => {
    const c = computeChart({ date: "1990-11-03", time: null, place: LONDON });
    expect(c.hasAngles).toBe(false); expect(c.placements.asc).toBeUndefined(); expect(c.placements.sun!.house).toBeUndefined();
  });
  it("the Sun changing sign that day is reported too", () => {
    expect(dayChange("sun", { date: "1990-11-22", time: null, place: LONDON })).toEqual({ from: "scorpio", to: "sagittarius", at: "13:48" });
  });
});

/** The numbers printed in the page copy, recomputed, so the copy can never drift from the engine. */
describe("worked examples in the copy", () => {
  const has = (lang: string, key: "rising-sign" | "moon-sign" | "birth-chart", s: string) => expect(JSON.stringify(CALCULATORS[lang].pages[key])).toContain(s);
  const deg = (lon: number) => formatDegree(lon);
  it("en rising: Manchester", () => {
    const r = risingOfBirth({ date: "1992-09-21", time: "08:15", place: MANCHESTER });
    expect(resolveBirthTime({ date: "1992-09-21", time: "08:15", place: MANCHESTER }).utc.toISOString()).toBe("1992-09-21T07:15:00.000Z");
    has("en", "rising-sign", `${deg(r.lon)} of Libra`); has("en", "rising-sign", `${r.from} to ${r.to}`);
    expect(risingOfBirth({ date: "1992-09-21", time: "20:15", place: MANCHESTER }).sign).toBe("taurus");
  });
  it("de rising: Munich, with and without summer time", () => {
    const r = risingOfBirth({ date: "1988-06-14", time: "07:40", place: MUNICH });
    has("de", "rising-sign", `${deg(r.lon)} Krebs`); has("de", "rising-sign", `von ${r.from} bis ${r.to} Uhr`);
    const off = risingOfBirth({ date: "1988-06-14", time: "07:40", place: MUNICH, utcOffsetOverride: 1 });
    expect(off.sign).toBe("leo"); has("de", "rising-sign", `${deg(off.lon)} Löwe`);
  });
  it("de rising: summer time history", () => {
    const offset = (iso: string) => DateTime.fromISO(`${iso}T12:00`, { zone: "Europe/Berlin" }).offset / 60;
    expect(offset("1947-06-01")).toBe(3); expect(offset("1979-07-01")).toBe(1); expect(offset("1980-07-01")).toBe(2);
  });
  it("mk rising: Skopje, half an hour apart", () => {
    const at = (time: string) => risingOfBirth({ date: "1994-03-09", time, place: SKOPJE });
    const r = at("06:20"); expect(r.sign).toBe("pisces");
    has("mk", "rising-sign", `${deg(r.lon)} Риби`); has("mk", "rising-sign", `од ${r.from} до ${r.to}`);
    has("mk", "rising-sign", `${deg(at("06:15").lon)} Риби`); expect(at("06:30").sign).toBe("aries"); has("mk", "rising-sign", `${deg(at("06:30").lon)} Овен`);
  });
  it("moon pages", () => {
    has("en", "moon-sign", "02:20"); has("en", "moon-sign", "21:20");
    expect(dayChange("moon", { date: "1988-06-14", time: null, place: MUNICH })).toEqual({ from: "gemini", to: "cancer", at: "23:19" }); has("de", "moon-sign", "23:19");
    expect(dayChange("moon", { date: "1988-06-15", time: null, place: SYDNEY })).toEqual({ from: "gemini", to: "cancer", at: "07:19" }); has("de", "moon-sign", "07:19");
    expect(dayChange("moon", { date: "1982-04-02", time: null, place: SKOPJE })).toEqual({ from: "cancer", to: "leo", at: "14:37" }); has("mk", "moon-sign", "14:37");
    expect(dayChange("moon", { date: "1982-04-03", time: null, place: SYDNEY })).toEqual({ from: "cancer", to: "leo", at: "00:37" }); has("mk", "moon-sign", "00:37");
  });
  it("chart pages", () => {
    const en = computeChart({ date: "1990-11-03", time: "21:05", place: LONDON }).placements;
    for (const [p, s] of [[en.sun, "Scorpio"], [en.moon, "Taurus"], [en.asc, "Cancer"], [en.mars, "Gemini"], [en.mc, "Pisces"]] as const) has("en", "birth-chart", `${deg(p!.lon)} ${s}`);
    expect(en.mc!.house).toBe(9);
    const de = computeChart({ date: "1985-04-27", time: "16:30", place: HAMBURG }).placements;
    for (const [p, s] of [[de.sun, "Stier"], [de.moon, "Löwe"], [de.asc, "Jungfrau"], [de.saturn, "Skorpion"], [de.mc, "Zwillinge"]] as const) has("de", "birth-chart", `${deg(p!.lon)} ${s}`);
    expect([de.sun!.house, de.moon!.house, de.saturn!.house, de.mc!.house]).toEqual([9, 12, 3, 10]);
    expect([de.saturn!.retrograde, de.uranus!.retrograde, de.neptune!.retrograde, de.pluto!.retrograde]).toEqual([true, true, true, true]);
    expect(dayChange("moon", { date: "1985-04-27", time: null, place: HAMBURG })).toEqual({ from: "cancer", to: "leo", at: "16:11" });
    const mk = computeChart({ date: "1996-08-18", time: "11:10", place: BITOLA }).placements;
    for (const [p, s] of [[mk.sun, "Лав"], [mk.moon, "Вага"], [mk.asc, "Вага"], [mk.jupiter, "Јарец"], [mk.saturn, "Овен"], [mk.mc, "Лав"]] as const) has("mk", "birth-chart", `${deg(p!.lon)} ${s}`);
    expect([mk.sun!.house, mk.moon!.house, mk.jupiter!.house, mk.saturn!.house, mk.mc!.house]).toEqual([11, 1, 4, 7, 11]);
    expect([mk.jupiter!.retrograde, mk.saturn!.retrograde]).toEqual([true, true]);
    expect(risingOfBirth({ date: "1996-08-18", time: "11:10", place: BITOLA }).to).toBe("11:19");
  });
  it("same instant, different rising sign", () => {
    const at = (p: typeof LONDON) => { const r = risingOfBirth({ date: "1990-01-15", time: "12:00", place: p, utcOffsetOverride: 0 }); return `${deg(r.lon)} ${r.sign}`; };
    expect(at(LONDON)).toBe("21°11′ taurus"); expect(at(place("Berlin", 52.52, 13.405, "Europe/Berlin"))).toBe("11°45′ gemini"); expect(at(SKOPJE)).toBe("8°54′ gemini");
  });
  it("sign boundaries really land in the zodiac", () => expect(signFromLongitude(180)).toBe("libra"));
  it("life path examples", () => {
    expect(lifePath("1985-07-23").value).toBe(8); expect(lifePath("1987-11-29").value).toBe(11); expect(lifePath("2000-09-11").value).toBe(22);
    expect(lifePath("0085-07-23").value).toBe(7); // the shortened year in the mistakes section
    expect(lifePath("1985-07-23").sum).toBe("7 → 7, 23 → 5, 1985 → 5: 7 + 5 + 5 = 17 → 8");
    expect(lifePath("2000-09-11").sum).toBe("9 → 9, 11 → 11, 2000 → 2: 9 + 11 + 2 = 22");
    for (const l of ["en", "mk", "de", "sr"]) expect(pageLong(l, "calculator/life-path").length).toBeGreaterThanOrEqual(4);
  });
});
