/** Per-lens deep pages: everything we know about one badge, in rich text. */
import type { Content } from "@/content";
import type { Profile } from "@/engine/profile";
import { SIGN_ELEMENT, Sign } from "@/engine/zodiac";
import { TRAITS } from "@/engine/bigfive";
import { CARE } from "@/engine/quizzes";
import { AXES } from "@/engine/shadow";
import { MAJOR_ARCANA } from "@/engine/tarot";
import { WUXING } from "@/engine/chinese";
import type { QuizId } from "@/lib/quiz-defs";
import type { ArtKey, Block } from "./types";
import { entryBlocks, lvl } from "./book";

export const LENS_KEYS = ["sunmoon", "sun", "moon", "rising", "venus", "mars", "mercury", "node", "chinese", "wuxing", "daymaster", "lifepath", "personalyear", "tarot", "vedic", "bigfive", "fourletter", "temperament", "attachment", "nine", "care", "shadow", "dosha", "explorer", "animal", "palette", "yinyang"] as const;
export type LensKey = (typeof LENS_KEYS)[number];
export interface LensPage { key: LensKey; name: string; what: string; title: string; art: ArtKey; blocks: Block[] | null; quiz?: QuizId; chapter: string }

const QUIZ_OF: Partial<Record<LensKey, QuizId>> = { bigfive: "big-five", fourletter: "big-five", temperament: "big-five", attachment: "attachment", nine: "nine", care: "care", shadow: "shadow", dosha: "dosha", explorer: "explorer" };

export function buildLens(key: LensKey, p: Profile, c: Content): LensPage {
  const D = c.deep, B = c.book, A = c.astro, q = p.quiz, info = c.lensInfo[key];
  const S = (s: Sign) => A.signs[s].name;
  const base = { key, name: info.name, what: info.what, chapter: info.chapter, quiz: QUIZ_OF[key] };
  const signPage = (s: Sign, kind: "sun" | "moon" | "rising" | "venus" | "mars" | "mercury" | "node"): LensPage => {
    const d = D.signDeep[s]; const b: Block[] = [];
    const label = { sun: B.sunIn, moon: B.moonIn, rising: B.risingIn, venus: B.venusIn, mars: B.marsIn, mercury: B.mercuryIn, node: B.nodeIn }[kind](S(s));
    if (kind === "sun") {
      b.push(...entryBlocks(c, { story: d.sun.story, quote: d.quote, love: d.sun.love, friends: d.sun.friends, work: d.sun.work, family: d.sun.family, daily: d.sun.daily, strengths: d.sun.strengths, shadows: d.sun.shadows, growth: d.sun.growth, practices: d.sun.practices, journal: d.sun.journal, myth: d.myth }, { lead: true }));
    } else if (kind === "moon") {
      b.push({ t: "lead", text: d.moon.story }, { t: "facets", items: [{ label: B.needs, text: d.moon.needs }, { label: B.healsLabel, text: d.moon.heals }] }, { t: "list", kind: "daily", title: B.daily, items: [d.moon.daily] }, { t: "h", text: B.sunMoonBridge }, { t: "p", text: D.sunMoon[SIGN_ELEMENT[p.sun]][SIGN_ELEMENT[s]] }, { t: "callout", tone: "note", title: B.myth, text: d.myth });
    } else {
      b.push({ t: "lead", text: d[kind] });
      b.push({ t: "p", text: `${A.signs[s].name}: ${A.signs[s].essence}. ${c.astro.elements[SIGN_ELEMENT[s]].text}` });
      if (kind === "venus" && q.attachment) b.push({ t: "callout", tone: "agree", title: B.attachVenusTitle, text: D.attachVenus[q.attachment.style][SIGN_ELEMENT[s]] });
      if (kind === "rising" || kind === "venus") b.push({ t: "list", kind: "strengths", title: B.strengths, items: d.sun.strengths.slice(0, 3) });
      b.push({ t: "callout", tone: "note", title: B.myth, text: d.myth });
    }
    return { ...base, title: label, art: { kind: "sign", sign: s }, blocks: b };
  };
  const pl = p.chart.placements;
  switch (key) {
    case "sunmoon": {
      const b: Block[] = [
        { t: "lead", text: `${B.sunIn(S(p.sun))}: ${A.signs[p.sun].sun}` },
        { t: "p", text: `${B.moonIn(S(p.moon))}: ${A.signs[p.moon].moon}` },
        ...(p.rising ? [{ t: "p" as const, text: `${B.risingIn(S(p.rising))}: ${A.signs[p.rising].rising}` }] : [{ t: "callout" as const, tone: "note" as const, text: B.noRising }]),
        { t: "h", text: B.sunMoonBridge }, { t: "p", text: D.sunMoon[SIGN_ELEMENT[p.sun]][SIGN_ELEMENT[p.moon]] },
      ];
      return { ...base, title: `${S(p.sun)} · ${S(p.moon)}${p.rising ? ` · ${S(p.rising)}` : ""}`, art: { kind: "sign", sign: p.sun }, blocks: b };
    }
    case "sun": return signPage(p.sun, "sun");
    case "moon": return signPage(p.moon, "moon");
    case "rising": return p.rising ? signPage(p.rising, "rising") : { ...base, title: info.name, art: { kind: "emblem", id: "chart" }, blocks: [{ t: "callout", tone: "note", text: B.noRising }] };
    case "venus": return signPage(pl.venus!.sign, "venus");
    case "mars": return signPage(pl.mars!.sign, "mars");
    case "mercury": return signPage(pl.mercury!.sign, "mercury");
    case "node": return signPage(pl.node!.sign, "node");
    case "chinese": {
      const ad = D.animalDeep[p.chinese.animal];
      const b: Block[] = [...entryBlocks(c, { ...ad }, { lead: true }), { t: "p", text: `${D.wuxingDeep[p.chinese.element].title}. ${D.wuxingDeep[p.chinese.element].story}` }, { t: "p", text: c.chinese.animals[p.chinese.animal].essence }];
      return { ...base, title: `${c.chinese.wuxing[p.chinese.element].name} ${c.chinese.animals[p.chinese.animal].name} · ${ad.title}`, art: { kind: "emblem", id: "chinese" }, blocks: b };
    }
    case "wuxing": case "daymaster": {
      const b: Block[] = [];
      const dm = D.wuxingDeep[p.chinese.dayMaster.element];
      b.push({ t: "lead", text: `${B.dayMaster(c.chinese.wuxing[p.chinese.dayMaster.element].name, p.chinese.dayMaster.yinYang)} ${dm.story}` });
      b.push({ t: "facets", items: [{ label: c.book.healsLabel, text: dm.feed }, { label: B.shadows, text: dm.drain }, { label: B.practices, text: dm.ritual }] });
      for (const w of WUXING) b.push({ t: "deep", title: `${D.wuxingDeep[w].title} — ${p.chinese.balance[w]}`, blocks: [{ t: "p", text: D.wuxingDeep[w].story }, { t: "p", text: `${D.wuxingDeep[w].season} · ${D.wuxingDeep[w].organ}. ${D.wuxingDeep[w].ritual}` }] });
      return { ...base, title: c.chinese.wuxing[p.chinese.dayMaster.element].name, art: { kind: "emblem", id: "yinyang" }, blocks: b };
    }
    case "lifepath": {
      const lp = D.lifePathDeep[p.numbers.lifePath];
      return { ...base, title: B.lifePathTitle(p.numbers.lifePath, lp.title), art: { kind: "emblem", id: "number" }, blocks: [{ t: "callout", tone: "note", title: c.lensUi.howCalculated, text: B.lifePathHow(p.numbers.lifePathSteps) }, ...entryBlocks(c, lp, { lead: true })] };
    }
    case "personalyear": {
      const y = D.personalYearDeep[p.numbers.personalYear];
      return { ...base, title: B.personalYearTitle(p.numbers.personalYear, new Date().getFullYear()), art: { kind: "emblem", id: "number" }, blocks: [{ t: "lead", text: `${y.title}. ${y.text}` }, { t: "list", kind: "focus", title: B.focus, items: y.focus }, { t: "callout", tone: "note", title: B.caution, text: y.caution }] };
    }
    case "tarot": {
      const b: Block[] = [];
      for (const k of p.tarot.cards) { const card = MAJOR_ARCANA[k === 22 ? 0 : k]; const t = D.tarotDeep[card]; b.push({ t: "h", text: `${c.nums.tarot[card].name} — ${c.nums.tarot[card].keyword}` }, { t: "lead", text: t.story }, { t: "p", text: c.nums.tarot[card].birth }, { t: "facets", items: [{ label: B.strengths, text: t.gift }, { label: B.shadows, text: t.shadow }, { label: B.practices, text: t.practice }] }); }
      return { ...base, title: p.tarot.cards.map((k) => c.nums.tarot[MAJOR_ARCANA[k === 22 ? 0 : k]].name).join(" · "), art: { kind: "emblem", id: "tarot" }, blocks: b };
    }
    case "vedic": {
      const nk = c.vedic.nakshatras[p.vedic.nakshatra];
      return { ...base, title: `${nk.name} · ${S(p.vedic.rashi)}`, art: { kind: "emblem", id: "vedic" }, blocks: [{ t: "lead", text: B.vedicText(nk.symbol, nk.text, S(p.vedic.rashi)) }, { t: "p", text: c.vedic.vedicNote }] };
    }
    case "animal": {
      const an = D.animalDeep2[p.archetypeAnimal], meta = c.psych.archetypeAnimals[p.archetypeAnimal];
      return { ...base, title: meta.name, art: { kind: "emblem", id: "animal" }, blocks: [{ t: "lead", text: `${an.story} ${meta.text}` }, { t: "facets", items: [{ label: B.strengths, text: an.medicine }, { label: B.shadows, text: an.shadow }] }, { t: "p", text: `${B.elementName[p.dominantElement]} · ${p.yang}/100 yang. ${D.elementVoice[p.dominantElement]}.` }] };
    }
    case "palette": return { ...base, title: info.name, art: { kind: "emblem", id: "palette" }, blocks: [{ t: "palette", colors: p.palette, labels: D.paletteDeep.roles }, { t: "lead", text: D.paletteDeep.what }, { t: "p", text: D.paletteDeep.element[p.dominantElement] }, { t: "p", text: D.elementRitual[p.dominantElement] }] };
    case "yinyang": return { ...base, title: `${p.yang} / 100`, art: { kind: "emblem", id: "yinyang" }, blocks: [{ t: "lead", text: B.yinYang(p.yang) }] };
  }
  // ——— quiz lenses ———
  if (key === "bigfive" || key === "fourletter" || key === "temperament") {
    if (!q.bigFive || !p.psych) return { ...base, title: info.name, art: { kind: "emblem", id: key === "bigfive" ? "big-five" : key }, blocks: null };
    if (key === "bigfive") return { ...base, title: info.name, art: { kind: "emblem", id: "big-five" }, blocks: TRAITS.flatMap((t): Block[] => { const L = D.bigFiveDeep[t][lvl(q.bigFive![t])]; return [{ t: "h", text: B.traitLine(c.psych.traits[t].name, q.bigFive![t]) }, { t: "p", text: D.bigFiveDeep[t].what }, { t: "lead", text: L.story }, { t: "facets", items: [{ label: B.love, text: L.love }, { label: B.work, text: L.work }, { label: B.growth, text: L.growth }] }]; }) };
    if (key === "fourletter") { const fl = p.psych.fourLetter; return { ...base, title: `${fl.code} · ${c.psych.fourLetterStyles[fl.code].name}`, art: { kind: "emblem", id: "fourletter" }, blocks: [{ t: "lead", text: c.psych.fourLetterStyles[fl.code].text }, { t: "list", kind: "focus", title: fl.code, items: fl.code.split("").map((l, i) => `${D.fourLetterDeep.letters[l]} (${Object.values(fl.clarity)[i]}%)`) }, { t: "p", text: D.fourLetterDeep.what }] }; }
    const td = D.temperamentDeep[p.psych.temperament.primary];
    return { ...base, title: td.title, art: { kind: "emblem", id: "temperament" }, blocks: [{ t: "lead", text: td.story }, { t: "facets", items: [{ label: B.love, text: td.love }, { label: B.work, text: td.work }, { label: B.shadows, text: td.under }] }, { t: "list", kind: "practices", title: B.practices, items: [td.practice] }] };
  }
  if (key === "attachment") { if (!q.attachment) return { ...base, title: info.name, art: { kind: "emblem", id: "attachment" }, blocks: null }; const a = D.attachDeep[q.attachment.style]; return { ...base, title: a.title, art: { kind: "emblem", id: "attachment" }, blocks: [...entryBlocks(c, a, { lead: true }), { t: "p", text: D.attachBoost[q.attachment.style] }, { t: "p", text: D.attachHeal[q.attachment.style] }] }; }
  if (key === "nine") { if (!q.nine) return { ...base, title: info.name, art: { kind: "emblem", id: "nine" }, blocks: null }; const n = q.nine, d = D.nineDeep[n.type]; return { ...base, title: `${n.type}w${n.wing} · ${d.title}`, art: { kind: "emblem", id: "nine" }, blocks: [{ t: "callout", tone: "note", text: `${n.type}w${n.wing}: ${B.nineTitle(n.type, d.title, n.wing)}.` }, ...entryBlocks(c, d, { lead: true }), { t: "p", text: `${B.nineCore(d.fear, d.desire)} ${B.nineWing(n.wing, d.wingNote)} ${B.nineArrows(n.growth, D.nineDeep[n.growth].title, n.stress, D.nineDeep[n.stress].title)}` }] }; }
  if (key === "care") { if (!q.care) return { ...base, title: info.name, art: { kind: "emblem", id: "care" }, blocks: null }; const r = q.care; return { ...base, title: `${c.psych.care[r.topReceive[0]].name} · ${c.psych.care[r.topReceive[1]].name}`, art: { kind: "emblem", id: "care" }, blocks: [{ t: "lead", text: B.careLine(c.psych.care[r.topReceive[0]].name.toLowerCase(), c.psych.care[r.topReceive[1]].name.toLowerCase(), c.psych.care[r.give].name.toLowerCase()) }, ...CARE.filter((k) => r.topReceive.includes(k) || k === r.give).flatMap((k): Block[] => { const d = D.careDeep[k]; return [{ t: "h", text: c.psych.care[k].name }, { t: "p", text: `${d.story} ${d.receive} ${d.give}` }, { t: "callout", tone: "differ", text: d.mismatch }, { t: "list", kind: "practices", title: B.practices, items: d.ideas }]; })] }; }
  if (key === "shadow") { if (!q.shadow) return { ...base, title: info.name, art: { kind: "emblem", id: "shadow" }, blocks: null }; const r = q.shadow; return { ...base, title: B.shadowTitle(D.shadowDeep[r.mainShadow].name, D.shadowDeep[r.strongestLight].virtue), art: { kind: "emblem", id: "shadow" }, blocks: [...AXES].sort((a, b2) => (r.axes.find((x) => x.axis === b2)!.shadow - r.axes.find((x) => x.axis === a)!.shadow)).flatMap((ax): Block[] => { const d = D.shadowDeep[ax]; const v = r.axes.find((x) => x.axis === ax)!; return [{ t: "h", text: `${d.name} ↔ ${d.virtue} (${v.shadow} / ${v.light})` }, { t: "p", text: `${d.story} ${d.light}` }, { t: "list", kind: "practices", title: B.practices, items: [d.practice] }, { t: "list", kind: "journal", title: B.journal, items: [d.journal] }]; }) }; }
  if (key === "dosha") { if (!q.dosha) return { ...base, title: info.name, art: { kind: "emblem", id: "dosha" }, blocks: null }; const d = D.doshaDeep[q.dosha.dominant]; return { ...base, title: B.doshaTitle(c.psych.constitutions[q.dosha.constitution]), art: { kind: "emblem", id: "dosha" }, blocks: [{ t: "lead", text: d.story }, { t: "facets", items: [{ label: B.bodyLabel, text: d.body }, { label: B.mindLabel, text: d.mind }, { label: B.love, text: d.love }] }, { t: "list", kind: "practices", title: B.practices, items: d.balance }, { t: "p", text: `${d.foods}. ${d.season}` }, ...(p.psych ? [{ t: "callout" as const, tone: "agree" as const, text: D.doshaTemperament[q.dosha.dominant][p.psych.temperament.primary] }] : [])] }; }
  if (!q.explorer) return { ...base, title: info.name, art: { kind: "emblem", id: "explorer" }, blocks: null };
  const r = q.explorer, E = D.explorerDeep, st = D.stanceDeep[r.stance];
  return { ...base, title: `${r.explorer}/100 · ${c.psych.stances[r.stance].name}`, art: { kind: "emblem", id: "explorer" }, blocks: [{ t: "lead", text: E.what }, { t: "p", text: r.explorer < 40 ? E.low : r.explorer > 60 ? E.high : E.mid }, { t: "callout", tone: "note", text: E.stress }, { t: "h", text: `${B.stanceTitle}: ${c.psych.stances[r.stance].name}` }, { t: "p", text: st.story }, { t: "facets", items: [{ label: B.love, text: st.love }, { label: B.work, text: st.work }, { label: B.growth, text: st.growth }] }] };
}
