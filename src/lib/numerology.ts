/** Public numerology section: which pages exist, and the page model each one renders. Server only (pulls long copy). */
import { numContent } from "@/content/numerology";
import { getContent } from "@/content";
import { localizedPath } from "./i18n-routes";
import { reduce } from "@/engine/numerology";

export const ANGEL = ["111", "222", "333", "444", "555", "666", "777", "888", "999", "000", "1111", "2222", "3333", "4444", "5555", "0000", "1010", "1212", "1221", "1234", "1313", "1414", "1001", "123", "911", "2020", "2121", "1122", "1144", "717"] as const;
export const LIFE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33] as const;
export const YEARS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
export const KARMIC = [13, 14, 16, 19] as const;
export const CALCS = ["life-path", "name"] as const;
export type CalcMode = (typeof CALCS)[number] | "personal-year" | "compatibility";

const N = "/numerology/";
/** Every public numerology route (internal paths). */
export function numPaths(): string[] {
  return [N, `${N}angel-numbers/`, ...ANGEL.map((a) => `${N}angel-numbers/${a}/`), `${N}calculator/`, ...CALCS.map((c) => `${N}calculator/${c}/`)];
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

export function numModel(lang: string, path: string): NumModel | null {
  const C = numContent(lang); const U = C.ui; const brand = getContent(lang).site.brand;
  const home: [string, string] = [brand, `/${lang}/`]; const hub: [string, string] = [U.section, lp(lang, N)];
  const parts = path.split("/").filter(Boolean).slice(1); // after "numerology"
  const angelItems = (): LinkItem[] => ANGEL.map((a) => ({ href: lp(lang, `${N}angel-numbers/${a}/`), label: a, sub: C.angel[a].tag, big: a }));
  const calcItems = (): LinkItem[] => CALCS.map((c) => ({ href: lp(lang, `${N}calculator/${c}/`), label: C.explain[`calc-${c}`].title, sub: C.explain[`calc-${c}`].sub }));

  if (!parts.length) {
    const E = C.explain.hub;
    return { path, kind: "hub", eyebrow: U.section, h1: E.title, title: E.title, description: E.sub, lead: E.sub, crumbs: [home, hub], faq: E.faq,
      blocks: [{ id: "intro", title: U.section, paras: E.intro }, { id: "how", title: U.sec.explore, paras: [...E.how, U.method] }],
      items: [{ href: lp(lang, `${N}angel-numbers/`), label: U.angelHub, sub: C.explain.angel.sub }, ...calcItems()],
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
  return null;
}
