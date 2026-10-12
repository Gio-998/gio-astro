"use client";
import { useId, useState } from "react";
import { motion } from "motion/react";
import { GAME_DIMS, PLAY_DIMS, PLAY_GAMES, levelOf10, type PlayDim, type PlayProfile } from "@/engine/play";
import type { PlayContent } from "./content";
import { usePlay } from "./text";
import { useReduce } from "./fx";

export const DIM_COL: Record<PlayDim, string> = { risk: "#f6b5cf", resilience: "#ffd6b8", read: "#c9b8ff", empathy: "#f6b5cf", trust: "#8fe3d6", fairness: "#8fe3d6", detail: "#a9c8ff", speed: "#f6cf7a", lead: "#f6cf7a", conform: "#c9b8ff" };

/** Up to three words for the dimensions that stand out most from the middle. */
export function playWords(dims: PlayProfile["dims"], P: PlayContent): string[] {
  return PLAY_DIMS.map((d) => ({ d, v: dims[d] })).filter((x): x is { d: PlayDim; v: number } => x.v != null && Math.abs(x.v - 5) >= 1.5)
    .sort((a, b) => Math.abs(b.v - 5) - Math.abs(a.v - 5)).slice(0, 3).map((x) => (x.v > 5 ? P.dims[x.d].word.high : P.dims[x.d].word.low));
}

const W = 320, C = 160, R = 112;
const at = (i: number, r: number) => { const a = ((-90 + i * 36) * Math.PI) / 180; return [C + r * Math.cos(a), C + r * Math.sin(a)] as const; };

/** Ten-point "constellation": each dimension is a star at its score; unplayed ones stay as faint ghosts. */
export function PlayConstellation({ dims, size = "max-w-[320px]", onPick, sel }: { dims: PlayProfile["dims"]; size?: string; onPick?: (d: PlayDim) => void; sel?: PlayDim | null }) {
  const P = usePlay(); const reduce = useReduce(); const gid = useId().replace(/:/g, "");
  const pts = PLAY_DIMS.map((d, i) => { const v = dims[d]; return { d, i, v, xy: at(i, R * (0.16 + 0.84 * ((v ?? 0) / 10))) }; });
  const known = pts.filter((p) => p.v != null);
  return (
    <div className={`relative mx-auto w-full ${size}`} style={{ aspectRatio: "1" }}>
      <svg viewBox={`0 0 ${W} ${W}`} className="absolute inset-0 h-full w-full overflow-visible" role="img" aria-label={PLAY_DIMS.filter((d) => dims[d] != null).map((d) => `${P.dims[d].name} ${P.hub.levels[levelOf10(dims[d]!)]}`).join(", ")}>
        <defs>
          <radialGradient id={`pc${gid}`} cx="50%" cy="50%" r="60%"><stop offset="0" stopColor="#fff" stopOpacity=".7" /><stop offset=".4" stopColor="#f6cf7a" stopOpacity=".55" /><stop offset="1" stopColor="#8b6cf0" stopOpacity=".35" /></radialGradient>
          <filter id={`pg${gid}`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8" /></filter>
        </defs>
        {[0.33, 0.66, 1].map((k) => <circle key={k} cx={C} cy={C} r={R * k} fill="none" stroke="rgba(255,255,255,.08)" strokeDasharray={k < 1 ? "2 5" : undefined} />)}
        {pts.map((p) => { const [x, y] = at(p.i, R); return <line key={p.d} x1={C} y1={C} x2={x} y2={y} stroke={sel === p.d ? "rgba(246,207,122,.6)" : "rgba(255,255,255,.07)"} />; })}
        {known.length >= 3 && (
          <motion.g style={{ transformOrigin: `${C}px ${C}px` }} initial={reduce ? false : { scale: 0.2, opacity: 0, rotate: -30 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}>
            <polygon points={known.map((p) => p.xy.map((n) => n.toFixed(1)).join(",")).join(" ")} fill={`url(#pc${gid})`} filter={`url(#pg${gid})`} opacity=".8" />
            <polygon points={known.map((p) => p.xy.map((n) => n.toFixed(1)).join(",")).join(" ")} fill="none" stroke="#f6cf7a" strokeOpacity=".75" strokeWidth="1.4" />
          </motion.g>
        )}
        {pts.map((p) => {
          const [lx, ly] = at(p.i, R + 26);
          return (
            <g key={p.d} onClick={onPick ? () => onPick(p.d) : undefined} style={{ cursor: onPick ? "pointer" : undefined }}>
              {p.v != null ? (
                <motion.circle cx={p.xy[0]} cy={p.xy[1]} r={sel === p.d ? 7 : 5} fill={DIM_COL[p.d]} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + p.i * 0.06 }} style={{ filter: `drop-shadow(0 0 6px ${DIM_COL[p.d]})` }} />
              ) : <circle cx={at(p.i, R * 0.5)[0]} cy={at(p.i, R * 0.5)[1]} r="3" fill="rgba(255,255,255,.18)" />}
              <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fontSize="10.5" fill={p.v != null ? (sel === p.d ? "#f6cf7a" : "#ece6ff") : "rgba(236,230,255,.35)"}>{P.dims[p.d].name}</text>
              <circle cx={lx} cy={ly} r="18" fill="transparent" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/** One dimension as a two-pole slider; tap to expand the honest text. */
export function DimRow({ d, v, open, onToggle, said }: { d: PlayDim; v: number; open: boolean; onToggle: () => void; said?: number }) {
  const P = usePlay(); const T = P.dims[d]; const lv = levelOf10(v); const id = useId();
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04]" data-testid={`dim-${d}`}>
      <button type="button" onClick={onToggle} aria-expanded={open} aria-controls={id} className="w-full px-4 py-3 text-left">
        <div className="mb-2 flex items-center justify-between gap-2"><span className="font-semibold">{T.name}</span><span className="text-xs text-gold">{v > 5 ? T.poles[1] : v < 5 ? T.poles[0] : P.hub.levels.mid} · {P.hub.levels[lv]}</span></div>
        <div className="relative h-2 rounded-full bg-gradient-to-r from-indigo via-white/15 to-white/5">
          <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${v * 10}%`, background: `linear-gradient(90deg, transparent, ${DIM_COL[d]})` }} />
          {said != null && <span title={P.hub.saidLabel} className="absolute -top-1 h-4 w-0.5 -translate-x-1/2 rounded bg-white/60" style={{ left: `${said * 10}%` }} />}
          <span className="absolute -top-1.5 h-5 w-5 -translate-x-1/2 rounded-full border-2 border-gold bg-[radial-gradient(circle_at_35%_35%,#fff,#f6cf7a)] shadow-[0_0_14px_rgba(246,207,122,.7)]" style={{ left: `${v * 10}%` }} />
        </div>
        <div className="mt-1.5 flex justify-between text-[11px] text-dim"><span>{T.poles[0]}</span><span>{T.poles[1]}</span></div>
      </button>
      <div id={id} className={`grid transition-[grid-template-rows] duration-500 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}><div className="min-h-0 overflow-hidden"><p className="px-4 pb-4 text-[15px] leading-relaxed text-mist/90">{T.text[lv]}</p></div></div>
    </div>
  );
}

/** "How you actually play": constellation + headline + rows grouped by game. */
export function PlayCard({ profile, said, compact = false }: { profile: PlayProfile; said?: Partial<Record<PlayDim, number>>; compact?: boolean }) {
  const P = usePlay(); const [open, setOpen] = useState<PlayDim | null>(null);
  const words = playWords(profile.dims, P);
  return (
    <div data-testid="play-card">
      <p className="eyebrow mb-1 text-center">✦ {P.hub.resultTitle}</p>
      <p className="h-display mx-auto mb-2 max-w-md text-balance text-center text-[1.7rem] leading-tight text-aurora" data-testid="play-headline">{P.hub.headline(words)}</p>
      <PlayConstellation dims={profile.dims} onPick={(d) => setOpen(open === d ? null : d)} sel={open} />
      {!compact && (
        <div className="mt-4 space-y-4">
          {PLAY_GAMES.filter((g) => profile.games.includes(g)).map((g) => (
            <div key={g}>
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-dim">{P.games[g].name}</p>
              <div className="space-y-2">{GAME_DIMS[g].map((d) => profile.dims[d] != null && <DimRow key={d} d={d} v={profile.dims[d]!} said={said?.[d]} open={open === d} onToggle={() => setOpen(open === d ? null : d)} />)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
