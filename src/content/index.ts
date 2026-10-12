import * as astro from "./en/astro";
import * as chinese from "./en/chinese";
import * as nums from "./en/numbers";
import * as ui from "./en/ui";
import * as psych from "./en/psych";
import * as vedic from "./en/vedic";
import * as quizzes from "./en/quizzes";
import * as compat from "./en/compat";
import * as daily from "./en/daily";
import { site } from "./en/site";
import * as deep from "./en/deep";
import { book } from "./en/book";
import { lensInfo, lensUi } from "./en/lens";
import { landing } from "./en/landing";
import { enExtra } from "./en/extra";
import { systems } from "./en/systems";

const en = { astro, chinese, nums, psych, vedic, quizzes, compat, daily, site, deep, book, lensInfo, lensUi, landing, ui, ...enExtra, systems };
export type Content = typeof en;

import { mk as mkPartial } from "./mk";
import { mkExtra } from "./mk/extra";
import { systems as mkSystems } from "./mk/systems";

type DeepPartial<T> = T extends (...a: never[]) => unknown ? T : T extends readonly unknown[] ? T : T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T;
/** Override objects key-by-key; functions, arrays and primitives replace. Untranslated keys keep the English text. */
function deepMerge<T>(base: T, over: DeepPartial<T> | undefined): T {
  if (over === undefined) return base;
  if (typeof base !== "object" || base === null || Array.isArray(base) || typeof over !== "object" || over === null || Array.isArray(over)) return over as T;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [k, v] of Object.entries(over as Record<string, unknown>)) out[k] = deepMerge((base as Record<string, unknown>)[k], v as never);
  return out as T;
}
const mk: Content = deepMerge<Content>(en, { ...mkPartial, ...mkExtra, systems: mkSystems } as DeepPartial<Content>);

/** Add a locale by creating src/content/<code>/* (any subset) and registering it here. */
export const LOCALES = ["en", "mk"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";
export const contents: Record<Locale, Content> = { en, mk };
export const isLocale = (s: string): s is Locale => (LOCALES as readonly string[]).includes(s);
export const getContent = (l: string): Content => contents[isLocale(l) ? l : DEFAULT_LOCALE];
