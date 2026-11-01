/**
 * Personal voice: sentences that are tied to one person's actual data, each carrying the data points
 * ("why") that produced it. Rules:
 *   1. Every line has at least one why-chip (no free-floating Barnum statements).
 *   2. The person's name appears once, in the opener only.
 *   3. Validate first, then (gently) challenge; challenges always come with a tiny next step.
 *   4. Psychology words (needs, nervous system, attachment, self-compassion, growth edge) in plain language,
 *      framed as "can help", never as diagnosis or treatment.
 */
import type { Content } from "@/content";
import type { Profile } from "@/engine/profile";
import type { Systems } from "@/engine/systems";
import type { QuizAnswers } from "@/lib/store";
import type { AuraAnswers } from "@/lib/aura";
import { SIGN_ELEMENT, Sign, formatDegree } from "@/engine/zodiac";
import { quizDefs } from "@/lib/quiz-defs";
import type { Cycle } from "@/engine/systems/biorhythm";

export interface VoiceLine { kind: "open" | "connect" | "echo" | "validate" | "challenge" | "care"; text: string; why: string[] }
export interface VoiceCtx { c: Content; p: Profile; sys: Systems; name: string; answers?: QuizAnswers; aura?: AuraAnswers; placeName?: string | null }

const lc = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
const trimDot = (s: string) => s.replace(/[.\s]+$/, "");

function birthWhy(x: VoiceCtx): string {
  const W = x.c.systems.voice.w;
  return x.p.chart.time.timeKnown && x.placeName ? W.birth(`${x.p.input.time}, ${x.placeName}`) : W.noTime;
}

/** Strongest likert answer (1 or 5) in the research quizzes, if any. Stable choice: first item in quiz order. */
export function strongestAnswer(x: VoiceCtx): { quiz: string; item: string; value: number; label: string } | null {
  if (!x.answers) return null;
  const defs = quizDefs(x.c);
  for (const qid of ["attachment", "big-five", "explorer", "dosha"] as const) {
    const a = x.answers[qid]; const def = defs[qid]; if (!a || !def) continue;
    for (const it of def.items) {
      if (it.kind !== "likert") continue;
      const v = a[it.id];
      if (v === 5 || v === 1) return { quiz: def.title, item: it.text.replace("{name}", x.name), value: v, label: it.scale[v - 1] };
    }
  }
  return null;
}

/** Map a North Node sign to the Big Five trait it asks for (our own symbolic bridge, documented on /how-it-works). */
const NODE_TRAIT: Record<Sign, "O" | "C" | "E" | "A" | "N" | "lowC"> = {
  aries: "E", taurus: "N", gemini: "O", cancer: "A", leo: "E", virgo: "C", libra: "A", scorpio: "O", sagittarius: "O", capricorn: "C", aquarius: "O", pisces: "lowC",
};

export function profileSummary(x: VoiceCtx): VoiceLine[] {
  const { c, p, sys } = x; const V = c.systems.voice, W = V.w, A = c.astro, S = (s: Sign) => A.signs[s].name;
  const sunLon = p.chart.placements.sun!.lon, moonLon = p.chart.placements.moon!.lon;
  const out: VoiceLine[] = [];
  out.push({ kind: "open", text: V.opener(x.name, S(p.sun), A.signs[p.sun].essence, S(p.moon), A.signs[p.moon].essence), why: [W.sun(S(p.sun), formatDegree(sunLon)), W.moon(S(p.moon), formatDegree(moonLon)), birthWhy(x)] });

  if (sys.chiron) {
    const chS = sys.chiron.sign, chWhy = W.chiron(S(chS), formatDegree(sys.chiron.lon));
    const att = p.quiz.attachment;
    if (att) {
      out.push({ kind: "connect", text: `${V.chironAttach(S(chS), c.systems.attachLens[att.style], c.systems.chironTheme[chS])} ${c.systems.attachNervous[att.style]}`, why: [chWhy, W.attach(c.psych.attachment[att.style].name, att.anxiety, att.avoidance)] });
    } else {
      out.push({ kind: "connect", text: V.chironMoon(S(chS), S(p.moon), c.systems.chironTheme[chS]), why: [chWhy, W.moon(S(p.moon), formatDegree(moonLon))] });
    }
  }

  const sa = strongestAnswer(x);
  if (sa) out.push({ kind: "echo", text: V.echoLikert(trimDot(sa.item), sa.value === 5), why: [W.item(sa.quiz, sa.label)] });
  else if (x.aura?.weather && x.aura.intention) {
    const R = c.ui.ritual;
    out.push({ kind: "echo", text: `${V.echoAura(R.weather[x.aura.weather], R.intent[x.aura.intention])} ${V.echoAuraCare(x.aura.weather)}`, why: [W.aura] });
  }

  const nodeS = sys.northNode.sign, nodeWhy = W.node(S(nodeS));
  const b5 = p.quiz.bigFive; const t = NODE_TRAIT[nodeS];
  if (b5) {
    const val = t === "lowC" ? 100 - b5.C : t === "N" ? 100 - b5.N : b5[t];
    const traitLabel = t === "lowC" ? "C" : t;
    const why = [nodeWhy, W.trait(c.psych.traits[traitLabel].name, t === "lowC" || t === "N" ? 100 - val : val)];
    if (val >= 60) out.push({ kind: "validate", text: V.nodeValidate(S(nodeS), V.traitName[t]), why });
    else out.push({ kind: "challenge", text: V.nodeChallenge(S(nodeS), V.traitName[t], lc(c.systems.nodes[nodeS].step)), why });
  } else {
    out.push({ kind: "challenge", text: `${V.nodePlain(S(nodeS), lc(c.systems.nodes[nodeS].north))} ${c.systems.nodes[nodeS].step}`, why: [nodeWhy] });
  }

  if (sys.chiron) out.push({ kind: "care", text: V.compassion(c.systems.chiron[sys.chiron.sign].practice), why: [W.chiron(S(sys.chiron.sign), formatDegree(sys.chiron.lon))] });
  return out;
}

/** One opener per Book chapter (keyed by chapter id). */
export function bookOpeners(x: VoiceCtx, srTheme?: string): Record<string, VoiceLine> {
  const { c, p, sys } = x; const V = c.systems.voice, W = V.w, S = (s: Sign) => c.astro.signs[s].name, pl = p.chart.placements;
  const o: Record<string, VoiceLine> = {};
  const venus = pl.venus!.sign, merc = pl.mercury!.sign;
  const care = p.quiz.care ? c.psych.care[p.quiz.care.topReceive[0]].name : undefined;
  o.love = { kind: "connect", text: V.book.love(S(venus), care?.toLowerCase()), why: [`${c.astro.points.venus.name} ${formatDegree(pl.venus!.lon)} ${S(venus)}`, ...(care ? [W.care(x.name, care)] : [])] };
  const ex = p.quiz.explorer ? c.psych.explorer.name : undefined;
  o.mind = { kind: "connect", text: V.book.mind(S(merc), ex && p.quiz.explorer ? `${ex}: ${p.quiz.explorer.explorer}/100` : undefined), why: [`${c.astro.points.mercury.name} ${formatDegree(pl.mercury!.lon)} ${S(merc)}`] };
  const sh = p.quiz.shadow ? c.psych.shadowAxes[p.quiz.shadow.mainShadow].classical : undefined;
  o.shadow = { kind: "connect", text: V.book.shadow(S(sys.lilith.sign), sh?.toLowerCase()), why: [`${c.systems.meta.lilith.short} ${formatDegree(sys.lilith.lon)} ${S(sys.lilith.sign)}`, ...(sh ? [`${c.lensInfo.shadow.name}: ${sh}`] : [])] };
  if (sys.chiron) o.heals = { kind: "care", text: V.book.heals(S(sys.chiron.sign), c.systems.chironTheme[sys.chiron.sign]), why: [W.chiron(S(sys.chiron.sign), formatDegree(sys.chiron.lon))] };
  o.path = { kind: "connect", text: V.book.path(S(sys.northNode.sign), p.numbers.lifePath), why: [W.node(S(sys.northNode.sign)), `${c.lensInfo.lifepath.name}: ${p.numbers.lifePathSteps}`] };
  if (srTheme) o.year = { kind: "connect", text: V.book.year(srTheme), why: [c.systems.meta.solarreturn.name] };
  return o;
}

/** Your Day lines: biorhythm peaks/lows, feast and name day today, inner-weather echo. */
export function dayLines(x: VoiceCtx, today: { bio: Record<Cycle, number> & { critical: Cycle[] }; feast: string | null; isNameDay: boolean; personalDay: number }): VoiceLine[] {
  const { c } = x; const V = c.systems.voice, W = V.w, B = c.systems.biorhythm;
  const out: VoiceLine[] = [];
  const bioWhy = W.bio(today.bio.physical, today.bio.emotional, today.bio.intellectual);
  const cycles: Cycle[] = ["physical", "emotional", "intellectual"];
  const top = cycles.reduce((a, b) => (today.bio[b] > today.bio[a] ? b : a));
  const low = cycles.reduce((a, b) => (today.bio[b] < today.bio[a] ? b : a));
  if (today.bio[top] >= 70) out.push({ kind: "validate", text: V.day.bioHigh(B[top].name.toLowerCase()), why: [bioWhy] });
  if (today.bio[low] <= -70) out.push({ kind: "care", text: V.day.bioLow(B[low].name.toLowerCase()), why: [bioWhy] });
  if (today.feast) { const f = c.systems.feasts[today.feast as keyof typeof c.systems.feasts]; out.push({ kind: "connect", text: V.day.feastToday(f.name, f.custom), why: [W.feast(f.name)] }); }
  if (today.isNameDay) out.push({ kind: "validate", text: V.day.nameDayToday, why: [W.feast(x.sys.nameDay ? c.systems.feasts[x.sys.nameDay.feast].name : "")] });
  if (x.aura?.weather) out.push({ kind: "echo", text: V.day.weatherEcho(c.ui.ritual.weather[x.aura.weather]), why: [W.aura] });
  return out;
}

/** Bond Story openers: concrete cross-person links, each with its data. Keyed by bond chapter id. */
export function bondOpeners(a: VoiceCtx, b: VoiceCtx): Record<string, VoiceLine> {
  const c = a.c; const V = c.systems.voice, W = V.w, S = (s: Sign) => c.astro.signs[s].name;
  const o: Record<string, VoiceLine> = {};
  const qa = a.p.quiz, qb = b.p.quiz;
  if (qa.care && qb.care) { const ca = c.psych.care[qa.care.topReceive[0]].name, cb = c.psych.care[qb.care.topReceive[0]].name; o.closeness = { kind: "connect", text: V.bond.care(a.name, ca.toLowerCase(), b.name, cb.toLowerCase()), why: [W.care(a.name, ca), W.care(b.name, cb)] }; }
  if (qa.attachment && qb.attachment) o.heart = { kind: "connect", text: V.bond.attach(a.name, c.psych.attachment[qa.attachment.style].name.toLowerCase(), b.name, c.psych.attachment[qb.attachment.style].name.toLowerCase()), why: [W.attach(c.psych.attachment[qa.attachment.style].name, qa.attachment.anxiety, qa.attachment.avoidance), W.attach(c.psych.attachment[qb.attachment.style].name, qb.attachment.anxiety, qb.attachment.avoidance)] };
  else if (a.sys.chiron && SIGN_ELEMENT[a.sys.chiron.sign] === SIGN_ELEMENT[b.p.moon]) o.heart = { kind: "connect", text: V.bond.chiron(a.name, S(a.sys.chiron.sign), b.name, S(b.p.moon)), why: [W.chiron(S(a.sys.chiron.sign), formatDegree(a.sys.chiron.lon)), W.moon(S(b.p.moon), formatDegree(b.p.chart.placements.moon!.lon))] };
  if (a.sys.northNode.sign === b.p.sun) o.growth = { kind: "connect", text: V.bond.nodes(a.name, S(a.sys.northNode.sign), b.name, S(b.p.sun)), why: [W.node(S(a.sys.northNode.sign)), W.sun(S(b.p.sun), formatDegree(b.p.chart.placements.sun!.lon))] };
  else if (b.sys.northNode.sign === a.p.sun) o.growth = { kind: "connect", text: V.bond.nodes(b.name, S(b.sys.northNode.sign), a.name, S(a.p.sun)), why: [W.node(S(b.sys.northNode.sign)), W.sun(S(a.p.sun), formatDegree(a.p.chart.placements.sun!.lon))] };
  return o;
}
