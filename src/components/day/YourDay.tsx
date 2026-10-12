"use client";
/** "Your day": the daily story card plus the week ahead. Deterministic per person and date. */
import { useMemo, useState } from "react";
import type { Profile } from "@/engine/profile";
import { useContent, useDate } from "@/lib/content-context";
import { dayStory, weekAhead } from "@/story/day";
import { SIGN_GLYPH } from "@/engine/zodiac";
import { dayNames } from "./names";

export function StoryExtras({ motto, practice, question }: { motto: string; practice: string; question: string }) {
  const { c } = useContent(); const U = c.day.ui; const [copied, setCopied] = useState(false);
  const share = async () => {
    const text = `“${motto}”`;
    try { if (navigator.share) await navigator.share({ text, url: location.origin }); else { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); } } catch { /* user cancelled */ }
  };
  return (
    <div className="mt-5 grid gap-3">
      <div className="rounded-2xl border border-gold/30 bg-gold/10 p-4" data-testid="day-motto">
        <p className="eyebrow mb-1">✦ {U.motto}</p>
        <p className="h-display text-2xl leading-snug">“{motto}”</p>
        <button className="mt-2 text-xs text-gold underline" onClick={share}>{copied ? U.copied : U.share}</button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4" data-testid="day-practice"><p className="eyebrow mb-1">{U.practice}</p><p className="text-[15px] leading-relaxed">{practice}</p></div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4" data-testid="day-question"><p className="eyebrow mb-1">{U.question}</p><p className="text-[15px] italic leading-relaxed">{question}</p></div>
      </div>
    </div>
  );
}

export function YourDay({ profile, now }: { profile: Profile; now: Date }) {
  const { c } = useContent(); const U = c.day.ui; const fmt = useDate();
  const N = useMemo(() => dayNames(c), [c]);
  const s = useMemo(() => dayStory(profile, now, c.day, N), [profile, now, c, N]);
  const w = useMemo(() => weekAhead(profile, now), [profile, now]);
  const day = (i: number) => c.site.weekdays[w.days[i].d.getDay()];
  return (
    <>
      <article className="card" data-testid="your-day">
        <p className="eyebrow mb-1">✦ {U.eyebrow}</p>
        <h2 className="h-display mb-3 text-3xl">{U.title}</h2>
        <div className="space-y-3 text-[1.05rem] leading-relaxed text-mist/90">{s.paragraphs.map((p, i) => <p key={i}>{p}</p>)}</div>
        <StoryExtras motto={s.motto} practice={s.practice} question={s.question} />
        <details className="mt-4 text-xs text-dim"><summary className="cursor-pointer">{U.why}</summary><p className="mt-1">{U.whyText} {U.words(s.words)}.</p></details>
      </article>
      <section className="card" data-testid="week-ahead">
        <h2 className="h-display mb-1 text-3xl"><span className="text-gold">✦</span> {U.weekTitle}</h2>
        <p className="mb-3 text-sm text-dim">{w.thread ? U.weekIntro(c.astro.points[w.thread.planet].name, N.point(w.thread.point)) : U.weekQuiet}</p>
        <ul className="divide-y divide-white/10">
          {w.days.map((d, i) => (
            <li key={d.date} className="flex items-center gap-3 py-2.5">
              <span className="w-24 shrink-0 text-sm"><b className="block capitalize">{day(i)}</b><span className="text-xs text-dim">{fmt(d.date, { year: false })}</span></span>
              <span className="min-w-0 flex-1 text-sm">
                {d.top ? <>{c.astro.points[d.top.transiting].name} {c.astro.aspects[d.top.type].symbol} {N.point(d.top.natal)}</> : <span className="text-dim">{c.daily.moonPhases[d.phase].name}</span>}
                <span className="block text-xs text-dim">{c.daily.moonPhases[d.phase].icon} {c.astro.signs[d.moonSign].name} {SIGN_GLYPH[d.moonSign]} · {U.dayN(d.personalDay)}</span>
              </span>
              <span className={`chip shrink-0 !text-[11px] ${d.tone === "easy" ? "!border-sage/50 !text-sage" : d.tone === "demanding" ? "!border-rose/50 !text-rose" : ""}`}>{U[d.tone]}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm">{U.best(day(w.best))}{w.gentle >= 0 && <> {U.gentle(day(w.gentle))}</>}</p>
      </section>
    </>
  );
}
