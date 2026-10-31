"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BirthForm } from "../BirthForm";
import { DatePicker } from "../DatePicker";
import { repo, useStore, type StoredPerson } from "@/lib/store";
import { useHref, useContent } from "@/lib/content-context";
import { PageHero } from "../ui";
import { ZodiacWheel } from "../art/ZodiacWheel";
import { Ritual } from "../aura/Ritual";


/** Short "reading your sky" sequence — the calculations are real and instant; this just gives the moment some ceremony. */
function Casting({ onDone }: { onDone: () => void }) {
  const [i, setI] = useState(0);
  const STEPS = useContent().c.ui.quickStart.steps;
  useEffect(() => {
    const fast = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = setInterval(() => setI((x) => x + 1), fast ? 80 : 420);
    return () => clearInterval(id);
  }, []);
  useEffect(() => { if (i >= STEPS.length) onDone(); }, [i, onDone, STEPS.length]);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-night/90 backdrop-blur-xl" role="status" aria-live="polite">
      <div className="text-center">
        <div className="relative mx-auto mb-8 h-64 w-64">
          <ZodiacWheel className="h-full w-full animate-[spin_6s_linear_infinite]" />
          <div className="absolute inset-[38%] animate-pulse-glow rounded-full bg-gold/40 blur-xl" />
        </div>
        <p className="h-display text-2xl text-mist">{STEPS[Math.min(i, STEPS.length - 1)]}</p>
        <div className="mx-auto mt-4 flex w-48 gap-1">{STEPS.map((_, k) => <span key={k} className={`h-1 flex-1 rounded-full transition ${k <= i ? "bg-gold" : "bg-white/15"}`} />)}</div>
      </div>
    </div>
  );
}

/** The default first run: name if you like, birth date, go. */
function QuickForm({ preDate, onGo }: { preDate: string | null; onGo: (p: StoredPerson) => void }) {
  const { c } = useContent(); const U = c.ui.birthForm; const Q = c.ui.tests.quick;
  const [name, setName] = useState(""); const [date, setDate] = useState(preDate ?? ""); const [err, setErr] = useState("");
  const go = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return setErr(U.errDate);
    const y = Number(date.slice(0, 4)); if (y < 1800 || y > 2100) return setErr(U.errYear);
    onGo({ id: "me", name: name.trim(), date, time: null, place: null, utcOffsetOverride: null, quiz: {}, createdAt: new Date().toISOString() });
  };
  return (
    <form onSubmit={go} className="space-y-4" data-testid="quick-form">
      <div>
        <label className="label" htmlFor="quick-name">{Q.name} <span className="opacity-60">({c.site.common.optional})</span></label>
        <input id="quick-name" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder={U.namePh} autoComplete="given-name" data-testid="quick-name" />
      </div>
      <div>
        <label className="label">{U.date}</label>
        <DatePicker value={date} onChange={setDate} minYear={1900} />
      </div>
      {err && <p role="alert" className="text-sm text-rose">{err}</p>}
      <button className="btn-primary w-full py-3.5 text-base" type="submit" data-testid="quick-go">{c.ui.quickStart.reveal}</button>
    </form>
  );
}

export function QuickStart() {
  const s = useStore(); const router = useRouter(); const h = useHref(); const { c } = useContent(); const U = c.ui.quickStart; const Q = c.ui.tests.quick;
  const sp = useSearchParams(); const raw = sp.get("date"); const preDate = raw && /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : null;
  const [casting, setCasting] = useState(false);
  // The quick path is the default. The attunement stays one tap away, and /start/?attune=1 still opens it straight.
  const [ritual, setRitual] = useState(sp.get("attune") === "1");
  const [full, setFull] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const attune = leaving || (s !== null && ritual);
  if (attune) return (
    <Ritual initial={s!.me ?? (preDate ? { date: preDate } : undefined)}
      onDone={(p) => { setLeaving(true); repo.saveMe(p); router.push(h("/me/")); }} onQuick={() => setRitual(false)} onClose={() => router.push(h(s!.me ? "/me/" : "/"))} />
  );
  const me = s?.me ?? null;
  const save = (p: StoredPerson) => {
    const nameless = !p.name.trim();
    // Keeps what the form does not know about: raw answers, test dates and the aura.
    repo.saveMe({ ...(me ?? {}), ...p, id: "me", name: nameless ? Q.noName : p.name, noName: nameless || undefined });
    if (me) router.push(h("/me/")); else setCasting(true);
  };
  return (
    <div>
      {casting && <Casting onDone={() => router.push(h("/me/"))} />}
      <PageHero eyebrow={me ? U.eyebrowEdit : U.eyebrowNew} emblem="chart" img="cliffs"
        title={me ? <>{U.editA}<span className="italic text-aurora">{U.editB}</span></> : <>{U.newA}<span className="italic text-aurora">{U.newB}</span></>}
        sub={me ? undefined : U.sub} />
      <div className="card mx-auto max-w-2xl">
        {s === null ? null : me || full ? (
          <BirthForm key={me?.id ?? "new"} nameOptional initial={me ? { ...me, name: me.noName ? "" : me.name } : preDate ? { date: preDate, time: "" } : undefined} submitLabel={me ? U.save : U.reveal} onSubmit={save} />
        ) : <QuickForm preDate={preDate} onGo={save} />}
      </div>
      {s !== null && !me && (
        <div className="mx-auto mt-4 flex max-w-2xl flex-col items-center gap-2 text-sm">
          <button type="button" className="text-gold underline decoration-dotted underline-offset-4" onClick={() => setFull(!full)} data-testid="quick-full">{full ? Q.simple : Q.full}</button>
          <button type="button" className="text-dim underline decoration-dotted underline-offset-4" onClick={() => setRitual(true)} data-testid="quick-ritual">{Q.ritual}</button>
        </div>
      )}
      <div className="mx-auto mt-6 grid max-w-2xl grid-cols-3 gap-3 text-center text-xs text-dim">
        <p>{U.f1}</p><p>{U.f2}</p><p>{U.f3}</p>
      </div>
    </div>
  );
}
