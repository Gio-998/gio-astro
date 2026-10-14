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
const ALL: Record<string, AngelLong> = { en: { ...enB1, ...enB2, ...enB2b, ...enB3, ...enB3b, ...enB4, ...enB4b }, mk: { ...mkB1, ...mkB2, ...mkB2b, ...mkB3, ...mkB3b, ...mkB4, ...mkB4b }, de: { ...deB1, ...deB2, ...deB2b, ...deB3, ...deB3b, ...deB4, ...deB4b } };
/** Long story sections for an angel number page, if that batch is written. */
export function angelLong(lang: string, n: string) { return ALL[lang]?.[n] ?? []; }
