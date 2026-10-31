import { describe, it, expect } from "vitest";
import { CALENDARS } from "../src/content/calendars";
import { SIGNS } from "../src/engine/zodiac";
import { mercuryYear } from "../src/engine/sky-calendar";
import { MOON_MONTHS, MOON_YEARS, moonCalendar, reflectionOf, windowLunations } from "../src/lib/sections/moon-calendar";
import { MERCURY_YEARS, mercuryRetrograde, periodKey } from "../src/lib/sections/mercury-retrograde";
import type { SectionModel } from "../src/lib/sections/types";

/** Calendar pages are near neighbours that share a data shape: each must stand on its own before it joins the sitemap. */
const LANGS = ["en", "mk", "de"] as const;
const MIN_MONTH_WORDS = 280;
const MIN_YEAR_WORDS = 150;
const MIN_MERCURY_WORDS = 450;
const MAX_JACCARD = 0.1; // share of 5 word shingles two pages may have in common

const text = (m: SectionModel) => [m.title, m.lead, ...m.blocks.flatMap((b) => [b.title, ...(b.paras ?? []), ...(b.list ?? [])]), ...m.faq.flat()].join(" ");
/** The last column of a by-sign table is prose. */
const signLines = (m: SectionModel) => m.blocks.filter((b) => /^h\d$/.test(b.id)).flatMap((b) => b.table!.rows.map((r) => r[2] as string));
const words = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(Boolean);
const shingles = (w: string[], k = 5) => { const o = new Set<string>(); for (let i = 0; i + k <= w.length; i++) o.add(w.slice(i, i + k).join(" ")); return o; };
const jaccard = (a: Set<string>, b: Set<string>) => { let n = 0; for (const x of a) if (b.has(x)) n++; return n / (a.size + b.size - n || 1); };
const sentences = (s: string) => s.split(/(?<=[.!?])\s+/).map((x) => x.trim().toLowerCase()).filter((x) => x.split(" ").length >= 6);

function checkFamily(lang: string, models: Record<string, SectionModel>, minWords: number, extra: (m: SectionModel) => string = () => "") {
  const body = (k: string) => `${text(models[k])} ${extra(models[k])}`; const keys = Object.keys(models);
  it(`${lang}: each page has at least ${minWords} words`, () => expect(keys.map((k) => [k, words(body(k)).length]).filter(([, n]) => (n as number) < minWords)).toEqual([]));
  it(`${lang}: no two pages share more than ${MAX_JACCARD * 100}% of their phrasing`, () => {
    const sh = Object.fromEntries(keys.map((k) => [k, shingles(words(body(k)))])); const bad: string[] = [];
    keys.forEach((a, i) => keys.slice(i + 1).forEach((b) => { const j = jaccard(sh[a], sh[b]); if (j > MAX_JACCARD) bad.push(`${a}/${b}: ${j.toFixed(3)}`); }));
    expect(bad).toEqual([]);
  });
  it(`${lang}: sentences are not reused across pages`, () => {
    const seen = new Map<string, string[]>();
    for (const k of keys) for (const s of new Set(sentences(body(k)))) seen.set(s, [...(seen.get(s) ?? []), k]);
    expect([...seen.entries()].filter(([, ks]) => ks.length > 1).map(([s, ks]) => `${ks.join(",")}: ${s.slice(0, 70)}`)).toEqual([]);
  });
  it(`${lang}: titles and descriptions fit a search result and are unique`, () => {
    const ms = Object.values(models);
    expect(ms.filter((m) => m.title.length > 55).map((m) => `${m.title.length} ${m.title}`)).toEqual([]);
    expect(ms.filter((m) => m.description.length < 120 || m.description.length > 155).map((m) => `${m.description.length} ${m.description}`)).toEqual([]);
    expect(new Set(ms.map((m) => m.title)).size).toBe(ms.length); expect(new Set(ms.map((m) => m.description)).size).toBe(ms.length);
  });
}

describe("moon calendar pages: overlap and depth", () => {
  it("every lunation has its own text in every language, and no text is left over", () => {
    const need: Record<string, number> = {}; for (const l of windowLunations()) { const k = `${l.quarter}:${l.sign}`; need[k] = (need[k] ?? 0) + 1; }
    for (const lang of LANGS) {
      for (const l of windowLunations()) expect(reflectionOf(lang, l).length, `${lang} ${l.iso}`).toBeGreaterThan(100);
      expect(Object.fromEntries(Object.entries(CALENDARS[lang].moon.reflect).map(([k, v]) => [k, v.length]))).toEqual(need);
    }
  });
  it("no reflection is reused between lunations", () => {
    for (const lang of LANGS) { const all = windowLunations().map((l) => reflectionOf(lang, l)); expect(new Set(all).size).toBe(all.length); }
  });
  for (const lang of LANGS) {
    const months = Object.fromEntries(MOON_MONTHS.map((k) => [k, moonCalendar.model(lang, `/moon-calendar/${k}/`)!]));
    checkFamily(lang, months, MIN_MONTH_WORDS);
    checkFamily(`${lang} years`, Object.fromEntries(MOON_YEARS.map((y) => [y, moonCalendar.model(lang, `/moon-calendar/${y}/`)!])), MIN_YEAR_WORDS);
    it(`${lang}: the hub fits a search result`, () => { const m = moonCalendar.model(lang, "/moon-calendar/")!; expect(m.title.length).toBeLessThanOrEqual(55); expect(m.description.length).toBeGreaterThanOrEqual(120); expect(m.description.length).toBeLessThanOrEqual(155); });
    it(`${lang}: each month page has phases, a reflection per lunation, a full day table and links`, () => {
      for (const ym of MOON_MONTHS) {
        const m = months[ym]; const days = m.blocks.find((b) => b.id === "days")!.table!.rows;
        expect(days.length).toBe(new Date(Date.UTC(Number(ym.slice(0, 4)), Number(ym.slice(5)), 0)).getUTCDate());
        for (const r of days) expect((r[3] as { href: string }).href).toContain(`/${lang}/`);
        expect(m.blocks.filter((b) => b.id.startsWith("l-")).length).toBe(m.blocks.find((b) => b.id === "phases")!.table!.rows.length);
      }
    });
  }
  it("a day links to its dated horoscope once published and never to a page that does not exist", () => {
    const m = moonCalendar.model("en", "/moon-calendar/2026-11/")!; const hrefs = m.blocks.find((b) => b.id === "days")!.table!.rows.map((r) => (r[3] as { href: string }).href);
    for (const h of hrefs) expect(h).toMatch(/^\/en\/horoscope\/[a-z]+\/(\d{4}-\d{2}-\d{2}\/)?$/);
  });
});

describe("Mercury retrograde pages: overlap and depth", () => {
  const keys = MERCURY_YEARS.flatMap((y) => mercuryYear(y).map((p) => periodKey(y, p)));
  it("every computed period has copy in every language, and every line covers all 12 signs", () => {
    for (const lang of LANGS) {
      expect(Object.keys(CALENDARS[lang].mercury.periods).sort()).toEqual([...keys].sort());
      for (const k of keys) expect(CALENDARS[lang].mercury.periods[k].bySign.length).toBe(SIGNS.length);
    }
  });
  it("no by-sign line is reused between periods", () => {
    for (const lang of LANGS) { const all = keys.flatMap((k) => CALENDARS[lang].mercury.periods[k].bySign); expect(new Set(all).size).toBe(all.length); }
  });
  for (const lang of LANGS) {
    checkFamily(lang, Object.fromEntries(MERCURY_YEARS.map((y) => [y, mercuryRetrograde.model(lang, `/mercury-retrograde/${y}/`)!])), MIN_MERCURY_WORDS, (m) => signLines(m).join(" "));
    it(`${lang}: the hub fits a search result and answers in its first words`, () => { const m = mercuryRetrograde.model(lang, "/mercury-retrograde/")!; expect(m.title.length).toBeLessThanOrEqual(55); expect(m.description.length).toBeGreaterThanOrEqual(120); expect(m.description.length).toBeLessThanOrEqual(155); expect(m.lead.length).toBeGreaterThan(30); });
  }
});

describe("calendar copy rules in every language", () => {
  const dash = /[—–]|\s-\s/u;
  const all = (lang: string) => [...moonCalendar.paths().map((p) => moonCalendar.model(lang, p)!), ...mercuryRetrograde.paths().map((p) => mercuryRetrograde.model(lang, p)!)];
  for (const lang of LANGS) it(`${lang}: no dashes as punctuation, and no empty text`, () => {
    for (const m of all(lang)) { const t = `${text(m)} ${m.description} ${signLines(m).join(" ")}`; expect(dash.test(t), m.path).toBe(false); expect(t).not.toContain("undefined"); expect(t).not.toContain("  "); }
  });
});
