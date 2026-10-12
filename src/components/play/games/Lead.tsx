"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { LEAD_ROUNDS, scoreLead } from "@/engine/play";
import { usePlay } from "../text";
import { Choice, GameFrame, type GameProps } from "../GameFrame";
import { haptic, HAPTIC, useReduce, useTapLog } from "../fx";
import { now } from "../fx";

const FRIEND_COL = ["#f6b5cf", "#8fe3d6", "#f6cf7a"];
const LINE_LEN: Record<number, number[]> = { 1: [44, 78, 60], 4: [60, 76, 46], 6: [42, 60, 80] }; // option lengths per line round; reference is 60
const LETTERS = ["A", "B", "C"];

export function LeadGame({ onDone }: GameProps) {
  const P = usePlay(); const U = P.ui.lead; const reduce = useReduce(); const log = useTapLog();
  const picks = useRef<{ choice: number; ms: number; seen: number }[]>([]); const shown = useRef(0);
  const [i, setI] = useState(0); const [seen, setSeen] = useState(0); const [mine, setMine] = useState<number | null>(null);
  const r = LEAD_ROUNDS[i];
  useEffect(() => { log.start(); }, [log]);
  useEffect(() => {
    shown.current = now();
    const times = r.kind === "stuck" ? [r.volunteerAt] : r.at;
    const ts = times.map((t, k) => setTimeout(() => setSeen((s) => Math.max(s, k + 1)), t));
    return () => ts.forEach(clearTimeout);
  }, [i, r]);
  const tasteIdx = LEAD_ROUNDS.slice(0, i).filter((x) => x.kind === "taste").length;

  const choose = (choice: number) => {
    log.tap(); if (mine != null) return;
    haptic(HAPTIC.tap, reduce);
    picks.current.push({ choice, ms: Math.round(now() - shown.current), seen });
    setMine(choice); setSeen(3);
    setTimeout(() => {
      setMine(null); setSeen(0);
      if (i + 1 >= LEAD_ROUNDS.length) { haptic(HAPTIC.win, reduce); onDone(scoreLead({ picks: picks.current, taps: log.taps.current, ms: log.elapsed() })); return; }
      setI(i + 1);
    }, reduce ? 500 : 1100);
  };
  const vote = (k: number): number | null => {
    if (r.kind === "taste") return seen > k ? r.group[k] : null;
    if (r.kind === "line") return seen > k ? r.group : null;
    return null;
  };
  const opts = r.kind === "taste" ? U.taste[tasteIdx % U.taste.length].o : r.kind === "line" ? LETTERS : U.stuckOpts;
  const q = r.kind === "taste" ? U.taste[tasteIdx % U.taste.length].q : r.kind === "line" ? U.line : U.stuck;
  return (
    <GameFrame step={i + 1} total={LEAD_ROUNDS.length} label={P.games.lead.name} testId="game-lead">
      <p className="h-display mb-3 text-center text-2xl leading-snug">{q}</p>
      <div className="mb-4 grid grid-cols-3 gap-2">
        {U.friends.map((f, k) => {
          const v = vote(k);
          return (
            <div key={f} className="flex flex-col items-center gap-1">
              <motion.div animate={reduce || v == null ? {} : { scale: [1, 1.12, 1] }} transition={{ duration: 0.35 }} className="grid h-12 w-12 place-items-center rounded-full text-lg font-bold text-plum" style={{ background: `radial-gradient(circle at 35% 30%, #fff, ${FRIEND_COL[k]} 65%)` }}>{f[0]}</motion.div>
              <span className="text-xs text-dim">{f}</span>
              <span className={`min-h-[22px] rounded-full px-2 text-xs ${v != null ? "bg-white/10 text-mist" : "text-dim"}`} data-testid={`vote-${k}`}>{v != null ? opts[v] : r.kind === "stuck" ? "" : U.waiting}</span>
            </div>
          );
        })}
      </div>
      {r.kind === "stuck" && seen > 0 && <p className="mb-3 rounded-2xl bg-white/[0.07] px-4 py-2 text-center text-sm">{U.volunteer}</p>}
      {r.kind === "line" && (
        <svg viewBox="0 0 300 110" className="mb-3 w-full" aria-hidden>
          <line x1="20" x2="20" y1={95} y2={95 - 60} stroke="#f5f1ff" strokeWidth="6" strokeLinecap="round" />
          {LINE_LEN[i].map((len, k) => <g key={k}><line x1={110 + k * 70} x2={110 + k * 70} y1={95} y2={95 - len} stroke={FRIEND_COL[k]} strokeWidth="6" strokeLinecap="round" /><text x={110 + k * 70} y={108} textAnchor="middle" fill="#bdb3e6" fontSize="11">{LETTERS[k]}</text></g>)}
        </svg>
      )}
      <div className={`grid gap-2 ${r.kind === "line" ? "grid-cols-3" : ""}`}>
        {opts.map((o, k) => <Choice key={o} onClick={() => choose(k)} active={mine === k} className={r.kind === "line" ? "!text-center text-lg font-semibold" : ""} testId={`lead-opt-${k}`}>{o}{mine === k && <span className="ml-2 text-xs text-gold">· {U.you}</span>}</Choice>)}
      </div>
    </GameFrame>
  );
}
