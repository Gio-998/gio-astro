"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { TRUST_ROUNDS, mossReturn, scoreTrust } from "@/engine/play";
import { usePlay } from "../text";
import { GameFrame, type GameProps } from "../GameFrame";
import { haptic, HAPTIC, useReduce, useTapLog } from "../fx";
import { now } from "../fx";

export function Moss({ mood, className = "" }: { mood: "idle" | "happy" | "sly" | "thanks"; className?: string }) {
  const reduce = useReduce();
  const mouth = mood === "sly" ? "M46 70 Q58 66 70 62" : mood === "idle" ? "M48 68 Q58 72 68 68" : "M44 64 Q58 80 72 64";
  return (
    <motion.svg viewBox="0 0 116 110" className={className} aria-hidden animate={reduce ? {} : { y: [0, -4, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}>
      <defs><radialGradient id="moss-b" cx="40%" cy="35%" r="70%"><stop offset="0" stopColor="#d6fff3" /><stop offset=".5" stopColor="#8fe3d6" /><stop offset="1" stopColor="#3f8f8a" /></radialGradient></defs>
      <path d="M14 70 Q8 24 58 14 Q108 22 102 72 Q98 100 58 100 Q18 100 14 70Z" fill="url(#moss-b)" />
      <path d="M40 16 Q44 4 52 12 M62 12 Q72 2 74 16" stroke="#8fe3d6" strokeWidth="3" fill="none" strokeLinecap="round" />
      <ellipse cx="42" cy="50" rx="6" ry={mood === "sly" ? 2.5 : 7} fill="#173b3c" /><ellipse cx="74" cy="50" rx="6" ry={mood === "sly" ? 2.5 : 7} fill="#173b3c" />
      <circle cx="44" cy="47" r="2" fill="#fff" /><circle cx="76" cy="47" r="2" fill="#fff" />
      <path d={mouth} stroke="#173b3c" strokeWidth="3" fill="none" strokeLinecap="round" />
      {(mood === "happy" || mood === "thanks") && <><ellipse cx="32" cy="62" rx="6" ry="3.5" fill="#ff9ec0" opacity=".6" /><ellipse cx="84" cy="62" rx="6" ry="3.5" fill="#ff9ec0" opacity=".6" /></>}
    </motion.svg>
  );
}

function Coins({ max, value, onChange }: { max: number; value: number; onChange: (n: number) => void }) {
  return (
    <div className="grid grid-cols-6 gap-2" role="radiogroup">
      {Array.from({ length: max + 1 }, (_, n) => (
        <button key={n} type="button" role="radio" aria-checked={value === n} onClick={() => onChange(n)} data-testid={`coin-${n}`}
          className={`grid aspect-square place-items-center rounded-full text-sm font-bold transition active:scale-90 ${n <= value && n > 0 ? "bg-[radial-gradient(circle_at_35%_30%,#fff6d6,#f6cf7a_55%,#c8932c)] text-plum shadow-[0_0_14px_-2px_rgba(246,207,122,.8)]" : "border border-white/15 bg-white/[0.05] text-dim"} ${value === n ? "ring-2 ring-gold" : ""}`}>{n}</button>
      ))}
    </div>
  );
}

export function TrustGame({ onDone }: GameProps) {
  const P = usePlay(); const U = P.ui.trust; const reduce = useReduce(); const log = useTapLog();
  const amounts = useRef<{ v: number; ms: number }[]>([]); const shown = useRef(0);
  const [i, setI] = useState(0); const [v, setV] = useState(5); const [coins, setCoins] = useState(10);
  const [msg, setMsg] = useState<string | null>(null); const [mood, setMood] = useState<"idle" | "happy" | "sly" | "thanks">("idle");
  useEffect(() => { log.start(); shown.current = now(); }, [log]);
  const r = TRUST_ROUNDS[i];
  const max = r.kind === "send" ? 10 : r.pot;

  const confirm = () => {
    log.tap(); if (msg) return;
    amounts.current.push({ v, ms: Math.round(now() - shown.current) });
    if (r.kind === "send") {
      const back = mossReturn(v, r.back);
      if (v > 0 && back === 0) { setMood("sly"); setMsg(U.kept(v)); haptic(HAPTIC.bad, reduce); }
      else { setMood("happy"); setMsg(v ? U.got(v, back) : U.none); haptic(HAPTIC.good, reduce); }
      setCoins((c) => c - v + back);
    } else { setMood(v > 0 ? "thanks" : "idle"); setMsg(v > 0 ? U.thanks : U.none); haptic(HAPTIC.tap, reduce); setCoins((c) => c + (r.pot - v)); }
    setTimeout(() => {
      if (i + 1 >= TRUST_ROUNDS.length) { onDone(scoreTrust({ amounts: amounts.current, taps: log.taps.current, ms: log.elapsed() })); return; }
      const nr = TRUST_ROUNDS[i + 1];
      setI(i + 1); setMsg(null); setMood("idle"); setV(nr.kind === "send" ? 5 : Math.floor(nr.pot / 2)); shown.current = now();
    }, reduce ? 900 : 1700);
  };
  const q = r.kind === "send" ? U.sendQ : r.kind === "back" ? U.backQ(r.pot) : U.splitQ(r.pot);
  return (
    <GameFrame step={i + 1} total={TRUST_ROUNDS.length} label={P.games.trust.name} right={<span className="font-semibold text-gold">{U.total}: {coins}</span>} testId="game-trust">
      <div className="mb-3 flex items-center gap-4">
        <Moss mood={mood} className="h-24 w-24 shrink-0 drop-shadow-[0_0_20px_rgba(143,227,214,.45)]" />
        <div className="min-h-[72px] flex-1 rounded-2xl rounded-tl-sm bg-white/[0.07] px-4 py-3 text-[15px]" aria-live="polite">
          <b className="mb-0.5 block text-xs text-sage">{U.moss}</b>{msg ?? q}
        </div>
      </div>
      <div className={msg ? "pointer-events-none opacity-40 transition" : "transition"}>
        <Coins max={max} value={v} onChange={(n) => { log.tap(); haptic(4, reduce); setV(n); }} />
        <button type="button" className="btn-primary mt-4 w-full py-3.5 text-base" onClick={confirm} data-testid="trust-confirm">{U.send} {v} ●</button>
      </div>
    </GameFrame>
  );
}
