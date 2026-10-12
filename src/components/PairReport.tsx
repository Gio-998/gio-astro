"use client";
import { useState } from "react";
import type { PairReport as Report, LensResult, SynAspect } from "@/engine/compat";
import { WEIGHTS } from "@/engine/compat";
import { PairPlay } from "./play/PairPlay";
import type { Profile } from "@/engine/profile";
import { useContent } from "@/lib/content-context";
import { Bar, EvidenceBadge, ScoreRing, Palette } from "./ui";
import { ShareButton } from "./ShareButton";
import { MAJOR_ARCANA } from "@/engine/tarot";
import { ANIMAL_GLYPH } from "@/engine/chinese";
import type { GunaMilan } from "@/engine/vedic";
import { Celebration } from "./art/Celebration";
import { SignArt } from "./art/SignArt";
import { Expand } from "./glance/Expand";
import { MethodLink, TrustStrip } from "./nav/Trust";
import { useGlance } from "./glance/text";

function LensDetail({ l, A, B, na, nb }: { l: LensResult; A: Profile; B: Profile; na: string; nb: string }) {
  const { c } = useContent(); const d = l.detail as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  const P = c.psych; const U = c.ui.pair;
  switch (l.id) {
    case "western": {
      const line = (x: SynAspect) => U.aspectLine(na, c.astro.points[x.a].name, c.astro.aspects[x.type].tone, nb, c.astro.points[x.b].name, c.astro.aspects[x.type].symbol, x.orb.toFixed(1));
      return (
        <div className="space-y-2 text-sm">
          {d.supportive.length > 0 && <div><p className="font-semibold text-sage">{U.supportive}</p>{(d.supportive as SynAspect[]).map((x, i) => <p key={i}>• {line(x)}: {c.astro.aspects[x.type].pair}. {U.touches(c.astro.points[x.a].governs, c.astro.points[x.b].governs)}</p>)}</div>}
          {d.growth.length > 0 && <div><p className="font-semibold text-rose">{U.growthLinks}</p>{(d.growth as SynAspect[]).map((x, i) => <p key={i}>• {line(x)}: {c.astro.aspects[x.type].pair}.</p>)}</div>}
          <p className="text-xs text-dim">{U.elements}{(d.elements as { point: string; a: string; b: string; kind: string }[]).map((e) => `${c.astro.points[e.point as "sun"].name} ${c.astro.elements[e.a as "fire"].name}/${c.astro.elements[e.b as "fire"].name} (${U.kinds[e.kind] ?? e.kind})`).join(" · ")}. {d.usedAsc ? U.risingIncl : U.risingAdd}</p>
        </div>
      );
    }
    case "vedic": {
      const g = d.guna as GunaMilan;
      return (
        <div className="text-sm">
          <p className="mb-2">Guna Milan: <b className="text-gold">{g.total} / 36</b> ({A.vedic.nakshatra === B.vedic.nakshatra ? U.sameStar : `${c.vedic.nakshatras[A.vedic.nakshatra].name} × ${c.vedic.nakshatras[B.vedic.nakshatra].name}`})</p>
          {g.kootas.map((k) => <Bar key={k.id} value={(k.points / k.max) * 100} label={`${c.vedic.kootas[k.id].name}: ${c.vedic.kootas[k.id].plain}`} right={`${k.points}/${k.max}`} color="bg-sage" />)}
          {g.cautions.map((x) => <p key={x} className="mt-1 text-xs">◦ {c.vedic.vedicCautions[x]}</p>)}
          {g.cancellations.map((x) => <p key={x} className="mt-1 text-xs text-sage">✓ {c.vedic.vedicCancellations[x]}</p>)}
          <p className="mt-2 text-xs text-dim">{c.vedic.vedicNote}</p>
        </div>
      );
    }
    case "chinese": {
      const rel = c.chinese.animalRelations[d.animalRelation as keyof typeof c.chinese.animalRelations];
      return (
        <div className="text-sm">
          <p className="font-semibold">{ANIMAL_GLYPH[A.chinese.animal]} {c.chinese.animals[A.chinese.animal].name} × {ANIMAL_GLYPH[B.chinese.animal]} {c.chinese.animals[B.chinese.animal].name}: {rel.name}</p>
          <p>{rel.text}</p>
          <p className="mt-1">{d.usedDayMaster ? U.dayMasters : U.yearEls}: {c.chinese.wuxing[d.elementA as "wood"].name} & {c.chinese.wuxing[d.elementB as "wood"].name}. {c.chinese.elementRelations[d.elementRelation.rel as "same"]}</p>
          {(d.fills as { giver: string; element: string }[]).map((f, i) => <p key={i} className="text-xs text-sage">✓ {U.brings(f.giver === "a" ? na : nb, c.chinese.wuxing[f.element as "wood"].name)}</p>)}
        </div>
      );
    }
    case "numerology": return (
      <div className="text-sm">
        <p>{U.lifePaths(A.numbers.lifePath, B.numbers.lifePath)}{c.nums.numberPairKinds[d.lifePath.kind]}</p>
        {d.soul && <p className="mt-1">{U.soulUrges(A.numbers.name?.soulUrge, B.numbers.name?.soulUrge)}{c.nums.numberPairKinds[d.soul.kind]}</p>}
      </div>
    );
    case "tarot": { const card = c.nums.tarot[MAJOR_ARCANA[d.relationshipCard as number]]; return <p className="text-sm">{U.relCard}<b className="text-gold">{card.name}</b>: {card.keyword}. {U.tarotTogether(card.birth)}</p>; }
    case "yinyang": return <p className="text-sm">{U.yinyang(d.a, d.b, d.center, Math.abs(d.a - d.b) > 25)}</p>;
    case "bigfive": return (
      <div className="text-sm">
        <p>{U.brings5(na, topTraits(d.a, P, U), nb, topTraits(d.b, P, U))}</p>
        <p className="mt-1">{U.foundation(d.foundation, d.similarity)}</p>
      </div>
    );
    case "attachment": return (
      <div className="text-sm">
        <p>{na}: {P.attachment[d.a.style as "secure"].name} · {nb}: {P.attachment[d.b.style as "secure"].name}.</p>
        {d.pursueWithdraw ? <p className="mt-1 text-rose">{P.pursueWithdraw}</p> : <p className="mt-1">{na}{U.needs}{P.attachment[d.a.style as "secure"].need}; {nb}{U.needs}{P.attachment[d.b.style as "secure"].need}.</p>}
      </div>
    );
    case "care": return (
      <div className="text-sm">
        <p>{U.careLine(na, P.care[d.a.give as "time"].name.toLowerCase(), d.aToB, nb, P.care[d.b.topReceive[0] as "time"].name.toLowerCase(), P.care[d.b.topReceive[0] as "time"].tip)}</p>
        <p>{U.careLine(nb, P.care[d.b.give as "time"].name.toLowerCase(), d.bToA, na, P.care[d.a.topReceive[0] as "time"].name.toLowerCase(), P.care[d.a.topReceive[0] as "time"].tip)}</p>
      </div>
    );
    case "temperament": return <p className="text-sm">{P.temperaments[d.a as "sanguine"].name}{U.with}{P.temperaments[d.b as "sanguine"].name}. {d.a === d.b ? U.sameTemp : U.diffTemp}</p>;
    case "fourletter": return <p className="text-sm">{d.a} ({P.fourLetterStyles[d.a].name}){U.with}{d.b} ({P.fourLetterStyles[d.b].name}). {d.a[1] === d.b[1] ? U.flSameN : U.flDiffN} {d.a[2] !== d.b[2] ? U.flDiffF : ""}</p>;
    case "nine": return <p className="text-sm">{P.nineStyles[d.a].name} ({d.a}){U.with}{P.nineStyles[d.b].name} ({d.b}). {d.linked ? U.nineLinked : ""} {d.sameTriad ? U.nineSame : U.nineDiff}</p>;
    case "shadow": return (
      <div className="text-sm">
        {(d.dances as string[]).length ? (d.dances as string[]).map((x) => <p key={x}>• {P.shadowDances[x]}</p>) : <p>{U.noDance}</p>}
        <p className="mt-1">{U.lightOf(na, P.shadowAxes[d.lightA as "pride"].virtue)} {U.lightOf(nb, P.shadowAxes[d.lightB as "pride"].virtue)}</p>
      </div>
    );
    case "play": return <PairPlay detail={d} na={na} nb={nb} />;
    case "dosha": return <p className="text-sm">{P.constitutions[d.a as "vata"]}{U.with}{P.constitutions[d.b as "vata"]} {d.kind === "same" ? U.doshaSame : U.doshaDiff}</p>;
  }
  return null;
}
function topTraits(b: Record<string, number>, P: ReturnType<typeof useContent>["c"]["psych"], U: ReturnType<typeof useContent>["c"]["ui"]["pair"]) {
  const order = (["O", "C", "E", "A"] as const).filter((k) => b[k] >= 60).map((k) => P.traits[k].inLove);
  if (b.N <= 40) order.push(U.calm);
  return order.length ? order.slice(0, 2).join(U.and) : U.balancedMix;
}

export function PairReportView({ report, A, B, na, nb }: { report: Report; A: Profile; B: Profile; na: string; nb: string }) {
  const { c } = useContent(); const C = c.compat; const U = c.ui.pair; const G = useGlance();
  const [evOnly, setEvOnly] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const band = C.bands[report.band], arch = C.archetypes[report.archetype];
  const shown = evOnly ? report.lenses.filter((l) => l.evidence === "research") : report.lenses;
  const blended = [A.palette[0], A.palette[1], B.palette[1], B.palette[0], A.palette[4]];
  const spec = {
    eyebrow: `${na} & ${nb} · ${C.relTypes[report.rel].name}`, title: `${arch.icon} ${arch.name}`, subtitle: band.name, big: String(report.resonance),
    lines: U.shareLines(report.resonance, report.spark, report.superpowers.map((s) => C.themes[s.theme].name).join(", "), report.growthEdges.map((s) => C.themes[s.theme].name).join(", ")),
    palette: blended, footer: c.site.brand,
  };
  return (
    <div className="space-y-6">
      <div className="card relative overflow-hidden text-center" data-testid="pair-glance" style={{ background: `radial-gradient(120% 90% at 0% 0%, ${A.palette[0]}55, transparent 60%), radial-gradient(120% 90% at 100% 100%, ${B.palette[0]}55, transparent 60%), linear-gradient(160deg, rgba(255,255,255,.08), rgba(255,255,255,.02))` }}>
        <Celebration key={`${na}-${nb}-${report.rel}`} count={22} />
        <SignArt sign={A.sun} className="pointer-events-none absolute -left-12 -top-10 h-48 w-48 opacity-40" animate={false} />
        <SignArt sign={B.sun} className="pointer-events-none absolute -bottom-12 -right-12 h-48 w-48 opacity-40" animate={false} />
        <p className="eyebrow relative">{na} & {nb} · {C.relTypes[report.rel].name}</p>
        <div className="my-4 flex justify-center gap-8">
          <ScoreRing value={evOnly && report.evidenceOnly ? report.evidenceOnly : report.resonance} label={evOnly ? C.pairCopy.evidenceOnly : C.pairCopy.resonance} sub={band.name} />
          <ScoreRing value={report.spark} label={U.spark} sub={U.energyGrowth} />
        </div>
        <p className="h-display pop text-4xl"><span className="text-aurora">{arch.icon} {arch.name}</span></p>
        <p className="mx-auto max-w-md text-sm">{arch.text}</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-dim"><b>{band.name}:</b> {band.text}</p>
        {report.superpowers[0] && report.growthEdges[0] && <p className="relative mx-auto mt-3 max-w-md text-[15px] font-medium" data-testid="pair-headline">{G.pairHead(C.themes[report.superpowers[0].theme].name, C.themes[report.growthEdges[0].theme].name)}</p>}
        <div className="relative mt-3 flex flex-wrap justify-center gap-1.5 text-xs">
          {report.superpowers.slice(0, 3).map((s) => <span key={s.theme} className="chip !border-sage/50 text-sage">✦ {C.themes[s.theme].name}</span>)}
          {report.growthEdges.slice(0, 2).map((s) => <span key={s.theme} className="chip !border-rose/50 text-rose">↗ {C.themes[s.theme].name}</span>)}
        </div>
        <div className="mx-auto mt-3 max-w-xs"><Palette colors={blended} /></div>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <ShareButton spec={spec} filename={`${na}-${nb}-bond.png`} />
          <button className={evOnly ? "btn-primary" : "btn-ghost"} onClick={() => setEvOnly(!evOnly)}>🔬 {C.pairCopy.evidenceOnly}{report.evidenceOnly != null ? `: ${report.evidenceOnly}` : ""}</button>
        </div>
        {evOnly && <p className="mt-2 text-xs text-dim">{report.evidenceOnly != null ? C.pairCopy.evidenceOnlyText : C.pairCopy.evidenceOnlyMissing}</p>}
      </div>

      <Expand more={G.pairDetails} testId="pair-details">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card">
          <h3 className="h-display mb-3 text-3xl text-sage">✦ {C.pairCopy.superpowers}</h3>
          {report.superpowers.map((s) => (
            <div key={s.theme} className="mb-3">
              <p className="font-semibold">{C.themes[s.theme].name}</p>
              <p className="text-sm">{C.themes[s.theme].plus}</p>
              {s.lenses.length > 1 && <p className="text-xs text-dim">{C.pairCopy.convergence(s.lenses.length, s.lenses.map((l) => C.lenses[l].name).join(", "))}</p>}
            </div>
          ))}
        </div>
        <div className="card">
          <h3 className="h-display mb-3 text-3xl text-rose">✦ {C.pairCopy.growthEdges}</h3>
          {report.growthEdges.map((s) => (
            <div key={s.theme} className="mb-3">
              <p className="font-semibold">{C.themes[s.theme].name}</p>
              <p className="text-sm">{C.themes[s.theme].minus}</p>
              <ul className="mt-1 text-sm text-mist/90">{C.themes[s.theme].practices.map((p) => <li key={p}>✦ {p}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
      </Expand>

      <div>
        <h3 className="h-display mb-2 text-3xl"><span className="text-gold">✦</span>{U.lensByLens}</h3>
        <p className="mb-3 text-xs text-dim">{C.pairCopy.harmony}. {C.pairCopy.spark}. {C.pairCopy.scaleNote}</p>
        <div className="space-y-2">
          {shown.sort((x, y) => WEIGHTS[y.id][report.rel] - WEIGHTS[x.id][report.rel]).map((l) => (
            <div key={l.id} className={`card !p-0 transition ${open === l.id ? "!border-gold/40" : "hover:!border-white/25"}`}>
              <button className="w-full p-4 text-left" onClick={() => setOpen(open === l.id ? null : l.id)} aria-expanded={open === l.id}>
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2"><span className="font-semibold">{C.lenses[l.id].name}</span><span className="flex gap-2"><EvidenceBadge e={l.evidence} />{l.confidence < 1 && <span className="chip">{U.confidence(Math.round(l.confidence * 100))}</span>}</span></div>
                <div className="grid grid-cols-2 gap-4"><Bar value={((l.harmony - 45) / 55) * 100} label={U.harmony} right="" color="bg-sage" /><Bar value={((l.spark - 45) / 55) * 100} label={U.spark} right="" color="bg-rose" /></div>
              </button>
              {open === l.id && <div className="border-t border-white/10 p-4"><p className="mb-2 text-xs text-dim">{C.lenses[l.id].short} · {U.harmony} {l.harmony} · {U.spark} {l.spark}</p><LensDetail l={l} A={A} B={B} na={na} nb={nb} /></div>}
            </div>
          ))}
        </div>
        {report.missing.length > 0 && (
          <div className="card mt-4 border-dashed">
            <p className="font-semibold">🔒 {C.pairCopy.missing}: {report.missing.map((m) => C.lenses[m].name).join(", ")}</p>
            <p className="text-sm text-dim">{C.pairCopy.missingText}</p>
          </div>
        )}
      </div>
      <div className="flex flex-col items-center gap-2"><MethodLink /><TrustStrip center /></div>
      <p className="text-center text-xs text-dim">{C.pairCopy.disclaimer}</p>
    </div>
  );
}
