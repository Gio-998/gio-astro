"use client";
import { localePath } from "@/lib/horo-slugs";
import Link from "next/link";
import { useBetaLocked } from "./auth/Beta";
import { AccountChip } from "./auth/Auth";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Flag } from "./art/Flag";
import { DesktopNav, MoreSheet, TabBar, useNav } from "./nav/Nav";
import { useContent, useHref } from "@/lib/content-context";
import { ZodiacWheel } from "./art/ZodiacWheel";
import { LOCALES } from "@/content";
import { playFor } from "./play/content";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <circle cx="20" cy="20" r="18" fill="none" stroke="url(#lg-g)" strokeWidth="1.2" />
      <path d="M26 9 A12 12 0 1 0 26 31 A9.5 12 0 1 1 26 9 Z" fill="url(#lg-g)" opacity=".9" />
      <path d="M27 17 l1 3 3 1 -3 1 -1 3 -1 -3 -3 -1 3 -1z" fill="#fffaf0" />
    </svg>
  );
}

/** Language menu: flag + short code; picking a language stores it (cookie for the edge redirect on "/", localStorage for the root page). */
export function LangSwitch({ className = "" }: { className?: string }) {
  const { c, locale } = useContent(); const path = usePathname() || "/";
  const [open, setOpen] = useState(false); const ref = useRef<HTMLDivElement>(null); const id = useId();
  useEffect(() => {
    if (!open) return;
    const off = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", off); document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", off); document.removeEventListener("keydown", esc); };
  }, [open]);
  const code = (l: string) => (l === "mk" ? "мк" : l);
  const names = c.site.languages as Record<string, string>;
  return (
    <div ref={ref} className={`relative shrink-0 text-xs ${className}`}>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls={id} aria-haspopup="true"
        aria-label={`${c.site.language}: ${names[locale] ?? locale}`}
        className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2 py-1.5 font-semibold uppercase tracking-wider text-mist transition hover:bg-white/10">
        <Flag code={locale} className="h-3 w-[18px]" /><span>{code(locale)}</span>
        <svg viewBox="0 0 10 6" className={`h-1.5 w-2.5 transition ${open ? "rotate-180" : ""}`} aria-hidden><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
      </button>
      {open && (
        <ul id={id} role="list" className="absolute right-0 top-full z-50 mt-1.5 min-w-[150px] rounded-2xl border border-white/15 bg-[#17123a]/95 p-1 shadow-xl backdrop-blur">
          {LOCALES.map((l) => {
            const href = localePath(path, l) || `/${l}/`;
            return (
              <li key={l}>
                <a href={href} hrefLang={l} lang={l} aria-current={l === locale ? "true" : undefined}
                  onClick={(e) => { e.preventDefault(); try { localStorage.setItem("mirrorstar:lang", l); document.cookie = `lang=${l}; path=/; max-age=31536000; SameSite=Lax`; } catch {} window.location.href = href + window.location.search + window.location.hash; }}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-2.5 py-2 text-sm transition ${l === locale ? "bg-gold/15 text-gold" : "text-mist hover:bg-white/10"}`}>
                  <Flag code={l} className="h-3.5 w-[21px]" /><span>{names[l] ?? l}</span>{l === locale && <span className="ml-auto" aria-hidden>✓</span>}
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/** Same-page taps scroll smoothly to the top; cross-page landing at the top is handled globally by RouteScrollTop. */
function useToTop() {
  const path = usePathname() || "/";
  return useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = new URL(e.currentTarget.href, window.location.href).pathname;
    const norm = (p: string) => p.replace(/\/+$/, "");
    if (norm(target) === norm(path)) { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    // cross-page: RouteScrollTop (layout) lands the new page at the top
  }, [path]);
}

export function Header() {
  const toTop = useToTop();
  const { c } = useContent(); const h = useHref(); const N = useNav();
  const [scrolled, setScrolled] = useState(false);
  const [guestMenu, setGuestMenu] = useState(false); const closeGuest = useCallback(() => setGuestMenu(false), []);
  useEffect(() => { const f = () => setScrolled(window.scrollY > 24); f(); window.addEventListener("scroll", f, { passive: true }); return () => window.removeEventListener("scroll", f); }, []);
  const locked = useBetaLocked(); const B = c.ui.beta;
  const joinHref = `${h("/")}#waitlist`;
  const bar = `sticky top-0 z-40 transition-all duration-500 ${scrolled ? "border-b border-white/10 bg-night/70 shadow-[0_10px_40px_-20px_rgba(0,0,0,.6)] backdrop-blur-xl" : "bg-transparent"}`;
  const logo = (
    <Link href={h("/")} aria-label={c.site.brand} className="group flex shrink-0 items-center gap-1.5 sm:gap-2">
      <Logo className="h-8 w-8 shrink-0 transition min-[380px]:h-6 min-[380px]:w-6 min-[400px]:h-7 min-[400px]:w-7 duration-700 group-hover:rotate-[20deg] sm:h-8 sm:w-8" />
      <span className="h-display hidden text-[1.05rem] font-semibold tracking-normal text-aurora min-[380px]:inline min-[460px]:text-lg sm:text-2xl sm:tracking-wide">{c.site.brand}</span>
    </Link>
  );
  if (locked) return (
    <>
      <header className={bar} data-testid="header-guest">
        <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3">
          {logo}
          <div className="hidden lg:block"><DesktopNav keys={["tests", "discover"]} showToday={false} /></div>
          <nav aria-label={N.aria.utility} className="flex items-center gap-1.5 text-sm">
            <LangSwitch className="lg:ml-2" />
            <Link href={h("/account/")} className="ml-1 hidden whitespace-nowrap rounded-full px-3 py-1.5 text-mist hover:text-gold lg:inline" data-testid="nav-login">{B.login}</Link>
            <a href={joinHref} className="btn-primary ml-1 hidden whitespace-nowrap !py-2 lg:inline-flex" data-testid="nav-join">{B.joinBeta} ✦</a>
            <button type="button" onClick={() => setGuestMenu(true)} aria-haspopup="dialog" aria-expanded={guestMenu} aria-label={N.menu} data-testid="guest-menu"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 text-mist lg:hidden">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden><path d="M4 7h16M4 12h16M4 17h10" /></svg>
            </button>
          </nav>
        </div>
      </header>
      {/* Phones: the two guest actions live in a bottom bar where the app tabs would be; everything else is in the menu sheet. */}
      <nav aria-label={N.aria.quick} className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-2 gap-2 rounded-3xl border border-white/15 bg-ink/85 p-2 shadow-[0_20px_50px_-15px_rgba(0,0,0,.8)] backdrop-blur-xl lg:hidden" data-testid="guest-bar">
        <Link href={h("/account/")} className="btn-ghost !py-2.5 text-center text-sm" data-testid="bar-login">{B.login}</Link>
        <a href={joinHref} className="btn-primary !py-2.5 text-center text-sm" data-testid="bar-join">{B.joinBeta} ✦</a>
      </nav>
      <MoreSheet open={guestMenu} onClose={closeGuest} keys={["tests", "discover"]} />
    </>
  );
  return (
    <>
      <header className={bar}>
        <div className="relative mx-auto flex max-w-6xl min-w-0 items-center justify-between gap-2 px-4 py-3">
          {logo}
          <div className="hidden lg:block"><DesktopNav keys={["me", "bonds", "tests", "discover"]} /></div>
          <div className="flex min-w-0 shrink items-center gap-1 min-[420px]:gap-1.5 sm:gap-2">
            <LangSwitch />
            <AccountChip />
            <Link href={h("/start/")} onClick={toTop} className="btn-primary inline-flex shrink-0 whitespace-nowrap !min-h-0 !px-2.5 !py-1.5 text-[11px] leading-none min-[420px]:text-xs sm:!px-4 lg:!py-2 lg:text-sm" data-testid="nav-start">{c.site.startShort}<span className="hidden min-[460px]:inline">&nbsp;✦</span></Link>
          </div>
        </div>
      </header>
      <TabBar />
    </>
  );
}

export function Footer() {
  const { c, locale } = useContent(); const h = useHref(); const F = c.site.footerCols; const locked = useBetaLocked(); const toTop = useToTop();
  const cols = [
    ...(locked ? [{ t: F.discover, l: [["/quizzes/", F.quizzes], ["/learn/", c.site.nav.learn]] }] : [
    { t: F.discover, l: [["/start/", F.chart], ["/me/", F.me], ["/you/", c.you.title], ["/today/", F.today], ["/quizzes/", F.quizzes], ["/play/", playFor(locale).brand]] },
    { t: F.rel, l: [["/match/", F.match], ["/bond/", F.bond], ["/people/", F.people]] }]),
    { t: F.trust, l: [["/how-it-works/", c.systems.how.link], ["/promise/", c.site.footer.promise], ["/learn/", c.site.footer.learn], ["/privacy/", c.site.footer.privacy], ["/terms/", c.site.footer.terms], ["/premium/", F.extras], ["/partners/", c.partners.eyebrow], ["/credits/", c.site.footer.credits]] },
  ];
  return (
    <footer className="relative mt-20 overflow-hidden border-t border-white/10 bg-gradient-to-b from-transparent to-ink/80">
      <ZodiacWheel className="pointer-events-none absolute -right-40 -top-24 h-[520px] w-[520px] animate-spin-slow opacity-[0.12]" />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-32 pt-14 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:pb-14">
        <div>
          <Link href={h("/")} onClick={toTop} className="mb-3 flex items-center gap-2"><Logo className="h-9 w-9" /><span className="h-display text-3xl text-aurora">{c.site.brand}</span></Link>
          <p className="mb-4 max-w-xs text-sm text-dim">{c.site.tagline}. {F.blurb}</p>
          {locked ? <a href={`${h("/")}#waitlist`} className="btn-primary">{c.ui.beta.joinBeta} ✦</a> : <Link href={h("/start/")} onClick={toTop} className="btn-primary" data-testid="footer-start">{c.site.common.start} ✦</Link>}
          <p className="mt-5 text-sm text-dim"><a className="transition hover:text-gold" href="mailto:contact@horoscop.si" data-testid="footer-email">✉ contact@horoscop.si</a></p>
        </div>
        {cols.map((col) => (
          <div key={col.t}>
            <p className="eyebrow mb-3">{col.t}</p>
            <ul className="space-y-2 text-sm">{col.l.map(([href, label]) => <li key={href}><Link className="text-dim transition hover:text-gold" href={h(href)} onClick={toTop}>{label}</Link></li>)}</ul>
          </div>
        ))}
      </div>
    </footer>
  );
}
