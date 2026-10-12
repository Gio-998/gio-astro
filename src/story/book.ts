/**
 * "The Book of You" — deterministic long-form reading assembled from pre-written content.
 * No network, no AI: every sentence comes from src/content/<locale>/deep + book.ts.
 */
import type { Content } from "@/content";
import type { Profile } from "@/engine/profile";
import { SIGNS, SIGN_ELEMENT, SIGN_MODALITY, signFromLongitude, Element, Sign } from "@/engine/zodiac";
import { band, TRAITS } from "@/engine/bigfive";
import { ANIMALS, animalRelation, yearAnimal, lunarNewYearDate, WUXING, WuXing } from "@/engine/chinese";
import { numberHarmony } from "@/engine/numerology";
import { MAJOR_ARCANA } from "@/engine/tarot";
import { longitude } from "@/engine/astro";
import { transitsFor, moonPhase } from "@/engine/daily";
import type { QuizId } from "@/lib/quiz-defs";
import { Block, Book, Chapter, countWords } from "./types";

export const lvl = (p: number): "low" | "mid" | "high" => { const b = band(p); return b === "very-low" || b === "low" ? "low" : b === "mid" ? "mid" : "high"; };
const TEMP_EL: Record<string, Element> = { sanguine: "air", choleric: "fire", melancholic: "earth", phlegmatic: "water" };
const DOSHA_EL: Record<string, Element> = { vata: "air", pitta: "fire", kapha: "earth" };
const WX_EL: Record<WuXing, Element> = { wood: "air", fire: "fire", earth: "earth", metal: "air", water: "water" };
const signIdx = (s: Sign) => SIGNS.indexOf(s);

/** Turn a "deep" entry into blocks (shared with per-lens pages). */
export function entryBlocks(c: Content, e: { story?: string[]; quote?: string; love?: string; friends?: string; work?: string; family?: string; daily?: string[]; strengths?: string[]; shadows?: string[]; growth?: string; practices?: string[]; journal?: string[]; myth?: string }, opts: { lead?: boolean; facets?: boolean; lists?: boolean } = {}): Block[] {
  const B = c.book; const out: Block[] = [];
  (e.story ?? []).forEach((s, i) => out.push({ t: i === 0 && opts.lead ? "lead" : "p", text: s }));
  if (e.quote) out.push({ t: "quote", text: e.quote });
  if (opts.facets !== false) {
    const f = ([["love", B.love], ["friends", B.friends], ["work", B.work], ["family", B.family]] as const).filter(([k]) => e[k]).map(([k, label]) => ({ label, text: e[k]! }));
    if (f.length) out.push({ t: "facets", items: f });
  }
  if (opts.lists !== false) {
    if (e.daily?.length) out.push({ t: "list", kind: "daily", title: B.daily, items: e.daily });
    if (e.strengths?.length) out.push({ t: "list", kind: "strengths", title: B.strengths, items: e.strengths });
    if (e.shadows?.length) out.push({ t: "list", kind: "shadows", title: B.shadows, items: e.shadows });
    if (e.growth) out.push({ t: "callout", tone: "note", title: B.growth, text: e.growth });
    if (e.practices?.length) out.push({ t: "list", kind: "practices", title: B.practices, items: e.practices });
    if (e.journal?.length) out.push({ t: "list", kind: "journal", title: B.journal, items: e.journal });
  }
  if (e.myth) out.push({ t: "callout", tone: "note", title: B.myth, text: e.myth });
  return out;
}

export function buildBook(p: Profile, c: Content, name: string, now = new Date()): Book {
  const B = c.book, D = c.deep, A = c.astro, q = p.quiz;
  const S = (s: Sign) => A.signs[s].name;
  const chapters: Chapter[] = [];
  const allPractices: string[] = [];
  const allJournal: string[] = [];
  const ch = (id: string, art: Chapter["art"], blocks: Block[], missing: QuizId[] = [], locked = false) =>
    chapters.push({ id, title: B.chapters[id].title, kicker: B.chapters[id].kicker, art, blocks, missing, locked });
  const sunD = D.signDeep[p.sun], moonD = D.signDeep[p.moon];
  const pl = p.chart.placements;

  // ——— 1. Essence ———
  {
    const b: Block[] = [];
    b.push({ t: "h", text: `${B.sunIn(S(p.sun))} · ${sunD.title}` });
    b.push(...entryBlocks(c, { story: sunD.sun.story, quote: sunD.quote }, { lead: true, facets: false, lists: false }));
    b.push({ t: "list", kind: "daily", title: B.daily, items: sunD.sun.daily });
    b.push({ t: "h", text: `${B.moonIn(S(p.moon))} · ${moonD.title}` });
    if (p.chart.moonAmbiguous) b.push({ t: "callout", tone: "note", text: B.moonUnknown(p.chart.moonAlternatives.map(S).join(" / ")) });
    b.push({ t: "p", text: moonD.moon.story });
    b.push({ t: "facets", items: [{ label: B.needs, text: moonD.moon.needs }, { label: B.healsLabel, text: moonD.moon.heals }] });
    b.push({ t: "h", text: B.sunMoonBridge });
    b.push({ t: "p", text: D.sunMoon[SIGN_ELEMENT[p.sun]][SIGN_ELEMENT[p.moon]] });
    if (p.rising) { b.push({ t: "h", text: `${B.risingIn(S(p.rising))} · ${D.signDeep[p.rising].title}` }); b.push({ t: "p", text: D.signDeep[p.rising].rising }); }
    else b.push({ t: "callout", tone: "note", text: B.noRising });
    // Convergence across lenses
    const pts: [string, Element][] = [["sun", SIGN_ELEMENT[p.sun]], ["moon", SIGN_ELEMENT[p.moon]], ["dominant", p.dominantElement], ["chinese", WX_EL[p.chinese.element]], ["day", WX_EL[p.chinese.dayMaster.element]]];
    if (p.rising) pts.push(["rising", SIGN_ELEMENT[p.rising]]);
    if (p.psych) pts.push(["temperament", TEMP_EL[p.psych.temperament.primary]]);
    if (q.dosha) pts.push(["dosha", DOSHA_EL[q.dosha.dominant]]);
    const count: Record<string, string[]> = {};
    for (const [k, e] of pts) (count[e] ??= []).push(B.lensNames[k]);
    const top = Object.entries(count).sort((a, b2) => b2[1].length - a[1].length)[0];
    if (top && top[1].length >= 2) b.push({ t: "callout", tone: "agree", title: B.agreeTitle, text: `${B.agree(top[1].length, `${B.elementName[top[0]]}, meaning ${D.elementVoice[top[0] as Element]}`, top[1].join(", "))}` });
    const odd = pts.find(([, e]) => e !== top?.[0]);
    if (odd && top) b.push({ t: "callout", tone: "differ", title: B.differTitle, text: B.differ(B.elementPoint(B.lensNames[odd[0]], B.elementName[odd[1]]), B.elementPoint(top[1][0], B.elementName[top[0]])) });
    b.push({ t: "deep", title: `${B.sunIn(S(p.sun))}: ${B.openDeep.toLowerCase()}`, blocks: [
      { t: "facets", items: [{ label: B.love, text: sunD.sun.love }, { label: B.friends, text: sunD.sun.friends }, { label: B.work, text: sunD.sun.work }, { label: B.family, text: sunD.sun.family }] },
      { t: "list", kind: "strengths", title: B.strengths, items: sunD.sun.strengths },
      { t: "callout", tone: "note", title: B.myth, text: sunD.myth },
    ] });
    if (p.chart.moonAmbiguous) for (const alt of p.chart.moonAlternatives.filter((s) => s !== p.moon)) b.push({ t: "deep", title: B.moonIn(S(alt)), blocks: [{ t: "p", text: D.signDeep[alt].moon.story }] });
    allPractices.push(sunD.sun.practices[0]); allJournal.push(sunD.sun.journal[0]);
    ch("essence", { kind: "sign", sign: p.sun }, b);
  }

  // ——— 2. Love ———
  {
    const b: Block[] = []; const venus = pl.venus!.sign;
    const vD = D.signDeep[venus];
    b.push({ t: "h", text: `${B.venusIn(S(venus))} · ${vD.title}` }); b.push({ t: "lead", text: vD.venus });
    b.push({ t: "p", text: sunD.sun.love });
    b.push({ t: "p", text: `${B.moonIn(S(p.moon))}: ${moonD.moon.needs}` });
    if (q.attachment) {
      const at = D.attachDeep[q.attachment.style];
      b.push({ t: "h", text: at.title });
      b.push({ t: "p", text: at.story[0] });
      b.push({ t: "p", text: at.love! });
      b.push({ t: "callout", tone: "agree", title: B.attachVenusTitle, text: D.attachVenus[q.attachment.style][SIGN_ELEMENT[venus]] });
      b.push({ t: "list", kind: "daily", title: B.daily, items: at.daily! });
      b.push({ t: "deep", title: at.title, blocks: [{ t: "p", text: at.story[1] }, { t: "list", kind: "strengths", title: B.strengths, items: at.strengths! }, { t: "list", kind: "shadows", title: B.shadows, items: at.shadows! }, { t: "list", kind: "practices", title: B.practices, items: at.practices! }] });
      allPractices.push(at.practices![0]); allJournal.push(at.journal![0]);
    }
    if (q.care) {
      const r = q.care, P = c.psych.care;
      b.push({ t: "h", text: B.careTitle });
      b.push({ t: "p", text: B.careLine(P[r.topReceive[0]].name.toLowerCase(), P[r.topReceive[1]].name.toLowerCase(), P[r.give].name.toLowerCase()) });
      const cd = D.careDeep[r.topReceive[0]];
      b.push({ t: "p", text: `${cd.story} ${cd.receive}` });
      if (r.give !== r.topReceive[0]) b.push({ t: "callout", tone: "differ", text: D.careDeep[r.give].mismatch });
      b.push({ t: "list", kind: "practices", title: B.practices, items: cd.ideas });
    }
    if (q.bigFive) b.push({ t: "p", text: `${c.psych.traits.A.name}: ${D.bigFiveDeep.A[lvl(q.bigFive.A)].love} ${c.psych.traits.N.name}: ${D.bigFiveDeep.N[lvl(q.bigFive.N)].love}` });
    b.push({ t: "list", kind: "journal", title: B.journal, items: [vD.sun.journal[1] ?? vD.sun.journal[0]] });
    ch("love", { kind: "emblem", id: "care" }, b, (["attachment", "care", "big-five"] as QuizId[]).filter((id) => !q[id === "big-five" ? "bigFive" : id as "attachment" | "care"]));
  }

  // ——— 3. Mind & work ———
  {
    const b: Block[] = []; const mer = pl.mercury!.sign, mars = pl.mars!.sign;
    b.push({ t: "h", text: B.mercuryIn(S(mer)) }); b.push({ t: "lead", text: D.signDeep[mer].mercury });
    b.push({ t: "h", text: B.marsIn(S(mars)) }); b.push({ t: "p", text: D.signDeep[mars].mars });
    b.push({ t: "p", text: sunD.sun.work });
    if (q.bigFive && p.psych) {
      b.push({ t: "h", text: B.bigFiveTitle });
      for (const t of TRAITS) { const L = lvl(q.bigFive[t]); b.push({ t: "p", text: `${B.traitLine(c.psych.traits[t].name, q.bigFive[t])}. ${D.bigFiveDeep[t][L].story}` }); }
      b.push({ t: "callout", tone: "agree", title: B.workTitle, text: D.workStyle[lvl(q.bigFive.C)][SIGN_MODALITY[p.sun]] });
      const fl = p.psych.fourLetter;
      b.push({ t: "h", text: B.fourLetterTitle(fl.code, c.psych.fourLetterStyles[fl.code].name) });
      b.push({ t: "p", text: `${c.psych.fourLetterStyles[fl.code].text} ${D.fourLetterDeep.what}` });
      b.push({ t: "list", kind: "focus", title: fl.code, items: fl.code.split("").map((l) => D.fourLetterDeep.letters[l]) });
      b.push({ t: "deep", title: B.bigFiveTitle, blocks: TRAITS.flatMap((t) => [{ t: "h" as const, text: c.psych.traits[t].name }, { t: "p" as const, text: D.bigFiveDeep[t].what }, { t: "facets" as const, items: [{ label: B.work, text: D.bigFiveDeep[t][lvl(q.bigFive![t])].work }, { label: B.growth, text: D.bigFiveDeep[t][lvl(q.bigFive![t])].growth }] }]) });
    }
    if (q.explorer) {
      const r = q.explorer, E = D.explorerDeep;
      b.push({ t: "h", text: B.explorerTitle });
      b.push({ t: "p", text: `${r.explorer < 40 ? E.low : r.explorer > 60 ? E.high : E.mid}` });
      b.push({ t: "callout", tone: "note", text: E.stress });
      const st = D.stanceDeep[r.stance];
      b.push({ t: "h", text: `${B.stanceTitle}: ${c.psych.stances[r.stance].name}` });
      b.push({ t: "p", text: `${st.story} ${st.work} ${st.growth}` });
    }
    ch("mind", { kind: "emblem", id: "fourletter" }, b, (["big-five", "explorer"] as QuizId[]).filter((id) => !q[id === "big-five" ? "bigFive" : "explorer"]));
  }

  // ——— 4. Shadow & light ———
  {
    const b: Block[] = [];
    if (q.shadow) {
      const sd = D.shadowDeep[q.shadow.mainShadow], ld = D.shadowDeep[q.shadow.strongestLight];
      b.push({ t: "h", text: B.shadowTitle(sd.name, ld.virtue) });
      b.push({ t: "lead", text: `${sd.story} ${sd.light}` });
      b.push({ t: "p", text: ld.light });
      b.push({ t: "list", kind: "practices", title: B.practices, items: [sd.practice] });
      b.push({ t: "list", kind: "journal", title: B.journal, items: [sd.journal, ld.journal] });
      const others = q.shadow.axes.filter((a) => a.axis !== q.shadow!.mainShadow && a.axis !== q.shadow!.strongestLight).sort((x, y) => y.shadow - x.shadow).slice(0, 2);
      b.push({ t: "deep", title: B.openDeep, blocks: others.flatMap((a) => [{ t: "h" as const, text: `${D.shadowDeep[a.axis].name} ↔ ${D.shadowDeep[a.axis].virtue}` }, { t: "p" as const, text: `${D.shadowDeep[a.axis].story} ${D.shadowDeep[a.axis].light}` }]) });
      allPractices.push(sd.practice); allJournal.push(sd.journal);
    }
    b.push({ t: "h", text: B.sunShadows });
    b.push({ t: "list", kind: "shadows", title: `${S(p.sun)}`, items: sunD.sun.shadows });
    b.push({ t: "callout", tone: "note", title: B.growth, text: sunD.sun.growth });
    if (q.bigFive) b.push({ t: "p", text: D.sensitivityMoon[lvl(q.bigFive.N)][SIGN_ELEMENT[p.moon]] });
    if (q.nine) b.push({ t: "p", text: `${D.nineDeep[q.nine.type].story[1]}` });
    if (q.attachment) b.push({ t: "list", kind: "shadows", title: D.attachDeep[q.attachment.style].title, items: D.attachDeep[q.attachment.style].shadows! });
    ch("shadow", { kind: "emblem", id: "shadow" }, b, (["shadow"] as QuizId[]).filter(() => !q.shadow), !q.shadow && !q.nine && !q.bigFive);
  }

  // ——— 5. Body & energy ———
  {
    const b: Block[] = []; const bal = p.chart.elementBalance;
    b.push({ t: "h", text: B.elementsTitle });
    b.push({ t: "lead", text: `${B.elementBalance((Object.keys(bal) as Element[]).map((e) => `${B.elementName[e]} ${bal[e]}`).join(" · "))} ${A.elements[p.dominantElement].text}` });
    const weak = (Object.keys(bal) as Element[]).sort((a, b2) => bal[a] - bal[b2])[0];
    if (bal[weak] <= 1) b.push({ t: "callout", tone: "note", title: B.healMissing, text: D.elementMissing[weak] });
    b.push({ t: "h", text: B.yinYangTitle }); b.push({ t: "p", text: B.yinYang(p.yang) });
    if (q.dosha) {
      const dd = D.doshaDeep[q.dosha.dominant];
      b.push({ t: "h", text: B.doshaTitle(c.psych.constitutions[q.dosha.constitution]) });
      b.push({ t: "p", text: `${dd.story} ${dd.body} ${dd.mind}` });
      b.push({ t: "list", kind: "practices", title: B.practices, items: dd.balance });
      b.push({ t: "p", text: `${dd.foods.charAt(0).toUpperCase()}${dd.foods.slice(1)}. ${dd.season}` });
      allPractices.push(dd.balance[0]);
    }
    if (p.psych) {
      const tp = p.psych.temperament.primary, td = D.temperamentDeep[tp];
      b.push({ t: "h", text: B.temperamentTitle(td.title) });
      b.push({ t: "p", text: `${td.story} ${td.under} ${td.practice}` });
      if (q.dosha) b.push({ t: "callout", tone: "agree", text: D.doshaTemperament[q.dosha.dominant][tp] });
    }
    const an = D.animalDeep2[p.archetypeAnimal];
    b.push({ t: "h", text: B.animalTitle(c.psych.archetypeAnimals[p.archetypeAnimal].name) });
    b.push({ t: "p", text: `${an.story} ${c.psych.archetypeAnimals[p.archetypeAnimal].text} ${an.medicine}` });
    b.push({ t: "h", text: B.paletteTitle });
    b.push({ t: "p", text: `${D.paletteDeep.what} ${D.paletteDeep.element[p.dominantElement]}` });
    b.push({ t: "palette", colors: p.palette, labels: D.paletteDeep.roles });
    ch("body", { kind: "emblem", id: "dosha" }, b, (["dosha", "big-five"] as QuizId[]).filter((id) => !q[id === "big-five" ? "bigFive" : "dosha"]));
  }

  // ——— 6. Inner drives ———
  {
    const b: Block[] = [];
    if (q.nine) {
      const n = q.nine, nd = D.nineDeep[n.type];
      b.push({ t: "h", text: B.nineTitle(n.type, nd.title, n.wing) });
      b.push({ t: "lead", text: nd.story[0] });
      b.push({ t: "quote", text: nd.quote });
      b.push({ t: "p", text: `${B.nineCore(nd.fear, nd.desire)} ${B.nineWing(n.wing, nd.wingNote)} ${B.nineArrows(n.growth, D.nineDeep[n.growth].title, n.stress, D.nineDeep[n.stress].title)}` });
      b.push({ t: "facets", items: [{ label: B.love, text: nd.love! }, { label: B.work, text: nd.work! }] });
      b.push({ t: "list", kind: "strengths", title: B.strengths, items: nd.strengths! });
      allPractices.push(nd.practices![0]); allJournal.push(nd.journal![0]);
    }
    const node = pl.node?.sign;
    if (node) { b.push({ t: "h", text: B.nodeIn(S(node)) }); b.push({ t: "p", text: D.signDeep[node].node }); }
    const lp = D.lifePathDeep[p.numbers.lifePath];
    b.push({ t: "p", text: `${B.lifePathTitle(p.numbers.lifePath, lp.title)}: ${lp.story[0]}` });
    if (p.numbers.name) b.push({ t: "p", text: `${B.soul(p.numbers.name.soulUrge)}: ${c.nums.numbers[p.numbers.name.soulUrge]?.soul ?? ""}` });
    ch("drives", { kind: "emblem", id: "nine" }, b, (["nine"] as QuizId[]).filter(() => !q.nine), false);
  }

  // ——— 7. What heals you ———
  {
    const b: Block[] = [];
    b.push({ t: "h", text: B.healMoon }); b.push({ t: "lead", text: moonD.moon.heals });
    b.push({ t: "p", text: moonD.moon.daily });
    const wx = p.chinese.balance; const weakWx = [...WUXING].sort((a, b2) => wx[a] - wx[b2])[0];
    if (wx[weakWx] === 0) { const w = D.wuxingDeep[weakWx]; b.push({ t: "h", text: B.wuxingMissing(c.chinese.wuxing[weakWx].name) }); b.push({ t: "p", text: `${w.feed}. ${w.ritual}` }); allPractices.push(w.ritual); }
    if (q.attachment) b.push({ t: "p", text: D.attachHeal[q.attachment.style] });
    if (q.care) b.push({ t: "p", text: D.careDeep[q.care.topReceive[0]].receive });
    if (q.dosha) b.push({ t: "p", text: `${D.doshaDeep[q.dosha.dominant].title}: ${D.doshaDeep[q.dosha.dominant].balance.join(" · ")}` });
    b.push({ t: "list", kind: "practices", title: B.practices, items: sunD.sun.practices });
    ch("heals", { kind: "emblem", id: "moon" }, b, (["attachment", "care", "dosha"] as QuizId[]).filter((id) => !q[id as "attachment" | "care" | "dosha"]));
  }

  // ——— 8. Who boosts you ———
  {
    const b: Block[] = [];
    b.push({ t: "lead", text: D.elementBoost[SIGN_ELEMENT[p.sun]] });
    const allies = ANIMALS.filter((a) => ["six-harmony", "trine"].includes(animalRelation(p.chinese.animal, a)));
    const clash = ANIMALS.find((a) => animalRelation(p.chinese.animal, a) === "clash");
    b.push({ t: "p", text: `${B.boostChinese(allies.map((a) => c.chinese.animals[a].name).join(", "))}${clash ? ` ${B.boostChineseClash(c.chinese.animals[clash].name)}` : ""}` });
    const friendly = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => n !== p.numbers.lifePath && ["family", "friendly"].includes(numberHarmony(p.numbers.lifePath, n).kind));
    b.push({ t: "p", text: B.boostNumbers(friendly.join(", ")) });
    if (q.attachment) b.push({ t: "p", text: D.attachBoost[q.attachment.style] });
    if (q.care) b.push({ t: "p", text: B.boostCare(c.psych.care[q.care.topReceive[0]].name.toLowerCase()) });
    if (q.nine) b.push({ t: "p", text: B.boostNine(q.nine.growth, D.nineDeep[q.nine.growth].title) });
    if (q.dosha) b.push({ t: "p", text: D.doshaBoost[q.dosha.dominant] });
    b.push({ t: "callout", tone: "note", text: B.boostCta });
    ch("boosts", { kind: "emblem", id: "bond" }, b, (["attachment", "care", "nine", "dosha"] as QuizId[]).filter((id) => !q[id as "attachment" | "care" | "nine" | "dosha"]));
  }

  // ——— 9. Life path & timing ———
  {
    const b: Block[] = []; const lp = D.lifePathDeep[p.numbers.lifePath];
    b.push({ t: "h", text: B.lifePathTitle(p.numbers.lifePath, lp.title) });
    b.push({ t: "lead", text: lp.story[0] }); b.push({ t: "p", text: lp.story[1] });
    b.push({ t: "quote", text: lp.quote });
    b.push({ t: "callout", tone: "note", text: B.lifePathHow(p.numbers.lifePathSteps) });
    b.push({ t: "facets", items: [{ label: B.love, text: lp.love! }, { label: B.work, text: lp.work! }, { label: B.growth, text: lp.growth! }] });
    allPractices.push(lp.practices![0]); allJournal.push(lp.journal![0]);
    if (p.numbers.name) {
      const nn = p.numbers.name, N = c.nums.numbers;
      b.push({ t: "list", kind: "focus", title: B.nameNumbers, items: [`${B.expression(nn.expression)}: ${N[nn.expression]?.expression ?? ""}`, `${B.soul(nn.soulUrge)}: ${N[nn.soulUrge]?.soul ?? ""}`, `${B.personality(nn.personality)}: ${N[nn.personality]?.essence ?? ""}`] });
    }
    const ad = D.animalDeep[p.chinese.animal];
    b.push({ t: "h", text: `${B.chineseTitle(c.chinese.wuxing[p.chinese.element].name, c.chinese.animals[p.chinese.animal].name)} · ${ad.title}` });
    b.push(...entryBlocks(c, ad, { facets: true, lists: false }));
    b.push({ t: "list", kind: "strengths", title: B.strengths, items: ad.strengths! });
    const wd = D.wuxingDeep[p.chinese.element];
    b.push({ t: "p", text: `${wd.title}. ${wd.story}` });
    b.push({ t: "p", text: B.dayMaster(c.chinese.wuxing[p.chinese.dayMaster.element].name, p.chinese.dayMaster.yinYang) + " " + D.wuxingDeep[p.chinese.dayMaster.element].story });
    b.push({ t: "h", text: B.tarotTitle });
    for (const k of p.tarot.cards) { const card = MAJOR_ARCANA[k === 22 ? 0 : k]; const td = D.tarotDeep[card]; b.push({ t: "p", text: `${c.nums.tarot[card].name}. ${td.story} ${c.nums.tarot[card].birth}` }); }
    const nk = c.vedic.nakshatras[p.vedic.nakshatra];
    b.push({ t: "h", text: B.vedicTitle(nk.name) });
    b.push({ t: "p", text: B.vedicText(nk.symbol, nk.text, S(p.vedic.rashi)) });
    ch("path", { kind: "emblem", id: "number" }, b);
  }

  // ——— 10. Year ahead ———
  {
    const b: Block[] = []; const y = now.getFullYear();
    const pyD = D.personalYearDeep[p.numbers.personalYear];
    b.push({ t: "h", text: B.personalYearTitle(p.numbers.personalYear, y) });
    b.push({ t: "lead", text: `${pyD.title}. ${pyD.text}` });
    b.push({ t: "list", kind: "focus", title: B.focus, items: pyD.focus });
    b.push({ t: "callout", tone: "note", title: B.caution, text: pyD.caution });
    const iso = now.toISOString().slice(0, 10);
    const cy = iso < lunarNewYearDate(y) ? y - 1 : y; const ya = yearAnimal(cy);
    b.push({ t: "h", text: B.chineseYearTitle(c.chinese.animals[ya.animal].name, c.chinese.wuxing[ya.element].name, cy) });
    b.push({ t: "p", text: D.yearRelation[animalRelation(p.chinese.animal, ya.animal)] });
    const house = (pl2: "jupiter" | "saturn") => (signIdx(signFromLongitude(longitude(pl2, now))) - signIdx(p.sun) + 12) % 12;
    b.push({ t: "h", text: B.jupiterTitle }); b.push({ t: "p", text: D.jupiterHouse[house("jupiter")] });
    b.push({ t: "h", text: B.saturnTitle }); b.push({ t: "p", text: D.saturnHouse[house("saturn")] });
    const tr = transitsFor(p, now).filter((t) => t.transiting !== "moon").slice(0, 3);
    if (tr.length) b.push({ t: "list", kind: "focus", title: B.transitsTitle, items: tr.map((t) => `${A.points[t.transiting].name} ${c.daily.transitTone[t.type]} ${A.points[t.natal].name.toLowerCase()}: ${c.daily.transitMood[t.transiting]}. ${c.daily.transitAdvice[t.type]}`) });
    ch("year", { kind: "emblem", id: "sun" }, b);
  }

  // ——— 11. Rituals ———
  {
    const b: Block[] = []; const el = SIGN_ELEMENT[p.sun];
    b.push({ t: "lead", text: D.elementRitual[el] });
    if (SIGN_ELEMENT[p.moon] !== el) b.push({ t: "p", text: D.elementRitual[SIGN_ELEMENT[p.moon]] });
    const mp = moonPhase(now); b.push({ t: "callout", tone: "note", title: B.ritualsMoon(c.daily.moonPhases[mp.phase].name), text: c.daily.moonPhases[mp.phase].text });
    b.push({ t: "p", text: D.wuxingDeep[p.chinese.element].ritual });
    b.push({ t: "list", kind: "practices", title: B.ritualsCollected, items: [...new Set(allPractices)] });
    b.push({ t: "list", kind: "journal", title: B.ritualsJournal, items: [...new Set([...allJournal, ...sunD.sun.journal, ...moonD.sun.journal.slice(0, 1)])].slice(0, 12) });
    b.push({ t: "p", text: B.closing });
    ch("rituals", { kind: "emblem", id: "tarot" }, b);
  }

  // Locked chapters: keep a teaser (first block) only.
  for (const cpt of chapters) if (cpt.locked) cpt.blocks = [...cpt.blocks.slice(0, 2), { t: "lock", quizzes: cpt.missing, text: "" }];
  const words = chapters.reduce((s, x) => s + countWords(x.blocks), 0);
  const lenses = 9 + Object.values(q).filter(Boolean).length + (q.bigFive ? 2 : 0);
  void name;
  return { chapters, words, minutes: Math.max(1, Math.round(words / 220)), lenses };
}
