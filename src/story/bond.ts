/** "Your Bond Story" — long-form pair reading assembled from pre-written content + the PairReport. */
import type { Content } from "@/content";
import type { Profile } from "@/engine/profile";
import type { PairReport, SynAspect } from "@/engine/compat";
import { SIGN_ELEMENT, Element, Sign } from "@/engine/zodiac";
import { animalRelation } from "@/engine/chinese";
import { numberHarmony } from "@/engine/numerology";
import { MAJOR_ARCANA, relationshipCard } from "@/engine/tarot";
import { TRAITS } from "@/engine/bigfive";
import type { PairKey } from "@/content/en/deep/bond";
import type { QuizId } from "@/lib/quiz-defs";
import { Block, Book, Chapter, countWords } from "./types";

const pk = (a: Element, b: Element) => [a, b].sort().join("-") as PairKey;

export function buildBondStory(A: Profile, B: Profile, na: string, nb: string, r: PairReport, c: Content): Book {
  const D = c.deep, U = D.bondUi, S = (s: Sign) => c.astro.signs[s].name;
  const el = (p: Profile, k: "sun" | "moon" | "mercury" | "venus" | "mars") => SIGN_ELEMENT[p.chart.placements[k]!.sign];
  const sg = (p: Profile, k: "sun" | "moon" | "mercury" | "venus" | "mars") => S(p.chart.placements[k]!.sign);
  const qa = A.quiz, qb = B.quiz;
  const chapters: Chapter[] = [];
  const ch = (id: string, art: Chapter["art"], blocks: Block[], missing: QuizId[] = []) => chapters.push({ id, title: U.chapters[id].title, kicker: U.chapters[id].kicker, art, blocks, missing, locked: false });
  const missingOf = (ids: QuizId[]) => ids.filter((id) => { const k = id === "big-five" ? "bigFive" : (id as "attachment"); return !qa[k] || !qb[k]; });
  const wl = r.lenses.find((l) => l.id === "western");
  const aspects = (wl?.detail as { supportive: SynAspect[]; growth: SynAspect[] } | undefined);
  const aspLine = (x: SynAspect) => `${c.book.aspectPair(na, c.astro.points[x.a].name, c.astro.aspects[x.type].tone, nb, c.astro.points[x.b].name)}: ${c.astro.aspects[x.type].pair}.`;

  const fk = r.rel === "romantic" ? "love" : r.rel === "friend" ? "friends" : r.rel === "family" ? "family" : "work";
  const facet = (p: Profile) => D.signDeep[p.sun].sun[fk];
  // 1. First impressions
  ch("meet", { kind: "sign", sign: A.sun }, [
    { t: "lead", text: D.relIntro[r.rel](na, nb) },
    { t: "p", text: U.sunsLine(na, sg(A, "sun"), nb, sg(B, "sun")) + " " + D.meetPair[pk(el(A, "sun"), el(B, "sun"))] },
    ...(A.rising && B.rising ? [{ t: "p" as const, text: `${c.book.risingIn(S(A.rising))} / ${c.book.risingIn(S(B.rising))}: ${D.meetPair[pk(SIGN_ELEMENT[A.rising], SIGN_ELEMENT[B.rising])]}` }] : []),
    { t: "facets", items: [{ label: na, text: facet(A) }, { label: nb, text: facet(B) }] },
    { t: "callout", tone: "agree", title: c.compat.archetypes[r.archetype].name, text: `${U.scores(r.resonance, r.spark)} ${c.compat.archetypes[r.archetype].text}` },
    ...(aspects && aspects.supportive.length ? [{ t: "list" as const, kind: "strengths" as const, title: U.aspectsTitle, items: aspects.supportive.map(aspLine) }] : []),
  ]);

  // 2. Talk
  {
    const b: Block[] = [{ t: "lead", text: `${U.mercLine(na, sg(A, "mercury"), nb, sg(B, "mercury"))} ${D.talkPair[pk(el(A, "mercury"), el(B, "mercury"))]}` }];
    b.push({ t: "facets", items: [{ label: `${na} · ${c.book.mercuryIn(sg(A, "mercury"))}`, text: D.signDeep[A.chart.placements.mercury!.sign].mercury }, { label: `${nb} · ${c.book.mercuryIn(sg(B, "mercury"))}`, text: D.signDeep[B.chart.placements.mercury!.sign].mercury }] });
    if (qa.bigFive && qb.bigFive) {
      b.push({ t: "h", text: U.traitsTitle });
      for (const t of TRAITS) b.push({ t: "p", text: `${c.psych.traits[t].name} (${qa.bigFive[t]} / ${qb.bigFive[t]}): ${Math.abs(qa.bigFive[t] - qb.bigFive[t]) < 25 ? D.traitPair[t].same : D.traitPair[t].diff}` });
    }
    if (A.psych && B.psych) b.push({ t: "p", text: `${A.psych.fourLetter.code} × ${B.psych.fourLetter.code}: ${c.psych.fourLetterStyles[A.psych.fourLetter.code].name}${c.book.and}${c.psych.fourLetterStyles[B.psych.fourLetter.code].name}.` });
    ch("talk", { kind: "emblem", id: "fourletter" }, b, missingOf(["big-five"]));
  }

  // 3. Hearts
  {
    const b: Block[] = [{ t: "lead", text: `${U.moonsLine(na, sg(A, "moon"), nb, sg(B, "moon"))} ${D.heartPair[pk(el(A, "moon"), el(B, "moon"))]}` }];
    b.push({ t: "facets", items: [{ label: na, text: `${D.signDeep[A.moon].moon.needs} ${D.signDeep[A.moon].moon.heals}` }, { label: nb, text: `${D.signDeep[B.moon].moon.needs} ${D.signDeep[B.moon].moon.heals}` }] });
    if (qa.attachment && qb.attachment) {
      const key = [qa.attachment.style, qb.attachment.style].sort().join("-");
      b.push({ t: "h", text: U.attachTitle(na, c.psych.attachment[qa.attachment.style].name.toLowerCase(), nb, c.psych.attachment[qb.attachment.style].name.toLowerCase()) });
      b.push({ t: "p", text: D.attachPair[key].text });
      b.push({ t: "facets", items: [{ label: na, text: `${D.attachDeep[qa.attachment.style].love} ${D.attachBoost[qa.attachment.style]}` }, { label: nb, text: `${D.attachDeep[qb.attachment.style].love} ${D.attachBoost[qb.attachment.style]}` }] });
    }
    ch("heart", { kind: "emblem", id: "moon" }, b, missingOf(["attachment"]));
  }

  // 4. Closeness & chemistry
  {
    const b: Block[] = [];
    if (r.rel === "romantic") {
      b.push({ t: "lead", text: `${U.venusMars(na, sg(A, "venus"), nb, sg(B, "mars"))} ${D.desirePair[pk(el(A, "venus"), el(B, "mars"))]}` });
      b.push({ t: "p", text: `${U.venusMars(nb, sg(B, "venus"), na, sg(A, "mars"))} ${D.desirePair[pk(el(B, "venus"), el(A, "mars"))]}` });
    } else b.push({ t: "lead", text: `${c.book.venusIn(sg(A, "venus"))} / ${c.book.venusIn(sg(B, "venus"))}. ${D.desirePair[pk(el(A, "venus"), el(B, "venus"))].split(".")[0]}.` });
    b.push({ t: "facets", items: [{ label: `${na} · ${c.book.venusIn(sg(A, "venus"))}`, text: D.signDeep[A.chart.placements.venus!.sign].venus }, { label: `${nb} · ${c.book.venusIn(sg(B, "venus"))}`, text: D.signDeep[B.chart.placements.venus!.sign].venus }] });
    if (qa.care && qb.care) {
      const P = c.psych.care;
      b.push({ t: "h", text: U.careTitle });
      b.push({ t: "p", text: U.careLine(na, P[qa.care.topReceive[0]].name.toLowerCase(), P[qa.care.give].name.toLowerCase()) + " " + U.careLine(nb, P[qb.care.topReceive[0]].name.toLowerCase(), P[qb.care.give].name.toLowerCase()) });
      b.push({ t: "list", kind: "practices", title: c.book.practices, items: [`${na} → ${nb}: ${D.careDeep[qb.care.topReceive[0]].ideas[0]}`, `${nb} → ${na}: ${D.careDeep[qa.care.topReceive[0]].ideas[0]}`] });
    }
    const card = MAJOR_ARCANA[relationshipCard(A.tarot.number, B.tarot.number)];
    b.push({ t: "p", text: U.cardLine(c.nums.tarot[card].name, D.tarotDeep[card].pair) });
    ch("closeness", { kind: "emblem", id: "care" }, b, missingOf(["care"]));
  }

  // 5. Conflict
  {
    const b: Block[] = [];
    if (aspects && aspects.growth.length) b.push({ t: "list", kind: "shadows", title: U.aspectsTitle, items: aspects.growth.map(aspLine) });
    b.push({ t: "lead", text: `${c.book.marsIn(sg(A, "mars"))} (${na}) · ${c.book.marsIn(sg(B, "mars"))} (${nb}). ${D.signDeep[A.chart.placements.mars!.sign].mars.split(".").slice(0, 2).join(".")}. ${D.signDeep[B.chart.placements.mars!.sign].mars.split(".").slice(0, 2).join(".")}.` });
    if (qa.nine && qb.nine) {
      b.push({ t: "p", text: `${U.nineLine(na, D.nineDeep[qa.nine.type].desire, nb, D.nineDeep[qb.nine.type].desire)} ${U.nineTip}` });
    }
    if (qa.shadow && qb.shadow) b.push({ t: "p", text: `${na}: ${D.shadowDeep[qa.shadow.mainShadow].name} ↔ ${D.shadowDeep[qa.shadow.mainShadow].virtue}. ${nb}: ${D.shadowDeep[qb.shadow.mainShadow].name} ↔ ${D.shadowDeep[qb.shadow.mainShadow].virtue}. ${D.shadowDeep[qa.shadow.mainShadow].light}` });
    b.push({ t: "facets", items: [{ label: `${na} · ${S(A.sun)}`, text: `${D.signDeep[A.sun].sun.shadows.join(" · ")}. ${D.signDeep[A.sun].sun.growth}` }, { label: `${nb} · ${S(B.sun)}`, text: `${D.signDeep[B.sun].sun.shadows.join(" · ")}. ${D.signDeep[B.sun].sun.growth}` }] });
    if (qa.attachment && qb.attachment) b.push({ t: "list", kind: "practices", title: c.book.practices, items: [`${na}: ${D.attachDeep[qa.attachment.style].practices![0]}`, `${nb}: ${D.attachDeep[qb.attachment.style].practices![0]}`] });
    for (const g of r.growthEdges.slice(0, 2)) b.push({ t: "callout", tone: "differ", title: c.compat.themes[g.theme].name, text: `${c.compat.themes[g.theme].minus} ${c.compat.themes[g.theme].practices[0]}` });
    ch("conflict", { kind: "emblem", id: "shadow" }, b, missingOf(["nine", "shadow"]));
  }

  // 6. Growth
  {
    const b: Block[] = [{ t: "h", text: U.superTitle }];
    for (const s of r.superpowers) b.push({ t: "p", text: `${c.compat.themes[s.theme].name}: ${c.compat.themes[s.theme].plus} ${c.compat.themes[s.theme].practices[1]}` });
    b.push({ t: "h", text: U.edgeTitle });
    for (const g of r.growthEdges) b.push({ t: "p", text: `${c.compat.themes[g.theme].name}: ${c.compat.themes[g.theme].minus} ${c.compat.themes[g.theme].practices[0]}` });
    b.push({ t: "p", text: `${c.book.lifePathTitle(A.numbers.lifePath, D.lifePathDeep[A.numbers.lifePath].title)} × ${c.book.lifePathTitle(B.numbers.lifePath, D.lifePathDeep[B.numbers.lifePath].title)}. ${D.lifePathPair[numberHarmony(A.numbers.lifePath, B.numbers.lifePath).kind]}` });
    if (qa.nine && qb.nine) b.push({ t: "facets", items: [{ label: `${na} · ${c.book.nineCode(qa.nine.type, qa.nine.wing)}`, text: `${D.nineDeep[qa.nine.type].growth} ${D.nineDeep[qa.nine.type].love}` }, { label: `${nb} · ${c.book.nineCode(qb.nine.type, qb.nine.wing)}`, text: `${D.nineDeep[qb.nine.type].growth} ${D.nineDeep[qb.nine.type].love}` }] });
    b.push({ t: "list", kind: "journal", title: c.book.journal, items: [D.signDeep[A.sun].sun.journal[0], D.signDeep[B.sun].sun.journal[0]] });
    ch("growth", { kind: "emblem", id: "bond" }, b, missingOf(["nine"]));
  }

  // 7. Long road
  {
    const rel = animalRelation(A.chinese.animal, B.chinese.animal);
    const b: Block[] = [{ t: "lead", text: D.archetypeLong[r.archetype] }, { t: "p", text: `${c.chinese.animals[A.chinese.animal].name}${c.book.and}${c.chinese.animals[B.chinese.animal].name}: ${D.chinesePair[rel]}` }];
    const lk = r.rel === "colleague" ? "work" : "love";
    b.push({ t: "facets", items: [{ label: `${na} · ${A.numbers.lifePath}`, text: D.lifePathDeep[A.numbers.lifePath][lk]! }, { label: `${nb} · ${B.numbers.lifePath}`, text: D.lifePathDeep[B.numbers.lifePath][lk]! }] });
    const v = r.lenses.find((l) => l.id === "vedic"); if (v && r.rel === "romantic") b.push({ t: "p", text: U.vedicLine((v.detail as { guna: { total: number } }).guna.total) });
    ch("path", { kind: "emblem", id: "chinese" }, b);
  }

  // 8. Flags
  {
    const F = D.flags, items: string[] = [];
    const ea = el(A, "sun"), eb = el(B, "sun"); if (pk(ea, eb) === "fire-water" || pk(el(A, "moon"), el(B, "moon")) === "fire-water") items.push(F.fireWater);
    if (qa.attachment && qb.attachment) { const f = D.attachPair[[qa.attachment.style, qb.attachment.style].sort().join("-")].flag; if (f) items.push(f); }
    if (qa.bigFive && qb.bigFive) { if (qa.bigFive.A < 40 && qb.bigFive.A < 40) items.push(F.bothLowA); if (qa.bigFive.N > 60 && qb.bigFive.N > 60) items.push(F.bothHighN); }
    if (qa.care && qb.care && !qb.care.topReceive.includes(qa.care.give) && !qa.care.topReceive.includes(qb.care.give)) items.push(F.careMismatch(na, nb, c.psych.care[qa.care.give].name.toLowerCase(), c.psych.care[qb.care.give].name.toLowerCase()));
    if (qa.shadow && qb.shadow && qa.shadow.mainShadow === qb.shadow.mainShadow) items.push(F.sameShadow(D.shadowDeep[qa.shadow.mainShadow].name));
    if (animalRelation(A.chinese.animal, B.chinese.animal) === "clash") items.push(F.clash);
    ch("flags", { kind: "emblem", id: "eye" }, items.length ? [{ t: "list", kind: "shadows", title: U.chapters.flags.title, items }] : [{ t: "p", text: F.none }], missingOf(["attachment", "care", "shadow"]));
  }

  // 9. Rituals
  ch("rituals", { kind: "emblem", id: "tarot" }, [
    { t: "list", kind: "practices", title: c.book.practices, items: D.rituals[r.rel] },
    { t: "p", text: D.elementRitual[el(A, "sun")] }, ...(el(B, "sun") !== el(A, "sun") ? [{ t: "p" as const, text: D.elementRitual[el(B, "sun")] }] : []),
    { t: "p", text: c.book.closing },
  ]);

  const words = chapters.reduce((s, x) => s + countWords(x.blocks), 0);
  return { chapters, words, minutes: Math.max(1, Math.round(words / 220)), lenses: r.lenses.length };
}
