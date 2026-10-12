"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { track } from "@/lib/track";
import { useSearchParams } from "next/navigation";
import { useStore, findPerson, repo, StoredPerson } from "@/lib/store";
import { profileOf } from "@/lib/profile";
import { useContent, useHref } from "@/lib/content-context";
import { comparePair, REL_TYPES, RelType } from "@/engine/compat";
import { PairReportView } from "../PairReport";
import { BookView } from "../story/BookView";
import { AuraPair } from "../aura/AuraPair";
import { PairExtras, BondVoice } from "../systems/PairExtras";
import { buildBondStory } from "@/story/bond";
import { BirthForm } from "../BirthForm";
import { PageHero } from "../ui";
import { SignArt } from "../art/SignArt";
import { SheetSelect } from "../controls";
import { SIGN_GLYPH } from "@/engine/zodiac";

export function MatchPage() {
  const s = useStore(); const { c } = useContent(); const h = useHref(); const U = c.ui.match;
  const params = useSearchParams();
  const [aId, setA] = useState(params.get("a") ?? "me");
  const [bId, setB] = useState(params.get("b") ?? "");
  const [rel, setRel] = useState<RelType | null>(null);
  const [adding, setAdding] = useState<"a" | "b" | null>(null);
  const all: StoredPerson[] = s ? [...(s.me ? [s.me] : []), ...s.people] : [];
  const A = findPerson(s, aId), B = findPerson(s, bId || s?.people[0]?.id);
  const relType: RelType = rel ?? B?.relType ?? "romantic";
  const report = useMemo(() => (A && B && A.id !== B.id ? { r: comparePair(profileOf(A), profileOf(B), relType), pa: profileOf(A), pb: profileOf(B) } : null), [A, B, relType]);
  const rk = report ? `${A!.id}|${B!.id}|${relType}` : "";
  useEffect(() => { if (rk) track("compat_report", { rel: rk.split("|")[2] }); }, [rk]);
  if (!s) return <p className="text-dim">{c.site.common.loading}</p>;

  const picker = (val: string, set: (v: string) => void, who: "a" | "b") => (
    <SheetSelect testId={`pick-${who}`} title={who === "a" ? U.personA : U.personB} value={val} placeholder="…" onChange={(v) => (v === "__new" ? setAdding(who) : set(v))}
      options={[...all.map((p) => ({ value: p.id, label: p.id === "me" ? `${p.name}${U.me}` : p.name, icon: SIGN_GLYPH[profileOf(p).sun] })), { value: "__new", label: U.addNew, icon: "＋" }]} />
  );
  return (
    <div>
      <PageHero eyebrow={U.eyebrow} img="twinjet" emblem="bond" title={<>{U.titleA}<span className="italic text-aurora">{U.titleB}</span></>}
        sub={U.sub}
        art={report ? <div className="flex items-center"><SignArt sign={report.pa.sun} className="h-28 w-28" /><span className="-mx-4 text-3xl text-rose">♡</span><SignArt sign={report.pb.sun} className="h-28 w-28" /></div> : undefined} />
      <div className="card mb-6 space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div><label className="label">{U.personA}</label>{picker(A?.id ?? "", setA, "a")}</div>
          <div><label className="label">{U.personB}</label>{picker(B?.id ?? "", setB, "b")}</div>
        </div>
        <div className="flex flex-wrap gap-2">{REL_TYPES.map((r) => <button key={r} className={relType === r ? "btn-primary" : "btn-ghost"} onClick={() => setRel(r)}>{c.compat.relTypes[r].name}</button>)}</div>
        {!s.me && <p className="text-sm text-dim">{U.tip}<Link className="text-gold underline" href={h("/start/")}>{U.addYourself}</Link>{U.tipEnd}</p>}
      </div>
      {adding && (
        <div className="card mb-6">
          <h2 className="mb-3 font-semibold">{U.addSomeone}</h2>
          <BirthForm askRelType submitLabel={U.addCompare} onSubmit={(p) => { repo.savePerson(p); if (adding === "a") setA(p.id); else setB(p.id); setRel(p.relType ?? null); setAdding(null); }} />
          <button className="btn-ghost mt-3" onClick={() => setAdding(null)}>{c.site.common.cancel}</button>
        </div>
      )}
      {A && B && A.id === B.id && <p className="text-dim">{U.pickTwo}</p>}
      {report && A && B && <>
        <a href="#bond-story" className="btn-primary mb-4 w-full">📖 {c.deep.bondUi.eyebrow}: {c.deep.bondUi.title(A.name, B.name)} ↓</a>
        <AuraPair a={A} b={B} harmony={report.r.resonance} />
        <PairReportView report={report.r} A={report.pa} B={report.pb} na={A.name} nb={B.name} />
        <PairExtras A={A} B={B} />
        <BondVoice A={A} B={B}><div id="bond-story" className="mt-12 scroll-mt-20"><BookView book={buildBondStory(report.pa, report.pb, A.name, B.name, report.r, c)} name={`${A.name} & ${B.name}`} forId={B.id} eyebrow={c.deep.bondUi.eyebrow} title={c.deep.bondUi.title(A.name, B.name)} subtitle={c.compat.relTypes[report.r.rel].name} intro="" /></div></BondVoice>
      </>}
      {(!A || !B) && !adding && <div className="card text-center text-dim">{U.addMore(!!all.length)}<button className="text-gold underline" onClick={() => setAdding(all.length ? "b" : "a")}>{U.addNow}</button></div>}
      {report && <div className="mt-6 flex flex-wrap justify-center gap-2"><Link className="btn-ghost" href={h(`/bond/?a=${A!.id}&b=${B!.id}`)}>{U.bondCheck}</Link><Link className="btn-ghost" href={h(`/quiz/big-five/?for=${B!.id}`)}>{U.letTake(B!.name)}</Link></div>}
    </div>
  );
}
