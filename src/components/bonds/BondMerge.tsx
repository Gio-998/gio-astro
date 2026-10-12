"use client";
import { useEffect, useRef, useState } from "react";
import { useContent } from "@/lib/content-context";
import { prefersReducedMotion } from "@/lib/device-tier";
import { haptic } from "@/lib/haptics";

type Shape = "helix" | "bridge" | "sparks";
export const shapeOf = (resonance: number, spark: number): Shape => (spark - resonance > 8 ? "sparks" : resonance >= 70 ? "helix" : "bridge");

/**
 * Two aura clouds (each person's palette) spiral in, meet and settle into a shape that encodes the bond:
 * helix = deep harmony, bridge = complementary, sparks = high chemistry. Canvas 2D, ~5 s, skippable,
 * static final frame for reduced motion.
 */
export function BondMerge({ a, b, ca, cb, resonance, spark }: { a: string; b: string; ca: string[]; cb: string[]; resonance: number; spark: number }) {
  const { c } = useContent(); const M = c.sky.merge;
  const ref = useRef<HTMLCanvasElement>(null); const box = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(0); const [t, setT] = useState(0); const [started, setStarted] = useState(false); const [instant, setInstant] = useState(false);
  const shape = shapeOf(resonance, spark); const DUR = 5000;
  useEffect(() => {
    const el = box.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStarted(true); io.disconnect(); } }, { threshold: 0.35 });
    io.observe(el); return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!started) return;
    const cv = ref.current; if (!cv) return; const ctx = cv.getContext("2d"); if (!ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1); const W = cv.clientWidth, H = cv.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr; ctx.scale(dpr, dpr);
    const N = 140; const rnd = (i: number) => { const x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); };
    const parts = Array.from({ length: N * 2 }, (_, i) => ({ side: i < N ? -1 : 1, r: rnd(i), r2: rnd(i + 999), col: (i < N ? ca : cb)[i % 5] }));
    const reduce = prefersReducedMotion() || instant; const t0 = performance.now(); let raf = 0; let lastBeat = 0;
    const ease = (x: number) => 1 - Math.pow(1 - x, 3);
    const frame = (now: number) => {
      const p = reduce ? 1 : Math.min(1, (now - t0) / DUR); const e = ease(p);
      ctx.clearRect(0, 0, W, H); ctx.globalCompositeOperation = "lighter";
      const cx = W / 2, cy = H / 2, R = Math.min(W, H) * 0.42;
      for (const q of parts) {
        const ang0 = q.r * Math.PI * 2; const start = { x: cx + q.side * W * 0.28 + Math.cos(ang0) * R * 0.35 * q.r2, y: cy + Math.sin(ang0) * R * 0.35 * q.r2 };
        let tx: number, ty: number; const k = q.r * 2 - 1; const time = now / 1000;
        if (shape === "helix") { const y = k * R * 0.9; tx = cx + Math.sin(k * 6 + time * 1.4 + (q.side > 0 ? Math.PI : 0)) * R * 0.32; ty = cy + y; }
        else if (shape === "bridge") { const lobe = q.r2 < 0.82; tx = lobe ? cx + q.side * R * 0.5 + Math.cos(ang0 + time * 0.4) * R * 0.3 * q.r2 : cx + k * R * 0.5; ty = lobe ? cy + Math.sin(ang0 + time * 0.4) * R * 0.3 * q.r2 : cy + Math.sin(k * 3 + time) * 6; }
        else { tx = cx + q.side * R * 0.32 + Math.cos(ang0 + time * 0.6) * R * 0.38 * q.r2; ty = cy + Math.sin(ang0 + time * 0.6) * R * 0.38 * q.r2; }
        // spiral in: rotate the path around the centre while travelling
        const sw = (1 - e) * 2.4 * q.side; const mx = start.x + (tx - start.x) * e, my = start.y + (ty - start.y) * e;
        const dx = mx - cx, dy = my - cy; const x = cx + dx * Math.cos(sw) - dy * Math.sin(sw), y = cy + dx * Math.sin(sw) + dy * Math.cos(sw);
        const size = 1.4 + q.r2 * 2.4;
        ctx.fillStyle = q.col + "cc"; ctx.beginPath(); ctx.arc(x, y, size, 0, 7); ctx.fill();
        ctx.fillStyle = q.col + "22"; ctx.beginPath(); ctx.arc(x, y, size * 4, 0, 7); ctx.fill();
      }
      if (shape === "sparks" && e > 0.85) { for (let i = 0; i < 14; i++) { const y = cy + (rnd(i + Math.floor(now / 90)) * 2 - 1) * R * 0.6; ctx.fillStyle = "#fff6d8"; ctx.beginPath(); ctx.arc(cx + (rnd(i * 3 + Math.floor(now / 90)) - 0.5) * 18, y, 1.3, 0, 7); ctx.fill(); } }
      ctx.globalCompositeOperation = "source-over";
      setT(p);
      if (p > 0.6 && !lastBeat) { lastBeat = 1; haptic("heartbeat"); }
      if (!reduce) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [started, run, ca, cb, shape, instant]);
  const shown = Math.round(resonance * Math.min(1, t / 0.9));
  return (
    <div ref={box} className="card relative mb-4 overflow-hidden text-center" data-testid="bond-merge">
      <p className="eyebrow mb-1">✦ {M.eyebrow}</p>
      <div className="relative mx-auto h-64 w-full max-w-lg">
        <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-label={`${a} & ${b}`} role="img" />
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="grid h-28 w-28 place-items-center content-center rounded-full bg-[#0e0b26]/70 backdrop-blur-sm"><p className="font-display text-5xl leading-none text-gold drop-shadow-[0_0_24px_rgba(255,200,97,.7)]">{shown}</p><p className="eyebrow mt-1 !text-[10px]">{M.resonance}</p></div>
        </div>
        <span className="absolute bottom-1 left-3 text-xs text-dim">{a}</span><span className="absolute bottom-1 right-3 text-xs text-dim">{b}</span>
      </div>
      <p className={`h-display mt-2 text-xl text-balance transition-opacity duration-700 ${t >= 1 ? "opacity-100" : "opacity-0"}`}>{M.shape(shape)}</p>
      <button className="mt-1 min-h-[40px] text-sm text-dim underline underline-offset-4 print:hidden" onClick={() => { setInstant(t < 1); setRun((r) => r + 1); }}>{t < 1 ? M.skip : M.replay}</button>
    </div>
  );
}
