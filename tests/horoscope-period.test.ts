import { describe, it, expect } from "vitest";
import { addDays } from "@/engine/skyday";
import { periodSky } from "@/engine/skyperiod";
import { SIGNS } from "@/engine/zodiac";
import { HORO_LOCALES } from "@/lib/horoscope";
import { PERIOD_BANKS, currentMonth, currentWeek, monthPeriod, periodBlocks, periodReading, publishedMonths, skyLines, weekPeriod, type Period } from "@/lib/horoscope-period";
import { localizedPath } from "@/lib/i18n-routes";
import { monthly } from "@/lib/sections/monthly-horoscope";
import { weekly } from "@/lib/sections/weekly-horoscope";

/** A family of 12 signs × every period is exactly what scaled content rules look at: each page has to stand on its own. */
const MAX_OVERLAP = 0.4; // share of 5 word shingles two pages may have in common
const MIN_WORDS = { week: 500, month: 800 };
const WEEKS = ["2026-10-26", "2026-11-02", "2026-12-28", "2027-02-15", "2027-03-29", "2027-07-05", "2027-11-08", "2028-04-17"].map(weekPeriod);
const MONTHS = ["2026-11", "2026-12", "2027-02", "2027-06", "2027-09", "2028-01"].map(monthPeriod);
const nextWeek = (p: Period) => weekPeriod(addDays(p.start, 7));
const nextMonth = (p: Period) => monthPeriod(addDays(p.end, 1).slice(0, 7));

const text = (lang: string, sign: (typeof SIGNS)[number], p: Period) => { const r = periodReading(lang, sign, p); return periodBlocks(lang, r).flatMap((b) => [...(b.paras ?? []), ...(b.list ?? []), b.quote ?? ""]).filter(Boolean).join(" "); };
const words = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(Boolean);
const shingles = (w: string[], k = 5) => { const o = new Set<string>(); for (let i = 0; i + k <= w.length; i++) o.add(w.slice(i, i + k).join(" ")); return o; };
const jaccard = (a: Set<string>, b: Set<string>) => { let n = 0; for (const x of a) if (b.has(x)) n++; return n / (a.size + b.size - n || 1); };
const sh = (lang: string, sign: (typeof SIGNS)[number], p: Period) => shingles(words(text(lang, sign, p)));

/** Mirrors the shape of the English bank: same keys, same pool sizes (or larger), no empty string. */
function sameShape(en: unknown, other: unknown, path: string, out: string[]) {
  if (typeof en === "string") { if (typeof other !== "string" || !other.trim()) out.push(path); return; }
  if (typeof en === "function") { if (typeof other !== "function") out.push(path); return; }
  if (Array.isArray(en)) {
    if (!Array.isArray(other) || other.length < en.length) out.push(`${path}[${Array.isArray(other) ? other.length : "?"}]`);
    else en.forEach((x, i) => sameShape(x, other[i], `${path}.${i}`, out));
    return;
  }
  if (en && typeof en === "object") for (const k of Object.keys(en)) sameShape((en as Record<string, unknown>)[k], (other as Record<string, unknown> | undefined)?.[k], `${path}.${k}`, out);
}

describe("period sky", () => {
  it("finds the real events of November 2026 and the eclipses of February 2027", () => {
    const nov = periodSky("2026-11-01", "2026-11-30").events;
    expect(nov.find((e) => e.kind === "lunation" && e.quarter === "new")).toMatchObject({ iso: "2026-11-09", sign: "scorpio" });
    expect(nov.find((e) => e.kind === "station" && e.body === "mercury")).toMatchObject({ iso: "2026-11-13", dir: "direct" });
    expect(nov.find((e) => e.kind === "ingress" && e.body === "sun")).toMatchObject({ iso: "2026-11-22", to: "sagittarius" });
    const feb = periodSky("2027-02-01", "2027-02-28").events;
    expect(feb.find((e) => e.kind === "lunation" && e.quarter === "new")).toMatchObject({ iso: "2027-02-06", eclipse: "solar" });
    expect(feb.find((e) => e.kind === "lunation" && e.quarter === "full")).toMatchObject({ iso: "2027-02-21", eclipse: "lunar" });
  });
  it("weeks run Monday to Sunday and months cover the calendar month", () => {
    expect(weekPeriod("2026-11-01")).toMatchObject({ start: "2026-10-26", end: "2026-11-01" });
    expect(weekPeriod("2026-11-02")).toMatchObject({ start: "2026-11-02", end: "2026-11-08" });
    expect(monthPeriod("2027-02")).toMatchObject({ start: "2027-02-01", end: "2027-02-28" });
    expect(currentWeek(new Date("2026-11-01T23:30:00Z")).start).toBe("2026-11-02"); // already Monday in Skopje
    expect(currentMonth(new Date("2026-11-30T23:30:00Z")).start).toBe("2026-12-01");
  });
  it("publishes the current and next month and never drops a month", () => {
    expect(publishedMonths(new Date("2026-10-31T12:00:00Z"))).toEqual(["2026-11"]);
    expect(publishedMonths(new Date("2026-11-01T12:00:00Z"))).toEqual(["2026-11", "2026-12"]);
    expect(publishedMonths(new Date("2027-01-15T12:00:00Z"))).toEqual(["2026-11", "2026-12", "2027-01", "2027-02"]);
  });
});

describe("period banks", () => {
  for (const l of HORO_LOCALES) it(`${l} has every key and pool the English bank has`, () => {
    const out: string[] = []; sameShape(PERIOD_BANKS.en, PERIOD_BANKS[l], "bank", out); expect(out).toEqual([]);
  });
  it("house pools hold three variants, so consecutive periods can differ", () => {
    for (const l of HORO_LOCALES) for (const k of ["sun", "mercury", "venus", "mars", "jupiter", "saturn", "best", "prompts"] as const) for (const v of PERIOD_BANKS[l][k]) expect(new Set(v).size).toBe(3);
  });
});

for (const [kind, sample, next, min] of [["week", WEEKS, nextWeek, MIN_WORDS.week], ["month", MONTHS, nextMonth, MIN_WORDS.month]] as const) {
  describe(`${kind}ly horoscope pages`, () => {
    for (const l of HORO_LOCALES) {
      it(`${l}: at least ${min} words of main text, with dated sky events`, () => {
        const short: string[] = [];
        for (const p of sample) for (const s of SIGNS) {
          const n = words(text(l, s, p)).length; if (n < min) short.push(`${s} ${p.start}: ${n}`);
          const r = periodReading(l, s, p);
          expect(r.sky.length, `${s} ${p.start}`).toBeGreaterThan(0);
          expect(r.sky.every((x) => /\d/.test(x)), `${s} ${p.start}`).toBe(true);
          expect(r.best.length, `${s} ${p.start}`).toBe(kind === "week" ? 3 : 5);
        }
        expect(short).toEqual([]);
      }, 300_000);
      it(`${l}: two signs in one ${kind} stay under ${MAX_OVERLAP * 100}% overlap`, () => {
        const bad: string[] = [];
        for (const p of sample) { const all = SIGNS.map((s) => sh(l, s, p)); for (let a = 0; a < 12; a++) for (let b = a + 1; b < 12; b++) { const j = jaccard(all[a], all[b]); if (j >= MAX_OVERLAP) bad.push(`${SIGNS[a]}/${SIGNS[b]} ${p.start}: ${j.toFixed(3)}`); } }
        expect(bad).toEqual([]);
      }, 300_000);
      it(`${l}: one sign in consecutive ${kind}s stays under ${MAX_OVERLAP * 100}% overlap`, () => {
        const bad: string[] = [];
        for (const p of sample) for (const s of SIGNS) { const j = jaccard(sh(l, s, p), sh(l, s, next(p))); if (j >= MAX_OVERLAP) bad.push(`${s} ${p.start}: ${j.toFixed(3)}`); }
        expect(bad).toEqual([]);
      }, 300_000);
      it(`${l}: no template seams and snippets fit a search result`, () => {
        const seams = /undefined|null|NaN|\[object|function|=>|\$\{|\s{2}| [,.:;!?]|,,|\.\.|^\s|\s$/;
        const bad: string[] = [];
        for (const p of sample) {
          for (const x of skyLines(l, p)) if (seams.test(x)) bad.push(`hub ${p.start}: ${x}`);
          for (const s of SIGNS) {
            const r = periodReading(l, s, p);
            for (const x of [r.label, r.lead, r.description, r.prompt, ...r.short, ...r.sky, ...r.steps, ...r.love, ...r.work, ...r.well, ...r.best]) if (!x || seams.test(x)) bad.push(`${s} ${p.start}: ${x}`);
            for (const d of kind === "month" ? [r.description, r.descriptionDated] : [r.description]) if (d.length < 120 || d.length > 155) bad.push(`${s} ${p.start} (${d.length}): ${d}`);
          }
        }
        expect(bad).toEqual([]);
      }, 300_000);
    }
  });
}

describe("period sections", () => {
  const now = new Date();
  it("weekly has a hub and 12 signs, monthly adds every published month", () => {
    expect(weekly.paths().length).toBe(13);
    expect(monthly.paths().length).toBe(13 + 12 * publishedMonths(now).length);
    expect(monthly.paths()).toContain("/monthly-horoscope/capricorn/2026-11/");
  });
  it("public URLs match the brief", () => {
    expect(localizedPath("de", "/weekly-horoscope/capricorn/")).toBe("/de/wochenhoroskop/steinbock/");
    expect(localizedPath("mk", "/weekly-horoscope/capricorn/")).toBe("/mk/nedelen-horoskop/jarec/");
    expect(localizedPath("de", "/monthly-horoscope/capricorn/2026-11/")).toBe("/de/monatshoroskop/steinbock/2026-11/");
    expect(localizedPath("mk", "/monthly-horoscope/capricorn/2026-11/")).toBe("/mk/mesecen-horoskop/jarec/2026-11/");
  });
  it("modified is the start of the current period, never the build date or a future date", () => {
    expect(weekly.modified("/weekly-horoscope/aries/")).toBe(currentWeek(now).start);
    expect(monthly.modified("/monthly-horoscope/aries/")).toBe(currentMonth(now).start);
    for (const p of monthly.paths()) expect(monthly.modified(p) <= currentMonth(now).start, p).toBe(true);
  });
  it("titles follow the brief", () => {
    const m = monthly.paths().find((p) => /\d{4}-\d{2}\/$/.test(p) && p.includes("capricorn"))!;
    expect(weekly.model("de", "/weekly-horoscope/capricorn/")!.title).toBe("Wochenhoroskop Steinbock");
    expect(weekly.model("en", "/weekly-horoscope/capricorn/")!.title).toBe("Capricorn weekly horoscope");
    expect(monthly.model("de", "/monthly-horoscope/capricorn/2026-11/")?.title).toBe("Monatshoroskop Steinbock November 2026");
    expect(monthly.model("en", "/monthly-horoscope/capricorn/2026-11/")?.title).toBe("Capricorn monthly horoscope November 2026");
    expect(monthly.model("en", m)).not.toBeNull();
  });
  it("unknown paths give no page", () => {
    expect(weekly.model("en", "/weekly-horoscope/nope/")).toBeNull();
    expect(weekly.model("en", "/weekly-horoscope/aries/2026-11/")).toBeNull();
    expect(monthly.model("en", "/monthly-horoscope/aries/2026-10/")).toBeNull();
  });
  for (const l of HORO_LOCALES) it(`${l}: every published page builds, with links to the sister pages`, () => {
    for (const s of [weekly, monthly]) for (const p of s.paths()) {
      const m = s.model(l, p)!;
      expect(m, p).not.toBeNull();
      expect(m.title.length, `${p}: ${m.title}`).toBeLessThanOrEqual(55);
      expect(m.description.length, `${p}: ${m.description}`).toBeGreaterThanOrEqual(120);
      expect(m.description.length, `${p}: ${m.description}`).toBeLessThanOrEqual(155);
      const sign = p.split("/")[2];
      if (sign) for (const link of [`/horoscope/${sign}/`, `/zodiac/${sign}/`, `/horoscope-2027/${sign}/`, "/moon-calendar/"]) expect(m.related!.some((x) => x.href === localizedPath(l, link)), `${p} → ${link}`).toBe(true);
    }
  }, 300_000);
  it("descriptions are unique within a build", () => {
    for (const l of HORO_LOCALES) { const d = [...weekly.paths().map((p) => weekly.model(l, p)!), ...monthly.paths().map((p) => monthly.model(l, p)!)].map((m) => m.description); expect(new Set(d).size).toBe(d.length); }
  }, 300_000);
});
