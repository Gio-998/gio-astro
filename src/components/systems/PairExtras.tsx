"use client";
/** Extra symbolic pair lenses + Bond Story chapter openers. Shown under the main report; never changes the Resonance score. */
import { useMemo, type ReactNode } from "react";
import type { StoredPerson } from "@/lib/store";
import { profileOf } from "@/lib/profile";
import { computeSystems } from "@/engine/systems";
import { pairExtras } from "@/engine/systems/pair";
import { bondOpeners } from "@/story/voice";
import { useContent } from "@/lib/content-context";
import { firstNameOf } from "./useSystems";
import { SysEvidenceChip } from "./SysEvidenceChip";
import { VoiceOpenersCtx } from "./VoiceLines";
import { MethodLink } from "../nav/Trust";

function useBoth(A: StoredPerson, B: StoredPerson) {
  return useMemo(() => {
    const pa = profileOf(A), pb = profileOf(B);
    const sa = computeSystems(pa, { firstName: firstNameOf(A) }), sb = computeSystems(pb, { firstName: firstNameOf(B) });
    return { pa, pb, sa, sb, x: pairExtras(pa, sa, pb, sb) };
  }, [A, B]);
}

const Meter = ({ label, v, tone }: { label: string; v: number; tone: string }) => (
  <div className="flex items-center gap-2 text-xs"><span className="w-16 text-dim">{label}</span><span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10"><span className={`block h-full rounded-full ${tone}`} style={{ width: `${v}%` }} /></span></div>
);

export function PairExtras({ A, B }: { A: StoredPerson; B: StoredPerson }) {
  const { c } = useContent(); const U = c.systems.ui; const P = U.pair;
  const { x } = useBoth(A, B);
  const nm = (k: "a" | "b") => (k === "a" ? A.name : B.name), other = (k: "a" | "b") => (k === "a" ? B.name : A.name);
  const seen = new Set<string>();
  const contactLines = x.contacts.filter((ct) => { const k = ct.from + ct.point; if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 3)
    .map((ct) => ct.point === "chiron" ? P.chironHeal(nm(ct.from), other(ct.from)) : ct.point === "node" ? P.nodeMeet(nm(ct.from), other(ct.from)) : P.lilithSpark(nm(ct.from), other(ct.from)));
  const Row = ({ icon, title, e, children }: { icon: string; title: string; e: Parameters<typeof SysEvidenceChip>[0]["e"]; children: ReactNode }) => (
    <li className="flex gap-3 py-2.5"><span className="mt-0.5 text-lg" aria-hidden>{icon}</span><div className="min-w-0 flex-1"><p className="flex flex-wrap items-center gap-2 text-sm font-semibold">{title}<SysEvidenceChip e={e} compact /></p><div className="text-sm text-dim">{children}</div></div></li>
  );
  return (
    <section className="card mt-6" data-testid="pair-extras">
      <div className="flex items-start justify-between gap-3"><div><h3 className="h-display text-xl">{U.extraTitle}</h3><p className="text-xs text-dim">{U.extraNote}</p></div><MethodLink anchor="culture" /></div>
      <div className="my-3 space-y-1.5"><Meter label={U.harmony} v={x.harmony} tone="bg-sage" /><Meter label={U.spark} v={x.spark} tone="bg-rose" /></div>
      <ul className="divide-y divide-white/5">
        <Row icon="⚷" title={c.systems.meta.chiron.name} e={c.systems.meta.chiron.evidence}>{contactLines.length ? contactLines.map((l) => <p key={l}>{l}</p>) : P.none}</Row>
        <Row icon="◉" title={c.systems.meta.mayan.name} e={c.systems.meta.mayan.evidence}>{P.tzolkin[x.tzolkin.kind]}</Row>
        <Row icon="九" title={c.systems.meta.ninestar.name} e={c.systems.meta.ninestar.evidence}>{P.ninestar[x.ninestar.relation]}</Row>
        <Row icon="∿" title={c.systems.meta.biorhythm.name} e={c.systems.meta.biorhythm.evidence}>{P.bio(x.bio.physical, x.bio.emotional, x.bio.intellectual)}</Row>
      </ul>
    </section>
  );
}

export function BondVoice({ A, B, children }: { A: StoredPerson; B: StoredPerson; children: ReactNode }) {
  const { c } = useContent();
  const { pa, pb, sa, sb } = useBoth(A, B);
  const openers = useMemo(() => bondOpeners({ c, p: pa, sys: sa, name: A.name, answers: A.answers, aura: A.aura }, { c, p: pb, sys: sb, name: B.name, answers: B.answers, aura: B.aura }), [c, pa, pb, sa, sb, A, B]);
  return <VoiceOpenersCtx.Provider value={openers}>{children}</VoiceOpenersCtx.Provider>;
}
