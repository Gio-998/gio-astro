"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ZodiacWheel } from "../art/ZodiacWheel";
import { useHref, useContent } from "@/lib/content-context";
import { useNav } from "../nav/Nav";
import { moonPhase } from "@/engine/daily";
import { SIGN_GLYPH } from "@/engine/zodiac";
import { haptic } from "@/lib/haptics";

/** Real moon line, computed in the browser (astronomy-engine). */
function Tonight() {
  const { c } = useContent();
  const [m, setM] = useState<ReturnType<typeof moonPhase> | null>(null);
  useEffect(() => { requestAnimationFrame(() => setM(moonPhase(new Date()))); }, []);
  return (
    <p className="inline-flex min-h-[32px] items-center gap-2 self-start rounded-2xl border border-white/12 bg-white/[0.05] px-3 py-1 text-[12px] leading-snug text-mist/85 backdrop-blur-md sm:text-[12.5px]" data-testid="hero-tonight">
      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
      {m ? <>{c.sky.hero.tonight(c.daily.moonPhases[m.phase].name, c.astro.signs[m.moonSign].name, m.illumination)} <span className="text-gold">{SIGN_GLYPH[m.moonSign]}</span></> : <span className="w-48">&nbsp;</span>}
    </p>
  );
}

/** First screen: one line of what this is, one main action, one quieter one. */
export function Hero() {
  const h = useHref(); const { c } = useContent(); const H = c.site.hero; const N = useNav();
  return (
    <section className="bleed relative -mt-[72px] flex flex-col overflow-hidden pb-12 pt-[84px] md:-mt-[76px] md:min-h-[74svh] md:pb-14 md:pt-[104px]" data-testid="hero">
      {/* gilded wheel, slowly turning; the Living Sky (global, fixed) shows through everything */}
      <div className="pointer-events-none absolute -right-[42vw] top-[12%] h-[110vmin] w-[110vmin] opacity-[0.2] sm:-right-[22vw] md:right-[-18vw] md:top-[4%] lg:right-[-8vw] md:h-[88vmin] md:w-[88vmin] md:opacity-[0.3]" aria-hidden>
        <ZodiacWheel className="h-full w-full animate-spin-slow drop-shadow-[0_0_30px_rgba(255,200,97,.2)]" />
      </div>
      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col px-4">
        <Tonight />
        <div className="max-w-2xl pt-9 md:my-auto md:pt-6">
          <h1 className="h-display rise-in mb-4 text-[clamp(2.3rem,10.4vw,3.1rem)]! font-medium leading-[1.06]! tracking-[-0.01em] md:text-[clamp(3.2rem,5vw,4.6rem)]!">{H.title[0]}<span className="italic text-aurora">{H.title[1]}</span></h1>
          <p className="rise-in mb-7 max-w-lg text-[17px] leading-relaxed text-mist/85 sm:text-lg" style={{ animationDelay: ".15s" }}>{H.sub}</p>
          <div className="rise-in flex flex-col gap-3 sm:flex-row sm:items-center" style={{ animationDelay: ".3s" }}>
            <Link href={h("/quizzes/")} onClick={() => haptic("tick")} className="btn-primary min-h-[56px]! px-9 text-[17px]!" data-testid="hero-start">{N.start} ✦</Link>
            <Link href={h("/horoscope/")} className="inline-flex min-h-[52px] items-center justify-center rounded-full px-5 text-[15.5px] text-gold transition hover:bg-white/[0.06]" data-testid="hero-daily">{H.daily} →</Link>
          </div>
          <ul className="rise-in mt-5 flex flex-wrap gap-x-4 gap-y-1 text-[13.5px] text-mist/70" style={{ animationDelay: ".45s" }}>
            {H.perks.map((p) => <li key={p} className="flex items-center gap-1.5"><span aria-hidden className="text-gold">✓</span>{p}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}
