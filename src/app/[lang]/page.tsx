import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/content";
import { HOME_META } from "@/content/home-meta";
import { numContent } from "@/content/numerology";
import { SIGNS } from "@/engine/zodiac";
import { localizedMeta } from "@/lib/seo";
import { quizDefs, QUIZ_IDS } from "@/lib/quiz-defs";
import { bankFor, horoPath } from "@/lib/horoscope";
import { localizedPath } from "@/lib/i18n-routes";
import { navFor } from "@/lib/site-links";
import { abs, ORG_REF } from "@/lib/schema";
import { Hero } from "@/components/landing/Hero";
import { Ornament, Pills, SectionHead } from "@/components/landing/Bits";
import { Emblem, type EmblemId } from "@/components/art/Emblem";

const ANGEL = ["111", "222", "333", "444", "555", "777", "888", "1111", "1212", "1234"];
const PAIR_LINKS: { href: string; icon: EmblemId }[] = [{ href: "/sign-compatibility/", icon: "bond" }, { href: "/match/", icon: "care" }, { href: "/bond/", icon: "attachment" }];

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params; const H = HOME_META[lang];
  return H ? { title: { absolute: H.title }, description: H.description, ...localizedMeta(lang, "/", { ...H, siteName: getContent(lang).site.brand }) } : {};
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  const c = getContent(lang); const L = c.landing; const N = navFor(lang); const defs = quizDefs(c);
  const Sky = bankFor(lang).ui; const Num = numContent(lang).ui;
  const p = (x: string) => localizedPath(lang, x);
  const T = (t: string[]) => <>{t[0]}{t[1] && <span className="italic text-aurora">{t[1]}</span>}{t[2]}</>;
  const jsonLd = { "@context": "https://schema.org", "@type": "WebApplication", name: c.site.brand, url: abs(`/${lang}/`), inLanguage: lang, applicationCategory: "LifestyleApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" }, description: c.site.description, publisher: ORG_REF };
  const tile = "rounded-2xl border border-white/10 bg-white/[0.04] transition hover:border-gold/50 hover:bg-white/[0.07]";
  const block = "scroll-mt-20 border-t border-white/[0.07] py-12 sm:py-16";
  return (
    <div data-testid="home">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />
      {/* Same width as the hero, header and footer, so every left edge lines up. */}
      <div className="bleed"><div className="mx-auto w-full max-w-6xl px-4">

      {/* Today's horoscope by sign, then every other reading of the sky */}
      <section aria-labelledby="home-signs" className={block} data-testid="home-signs">
        <SectionHead id="home-signs" eyebrow={Sky.homeEyebrow} title={Sky.homeTitle} link={{ href: horoPath(lang), label: Sky.homeAll }} />
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
          {SIGNS.map((s) => (
            <li key={s}>
              <Link href={horoPath(lang, s)} className={`${tile} flex min-h-[96px] flex-col items-center justify-center gap-1 px-1 py-2 text-center text-[14px] text-mist/90`}>
                {/* The cached sign files keep this grid out of the HTML. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/art/sign/${s}.svg`} alt="" width={52} height={52} loading="lazy" decoding="async" className="h-[52px] w-[52px]" />
                {c.astro.signs[s].name}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mb-3 mt-7 text-sm text-mist/70">{L.signs.more}</p>
        <Pills items={N.groups.astrology.items.map((i) => ({ href: p(i.href), label: i.title }))} />
      </section>

      {/* Tests */}
      <section aria-labelledby="home-tests" className={block} data-testid="home-tests">
        <SectionHead id="home-tests" eyebrow={L.tests.eyebrow} title={T(L.tests.title)} sub={L.tests.sub} link={{ href: p("/quizzes/"), label: L.tests.all }} />
        <ul className="grid gap-2 sm:grid-cols-2">
          {QUIZ_IDS.map((id) => (
            <li key={id}>
              <Link href={p(`/quiz/${id}/`)} className={`${tile} flex min-h-[76px] items-center gap-3 p-3`}>
                <Emblem id={id} className="h-11 w-11 shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="h-display block text-[1.3rem]! leading-tight!">{defs[id].title}</span>
                  <span className="block text-[13px] leading-snug text-mist/70">{defs[id].tagline}</span>
                </span>
                <span className="shrink-0 whitespace-nowrap text-xs text-gold/85">{c.site.common.minutes(defs[id].minutes)}</span>
              </Link>
            </li>
          ))}
          <li><Link href={p("/quizzes/")} className="btn-primary h-full min-h-[56px]! w-full text-base!" data-testid="home-tests-start">{N.start} ✦</Link></li>
        </ul>
      </section>

      {/* Compatibility */}
      <section aria-labelledby="home-pairs" className={block} data-testid="home-pairs">
        <SectionHead id="home-pairs" eyebrow={L.pairs.eyebrow} title={T(L.pairs.title)} sub={L.pairs.sub} />
        <ul className="grid gap-3 md:grid-cols-3">
          {L.pairs.cards.map((x, i) => (
            <li key={x.t}>
              <Link href={p(PAIR_LINKS[i].href)} className={`${tile} flex h-full min-h-[88px] items-center gap-3 p-4 md:flex-col md:items-start`}>
                <Emblem id={PAIR_LINKS[i].icon} className="h-11 w-11 shrink-0" />
                <span className="min-w-0">
                  <span className="h-display block text-[1.45rem]! leading-tight!">{x.t}</span>
                  <span className="mt-0.5 block text-sm leading-snug text-mist/70">{x.d}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Numerology */}
      <section aria-labelledby="home-numbers" className={block} data-testid="home-numbers">
        <SectionHead id="home-numbers" eyebrow={Num.homeEyebrow} title={Num.homeTitle} sub={Num.homeSub} link={{ href: p("/numerology/"), label: N.groups.numerology.label }} />
        <Pills items={[{ href: p("/numerology/calculator/life-path/"), label: Num.calc.tryLife, strong: true }, ...ANGEL.map((n) => ({ href: p(`/numerology/angel-numbers/${n}/`), label: n })), { href: p("/numerology/angel-numbers/"), label: `${Num.allAngel} →` }]} />
      </section>

      {/* How it works */}
      <section aria-labelledby="home-how" className={block} data-testid="home-how">
        <SectionHead id="home-how" eyebrow={L.how.eyebrow} title={T(L.how.title)} link={{ href: p("/how-it-works/"), label: L.how.more }} />
        <ol className="grid gap-6 md:grid-cols-3">
          {L.how.steps.map(([t, d], i) => (
            <li key={t} className="flex gap-4 md:block">
              <span aria-hidden className="h-display shrink-0 text-[2.4rem]! leading-none! text-gold/90 md:mb-2 md:block">{i + 1}</span>
              <span className="min-w-0">
                <span className="h-display mb-1 block text-[1.45rem]! leading-tight!">{t}</span>
                <span className="block text-[15px] leading-relaxed text-mist/75">{d}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* Trust: the promise, then plain answers */}
      <section aria-labelledby="home-trust" className={`${block} grid gap-10 md:grid-cols-[1fr_1.15fr]`} data-testid="home-trust">
        <div>
          <SectionHead id="home-trust" eyebrow={L.trust.eyebrow} title={T(L.trust.title)} />
          <ul className="space-y-2.5 text-[15px] text-mist/85">
            {L.trust.items.map((x) => <li key={x} className="flex gap-2.5"><span aria-hidden className="text-gold">✓</span>{x}</li>)}
          </ul>
          <Link className="mt-5 inline-flex min-h-[44px] items-center text-sm text-gold underline-offset-4 hover:underline" href={p("/promise/")}>{L.trust.read} →</Link>
        </div>
        <div>
          <h3 className="eyebrow mb-3 text-[11px]">{L.faqTitle}</h3>
          <div className="divide-y divide-white/10 border-y border-white/10">
            {L.faq.map(([q, a]) => (
              <details key={q} className="group">
                <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-3 py-2 text-[15.5px] font-medium text-mist">{q}<span className="shrink-0 text-lg text-gold transition group-open:rotate-45" aria-hidden>+</span></summary>
                <p className="pb-4 text-[14.5px] leading-relaxed text-mist/75">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final call */}
      <section aria-labelledby="home-cta" className="border-t border-white/[0.07] pb-4 pt-14 text-center sm:pt-20" data-testid="home-cta">
        <Ornament />
        <h2 id="home-cta" className="h-display mb-3 mt-4 text-[clamp(2.3rem,6vw,3.8rem)]! font-medium leading-[1.06]!">{T(L.cta.title)}</h2>
        <p className="mx-auto mb-7 max-w-md text-[16.5px] text-mist/80">{L.cta.sub}</p>
        <Link href={p("/quizzes/")} className="btn-primary min-h-[56px]! w-full px-10 text-[17px]! sm:w-auto">{N.start} ✦</Link>
      </section>

      </div></div>
    </div>
  );
}
