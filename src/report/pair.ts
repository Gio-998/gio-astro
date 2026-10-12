/**
 * Full relationship report: a rule-based, chaptered document built from a PairReport and both profiles.
 * No AI: every sentence is picked from src/content/report/<locale>.ts by fixed rules.
 */
import { WEIGHTS, type PairReport, type LensResult, type Theme, type LensId } from "@/engine/compat";
import type { Profile } from "@/engine/profile";
import { SIGN_ELEMENT, type Element } from "@/engine/zodiac";
import type { GunaMilan } from "@/engine/vedic";
import type { Content } from "@/content";
import type { ReportText } from "@/content/report/en";

export type Block =
  | { k: "p"; t: string; lead?: boolean }
  | { k: "h"; t: string; icon?: string }
  | { k: "list"; items: string[]; tone?: "plus" | "minus" | "do" | "dont" }
  | { k: "trio"; title: string; rows: { label: string; t: string }[] }
  | { k: "bars"; items: { label: string; value: number; right: string }[] }
  | { k: "score"; resonance: number; spark: number }
  | { k: "lens"; name: string; badge: string; measures: string; result: string[]; todo: string; harmony: number; spark: number; extra?: { label: string; value: number; right: string }[] };
export interface Chapter { id: string; icon: string; title: string; blocks: Block[] }
export interface FullReport { title: string; chapters: Chapter[] }

type Side = { p: Profile; n: string };
const SUPPORT: Record<Element, Element> = { fire: "air", air: "fire", earth: "water", water: "earth" };
const TRAITS = ["O", "C", "E", "A", "N"] as const;

/** Top themes by summed salience, preferring the engine's own picks. */
function topThemes(r: PairReport, sign: 1 | -1, picked: Theme[], n: number): Theme[] {
  const score = new Map<Theme, number>();
  for (const l of r.lenses) for (const t of l.themes) if (t.valence === sign) score.set(t.theme, (score.get(t.theme) ?? 0) + t.salience * WEIGHTS[l.id][r.rel]);
  const rest = [...score.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t);
  return [...new Set([...picked, ...rest])].slice(0, n);
}

function bigFiveOf(p: Profile) { return p.quiz.bigFiveLong ?? p.quiz.bigFive ?? null; }

function personChapter(R: ReportText, C: Content, s: Side, id: string, icon: string, title: string): Chapter {
  const { p, n } = s; const el = p.dominantElement; const moonEl = SIGN_ELEMENT[p.moon]; const E = R.element;
  const blocks: Block[] = [
    { k: "p", lead: true, t: R.person.core(n, C.astro.signs[p.sun].name, C.astro.signs[p.moon].name, E[el].word) },
    { k: "h", icon: "★", t: R.ui.good },
    { k: "p", t: R.person.good(n, E[el].good) },
  ];
  const lp = p.numbers.lifePath; if (R.lifePath[lp]) blocks.push({ k: "p", t: R.person.lifePath(n, lp, R.lifePath[lp]) });
  const b5 = bigFiveOf(p);
  if (b5) {
    const picks = TRAITS.map((t) => ({ t, v: b5[t] })).filter((x) => x.v >= 65 || x.v <= 35).sort((a, b) => Math.abs(b.v - 50) - Math.abs(a.v - 50)).slice(0, 3);
    if (picks.length) blocks.push({ k: "p", t: R.person.bigFive(n, picks.map((x) => (x.v >= 65 ? R.traits[x.t].hi : R.traits[x.t].lo)).join(", ")) });
  }
  blocks.push({ k: "h", icon: "♡", t: R.ui.love }, { k: "p", t: R.person.love(n, E[el].love) });
  const q = p.quiz;
  if (q.attachment) blocks.push({ k: "p", t: R.person.attach(n, R.attach[q.attachment.style].love) });
  if (q.care) blocks.push({ k: "p", t: R.person.care(n, R.care[q.care.give].give, (q.care.topReceive.length ? q.care.topReceive : [q.care.give]).map((c) => R.care[c].recv).join(R.ui.and)) });
  blocks.push({ k: "h", icon: "☾", t: R.ui.need }, { k: "p", t: R.person.need(n, E[moonEl].word, E[moonEl].need) });
  if (q.nine && R.nine[q.nine.type]) blocks.push({ k: "p", t: R.person.nine(n, R.nine[q.nine.type]) });
  if (!b5 && !q.attachment && !q.care) blocks.push({ k: "p", t: R.person.noQuiz(n) });
  return { id, icon, title, blocks };
}

function doList(R: ReportText, to: Side, rel: PairReport["rel"]): { dos: string[]; donts: string[] } {
  const p = to.p; const moonEl = SIGN_ELEMENT[p.moon]; const E = R.element[moonEl];
  const dos = [...E.dos]; const donts = [...E.donts];
  if (p.quiz.care) for (const c of p.quiz.care.topReceive.slice(0, 2)) dos.push(R.care[c].do);
  if (p.quiz.attachment) { dos.push(R.attach[p.quiz.attachment.style].do); donts.push(R.attach[p.quiz.attachment.style].dont); }
  dos.push(R.needs.rel[rel]);
  return { dos, donts };
}

function lensBlock(R: ReportText, C: Content, l: LensResult, a: Side, b: Side): Block {
  const info = R.lens.info[l.id];
  const result = [R.lens.harmony(l.harmony), R.lens.spark(l.spark)];
  let extra: { label: string; value: number; right: string }[] | undefined;
  const d = l.detail as Record<string, unknown>;
  if (l.id === "vedic" && d.guna) {
    const g = d.guna as GunaMilan; result.push(R.lens.guna(g.total));
    const K = C.vedic.kootas as Record<string, { name: string; plain: string }>;
    extra = g.kootas.map((k) => ({ label: `${K[k.id]?.name ?? k.id}: ${K[k.id]?.plain ?? ""}`, value: (100 * k.points) / k.max, right: `${k.points}/${k.max}` }));
  }
  if (l.id === "numerology") result.push(R.lens.numbers(a.n, a.p.numbers.lifePath, b.n, b.p.numbers.lifePath));
  if (l.id === "attachment" && a.p.quiz.attachment && b.p.quiz.attachment) result.push(R.lens.attach(a.n, R.lens.attachName[a.p.quiz.attachment.style], b.n, R.lens.attachName[b.p.quiz.attachment.style]));
  if (l.confidence < 0.8) result.push(R.lens.lowConf);
  return { k: "lens", name: C.compat.lenses[l.id].name, badge: R.lens.evidence[l.evidence], measures: info.measures, result, todo: info.todo, harmony: l.harmony, spark: l.spark, extra };
}

export function buildFullReport(R: ReportText, C: Content, r: PairReport, A: Profile, B: Profile, na: string, nb: string): FullReport {
  const a: Side = { p: A, n: na }, b: Side = { p: B, n: nb }; const rel = R.rel[r.rel]; const T = R.theme; const H = R.chapters;
  const strengths = topThemes(r, 1, r.superpowers.map((x) => x.theme), 3);
  const neg = topThemes(r, -1, r.growthEdges.map((x) => x.theme), 6);
  const watch = [...neg.filter((t) => !strengths.includes(t)), ...neg].filter((t, i, arr) => arr.indexOf(t) === i).slice(0, 3);
  const arch = C.compat.archetypes[r.archetype];

  const summary: Chapter = { id: "summary", icon: H.summary.icon, title: H.summary.title, blocks: [
    { k: "p", lead: true, t: R.summary.lead(na, nb, rel.name, `${arch.icon} ${arch.name}`) },
    { k: "p", t: R.summary.archetype[r.archetype] },
    { k: "score", resonance: r.resonance, spark: r.spark },
    { k: "p", t: `${R.summary.scores(r.resonance, r.spark)} ${R.summary.band[r.band]} ${R.summary.spark(r.spark)}` },
    { k: "h", icon: "★", t: R.summary.strengths },
    { k: "list", tone: "plus", items: strengths.map((t) => `${T[t].name}: ${T[t].plus}`) },
    { k: "h", icon: "⚠", t: R.summary.watch },
    { k: "list", tone: "minus", items: watch.slice(0, 2).map((t) => `${T[t].name}: ${T[t].minus}`) },
  ] };

  const ea = A.dominantElement, eb = B.dominantElement; const E = R.element;
  const fit: Block[] = [{ k: "p", lead: true, t: R.combine.lead(na, nb) }, { k: "h", icon: "⚭", t: R.combine.fit },
    { k: "p", t: ea === eb ? R.combine.same(E[ea].word) : SUPPORT[ea] === eb ? R.combine.support(E[ea].word, E[eb].word) : R.combine.contrast(E[ea].word, E[eb].word) },
    { k: "list", tone: "plus", items: strengths.map((t) => T[t].plus) },
    { k: "h", icon: "⇄", t: R.combine.cover }];
  if (ea === eb) fit.push({ k: "p", t: R.combine.sharedGap(E[ea].gap) });
  else fit.push({ k: "p", t: R.combine.covers(na, E[ea].gives, nb, E[eb].gap) }, { k: "p", t: R.combine.covers(nb, E[eb].gives, na, E[ea].gap) });

  const ab = doList(R, b, r.rel), ba = doList(R, a, r.rel);
  const needs: Chapter = { id: "needs", icon: H.needs.icon, title: H.needs.title, blocks: [
    { k: "p", lead: true, t: R.needs.lead(na, nb, rel.them) },
    { k: "h", icon: "→", t: R.needs.forWho(na, nb) }, { k: "list", tone: "do", items: ab.dos }, { k: "list", tone: "dont", items: ab.donts },
    { k: "h", icon: "←", t: R.needs.forWho(nb, na) }, { k: "list", tone: "do", items: ba.dos }, { k: "list", tone: "dont", items: ba.donts },
  ] };

  const friction: Chapter = { id: "friction", icon: H.friction.icon, title: H.friction.title, blocks: [
    { k: "p", lead: true, t: R.friction.lead },
    ...watch.map((t): Block => ({ k: "trio", title: T[t].name, rows: [{ label: R.friction.situation, t: T[t].situation }, { label: R.friction.why, t: T[t].why }, { label: R.friction.tryIt, t: T[t].tryIt }] })),
  ] };

  const plan: Chapter = { id: "plan", icon: H.plan.icon, title: H.plan.title, blocks: [
    { k: "p", lead: true, t: R.plan.lead(rel.us) },
    { k: "trio", title: `${R.plan.week(1)} · ${R.plan.w1(T[strengths[0] ?? "play"].name)}`, rows: [{ label: "✓", t: T[strengths[0] ?? "play"].practice }] },
    { k: "trio", title: `${R.plan.week(2)} · ${R.plan.w2(T[watch[0] ?? "communication"].name)}`, rows: [{ label: "✓", t: T[watch[0] ?? "communication"].practice }, { label: "✓", t: T[watch[0] ?? "communication"].tryIt }] },
    { k: "trio", title: `${R.plan.week(3)} · ${R.plan.w3}`, rows: [{ label: "✓", t: R.plan.w3text(na, nb, ab.dos[0], ba.dos[0]) }] },
    { k: "trio", title: `${R.plan.week(4)} · ${R.plan.w4}`, rows: [{ label: "✓", t: R.plan.w4text(rel.time) }, ...(watch[1] ? [{ label: "✓", t: T[watch[1]].practice }] : [])] },
    { k: "h", icon: "☀", t: R.plan.daily }, { k: "p", t: R.plan.dailyText },
  ] };

  const sorted = [...r.lenses].sort((x, y) => WEIGHTS[y.id][r.rel] - WEIGHTS[x.id][r.rel]);
  const lenses: Chapter = { id: "lenses", icon: H.lenses.icon, title: H.lenses.title, blocks: [
    { k: "p", lead: true, t: R.lens.lead },
    ...sorted.map((l) => lensBlock(R, C, l, a, b)),
    ...(r.missing.length ? [{ k: "h", icon: "＋", t: R.lens.missingTitle } as Block, { k: "p", t: R.lens.missing(r.missing.map((m: LensId) => C.compat.lenses[m].name).join(", ")) } as Block] : []),
  ] };

  const method: Chapter = { id: "method", icon: H.method.icon, title: H.method.title, blocks: [
    { k: "h", t: R.method.readTitle }, ...R.method.read.map((t): Block => ({ k: "p", t })),
    { k: "h", t: R.method.howTitle }, ...R.method.how.map((t): Block => ({ k: "p", t })),
  ] };

  return { title: R.ui.title(na, nb), chapters: [
    summary,
    personChapter(R, C, a, "a", H.personA.icon, H.personA.title(na)),
    personChapter(R, C, b, "b", H.personB.icon, H.personB.title(nb)),
    { id: "combine", icon: H.combine.icon, title: H.combine.title, blocks: fit },
    needs, friction, plan, lenses, method,
  ] };
}
