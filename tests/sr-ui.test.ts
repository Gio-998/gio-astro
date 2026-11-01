import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { site as siteEn } from "../src/content/en/site";
import { site as siteSr } from "../src/content/sr/site";
import { nav as navEn } from "../src/content/en/nav";
import { nav as navSr } from "../src/content/sr/nav";
import { landing as landingEn } from "../src/content/en/landing";
import { landing as landingSr } from "../src/content/sr/landing";
import { you as youEn, partners as partnersEn } from "../src/content/en/you";
import { you as youSr, partners as partnersSr } from "../src/content/sr/you";
import { glance as glanceEn } from "../src/content/en/glance";
import { glance as glanceSr } from "../src/content/sr/glance";
import { lensInfo as lensEn, lensUi as lensUiEn } from "../src/content/en/lens";
import { lensInfo as lensSr, lensUi as lensUiSr } from "../src/content/sr/lens";
import { sky as skyEn } from "../src/content/en/sky";
import { sky as skySr } from "../src/content/sr/sky";
import { premium as premiumEn } from "../src/content/en/premium";
import { premium as premiumSr } from "../src/content/sr/premium";
import { play as playEn } from "../src/content/en/play";
import { play as playSr } from "../src/content/sr/play";
import { adaptive as adaptiveEn } from "../src/content/en/adaptive";
import { adaptive as adaptiveSr } from "../src/content/sr/adaptive";
import { day as dayEn } from "../src/content/en/extra/day";
import { day as daySr } from "../src/content/sr/extra/day";
import { book as bookEn } from "../src/content/en/book";
import { book as bookSr } from "../src/content/sr/book";
import { admin as adminEn } from "../src/content/en/admin";
import { admin as adminSr } from "../src/content/sr/admin";
import * as uiEn from "../src/content/en/ui";
import * as uiSr from "../src/content/sr/ui";
import { en as pricingEn, sr as pricingSr } from "../src/components/pricing/text";
import { HOME_META } from "../src/content/home-meta";
import { renderWelcome, TESTS } from "../supabase/functions/_shared/lead-email";

/** Runs before the locale is wired in, so it reads the Serbian files directly. */
const SOURCES = [
  ["site", siteEn, siteSr], ["nav", navEn, navSr], ["landing", landingEn, landingSr], ["you", youEn, youSr], ["partners", partnersEn, partnersSr],
  ["glance", glanceEn, glanceSr], ["lensInfo", lensEn, lensSr], ["lensUi", lensUiEn, lensUiSr], ["sky", skyEn, skySr], ["premium", premiumEn, premiumSr],
  ["play", playEn, playSr], ["adaptive", adaptiveEn, adaptiveSr], ["day", dayEn, daySr],
  ["book", bookEn, bookSr], ["admin", adminEn, adminSr], ["ui", uiEn, uiSr], ["pricing", pricingEn, pricingSr],
] as const;

function sameShape(a: unknown, b: unknown, path: string, out: string[]) {
  if (typeof a === "string") { if (typeof b !== "string" || (a.trim() && !b.trim())) out.push(path); return; }
  if (typeof a === "function") { if (typeof b !== "function") out.push(path); return; }
  if (Array.isArray(a)) { if (!Array.isArray(b) || b.length !== a.length) out.push(`${path}[${Array.isArray(b) ? b.length : "?"}]`); else a.forEach((x, i) => sameShape(x, b[i], `${path}.${i}`, out)); return; }
  if (a && typeof a === "object") for (const k of Object.keys(a)) sameShape((a as Record<string, unknown>)[k], (b as Record<string, unknown> | undefined)?.[k], `${path}.${k}`, out);
}
function strings(v: unknown, out: string[] = []): string[] {
  if (typeof v === "string") out.push(v);
  else if (Array.isArray(v)) v.forEach((x) => strings(x, out));
  else if (v && typeof v === "object") Object.values(v).forEach((x) => strings(x, out));
  return out;
}
const srStrings = SOURCES.flatMap(([, , b]) => strings(b));
/** The text a Serbian legal block shows, without the code around it. */
const legal = (page: string) => { const s = readFileSync(`src/app/[lang]/${page}/page.tsx`, "utf8"); return s.slice(s.indexOf("function PageSr"), s.indexOf("export default")); };
const english = (page: string) => { const s = readFileSync(`src/app/[lang]/${page}/page.tsx`, "utf8"); return s.slice(s.indexOf("function PageEn"), s.indexOf("function PageMk")); };
const count = (s: string, rx: RegExp) => (s.match(rx) ?? []).length;

describe("Serbian UI files mirror the English ones", () => {
  for (const [name, a, b] of SOURCES) it(`${name}: every key, array and function exists`, () => { const out: string[] = []; sameShape(a, b, name, out); expect(out).toEqual([]); });
  it("nav keeps every href and icon", () => {
    const links = (v: unknown): string[] => (v && typeof v === "object" ? Object.entries(v).flatMap(([k, x]) => (k === "href" || k === "icon" ? [String(x)] : links(x))) : []);
    expect(links(navSr)).toEqual(links(navEn));
  });
  it("covers the new test run, lead form and email settings strings", () => {
    expect(uiSr.tests.all.title).toBe("Uradi sve testove");
    expect(uiSr.pageMeta.email.title).toBe("Podešavanja mejlova");
    expect(uiSr.lead.page.status.expired.text).toContain("30 dana");
  });
});

describe("copy rules", () => {
  it("Latin script, no dashes as punctuation, none of the banned filler", () => {
    expect(srStrings.filter((s) => /\p{Script=Cyrillic}/u.test(s) && !s.includes("Македонски"))).toEqual([]);
    expect(srStrings.filter((s) => /[—–]|\s-\s/u.test(s))).toEqual([]);
    expect(srStrings.filter((s) => /putovanj\w* duše|otključ\w* (svoj|tvoj)\w* potencijal|kosmičk\w* energij/iu.test(s))).toEqual([]);
  });
  it("ekavian, Serbian words", () => {
    expect(srStrings.filter((s) => /\b(tjedan|tjedn\w*|vrijem\w*|mjesec\w*|mjest\w*|dijete|tisuć\w*|zrak\w*|kruh\w*|uvijek|gdje|prije|poslije|lijep\w*|rijeć\w*|obitelj\w*|tvrtk\w*)\b/iu.test(s))).toEqual([]);
  });
  it("uses test, never kviz, and never repeats the old 90 seconds", () => {
    expect(srStrings.filter((s) => /\bkviz/iu.test(s))).toEqual([]);
    expect(srStrings.filter((s) => /\b90\s*(sekund|-)/iu.test(s))).toEqual([]);
    expect(siteSr.common.start).toContain("30 sekundi");
  });
  it("fixed terms from the rest of the Serbian site", () => {
    expect(navSr.groups.bonds.items[2].title).toBe("Provera veze");
    expect(uiSr.bondCheck.title).toBe("Provera veze");
    expect(lensSr.bigfive.name).toBe("Velikih pet");
    expect(lensSr.rising.name.startsWith("Podznak")).toBe(true);
    expect(TESTS["big-five"].sr).toBe("Velikih pet");
  });
});

describe("search snippets fit", () => {
  const pairs = [
    ...Object.values(uiSr.pageMeta).filter((m): m is { title: string; description: string } => "description" in m),
    ...Object.values(uiSr.tests.meta), HOME_META.sr, pricingSr.meta,
    adaptiveSr.meta,
  ];
  it("titles at most 55 characters, descriptions 110 to 158, finished sentences, all different", () => {
    for (const p of pairs) {
      expect(p.title.length, p.title).toBeLessThanOrEqual(55);
      expect(p.description.length, p.description).toBeGreaterThanOrEqual(110);
      expect(p.description.length, p.description).toBeLessThanOrEqual(158);
      expect(p.description).toMatch(/[.!?]$/);
    }
    expect(new Set(pairs.map((p) => p.description)).size).toBe(pairs.length);
  });
  it("the open tools meet the tighter range of tests/test-seo.test.ts, which starts reading sr once it is wired", () => {
    const M = uiSr.pageMeta;
    for (const m of [M.start, M.match, M.bond, M.quizzes, adaptiveSr.meta, ...Object.values(uiSr.tests.meta)]) {
      expect(m.title.length, m.title).toBeLessThanOrEqual(55);
      expect(m.description!.length, m.description).toBeGreaterThanOrEqual(120);
      expect(m.description!.length, m.description).toBeLessThanOrEqual(155);
    }
  });
});

describe("Serbian grammar at the template seams", () => {
  const { profile, pair, today, chart, tests, bondCheck, ritual, quiz } = uiSr;
  it("signs take the case the preposition asks for", () => {
    expect(profile.sunIn("Ribe")).toBe("Sunce u Ribama");
    expect(profile.moonIn("Ovan ili Bik")).toBe("Mesec u Ovnu ili Biku");
    expect(profile.moonMaybe("Lav ili Devica")).toContain("u Lavu ili Devici.");
    expect(today.moonIn("pun Mesec", "Škorpija")).toBe("pun Mesec u Škorpiji");
    expect(ritual.signLine("Blizanci", "Vazduh")).toBe("Sunce u Blizancima · Vazduh");
    expect(chart.planetText("Venera", "ljubav", "Vaga", "ravnoteža", "šarm", "neodlučnost")).toContain("U Vagi (ravnoteža)");
  });
  it("free names and nouns stay in the nominative behind a label", () => {
    expect(chart.inSign("Merkur") + "Vodolija" + chart.houseN(3)).toBe("Merkur: Vodolija, kuća 3");
    expect(profile.placementTitle.Sun + " Ovan").toBe("Sunce: Ovan");
    expect(pair.careLine("Ana", "lepe reči", false, "Marko", "zajedničko vreme", "Prošetajte.")).toBe("Ana pruža: lepe reči. Marko najviše voli da dobije: zajedničko vreme. Probaj: Prošetajte.");
    expect(bondCheck.qReceive("Ana")).toBe("Čime ti Ana najbolje pokazuje pažnju?");
    expect(today.meets("razgovori i razmišljanje", "ljubav i vrednosti")).toBe("U susretu: razgovori i razmišljanje i ljubav i vrednosti.");
    expect(chart.houseLine(4, "dom, koreni i porodica")).toBe("Kuća 4 (dom, koreni i porodica): ovde se ova energija najviše vidi.");
  });
  it("sentences built from another string still read", () => {
    expect(today.cardToday("Nosiš hrabrost početnika.")).toBe("Danas nosiš hrabrost početnika.");
    expect(pair.tarotTogether("Nosiš hrabrost početnika.")).toBe("Svakom od vas karta kaže: nosiš hrabrost početnika.");
    expect(profile.unlocksText("Najbolje proveren test ličnosti", "Velikih pet")).toBe("Najbolje proveren test ličnosti. Otvara: Velikih pet.");
    expect(profile.unlocksText("28 brzih izbora.", "slova")).toBe("28 brzih izbora. Otvara: slova.");
    expect(profile.zodiacYear("5. februar 1995.")).toBe(" Tvoja zodijačka godina počela je 5. februara 1995. (kineska Nova godina).");
  });
  it("counts agree with the number", () => {
    expect(today.streak(1)).toContain("1 dan "); expect(today.streak(3)).toContain("3 dana "); expect(today.streak(21)).toContain("21 dan ");
    expect(quiz.qMin(1, 2)).toBe("1 pitanje · 2 min"); expect(quiz.qMin(20, 3)).toBe("20 pitanja · 3 min");
    expect(tests.status.answered(1)).toBe("1 odgovor"); expect(tests.status.answered(5)).toBe("5 odgovora");
    expect(tests.all.sub(9, 21).startsWith("9 testova")).toBe(true); expect(tests.all.sub(2, 4).startsWith("2 testa")).toBe(true);
    expect(tests.all.progress(3, 9)).toBe("Urađeno 3 od 9 testova");
    expect(uiSr.auth.pending(1)).toBe("1 izmena čeka sinhronizaciju"); expect(uiSr.auth.pending(2)).toBe("2 izmene čekaju sinhronizaciju");
  });
});

describe("legal pages in Serbian", () => {
  const privacy = legal("privacy");
  for (const page of ["privacy", "terms", "promise", "learn"]) it(`${page}: the block is there and renders for sr`, () => {
    expect(legal(page)).toContain('lang="sr"');
    expect(readFileSync(`src/app/[lang]/${page}/page.tsx`, "utf8")).toContain('lang === "sr" ? <PageSr />');
    expect(legal(page).match(/\p{Script=Cyrillic}/gu)).toBeNull();
    expect(legal(page)).not.toMatch(/quiz|kviz/i);
  });
  it("privacy: same structure and every processor and period as the English block", () => {
    const en = english("privacy");
    for (const tag of [/<h2>/g, /<li>/g, /<Mail \/>/g, /<b>/g]) expect(count(privacy, tag), String(tag)).toBe(count(en, tag));
    for (const p of ["Supabase", "Vercel", "Resend", "Cloudflare", "Open-Meteo", "PRIVACY_VERSION", "pravnik"]) expect(privacy).toContain(p);
    for (const s of ["24 meseca", "24 sata", "14 meseci", "30 dana"]) expect(privacy).toContain(s);
    expect(privacy).toContain("samo taj klik se računa kao saglasnost");
    for (const s of ["samo ako je provera protiv botova ispod prođena", "nikad na adresu koja se odjavila", "obično ne češće od jednom u 30 dana", "Kod IPv6 koristimo samo mrežni deo", "oko 24 sata", "čim počneš da ga popunjavaš"]) expect(privacy).toContain(s);
    expect(privacy).not.toMatch(/\b(d\.?o\.?o\.?|GmbH|Ltd|LLC)\b/);
  });
  it("privacy: every GDPR citation matches the English one, in order", () => {
    const cites = (s: string, rx: RegExp) => [...s.matchAll(rx)].map((m) => m[1]);
    expect(cites(privacy, /čl\. (\d\(\d\)\([a-f]\)) GDPR/g)).toEqual(cites(english("privacy"), /Art\. (\d\(\d\)\([a-f]\)) GDPR/g));
  });
  it("terms: same structure, says how the full result opens", () => {
    const sr = legal("terms"); const en = english("terms");
    for (const tag of [/<h2>/g, /<p>/g]) expect(count(sr, tag), String(tag)).toBe(count(en, tag));
    expect(sr).toContain("/sr/privacy/"); expect(sr).toContain("ime i mejl"); expect(sr).toContain("možemo da ti pošaljemo jedan mejl"); expect(sr).toContain("16 ili više godina"); expect(sr).toContain("v0.2");
  });
  it("promise: same promises", () => { expect(count(legal("promise"), /<li>/g)).toBe(count(english("promise"), /<li>/g)); expect(legal("promise")).not.toMatch(/samo u tvom pregledaču/); });
});

describe("shared files", () => {
  it("lead email goes out in Serbian with a Serbian test name", () => {
    const m = renderWelcome({ locale: "sr", firstName: "Ana", source: "care", unsubscribeToken: "u", confirmToken: "c" });
    expect(m.subject).toBe("Tvoj put nazad do sajta Horoscop");
    expect(m.text).toContain("Zdravo, Ana!"); expect(m.text).toContain("Hvala za test „Stilovi brige“ na sajtu Horoscop."); expect(m.text).toContain("/sr/quiz/care/");
    for (const id of Object.keys(TESTS)) expect(TESTS[id].sr, id).toBeTruthy();
  });
});
