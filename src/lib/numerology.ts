/** Public numerology section: which pages exist, and the page model each one renders. Server only (pulls long copy). */
import { numContent } from "@/content/numerology";
import { getContent } from "@/content";
import { localizedPath } from "./i18n-routes";
import { bankFor } from "./horoscope";
import { angelLong, pageLong } from "@/content/numerology/long";
import { reduce, rootOf } from "@/engine/numerology";
import { BIRTHDAYS } from "@/content/numerology/birthdays";
import { PAIRS, PAIR_HUB } from "@/content/numerology/pairs";

export const ANGEL = ["111", "222", "333", "444", "555", "666", "777", "888", "999", "000", "1111", "2222", "3333", "4444", "5555", "0000", "1010", "1212", "1221", "1234", "1313", "1414", "1001", "123", "911", "2020", "2121", "1122", "1144", "717"] as const;
export const LIFE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33] as const;
export const YEARS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
export const KARMIC = [13, 14, 16, 19] as const;
export const CALCS = ["life-path", "name", "personal-year", "compatibility"] as const;
export const CORE = ["expression-number", "soul-urge-number", "personality-number", "birthday-number", "maturity-number"] as const;
/** Birthday day pages that exist in every language (gated by tests/numerology-birthday-overlap.test.ts). */
export const BDAY_DAYS: number[] = Object.keys(BIRTHDAYS.en).map(Number).filter((d) => BIRTHDAYS.mk[d] && BIRTHDAYS.de[d]).sort((a, b) => a - b);
/** Every unordered life path pair (78), keyed "a-and-b" in LIFE order. */
export const ALL_PAIRS: string[] = LIFE.flatMap((a, i) => LIFE.slice(i).map((b) => `${a}-and-${b}`));
/** Compatibility pair pages that exist in every language (gated by tests/numerology-pair-overlap.test.ts). */
export const PAIR_KEYS: string[] = ALL_PAIRS.filter((k) => PAIRS.en[k] && PAIRS.mk[k] && PAIRS.de[k]);
export type CalcMode = (typeof CALCS)[number];

const N = "/numerology/";
/** Every public numerology route (internal paths). */
export function numPaths(): string[] {
  return [N, `${N}angel-numbers/`, ...ANGEL.map((a) => `${N}angel-numbers/${a}/`), `${N}calculator/`, ...CALCS.map((c) => `${N}calculator/${c}/`),
    `${N}life-path/`, ...LIFE.map((n) => `${N}life-path/${n}/`), `${N}master-numbers/`, `${N}personal-year/`, ...YEARS.map((n) => `${N}personal-year/${n}/`),
    ...CORE.map((c) => `${N}${c}/`), ...BDAY_DAYS.map((d) => `${N}birthday-number/${d}/`), `${N}karmic-debt/`, ...KARMIC.map((n) => `${N}karmic-debt/${n}/`), `${N}personal-day/`,
    ...(PAIR_KEYS.length ? [`${N}compatibility/`, ...PAIR_KEYS.map((k) => `${N}compatibility/${k}/`)] : [])];
}
/** Pages that may be listed in the sitemap (generated families join only after their overlap test passes). */
export const numIndexable = (p: string) => numPaths().includes(p);

export type Block = { id: string; title: string; paras?: string[]; list?: string[]; quote?: string };
export type LinkItem = { href: string; label: string; sub?: string; big?: string };
export interface NumModel {
  path: string; kind: "article" | "hub" | "calc";
  eyebrow: string; h1: string; title: string; description: string; lead: string; big?: string;
  blocks: Block[]; faq: [string, string][]; crumbs: [string, string][];
  items?: LinkItem[]; related?: LinkItem[]; prev?: LinkItem; next?: LinkItem; calc?: CalcMode;
}

const digitSum = (s: string) => s.split("").map(Number);
const lp = (lang: string, p: string) => localizedPath(lang, p);

/** Page model with any long guide sections for that page placed after its first block. */
export function numModel(lang: string, path: string): NumModel | null {
  const m = numModelBase(lang, path); if (!m) return m;
  const key = path.split("/").filter(Boolean).slice(1).join("/") || "hub";
  const extra = pageLong(lang, key).map((x, k) => ({ id: `guide-${k}`, title: x.title, paras: x.paras }));
  if (extra.length) m.blocks = [m.blocks[0], ...extra, ...m.blocks.slice(1)];
  return m;
}
function numModelBase(lang: string, path: string): NumModel | null {
  const C = numContent(lang); const U = C.ui; const brand = getContent(lang).site.brand;
  const home: [string, string] = [brand, `/${lang}/`]; const hub: [string, string] = [U.section, lp(lang, N)];
  const parts = path.split("/").filter(Boolean).slice(1); // after "numerology"
  const angelItems = (): LinkItem[] => ANGEL.map((a) => ({ href: lp(lang, `${N}angel-numbers/${a}/`), label: a, sub: C.angel[a].tag, big: a }));
  const calcItems = (): LinkItem[] => CALCS.map((c) => ({ href: lp(lang, `${N}calculator/${c}/`), label: C.explain[`calc-${c}`].title, sub: C.explain[`calc-${c}`].sub }));

  if (!parts.length) {
    const E = C.explain.hub;
    return { path, kind: "hub", eyebrow: U.section, h1: E.title, title: E.title, description: E.sub, lead: E.sub, crumbs: [home, hub], faq: E.faq,
      blocks: [{ id: "intro", title: U.section, paras: E.intro }, { id: "how", title: U.sec.explore, paras: [...E.how, U.method] }],
      items: [{ href: lp(lang, `${N}angel-numbers/`), label: U.angelHub, sub: C.explain.angel.sub }, { href: lp(lang, `${N}life-path/`), label: U.lifePathHub, sub: C.explain["life-path"].sub }, { href: lp(lang, `${N}personal-year/`), label: U.yearHub, sub: C.explain["personal-year"].sub }, { href: lp(lang, `${N}master-numbers/`), label: U.masterHub, sub: C.explain["master-numbers"].sub }, ...CORE.map((c) => ({ href: lp(lang, `${N}${c}/`), label: C.explain[c].title.split(":")[0], sub: C.explain[c].sub })), { href: lp(lang, `${N}karmic-debt/`), label: U.karmicHub, sub: C.explain["karmic-debt"].sub }, ...calcItems()],
      related: angelItems().slice(0, 12) };
  }
  const [sec, item] = parts;
  if (sec === "angel-numbers" && !item) {
    const E = C.explain.angel;
    return { path, kind: "hub", eyebrow: U.section, h1: E.title, title: E.title, description: E.sub, lead: E.sub, crumbs: [home, hub, [U.angelHub, lp(lang, path)]], faq: E.faq,
      blocks: [{ id: "intro", title: U.angelHub, paras: E.intro }, { id: "how", title: U.sec.meaning, paras: E.how }], items: angelItems() };
  }
  if (sec === "angel-numbers" && item && (ANGEL as readonly string[]).includes(item)) {
    const a = C.angel[item]; const ds = digitSum(item); const tot = ds.reduce((x, y) => x + y, 0); const root = reduce(tot, true);
    const uniq = [...new Set(ds)];
    const i = ANGEL.indexOf(item as (typeof ANGEL)[number]);
    const at = (k: number) => ANGEL[(k + ANGEL.length) % ANGEL.length];
    const digitParas = [U.digitsSum(`${ds.join(" + ")} = ${tot}`, root), ...uniq.map((d) => `${d}, ${C.chars[d].name}: ${C.chars[d].essence}.`)];
    const rootChar = C.chars[root] ?? C.chars[reduce(root, false)];
    const lifeLink = numPaths().includes(`${N}life-path/${root}/`) ? [{ href: lp(lang, `${N}life-path/${root}/`), label: U.lifePathShort(root), sub: rootChar.name }] : [];
    return { path, kind: "article", eyebrow: `${U.angelHub} · ${item}`, h1: U.angelTitle(item), title: U.angelTitle(item), description: U.angelMeta(item, a.tag), lead: a.tag, big: item,
      crumbs: [home, hub, [U.angelHub, lp(lang, `${N}angel-numbers/`)], [item, lp(lang, path)]],
      blocks: [
        { id: "scene", title: U.sec.scene, paras: [a.scene] },
        { id: "meaning", title: U.sec.meaning, paras: a.meaning },
        ...angelLong(lang, item).map((x, k) => ({ id: `story-${k}`, title: x.title, paras: x.paras })),
        { id: "digits", title: U.digits, paras: digitParas },
        { id: "love", title: U.sec.love, paras: [a.love] },
        { id: "work", title: U.sec.work, paras: [a.work] },
        { id: "act", title: U.sec.act, quote: a.act },
        { id: "why", title: U.sec.why, paras: [a.why] },
      ],
      faq: [[U.faq.angelMean(item), `${a.tag}. ${a.meaning[0]}`], [U.faq.angelLove(item), a.love], [U.faq.angelDo(item), a.act], [U.faq.angelWhy(item), a.why]],
      related: [...lifeLink, ...[1, 2, 3].map((k) => at(i + k)).map((x) => ({ href: lp(lang, `${N}angel-numbers/${x}/`), label: x, sub: C.angel[x].tag, big: x }))],
      prev: { href: lp(lang, `${N}angel-numbers/${at(i - 1)}/`), label: at(i - 1) }, next: { href: lp(lang, `${N}angel-numbers/${at(i + 1)}/`), label: at(i + 1) }, calc: "life-path" };
  }
  if (sec === "calculator" && !item) {
    const E = C.explain.calculator;
    return { path, kind: "hub", eyebrow: U.section, h1: E.title, title: E.title, description: E.sub, lead: E.sub, crumbs: [home, hub, [U.calcHub, lp(lang, path)]], faq: E.faq,
      blocks: [{ id: "intro", title: U.calcHub, paras: E.intro }, { id: "how", title: U.calc.steps, paras: E.how }], items: calcItems() };
  }
  if (sec === "calculator" && item && (CALCS as readonly string[]).includes(item)) {
    const E = C.explain[`calc-${item}`];
    return { path, kind: "calc", eyebrow: U.calcHub, h1: E.title, title: E.title, description: E.sub, lead: E.sub, crumbs: [home, hub, [U.calcHub, lp(lang, `${N}calculator/`)], [E.title, lp(lang, path)]], faq: E.faq,
      blocks: [{ id: "intro", title: U.sec.meaning, paras: E.intro }, { id: "how", title: U.calc.steps, paras: E.how }], calc: item as CalcMode,
      related: calcItems().filter((_, k) => CALCS[k] !== item).concat([{ href: lp(lang, `${N}angel-numbers/`), label: U.angelHub, sub: C.explain.angel.sub }]) };
  }
  const D = getContent(lang).deep; const NUMS = getContent(lang).nums.numbers;
  const lifeItems = (): LinkItem[] => LIFE.map((n) => ({ href: lp(lang, `${N}life-path/${n}/`), label: C.chars[n].name, sub: C.chars[n].essence, big: String(n) }));
  const yearItems = (): LinkItem[] => YEARS.map((n) => ({ href: lp(lang, `${N}personal-year/${n}/`), label: D.personalYearDeep[n].title, sub: U.yearShort(n), big: String(n) }));
  const karmicItems = (): LinkItem[] => KARMIC.map((n) => ({ href: lp(lang, `${N}karmic-debt/${n}/`), label: C.karmic[n].title, sub: C.karmic[n].lesson, big: String(n) }));
  const hubOf = (key: string, crumb: string, items: LinkItem[], extra: Block[] = [], calc?: CalcMode, related?: LinkItem[]): NumModel => {
    const E = C.explain[key];
    return { path, kind: "hub", eyebrow: U.section, h1: E.title, title: E.title, description: E.sub, lead: E.sub, crumbs: [home, hub, [crumb, lp(lang, path)]], faq: E.faq,
      blocks: [{ id: "intro", title: crumb, paras: E.intro }, ...extra, { id: "how", title: U.calc.steps, paras: E.how }], items, calc, related };
  };
  if (sec === "life-path" && !item) return hubOf("life-path", U.lifePathHub, lifeItems(), [], "life-path", [{ href: lp(lang, `${N}master-numbers/`), label: U.masterHub, sub: C.explain["master-numbers"].sub }, { href: lp(lang, `${N}personal-year/`), label: U.yearHub, sub: C.explain["personal-year"].sub }]);
  if (sec === "life-path" && item && (LIFE as readonly number[]).includes(Number(item))) {
    const n = Number(item) as (typeof LIFE)[number]; const ch = C.chars[n]; const dp = D.lifePathDeep[n]; const k = LIFE.indexOf(n);
    const prevN = LIFE[(k + LIFE.length - 1) % LIFE.length], nextN = LIFE[(k + 1) % LIFE.length];
    const rep = n > 9 ? `${n}${n}` : `${n}${n}${n}`; const angelRep = (ANGEL as readonly string[]).includes(rep) ? rep : undefined;
    const rel: LinkItem[] = [
      ...(n > 9 ? [{ href: lp(lang, `${N}master-numbers/`), label: U.masterHub, sub: C.explain["master-numbers"].sub }, { href: lp(lang, `${N}life-path/${rootOf(n)}/`), label: U.lifePathShort(rootOf(n)), sub: C.chars[rootOf(n)].name, big: String(rootOf(n)) }] : [{ href: lp(lang, `${N}personal-year/${n}/`), label: U.yearShort(n), sub: D.personalYearDeep[n].title, big: String(n) }]),
      ...(angelRep ? [{ href: lp(lang, `${N}angel-numbers/${angelRep}/`), label: `${U.angelHub} ${angelRep}`, sub: C.angel[angelRep].tag, big: angelRep }] : []),
    ];
    return { path, kind: "article", eyebrow: `${U.lifePathHub} · ${ch.name}`, h1: U.lifePathTitle(n), title: U.lifePathTitle(n), description: U.lifePathMeta(n, ch.name), lead: dp.quote, big: String(n),
      crumbs: [home, hub, [U.lifePathHub, lp(lang, `${N}life-path/`)], [String(n), lp(lang, path)]],
      blocks: [
        { id: "story", title: dp.title, paras: [...dp.story, ch.story] },
        { id: "gifts", title: U.sec.gifts, paras: [ch.gifts, NUMS[n].lifePath], list: dp.strengths },
        { id: "love", title: U.sec.love, paras: [dp.love ?? "", ch.love].filter(Boolean) },
        { id: "work", title: U.sec.work, paras: [dp.work ?? "", ch.work, ch.money].filter(Boolean) },
        { id: "shadow", title: U.sec.shadow, paras: [ch.shadow], list: dp.shadows },
        { id: "week", title: U.sec.week, paras: [ch.week] },
        { id: "growth", title: U.sec.growth, quote: dp.growth ?? ch.questions[0] },
        { id: "practices", title: U.sec.practices, list: [...(dp.practices ?? [])] },
        { id: "questions", title: U.sec.questions, list: [...ch.questions, ...(dp.journal ?? [])] },
      ].filter((b) => (b.paras?.length ?? 0) + (b.list?.length ?? 0) + (b.quote ? 1 : 0) > 0),
      faq: [[U.faq.lpMean(n), `${ch.name}: ${ch.essence}. ${NUMS[n].lifePath}`], [U.faq.lpLove(n), ch.love], [U.faq.lpWork(n), ch.work], [U.faq.lpCalc(n), U.faq.lpCalcA]],
      related: rel, prev: { href: lp(lang, `${N}life-path/${prevN}/`), label: String(prevN) }, next: { href: lp(lang, `${N}life-path/${nextN}/`), label: String(nextN) }, calc: "life-path" };
  }
  if (sec === "master-numbers" && !item) {
    const ms = [11, 22, 33] as const;
    return hubOf("master-numbers", U.masterHub, lifeItems().slice(9), ms.map((n) => ({ id: `m${n}`, title: `${n}, ${C.chars[n].name}`, paras: [C.chars[n].story, C.chars[n].gifts, C.chars[n].shadow] })), "life-path");
  }
  if (sec === "personal-year" && !item) return hubOf("personal-year", U.yearHub, yearItems(), [], "personal-year");
  if (sec === "personal-year" && item && (YEARS as readonly number[]).includes(Number(item))) {
    const n = Number(item); const y = C.years[n]; const dy = D.personalYearDeep[n];
    const prevN = n === 1 ? 9 : n - 1, nextN = n === 9 ? 1 : n + 1;
    return { path, kind: "article", eyebrow: `${U.yearHub} · ${n}`, h1: U.yearTitle(n), title: U.yearTitle(n), description: U.yearMeta(n), lead: dy.title, big: String(n),
      crumbs: [home, hub, [U.yearHub, lp(lang, `${N}personal-year/`)], [String(n), lp(lang, path)]],
      blocks: [
        { id: "scene", title: U.sec.mood, paras: [y.scene, dy.text] },
        { id: "focus", title: U.sec.focus, list: dy.focus },
        { id: "months", title: U.sec.months, paras: [y.months] },
        { id: "love", title: U.sec.love, paras: [y.love] },
        { id: "work", title: U.sec.work, paras: [y.work] },
        { id: "body", title: U.sec.body, paras: [y.body] },
        { id: "caution", title: U.sec.caution, quote: dy.caution },
        { id: "close", title: U.sec.close, paras: [y.close, C.chars[n].week] },
      ],
      faq: [[U.faq.yrMean(n), `${dy.title}. ${dy.text}`], [U.faq.yrCalc, U.faq.yrCalcA]],
      related: [{ href: lp(lang, `${N}life-path/${n}/`), label: U.lifePathShort(n), sub: C.chars[n].name, big: String(n) }],
      prev: { href: lp(lang, `${N}personal-year/${prevN}/`), label: String(prevN) }, next: { href: lp(lang, `${N}personal-year/${nextN}/`), label: String(nextN) }, calc: "personal-year" };
  }
  if (sec === "birthday-number" && item && BDAY_DAYS.includes(Number(item))) {
    const d = Number(item); const B = BIRTHDAYS[lang]?.[d] ?? BIRTHDAYS.en[d]; const r = reduce(d, true); const i = BDAY_DAYS.indexOf(d);
    const prevD = BDAY_DAYS[(i + BDAY_DAYS.length - 1) % BDAY_DAYS.length], nextD = BDAY_DAYS[(i + 1) % BDAY_DAYS.length];
    const hubLabel = C.explain["birthday-number"].title.split(":")[0];
    const rel: LinkItem[] = [{ href: lp(lang, `${N}life-path/${r}/`), label: U.lifePathShort(r), sub: C.chars[r].name, big: String(r) }];
    if ((KARMIC as readonly number[]).includes(d)) rel.push({ href: lp(lang, `${N}karmic-debt/${d}/`), label: U.karmicHub, sub: C.karmic[d as (typeof KARMIC)[number]].lesson, big: String(d) });
    if (d === 11 || d === 22) rel.push({ href: lp(lang, `${N}master-numbers/`), label: U.masterHub, sub: C.explain["master-numbers"].sub });
    return { path, kind: "article", eyebrow: `${hubLabel} · ${d}`, h1: B.title, title: B.title, description: B.lead.slice(0, 158), lead: B.lead, big: String(d),
      crumbs: [home, hub, [hubLabel, lp(lang, `${N}birthday-number/`)], [String(d), lp(lang, path)]],
      blocks: B.sections.map((s, k) => ({ id: `b${k}`, title: s.title, paras: s.paras })), faq: [], related: rel,
      prev: { href: lp(lang, `${N}birthday-number/${prevD}/`), label: String(prevD) }, next: { href: lp(lang, `${N}birthday-number/${nextD}/`), label: String(nextD) }, calc: "life-path" };
  }
  if (sec === "compatibility" && !item && PAIR_KEYS.length) {
    const H = PAIR_HUB[lang] ?? PAIR_HUB.en;
    return { path, kind: "hub", eyebrow: U.section, h1: H.title, title: H.title, description: H.sub, lead: H.sub, crumbs: [home, hub, [H.crumb, lp(lang, path)]], faq: [],
      blocks: [{ id: "intro", title: H.crumb, paras: H.intro }], calc: "compatibility",
      items: PAIR_KEYS.map((k) => { const [a, b] = k.split("-and-").map(Number); return { href: lp(lang, `${N}compatibility/${k}/`), label: (PAIRS[lang]?.[k] ?? PAIRS.en[k]).title, sub: `${C.chars[a].name} · ${C.chars[b].name}`, big: `${a}+${b}` }; }),
      related: [{ href: lp(lang, `${N}life-path/`), label: U.lifePathHub, sub: C.explain["life-path"].sub }] };
  }
  if (sec === "compatibility" && item && PAIR_KEYS.includes(item)) {
    const P = PAIRS[lang]?.[item] ?? PAIRS.en[item]; const H = PAIR_HUB[lang] ?? PAIR_HUB.en; const [a, b] = item.split("-and-").map(Number); const i = PAIR_KEYS.indexOf(item);
    const prevK = PAIR_KEYS[(i + PAIR_KEYS.length - 1) % PAIR_KEYS.length], nextK = PAIR_KEYS[(i + 1) % PAIR_KEYS.length];
    const lab = (k: string) => k.replace("-and-", " + ");
    const rel: LinkItem[] = [...new Set([a, b])].map((n) => ({ href: lp(lang, `${N}life-path/${n}/`), label: U.lifePathShort(n), sub: C.chars[n].name, big: String(n) }));
    return { path, kind: "article", eyebrow: `${H.crumb} · ${a} + ${b}`, h1: P.title, title: P.title, description: P.lead.slice(0, 158), lead: P.lead, big: `${a}+${b}`,
      crumbs: [home, hub, [H.crumb, lp(lang, `${N}compatibility/`)], [lab(item), lp(lang, path)]],
      blocks: P.sections.map((s, k) => ({ id: `p${k}`, title: s.title, paras: s.paras })), faq: [], related: rel,
      prev: { href: lp(lang, `${N}compatibility/${prevK}/`), label: lab(prevK) }, next: { href: lp(lang, `${N}compatibility/${nextK}/`), label: lab(nextK) }, calc: "compatibility" };
  }
  if ((CORE as readonly string[]).includes(sec) && !item) {
    const line = (n: number) => sec === "expression-number" ? NUMS[n].expression : sec === "soul-urge-number" ? NUMS[n].soul : sec === "personality-number" ? `${C.chars[n].essence}. ${C.chars[n].gifts}` : sec === "maturity-number" ? C.chars[n].gifts : C.chars[n].essence;
    const nums = LIFE as readonly number[];
    const extra: Block[] = sec === "birthday-number" ? [] : [{ id: "numbers", title: U.pickNumber, list: nums.map((n) => `${n}, ${C.chars[n].name}: ${line(n)}`) }];
    const calc: CalcMode | undefined = sec === "birthday-number" || sec === "maturity-number" ? "life-path" : "name";
    return hubOf(sec, C.explain[sec].title.split(":")[0], sec === "birthday-number" ? BDAY_DAYS.map((d) => ({ href: lp(lang, `${N}birthday-number/${d}/`), label: (BIRTHDAYS[lang]?.[d] ?? BIRTHDAYS.en[d]).title, sub: C.chars[reduce(d, true)].name, big: String(d) })) : lifeItems(), extra, calc, CORE.filter((c) => c !== sec).map((c) => ({ href: lp(lang, `${N}${c}/`), label: C.explain[c].title.split(":")[0], sub: C.explain[c].sub })));
  }
  if (sec === "personal-day" && !item) return hubOf("personal-day", C.explain["personal-day"].title.split(":")[0], [], [{ id: "days", title: U.pickNumber, list: YEARS.map((n) => `${n}, ${C.chars[n].name}: ${C.days[n][0]}`) }], "personal-year", [{ href: lp(lang, `${N}personal-year/`), label: U.yearHub, sub: C.explain["personal-year"].sub }, { href: localizedPath(lang, "/horoscope/"), label: bankFor(lang).ui.hubTitle, sub: C.p3.dayTitle }]);
  if (sec === "karmic-debt" && !item) return hubOf("karmic-debt", U.karmicHub, karmicItems(), [], "life-path");
  if (sec === "karmic-debt" && item && (KARMIC as readonly number[]).includes(Number(item))) {
    const n = Number(item) as (typeof KARMIC)[number]; const K = C.karmic[n]; const r = reduce(n, false); const i = KARMIC.indexOf(n);
    const prevN = KARMIC[(i + 3) % 4], nextN = KARMIC[(i + 1) % 4];
    return { path, kind: "article", eyebrow: `${U.karmicHub} · ${n}`, h1: K.title, title: K.title, description: `${K.story[0]} ${K.lesson}`.slice(0, 158), lead: K.lesson, big: String(n),
      crumbs: [home, hub, [U.karmicHub, lp(lang, `${N}karmic-debt/`)], [String(n), lp(lang, path)]],
      blocks: [{ id: "story", title: U.sec.meaning, paras: K.story }, { id: "root", title: `${r}, ${C.chars[r].name}`, paras: [C.chars[r].shadow, C.chars[r].gifts] }, { id: "act", title: U.sec.practices, quote: K.practice }, { id: "questions", title: U.sec.questions, list: C.chars[r].questions }],
      faq: [[U.faq.angelMean(String(n)), `${K.lesson} ${K.story[0]}`]],
      related: [{ href: lp(lang, `${N}life-path/${r}/`), label: U.lifePathShort(r), sub: C.chars[r].name, big: String(r) }],
      prev: { href: lp(lang, `${N}karmic-debt/${prevN}/`), label: String(prevN) }, next: { href: lp(lang, `${N}karmic-debt/${nextN}/`), label: String(nextN) }, calc: "life-path" };
  }
  return null;
}
