"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useStore, findPerson, repo, StoredPerson } from "@/lib/store";
import { profileOf } from "@/lib/profile";
import { useContent, useHref } from "@/lib/content-context";
import { comparePair, REL_TYPES, RelType } from "@/engine/compat";
import { PairReportView } from "../PairReport";
import { BirthForm } from "../BirthForm";
import { PageHero } from "../ui";
import { SignArt } from "../art/SignArt";

export function MatchPage() {
  const s = useStore(); const { c } = useContent(); const h = useHref();
  const params = useSearchParams();
  const [aId, setA] = useState(params.get("a") ?? "me");
  const [bId, setB] = useState(params.get("b") ?? "");
  const [rel, setRel] = useState<RelType | null>(null);
  const [adding, setAdding] = useState<"a" | "b" | null>(null);
  const all: StoredPerson[] = s ? [...(s.me ? [s.me] : []), ...s.people] : [];
  const A = findPerson(s, aId), B = findPerson(s, bId || s?.people[0]?.id);
  const relType: RelType = rel ?? B?.relType ?? "romantic";
  const report = useMemo(() => (A && B && A.id !== B.id ? { r: comparePair(profileOf(A), profileOf(B), relType), pa: profileOf(A), pb: profileOf(B) } : null), [A, B, relType]);
  if (!s) return <p className="text-dim">{c.site.common.loading}</p>;

  const picker = (val: string, set: (v: string) => void, who: "a" | "b") => (
    <div className="flex gap-2">
      <select className="input" value={val} onChange={(e) => (e.target.value === "__new" ? setAdding(who) : set(e.target.value))}>
        {!all.length && <option value="">—</option>}
        {all.map((p) => <option key={p.id} value={p.id}>{p.id === "me" ? `${p.name} (me)` : p.name}</option>)}
        <option value="__new">+ Add someone new…</option>
      </select>
    </div>
  );
  return (
    <div>
      <PageHero eyebrow="Compatibility · any bond" img="twinjet" emblem="bond" title={<>How you <span className="italic text-aurora">shine together</span></>}
        sub="Any two people, any kind of bond. Up to 14 lenses — each with Harmony and Spark — blended into one Resonance score."
        art={report ? <div className="flex items-center"><SignArt sign={report.pa.sun} className="h-28 w-28" /><span className="-mx-4 text-3xl text-rose">♡</span><SignArt sign={report.pb.sun} className="h-28 w-28" /></div> : undefined} />
      <div className="card mb-6 space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div><label className="label">Person A</label>{picker(A?.id ?? "", setA, "a")}</div>
          <div><label className="label">Person B</label>{picker(B?.id ?? "", setB, "b")}</div>
        </div>
        <div className="flex flex-wrap gap-2">{REL_TYPES.map((r) => <button key={r} className={relType === r ? "btn-primary" : "btn-ghost"} onClick={() => setRel(r)}>{c.compat.relTypes[r].name}</button>)}</div>
        {!s.me && <p className="text-sm text-dim">Tip: <Link className="text-gold underline" href={h("/start/")}>add yourself</Link> first so you can compare with others.</p>}
      </div>
      {adding && (
        <div className="card mb-6">
          <h2 className="mb-3 font-semibold">Add someone</h2>
          <BirthForm askRelType submitLabel="Add & compare" onSubmit={(p) => { repo.savePerson(p); if (adding === "a") setA(p.id); else setB(p.id); setRel(p.relType ?? null); setAdding(null); }} />
          <button className="btn-ghost mt-3" onClick={() => setAdding(null)}>{c.site.common.cancel}</button>
        </div>
      )}
      {A && B && A.id === B.id && <p className="text-dim">Pick two different people.</p>}
      {report && A && B && <PairReportView report={report.r} A={report.pa} B={report.pb} na={A.name} nb={B.name} />}
      {(!A || !B) && !adding && <div className="card text-center text-dim">Add {all.length ? "one more person" : "two people"} to see a report. <button className="text-gold underline" onClick={() => setAdding(all.length ? "b" : "a")}>Add now</button></div>}
      {report && <div className="mt-6 flex flex-wrap justify-center gap-2"><Link className="btn-ghost" href={h(`/bond/?a=${A!.id}&b=${B!.id}`)}>Take the Bond Check together →</Link><Link className="btn-ghost" href={h(`/quiz/big-five/?for=${B!.id}`)}>Let {B!.name} take quizzes on this device →</Link></div>}
    </div>
  );
}
