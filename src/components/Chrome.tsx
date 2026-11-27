"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { LangMenu } from "./LangMenu";
import { DesktopNav, TabBar, useNav, useReturning } from "./nav/Nav";
import { useContent, useHref } from "@/lib/content-context";
import { useAccount } from "@/lib/sync";
import { Emblem } from "./art/Emblem";
import { ZodiacWheel } from "./art/ZodiacWheel";
import { siteLinks } from "@/lib/site-links";
import { Logo } from "./art/Logo";

export { Logo };

/** Language menu: flag + short code; picking a language stores it (cookie for the edge redirect on "/", localStorage for the root page). The menu itself lives in LangMenu, which the slim Slovenian header shares. */
export function LangSwitch({ className = "" }: { className?: string }) {
  const { c, locale } = useContent();
  return <LangMenu locale={locale} names={c.site.languages as Record<string, string>} label={c.site.language} className={className} />;
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

/** Returning visitors on a phone: a round shortcut to their profile, with their initials once signed in. */
function ProfileChip({ className = "" }: { className?: string }) {
  const a = useAccount(); const h = useHref(); const N = useNav();
  const initials = (a.user?.email ?? "").slice(0, 2).toUpperCase();
  return (
    <Link prefetch={false} href={h("/me/")} aria-label={N.profile} data-testid="nav-profile" className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/40 bg-white/[0.06] text-xs font-bold text-gold ${className}`}>
      {initials || <Emblem id="sun" className="h-6 w-6" />}
    </Link>
  );
}

export function Header() {
  const toTop = useToTop();
  const { c } = useContent(); const h = useHref(); const N = useNav(); const returning = useReturning();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const f = () => setScrolled(window.scrollY > 24); f(); window.addEventListener("scroll", f, { passive: true }); return () => window.removeEventListener("scroll", f); }, []);
  return (
    <>
      <header className={`sticky top-0 z-40 transition-all duration-500 ${scrolled ? "border-b border-white/10 bg-night/75 backdrop-blur-xl" : "bg-transparent"}`}>
        <div className="relative mx-auto flex max-w-6xl min-w-0 items-center justify-between gap-3 px-4 py-2.5">
          <Link prefetch={false} href={h("/")} onClick={toTop} aria-label={c.site.brand} className="group flex min-h-[44px] shrink-0 items-center gap-2">
            <Logo className="h-8 w-8 shrink-0 transition duration-700 group-hover:rotate-[20deg]" />
            <span className="h-display text-[1.35rem] font-semibold tracking-wide text-aurora sm:text-2xl">{c.site.brand}</span>
          </Link>
          <div className="hidden lg:block"><DesktopNav /></div>
          <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
            <LangSwitch />
            {returning
              ? <ProfileChip className="lg:hidden" />
              : <Link prefetch={false} href={h("/quizzes/")} onClick={toTop} className="btn-primary hidden min-h-[44px]! shrink-0 whitespace-nowrap text-sm lg:inline-flex" data-testid="nav-start">{N.start}</Link>}
          </div>
        </div>
      </header>
      <TabBar />
    </>
  );
}

export function Footer() {
  const { c, locale } = useContent(); const h = useHref(); const F = c.site.footerCols; const N = useNav(); const toTop = useToTop(); const returning = useReturning();
  const T = N.groups.tests; const [blog, how, learn, promise] = N.groups.more.items;
  const cols = [
    { t: F.astro, l: siteLinks(locale).map((x) => [x.href, x.title]) },
    { t: F.discover, l: [["/quizzes/", F.quizzes], ["/deep/", T.deep.title], ["/play/", T.play.title], ["/match/", F.match], ["/bond/", F.bond], returning ? ["/me/", N.profile] : ["/start/", F.chart], ["/you/", c.you.title], ["/daily/", F.notes], ["/blog/", blog.title]] },
    { t: F.trust, l: [["/how-it-works/", how.title], ["/learn/", learn.title], ["/promise/", promise.title], ["/pricing/", N.pricing.label], ["/privacy/", c.site.footer.privacy], ["/terms/", c.site.footer.terms], ["/partners/", c.partners.eyebrow], ["/credits/", c.site.footer.credits], ["/account/", N.login]] },
  ];
  return (
    <footer className="relative mt-16 overflow-hidden border-t border-white/10 bg-gradient-to-b from-transparent to-ink/80">
      <ZodiacWheel className="pointer-events-none absolute -right-40 -top-24 h-[520px] w-[520px] animate-spin-slow opacity-[0.08]" />
      <div className="relative mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-9 px-4 pb-28 pt-12 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:pb-12">
        <div className="col-span-2 md:col-span-1">
          <Link prefetch={false} href={h("/")} onClick={toTop} className="mb-3 flex items-center gap-2"><Logo className="h-9 w-9" /><span className="h-display text-3xl text-aurora">{c.site.brand}</span></Link>
          <p className="mb-4 max-w-xs text-sm text-dim">{c.site.tagline}. {F.blurb}</p>
          <Link prefetch={false} href={h(returning ? "/me/" : "/quizzes/")} onClick={toTop} className="btn-primary" data-testid="footer-start">{returning ? N.profile : N.start} ✦</Link>
          <p className="mt-5 text-sm text-dim"><a className="inline-flex min-h-[44px] items-center transition hover:text-gold" href="mailto:contact@horoscop.si" data-testid="footer-email">✉ contact@horoscop.si</a></p>
        </div>
        {cols.map((col, i) => (
          <div key={col.t} className={i === 0 ? "col-span-2 md:col-span-1" : ""}>
            <p className="eyebrow mb-2">{col.t}</p>
            <ul className={`text-sm ${i === 0 ? "grid grid-cols-2 gap-x-6 md:grid-cols-1" : ""}`}>{col.l.map(([href, label]) => <li key={href}><Link prefetch={false} className="inline-flex min-h-[40px] items-center py-1 leading-snug text-dim transition hover:text-gold" href={h(href)} onClick={toTop}>{label}</Link></li>)}</ul>
          </div>
        ))}
      </div>
    </footer>
  );
}
