"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { scoreMemory } from "@/engine/play";
import { usePlay } from "../text";
import { GameFrame, type GameProps } from "../GameFrame";
import { haptic, HAPTIC, useReduce, useTapLog } from "../fx";
import { now } from "../fx";

type Cells = number[];
const PATTERNS: Cells[] = [[0, 5, 10, 15, 3], [1, 2, 5, 9, 13], [4, 5, 6, 10, 14, 0], [3, 6, 9, 12, 2, 7], [0, 1, 4, 11, 14, 15, 8]];
const mirror = (c: Cells) => c.map((i) => (i - (i % 4)) + (3 - (i % 4)));
const rotate = (c: Cells) => c.map((i) => { const r = Math.floor(i / 4), k = i % 4; return k * 4 + (3 - r); });
const shift = (c: Cells) => c.map((i) => (i % 4 === 3 ? i - 3 : i + 1));
const key = (c: Cells) => [...new Set(c)].sort((a, b) => a - b).join(",");
function patternOptions(t: number): { opts: Cells[]; correct: number } {
  const base = PATTERNS[t]; const seen = new Set([key(base)]); const out: Cells[] = [];
  for (const f of [mirror, shift, rotate, (c: Cells) => shift(mirror(c)), (c: Cells) => rotate(rotate(c))]) { const v = f(base); if (!seen.has(key(v))) { seen.add(key(v)); out.push(v); } if (out.length === 3) break; }
  const correct = (t * 3 + 1) % 4; out.splice(correct, 0, base);
  return { opts: out, correct };
}
const SHAPES = ["circle", "triangle", "square", "star"] as const;
const COLOURS = ["gold", "rose", "aqua", "violet"] as const;
const HEX: Record<(typeof COLOURS)[number], string> = { gold: "#f6cf7a", rose: "#f6b5cf", aqua: "#8fe3d6", violet: "#a98bff" };
const DETAIL: { perm: number[]; ask: number; pos: [number, number][] }[] = [
  { perm: [0, 1, 2, 3], ask: 1, pos: [[22, 26], [72, 30], [30, 74], [76, 74]] },
  { perm: [2, 0, 3, 1], ask: 3, pos: [[60, 20], [20, 60], [80, 66], [44, 82]] },
  { perm: [1, 3, 0, 2], ask: 0, pos: [[26, 76], [50, 24], [80, 50], [18, 30]] },
  { perm: [3, 2, 1, 0], ask: 2, pos: [[78, 22], [24, 46], [56, 78], [64, 46]] },
  { perm: [0, 3, 1, 2], ask: 1, pos: [[40, 30], [76, 78], [18, 72], [80, 30]] },
];
function Shape({ s, x, y, fill, size = 14 }: { s: (typeof SHAPES)[number]; x: number; y: number; fill: string; size?: number }) {
  const h = size;
  if (s === "circle") return <circle cx={x} cy={y} r={h * 0.8} fill={fill} />;
  if (s === "square") return <rect x={x - h * 0.75} y={y - h * 0.75} width={h * 1.5} height={h * 1.5} rx="2" fill={fill} />;
  if (s === "triangle") return <path d={`M${x} ${y - h} L${x + h} ${y + h * 0.75} L${x - h} ${y + h * 0.75}Z`} fill={fill} />;
  const pts = Array.from({ length: 10 }, (_, i) => { const a = (-90 + i * 36) * Math.PI / 180; const r = i % 2 ? h * 0.45 : h; return `${(x + r * Math.cos(a)).toFixed(1)},${(y + r * Math.sin(a)).toFixed(1)}`; }).join(" ");
  return <polygon points={pts} fill={fill} />;
}
function Grid({ cells, small }: { cells: Cells; small?: boolean }) {
  const on = new Set(cells);
  return <div className={`grid grid-cols-4 ${small ? "gap-0.5" : "gap-1.5"}`}>{Array.from({ length: 16 }, (_, i) => <span key={i} className={`aspect-square ${small ? "rounded-[3px]" : "rounded-lg"} ${on.has(i) ? "bg-gradient-to-br from-gold to-rose shadow-[0_0_12px_rgba(246,207,122,.7)]" : "bg-white/[0.07]"}`} />)}</div>;
}

export function MemoryGame({ onDone }: GameProps) {
  const P = usePlay(); const U = P.ui.memory; const reduce = useReduce(); const log = useTapLog();
  const trials = useRef<{ kind: "pattern" | "detail"; correct: boolean; ms: number }[]>([]); const shown = useRef(0);
  const [i, setI] = useState(0); const [phase, setPhase] = useState<"ready" | "flash" | "ask">("ready"); const [hit, setHit] = useState<number | null>(null);
  const kind: "pattern" | "detail" = i % 2 === 0 ? "pattern" : "detail"; const t = i >> 1;
  const pat = useMemo(() => patternOptions(t), [t]);
  useEffect(() => { log.start(); }, [log]);
  useEffect(() => {
    if (phase === "ready") { const a = setTimeout(() => setPhase("flash"), 700); return () => clearTimeout(a); }
    if (phase === "flash") { const b = setTimeout(() => { setPhase("ask"); shown.current = now(); }, kind === "pattern" ? 1100 : 1500); return () => clearTimeout(b); }
  }, [phase, kind]);
  const answer = (k: number, correct: boolean) => {
    log.tap(); if (hit != null) return;
    trials.current.push({ kind, correct, ms: Math.round(now() - shown.current) });
    haptic(correct ? HAPTIC.good : HAPTIC.tap, reduce); setHit(k);
    setTimeout(() => {
      setHit(null);
      if (i + 1 >= 10) { onDone(scoreMemory({ trials: trials.current, taps: log.taps.current, ms: log.elapsed() })); return; }
      setI(i + 1); setPhase("ready");
    }, reduce ? 150 : 420);
  };
  const d = DETAIL[t];
  return (
    <GameFrame step={i + 1} total={10} label={P.games.memory.name} testId="game-memory">
      <p className="mb-3 text-center text-sm text-mist/85" aria-live="polite">{phase === "ask" ? (kind === "pattern" ? U.whichShape : U.colourOf(U.shapes[SHAPES[d.ask]])) : kind === "pattern" ? U.shape : U.details}</p>
      <div className="mx-auto mb-4 aspect-square w-[min(64vw,240px)] rounded-3xl bg-white/[0.04] p-3 ring-1 ring-white/10">
        {phase === "flash" ? (kind === "pattern" ? <Grid cells={PATTERNS[t]} /> : (
          <svg viewBox="0 0 100 100" className="h-full w-full">{SHAPES.map((s, k) => <Shape key={s} s={s} x={d.pos[k][0]} y={d.pos[k][1]} fill={HEX[COLOURS[d.perm[k]]]} />)}</svg>
        )) : <div className="grid h-full place-items-center text-4xl text-white/15">{phase === "ready" ? "◎" : "?"}</div>}
      </div>
      {phase === "ask" && (kind === "pattern" ? (
        <div className="mx-auto grid max-w-[260px] grid-cols-2 gap-3">{pat.opts.map((o, k) => <button key={k} type="button" onClick={() => answer(k, k === pat.correct)} data-testid={`mem-opt-${k}`} className={`rounded-xl border p-1.5 transition active:scale-95 ${hit === k ? "border-gold" : "border-white/12 bg-white/[0.04]"}`}><Grid cells={o} small /></button>)}</div>
      ) : (
        <div className="grid grid-cols-2 gap-2">{COLOURS.map((col, k) => <button key={col} type="button" onClick={() => answer(k, d.perm[d.ask] === k)} data-testid={`mem-opt-${k}`} className={`flex min-h-[52px] items-center gap-2 rounded-2xl border px-3 transition active:scale-95 ${hit === k ? "border-gold" : "border-white/12 bg-white/[0.05]"}`}><span className="h-6 w-6 rounded-full" style={{ background: HEX[col], boxShadow: `0 0 12px ${HEX[col]}` }} />{U.colours[col]}</button>)}</div>
      ))}
    </GameFrame>
  );
}
