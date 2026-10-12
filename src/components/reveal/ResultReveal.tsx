"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Emblem, type EmblemId } from "../art/Emblem";
import { Celebration } from "../art/Celebration";
import { HoloCard } from "./HoloCard";
import { useContent } from "@/lib/content-context";
import { setSky, resetSky } from "@/lib/sky-bus";
import { haptic } from "@/lib/haptics";
import { ShareButton } from "../ShareButton";
import { useStore } from "@/lib/store";
import { profileOf } from "@/lib/profile";

const EMBLEMS: EmblemId[] = ["big-five", "attachment", "nine", "care", "shadow", "dosha", "explorer", "bond", "chart", "sun", "moon", "tarot", "number", "yinyang", "chinese", "vedic", "palette", "animal", "temperament", "fourletter", "eye"];

/**
 * Collectible result reveal, ~4s, skippable (tap anywhere):
 * 1) the sky swirls in  2) a face-down card rises with a heartbeat tick  3) it flips to a holographic face + star burst
 * 4) the title slams in, then "Continue" / "Share card". Reduced motion: the face appears straight away.
 */
export function ResultReveal({ eyebrow, title, subtitle, emblem, onDone }: { eyebrow?: string; title: string; subtitle?: string; emblem?: string; onDone?: () => void }) {
  const { c } = useContent(); const R = c.sky.reveal; const s = useStore();
  const [beat, setBeat] = useState(0); const [open, setOpen] = useState(true); const [mounted, setMounted] = useState(false);
  const reduce = useRef(false);
  const palette = s?.me ? profileOf(s.me).palette : ["#8b6cf0", "#ffc861", "#5ee6d0", "#ff8fc7", "#c9b8ff"];
  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    requestAnimationFrame(() => setMounted(true));
    if (reduce.current) { requestAnimationFrame(() => setBeat(3)); return; }
    setSky({ swirl: 1, intensity: 1.45 });
    const ts = [setTimeout(() => { setBeat(1); haptic("heartbeat"); }, 450), setTimeout(() => { setBeat(2); haptic("celebrate"); setSky({ swirl: 0.25 }); }, 1500), setTimeout(() => setBeat(3), 2200)];
    return () => { ts.forEach(clearTimeout); resetSky(); };
  }, []);
  const close = () => { setOpen(false); resetSky(); setTimeout(() => onDone?.(), 350); };
  const skip = () => { if (beat < 3) { setBeat(3); setSky({ swirl: 0.25 }); } else close(); };
  if (!mounted) return null;
  const em = emblem && (EMBLEMS as string[]).includes(emblem) ? (emblem as EmblemId) : null;
  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={`${eyebrow ?? R.unlocked}: ${title}`} data-testid="result-reveal" onClick={skip}
      className={`story-root fixed inset-0 z-[85] flex flex-col items-center justify-center overflow-hidden bg-[radial-gradient(80%_60%_at_50%_45%,rgba(20,14,60,.55),rgba(6,4,22,.92))] px-6 text-center backdrop-blur-[3px] transition-opacity duration-300 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}>
      {beat >= 2 && <Celebration count={36} />}
      <div className={`flip mb-7 h-[min(46svh,360px)] w-[min(58vw,230px)] transition-all duration-700 ease-[cubic-bezier(.2,.8,.2,1)] ${beat >= 1 ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"}`}>
        <div className={`flip-inner ${beat >= 2 ? "flipped" : ""}`}>
          <div className="flip-face grid place-items-center rounded-[22px] border border-gold/50 bg-[radial-gradient(circle_at_50%_40%,#3b2f86,#1c1645_70%)] shadow-[0_0_80px_-10px_rgba(255,200,97,.55)]">
            <div className="absolute inset-2 rounded-[16px] border border-gold/30" />
            <svg viewBox="0 0 100 100" className="h-1/2 w-1/2 animate-pulse" aria-hidden><path d="M50 8 L57 43 L92 50 L57 57 L50 92 L43 57 L8 50 L43 43 Z" fill="none" stroke="#ffc861" strokeWidth="1.2" /><circle cx="50" cy="50" r="30" fill="none" stroke="#ffc861" strokeOpacity=".5" strokeDasharray="2 4" /></svg>
          </div>
          <div className="flip-face flip-back">
            <HoloCard className="flex h-full w-full flex-col items-center justify-center rounded-[22px] border border-gold/70 bg-[radial-gradient(circle_at_50%_30%,#5240b0,#1c1645_78%)] shadow-[0_30px_90px_-20px_rgba(255,143,199,.6)]">
              <div className="absolute inset-2 rounded-[16px] border border-white/25" />
              {em ? <Emblem id={em} className="h-[42%] w-[62%] glow-gold" /> : <svg viewBox="0 0 100 100" className="h-[42%] w-[62%]" aria-hidden><path d="M50 6 L58 42 L94 50 L58 58 L50 94 L42 58 L6 50 L42 42 Z" fill="#ffc861" fillOpacity=".85" /></svg>}
              <p className="mt-4 px-3 font-display text-[22px] font-semibold leading-tight text-gold">{title}</p>
            </HoloCard>
          </div>
        </div>
      </div>
      <div className={`transition-opacity duration-300 ${beat >= 3 ? "opacity-100" : "opacity-0"}`}>
        <p className="eyebrow mb-2">✦ {eyebrow ?? R.unlocked}</p>
        {beat >= 3 && <h2 className="h-display slam mb-2 text-[clamp(2.4rem,10vw,4rem)] leading-[1.02]"><span className="italic text-aurora">{title}</span></h2>}
        {subtitle && <p className="mx-auto mb-1 max-w-sm text-[15px] text-mist/85">{subtitle}</p>}
        <p className="mb-6 text-xs text-sage">✓ {R.collected}</p>
        <div className="flex flex-col items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button type="button" className="btn-primary min-h-[52px] min-w-[240px] text-base" onClick={close} data-testid="reveal-continue" disabled={beat < 3}>{R.tap}</button>
          {beat >= 3 && <ShareButton className="btn-ghost min-h-[44px] min-w-[240px]" filename={`horoscop-${title}`} spec={{ eyebrow: eyebrow ?? R.unlocked, title, subtitle, lines: [], palette, footer: c.sky.share.footer, svg: () => document.querySelector("[data-testid='result-reveal'] .flip-back svg")?.outerHTML ?? null }} />}
        </div>
      </div>
      {beat < 3 && <button type="button" className="absolute bottom-[max(20px,env(safe-area-inset-bottom))] text-sm text-mist/70 underline underline-offset-4" onClick={(e) => { e.stopPropagation(); skip(); }}>{R.skip}</button>}
    </div>,
    document.body,
  );
}
