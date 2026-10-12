"use client";
import { usePrinting } from "@/lib/print";
import { useContent } from "@/lib/content-context";
import type { Evidence } from "@/engine/compat";
import { useEffect, useRef, useState } from "react";
import { Emblem, EmblemId } from "./art/Emblem";
import { cosmos, Cosmos } from "./art/ArtCard";

/** Illustrated page header for inner pages: cosmic photo band, emblem/art, eyebrow + serif title. */
export function PageHero({ eyebrow, title, sub, emblem = "sun", img = "orion", art, children }: { eyebrow?: string; title: React.ReactNode; sub?: React.ReactNode; emblem?: EmblemId; img?: Cosmos; art?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="relative mb-8 overflow-hidden rounded-[32px] border border-white/15 px-6 py-9 shadow-[0_30px_80px_-40px_rgba(139,108,240,.9)] sm:px-10 sm:py-12">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={cosmos(img, 1280)} alt="" className="absolute inset-0 h-full w-full animate-kenburns object-cover opacity-55" />
      <div className="absolute inset-0 bg-gradient-to-r from-night via-night/80 to-indigo/30" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-[radial-gradient(60%_100%_at_70%_100%,rgba(246,181,207,.25),transparent_70%)]" />
      <div className="relative flex items-center gap-6">
        <div className="min-w-0 flex-1">
          {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
          <h1 className="h-display mb-2 text-[clamp(2.2rem,5vw,3.6rem)] font-medium leading-[1.02]">{title}</h1>
          {sub && <div className="max-w-xl text-mist/85">{sub}</div>}
          {children && <div className="mt-5">{children}</div>}
        </div>
        <div className="hidden shrink-0 sm:block">{art ?? <Emblem id={emblem} className="h-32 w-32 animate-float glow-gold" />}</div>
      </div>
    </div>
  );
}

export function EvidenceBadge({ e }: { e: Evidence }) {
  const { c } = useContent();
  const x = c.compat.evidence[e];
  const tone = e === "research" ? "border-sage/40 text-sage" : e === "popular" ? "border-lilac/40 text-lilac" : "border-gold/40 text-gold";
  return <span className={`chip ${tone}`} title={x.text}>{x.icon} {x.label}</span>;
}

const BAR_GRAD: Record<string, string> = { "bg-gold": "bg-gradient-to-r from-amber to-gold", "bg-rose": "bg-gradient-to-r from-violet to-rose", "bg-sage": "bg-gradient-to-r from-sage to-[#a9c8ff]" };
export function Bar({ value, label, color = "bg-gold", right }: { value: number; label?: string; color?: string; right?: string }) {
  const ref = useRef<HTMLDivElement>(null); const [seen, setOn] = useState(false); const printing = usePrinting(); const on = seen || printing;
  const w = `${Math.max(2, Math.min(100, value))}%`;
  useEffect(() => { const el = ref.current; if (!el) return; const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }); io.observe(el); return () => io.disconnect(); }, []);
  return (
    <div className="print-bar mb-2">
      {label && <div className="print-bar-label mb-1 flex justify-between text-xs text-dim"><span>{label}</span><span>{right ?? Math.round(value)}</span></div>}
      <div ref={ref} className="print-track h-2 overflow-hidden rounded-full bg-white/10"><div data-w={w} style={{ ["--w" as string]: w, width: on ? w : "2%" }} className={`print-fill h-full rounded-full ${BAR_GRAD[color] ?? color} shadow-[0_0_12px_rgba(246,207,122,.35)] transition-[width] duration-[1200ms] ease-out`} /></div>
    </div>
  );
}

/** Two-pole slider display (e.g. yin ↔ yang). value 0–100. */
export function Dial({ value, left, right }: { value: number; left: string; right: string }) {
  return (
    <div>
      <div className="relative h-3 rounded-full bg-gradient-to-r from-indigo via-lilac/60 to-gold">
        <div className="absolute -top-1.5 h-6 w-6 -translate-x-1/2 rounded-full border-2 border-gold bg-[radial-gradient(circle_at_35%_35%,#fff,#f6cf7a)] shadow-[0_0_16px_rgba(246,207,122,.7)]" style={{ left: `${value}%` }} />
      </div>
      <div className="mt-1 flex justify-between text-xs text-dim"><span>{left}</span><span>{right}</span></div>
    </div>
  );
}

export function Section({ title, children, aside }: { title: string; children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <section className="mt-12">
      <div className="mb-4 flex items-end justify-between gap-3 border-b border-white/10 pb-3"><h2 className="h-display text-3xl"><span className="mr-2 text-gold">✦</span>{title}</h2>{aside}</div>
      {children}
    </section>
  );
}

export function Palette({ colors, size = "h-6" }: { colors: string[]; size?: string }) {
  return <div className="flex gap-1.5">{colors.map((c, i) => <div key={i} className={`${size} flex-1 rounded-full shadow-[0_6px_18px_-6px_rgba(0,0,0,.6)] ring-1 ring-white/20 transition hover:-translate-y-0.5`} style={{ background: `radial-gradient(circle at 30% 30%, #ffffff55, ${c} 60%)` }} title={c} />)}</div>;
}

export function ScoreRing({ value, label, sub }: { value: number; label: string; sub?: string }) {
  const [v, setV] = useState(45);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { requestAnimationFrame(() => setV(value)); return; }
    let raf = 0; const t0 = performance.now(); const from = 45;
    const step = (t: number) => { const k = Math.min(1, (t - t0) / 1500); setV(Math.round(from + (value - from) * (1 - (1 - k) ** 3))); if (k < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step); return () => cancelAnimationFrame(raf);
  }, [value]);
  const r = 52, C = 2 * Math.PI * r, p = (v - 45) / 55;
  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="140" viewBox="0 0 132 132" aria-label={`${label} ${value}`} className="drop-shadow-[0_0_20px_rgba(246,181,207,.35)]">
        <circle cx="66" cy="66" r={r} stroke="rgba(255,255,255,.1)" strokeWidth="10" fill="none" />
        <circle cx="66" cy="66" r={r} stroke="url(#sr-g)" strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray={`${C * Math.max(0.04, p)} ${C}`} transform="rotate(-90 66 66)" />
        <defs><linearGradient id="sr-g" x1="0" x2="1"><stop offset="0" stopColor="#f6b5cf" /><stop offset=".6" stopColor="#f6cf7a" /><stop offset="1" stopColor="#ffd6b8" /></linearGradient></defs>
        <text x="66" y="74" textAnchor="middle" fontSize="34" fill="#f5f1ff" fontFamily="Georgia, serif">{v}</text>
      </svg>
      <div className="text-sm font-semibold">{label}</div>
      {sub && <div className="text-xs text-dim">{sub}</div>}
    </div>
  );
}

export function Locked({ title, text, href, minutes, emblem = "eye" }: { title: string; text: string; href: string; minutes?: number; emblem?: EmblemId }) {
  const M = useContent().c.ui.misc;
  return (
    <a href={href} className="card card-hover group flex items-center justify-between gap-4 border-dashed !border-gold/30">
      <Emblem id={emblem} className="h-14 w-14 shrink-0 opacity-60 transition group-hover:rotate-12 group-hover:opacity-100" />
      <div className="flex-1"><div className="font-semibold">✧ {title}</div><div className="text-sm text-dim">{text}</div></div>
      <span className="btn-ghost whitespace-nowrap">{minutes ? M.min(minutes) : M.unlock} →</span>
    </a>
  );
}
