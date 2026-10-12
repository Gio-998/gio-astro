"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useStore, repo, type StoredPerson } from "@/lib/store";
import { profileOf } from "@/lib/profile";
import { useContent, useHref } from "@/lib/content-context";
import { useAccount } from "@/lib/sync";
import { inviteCopy } from "@/lib/invite-copy";
import { codeFromLocation, lookupInvite, acceptInvite, personFromSnap, inviterPersonId, BirthSnap } from "@/lib/invites";
import { comparePair } from "@/engine/compat";
import { BirthForm } from "../BirthForm";
import { BondMerge } from "../bonds/BondMerge";
import { SignArt } from "../art/SignArt";
import { track } from "@/lib/track";

type Inv = { name: string; birth: BirthSnap };

/** Warm landing for /invite/<code>: "X wants to see how you match" → birth data → Bond Merge for both. */
export function InvitePage() {
  const s = useStore(); const { c, locale } = useContent(); const h = useHref(); const a = useAccount(); const T = inviteCopy(locale).invite;
  const [code] = useState<string | null>(() => codeFromLocation());
  const [inv, setInv] = useState<Inv | null | "missing">(null);
  const [phase, setPhase] = useState<"intro" | "form" | "working" | "done" | "self">("intro");
  const [err, setErr] = useState(false);
  useEffect(() => { if (!code) { queueMicrotask(() => setInv("missing")); return; } let alive = true; void lookupInvite(code).then((r) => { if (alive) setInv(r ?? "missing"); }); return () => { alive = false; }; }, [code]);
  const other = inv && inv !== "missing" && code ? personFromSnap(inviterPersonId(code), inv.birth, inv.name) : null;
  const done = phase === "done" && s?.me && other;
  const report = useMemo(() => (done ? { r: comparePair(profileOf(s!.me!), profileOf(other!), "friend"), pa: profileOf(s!.me!), pb: profileOf(other!) } : null), [done, s, other]);

  const go = async (me: StoredPerson) => {
    if (!code || !other) return; setErr(false); setPhase("working");
    const r = await acceptInvite(code, me);
    if (!r) { setErr(true); setPhase(s?.me ? "intro" : "form"); return; }
    if (r.self) { setPhase("self"); return; }
    repo.savePerson(personFromSnap(inviterPersonId(code), r.birth, r.name));
    track("compat_report", { rel: "friend", via: "invite" });
    setPhase("done");
  };

  if (!s || inv === null) return <p className="py-16 text-center text-dim">{T.loading}</p>;
  if (inv === "missing" || !other) return <div className="card mx-auto mt-8 max-w-md text-center" data-testid="invite-missing"><p className="mb-4 text-dim">{T.notFound}</p><Link className="btn-primary" href={h("/")}>Horoscop</Link></div>;
  const theirSun = profileOf(other).sun; const A = c.astro;

  if (phase === "self") return <div className="card mx-auto mt-8 max-w-md text-center"><p className="text-dim">{T.self}</p></div>;

  if (phase === "done" && report && s.me) return (
    <div className="mx-auto max-w-lg space-y-4 pt-2" data-testid="invite-result">
      <div className="text-center">
        <p className="eyebrow mb-1">✦ {T.resultEyebrow}</p>
        <h1 className="h-display text-[clamp(2rem,9vw,2.8rem)] leading-tight">{T.resultTitle(s.me.name, other.name)}</h1>
        <p className="text-sm text-dim">{T.resultSent(other.name)}</p>
      </div>
      <BondMerge a={s.me.name} b={other.name} ca={report.pa.palette} cb={report.pb.palette} resonance={report.r.resonance} spark={report.r.spark} />
      <div className="grid grid-cols-2 gap-2">
        <div className="card !p-3 text-center"><p className="font-display text-3xl text-gold">{report.r.resonance}</p><p className="text-xs text-dim">{T.resonance}</p></div>
        <div className="card !p-3 text-center"><p className="font-display text-3xl text-gold">{report.r.spark}</p><p className="text-xs text-dim">{T.spark}</p></div>
      </div>
      <div className="flex flex-col gap-2">
        <Link className="btn-primary py-3" href={h(`/match/?a=me&b=${inviterPersonId(code!)}`)} data-testid="invite-full">{T.full} →</Link>
        {!a.user && <Link className="btn-ghost py-3" href={`${h("/account/")}?next=${encodeURIComponent(h(`/match/?a=me&b=${inviterPersonId(code!)}`))}`}>{T.join}</Link>}
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-lg pt-2" data-testid="invite-landing">
      <div className="relative mb-5 overflow-hidden rounded-[28px] border border-gold/25 bg-gradient-to-b from-[#2b1a63] via-[#170f3d] to-[#0a0720] px-5 pb-6 pt-7 text-center shadow-[0_30px_70px_-35px_rgba(139,108,240,.9)]">
        <div className="pointer-events-none absolute inset-x-0 -top-20 mx-auto h-56 w-56 rounded-full bg-violet/30 blur-3xl" />
        <p className="eyebrow relative mb-3">♡ {T.eyebrow}</p>
        <div className="relative mx-auto mb-3 flex items-center justify-center">
          <SignArt sign={theirSun} className="h-24 w-24" />
          <span className="-mx-2 text-2xl text-rose">♡</span>
          <span className="grid h-24 w-24 place-items-center rounded-full border border-dashed border-gold/40 font-display text-4xl text-gold/70">{s.me ? "✦" : "?"}</span>
        </div>
        <h1 className="h-display relative text-[clamp(2rem,9vw,2.9rem)] leading-[1.05] text-balance">{T.headA(other.name)}<span className="italic text-aurora">{T.headB}</span></h1>
        <p className="relative mt-2 text-sm text-dim">{T.their(A.signs[theirSun].name)} · {T.sub}</p>
      </div>
      {err && <p role="alert" className="mb-3 text-center text-sm text-rose">{T.error}</p>}
      {phase === "working" ? <p className="py-8 text-center text-dim">{T.working}</p>
        : s.me && phase === "intro" ? (
          <div className="space-y-2">
            <button className="btn-primary w-full py-3" onClick={() => go(s.me!)} data-testid="invite-go">{T.asMe(s.me.name)} →</button>
            <p className="text-center text-xs text-dim">{T.privacy(other.name)}</p>
          </div>
        ) : (
          <div className="card" data-testid="invite-form">
            <p className="mb-3 font-semibold">{T.formTitle}</p>
            <BirthForm submitLabel={T.submit} onSubmit={(p) => { const me = { ...p, id: "me" }; repo.saveMe(me); void go(me); }} />
            <p className="mt-3 text-center text-xs text-dim">{T.privacy(other.name)}</p>
          </div>
        )}
    </div>
  );
}
