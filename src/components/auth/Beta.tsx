"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { sb, accountsEnabled } from "@/lib/supabase";
import { useFlags } from "@/lib/flags";
import { useAccount } from "@/lib/sync";
import { useContent, useHref } from "@/lib/content-context";
import { Aura } from "../aura/Aura";
import { useCaptcha } from "./Captcha";
import { TrustStrip } from "../nav/Trust";

// Routes anyone can open during the beta: landing, how it works, quizzes overview, lens explainers, legal, sign-in steps.
// Everything else (profile, start, quizzes and results, match, bond, people, today, book, chart) needs an invited account.
const PUBLIC = ["", "privacy", "terms", "promise", "learn", "credits", "quizzes", "lens", "account", "account/verify", "auth/callback", "admin", "admin/emails"];
const routeOf = (path: string) => path.replace(/^\/(en|mk)(\/|$)/, "").replace(/\/$/, "");
export const isPublicRoute = (path: string) => { const r = routeOf(path); return PUBLIC.includes(r) || r === "upgrade" || r === "premium" || (r.startsWith("premium/") && r !== "premium/checkout") || /^(daily|blog)(\/|$)/.test(r); };

/** True while the beta is on and nobody is signed in (also while the session is still loading, to avoid flashing app links). */
export function useBetaLocked(): boolean {
  const a = useAccount(); const f = useFlags();
  return f.private_beta && accountsEnabled && !a.user;
}

/** In private beta, app pages show a compact invite gate to logged-out visitors, inside the normal layout. */
export function BetaGate({ children }: { children: React.ReactNode }) {
  const path = usePathname() || "/"; const a = useAccount(); const { c } = useContent(); const f = useFlags();
  if (!f.private_beta || !accountsEnabled || isPublicRoute(path)) return <>{children}</>;
  if (!a.ready) return <p className="py-20 text-center text-dim">{c.site.common.loading}</p>;
  if (a.user) return <>{children}</>;
  return <BetaLockedCard />;
}

/** Compact gate: log in (invited testers) or join the waitlist. */
export function BetaLockedCard() {
  const { c } = useContent(); const B = c.ui.beta; const h = useHref(); const path = usePathname() || "/";
  const [wl, setWl] = useState(false);
  return (
    <div className="mx-auto my-6 max-w-md overflow-hidden rounded-[28px] border border-white/15 bg-white/[0.05] p-6 text-center shadow-[0_30px_70px_-35px_rgba(139,108,240,.9)] backdrop-blur" data-testid="beta-gate">
      <div className="mx-auto mb-3 h-24 w-20"><Aura className="h-full w-full" colors={["#c9b8ff", "#ffd38a", "#8fd3ff", "#ff9ed2", "#7fe0b0"]} energy={0.5} heart="#ffd27a" label="" /></div>
      <p className="eyebrow mb-1">✦ {B.lockedEyebrow}</p>
      <h1 className="h-display mb-2 text-3xl">{B.lockedTitle}</h1>
      <p className="mb-5 text-sm leading-relaxed text-mist/85">{B.lockedText}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        <Link className="btn-primary py-3" href={`${h("/account")}?next=${encodeURIComponent(path)}`} data-testid="beta-signin">{B.login}</Link>
        <button type="button" className="btn-ghost py-3" onClick={() => setWl(!wl)} aria-expanded={wl} data-testid="beta-join">{B.joinWaitlist}</button>
      </div>
      {wl && <div className="mt-4 text-left"><Waitlist source="gate" /></div>}
      <TrustStrip className="mt-4" center />
    </div>
  );
}

/** Landing-page section (id="waitlist") shown to logged-out visitors while the beta is on. */
export function BetaInvite() {
  const locked = useBetaLocked(); const { c } = useContent(); const B = c.ui.beta; const h = useHref();
  if (!locked) return null;
  return (
    <section id="waitlist" className="scroll-mt-24 py-16" data-testid="beta-invite">
      <div className="relative overflow-hidden rounded-[32px] border border-gold/25 bg-gradient-to-br from-violet/25 via-white/[0.04] to-rose/15 p-6 sm:p-10">
        <div className="relative grid items-center gap-6 md:grid-cols-[1fr_200px]">
          <div>
            <p className="eyebrow mb-2">✦ {B.sectionEyebrow}</p>
            <h2 className="h-display mb-3 text-[clamp(2rem,6vw,3rem)] leading-tight">{B.sectionTitleA}<span className="italic text-aurora">{B.sectionTitleB}</span></h2>
            <p className="mb-5 text-mist/90">{B.sectionText}</p>
            <Waitlist source="landing" />
            <Link className="mt-4 inline-block text-sm text-gold underline-offset-4 hover:underline" href={h("/account")}>{B.haveInvite}</Link>
          </div>
          <div className="relative mx-auto hidden h-60 w-48 md:block"><Aura className="h-full w-full" colors={["#c9b8ff", "#ffd38a", "#8fd3ff", "#ff9ed2", "#7fe0b0"]} energy={0.6} heart="#ffd27a" label="" /></div>
        </div>
      </div>
    </section>
  );
}

export function Waitlist({ source = "gate" }: { source?: string }) {
  const { c, locale } = useContent(); const B = c.ui.beta;
  const [email, setEmail] = useState(""); const [state, setState] = useState<"idle" | "busy" | "done">("idle"); const [err, setErr] = useState("");
  // Turnstile loads only once someone starts typing, so plain visitors don't pay for the script.
  const [touched, setTouched] = useState(false); const cap = useCaptcha(locale, touched);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr("");
    if (cap.needed) { setTouched(true); return setErr(c.ui.auth.captchaNeeded); }
    const em = email.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) return setErr(B.invalid);
    setState("busy");
    const { error } = await sb()!.from("waitlist").insert({ email: em, locale, source });
    cap.reset();
    if (error && error.code !== "23505") { setErr(c.ui.auth.errors.generic); setState("idle"); return; } // duplicate = already on the list
    setState("done");
  };
  if (state === "done") return <p role="status" className="rounded-2xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm" data-testid="waitlist-done">{B.joined}</p>;
  return (
    <form id="waitlist" onSubmit={submit} className="space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input className="input flex-1" type="email" required placeholder={B.emailPh} value={email} onChange={(e) => setEmail(e.target.value)} onFocus={() => setTouched(true)} autoComplete="email" data-testid="waitlist-email" />
        <button className="btn-primary shrink-0" disabled={state === "busy"} data-testid="waitlist-submit">{state === "busy" ? "…" : B.join}</button>
      </div>
      {cap.widget}
      {err && <p role="alert" className="text-sm text-rose">{err}</p>}
      <p className="text-xs text-dim">{B.privacy}</p>
    </form>
  );
}


/** Tiny admin page: add/remove invites, see the waitlist. Access = app_metadata.role 'admin' (enforced by RLS, not just the UI). */
export function BetaAdmin() {
  const a = useAccount(); const { c, locale } = useContent(); const B = c.ui.beta; const h = useHref();
  const isAdmin = (a.user?.app_metadata as { role?: string } | undefined)?.role === "admin";
  const [invites, setInvites] = useState<{ email: string; note: string | null; used_at: string | null; created_at: string }[]>([]);
  const [wait, setWait] = useState<{ id: string; email: string; locale: string | null; created_at: string }[]>([]);
  const [text, setText] = useState(""); const [msg, setMsg] = useState("");
  const load = async () => {
    const c2 = sb(); if (!c2) return;
    const [i, w] = await Promise.all([c2.from("beta_invites").select("email,note,used_at,created_at").order("created_at", { ascending: false }), c2.from("waitlist").select("id,email,locale,created_at").order("created_at", { ascending: false })]);
    setInvites(i.data ?? []); setWait(w.data ?? []);
  };
  // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch on mount
  useEffect(() => { if (isAdmin) void load(); }, [isAdmin]);
  const add = async (emails: string[]) => {
    const rows = [...new Set(emails.map((e) => e.trim().toLowerCase()).filter((e) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)))].map((email) => ({ email }));
    if (!rows.length) return;
    const { error } = await sb()!.from("beta_invites").upsert(rows, { onConflict: "email", ignoreDuplicates: true });
    setMsg(error ? error.message : B.added(rows.length)); setText(""); void load();
  };
  const fmt = (iso: string) => new Date(iso).toLocaleDateString(locale === "mk" ? "mk-MK" : "en-GB", { day: "numeric", month: "long", year: "numeric" });
  if (!a.ready) return <p className="text-dim">{c.site.common.loading}</p>;
  if (!a.user) return <div className="card"><Link className="text-gold" href={h("/account")}>{B.haveInvite}</Link></div>;
  if (!isAdmin) return <div className="card text-dim" data-testid="not-admin">{B.notAdmin}</div>;
  return (
    <div className="space-y-4" data-testid="beta-admin">
      <div className="flex flex-wrap items-center justify-between gap-3"><h1 className="h-display text-4xl text-aurora">{B.adminTitle}</h1><Link className="btn-ghost !py-2 text-sm" href={h("/admin/emails/")} data-testid="emails-link">✉ {B.emailsLink}</Link></div>
      <div className="card space-y-2">
        <label className="label">{B.addInvites}</label>
        <textarea className="input h-28 font-mono text-sm" value={text} onChange={(e) => setText(e.target.value)} placeholder={"ana@example.com\nmarko@example.com"} />
        <button className="btn-primary" onClick={() => add(text.split(/[\s,;]+/))}>{B.add}</button>{msg && <span className="ml-3 text-sm text-dim">{msg}</span>}
      </div>
      <div className="card"><h2 className="h-display mb-2 text-2xl">{B.invites} · {invites.length}</h2>
        {invites.length === 0 ? <p className="text-sm text-dim">{B.empty}</p> : <ul className="divide-y divide-white/10 text-sm">{invites.map((i) => (
          <li key={i.email} className="flex items-center justify-between gap-2 py-2"><span>{i.email} <span className="text-xs text-dim">· {i.used_at ? `${B.used} ${fmt(i.used_at)}` : B.pending}</span></span>
            <button className="text-xs text-rose" onClick={async () => { await sb()!.from("beta_invites").delete().eq("email", i.email); void load(); }}>{B.remove}</button></li>))}</ul>}
      </div>
      <div className="card"><h2 className="h-display mb-2 text-2xl">{B.waitlist} · {wait.length}</h2>
        {wait.length === 0 ? <p className="text-sm text-dim">{B.empty}</p> : <ul className="divide-y divide-white/10 text-sm">{wait.map((w) => (
          <li key={w.id} className="flex items-center justify-between gap-2 py-2"><span>{w.email} <span className="text-xs text-dim">· {w.locale} · {fmt(w.created_at)}</span></span>
            <button className="btn-ghost !px-3 !py-1 text-xs" disabled={invites.some((i) => i.email === w.email)} onClick={() => add([w.email])}>{B.invite}</button></li>))}</ul>}
      </div>
    </div>
  );
}

/** "Start" for signed-in users; "Join the beta" (scrolls to the waitlist) for logged-out visitors during the beta. */
export function StartOrJoin({ className, label }: { className: string; label: string }) {
  const locked = useBetaLocked(); const h = useHref(); const B = useContent().c.ui.beta;
  return locked ? <a className={className} href="#waitlist">{B.joinBeta} ✦</a> : <Link className={className} href={h("/start/")}>{label}</Link>;
}
