import { describe, it, expect } from "vitest";
import { DateTime } from "luxon";
import { computeChart } from "../src/engine/astro";
import { dayChange, risingOfBirth } from "../src/engine/calculators";
import { resolveBirthTime } from "../src/engine/time";
import { formatDegree } from "../src/engine/zodiac";
import { contents } from "../src/content";
import { posts as blogEn } from "../src/content/blog/en";
import { posts as blogSr } from "../src/content/blog/sr";
import { calcEn } from "../src/content/calculators/en";
import { calcSr } from "../src/content/calculators/sr";
import { CALC_UI } from "../src/content/calculators/ui";
import { calcUiSr } from "../src/content/calculators/ui-sr";
import { en as calEn } from "../src/content/calendars/en";
import { sr as calSr } from "../src/content/calendars/sr";
import { en as dayEn } from "../src/content/horoscope/en";
import { enVariety } from "../src/content/horoscope/en-variety";
import { sr as daySr } from "../src/content/horoscope/sr";
import { srVariety } from "../src/content/horoscope/sr-variety";
import { bAcc, dGen, dGenMid, dNom, houseAcc, mLoc, ordAcc, ordLoc, plural, sAcc, sGen, sLoc, tc } from "../src/content/horoscope/sr-cases";
import { book as srBook } from "../src/content/sr/book";
import * as srDaily from "../src/content/sr/daily";
import { en as periodEn } from "../src/content/horoscope-period/en";
import { sr as periodSr } from "../src/content/horoscope-period/sr";

/** Reads the Serbian files directly. The family tests cover their shape through the locale lists; this file covers what only Serbian has, such as case forms. */
const uiLines = { aspectLine: contents.sr.ui.pair.aspectLine, transit: contents.sr.ui.today.transit };
const SIGN_NAMES = ["Ovan", "Bik", "Blizanci", "Rak", "Lav", "Devica", "Vaga", "Škorpija", "Strelac", "Jarac", "Vodolija", "Ribe"];

function sameShape(a: unknown, b: unknown, path: string, out: string[]) {
  if (typeof a === "string") { if (typeof b !== "string" || !b.trim()) out.push(path); return; }
  if (typeof a === "function") { if (typeof b !== "function") out.push(path); return; }
  if (Array.isArray(a)) { if (!Array.isArray(b) || b.length < a.length) out.push(`${path}[${Array.isArray(b) ? b.length : "?"}]`); else a.forEach((x, i) => sameShape(x, b[i], `${path}.${i}`, out)); return; }
  if (a && typeof a === "object") for (const k of Object.keys(a)) sameShape((a as Record<string, unknown>)[k], (b as Record<string, unknown> | undefined)?.[k], `${path}.${k}`, out);
}
function strings(v: unknown, out: string[] = []): string[] {
  if (typeof v === "string") out.push(v);
  else if (Array.isArray(v)) v.forEach((x) => strings(x, out));
  else if (v && typeof v === "object") Object.values(v).forEach((x) => strings(x, out));
  return out;
}
const sentences = (s: string) => s.split(/(?<=[.!?])\s+/).map((x) => x.trim().toLowerCase()).filter((x) => x.split(/\s+/).length >= 6);
/** Sentences of six or more words that appear in more than one text. */
function repeats(texts: string[]) {
  const seen = new Map<string, number>();
  for (const t of texts) for (const s of new Set(sentences(t))) seen.set(s, (seen.get(s) ?? 0) + 1);
  return [...seen.entries()].filter(([, n]) => n > 1).map(([s]) => s);
}

describe("Serbian files mirror the English ones", () => {
  for (const [name, a, b] of [["daily bank", dayEn, daySr], ["daily variety", enVariety, srVariety], ["period bank", periodEn, periodSr], ["calendars", calEn, calSr], ["calculators", calcEn, calcSr], ["calculator labels", CALC_UI.en, calcUiSr]] as const) {
    it(`${name}: every key and pool of the English file exists`, () => { const out: string[] = []; sameShape(a, b, name, out); expect(out).toEqual([]); });
  }
  it("blog: same posts, same slugs, same block shapes", () => {
    expect(blogSr.map((p) => p.slug)).toEqual(blogEn.map((p) => p.slug));
    blogEn.forEach((p, i) => { expect(blogSr[i].blocks.map((b) => b.t)).toEqual(p.blocks.map((b) => b.t)); expect(blogSr[i].date).toBe(p.date); });
    blogEn.forEach((p, i) => p.blocks.forEach((b, k) => { const o = blogSr[i].blocks[k]; if (b.t === "cta" && o.t === "cta") expect(o.href).toBe(b.href); if (b.t === "ul" && o.t === "ul") expect(o.items.length).toBe(b.items.length); }));
  });
  it("slugs are the Serbian ones", () => {
    expect(daySr.slug).toBe("dnevni-horoskop");
    expect(Object.values(daySr.signSlug)).toEqual(["ovan", "bik", "blizanci", "rak", "lav", "devica", "vaga", "skorpija", "strelac", "jarac", "vodolija", "ribe"]);
  });
});

describe("copy rules", () => {
  const all = [daySr, srVariety, periodSr, calSr, calcSr, calcUiSr, blogSr].flatMap((x) => strings(x));
  it("Latin script, no dashes as punctuation, none of the filler the brief bans", () => {
    expect(all.filter((s) => /\p{Script=Cyrillic}/u.test(s))).toEqual([]);
    expect(all.filter((s) => /[—–]|\s-\s/u.test(s))).toEqual([]);
    expect(all.filter((s) => /putovanj\w* duše|otključ\w* (svoj|tvoj)\w* potencijal|kosmičk\w* energij/iu.test(s))).toEqual([]);
  });
  it("ekavian, Serbian words: no Croatian or ijekavian giveaways", () => {
    expect(all.filter((s) => /\b(tjedan|tjedn\w*|vrijem\w*|mjesec\w*|mjest\w*|dijete|tisuć\w*|zrak\w*|kava\b|kruh\w*|uvijek|gdje|prije|poslije|lijep\w*|rijeć\w*|obitelj\w*|tvrtk\w*)\b/iu.test(s))).toEqual([]);
  });
  it("search snippets fit", () => {
    const pages = Object.values(calcSr.pages); for (const p of pages) { expect(p.title.length).toBeLessThanOrEqual(55); expect(p.description.length).toBeGreaterThanOrEqual(120); expect(p.description.length).toBeLessThanOrEqual(155); }
    for (const p of blogSr) { expect(p.description.length).toBeGreaterThanOrEqual(110); expect(p.description.length).toBeLessThanOrEqual(158); }
    for (const s of SIGN_NAMES) { const d = daySr.ui.signHubMeta(s); expect(d.length, d).toBeGreaterThanOrEqual(110); expect(d.length, d).toBeLessThanOrEqual(158); }
    for (const H of [periodSr.hub.week, periodSr.hub.month]) { expect(H.title.length).toBeLessThanOrEqual(55); expect(H.description.length).toBeLessThanOrEqual(155); expect(H.description.length).toBeGreaterThanOrEqual(120); }
  });
  it("no sentence of six or more words repeats across pages", () => {
    expect(repeats(Object.values(calcSr.pages).map((p) => strings(p).join(" ")))).toEqual([]);
    expect(repeats(blogSr.map((p) => strings(p).join(" ")))).toEqual([]);
    expect(repeats(strings(calSr.moon.reflect))).toEqual([]);
    expect(repeats(Object.values(calSr.mercury.periods).map((p) => strings(p).join(" ")))).toEqual([]);
    expect(repeats([strings(calSr.moon.hub).join(" "), strings(calSr.mercury.hub).join(" ")])).toEqual([]);
    expect(repeats([strings(periodSr.hub.week).join(" "), strings(periodSr.hub.month).join(" ")])).toEqual([]);
  });
  it("no sentence is used twice inside the rotating banks", () => {
    const lines = (o: unknown) => strings(o);
    expect(repeats(lines({ a: periodSr.sun, b: periodSr.lunations, c: periodSr.mercury, d: periodSr.venus, e: periodSr.mars, f: periodSr.jupiter, g: periodSr.saturn, h: periodSr.retroNote, i: periodSr.love, j: periodSr.single, k: periodSr.couple, l: periodSr.moonFallback, m: periodSr.phaseWell, n: periodSr.well, o: periodSr.voice, p: periodSr.best, q: periodSr.prompts }))).toEqual([]);
  });
});

describe("Serbian grammar at the template seams", () => {
  const { aspectLine, transit } = uiLines;
  it("planets and aspects take the accusative", () => {
    expect(bAcc("Venera")).toBe("Veneru"); expect(bAcc("Sredina neba")).toBe("Sredinu neba"); expect(bAcc("Mars")).toBe("Mars");
    expect(aspectLine("Ana", "Mars", "podržava", "Marko", "Venera", "⚹", "2.1")).toBe("Mars osobe Ana podržava Veneru osobe Marko (⚹ 2.1°)");
    expect(transit("Saturn", srDaily.transitTone.square, "Venera")).toBe("Saturn izaziva Veneru u tvojoj karti");
    expect(srBook.transitPair("Mars", srDaily.transitTone.opposition, "Venera")).toBe("Mars gleda pravo u Veneru");
    expect(srBook.aspectPair("Ana", "Sunce", "prati", "Marko", "Mesec")).toBe("Sunce osobe Ana prati Mesec osobe Marko");
    expect(srBook.meaning).toBe("odnosno");
  });
  it("nine motivations read as clauses, and the wing is spelled out", () => {
    for (const n of Object.values(contents.sr.deep.nineDeep)) { expect(n.desire, n.title).toMatch(/^da /); expect(n.fear, n.title).toMatch(/^da /); }
    expect(srBook.nineCode(4, 5)).toBe("4 sa krilom 5"); expect(srBook.and).toBe(" i ");
  });
  it("sign names take the case the preposition asks for", () => {
    expect(SIGN_NAMES.map((s) => `za ${sAcc(s)}`)).toEqual(["za Ovna", "za Bika", "za Blizance", "za Raka", "za Lava", "za Devicu", "za Vagu", "za Škorpiju", "za Strelca", "za Jarca", "za Vodoliju", "za Ribe"]);
    expect(SIGN_NAMES.map((s) => `u ${sLoc(s)}`)).toEqual(["u Ovnu", "u Biku", "u Blizancima", "u Raku", "u Lavu", "u Devici", "u Vagi", "u Škorpiji", "u Strelcu", "u Jarcu", "u Vodoliji", "u Ribama"]);
    expect(SIGN_NAMES.map((s) => sGen(s))).toEqual(["Ovna", "Bika", "Blizanaca", "Raka", "Lava", "Device", "Vage", "Škorpije", "Strelca", "Jarca", "Vodolije", "Riba"]);
    expect(SIGN_NAMES.map((s) => calSr.signIn[({ Ovan: "aries", Bik: "taurus", Blizanci: "gemini", Rak: "cancer", Lav: "leo", Devica: "virgo", Vaga: "libra", "Škorpija": "scorpio", Strelac: "sagittarius", Jarac: "capricorn", Vodolija: "aquarius", Ribe: "pisces" } as const)[s as "Ovan"]])).toEqual(SIGN_NAMES.map((s) => `u ${sLoc(s)}`));
  });
  it("dates read the same whichever shape formatDate gives them", () => {
    for (const d of ["31 oktobar 2026", "31. oktobar 2026", "31. oktobar 2026."]) { expect(dNom(d)).toBe("31. oktobar 2026"); expect(dGen(d)).toBe("31. oktobra 2026"); expect(dGenMid(d)).toBe("31. oktobra 2026."); }
    expect(dGen("subota, 12. novembar")).toBe("subota, 12. novembra"); expect(dGenMid("12. novembar")).toBe("12. novembra");
    expect(mLoc("avgust")).toBe("avgustu"); expect(mLoc("septembar")).toBe("septembru");
  });
  it("daily titles match what people type", () => {
    expect(daySr.ui.title("Ovan", "31. oktobar 2026.")).toBe("Dnevni horoskop Ovan 31. oktobar 2026");
    expect(daySr.ui.title("Škorpija", "30. septembar 2026.").length).toBeLessThanOrEqual(55);
    expect(daySr.ui.description("Bik", "1. maj 2027.", "Dan traži malo radosti.")).toContain("za Bika, 1. maj 2027. Dan");
    expect(daySr.sky.moonMoves("Bik", "10:20")).toBe("U 10:20 prelazi u Bika.");
    expect(daySr.sky.inSign("Merkur", false, "Ribe")).toBe("Merkur je u Ribama, tvom znaku. Dodatno punjenje za tebe.");
    expect(daySr.more.why.ingress("Sunce", "energiju i smisao", "Vodolija", "deveta")).toBe("Sunce ulazi u Vodoliju, tvoju devetu kuću. Sunce predstavlja energiju i smisao, a to se sada odvija u novom polju tvog života.");
  });
  it("daily pools follow the weekday and the Moon's sign", () => {
    const c = { day: "subota", moon: "Blizanci", phase: "pun Mesec", topic: daySr.topics[3] };
    expect(srVariety.lead.overview[0](c)).toBe("U subotu Mesec prolazi kroz Blizance i osvetljava dom i porodicu.");
    expect(srVariety.moonAspect.conjunction[0]("Venera", "14:20")).toBe("Oko 14:20 Mesec se susreće sa Venerom, pa se osećanja i fokus usklađuju.");
    expect(srVariety.moonAspect.opposition[0]("Jupiter", "14:20")).toBe("U 14:20 Mesec stoji naspram Jupitera, pa uravnoteži svoje i tuđe potrebe.");
    expect(srVariety.whyMoon[3](daySr.more.ordinal[2], "Rak")).toBe("Mesec putuje kroz Raka, treću kuću računato od tvog znaka.");
  });
  it("period dates, houses and moves", () => {
    const D = periodSr.dates;
    expect(D.on("5. novembar")).toBe("5. novembra"); expect(D.range(2, "novembar", 8, "novembar")).toBe("2. do 8. novembra"); expect(D.span(30, "novembar", 2, "decembar")).toBe("od 30. novembra do 2. decembra");
    expect(periodSr.sky.retro.venus("Vaga", "14. novembar")).toBe("Venera je retrogradna u Vagi do 14. novembra.");
    expect(periodSr.sky.leadRetro("Merkur", periodSr.houses[6], "13. novembar")).toBe("Merkur se i dalje kreće retrogradno u tvojoj sedmoj kući, do 13. novembra.");
    expect(periodSr.move("Mars", "Lav", periodSr.houses[7], "Devica", periodSr.houses[8], "26. novembra")).toBe("Mars počinje u Lavu, u tvojoj osmoj kući, a 26. novembra prelazi u Devicu, u tvoju devetu kuću.");
    expect(periodSr.sky.lunation("pun Mesec", "Bik")).toBe("pun Mesec u Biku"); expect(periodSr.sky.aspect.trine("Merkur", "Venera")).toBe("Merkur u trigonu sa Venerom");
    expect(houseAcc("tvojoj trećoj kući")).toBe("tvoju treću kuću"); expect(ordLoc("treća")).toBe("trećoj"); expect(ordAcc("deveta")).toBe("devetu");
    expect(periodSr.ui.titleDated("Jarac", "novembar 2026")).toBe("Mesečni horoskop Jarac novembar 2026");
  });
  it("every house topic has all its cases and takes a plural verb", () => {
    for (const t of daySr.topics) { for (const f of ["gen", "dat", "acc", "ins", "loc"] as const) expect(tc(t, f).length).toBeGreaterThan(5); expect(t).toMatch(/,| i /); }
    expect(tc(daySr.topics[3], "gen")).toBe("doma i porodice"); expect(tc(daySr.topics[9], "ins")).toBe("karijerom i ugledom");
  });
  it("counts agree with the number", () => {
    expect(calSr.span(29, 12)).toBe("29 dana i 12 sati"); expect(calSr.span(29, 1)).toBe("29 dana i 1 sat"); expect(calSr.span(29, 3)).toBe("29 dana i 3 sata"); expect(calSr.span(29, 21)).toBe("29 dana i 21 sat"); expect(calSr.span(29, 11)).toBe("29 dana i 11 sati");
    expect(plural(22, "sat", "sata", "sati")).toBe("sata"); expect(calSr.times(3)).toBe("tri puta");
  });
  it("calendar lines", () => {
    const M = calSr.moon.month;
    expect(M.cycle("9. novembar 2026.", "29 dana i 18 sati", "9. decembar 2026.")).toBe("Mesečev ciklus koji počinje 9. novembra 2026. traje 29 dana i 18 sati, do sledećeg mladog Meseca 9. decembra 2026.");
    expect(M.sun("22. novembar 2026.", "u Strelca")).toBe("Sunce ulazi u Strelca 22. novembra 2026.");
    expect(M.title("septembar", 2027).length).toBeLessThanOrEqual(55);
    expect(calSr.mercury.answer.retrograde({ since: "24. oktobar 2026.", retro: "", direct: "13. novembar 2026.", shadowStart: "", shadowEnd: "30. novembar 2026.", signIn: "u Škorpiji" })).toBe("Da. Merkur je retrogradan od 24. oktobra 2026, u Škorpiji. Ponovo kreće napred 13. novembra 2026, a senka se završava 30. novembra 2026.");
    expect(calSr.mercury.answer["post-shadow"]({ since: "13. novembar 2026.", retro: "", direct: "", shadowStart: "", shadowEnd: "30. novembar 2026.", signIn: "" })).toBe("Ne. Merkur je krenuo napred 13. novembra 2026. U senci posle retrogradnosti ostaje do 30. novembra 2026.");
  });
  it("calculator labels", () => {
    expect(calcUiSr.moonChanged("Vodolija", "Ribe", "02:20")).toBe("Mesec je ovog dana promenio znak: do 02:20 bio je u Vodoliji, a zatim je prešao u Ribe. Bez vremena rođenja može da bude bilo koji od ta dva.");
    expect(calcUiSr.sunChanged("Škorpija", "Strelac", "13:48")).toContain("iz Škorpije u Strelca u 13:48");
  });
  it("the page uses podznak, with ascendent only where it explains the word", () => {
    const text = strings(calcSr.pages["rising-sign"]).join(" ");
    expect(calcSr.pages["rising-sign"].title.startsWith("Podznak")).toBe(true);
    expect((text.match(/podznak/gi) ?? []).length).toBeGreaterThan(30); expect((text.match(/ascendent/gi) ?? []).length).toBeLessThanOrEqual(5);
    expect(strings(calcUiSr).filter((s) => /ascendent/i.test(s))).toEqual([]);
  });
});

/** The numbers printed in the page copy, recomputed, so the copy can never drift from the engine. */
describe("worked examples in the Serbian copy", () => {
  const place = (name: string, lat: number, lon: number, tz: string) => ({ name, lat, lon, tz });
  const BELGRADE = place("Beograd", 44.8176, 20.4633, "Europe/Belgrade"); const NIS = place("Nis", 43.3209, 21.8958, "Europe/Belgrade");
  const CHICAGO = place("Chicago", 41.8781, -87.6298, "America/Chicago"); const LONDON = place("London", 51.5074, -0.1278, "Europe/London");
  const has = (k: "rising-sign" | "moon-sign" | "birth-chart", s: string) => expect(JSON.stringify(calcSr.pages[k])).toContain(s);
  const deg = formatDegree;
  it("rising: Belgrade, half an hour apart", () => {
    const at = (time: string) => risingOfBirth({ date: "1991-04-14", time, place: BELGRADE });
    expect(resolveBirthTime({ date: "1991-04-14", time: "06:10", place: BELGRADE }).utc.toISOString()).toBe("1991-04-14T04:10:00.000Z");
    const r = at("06:10"); expect(r.sign).toBe("aries"); has("rising-sign", `${deg(r.lon)} Ovna`); has("rising-sign", `od ${r.from} do ${r.to} tog jutra`);
    expect(at("06:15").sign).toBe("aries"); has("rising-sign", `${deg(at("06:15").lon)} Ovna`); expect(at("06:30").sign).toBe("taurus"); has("rising-sign", `${deg(at("06:30").lon)} Bika`);
  });
  it("rising: how long a sign takes at the latitude of Belgrade", () => {
    const span = (t: string) => { const r = risingOfBirth({ date: "1991-04-14", time: t, place: BELGRADE }); const min = (x: string) => Number(x.slice(0, 2)) * 60 + Number(x.slice(3)); return min(r.to!) - min(r.from!); };
    expect(span("06:00")).toBe(65); expect(span("15:00")).toBe(157);
    has("rising-sign", "Ovnu treba oko 1 sat i 5 minuta"); has("rising-sign", "Devici oko 2 sata i 37 minuta");
  });
  it("rising: same instant, different sign, and no summer time in Belgrade before 1983", () => {
    const at = (p: typeof LONDON) => { const r = risingOfBirth({ date: "1990-01-15", time: "12:00", place: p, utcOffsetOverride: 0 }); return `${deg(r.lon)} ${r.sign}`; };
    expect(at(LONDON)).toBe("21°11′ taurus"); expect(at(BELGRADE)).toBe("10°27′ gemini"); has("rising-sign", "21°11′ Bika"); has("rising-sign", "10°27′ Blizanaca");
    const offset = (iso: string) => DateTime.fromISO(`${iso}T12:00`, { zone: "Europe/Belgrade" }).offset / 60;
    expect([offset("1946-07-01"), offset("1960-07-01"), offset("1982-07-01"), offset("1983-07-01")]).toEqual([1, 1, 1, 2]); has("rising-sign", "od 1946. do 1982");
  });
  it("moon: Belgrade and Chicago", () => {
    expect(dayChange("moon", { date: "1984-10-06", time: null, place: BELGRADE })).toEqual({ from: "aquarius", to: "pisces", at: "02:20" }); has("moon-sign", "iz Vodolije u Ribe u 02:20");
    expect(dayChange("moon", { date: "1984-10-05", time: null, place: CHICAGO })).toEqual({ from: "aquarius", to: "pisces", at: "20:20" }); has("moon-sign", "5. oktobra, u 20:20");
  });
  it("chart: Nis", () => {
    const input = { date: "1986-05-06", time: "22:15", place: NIS }; const P = computeChart(input).placements;
    for (const [p, s] of [[P.sun, "Bika"], [P.moon, "Ovna"], [P.asc, "Strelca"], [P.saturn, "Strelca"], [P.uranus, "Strelca"], [P.mc, "Vage"]] as const) has("birth-chart", `${deg(p!.lon)} ${s}`);
    expect([P.sun!.sign, P.moon!.sign, P.asc!.sign, P.saturn!.sign, P.uranus!.sign, P.mc!.sign]).toEqual(["taurus", "aries", "sagittarius", "sagittarius", "sagittarius", "libra"]);
    expect([P.sun!.house, P.moon!.house, P.saturn!.house, P.uranus!.house, P.mc!.house]).toEqual([6, 5, 1, 1, 11]); expect([P.saturn!.retrograde, P.uranus!.retrograde]).toEqual([true, true]);
    const r = risingOfBirth(input); expect([r.from, r.to]).toEqual(["20:48", "23:12"]); has("birth-chart", "od 20:48 do 23:12");
    expect(risingOfBirth({ ...input, time: "21:15" }).sign).toBe("sagittarius"); expect(risingOfBirth({ ...input, time: "23:15" }).sign).toBe("capricorn");
  });
});
