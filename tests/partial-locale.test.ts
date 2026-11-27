import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { addDays } from "@/engine/skyday";
import { SIGNS } from "@/engine/zodiac";
import { LOCALES } from "@/content";
import { reading } from "@/lib/horoscope";
import { PERIOD_BANKS, monthPeriod, periodBlocks, periodHub, periodReading, skyLines, type Period } from "@/lib/horoscope-period";
import { SL_SIGN_SLUGS, ROUTE_LOCALES, localizedPath, parsePath, routeAlternates, switchLocale } from "@/lib/i18n-routes";
import { PARTIAL_LOCALES, inPartialScope, partialPaths } from "@/lib/partial-scope";
import { languageAlternates } from "@/lib/seo";
import sitemap from "@/app/sitemap";

/** The Slovenian test: a small, self-contained set of pages. These tests pin its scope (nothing leaks to other pages) and hold its copy to the same rules as the full languages. */
const strings = (v: unknown, out: string[] = []): string[] => { if (typeof v === "string") out.push(v); else if (Array.isArray(v)) v.forEach((x) => strings(x, out)); else if (v && typeof v === "object") Object.values(v).forEach((x) => strings(x, out)); return out; };
const SEAMS = /undefined|null|NaN|\[object|function|=>|\$\{|\s{2}| [,.:;!?]|,,|\.\.|^\s|\s$/;
const words = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(Boolean);
const shingles = (w: string[], k = 5) => { const o = new Set<string>(); for (let i = 0; i + k <= w.length; i++) o.add(w.slice(i, i + k).join(" ")); return o; };
const jaccard = (a: Set<string>, b: Set<string>) => { let n = 0; for (const x of a) if (b.has(x)) n++; return n / (a.size + b.size - n || 1); };
const days = (from: string, n: number) => Array.from({ length: n }, (_, i) => addDays(from, i));
/** Forms that tie Slovenian to a gender (l-participles, "rad", "sam") or break the editorial rules (dashes, app talk). */
const GENDERED = /.{0,50}(?:\b(?:si|boš|bom|smo|ste)\s+\p{L}+(?:il|el|al|ul|dal|bil|šel|vzel|rekel)a?\b|\brad\b|(?<!en )\bsam\b|\bpripravljen\b|\bprepričan\b|\butrujen\b|\bzadovoljen\b).{0,30}/iu;
const DASHES = /[\u2013\u2014]/;

describe("scope of the Slovenian test", () => {
  it("is not a full locale", () => {
    expect([...PARTIAL_LOCALES]).toEqual(["sl"]);
    expect(LOCALES as readonly string[]).not.toContain("sl");
    expect(ROUTE_LOCALES as readonly string[]).not.toContain("sl");
  });
  it("serves exactly the home, both hubs and 12 signs of each", () => {
    expect(partialPaths().length).toBe(1 + 2 * 13);
    expect(new Set(partialPaths()).size).toBe(27);
  });
  it("has a route file for each of its pages and no others", () => {
    for (const f of ["layout", "page"]) expect(existsSync(`src/app/sl/${f}.tsx`), f).toBe(true);
    for (const d of ["dnevni-horoskop", "mesecni-horoskop"]) for (const f of [`${d}/page.tsx`, `${d}/[sign]/page.tsx`]) expect(existsSync(`src/app/sl/${f}`), f).toBe(true);
  });
  it("builds Slovenian URLs and reads them back", () => {
    expect(localizedPath("sl", "/horoscope/taurus/")).toBe("/sl/dnevni-horoskop/bik/");
    expect(localizedPath("sl", "/monthly-horoscope/gemini/")).toBe("/sl/mesecni-horoskop/dvojcka/");
    expect(localizedPath("sl", "/monthly-horoscope/")).toBe("/sl/mesecni-horoskop/");
    for (const p of partialPaths().filter((x) => x !== "/")) expect(parsePath(localizedPath("sl", p))).toEqual(["sl", p]);
    expect(new Set(Object.values(SL_SIGN_SLUGS)).size).toBe(12);
  });
  it("offers sl hreflang on exactly those pages and on no others", () => {
    for (const p of partialPaths().filter((x) => x !== "/")) { expect(routeAlternates(p).sl, p).toBe(localizedPath("sl", p)); expect(languageAlternates(p).sl, p).toBeTruthy(); }
    for (const p of ["/", "/pricing/", "/weekly-horoscope/", "/horoscope-2027/", "/horoscope/aries/2026-11-27/", "/monthly-horoscope/aries/2026-11/", "/numerology/", "/blog/", "/zodiac/aries/", "/moon-calendar/", "/zodiac-compatibility/"]) {
      expect(inPartialScope("sl", p), p).toBe(false); expect(routeAlternates(p).sl, p).toBeUndefined(); expect(languageAlternates(p).sl, p).toBeUndefined();
    }
  });
  it("the language switch leads to the Slovenian page when there is one, else to its home", () => {
    expect(switchLocale("/en/horoscope/taurus/", "sl")).toBe("/sl/dnevni-horoskop/bik/");
    expect(switchLocale("/mk/mesecen-horoskop/", "sl")).toBe("/sl/mesecni-horoskop/");
    expect(switchLocale("/en/pricing/", "sl")).toBe("/sl/");
    expect(switchLocale("/sl/dnevni-horoskop/rak/", "de")).toBe("/de/tageshoroskop/krebs/");
    expect(switchLocale("/sl/dnevni-horoskop/rak/", "en")).toBe("/en/horoscope/cancer/");
  });
  it("lists its 27 pages in the sitemap, each once, the pairs with the full hreflang set", () => {
    const e = sitemap().filter((x) => new URL(x.url).pathname.startsWith("/sl/"));
    expect(e.length).toBe(27); expect(new Set(e.map((x) => x.url)).size).toBe(27);
    for (const x of e) { const path = new URL(x.url).pathname; if (path === "/sl/") continue; const l = x.alternates!.languages as Record<string, string>; expect(Object.keys(l).sort(), x.url).toEqual(["de", "en", "mk", "sl", "sr", "x-default"]); expect(l.sl).toBe(x.url); }
    // every language-version of an sl pair lists the sl page too, and no other core page names sl
    const core = sitemap().filter((x) => !new URL(x.url).pathname.startsWith("/sl/") && x.alternates && "sl" in (x.alternates.languages as object));
    expect(core.length).toBe(4 * 26);
  });
  it("keeps the Slovenian layout free of the account and app chrome", () => {
    const src = readFileSync("src/app/sl/layout.tsx", "utf8");
    for (const w of ["AccountBoot", "BetaGate", "LocaleContent", "PrintKit"]) expect(src.includes(w), w).toBe(false);
  });
});

describe("Slovenian daily horoscope", () => {
  const D = days("2026-11-27", 730);
  it("gives the 12 signs a different headline every day, for two years", () => {
    const bad: string[] = [];
    for (const d of D) { const h = SIGNS.map((s) => reading("sl", s, d).headline); if (new Set(h).size !== 12) bad.push(d); }
    expect(bad).toEqual([]);
  }, 300_000);
  it("never repeats a text on the next day", () => {
    const bad: string[] = [];
    const D2 = days("2026-11-27", 120);
    for (const s of SIGNS) for (let i = 1; i < D2.length; i++) { const a = reading("sl", s, D2[i - 1]), b = reading("sl", s, D2[i]); if (a.headline === b.headline || a.overview === b.overview || a.description === b.description) bad.push(`${s} ${D2[i]}`); }
    expect(bad).toEqual([]);
  }, 300_000);
  it("has no template seams, dashes or gendered forms, and a snippet that fits a search result", () => {
    const bad: string[] = [];
    for (const d of days("2026-11-27", 60)) for (const s of SIGNS) {
      const r = reading("sl", s, d);
      for (const x of strings(r)) { if (SEAMS.test(x)) bad.push(`seam ${s} ${d}: ${x}`); if (DASHES.test(x)) bad.push(`dash ${s} ${d}: ${x}`); const g = x.match(GENDERED); if (g) bad.push(`gender ${s} ${d}: ${g[0]}`); }
      if (r.description.length < 80 || r.description.length > 158) bad.push(`description ${s} ${d} (${r.description.length})`);
      if (!/\d{1,2}\. (januar|februar|marec|april|maj|junij|julij|avgust|september|oktober|november|december) \d{4}/.test(r.title)) bad.push(`title ${s} ${d}: ${r.title}`);
    }
    expect(bad).toEqual([]);
  }, 300_000);
});

describe("Slovenian monthly horoscope", () => {
  const MONTHS = ["2026-11", "2026-12", "2027-02", "2027-06", "2027-09", "2028-01"].map(monthPeriod);
  const next = (p: Period) => monthPeriod(addDays(p.end, 1).slice(0, 7));
  const text = (s: (typeof SIGNS)[number], p: Period) => periodBlocks("sl", periodReading("sl", s, p)).flatMap((b) => [...(b.paras ?? []), ...(b.list ?? []), b.quote ?? ""]).join(" ");
  const sameShape = (en: unknown, o: unknown, path: string, out: string[]) => {
    if (typeof en === "string") { if (typeof o !== "string" || !o.trim()) out.push(path); return; }
    if (typeof en === "function") { if (typeof o !== "function") out.push(path); return; }
    if (Array.isArray(en)) { if (!Array.isArray(o) || o.length < en.length) out.push(path); else en.forEach((x, i) => sameShape(x, o[i], `${path}.${i}`, out)); return; }
    if (en && typeof en === "object") for (const k of Object.keys(en)) sameShape((en as Record<string, unknown>)[k], (o as Record<string, unknown> | undefined)?.[k], `${path}.${k}`, out);
  };
  it("has every key and pool the English bank has, and three variants per house pool", () => {
    const out: string[] = []; sameShape(PERIOD_BANKS.en, PERIOD_BANKS.sl, "bank", out); expect(out).toEqual([]);
    for (const k of ["sun", "mercury", "venus", "mars", "jupiter", "saturn", "best", "prompts"] as const) for (const v of PERIOD_BANKS.sl[k]) expect(new Set(v).size).toBe(3);
  });
  it("has at least 800 words of main text and dated sky events", () => {
    const short: string[] = [];
    for (const p of MONTHS) for (const s of SIGNS) { const n = words(text(s, p)).length; if (n < 800) short.push(`${s} ${p.start}: ${n}`); const r = periodReading("sl", s, p); expect(r.sky.length).toBeGreaterThan(0); expect(r.best.length).toBe(5); }
    expect(short).toEqual([]);
  }, 300_000);
  it("keeps two signs, and one sign in two months, under 40% overlap", () => {
    const bad: string[] = [];
    for (const p of MONTHS) { const all = SIGNS.map((s) => shingles(words(text(s, p)))); for (let a = 0; a < 12; a++) for (let b = a + 1; b < 12; b++) { const j = jaccard(all[a], all[b]); if (j >= 0.4) bad.push(`${SIGNS[a]}/${SIGNS[b]} ${p.start}: ${j.toFixed(3)}`); } }
    for (const p of MONTHS) for (const s of SIGNS) { const j = jaccard(shingles(words(text(s, p))), shingles(words(text(s, next(p))))); if (j >= 0.4) bad.push(`${s} ${p.start}→next: ${j.toFixed(3)}`); }
    expect(bad).toEqual([]);
  }, 300_000);
  it("has no seams, dashes or gendered forms, and descriptions of 120 to 155 characters", () => {
    const bad: string[] = [];
    for (const p of MONTHS) {
      for (const x of skyLines("sl", p)) if (SEAMS.test(x)) bad.push(`hub ${p.start}: ${x}`);
      for (const s of SIGNS) {
        const r = periodReading("sl", s, p);
        for (const x of [...strings(r), text(s, p)]) { if (SEAMS.test(x) && !x.includes("  ")) bad.push(`${s} ${p.start}: ${x.slice(0, 80)}`); if (DASHES.test(x)) bad.push(`dash ${s} ${p.start}`); const g = x.match(GENDERED); if (g) bad.push(`gender ${s} ${p.start}: ${g[0]}`); }
        for (const d of [r.description, r.descriptionDated]) if (d.length < 120 || d.length > 155) bad.push(`${s} ${p.start} (${d.length}): ${d}`);
      }
    }
    expect(bad).toEqual([]);
  }, 300_000);
  it("links the monthly hub only to pages the Slovenian test has", () => {
    const hub = periodHub("sl", MONTHS[0], "/monthly-horoscope/");
    for (const l of hub.related ?? []) expect(l.href.startsWith("/sl/"), l.href).toBe(true);
  });
});
