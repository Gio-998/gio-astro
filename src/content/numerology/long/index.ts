import type { AngelLong } from "./types";
import { enB1 } from "./en-b1";
import { mkB1 } from "./mk-b1";
import { deB1 } from "./de-b1";
const ALL: Record<string, AngelLong> = { en: { ...enB1 }, mk: { ...mkB1 }, de: { ...deB1 } };
/** Long story sections for an angel number page, if that batch is written. */
export function angelLong(lang: string, n: string) { return ALL[lang]?.[n] ?? []; }
