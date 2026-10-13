import { formatDate } from "@/lib/dates";
import Link from "next/link";
import { publishedDates } from "@/engine/skyday";
import { RetroMark } from "../RetroMark";
import { SIGNS, SIGN_GLYPH, type Sign } from "@/engine/zodiac";
import { getContent } from "@/content";
import { reading, horoPath, bankFor, absolute, ogPath, ogImage, type Reading } from "@/lib/horoscope";
import { signHeroSvg, moonPath } from "./art";
import { SITE_URL } from "@/lib/site-url";
import { numContent } from "@/content/numerology";
import { DayNumber } from "../numerology/Personal";
import { localizedPath } from "@/lib/i18n-routes";

const pill = "inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-white/12 bg-white/[0.05] px-3.5 text-[13px] text-mist/90 hover:border-gold/45";
/** Phone: compact glass card. Desktop: flowing magazine prose with a hairline divider, no box. */
const block = "rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3.5 lg:rounded-none lg:border-0 lg:border-t lg:border-gold/15 lg:bg-transparent lg:px-0 lg:pb-0 lg:pt-9";
const label = "text-[11px]! leading-tight! font-sans font-semibold uppercase tracking-[.16em] text-gold";
const h2 = `${label} mb-1.5 flex items-center gap-2 lg:mb-3 lg:h-display lg:text-[2rem]! lg:font-medium lg:normal-case lg:tracking-normal lg:text-mist`;
const p1 = "text-[15px] leading-snug text-mist lg:text-[18px] lg:leading-[1.7] lg:text-mist/90";
const p2 = "mt-1.5 text-[15px] leading-snug text-mist/75 lg:mt-3 lg:text-[18px] lg:leading-[1.7]";
const h3 = "mt-3 text-[12px] font-semibold uppercase tracking-[.12em] text-gold/85 lg:mt-5 lg:text-[13px]";

function Sec({ icon, title, children, className = "" }: { icon: string; title: string; children: React.ReactNode; className?: string }) {
  return <section className={`${block} ${className}`}><h2 className={h2}><span aria-hidden className="text-sm lg:text-xl lg:text-gold">{icon}</span>{title}</h2>{children}</section>;
}
const Ps = ({ lines }: { lines: string[] }) => <>{lines.map((l, i) => <p key={i} className={i ? p2 : p1}>{l}</p>)}</>;
const MoonDisc = ({ angle, className }: { angle: number; className: string }) => <svg viewBox="0 0 32 32" className={className} aria-hidden><circle cx="16" cy="16" r="14" fill="#1b1640" stroke="#e9c78a" strokeOpacity=".5" /><path d={moonPath(angle, 16, 16, 12)} fill="#f6ecd2" /></svg>;
/** Keep "13 October 2026" glued so the date never leaves a lone number at a line end. */
const nbsp = (d: string) => d.replace(/^(\d+) (\S+) (\d+)$/, "$1\u00A0$2\u00A0$3");

/** Public daily horoscope for one sign + date. `isToday` = rendered on the per-sign today index. */
export function DailyHoroscope({ lang, sign, iso, isToday = false }: { lang: string; sign: Sign; iso: string; isToday?: boolean }) {
  const r = reading(lang, sign, iso); const B = bankFor(lang); const U = B.ui; const M = B.more.ui; const c = getContent(lang); const angle = r.sky.moon.angle;
  const url = absolute(isToday ? horoPath(lang, sign) : horoPath(lang, sign, iso));
  const ld = {
    "@context": "https://schema.org", "@type": "Article", headline: isToday ? U.shortTitle(r.signName) : r.title, description: isToday ? U.signHubMeta(r.signName) : r.description, url, datePublished: `${iso}T00:00:00+02:00`, dateModified: `${iso}T00:00:00+02:00`,
    inLanguage: lang, mainEntityOfPage: url, image: [absolute(ogImage(lang, sign, iso))], about: { "@type": "Thing", name: r.signName },
    articleSection: B.ui.hubTitle, wordCount: wordCount(r),
    author: { "@type": "Organization", name: c.site.brand, url: SITE_URL }, publisher: { "@id": `${SITE_URL}/#organization` },
  };
  const crumbs = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [[c.site.brand, `/${lang}/`], [U.hubTitle, horoPath(lang)], [r.signName, horoPath(lang, sign)], ...(isToday ? [] : [[r.dateLabel, horoPath(lang, sign, iso)]])].map(([name, p], i) => ({ "@type": "ListItem", position: i + 1, name, item: absolute(p) })) };
  // Only link to dates this build publishes, so the edges of the window never point at a 404.
  const pub = new Set(publishedDates());
  const dayNav = (
    <nav className="flex items-center justify-between gap-2" aria-label={U.others}>
      {pub.has(r.prev) ? <Link className={pill} href={horoPath(lang, sign, r.prev)} rel="prev">← {U.yesterday}</Link> : <span />}
      {!isToday && <Link className={pill} href={horoPath(lang, sign)}>{U.todayLink}</Link>}
      {pub.has(r.next) ? <Link className={pill} href={horoPath(lang, sign, r.next)} rel="next">{U.tomorrow} →</Link> : <span />}
    </nav>
  );
  return (
    <article className="mx-auto max-w-xl space-y-3 lg:relative lg:left-1/2 lg:w-[min(1120px,calc(100vw-4rem))] lg:max-w-none lg:-translate-x-1/2 lg:space-y-0" data-testid="daily-horoscope">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([ld, crumbs]) }} />
      <header className="relative overflow-hidden rounded-[28px] border border-gold/20 bg-[radial-gradient(120%_90%_at_80%_0%,rgba(139,108,240,.45),transparent_60%),linear-gradient(170deg,#1d1748,#0e0b26)] px-5 pb-5 pt-5 shadow-[0_30px_80px_-40px_rgba(139,108,240,.9)] lg:rounded-[36px] lg:px-14 lg:py-14">
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-14 h-44 w-44 opacity-40 sm:-right-10 sm:-top-6 sm:h-56 sm:w-56 sm:opacity-75 lg:right-10 lg:top-1/2 lg:h-[400px] lg:w-[400px] lg:-translate-y-1/2 lg:opacity-100 [&>svg]:h-full [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: signHeroSvg(sign, angle) }} />
        <div className="relative lg:max-w-[600px]">
          <p className="eyebrow mb-2 whitespace-nowrap text-[11px] tracking-[.14em] sm:tracking-[.2em] lg:mb-4 lg:text-[13px]" data-testid="horo-eyebrow">{SIGN_GLYPH[sign]} {r.signName} · {r.weekday}</p>
          <h1 className="h-display max-w-[15ch] pr-2 text-[2rem] font-medium leading-[1.05] lg:max-w-none lg:text-[3.3rem]!">{r.title.replace(r.dateLabel, nbsp(r.dateLabel))}</h1>
          <p className="h-display mt-4 text-[1.35rem] italic leading-snug text-gold/95 lg:mt-7 lg:text-[2.25rem] lg:leading-[1.2]">{r.headline}</p>
          <p className="mt-3 flex items-start gap-2 text-[13px] text-mist/75 lg:mt-7 lg:text-[15px]"><MoonDisc angle={angle} className="mt-px h-4 w-4 shrink-0 lg:h-5 lg:w-5" /><span>{r.moonLine}</span></p>
        </div>
      </header>

      <div className="lg:hidden">{dayNav}</div>

      <div className="space-y-3 lg:mt-14 lg:grid lg:grid-cols-[minmax(0,680px)_300px] lg:justify-between lg:gap-16 lg:space-y-0">
        <div className="space-y-3 lg:space-y-9">
          <section className={`${block} lg:border-t-0 lg:pt-0`}>
            <h2 className={label}>{M.overview}</h2>
            <p className="mt-1.5 text-[15px] leading-snug text-mist lg:mt-4 lg:h-display lg:text-[1.6rem] lg:leading-[1.45] lg:text-mist first-letter:lg:float-left first-letter:lg:mr-3 first-letter:lg:text-[4.6rem] first-letter:lg:leading-[.85] first-letter:lg:text-gold">{r.overview}</p>
          </section>

          <Sec icon="♡" title={M.love}>
            <Ps lines={r.love} />
            <h3 className={h3}>{M.single}</h3><p className={p2}>{r.single}</p>
            <h3 className={h3}>{M.couple}</h3><p className={p2}>{r.couple}</p>
          </Sec>

          <Sec icon="◇" title={M.workMoney}><Ps lines={[...r.work, ...r.money]} /></Sec>
          <Sec icon="☾" title={M.well}><Ps lines={[...r.well, r.body]} /></Sec>
          <Sec icon="⌂" title={M.friends}><Ps lines={[r.friends]} /></Sec>

          <figure className="rounded-2xl border border-gold/25 bg-gold/[0.06] px-4 py-4 lg:my-2 lg:rounded-none lg:border-0 lg:border-l-2 lg:border-gold/70 lg:bg-transparent lg:py-1 lg:pl-8 lg:pr-0">
            <figcaption className={label}>{M.prompt}</figcaption>
            <blockquote className="h-display mt-2 text-[1.35rem] italic leading-snug text-gold/95 lg:text-[2.1rem] lg:leading-[1.25]">“{r.prompt}”</blockquote>
          </figure>

          <Sec icon="☉" title={M.why}><Ps lines={r.why} /></Sec>

          <Sec icon="◷" title={M.timing}>
            <p className={p1}><span className="font-semibold text-gold">{M.best}. </span>{r.best}</p>
            <p className={p2}><span className="font-semibold text-gold">{M.avoid}. </span>{r.avoid}</p>
          </Sec>

          {r.week.length > 0 && (
            <Sec icon="→" title={M.week}>
              <ul className="space-y-1.5 lg:space-y-3">{r.week.map((w) => <li key={w.date} className="text-[15px] leading-snug text-mist/85 lg:text-[18px] lg:leading-[1.6]"><span className="font-semibold text-gold">{w.date}. </span>{w.text}</li>)}</ul>
            </Sec>
          )}

          <section className="rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3.5 lg:mt-12 lg:px-6 lg:py-5">
            <h2 className="h-display text-[1.3rem]! leading-tight!">{U.moodTitle}</h2>
            <p className="mb-2.5 text-[13px] text-mist/65">{U.moodSub}</p>
            <div className="flex gap-1.5 lg:max-w-md">{U.moods.map((m, i) => <Link key={m} href={`/${lang}/today/?mood=${i + 1}`} className="flex h-9 min-w-0 flex-1 items-center justify-center rounded-full border border-white/12 bg-white/[0.05] px-1 text-[12px] hover:border-gold/45"><span className="truncate">{m}</span></Link>)}</div>
          </section>

          <section className="rounded-2xl border border-gold/30 bg-[linear-gradient(150deg,rgba(233,199,138,.14),rgba(139,108,240,.12))] px-4 py-4 lg:flex lg:items-center lg:justify-between lg:gap-6 lg:px-6 lg:py-5">
            <div><h2 className="h-display text-[1.3rem]! leading-tight!">{U.ctaTitle}</h2><p className="mt-1 text-[13px] text-mist/70">{U.ctaSub}</p></div>
            <Link href={`/${lang}/start/`} className="btn-primary mt-3 inline-flex shrink-0 lg:mt-0">{U.ctaBtn} →</Link>
          </section>

          <p className="px-1 text-[12px] leading-relaxed text-mist/55 lg:text-[13px]"><span className="font-semibold text-mist/70">{M.how}. </span>{M.howText} <Link className="text-gold underline-offset-4 hover:underline" href={`/${lang}/how-it-works/`}>{M.howLink} →</Link></p>
        </div>

        <aside className="space-y-3 lg:sticky lg:top-24 lg:self-start lg:space-y-6">
          <section className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3.5 lg:rounded-3xl lg:px-5 lg:py-5">
            <MoonDisc angle={angle} className="h-14 w-14 shrink-0 lg:h-16 lg:w-16" />
            <div><p className={label}>{U.moonLabel}</p><p className="mt-1 text-[14px] leading-snug text-mist/85">{r.moonLine}</p></div>
          </section>

          <p className="flex items-center justify-between gap-2 rounded-full border border-gold/25 bg-gold/[0.06] px-4 py-2 text-[13px]" aria-label={U.lucky}>
            <span className="flex shrink-0 items-center gap-1.5"><span aria-hidden className="h-3 w-3 shrink-0 rounded-full ring-1 ring-white/30" style={{ background: r.lucky.hex }} /><span className="whitespace-nowrap" data-testid="lucky-color">{r.lucky.color}</span></span>
            <span className="text-gold/50" aria-hidden>·</span><span><span className="sr-only">{U.number} </span><span className="h-display text-lg leading-none text-gold">{r.lucky.number}</span></span>
            <span className="text-gold/50" aria-hidden>·</span><span className="whitespace-nowrap">{r.lucky.window}</span>
          </p>

          {(() => { const NC = numContent(lang); return <DayNumber iso={iso} days={NC.days} names={Object.fromEntries(Object.entries(NC.chars).map(([k, v]) => [k, v.name]))} href={localizedPath(lang, "/numerology/personal-day/")} L={{ title: NC.p3.dayTitle, intro: NC.p3.dayIntro, need: NC.p3.dayNeed, link: NC.p3.dayLink, year: NC.p3.dayYear(0).replace("0", "{n}"), month: NC.p3.dayMonth(0).replace("0", "{n}"), birth: NC.ui.calc.birth }} />; })()}

          <section className="rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3.5 lg:rounded-3xl lg:px-5">
            <h2 className={`${label} mb-2`}>{M.planets}</h2>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-[13px] lg:grid-cols-1">
              {r.planets.map((p) => <li key={p.body} className="flex justify-between gap-2 border-b border-white/5 py-0.5"><span className="text-mist/70">{p.name}</span><span className="whitespace-nowrap text-mist">{p.signName}{p.retro && <RetroMark label={M.retroMark} />}</span></li>)}
            </ul>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3.5 lg:rounded-3xl lg:px-5">
            <h2 className={`${label} mb-2`}>☉ {U.skyTitle}</h2>
            <ul className="space-y-1.5">{r.sky_.map((l, i) => <li key={i} className="flex gap-2 text-[14px] leading-snug text-mist/85"><span aria-hidden className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-gold/80" />{l}</li>)}</ul>
          </section>

          <div className="hidden lg:block">{dayNav}</div>

          <nav aria-label={U.others}>
            <h2 className={`${label} mb-2 mt-2`}>{U.others}</h2>
            <div className="grid grid-cols-4 gap-1.5 lg:grid-cols-6">
              {SIGNS.filter((x) => x !== sign).map((x) => <Link key={x} href={isToday ? horoPath(lang, x) : horoPath(lang, x, iso)} title={c.astro.signs[x].name} className="flex h-12 flex-col items-center justify-center gap-0.5 rounded-xl border border-white/10 bg-white/[0.04] px-0.5 text-[11px] leading-none hover:border-gold/40 sm:h-10 sm:flex-row sm:gap-1 sm:px-1 sm:text-[12px] lg:h-11 lg:rounded-full" data-testid="other-sign"><span aria-hidden className="text-[13px] leading-none text-gold sm:text-[12px] lg:text-lg">{SIGN_GLYPH[x]}</span><span className="whitespace-nowrap lg:sr-only">{c.astro.signs[x].name}</span></Link>)}
            </div>
          </nav>
          <p className="mt-2 text-[13px]"><Link className="text-gold underline-offset-4 hover:underline" href={`/${lang}/daily/${sign}/`} data-testid="motivation-link">{U.motivationLink(r.signName)} →</Link></p>
          {isToday && (
            <nav aria-label={U.recentDays} data-testid="recent-days">
              <h2 className={`${label} mb-1 mt-2`}>{U.recentDays}</h2>
              <p className="mb-2 text-[12.5px] leading-snug text-mist/65">{U.signHubIntro(r.signName)}</p>
              <ul className="flex flex-wrap gap-1.5">
                {[...pub].filter((d) => d < iso).reverse().map((d) => <li key={d}><Link className="inline-block rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[12px] hover:border-gold/40" href={horoPath(lang, sign, d)}>{formatDate(d, c.site.months)}</Link></li>)}
              </ul>
            </nav>
          )}
        </aside>
      </div>
    </article>
  );
}
export function wordCount(r: Reading): number {
  const txt = [r.title, r.headline, r.overview, ...r.love, r.single, r.couple, ...r.work, ...r.money, ...r.well, r.body, r.friends, r.prompt, ...r.why, r.best, r.avoid, ...r.week.map((w) => `${w.date} ${w.text}`), ...r.sky_].join(" ");
  return txt.split(/\s+/).filter(Boolean).length;
}
