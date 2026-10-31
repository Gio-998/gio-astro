import { describe, it, expect } from "vitest";
import { numPaths, numModel, ANGEL, LIFE, MIRROR_KEYS } from "@/lib/numerology";
import { bankFor, reading, VARIETY } from "@/lib/horoscope";
import { dayMeta, hubMeta } from "@/components/horoscope/routes";
import { publishedDates } from "@/engine/skyday";
import { SIGNS } from "@/engine/zodiac";
import { translit } from "@/engine/translit";
import { getContent } from "@/content";
import { PAIRS } from "@/content/numerology/pairs";
import { YEAR2027 } from "@/content/numerology/year2027";
import type { DayCtx } from "@/content/horoscope/variety-types";

/** Search snippet limits for every Macedonian numerology and horoscope page. */
const TITLE_MAX = 55;
const DESC_MIN = 110;
const DESC_MAX = 158;

const B = bankFor("mk");
const C = getContent("mk");
const signNames = SIGNS.map((s) => C.astro.signs[s].name);
const byLen = <T extends string>(xs: readonly T[]) => [...xs].sort((a, b) => a.length - b.length);
const ends = <T extends string>(xs: readonly T[]) => { const s = byLen(xs); return [s[0], s[s.length - 1]]; };
const unbranded = (m: { title?: unknown }) => (m.title as { absolute: string }).absolute.replace(/ · [^·]+$/, "");
const descOf = (m: { description?: string | null }) => m.description ?? "";

const titleErr = (where: string, t: string) => (t.length > TITLE_MAX ? [`${where}: title ${t.length}: ${t}`] : []);
const descErr = (where: string, d: string) => (d.length < DESC_MIN || d.length > DESC_MAX ? [`${where}: description ${d.length}: ${d}`] : []);

const numPages = numPaths().map((p) => ({ p, m: numModel("mk", p)! }));
const signSlugs = SIGNS.map((s) => B.signSlug[s]);
const recent = publishedDates().slice(-14);

describe("Macedonian search snippets", () => {
  it(`numerology: titles at most ${TITLE_MAX}, descriptions ${DESC_MIN} to ${DESC_MAX}`, () => {
    expect(numPages.length).toBeGreaterThan(200);
    expect(numPages.flatMap(({ p, m }) => [...titleErr(p, m.title), ...descErr(p, m.description)])).toEqual([]);
  });
  it("numerology: every description is a finished sentence, never cut off by the 158 character slice", () => {
    expect(numPages.filter(({ m }) => !/[.!?]$/.test(m.description)).map(({ p, m }) => `${p}: ${m.description}`)).toEqual([]);
  });
  it("sign pages and the hub fit the limits", async () => {
    const pages = await Promise.all(signSlugs.map(async (slug) => [slug, await dayMeta("mk", slug)] as const));
    const hub = await hubMeta("mk");
    expect([...pages, ["hub", hub] as const].flatMap(([w, m]) => [...titleErr(w, unbranded(m)), ...descErr(w, descOf(m))])).toEqual([]);
  });
  it("dated titles fit on the longest sign and date, and read the way people search", () => {
    const labels = ["1 мај 2026", "30 септември 2026", "31 октомври 2026"];
    expect(signNames.flatMap((s) => labels.flatMap((d) => [...titleErr(`${s} ${d}`, B.ui.title(s, d)), ...titleErr(`${s} ${d} today`, `${B.ui.shortTitle(s)}, ${d}`)]))).toEqual([]);
    expect(B.ui.title("Овен", "31 октомври 2026")).toBe("Хороскоп за Овен, 31 октомври 2026");
  });
  it("dated descriptions fit for every headline, at the extremes of sign, date and sky", () => {
    // Headline lengths grow with each field, so the shortest and longest values bound every real date.
    const [dayS, dayL] = ends(B.weekdays); const [moonS, moonL] = ends(signNames); const [topicS, topicL] = ends(B.topics); const [phaseS, phaseL] = ends(Object.values(B.phases));
    const ctxs: DayCtx[] = [{ day: dayS, moon: moonS, phase: phaseS, topic: topicS }, { day: dayL, moon: moonL, phase: phaseL, topic: topicL }];
    const [signS, signL] = ends(signNames);
    const bad: string[] = [];
    for (const h of VARIETY.mk.headline) for (const ctx of ctxs) for (const s of [signS, signL]) for (const d of ["1 мај 2026", "30 септември 2026"]) bad.push(...descErr(`${s} ${d}`, B.ui.description(s, d, h(ctx))));
    expect(bad).toEqual([]);
  });
  it("dated pages carry the numeric date people type, in the limits, on real days", () => {
    const bad: string[] = [];
    for (const sign of SIGNS) for (const iso of recent) {
      const r = reading("mk", sign, iso); const [y, m, d] = iso.split("-");
      bad.push(...titleErr(`${sign} ${iso}`, r.title), ...descErr(`${sign} ${iso}`, r.description));
      if (!r.description.includes(`${d}.${m}.${y}`)) bad.push(`${sign} ${iso}: no numeric date: ${r.description}`);
      if (!r.description.includes(r.dateLabel)) bad.push(`${sign} ${iso}: no written date: ${r.description}`);
    }
    expect(bad).toEqual([]);
  });
  it("no two pages share a description", async () => {
    const dated = SIGNS.flatMap((s) => recent.map((iso) => [`${s} ${iso}`, reading("mk", s, iso).description] as const));
    const signs = await Promise.all(signSlugs.map(async (slug) => [slug, descOf(await dayMeta("mk", slug))] as const));
    const all: (readonly [string, string])[] = [...numPages.map(({ p, m }) => [p, m.description] as const), ...signs, ["hub", descOf(await hubMeta("mk"))], ...dated];
    const seen = new Map<string, string[]>();
    for (const [where, d] of all) seen.set(d, [...(seen.get(d) ?? []), where]);
    expect([...seen.entries()].filter(([, w]) => w.length > 1).map(([d, w]) => `${w.join(", ")}: ${d}`)).toEqual([]);
  });
  it("no boilerplate closing clause: pages do not end on the same words", async () => {
    const signs = await Promise.all(signSlugs.map(async (slug) => descOf(await dayMeta("mk", slug))));
    const tail = (d: string) => d.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(Boolean).slice(-4).join(" ");
    const seen = new Map<string, number>();
    for (const d of [...numPages.map(({ m }) => m.description), ...signs]) seen.set(tail(d), (seen.get(tail(d)) ?? 0) + 1);
    expect([...seen.entries()].filter(([, n]) => n > 2)).toEqual([]);
  });
  it("every number page opens its title with the phrase people search", () => {
    for (const a of ANGEL) expect(numModel("mk", `/numerology/angel-numbers/${a}/`)!.title.startsWith(`${a} значење`), a).toBe(true);
    for (const k of MIRROR_KEYS) expect(numModel("mk", `/numerology/mirror-hours/${k}/`)!.title.startsWith(`${k.replace("-", ":")} значење`), k).toBe(true);
    for (const n of LIFE) expect(numModel("mk", `/numerology/life-path/${n}/`)!.title.startsWith(`Патека на животот ${n}`), String(n)).toBe(true);
    expect(Object.values(PAIRS.mk).filter((p) => !p.title.startsWith("Патека на животот"))).toEqual([]);
    expect(Object.values(YEAR2027.mk).filter((p) => p.title.length > TITLE_MAX)).toEqual([]);
  });
});

describe("Macedonian Latin script forms", () => {
  const pageText = (p: string) => { const m = numModel("mk", p)!; return [m.description, ...m.faq.flat(), ...m.blocks.flatMap((b) => b.paras ?? [])].join(" "); };

  it("all 12 sign pages give the spelling typed in search", () => {
    for (const s of signNames) {
      expect(B.ui.signHubMeta(s), s).toContain(`horoskop ${translit(s)}`);
      expect(B.ui.signHubIntro(s), s).toContain(`horoskop ${translit(s)}`);
    }
    expect(B.ui.hubSub).toContain("dneven horoskop");
  });
  it("angel and life path pages use the Latin form in the description and the questions", () => {
    for (const a of ANGEL) { const m = numModel("mk", `/numerology/angel-numbers/${a}/`)!; expect(m.description, a).toMatch(/zna[cč]enje/); expect(m.faq[0][0], a).toContain(`${a} znacenje`); }
    for (const n of LIFE) { const m = numModel("mk", `/numerology/life-path/${n}/`)!; expect(m.description.toLowerCase(), String(n)).toContain(`pateka na zivotot ${n}`); expect(m.faq[0][0], String(n)).toContain(`pateka na zivotot ${n}`); }
  });
  it("mirror pages give the spaced form people search, such as 13 13 znacenje", () => {
    for (const k of MIRROR_KEYS) expect(pageText(`/numerology/mirror-hours/${k}/`), k).toContain(`${k.replace("-", " ")} znacenje`);
  });
  it("every numerology hub names itself in Latin script", () => {
    const hubs = numPaths().filter((p) => numModel("mk", p)!.kind === "hub");
    expect(hubs.length).toBeGreaterThan(10);
    expect(hubs.filter((p) => !/[a-z]{4,}/.test(pageText(p)))).toEqual([]);
  });
  it("uses Macedonian digit names, not the Serbian ones", () => {
    const body = JSON.stringify([PAIRS.mk, YEAR2027.mk]);
    expect(body).not.toMatch(/[Сс]едмиц/);
    expect(body).not.toMatch(/неухватлив/);
  });
});
