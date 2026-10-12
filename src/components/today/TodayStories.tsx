"use client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as Astronomy from "astronomy-engine";
import { useStore, repo, type StoredPerson } from "@/lib/store";
import { profileOf } from "@/lib/profile";
import { useContent, useHref, useDate } from "@/lib/content-context";
import { dailyGuidance, hash, moonPhase, type Daily } from "@/engine/daily";
import { MAJOR_ARCANA } from "@/engine/tarot";
import { SIGN_GLYPH, SIGN_ELEMENT, type Sign } from "@/engine/zodiac";
import { MoonArt } from "../art/MoonArt";
import { Emblem } from "../art/Emblem";
import { haptic } from "@/lib/haptics";
import { yourDayFor } from "@/lib/your-day-slot";
import { StoryViewer, type StorySlide } from "./StoryViewer";
import { HoloCard } from "../reveal/HoloCard";

const svgOf = (el: Element | null | undefined) => (el ? el.outerHTML : null);
const FRIENDLY: Record<string, string[]> = { fire: ["fire", "air"], air: ["air", "fire"], water: ["water", "earth"], earth: ["earth", "water"] };
const easy = (a: Sign, b: Sign) => FRIENDLY[SIGN_ELEMENT[a]].includes(SIGN_ELEMENT[b]);

function daysTo(target: number, from: Date): number {
  try { const t = Astronomy.SearchMoonPhase(target, from, 40); return t ? Math.max(0, Math.round((t.date.getTime() - from.getTime()) / 86400000)) : -1; } catch { return -1; }
}

function useSeen(date: string) {
  const key = `horoscop:stories-seen:${date}`;
  const [seen, setSeen] = useState<string[]>([]);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- read device storage after mount
  useEffect(() => { try { setSeen(JSON.parse(localStorage.getItem(key) || "[]")); } catch { /* */ } }, [key]);
  const mark = useCallback((id: string) => setSeen((s) => { if (s.includes(id)) return s; const n = [...s, id]; try { localStorage.setItem(key, JSON.stringify(n)); } catch { /* */ } return n; }), [key]);
  return [seen, mark] as const;
}

/** Flip card of the day (3D, holographic face). */
function CardFlip({ name, keyword, hint, svgRef }: { name: string; keyword: string; hint: string; svgRef: React.RefObject<HTMLDivElement | null> }) {
  const [on, setOn] = useState(false);
  return (
    <div className="flex flex-col items-center">
      <button type="button" data-interactive onClick={() => { setOn(true); haptic("success"); }} className="flip h-[min(52svh,400px)] w-[min(62vw,250px)]" aria-pressed={on} aria-label={hint} data-testid="card-flip">
        <div className={`flip-inner ${on ? "flipped" : ""}`}>
          <div className="flip-face grid place-items-center overflow-hidden rounded-[22px] border border-gold/50 bg-[radial-gradient(circle_at_50%_40%,#3b2f86,#1c1645_70%)] shadow-[0_30px_80px_-20px_rgba(255,200,97,.45)]">
            <div className="absolute inset-2 rounded-[16px] border border-gold/30" />
            <svg viewBox="0 0 100 160" className="h-3/4 w-3/4 opacity-80" aria-hidden><g fill="none" stroke="#ffc861" strokeOpacity=".7"><circle cx="50" cy="80" r="30" /><circle cx="50" cy="80" r="40" strokeDasharray="2 4" /><path d="M50 30 L56 74 L100 80 L56 86 L50 130 L44 86 L0 80 L44 74 Z" strokeWidth=".8" /></g></svg>
            <span className="absolute bottom-5 animate-pulse text-xs text-gold/90">{hint}</span>
          </div>
          <div className="flip-face flip-back">
            <HoloCard className="h-full w-full rounded-[22px] border border-gold/60 bg-[radial-gradient(circle_at_50%_30%,#4b3aa0,#1c1645_75%)]">
              <div ref={svgRef} className="mx-auto mt-[18%] h-[38%] w-[60%]"><Emblem id="tarot" className="h-full w-full glow-gold" /></div>
              <p className="mt-4 px-3 text-center font-display text-[28px] font-semibold leading-tight text-gold">{name}</p>
              <p className="mt-1 px-3 text-center text-sm text-mist/85">{keyword}</p>
            </HoloCard>
          </div>
        </div>
      </button>
    </div>
  );
}

function Orb({ colors, className = "" }: { colors: string[]; className?: string }) {
  return <span className={`block rounded-full mix-blend-screen blur-[2px] ${className}`} style={{ background: `radial-gradient(circle at 35% 35%, ${colors[1] ?? "#fff"}, ${colors[0]} 45%, ${colors[2] ?? colors[0]}00 72%)` }} />;
}

export function TodayStories() {
  const s = useStore(); const { c, locale } = useContent(); const h = useHref(); const fmt = useDate();
  const [now] = useState<Date | null>(() => (typeof window === "undefined" ? null : new Date()));
  const D = c.daily; const U = c.ui.today; const T = c.sky.stories; const A = c.astro;
  const g: Daily | null = s?.me && now ? dailyGuidance(profileOf(s.me), now, D.prompts.length) : null;
  const [open, setOpen] = useState<number | null>(null);
  const [seen, mark] = useSeen(g?.date ?? "");
  const moonRef = useRef<HTMLDivElement>(null); const cardRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState<string | null>(null);

  const slides = useMemo<StorySlide[]>(() => {
    if (!s?.me || !g || !now) return [];
    const me = s.me; const prof = profileOf(me); const pal = prof.palette;
    const sky3 = (a: number, b: number, k: number) => [pal[a], pal[b], pal[k]] as [string, string, string];
    const out: StorySlide[] = [];
    const base = { palette: pal, footer: c.sky.share.footer, scan: c.sky.share.scan };
    const dateLine = fmt(now, { weekday: true, year: false });

    const yd = yourDayFor(prof, now, c);
    if (yd) out.push({
      id: "yourDay", label: T.yourDayLabel, duration: 12000, sky: { intensity: 1.2, palette: sky3(0, 1, 3) },
      render: () => (
        <div className="no-scrollbar flex flex-1 flex-col justify-center overflow-y-auto px-6">
          <p className="eyebrow rise-in mb-3">{dateLine}</p>
          <h2 className="h-display slam mb-5 text-[clamp(2.2rem,9vw,3.4rem)] italic leading-[1.05] text-aurora">{yd.motto}</h2>
          <p className="rise-in mb-4 text-[17px] leading-relaxed text-mist/95" style={{ animationDelay: ".25s" }}>{yd.paragraphs[0]}</p>
          <p className="rise-in rounded-2xl border border-white/15 bg-white/[0.07] p-3 text-sm" style={{ animationDelay: ".4s" }}>✦ {yd.practice}</p>
          <Link href={h("/today/#your-day")} data-interactive className="mt-4 text-sm text-gold underline underline-offset-4">{T.seeAll} →</Link>
        </div>
      ),
      share: () => ({ ...base, eyebrow: `${T.yourDayLabel} · ${dateLine}`, title: yd.motto, lines: [yd.paragraphs[0], yd.practice].filter(Boolean) }),
    });

    // 1 Moon
    const ph = D.moonPhases[g.moon.phase]; const moonSign = A.signs[g.moon.moonSign].name;
    const waxing = g.moon.angle < 180; const dFull = daysTo(180, now), dNew = daysTo(0, now);
    out.push({
      id: "moon", label: T.rings.moon, sky: { intensity: 1.25, swirl: 0.1 },
      render: () => (
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <div ref={moonRef} className="slam relative mb-6 h-[min(58vw,300px)] w-[min(58vw,300px)]"><div className="absolute inset-0 rounded-full bg-lilac/20 blur-3xl" /><MoonArt angle={g.moon.angle} className="relative h-full w-full animate-float" /></div>
          <p className="eyebrow mb-2">{dateLine}</p>
          <h2 className="h-display rise-in mb-2 text-[clamp(2.3rem,10vw,3.6rem)] leading-[1.02]">{ph.name}<br /><span className="italic text-aurora">{T.inSign(moonSign)} {SIGN_GLYPH[g.moon.moonSign]}</span></h2>
          <p className="rise-in mb-3 max-w-sm text-[16px] text-mist/90" style={{ animationDelay: ".2s" }}>{ph.text}</p>
          <p className="rise-in flex flex-wrap justify-center gap-2 text-xs" style={{ animationDelay: ".3s" }}>
            <span className="chip !text-mist">{T.lit(g.moon.illumination)}</span>
            {(waxing ? dFull : dNew) >= 0 && <span className="chip !border-gold/40 !text-gold">{waxing ? T.nextFull(dFull) : T.nextNew(dNew)}</span>}
          </p>
        </div>
      ),
      share: () => ({ ...base, eyebrow: dateLine, title: ph.name, subtitle: `${T.inSign(moonSign)} ${SIGN_GLYPH[g.moon.moonSign]}`, lines: [ph.text, `${T.lit(g.moon.illumination)} · ${waxing ? T.nextFull(dFull) : T.nextNew(dNew)}`], svg: () => svgOf(moonRef.current?.querySelector("svg")) }),
    });

    // 2 Your sky: the one transit that matters most
    const top = g.transits[0];
    const skyLine = top ? U.transit(A.points[top.transiting].name, D.transitTone[top.type], A.points[top.natal].name) : T.quietLine;
    const cap = (x: string) => x.charAt(0).toLocaleUpperCase(locale) + x.slice(1);
    const skyMore = top ? cap(`${U.meets(D.transitMood[top.transiting], A.points[top.natal].governs)} ${D.transitAdvice[top.type]}`) : U.quiet;
    out.push({
      id: "sky", label: T.rings.sky, duration: 8000, sky: { intensity: 1.35, swirl: 0.35, palette: sky3(0, 2, 1) },
      render: () => (
        <div className="flex flex-1 flex-col justify-center px-6">
          <p className="eyebrow mb-4">{T.skyLabel}</p>
          <h2 className="h-display mb-6 text-[clamp(2.6rem,11.5vw,4.4rem)] font-medium leading-[0.98]">
            {skyLine.split(" ").map((w, k) => <span key={k} className="kinetic-word" style={{ "--i": k } as React.CSSProperties}>{w}&nbsp;</span>)}
          </h2>
          {top && <p className="rise-in mb-3 font-kinetic text-sm tracking-wide text-gold" style={{ animationDelay: ".5s" }}>{A.points[top.transiting].glyph} {A.aspects[top.type].symbol} {A.points[top.natal].glyph} · {top.orb.toFixed(1)}°</p>}
          <p className="rise-in max-w-md text-[17px] leading-relaxed text-mist/90" style={{ animationDelay: ".6s" }}>{skyMore}</p>
          <p className="rise-in mt-5 text-xs text-mist/60" style={{ animationDelay: ".8s" }}>🔬 {T.method}</p>
        </div>
      ),
      share: () => ({ ...base, eyebrow: `${T.skyLabel} · ${dateLine}`, title: skyLine, lines: [skyMore] }),
    });

    // 3 Card of the day
    const card = c.nums.tarot[MAJOR_ARCANA[g.cardOfDay]];
    out.push({
      id: "card", label: T.rings.card, duration: 0, sky: { intensity: 1.1, palette: sky3(3, 0, 4) },
      render: () => (
        <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
          <p className="eyebrow">{U.cardOfDay}</p>
          <CardFlip name={card.name} keyword={card.keyword} hint={T.flip} svgRef={cardRef} />
          <p className="max-w-sm text-[16px] text-mist/90">{U.cardToday(card.birth)}</p>
        </div>
      ),
      share: () => ({ ...base, eyebrow: `${U.cardOfDay} · ${dateLine}`, title: card.name, subtitle: card.keyword, lines: [U.cardToday(card.birth)], svg: () => svgOf(cardRef.current?.querySelector("svg")) }),
    });

    // 4 Personal number
    out.push({
      id: "number", label: T.rings.number, sky: { intensity: 1.2, swirl: 0.6, palette: sky3(1, 4, 0) },
      render: () => (
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <p className="eyebrow mb-2">{T.numberLabel}</p>
          <p className="slam font-kinetic holo-text text-[min(52vw,260px)] font-bold leading-none" data-testid="story-number">{g.personalDay}</p>
          <p className="h-display rise-in mb-3 mt-2 text-3xl" style={{ animationDelay: ".3s" }}>{U.personalDay(g.personalDay)}</p>
          <p className="rise-in max-w-sm text-[16px] text-mist/90" style={{ animationDelay: ".45s" }}>{D.personalDay[g.personalDay]}</p>
          <p className="rise-in mt-3 chip !text-mist" style={{ animationDelay: ".6s" }}>{T.yearLine(g.personalYear)} · {c.nums.numbers[g.personalYear].essence}</p>
        </div>
      ),
      share: () => ({ ...base, eyebrow: `${T.numberLabel} · ${dateLine}`, title: U.personalDay(g.personalDay), big: String(g.personalDay), lines: [D.personalDay[g.personalDay]] }),
    });

    // 5 Bond of the day (deterministic per day among saved people)
    const people = [...s.people].sort((a, b) => a.id.localeCompare(b.id));
    const other: StoredPerson | null = people.length ? people[hash(g.date + "bond") % people.length] : null;
    if (other) {
      const op = profileOf(other); const ms = moonPhase(now).moonSign;
      const e1 = easy(ms, prof.sun), e2 = easy(ms, op.sun);
      const line = e1 && e2 ? T.bondEasy : e1 || e2 ? T.bondMixed : T.bondSlow;
      out.push({
        id: "bond", label: T.rings.bond, sky: { intensity: 1.2, palette: [pal[0], op.palette[0], pal[2]] },
        render: () => (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <p className="eyebrow mb-6">{T.bondLabel}</p>
            <div className="relative mb-6 h-44 w-72" aria-hidden>
              <Orb colors={pal} className="absolute left-4 top-2 h-40 w-40 animate-[float_6s_ease-in-out_infinite]" />
              <Orb colors={op.palette} className="absolute right-4 top-2 h-40 w-40 animate-[float_7s_ease-in-out_infinite_reverse]" />
            </div>
            <h2 className="h-display rise-in mb-3 text-[clamp(2.4rem,10vw,3.6rem)] leading-none">{me.name} <span className="text-aurora italic">&</span> {other.name}</h2>
            <p className="rise-in mb-2 text-sm text-gold" style={{ animationDelay: ".2s" }}>{SIGN_GLYPH[prof.sun]} {A.signs[prof.sun].name} · {SIGN_GLYPH[op.sun]} {A.signs[op.sun].name}</p>
            <p className="rise-in max-w-sm text-[17px] text-mist/90" style={{ animationDelay: ".3s" }}>{T.moonIn(A.signs[ms].name)}: {line}</p>
            <Link data-interactive href={h(`/person/?id=${other.id}`)} className="btn-ghost mt-5">{T.bondOpen} →</Link>
          </div>
        ),
        share: () => ({ ...base, palette: [pal[0], op.palette[0], pal[2], op.palette[2], pal[4]], eyebrow: `${T.bondLabel} · ${dateLine}`, title: `${me.name} & ${other.name}`, subtitle: `${A.signs[prof.sun].name} · ${A.signs[op.sun].name}`, lines: [`${T.moonIn(A.signs[ms].name)}: ${line}`] }),
      });
    } else out.push({
      id: "bond", label: T.rings.bond, sky: { intensity: 1 },
      render: () => (
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <p className="eyebrow mb-6">{T.bondLabel}</p>
          <div className="relative mb-6 h-40 w-64" aria-hidden><Orb colors={pal} className="absolute left-2 top-0 h-36 w-36" /><span className="absolute right-4 top-4 grid h-28 w-28 place-items-center rounded-full border-2 border-dashed border-white/30 text-4xl text-mist/60">+</span></div>
          <p className="mb-5 max-w-sm text-[17px] text-mist/90">{T.bondEmpty}</p>
          <Link data-interactive href={h("/people/")} className="btn-primary">{T.bondAdd}</Link>
        </div>
      ),
    });

    // 6 Journal prompt
    const prompt = D.prompts[g.promptIndex];
    out.push({
      id: "prompt", label: T.rings.prompt, duration: 9000, sky: { intensity: 0.95, palette: sky3(2, 4, 3) },
      render: ({ pause }) => <PromptSlide prompt={prompt} date={g.date} label={T.promptLabel} write={T.write} save={U.save} saved={U.saved} ph={U.ph} initial={text ?? s.journal[g.date]?.text ?? ""} onText={setText} pause={pause} />,
      share: () => ({ ...base, eyebrow: `${T.promptLabel} · ${dateLine}`, title: `“${prompt}”`, lines: [] }),
    });
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- rebuild when the day, people or language change
  }, [s?.me, s?.people, g?.date, locale]);

  if (!s?.me || !g || !slides.length) return null;
  const firstUnseen = Math.max(0, slides.findIndex((x) => !seen.includes(x.id)));
  const icon: Record<string, React.ReactNode> = {
    yourDay: <span className="font-display text-2xl italic text-gold">✦</span>,
    moon: <MoonArt angle={g.moon.angle} className="h-11 w-11" />,
    sky: <span className="text-2xl text-gold">{A.points[g.transits[0]?.transiting ?? "sun"].glyph}</span>,
    card: <Emblem id="tarot" className="h-9 w-9" />,
    number: <span className="font-kinetic text-2xl font-bold text-gold">{g.personalDay}</span>,
    bond: <Emblem id="bond" className="h-9 w-9" />,
    prompt: <span className="font-display text-3xl italic text-gold">?</span>,
  };
  return (
    <section aria-label={T.open} className="glass relative overflow-hidden rounded-[28px] p-4 sm:p-5" data-testid="today-stories">
      <div className="no-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
        {slides.map((x, k) => {
          const done = seen.includes(x.id);
          return (
            <button key={x.id} type="button" onClick={() => { haptic("tick"); setOpen(k); }} className="group flex w-[70px] shrink-0 flex-col items-center gap-1.5" data-testid={`ring-${x.id}`}>
              <span className={`grid h-[66px] w-[66px] place-items-center rounded-full p-[2.5px] transition active:scale-90 ${done ? "bg-white/20" : "bg-[conic-gradient(from_0deg,#5ee6d0,#8b6cf0,#ff8fc7,#ffc861,#5ee6d0)] animate-[spin_8s_linear_infinite]"}`}>
                <span className={`grid h-full w-full place-items-center rounded-full bg-[#15113a] ${done ? "" : "animate-[spin_8s_linear_infinite_reverse]"}`}>{icon[x.id]}</span>
              </span>
              <span className={`w-full truncate text-center text-[11.5px] ${done ? "text-dim" : "text-mist"}`}>{x.label}</span>
            </button>
          );
        })}
      </div>
      <button type="button" onClick={() => { haptic("tick"); setOpen(firstUnseen); }} className="btn-primary mt-3 min-h-[52px] w-full text-base" data-testid="stories-play">▶ {T.open}</button>
      {open != null && <StoryViewer slides={slides} start={open} onClose={() => setOpen(null)} onSeen={mark} t={{ ...T, saved: c.sky.share.saved }} />}
    </section>
  );
}

function PromptSlide({ prompt, date, label, write, save, saved, ph, initial, onText, pause }: { prompt: string; date: string; label: string; write: string; save: string; saved: string; ph: string; initial: string; onText: (t: string) => void; pause: (p: boolean) => void }) {
  const [open, setOpen] = useState(false); const [v, setV] = useState(initial); const [ok, setOk] = useState(false);
  return (
    <div className="flex flex-1 flex-col justify-center px-6">
      <p className="eyebrow mb-4">{label}</p>
      <h2 className="h-display slam mb-6 text-[clamp(2.3rem,10vw,3.8rem)] italic leading-[1.04]">“{prompt}”</h2>
      {open ? (
        <div data-interactive className="rise-in">
          <textarea autoFocus className="input h-32 !bg-white/10" placeholder={ph} value={v} onFocus={() => pause(true)} onChange={(e) => { setV(e.target.value); onText(e.target.value); setOk(false); }} />
          <div className="mt-2 flex items-center gap-3"><button type="button" className="btn-primary" onClick={() => { repo.saveJournal({ date, prompt, text: v }); setOk(true); haptic("success"); }}>{save}</button>{ok && <span className="text-xs text-dim">{saved}</span>}</div>
        </div>
      ) : <button type="button" data-interactive onClick={() => { setOpen(true); pause(true); }} className="btn-ghost self-start">✎ {write}</button>}
    </div>
  );
}
