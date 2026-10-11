"use client";
import { useEffect, useState } from "react";

/** Burst of gold stars + soft halo for result reveals. Renders nothing under reduced motion. */
export function Celebration({ count = 28 }: { count?: number }) {
  const [parts, setParts] = useState<{ x: number; y: number; s: number; d: number; c: string }[]>([]);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cols = ["#f6cf7a", "#ffd6b8", "#f6b5cf", "#c9b8ff", "#fffaf0"];
    requestAnimationFrame(() => setParts(Array.from({ length: count }, (_, i) => { const a = (i / count) * Math.PI * 2 + Math.random() * 0.4; const r = 90 + Math.random() * 140; return { x: Math.cos(a) * r, y: Math.sin(a) * r * 0.8, s: 6 + Math.random() * 10, d: Math.random() * 0.25, c: cols[i % cols.length] }; })));
  }, [count]);
  return (
    <div className="pointer-events-none absolute inset-x-0 top-10 z-10 flex justify-center" aria-hidden>
      <style>{`@keyframes burst{0%{transform:translate(0,0) scale(.2) rotate(0);opacity:0}15%{opacity:1}100%{transform:translate(var(--x),var(--y)) scale(1) rotate(180deg);opacity:0}}`}</style>
      {parts.map((p, i) => (
        <svg key={i} viewBox="0 0 20 20" width={p.s} height={p.s} className="absolute"
          style={{ "--x": `${p.x}px`, "--y": `${p.y}px`, animation: `burst 1.6s ${p.d}s cubic-bezier(.15,.8,.3,1) both` } as React.CSSProperties}>
          <path d="M10 0 L12.2 7.8 L20 10 L12.2 12.2 L10 20 L7.8 12.2 L0 10 L7.8 7.8 Z" fill={p.c} />
        </svg>
      ))}
    </div>
  );
}
