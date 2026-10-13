/** Cards + detail blocks for the extra "systems" lenses, built from a Profile and its computed Systems. Pure. */
import type { Content } from "@/content";
import type { Profile } from "@/engine/profile";
import type { Systems, SystemKey } from "@/engine/systems";
import { thisSolarReturn, todayBiorhythm } from "@/engine/systems";
import { formatDegree, Sign } from "@/engine/zodiac";
import { RUNE_GLYPH } from "@/engine/systems/calendars";
import { TRIGRAM_GLYPH } from "@/engine/systems/iching";
import type { Block } from "./types";
import type { SysEvidence } from "@/content/en/systems/meta";

export type SysCardKey = Exclude<SystemKey, "chinese" | "vedic">;
export interface SysCard {
  key: SysCardKey; glyph: string; name: string; value: string; line: string; evidence: SysEvidence;
  provenance: string; blocks: Block[];
  /** Extra visuals the sheet renders specially. */
  bio?: { physical: number; emotional: number; intellectual: number; critical: string[] };
  hexLines?: number[]; movingLine?: number;
  degree?: { image: string | null; heavy: boolean };
  premium?: boolean;
}
export interface SysCtx { placeName?: string | null; firstName?: string; today?: Date; locale?: string }

const hexChar = (n: number) => String.fromCodePoint(0x4dc0 + n - 1);

export function buildSystemCards(p: Profile, sys: Systems, c: Content, ctx: SysCtx = {}): Record<SysCardKey, SysCard | null> {
  const T = c.systems, U = T.ui, M = T.meta, S = (s: Sign) => c.astro.signs[s].name;
  const timed = p.chart.time.timeKnown;
  const fromTime = timed && ctx.placeName ? U.fromBirthTimeIn(ctx.placeName) : U.fromBirthDate;
  const prov = (what: string) => U.provenance(what);
  const noTime = timed ? [] : [{ t: "callout" as const, tone: "note" as const, text: U.noTimeNote }];
  const pos = (x: { sign: Sign; lon: number; house: number | null; retrograde?: boolean }) => [formatDegree(x.lon), S(x.sign), x.house ? U.house(x.house) : "", x.retrograde ? U.retro : ""].filter(Boolean).join(" · ");
  const today = ctx.today ?? new Date();

  const chiron: SysCard | null = sys.chiron ? (() => {
    const t = T.chiron[sys.chiron.sign];
    return { key: "chiron", glyph: "⚷", name: M.chiron.name, value: S(sys.chiron.sign), line: T.chironTheme[sys.chiron.sign], evidence: M.chiron.evidence, provenance: prov(fromTime),
      blocks: [{ t: "lead", text: pos(sys.chiron) }, { t: "facets", items: [{ label: U.wound, text: t.wound }, { label: U.gift, text: t.gift }] }, { t: "callout", tone: "agree", title: U.practice, text: t.practice }, ...noTime] };
  })() : null;

  const nn = T.nodes[sys.northNode.sign];
  const nodes: SysCard = { key: "nodes", glyph: "☊", name: M.nodes.name, value: `${S(sys.northNode.sign)} ☊ · ${S(sys.southNode.sign)} ☋`, line: nn.north, evidence: M.nodes.evidence, provenance: prov(fromTime),
    blocks: [{ t: "lead", text: `☊ ${pos(sys.northNode)}  ·  ☋ ${pos(sys.southNode)}` }, { t: "facets", items: [{ label: U.north, text: nn.north }, { label: U.south, text: nn.south }] }, { t: "callout", tone: "agree", title: U.step, text: nn.step }, ...noTime] };

  const li = T.lilith[sys.lilith.sign];
  const lilith: SysCard = { key: "lilith", glyph: "⚸", name: M.lilith.name, value: S(sys.lilith.sign), line: li.text, evidence: M.lilith.evidence, provenance: prov(fromTime),
    blocks: [{ t: "lead", text: pos(sys.lilith) }, { t: "p", text: li.text }, { t: "callout", tone: "agree", title: U.reclaim, text: li.reclaim }, ...noTime] };

  const sd = sys.sunDegree;
  const sundegree: SysCard = { key: "sundegree", glyph: "°", name: M.sundegree.name, value: U.degreeLabel(sd.degree, S(p.sun)), line: sd.image && !sd.heavy ? sd.image : U.degreeAsk, evidence: M.sundegree.evidence, provenance: prov(fromTime),
    degree: { image: sd.image, heavy: sd.heavy }, blocks: [{ t: "p", text: U.degreeAsk }] };

  let solarreturn: SysCard | null = null;
  try {
    const sr = thisSolarReturn(p, today);
    const themeSign = sr.asc ?? sr.moon;
    const when = sr.utc.toLocaleDateString(ctx.locale === "mk" ? "mk-MK" : ctx.locale === "de" ? "de-DE" : "en-GB", { day: "numeric", month: "long", year: "numeric" });
    solarreturn = { key: "solarreturn", glyph: "☉", name: M.solarreturn.name, value: String(sr.year), line: T.solarYear[themeSign], evidence: M.solarreturn.evidence, provenance: prov(sr.place ? U.fromBirthTimeIn(sr.place) : U.fromBirthDate), premium: true,
      blocks: [{ t: "lead", text: U.srWhen(when) }, { t: "p", text: T.solarYear[themeSign] }, { t: "facets", items: [...(sr.asc ? [{ label: U.srAsc(S(sr.asc)), text: T.solarYear[sr.asc] }] : []), { label: U.srMoon(S(sr.moon)), text: T.solarYear[sr.moon] }] }, ...(sr.place ? [{ t: "callout" as const, tone: "note" as const, text: U.srUses(sr.place) }] : noTime)] };
  } catch { solarreturn = null; }

  const b = todayBiorhythm(p, today); const B = T.biorhythm;
  const cyc = ["physical", "emotional", "intellectual"] as const;
  const bioText = (k: (typeof cyc)[number]) => (b.critical.includes(k) ? B[k].critical : b[k] >= 0 ? B[k].high : B[k].low);
  const biorhythm: SysCard = { key: "biorhythm", glyph: "∿", name: M.biorhythm.name, value: cyc.map((k) => `${B[k].name[0]} ${b[k] > 0 ? "+" : ""}${b[k]}`).join(" "), line: bioText(cyc.reduce((x, y) => (Math.abs(b[y]) > Math.abs(b[x]) ? y : x))), evidence: M.biorhythm.evidence, provenance: prov(U.fromBirthDate),
    bio: { physical: b.physical, emotional: b.emotional, intellectual: b.intellectual, critical: b.critical }, blocks: cyc.map((k) => ({ t: "p" as const, text: `${B[k].name}: ${bioText(k)}` })) };

  const nd = sys.nameDay;
  const ndDate = nd ? new Date(nd.year, nd.date.m - 1, nd.date.d).toLocaleDateString(ctx.locale === "mk" ? "mk-MK" : ctx.locale === "de" ? "de-DE" : "en-GB", { day: "numeric", month: "long" }) : "";
  const nameday: SysCard = nd
    ? { key: "nameday", glyph: "🕯", name: M.nameday.name, value: ndDate, line: `${T.feasts[nd.feast].name} · ${U.nameDayIn(nd.daysUntil)}`, evidence: M.nameday.evidence, provenance: prov(U.fromName(ctx.firstName ?? p.input.name ?? "")),
        blocks: [{ t: "lead", text: U.nameDayOn(ndDate) }, { t: "p", text: `${T.feasts[nd.feast].name}. ${T.feasts[nd.feast].custom}` }, { t: "callout", tone: "agree", text: U.nameDayIn(nd.daysUntil) }] }
    : { key: "nameday", glyph: "🕯", name: M.nameday.name, value: "?", line: U.nameDayNone, evidence: M.nameday.evidence, provenance: prov(U.fromName(ctx.firstName ?? "")), blocks: [{ t: "p", text: U.nameDayNone }] };

  const sm = T.slavicMonths[sys.slavic];
  const feast = sys.birthFeast ? T.feasts[sys.birthFeast.feast] : null;
  const slavic: SysCard = { key: "slavic", glyph: "🌾", name: M.slavic.name, value: sm.name, line: U.meaning(sm.meaning), evidence: M.slavic.evidence, provenance: prov(U.fromBirthDate),
    blocks: [{ t: "lead", text: `${sm.name}: ${sm.meaning}` }, { t: "p", text: sm.text }, ...(feast && sys.birthFeast ? [{ t: "callout" as const, tone: "agree" as const, title: U.folkFeast(feast.name, sys.birthFeast.offset), text: feast.custom }] : [])] };

  const ns = sys.ninestar;
  const ninestar: SysCard = { key: "ninestar", glyph: "✷", name: M.ninestar.name, value: `${ns.year} · ${ns.month}`, line: T.nineStars[ns.year].text, evidence: M.ninestar.evidence, provenance: prov(U.fromBirthDate),
    blocks: [{ t: "facets", items: [{ label: `${U.yearStar}: ${T.nineStars[ns.year].name}`, text: T.nineStars[ns.year].text }, { label: `${U.monthStar}: ${T.nineStars[ns.month].name}`, text: T.nineStars[ns.month].text }] }] };

  const ic = sys.iching; const hx = T.hexagrams[ic.number], hc = T.hexagrams[ic.changed];
  const iching: SysCard = { key: "iching", glyph: hexChar(ic.number), name: M.iching.name, value: `${ic.number} · ${hx.name}`, line: hx.text, evidence: M.iching.evidence, provenance: prov(ic.approximate ? U.fromBirthDate : fromTime),
    hexLines: ic.lines, movingLine: ic.movingLine,
    blocks: [{ t: "lead", text: `${TRIGRAM_GLYPH[ic.upper]} ${TRIGRAM_GLYPH[ic.lower]}  ${U.upperLower(T.trigrams[ic.upper].name, T.trigrams[ic.lower].name)}` }, { t: "p", text: hx.text }, { t: "callout", tone: "note", title: U.moving(ic.movingLine), text: `${U.becomes(ic.changed, hc.name)}. ${hc.text}` }, ...(ic.approximate ? [{ t: "callout" as const, tone: "note" as const, text: U.noTimeNote }] : [])] };

  const my = sys.mayan; const ds = T.daySigns[my.sign], tn = T.tones[my.tone];
  const mayan: SysCard = { key: "mayan", glyph: "◈", name: M.mayan.name, value: `${my.tone} ${ds.name}`, line: `${ds.meaning}. ${tn.word}.`, evidence: M.mayan.evidence, provenance: prov(U.fromBirthDate),
    blocks: [{ t: "lead", text: `${U.kin(my.kin)} · ${my.longCount}` }, { t: "facets", items: [{ label: `${U.sign}: ${ds.name} (${ds.meaning})`, text: `${ds.text} ${U.kiche(ds.kiche)}.` }, { label: `${U.number}: ${my.tone}, ${tn.word}`, text: tn.text }] }, { t: "callout", tone: "note", text: U.tedlockNote }] };

  const tr = T.trees[sys.celtic];
  const celtic: SysCard = { key: "celtic", glyph: "🌳", name: M.celtic.name, value: tr.name, line: tr.gift, evidence: M.celtic.evidence, provenance: prov(U.fromBirthDate), blocks: [{ t: "p", text: tr.text }, { t: "callout", tone: "agree", title: U.gift, text: tr.gift }] };

  const rn = T.runes[sys.rune];
  const norse: SysCard = { key: "norse", glyph: RUNE_GLYPH[sys.rune], name: M.norse.name, value: rn.name, line: U.meaning(rn.meaning), evidence: M.norse.evidence, provenance: prov(U.fromBirthDate), blocks: [{ t: "lead", text: `${RUNE_GLYPH[sys.rune]} ${rn.name}: ${rn.meaning}` }, { t: "p", text: rn.text }] };

  const eg = T.egypt[sys.egyptian];
  const egyptian: SysCard = { key: "egyptian", glyph: "☥", name: M.egyptian.name, value: eg.name, line: eg.text, evidence: M.egyptian.evidence, provenance: prov(U.fromBirthDate), blocks: [{ t: "p", text: eg.text }] };

  const kb = sys.kabbalah; const sp = T.sephirot[kb.sephirah]; const card = c.nums.tarot[kb.card];
  const kabbalah: SysCard = { key: "kabbalah", glyph: "⟡", name: M.kabbalah.name, value: sp.name, line: `${sp.meaning}. ${sp.text}`, evidence: M.kabbalah.evidence, provenance: prov(U.fromNumbers),
    blocks: [{ t: "facets", items: [{ label: `${U.sphere}: ${sp.name} (${sp.meaning})`, text: sp.text }, { label: card.name, text: U.path(kb.path, kb.letter, card.name, T.sephirot[kb.from].name, T.sephirot[kb.to].name) }] }, ...(kb.fromMaster ? [{ t: "callout" as const, tone: "note" as const, text: U.fromMaster(kb.fromMaster) }] : [])] };

  const lt = sys.lots;
  const arabic: SysCard = lt
    ? { key: "arabic", glyph: "⊗", name: M.arabic.name, value: S(lt.fortune.sign), line: T.fortune[lt.fortune.sign], evidence: M.arabic.evidence, provenance: prov(fromTime),
        blocks: [{ t: "lead", text: lt.day ? U.dayBirth : U.nightBirth }, { t: "facets", items: [{ label: `${U.fortune}: ${pos(lt.fortune)}`, text: T.fortune[lt.fortune.sign] }, { label: `${U.spirit}: ${pos(lt.spirit)}`, text: T.spirit[lt.spirit.sign] }] }] }
    : { key: "arabic", glyph: "⊗", name: M.arabic.name, value: U.lotsNeedTimeValue, line: U.lotsNeedTime, evidence: M.arabic.evidence, provenance: prov(U.fromBirthDate), blocks: [{ t: "callout", tone: "note", text: U.lotsNeedTime }] };

  const nx = sys.numExtra; const N = c.nums.numbers;
  const numextra: SysCard = { key: "numextra", glyph: "#", name: M.numextra.name, value: `${nx.personalMonth} · ${nx.personalDay}`, line: `${U.personalMonth} ${nx.personalMonth}: ${N[nx.personalMonth].essence}`, evidence: M.numextra.evidence, provenance: prov(U.fromBirthNameDate),
    blocks: [{ t: "facets", items: [
      { label: `${U.personalMonth}: ${nx.personalMonth}, ${N[nx.personalMonth].name}`, text: N[nx.personalMonth].essence },
      { label: `${U.personalDay}: ${nx.personalDay}, ${N[nx.personalDay].name}`, text: N[nx.personalDay].essence },
      nx.maturity != null ? { label: `${U.maturity}: ${nx.maturity}, ${N[nx.maturity].name}`, text: N[nx.maturity].essence } : { label: U.maturity, text: U.maturityNoName },
    ] }, ...(nx.karmicDebt ? [{ t: "callout" as const, tone: "note" as const, title: U.karmicDebt(nx.karmicDebt), text: U.karmicDebtText[nx.karmicDebt] }] : [])] };

  return { arabic, numextra, chiron, nodes, lilith, sundegree, solarreturn, biorhythm, nameday, slavic, ninestar, iching, mayan, celtic, norse, egyptian, kabbalah };
}
