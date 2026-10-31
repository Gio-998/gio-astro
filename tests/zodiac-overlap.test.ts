import { describe, it, expect } from "vitest";
import { ZODIAC, ZODIAC_MATCHES, REQUIRED_KINDS, type SignProfile } from "../src/content/zodiac";
import { zodiac, hubModel, ZODIAC_SIGNS, signDates, signRulerNames } from "../src/lib/sections/zodiac";
import { SIGNS, SIGN_ELEMENT, signDistance, signPairSlug, type Sign } from "../src/engine/zodiac";
import { getContent } from "../src/content";
import { localizedPath } from "../src/lib/i18n-routes";

/** Twelve sign profiles in three languages are an easy place to fall into a template: each page must stand on its own. */
const LANGS = ["en", "mk", "de"] as const;
const MIN_WORDS = 1500;
const MAX_JACCARD = 0.1; // share of 5 word shingles two pages may have in common
const DAILY_MIN = 150, DAILY_MAX = 200;
const MIN_OPENERS = 4; // different section kinds a language must open a page with

const P = (l: string, s: Sign) => ZODIAC[l].signs[s] as SignProfile;
const body = (p: SignProfile) => [p.lead, ...p.sections.flatMap((s) => [...(s.paras ?? []), ...(s.list ?? []), s.quote ?? ""]), ...p.faq.flat()].join(" ");
const page = (p: SignProfile) => [p.h1, ...p.sections.map((s) => s.title), body(p)].join(" ");
const dailyText = (p: SignProfile) => p.daily.paras.join(" ");
const every = (p: SignProfile) => [p.metaTitle, p.description, p.h1, page(p), ...Object.values(p.matchNotes), p.daily.title, dailyText(p)].join(" ");
const words = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(Boolean);
const shingles = (w: string[], k = 5) => { const o = new Set<string>(); for (let i = 0; i + k <= w.length; i++) o.add(w.slice(i, i + k).join(" ")); return o; };
const jaccard = (a: Set<string>, b: Set<string>) => { let n = 0; for (const x of a) if (b.has(x)) n++; return n / (a.size + b.size - n || 1); };
const sentences = (s: string) => s.split(/(?<=[.!?])\s+/).map((x) => x.trim().toLowerCase()).filter((x) => x.split(" ").length >= 6);
const pairs = <T,>(list: readonly T[]) => list.flatMap((a, i) => list.slice(i + 1).map((b) => [a, b] as [T, T]));

describe("zodiac profiles: every sign in every language", () => {
  for (const l of LANGS) it(`${l}: all 12 signs are written`, () => expect(SIGNS.filter((s) => !ZODIAC[l].signs[s])).toEqual([]));
  it("the hub and all 12 signs are routed", () => { expect(ZODIAC_SIGNS).toEqual([...SIGNS]); expect(zodiac.paths()).toEqual(["/zodiac/", ...SIGNS.map((s) => `/zodiac/${s}/`)]); });
  it("public URLs use the localized slugs", () => {
    expect(localizedPath("en", "/zodiac/capricorn/")).toBe("/en/zodiac-signs/capricorn/");
    expect(localizedPath("de", "/zodiac/capricorn/")).toBe("/de/sternzeichen/steinbock/");
    expect(localizedPath("mk", "/zodiac/capricorn/")).toBe("/mk/horoskopski-znaci/jarec/");
  });
  it("match lists follow the zodiac: two of the same element, one sextile, two squares", () => {
    for (const s of SIGNS) {
      const { best, hardest } = ZODIAC_MATCHES[s];
      expect(best.filter((o) => SIGN_ELEMENT[o] === SIGN_ELEMENT[s]).length, s).toBe(2);
      expect(best.filter((o) => signDistance(o, s) === 2).length, s).toBe(1);
      for (const o of hardest) expect(signDistance(o, s), `${s}/${o}`).toBe(3);
    }
  });
});

for (const l of LANGS) describe(`zodiac profiles (${l})`, () => {
  const signs = () => SIGNS.filter((s) => ZODIAC[l].signs[s]);
  it(`each page has at least ${MIN_WORDS} words of its own`, () => {
    expect(signs().map((s) => [s, words(body(P(l, s))).length]).filter(([, n]) => (n as number) < MIN_WORDS)).toEqual([]);
  });
  it("titles and descriptions fit a search result and are unique", () => {
    const models = [hubModel(l, "/zodiac/"), ...signs().map((s) => zodiac.model(l, `/zodiac/${s}/`)!)];
    expect(models.filter((m) => m.title.length > 55 || !m.title).map((m) => `${m.title.length}: ${m.title}`)).toEqual([]);
    expect(models.filter((m) => m.description.length < 120 || m.description.length > 155).map((m) => `${m.description.length}: ${m.description}`)).toEqual([]);
    expect(new Set(models.map((m) => m.title)).size).toBe(models.length);
    expect(new Set(models.map((m) => m.description)).size).toBe(models.length);
  });
  it("the title puts the sign's name to work", () => {
    const c = getContent(l);
    expect(signs().filter((s) => !P(l, s).metaTitle.includes(c.astro.signs[s].name) || !P(l, s).h1.includes(c.astro.signs[s].name))).toEqual([]);
  });
  it(`no two pages share more than ${MAX_JACCARD * 100}% of their phrasing`, () => {
    const sh = Object.fromEntries(signs().map((s) => [s, shingles(words(page(P(l, s))))]));
    expect(pairs(signs()).map(([a, b]) => [a, b, jaccard(sh[a], sh[b])] as const).filter(([, , j]) => j > MAX_JACCARD).map(([a, b, j]) => `${a}/${b}: ${j.toFixed(3)}`)).toEqual([]);
  });
  it("sentences are not reused across pages or inside the daily notes", () => {
    const seen = new Map<string, Sign[]>();
    for (const s of signs()) for (const x of new Set(sentences(`${page(P(l, s))} ${dailyText(P(l, s))}`))) seen.set(x, [...(seen.get(x) ?? []), s]);
    expect([...seen.entries()].filter(([, ks]) => ks.length > 1).map(([x, ks]) => `${ks.join(",")}: ${x.slice(0, 70)}`)).toEqual([]);
    for (const s of signs()) { const own = sentences(page(P(l, s))); expect(sentences(dailyText(P(l, s))).filter((x) => own.includes(x)), s).toEqual([]); }
  });
  it("no two pages use one skeleton", () => {
    const orders = signs().map((s) => P(l, s).sections.map((x) => x.kind).join(">"));
    expect(new Set(orders).size).toBe(orders.length);
    expect(new Set(signs().map((s) => P(l, s).sections[0].kind)).size).toBeGreaterThanOrEqual(MIN_OPENERS);
    const c = getContent(l); const titles = new Map<string, Sign[]>();
    for (const s of signs()) for (const t of P(l, s).sections.map((x) => x.title.replaceAll(c.astro.signs[s].name, "").toLowerCase())) titles.set(t, [...(titles.get(t) ?? []), s]);
    expect([...titles.entries()].filter(([, ks]) => ks.length > 1).map(([t, ks]) => `${ks.join(",")}: ${t}`)).toEqual([]);
  });
  it("every page covers every topic, with the man, the woman and something practical to try", () => {
    expect(signs().flatMap((s) => REQUIRED_KINDS.filter((k) => !P(l, s).sections.some((x) => x.kind === k)).map((k) => `${s}: ${k}`))).toEqual([]);
    expect(signs().filter((s) => P(l, s).faq.length < 4)).toEqual([]);
    for (const s of signs()) { const c = getContent(l).astro.signs[s].name; const man = P(l, s).sections.find((x) => x.kind === "man")!.title; const woman = P(l, s).sections.find((x) => x.kind === "woman")!.title; expect(man.includes(c), man).toBe(true); expect(woman.includes(c), woman).toBe(true); }
  });
  it("dates come from the engine, the rulers are named, and the facts block shows both", () => {
    const months = getContent(l).site.months.join("|");
    expect(signs().filter((s) => new RegExp(`\\d\\.? (${months})`, "iu").test(every(P(l, s))))).toEqual([]);
    for (const s of signs()) {
      for (const r of signRulerNames(l, s)) expect(page(P(l, s)), `${s}: ${r}`).toContain(r.slice(0, 4));
      const m = zodiac.model(l, `/zodiac/${s}/`)!; const facts = m.blocks[0].list!.join(" ");
      expect(facts).toContain(signDates(l, s));
      for (const r of signRulerNames(l, s)) expect(facts).toContain(r);
      expect(JSON.stringify(m)).not.toContain("{dates}");
    }
  });
  it("links point at the best and hardest matches, in zodiac order, and at the other sign pages", () => {
    for (const s of signs()) {
      const m = zodiac.model(l, `/zodiac/${s}/`)!; const hrefs = m.related!.map((x) => x.href); const { best, hardest } = ZODIAC_MATCHES[s];
      for (const o of [...best, ...hardest]) { expect(hrefs, `${s}/${o}`).toContain(localizedPath(l, `/sign-compatibility/${signPairSlug(s, o)}/`)); expect(P(l, s).matchNotes[o], `${s}/${o}`).toBeTruthy(); }
      for (const f of ["horoscope", "weekly-horoscope", "monthly-horoscope", "horoscope-2027"]) expect(hrefs).toContain(localizedPath(l, `/${f}/${s}/`));
      expect(m.prev && m.next).toBeTruthy();
    }
  });
  it("the hub lists all 12 signs with dates and element, and explains elements and modalities", () => {
    const m = hubModel(l, "/zodiac/"); const A = getContent(l).astro;
    expect(m.kind).toBe("hub"); expect(m.items).toHaveLength(signs().length);
    signs().forEach((s, i) => { expect(m.items![i].href).toBe(localizedPath(l, `/zodiac/${s}/`)); expect(m.items![i].sub).toContain(signDates(l, s)); expect(m.items![i].sub).toContain(A.elements[SIGN_ELEMENT[s]].name); });
    expect(m.blocks.find((b) => b.id === "elements")!.list).toHaveLength(4); expect(m.blocks.find((b) => b.id === "modalities")!.list).toHaveLength(3);
    expect(words([...m.blocks.flatMap((b) => [...(b.paras ?? []), ...(b.list ?? [])]), ...m.faq.flat()].join(" ")).length).toBeGreaterThanOrEqual(400);
  });
  it(`the daily notes run ${DAILY_MIN} to ${DAILY_MAX} words and stay unique`, () => {
    expect(signs().map((s) => [s, words(dailyText(P(l, s))).length]).filter(([, n]) => (n as number) < DAILY_MIN || (n as number) > DAILY_MAX)).toEqual([]);
    expect(signs().filter((s) => !P(l, s).daily.title)).toEqual([]);
    const sh = Object.fromEntries(signs().map((s) => [s, shingles(words(dailyText(P(l, s))))]));
    expect(pairs(signs()).filter(([a, b]) => jaccard(sh[a], sh[b]) > MAX_JACCARD)).toEqual([]);
    expect(signs().filter((s) => jaccard(sh[s], shingles(words(page(P(l, s))))) > 0.02)).toEqual([]);
  });
  it("punctuation follows the style guide", () => {
    expect(signs().filter((s) => /[—–]|\s-\s/u.test(every(P(l, s))))).toEqual([]);
    if (l === "mk") expect(signs().filter((s) => /[a-z]/i.test(every(P(l, s)).replaceAll("{dates}", "")))).toEqual([]);
  });
});
