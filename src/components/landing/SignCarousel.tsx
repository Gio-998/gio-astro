"use client";
import { useEffect, useRef, useState } from "react";
import { SIGNS, SIGN_DATES, SIGN_ELEMENT, SIGN_RULER, Sign } from "@/engine/zodiac";
import { SignArt } from "../art/SignArt";
import { useContent, useHref } from "@/lib/content-context";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";

export function SignCarousel() {
  const { c } = useContent(); const h = useHref(); const A = c.astro;
  const track = useRef<HTMLDivElement>(null);
  const [sel, setSel] = useState<Sign>("aries");
  const [paused, setPaused] = useState(false);
  const scroll = (dir: number) => { const t = track.current; if (t) t.scrollBy({ left: dir * Math.min(t.clientWidth * 0.8, 640), behavior: "smooth" }); };
  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => { const t = track.current; if (!t) return; if (t.scrollLeft + t.clientWidth >= t.scrollWidth - 8) t.scrollTo({ left: 0, behavior: "smooth" }); else t.scrollBy({ left: 220, behavior: "smooth" }); }, 3800);
    return () => clearInterval(id);
  }, [paused]);
  const s = A.signs[sel];
  return (
    <div onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}>
      <div className="relative">
        <div ref={track} className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-6 pt-2" onTouchStart={() => setPaused(true)}>
          {SIGNS.map((sg) => (
            <button key={sg} onClick={() => setSel(sg)} aria-pressed={sel === sg}
              className={`group relative w-[190px] shrink-0 snap-start overflow-hidden rounded-[28px] border p-4 text-center transition duration-500 ${sel === sg ? "-translate-y-2 border-gold/70 bg-white/[0.12] shadow-[0_25px_60px_-20px_rgba(246,207,122,.55)]" : "border-white/12 bg-white/[0.05] hover:-translate-y-1 hover:border-gold/40"}`}>
              <SignArt sign={sg} className="mx-auto h-36 w-36 transition duration-700 group-hover:scale-110" />
              <p className="h-display mt-1 text-2xl">{A.signs[sg].name}</p>
              <p className="text-xs text-dim">{SIGN_DATES[sg][0]} → {SIGN_DATES[sg][1]}</p>
              <p className="mt-1 text-[11px] uppercase tracking-widest text-gold/80">{A.elements[SIGN_ELEMENT[sg]].name}</p>
            </button>
          ))}
        </div>
        <div className="mt-1 flex justify-center gap-3">
          <button className="btn-ghost !h-11 !w-11 !p-0" onClick={() => scroll(-1)} aria-label={c.site.carousel.prev}>←</button>
          <button className="btn-ghost !h-11 !w-11 !p-0" onClick={() => scroll(1)} aria-label={c.site.carousel.next}>→</button>
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={sel} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}
          className="card mt-6 grid items-center gap-6 md:grid-cols-[200px_1fr]">
          <SignArt sign={sel} className="mx-auto h-44 w-44" />
          <div>
            <p className="eyebrow mb-1">{A.elements[SIGN_ELEMENT[sel]].name} · ruled by {SIGN_RULER[sel]}</p>
            <h3 className="h-display mb-2 text-4xl">{s.name}: <span className="italic text-aurora">{s.essence}</span></h3>
            <p className="mb-2 text-mist/90"><b className="text-gold">{c.site.carousel.gifts}</b> {s.gifts}. <b className="text-rose">{c.site.carousel.edge}</b> {s.edge}.</p>
            <p className="mb-4 text-sm text-dim">{c.site.carousel.more}</p>
            <Link href={h("/start/")} className="btn-primary">{c.site.carousel.cta}</Link>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
