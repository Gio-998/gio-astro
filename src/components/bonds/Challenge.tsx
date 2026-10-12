"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { encodeProfileCode, decodeProfileCode, type StoredPerson } from "@/lib/store";
import { profileOf } from "@/lib/profile";
import { comparePair } from "@/engine/compat";
import { useContent, useHref } from "@/lib/content-context";
import { BirthForm } from "../BirthForm";
import { BondMerge } from "./BondMerge";
import { BondSwipe } from "./BondSwipe";
import { haptic } from "@/lib/haptics";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://horoscop.si").replace(/\/$/, "");

/** Only name and birth details travel in the link: no quiz answers, no birth name. */
export function challengeLink(me: StoredPerson, locale: string) {
  const code = encodeProfileCode({ id: "me", name: me.name, date: me.date, time: me.time, place: me.place, quiz: {}, createdAt: "" } as StoredPerson);
  return `${SITE}/${locale}/challenge/?c=${encodeURIComponent(code)}`;
}

export function ChallengeSend({ me }: { me: StoredPerson }) {
  const { c, locale } = useContent(); const C = c.sky.challenge; const [copied, setCopied] = useState(false);
  const url = challengeLink(me, locale);
  const send = async () => {
    haptic("tick");
    if (navigator.share) { try { await navigator.share({ title: C.eyebrow, text: C.shareText(me.name), url }); return; } catch { /* cancelled */ } }
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2200); } catch { /* ignore */ }
  };
  return (
    <section className="card mb-4 print:hidden" data-testid="challenge-send">
      <h2 className="h-display text-2xl text-balance">⚡ {C.send}</h2>
      <p className="mb-3 text-[13px] text-dim text-pretty">{C.sendSub}</p>
      <button className="btn-primary min-h-[52px] w-full" onClick={send}>{copied ? C.copied : C.share}</button>
    </section>
  );
}

export function ChallengePage() {
  const { c } = useContent(); const h = useHref(); const C = c.sky.challenge;
  const code = useSearchParams().get("c") ?? "";
  const from = useMemo(() => { const d = decodeProfileCode(code); return d ? ({ ...d, id: "from", createdAt: "" } as StoredPerson) : null; }, [code]);
  const [guest, setGuest] = useState<StoredPerson | null>(null);
  const res = useMemo(() => (from && guest ? { r: comparePair(profileOf(guest), profileOf(from), guest.relType ?? "romantic"), pa: profileOf(guest), pb: profileOf(from) } : null), [from, guest]);
  if (!from) return <div className="card mx-auto max-w-md text-center">{C.bad}</div>;
  return (
    <div className="mx-auto max-w-lg">
      <header className="mb-4 rounded-[32px] border border-white/15 bg-gradient-to-b from-[#2a2061] to-[#120f2e] px-5 py-7 text-center">
        <p className="eyebrow mb-2">{C.eyebrow}</p>
        <h1 className="h-display text-[clamp(2rem,9vw,3rem)] leading-[1.05] text-balance">{res ? C.result(guest!.name, from.name) : C.title(from.name)}</h1>
        {!res && <p className="mt-3 text-[15px] text-mist/85 text-pretty">{C.sub}</p>}
      </header>
      {!res ? (
        <div className="card"><BirthForm askRelType submitLabel={C.reveal} onSubmit={(p) => { haptic("success"); setGuest(p); window.scrollTo({ top: 0 }); }} /></div>
      ) : (
        <>
          <BondMerge a={guest!.name} b={from.name} ca={res.pa.palette} cb={res.pb.palette} resonance={res.r.resonance} spark={res.r.spark} />
          <BondSwipe report={res.r} pairKey={`challenge|${code.slice(-12)}`} />
          <Link href={h("/account/")} className="btn-primary mb-3 min-h-[56px] w-full text-center text-balance">{C.more}</Link>
          <ChallengeSend me={guest!} />
        </>
      )}
    </div>
  );
}
