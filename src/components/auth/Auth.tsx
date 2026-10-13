"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { sb, accountsEnabled, googleEnabled } from "@/lib/supabase";
import { getFlags } from "@/lib/flags";
import { useAccount, rememberConsents, signOut, deleteAccount, flush, pullAndMerge, resolveConflict, startAccountSync } from "@/lib/sync";
import { useStore } from "@/lib/store";
import { useContent, useHref, useDate } from "@/lib/content-context";
import { PageHero } from "../ui";
import { CodeInput } from "./CodeInput";
import { Check } from "../controls";
import { useCaptcha } from "./Captcha";
import { errKey } from "./errors";

const PENDING_EMAIL = "mirrorstar:otp-email";
type Mode = "otp" | "signup";

/** Starts the sync engine once per page load (mounted in the layout). */
export function AccountBoot() { useEffect(() => { startAccountSync(); }, []); return null; }

/** Small header chip: "Save across devices" when signed out, initials when signed in. */
export function AccountChip() {
  const a = useAccount(); const { c } = useContent(); const h = useHref();
  if (!accountsEnabled || !a.ready) return null;
  const initials = (a.user?.email ?? "").slice(0, 2).toUpperCase();
  return (
    <Link href={h("/account")} data-testid="account-chip" className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.07] px-3 py-1.5 text-xs text-mist transition hover:border-gold/60">
      {a.user ? <>{(a.user.app_metadata as { role?: string } | undefined)?.role === "admin" && <span className="text-gold" title={c.ui.beta.adminTitle}>★</span>}<span className="grid h-5 w-5 place-items-center rounded-full bg-gradient-to-br from-gold to-rose text-[10px] font-bold text-ink">{initials}</span><span className={`h-1.5 w-1.5 rounded-full ${a.status === "error" ? "bg-rose" : a.status === "syncing" ? "bg-gold animate-pulse" : "bg-emerald-400"}`} /></> : <>☁︎ <span className="hidden whitespace-nowrap xl:inline">{c.ui.auth.chipOut}</span></>}
    </Link>
  );
}

type Cons = { terms: boolean; data: boolean; mkt: boolean };
function Row({ v, set, k, text, req }: { v: Cons; set: (v: Cons) => void; k: keyof Cons; text: React.ReactNode; req?: boolean }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 text-sm leading-snug">
      <Check testId={`consent-${k}`} checked={v[k]} onChange={(x) => set({ ...v, [k]: x })} />
      <span>{text}{req && <span className="text-rose"> *</span>}</span>
    </label>
  );
}
function Consents({ v, set }: { v: { terms: boolean; data: boolean; mkt: boolean }; set: (v: { terms: boolean; data: boolean; mkt: boolean }) => void }) {
  const { c } = useContent(); const A = c.ui.auth; const h = useHref();
  return (
    <fieldset className="space-y-2.5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <legend className="px-1 text-xs uppercase tracking-widest text-gold">{A.consentTitle}</legend>
      <Row v={v} set={set} k="terms" req text={<>{A.consentTerms} <Link className="underline" href={h("/terms")}>{A.termsLink}</Link> · <Link className="underline" href={h("/privacy")}>{A.privacyLink}</Link></>} />
      <Row v={v} set={set} k="data" req text={A.consentData} />
      <Row v={v} set={set} k="mkt" text={A.consentMarketing} />
    </fieldset>
  );
}
const consentTypes = (v: { terms: boolean; data: boolean; mkt: boolean }) => [...(v.terms ? ["terms", "privacy"] : []), ...(v.data ? ["birth_data", "sensitive_quiz_data"] : []), ...(v.mkt ? ["marketing_email"] : [])];

export function AccountPage() {
  const a = useAccount(); const { c, locale } = useContent(); const A = c.ui.auth;
  return (
    <div className="mx-auto max-w-2xl">
      <PageHero eyebrow={A.eyebrow} img="milkyway" emblem="moon" title={<>{A.titleA}<span className="italic text-aurora">{A.titleB}</span></>} sub={A.sub} />
      {!accountsEnabled ? <div className="card text-dim">{A.disabled}</div> : !a.ready ? <p className="text-dim">{c.site.common.loading}</p> : a.user ? <SignedIn /> : <SignInForm key={locale} />}
    </div>
  );
}

function SignInForm() {
  const { c, locale } = useContent(); const A = c.ui.auth; const h = useHref(); const router = useRouter(); const s = useStore();
  const nextParam = useSearchParams().get("next"); const dest = nextParam && /^\/(en|mk)\/[\w\-/]*$/.test(nextParam) ? nextParam : h("/me");
  const [tab, setTab] = useState<"signup" | "login" | "otp">("signup"); const creating = tab === "signup";
  const [sent, setSent] = useState<"" | "signup" | "otp">("");
  const [email, setEmail] = useState(""); const [pw, setPw] = useState(""); const [cons, setCons] = useState({ terms: false, data: false, mkt: false });
  const [busy, setBusy] = useState(false); const [err, setErr] = useState(""); const [info, setInfo] = useState("");
  const needConsent = tab === "otp" || creating;
  const cap = useCaptcha(locale); const captchaToken = cap.token || undefined;
  const meta = { display_name: s?.me?.name ?? null, locale };
  const redirect = () => `${location.origin}/${locale}/auth/callback`;
  const go = async (fn: () => Promise<void>) => {
    setErr(""); setInfo("");
    if (cap.needed) { setErr(A.captchaNeeded); return; }
    setBusy(true); try { await fn(); } catch (e) {
      const k = errKey(e); const o = e as { code?: string; message?: string };
      setErr((A.errors[k] ?? A.errors.generic) + (process.env.NODE_ENV === "development" ? ` [${o?.code ?? k}: ${o?.message ?? ""}]` : ""));
    } finally { setBusy(false); cap.reset(); }
  };
  const checkConsent = () => { if (needConsent && !(cons.terms && cons.data)) { setErr(A.consentNeeded); return false; } return true; };
  const toVerify = (m: Mode) => { sessionStorage.setItem(PENDING_EMAIL, email.trim()); setSent(m); };
  const resendSent = () => go(async () => {
    const auth = sb()!.auth;
    const { error } = sent === "signup" ? await auth.resend({ type: "signup", email: email.trim(), options: { emailRedirectTo: redirect(), captchaToken } }) : await auth.signInWithOtp({ email: email.trim(), options: { shouldCreateUser: true, emailRedirectTo: redirect(), data: meta, captchaToken } });
    if (error) throw error; setInfo(A.resent);
  });

  const sendCode = () => { if (!checkConsent()) return; go(async () => {
    rememberConsents(consentTypes(cons), locale);
    const { error } = await sb()!.auth.signInWithOtp({ email: email.trim(), options: { shouldCreateUser: true, emailRedirectTo: redirect(), data: meta, captchaToken } });
    if (error) throw error; toVerify("otp");
  }); };
  const password = () => { if (!checkConsent()) return; go(async () => {
    const auth = sb()!.auth;
    if (creating) {
      rememberConsents(consentTypes(cons), locale);
      const { data, error } = await auth.signUp({ email: email.trim(), password: pw, options: { emailRedirectTo: redirect(), data: meta, captchaToken } });
      if (error) throw error;
      if (data.user && data.user.identities?.length === 0) throw { code: "user_already_exists" };
      if (!data.session) toVerify("signup"); else router.push(dest);
    } else {
      const { error } = await auth.signInWithPassword({ email: email.trim(), password: pw, options: { captchaToken } });
      if (error) { if (errKey(error) === "email_not_confirmed") { await auth.resend({ type: "signup", email: email.trim(), options: { emailRedirectTo: redirect() } }); toVerify("signup"); return; } throw error; }
      router.push(dest);
    }
  }); };
  const forgot = () => go(async () => {
    if (!email.trim()) throw { code: "email_address_invalid" };
    const { error } = await sb()!.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${location.origin}/${locale}/reset`, captchaToken }); if (error) throw error; setInfo(A.resetSent);
  });
  const google = () => go(async () => { if (!checkConsent()) return; rememberConsents(consentTypes(cons), locale); const { error } = await sb()!.auth.signInWithOAuth({ provider: "google", options: { redirectTo: redirect() } }); if (error) throw error; });

  if (sent) return (
    <div className="card space-y-4 text-center" data-testid="check-email">
      <p className="text-4xl" aria-hidden>✉</p>
      <h2 className="h-display text-3xl">{A.checkTitle}</h2>
      <p className="text-sm leading-relaxed text-mist/90">{sent === "signup" ? A.checkSignup(email.trim()) : A.checkLink(email.trim())}</p>
      <p className="text-xs text-dim">{A.checkInbox}</p>
      {cap.widget}
      {err && <p role="alert" className="text-sm text-rose">{err}</p>}{info && <p role="status" className="text-sm text-gold">{info}</p>}
      <div className="flex flex-wrap justify-center gap-4 text-sm">
        <button type="button" className="text-gold" disabled={busy} onClick={resendSent} data-testid="resend">{A.resend}</button>
        {sent === "otp" && <Link className="text-dim hover:text-mist" href={`${h("/account/verify")}?m=otp&email=${encodeURIComponent(email.trim())}`}>{A.haveCode}</Link>}
        <button type="button" className="text-dim hover:text-mist" onClick={() => { setSent(""); setInfo(""); setErr(""); }}>{A.changeEmail}</button>
      </div>
    </div>
  );

  return (
    <div className="card space-y-5">
      <div className="grid grid-cols-2 gap-1 rounded-full border border-white/10 bg-white/[0.05] p-1" role="tablist">
        {(["signup", "login"] as const).map((t) => (
          <button key={t} type="button" role="tab" aria-selected={tab === t} data-testid={`tab-${t}`} onClick={() => { setTab(t); setErr(""); setInfo(""); }}
            className={`whitespace-nowrap rounded-full px-2 py-2 text-sm transition sm:px-4 ${tab === t ? "bg-gradient-to-r from-gold/90 to-rose/80 font-semibold text-ink shadow" : "text-dim hover:text-mist"}`}>{t === "signup" ? A.tabSignup : A.tabLogin}</button>
        ))}
      </div>
      {googleEnabled && <><button className="btn-ghost w-full" onClick={google} disabled={busy} data-testid="google">
        <svg viewBox="0 0 24 24" className="mr-2 inline h-4 w-4"><path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.9-5.5 3.9-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.3 14.6 2.3 12 2.3 6.7 2.3 2.4 6.6 2.4 12s4.3 9.7 9.6 9.7c5.5 0 9.2-3.9 9.2-9.4 0-.6-.1-1.1-.2-1.6H12z"/></svg>{A.google}</button>
        <div className="flex items-center gap-3 text-xs text-dim"><span className="h-px flex-1 bg-white/10" />{A.or}<span className="h-px flex-1 bg-white/10" /></div></>}
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); if (tab === "otp") sendCode(); else password(); }}>
        <label className="block text-sm"><span className="mb-1 block text-dim">{A.email}</span>
          <input className="input" type="email" required autoComplete="email" data-testid="email" placeholder={A.emailPh} value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        {tab !== "otp" && <label className="block text-sm"><span className="mb-1 block text-dim">{A.password}</span>
          <input className="input" type="password" required minLength={8} data-testid="password" autoComplete={creating ? "new-password" : "current-password"} placeholder={A.passwordPh} value={pw} onChange={(e) => setPw(e.target.value)} /></label>}
        {tab === "otp" && <p className="text-xs text-dim">{A.linkHint}</p>}
        {tab === "signup" && <p className="text-xs text-dim">{A.passwordRule}</p>}
        {!getFlags().signups_open && <p className="text-xs text-gold">✦ {c.ui.beta.badge}: {c.ui.beta.banner}</p>}
        {needConsent && <Consents v={cons} set={setCons} />}
        {cap.widget}
        {err && <p role="alert" data-testid="auth-error" className="rounded-xl border border-rose/40 bg-rose/10 px-3 py-2 text-sm text-rose">{err}</p>}
        {info && <p role="status" className="rounded-xl border border-gold/40 bg-gold/10 px-3 py-2 text-sm">{info}</p>}
        <button className="btn-primary w-full" disabled={busy} data-testid="submit">{busy ? "…" : tab === "otp" ? A.sendLink : creating ? A.createAccount : A.signIn}</button>
      </form>
      <div className="flex flex-wrap justify-between gap-2 text-sm">
        {tab === "login" && <button type="button" className="text-gold underline-offset-4 hover:underline" onClick={forgot} data-testid="forgot">{A.forgot}</button>}
        <button type="button" className="text-dim hover:text-mist" data-testid="toggle-link" onClick={() => { setTab(tab === "otp" ? "login" : "otp"); setErr(""); setInfo(""); }}>{tab === "otp" ? A.usePassword : A.useLink}</button>
      </div>
    </div>
  );
}

/** Step 2: dedicated page for the 6-digit code. */
export function VerifyPage() {
  const { c, locale } = useContent(); const A = c.ui.auth; const h = useHref(); const router = useRouter(); const sp = useSearchParams();
  const mode: Mode = sp.get("m") === "signup" ? "signup" : "otp";
  const [email, setEmail] = useState(""); const [code, setCode] = useState(""); const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(""); const [info, setInfo] = useState(""); const [left, setLeft] = useState(60);
  const cap = useCaptcha(locale);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- read email from URL/sessionStorage after mount
  useEffect(() => { setEmail(sp.get("email") || sessionStorage.getItem(PENDING_EMAIL) || ""); }, [sp]);
  useEffect(() => { if (left <= 0) return; const t = setTimeout(() => setLeft(left - 1), 1000); return () => clearTimeout(t); }, [left]);
  const verify = async (token: string) => {
    if (busy || !/^\d{6}$/.test(token)) return;
    setBusy(true); setErr("");
    try {
      const { error } = await sb()!.auth.verifyOtp({ email, token, type: "email" });
      if (error) throw error;
      sessionStorage.removeItem(PENDING_EMAIL); router.replace(h("/account") + "?welcome=1");
    } catch (e) { const k = errKey(e); setErr(A.errors[k === "generic" ? "invalid_otp" : k] ?? A.errors.generic); setCode(""); } finally { setBusy(false); }
  };
  const resend = async () => {
    setErr(""); setInfo("");
    if (cap.needed) { setErr(A.captchaNeeded); return; }
    const captchaToken = cap.token || undefined;
    const auth = sb()!.auth; const redirectTo = `${location.origin}/${locale}/auth/callback`;
    const { error } = mode === "signup" ? await auth.resend({ type: "signup", email, options: { emailRedirectTo: redirectTo, captchaToken } }) : await auth.signInWithOtp({ email, options: { shouldCreateUser: true, emailRedirectTo: redirectTo, data: { locale }, captchaToken } });
    cap.reset();
    if (error) setErr(A.errors[errKey(error)] ?? A.errors.generic); else { setInfo(A.resent); setLeft(60); }
  };
  return (
    <div className="mx-auto max-w-xl">
      <PageHero eyebrow={A.verifyEyebrow} img="milkyway" emblem="eye" title={A.verifyTitle} sub={email ? (mode === "signup" ? A.confirmSent(email) : A.verifySub(email)) : A.noEmail} />
      {email ? (
        <div className="card space-y-5 text-center">
          <CodeInput value={code} onChange={(v) => { setCode(v); setErr(""); }} onComplete={verify} disabled={busy} label={A.codeLabel} error={!!err} />
          <p className="text-xs text-dim">{A.pasteHint} {A.verifyLinkToo} {A.checkInbox}</p>
          {err && <p role="alert" data-testid="otp-error" className="rounded-xl border border-rose/40 bg-rose/10 px-3 py-2 text-sm text-rose">{err}</p>}
          {info && <p role="status" className="text-sm text-gold">{info}</p>}
          <button className="btn-primary w-full" disabled={busy || code.length !== 6} onClick={() => verify(code)} data-testid="verify">{busy ? A.verifying : A.verify}</button>
          {cap.widget}
          <div className="flex flex-wrap justify-between gap-2 text-sm">
            <button className="text-gold disabled:text-dim" disabled={left > 0} onClick={resend} data-testid="resend">{left > 0 ? A.resendIn(left) : A.resend}</button>
            <Link className="text-dim hover:text-mist" href={h("/account")}>{A.changeEmail}</Link>
          </div>
        </div>
      ) : <Link className="btn-primary" href={h("/account")}>{A.changeEmail}</Link>}
    </div>
  );
}

function SignedIn() {
  const a = useAccount(); const { c, locale } = useContent(); const A = c.ui.auth; const h = useHref(); const fmt = useDate(); const router = useRouter();
  const [cons, setCons] = useState({ terms: false, data: false, mkt: false }); const [msg, setMsg] = useState("");
  const time = (iso: string) => new Date(iso).toLocaleTimeString(locale === "mk" ? "mk-MK" : locale === "de" ? "de-DE" : "en-GB", { hour: "2-digit", minute: "2-digit" });
  return (
    <div className="space-y-4">
      <div className="card space-y-3">
        <p className="font-serif text-xl" data-testid="signed-in">{A.signedInAs(a.user!.email ?? "")}</p>
        {(a.user?.app_metadata as { role?: string } | undefined)?.role === "admin" && (
          <Link href={h("/admin/")} className="flex items-center justify-between gap-3 rounded-2xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm transition hover:border-gold" data-testid="admin-link">
            <span><b className="text-gold">✦ {c.ui.beta.adminTitle}</b><span className="block text-xs text-dim">{c.ui.beta.adminHint}</span></span><span aria-hidden className="text-gold">→</span>
          </Link>
        )}
        <p className="flex items-center gap-2 text-sm"><span className={`h-2 w-2 rounded-full ${a.status === "error" ? "bg-rose" : a.status === "syncing" ? "bg-gold animate-pulse" : a.status === "offline" ? "bg-dim" : "bg-emerald-400"}`} />
          <span data-testid="sync-status">{A.status[a.status]}</span></p>
        {a.lastSync && <p className="text-xs text-dim">{A.lastSync(time(a.lastSync))}</p>}
        {a.pending > 0 && <p className="text-xs text-dim">{A.pending(a.pending)}</p>}
        {a.status === "error" && a.error && a.error !== "consent" && <p className="text-xs text-rose">{a.error}</p>}
        <div className="flex flex-wrap gap-2"><button className="btn-ghost" onClick={() => void pullAndMerge()} data-testid="sync-now">{A.syncNow}</button><Link className="btn-primary" href={h("/me")}>{A.backToProfile}</Link></div>
      </div>
      {a.error === "consent" && (
        <div className="card space-y-3"><p className="text-sm">{A.consentMissing}</p><Consents v={cons} set={setCons} />
          <button className="btn-primary" disabled={!(cons.terms && cons.data)} onClick={() => { rememberConsents(consentTypes(cons), locale); void pullAndMerge(); }}>{A.agreeSync}</button></div>
      )}
      {a.conflict && (
        <div className="card space-y-3 border-gold/40" data-testid="conflict"><p className="font-serif text-lg">{A.conflictTitle}</p><p className="text-sm text-dim">{A.conflictText}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <button className="btn-ghost" onClick={() => void resolveConflict("local")}>{A.keepLocal(a.conflict.local.name, fmt(a.conflict.local.date))}</button>
            <button className="btn-ghost" onClick={() => void resolveConflict("server")}>{A.keepServer(a.conflict.server.name, fmt(a.conflict.server.date))}</button>
          </div></div>
      )}
      <SetPassword />
      <div className="card space-y-2">
        <button className="btn-ghost w-full" data-testid="signout" onClick={async () => { await signOut(false); router.push(h("/")); }}>{A.signOutKeep}</button>
        <button className="btn-ghost w-full" onClick={async () => { await signOut(true); router.push(h("/")); }}>{A.signOutClear}</button>
        <button className="w-full rounded-full px-4 py-2 text-sm text-rose hover:bg-rose/10" data-testid="delete-account" onClick={async () => {
          if (!confirm(A.deleteConfirm)) return; const r = await deleteAccount(); setMsg(r.ok ? A.deleted : r.error ?? A.errors.generic); if (r.ok) router.push(h("/"));
        }}>{A.deleteAccount}</button>
        {msg && <p className="text-sm">{msg}</p>}
      </div>
      <p className="text-xs text-dim" onClick={() => void flush()}>&nbsp;</p>
    </div>
  );
}

/** Landing page for email links (magic link / sign-up confirmation). Supabase puts ?code= (PKCE) or #access_token in the URL; the client picks it up. */
export function CallbackPage() {
  const { c } = useContent(); const A = c.ui.auth; const h = useHref(); const router = useRouter(); const sp = useSearchParams(); const a = useAccount();
  const [late, setLate] = useState(false);
  const errDesc = sp.get("error_description");
  useEffect(() => { if (sp.get("type") === "recovery") router.replace(h("/reset")); }, [sp, router, h]);
  useEffect(() => {
    const client = sb(); if (!client) return;
    const code = sp.get("code");
    // detectSessionInUrl normally does this; doing it here too covers a slow first load.
    if (code) void client.auth.exchangeCodeForSession(code).catch(() => {});
    const t = setTimeout(() => setLate(true), 6000); return () => clearTimeout(t);
  }, [sp]);
  useEffect(() => { if (a.user) router.replace(h("/me")); }, [a.user, router, h]);
  return (
    <div className="mx-auto max-w-xl">
      <PageHero eyebrow={A.eyebrow} img="milkyway" emblem="moon" title={A.finishing} />
      {(errDesc || late) && !a.user && (
        <div className="card space-y-3 text-center" data-testid="callback-fallback">
          <p className="text-sm leading-relaxed">{errDesc ? A.linkProblem : A.confirmedLogin}</p>
          <Link className="btn-primary inline-block" href={h("/account")}>{A.signIn}</Link>
        </div>
      )}
    </div>
  );
}

/** Password reset landing (link from "Forgot password"). The link signs the person in, then they pick a new password. */
export function ResetPage() {
  const { c } = useContent(); const A = c.ui.auth; const h = useHref(); const router = useRouter(); const sp = useSearchParams(); const a = useAccount();
  const [late, setLate] = useState(false);
  useEffect(() => {
    const client = sb(); if (!client) return;
    const code = sp.get("code"); if (code) void client.auth.exchangeCodeForSession(code).catch(() => {});
    const t = setTimeout(() => setLate(true), 6000); return () => clearTimeout(t);
  }, [sp]);
  return (
    <div className="mx-auto max-w-xl">
      <PageHero eyebrow={A.eyebrow} img="milkyway" emblem="moon" title={A.newPassword} />
      {a.user ? <PasswordForm done={() => setTimeout(() => router.replace(h("/me")), 1200)} />
        : late || sp.get("error_description") ? <div className="card space-y-3 text-center"><p className="text-sm">{A.linkProblem}</p><Link className="btn-primary inline-block" href={h("/account")}>{A.signIn}</Link></div>
        : <p className="text-center text-dim">{c.site.common.loading}</p>}
    </div>
  );
}

/** New password form (reset page and account page). */
function PasswordForm({ done }: { done?: () => void }) {
  const { c } = useContent(); const A = c.ui.auth;
  const [pw, setPw] = useState(""); const [pw2, setPw2] = useState(""); const [msg, setMsg] = useState(""); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  return (
    <form className="card space-y-3" data-testid="password-form" onSubmit={async (e) => {
      e.preventDefault(); setErr(""); setMsg("");
      if (pw.length < 8) return setErr(A.passwordRule);
      if (pw !== pw2) return setErr(A.passwordMismatch);
      setBusy(true); const { error } = await sb()!.auth.updateUser({ password: pw }); setBusy(false);
      if (error) setErr(A.errors[errKey(error)] ?? A.errors.generic); else { setMsg(A.passwordSaved); setPw(""); setPw2(""); done?.(); }
    }}>
      <input className="input" type="password" minLength={8} required autoComplete="new-password" placeholder={A.passwordPh} value={pw} onChange={(e) => setPw(e.target.value)} data-testid="new-password" />
      <input className="input" type="password" minLength={8} required autoComplete="new-password" placeholder={A.passwordRepeat} value={pw2} onChange={(e) => setPw2(e.target.value)} />
      <p className="text-xs text-dim">{A.passwordRule}</p>
      {err && <p role="alert" className="text-sm text-rose">{err}</p>}{msg && <p role="status" className="text-sm text-gold">{msg}</p>}
      <button className="btn-primary w-full" disabled={busy}>{busy ? "…" : A.savePassword}</button>
    </form>
  );
}

/** Account page: set a password (for people who joined by link) or change it. */
function SetPassword() {
  const { c } = useContent(); const A = c.ui.auth; const [open, setOpen] = useState(false);
  return (
    <div className="card space-y-3">
      <button type="button" className="flex w-full items-center justify-between text-left" onClick={() => setOpen(!open)} aria-expanded={open} data-testid="set-password">
        <span><b className="font-serif text-lg">{A.setPasswordTitle}</b><span className="block text-xs text-dim">{A.setPasswordHint}</span></span><span aria-hidden className="text-gold">{open ? "−" : "+"}</span>
      </button>
      {open && <PasswordForm />}
    </div>
  );
}
