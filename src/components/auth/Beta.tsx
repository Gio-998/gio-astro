"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { sb, betaMode, accountsEnabled } from "@/lib/supabase";
import { useAccount } from "@/lib/sync";
import { useContent, useHref } from "@/lib/content-context";
import { Aura } from "../aura/Aura";

// Routes anyone can open during the beta (landing, legal, sign-in steps).
const PUBLIC = ["", "privacy", "terms", "promise", "account", "account/verify", "auth/callback"];
const routeOf = (path: string) => path.replace(/^\/(en|mk)(\/|$)/, "").replace(/\/$/, "");

/** In private beta, everything except the landing/legal/sign-in pages needs a signed-in (invited) account. */
export function BetaGate({ children }: { children: React.ReactNode }) {
  const path = usePathname() || "/"; const a = useAccount(); const { c } = useContent();
  if (!betaMode || !accountsEnabled) return <>{children}</>;
  const r = routeOf(path);
  if (PUBLIC.includes(r)) return <>{r === "" && !a.user && a.ready && <BetaBanner />}{children}</>;
  if (!a.ready) return <p className="py-20 text-center text-dim">{c.site.common.loading}</p>;
  if (a.user) return <>{children}</>;
  return <BetaTeaser />;
}

function BetaBanner() {
  const { c } = useContent(); const h = useHref();
  return (
    <div className="mb-4 space-y-3 rounded-2xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm" data-testid="beta-banner">
      <div className="flex flex-wrap items-center justify-between gap-2"><span><b className="text-gold">✦ {c.ui.beta.badge}</b> · {c.ui.beta.banner}</span>
        <Link className="text-gold underline-offset-4 hover:underline" href={h("/account")}>{c.ui.beta.haveInvite}</Link></div>
      <Waitlist source="landing" />
    </div>
  );
}

export function Waitlist({ source = "gate" }: { source?: string }) {
  const { c, locale } = useContent(); const B = c.ui.beta;
  const [email, setEmail] = useState(""); const [state, setState] = useState<"idle" | "busy" | "done">("idle"); const [err, setErr] = useState("");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr("");
    const em = email.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) return setErr(B.invalid);
    setState("busy");
    const { error } = await sb()!.from("waitlist").insert({ email: em, locale, source });
    if (error && error.code !== "23505") { setErr(c.ui.auth.errors.generic); setState("idle"); return; } // duplicate = already on the list
    setState("done");
  };
  if (state === "done") return <p role="status" className="rounded-2xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm" data-testid="waitlist-done">{B.joined}</p>;
  return (
    <form id="waitlist" onSubmit={submit} className="space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input className="input flex-1" type="email" required placeholder={B.emailPh} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" data-testid="waitlist-email" />
        <button className="btn-primary shrink-0" disabled={state === "busy"} data-testid="waitlist-submit">{state === "busy" ? "…" : B.join}</button>
      </div>
      {err && <p role="alert" className="text-sm text-rose">{err}</p>}
      <p className="text-xs text-dim">{B.privacy}</p>
    </form>
  );
}

function BetaTeaser() {
  const { c } = useContent(); const B = c.ui.beta; const h = useHref();
  return (
    <div className="relative overflow-hidden rounded-[36px] border border-white/15 p-6 shadow-[0_40px_90px_-40px_rgba(139,108,240,.9)] sm:p-10" data-testid="beta-gate">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(246,207,122,.18),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(255,143,177,.18),transparent_55%)]" />
      <div className="relative grid items-center gap-6 md:grid-cols-[1fr_260px]">
        <div>
          <p className="eyebrow mb-2">✦ {B.gateEyebrow}</p>
          <h1 className="h-display mb-3 text-4xl sm:text-5xl">{B.gateTitleA}<span className="italic text-aurora">{B.gateTitleB}</span></h1>
          <p className="mb-5 text-mist/90">{B.gateText}</p>
          <ul className="mb-6 grid gap-1.5 text-sm text-dim sm:grid-cols-2">{B.teasers.map((t) => <li key={t}>✦ {t}</li>)}</ul>
          <Waitlist />
          <Link className="mt-4 inline-block text-sm text-gold underline-offset-4 hover:underline" href={h("/account")} data-testid="beta-signin">{B.haveInvite}</Link>
        </div>
        <div className="relative mx-auto h-72 w-56"><Aura className="h-full w-full" colors={["#c9b8ff", "#ffd38a", "#8fd3ff", "#ff9ed2", "#7fe0b0"]} energy={0.6} heart="#ffd27a" label="" /></div>
      </div>
    </div>
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
      <h1 className="h-display text-4xl text-aurora">{B.adminTitle}</h1>
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
