import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import "@/lib/shell/en";
import "@/lib/shell/mk";
import "@/lib/shell/de";
import "@/lib/shell/sr";
import { contents as lazy, LOCALES as lazyLocales, MID_KEYS, contentFor } from "@/lib/content-lazy";
import { contents as real, LOCALES, type Content, type Locale } from "@/content";
import { enShell, PARTIAL_KEYS } from "@/lib/shell/base";
import { enMid } from "@/lib/shell/mid";
import mkMid from "@/lib/shell/mid-mk";
import deMid from "@/lib/shell/mid-de";
import srMid from "@/lib/shell/mid-sr";
import { quizDefs, QUIZ_IDS } from "@/lib/quiz-defs";

/** Functions compare by source, so a label that is a template function counts as equal text. */
const plain = (v: unknown) => JSON.stringify(v, (_, x) => (typeof x === "function" ? String(x) : x));

describe("lazy browser content", () => {
  const whole = Object.keys(enShell).filter((k) => !(PARTIAL_KEYS as readonly string[]).includes(k)) as (keyof Content)[];
  it("covers the same languages as the real content", () => expect([...lazyLocales]).toEqual([...LOCALES]));
  it("serves the chrome from the shell with exactly the real text", () => {
    for (const l of LOCALES) for (const k of whole) expect(plain(lazy[l][k]), `${l}.${k}`).toBe(plain(real[l][k]));
  });
  it("keeps the partial systems entry equal to the real one", () => {
    for (const l of LOCALES) expect(lazy[l].systems.how.link).toBe(real[l].systems.how.link);
  });
  it("gives each language's landing chunk the real text", () => {
    const mids: Record<Locale, Record<string, unknown>> = { en: enMid, mk: mkMid, de: deMid, sr: srMid };
    for (const l of LOCALES) for (const k of MID_KEYS) expect(plain(mids[l][k]), `${l}.${k}`).toBe(plain(real[l][k as keyof Content]));
  });
  it("stays out of the texts the nav must not load: quiz titles read neither c.psych nor c.types", () => {
    for (const l of LOCALES) {
      const guarded = new Proxy(real[l], { get(t, k) { if (k === "psych" || k === "types") throw new Error(`nav read c.${String(k)}`); return t[k as keyof Content]; } });
      const defs = quizDefs(guarded);
      for (const id of QUIZ_IDS) { expect(defs[id].title).toBeTruthy(); expect(defs[id].tagline).toBeTruthy(); }
    }
  });
  it("still builds every quiz in full when asked", () => {
    const defs = quizDefs(real.en);
    for (const d of Object.values(defs)) { expect(d.items.length, d.id).toBeGreaterThan(0); expect(d.title, d.id).toBeTruthy(); }
    expect(defs.care.note).toBe(real.en.psych.careNote);
  });
  it("gives reading routes the shell, the landing page the mid chunk, and everything else the full content, in any language", () => {
    for (const p of ["/de/tageshoroskop/widder/", "/mk/dneven-horoskop/oven/2026-10-13/", "/de/numerologie/engelszahlen/1001/", "/en/blog/some-post/", "/de/partnerhoroskop/widder-und-loewe/", "/sr/dnevni-horoskop/ovan/", "/sr/numerologija/andjeoski-brojevi/111/", "/mk/numerologija/angelski-broevi/111/", "/sr/horoskop-2027/lav/", "/sr/kompatibilnost-znakova/ovan-i-lav/", "/sr/mesecev-kalendar/"]) expect(contentFor(p), p).toBe("shell");
    for (const p of ["/en/", "/de/", "/mk", "/sr/"]) expect(contentFor(p), p).toBe("mid");
    for (const p of ["/en/quiz/care/", "/de/start/", "/mk/today/", "/en/daily/aries/", "/en/rising-sign-calculator/", "/de/aszendent-berechnen/", "/sr/podznak-kalkulator/", "/sr/start/", "/nothing/here/"]) expect(contentFor(p), p).toBe("full");
  });
  it("gives every language its own shell, so no reading page loads the full text", () => {
    const providers = readFileSync("src/lib/shell/index.tsx", "utf8");
    for (const l of LOCALES) expect(providers, l).toContain(`import("./${l}")`);
  });
  it("is the module the browser build resolves @/content to", () => {
    const cfg = readFileSync("next.config.ts", "utf8");
    expect(cfg).toContain('"@/content": { browser: "./src/lib/content-lazy.ts" }');
  });
});
