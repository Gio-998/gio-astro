"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { StoredPerson } from "@/lib/store";
import type { Profile } from "@/engine/profile";
import { useContent, useHref } from "@/lib/content-context";
import { SIGN_GLYPH } from "@/engine/zodiac";
import { ANIMAL_GLYPH } from "@/engine/chinese";
import { quizDefs, QUIZ_IDS } from "@/lib/quiz-defs";
import { haptic } from "@/lib/haptics";
import { SignArt } from "../art/SignArt";

export type MeView = "path" | "classic";
const KEY = "horoscop-me-view";

/** Journey is the default; the choice is remembered on this device. */
export function useMeView(): [MeView, (v: MeView) => void] {
  const [v, setV] = useState<MeView>("path");
  useEffect(() => { try { const s = localStorage.getItem(KEY); if (s === "classic") requestAnimationFrame(() => setV("classic")); } catch { /* ignore */ } }, []);
  return [v, (n) => { haptic("tick"); setV(n); try { localStorage.setItem(KEY, n); } catch { /* ignore */ } }];
}

export function ViewToggle({ value, onChange }: { value: MeView; onChange: (v: MeView) => void }) {
  const { c } = useContent(); const J = c.sky.journey;
  return (
    <div role="radiogroup" aria-label={J.toggle} className="inline-flex rounded-full border border-white/15 bg-white/[0.06] p-1 backdrop-blur-md print:hidden" data-testid="me-view-toggle">
      {(["path", "classic"] as const).map((k) => (
        <button key={k} role="radio" aria-checked={value === k} onClick={() => onChange(k)}
          className={`min-h-[40px] rounded-full px-4 text-sm transition ${value === k ? "bg-gold text-ink shadow-[0_0_20px_-4px_rgba(255,200,97,.7)]" : "text-mist/80"}`}>
          {k === "path" ? J.playful : J.classic}
        </button>
      ))}
    </div>
  );
}

type Stop = { key: string; title: string; hint: string; href: string; done: boolean; glyph: string; cta: string };

export function MeJourney({ person, profile, onClassic }: { person: StoredPerson; profile: Profile; onClassic: () => void }) {
  const { c } = useContent(); const h = useHref(); const J = c.sky.journey; const A = c.astro; const defs = quizDefs(c);
  const ch = profile.chinese;
  const big3 = [
    { k: J.sun, sign: profile.sun },
    { k: J.moon, sign: profile.moon },
    { k: J.rising, sign: profile.rising },
  ];
  const base: Stop[] = [
    { key: "chart", title: J.stops.chart, hint: J.hints.chart, href: h("/chart/"), done: true, glyph: "☉", cta: J.open },
    { key: "chinese", title: J.stops.chinese, hint: `${c.chinese.wuxing[ch.element].name} ${c.chinese.animals[ch.animal].name}`, href: h("/lens/?k=chinese"), done: true, glyph: ANIMAL_GLYPH[ch.animal], cta: J.open },
    { key: "numbers", title: J.stops.numbers, hint: `${J.hints.numbers} · ${profile.numbers.lifePath}`, href: h("/lens/?k=lifepath"), done: true, glyph: String(profile.numbers.lifePath), cta: J.open },
  ];
  const quizzes: Stop[] = QUIZ_IDS.map((id) => {
    const d = defs[id]; const done = !!profile.quiz[d.resultKey as keyof typeof profile.quiz];
    return { key: id, title: d.title, hint: d.tagline, href: h(`/quiz/${id}/`), done, glyph: done ? "✦" : "?", cta: done ? J.open : J.take(d.minutes) };
  });
  const stops = [...base, ...quizzes, { key: "book", title: J.stops.book, hint: J.hints.book, href: h("/book/"), done: quizzes.every((q) => q.done), glyph: "❦", cta: J.open }];
  const doneN = stops.filter((s) => s.done).length;
  const nextIdx = stops.findIndex((s) => !s.done);
  return (
    <div data-testid="me-path-view">
      {/* aura hero */}
      <section className="relative overflow-hidden rounded-[32px] border border-white/15 px-5 pb-6 pt-7 shadow-[0_40px_90px_-40px_rgba(139,108,240,.9)]"
        style={{ background: `radial-gradient(120% 90% at 80% 0%, ${profile.palette[0]}66, transparent 60%), radial-gradient(90% 80% at 0% 100%, ${profile.palette[4]}55, transparent 65%), linear-gradient(160deg,#1a1442,#0e0b26)` }}>
        <SignArt sign={profile.sun} className="pointer-events-none absolute -right-8 -top-4 h-48 w-48 opacity-60 animate-float" />
        <p className="eyebrow mb-1">{J.eyebrow}</p>
        <h1 className="h-display text-[clamp(2.4rem,11vw,3.6rem)] leading-none text-balance"><span className="text-aurora">{person.name}</span></h1>
        <div className="mt-5" aria-label={J.progress(doneN, stops.length)}>
          <div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-violet via-rose to-gold transition-[width] duration-700" style={{ width: `${(doneN / stops.length) * 100}%` }} /></div>
          <p className="mt-2 text-[13px] text-mist/85">{J.progress(doneN, stops.length)}</p>
        </div>
      </section>

      {/* Big 3, swipeable */}
      <h2 className="h-display mb-2 mt-6 text-2xl text-balance">{J.big3}</h2>
      <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none]" data-testid="big3">
        {big3.map((b) => (
          <Link key={b.k} href={h(`/lens/?k=${b.k === J.sun ? "sun" : b.k === J.moon ? "moon" : "rising"}`)}
            className="holo-card relative flex h-44 w-[68%] shrink-0 snap-center flex-col justify-end overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-b from-indigo/60 to-ink p-4 sm:w-56">
            {b.sign ? <SignArt sign={b.sign} className="absolute -right-4 -top-3 h-32 w-32 opacity-80" showGlyph={false} /> : null}
            <p className="eyebrow !text-[11px]">{b.k}</p>
            <p className="h-display text-2xl leading-tight">{b.sign ? <>{SIGN_GLYPH[b.sign]} {A.signs[b.sign].name}</> : <span className="text-base text-dim">{J.noRising}</span>}</p>
          </Link>
        ))}
      </div>

      {/* the winding path */}
      <ol className="relative mt-6 space-y-3 pl-10" data-testid="me-path">
        <span aria-hidden className="absolute bottom-6 left-[19px] top-6 w-px bg-gradient-to-b from-gold/70 via-violet/50 to-white/10" />
        {stops.map((s, i) => {
          const isNext = i === nextIdx;
          return (
            <li key={s.key} className="relative">
              <span aria-hidden className={`absolute -left-10 top-3 grid h-10 w-10 place-items-center rounded-full border font-display text-lg ${s.done ? "border-gold/70 bg-gold/15 text-gold shadow-[0_0_18px_-2px_rgba(255,200,97,.6)]" : isNext ? "animate-pulse border-rose/70 bg-rose/15 text-rose" : "border-white/20 bg-white/5 text-dim"}`}>{s.glyph}</span>
              <Link href={s.href} onClick={() => haptic("tick")} className={`card flex min-h-[64px] items-center justify-between gap-3 !py-3 transition active:scale-[.98] ${isNext ? "!border-rose/50 shadow-[0_0_40px_-18px_rgba(255,120,170,.9)]" : ""}`}>
                <span className="min-w-0">
                  {isNext && <span className="eyebrow mb-0.5 block !text-[10px] !text-rose">{J.next}</span>}
                  <span className="block font-semibold text-balance">{s.title}</span>
                  <span className="block truncate text-[13px] text-dim">{s.hint}</span>
                </span>
                <span className={`shrink-0 whitespace-nowrap text-[13px] ${s.done ? "text-gold" : "text-mist"}`}>{s.done && s.key !== "book" && !base.includes(s) ? J.done : s.cta} →</span>
              </Link>
            </li>
          );
        })}
      </ol>
      {nextIdx === -1 && <p className="mt-4 text-center text-sm text-gold text-balance">{J.finish}</p>}
      <div className="mt-6 text-center"><button onClick={onClassic} className="min-h-[44px] text-sm text-dim underline underline-offset-4">{J.full}</button></div>
    </div>
  );
}

/** Bonds: saved people as stars around you; orbit radius follows the overall resonance. */
export function BondsConstellation({ items }: { items: { id: string; name: string; score: number; color: string }[] }) {
  const { c } = useContent(); const h = useHref(); const B = c.sky.bonds;
  if (items.length === 0) return null;
  const W = 340, cx = W / 2, cy = W / 2;
  return (
    <section className="card mb-4 overflow-hidden" data-testid="bonds-map">
      <h2 className="h-display text-2xl text-balance">{B.map}</h2>
      <p className="mb-2 text-[13px] text-dim text-pretty">{B.mapSub}</p>
      <svg viewBox={`0 0 ${W} ${W}`} className="mx-auto block w-full max-w-[360px]" role="img" aria-label={B.map}>
        <defs><radialGradient id="bc-you"><stop offset="0" stopColor="#ffd77a" /><stop offset="1" stopColor="#ffd77a" stopOpacity="0" /></radialGradient></defs>
        {[60, 105, 150].map((r) => <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,.09)" strokeDasharray="2 6" />)}
        <circle cx={cx} cy={cy} r={34} fill="url(#bc-you)" className="animate-pulse" />
        <circle cx={cx} cy={cy} r={9} fill="#ffd77a" />
        <text x={cx} y={cy + 28} textAnchor="middle" fontSize="12" fill="#f3eefe">{B.you}</text>
        {items.map((p, i) => {
          const r = 55 + (1 - Math.min(1, Math.max(0, p.score / 100))) * 100;
          const a = (i / items.length) * Math.PI * 2 - Math.PI / 2 + 0.4;
          const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
          return (
            <Link key={p.id} href={h(`/match/?b=${p.id}`)} onClick={() => haptic("soft")}>
              <line x1={cx} y1={cy} x2={x} y2={y} stroke={p.color} strokeOpacity=".35" />
              <circle cx={x} cy={y} r={16} fill={p.color} fillOpacity=".25" />
              <circle cx={x} cy={y} r={7} fill={p.color} />
              <text x={x} y={y + 26} textAnchor="middle" fontSize="12" fill="#f3eefe">{p.name.length > 12 ? p.name.slice(0, 11) + "…" : p.name}</text>
              <text x={x} y={y - 14} textAnchor="middle" fontSize="10" fill="#ffd77a">{Math.round(p.score)}</text>
            </Link>
          );
        })}
      </svg>
    </section>
  );
}
