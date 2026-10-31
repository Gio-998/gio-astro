"use client";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { accountsEnabled } from "@/lib/supabase";
import { useAccount } from "@/lib/sync";
import { hasLead, subscribeLead, submitLead, type LeadOutcome } from "@/lib/lead";
import { useContent, useHref } from "@/lib/content-context";
import { LIMITS } from "../../../supabase/functions/_shared/lead-rules";
import { useCaptcha } from "../auth/Captcha";
import { Check } from "../controls";

export type GateView = "wait" | "form" | "open";
/** "wait" holds the form back until we know nobody is signed in, so a signed-in reader never sees it flash. */
export function gateView(s: { backend: boolean; ready: boolean; signedIn: boolean; lead: boolean; timedOut: boolean }): GateView {
  if (!s.backend || s.signedIn || s.lead) return "open";
  return s.ready || s.timedOut ? "form" : "wait";
}

/** Shows `preview`, then the name and email form, then `children` (the full result). Signed-in users and returning leads go straight to `children`. */
export function LeadGate({ source, preview, children }: { source: string; preview?: ReactNode; children: ReactNode }) {
  const a = useAccount(); const { c } = useContent();
  const stored = useSyncExternalStore(subscribeLead, hasLead, () => false);
  const [done, setDone] = useState<{ outcome: LeadOutcome; marketing: boolean } | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const top = useRef<HTMLDivElement>(null);
  useEffect(() => { if (a.ready) return; const t = setTimeout(() => setTimedOut(true), 2500); return () => clearTimeout(t); }, [a.ready]);
  useEffect(() => { if (done) { top.current?.scrollIntoView({ block: "start" }); top.current?.focus({ preventScroll: true }); } }, [done]);

  const view = gateView({ backend: accountsEnabled, ready: a.ready, signedIn: !!a.user, lead: stored || !!done, timedOut });
  if (view === "wait") return <>{preview}</>;
  if (view === "form") return <>{preview}<LeadForm source={source} onDone={setDone} /></>;
  if (!done) return <>{children}</>;
  const L = c.ui.lead;
  return (
    <div ref={top} tabIndex={-1} className="scroll-mt-24 outline-none">
      {done.outcome === "delivered" && <p role="status" data-testid="lead-sent" className="mx-auto mb-4 max-w-xl rounded-2xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm">{done.marketing ? L.sentConfirm : L.sent}</p>}
      {children}
    </div>
  );
}

function LeadForm({ source, onDone }: { source: string; onDone: (d: { outcome: LeadOutcome; marketing: boolean }) => void }) {
  const { c, locale } = useContent(); const L = c.ui.lead; const h = useHref(); const path = usePathname() || "/";
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [marketing, setMarketing] = useState(false); const [website, setWebsite] = useState("");
  const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  // Turnstile loads only once someone starts typing, so people who read the teaser and leave don't pay for the script.
  const [touched, setTouched] = useState(false); const cap = useCaptcha(locale, touched);
  const [nudged, setNudged] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault(); setErr("");
    // Ask once. If the check cannot finish (a blocker, a bad network) the second press goes through: the server does not need a token.
    if (cap.needed && !nudged) { setTouched(true); setNudged(true); return setErr(c.ui.auth.captchaNeeded); }
    setBusy(true);
    const outcome = await submitLead({ name, email, marketing, source, locale, marketingText: `${L.marketing} ${L.marketingHint}`, captchaToken: cap.token || undefined, website });
    setBusy(false);
    if (outcome === "invalid_name" || outcome === "invalid_email") return setErr(L.errors[outcome]);
    onDone({ outcome, marketing });
  };

  return (
    <div className="mx-auto my-6 max-w-md overflow-hidden rounded-[28px] border border-white/15 bg-white/[0.05] p-6 shadow-[0_30px_70px_-35px_rgba(139,108,240,.9)] backdrop-blur" data-testid="lead-gate">
      <p className="eyebrow mb-1 text-center">✦ {L.eyebrow}</p>
      <h2 className="h-display mb-2 text-center text-3xl">{L.title}</h2>
      <p className="mb-5 text-center text-sm leading-relaxed text-mist/85">{L.text}</p>
      <form onSubmit={submit} noValidate className="relative space-y-4">
        <label className="block text-sm"><span className="mb-1 block text-dim">{L.nameLabel}</span>
          <input className="input" type="text" name="name" required autoComplete="name" autoCapitalize="words" maxLength={LIMITS.name} value={name} onChange={(e) => setName(e.target.value)} onFocus={() => setTouched(true)} data-testid="lead-name" /></label>
        <label className="block text-sm"><span className="mb-1 block text-dim">{L.emailLabel}</span>
          <input className="input" type="email" name="email" required inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} maxLength={LIMITS.email} placeholder={L.emailPh} value={email} onChange={(e) => setEmail(e.target.value)} onFocus={() => setTouched(true)} data-testid="lead-email" /></label>
        <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>Website<input type="text" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} data-testid="lead-website" /></label>
        </div>
        <p className="text-xs leading-relaxed text-dim">{L.notice} <Link className="underline underline-offset-2 hover:text-mist" href={h("/privacy/")} data-testid="lead-privacy">{L.privacyLink}</Link></p>
        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm leading-snug">
          <Check testId="lead-marketing" checked={marketing} onChange={setMarketing} />
          <span>{L.marketing} <span className="text-dim">{L.marketingHint}</span></span>
        </label>
        {cap.widget}
        {err && <p role="alert" data-testid="lead-error" className="rounded-xl border border-rose/40 bg-rose/10 px-3 py-2 text-sm text-rose">{err}</p>}
        <button className="btn-primary w-full !min-h-[48px]" disabled={busy} data-testid="lead-submit">{busy ? "…" : L.submit}</button>
      </form>
      <p className="mt-4 text-center text-sm text-dim">{L.haveAccount} <Link className="text-gold underline-offset-4 hover:underline" href={`${h("/account")}?next=${encodeURIComponent(path)}`} data-testid="lead-login">{L.login}</Link></p>
    </div>
  );
}
