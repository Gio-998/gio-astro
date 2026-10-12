import * as points from "./points";
import * as calendars from "./calendars";
import * as east from "./east";
import * as meta from "./meta";
import * as v from "./voice";
import { how } from "./how";
/** Content for the extra "systems" lenses (Chiron, nodes, Tzolk'in, I Ching, name days, …). */
export const systems = { ...points, ...calendars, ...east, evidence: meta.evidence, meta: meta.meta, ui: meta.ui, voiceUi: meta.voiceUi, voice: v.voice, chironTheme: v.chironTheme, attachLens: v.attachLens, attachNervous: v.attachNervous, how };
export type SystemsContent = typeof systems;
