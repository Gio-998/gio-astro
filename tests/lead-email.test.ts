import { describe, it, expect } from "vitest";
import { ALL_QUIZ_IDS } from "@/lib/quiz-defs";
import { ROUTE_LOCALES, localizedPath } from "@/lib/i18n-routes";
import { RULES } from "../scripts/check-copy.mjs";
import { SITE, TESTS, actionUrl, emailLocale, emailSource, esc, privacyUrl, renderWelcome, resultsUrl, statusUrl, testUrl, testsUrl } from "../supabase/functions/_shared/lead-email";

const base = { firstName: "Ana", source: "big-five", unsubscribeToken: "U".repeat(43), confirmToken: null };
const plain = (s: string) => s.replace(/https?:\/\/\S+/g, "");

describe("the welcome email", () => {
  for (const locale of ["en", "mk", "de"]) {
    it(`${locale}: says results stay on the device, in html and text`, () => {
      const m = renderWelcome({ ...base, locale });
      const line = { en: "Your results stay on this device.", mk: "Твоите резултати остануваат на овој уред.", de: "Deine Ergebnisse bleiben auf diesem Gerät." }[locale]!;
      expect(m.html).toContain(esc(line));
      expect(m.text).toContain(line);
      expect(m.html).toContain(`<html lang="${locale}">`);
    });
    it(`${locale}: links back to the test, the results, unsubscribe and privacy`, () => {
      const m = renderWelcome({ ...base, locale });
      for (const url of [testUrl(locale, "big-five"), resultsUrl(locale), privacyUrl(locale), actionUrl(locale, "unsubscribe", base.unsubscribeToken)]) {
        expect(m.text).toContain(url);
        expect(m.html).toContain(esc(url));
      }
    });
    it(`${locale}: shows a confirm button only when one is due`, () => {
      const token = "C".repeat(43); const url = actionUrl(locale, "confirm", token);
      const yes = renderWelcome({ ...base, locale, confirmToken: token });
      expect(yes.html).toContain(esc(url)); expect(yes.text).toContain(url);
      const no = renderWelcome({ ...base, locale });
      expect(no.html).not.toContain("#a=confirm"); expect(no.text).not.toContain("#a=confirm");
    });
    it(`${locale}: uses the reader word "test", never quiz, and no dashes as punctuation`, () => {
      const { text, subject } = renderWelcome({ ...base, locale, confirmToken: "C".repeat(43) });
      const words = plain(`${subject}\n${text}`);
      expect(words).not.toMatch(/quiz|квиз|lens|codex/i);
      expect(words).not.toMatch(/[—–]/);
    });
  }
  it("passes the copy rules, which the checker can't see because it only scans src", () => {
    const { text, subject } = renderWelcome({ ...base, locale: "en", confirmToken: "C".repeat(43) });
    for (const [rx, msg] of RULES as [RegExp, string][]) expect(rx.test(plain(`${subject}\n${text}`)), msg).toBe(false);
  });
  it("carries no client value but the first name and an allowlisted test", () => {
    const hostile = `"><script>alert(1)</script>`;
    const m = renderWelcome({ ...base, locale: "en", firstName: hostile, source: hostile });
    expect(m.html).not.toContain("<script");
    expect(m.html).not.toContain(`"><`.concat("script"));
    expect(m.html).toContain("&lt;script&gt;");
    expect(renderWelcome({ ...base, locale: "en", source: "evil-source" }).text).not.toContain("evil-source");
  });
  it("greets without a name when there is none", () => {
    expect(renderWelcome({ ...base, locale: "de", firstName: null }).text.startsWith("Hallo,")).toBe(true);
    expect(renderWelcome({ ...base, locale: "de" }).text.startsWith("Hallo Ana,")).toBe(true);
  });
  it("never puts a name in the subject", () => {
    for (const locale of ["en", "mk", "de"]) expect(renderWelcome({ ...base, locale, firstName: "Ana" }).subject).not.toContain("Ana");
  });
  it("sends an unknown source to the tests page", () => {
    const m = renderWelcome({ ...base, locale: "en", source: "something-new" });
    expect(m.text).toContain(testsUrl("en"));
    expect(m.text).not.toContain("/quiz/");
  });
  it("falls back to English for a language it doesn't have yet", () => {
    expect(emailLocale("fr")).toBe("en");
    expect(emailLocale("constructor")).toBe("en");
    expect(renderWelcome({ ...base, locale: "fr" }).subject).toBe(renderWelcome({ ...base, locale: "en" }).subject);
    expect(actionUrl("fr", "confirm", "x")).toContain("/en/email/");
  });
});

describe("the allowlist and links", () => {
  it("covers every test on the site", () => { expect(Object.keys(TESTS).sort()).toEqual([...ALL_QUIZ_IDS].sort()); });
  it("has a name for each test in each language", () => {
    for (const [id, names] of Object.entries(TESTS)) for (const l of ROUTE_LOCALES) expect(names[l], `${id} ${l}`).toBeTruthy();
  });
  it("gives unknown sources one shared key, so inventing sources can't buy more emails", () => {
    expect(emailSource("big-five")).toBe("big-five");
    expect(emailSource("a")).toBe("other");
    expect(emailSource("b")).toBe("other");
    expect(emailSource("__proto__")).toBe("other");
  });
  it("matches the site's own routes", () => {
    for (const l of ROUTE_LOCALES) {
      expect(testsUrl(l)).toBe(`${SITE}${localizedPath(l, "/quizzes/")}`);
      expect(resultsUrl(l)).toBe(`${SITE}${localizedPath(l, "/me/")}`);
      expect(privacyUrl(l)).toBe(`${SITE}${localizedPath(l, "/privacy/")}`);
      expect(statusUrl(l, "confirmed")).toBe(`${SITE}${localizedPath(l, "/email/")}#s=confirmed`);
      for (const id of ALL_QUIZ_IDS) expect(testUrl(l, id)).toBe(`${SITE}${localizedPath(l, `/quiz/${id}/`)}`);
    }
  });
  it("always points at the live site", () => {
    expect(statusUrl("//evil.example", "x").startsWith(`${SITE}/en/`)).toBe(true);
  });
});
