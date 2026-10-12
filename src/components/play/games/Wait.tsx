"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { WAIT_ROUNDS, scoreWait, type WaitRaw } from "@/engine/play";
import { usePlay } from "../text";
import { GameFrame, Choice, type GameProps } from "../GameFrame";
import { haptic, HAPTIC, now, useReduce, useTapLog } from "../fx";

/** A glowing lantern whose light rises with `fill` (0..1). */
function Lantern({ fill, lit }: { fill: number; lit: boolean }) {
  const h = 70 * fill;
  return (
    <svg viewBox="0 0 120 150" className="mx-auto h-40 w-32 drop-shadow-[0_0_30px_rgba(246,207,122,.45)]" aria-hidden>
      <defs>
        <linearGradient id="lt-f" x1="0" x2="0" y1="1" y2="0"><stop offset="0" stopColor="#f6cf7a" /><stop offset="1" stopColor="#fff3cf" /></linearGradient>
        <clipPath id="lt-c"><rect x="30" y="40" width="60" height="80" rx="20" /></clipPath>
      </defs>
      <path d="M50 18 h20 M60 6 v12" stroke="#f6cf7a" strokeWidth="3" strokeLinecap="round" />
      <rect x="40" y="18" width="40" height="22" rx="8" fill="none" stroke="#f6cf7a" strokeWidth="2.5" />
      <rect x="30" y="40" width="60" height="80" rx="20" fill="rgba(255,255,255,.04)" stroke="rgba(246,207,122,.7)" strokeWidth="2.5" />
      <rect x="30" y={120 - h - 5} width="60" height={h + 5} clipPath="url(#lt-c)" fill="url(#lt-f)" opacity={lit ? 0.95 : 0.75} style={{ transition: "y .25s linear, height .25s linear" }} />
      <rect x="44" y="120" width="32" height="10" rx="4" fill="none" stroke="#f6cf7a" strokeWidth="2.5" />
    </svg>
  );
}

export function WaitGame({ onDone }: GameProps) {
  const P = usePlay(); const U = P.ui.wait; const reduce = useReduce(); const log = useTapLog();
  const rounds = useRef<WaitRaw["rounds"]>([]); const shown = useRef(0); const waitStart = useRef(0);
  const [i, setI] = useState(0); const [phase, setPhase] = useState<"pick" | "wait" | "got">("pick");
  const [fill, setFill] = useState(0); const [stars, setStars] = useState(0); const [msg, setMsg] = useState("");
  const r = WAIT_ROUNDS[i];
  useEffect(() => { log.start(); shown.current = now(); }, [log]);

  const finishRound = (gain: number) => {
    setStars((s) => s + gain); setMsg(U.got(gain)); setPhase("got"); haptic(HAPTIC.good, reduce);
    setTimeout(() => {
      if (i + 1 >= WAIT_ROUNDS.length) { onDone(scoreWait({ rounds: rounds.current, taps: log.taps.current, ms: log.elapsed() })); return; }
      setI(i + 1); setFill(0); setPhase("pick"); shown.current = now();
    }, reduce ? 600 : 1100);
  };
  useEffect(() => {
    if (phase !== "wait") return;
    const id = setInterval(() => {
      const f = Math.min(1, (now() - waitStart.current) / (r.secs * 1000)); setFill(f);
      if (f >= 1) { clearInterval(id); rounds.current.push({ choice: "wait", waitedMs: r.secs * 1000, gaveUp: false, ms: Math.round(waitStart.current - shown.current) }); finishRound(r.later); }
    }, 100);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, i]);

  const takeNow = () => { log.tap(); rounds.current.push({ choice: "now", waitedMs: 0, gaveUp: false, ms: Math.round(now() - shown.current) }); finishRound(r.now); };
  const startWait = () => { log.tap(); haptic(HAPTIC.tap, reduce); waitStart.current = now(); setPhase("wait"); };
  const giveUp = () => { log.tap(); rounds.current.push({ choice: "wait", waitedMs: Math.round(now() - waitStart.current), gaveUp: true, ms: Math.round(waitStart.current - shown.current) }); finishRound(r.now); };

  return (
    <GameFrame step={i + 1} total={WAIT_ROUNDS.length} label={P.games.wait.name} right={<span className="font-semibold text-gold">✦ {stars} {P.ui.stars}</span>} testId="game-wait">
      <p className="mb-1 text-center text-sm text-dim">{U.round} {i + 1} · {U.secs(r.secs)}</p>
      <motion.div key={i} initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Lantern fill={phase === "got" && fill < 1 ? fill : fill} lit={phase === "wait"} />
      </motion.div>
      <p className="mb-4 min-h-[24px] text-center text-[15px]" aria-live="polite">{phase === "pick" ? U.pick : phase === "wait" ? U.filling : <b className="text-gold">{msg}</b>}</p>
      {phase === "pick" && (
        <div className="grid grid-cols-2 gap-3">
          <Choice onClick={takeNow} testId="wait-now" className="text-center">{U.now(r.now)}</Choice>
          <Choice onClick={startWait} testId="wait-wait" className="text-center !border-gold/50">{U.wait(r.later)} ✦</Choice>
        </div>
      )}
      {phase === "wait" && <Choice onClick={giveUp} testId="wait-giveup" className="text-center">{U.grab(r.now)}</Choice>}
      {phase === "got" && <div className="h-[52px]" />}
    </GameFrame>
  );
}
