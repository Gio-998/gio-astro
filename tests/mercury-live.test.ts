import { describe, it, expect, vi, afterEach } from "vitest";
import { LOCALES } from "../src/content";
import { liveAnswer, mercuryRetrograde } from "../src/lib/sections/mercury-retrograde";
import { liveIndex } from "../src/lib/live-answer";
import { mercuryNow, mercuryYear } from "../src/engine/sky-calendar";
import { personalYear } from "../src/engine/numerology";
import { YEAR2027_FAQ } from "../src/content/numerology/year2027";
import { numModel } from "../src/lib/numerology";

afterEach(() => vi.useRealTimers());

/** The page's "Is Mercury retrograde right now?" is a list of exact moments the browser compares with its own clock. */
describe("Mercury retrograde: answer for the visitor's clock", () => {
  for (const lang of LOCALES) {
    it(`${lang}: the timeline is in order and has an entry for every stage of every period`, () => {
      const L = liveAnswer(lang, new Date("2027-03-01T12:00:00Z"));
      const t = L.timeline.map((e) => Date.parse(e.from));
      expect(t).toEqual([...t].sort((a, b) => a - b));
      expect(L.timeline.filter((e) => e.retro).length).toBeGreaterThanOrEqual(10);
      expect(L.timeline.every((e) => e.text.length > 20)).toBe(true);
      expect(L.question.length).toBeGreaterThan(10);
    });
    it(`${lang}: at any moment from 2026 to 2028 the browser's pick agrees with the engine's own state, and with the hub's static answer`, () => {
      const L = liveAnswer(lang, new Date());
      const bad: string[] = [];
      for (let t = Date.parse("2026-01-01T00:30:00Z"); t < Date.parse("2028-12-01T00:00:00Z"); t += 13 * 864e5 + 5 * 36e5) {
        const s = mercuryNow(new Date(t)); const e = L.timeline[liveIndex(L.timeline, t)];
        if (e.retro !== (s.state === "retrograde")) bad.push(new Date(t).toISOString());
      }
      expect(bad).toEqual([]);
      vi.useFakeTimers();
      for (const iso of ["2026-11-27T10:00:00Z", "2027-02-10T10:00:00Z", "2027-03-10T10:00:00Z", "2027-06-20T10:00:00Z", "2027-08-15T10:00:00Z"]) {
        vi.setSystemTime(new Date(iso));
        const hub = mercuryRetrograde.model(lang, "/mercury-retrograde/")!;
        expect(hub.live!.timeline[hub.live!.initial].text, iso).toBe(hub.lead);
      }
    });
  }
  it("flips on the exact station moments", () => {
    const p = mercuryYear(2027)[0]; const L = liveAnswer("en", new Date());
    const at = (iso: string, ms: number) => Date.parse(iso) + ms;
    expect(L.timeline[liveIndex(L.timeline, at(p.retro.at, -1000))].retro).toBe(false);
    expect(L.timeline[liveIndex(L.timeline, at(p.retro.at, 1000))].retro).toBe(true);
    expect(L.timeline[liveIndex(L.timeline, at(p.direct.at, -1000))].retro).toBe(true);
    expect(L.timeline[liveIndex(L.timeline, at(p.direct.at, 1000))].retro).toBe(false);
  });
  it("2027 has three periods: February 9, June 10, October 7", () => {
    expect(mercuryYear(2027).map((p) => p.retro.iso)).toEqual(["2027-02-09", "2027-06-10", "2027-10-07"]);
  });
  it("year pages carry the live answer too, the hub shows it as its lead", () => {
    expect(mercuryRetrograde.model("de", "/mercury-retrograde/2027/")!.live).toBeTruthy();
    expect(mercuryRetrograde.model("sr", "/mercury-retrograde/")!.live).toBeTruthy();
  });
});

describe("personal year 2027 FAQ", () => {
  it("the worked example in the hub answer is right: born March 14, personal year 1", () => { expect(personalYear("1990-03-14", 2027)).toBe(1); });
  it("hub has three questions and every number page three questions answered from its own sections, in all four languages", () => {
    for (const lang of LOCALES) {
      expect(YEAR2027_FAQ[lang].hub.length).toBe(3);
      const hub = numModel(lang, "/numerology/personal-year-2027/")!; expect(hub.faq.length).toBe(3);
      for (let n = 1; n <= 9; n++) {
        const m = numModel(lang, `/numerology/personal-year-2027/${n}/`)!;
        expect(m.faq.map(([q]) => q)).toEqual([YEAR2027_FAQ[lang].you(n), YEAR2027_FAQ[lang].love(n), YEAR2027_FAQ[lang].work(n)]);
        expect(m.faq.every(([, a]) => a.split(/\s+/).length >= 15)).toBe(true);
      }
    }
  });
});
