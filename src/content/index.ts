import * as astro from "./en/astro";
import * as chinese from "./en/chinese";
import * as nums from "./en/numbers";
import * as psych from "./en/psych";
import * as vedic from "./en/vedic";
import * as quizzes from "./en/quizzes";
import * as compat from "./en/compat";
import * as daily from "./en/daily";
import { site } from "./en/site";
import * as deep from "./en/deep";
import { book } from "./en/book";

const en = { astro, chinese, nums, psych, vedic, quizzes, compat, daily, site, deep, book };
export type Content = typeof en;

/** Add a locale by creating src/content/pl/* with the same shape and registering it here. */
export const LOCALES = ["en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";
export const contents: Record<Locale, Content> = { en };
export const isLocale = (s: string): s is Locale => (LOCALES as readonly string[]).includes(s);
export const getContent = (l: string): Content => contents[isLocale(l) ? l : DEFAULT_LOCALE];
