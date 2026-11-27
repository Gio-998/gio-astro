import { describe, it, expect } from "vitest";
import { bankFor } from "@/lib/horoscope";
import { dayMeta } from "@/components/horoscope/routes";
import { SIGNS } from "@/engine/zodiac";
import { getContent } from "@/content";

/** German sign pages (/de/tageshoroskop/<sign>/) follow the Serbian daily template: the phrase people type, "heute" and the date. */
const B = bankFor("de");
const names = SIGNS.map((s) => getContent("de").astro.signs[s].name);
const unbranded = (m: { title?: unknown }) => (m.title as { absolute: string }).absolute.replace(/ · [^·]+$/, "");

describe("German daily sign pages", () => {
  it("title says Tageshoroskop, the sign, heute and today's date, and fits a search result", async () => {
    for (const s of SIGNS) {
      const t = unbranded(await dayMeta("de", B.signSlug[s]));
      expect(t, t).toMatch(new RegExp(`^Tageshoroskop ${getContent("de").astro.signs[s].name} heute, \\d{1,2}\\. \\S+ \\d{4}$`));
      expect(t.length, t).toBeLessThanOrEqual(55);
    }
    expect(`${B.ui.shortTitle("Wassermann")}, 30. September 2026`.length).toBeLessThanOrEqual(55);
  });
  it("each sign has its own description, 110 to 158 characters, with the search phrase first", () => {
    const d = names.map((n) => B.ui.signHubMeta(n));
    expect(new Set(d).size).toBe(12);
    for (const [i, x] of d.entries()) {
      expect(x.length, x).toBeGreaterThanOrEqual(110); expect(x.length, x).toBeLessThanOrEqual(158);
      expect(x.startsWith(`Tageshoroskop ${names[i]} heute`), x).toBe(true);
    }
  });
});

describe("today heading on the sign page", () => {
  it("German and Macedonian sign pages say heute or денес in the heading, dated pages keep their own", async () => {
    const { renderToStaticMarkup } = await import("react-dom/server");
    const { createElement } = await import("react");
    const { DailyHoroscope } = await import("@/components/horoscope/DailyHoroscope");
    const h1 = (lang: string, isToday: boolean) => renderToStaticMarkup(createElement(DailyHoroscope, { lang, sign: "aries", iso: "2026-11-27", isToday })).match(/<h1[^>]*>(.*?)<\/h1>/)![1].replace(/\u00A0/g, " ");
    expect(h1("de", true)).toBe("Tageshoroskop Widder heute, 27. November 2026");
    expect(h1("de", false)).toBe("Tageshoroskop Widder, 27. November 2026");
    expect(h1("mk", true)).toBe("Хороскоп за Овен денес, 27 ноември 2026");
    expect(h1("mk", false)).toBe("Хороскоп за Овен, 27 ноември 2026");
  });
});
