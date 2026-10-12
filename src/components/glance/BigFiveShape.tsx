"use client";
import { useId, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { TRAITS, type Trait } from "@/engine/bigfive";
import { useContent } from "@/lib/content-context";
import { levelOf, useGlance } from "./text";

const W = 340, H = 300, CX = 170, CY = 150, R = 92, LR = 124;
const ang = (i: number) => ((-90 + i * 72) * Math.PI) / 180;
const pt = (i: number, r: number) => [CX + r * Math.cos(ang(i)), CY + r * Math.sin(ang(i))] as const;
const poly = (rs: number[]) => rs.map((r, i) => pt(i, r).map((n) => n.toFixed(1)).join(",")).join(" ");

/** Headline words: up to three traits that stand out most from the middle. */
export function bigFiveWords(b: Record<Trait, number>, words: Record<Trait, { hi: string; lo: string }>) {
  return TRAITS.map((k) => ({ k, d: b[k] - 50 })).filter((x) => Math.abs(x.d) >= 15).sort((a, z) => Math.abs(z.d) - Math.abs(a.d)).slice(0, 3).map((x) => (x.d > 0 ? words[x.k].hi : words[x.k].lo));
}

/** Big Five at a glance: a glowing five-point shape, one-line headline, word levels, tap a trait for detail. */
export function BigFiveShape({ b, palette }: { b: Record<Trait, number>; palette?: string[] }) {
  const { c } = useContent(); const G = useGlance(); const P = c.psych;
  const [sel, setSel] = useState<Trait | null>(null);
  const reduce = useReducedMotion(); const gid = useId().replace(/:/g, "");
  const col = palette && palette.length >= 3 ? palette : ["#f6cf7a", "#f6b5cf", "#a98bff"];
  const rs = TRAITS.map((k) => R * (0.14 + 0.86 * Math.max(0, Math.min(100, b[k])) / 100));
  const words = bigFiveWords(b, G.words);
  const d = sel ? P.traits[sel] : null; const v = sel ? b[sel] : 50;
  return (
    <div data-testid="bigfive-glance">
      <p className="eyebrow mb-1 text-center">✦ {G.shapeLabel}</p>
      <p className="h-display mx-auto mb-1 max-w-md text-balance text-center text-[1.6rem] leading-tight text-aurora" data-testid="bigfive-headline">{G.headline(words)}</p>
      <div className="relative mx-auto w-full max-w-[360px]" style={{ aspectRatio: `${W} / ${H}` }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full overflow-visible" role="img" aria-label={`${G.shapeLabel}: ${TRAITS.map((k) => `${P.traits[k].name} ${G.levels[levelOf(b[k])]}`).join(", ")}`}>
          <defs>
            <radialGradient id={`f${gid}`} cx="50%" cy="45%" r="65%"><stop offset="0" stopColor="#fff" stopOpacity=".85" /><stop offset=".35" stopColor={col[0]} stopOpacity=".75" /><stop offset="1" stopColor={col[2]} stopOpacity=".45" /></radialGradient>
            <linearGradient id={`s${gid}`} x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor={col[0]} /><stop offset="1" stopColor={col[1]} /></linearGradient>
            <filter id={`g${gid}`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9" /></filter>
          </defs>
          {[0.25, 0.5, 0.75, 1].map((k) => <polygon key={k} points={poly(TRAITS.map(() => R * k))} fill="none" stroke="rgba(255,255,255,.10)" strokeWidth="1" />)}
          {TRAITS.map((k, i) => { const [x, y] = pt(i, R); return <line key={k} x1={CX} y1={CY} x2={x} y2={y} stroke={sel === k ? "rgba(246,207,122,.6)" : "rgba(255,255,255,.10)"} strokeWidth="1" />; })}
          <motion.g style={{ transformOrigin: `${CX}px ${CY}px` }} initial={reduce ? false : { scale: 0.1, opacity: 0, rotate: -25 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}>
            <motion.polygon points={poly(rs)} fill={col[1]} opacity=".55" filter={`url(#g${gid})`} style={{ transformOrigin: `${CX}px ${CY}px` }}
              animate={reduce ? undefined : { scale: [1, 1.08, 1], opacity: [0.45, 0.7, 0.45] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }} />
            <polygon points={poly(rs)} fill={`url(#f${gid})`} stroke={`url(#s${gid})`} strokeWidth="2" strokeLinejoin="round" />
            {TRAITS.map((k, i) => { const [x, y] = pt(i, rs[i]); return <circle key={k} cx={x} cy={y} r={sel === k ? 6 : 4} fill="#fffaf0" stroke={col[0]} strokeWidth="2" className="transition-all" />; })}
          </motion.g>
        </svg>
        {TRAITS.map((k, i) => {
          const [x, y] = pt(i, LR); const on = sel === k;
          return (
            <button key={k} type="button" onClick={() => setSel(on ? null : k)} aria-pressed={on} data-testid={`trait-${k}`}
              className={`absolute flex min-h-[44px] min-w-[44px] max-w-[104px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-2xl px-2 py-1 text-center leading-tight transition ${on ? "bg-gold/15 ring-1 ring-gold/60" : "hover:bg-white/5"}`}
              style={{ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` }}>
              <span className="text-[12px] font-semibold text-mist">{G.short[k]}</span>
              <span className={`text-[11px] ${on ? "text-gold" : "text-dim"}`}>{G.levels[levelOf(b[k])]}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-1 text-center text-xs text-dim">{G.tapTrait}</p>
      <div className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${d ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`} aria-live="polite">
        <div className="min-h-0 overflow-hidden">
          {d && sel && (
            <div className="mt-3 rounded-2xl border border-gold/30 bg-white/[0.05] p-4" data-testid="trait-detail">
              <div className="mb-1 flex items-baseline justify-between gap-2"><p className="font-semibold">{d.name}</p><span className="chip text-gold">{G.levels[levelOf(v)]}</span></div>
              <p className="mb-2 text-xs text-dim">{d.plain}</p>
              <p className="text-sm">{v < 35 ? d.low : v > 65 ? d.high : d.mid}</p>
              {v > 60 && <p className="mt-2 text-sm text-mist/85"><b>{G.inLove}</b> {d.inLove}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
