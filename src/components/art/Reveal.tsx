"use client";
import { useEffect, useRef, useState } from "react";

/** Scroll-reveal wrapper: fade-up + blur-to-sharp, once. Reveals immediately if already scrolled past. */
export function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string; y?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) { requestAnimationFrame(() => setShown(true)); return; }
    const check = () => { const r = el.getBoundingClientRect(); if (r.top < window.innerHeight * 0.95) { requestAnimationFrame(() => setShown(true)); return true; } return false; };
    if (check()) return;
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { setShown(true); io.disconnect(); } }, { rootMargin: "0px 0px -6% 0px" });
    io.observe(el);
    const onScroll = () => { if (check()) { io.disconnect(); window.removeEventListener("scroll", onScroll); } };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { io.disconnect(); window.removeEventListener("scroll", onScroll); };
  }, []);
  return (
    <div ref={ref} data-reveal className={`transition-[opacity,transform,filter] duration-[900ms] ease-[cubic-bezier(.2,.7,.2,1)] ${shown ? "translate-y-0 opacity-100 blur-0" : "translate-y-6 opacity-0 blur-[6px]"} ${className}`} style={{ transitionDelay: `${delay}s` }}>
      {children}
    </div>
  );
}
