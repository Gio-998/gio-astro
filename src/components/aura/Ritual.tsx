"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Aura, Ambient } from "./Aura";
import { DatePicker } from "../DatePicker";
import { CityPicker } from "../CityPicker";
import { ZodiacWheel } from "../art/ZodiacWheel";
import { CONSTELLATIONS } from "../art/constellations";
import { useContent, useDate } from "@/lib/content-context";
import type { Place, StoredPerson } from "@/lib/store";
import { profileOf } from "@/lib/profile";
import { sunSignForDate } from "@/engine/astro";
import { SIGN_ELEMENT, SIGN_GLYPH } from "@/engine/zodiac";
import { auraState, WEATHERS, BODIES, INTENTIONS, type AuraAnswers, type Weather, type BodyFeel, type Intention } from "@/lib/aura";

const STEPS = ["intro", "name", "date", "time", "place", "energy", "weather", "body", "intent", "breath", "cast"] as const;
type StepId = (typeof STEPS)[number];
const ROOT_HZ = { fire: 130.81, earth: 98, air: 146.83, water: 110 } as const;
const WEATHER_ICON: Record<Weather, string> = { sunny: "☀︎", cloudy: "☁︎", stormy: "ϟ", foggy: "≋", rainbow: "◠" };
const BODY_ICON: Record<BodyFeel, string> = { light: "◌", heavy: "●", tense: "⌇", buzzing: "✺", grounded: "▽" };
const INTENT_ICON: Record<Intention, string> = { love: "♡", clarity: "◇", healing: "✚", courage: "△", peace: "☾" };

/** Full-screen attunement: each answer reshapes a living aura, then a cinematic "reading your sky" reveal. */
export function Ritual({ initial, onDone, onQuick, onClose }: { initial?: Partial<StoredPerson>; onDone: (p: StoredPerson) => void; onQuick: () => void; onClose: () => void }) {
  const { c } = useContent(); const R = c.ui.ritual; const fmt = useDate();
  const [i, setI] = useState(0); const step: StepId = STEPS[i];
  const [name, setName] = useState(initial?.name ?? ""); const [date, setDate] = useState(initial?.date ?? "");
  const [time, setTime] = useState(initial?.time ?? ""); const [unknown, setUnknown] = useState(!!initial?.date && initial.time == null); const [place, setPlace] = useState<Place | null>(initial?.place ?? null);
  const [ans, setAns] = useState<AuraAnswers>({ energy: 3, ...(initial?.aura ?? {}) });
  const [pulse, setPulse] = useState(0); const [breath, setBreath] = useState<number | null>(null); const [breathTxt, setBreathTxt] = useState("");
  const [sound, setSound] = useState(false); const amb = useRef<Ambient | null>(null);
  const [castI, setCastI] = useState(0);
  const reduce = useMemo(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);

  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(date) && +date.slice(0, 4) >= 1900 && +date.slice(0, 4) <= 2100;
  const sign = validDate ? sunSignForDate(date) : null; const el = sign ? SIGN_ELEMENT[sign] : null;
  const draft: StoredPerson | null = validDate ? { id: "me", name: name.trim() || "—", date, time: unknown || !time ? null : time, place, quiz: {}, createdAt: new Date().toISOString(), aura: ans } : null;
  const palette = draft ? profileOf(draft).palette : null;
  const presence = Math.min(1, 0.25 + i * 0.09 + (name.trim() ? 0.1 : 0));
  const aura = auraState({ palette, answers: step === "intro" || step === "name" || step === "date" || step === "time" || step === "place" ? { energy: ans.energy } : ans, presence });
  if (step === "name" && name.trim()) aura.heart = "#ffd9a8";

  const bump = () => setPulse((p) => p + 1);
  useEffect(() => { if (el && amb.current) amb.current.setRoot(ROOT_HZ[el]); }, [el]);
  useEffect(() => () => amb.current?.stop(), []);
  const toggleSound = () => { if (sound) { amb.current?.stop(); amb.current = null; setSound(false); } else { amb.current = new Ambient(); amb.current.start(el ? ROOT_HZ[el] : 110); setSound(true); } };

  // guided breath: 3 × (4 s in, 6 s out), aura ring follows
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- leaving the breath step clears the external breath
    if (step !== "breath") { setBreath(null); return; }
    const t0 = performance.now(); let raf = 0; const IN = reduce ? 1.5 : 4, OUT = reduce ? 1.5 : 6, CYCLE = IN + OUT;
    const tick = () => {
      const t = (performance.now() - t0) / 1000; const n = Math.floor(t / CYCLE); const ph = t - n * CYCLE;
      if (n >= 3) { setBreath(0.6); setBreathTxt(R.breathDone); setTimeout(() => setI((x) => (STEPS[x] === "breath" ? x + 1 : x)), 1400); return; }
      const v = ph < IN ? 0.5 - 0.5 * Math.cos((ph / IN) * Math.PI) : 0.5 + 0.5 * Math.cos(((ph - IN) / OUT) * Math.PI);
      setBreath(v); setBreathTxt(`${ph < IN ? R.inhale : R.exhale} · ${R.breathCount(n + 1)}`); raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, [step, reduce, R]);

  // cinematic cast, then hand the finished profile back
  useEffect(() => {
    if (step !== "cast") return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset when the cast step starts
    bump(); setCastI(0);
    const per = reduce ? 250 : 950; let k = 0;
    const id = setInterval(() => { k++; setCastI(k); if (k >= R.casting.length) { clearInterval(id); setTimeout(() => draft && onDone({ ...(initial ?? {}), ...draft, quiz: initial?.quiz ?? {}, createdAt: initial?.createdAt ?? draft.createdAt, id: "me", name: name.trim(), aura: { ...ans, at: new Date().toISOString() } }), reduce ? 200 : 900); } }, per);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const canNext = step === "name" ? !!name.trim() : step === "date" ? validDate : step === "weather" ? !!ans.weather : step === "body" ? !!ans.body : step === "intent" ? !!ans.intention : true;
  const next = () => { if (!canNext) return; bump(); setI((x) => Math.min(STEPS.length - 1, x + 1)); };
  const back = () => setI((x) => Math.max(0, x - 1));
  const pick = <K extends keyof AuraAnswers>(k: K, v: AuraAnswers[K]) => { setAns((a) => ({ ...a, [k]: v })); bump(); };
  const qSteps = STEPS.length - 2;

  const panel = (() => {
    switch (step) {
      case "intro": return (<>
        <p className="eyebrow mb-2">{R.eyebrow}</p>
        <h1 className="h-display mb-3 text-4xl sm:text-5xl"><span className="text-aurora">{R.title}</span></h1>
        <p className="mb-3 text-mist/90">{R.text}</p>
        <p className="mb-6 text-xs text-dim">ⓘ {R.honest}</p>
        <button className="btn-primary w-full py-3 text-base" onClick={next} data-testid="ritual-begin">{R.begin} ✦</button>
        <button className="mt-3 w-full text-center text-sm text-dim underline-offset-4 hover:underline" onClick={onQuick}>{R.quick}</button>
      </>);
      case "name": return (<Q title={R.nameQ} hint={R.nameHint}>
        <input className="input text-lg" autoFocus value={name} maxLength={60} onChange={(e) => setName(e.target.value)} placeholder={R.namePh} autoComplete="given-name" data-testid="ritual-name" onKeyDown={(e) => e.key === "Enter" && next()} />
      </Q>);
      case "date": return (<Q title={R.dateQ(name.trim())} hint={R.dateHint}>
        <DatePicker value={date} onChange={(v) => { setDate(v); }} minYear={1900} />
        {sign && el && <motion.p key={sign} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 text-gold">{SIGN_GLYPH[sign]} {R.signLine(c.astro.signs[sign].name, c.astro.elements[el].name)} · {fmt(date)}</motion.p>}
      </Q>);
      case "time": return (<Q title={R.timeQ} hint={R.timeHint}>
        <input className="input text-lg" type="time" value={time} disabled={unknown} onChange={(e) => setTime(e.target.value)} />
        <label className="mt-3 flex items-center gap-2 text-sm text-dim"><input type="checkbox" checked={unknown} onChange={(e) => setUnknown(e.target.checked)} /> {R.unknown}</label>
      </Q>);
      case "place": return (<Q title={R.placeQ} hint={R.placeHint}><CityPicker value={place} onChange={setPlace} /></Q>);
      case "energy": return (<Q title={R.energyQ} hint={R.energyHint}>
        <input type="range" min={1} max={5} step={1} value={ans.energy ?? 3} onChange={(e) => pick("energy", Number(e.target.value))} className="w-full accent-[var(--color-gold)]" aria-label={R.energyQ} data-testid="ritual-energy" />
        <div className="mt-1 flex justify-between text-xs text-dim"><span>{R.low}</span><span>{R.high}</span></div>
      </Q>);
      case "weather": return (<Q title={R.weatherQ} hint={R.weatherHint}><Choice opts={WEATHERS} icons={WEATHER_ICON} value={ans.weather} labels={R.weather} onPick={(v) => pick("weather", v)} /></Q>);
      case "body": return (<Q title={R.bodyQ} hint={R.bodyHint}><Choice opts={BODIES} icons={BODY_ICON} value={ans.body} labels={R.body} onPick={(v) => pick("body", v)} /></Q>);
      case "intent": return (<Q title={R.intentQ} hint={R.intentHint}><Choice opts={INTENTIONS} icons={INTENT_ICON} value={ans.intention} labels={R.intent} onPick={(v) => pick("intention", v)} /></Q>);
      case "breath": return (<div className="text-center" aria-live="polite">
        <p className="eyebrow mb-3">{R.breathQ}</p>
        <p className="h-display text-3xl text-aurora sm:text-4xl" data-testid="breath-text">{breathTxt || R.inhale}</p>
        <button className="mt-6 text-sm text-dim underline-offset-4 hover:underline" onClick={next}>{R.skip}</button>
      </div>);
      case "cast": return (<div className="text-center" role="status" aria-live="polite">
        <AnimatePresence mode="wait"><motion.p key={castI} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="h-display text-2xl text-mist sm:text-3xl">{R.casting[Math.min(castI, R.casting.length - 1)]}</motion.p></AnimatePresence>
        <div className="mx-auto mt-4 flex w-48 gap-1">{R.casting.map((_, k) => <span key={k} className={`h-1 flex-1 rounded-full transition ${k <= castI ? "bg-gold" : "bg-white/15"}`} />)}</div>
      </div>);
    }
  })();

  const con = sign ? CONSTELLATIONS[sign] : null;
  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-[radial-gradient(ellipse_at_30%_20%,#2a1f63_0%,#120f2e_55%,#07061a_100%)] text-mist" data-testid="ritual">
      {palette && <div className="pointer-events-none fixed inset-0 opacity-40 transition-[background] duration-1000" style={{ background: `radial-gradient(circle at 30% 45%, ${palette[0]}55, transparent 55%), radial-gradient(circle at 75% 70%, ${palette[4]}44, transparent 55%)` }} />}
      <div className="relative z-10 flex items-center justify-between px-4 py-3 sm:px-6">
        <span className="text-xs uppercase tracking-[.25em] text-dim">{i > 0 && i <= qSteps ? R.step(i, qSteps) : "✦"}</span>
        <div className="flex items-center gap-2">
          <button onClick={toggleSound} className="chip text-mist" aria-pressed={sound} data-testid="ritual-sound">{sound ? "♪ " + R.soundOn : "♪̸ " + R.soundOff}</button>
          <button onClick={() => { amb.current?.stop(); onClose(); }} className="chip text-mist" aria-label={R.close}>✕</button>
        </div>
      </div>
      <div className="relative z-10 mx-auto grid min-h-[calc(100svh-56px)] max-w-6xl items-center gap-4 px-4 pb-8 md:grid-cols-[1.1fr_1fr] md:gap-10 md:px-8">
        <div className="relative mx-auto h-[42svh] w-full max-w-[520px] md:h-[78svh]">
          {step === "cast" && <motion.div initial={{ opacity: 0, scale: 0.6, rotate: -30 }} animate={{ opacity: 0.9, scale: 1, rotate: 0 }} transition={{ duration: reduce ? 0 : 2.4, ease: "easeOut" }} className="absolute inset-0 grid place-items-center">
            <ZodiacWheel className={`h-[92%] w-[92%] ${reduce ? "" : "animate-[spin_40s_linear_infinite]"}`} /></motion.div>}
          {step === "cast" && con && <svg viewBox="0 0 100 100" className="absolute inset-[18%] h-[64%] w-[64%]" aria-hidden>
            {con.l.map(([a, b], k) => <motion.line key={k} x1={con.s[a][0]} y1={con.s[a][1]} x2={con.s[b][0]} y2={con.s[b][1]} stroke="#f6cf7a" strokeWidth={0.5} strokeLinecap="round" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.9 }} transition={{ delay: reduce ? 0 : 1 + k * 0.25, duration: reduce ? 0 : 0.8 }} />)}
            {con.s.map(([x, y, m], k) => <motion.circle key={k} cx={x} cy={y} r={2.2 - m * 0.5} fill="#fff8e6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: reduce ? 0 : 0.8 + k * 0.15 }} />)}
          </svg>}
          <Aura className="absolute inset-0 h-full w-full" {...aura} breath={breath} pulse={pulse} body={step !== "cast" || castI < 2} label={R.auraLabel(name || "")} />
        </div>
        <div className="mx-auto w-full max-w-md">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, y: reduce ? 0 : 16, filter: reduce ? "none" : "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: reduce ? 0 : -12 }} transition={{ duration: reduce ? 0 : 0.45 }}
              className="rounded-[28px] border border-white/15 bg-white/[0.06] p-6 shadow-[0_30px_80px_-40px_rgba(139,108,240,.9)] backdrop-blur-xl sm:p-8">
              {panel}
              {i > 0 && step !== "breath" && step !== "cast" && (
                <div className="mt-6 flex items-center justify-between gap-2">
                  <button className="btn-ghost" onClick={back}>← {R.back}</button>
                  <div className="flex gap-2">
                    {(step === "time" || step === "place") && <button className="btn-ghost" onClick={() => { if (step === "time") setUnknown(true); next(); }}>{R.skip}</button>}
                    <button className="btn-primary" disabled={!canNext} onClick={next} data-testid="ritual-next">{R.next} →</button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Choice<T extends string>({ opts, icons, value, onPick, labels }: { opts: readonly T[]; icons: Record<T, string>; value?: T; onPick: (v: T) => void; labels: Record<string, string> }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {opts.map((o) => (
        <button key={o} type="button" onClick={() => onPick(o)} data-testid={`opt-${o}`} aria-pressed={value === o}
          className={`rounded-2xl border px-3 py-3 text-left text-sm transition ${value === o ? "border-gold/80 bg-gold/15 text-mist shadow-[0_0_24px_-6px_rgba(246,207,122,.6)]" : "border-white/15 bg-white/[0.06] text-dim hover:border-white/30 hover:text-mist"}`}>
          <span className="mr-2 text-lg">{icons[o]}</span>{labels[o]}
        </button>
      ))}
    </div>
  );
}

function Q({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
  return (<>
    <h2 className="h-display mb-2 text-3xl leading-tight sm:text-4xl">{title}</h2>
    <p className="mb-5 text-sm text-dim">{hint}</p>
    {children}
  </>);
}
