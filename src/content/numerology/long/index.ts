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
const ALL: Record<string, AngelLong> = { en: { ...enB1, ...enB2, ...enB2b }, mk: { ...mkB1, ...mkB2, ...mkB2b }, de: { ...deB1, ...deB2, ...deB2b } };
/** Long story sections for an angel number page, if that batch is written. */
export function angelLong(lang: string, n: string) { return ALL[lang]?.[n] ?? []; }
