"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContent, useHref } from "@/lib/content-context";

export function Header() {
  const { c } = useContent(); const h = useHref(); const path = usePathname();
  const tabs = [
    { href: "/today/", label: c.site.nav.today, icon: "☀︎" },
    { href: "/me/", label: c.site.nav.me, icon: "✦" },
    { href: "/match/", label: c.site.nav.match, icon: "∞" },
    { href: "/people/", label: c.site.nav.people, icon: "☍" },
    { href: "/quizzes/", label: c.site.nav.quizzes, icon: "◎" },
  ];
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-white/5 bg-night/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link href={h("/")} className="h-display text-2xl font-semibold tracking-wide text-gold">✧ {c.site.brand}</Link>
          <nav className="hidden gap-4 text-sm text-dim sm:flex">
            {tabs.map((t) => <Link key={t.href} href={h(t.href)} className={path?.includes(t.href) ? "text-gold" : "hover:text-mist"}>{t.label}</Link>)}
            <Link href={h("/bond/")} className={path?.includes("/bond/") ? "text-gold" : "hover:text-mist"}>{c.site.nav.bond}</Link>
          </nav>
          <Link href={h("/learn/")} className="text-xs text-dim hover:text-mist sm:hidden">{c.site.nav.learn}</Link>
        </div>
      </header>
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-white/10 bg-ink/95 backdrop-blur sm:hidden">
        {tabs.map((t) => (
          <Link key={t.href} href={h(t.href)} className={`flex flex-col items-center py-2 text-[11px] ${path?.includes(t.href) ? "text-gold" : "text-dim"}`}>
            <span className="text-lg leading-none">{t.icon}</span>{t.label}
          </Link>
        ))}
      </nav>
    </>
  );
}

export function Footer() {
  const { c } = useContent(); const h = useHref();
  return (
    <footer className="mx-auto max-w-3xl px-4 pb-28 pt-10 text-xs text-dim sm:pb-10">
      <p className="mb-2">{c.site.footer.note}</p>
      <p className="flex flex-wrap gap-x-4 gap-y-1">
        <Link href={h("/promise/")}>{c.site.footer.promise}</Link>
        <Link href={h("/learn/")}>{c.site.footer.learn}</Link>
        <Link href={h("/privacy/")}>{c.site.footer.privacy}</Link>
        <Link href={h("/terms/")}>{c.site.footer.terms}</Link>
        <Link href={h("/upgrade/")}>Extras</Link>
        <span>{c.site.footer.geonames}</span>
      </p>
    </footer>
  );
}
