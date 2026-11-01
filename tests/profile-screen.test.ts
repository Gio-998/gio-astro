/** The one profile screen: its previews, its gate rules, and the promises the copy around it makes. */
import { describe, it, expect, vi } from "vitest";
import { createElement, type ReactNode } from "react";
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { LOCALES, contents, getContent, type Locale } from "@/content";
import { buildProfile } from "@/engine/profile";
import { buildLens, LENS_KEYS } from "@/story/lens";
import { buildBook } from "@/story/book";
import { quizDefs } from "@/lib/quiz-defs";
import { blockTeaser, clipText, skyTeaser } from "@/lib/profile-teaser";
import { ContentProvider } from "@/lib/content-context";
import type { StoredPerson } from "@/lib/store";
import { ProfileGate, ReadingGate } from "@/components/profile/ProfileGate";
import { Fold } from "@/components/profile/parts";
import { gateView } from "@/components/lead/LeadGate";

vi.mock("@/components/lead/LeadGate", async (real) => ({
  ...(await real<typeof import("@/components/lead/LeadGate")>()),
  LeadGate: ({ source, preview, children }: { source: string; preview?: ReactNode; children: ReactNode }) => createElement("section", { "data-gate": source }, createElement("aside", null, preview), createElement("main", null, children)),
}));
const render = (el: ReactNode, locale: Locale = "en") => renderToStaticMarkup(createElement(ContentProvider, { locale, children: el }));

const birth = { date: "1995-10-12", time: null, place: null };
const person = (quiz: StoredPerson["quiz"] = {}, date = birth.date): StoredPerson => ({ id: "me", name: "Ana", date, time: null, place: null, quiz, createdAt: "x" });
const scored = (l: Locale) => { const d = quizDefs(getContent(l)).nine; return d.score(Object.fromEntries(d.items.map((q, i) => [q.id, q.kind === "choice" ? i % 2 : (i % 4) + 1]))); };

describe("previews on the profile screens", () => {
  it("keeps whole sentences and stays short", () => {
    expect(clipText("Short one.")).toBe("Short one.");
    const long = Array.from({ length: 12 }, (_, i) => `Sentence number ${i} says a little more than the last.`).join(" ");
    const out = clipText(long);
    expect(out.length).toBeLessThanOrEqual(260); expect(out.length).toBeGreaterThan(100); expect(out.endsWith(".")).toBe(true);
  });
  it("never cuts a single long sentence to nothing", () => {
    const one = "word ".repeat(100).trim() + ".";
    expect(clipText(one)).toBe(one);
  });
  for (const l of LOCALES) {
    const c = getContent(l); const p = buildProfile({ ...birth, quiz: {} });
    it(`${l}: a birth date alone gives a headline and a real paragraph`, () => {
      const t = skyTeaser(p, c);
      expect(t.title).toContain(c.astro.signs[p.sun].name); expect(t.text.length).toBeGreaterThan(25);
    });
    it(`${l}: every reading a sheet can open has a preview`, () => {
      for (const k of LENS_KEYS) {
        const page = buildLens(k, p, c); if (!page.blocks) continue;
        const t = blockTeaser(page.title, page.blocks);
        expect(t?.text.length, k).toBeGreaterThan(15); expect(t?.text.length, k).toBeLessThanOrEqual(700);
      }
    });
    it(`${l}: the book has a preview`, () => {
      const ch = buildBook(p, c, "Ana").chapters[0];
      expect(blockTeaser(ch.title, ch.blocks)?.text.length).toBeGreaterThan(25);
    });
  }
  it("ignores blocks with no running text", () => {
    expect(blockTeaser("T", [{ t: "quote", text: "q" }, { t: "lead", text: "Real opening." }])?.text).toBe("Real opening.");
    expect(blockTeaser("T", [{ t: "list", kind: "daily", title: "x", items: ["y"] }])).toBeNull();
  });
});

describe("one gate for a person's results", () => {
  const p = buildProfile({ ...birth, quiz: {} });
  it("uses the profile source, with the sky as the teaser before any test", () => {
    const html = render(createElement(ProfileGate, { person: person(), profile: p, children: "ALL RESULTS" }));
    expect(html).toContain('data-gate="profile"'); expect(html).toContain(getContent("en").ui.profile.sunIn(getContent("en").astro.signs[p.sun].name));
    expect(html.indexOf("result-teaser")).toBeLessThan(html.indexOf("ALL RESULTS"));
  });
  it("prefers a test result as the teaser", () => {
    const quiz = scored("en"); const html = render(createElement(ProfileGate, { person: person(quiz), profile: buildProfile({ ...birth, quiz }), children: "R" }));
    expect(html).toContain(getContent("en").psych.nineStyles[quiz.nine!.type].name);
  });
  it("gates a guest with results and no birth date", () => {
    const html = render(createElement(ProfileGate, { person: person(scored("en"), ""), children: "R" }));
    expect(html.match(/data-gate=/g)).toHaveLength(1);
  });
  it("has nothing to gate for a new visitor", () => {
    expect(render(createElement(ProfileGate, { person: person({}, ""), children: "EMPTY" }))).toBe("EMPTY");
  });
  it("shows a known teaser in front of a reading", () => {
    const html = render(createElement(ReadingGate, { teaser: { title: "Head", text: "One paragraph." }, children: "FULL" }));
    expect(html.indexOf("One paragraph.")).toBeLessThan(html.indexOf("FULL"));
  });
  it("never shows the form to anyone who is signed in or has left their details", () => {
    const base = { backend: true, ready: true, signedIn: false, lead: false, timedOut: false };
    expect(gateView(base)).toBe("form");
    expect(gateView({ ...base, signedIn: true })).toBe("open"); expect(gateView({ ...base, lead: true })).toBe("open");
  });
});

describe("one form per page", () => {
  const read = (f: string) => readFileSync(`src/components/${f}`, "utf8");
  it("puts every personal screen behind the profile source", () => {
    expect(read("profile/ProfileGate.tsx")).toMatch(/PROFILE_SOURCE = "profile"/);
    for (const f of ["ProfileView.tsx", "pages/YouPage.tsx", "pages/MePage.tsx"]) expect(read(f), f).toContain("<ProfileGate");
    for (const f of ["story/BookView.tsx", "pages/LensPage.tsx"]) expect(read(f), f).toContain("<ReadingGate");
    expect(read("LensSheet.tsx")).toContain("<LeadGate source={PROFILE_SOURCE}");
  });
  it("gates each screen once", () => {
    for (const f of ["ProfileView.tsx", "pages/YouPage.tsx", "pages/MePage.tsx"]) expect(read(f).match(/<ProfileGate/g), f).toHaveLength(1);
    expect(read("story/BookView.tsx").match(/<ReadingGate/g)).toHaveLength(1);
    expect(read("pages/LensPage.tsx").match(/<ReadingGate/g)).toHaveLength(1);
  });
  it("hides the page's form while a reading sheet holds it, and while a test is open", () => {
    expect(read("ProfileView.tsx")).toMatch(/sheetOpen && !resultsOpen/);
    expect(read("tests/TestsPanel.tsx")).toMatch(/\{!open && children\}/);
  });
  it("leaves the Bond Story open: it belongs to two people", () => {
    expect(read("story/BookView.tsx")).toMatch(/kind === "book" \? <ReadingGate/);
  });
  it("sends the form's Log in link to the login tab, and the page honours it", () => {
    expect(read("lead/LeadGate.tsx")).toMatch(/\?next=\$\{encodeURIComponent\(path\)\}&tab=login/);
    expect(read("auth/Auth.tsx")).toMatch(/sp\.get\("tab"\) === "login" \? "login" : "signup"/);
  });
});

describe("the profile screen itself", () => {
  const read = (f: string) => readFileSync(`src/components/${f}`, "utf8");
  it("has one view, with no toggle left behind", () => {
    expect(read("pages/MePage.tsx")).not.toMatch(/ViewToggle|useMeView|MeJourney/);
    expect(read("sky/Journey.tsx")).not.toMatch(/ViewToggle|useMeView|MeJourney/);
  });
  it("offers an account softly, and only to people without one", () => {
    expect(read("profile/parts.tsx")).toMatch(/if \(!accountsEnabled \|\| !a\.ready \|\| a\.user\) return null/);
  });
  it("renders a closed fold with no content, and an open one with it", () => {
    const closed = render(createElement(Fold, { title: "T", children: "INSIDE" }));
    const open = render(createElement(Fold, { title: "T", defaultOpen: true, children: "INSIDE" }));
    expect(closed).not.toContain("INSIDE"); expect(closed).toContain('aria-expanded="false"');
    expect(open).toContain("INSIDE"); expect(open).toContain('aria-expanded="true"');
  });
});

describe("copy around the profile", () => {
  const dead = /Beta(Invite)\b|StartOrJoin/;
  it("drops the beta leftovers", () => { expect(readFileSync("src/components/auth/Beta.tsx", "utf8")).not.toMatch(dead); });
  for (const l of LOCALES) {
    const c = contents[l];
    it(`${l}: makes no promise of seconds on the way to the birth date`, () => {
      for (const s of [c.site.common.start, c.you.start, c.ui.today.sub]) expect(s).not.toMatch(/90|минута и пол/i);
    });
    it(`${l}: is honest about what a lead keeps`, () => {
      const t = JSON.stringify(c.systems.how.privacy) + c.systems.how.principles[4].text;
      expect(t).toMatch(/email|E-Mail|е-пошта/); expect(t).not.toMatch(/nothing is uploaded|nichts hochgeladen|ништо не се испраќа/i);
    });
    it(`${l}: uses the reader word on the screens this file covers`, () => {
      const t = JSON.stringify([c.ui.myProfile, c.book.intro("x", 3), c.book.lensCount(3), c.lensUi, c.systems.how.lensesTitle, c.systems.ui.extraTitle, c.systems.ui.extraNote]);
      expect(t).not.toMatch(/\bquiz|\blens|codex|\blayers?\b|\bebenen?\b|квиз|кодекс|гледишт|blickwinkel/i);
    });
  }
});
