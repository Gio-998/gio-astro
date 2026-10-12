"use client";
import Link from "next/link";
import { AccountChip } from "./auth/Auth";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useContent, useHref } from "@/lib/content-context";
import { Emblem, EmblemId } from "./art/Emblem";
import { ZodiacWheel } from "./art/ZodiacWheel";
import { LOCALES } from "@/content";

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
  const { c } = useContent(); const h = useHref(); const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const f = () => setScrolled(window.scrollY > 24); f(); window.addEventListener("scroll", f, { passive: true }); return () => window.removeEventListener("scroll", f); }, []);
  const tabs: { href: string; label: string; icon: EmblemId }[] = [
    { href: "/today/", label: c.site.nav.today, icon: "sun" },
    { href: "/me/", label: c.site.nav.me, icon: "chart" },
    { href: "/match/", label: c.site.nav.match, icon: "bond" },
    { href: "/people/", label: c.site.nav.people, icon: "attachment" },
    { href: "/quizzes/", label: c.site.nav.quizzes, icon: "tarot" },
  ];
  const active = (href: string) => !!path?.includes(href);
  return (
    <>
      <header className={`sticky top-0 z-40 transition-all duration-500 ${scrolled ? "border-b border-white/10 bg-night/70 shadow-[0_10px_40px_-20px_rgba(0,0,0,.6)] backdrop-blur-xl" : "bg-transparent"}`}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href={h("/")} className="group flex items-center gap-2">
            <Logo className="h-8 w-8 transition duration-700 group-hover:rotate-[20deg]" />
            <span className="h-display text-2xl font-semibold tracking-wide text-aurora">{c.site.brand}</span>
          </Link>
          <nav className="hidden items-center gap-1 text-sm md:flex">
            {[...tabs, { href: "/bond/", label: c.site.nav.bond, icon: "bond" as EmblemId }].map((t) => (
              <Link key={t.href} href={h(t.href)} className={`relative rounded-full px-3 py-1.5 transition ${active(t.href) ? "bg-white/10 text-gold" : "text-dim hover:bg-white/5 hover:text-mist"}`}>{t.label}</Link>
            ))}
            <LangSwitch className="ml-2" />
            <span className="ml-2"><AccountChip /></span>
            <Link href={h("/start/")} className="btn-primary ml-2 !py-2">{c.site.startShort} ✦</Link>
          </nav>
          <div className="flex items-center gap-2 md:hidden"><LangSwitch /><AccountChip />
          <Link href={h("/start/")} className="btn-primary !px-4 !py-1.5 text-xs">{c.site.startShort} ✦</Link></div>
        </div>
      </header>
      <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 rounded-3xl border border-white/15 bg-ink/80 shadow-[0_20px_50px_-15px_rgba(0,0,0,.8)] backdrop-blur-xl md:hidden">
        {tabs.map((t) => (
          <Link key={t.href} href={h(t.href)} className={`flex flex-col items-center gap-0.5 py-2 text-[10.5px] transition ${active(t.href) ? "text-gold" : "text-dim"}`}>
            <Emblem id={t.icon} className={`h-6 w-6 transition ${active(t.href) ? "scale-110 glow-gold" : "opacity-70"}`} />{t.label}
          </Link>
        ))}
      </nav>
    </>
  );
}

export function Footer() {
  const { c } = useContent(); const h = useHref(); const F = c.site.footerCols;
  const cols = [
    { t: F.discover, l: [["/start/", F.chart], ["/me/", F.me], ["/today/", F.today], ["/quizzes/", F.quizzes]] },
    { t: F.rel, l: [["/match/", F.match], ["/bond/", F.bond], ["/people/", F.people]] },
    { t: F.trust, l: [["/promise/", c.site.footer.promise], ["/learn/", c.site.footer.learn], ["/privacy/", c.site.footer.privacy], ["/terms/", c.site.footer.terms], ["/upgrade/", F.extras], ["/credits/", c.site.footer.credits]] },
  ];
  return (
    <footer className="relative mt-20 overflow-hidden border-t border-white/10 bg-gradient-to-b from-transparent to-ink/80">
      <ZodiacWheel className="pointer-events-none absolute -right-40 -top-24 h-[520px] w-[520px] animate-spin-slow opacity-[0.12]" />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-32 pt-14 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:pb-14">
        <div>
          <Link href={h("/")} className="mb-3 flex items-center gap-2"><Logo className="h-9 w-9" /><span className="h-display text-3xl text-aurora">{c.site.brand}</span></Link>
          <p className="mb-4 max-w-xs text-sm text-dim">{c.site.tagline}. {F.blurb}</p>
          <Link href={h("/start/")} className="btn-primary">{c.site.common.start} ✦</Link>
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
