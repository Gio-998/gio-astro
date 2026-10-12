"use client";
import Link from "next/link";
import { useBetaLocked } from "./auth/Beta";
import { AccountChip } from "./auth/Auth";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
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

export function LangSwitch({ className = "" }: { className?: string }) {
  const { c, locale } = useContent(); const path = usePathname() || "/";
  return (
    <div className={`flex items-center rounded-full border border-white/15 bg-white/5 p-0.5 text-xs ${className}`} role="group" aria-label={c.site.language}>
      {LOCALES.map((l) => {
        const href = path.replace(/^\/(en|mk)(?=\/|$)/, `/${l}`) || `/${l}/`;
        return <a key={l} href={href} hrefLang={l} lang={l} title={c.site.languages[l]}
          onClick={(e) => { e.preventDefault(); try { localStorage.setItem("mirrorstar:lang", l); } catch {} window.location.href = href + window.location.search + window.location.hash; }}
          className={`rounded-full px-2.5 py-1 font-semibold uppercase tracking-wider transition ${l === locale ? "bg-gold text-plum" : "text-dim hover:text-mist"}`}>{l === "mk" ? "мк" : l}</a>;
      })}
    </div>
  );
}

export function Header() {
  const { c } = useContent(); const h = useHref(); const N = useNav();
  const [scrolled, setScrolled] = useState(false);
  const [guestMenu, setGuestMenu] = useState(false); const closeGuest = useCallback(() => setGuestMenu(false), []);
  useEffect(() => { const f = () => setScrolled(window.scrollY > 24); f(); window.addEventListener("scroll", f, { passive: true }); return () => window.removeEventListener("scroll", f); }, []);
  const locked = useBetaLocked(); const B = c.ui.beta;
  const joinHref = `${h("/")}#waitlist`;
  const bar = `sticky top-0 z-40 transition-all duration-500 ${scrolled ? "border-b border-white/10 bg-night/70 shadow-[0_10px_40px_-20px_rgba(0,0,0,.6)] backdrop-blur-xl" : "bg-transparent"}`;
  const logo = (
    <Link href={h("/")} className="group flex shrink-0 items-center gap-2">
      <Logo className="h-8 w-8 shrink-0 transition duration-700 group-hover:rotate-[20deg]" />
      <span className="h-display text-2xl font-semibold tracking-wide text-aurora">{c.site.brand}</span>
    </Link>
  );
  if (locked) return (
    <>
      <header className={bar} data-testid="header-guest">
        <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3">
          {logo}
          <div className="hidden lg:block"><DesktopNav keys={["tests", "discover"]} showToday={false} /></div>
          <nav className="flex items-center gap-1.5 text-sm">
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
      <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-2 gap-2 rounded-3xl border border-white/15 bg-ink/85 p-2 shadow-[0_20px_50px_-15px_rgba(0,0,0,.8)] backdrop-blur-xl lg:hidden" data-testid="guest-bar">
        <Link href={h("/account/")} className="btn-ghost !py-2.5 text-center text-sm" data-testid="bar-login">{B.login}</Link>
        <a href={joinHref} className="btn-primary !py-2.5 text-center text-sm" data-testid="bar-join">{B.joinBeta} ✦</a>
      </nav>
      <MoreSheet open={guestMenu} onClose={closeGuest} keys={["tests", "discover"]} />
    </>
  );
  return (
    <>
      <header className={bar}>
        <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3">
          {logo}
          <div className="hidden lg:block"><DesktopNav keys={["me", "bonds", "tests", "discover"]} /></div>
          <div className="flex items-center gap-2">
            <LangSwitch />
            <AccountChip />
            <Link href={h("/start/")} className="btn-primary hidden whitespace-nowrap !px-4 !py-1.5 text-xs min-[420px]:inline-flex lg:!py-2 lg:text-sm">{c.site.startShort} ✦</Link>
          </div>
        </div>
      </header>
      <TabBar />
    </>
  );
}

export function Footer() {
  const { c, locale } = useContent(); const h = useHref(); const F = c.site.footerCols; const locked = useBetaLocked();
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
          <Link href={h("/")} className="mb-3 flex items-center gap-2"><Logo className="h-9 w-9" /><span className="h-display text-3xl text-aurora">{c.site.brand}</span></Link>
          <p className="mb-4 max-w-xs text-sm text-dim">{c.site.tagline}. {F.blurb}</p>
          {locked ? <a href={`${h("/")}#waitlist`} className="btn-primary">{c.ui.beta.joinBeta} ✦</a> : <Link href={h("/start/")} className="btn-primary">{c.site.common.start} ✦</Link>}
        </div>
        {cols.map((col) => (
          <div key={col.t}>
            <p className="eyebrow mb-3">{col.t}</p>
            <ul className="space-y-2 text-sm">{col.l.map(([href, label]) => <li key={href}><Link className="text-dim transition hover:text-gold" href={h(href)}>{label}</Link></li>)}</ul>
          </div>
        ))}
      </div>
    </footer>
  );
}
