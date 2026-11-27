import { describe, it, expect } from "vitest";
import { LOCALES } from "../src/content";
import { ANGEL, MIRROR_KEYS, numLastModified, numModel, numPaths } from "../src/lib/numerology";
import { numLd } from "../src/lib/num-ld";
import { modelMeta } from "../src/components/numerology/NumPage";
import { localizedPath } from "../src/lib/i18n-routes";
import { CONTENT_DATES } from "../src/lib/content-dates";

const hrefs = (lang: string, path: string) => (numModel(lang, path)?.related ?? []).map((r) => r.href);
const twin = (a: string) => `${a.slice(0, 2)}-${a.slice(2)}`;
const pairs = ANGEL.filter((a) => a.length === 4 && a.slice(0, 2) === a.slice(2) && MIRROR_KEYS.includes(twin(a)));

/** Number searches that touch two pages: one main URL per form, each linking to the other with the form people type. */
describe("number topics: one main page per query form", () => {
  it("11:11 and 1111, 12:12 and 1212, and the other repeated hours have a twin on both sides", () => {
    expect(pairs).toContain("1111"); expect(pairs).toContain("1212"); expect(pairs.length).toBeGreaterThanOrEqual(8);
  });
  for (const lang of LOCALES) {
    it(`${lang}: each angel number page links to its mirror hour page, and the mirror hour page links back`, () => {
      const bad: string[] = [];
      for (const a of pairs) {
        const angel = `/numerology/angel-numbers/${a}/`; const mirror = `/numerology/mirror-hours/${twin(a)}/`;
        if (hrefs(lang, angel)[0] !== localizedPath(lang, mirror)) bad.push(`${angel} does not lead with ${mirror}`);
        if (!hrefs(lang, mirror).includes(localizedPath(lang, angel))) bad.push(`${mirror} does not link ${angel}`);
        const label = numModel(lang, angel)!.related![0].label; if (!label.includes(twin(a).replace("-", ":"))) bad.push(`${angel}: anchor "${label}" lacks the clock form`);
      }
      expect(bad).toEqual([]);
    });
    it(`${lang}: both pages of a pair keep their own canonical and are listed in the hubs`, () => {
      for (const a of pairs) for (const p of [`/numerology/angel-numbers/${a}/`, `/numerology/mirror-hours/${twin(a)}/`]) {
        const meta = modelMeta(lang, numModel(lang, p)!); expect(meta.alternates!.canonical).toBe(localizedPath(lang, p));
      }
      expect(hrefs(lang, "/numerology/angel-numbers/")).toContain(localizedPath(lang, "/numerology/mirror-hours/"));
      expect(hrefs(lang, "/numerology/mirror-hours/")).toContain(localizedPath(lang, "/numerology/angel-numbers/"));
    });
    it(`${lang}: the master number 11 and 22 pages point to the clock pages`, () => {
      for (const n of [11, 22]) expect(hrefs(lang, `/numerology/life-path/${n}/`)).toContain(localizedPath(lang, `/numerology/mirror-hours/${n}-${n}/`));
    });
    it(`${lang}: "calculate" has one main page (the calculator) and "meaning" another (the life path hub), and they link each other`, () => {
      expect(hrefs(lang, "/numerology/life-path/")).toContain(localizedPath(lang, "/numerology/calculator/life-path/"));
      expect(hrefs(lang, "/numerology/calculator/life-path/")).toContain(localizedPath(lang, "/numerology/life-path/"));
    });
    it(`${lang}: the calculator page leads with a 40 to 60 word answer and a table of all twelve numbers`, () => {
      const m = numModel(lang, "/numerology/calculator/life-path/")!;
      const n = m.answer!.text.split(/\s+/).length; expect(n).toBeGreaterThanOrEqual(40); expect(n).toBeLessThanOrEqual(60);
      const t = m.blocks.find((b) => b.id === "overview")!.table!; expect(t.rows.length).toBe(12);
      expect(t.rows.map((r) => (r[0] as { text: string }).text)).toEqual(["1", "2", "3", "4", "5", "6", "7", "8", "9", "11", "22", "33"]);
      for (const r of t.rows) expect(typeof (r[0] as { href: string }).href).toBe("string");
    });
    it(`${lang}: the mirror hour hub and the pair hub keep no FAQ of their own (the personal year FAQ belongs to its pages)`, () => {
      expect(numModel(lang, "/numerology/mirror-hours/")!.faq).toEqual([]);
      expect(numModel(lang, "/numerology/compatibility/")!.faq).toEqual([]);
    });
  }
  it("a changed page carries today's date, an untouched one keeps the family date", () => {
    expect(numLastModified("/numerology/calculator/life-path/")).toBe("2026-11-27");
    expect(numLastModified("/numerology/angel-numbers/1111/")).toBe("2026-11-27");
    expect(numLastModified("/numerology/angel-numbers/333/")).toBe(CONTENT_DATES.numerology);
    expect(numLastModified("/numerology/mirror-hours/11-11/")).toBe(CONTENT_DATES.numerology);
    const m = numModel("de", "/numerology/calculator/life-path/")!;
    expect((numLd("de", m).find((n) => (n as { "@type": string })["@type"] === "WebPage") as { dateModified: string }).dateModified).toBe("2026-11-27");
  });
  it("every numerology path still resolves", () => { for (const p of numPaths()) expect(numModel("en", p), p).not.toBeNull(); });
});
