import { describe, it, expect } from "vitest";
import { LOCALES, getContent } from "@/content";
import { ALL_QUIZ_IDS } from "@/lib/quiz-defs";
import { localizedPath } from "@/lib/i18n-routes";
import { SITE_URL } from "@/lib/site-url";
import { isIndexable } from "@/lib/seo";
import { adaptive as aEn } from "@/content/en/adaptive";
import { adaptive as aMk } from "@/content/mk/adaptive";
import { adaptive as aDe } from "@/content/de/adaptive";
import { adaptive as aSr } from "@/content/sr/adaptive";
import sitemap from "@/app/sitemap";

const urls = new Set(sitemap().map((e) => e.url));
const A = { en: aEn, mk: aMk, de: aDe, sr: aSr };
const inSitemap = (l: string, p: string) => urls.has(`${SITE_URL}${localizedPath(l, p)}`);

describe("the open tools in search", () => {
  const paths = ["/quizzes/", "/start/", "/match/", "/bond/", "/deep/", ...ALL_QUIZ_IDS.map((q) => `/quiz/${q}/`)];
  it.each(paths)("%s is indexable and in the sitemap in every language", (p) => {
    expect(isIndexable(p)).toBe(true);
    for (const l of LOCALES) expect(inSitemap(l, p), `${l} ${p}`).toBe(true);
  });
  it.each(["/me/", "/today/", "/people/", "/you/", "/person/", "/book/", "/chart/", "/lens/", "/account/", "/admin/"])("%s stays out of the sitemap", (p) => {
    for (const l of LOCALES) expect(inSitemap(l, p), `${l} ${p}`).toBe(false);
  });

  for (const l of LOCALES) {
    const c = getContent(l); const M = c.ui.pageMeta; const T = c.ui.tests.meta;
    const pages: [string, { title: string; description?: string }][] = [["start", M.start], ["match", M.match], ["bond", M.bond], ["quizzes", M.quizzes], ["deep", A[l].meta], ...ALL_QUIZ_IDS.map((q) => [q, T[q]] as [string, { title: string; description: string }])];
    it.each(pages)(`${l}: %s has a search-ready title and description`, (_, m) => {
      expect(m.title.length, m.title).toBeLessThanOrEqual(55);
      expect(m.description!.length, m.description).toBeGreaterThanOrEqual(120);
      expect(m.description!.length, m.description).toBeLessThanOrEqual(155);
    });
    it(`${l}: every description is its own`, () => {
      const d = pages.map(([, m]) => m.description); expect(new Set(d).size).toBe(d.length);
      const t = pages.map(([, m]) => m.title); expect(new Set(t).size).toBe(t.length);
    });
  }
  it("is written in each language, not copied", () => {
    for (const q of ALL_QUIZ_IDS) {
      expect(getContent("mk").ui.tests.meta[q].description).not.toBe(getContent("en").ui.tests.meta[q].description);
      expect(getContent("de").ui.tests.meta[q].description).not.toBe(getContent("en").ui.tests.meta[q].description);
      expect(getContent("mk").ui.tests.meta[q].title).toMatch(/\p{Script=Cyrillic}/u);
    }
  });
});

describe("what the reader is told", () => {
  const flat = (o: unknown): string => (typeof o === "string" ? o : typeof o === "function" ? "" : o && typeof o === "object" ? Object.values(o).map(flat).join(" ") : "");
  for (const l of LOCALES) {
    const c = getContent(l);
    const copy = flat({ hub: c.ui.quizHub, quiz: c.ui.quiz, tests: c.ui.tests, start: c.ui.quickStart, me: c.ui.me, m: [c.ui.pageMeta.quizzes, c.ui.pageMeta.start, c.ui.pageMeta.match] });
    it(`${l}: says test, not quiz, lens or codex`, () => {
      expect(copy).not.toMatch(/\bquiz|\blens|\bcodex|kodex|квиз|кодекс|\bQuiz/i);
    });
    it(`${l}: never promises an email or an instant full result`, () => {
      expect(copy).not.toMatch(/no email|by email|we'll email|keine E-Mail|per E-Mail|без е-пошта|на е-пошта|right away|sofort da|веднаш штом/i);
    });
    it(`${l}: never asks for a birth date before a test`, () => {
      expect(flat(c.ui.quiz)).not.toMatch(/birth date|Geburtsdatum|датумот на раѓање/i);
    });
  }
});
