import Link from "next/link";
import { PARTIAL_UI } from "@/content/partial-ui";
import type { PartialLocale } from "@/lib/partial-scope";
import { localizedPath } from "@/lib/i18n-routes";
import { Logo } from "../art/Logo";
import { LangMenu } from "../LangMenu";
import { getContent } from "@/content";

/** Slim header for a partial test locale: brand, the two sections that exist, the language menu. No account, no app, no tab bar. */
export function PartialHeader({ locale }: { locale: PartialLocale }) {
  const U = PARTIAL_UI[locale]; const site = getContent(locale).site;
  const link = "inline-flex min-h-[44px] items-center whitespace-nowrap rounded-full px-3 text-[13px] text-mist/85 transition hover:bg-white/10 hover:text-gold sm:text-sm";
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-night/75 backdrop-blur-xl">
      <div className="relative mx-auto flex max-w-6xl min-w-0 items-center justify-between gap-2 px-4 py-2.5">
        <Link href={`/${locale}/`} aria-label={site.brand} className="group flex min-h-[44px] shrink-0 items-center gap-2">
          <Logo className="h-8 w-8 shrink-0 transition duration-700 group-hover:rotate-[20deg]" />
          <span className="h-display text-[1.35rem] font-semibold tracking-wide text-aurora sm:text-2xl">{site.brand}</span>
        </Link>
        <nav aria-label={site.brand} className="flex min-w-0 items-center gap-0.5">
          <Link className={link} href={localizedPath(locale, "/horoscope/")}>{U.nav.daily}</Link>
          <Link className={link} href={localizedPath(locale, "/monthly-horoscope/")}>{U.nav.monthly}</Link>
          <LangMenu locale={locale} names={site.languages as Record<string, string>} label={site.language} />
        </nav>
      </div>
    </header>
  );
}

export function PartialFooter({ locale }: { locale: PartialLocale }) {
  const U = PARTIAL_UI[locale]; const F = U.footer; const site = getContent(locale).site;
  const link = "inline-flex min-h-[40px] items-center py-1 leading-snug text-dim transition hover:text-gold";
  return (
    <footer className="relative mt-16 border-t border-white/10 bg-gradient-to-b from-transparent to-ink/80">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-6 gap-y-6 px-4 pb-16 pt-10 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link href={`/${locale}/`} className="mb-3 flex items-center gap-2"><Logo className="h-9 w-9" /><span className="h-display text-3xl text-aurora">{site.brand}</span></Link>
          <p className="max-w-xs text-sm text-dim">{U.tagline}. {F.blurb}</p>
        </div>
        <ul className="text-sm">
          <li><Link className={link} href={localizedPath(locale, "/horoscope/")}>{F.daily}</Link></li>
          <li><Link className={link} href={localizedPath(locale, "/monthly-horoscope/")}>{F.monthly}</Link></li>
        </ul>
        <ul className="text-sm">
          <li><Link className={link} href="/en/privacy/" hrefLang="en">{F.privacy}</Link></li>
          <li><Link className={link} href="/en/terms/" hrefLang="en">{F.terms}</Link></li>
          <li><a className={link} href="mailto:contact@horoscop.si">✉ contact@horoscop.si</a></li>
        </ul>
      </div>
    </footer>
  );
}
