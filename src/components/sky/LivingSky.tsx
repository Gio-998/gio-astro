"use client";
import { useEffect, useRef, useState } from "react";
import { detectTier, prefersReducedMotion, type Tier } from "@/lib/device-tier";

/**
 * Global "Living Sky" background. First paint is a CSS aurora that matches the shader's palette (no flash, no CLS);
 * the WebGL shader chunk loads on idle and fades in. Tiers: full / lite / off, auto-downgrade on low FPS.
 */
export function LivingSky() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [tier, setTier] = useState<Tier | null>(null);
  const [live, setLive] = useState(false);
  useEffect(() => {
    const pick = () => setTier(detectTier());
    pick();
    window.addEventListener("horoscop:fx", pick);
    return () => window.removeEventListener("horoscop:fx", pick);
  }, []);
  useEffect(() => {
    if (!tier || tier === "off") { setLive(false); return; }
    let handle: { stop(): void } | null = null; let cancelled = false;
    const go = async () => {
      const { startSky } = await import("./engine");
      if (cancelled || !ref.current) return;
      handle = startSky(ref.current, tier, { reduced: prefersReducedMotion(), onTier: (t) => { handle?.stop(); handle = null; setLive(false); setTier(t); } });
      if (handle) requestAnimationFrame(() => setLive(true));
    };
    // Wait for the page to settle so the shader never competes with first paint / hydration.
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    const start = () => (w.requestIdleCallback ? w.requestIdleCallback(() => void go(), { timeout: 2500 }) : setTimeout(() => void go(), 1200));
    if (document.readyState === "complete") start(); else window.addEventListener("load", start, { once: true });
    return () => { cancelled = true; handle?.stop(); window.removeEventListener("load", start); };
  }, [tier]);
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden data-sky-tier={tier ?? "pending"} data-sky-live={live ? "1" : "0"}>
      <div className="sky-css absolute inset-0" />
      {tier && tier !== "off" && (
        <canvas key={tier} ref={ref} className={`absolute inset-0 h-full w-full transition-opacity duration-[1400ms] ${live ? "opacity-100" : "opacity-0"}`} />
      )}
    </div>
  );
}

type OrientationCtor = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<"granted" | "denied"> };

/** iOS needs a tap to allow motion sensors. Shows a small pill only there (Android just works). */
export function TiltPrompt({ label, className = "" }: { label: string; className?: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const D = (typeof window !== "undefined" ? window.DeviceOrientationEvent : undefined) as OrientationCtor | undefined;
    let asked = false; try { asked = localStorage.getItem("horoscop:tilt") != null; } catch { /* */ }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- feature detection after mount
    const ios = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    if (ios && D && typeof D.requestPermission === "function" && !asked && !prefersReducedMotion()) setShow(true);
  }, []);
  if (!show) return null;
  const ask = async () => {
    const D = window.DeviceOrientationEvent as OrientationCtor;
    try { const r = await D.requestPermission!(); localStorage.setItem("horoscop:tilt", r); } catch { /* dismissed */ }
    setShow(false);
  };
  return (
    <button type="button" onClick={ask} className={`inline-flex min-h-[36px] items-center gap-2 rounded-full border border-white/20 bg-white/[0.08] px-3.5 text-xs text-mist/90 backdrop-blur-md transition active:scale-95 ${className}`} data-testid="tilt-prompt">
      <span aria-hidden className="inline-block animate-[tilt_2.4s_ease-in-out_infinite]">📱</span>{label}
    </button>
  );
}
