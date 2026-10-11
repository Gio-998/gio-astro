import Link from "next/link";
import { getContent } from "@/content";
import { LENS_EVIDENCE, LensId } from "@/engine/compat";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  const c = getContent(lang); const h = (p: string) => `/${lang}${p}`;
  const tiers: { e: "research" | "popular" | "traditional"; extra: string[] }[] = [
    { e: "research", extra: ["Bond Check (for two)"] },
    { e: "popular", extra: ["Autopilot vs Explorer mind", "Social stance"] },
    { e: "traditional", extra: ["Four pillars & Day Master", "Archetype animal", "Colour palette", "Daily transits & moon"] },
  ];
  const jsonLd = { "@context": "https://schema.org", "@type": "WebApplication", name: c.site.brand, applicationCategory: "LifestyleApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" }, description: c.site.description };
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="py-10 text-center">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-dim">stars · numbers · elements · science</p>
        <h1 className="h-display mb-4 text-5xl leading-tight text-gold sm:text-6xl">See yourself — and the people you love — in new colours.</h1>
        <p className="mx-auto mb-8 max-w-xl text-lg text-mist/90">Every lens humanity has used to understand people — astrology, Vedic stars, the Chinese zodiac, numbers, tarot, temperaments, yin and yang — plus the ones science supports. One honest mirror. Free.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link className="btn-primary px-7 py-3 text-base" href={h("/start/")}>{c.site.common.start} ✨</Link>
          <Link className="btn-ghost px-7 py-3 text-base" href={h("/match/")}>Check a compatibility</Link>
        </div>
        <p className="mt-4 text-xs text-dim">No sign-up · no email · full results free · data stays on your device</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          ["1 · Quick start", "Name and birth date. In 90 seconds you see your Sun, Moon, Chinese animal, Life Path, tarot card, archetype animal and palette."],
          ["2 · Go deeper", "Take 2-minute quizzes when you like. Each one unlocks a new layer — personality, attachment, motivations, shadows, body type."],
          ["3 · Understand your bonds", "Compare with a partner, friend, parent or colleague. See where the lenses agree, your superpowers, and practical ways to grow."],
        ].map(([t, d]) => <div key={t} className="card"><p className="h-display mb-1 text-xl text-gold">{t}</p><p className="text-sm">{d}</p></div>)}
      </section>

      <section className="mt-12">
        <h2 className="h-display mb-1 text-3xl text-gold">Eighteen lenses, honestly labelled</h2>
        <p className="mb-4 text-sm text-dim">We tell you which lenses have research behind them and which are symbolic traditions. Both have value — one explains, the other inspires.</p>
        <div className="grid gap-3">
          {tiers.map((t) => (
            <div key={t.e} className="card">
              <p className="mb-2 font-semibold">{c.compat.evidence[t.e].icon} {c.compat.evidence[t.e].label}</p>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(LENS_EVIDENCE) as LensId[]).filter((l) => LENS_EVIDENCE[l] === t.e).map((l) => <span key={l} className="chip text-mist">{c.compat.lenses[l].name}</span>)}
                {t.extra.map((x) => <span key={x} className="chip text-mist">{x}</span>)}
              </div>
              <p className="mt-2 text-xs text-dim">{c.compat.evidence[t.e].text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-4 sm:grid-cols-2">
        <div className="card">
          <h2 className="h-display mb-2 text-2xl text-gold">Relationships that heal and boost you</h2>
          <p className="text-sm">Some bonds calm us, some ignite us, some teach us the hardest lessons. Our compatibility never says “incompatible”. Every pair gets a Harmony and a Spark score per lens, an overall Resonance, a bond archetype — Harbor, Wildfire, Forge or Garden — and concrete practices for its growth edges.</p>
        </div>
        <div className="card">
          <h2 className="h-display mb-2 text-2xl text-gold">Our no-tricks promise</h2>
          <ul className="space-y-1 text-sm"><li>✦ Full quiz results free — never a paywall at the end</li><li>✦ No fake urgency, no “psychic is typing”</li><li>✦ Future paid extras: published prices, one-click cancel, real refunds</li><li>✦ Your data stays on your device</li></ul>
          <Link className="mt-3 inline-block text-sm text-gold underline" href={h("/promise/")}>Read the promise →</Link>
        </div>
      </section>

      <section className="mt-12 grid gap-3 sm:grid-cols-4">
        {[["/today/", "☀︎ Daily guidance", "Moon phase, your transits, card of the day, journal prompt"], ["/quizzes/", "◎ Quizzes", "7 quizzes, all results free"], ["/bond/", "🤝 Bond Check", "A check-in you take together"], ["/learn/", "🔬 How it works", "Methods, sources, honesty"]].map(([href, t, d]) => (
          <Link key={href} href={h(href)} className="card hover:border-gold/40"><p className="font-semibold">{t}</p><p className="text-xs text-dim">{d}</p></Link>
        ))}
      </section>
    </div>
  );
}
