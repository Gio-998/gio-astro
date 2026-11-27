import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent } from "@/content";
import { PARTIAL_UI } from "@/content/partial-ui";
import { SIGNS, SIGN_GLYPH, type Sign } from "@/engine/zodiac";
import { todayIso } from "@/engine/skyday";
import { horoPath, absolute, reading } from "@/lib/horoscope";
import { MONTHLY_PATH, currentMonth, periodHub, periodPage } from "@/lib/horoscope-period";
import { SL_SIGN_SLUGS, localizedPath } from "@/lib/i18n-routes";
import { SITE_URL } from "@/lib/site-url";
import type { NumModel } from "@/lib/numerology";
import { NumView, modelMeta } from "@/components/numerology/NumPage";
import type { PartialLocale } from "@/lib/partial-scope";

/** Monthly pages of a partial locale: the hub and one page per sign for the current month. There is no dated archive, so nothing links to one. */
function monthlyModel(lang: string, sign?: string): NumModel | null {
  const month = currentMonth();
  if (!sign) return periodHub(lang, month, MONTHLY_PATH);
  if (!SIGNS.includes(sign as Sign)) return null;
  return periodPage(lang, `${MONTHLY_PATH}${sign}/`, sign as Sign, month, MONTHLY_PATH, { modified: month.start });
}
/** Static params for the sign folder of a partial locale. */
export const partialSignParams = () => SIGNS.map((s) => ({ sign: SL_SIGN_SLUGS[s] }));
/** The sign id behind a slug in a partial locale's folder, or undefined. */
export const partialSign = (slug: string): Sign | undefined => SIGNS.find((s) => SL_SIGN_SLUGS[s] === slug);
export function monthlyMeta(lang: PartialLocale, sign?: string): Metadata { const m = monthlyModel(lang, sign); return m ? modelMeta(lang, m) : {}; }
export function MonthlyPage({ lang, sign }: { lang: PartialLocale; sign?: string }) {
  const m = monthlyModel(lang, sign); if (!m) notFound();
  return <NumView lang={lang} m={m} sec={PARTIAL_UI[lang].sec} />;
}

/** Home of a partial locale: what the site offers in that language and a card per sign. Self-canonical, no hreflang pairs (the other languages have no matching page). */
export function homeMeta(lang: PartialLocale): Metadata {
  const U = PARTIAL_UI[lang]; const brand = getContent(lang).site.brand; const title = `${U.home.title} · ${brand}`;
  const img = `${SITE_URL}/og/default/${lang}.jpg`;
  return { title: { absolute: title }, description: U.description, robots: { index: true, follow: true }, alternates: { canonical: `/${lang}/` },
    openGraph: { type: "website", siteName: brand, title, description: U.description, url: absolute(`/${lang}/`), locale: "sl_SI", images: [{ url: img, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, description: U.description, images: [img] } };
}
export function PartialHome({ lang }: { lang: PartialLocale }) {
  const U = PARTIAL_UI[lang]; const H = U.home; const c = getContent(lang); const iso = todayIso();
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="h-display text-[2.2rem] leading-tight sm:text-[2.8rem]">{H.h1}</h1>
      <p className="h-display mt-2 max-w-2xl text-pretty text-[1.3rem] italic leading-snug text-gold/95 sm:text-[1.6rem]">{H.lead}</p>
      <div className="mt-4 max-w-2xl space-y-2 text-[15px] leading-snug text-mist/85 sm:text-[16px] sm:leading-relaxed">{H.intro.map((p) => <p key={p}>{p}</p>)}</div>
      <h2 className="h-display mb-1 mt-8 text-[1.6rem] leading-tight sm:text-[2rem]">{H.dailyHead}</h2>
      <ul className="grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
        {SIGNS.map((s) => (
          <li key={s} className="border-t border-white/10">
            <Link href={horoPath(lang, s)} className="group flex items-center gap-3 py-3.5 pr-2">
              <span aria-hidden className="h-display w-9 shrink-0 text-center text-[1.6rem] text-gold">{SIGN_GLYPH[s]}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-medium transition group-hover:text-gold">{c.astro.signs[s].name}</span>
                <span className="mt-0.5 block text-pretty text-[12.5px] leading-snug text-mist/65">{reading(lang, s, iso).headline}</span>
              </span>
              <span aria-hidden className="text-mist/40 transition group-hover:translate-x-0.5 group-hover:text-gold">→</span>
            </Link>
          </li>
        ))}
      </ul>
      <section className="mt-8 rounded-2xl border border-gold/25 bg-gold/[0.06] px-4 py-4">
        <h2 className="h-display text-[1.3rem]! leading-tight!">{H.monthlyHead}</h2>
        <p className="mt-1 text-[13.5px] text-mist/75">{H.monthlySub}</p>
        <Link href={localizedPath(lang, "/monthly-horoscope/")} className="mt-3 inline-flex min-h-[44px] items-center text-gold underline-offset-4 hover:underline">{U.nav.monthly} →</Link>
      </section>
      <p className="mt-6 text-[12.5px] text-mist/55">{H.note}</p>
    </div>
  );
}

/** Daily hub of a partial locale: the shared hub with the link list of the other sections replaced by one link to the monthly hub. */
export function PartialLinks({ lang }: { lang: PartialLocale }) {
  const U = PARTIAL_UI[lang];
  return (
    <section className="mt-10" aria-label={U.sec.explore}>
      <h2 className="h-display mb-3 text-[1.7rem] leading-tight sm:text-[2.2rem]">{U.sec.explore}</h2>
      <ul className="grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
        <li className="border-t border-white/10"><Link href={localizedPath(lang, "/monthly-horoscope/")} className="group flex items-center gap-3 py-3 pr-1"><span className="min-w-0 flex-1"><span className="block text-[15px] font-medium transition group-hover:text-gold">{U.nav.monthly}</span><span className="mt-0.5 block text-pretty text-[12.5px] leading-snug text-mist/65">{U.home.monthlySub}</span></span><span aria-hidden className="text-mist/40 transition group-hover:translate-x-0.5 group-hover:text-gold">→</span></Link></li>
      </ul>
    </section>
  );
}
