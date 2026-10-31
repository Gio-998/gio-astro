/** Keeps the first screens honest and small: no invite or waitlist talk, one word for tests, true numbers, a free Pricing page, a short home page. */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { LOCALES, getContent } from "@/content";
import { navFor } from "@/lib/site-links";
import { pricingText } from "@/components/pricing/text";
import { BOND_DIMS } from "@/engine/bondcheck";
import { QUIZ_IDS, quizDefs } from "@/lib/quiz-defs";
import { PAYWALL_LIVE } from "@/lib/payments";

const OLD_WORDS: Record<string, RegExp> = {
  en: /quiz|\blens|\blayers?\b|codex|waitlist|\binvit|no sign-up|no email|\bbeta\b/i,
  de: /quiz|perspektive|\bebenen?\b|codex|warteliste|einladung|ohne anmeldung|keine e-mail|\bbeta\b/i,
  mk: /квиз|гледишт|\bслој|кодекс|листа на чекање|покан|без регистрација|без е-пошта|\bбета/i,
  sr: /kviz|sočiv|\bsloj|kodeks|list\p{L}* čekanja|pozivnic|bez registracij|bez imejla|\bbeta/iu,
};
const FACES = (lang: string) => {
  const c = getContent(lang); const B = c.ui.beta;
  return { landing: c.landing, nav: navFor(lang), hero: c.site.hero, footer: c.site.footerCols, description: c.site.description, hub: c.ui.quizHub, quick: c.ui.quickStart,
    gate: [B.lockedEyebrow, B.lockedTitle, B.lockedText, B.joinWaitlist, B.badge, B.banner, B.join, B.joined, B.emailLabel, B.privacy, B.haveInvite, B.sectionEyebrow, B.sectionTitleA, B.sectionTitleB, B.sectionText] };
};

/** Every string a reader can see: values only, so object keys and the /quizzes/ route (it keeps its name) don't count. */
const words = (x: unknown): string[] => typeof x === "string" ? [x] : Array.isArray(x) ? x.flatMap(words)
  : x && typeof x === "object" ? Object.entries(x).filter(([k]) => !/href/i.test(k)).flatMap(([, v]) => words(v)) : [];

describe("first screens", () => {
  it.each([...LOCALES])("uses one honest vocabulary in %s", (lang) => {
    expect(words(FACES(lang)).filter((t) => OLD_WORDS[lang].test(t))).toEqual([]);
  });
  it("gives the real length of the tests", () => {
    const minutes = QUIZ_IDS.map((id) => quizDefs(getContent("en"))[id].minutes);
    expect([Math.min(...minutes), Math.max(...minutes)]).toEqual([1, 3]);
    expect(getContent("en").landing.tests.sub).toContain("One to three minutes");
    expect(navFor("en").groups.tests.allDesc).toContain("one to three minutes");
  });
  it("gives the real number of Bond Check questions", () => {
    expect(BOND_DIMS.length + 2).toBe(10); // BondPage asks every dimension plus how each person gives and receives care
    const words: Record<string, RegExp> = { en: /\bten\b/i, de: /\bzehn\b/i, mk: /десет/i, sr: /\bdeset\b|\bten\b/i }; // sr: "ten" only until src/content/sr lands
    for (const lang of LOCALES) {
      expect(navFor(lang).groups.bonds.items.find((i) => i.href === "/bond/")!.desc).toMatch(words[lang]);
      expect(getContent(lang).landing.pairs.cards[2].d).toMatch(words[lang]);
      expect(getContent(lang).ui.quizHub.bondText).toContain("10");
    }
  });
  it("keeps the home page to eight sections and away from the beta states", () => {
    const page = readFileSync("src/app/[lang]/page.tsx", "utf8"); const hero = readFileSync("src/components/landing/Hero.tsx", "utf8");
    expect((page + hero).match(/<section\b/g)).toHaveLength(8);
    expect(page + hero).not.toMatch(/waitlist|useBetaLocked|StartOrJoin|BetaInvite/);
  });
  it("gives every visitor the same header with no waitlist link", () => {
    const chrome = readFileSync("src/components/Chrome.tsx", "utf8");
    expect(chrome).not.toMatch(/waitlist|useBetaLocked/);
    expect(chrome.match(/"\/start\/"/g)).toHaveLength(1); // only the footer link for people without a profile
  });
});

describe("pricing page", () => {
  it("tells the truth while nothing is on sale", () => {
    expect(PAYWALL_LIVE).toBe(false); // when this changes, rewrite src/components/pricing/text.ts first
    const free: Record<string, RegExp> = { en: /free/i, de: /gratis/i, mk: /бесплатно/i, sr: /besplatno/i };
    for (const lang of LOCALES) {
      const T = pricingText(lang); const all = JSON.stringify(T);
      expect(T.title.join("")).toMatch(free[lang]);
      expect(all).not.toMatch(/\bDuo\b|Дуо|Preview|Vorschau:|\bПреглед\b/);
      expect(T.meta.title.length).toBeLessThanOrEqual(55);
      expect(T.meta.description.length).toBeGreaterThanOrEqual(120);
      expect(T.meta.description.length).toBeLessThanOrEqual(155);
    }
  });
});
