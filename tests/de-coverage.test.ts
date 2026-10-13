import { describe, it, expect } from "vitest";
import { contents } from "@/content";
import { reportEn } from "@/content/report/en";
import { reportMk } from "@/content/report/mk";
import { reportDe } from "@/content/report/de";

/** Leaves that are legitimately identical in English and German (names, symbols, numbers, brand). */
const SAME_OK = /^[\s\d.,:;!?%€+×·•…★☆✦✧✶◆○●→←↑↓⚙♈-♓☉☽☿♀♂♃♄♅♆♇☊☋⚷⚸()\/#@&*'"|<>=_-]*$/u;
/** Words that are spelled the same in German, plus proper names and terms kept on purpose. */
const ALLOW = new Set<string>(["Name", "Extras", "online", "Big Five", "Chiron", "Lilith", "Charisma", "Intuition", "Vision", "Fairness", "Isolation", "Inspiration", "Initiative", "Guna Milan", "Neutral", "April", "August", "September", "November", "Minute", "optional", "Autopilot", "Yin", "Yang", "Person A", "Person B", "Extras", "Pause", "Blog", "Jaguar", "Nine Star Ki", "Tzolk'in", "Rune", "Charubel, 1898", "Dosha", "Link (optional)", "Podcast", "Rune"]);
/** Proper names (nakshatras, Maya day signs, runes, animals) keep their name; only the description must change. */
const NAME_PATH = /\.(name|kiche|sanskrit|latin|glyph|symbol|id|key|slug)$/;

let MK_ROOT: unknown = contents.mk;
function walk(en: unknown, de: unknown, path: string, out: string[]) {
  if (typeof en === "string") {
    if (en === de && !SAME_OK.test(en) && !ALLOW.has(en.replace(/[.,\s]+$/, "")) && !NAME_PATH.test(path) && en !== mkAt(path)) out.push(path);
    return;
  }
  if (typeof en === "function") {
    if (en === de) out.push(path + "()");
    return;
  }
  if (en && typeof en === "object") for (const k of Object.keys(en)) walk((en as Record<string, unknown>)[k], (de as Record<string, unknown> | undefined)?.[k], `${path}.${k}`, out);
}

/** Same string in Macedonian too means a proper name or code that is never translated. */
const mkAt = (path: string) => path.split(".").slice(1).reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], MK_ROOT);

export function untranslated(): string[] { const out: string[] = []; walk(contents.en, contents.de, "c", out); return out; }

describe("German content", () => {
  it("has no key that falls back to English", () => {
    const miss = untranslated();
    expect(miss, `${miss.length} untranslated keys`).toEqual([]);
  });
  it("full report has no English left", () => {
    const out: string[] = []; MK_ROOT = reportMk; walk(reportEn, reportDe, "r", out); MK_ROOT = contents.mk;
    expect(out, `${out.length} untranslated report keys`).toEqual([]);
  });
});
