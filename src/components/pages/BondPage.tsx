"use client";
import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useStore, findPerson, StoredPerson } from "@/lib/store";
import { useContent, useHref } from "@/lib/content-context";
import { BOND_DIMS, CARE_STYLES, scoreBond, BondAnswers, BondResult, CareStyle } from "@/engine/bondcheck";
import { Bar, EvidenceBadge, ScoreRing } from "../ui";

type Step = { who: "a" | "b"; i: number } | { handover: true } | { result: BondResult } | null;

export function BondPage() {
  const s = useStore(); const { c } = useContent(); const h = useHref(); const params = useSearchParams();
  const [aId, setA] = useState(params.get("a") ?? "me");
  const [bId, setB] = useState(params.get("b") ?? "");
  const [step, setStep] = useState<Step>(null);
  const [ans, setAns] = useState<{ a: BondAnswers; b: BondAnswers }>({ a: { dims: {}, receive: null, give: null }, b: { dims: {}, receive: null, give: null } });
  if (!s) return <p className="text-dim">{c.site.common.loading}</p>;
  const all: StoredPerson[] = [...(s.me ? [s.me] : []), ...s.people];
  const A = findPerson(s, aId), B = findPerson(s, bId || s.people[0]?.id);
  const Q = c.quizzes; const P = c.psych;
  const total = BOND_DIMS.length + 2;

  if (!A || !B) return (
    <div className="card text-center">
      <h1 className="h-display mb-2 text-3xl text-gold">Bond Check</h1>
      <p className="mb-4 text-dim">Add yourself and the other person first (birth date is enough).</p>
      <div className="flex justify-center gap-2"><Link className="btn-primary" href={h(s.me ? "/people/" : "/start/")}>{s.me ? "Add a person" : c.site.common.start}</Link></div>
    </div>
  );

  if (!step) return (
    <div>
      <div className="mb-1 flex items-center justify-between"><h1 className="h-display text-4xl text-gold">Bond Check</h1><EvidenceBadge e="research" /></div>
      <p className="mb-4 text-dim">A 3-minute check-in you each answer about <i>this</i> relationship. Its eight areas — appreciation, trust, commitment, repair, fun, feeling understood, safety and growth — are the kind of relationship-specific feelings that research found predict relationship quality far better than any sign or type (Joel et al., 2020). The stars are fixed; this one is yours to move.</p>
      <div className="card space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div><label className="label">First person</label><select className="input" value={A.id} onChange={(e) => setA(e.target.value)}>{all.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
          <div><label className="label">Second person</label><select className="input" value={B.id} onChange={(e) => setB(e.target.value)}>{all.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
        </div>
        <p className="text-sm text-dim">Pass the phone: {A.name} answers first, then {B.name} — privately, without peeking. Answers are not saved.</p>
        <button className="btn-primary w-full py-3" disabled={A.id === B.id} onClick={() => setStep({ who: "a", i: 0 })}>Begin with {A.name}</button>
      </div>
    </div>
  );

  if ("handover" in step) return (
    <div className="card py-12 text-center">
      <div className="mb-3 text-5xl">🤝</div>
      <p className="h-display mb-2 text-3xl text-gold">Thank you, {A.name}</p>
      <p className="mb-6 text-dim">Now hand the phone to {B.name}.</p>
      <button className="btn-primary" onClick={() => setStep({ who: "b", i: 0 })}>I'm {B.name} — start</button>
    </div>
  );

  if ("result" in step) {
    const r = step.result;
    return (
      <div className="space-y-4">
        <div className="card text-center"><p className="text-xs uppercase tracking-widest text-dim">{A.name} & {B.name}</p><div className="my-3 flex justify-center"><ScoreRing value={Math.round(45 + 0.55 * r.index)} label="Living Bond" sub={`${r.index}/100 raw`} /></div>
          <p className="text-sm text-dim">This index is separate from Resonance: it's about how you treat each other now — and it can change.</p></div>
        <div className="card">
          {r.dims.map((d) => <div key={d.dim} className="mb-2"><p className="text-sm font-semibold">{Q.bondDims[d.dim].name}</p><div className="grid grid-cols-2 gap-3"><Bar value={(d.a - 1) * 25} label={A.name} right={`${d.a}/5`} /><Bar value={(d.b - 1) * 25} label={B.name} right={`${d.b}/5`} color="bg-rose" /></div></div>)}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="card"><h3 className="h-display mb-2 text-2xl text-sage">Your strengths</h3>{r.strengths.map((d) => <p key={d} className="mb-2 text-sm"><b>{Q.bondDims[d].name}:</b> {Q.bondDims[d].strength}</p>)}</div>
          <div className="card"><h3 className="h-display mb-2 text-2xl text-rose">Tend next</h3>{r.growth.map((d) => <p key={d} className="mb-2 text-sm"><b>{Q.bondDims[d].name}:</b> {Q.bondDims[d].growth} <span className="text-gold">✦ {Q.bondDims[d].practice}</span></p>)}</div>
        </div>
        {r.perceptionGaps.length > 0 && <div className="card"><h3 className="mb-1 font-semibold">Perception gaps</h3><p className="text-sm">You see {r.perceptionGaps.map((d) => Q.bondDims[d].name.toLowerCase()).join(", ")} quite differently. That's not a problem — it's the best conversation starter you have. Ask: "What makes you feel that way?" and just listen.</p></div>}
        <div className="card text-sm">
          <h3 className="mb-1 font-semibold">Care translation</h3>
          <p>{A.name} most wants <b>{ans.a.receive ? P.care[ans.a.receive].name : "—"}</b> and gives <b>{ans.a.give ? P.care[ans.a.give].name : "—"}</b>. {B.name} most wants <b>{ans.b.receive ? P.care[ans.b.receive].name : "—"}</b> and gives <b>{ans.b.give ? P.care[ans.b.give].name : "—"}</b>.</p>
          <p className="mt-1">{r.care.aGivesWhatBNeeds && r.care.bGivesWhatANeeds ? "You already speak each other's care language. Beautiful." : `Try this week: ${!r.care.aGivesWhatBNeeds && ans.b.receive ? `${A.name} → ${P.care[ans.b.receive].tip} ` : ""}${!r.care.bGivesWhatANeeds && ans.a.receive ? `${B.name} → ${P.care[ans.a.receive].tip}` : ""}`}</p>
        </div>
        <p className="text-center text-xs text-dim">Repeat monthly to see how your bond moves. If you ever feel unsafe in a relationship, please reach out to a local support line.</p>
        <div className="text-center"><button className="btn-ghost" onClick={() => { setStep(null); setAns({ a: { dims: {}, receive: null, give: null }, b: { dims: {}, receive: null, give: null } }); }}>Start again</button></div>
      </div>
    );
  }

  const who = step.who, me = who === "a" ? A : B, other = who === "a" ? B : A;
  const setAnswer = (patch: Partial<BondAnswers> | { dim: string; v: number }) => {
    const cur = ans[who];
    const next = "dim" in patch ? { ...cur, dims: { ...cur.dims, [patch.dim]: patch.v } } : { ...cur, ...patch };
    const all2 = { ...ans, [who]: next };
    setAns(all2);
    if (step.i + 1 < total) setStep({ who, i: step.i + 1 });
    else if (who === "a") setStep({ handover: true });
    else setStep({ result: scoreBond(all2.a, all2.b) });
  };
  const i = step.i;
  return (
    <div className="card min-h-[420px]">
      <div className="mb-4 flex gap-1">{Array.from({ length: total }, (_, k) => <span key={k} className={`h-1.5 flex-1 rounded-full ${k < i ? "bg-gold" : k === i ? "bg-rose" : "bg-white/10"}`} />)}</div>
      <p className="mb-1 text-xs text-dim">{me.name} · {i + 1}/{total}</p>
      {i < BOND_DIMS.length ? (
        <>
          <h2 className="h-display mb-6 text-2xl">{Q.bond[BOND_DIMS[i]].replace("{name}", other.name)}</h2>
          <div className="grid gap-2">{Q.scale5.map((l, k) => <button key={k} className="rounded-xl border border-white/10 px-4 py-3 text-left hover:bg-white/10" onClick={() => setAnswer({ dim: BOND_DIMS[i], v: k + 1 })}>{l}</button>)}</div>
        </>
      ) : (
        <>
          <h2 className="h-display mb-6 text-2xl">{i === BOND_DIMS.length ? `What makes you feel most cared for by ${other.name}?` : `How do you most naturally show ${other.name} you care?`}</h2>
          <div className="grid gap-2">{CARE_STYLES.map((k) => <button key={k} className="rounded-xl border border-white/10 px-4 py-3 text-left hover:bg-white/10" onClick={() => setAnswer(i === BOND_DIMS.length ? { receive: k as CareStyle } : { give: k as CareStyle })}><b>{P.care[k].name}</b> <span className="text-sm text-dim">— {P.care[k].text}</span></button>)}</div>
        </>
      )}
    </div>
  );
}
