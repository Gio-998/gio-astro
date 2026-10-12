import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent } from "@/content";
import { SIGNS, SIGN_GLYPH } from "@/engine/zodiac";
import { publishedDates, todayIso, isValidIso } from "@/engine/skyday";
import { reading, horoPath, horoAlternates, bankFor, signFromSlug, ogPath, absolute, type HoroLocale } from "@/lib/horoscope";
import { LOCALE_META } from "@/lib/seo";
import { DailyHoroscope } from "./DailyHoroscope";
import { signHeroSvg } from "./art";
import { skyDay } from "@/engine/skyday";

/** Each locale owns its own slug folder (/en/horoscope, /mk/dneven-horoskop); other locales 404 there. */
// Static export refuses an empty list, so the other locale gets one "_" placeholder that renders the 404 page.
export const signParams = (lang: string, owner: HoroLocale) => lang === owner ? SIGNS.map((s) => ({ sign: bankFor(owner).signSlug[s] })) : [{ sign: "_" }];
export const dateParams = (lang: string, owner: HoroLocale) => lang === owner ? SIGNS.flatMap((s) => publishedDates().map((date) => ({ sign: bankFor(owner).signSlug[s], date }))) : [{ sign: "_", date: "_" }];

function meta(lang: string, title: string, description: string, canonical: string, languages: Record<string, string>, images: string[]): Metadata {
  const brand = getContent(lang).site.brand; const og = LOCALE_META[lang as HoroLocale]?.og ?? "en_US";
  return {
    title: { absolute: `${title} · ${brand}` }, description, robots: { index: true, follow: true },
    alternates: { canonical, languages },
    openGraph: { type: "article", siteName: brand, title, description, url: absolute(canonical), locale: og, images: images.map((u) => ({ url: u, width: 1200, height: 630 })) },
    twitter: { card: "summary_large_image", title, description, images },
  };
}
export async function dayMeta(lang: string, slug: string, date?: string): Promise<Metadata> {
  const sign = signFromSlug(lang, slug); const iso = date ?? todayIso();
  if (!sign || !isValidIso(iso)) return {};
  const r = reading(lang, sign, iso); const B = bankFor(lang);
  const title = date ? r.title : `${B.ui.shortTitle(r.signName)}, ${r.dateLabel}`;
  return meta(lang, title, r.description, date ? horoPath(lang, sign, iso) : horoPath(lang, sign), date ? horoAlternates(sign, iso) : horoAlternates(sign), [absolute(ogPath(lang, sign, iso, "wide"))]);
}
export function DayPage({ lang, slug, date }: { lang: string; slug: string; date?: string }) {
  const sign = signFromSlug(lang, slug); const iso = date ?? todayIso();
  if (!sign || !isValidIso(iso)) notFound();
  return <DailyHoroscope lang={lang} sign={sign} iso={iso} isToday={!date} />;
}

export async function hubMeta(lang: string): Promise<Metadata> {
  const U = bankFor(lang).ui; const iso = todayIso(); const d = reading(lang, "aries", iso).dateLabel;
  return meta(lang, `${U.hubTitle}, ${d}`, U.hubSub, horoPath(lang), horoAlternates(), [absolute(ogPath(lang, "aries", iso, "wide"))]);
}
export function HubPage({ lang }: { lang: string }) {
  const U = bankFor(lang).ui; const c = getContent(lang); const iso = todayIso();
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="h-display text-[2.2rem] leading-tight">{U.hubTitle}</h1>
      <p className="mb-4 text-[14px] text-mist/70">{U.hubSub}</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {SIGNS.map((s) => { const r = reading(lang, s, iso); return (
          <Link key={s} href={horoPath(lang, s)} className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.045] p-2.5 hover:border-gold/40">
            <span aria-hidden className="h-11 w-11 shrink-0" dangerouslySetInnerHTML={{ __html: signHeroSvg(s, skyDay(iso, s).moon.angle, { moon: false }) }} />
            <span className="min-w-0"><span className="block text-[14px] font-medium">{SIGN_GLYPH[s]} {c.astro.signs[s].name}</span><span className="line-clamp-1 text-[12px] text-mist/65">{r.headline}</span></span>
          </Link>); })}
      </div>
    </div>
  );
}
