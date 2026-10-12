"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMounted } from "../controls";
import { useContent, useHref } from "@/lib/content-context";
import { Blocks } from "../story/Blocks";
import type { SysCard } from "@/story/systems";
import { SysEvidenceChip } from "./SysEvidenceChip";

function HexLines({ lines, moving }: { lines: number[]; moving?: number }) {
  return (
    <div className="mx-auto my-3 flex w-28 flex-col-reverse gap-1.5" aria-hidden>
      {lines.map((v, i) => (
        <div key={i} className="flex h-3 gap-2">
          {v ? <span className={`h-full flex-1 rounded-sm ${moving === i + 1 ? "bg-rose" : "bg-gold"}`} /> : <><span className={`h-full flex-1 rounded-sm ${moving === i + 1 ? "bg-rose" : "bg-gold/80"}`} /><span className={`h-full flex-1 rounded-sm ${moving === i + 1 ? "bg-rose" : "bg-gold/80"}`} /></>}
        </div>
      ))}
    </div>
  );
}
export function BioBars({ bio }: { bio: NonNullable<SysCard["bio"]> }) {
  const { c } = useContent(); const B = c.systems.biorhythm;
  return (
    <div className="my-3 grid gap-2">
      {(["physical", "emotional", "intellectual"] as const).map((k) => (
        <div key={k} className="flex items-center gap-3 text-sm">
          <span className="w-20 shrink-0 text-dim">{B[k].name}</span>
          <div className="relative h-3 flex-1 rounded-full bg-white/10"><span className="absolute inset-y-0 left-1/2 w-px bg-white/30" />
            <span className={`absolute inset-y-0 rounded-full ${bio[k] >= 0 ? "left-1/2 bg-gradient-to-r from-amber to-gold" : "right-1/2 bg-gradient-to-l from-violet to-lilac"}`} style={{ width: `${Math.abs(bio[k]) / 2}%` }} />
          </div>
          <span className="w-10 text-right font-mono text-xs">{bio[k] > 0 ? "+" : ""}{bio[k]}</span>
          {bio.critical.includes(k) && <span className="chip !text-[10px]">{c.systems.ui.switchDay}</span>}
        </div>
      ))}
    </div>
  );
}

/** Bottom sheet (phone) / centred card (desktop) for one system: what it is, what it says for you, method and sources. */
export function SystemSheet({ card, onClose }: { card: SysCard | null; onClose: () => void }) {
  const { c } = useContent(); const h = useHref(); const reduce = useReducedMotion(); const mounted = useMounted();
  const U = c.systems.ui; const L = c.lensUi; const [heavyOpen, setHeavyOpen] = useState(false); const [method, setMethod] = useState(false);
  useEffect(() => {
    if (!card) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    const prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; setHeavyOpen(false); setMethod(false); };
  }, [card, onClose]);
  if (!mounted) return null;
  const m = card ? c.systems.meta[card.key] : null;
  return createPortal(
    <AnimatePresence>
      {card && m && (
        <motion.div key="sys-sheet" className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button aria-label={L.close} className="absolute inset-0 bg-[#07051a]/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div role="dialog" aria-modal="true" aria-labelledby="sys-sheet-title" data-testid="system-sheet"
            className="relative flex max-h-[88dvh] w-full flex-col overflow-hidden rounded-t-[28px] border border-white/15 bg-[#17123d] shadow-[0_-20px_80px_-20px_rgba(139,108,240,.7)] sm:max-w-2xl sm:rounded-[28px]"
            initial={reduce ? { opacity: 0 } : { y: "100%" }} animate={reduce ? { opacity: 1 } : { y: 0 }} exit={reduce ? { opacity: 0 } : { y: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}>
            <div className="flex justify-center pt-2.5 sm:hidden" aria-hidden><span className="h-1.5 w-12 rounded-full bg-white/25" /></div>
            <div className="flex items-center gap-4 border-b border-white/10 px-5 pb-4 pt-3 sm:px-7 sm:pt-6">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-gold/40 bg-gradient-to-br from-indigo to-ink text-3xl text-gold shadow-[0_0_24px_-6px_rgba(246,207,122,.6)]" aria-hidden>{card.glyph}</span>
              <div className="min-w-0 flex-1">
                <p className="eyebrow mb-0.5">{m.name}</p>
                <h2 id="sys-sheet-title" className="h-display text-2xl leading-tight sm:text-3xl">{card.value}</h2>
              </div>
              <button onClick={onClose} aria-label={L.close} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 text-lg text-dim transition hover:border-gold/50 hover:text-gold">✕</button>
            </div>
            <div className="overflow-y-auto overscroll-contain px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 sm:px-7">
              <div className="mb-4 flex flex-wrap items-center gap-2 text-xs"><SysEvidenceChip e={card.evidence} /><span className="text-dim">🔒 {card.provenance}</span></div>
              <p className="eyebrow mb-1.5">✦ {L.inPlainWords}</p>
              <p className="mb-5 leading-relaxed text-mist/90">{m.what}</p>
              <p className="eyebrow mb-1.5">✦ {L.forYouMe}</p>
              <div className="night-surface rounded-2xl px-4 py-3"><div className="reading">
                {card.hexLines && <HexLines lines={card.hexLines} moving={card.movingLine} />}
                {card.bio && <BioBars bio={card.bio} />}
                {card.degree && (card.degree.image
                  ? (card.degree.heavy && !heavyOpen
                    ? <aside className="callout callout-note"><p>{U.degreeHeavy}</p><button className="btn-ghost mt-2" onClick={() => setHeavyOpen(true)}>{U.showAnyway}</button></aside>
                    : <blockquote className="pull" lang="en">“{card.degree.image}”<br /><span className="text-xs opacity-70">{U.degreeQuote}</span></blockquote>)
                  : <aside className="callout callout-note"><p>{U.degreeNone}</p></aside>)}
                <Blocks blocks={card.blocks} />
              </div></div>
              {card.premium && <Link href={h("/premium/year-ahead/")} className="mt-4 block rounded-2xl border border-dashed border-gold/40 bg-gold/[0.06] px-4 py-3 text-sm"><span className="text-gold">✧ {U.premiumMore}</span> <span className="underline">{U.premiumLink} →</span></Link>}
              <div className="mt-5 border-t border-white/10 pt-4 text-sm">
                <button type="button" aria-expanded={method} onClick={() => setMethod(!method)} className="inline-flex min-h-[44px] items-center gap-2 text-gold underline decoration-dotted underline-offset-4">🔬 {U.method} <span aria-hidden className={`transition ${method ? "rotate-180" : ""}`}>⌄</span></button>
                {method && (
                  <div className="mt-2 space-y-2 text-sm text-mist/90" data-testid="system-method">
                    <p><b>{U.inputsLabel}</b> {m.inputs}</p>
                    <p>{m.method}</p>
                    <ul className="list-disc pl-5 text-xs text-dim">{m.sources.map((s) => <li key={s}>{s}</li>)}</ul>
                  </div>
                )}
                <Link className="mt-2 block text-dim underline decoration-dotted underline-offset-4 hover:text-mist" href={h(`/how-it-works/#${card.key}`)}>{c.systems.how.link} ↗</Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  , document.body);
}
