"use client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { sb } from "@/lib/supabase";
import { useAccount } from "@/lib/sync";
import { useContent, useHref } from "@/lib/content-context";
import { refreshFlags, setFlagLocal, type FlagKey } from "@/lib/flags";
import { SITE_URL } from "@/lib/site-url";
import { inviteMessage } from "@/content/en/admin";
import { useAdminText } from "./text";

type Tab = "testers" | "invites" | "switches" | "stats" | "feedback";
const TABS: Tab[] = ["testers", "invites", "switches", "stats", "feedback"];
type Tester = { user_id: string; email: string; display_name: string | null; role: string | null; joined_at: string; last_sign_in_at: string | null; last_seen_at: string | null; profile_fields: number; profile_total: number; quizzes_done: number; people_saved: number; feedback_count: number };
type Invite = { email: string; note: string | null; used_at: string | null; created_at: string };
type Wait = { id: string; email: string; locale: string | null; source: string | null; created_at: string };
type Flag = { key: string; enabled: boolean; updated_at: string };
type Fb = { id: string; user_id: string; page_url: string | null; message: string; locale: string | null; status: string; created_at: string; resolved_at: string | null };
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const site = () => (SITE_URL || "https://horoscop.si").replace(/\/$/, "");

/** Admin check: role in profiles (what RLS uses), with the JWT app_metadata role as the fast path. */
export function useIsAdmin(): { ready: boolean; admin: boolean } {
  const a = useAccount(); const meta = (a.user?.app_metadata as { role?: string } | undefined)?.role === "admin";
  const [db, setDb] = useState<boolean | null>(null);
  useEffect(() => {
    if (!a.user) return; let alive = true;
    void sb()!.from("profiles").select("role").eq("id", a.user.id).maybeSingle().then(({ data }) => { if (alive) setDb(data?.role === "admin"); });
    return () => { alive = false; };
  }, [a.user]);
  return { ready: a.ready && (!a.user || meta || db !== null), admin: meta || db === true };
}

export function AdminPanel() {
  const a = useAccount(); const { c, locale } = useContent(); const T = useAdminText(); const h = useHref(); const B = c.ui.beta;
  const { ready, admin } = useIsAdmin();
  const [tab, setTab] = useState<Tab>(() => { const t = (typeof window === "undefined" ? "" : location.hash.slice(1)) as Tab; return TABS.includes(t) ? t : "testers"; });
  const go = (t: Tab) => { setTab(t); history.replaceState(null, "", `#${t}`); };
  const [testers, setTesters] = useState<Tester[] | null>(null);
  const [openFb, setOpenFb] = useState(0);
  const loadTesters = useCallback(async () => { const { data } = await sb()!.rpc("admin_testers"); setTesters((data as Tester[] | null) ?? []); }, []);
  const loadFbCount = useCallback(async () => { const { count } = await sb()!.from("feedback").select("id", { count: "exact", head: true }).eq("status", "open"); setOpenFb(count ?? 0); }, []);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch on mount
  useEffect(() => { if (admin) { void loadTesters(); void loadFbCount(); } }, [admin, loadTesters, loadFbCount]);
  const fmt = useCallback((iso: string | null, time = false) => iso ? new Date(iso).toLocaleString(locale === "mk" ? "mk-MK" : "en-GB", { day: "numeric", month: "short", ...(time ? { hour: "2-digit", minute: "2-digit" } : { year: "numeric" }) }) : "", [locale]);
  if (!ready) return <p className="py-10 text-center text-dim">{c.site.common.loading}</p>;
  if (!a.user) return <div className="card"><Link className="text-gold" href={h("/account/?next=/admin/")}>{B.haveInvite}</Link></div>;
  if (!admin) return <div className="card text-dim" data-testid="not-admin">{B.notAdmin}</div>;
  return (
    <div className="space-y-4" data-testid="beta-admin">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><p className="eyebrow mb-1">★ {T.adminBadge}</p><h1 className="h-display text-4xl text-aurora">{T.title}</h1><p className="text-sm text-dim">{T.sub}</p></div>
        <Link className="btn-ghost !py-2 text-sm" href={h("/admin/emails/")} data-testid="emails-link">✉ {B.emailsLink}</Link>
      </div>
      <div className="sticky top-[60px] z-30 -mx-4 overflow-x-auto px-4 py-2 [scrollbar-width:none]" role="tablist">
        <div className="flex w-max gap-1.5 rounded-full border border-white/10 bg-ink/80 p-1 backdrop-blur-xl">
          {TABS.map((t) => (
            <button key={t} role="tab" aria-selected={tab === t} onClick={() => go(t)} data-testid={`admin-tab-${t}`}
              className={`relative min-h-[40px] whitespace-nowrap rounded-full px-4 text-sm transition ${tab === t ? "bg-gold text-plum font-semibold" : "text-dim hover:text-mist"}`}>
              {T.tabs[t]}{t === "testers" && testers ? ` · ${testers.length}` : ""}{t === "feedback" && openFb > 0 && <span className="ml-1.5 rounded-full bg-rose px-1.5 text-[11px] font-bold text-ink">{openFb}</span>}
            </button>
          ))}
        </div>
      </div>
      {tab === "testers" && <Testers testers={testers} me={a.user.id} fmt={fmt} reload={loadTesters} />}
      {tab === "invites" && <Invites fmt={fmt} testers={testers} />}
      {tab === "switches" && <Switches fmt={fmt} />}
      {tab === "stats" && <Stats />}
      {tab === "feedback" && <FeedbackInbox fmt={fmt} testers={testers} onChange={loadFbCount} />}
    </div>
  );
}

type Fmt = (iso: string | null, time?: boolean) => string;

function Testers({ testers, me, fmt, reload }: { testers: Tester[] | null; me: string; fmt: Fmt; reload: () => void }) {
  const T = useAdminText();
  if (!testers) return <p className="text-dim">{T.loading}</p>;
  return (
    <div className="space-y-2" data-testid="admin-testers">
      <div className="flex items-center justify-between"><p className="text-sm text-dim">{T.testersCount(testers.length)}</p><button className="text-sm text-gold" onClick={reload}>↻ {T.refresh}</button></div>
      {testers.length === 0 ? <p className="card text-dim">{T.empty}</p> : testers.map((t) => {
        const pf = t.profile_fields / Math.max(1, t.profile_total);
        return (
          <div key={t.user_id} className="card !p-4" data-testid="tester-row">
            <div className="mb-2 flex items-start justify-between gap-2">
              <div className="min-w-0"><p className="truncate font-semibold">{t.display_name || t.email.split("@")[0]} {t.user_id === me && <span className="text-xs text-dim">({T.you})</span>}</p><p className="truncate text-xs text-dim">{t.email}</p></div>
              {t.role === "admin" && <span className="chip shrink-0 text-gold">★ {T.adminBadge}</span>}
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs sm:grid-cols-5">
              <div><p className="text-dim">{T.joined}</p><p>{fmt(t.joined_at)}</p></div>
              <div><p className="text-dim">{T.lastVisit}</p><p>{t.last_seen_at ? fmt(t.last_seen_at, true) : T.never}</p></div>
              <div><p className="text-dim">{T.profile}</p><div className="mt-1 flex items-center gap-2"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-amber to-gold" style={{ width: `${Math.max(4, pf * 100)}%` }} /></div><span>{T.profileOf(t.profile_fields, t.profile_total)}</span></div></div>
              <div><p className="text-dim">{T.quizzes}</p><p>{t.quizzes_done}/7</p></div>
              <div><p className="text-dim">{T.people}</p><p>{t.people_saved}</p></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function mailtoHref(email: string) { const m = inviteMessage(email, site()); return `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(m.subject)}&body=${encodeURIComponent(m.body)}`; }
function gmailHref(email: string) { const m = inviteMessage(email, site()); return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(m.subject)}&body=${encodeURIComponent(m.body)}`; }

function CopyBtn({ email }: { email: string }) {
  const T = useAdminText(); const [ok, setOk] = useState(false);
  return <button type="button" className="btn-ghost !min-h-[36px] !px-3 !py-1 text-xs" data-testid="copy-invite" onClick={async () => {
    const m = inviteMessage(email, site()); const txt = `${m.subject}\n\n${m.body}`;
    try { await navigator.clipboard.writeText(txt); } catch { const ta = document.createElement("textarea"); ta.value = txt; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove(); }
    setOk(true); setTimeout(() => setOk(false), 1800);
  }}>{ok ? T.copied : `⧉ ${T.copy}`}</button>;
}

function Invites({ fmt, testers }: { fmt: Fmt; testers: Tester[] | null }) {
  const T = useAdminText();
  const [invites, setInvites] = useState<Invite[] | null>(null); const [wait, setWait] = useState<Wait[] | null>(null);
  const [text, setText] = useState(""); const [msg, setMsg] = useState("");
  const load = useCallback(async () => {
    const c = sb()!;
    const [i, w] = await Promise.all([c.from("beta_invites").select("email,note,used_at,created_at").order("created_at", { ascending: false }), c.from("waitlist").select("id,email,locale,source,created_at").order("created_at", { ascending: false })]);
    setInvites(i.data ?? []); setWait(w.data ?? []);
  }, []);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch on mount
  useEffect(() => { void load(); }, [load]);
  const add = async (emails: string[]) => {
    const rows = [...new Set(emails.map((e) => e.trim().toLowerCase()).filter((e) => EMAIL_RE.test(e)))].map((email) => ({ email }));
    if (!rows.length) return false;
    const { error } = await sb()!.from("beta_invites").upsert(rows, { onConflict: "email", ignoreDuplicates: true });
    setMsg(error ? error.message : T.added(rows.length)); void load(); return !error;
  };
  const invited = new Set((invites ?? []).map((i) => i.email));
  const hasAccount = useMemo(() => new Set((testers ?? []).map((t) => t.email.toLowerCase())), [testers]);
  const pendingWait = (wait ?? []).filter((w) => !invited.has(w.email));
  return (
    <div className="space-y-4" data-testid="admin-invites">
      <div className="card space-y-2">
        <h2 className="h-display text-2xl">{T.addTitle}</h2>
        <p className="text-xs text-dim">{T.addHint}</p>
        <textarea className="input h-24 w-full font-mono text-[16px]" value={text} onChange={(e) => setText(e.target.value)} placeholder={"ana@example.com\nmarko@example.com"} data-testid="invite-text" />
        <div className="flex flex-wrap items-center gap-3"><button className="btn-primary" onClick={async () => { if (await add(text.split(/[\s,;]+/))) setText(""); }} data-testid="invite-add">{T.add}</button>{msg && <span className="text-sm text-dim" role="status">{msg}</span>}</div>
        <p className="text-xs text-dim">{T.emailHint}</p>
      </div>

      <div className="card">
        <h2 className="h-display mb-2 text-2xl">{T.waitlist} · {pendingWait.length}</h2>
        {!wait ? <p className="text-dim">{T.loading}</p> : pendingWait.length === 0 ? <p className="text-sm text-dim">{T.empty}</p> : <ul className="divide-y divide-white/10">{pendingWait.map((w) => (
          <li key={w.id} className="py-3" data-testid="waitlist-row">
            <p className="break-all text-sm font-medium">{w.email}</p>
            <p className="mb-2 text-xs text-dim">{T.fromWaitlist(fmt(w.created_at))}{w.locale ? ` · ${w.locale}` : ""}</p>
            <div className="flex flex-wrap gap-2">
              <button className="btn-primary !min-h-[36px] !px-4 !py-1 text-xs" data-testid="waitlist-invite" onClick={async () => { if (await add([w.email])) window.location.href = mailtoHref(w.email); }}>✉ {T.inviteSend}</button>
              <button className="btn-ghost !min-h-[36px] !px-3 !py-1 text-xs" onClick={() => add([w.email])}>{T.invite}</button>
              <button className="!min-h-[36px] px-2 text-xs text-rose" onClick={async () => { if (!confirm(T.confirmRemove(w.email))) return; await sb()!.from("waitlist").delete().eq("id", w.id); void load(); }}>{T.remove}</button>
            </div>
          </li>))}</ul>}
      </div>

      <div className="card">
        <h2 className="h-display mb-2 text-2xl">{T.invited} · {invites?.length ?? 0}</h2>
        {!invites ? <p className="text-dim">{T.loading}</p> : invites.length === 0 ? <p className="text-sm text-dim">{T.empty}</p> : <ul className="divide-y divide-white/10">{invites.map((i) => {
          const joined = i.used_at || hasAccount.has(i.email);
          return (
            <li key={i.email} className="py-3" data-testid="invite-row">
              <div className="flex items-start justify-between gap-2"><p className="min-w-0 break-all text-sm font-medium">{i.email}</p><span className={`chip shrink-0 text-[11px] ${joined ? "text-sage" : "text-dim"}`}>{joined ? `✓ ${T.joinedOn(fmt(i.used_at ?? i.created_at))}` : T.notJoined}</span></div>
              {i.note && <p className="text-xs text-dim">{i.note}</p>}
              <div className="mt-2 flex flex-wrap gap-2">
                <a className="btn-ghost !min-h-[36px] !px-3 !py-1 text-xs" href={mailtoHref(i.email)} data-testid="invite-mailto">✉ {T.email}</a>
                <a className="btn-ghost !min-h-[36px] !px-3 !py-1 text-xs" href={gmailHref(i.email)} target="_blank" rel="noopener noreferrer">{T.gmail} ↗</a>
                <CopyBtn email={i.email} />
                <button className="!min-h-[36px] px-2 text-xs text-rose" data-testid="invite-remove" onClick={async () => { if (!confirm(T.confirmUninvite(i.email))) return; await sb()!.from("beta_invites").delete().eq("email", i.email); void load(); }}>{T.uninvite}</button>
              </div>
            </li>
          );
        })}</ul>}
      </div>
    </div>
  );
}

function Switches({ fmt }: { fmt: Fmt }) {
  const T = useAdminText();
  const [flags, setFlags] = useState<Flag[] | null>(null); const [busy, setBusy] = useState<string | null>(null); const [err, setErr] = useState("");
  const load = useCallback(async () => { const { data } = await sb()!.from("feature_flags").select("key,enabled,updated_at").order("key"); setFlags(data ?? []); }, []);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch on mount
  useEffect(() => { void load(); }, [load]);
  const order = ["private_beta", "signups_open", "captcha"];
  const toggle = async (f: Flag) => {
    setBusy(f.key); setErr("");
    const { error } = await sb()!.from("feature_flags").update({ enabled: !f.enabled }).eq("key", f.key);
    if (error) setErr(error.message); else { setFlagLocal(f.key as FlagKey, !f.enabled); void refreshFlags(); }
    await load(); setBusy(null);
  };
  if (!flags) return <p className="text-dim">{T.loading}</p>;
  return (
    <div className="space-y-3" data-testid="admin-switches">
      {[...flags].sort((x, y) => order.indexOf(x.key) - order.indexOf(y.key)).map((f) => {
        const S = T.switches[f.key] ?? { name: f.key, on: "", off: "" };
        return (
          <div key={f.key} className="card !p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0"><p className="font-semibold">{S.name}</p><p className="text-sm text-mist/85">{f.enabled ? S.on : S.off}</p><p className="mt-1 text-[11px] text-dim">{T.changedBy(fmt(f.updated_at, true))}</p></div>
              <button type="button" role="switch" aria-checked={f.enabled} aria-label={S.name} disabled={busy === f.key} onClick={() => toggle(f)} data-testid={`switch-${f.key}`}
                className={`relative h-8 w-14 shrink-0 rounded-full border transition ${f.enabled ? "border-gold/70 bg-gold/80" : "border-white/20 bg-white/10"} ${busy === f.key ? "opacity-60" : ""}`}>
                <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all ${f.enabled ? "left-7" : "left-1"}`} />
              </button>
            </div>
            {f.key === "captcha" && <p className="mt-2 rounded-xl bg-white/5 p-2 text-xs text-dim">⚠ {T.captchaWarn}</p>}
          </div>
        );
      })}
      {err && <p role="alert" className="text-sm text-rose">{err}</p>}
    </div>
  );
}

function Stats() {
  const T = useAdminText(); const [days, setDays] = useState(30);
  const [s, setS] = useState<Record<string, number | Record<string, number>> | null>(null); const [err, setErr] = useState(false);
  useEffect(() => { let alive = true; void sb()!.rpc("admin_stats", { days }).then(({ data, error }) => { if (!alive) return; setErr(!!error); setS((data as never) ?? {}); }); return () => { alive = false; }; }, [days]);
  const main = ["visits", "visits_7d", "visits_today", "signed_in_visitors", "quizzes_done", "compat_reports", "bond_checks", "shared_cards"];
  const beta = ["testers", "invites", "invites_used", "waitlist", "quizzes_saved", "feedback_open"];
  const byQuiz = (s?.by_quiz ?? {}) as Record<string, number>;
  return (
    <div className="space-y-4" data-testid="admin-stats">
      <div className="flex gap-1.5">{[7, 30, 365].map((d) => <button key={d} onClick={() => { if (d !== days) { setS(null); setDays(d); } }} className={`chip !min-h-[36px] ${d === days ? "!border-gold text-gold" : "text-dim"}`}>{T.range(d)}</button>)}</div>
      {err && <p className="text-sm text-rose">{T.error}</p>}
      {!s ? <p className="text-dim">{T.loading}</p> : <>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{main.map((k) => <StatCard key={k} label={T.stat[k]} value={s[k] as number} />)}</div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{beta.map((k) => <StatCard key={k} label={T.stat[k]} value={s[k] as number} small />)}</div>
        {Object.keys(byQuiz).length > 0 && <div className="card"><p className="mb-2 font-semibold">{T.byQuiz}</p>{Object.entries(byQuiz).sort((a, b) => b[1] - a[1]).map(([k, n]) => <div key={k} className="flex justify-between border-b border-white/5 py-1 text-sm"><span>{k}</span><span className="text-gold">{n}</span></div>)}</div>}
        <p className="text-xs text-dim">{T.statsNote}</p>
      </>}
    </div>
  );
}
function StatCard({ label, value, small }: { label: string; value: number | undefined; small?: boolean }) {
  return <div className={`card !p-4 ${small ? "" : "bg-gradient-to-br from-violet/15 to-transparent"}`}><p className={`h-display ${small ? "text-2xl" : "text-4xl"} text-gold`}>{value ?? 0}</p><p className="text-xs leading-tight text-dim">{label}</p></div>;
}

function FeedbackInbox({ fmt, testers, onChange }: { fmt: Fmt; testers: Tester[] | null; onChange: () => void }) {
  const T = useAdminText(); const a = useAccount();
  const [filter, setFilter] = useState<"open" | "resolved" | "all">("open");
  const [rows, setRows] = useState<Fb[] | null>(null);
  const load = useCallback(async () => {
    let q = sb()!.from("feedback").select("id,user_id,page_url,message,locale,status,created_at,resolved_at").order("created_at", { ascending: false }).limit(200);
    if (filter !== "all") q = q.eq("status", filter);
    const { data } = await q; setRows(data ?? []);
  }, [filter]);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch on filter change
  useEffect(() => { void load(); }, [load]);
  const who = (id: string) => testers?.find((t) => t.user_id === id)?.email ?? id.slice(0, 8);
  const setStatus = async (f: Fb, status: "open" | "resolved") => {
    await sb()!.from("feedback").update(status === "resolved" ? { status, resolved_at: new Date().toISOString(), resolved_by: a.user?.id ?? null } : { status, resolved_at: null, resolved_by: null }).eq("id", f.id);
    void load(); onChange();
  };
  return (
    <div className="space-y-3" data-testid="admin-feedback">
      <div className="flex gap-1.5">{(["open", "resolved", "all"] as const).map((k) => <button key={k} onClick={() => setFilter(k)} className={`chip !min-h-[36px] ${k === filter ? "!border-gold text-gold" : "text-dim"}`}>{T[k]}</button>)}</div>
      {!rows ? <p className="text-dim">{T.loading}</p> : rows.length === 0 ? <p className="card text-dim">{T.empty}</p> : rows.map((f) => (
        <div key={f.id} className={`card !p-4 ${f.status === "resolved" ? "opacity-70" : ""}`} data-testid="feedback-row">
          <p className="whitespace-pre-wrap text-[15px]">{f.message}</p>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-dim">
            <span>{T.from}: {who(f.user_id)}</span><span>{fmt(f.created_at, true)}</span>
            {f.page_url && <span>{T.page}: <a className="text-gold underline" href={f.page_url} target="_blank" rel="noopener noreferrer">{f.page_url}</a></span>}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {f.status === "open"
              ? <button className="btn-primary !min-h-[36px] !px-4 !py-1 text-xs" onClick={() => setStatus(f, "resolved")} data-testid="feedback-resolve">✓ {T.markResolved}</button>
              : <button className="btn-ghost !min-h-[36px] !px-4 !py-1 text-xs" onClick={() => setStatus(f, "open")}>{T.reopen}</button>}
            <button className="!min-h-[36px] px-2 text-xs text-rose" onClick={async () => { if (!confirm(T.confirmDelete)) return; await sb()!.from("feedback").delete().eq("id", f.id); void load(); onChange(); }}>{T.del}</button>
          </div>
        </div>
      ))}
    </div>
  );
}
