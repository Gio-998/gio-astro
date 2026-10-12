"use client";
import { useEffect, useRef, useState } from "react";
import { FOCUS_SEQ, FOCUS_SHOW_MS, scoreFocus, type FocusRaw } from "@/engine/play";
import { usePlay } from "../text";
import { GameFrame, type GameProps } from "../GameFrame";
import { haptic, HAPTIC, now, useReduce, useTapLog } from "../fx";

const GAP_MS = 420;

function Star() {
  return <svg viewBox="0 0 100 100" className="h-32 w-32 drop-shadow-[0_0_28px_rgba(246,207,122,.85)]" aria-hidden><defs><radialGradient id="fs-g" cx="45%" cy="40%" r="60%"><stop offset="0" stopColor="#fff6d6" /><stop offset=".6" stopColor="#f6cf7a" /><stop offset="1" stopColor="#c8932c" /></radialGradient></defs><path d="M50 6 L61 38 L95 38 L67 58 L78 92 L50 71 L22 92 L33 58 L5 38 L39 38Z" fill="url(#fs-g)" /></svg>;
}
function Moon() {
  return <svg viewBox="0 0 100 100" className="h-32 w-32 drop-shadow-[0_0_28px_rgba(255,107,129,.8)]" aria-hidden><path d="M66 10 A42 42 0 1 0 90 72 A34 34 0 1 1 66 10Z" fill="#ff6b81" /></svg>;
}

export function FocusGame({ onDone }: GameProps) {
  const P = usePlay(); const U = P.ui.focus; const reduce = useReduce(); const log = useTapLog();
  const trials = useRef<FocusRaw["trials"]>([]); const shownAt = useRef(0); const tappedThis = useRef(false);
  const [started, setStarted] = useState(false); const [i, setI] = useState(-1); const [visible, setVisible] = useState(false);
  const [fb, setFb] = useState<"" | "good" | "bad">("");

  useEffect(() => {
    if (!started) return;
    let k = 0; let alive = true; const timers: ReturnType<typeof setTimeout>[] = [];
    const show = () => {
      if (!alive) return;
      if (k >= FOCUS_SEQ.length) { onDone(scoreFocus({ trials: trials.current, taps: log.taps.current, ms: log.elapsed() })); return; }
      tappedThis.current = false; shownAt.current = now(); setI(k); setVisible(true); setFb("");
      timers.push(setTimeout(() => {
        if (!tappedThis.current) trials.current.push({ go: FOCUS_SEQ[k] === 1, tapped: false, rt: null });
        setVisible(false); k++; timers.push(setTimeout(show, GAP_MS));
      }, FOCUS_SHOW_MS));
    };
    log.start(); timers.push(setTimeout(show, 700));
    return () => { alive = false; timers.forEach(clearTimeout); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  const tap = () => {
    if (!started) return; log.tap();
    if (!visible || tappedThis.current || i < 0) return;
    tappedThis.current = true; const go = FOCUS_SEQ[i] === 1;
    trials.current.push({ go, tapped: true, rt: Math.round(now() - shownAt.current) });
    setFb(go ? "good" : "bad"); haptic(go ? HAPTIC.tap : HAPTIC.bad, reduce);
  };

  const go = i >= 0 && FOCUS_SEQ[i] === 1;
  return (
    <GameFrame step={Math.max(1, i + 1)} total={FOCUS_SEQ.length} label={P.games.focus.name} testId="game-focus">
      {!started ? (
        <div className="py-6 text-center">
          <div className="mb-4 flex items-center justify-center gap-6"><div className="scale-75"><Star /></div><div className="scale-75 opacity-90"><Moon /></div></div>
          <p className="mb-5 text-[15px]">{U.ready}</p>
          <button type="button" className="btn-primary w-full py-4 text-lg" onClick={() => { haptic(HAPTIC.tap, reduce); setStarted(true); }} data-testid="focus-start">{U.start} ✦</button>
        </div>
      ) : (
        <button type="button" onPointerDown={tap} data-testid="focus-zone" aria-label={U.tapZone}
          className={`relative grid h-[360px] w-full place-items-center rounded-3xl border transition-colors duration-150 ${fb === "bad" ? "border-[#ff6b81]/70 bg-[#ff6b81]/10" : fb === "good" ? "border-gold/60 bg-gold/10" : "border-white/10 bg-white/[0.03]"}`}>
          <div className={`transition-all ${reduce ? "duration-0" : "duration-150"} ${visible ? "scale-100 opacity-100" : "scale-75 opacity-0"}`} data-testid={visible ? (go ? "focus-star" : "focus-moon") : undefined}>{go ? <Star /> : <Moon />}</div>
          <span className="absolute bottom-4 text-xs text-dim">{fb === "bad" ? U.oops : fb === "good" ? U.caught : U.tapZone}</span>
        </button>
      )}
    </GameFrame>
  );
}
