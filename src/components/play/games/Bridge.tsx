"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BRIDGE_REWARD, BRIDGE_ROUNDS, bridgeBreaks, scoreBridge, type BridgeLevel, type BridgeStep } from "@/engine/play";
import { usePlay } from "../text";
import { GameFrame, type GameProps } from "../GameFrame";
import { haptic, HAPTIC, useReduce, useTapLog } from "../fx";
import { now } from "../fx";

const COL = ["#c9b8ff", "#f6cf7a", "#8fe3d6"];
function BridgeArt({ level, state }: { level: BridgeLevel; state: "idle" | "cross" | "fall" | "made" }) {
  const reduce = useReduce();
  const plank = level === 0 ? "#8d84b8" : level === 1 ? "#c8a46a" : "url(#br-glass)";
  return (
    <svg viewBox="0 0 320 170" className="h-auto w-full" aria-hidden>
      <defs>
        <linearGradient id="br-sky" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#2b2266" /><stop offset="1" stopColor="#120f2e" /></linearGradient>
        <linearGradient id="br-glass" x1="0" x2="1"><stop offset="0" stopColor="#bdf4ff" stopOpacity=".55" /><stop offset=".5" stopColor="#ffffff" stopOpacity=".85" /><stop offset="1" stopColor="#8fe3d6" stopOpacity=".55" /></linearGradient>
        <radialGradient id="br-orb"><stop offset="0" stopColor="#fff" /><stop offset=".5" stopColor="#f6cf7a" /><stop offset="1" stopColor="#f6b5cf" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="320" height="170" rx="18" fill="url(#br-sky)" />
      {[[40, 20], [120, 34], [210, 16], [280, 40], [170, 52]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.3} fill="#fff" opacity=".7" />)}
      <path d="M0 92 L70 88 L76 170 L0 170Z" fill="#3b2f86" /><path d="M250 88 L320 92 L320 170 L244 170Z" fill="#3b2f86" />
      <path d="M76 170 Q160 120 244 170" fill="#0d0b1f" opacity=".8" />
      {state === "fall" ? (
        <g>
          <motion.path d="M72 90 L150 96" stroke={plank} strokeWidth="7" strokeLinecap="round" initial={{ rotate: 0 }} animate={reduce ? {} : { rotate: 28, y: 30, opacity: 0.4 }} style={{ transformOrigin: "72px 90px" }} transition={{ duration: 0.6 }} />
          <motion.path d="M170 96 L248 90" stroke={plank} strokeWidth="7" strokeLinecap="round" initial={{ rotate: 0 }} animate={reduce ? {} : { rotate: -28, y: 30, opacity: 0.4 }} style={{ transformOrigin: "248px 90px" }} transition={{ duration: 0.6 }} />
        </g>
      ) : (
        <path d={level === 1 ? "M72 90 Q160 112 248 90" : "M72 90 L248 90"} stroke={plank} strokeWidth={level === 2 ? 6 : 7} fill="none" strokeLinecap="round" strokeDasharray={level === 0 ? "14 3" : undefined} />
      )}
      {level === 1 && state !== "fall" && <path d="M72 70 Q160 96 248 70" stroke="#c8a46a" strokeWidth="1.5" fill="none" opacity=".6" />}
      <motion.circle r="9" fill="url(#br-orb)" cy={80}
        initial={{ cx: 56 }}
        animate={state === "idle" ? { cx: 56 } : state === "made" ? { cx: 266 } : state === "fall" ? { cx: 160, cy: 190 } : { cx: 160 }}
        transition={{ duration: reduce ? 0.2 : state === "fall" ? 0.7 : 0.9, ease: state === "fall" ? "easeIn" : "easeInOut" }} />
    </svg>
  );
}

export function BridgeGame({ onDone }: GameProps) {
  const P = usePlay(); const U = P.ui.bridge; const reduce = useReduce();
  const log = useTapLog();
  const steps = useRef<BridgeStep[]>([]); const shown = useRef(0);
  const [round, setRound] = useState(0); const [stars, setStars] = useState(0);
  const [level, setLevel] = useState<BridgeLevel>(0); const [state, setState] = useState<"idle" | "cross" | "fall" | "made">("idle");
  const [msg, setMsg] = useState<string>(U.pick); const [busy, setBusy] = useState(false); const [lastFell, setLastFell] = useState(false);
  useEffect(() => { log.start(); shown.current = now(); }, [log]);
  const finish = (quit: boolean) => onDone(scoreBridge({ steps: steps.current, quit, taps: log.taps.current, ms: log.elapsed() }));

  const pick = (l: BridgeLevel) => {
    log.tap(); if (busy) return;
    haptic(HAPTIC.tap, reduce);
    const ms = Math.round(now() - shown.current);
    const fell = bridgeBreaks(steps.current.map((s) => s.level), steps.current.map((s) => s.fell), l);
    const gust = fell && !(l === 2 && [2, 4].includes(steps.current.filter((s) => s.level === 2).length + 1)) && !(l === 1 && steps.current.filter((s) => s.level === 1).length + 1 === 3);
    steps.current.push({ level: l, ms, fell });
    setBusy(true); setLevel(l); setState("cross"); setMsg("");
    const t1 = reduce ? 200 : 900;
    setTimeout(() => {
      setState(fell ? "fall" : "made");
      if (fell) { haptic(HAPTIC.bad, reduce); setMsg(gust ? U.gust : U.broke[l]); } else { haptic(HAPTIC.good, reduce); setStars((s) => s + BRIDGE_REWARD[l]); setMsg(U.made); }
      setTimeout(() => {
        if (steps.current.length >= BRIDGE_ROUNDS) { finish(false); return; }
        setLastFell(fell); setRound((r) => r + 1); setState("idle"); setBusy(false); setMsg(fell ? U.again : U.pick); shown.current = now();
      }, reduce ? 700 : 1200);
    }, t1);
  };

  return (
    <GameFrame step={round + 1} total={BRIDGE_ROUNDS} label={P.games.bridge.name} right={<span className="font-semibold text-gold" data-testid="bridge-stars">★ {stars}</span>} testId="game-bridge">
      <div className="overflow-hidden rounded-2xl ring-1 ring-white/10"><BridgeArt level={level} state={state} /></div>
      <div className="my-3 min-h-[28px] text-center" aria-live="polite">
        <AnimatePresence mode="wait"><motion.p key={msg} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`text-sm ${state === "fall" ? "text-rose" : state === "made" ? "text-sage" : "text-mist"}`}>{msg}</motion.p></AnimatePresence>
      </div>
      <div className="grid gap-2">
        {([0, 1, 2] as BridgeLevel[]).map((l) => (
          <button key={l} type="button" disabled={busy} onClick={() => pick(l)} data-testid={`bridge-${l}`}
            className="group flex min-h-[60px] items-center gap-3 rounded-2xl border border-white/12 bg-white/[0.05] px-4 py-3 text-left transition active:scale-[.97] disabled:opacity-50 hover:border-gold/40">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style={{ background: `${COL[l]}22`, boxShadow: `0 0 18px -4px ${COL[l]}` }}>
              <svg viewBox="0 0 40 20" className="h-5 w-8"><path d={l === 1 ? "M2 6 Q20 16 38 6" : "M2 10 L38 10"} stroke={COL[l]} strokeWidth="3" fill="none" strokeDasharray={l === 0 ? "6 2" : undefined} strokeLinecap="round" /></svg>
            </span>
            <span className="flex-1"><span className="block font-semibold">{U.names[l]}</span><span className="text-xs text-dim">{U.hints[l]}</span></span>
            <span className="rounded-full bg-gold/15 px-2.5 py-1 text-sm font-semibold text-gold">+{BRIDGE_REWARD[l]} ★</span>
          </button>
        ))}
      </div>
      {lastFell && !busy && <button type="button" className="mt-3 w-full text-center text-sm text-dim underline decoration-dotted underline-offset-4" onClick={() => { log.tap(); finish(true); }} data-testid="bridge-rest">{U.rest}</button>}
    </GameFrame>
  );
}
