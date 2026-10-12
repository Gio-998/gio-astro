/**
 * Definitions + scoring for the questionnaire lenses (wording lives in src/content/<locale>/quizzes.ts).
 * All items are our own wording except the Big Five (public-domain IPIP, see bigfive.ts).
 */

// ——— Attachment (own items in the style of two-dimension measures: anxiety & avoidance) ———
export const ATTACH_ITEMS = [
  { id: "ax1", dim: "anxiety", keyed: 1 }, { id: "av1", dim: "avoidance", keyed: 1 }, { id: "ax2", dim: "anxiety", keyed: 1 },
  { id: "av2", dim: "avoidance", keyed: -1 }, { id: "ax3", dim: "anxiety", keyed: 1 }, { id: "av3", dim: "avoidance", keyed: 1 },
  { id: "ax4", dim: "anxiety", keyed: -1 }, { id: "av4", dim: "avoidance", keyed: -1 }, { id: "ax5", dim: "anxiety", keyed: 1 },
] as const;
export type AttachStyle = "secure" | "anxious" | "avoidant" | "fearful";
export interface AttachResult { anxiety: number; avoidance: number; style: AttachStyle } // 0–100
export function scoreAttachment(ans: Record<string, number>): AttachResult {
  const acc = { anxiety: [] as number[], avoidance: [] as number[] };
  for (const it of ATTACH_ITEMS) { const v = ans[it.id]; if (v != null) acc[it.dim].push(it.keyed === 1 ? v : 6 - v); }
  const m = (a: number[]) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 3);
  const anxiety = Math.round(((m(acc.anxiety) - 1) / 4) * 100), avoidance = Math.round(((m(acc.avoidance) - 1) / 4) * 100);
  const hiX = anxiety > 50, hiV = avoidance > 50;
  return { anxiety, avoidance, style: !hiX && !hiV ? "secure" : hiX && !hiV ? "anxious" : !hiX && hiV ? "avoidant" : "fearful" };
}

// ——— Nine-style motivation quiz (Enneagram-style, own statements) ———
export const NINE = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
export interface NineResult { type: number; wing: number; scores: number[]; growth: number; stress: number }
export const GROWTH: Record<number, number> = { 1: 7, 2: 4, 3: 6, 4: 1, 5: 8, 6: 9, 7: 5, 8: 2, 9: 3 };
export const STRESS: Record<number, number> = { 1: 4, 2: 8, 3: 9, 4: 2, 5: 7, 6: 3, 7: 1, 8: 5, 9: 6 };
/** answers: id "t1".."t9" (core statement, 1–5) and "t1b".."t9b" (second statement, 1–5). */
export function scoreNine(ans: Record<string, number>): NineResult {
  const scores = NINE.map((t) => (ans[`t${t}`] ?? 3) + (ans[`t${t}b`] ?? 3));
  let type = 1; scores.forEach((s, i) => { if (s > scores[type - 1]) type = i + 1; });
  const left = type === 1 ? 9 : type - 1, right = type === 9 ? 1 : type + 1;
  const wing = scores[left - 1] >= scores[right - 1] ? left : right;
  return { type, wing, scores, growth: GROWTH[type], stress: STRESS[type] };
}
export const nineLinked = (a: number, b: number) => GROWTH[a] === b || STRESS[a] === b || GROWTH[b] === a || STRESS[b] === a;

// ——— Care styles (own forced-choice items; the five categories are generic concepts) ———
export const CARE = ["words", "time", "gifts", "help", "touch"] as const;
export type Care = (typeof CARE)[number];
export const CARE_PAIRS: [Care, Care][] = [];
for (let i = 0; i < CARE.length; i++) for (let j = i + 1; j < CARE.length; j++) CARE_PAIRS.push([CARE[i], CARE[j]]);
/** Display order of CARE_PAIRS indices: no style appears in two questions in a row. */
export const CARE_ORDER = [0, 7, 3, 4, 9, 1, 5, 8, 2, 6];
export interface CareResult { receive: Record<Care, number>; topReceive: Care[]; give: Care }
/** answers: "p0".."p9" → 0 (first option) | 1 (second); "give" → index into CARE. */
export function scoreCare(ans: Record<string, number>): CareResult {
  const receive = { words: 0, time: 0, gifts: 0, help: 0, touch: 0 } as Record<Care, number>;
  CARE_PAIRS.forEach(([a, b], i) => { const v = ans[`p${i}`]; if (v === 0) receive[a]++; else if (v === 1) receive[b]++; });
  const topReceive = [...CARE].sort((a, b) => receive[b] - receive[a]).slice(0, 2);
  return { receive, topReceive, give: CARE[ans.give ?? 0] ?? "time" };
}

// ——— Shadow & Light: see shadow.ts ———

// ——— Body & energy constitution (Ayurveda-inspired doshas; own items, 3 options each) ———
export const DOSHA_ITEMS = ["frame", "skin", "appetite", "digestion", "sleep", "climate", "pace", "speech", "stress", "memory", "energy", "weather-mood"];
export type Dosha = "vata" | "pitta" | "kapha";
export type Constitution = Dosha | "vata-pitta" | "pitta-kapha" | "vata-kapha" | "tridoshic";
export interface DoshaResult { pct: Record<Dosha, number>; constitution: Constitution; dominant: Dosha }
/** answers: item id → 0 (vata) | 1 (pitta) | 2 (kapha) */
export function scoreDosha(ans: Record<string, number>): DoshaResult {
  const c = { vata: 0, pitta: 0, kapha: 0 };
  const keys: Dosha[] = ["vata", "pitta", "kapha"];
  let n = 0;
  for (const id of DOSHA_ITEMS) { const v = ans[id]; if (v != null && keys[v]) { c[keys[v]]++; n++; } }
  const pct = { vata: 0, pitta: 0, kapha: 0 } as Record<Dosha, number>;
  keys.forEach((k) => (pct[k] = n ? Math.round((c[k] / n) * 100) : 33));
  const sorted = [...keys].sort((a, b) => pct[b] - pct[a]);
  let constitution: Constitution = sorted[0];
  if (pct[sorted[0]] - pct[sorted[2]] < 15) constitution = "tridoshic";
  else if (pct[sorted[0]] - pct[sorted[1]] <= 10) {
    const pair = [sorted[0], sorted[1]].sort((a, b) => keys.indexOf(a) - keys.indexOf(b)).join("-");
    constitution = pair as Constitution;
  }
  return { pct, constitution, dominant: sorted[0] };
}

// ——— Autopilot vs Explorer mind + social stance (inspired by Fradin's neurocognitive approach; own items) ———
export const EXPLORER_ITEMS = ["routine", "persistence", "simplify", "certainty", "evidence", "image"] as const;
export const STANCE_ITEMS = [
  { id: "conf1", axis: "confidence", keyed: 1 }, { id: "conf2", axis: "confidence", keyed: -1 },
  { id: "trust1", axis: "belonging", keyed: 1 }, { id: "trust2", axis: "belonging", keyed: -1 },
] as const;
export type Stance = "steady-leader" | "lone-pathfinder" | "warm-supporter" | "quiet-observer";
export interface ExplorerResult { explorer: number; dims: Record<string, number>; confidence: number; belonging: number; stance: Stance }
/** Explorer items: 1 (autopilot pole) … 5 (explorer pole). Stance items: 1–5 agreement. */
export function scoreExplorer(ans: Record<string, number>): ExplorerResult {
  const dims: Record<string, number> = {};
  for (const id of EXPLORER_ITEMS) dims[id] = Math.round((((ans[id] ?? 3) - 1) / 4) * 100);
  const explorer = Math.round(Object.values(dims).reduce((a, b) => a + b, 0) / EXPLORER_ITEMS.length);
  const ax = { confidence: [] as number[], belonging: [] as number[] };
  for (const it of STANCE_ITEMS) { const v = ans[it.id] ?? 3; ax[it.axis].push(it.keyed === 1 ? v : 6 - v); }
  const m = (a: number[]) => Math.round(((a.reduce((x, y) => x + y, 0) / a.length - 1) / 4) * 100);
  const confidence = m(ax.confidence), belonging = m(ax.belonging);
  const stance: Stance = confidence >= 50 ? (belonging >= 50 ? "steady-leader" : "lone-pathfinder") : belonging >= 50 ? "warm-supporter" : "quiet-observer";
  return { explorer, dims, confidence, belonging, stance };
}
