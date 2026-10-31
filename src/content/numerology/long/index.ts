import type { AngelLong } from "./types";
import { enB1 } from "./en-b1";
import { mkB1 } from "./mk-b1";
import { deB1 } from "./de-b1";
import { enB2 } from "./en-b2";
import { enB2b } from "./en-b2b";
import { mkB2 } from "./mk-b2";
import { mkB2b } from "./mk-b2b";
import { deB2 } from "./de-b2";
import { deB2b } from "./de-b2b";
import { enB3 } from "./en-b3";
import { enB3b } from "./en-b3b";
import { mkB3 } from "./mk-b3";
import { mkB3b } from "./mk-b3b";
import { deB3 } from "./de-b3";
import { deB3b } from "./de-b3b";
import { enB4 } from "./en-b4";
import { enB4b } from "./en-b4b";
import { mkB4 } from "./mk-b4";
import { mkB4b } from "./mk-b4b";
import { deB4 } from "./de-b4";
import { deB4b } from "./de-b4b";
import { enB5 } from "./en-b5";
import { enB5b } from "./en-b5b";
import { mkB5 } from "./mk-b5";
import { mkB5b } from "./mk-b5b";
import { deB5 } from "./de-b5";
import { deB5b } from "./de-b5b";
import { enB6 } from "./en-b6";
import { enB6b } from "./en-b6b";
import { mkB6 } from "./mk-b6";
import { mkB6b } from "./mk-b6b";
import { deB6 } from "./de-b6";
import { deB6b } from "./de-b6b";
import { enB7 } from "./en-b7";
import { mkB7 } from "./mk-b7";
import { deB7 } from "./de-b7";
const ALL: Record<string, AngelLong> = { en: { ...enB1, ...enB2, ...enB2b, ...enB3, ...enB3b, ...enB4, ...enB4b, ...enB5, ...enB5b, ...enB6, ...enB6b, ...enB7 }, mk: { ...mkB1, ...mkB2, ...mkB2b, ...mkB3, ...mkB3b, ...mkB4, ...mkB4b, ...mkB5, ...mkB5b, ...mkB6, ...mkB6b, ...mkB7 }, de: { ...deB1, ...deB2, ...deB2b, ...deB3, ...deB3b, ...deB4, ...deB4b, ...deB5, ...deB5b, ...deB6, ...deB6b, ...deB7 } };
/** Long story sections for an angel number page, if that batch is written. */
export function angelLong(lang: string, n: string) { return ALL[lang]?.[n] ?? []; }
import { pagesEn } from "./pages-en";
import { pagesMk } from "./pages-mk";
import { pagesDe } from "./pages-de";
const PAGES: Record<string, AngelLong> = { en: pagesEn, mk: pagesMk, de: pagesDe };
/** Long guide sections for an explainer or number page, keyed by its path after the numerology root ("hub" for the root). */
export function pageLong(lang: string, key: string) { return PAGES[lang]?.[key] ?? []; }
