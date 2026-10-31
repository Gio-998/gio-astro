import { localizedPath } from "@/lib/i18n-routes";
import { getContent } from "@/content";
import { SIGNS, SIGN_GLYPH, type Sign } from "@/engine/zodiac";
import { SIGN_PAIRS, SIGN_PAIR_HUB, SIGN_PAIR_DATE } from "@/content/sign-compat";
import type { Section, SectionModel } from "./types";

const S = "/sign-compatibility/";
/** Every unordered sign pair (78), keyed "a-and-b" in zodiac order. */
export const ALL_SIGN_PAIRS: string[] = SIGNS.flatMap((a, i) => SIGNS.slice(i).map((b) => `${a}-and-${b}`));
/** Pairs written in every language (gated by tests/sign-compat-overlap.test.ts). */
export const SIGN_PAIR_KEYS: string[] = ALL_SIGN_PAIRS.filter((k) => SIGN_PAIRS.en[k] && SIGN_PAIRS.mk[k] && SIGN_PAIRS.de[k]);

const pairSigns = (k: string) => k.split("-and-") as [Sign, Sign];
function model(lang: string, path: string): SectionModel | null {
  const c = getContent(lang); const H = SIGN_PAIR_HUB[lang] ?? SIGN_PAIR_HUB.en; const brand = c.site.brand;
  const lp = (p: string) => localizedPath(lang, p); const name = (s: Sign) => c.astro.signs[s].name;
  const home: [string, string] = [brand, `/${lang}/`]; const hub: [string, string] = [H.crumb, lp(S)];
  const item = path.split("/").filter(Boolean)[1];
  const base = { sectionName: H.crumb, published: SIGN_PAIR_DATE, modified: SIGN_PAIR_DATE };
  if (!item) return { ...base, path, kind: "hub", eyebrow: H.crumb, h1: H.title, title: H.metaTitle, description: H.description, lead: H.sub, crumbs: [home, hub], faq: H.faq,
    blocks: [{ id: "intro", title: H.crumb, paras: H.intro }],
    items: SIGN_PAIR_KEYS.map((k) => { const [a, b] = pairSigns(k); return { href: lp(`${S}${k}/`), label: `${name(a)} + ${name(b)}`, big: `${SIGN_GLYPH[a]}${SIGN_GLYPH[b]}` }; }) };
  if (!SIGN_PAIR_KEYS.includes(item)) return null;
  const P = SIGN_PAIRS[lang][item]; const [a, b] = pairSigns(item); const i = SIGN_PAIR_KEYS.indexOf(item); const label = `${name(a)} + ${name(b)}`;
  const at = (n: number) => SIGN_PAIR_KEYS[(n + SIGN_PAIR_KEYS.length) % SIGN_PAIR_KEYS.length];
  const short = (k: string) => { const [x, y] = pairSigns(k); return `${name(x)} + ${name(y)}`; };
  return { ...base, path, kind: "article", eyebrow: `${H.crumb} · ${label}`, h1: P.title, title: P.metaTitle, description: P.description, lead: P.lead, big: `${SIGN_GLYPH[a]}${SIGN_GLYPH[b]}`,
    crumbs: [home, hub, [label, lp(path)]], blocks: P.sections.map((s, k) => ({ id: `s${k}`, title: s.title, paras: s.paras })), faq: P.faq,
    related: [...new Set([a, b])].flatMap((s) => [{ href: lp(`/zodiac/${s}/`), label: name(s), big: SIGN_GLYPH[s] }, { href: lp(`/horoscope/${s}/`), label: `${c.astro.signs[s].name} · ${H.dailyLabel}`, big: SIGN_GLYPH[s] }]),
    prev: { href: lp(`${S}${at(i - 1)}/`), label: short(at(i - 1)) }, next: { href: lp(`${S}${at(i + 1)}/`), label: short(at(i + 1)) } };
}
export const signCompatibility: Section = { key: "sign-compatibility", paths: () => (SIGN_PAIR_KEYS.length ? [S, ...SIGN_PAIR_KEYS.map((k) => `${S}${k}/`)] : []), model, modified: () => SIGN_PAIR_DATE };
