import Link from "next/link";
import { SIGNS, SIGN_GLYPH, type Sign } from "@/engine/zodiac";
import { getContent } from "@/content";
import { reading, horoPath, bankFor, absolute, ogPath } from "@/lib/horoscope";
import { signHeroSvg, moonPath } from "./art";
import { SITE_URL } from "@/lib/site-url";

const pill = "inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-white/12 bg-white/[0.05] px-3.5 text-[13px] text-mist/90 hover:border-gold/45";

function Section({ icon, title, lines }: { icon: string; title: string; lines: string[] }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3.5">
      <h2 className="mb-1 flex items-center gap-2 text-[11px]! leading-tight! font-sans font-semibold uppercase tracking-[.16em] text-gold"><span aria-hidden className="text-sm">{icon}</span>{title}</h2>
      {lines.map((l, i) => <p key={i} className={`text-[15px] leading-snug ${i ? "mt-1 text-mist/75" : "text-mist"}`}>{l}</p>)}
    </section>
  );
}

/** Public daily horoscope for one sign + date. `isToday` = rendered on the per-sign today index. */
export function DailyHoroscope({ lang, sign, iso, isToday = false }: { lang: string; sign: Sign; iso: string; isToday?: boolean }) {
  const r = reading(lang, sign, iso); const B = bankFor(lang); const U = B.ui; const c = getContent(lang);
  const url = absolute(isToday ? horoPath(lang, sign) : horoPath(lang, sign, iso));
  const ld = {
    "@context": "https://schema.org", "@type": "Article", headline: r.title, description: r.description, datePublished: `${iso}T00:00:00+02:00`, dateModified: `${iso}T00:00:00+02:00`,
    inLanguage: lang, mainEntityOfPage: url, image: [absolute(ogPath(lang, sign, iso, "wide"))], about: { "@type": "Thing", name: r.signName },
    author: { "@type": "Organization", name: c.site.brand, url: SITE_URL }, publisher: { "@type": "Organization", name: c.site.brand, url: SITE_URL },
  };
  return (
    <article className="mx-auto max-w-xl space-y-3" data-testid="daily-horoscope">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <header className="relative overflow-hidden rounded-[28px] border border-gold/20 bg-[radial-gradient(120%_90%_at_80%_0%,rgba(139,108,240,.45),transparent_60%),linear-gradient(170deg,#1d1748,#0e0b26)] px-5 pb-5 pt-5 shadow-[0_30px_80px_-40px_rgba(139,108,240,.9)]">
        <div aria-hidden className="pointer-events-none absolute -right-10 -top-6 h-56 w-56 opacity-75 sm:h-64 sm:w-64" dangerouslySetInnerHTML={{ __html: signHeroSvg(sign, moonAngle(r)) }} />
        <p className="eyebrow relative mb-2 pr-28 text-[11px]">{SIGN_GLYPH[sign]} {r.signName} · {r.weekday}</p>
        <h1 className="h-display relative max-w-[15ch] pr-2 text-[2rem] font-medium leading-[1.05] sm:max-w-[18ch] sm:text-[2.6rem]">{r.title.replace(r.dateLabel, nbsp(r.dateLabel))}</h1>
        <p className="h-display relative mt-4 text-[1.35rem] italic leading-snug text-gold/95">{r.headline}</p>
        <p className="relative mt-3 flex items-start gap-2 text-[13px] text-mist/75">
          <svg viewBox="0 0 32 32" className="mt-px h-4 w-4 shrink-0" aria-hidden><circle cx="16" cy="16" r="14" fill="#1b1640" stroke="#e9c78a" strokeOpacity=".5" /><path d={moonPath(moonAngle(r), 16, 16, 12)} fill="#f6ecd2" /></svg>
          <span>{r.moonLine}</span>
        </p>
      </header>

      <nav className="flex items-center justify-between gap-2" aria-label={U.others}>
        <Link className={pill} href={horoPath(lang, sign, r.prev)} rel="prev">← {U.yesterday}</Link>
        {!isToday && <Link className={pill} href={horoPath(lang, sign)}>{U.todayLink}</Link>}
        <Link className={pill} href={horoPath(lang, sign, r.next)} rel="next">{U.tomorrow} →</Link>
      </nav>

      <div className="grid gap-3 sm:grid-cols-3">
        <Section icon="♡" title={U.love} lines={r.love} />
        <Section icon="◇" title={U.work} lines={r.work} />
        <Section icon="☾" title={U.well} lines={r.well} />
      </div>

      <section className="rounded-2xl border border-gold/25 bg-gold/[0.06] px-4 py-3" aria-label={U.lucky}>
        <h2 className="mb-2 text-[11px]! leading-tight! font-sans font-semibold uppercase tracking-[.16em] text-gold">✦ {U.lucky}</h2>
        <dl className="grid grid-cols-3 gap-2 text-center">
          <div><dt className="text-[11px] text-mist/60">{U.color}</dt><dd className="mt-0.5 flex items-center justify-center gap-1.5 text-[14px]"><span aria-hidden className="h-3 w-3 shrink-0 rounded-full ring-1 ring-white/30" style={{ background: r.lucky.hex }} /><span className="truncate">{r.lucky.color}</span></dd></div>
          <div><dt className="text-[11px] text-mist/60">{U.number}</dt><dd className="h-display mt-0.5 text-xl leading-none text-gold">{r.lucky.number}</dd></div>
          <div><dt className="text-[11px] text-mist/60">{U.window}</dt><dd className="mt-0.5 whitespace-nowrap text-[14px]">{r.lucky.window}</dd></div>
        </dl>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3.5">
        <h2 className="mb-2 text-[11px]! leading-tight! font-sans font-semibold uppercase tracking-[.16em] text-gold">☉ {U.skyTitle}</h2>
        <ul className="space-y-1.5">{r.sky_.map((l, i) => <li key={i} className="flex gap-2 text-[14px] leading-snug text-mist/85"><span aria-hidden className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-gold/80" />{l}</li>)}</ul>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3.5">
        <h2 className="h-display text-[1.3rem]! leading-tight!">{U.moodTitle}</h2>
        <p className="mb-2.5 text-[13px] text-mist/65">{U.moodSub}</p>
        <div className="flex gap-1.5">{U.moods.map((m, i) => <Link key={m} href={`/${lang}/today/?mood=${i + 1}`} className="flex h-9 min-w-0 flex-1 items-center justify-center rounded-full border border-white/12 bg-white/[0.05] px-1 text-[12px] hover:border-gold/45"><span className="truncate">{m}</span></Link>)}</div>
      </section>

      <section className="rounded-2xl border border-gold/30 bg-[linear-gradient(150deg,rgba(233,199,138,.14),rgba(139,108,240,.12))] px-4 py-4">
        <h2 className="h-display text-[1.3rem]! leading-tight!">{U.ctaTitle}</h2>
        <p className="mt-1 text-[13px] text-mist/70">{U.ctaSub}</p>
        <Link href={`/${lang}/start/`} className="btn-primary mt-3 inline-flex">{U.ctaBtn} →</Link>
      </section>

      <nav aria-label={U.others}>
        <h2 className="mb-2 mt-2 text-[11px]! leading-tight! font-sans font-semibold uppercase tracking-[.16em] text-gold">{U.others}</h2>
        <div className="grid grid-cols-4 gap-1.5">
          {SIGNS.filter((x) => x !== sign).map((x) => <Link key={x} href={isToday ? horoPath(lang, x) : horoPath(lang, x, iso)} className="flex h-10 items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] px-1 text-[12px] hover:border-gold/40"><span aria-hidden className="text-gold">{SIGN_GLYPH[x]}</span><span className="truncate">{c.astro.signs[x].name}</span></Link>)}
        </div>
      </nav>
    </article>
  );
}
/** Keep "13 October" / "October 2026" glued so the date never leaves a lone number at a line end. */
const nbsp = (d: string) => d.replace(/^(\d+) (\S+) (\d+)$/, "$1\u00A0$2\u00A0$3");
const moonAngle = (r: ReturnType<typeof reading>) => r.sky.moon.angle;
