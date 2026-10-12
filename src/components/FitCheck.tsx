"use client";
/** "Does this sound like you?": confirm a type result or pick the one that fits better (stored as a self-identified override). */
import Link from "next/link";
import { useState } from "react";
import type { Profile } from "@/engine/profile";
import { useContent, useHref } from "@/lib/content-context";
import { repo } from "@/lib/store";
import { ATTACH_STYLES, FOUR_LETTER_CODES, TEMPERAMENTS, SelfIdKind, selfConfirmPatch, selfIdPatch } from "@/engine/selfid";

type Opt = { v: string | number; label: string; sub?: string };
type Info = { current: string | number; measured: string | number | null; self: boolean; options: Opt[]; name: (v: string | number) => string };

export function useFitInfo(kind: SelfIdKind, profile: Profile): Info | null {
  const { c } = useContent(); const P = c.psych; const q = profile.quiz;
  if (kind === "fourLetter") {
    const f = profile.fourLetter; if (!f) return null;
    const name = (v: string | number) => `${v} · ${P.fourLetterStyles[String(v)]?.name ?? ""}`;
    return { current: f.code, measured: f.measured, self: f.source === "self", name, options: FOUR_LETTER_CODES.map((k) => ({ v: k, label: k, sub: P.fourLetterStyles[k]?.name })) };
  }
  if (kind === "temperament") {
    const t = profile.psych?.temperament; if (!t) return null;
    const name = (v: string | number) => P.temperaments[v as keyof typeof P.temperaments]?.name ?? String(v);
    return { current: t.primary, measured: t.measured, self: t.source === "self", name, options: TEMPERAMENTS.map((k) => ({ v: k, label: name(k) })) };
  }
  if (kind === "nine") {
    const n = q.nine as (typeof q.nine & { source?: string; measured?: number }) | undefined; if (!n) return null;
    const name = (v: string | number) => `${v} · ${P.nineStyles[Number(v)]?.name ?? ""}`;
    return { current: n.type, measured: n.measured ?? n.type, self: n.source === "self", name, options: Array.from({ length: 9 }, (_, i) => ({ v: i + 1, label: String(i + 1), sub: P.nineStyles[i + 1]?.name })) };
  }
  const a = q.attachment as (typeof q.attachment & { source?: string; measured?: string }) | undefined; if (!a) return null;
  const name = (v: string | number) => P.attachment[v as keyof typeof P.attachment]?.name ?? String(v);
  return { current: a.style, measured: a.measured ?? a.style, self: a.source === "self", name, options: ATTACH_STYLES.map((k) => ({ v: k, label: name(k) })) };
}

export function FitCheck({ kind, profile, pid = "me" }: { kind: SelfIdKind; profile: Profile; pid?: string }) {
  const { c } = useContent(); const F = c.types.fit; const R = c.types.result; const h = useHref();
  const info = useFitInfo(kind, profile);
  const [picking, setPicking] = useState(false);
  if (!info) return null;
  const sid = profile.quiz.selfId;
  const confirmed = !info.self && (sid?.confirmed ?? []).includes(kind);
  const save = (patch: ReturnType<typeof selfIdPatch>) => { repo.saveQuiz(pid, { selfId: patch }); setPicking(false); };
  const pick = (v: string | number) => save(v === info.measured ? selfIdPatch(sid, kind, null) : selfIdPatch(sid, kind, v));
  const forQ = pid === "me" ? "" : `?for=${pid}`;
  const fl = kind === "fourLetter" ? profile.fourLetter : null;
  return (
    <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3" data-testid={`fit-${kind}`}>
      {info.self ? (
        <>
          <p className="text-sm" data-testid={`fit-${kind}-chosen`}>✎ {info.measured != null && info.measured !== info.current ? F.chosen(info.name(info.current), info.name(info.measured)) : F.chosenNoQuiz(info.name(info.current))}</p>
          <p className="mt-1 text-xs text-dim">{F.why}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button className="btn-ghost !px-3 !py-1.5 text-xs" onClick={() => save(selfIdPatch(sid, kind, null))}>{F.reset}</button>
            <button className="btn-ghost !px-3 !py-1.5 text-xs" onClick={() => setPicking((x) => !x)}>{F.no}</button>
          </div>
        </>
      ) : confirmed ? (
        <p className="text-sm text-dim">✓ {F.confirmed} <button className="underline" onClick={() => setPicking((x) => !x)}>{F.no}</button></p>
      ) : (
        <>
          <p className="text-sm font-semibold">{F.question}</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button className="btn-primary !py-2 text-sm" data-testid={`fit-${kind}-yes`} onClick={() => save(selfConfirmPatch(sid, kind))}>{F.yes}</button>
            <button className="btn-ghost !py-2 text-sm" data-testid={`fit-${kind}-no`} onClick={() => setPicking((x) => !x)}>{F.no}</button>
          </div>
        </>
      )}
      {picking && (
        <div className="mt-3" data-testid={`fit-${kind}-options`}>
          <p className="mb-2 text-sm">{F.pickTitle}</p>
          <div className={`grid gap-2 ${info.options.length > 9 ? "grid-cols-4" : info.options.length > 4 ? "grid-cols-3" : "grid-cols-2"}`}>
            {info.options.map((o) => (
              <button key={o.v} onClick={() => pick(o.v)} className={`min-h-11 rounded-xl border px-1.5 py-2 text-center transition active:scale-95 ${o.v === info.current ? "border-gold bg-gold/15" : "border-white/12 bg-white/[0.04] hover:border-gold/40"}`}>
                <span className="block text-sm font-semibold">{o.label}</span>
                {o.sub && <span className="block text-[10.5px] leading-tight text-dim">{o.sub}</span>}
              </button>
            ))}
          </div>
          <button className="mt-2 text-xs text-dim underline" onClick={() => setPicking(false)}>{F.cancel}</button>
        </div>
      )}
      {fl && (
        <p className="mt-2 text-xs text-dim">
          {fl.measuredSource === "quiz" ? R.fromQuiz : <>{R.fromBigFive} <Link className="text-gold underline" href={h(`/quiz/four-letter/${forQ}`)}>{F.takeFourLetter} →</Link></>}
        </p>
      )}
    </div>
  );
}

/** Small note under the Big Five showing which version feeds the results, with a link to the longer one. */
export function BigFiveSourceNote({ profile, pid = "me" }: { profile: Profile; pid?: string }) {
  const { c } = useContent(); const h = useHref(); const R = c.types.result; const F = c.types.fit;
  if (!profile.bigFiveSource) return null;
  return (
    <p className="mt-2 text-xs text-dim" data-testid="bigfive-source">
      {profile.bigFiveSource === "long" ? R.longUsed : <>{R.shortUsed} <Link className="text-gold underline" href={h(`/quiz/big-five-long/${pid === "me" ? "" : `?for=${pid}`}`)}>{F.takeLong} →</Link></>}
    </p>
  );
}
