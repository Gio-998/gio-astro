/** Rules for the 2027 yearly horoscope copy, shared by tests/yearly2027-overlap.test.ts. Every date and every house claim must trace to src/lib/sky2027.ts. */
import { SKY2027 } from "../src/lib/sky2027";
import { SIGNS, type Sign } from "../src/engine/zodiac";
import { houseFrom } from "../src/engine/skyday";
import type { YearlyPage, YearlyRole } from "../src/content/yearly2027/types";

export type Lang = "en" | "mk" | "de";
export const LANGS: Lang[] = ["en", "mk", "de"];
export const MIN_WORDS = 1500;
export const MAX_JACCARD = 0.08;
export const REQUIRED_ROLES: YearlyRole[] = ["year", "focus", "periods", "love", "work", "wellbeing", "windows", "practice"];

const MONTHS: Record<Lang, string[]> = {
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  de: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
  mk: ["јануари", "февруари", "март", "април", "мај", "јуни", "јули", "август", "септември", "октомври", "ноември", "декември"],
};
const alt = (l: Lang) => MONTHS[l].join("|");
const DATE_RX: Record<Lang, RegExp> = {
  en: new RegExp(`\\b(${alt("en")}) (\\d{1,2})(?!\\d)(?:,? (20\\d\\d))?`, "g"),
  de: new RegExp(`(?<![\\d.])(\\d{1,2})\\.\\s(${alt("de")})(?!\\p{L})(?:\\s(20\\d\\d))?`, "gu"),
  mk: new RegExp(`(?<![\\p{L}\\d])(\\d{1,2})\\s(${alt("mk")})(?!\\p{L})(?:\\s(20\\d\\d))?`, "gu"),
};
/** Date shapes the checker cannot trace, so the copy may not use them. */
const LOOSE_DATE_RX: Record<Lang, RegExp[]> = {
  en: [new RegExp(`\\b\\d{1,2}(st|nd|rd|th)?( of)? (${alt("en")})\\b`), new RegExp(`\\b(${alt("en")}) \\d{1,2}(st|nd|rd|th)\\b`), new RegExp(`\\b(${alt("en")}) \\d{1,2} ?(to|and|through|or|-) ?\\d{1,2}\\b(?! (${alt("en")}))`)],
  de: [/(?<![\d.])\d{1,2}\.\s(bis|und|oder)\s(zum\s)?\d{1,2}\./u, /\b\d{1,2}\.\d{1,2}\.(\d{2,4})?(?!\d)/],
  mk: [new RegExp(`(?<![\\p{L}\\d])\\d{1,2}\\s(до|и|или)\\s\\d{1,2}\\s(${alt("mk")})(?!\\p{L})`, "u"), new RegExp(`(?<![\\p{L}\\d])\\d{1,2}-(ти|ви|ри|ми)\\s(${alt("mk")})(?!\\p{L})`, "u")],
};
type BodyKey = "sun" | "mercury" | "venus" | "mars" | "jupiter" | "saturn" | "uranus" | "neptune" | "pluto" | "moon" | "eclipse";
const BODY_RX: Record<Lang, Record<BodyKey, RegExp>> = {
  en: { sun: /\bSun\b/, mercury: /\bMercury\b/, venus: /\bVenus\b/, mars: /\bMars\b/, jupiter: /\bJupiter\b/, saturn: /\bSaturn\b/, uranus: /\bUranus\b/, neptune: /\bNeptune\b/, pluto: /\bPluto\b/, moon: /\bmoons?\b/i, eclipse: /\beclipses?\b/i },
  de: { sun: /Sonne(?!n?finsternis)/, mercury: /Merkur/, venus: /Venus/, mars: /\bMars/, jupiter: /Jupiter/, saturn: /Saturn/, uranus: /Uranus/, neptune: /Neptun/, pluto: /Pluto/, moon: /Mond|Vollm|Neum/, eclipse: /[Ff]insternis/ },
  mk: { sun: /[Сс]онце/, mercury: /[Мм]еркур/, venus: /[Вв]енер/, mars: /Марс|марс(?!\p{L})/u, jupiter: /[Јј]упитер/, saturn: /[Сс]атурн/, uranus: /[Уу]ран/, neptune: /[Нн]ептун/, pluto: /[Пп]лутон/, moon: /[Мм]есечин/, eclipse: /затемнув/ },
};
const HOUSE_RX: Record<Lang, RegExp> = {
  en: /\b(\d{1,2})(?:st|nd|rd|th) house\b/gi,
  de: /(?<![\d.])(\d{1,2})\.\s(?:Haus|Hauses|Häuser)(?!\p{L})/gu,
  mk: /(?<![\p{L}\d])(\d{1,2})-(?:ви|ри|ти|ми)(?:от)?\s(?:дом|домот)(?!\p{L})/gu,
};
const SPELLED_HOUSE_RX: Record<Lang, RegExp> = {
  en: /\b(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|eleventh|twelfth) house\b/i,
  de: /\b(erst|zweit|dritt|viert|fünft|sechst|siebt|acht|neunt|zehnt|elft|zwölft)(e|en|es|er) Haus/i,
  mk: /(?<!\p{L})(прв|втор|трет|четврт|петт|шест|седм|осм|деветт|десетт|единаесетт|дванаесетт)\p{L}*\s(дом|домот)(?!\p{L})/iu,
};
/** Mirrors RULES in scripts/check-copy.mjs (that file cannot load under vitest), and also runs on Macedonian. */
const STYLE_RX: [RegExp, string][] = [
  [/[—–]/u, "em or en dash"], [/\s-\s/u, "spaced hyphen"], [/\bdelv(e|es|ed|ing)\b/i, "delve"], [/\btapestr(y|ies)\b/i, "tapestry"], [/\brealms?\b/i, "realm"], [/\bembark/i, "embark"], [/\bjourney/i, "journey"], [/\btestament\b/i, "testament"], [/\bnavigat(e|es|ed|ing)\b/i, "navigate"],
  [/\bunlock (your|their|our) (true |full )?potential\b/i, "unlock potential"], [/\bin a world where\b/i, "in a world where"], [/\bit'?s not just\b|\bit is not just\b/i, "not just"], [/\bwhether you'?re\b[^.]*\bor\b/i, "whether you're"], [/\btruly\b/i, "truly"], [/\bprofound(ly)?\b/i, "profound"], [/\bwov(en)\b|\bweav(e|es|ing)\b/i, "woven"], [/\btransformative\b/i, "transformative"], [/\bseamless(ly)?\b/i, "seamless"],
  [/\b(elevate|empower|unleash|harness)(s|ed|ing)?\b/i, "hype verb"], [/\bholistic\b|\bbeacon\b|\bgame[- ]changer\b|\btreasure trove\b|\bever-evolving\b|\bvibrant\b|\bintricate\b/i, "hype word"], [/\b(foster|resonat)(e|es|ed|ing)?\b/i, "foster/resonate"], [/\bembrac(e|es|ing)\b/i, "embrace"], [/\bcosmic journey|soul's journey|magic happens\b/i, "cliche"],
];
/** Reflective framing: no certainty, no fear, no promises about health or money. */
const FRAMING_RX: Record<Lang, [RegExp, string][]> = {
  en: [[/\byou will\b|\byou'll\b|\bwill bring\b|\bwill happen\b|\bwill find\b|\bwill meet\b/i, "states the future as fact"], [/\bguarantee|\bdestin(y|ed)\b|\bfated?\b|\bcertain to\b/i, "promise or fate"], [/\bdoom|\bcurse|\bdisaster|\bdanger|\bbeware\b|\bcatastroph|\bcrisis\b/i, "fear word"], [/\bwindfall\b|\bjackpot\b|\bget rich\b|\bpay rise\b.*\bwill\b/i, "money promise"], [/\bdiet\b|\bsupplement|\bcure[sd]?\b|\bheal(s|ing)?\b|\bdiagnos|\bmedication|\bdoctor\b/i, "health advice"]],
  de: [[/\bdu wirst\b|\bwirst du\b|\bwird dir\b|\bwerden dir\b|\bwird dich\b/i, "states the future as fact"], [/\bgarantiert\b|\bSchicksal|\bvorherbestimmt\b/i, "promise or fate"], [/\bGefahr|\bgefährlich|\bKatastroph|\bKrise\b|\bFluch\b|\bUnglück/i, "fear word"], [/\bGeldsegen\b|\bJackpot\b|\breich werden\b/i, "money promise"], [/\bDiät\b|\bNahrungsergänzung|\bHeilung\b|\bheilt\b|\bDiagnose|\bMedikament|\bArzt\b|\bÄrztin\b/i, "health advice"], [/[a-zäöüß,] (Sie|Ihnen|Ihre?[mnrs]?)\b/u, "formal address, use du"]],
  mk: [[/(?<!\p{L})ќе (добиеш|најдеш|сретнеш|заработиш|успееш|доживееш)(?!\p{L})/iu, "states the future as fact"], [/(?<!\p{L})(судбин|гарантир|предодредено)/iu, "promise or fate"], [/(?<!\p{L})(опасн|катастроф|проклет|несреќ|криза)/iu, "fear word"], [/(?<!\p{L})(лекар|лекување|лекува|дијета|додатоци во исхрана|дијагноз)/iu, "health advice"], [/[ћђ]/iu, "Serbian letter"], [/[a-zA-Z]{2,}/, "Latin text in Macedonian"], [/(?<!\p{L})(Вие|Вас|Ваш\p{L}*)(?!\p{L})/u, "formal address, use ti"]],
};

export const words = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(Boolean);
export const shingles = (w: string[], k = 5) => { const o = new Set<string>(); for (let i = 0; i + k <= w.length; i++) o.add(w.slice(i, i + k).join(" ")); return o; };
export const jaccard = (a: Set<string>, b: Set<string>) => { let n = 0; for (const x of a) if (b.has(x)) n++; return n / (a.size + b.size - n || 1); };
/** Keeps the period in German ordinals ("3. März", "10. Haus") from ending a sentence, then puts it back so the date and house rules still match. */
const ORDINAL = new RegExp(`(\\d)\\.(\\s)(?=(?:${alt("de")}|Haus|Hauses|Häuser)(?!\\p{L}))`, "gu");
export const splitSentences = (s: string) => s.replace(ORDINAL, "$1․$2").split(/(?<=[.!?])\s+/).map((x) => x.replace(/․/g, ".").trim()).filter(Boolean);
export const sentences = (s: string) => splitSentences(s).map((x) => x.toLowerCase()).filter((x) => x.split(" ").length >= 6);
export const pageText = (p: YearlyPage) => [p.h1, p.lead, ...p.sections.flatMap((s) => [s.title, ...s.paras, ...(s.list ?? [])]), ...p.faq.flat()].join(" ");
/** Every paragraph-sized unit of a page, including the metadata, so no field escapes the date and house checks. */
const chunks = (p: YearlyPage) => [p.metaTitle, p.h1, p.description, p.lead, p.hubLine, ...p.sections.flatMap((s) => [s.title, ...s.paras, ...(s.list ?? [])]), ...p.faq.flat()];

const pad = (n: number) => String(n).padStart(2, "0");
/** date (YYYY-MM-DD) to the bodies with an event that day. */
export function skyIndex() {
  const by = new Map<string, Set<BodyKey>>();
  const add = (d: string, b: BodyKey) => { if (!by.has(d)) by.set(d, new Set()); by.get(d)!.add(b); };
  for (const x of SKY2027.ingresses) add(x.date, x.body);
  for (const x of SKY2027.stations) add(x.date, x.body);
  for (const x of SKY2027.moons) add(x.date, "moon");
  for (const x of SKY2027.eclipses) { add(x.date, "eclipse"); add(x.date, "moon"); if (x.kind === "solar") add(x.date, "sun"); }
  for (const x of SKY2027.slowAspects) { add(x.date, x.a); add(x.date, x.b); }
  return by;
}
const visited = () => {
  const v = new Map<string, Set<Sign>>();
  for (const x of SKY2027.start) v.set(x.body, new Set([x.sign]));
  for (const x of SKY2027.ingresses) v.get(x.body)!.add(x.sign);
  v.set("moon", new Set(SIGNS)); v.set("eclipse", new Set(SKY2027.eclipses.map((e) => e.sign)));
  return v;
};
/** Dates as YYYY-MM-DD; a date without a year means 2027. */
export function datesIn(lang: Lang, s: string): string[] {
  return [...s.matchAll(DATE_RX[lang])].map((m) => { const [mon, day] = lang === "en" ? [m[1], m[2]] : [m[2], m[1]]; return `${m[3] ?? 2027}-${pad(MONTHS[lang].indexOf(mon) + 1)}-${pad(Number(day))}`; });
}
const bodiesIn = (lang: Lang, s: string) => (Object.keys(BODY_RX[lang]) as BodyKey[]).filter((b) => BODY_RX[lang][b].test(s));
const PERCENT_RX = /(?<![\d.,])(\d{1,3})\s?(?:%|percent\b|Prozent\b|процент)/gu;
const DEGREE_RX = /(?<![\d.,])(\d{1,2})\s?(?:°|degrees?\b|Grad\b|степен)/gu;
const skyDegrees = () => new Set([...SKY2027.stations, ...SKY2027.moons, ...SKY2027.eclipses, ...SKY2027.start, ...SKY2027.end].map((x) => x.deg).concat(SKY2027.slowAspects.flatMap((a) => [a.degA, a.degB])));

/** Facts in running text: every date is a real sky event with its planet named nearby, every percent an eclipse view, every degree a computed place. */
export function lintFacts(lang: Lang, chunk: string): string[] {
  const bad: string[] = []; const idx = skyIndex(); const sent = splitSentences(chunk);
  for (const rx of LOOSE_DATE_RX[lang]) { const m = chunk.match(rx); if (m) bad.push(`date shape cannot be checked, write full dates: "${m[0]}"`); }
  const covered = new Set(SKY2027.eclipseViews.map((v) => v.covered)); const degrees = skyDegrees();
  for (const m of chunk.matchAll(PERCENT_RX)) if (!covered.has(Number(m[1]))) bad.push(`percent not in sky2027 eclipse views: "${m[0]}" in "${chunk.slice(Math.max(0, m.index - 40), m.index + 30)}"`);
  for (const m of chunk.matchAll(DEGREE_RX)) if (!degrees.has(Number(m[1]))) bad.push(`degree not in sky2027: "${m[0]}" in "${chunk.slice(Math.max(0, m.index - 40), m.index + 30)}"`);
  sent.forEach((s, i) => {
    const scope = `${sent[i - 1] ?? ""} ${s}`;
    for (const d of datesIn(lang, s)) {
      const ev = idx.get(d);
      if (!ev) bad.push(`date not in sky2027: ${d} in "${s.slice(0, 80)}"`);
      else if (![...ev].some((b) => BODY_RX[lang][b].test(scope))) bad.push(`date ${d} belongs to ${[...ev].join("/")}, not named near: "${s.slice(0, 80)}"`);
    }
  });
  return bad;
}

/** All problems on one page. An empty list means the page is safe to publish. */
export function lintPage(lang: Lang, sign: Sign, p: YearlyPage, signName: string): string[] {
  const bad: string[] = []; const seen = visited();
  const houseSign = (n: number) => SIGNS.find((s) => houseFrom(sign, s) === n);
  if (p.metaTitle.length > 55) bad.push(`metaTitle is ${p.metaTitle.length} chars, max 55`);
  if (!p.metaTitle.includes("2027") || !p.metaTitle.includes(signName)) bad.push("metaTitle needs 2027 and the sign name");
  if (p.description.length < 120 || p.description.length > 155) bad.push(`description is ${p.description.length} chars, want 120 to 155`);
  if (p.hubLine.length > 110) bad.push(`hubLine is ${p.hubLine.length} chars, max 110`);
  const n = words(pageText(p)).length; if (n < MIN_WORDS) bad.push(`only ${n} words, need ${MIN_WORDS}`);
  for (const r of REQUIRED_ROLES) if (!p.sections.some((s) => s.role === r)) bad.push(`missing section role ${r}`);
  if (p.sections[0]?.role !== "year") bad.push("first section must be role year");
  if (p.sections[0]?.paras.length !== 1) bad.push("the year section is one paragraph");
  if (p.sections[p.sections.length - 1]?.role !== "practice") bad.push("last section must be role practice");
  if (p.faq.length < 3) bad.push("needs at least 3 FAQ entries");
  for (const c of chunks(p)) {
    for (const [rx, msg] of STYLE_RX) if (rx.test(c)) bad.push(`style (${msg}): ${c.slice(0, 70)}`);
    for (const [rx, msg] of FRAMING_RX[lang]) { const m = c.match(rx); if (m) bad.push(`framing (${msg}, "${m[0]}"): ${c.slice(Math.max(0, (m.index ?? 0) - 30), (m.index ?? 0) + 40)}`); }
    bad.push(...lintFacts(lang, c));
    if (SPELLED_HOUSE_RX[lang].test(c)) bad.push(`write the house as a digit: ${c.match(SPELLED_HOUSE_RX[lang])![0]}`);
    const sent = splitSentences(c);
    sent.forEach((s, i) => {
      for (const m of s.matchAll(HOUSE_RX[lang])) {
        const h = Number(m[1]); const t = houseSign(h);
        if (!t) { bad.push(`no house ${h}`); continue; }
        const own = bodiesIn(lang, s); const named = own.length ? own : bodiesIn(lang, sent[i - 1] ?? "");
        if (named.length && !named.some((b) => seen.get(b)?.has(t))) bad.push(`house ${h} of ${sign} is ${t}, but ${named.join("/")} is not there in 2027: "${s.slice(0, 90)}"`);
      }
    });
  }
  return [...new Set(bad)];
}
