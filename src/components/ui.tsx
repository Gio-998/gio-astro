"use client";
import { useContent } from "@/lib/content-context";
import type { Evidence } from "@/engine/compat";

export function EvidenceBadge({ e }: { e: Evidence }) {
  const { c } = useContent();
  const x = c.compat.evidence[e];
  return <span className="chip" title={x.text}>{x.icon} {x.label}</span>;
}

export function Bar({ value, label, color = "bg-gold", right }: { value: number; label?: string; color?: string; right?: string }) {
  return (
    <div className="mb-2">
      {label && <div className="mb-1 flex justify-between text-xs text-dim"><span>{label}</span><span>{right ?? Math.round(value)}</span></div>}
      <div className="h-2 overflow-hidden rounded-full bg-white/10"><div className={`h-full rounded-full ${color}`} style={{ width: `${Math.max(2, Math.min(100, value))}%` }} /></div>
    </div>
  );
}

/** Two-pole slider display (e.g. yin ↔ yang). value 0–100. */
export function Dial({ value, left, right }: { value: number; left: string; right: string }) {
  return (
    <div>
      <div className="relative h-3 rounded-full bg-gradient-to-r from-indigo-900 via-white/30 to-amber-300">
        <div className="absolute -top-1 h-5 w-5 -translate-x-1/2 rounded-full border-2 border-night bg-mist shadow" style={{ left: `${value}%` }} />
      </div>
      <div className="mt-1 flex justify-between text-xs text-dim"><span>{left}</span><span>{right}</span></div>
    </div>
  );
}

export function Section({ title, children, aside }: { title: string; children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <section className="mt-8">
      <div className="mb-3 flex items-end justify-between gap-3"><h2 className="h-display text-2xl text-gold">{title}</h2>{aside}</div>
      {children}
    </section>
  );
}

export function Palette({ colors, size = "h-6" }: { colors: string[]; size?: string }) {
  return <div className="flex overflow-hidden rounded-full">{colors.map((c, i) => <div key={i} className={`${size} flex-1`} style={{ background: c }} title={c} />)}</div>;
}

export function ScoreRing({ value, label, sub }: { value: number; label: string; sub?: string }) {
  const r = 52, C = 2 * Math.PI * r, p = (value - 45) / 55;
  return (
    <div className="flex flex-col items-center">
      <svg width="132" height="132" viewBox="0 0 132 132" aria-label={`${label} ${value}`}>
        <circle cx="66" cy="66" r={r} stroke="rgba(255,255,255,.1)" strokeWidth="10" fill="none" />
        <circle cx="66" cy="66" r={r} stroke="url(#g)" strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray={`${C * Math.max(0.04, p)} ${C}`} transform="rotate(-90 66 66)" />
        <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stopColor="#f0a6ca" /><stop offset="1" stopColor="#f3c969" /></linearGradient></defs>
        <text x="66" y="74" textAnchor="middle" fontSize="34" fill="#ece6ff" fontFamily="Georgia, serif">{value}</text>
      </svg>
      <div className="text-sm font-semibold">{label}</div>
      {sub && <div className="text-xs text-dim">{sub}</div>}
    </div>
  );
}

export function Locked({ title, text, href, minutes }: { title: string; text: string; href: string; minutes?: number }) {
  return (
    <a href={href} className="card flex items-center justify-between gap-3 border-dashed opacity-90 hover:border-gold/50">
      <div><div className="font-semibold">🔒 {title}</div><div className="text-sm text-dim">{text}</div></div>
      <span className="btn-ghost whitespace-nowrap">{minutes ? `${minutes} min` : "Unlock"} →</span>
    </a>
  );
}
