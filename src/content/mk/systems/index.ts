import * as points from "./points";
import * as calendars from "./calendars";
import * as east from "./east";
import * as meta from "./meta";
import * as v from "./voice";
import { how } from "./how";
import * as lots from "./lots";
/** Macedonian text for the extra systems. Anything missing falls back to English via deepMerge. */
export const systems = { ...points, ...calendars, ...east, evidence: meta.evidence, meta: { ...meta.meta, ...lots.metaExtra } as typeof meta.meta & typeof lots.metaExtra, ui: { ...meta.ui, ...lots.uiExtra }, fortune: lots.fortune, spirit: lots.spirit, voiceUi: meta.voiceUi, voice: v.voice, chironTheme: v.chironTheme, attachLens: v.attachLens, attachNervous: v.attachNervous, how };
