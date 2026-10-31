import { describe, it, expect, vi } from "vitest";
import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LOCALES, getContent, type Content } from "@/content";
import { glance as en } from "@/content/en/glance";
import { glance as mk } from "@/content/mk/glance";
import { glance as de } from "@/content/de/glance";
import { adaptive as aEn } from "@/content/en/adaptive";
import { adaptive as aMk } from "@/content/mk/adaptive";
import { adaptive as aDe } from "@/content/de/adaptive";
import { buildProfile, quizLayer, type QuizResults } from "@/engine/profile";
import { nextItem, scoreAdaptive, type AAnswer } from "@/engine/adaptive";
import { ALL_QUIZ_IDS, PRECISION_QUIZ_IDS, QUIZ_IDS, quizDefs } from "@/lib/quiz-defs";
import { profileOf, quizViewOf } from "@/lib/profile";
import { teaserFor } from "@/lib/test-teaser";
import { TEST_RUN } from "@/lib/test-run";
import type { StoredPerson } from "@/lib/store";
import { ContentProvider } from "@/lib/content-context";
import { ResultGate, ResultsGate } from "@/components/tests/ResultGate";
import { QuizResultView } from "@/components/ProfileView";
import { PrecisionResultView } from "@/components/PrecisionResult";
import { DeepResultBody } from "@/components/adaptive/DeepRead";
import { UnifiedGlance } from "@/components/adaptive/UnifiedGlance";

// The lead agent owns the form. Here the gate only shows what it is handed, so we can check the contract from this side.
vi.mock("@/components/lead/LeadGate", () => ({
  LeadGate: ({ source, preview, children }: { source: string; preview?: ReactNode; children: ReactNode }) => createElement("section", { "data-gate": source }, createElement("aside", null, preview), createElement("main", null, children)),
}));
const render = (el: ReactNode) => renderToStaticMarkup(createElement(ContentProvider, { locale: "en", children: el }));

const G = { en, mk, de }; const A = { en: aEn, mk: aMk, de: aDe };
function everyResult(c: Content): QuizResults {
  const defs = quizDefs(c); let q: QuizResults = {};
  for (const id of ALL_QUIZ_IDS) q = { ...q, ...defs[id].score(Object.fromEntries(defs[id].items.map((it, i) => [it.id, it.kind === "choice" ? i % 2 : (i % 4) + 1]))) };
  const seq: AAnswer[] = []; for (let it = nextItem(seq); it; it = nextItem(seq)) seq.push({ id: it.id, v: seq.length % 3 ? 1 : 2, ms: 2000 });
  return { ...q, adaptive: scoreAdaptive(seq) };
}
const guest = (quiz: QuizResults): StoredPerson => ({ id: "me", name: "", date: "", time: null, place: null, quiz, createdAt: "x" });

describe("result teasers", () => {
  for (const l of LOCALES) {
    const c = getContent(l); const q = everyResult(c);
    it.each([...TEST_RUN])(`${l}: %s has a headline and a real paragraph, with no birth date`, (id) => {
      const t = teaserFor(id, quizViewOf(guest(q)), c, G[l], A[l])!;
      expect(t.title.trim().length, t.title).toBeGreaterThan(2);
      expect(t.title.length, t.title).toBeLessThan(90);
      expect(t.text.trim().length, t.text).toBeGreaterThan(25);
      expect(t.text).not.toMatch(/undefined|\[object/);
    });
  }
  it("gives nothing for a test not taken", () => {
    const c = getContent("en");
    for (const id of TEST_RUN) expect(teaserFor(id, quizViewOf(guest({})), c, en, aEn), id).toBeNull();
  });
  it("is the same with and without a birth date", () => {
    const c = getContent("en"); const q = everyResult(c);
    const withDate = quizViewOf({ ...guest(q), date: "1995-10-12" }); const noDate = quizViewOf(guest(q));
    for (const id of TEST_RUN) expect(teaserFor(id, noDate, c, en, aEn), id).toEqual(teaserFor(id, withDate, c, en, aEn));
  });
});

describe("the gate around a result", () => {
  const q = everyResult(getContent("en")); const t = teaserFor("nine", quizViewOf(guest(q)), getContent("en"), en, aEn)!;
  it("wraps one test, with that test as the source and its teaser as the preview", () => {
    const html = render(createElement(ResultGate, { id: "nine", person: guest(q), children: "FULL RESULT" }));
    expect(html).toContain('data-gate="nine"'); expect(html).toContain(t.title); expect(html).toContain("FULL RESULT");
    expect(html.indexOf(t.title)).toBeLessThan(html.indexOf("FULL RESULT"));
  });
  it("gates a page of results once, previewing the first one", () => {
    const html = render(createElement(ResultsGate, { person: guest(q), children: "ALL RESULTS" }));
    expect(html.match(/data-gate=/g)).toHaveLength(1); expect(html).toContain('data-gate="take-all"'); expect(html).toContain("ALL RESULTS");
  });
  it("has nothing to gate before the first result", () => {
    expect(render(createElement(ResultsGate, { person: guest({}), source: "profile", children: "EMPTY" }))).toBe("EMPTY");
  });
});

describe("result views for a guest", () => {
  const q = everyResult(getContent("en")); const person = guest(q); const view = quizViewOf(person);
  it.each(QUIZ_IDS)("%s renders with no birth date", (id) => {
    expect(render(createElement(QuizResultView, { id, profile: view, pid: "me" })).length).toBeGreaterThan(200);
  });
  it.each(PRECISION_QUIZ_IDS)("%s renders with no birth date", (id) => {
    expect(render(createElement(PrecisionResultView, { id, person, profile: view })).length).toBeGreaterThan(200);
  });
  it("Deep Read renders with no birth date", () => {
    expect(render(createElement(DeepResultBody, { r: q.adaptive! })).length).toBeGreaterThan(200);
  });
  it("the blended picture uses tests alone, with no chart source", () => {
    const html = render(createElement(UnifiedGlance, { person, isMe: true }));
    expect(html).toContain("unified-glance"); expect(html).not.toContain(aEn.unified.sources.chart);
  });
});

describe("the test layer of a profile", () => {
  it("matches what a full profile computes, for the views that show results", () => {
    const q = everyResult(getContent("en"));
    const full = buildProfile({ date: "1995-10-12", time: null, place: null, quiz: q }); const layer = quizLayer(q);
    expect(layer.quiz).toEqual(full.quiz); expect(layer.psych).toEqual(full.psych); expect(layer.fourLetter).toEqual(full.fourLetter); expect(layer.bigFiveSource).toBe(full.bigFiveSource);
  });
  it("works on empty results", () => { expect(quizLayer({})).toEqual({ quiz: {}, psych: null, fourLetter: null, bigFiveSource: null }); });
  it("refuses to build a chart without a birth date, so UnifiedGlance falls back to tests alone", () => {
    expect(() => profileOf(guest({}))).toThrow();
  });
  it("leaves a placeholder name out of numerology", () => {
    const base: StoredPerson = { ...guest({}), date: "1995-10-12", name: "Friend" };
    expect(profileOf(base).numbers.name).not.toBeNull();
    expect(profileOf({ ...base, noName: true }).numbers.name).toBeNull();
    expect(profileOf({ ...base, noName: true, birthName: "Ana Petrova" }).numbers.name).not.toBeNull();
  });
});
