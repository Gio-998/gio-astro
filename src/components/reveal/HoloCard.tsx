"use client";
import { useRef } from "react";

/**
 * Collectible holographic card: iridescent conic sheen that follows the finger / mouse (and a slow light sweep).
 * Pure CSS + 2 custom properties, so it costs nothing until touched.
 */
export function HoloCard({ children, className = "", tilt = true, style }: { children: React.ReactNode; className?: string; tilt?: boolean; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: React.PointerEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", String(x)); el.style.setProperty("--my", String(y));
    if (tilt && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) el.style.transform = `perspective(900px) rotateY(${(x - 0.5) * 14}deg) rotateX(${(0.5 - y) * 14}deg)`;
  };
  const leave = () => { const el = ref.current; if (el) el.style.transform = ""; };
  return (
    <div ref={ref} onPointerMove={move} onPointerLeave={leave} className={`holo-card transition-transform duration-300 ease-out ${className}`} style={style}>
      {children}
    </div>
  );
}
