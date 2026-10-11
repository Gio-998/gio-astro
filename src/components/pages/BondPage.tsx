"use client";
import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useStore, findPerson, StoredPerson } from "@/lib/store";
import { useContent, useHref } from "@/lib/content-context";
import { BOND_DIMS, CARE_STYLES, scoreBond, BondAnswers, BondResult, CareStyle } from "@/engine/bondcheck";
import { Bar, EvidenceBadge, ScoreRing, PageHero } from "../ui";
import { Emblem } from "../art/Emblem";

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
  const Q = c.quizzes; const P = c.psych; const U = c.ui.bondCheck;
  const total = BOND_DIMS.length + 2;

  if (!A || !B) return (
    <div className="card text-center">
      <Emblem id="bond" className="mx-auto mb-3 h-20 w-20 glow-gold" />
      <h1 className="h-display mb-2 text-4xl"><span className="text-aurora">{U.title}</span></h1>
      <p className="mb-4 text-dim">{U.addFirst}</p>
      <div className="flex justify-center gap-2"><Link className="btn-primary" href={h(s.me ? "/people/" : "/start/")}>{s.me ? U.addPerson : c.site.common.start}</Link></div>
    </div>
  );

  if (!step) return (
    <div>
      <PageHero eyebrow={U.eyebrow} img="twinjet" emblem="bond" title={<>{U.titleA}<span className="italic text-aurora">{U.titleB}</span></>} sub={<EvidenceBadge e="research" />} />
      <p className="mb-4 text-dim">{U.intro}</p>
      <div className="card space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div><label className="label">{U.first}</label><select className="input" value={A.id} onChange={(e) => setA(e.target.value)}>{all.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
          <div><label className="label">{U.second}</label><select className="input" value={B.id} onChange={(e) => setB(e.target.value)}>{all.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
        </div>
        <p className="text-sm text-dim">{U.pass(A.name, B.name)}</p>
        <button className="btn-primary w-full py-3" disabled={A.id === B.id} onClick={() => setStep({ who: "a", i: 0 })}>{U.begin(A.name)}</button>
      </div>
    </div>
  );

  if ("handover" in step) return (
    <div className="card py-12 text-center">
      <div className="mb-3 text-5xl">🤝</div>
      <p className="h-display mb-2 text-3xl text-gold">{U.thanks(A.name)}</p>
      <p className="mb-6 text-dim">{U.handTo(B.name)}</p>
      <button className="btn-primary" onClick={() => setStep({ who: "b", i: 0 })}>{U.imB(B.name)}</button>
    </div>
  );

  if ("result" in step) {
    const r = step.result;
    return (
      <div className="space-y-4">
        <div className="card text-center"><p className="text-xs uppercase tracking-widest text-dim">{A.name} & {B.name}</p><div className="my-3 flex justify-center"><ScoreRing value={Math.round(45 + 0.55 * r.index)} label={U.living} sub={U.raw(r.index)} /></div>
          <p className="text-sm text-dim">{U.separate}</p></div>
        <div className="card">
          {r.dims.map((d) => <div key={d.dim} className="mb-2"><p className="text-sm font-semibold">{Q.bondDims[d.dim].name}</p><div className="grid grid-cols-2 gap-3"><Bar value={(d.a - 1) * 25} label={A.name} right={`${d.a}/5`} /><Bar value={(d.b - 1) * 25} label={B.name} right={`${d.b}/5`} color="bg-rose" /></div></div>)}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="card"><h3 className="h-display mb-2 text-2xl text-sage">{U.strengths}</h3>{r.strengths.map((d) => <p key={d} className="mb-2 text-sm"><b>{Q.bondDims[d].name}:</b> {Q.bondDims[d].strength}</p>)}</div>
          <div className="card"><h3 className="h-display mb-2 text-2xl text-rose">{U.tend}</h3>{r.growth.map((d) => <p key={d} className="mb-2 text-sm"><b>{Q.bondDims[d].name}:</b> {Q.bondDims[d].growth} <span className="text-gold">✦ {Q.bondDims[d].practice}</span></p>)}</div>
        </div>
        {r.perceptionGaps.length > 0 && <div className="card"><h3 className="mb-1 font-semibold">{U.gaps}</h3><p className="text-sm">{U.gapsText(r.perceptionGaps.map((d) => Q.bondDims[d].name.toLowerCase()).join(", "))}</p></div>}
        <div className="card text-sm">
          <h3 className="mb-1 font-semibold">{U.careTitle}</h3>
          <p>{A.name}{U.wants}<b>{ans.a.receive ? P.care[ans.a.receive].name : "—"}</b>{U.gives}<b>{ans.a.give ? P.care[ans.a.give].name : "—"}</b>. {B.name}{U.wants}<b>{ans.b.receive ? P.care[ans.b.receive].name : "—"}</b>{U.gives}<b>{ans.b.give ? P.care[ans.b.give].name : "—"}</b>.</p>
          <p className="mt-1">{r.care.aGivesWhatBNeeds && r.care.bGivesWhatANeeds ? U.sameLang : `${U.tryWeek}${!r.care.aGivesWhatBNeeds && ans.b.receive ? `${A.name} → ${P.care[ans.b.receive].tip} ` : ""}${!r.care.bGivesWhatANeeds && ans.a.receive ? `${B.name} → ${P.care[ans.a.receive].tip}` : ""}`}</p>
        </div>
        <p className="text-center text-xs text-dim">{U.repeat}</p>
        <div className="text-center"><button className="btn-ghost" onClick={() => { setStep(null); setAns({ a: { dims: {}, receive: null, give: null }, b: { dims: {}, receive: null, give: null } }); }}>{U.again}</button></div>
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
          <h2 className="h-display mb-6 text-2xl">{i === BOND_DIMS.length ? U.qReceive(other.name) : U.qGive(other.name)}</h2>
          <div className="grid gap-2">{CARE_STYLES.map((k) => <button key={k} className="rounded-xl border border-white/10 px-4 py-3 text-left hover:bg-white/10" onClick={() => setAnswer(i === BOND_DIMS.length ? { receive: k as CareStyle } : { give: k as CareStyle })}><b>{P.care[k].name}</b> <span className="text-sm text-dim">— {P.care[k].text}</span></button>)}</div>
        </>
      )}
    </div>
  );
}
