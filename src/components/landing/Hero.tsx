"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ZodiacWheel } from "../art/ZodiacWheel";
import { useHref, useContent } from "@/lib/content-context";
import { DatePicker } from "../DatePicker";
import { useBetaLocked } from "../auth/Beta";
import { moonPhase } from "@/engine/daily";
import { SIGN_GLYPH } from "@/engine/zodiac";
import { haptic } from "@/lib/haptics";

/** Split a phrase into kinetic words (CSS-only blur-rise, so the headline paints before hydration). */
function Words({ text, start, className = "" }: { text: string; start: number; className?: string }) {
  return <>{text.split(/(\s+)/).map((w, k) => (/^\s+$/.test(w) || !w ? w : <span key={k} className={`kinetic-word ${className}`} style={{ "--i": start + k / 2 } as React.CSSProperties}>{w}</span>))}</>;
}

/** Real moon line, computed in the browser (astronomy-engine). */
function Tonight() {
  const { c } = useContent();
  const [m, setM] = useState<ReturnType<typeof moonPhase> | null>(null);
  useEffect(() => { requestAnimationFrame(() => setM(moonPhase(new Date()))); }, []);
  return (
    <p className="inline-flex min-h-[32px] items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3 text-[12.5px] text-mist/90 backdrop-blur-md" data-testid="hero-tonight">
      <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sage/70" /><span className="relative inline-flex h-2 w-2 rounded-full bg-sage" /></span>
      {m ? <>{c.sky.hero.tonight(c.daily.moonPhases[m.phase].name, c.astro.signs[m.moonSign].name, m.illumination)} <span className="text-gold">{SIGN_GLYPH[m.moonSign]}</span></> : <span className="w-48">&nbsp;</span>}
    </p>
  );
}

/** One rotating word in holographic type ("yourself" → "your love" → …). Inline, kept on the same line as the lead-in. */
function Rotator({ words }: { words: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || words.length < 2) return;
    const id = setInterval(() => setI((n) => (n + 1) % words.length), 2600);
    return () => clearInterval(id);
  }, [words.length]);
  return <span className="inline-block whitespace-nowrap"><span key={i} className="kinetic-word holo-text italic pr-[0.08em]" style={{ "--i": i === 0 ? 1 : 0 } as React.CSSProperties}>{words[i]}</span></span>;
}

export function Hero() {
  const h = useHref(); const router = useRouter(); const { c } = useContent(); const H = c.site.hero; const S = c.sky.hero;
  const [date, setDate] = useState(""); const [showDate, setShowDate] = useState(false);
  const go = (e?: React.FormEvent) => { e?.preventDefault(); haptic("tick"); router.push(h(`/start/${date ? `?date=${date}` : ""}`)); };
  const locked = useBetaLocked(); const B = c.ui.beta;
  return (
    <section className="bleed relative -mt-[72px] flex min-h-[100svh] flex-col overflow-hidden pb-8 pt-[84px] md:-mt-[76px] md:pt-[96px]" data-testid="hero">
      {/* gilded wheel, slowly turning; the Living Sky (global, fixed) shows through everything */}
      <div className="pointer-events-none absolute -right-[38vw] top-[10%] h-[110vmin] w-[110vmin] opacity-[0.28] sm:-right-[20vw] md:right-[-8vw] md:top-[6%] md:h-[92vmin] md:w-[92vmin] md:opacity-40" aria-hidden>
        <ZodiacWheel className="h-full w-full animate-spin-slow drop-shadow-[0_0_30px_rgba(255,200,97,.25)]" />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0e0b26] to-transparent" aria-hidden />

      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col px-5">
        <Tonight />
        <div className="mt-auto max-w-2xl pt-8 md:my-auto">
          <p className="eyebrow mb-4 kinetic-word" style={{ "--i": 0 } as React.CSSProperties}>{H.eyebrow}</p>
          <h1 className="h-display mb-5 text-[clamp(2.85rem,12.4vw,4rem)] md:text-[clamp(3.6rem,5.2vw,5.2rem)] font-medium leading-[0.98] tracking-[-0.015em] [text-wrap:balance]">
            <span className="block whitespace-nowrap"><Words text={H.see.trim()} start={0} />{" "}<Rotator words={H.words} /></span>
            <span className="block"><Words text={H.mid.replace(/^,\s*/, "").trim()} start={2} /></span>
            <span className="block"><Words text={H.end} start={6} className="italic text-aurora" /></span>
          </h1>
          <p className="rise-in mb-6 max-w-xl text-[15.5px] leading-relaxed text-mist/90 sm:text-lg" style={{ animationDelay: ".55s" }}>{H.sub}</p>

          {locked ? (
            <div className="rise-in mb-4 max-w-xl" style={{ animationDelay: ".7s" }} data-testid="hero-beta">
              <div className="flex flex-col gap-2 sm:flex-row">
                <a href="#waitlist" className="btn-primary min-h-[56px] px-7 text-center text-base">{B.joinBeta} ✦</a>
                <a href={h("/account/")} className="btn-ghost min-h-[56px] px-6 text-center text-base">{B.login}</a>
              </div>
            </div>
          ) : (
            <div className="rise-in mb-4 max-w-xl" style={{ animationDelay: ".7s" }}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Link href={h("/start/")} onClick={() => haptic("tick")} className="btn-primary min-h-[56px] px-8 text-[17px]" data-testid="hero-begin">{S.begin}</Link>

              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-1 text-[13.5px]">
                {!showDate && <button type="button" onClick={() => setShowDate(true)} className="min-h-[40px] rounded-full px-1 text-gold underline-offset-4 hover:underline" aria-expanded={showDate} data-testid="hero-date-toggle">{S.orDate}</button>}
                {!showDate && <span className="text-dim" aria-hidden>·</span>}
                <Link href={h("/match/")} className="min-h-[40px] content-center rounded-full px-1 text-gold underline-offset-4 hover:underline">{H.orMatch}</Link>
              </div>
              {showDate && (
                <form onSubmit={go} className="glass rise-in mt-3 flex flex-col gap-2 rounded-[24px] p-2.5 sm:flex-row sm:items-end">
                  <div className="flex-1 px-2 pt-1">
                    <span className="mb-1 block font-display text-lg italic text-gold">{H.bornOn}</span>
                    <DatePicker value={date} onChange={setDate} compact />
                  </div>
                  <button className="btn-primary min-h-[48px] px-6">{H.reveal}</button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
      <a href="#discover" className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs text-dim md:flex" aria-label={H.scrollDown}>
        <span className="eyebrow !text-[10px] !text-dim">{H.scroll}</span>
        <span className="h-10 w-px animate-pulse bg-gradient-to-b from-gold to-transparent" />
      </a>
    </section>
  );
}
