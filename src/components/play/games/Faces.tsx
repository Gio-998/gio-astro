"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FACE_SCENES, FACE_TRIALS, scoreFaces, type CareMove, type Emotion } from "@/engine/play";
import { usePlay } from "../text";
import { Choice, GameFrame, type GameProps } from "../GameFrame";
import { Face } from "../Face";
import { haptic, HAPTIC, useReduce, useTapLog } from "../fx";
import { now } from "../fx";

const SKINS: [string, string][] = [["#f2c6a8", "#3b2a4a"], ["#c98e6b", "#1d1430"], ["#8a5a44", "#120c1c"], ["#f6d5c0", "#9a6a3a"], ["#b47b5a", "#2b1d12"], ["#e8b796", "#55331f"], ["#6e4433", "#0d0b14"], ["#f0c9b0", "#c9a06a"]];

export function FacesGame({ onDone }: GameProps) {
  const P = usePlay(); const U = P.ui.faces; const reduce = useReduce(); const log = useTapLog();
  const picks = useRef<{ chosen: Emotion | null; ms: number }[]>([]); const scenes = useRef<{ move: CareMove; ms: number }[]>([]);
  const [i, setI] = useState(0); const [phase, setPhase] = useState<"watch" | "flash" | "ask" | "scene">("watch");
  const [picked, setPicked] = useState<Emotion | null>(null); const shown = useRef(0);
  const total = FACE_TRIALS.length + FACE_SCENES.length;

  useEffect(() => { log.start(); }, [log]);
  useEffect(() => {
    if (phase !== "watch") return;
    const a = setTimeout(() => { setPhase("flash"); }, 900);
    return () => clearTimeout(a);
  }, [phase, i]);
  useEffect(() => {
    if (phase !== "flash") return;
    const t = FACE_TRIALS[i];
    const b = setTimeout(() => { setPhase("ask"); shown.current = now(); }, t?.subtle ? 650 : 900);
    return () => clearTimeout(b);
  }, [phase, i]);

  const answer = (e: Emotion) => {
    log.tap(); if (picked) return;
    haptic(HAPTIC.tap, reduce); setPicked(e);
    picks.current.push({ chosen: e, ms: Math.round(now() - shown.current) });
    setTimeout(() => {
      setPicked(null);
      if (i + 1 < FACE_TRIALS.length) { setI(i + 1); setPhase("watch"); }
      else { setI(i + 1); setPhase("scene"); shown.current = now(); }
    }, reduce ? 150 : 380);
  };
  const care = (m: CareMove) => {
    log.tap(); haptic(HAPTIC.tap, reduce);
    scenes.current.push({ move: m, ms: Math.round(now() - shown.current) });
    const k = i + 1 - FACE_TRIALS.length;
    if (k >= FACE_SCENES.length) { haptic(HAPTIC.win, reduce); onDone(scoreFaces({ picks: picks.current, scenes: scenes.current, taps: log.taps.current, ms: log.elapsed() })); return; }
    setI(i + 1); shown.current = now();
  };

  if (phase === "scene") {
    const k = i - FACE_TRIALS.length; const sc = P.scenes[k]; const moves = FACE_SCENES[k];
    return (
      <GameFrame step={i + 1} total={total} label={P.games.faces.name} testId="game-faces">
        <AnimatePresence mode="wait">
          <motion.div key={k} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: reduce ? 0.1 : 0.3 }}>
            <p className="mb-2 text-xs text-dim">{U.scene}</p>
            <div className="mb-4 flex items-end gap-3">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-white/10 ring-1 ring-white/20"><Face emotion="sadness" intensity={0.6} skin={SKINS[k + 2][0]} hair={SKINS[k + 2][1]} className="h-full w-full" /></div>
              <div className="rounded-2xl rounded-bl-sm bg-white/10 px-4 py-3 text-[15px]"><b className="mb-0.5 block text-xs text-gold">{sc.who}</b>{sc.says}</div>
            </div>
            <p className="mb-2 text-sm text-mist/80">{U.how}</p>
            <div className="grid gap-2">{moves.map((m) => <Choice key={m} onClick={() => care(m)} testId={`care-${m}`}>{sc.moves[m]}</Choice>)}</div>
          </motion.div>
        </AnimatePresence>
      </GameFrame>
    );
  }
  const t = FACE_TRIALS[i]; const [skin, hair] = SKINS[i % SKINS.length];
  return (
    <GameFrame step={i + 1} total={total} label={P.games.faces.name} testId="game-faces">
      <div className="relative mx-auto mb-3 grid aspect-square w-[min(68vw,260px)] place-items-center rounded-full bg-[radial-gradient(circle_at_50%_40%,rgba(201,184,255,.25),transparent_70%)]">
        <Face emotion={phase === "flash" ? t.e : null} intensity={t.subtle ? 0.5 : 1} skin={skin} hair={hair} className="h-full w-full drop-shadow-[0_10px_30px_rgba(0,0,0,.5)]" />
        {phase === "flash" && !reduce && <motion.span className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-gold/60" initial={{ scale: 0.9, opacity: 0.9 }} animate={{ scale: 1.08, opacity: 0 }} transition={{ duration: 0.8 }} />}
      </div>
      <p className="mb-3 text-center text-sm text-mist/85" aria-live="polite">{phase === "ask" ? U.what : U.watch}</p>
      <div className={`grid grid-cols-2 gap-2 transition-opacity ${phase === "ask" ? "opacity-100" : "pointer-events-none opacity-30"}`}>
        {t.options.map((e) => <Choice key={e} onClick={() => answer(e)} active={picked === e} className="!text-center" testId={`emo-${e}`}>{P.emotions[e]}</Choice>)}
      </div>
    </GameFrame>
  );
}
