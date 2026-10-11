"use client";
import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

/** Animated count-up score ring used in the sample report. */
export function ScoreDemo({ value, label, size = 120 }: { value: number; label: string; size?: number }) {
  const ref = useRef<SVGSVGElement>(null); const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { requestAnimationFrame(() => setV(value)); return; }
    let raf = 0; const t0 = performance.now();
    const step = (t: number) => { const p = Math.min(1, (t - t0) / 1600); setV(Math.round(value * (1 - (1 - p) ** 3))); if (p < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step); return () => cancelAnimationFrame(raf);
  }, [inView, value]);
  const r = 44, C = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center">
      <svg ref={ref} width={size} height={size} viewBox="0 0 100 100">
        <defs><linearGradient id="sd-g" x1="0" x2="1"><stop offset="0" stopColor="#f6b5cf" /><stop offset=".5" stopColor="#f6cf7a" /><stop offset="1" stopColor="#ffd6b8" /></linearGradient></defs>
        <circle cx="50" cy="50" r={r} stroke="rgba(255,255,255,.12)" strokeWidth="7" fill="none" />
        <circle cx="50" cy="50" r={r} stroke="url(#sd-g)" strokeWidth="7" fill="none" strokeLinecap="round" strokeDasharray={`${(C * v) / 100} ${C}`} transform="rotate(-90 50 50)" />
        <text x="50" y="58" textAnchor="middle" fontSize="26" fill="#f5f1ff" fontFamily="Georgia, serif">{v}</text>
      </svg>
      <span className="text-xs uppercase tracking-widest text-dim">{label}</span>
    </div>
  );
}
