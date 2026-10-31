import { describe, it, expect } from "vitest";
import { YEARLY, YEARLY_HUB } from "../src/content/yearly2027";
import { YEAR2027 } from "../src/content/numerology/year2027";
import { YEARLY_SIGNS, yearly, mainDates } from "../src/lib/sections/horoscope-2027";
import { SKY2027 } from "../src/lib/sky2027";
import { getContent } from "../src/content";
import { localizedPath } from "../src/lib/i18n-routes";
import { SIGNS, type Sign } from "../src/engine/zodiac";
import { LANGS, MAX_JACCARD, MIN_WORDS, datesIn, jaccard, lintFacts, lintPage, pageText, sentences, shingles, skyIndex, words } from "./yearly2027-lint";

/** Twelve signs, one year, the same sky: the pages most at risk of reading as a template. Each must stand on its own, and every fact must trace to the computed sky. */
describe("yearly 2027 pages: facts, overlap and depth", () => {
  it("all 12 signs are written in every language", () => {
    expect(YEARLY_SIGNS).toEqual([...SIGNS]);
    for (const l of LANGS) expect(Object.keys(YEARLY[l]).sort()).toEqual([...SIGNS].sort());
  });
  it("only finished signs are routed, hub first", () => {
    expect(yearly.paths()).toEqual(["/horoscope-2027/", ...YEARLY_SIGNS.map((s) => `/horoscope-2027/${s}/`)]);
    expect(yearly.model("en", "/horoscope-2027/nope/")).toBeNull();
  });
  for (const l of LANGS) {
    const page = (s: Sign) => YEARLY[l][s]!;
    it(`${l}: every page passes the fact, framing and style lint`, () => {
      const c = getContent(l); const bad = YEARLY_SIGNS.flatMap((s) => lintPage(l, s, page(s), c.astro.signs[s].name).map((b) => `${s}: ${b}`));
      expect(bad).toEqual([]);
    });
    it(`${l}: each page has at least ${MIN_WORDS} words`, () => {
      expect(YEARLY_SIGNS.map((s) => [s, words(pageText(page(s))).length]).filter(([, n]) => (n as number) < MIN_WORDS)).toEqual([]);
    });
    it(`${l}: no two pages share more than ${MAX_JACCARD * 100}% of their phrasing`, () => {
      const sh = Object.fromEntries(YEARLY_SIGNS.map((s) => [s, shingles(words(pageText(page(s))))]));
      const bad: string[] = [];
      YEARLY_SIGNS.forEach((a, i) => YEARLY_SIGNS.slice(i + 1).forEach((b) => { const j = jaccard(sh[a], sh[b]); if (j > MAX_JACCARD) bad.push(`${a}/${b}: ${j.toFixed(3)}`); }));
      expect(bad).toEqual([]);
    });
    it(`${l}: sentences are not reused across signs or copied from personal year pages`, () => {
      const seen = new Map<string, string[]>();
      for (const s of YEARLY_SIGNS) for (const x of new Set(sentences(pageText(page(s))))) seen.set(x, [...(seen.get(x) ?? []), s]);
      expect([...seen.entries()].filter(([, ks]) => ks.length > 1).map(([x, ks]) => `${ks.join(",")}: ${x.slice(0, 60)}`)).toEqual([]);
      const other = new Set(sentences(Object.values(YEAR2027[l]).flatMap((p) => [p.lead, ...p.sections.flatMap((x) => x.paras)]).join(" ")));
      expect([...seen.keys()].filter((x) => other.has(x))).toEqual([]);
    });
    it(`${l}: each sign has its own section order and its own headings`, () => {
      const orders = YEARLY_SIGNS.map((s) => page(s).sections.map((x) => x.role).filter((r, i, a) => r !== a[i - 1]).join(">"));
      expect(new Set(orders).size).toBe(YEARLY_SIGNS.length);
      const titles = YEARLY_SIGNS.flatMap((s) => page(s).sections.map((x) => x.title));
      expect(titles.filter((t, i) => titles.indexOf(t) !== i)).toEqual([]);
    });
    it(`${l}: titles and descriptions are unique and fit a search result`, () => {
      const models = yearly.paths().map((p) => yearly.model(l, p)!);
      expect(models.filter((m) => m.title.length > 55 || m.description.length < 120 || m.description.length > 155).map((m) => `${m.path} ${m.title.length} ${m.description.length}`)).toEqual([]);
      expect(new Set(models.map((m) => m.title)).size).toBe(models.length);
      expect(new Set(models.map((m) => m.description)).size).toBe(models.length);
    });
    it(`${l}: every sign page links to the sections the family promises`, () => {
      for (const s of YEARLY_SIGNS) {
        const hrefs = yearly.model(l, `/horoscope-2027/${s}/`)!.related!.map((r) => r.href);
        for (const p of [`/zodiac/${s}/`, `/horoscope/${s}/`, `/weekly-horoscope/${s}/`, `/monthly-horoscope/${s}/`, "/numerology/personal-year-2027/", "/mercury-retrograde/"]) expect(hrefs).toContain(localizedPath(l, p));
      }
    });
    it(`${l}: the hub lists all 12 signs, and its dates are the computed ones`, () => {
      const H = YEARLY_HUB[l]; const hub = yearly.model(l, "/horoscope-2027/")!; const idx = skyIndex();
      expect(hub.items!.length).toBe(12);
      const copy = [H.description, H.lead, ...H.bigPicture.paras, H.datesIntro, ...H.howTo.paras, H.method.para, ...H.faq.flat()];
      expect(copy.flatMap((c) => lintFacts(l, c))).toEqual([]);
      const list = mainDates(H); expect(list.length).toBeGreaterThanOrEqual(15);
      for (const line of list) for (const d of datesIn(l, line)) expect(idx.has(d), line).toBe(true);
    });
  }
  it("the hub date list carries every Jupiter, Saturn, Mars and Mercury station of 2027, and all five eclipses", () => {
    const list = mainDates(YEARLY_HUB.en).join("\n");
    for (const x of SKY2027.stations.filter((v) => ["jupiter", "saturn", "mars", "mercury"].includes(v.body) && v.date.startsWith("2027"))) expect(list).toContain(`${x.deg}°`);
    expect(list.match(/eclipse/g)!.length).toBe(5);
  });
});
