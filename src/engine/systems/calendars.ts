import { byStartDates, ymd } from "./util";
/**
 * Date-based folk and modern calendars. Each one is a fixed table of start dates (month, day),
 * so the result depends only on the civil birth date. Sources are listed per table and on /how-it-works.
 */

// ——— Celtic tree calendar ———
// Robert Graves, "The White Goddess" (1948): 13 lunar-style months named after the Ogham tree letters.
// It is a 20th-century reconstruction, not an attested ancient Celtic calendar. Dec 23 is Graves's "day outside the months".
export const TREES = ["birch", "rowan", "ash", "alder", "willow", "hawthorn", "oak", "holly", "hazel", "vine", "ivy", "reed", "elder"] as const;
export type Tree = (typeof TREES)[number] | "nameless";
const TREE_STARTS: { id: Tree; start: [number, number] }[] = [
  { id: "birch", start: [12, 24] }, { id: "rowan", start: [1, 21] }, { id: "ash", start: [2, 18] }, { id: "alder", start: [3, 18] },
  { id: "willow", start: [4, 15] }, { id: "hawthorn", start: [5, 13] }, { id: "oak", start: [6, 10] }, { id: "holly", start: [7, 8] },
  { id: "hazel", start: [8, 5] }, { id: "vine", start: [9, 2] }, { id: "ivy", start: [9, 30] }, { id: "reed", start: [10, 28] },
  { id: "elder", start: [11, 25] }, { id: "nameless", start: [12, 23] },
];
export const celticTree = (date: string): Tree => { const [, m, d] = ymd(date); return byStartDates(TREE_STARTS, m, d).id; };

// ——— "Egyptian zodiac" ———
// A modern popular list (late 20th century) that assigns 12 Egyptian deities to several date windows each.
// It has no source in ancient Egyptian texts (the Dendera zodiac is Greco-Roman and uses the Babylonian signs).
export const EGYPT = ["nile", "amun-ra", "mut", "geb", "osiris", "isis", "thoth", "horus", "anubis", "seth", "bastet", "sekhmet"] as const;
export type EgyptSign = (typeof EGYPT)[number];
const EGYPT_STARTS: { id: EgyptSign; start: [number, number] }[] = [
  { id: "nile", start: [1, 1] }, { id: "amun-ra", start: [1, 8] }, { id: "mut", start: [1, 22] }, { id: "amun-ra", start: [2, 1] },
  { id: "geb", start: [2, 12] }, { id: "osiris", start: [3, 1] }, { id: "isis", start: [3, 11] }, { id: "thoth", start: [4, 1] },
  { id: "horus", start: [4, 20] }, { id: "anubis", start: [5, 8] }, { id: "seth", start: [5, 28] }, { id: "nile", start: [6, 19] },
  { id: "anubis", start: [6, 29] }, { id: "bastet", start: [7, 14] }, { id: "sekhmet", start: [7, 29] }, { id: "horus", start: [8, 12] },
  { id: "geb", start: [8, 20] }, { id: "nile", start: [9, 1] }, { id: "mut", start: [9, 8] }, { id: "bastet", start: [9, 23] },
  { id: "seth", start: [9, 28] }, { id: "bastet", start: [10, 3] }, { id: "isis", start: [10, 18] }, { id: "sekhmet", start: [10, 30] },
  { id: "thoth", start: [11, 8] }, { id: "nile", start: [11, 18] }, { id: "osiris", start: [11, 27] }, { id: "isis", start: [12, 19] },
];
export const egyptianSign = (date: string): EgyptSign => { const [, m, d] = ymd(date); return byStartDates(EGYPT_STARTS, m, d).id; };

// ——— Norse birth rune ———
// The 24 Elder Futhark runes spread over the year in half-months starting 29 June (Fehu), a modern
// "runic half-month" calendar popularised in the 1990s (e.g. Nigel Pennick). The runes are ancient; the calendar is not.
export const RUNES = ["fehu", "uruz", "thurisaz", "ansuz", "raidho", "kenaz", "gebo", "wunjo", "hagalaz", "nauthiz", "isa", "jera", "eihwaz", "perthro", "algiz", "sowilo", "tiwaz", "berkano", "ehwaz", "mannaz", "laguz", "ingwaz", "othala", "dagaz"] as const;
export type Rune = (typeof RUNES)[number];
export const RUNE_GLYPH: Record<Rune, string> = { fehu: "ᚠ", uruz: "ᚢ", thurisaz: "ᚦ", ansuz: "ᚨ", raidho: "ᚱ", kenaz: "ᚲ", gebo: "ᚷ", wunjo: "ᚹ", hagalaz: "ᚺ", nauthiz: "ᚾ", isa: "ᛁ", jera: "ᛃ", eihwaz: "ᛇ", perthro: "ᛈ", algiz: "ᛉ", sowilo: "ᛊ", tiwaz: "ᛏ", berkano: "ᛒ", ehwaz: "ᛖ", mannaz: "ᛗ", laguz: "ᛚ", ingwaz: "ᛜ", othala: "ᛟ", dagaz: "ᛞ" };
const RUNE_STARTS: { id: Rune; start: [number, number] }[] = ([
  [6, 29], [7, 14], [7, 29], [8, 13], [8, 29], [9, 13], [9, 28], [10, 13], [10, 28], [11, 13], [11, 28], [12, 13],
  [12, 28], [1, 13], [1, 28], [2, 12], [2, 27], [3, 14], [3, 30], [4, 14], [4, 29], [5, 14], [5, 29], [6, 14],
] as [number, number][]).map((start, i) => ({ id: RUNES[i], start }));
export const birthRune = (date: string): Rune => { const [, m, d] = ymd(date); return byStartDates(RUNE_STARTS, m, d).id; };

// ——— Slavic folk month (Macedonian names) ———
// Old Slavic month names still printed in Macedonian church calendars: коложег, сечко, цутар, тревен, косар,
// жетвар, златец, житар, гроздобер, листопад, студен, снежник (Macedonian Wikipedia "Македонски месеци").
export const SLAVIC_MONTHS = ["kolozheg", "sechko", "cutar", "treven", "kosar", "zhetvar", "zlatec", "zhitar", "grozdober", "listopad", "studen", "snezhnik"] as const;
export type SlavicMonth = (typeof SLAVIC_MONTHS)[number];
export const slavicMonth = (date: string): SlavicMonth => SLAVIC_MONTHS[ymd(date)[1] - 1];
