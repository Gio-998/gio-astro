"use client";
import Link from "next/link";
import { createContext, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useMounted } from "./controls";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Profile } from "@/engine/profile";
import { useContent, useHref } from "@/lib/content-context";
import { buildLens, LENS_KEYS, LensKey } from "@/story/lens";
import { quizDefs } from "@/lib/quiz-defs";
import { Blocks } from "./story/Blocks";
import { SignArt } from "./art/SignArt";
import { Emblem } from "./art/Emblem";

/** Opens the inline explainer for a lens badge. Provided by ProfileView; falls back to a no-op. */
export const LensSheetCtx = createContext<(k: string) => void>(() => {});
export const useLensSheet = () => useContext(LensSheetCtx);

const PREVIEW = 2; // blocks shown before "Read more"

/**
 * Inline explainer for one badge: a bottom sheet on phones, a centred card on wider screens.
 * Plain-words meaning + what it says about this person; "Read more" expands the full reading in place.
 * The standalone /lens page stays reachable as a secondary link.
 */
export function LensSheet({ k, profile, personId, personName, onClose }: { k: string | null; profile: Profile; personId?: string; personName?: string; onClose: () => void }) {
  const { c } = useContent(); const h = useHref(); const reduce = useReducedMotion(); const mounted = useMounted();
  const [more, setMore] = useState(false);
  const valid = k && (LENS_KEYS as readonly string[]).includes(k);
  const page = valid ? buildLens(k as LensKey, profile, c) : null;
  const L = c.lensUi; const defs = quizDefs(c);
  const q = personId ? `&id=${personId}` : "";

  useEffect(() => {
    if (!k) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    const prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [k, onClose]);

  if (!mounted) return null;
  // Portal to <body>: cards use backdrop-filter, which would trap position:fixed inside them.
  return createPortal(
    <AnimatePresence onExitComplete={() => setMore(false)}>
      {page && (
        <motion.div key="lens-sheet" className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button aria-label={L.close} className="absolute inset-0 bg-[#07051a]/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            role="dialog" aria-modal="true" aria-labelledby="lens-sheet-title" data-testid="lens-sheet"
            className="relative flex max-h-[88dvh] w-full flex-col overflow-hidden rounded-t-[28px] border border-white/15 bg-[#17123d] shadow-[0_-20px_80px_-20px_rgba(139,108,240,.7)] sm:max-w-2xl sm:rounded-[28px]"
            initial={reduce ? { opacity: 0 } : { y: "100%" }} animate={reduce ? { opacity: 1 } : { y: 0 }} exit={reduce ? { opacity: 0 } : { y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="flex justify-center pt-2.5 sm:hidden" aria-hidden><span className="h-1.5 w-12 rounded-full bg-white/25" /></div>
            <div className="flex items-center gap-4 border-b border-white/10 px-5 pb-4 pt-3 sm:px-7 sm:pt-6">
              <div className="shrink-0">{page.art.kind === "sign" ? <SignArt sign={page.art.sign} className="h-16 w-16" /> : <Emblem id={page.art.id} className="h-14 w-14 glow-gold" />}</div>
              <div className="min-w-0 flex-1">
                <p className="eyebrow mb-0.5">{page.name}</p>
                <h2 id="lens-sheet-title" className="h-display text-2xl leading-tight sm:text-3xl">{page.title}</h2>
              </div>
              <button onClick={onClose} aria-label={L.close} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 text-lg text-dim transition hover:border-gold/50 hover:text-gold">✕</button>
            </div>
            <div className="overflow-y-auto overscroll-contain px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 sm:px-7">
              <p className="eyebrow mb-1.5">✦ {L.inPlainWords}</p>
              <p className="mb-5 leading-relaxed text-mist/90">{page.what}</p>
              {page.blocks ? (
                <>
                  <p className="eyebrow mb-1.5">✦ {personId && personName ? L.forYou(personName) : L.forYouMe}</p>
                  <div className="night-surface rounded-2xl px-4 py-3"><div className="reading"><Blocks blocks={more ? page.blocks : page.blocks.slice(0, PREVIEW)} forId={personId} /></div></div>
                  {page.blocks.length > PREVIEW && (
                    <button className="btn-primary mt-4 w-full sm:w-auto" aria-expanded={more} onClick={() => setMore((m) => !m)}>{more ? `▴ ${L.showLess}` : `▾ ${L.readMore}`}</button>
                  )}
                </>
              ) : page.quiz ? (
                <Link className="card card-hover block border-dashed !border-gold/30" href={h(`/quiz/${page.quiz}/${personId ? `?for=${personId}` : ""}`)}>
                  <span className="font-semibold">✧ {defs[page.quiz].title}</span><br /><span className="text-sm text-dim">{L.notUnlocked} {defs[page.quiz].tagline}</span>
                </Link>
              ) : null}
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-4 text-sm">
                <Link className="text-gold underline decoration-dotted underline-offset-4" href={h(`/book/${personId ? `?id=${personId}` : ""}#ch-${page.chapter}`)}>📖 {L.related}</Link>
                <Link className="text-dim underline decoration-dotted underline-offset-4 hover:text-mist" href={h(`/lens/?k=${page.key}${q}`)}>{L.openFull} ↗</Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  , document.body);
}
