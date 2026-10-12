import Link from "next/link";
import { getContent } from "@/content";
import { LENS_EVIDENCE, LensId } from "@/engine/compat";
import { quizDefs, QUIZ_IDS } from "@/lib/quiz-defs";
import { QUIZ_ART } from "@/components/art/quizArt";
import { Hero } from "@/components/landing/Hero";
import { BetaInvite, StartOrJoin } from "@/components/auth/Beta";
import { SignCarousel } from "@/components/landing/SignCarousel";
import { PickACard } from "@/components/landing/PickACard";
import { SkyNow } from "@/components/landing/SkyNow";
import { Faq } from "@/components/landing/Faq";
import { ScoreDemo } from "@/components/landing/ScoreDemo";
import { SectionHead, Ornament } from "@/components/landing/Bits";
import { Reveal } from "@/components/art/Reveal";
import { ArtCard, cosmos, Cosmos } from "@/components/art/ArtCard";
import { Emblem, EmblemId } from "@/components/art/Emblem";
import { SignArt } from "@/components/art/SignArt";
import { ZodiacWheel } from "@/components/art/ZodiacWheel";
import { ScrollFx } from "@/components/landing/ScrollFx";

const LENS_ICON: Record<LensId, EmblemId> = { western: "chart", vedic: "vedic", chinese: "chinese", numerology: "number", tarot: "tarot", yinyang: "yinyang", bigfive: "big-five", attachment: "attachment", care: "care", temperament: "temperament", nine: "nine", fourletter: "fourletter", shadow: "shadow", dosha: "dosha" };

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  const c = getContent(lang); const h = (p: string) => `/${lang}${p}`;
  const defs = quizDefs(c);
  const tiers = (["research", "popular", "traditional"] as const).map((e) => ({ e, lenses: (Object.keys(LENS_EVIDENCE) as LensId[]).filter((l) => LENS_EVIDENCE[l] === e) }));
  const tierStyle = { research: "from-sage/25 to-transparent border-sage/30", popular: "from-violet/25 to-transparent border-violet/30", traditional: "from-gold/20 to-transparent border-gold/30" };
  const jsonLd = { "@context": "https://schema.org", "@type": "WebApplication", name: c.site.brand, applicationCategory: "LifestyleApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" }, description: c.site.description };
  const L = c.landing;
  const T = (t: string[]) => <>{t[0]}{t[1] && <span className="italic text-aurora">{t[1]}</span>}{t[2]}</>;
  const discover: { img: Cosmos; t: string; d: string; href: string; e: EmblemId }[] = (["orion", "helix", "twinjet", "cliffs"] as Cosmos[]).map((img, i) => ({ img, ...L.discover[i], href: ["/start/", "/quizzes/", "/match/", "/today/"][i], e: (["chart", "eye", "bond", "moon"] as EmblemId[])[i] }));
  const examples = L.examples;
  const faq = L.faq;
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />
      <ScrollFx />

      {/* Lens marquee */}
      <div className="bleed relative -mt-6 overflow-hidden border-y border-white/10 bg-white/[0.04] py-4 backdrop-blur" aria-label={L.lensesIncluded}>
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
          {[0, 1].map((k) => (
            <div key={k} className="flex gap-10" aria-hidden={k === 1}>
              {(Object.keys(LENS_ICON) as LensId[]).map((l) => <span key={l} className="flex items-center gap-2 font-display text-xl text-mist/80"><Emblem id={LENS_ICON[l]} className="h-6 w-6" />{c.compat.lenses[l].name}</span>)}
            </div>
          ))}
        </div>
      </div>

      {/* What you'll discover */}
      <section id="discover" className="scroll-mt-20 py-24">
        <SectionHead eyebrow={L.s1.eyebrow} title={T(L.s1.title)} sub={L.s1.sub} />
        <div className="grid gap-5 sm:grid-cols-2">
          {discover.map((d, i) => (
            <Reveal key={d.t} delay={i * 0.08}>
              <Link href={h(d.href)} className="group relative block h-80 overflow-hidden rounded-[32px] border border-white/15 shadow-[0_30px_70px_-35px_rgba(139,108,240,.9)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cosmos(d.img, 1280)} srcSet={`${cosmos(d.img, 640)} 640w, ${cosmos(d.img, 1280)} 1280w`} sizes="(min-width: 640px) 50vw, 100vw" alt="" loading="lazy" decoding="async" data-fx="parallax" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-night via-night/55 to-transparent" />
                <Emblem id={d.e} className="absolute right-6 top-6 h-14 w-14 opacity-90 glow-gold transition duration-700 group-hover:rotate-12" />
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <h3 className="h-display mb-2 text-4xl">{d.t}</h3>
                  <p className="max-w-md text-mist/85">{d.d}</p>
                  <span className="mt-3 inline-block text-sm text-gold transition group-hover:translate-x-1">{L.explore}</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Choose your sign */}
      <section className="pb-24">
        <SectionHead eyebrow={L.s2.eyebrow} title={T(L.s2.title)} sub={L.s2.sub} />
        <SignCarousel />
      </section>

      {/* Free tools */}
      <section className="bleed relative overflow-hidden py-24" data-sky="1.35">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo/25 to-transparent" />
        <div className="relative mx-auto max-w-5xl px-4">
          <SectionHead eyebrow={L.s3.eyebrow} title={T(L.s3.title)} sub={L.s3.sub} />
          <Reveal><PickACard /></Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-fx="pop">
            {(["/start/", "/match/", "/quizzes/", "/today/"].map((href, i) => [href, L.tools[i][0], L.tools[i][1], (["chart", "bond", "big-five", "moon"] as EmblemId[])[i]]) as [string, string, string, EmblemId][]).map(([href, t, d, e], i) => (
              <Reveal key={href} delay={i * 0.07}>
                <Link href={h(href)} className="card card-hover block h-full text-center">
                  <Emblem id={e} className="mx-auto mb-3 h-14 w-14 glow-gold" />
                  <p className="h-display text-2xl">{t}</p>
                  <p className="text-sm text-dim">{d}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Lenses showcase */}
      <section className="py-24">
        <SectionHead eyebrow={L.s4.eyebrow} title={T(L.s4.title)} sub={L.s4.sub} />
        <div className="space-y-8">
          {tiers.map((t, ti) => (
            <Reveal key={t.e} delay={ti * 0.05}>
              <div className={`rounded-[32px] border bg-gradient-to-br p-6 ${tierStyle[t.e]}`}>
                <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
                  <p className="h-display text-3xl">{c.compat.evidence[t.e].icon} {c.compat.evidence[t.e].label}</p>
                  <p className="max-w-md text-sm text-dim">{c.compat.evidence[t.e].text}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {t.lenses.map((l) => (
                    <div key={l} className="group flex items-start gap-3 rounded-2xl border border-white/10 bg-night/40 p-4 transition hover:-translate-y-0.5 hover:border-gold/40 hover:bg-night/60">
                      <Emblem id={LENS_ICON[l]} className="h-11 w-11 shrink-0 transition duration-500 group-hover:rotate-12" />
                      <div><p className="font-semibold">{c.compat.lenses[l].name}</p><p className="text-sm text-dim">{c.compat.lenses[l].short}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* How it works — parchment band */}
      <section className="band-parchment bleed relative overflow-hidden py-24">
        <ZodiacWheel className="pointer-events-none absolute -left-40 top-10 h-[560px] w-[560px] animate-spin-slow opacity-[0.12] [filter:sepia(1)_saturate(3)_hue-rotate(-20deg)]" />
        <div className="relative mx-auto max-w-5xl px-4">
          <SectionHead light eyebrow={L.s5.eyebrow} title={T(L.s5.title)} sub={L.s5.sub} />
          <div className="grid gap-6 md:grid-cols-3">
            {(L.steps.map(([t, d], i) => [String(i + 1), t, d, (["sun", "eye", "bond"] as EmblemId[])[i]]) as [string, string, string, EmblemId][]).map(([n, t, d, e], i) => (
              <Reveal key={n} delay={i * 0.1}>
                <div className="relative h-full rounded-[28px] border border-[#2a2350]/10 bg-white/80 p-7 shadow-[0_30px_60px_-40px_rgba(42,35,80,.6)]">
                  <span className="absolute -top-5 left-7 grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#f6cf7a] to-[#f6b5cf] font-display text-xl font-bold text-plum shadow">{n}</span>
                  <div className="mb-4 mt-2 grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-[#2b2266] to-[#3b2f86]"><Emblem id={e} className="h-12 w-12" /></div>
                  <h3 className="h-display mb-2 text-2xl font-semibold text-plum">{t}</h3>
                  <p className="text-[#4a4278]">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Sample report */}
      <section className="py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <SectionHead center={false} eyebrow={L.s6.eyebrow} title={T(L.s6.title)} />
            <Reveal>
              <ul className="space-y-4 text-mist/90">
                {L.sampleList.map(([t, d]) => (
                  <li key={t} className="flex gap-3"><span className="mt-1 text-gold">✦</span><span><b className="text-mist">{t}.</b> <span className="text-dim">{d}</span></span></li>
                ))}
              </ul>
              <Link href={h("/match/")} className="btn-primary mt-8">{L.compareTwo}</Link>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <div className="relative mx-auto w-[300px] sm:w-[330px]">
              <div className="absolute -inset-10 rounded-full bg-violet/30 blur-3xl" />
              <div className="relative rounded-[48px] border border-white/20 bg-gradient-to-b from-[#2b2266] to-[#1c1645] p-3 shadow-[0_50px_100px_-30px_rgba(0,0,0,.9)]">
                <div className="mx-auto mb-2 h-5 w-24 rounded-full bg-night" />
                <div className="overflow-hidden rounded-[36px] bg-night/80 p-5">
                  <p className="mb-1 text-center text-[10px] uppercase tracking-[0.3em] text-dim">{L.sample.label}</p>
                  <div className="mb-3 flex items-center justify-center gap-2">
                    <SignArt sign="leo" className="h-16 w-16" animate={false} />
                    <span className="text-2xl text-rose">♡</span>
                    <SignArt sign="pisces" className="h-16 w-16" animate={false} />
                  </div>
                  <p className="h-display mb-3 text-center text-2xl">Maya <span className="text-dim">&</span> Sam</p>
                  <div className="mb-4 flex justify-center"><ScoreDemo value={84} label={L.sample.resonance} /></div>
                  <div className="mb-3 rounded-2xl bg-white/[0.06] p-3 text-center">
                    <p className="text-xs text-dim">{L.sample.archetype}</p>
                    <p className="h-display text-xl text-gold">{L.sample.garden}</p>
                    <p className="text-xs text-mist/80">{L.sample.gardenSub}</p>
                  </div>
                  {[[L.sample.harmony, 78, "from-sage to-[#a9c8ff]"], [L.sample.spark, 88, "from-rose to-gold"]].map(([l, v, g]) => (
                    <div key={l as string} className="mb-2">
                      <div className="mb-1 flex justify-between text-xs text-dim"><span>{l}</span><span>{v}</span></div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/10"><div className={`h-full rounded-full bg-gradient-to-r ${g}`} style={{ width: `${v}%` }} /></div>
                    </div>
                  ))}
                  <p className="mt-3 rounded-2xl border border-gold/20 bg-gold/5 p-3 text-xs text-mist/85">✦ <b>{L.sample.tryLabel}</b> {L.sample.tryText}</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Quiz grid */}
      <section className="pb-24">
        <SectionHead eyebrow={L.s7.eyebrow} title={T(L.s7.title)} sub={L.s7.sub} />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4" data-fx="pop">
          {QUIZ_IDS.map((id, i) => (
            <Reveal key={id} delay={(i % 4) * 0.07}>
              <Link href={h(`/quiz/${id}/`)} className="block h-full">
                <ArtCard img={QUIZ_ART[id].img} tint={QUIZ_ART[id].tint} emblem={id} className="h-full min-h-[300px] transition duration-500 hover:-translate-y-2">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-gold/80">{defs[id].minutes} min</p>
                  <p className="h-display mb-1 text-2xl leading-tight">{defs[id].title}</p>
                  <p className="text-xs text-mist/75">{defs[id].tagline}</p>
                </ArtCard>
              </Link>
            </Reveal>
          ))}
          <Reveal delay={0.21}>
            <Link href={h("/bond/")} className="block h-full">
              <ArtCard img="twinjet" tint="rose" emblem="bond" className="h-full min-h-[300px] transition duration-500 hover:-translate-y-2">
                <p className="text-[10px] uppercase tracking-[0.25em] text-gold/80">{L.forTwo}</p>
                <p className="h-display mb-1 text-2xl leading-tight">{L.bondCheck}</p>
                <p className="text-xs text-mist/75">{L.bondCheckSub}</p>
              </ArtCard>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Daily */}
      <section className="pb-24">
        <SectionHead eyebrow={L.s8.eyebrow} title={T(L.s8.title)} sub={L.s8.sub} />
        <Reveal><SkyNow /></Reveal>
      </section>

      {/* Example discoveries — clearly labelled */}
      <section className="band-lilac bleed overflow-hidden py-24">
        <div className="mx-auto max-w-5xl px-4">
          <SectionHead light eyebrow={L.s9.eyebrow} title={T(L.s9.title)} sub={L.s9.sub} />
        </div>
        <div className="relative">
          <div className="flex w-max animate-marquee gap-5 hover:[animation-play-state:paused]">
            {[...examples, ...examples].map(([who, q], i) => (
              <figure key={i} aria-hidden={i >= examples.length} className="w-[320px] shrink-0 rounded-[28px] border border-[#2a2350]/10 bg-white/80 p-6 shadow-[0_20px_50px_-30px_rgba(42,35,80,.5)]">
                <span className="mb-3 inline-block rounded-full bg-[#2a2350]/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-[#5f5590]">{L.example}</span>
                <blockquote className="h-display mb-3 text-xl leading-snug text-plum">{q}</blockquote>
                <figcaption className="text-xs text-[#5f5590]">{who}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Promise */}
      <section className="py-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-[40px] border border-gold/30 p-8 sm:p-12">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cosmos("helix", 1280)} srcSet={`${cosmos("helix", 640)} 640w, ${cosmos("helix", 1280)} 1280w`} sizes="100vw" alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-r from-night via-night/85 to-night/40" />
            <div className="relative grid items-center gap-8 md:grid-cols-[1.3fr_1fr]">
              <div>
                <p className="eyebrow mb-3">{L.promise.eyebrow}</p>
                <h2 className="h-display mb-5 text-[clamp(2rem,4vw,3.2rem)] leading-tight">{T(L.promise.title)}</h2>
                <ul className="space-y-2 text-mist/90">
                  {L.promise.items.map((x) => <li key={x} className="flex gap-3"><span className="text-gold">✦</span>{x}</li>)}
                </ul>
                <Link className="btn-ghost mt-6" href={h("/promise/")}>{L.promise.read}</Link>
              </div>
              <Emblem id="eye" className="mx-auto h-48 w-48 animate-float glow-gold" />
            </div>
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="band-parchment bleed py-24">
        <div className="mx-auto max-w-5xl px-4">
          <SectionHead light eyebrow={L.faqHead.eyebrow} title={L.faqHead.title} />
          <Faq items={faq} />
        </div>
      </section>

      <BetaInvite />

      {/* CTA band */}
      <section className="bleed relative overflow-hidden py-28 text-center" data-sky="1.45">
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_50%,rgba(255,200,97,.12),transparent_70%)]" />
        <div className="relative mx-auto max-w-2xl px-4">
          <Ornament />
          <h2 className="h-display mb-4 mt-4 text-[clamp(2.4rem,6vw,4.4rem)] leading-[1.02]">{T(L.cta.title)}</h2>
          <p className="mb-8 text-lg text-mist/90">{L.cta.sub}</p>
          <StartOrJoin className="btn-primary px-8 py-4 text-lg" label={`${c.site.common.start} ✦`} />
        </div>
      </section>
    </div>
  );
}
