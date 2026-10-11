"use client";
import { useState } from "react";
import type { PairReport as Report, LensResult, SynAspect } from "@/engine/compat";
import { WEIGHTS } from "@/engine/compat";
import type { Profile } from "@/engine/profile";
import { useContent } from "@/lib/content-context";
import { Bar, EvidenceBadge, ScoreRing, Palette } from "./ui";
import { ShareButton } from "./ShareButton";
import { MAJOR_ARCANA } from "@/engine/tarot";
import { ANIMAL_GLYPH } from "@/engine/chinese";
import type { GunaMilan } from "@/engine/vedic";
import { Celebration } from "./art/Celebration";
import { SignArt } from "./art/SignArt";

function LensDetail({ l, A, B, na, nb }: { l: LensResult; A: Profile; B: Profile; na: string; nb: string }) {
  const { c } = useContent(); const d = l.detail as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  const P = c.psych;
  switch (l.id) {
    case "western": {
      const line = (x: SynAspect) => `${na}'s ${c.astro.points[x.a].name} ${c.astro.aspects[x.type].tone} ${nb}'s ${c.astro.points[x.b].name} (${c.astro.aspects[x.type].symbol} ${x.orb.toFixed(1)}°)`;
      return (
        <div className="space-y-2 text-sm">
          {d.supportive.length > 0 && <div><p className="font-semibold text-sage">Supportive links</p>{(d.supportive as SynAspect[]).map((x, i) => <p key={i}>• {line(x)} — {c.astro.aspects[x.type].pair}. It touches {c.astro.points[x.a].governs} and {c.astro.points[x.b].governs}.</p>)}</div>}
          {d.growth.length > 0 && <div><p className="font-semibold text-rose">Growth links (spark)</p>{(d.growth as SynAspect[]).map((x, i) => <p key={i}>• {line(x)} — {c.astro.aspects[x.type].pair}.</p>)}</div>}
          <p className="text-xs text-dim">Elements: {(d.elements as { point: string; a: string; b: string; kind: string }[]).map((e) => `${c.astro.points[e.point as "sun"].name} ${c.astro.elements[e.a as "fire"].name}–${c.astro.elements[e.b as "fire"].name} (${e.kind})`).join(" · ")}. {d.usedAsc ? "Rising signs included." : "Add both birth times + places to include rising signs."}</p>
        </div>
      );
    }
    case "vedic": {
      const g = d.guna as GunaMilan;
      return (
        <div className="text-sm">
          <p className="mb-2">Guna Milan: <b className="text-gold">{g.total} / 36</b> ({A.vedic.nakshatra === B.vedic.nakshatra ? "same birth star" : `${c.vedic.nakshatras[A.vedic.nakshatra].name} × ${c.vedic.nakshatras[B.vedic.nakshatra].name}`})</p>
          {g.kootas.map((k) => <Bar key={k.id} value={(k.points / k.max) * 100} label={`${c.vedic.kootas[k.id].name} — ${c.vedic.kootas[k.id].plain}`} right={`${k.points}/${k.max}`} color="bg-sage" />)}
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
          <p className="mt-1">{d.usedDayMaster ? "Day Masters" : "Year elements"}: {c.chinese.wuxing[d.elementA as "wood"].name} & {c.chinese.wuxing[d.elementB as "wood"].name} — {c.chinese.elementRelations[d.elementRelation.rel as "same"]}</p>
          {(d.fills as { giver: string; element: string }[]).map((f, i) => <p key={i} className="text-xs text-sage">✓ {f.giver === "a" ? na : nb} brings {c.chinese.wuxing[f.element as "wood"].name}, which the other's chart lacks.</p>)}
        </div>
      );
    }
    case "numerology": return (
      <div className="text-sm">
        <p>Life Paths {A.numbers.lifePath} & {B.numbers.lifePath}: {c.nums.numberPairKinds[d.lifePath.kind]}</p>
        {d.soul && <p className="mt-1">Soul Urges {A.numbers.name?.soulUrge} & {B.numbers.name?.soulUrge}: {c.nums.numberPairKinds[d.soul.kind]}</p>}
      </div>
    );
    case "tarot": { const card = c.nums.tarot[MAJOR_ARCANA[d.relationshipCard as number]]; return <p className="text-sm">Your relationship card is <b className="text-gold">{card.name}</b> — {card.keyword}. {card.birth.replace(/^You /, "Together you ").replace(/^Your /, "Your shared ")}</p>; }
    case "yinyang": return <p className="text-sm">Balance points {d.a} and {d.b}; together you center at {d.center} (50 = perfectly balanced). {Math.abs(d.a - d.b) > 25 ? "One leads with action, the other with receptivity — a classic complement." : "You share a similar energy level — easy rhythm, so make room for both doing and being."}</p>;
    case "bigfive": return (
      <div className="text-sm">
        <p>What each of you brings: {na} — {topTraits(d.a, P)}; {nb} — {topTraits(d.b, P)}.</p>
        <p className="mt-1">Foundation (warmth, reliability and calm in both of you): {d.foundation}/100. Similarity: {d.similarity}/100. Research says each person's own kindness and emotional steadiness matter far more than matching.</p>
      </div>
    );
    case "attachment": return (
      <div className="text-sm">
        <p>{na}: {P.attachment[d.a.style as "secure"].name} · {nb}: {P.attachment[d.b.style as "secure"].name}.</p>
        {d.pursueWithdraw ? <p className="mt-1 text-rose">{P.pursueWithdraw}</p> : <p className="mt-1">{na} needs {P.attachment[d.a.style as "secure"].need}; {nb} needs {P.attachment[d.b.style as "secure"].need}.</p>}
      </div>
    );
    case "care": return (
      <div className="text-sm">
        <p>{na} gives {P.care[d.a.give as "time"].name.toLowerCase()} — {d.aToB ? `which lands perfectly for ${nb}.` : `${nb} feels most cared for through ${P.care[d.b.topReceive[0] as "time"].name.toLowerCase()}. Try: ${P.care[d.b.topReceive[0] as "time"].tip}`}</p>
        <p>{nb} gives {P.care[d.b.give as "time"].name.toLowerCase()} — {d.bToA ? `which lands perfectly for ${na}.` : `${na} feels most cared for through ${P.care[d.a.topReceive[0] as "time"].name.toLowerCase()}. Try: ${P.care[d.a.topReceive[0] as "time"].tip}`}</p>
      </div>
    );
    case "temperament": return <p className="text-sm">{P.temperaments[d.a as "sanguine"].name} with {P.temperaments[d.b as "sanguine"].name}. {d.a === d.b ? "Same temperament: you understand each other's rhythm — and amplify it." : "Different temperaments balance each other's tempo."}</p>;
    case "fourletter": return <p className="text-sm">{d.a} ({P.fourLetterStyles[d.a].name}) with {d.b} ({P.fourLetterStyles[d.b].name}). {d.a[1] === d.b[1] ? "Shared imaginative/practical letter makes conversation easy." : "One of you lives in ideas, the other in facts — translate between them."} {d.a[2] !== d.b[2] ? "Heart-led meets head-led: a rich growth edge in decisions." : ""}</p>;
    case "nine": return <p className="text-sm">{P.nineStyles[d.a].name} ({d.a}) with {P.nineStyles[d.b].name} ({d.b}). {d.linked ? "Your types are connected by a growth/stress line — you naturally show each other a direction to grow." : ""} {d.sameTriad ? "You share a center (head, heart or gut), so you react in similar ways." : "You come from different centers — one thinks, one feels, one acts first — which broadens you both."}</p>;
    case "shadow": return (
      <div className="text-sm">
        {(d.dances as string[]).length ? (d.dances as string[]).map((x) => <p key={x}>• {P.shadowDances[x]}</p>) : <p>No strong shadow dance detected — your shadows don't hook into each other much.</p>}
        <p className="mt-1">{na}'s light: {P.shadowAxes[d.lightA as "pride"].virtue}. {nb}'s light: {P.shadowAxes[d.lightB as "pride"].virtue}.</p>
      </div>
    );
    case "dosha": return <p className="text-sm">{P.constitutions[d.a as "vata"]} with {P.constitutions[d.b as "vata"]} {d.kind === "same" ? "Like increases like: you amplify each other's energy — balance it consciously." : "Different energies balance each other."}</p>;
  }
  return null;
}
function topTraits(b: Record<string, number>, P: ReturnType<typeof useContent>["c"]["psych"]) {
  const order = (["O", "C", "E", "A"] as const).filter((k) => b[k] >= 60).map((k) => P.traits[k].inLove);
  if (b.N <= 40) order.push("calm under stress");
  return order.length ? order.slice(0, 2).join(" and ") : "a balanced mix of traits";
}

export function PairReportView({ report, A, B, na, nb }: { report: Report; A: Profile; B: Profile; na: string; nb: string }) {
  const { c } = useContent(); const C = c.compat;
  const [evOnly, setEvOnly] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const band = C.bands[report.band], arch = C.archetypes[report.archetype];
  const shown = evOnly ? report.lenses.filter((l) => l.evidence === "research") : report.lenses;
  const blended = [A.palette[0], A.palette[1], B.palette[1], B.palette[0], A.palette[4]];
  const spec = {
    eyebrow: `${na} & ${nb} · ${C.relTypes[report.rel].name}`, title: `${arch.icon} ${arch.name}`, subtitle: band.name, big: String(report.resonance),
    lines: [`Resonance ${report.resonance} · Spark ${report.spark}`, `Superpowers: ${report.superpowers.map((s) => C.themes[s.theme].name).join(", ")}`, `Growing into: ${report.growthEdges.map((s) => C.themes[s.theme].name).join(", ")}`],
    palette: blended, footer: c.site.brand,
  };
  return (
    <div className="space-y-6">
      <div className="card relative overflow-hidden text-center" style={{ background: `radial-gradient(120% 90% at 0% 0%, ${A.palette[0]}55, transparent 60%), radial-gradient(120% 90% at 100% 100%, ${B.palette[0]}55, transparent 60%), linear-gradient(160deg, rgba(255,255,255,.08), rgba(255,255,255,.02))` }}>
        <Celebration key={`${na}-${nb}-${report.rel}`} count={22} />
        <SignArt sign={A.sun} className="pointer-events-none absolute -left-12 -top-10 h-48 w-48 opacity-40" animate={false} />
        <SignArt sign={B.sun} className="pointer-events-none absolute -bottom-12 -right-12 h-48 w-48 opacity-40" animate={false} />
        <p className="eyebrow relative">{na} & {nb} · {C.relTypes[report.rel].name}</p>
        <div className="my-4 flex justify-center gap-8">
          <ScoreRing value={evOnly && report.evidenceOnly ? report.evidenceOnly : report.resonance} label={evOnly ? C.pairCopy.evidenceOnly : C.pairCopy.resonance} sub={band.name} />
          <ScoreRing value={report.spark} label="Spark" sub="energy & growth" />
        </div>
        <p className="h-display pop text-4xl"><span className="text-aurora">{arch.icon} {arch.name}</span></p>
        <p className="mx-auto max-w-md text-sm">{arch.text}</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-dim"><b>{band.name}:</b> {band.text}</p>
        <div className="mx-auto mt-3 max-w-xs"><Palette colors={blended} /></div>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <ShareButton spec={spec} filename={`${na}-${nb}-bond.png`} />
          <button className={evOnly ? "btn-primary" : "btn-ghost"} onClick={() => setEvOnly(!evOnly)}>🔬 {C.pairCopy.evidenceOnly}{report.evidenceOnly != null ? `: ${report.evidenceOnly}` : ""}</button>
        </div>
        {evOnly && <p className="mt-2 text-xs text-dim">{report.evidenceOnly != null ? C.pairCopy.evidenceOnlyText : C.pairCopy.evidenceOnlyMissing}</p>}
      </div>

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

      <div>
        <h3 className="h-display mb-2 text-3xl"><span className="text-gold">✦</span> Lens by lens</h3>
        <p className="mb-3 text-xs text-dim">{C.pairCopy.harmony}. {C.pairCopy.spark}. {C.pairCopy.scaleNote}</p>
        <div className="space-y-2">
          {shown.sort((x, y) => WEIGHTS[y.id][report.rel] - WEIGHTS[x.id][report.rel]).map((l) => (
            <div key={l.id} className={`card !p-0 transition ${open === l.id ? "!border-gold/40" : "hover:!border-white/25"}`}>
              <button className="w-full p-4 text-left" onClick={() => setOpen(open === l.id ? null : l.id)} aria-expanded={open === l.id}>
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2"><span className="font-semibold">{C.lenses[l.id].name}</span><span className="flex gap-2"><EvidenceBadge e={l.evidence} />{l.confidence < 1 && <span className="chip">confidence {Math.round(l.confidence * 100)}%</span>}</span></div>
                <div className="grid grid-cols-2 gap-4"><Bar value={((l.harmony - 45) / 55) * 100} label="Harmony" right={String(l.harmony)} color="bg-sage" /><Bar value={((l.spark - 45) / 55) * 100} label="Spark" right={String(l.spark)} color="bg-rose" /></div>
              </button>
              {open === l.id && <div className="border-t border-white/10 p-4"><p className="mb-2 text-xs text-dim">{C.lenses[l.id].short}</p><LensDetail l={l} A={A} B={B} na={na} nb={nb} /></div>}
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
      <p className="text-center text-xs text-dim">{C.pairCopy.disclaimer}</p>
    </div>
  );
}
