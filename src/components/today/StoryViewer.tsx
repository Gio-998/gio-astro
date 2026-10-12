"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { setSky, resetSky } from "@/lib/sky-bus";
import { haptic } from "@/lib/haptics";
import { shareOrDownload, type CardSpec } from "@/lib/share";
import { track } from "@/lib/track";

export interface StorySlide {
  id: string;
  label: string;
  /** Slide body; `active` is true while this slide is on screen. */
  render: (s: { active: boolean; pause: (p: boolean) => void }) => React.ReactNode;
  share?: () => CardSpec;
  sky?: { intensity?: number; swirl?: number; palette?: [string, string, string] | null };
  /** Auto-advance after ms (default 7000). 0 = wait for a tap. */
  duration?: number;
}

export interface ViewerText { close: string; prev: string; next: string; pause: string; play: string; hint: string; share: string; sharing: string; saved: string }

/**
 * Full-screen stories: progress bars, tap right/left (or swipe) to move, hold to pause, swipe down / Esc / back to close.
 * Interactive elements inside a slide mark themselves with data-interactive so taps on them don't navigate.
 * Reduced motion: no auto-advance.
 */
export function StoryViewer({ slides, start = 0, onClose, onSeen, t, filePrefix = "horoscop-today" }: { slides: StorySlide[]; start?: number; onClose: () => void; onSeen?: (id: string) => void; t: ViewerText; filePrefix?: string }) {
  const [i, setI] = useState(start);
  const [held, setHeld] = useState(false); const [locked, setLocked] = useState(false); const [sharing, setSharing] = useState(false); const [saved, setSaved] = useState(false);
  const [reduce] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const paused = held || locked || sharing || reduce;
  const slide = slides[i];
  const down = useRef<{ x: number; y: number; t: number; id: number; target: EventTarget | null } | null>(null);
  const holdTimer = useRef<number | undefined>(undefined);
  const [dragY, setDragY] = useState(0);
  const closedByUi = useRef(false);

  const go = useCallback((d: number) => {
    setI((n) => { const m = n + d; if (m < 0) return 0; if (m >= slides.length) { requestAnimationFrame(() => close()); return n; } return m; });
    haptic("tick"); setLocked(false); setSaved(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- close is stable for the viewer's lifetime
  }, [slides.length]);
  const close = useCallback(() => {
    if (closedByUi.current) return; closedByUi.current = true;
    if (history.state?.stories) history.back(); else onClose();
  }, [onClose]);

  // history entry so the phone's back gesture closes the stories
  useEffect(() => {
    history.pushState({ ...(history.state || {}), stories: 1 }, "");
    const onPop = () => onClose();
    window.addEventListener("popstate", onPop);
    const prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    document.documentElement.classList.add("stories-open"); // hides the page so only the Living Sky shows behind the story
    return () => { window.removeEventListener("popstate", onPop); document.body.style.overflow = prev; document.documentElement.classList.remove("stories-open"); resetSky(); };
  }, [onClose]);

  useEffect(() => { onSeen?.(slide.id); setSky({ intensity: slide.sky?.intensity ?? 1.15, swirl: slide.sky?.swirl ?? 0, palette: slide.sky?.palette ?? null }); }, [slide, onSeen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest?.("textarea,input")) return;
      if (e.key === "Escape") close(); else if (e.key === "ArrowRight") go(1); else if (e.key === "ArrowLeft") go(-1); else if (e.key === " ") { e.preventDefault(); setLocked((l) => !l); }
    };
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  }, [go, close]);

  const isInteractive = (el: EventTarget | null) => !!(el as HTMLElement | null)?.closest?.("[data-interactive],button,a,textarea,input,label");
  const onDown = (e: React.PointerEvent) => {
    down.current = { x: e.clientX, y: e.clientY, t: performance.now(), id: e.pointerId, target: e.target };
    if (!isInteractive(e.target)) holdTimer.current = window.setTimeout(() => setHeld(true), 220);
  };
  const onMove = (e: React.PointerEvent) => { const d = down.current; if (!d || d.id !== e.pointerId) return; const dy = e.clientY - d.y; if (dy > 0 && Math.abs(dy) > Math.abs(e.clientX - d.x)) setDragY(dy); };
  const onUp = (e: React.PointerEvent) => {
    const d = down.current; down.current = null; clearTimeout(holdTimer.current);
    const wasHeld = held; setHeld(false); setDragY(0);
    if (!d) return;
    const dx = e.clientX - d.x, dy = e.clientY - d.y; const dt = performance.now() - d.t;
    if (dy > 110 && Math.abs(dy) > Math.abs(dx)) return close();
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) return go(dx < 0 ? 1 : -1);
    if (wasHeld || dt > 400 || isInteractive(d.target) || Math.hypot(dx, dy) > 12) return;
    go(e.clientX < window.innerWidth * 0.3 ? -1 : 1);
  };

  const share = async () => {
    if (!slide.share) return; setSharing(true); haptic("tick");
    try { const r = await shareOrDownload(slide.share(), `${filePrefix}-${slide.id}.png`); if (r !== "cancelled") { track("share_card"); haptic("success"); } if (r === "downloaded") setSaved(true); }
    finally { setSharing(false); }
  };
  const dur = slide.duration ?? 7000;

  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={slide.label} data-testid="story-viewer"
      data-story-root className="story-root fixed inset-0 z-[80] flex select-none flex-col overflow-hidden bg-[radial-gradient(120%_80%_at_50%_40%,transparent,rgba(8,6,26,.55))] text-mist [touch-action:none]"
      style={{ transform: dragY ? `translateY(${dragY * 0.6}px) scale(${1 - Math.min(dragY, 300) / 3000})` : undefined, transition: dragY ? "none" : "transform .3s cubic-bezier(.2,.8,.2,1)", borderRadius: dragY ? 28 : 0 }}
      onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={() => { down.current = null; setHeld(false); setDragY(0); clearTimeout(holdTimer.current); }}>
      {/* progress */}
      <div className="flex gap-1.5 px-3 pt-[max(10px,env(safe-area-inset-top))]" aria-hidden>
        {slides.map((s, k) => (
          <span key={s.id} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/25">
            <span key={k === i ? `on-${i}` : "off"} className="block h-full origin-left rounded-full bg-white"
              style={k < i ? { transform: "scaleX(1)" } : k > i ? { transform: "scaleX(0)" } : dur && !reduce ? { animation: `bar-fill ${dur}ms linear both`, animationPlayState: paused ? "paused" : "running" } : { transform: "scaleX(1)", opacity: 0.7 }}
              onAnimationEnd={k === i ? () => go(1) : undefined} />
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between px-4 pt-2">
        <p className="eyebrow !text-[10px] !text-mist/85" aria-live="polite">{slide.label} · {i + 1}/{slides.length}</p>
        <div className="flex items-center gap-1">
          {!reduce && <button type="button" onClick={() => setLocked(!locked)} className="grid h-11 w-11 place-items-center rounded-full text-lg text-mist/90 active:scale-90" aria-label={locked ? t.play : t.pause} data-testid="story-pause">{locked ? "▶" : "❚❚"}</button>}
          <button type="button" onClick={close} className="grid h-11 w-11 place-items-center rounded-full text-2xl text-mist active:scale-90" aria-label={t.close} data-testid="story-close">×</button>
        </div>
      </div>
      <div className="relative flex min-h-0 flex-1 flex-col">
        {slides.map((s, k) => k === i && <div key={s.id} className="flex min-h-0 flex-1 flex-col">{s.render({ active: true, pause: setLocked })}</div>)}
      </div>
      <div className="flex flex-col items-center gap-2 px-5 pb-[max(18px,env(safe-area-inset-bottom))] pt-2">
        {saved && <p role="status" className="max-w-sm text-center text-xs text-mist/85">{t.saved}</p>}
        <div className="flex w-full max-w-md items-center gap-2">
          <button type="button" onClick={() => go(-1)} className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/20 bg-white/10 text-xl backdrop-blur active:scale-90 disabled:opacity-30" disabled={i === 0} aria-label={t.prev}>‹</button>
          {slide.share ? <button type="button" onClick={share} disabled={sharing} className="btn-primary min-h-[48px] flex-1 text-base" data-testid="story-share">{sharing ? t.sharing : <>⇪ {t.share}</>}</button> : <span className="flex-1" />}
          <button type="button" onClick={() => go(1)} className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/20 bg-white/10 text-xl backdrop-blur active:scale-90" aria-label={t.next} data-testid="story-next">›</button>
        </div>
        <p className="text-center text-[11px] text-mist/60">{t.hint}</p>
      </div>
    </div>,
    document.body,
  );
}
