"use client";
/**
 * Store app implementation of "@/app-mode" (see ./index.ts for the website stubs and the contract).
 * Only `npm run build:app` bundles this file. Nothing here may name libraries, vendors or tools in visible text.
 */
import "./native.css";
import Link from "next/link";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import { SplashScreen } from "@capacitor/splash-screen";
import { StatusBar, Style } from "@capacitor/status-bar";
import { LocalNotifications } from "@capacitor/local-notifications";
import { addDays, todayIso } from "@/engine/skyday";
import { SIGNS, SIGN_GLYPH, type Sign } from "@/engine/zodiac";
import { horoPath, reading } from "@/lib/horoscope";
import { parsePath } from "@/lib/i18n-routes";
import { useContent, useHref } from "@/lib/content-context";
import { DailyHoroscope } from "@/components/horoscope/DailyHoroscope";
import { Emblem, type EmblemId } from "@/components/art/Emblem";
import type * as Web from "./index";
import { isBundled } from "./routes";
import { appCopy } from "./copy";
import { KEEP_DAYS, cachedReading, clearCache } from "./horo-cache";
import { clearPrefs, dismissReminderPrompt, preferredSign, rememberSign, reminderPrefs, reminderPromptDismissed, recordTodayVisit, saveReminderPrefs, shouldOfferReminder } from "./prefs";
import { cancelReminders, notificationStatus, requestPermission, scheduleReminders } from "./reminders";
import { clearWidget, updateWidget } from "./widget";

const SITE = "https://horoscop.si";
const NEW_DAY = "horoscop:newday";
/** Sections that lead to payment. The store app never opens them, not even on the website (store rules). */
const COMMERCE = new Set(["pricing", "premium", "upgrade"]);
const PAYMENT_HOSTS = /(^|\.)(lemonsqueezy\.com|paddle\.com|stripe\.com|checkout\.)/;

export const isNativeApp: typeof Web.isNativeApp = () => Capacitor.isNativePlatform();
/** Store purchases (StoreKit / Play Billing) come later; until then the app offers no purchase at all. */
export const purchaseChannel: typeof Web.purchaseChannel = () => "none";
export const authOrigin: typeof Web.authOrigin = () => (Capacitor.isNativePlatform() ? SITE : location.origin);

const langOf = (path: string) => parsePath(path.endsWith("/") ? path : `${path}/`)?.[0] ?? "en";
const sectionOf = (path: string) => parsePath(path.endsWith("/") ? path : `${path}/`)?.[1].split("/")[1] ?? "";

/* ───────── daily text for the device's own date ───────── */

const windowDays = (today: string) => Array.from({ length: KEEP_DAYS + 1 }, (_, i) => addDays(today, i - KEEP_DAYS));

/** Today's date in Europe/Skopje, refreshed when the app returns to the foreground on a new day. */
function useToday(): string | null {
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => {
    const f = () => setToday(todayIso());
    const id = requestAnimationFrame(f);
    window.addEventListener(NEW_DAY, f);
    return () => { cancelAnimationFrame(id); window.removeEventListener(NEW_DAY, f); };
  }, []);
  return today;
}

const Skeleton = () => <div aria-busy className="mx-auto min-h-[70vh] max-w-xl animate-pulse rounded-[28px] border border-white/10 bg-white/[0.03]" />;

function LiveDay({ lang, sign }: Web.LiveDayProps) {
  const today = useToday(); const q = useSearchParams().get("d");
  const days = useMemo(() => (today ? windowDays(today) : []), [today]);
  const iso = today ? (q && days.includes(q) ? q : today) : null;
  useEffect(() => { if (!iso) return; rememberSign(sign); cachedReading(lang, sign, iso); }, [lang, sign, iso]);
  if (!today || !iso) return <Skeleton />;
  const href = (s: Sign, d?: string) => (d && d !== today ? `${horoPath(lang, s)}?d=${d}` : horoPath(lang, s));
  return <DailyHoroscope key={iso} lang={lang} sign={sign} iso={iso} isToday={iso === today} live={{ days, href }} />;
}
/** The prerendered HTML is only a placeholder: the reading is computed for the device's own today (and the 14 days before it via ?d=). */
export const LiveDailyHoroscope: typeof Web.LiveDailyHoroscope = (p) => <Suspense fallback={<Skeleton />}><LiveDay {...p} /></Suspense>;

export const LiveHub: typeof Web.LiveHub = ({ lang }) => {
  const today = useToday();
  if (!today) return <Skeleton />;
  return (
    <ul className="grid grid-cols-1 gap-2" data-testid="live-hub">
      {SIGNS.map((s) => { const r = reading(lang, s, today); return (
        <li key={s}>
          <Link href={horoPath(lang, s)} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3">
            {/* eslint-disable-next-line @next/next/no-img-element -- static SVG bundled in the app */}
            <img src={`/art/sign/${s}.svg`} alt="" width={44} height={44} className="h-11 w-11 shrink-0 rounded-full bg-white/[0.04]" />
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-medium"><span className="text-gold">{SIGN_GLYPH[s]}</span> {r.signName}</span>
              <span className="mt-0.5 block text-pretty text-[13px] leading-snug text-mist/70">{r.headline}</span>
            </span>
            <span aria-hidden className="text-mist/40">→</span>
          </Link>
        </li>); })}
    </ul>
  );
};

/* ───────── bottom tabs ───────── */

export const AppTabBar: typeof Web.AppTabBar = () => {
  const { locale } = useContent(); const h = useHref(); const path = usePathname() || ""; const T = appCopy(locale).tabs;
  const [mySign, setMySign] = useState<Sign | null>(null);
  useEffect(() => { const id = requestAnimationFrame(() => setMySign(preferredSign())); return () => cancelAnimationFrame(id); }, [path]);
  const tabs: { key: string; href: string; icon: EmblemId; label: string; also: string[] }[] = [
    { key: "today", href: h("/today/"), icon: "moon", label: T.today, also: [] },
    { key: "horoscope", href: mySign ? horoPath(locale, mySign) : h("/horoscope/"), icon: "sun", label: T.horoscope, also: [h("/horoscope/"), h("/daily/")] },
    { key: "tests", href: h("/quizzes/"), icon: "big-five", label: T.tests, also: [h("/quiz/"), h("/deep/"), h("/play/")] },
    { key: "bonds", href: h("/match/"), icon: "bond", label: T.bonds, also: [h("/bond/"), h("/people/"), h("/person/"), h("/challenge/")] },
    { key: "profile", href: h("/me/"), icon: "chart", label: T.profile, also: [h("/account/"), h("/you/"), h("/start/"), h("/chart/")] },
  ];
  const bar = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = bar.current; if (!el) return;
    const set = () => document.documentElement.style.setProperty("--app-tab-h", `${el.offsetHeight}px`);
    set();
    const ro = new ResizeObserver(set); ro.observe(el);
    return () => { ro.disconnect(); };
  }, []);
  return (
    <nav ref={bar} aria-label={T.aria} className="fixed inset-x-0 bottom-0 z-[56] grid grid-cols-5 border-t border-white/10 bg-ink/95 pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] backdrop-blur-xl" data-testid="app-tab-bar">
      {tabs.map((t) => { const on = [t.href, ...t.also].some((x) => path.startsWith(x.split("?")[0])); return (
        <Link prefetch={false} key={t.key} href={t.href} aria-label={t.label} aria-current={on ? "page" : undefined} data-testid={`app-tab-${t.key}`} className={`flex min-h-[3.75rem] min-w-0 flex-col items-center justify-center gap-0.5 px-0.5 py-1 text-center text-[0.65rem] leading-tight transition ${on ? "text-gold" : "text-mist/70"}`}>
          <Emblem id={t.icon} className={`h-6 w-6 shrink-0 ${on ? "" : "opacity-75"}`} /><span className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap">{t.label}</span>
        </Link>); })}
    </nav>
  );
};

/* ───────── morning reminder ───────── */

export const ReminderCard: typeof Web.ReminderCard = () => {
  const { c, locale } = useContent(); const T = appCopy(locale).reminder;
  const [p, setP] = useState<ReturnType<typeof reminderPrefs>>({ on: false, hour: 8, minute: 0, sign: null });
  const [sign, setSign] = useState<Sign | "">(""); const [msg, setMsg] = useState(""); const [native, setNative] = useState(false);
  useEffect(() => { const id = requestAnimationFrame(() => { const r = reminderPrefs(); setP(r); setSign(r.sign ?? preferredSign() ?? ""); setNative(Capacitor.isNativePlatform()); }); return () => cancelAnimationFrame(id); }, []);
  if (!native) return null;
  const time = `${String(p.hour).padStart(2, "0")}:${String(p.minute).padStart(2, "0")}`;
  const applyOn = async (wantOn: boolean): Promise<ReminderOn> => {
    if (!wantOn) return "off";
    const status = await notificationStatus();
    if (status === "granted") return "granted";
    if (status !== "prompt" && status !== "prompt-with-rationale") return "denied";
    const consented = await askReminderConsent();
    if (!consented) return "cancelled";
    return (await requestPermission()) ? "granted" : "denied";
  };
  const save = async () => {
    setMsg("");
    const next = { ...p, sign: sign || null }; const result = await applyOn(next.on);
    if (result === "cancelled") { setP({ ...p, on: false }); return; }
    if (result === "denied") next.on = false;
    if (result === "off") next.on = false;
    saveReminderPrefs(next); setP(next);
    await scheduleReminders(locale); await updateWidget(locale);
    setMsg(result === "denied" ? T.denied : next.on ? T.saved : T.off);
  };
  return (
    <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-4" data-testid="reminder-card">
      <h2 className="h-display text-[1.35rem] leading-tight">{T.title}</h2>
      <p className="mt-1 text-[14px] leading-snug text-mist/75">{T.sub}</p>
      <div className="mt-4 space-y-3">
        <label className="flex min-h-11 items-center justify-between gap-3 text-[15px]">
          <span>{T.toggle}</span>
          <input type="checkbox" className="h-6 w-6 shrink-0 accent-[#e9c78a]" checked={p.on} onChange={(e) => { const on = e.target.checked; setP({ ...p, on }); }} data-testid="reminder-on" />
        </label>
        <label className="block text-[14px]"><span className="mb-1 block text-mist/70">{T.time}</span>
          <input type="time" className="input w-full" value={time} onChange={(e) => { const [hh, mm] = e.target.value.split(":").map(Number); if (!Number.isNaN(hh)) setP({ ...p, hour: hh, minute: mm || 0 }); }} />
        </label>
        <label className="block text-[14px]"><span className="mb-1 block text-mist/70">{T.sign}</span>
          <select className="input w-full" value={sign} onChange={(e) => setSign(e.target.value as Sign)}>
            <option value="" disabled>—</option>
            {SIGNS.map((s) => <option key={s} value={s}>{SIGN_GLYPH[s]} {c.astro.signs[s].name}</option>)}
          </select>
        </label>
        <button type="button" className="btn-primary w-full" onClick={save} data-testid="reminder-save">{T.save}</button>
        {msg && <p role="status" className="text-[14px] text-gold">{msg}</p>}
      </div>
    </section>
  );
};

/* ───────── sign-in ───────── */

const sha256Hex = async (s: string) => Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)))).map((b) => b.toString(16).padStart(2, "0")).join("");

/**
 * Apple on iOS: the system sheet, then signInWithIdToken (needs the bundle id si.horoscop.app among the Apple provider's client IDs).
 * Apple on Android and Google everywhere in the app: the provider page opens in the system browser (Google refuses embedded web views)
 * and returns through the App Link https://horoscop.si/<lang>/auth/callback/ → appUrlOpen → the callback page finishes the sign-in.
 * A native Google id-token flow is a later step (docs/MOBILE.md).
 */
export const signInWithProvider: typeof Web.signInWithProvider = async (auth, provider, locale) => {
  if (!Capacitor.isNativePlatform()) {
    const { error } = await auth.signInWithOAuth({ provider, options: { redirectTo: `${location.origin}/${locale}/auth/callback` } });
    if (error) throw error; return;
  }
  if (provider === "apple" && Capacitor.getPlatform() === "ios") {
    const { SignInWithApple } = await import("@capacitor-community/apple-sign-in");
    const raw = Array.from(crypto.getRandomValues(new Uint8Array(32))).map((b) => b.toString(16).padStart(2, "0")).join("");
    const res = await SignInWithApple.authorize({ clientId: "si.horoscop.app", redirectURI: `${SITE}/${locale}/auth/callback`, scopes: "email name", nonce: await sha256Hex(raw) });
    const { error } = await auth.signInWithIdToken({ provider: "apple", token: res.response.identityToken, nonce: raw });
    if (error) throw error;
    // Apple sends the name only the first time.
    const name = [res.response.givenName, res.response.familyName].filter(Boolean).join(" ");
    if (name) await auth.updateUser({ data: { display_name: name } });
    return;
  }
  const { data, error } = await auth.signInWithOAuth({ provider, options: { redirectTo: `${SITE}/${locale}/auth/callback`, skipBrowserRedirect: true } });
  if (error) throw error;
  if (data?.url) await Browser.open({ url: data.url, presentationStyle: "popover" });
};

export const clearNativeData: typeof Web.clearNativeData = async () => {
  clearCache(); clearPrefs(); await cancelReminders(); await clearWidget();
};


type ReminderOn = "granted" | "denied" | "cancelled" | "off";
const CONSENT_EVT = "horoscop:reminder-consent";
let consentWaiter: ((ok: boolean) => void) | null = null;
function askReminderConsent(): Promise<boolean> {
  return new Promise((resolve) => {
    consentWaiter?.(false);
    consentWaiter = resolve;
    window.dispatchEvent(new Event(CONSENT_EVT));
  });
}
function settleReminderConsent(ok: boolean) {
  const w = consentWaiter; consentWaiter = null; w?.(ok);
}

/** In-app explanation shown before the OS notification dialog: never on first launch. */
function ReminderPrePrompt() {
  const { locale } = useContent(); const T = appCopy(locale).reminder; const path = usePathname() || "";
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onAsk = () => setOpen(true);
    window.addEventListener(CONSENT_EVT, onAsk);
    return () => window.removeEventListener(CONSENT_EVT, onAsk);
  }, []);
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    if (sectionOf(path) !== "today") return;
    const visits = recordTodayVisit();
    let cancelled = false;
    void notificationStatus().then((permission) => {
      if (cancelled) return;
      if (shouldOfferReminder({ visitCount: visits, hasSign: !!preferredSign(), reminderOn: reminderPrefs().on, dismissed: reminderPromptDismissed(), permission })) setOpen(true);
    });
    return () => { cancelled = true; };
  }, [path]);
  if (!open) return null;
  const later = () => { setOpen(false); dismissReminderPrompt(); settleReminderConsent(false); };
  const allow = async () => {
    const fromToggle = !!consentWaiter;
    setOpen(false);
    if (fromToggle) { settleReminderConsent(true); return; }
    dismissReminderPrompt();
    if (!(await requestPermission())) return;
    const cur = reminderPrefs();
    saveReminderPrefs({ ...cur, on: true, sign: cur.sign ?? preferredSign() });
    await scheduleReminders(locale); await updateWidget(locale);
  };
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 p-4 pb-[max(1rem,calc(var(--app-tab-h, 5rem) + 0.5rem))] pt-[max(1rem,env(safe-area-inset-top))] sm:items-center" role="dialog" aria-modal="true" aria-labelledby="reminder-preprompt-title" data-testid="reminder-preprompt">
      <button type="button" className="absolute inset-0 cursor-default" aria-label={T.promptLater} onClick={later} />
      <div className="relative w-full max-w-md space-y-4 overflow-y-auto rounded-3xl border border-white/15 bg-night p-5 shadow-2xl">
        <h2 id="reminder-preprompt-title" className="h-display text-pretty text-2xl leading-tight">{T.promptTitle}</h2>
        <p className="text-pretty text-[1rem] leading-relaxed text-mist/90">{T.promptBody}</p>
        <div className="grid grid-cols-1 gap-2">
          <button type="button" className="btn-primary w-full" data-testid="reminder-preprompt-allow" onClick={() => void allow()}>{T.promptAllow}</button>
          <button type="button" className="btn-ghost w-full" data-testid="reminder-preprompt-later" onClick={later}>{T.promptLater}</button>
        </div>
      </div>
    </div>
  );
}

/* ───────── boot ───────── */

/** Turns an incoming link (https://horoscop.si/... or si.horoscop.app://...) into an in-app path. */
function incomingPath(raw: string, lang: string): string | null {
  try {
    const u = new URL(raw);
    let p = u.protocol === "si.horoscop.app:" ? `/${u.host}${u.pathname}` : u.pathname;
    p = p.replace(/\/{2,}/g, "/");
    if (!/^\/[a-z]{2}(\/|$)/.test(p)) p = `/${lang}${p}`;
    if (!p.endsWith("/")) p += "/";
    return p + u.search + u.hash;
  } catch { return null; }
}

export const NativeBoot: typeof Web.NativeBoot = () => {
  const router = useRouter(); const { locale } = useContent();
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    const html = document.documentElement; html.classList.add("native"); html.dataset.platform = Capacitor.getPlatform();
    try { localStorage.setItem("mirrorstar:lang", locale); } catch {}
    StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
    SplashScreen.hide({ fadeOutDuration: 200 }).catch(() => {});

    let day = todayIso();
    const refresh = () => { setTimeout(() => { scheduleReminders(locale).catch(() => {}); updateWidget(locale).catch(() => {}); }, 400); };
    refresh();

    // Links to pages the app does not ship open on the website; payment pages never open.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null; if (!a) return;
      const url = new URL(a.href, location.href);
      if (url.protocol === "mailto:" || url.protocol === "tel:") return;
      if (url.origin === location.origin || url.origin === SITE || url.origin === "https://www.horoscop.si") {
        if (COMMERCE.has(sectionOf(url.pathname))) { e.preventDefault(); e.stopPropagation(); return; }
        if (url.origin === location.origin && isBundled(url.pathname)) return;
        if (url.origin !== location.origin && isBundled(url.pathname)) { e.preventDefault(); e.stopPropagation(); router.push(url.pathname + url.search + url.hash); return; }
        e.preventDefault(); e.stopPropagation(); Browser.open({ url: SITE + url.pathname + url.search + url.hash }).catch(() => {}); return;
      }
      if (/^https?:$/.test(url.protocol)) {
        e.preventDefault(); e.stopPropagation();
        if (!PAYMENT_HOSTS.test(url.hostname)) Browser.open({ url: url.href }).catch(() => {});
      }
    };
    window.addEventListener("click", onClick, true);

    const subs = [
      App.addListener("appUrlOpen", ({ url }) => {
        const p = incomingPath(url, langOf(location.pathname)); if (!p) return;
        Browser.close().catch(() => {});
        const pathname = p.split(/[?#]/)[0];
        if (COMMERCE.has(sectionOf(pathname))) return;
        if (isBundled(pathname)) router.push(p); else Browser.open({ url: SITE + p }).catch(() => {});
      }),
      App.addListener("appStateChange", ({ isActive }) => {
        if (!isActive) return;
        const t = todayIso(); if (t !== day) { day = t; window.dispatchEvent(new Event(NEW_DAY)); }
        refresh();
      }),
      App.addListener("backButton", ({ canGoBack }) => { if (canGoBack) history.back(); else App.exitApp(); }),
      LocalNotifications.addListener("localNotificationActionPerformed", ({ notification }) => {
        const path = (notification.extra as { path?: string } | undefined)?.path; if (path && isBundled(path)) router.push(path);
      }),
    ];
    return () => { window.removeEventListener("click", onClick, true); subs.forEach((s) => s.then((h) => h.remove()).catch(() => {})); };
  }, [router, locale]);
  return <ReminderPrePrompt />;
};
