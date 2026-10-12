"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MoonArt } from "../art/MoonArt";
import { Emblem } from "../art/Emblem";
import { cosmos } from "../art/ArtCard";
import { PageHero } from "../ui";
import { Reveal } from "../art/Reveal";
import { PremiumForecast } from "../premium/Forecast";
import { TodayStories } from "../today/TodayStories";
import { TodayGlance } from "../sky/TodayGlance";

/** Gentle on-device visit streak (never punishes a missed day — it just restarts quietly). */
function useStreak(today: string) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!today) return;
    try {
      const k = "mirrorstar-visits"; const days: string[] = JSON.parse(localStorage.getItem(k) || "[]");
      if (!days.includes(today)) days.push(today);
      const keep = days.sort().slice(-60); localStorage.setItem(k, JSON.stringify(keep));
      let streak = 0; const d = new Date(today + "T12:00:00");
      while (keep.includes(d.toISOString().slice(0, 10))) { streak++; d.setDate(d.getDate() - 1); }
      requestAnimationFrame(() => setN(streak));
    } catch { /* storage unavailable */ }
  }, [today]);
  return n;
}
import { useStore, repo } from "@/lib/store";
import { profileOf } from "@/lib/profile";
import { useContent, useHref, useDate } from "@/lib/content-context";
import { dailyGuidance } from "@/engine/daily";
import { MAJOR_ARCANA } from "@/engine/tarot";
import { SIGN_GLYPH } from "@/engine/zodiac";
import { YourDay } from "../day/YourDay";
import { YourDayVoice } from "../systems/YourDayVoice";

export function TodayPage() {
  const s = useStore(); const { c } = useContent(); const h = useHref(); const fmt = useDate();
  // The store is null during prerender/hydration, so a client-only date here can't cause a mismatch.
  const [now] = useState<Date | null>(() => (typeof window === "undefined" ? null : new Date()));
  const D = c.daily; const U = c.ui.today;
  const g = s?.me && now ? dailyGuidance(profileOf(s.me), now, D.prompts.length) : null;
  const localDate = now ? `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}` : "";
  const entry = s?.journal[localDate];
  const [text, setText] = useState<string | null>(null);
  const streak = useStreak(localDate);
  if (!s || !now) return <p className="text-dim">{c.site.common.loading}</p>;
  if (!s.me || !g) return <div className="card mx-auto max-w-lg text-center"><MoonArt angle={120} className="mx-auto mb-4 h-28 w-28 animate-float" /><p className="mb-3">{U.personal}</p><Link className="btn-primary" href={h("/start/")}>{c.site.common.start}</Link></div>;
  const card = c.nums.tarot[MAJOR_ARCANA[g.cardOfDay]];
  const moon = D.moonPhases[g.moon.phase];
  const prompt = D.prompts[g.promptIndex];
  const A = c.astro;
  return (
    <div className="space-y-4">
      <PageHero eyebrow={fmt(now, { weekday: true, year: false })} img="cliffs" title={<>{U.titleA}<span className="italic text-aurora">{s.me.name}</span></>}
        sub={U.sub} art={<MoonArt angle={g.moon.angle} className="h-36 w-36 animate-float" />}>
        {streak > 0 && <span className="chip !border-gold/40 !text-gold">{U.streak(streak)}</span>}
      </PageHero>
      <TodayStories />
      <TodayGlance g={g} />
      <YourDay profile={profileOf(s.me)} now={now} />
      <YourDayVoice person={s.me} now={now} personalDay={g.personalDay} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Reveal><div className="card h-full text-center">
          <MoonArt angle={g.moon.angle} className="mx-auto mb-2 h-28 w-28" />
          <p className="h-display text-2xl">{U.moonIn(moon.name, A.signs[g.moon.moonSign].name)} {SIGN_GLYPH[g.moon.moonSign]}</p>
          <p className="text-sm text-dim">{U.lit(g.moon.illumination)}</p>
          <p className="mt-2 text-sm">{moon.text}{U.moonColours(A.signs[g.moon.moonSign].name, A.signs[g.moon.moonSign].gifts)}</p>
        </div></Reveal>
        <Reveal delay={0.08}><div className="card flex h-full gap-4">
          <div className="relative h-44 w-28 shrink-0 overflow-hidden rounded-2xl border border-gold/50 shadow-[0_20px_40px_-15px_rgba(246,207,122,.5)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cosmos("helix")} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
            <div className="absolute inset-1.5 rounded-xl border border-gold/40" />
            <Emblem id="sun" className="absolute left-1/2 top-5 h-12 w-12 -translate-x-1/2 glow-gold" />
            <p className="absolute inset-x-1 bottom-2 text-center font-display text-sm leading-tight text-gold">{card.name}</p>
          </div>
          <div>
          <p className="eyebrow mb-1">{U.cardOfDay}</p>
          <p className="h-display text-2xl">{card.name}</p>
          <p className="text-sm text-dim">{card.keyword}</p>
          <p className="mt-2 text-sm">{U.cardToday(card.birth)}</p>
          </div>
        </div></Reveal>
      </div>
      <div className="card">
        <h2 className="h-display mb-3 text-3xl"><span className="text-gold">✦</span>{U.skyToday}</h2>
        {g.transits.length === 0 && <p className="text-sm">{U.quiet}</p>}
        {g.transits.map((t, i) => (
          <p key={i} className="mb-2 text-sm"><b>{U.transit(A.points[t.transiting].name, D.transitTone[t.type], A.points[t.natal].name)}</b> <span className="text-dim">({A.aspects[t.type].symbol} {t.orb.toFixed(1)}°)</span>: {U.meets(D.transitMood[t.transiting], A.points[t.natal].governs)} {D.transitAdvice[t.type]}</p>
        ))}
        <p className="mt-2 text-xs text-dim">{U.computed}</p>
      </div>
      <div className="card">
        <div className="flex items-center gap-4"><span className="grid h-16 w-16 shrink-0 place-items-center rounded-full border border-gold/50 bg-gradient-to-br from-indigo to-ink font-display text-3xl text-gold shadow-[0_0_24px_-4px_rgba(246,207,122,.5)]">{g.personalDay}</span><div>
        <p className="h-display text-2xl">{U.personalDay(g.personalDay)}</p>
        <p className="text-sm">{D.personalDay[g.personalDay]}{U.personalYear(g.personalYear, c.nums.numbers[g.personalYear].essence)}</p></div></div>
      </div>
      <div className="card">
        <h2 className="h-display mb-2 text-3xl"><span className="text-gold">✦</span>{U.journal}</h2>
        <p className="h-display mb-3 text-2xl italic text-mist/90">“{prompt}”</p>
        <textarea className="input h-32" placeholder={U.ph} value={text ?? entry?.text ?? ""} onChange={(e) => setText(e.target.value)} />
        <div className="mt-2 flex items-center gap-3"><button className="btn-primary" onClick={() => { repo.saveJournal({ date: localDate, prompt, text: text ?? "" }); }}>{U.save}</button>{entry && <span className="text-xs text-dim">{U.saved}</span>}</div>
        {Object.keys(s.journal).length > 1 && (
          <details className="mt-4 text-sm"><summary className="cursor-pointer text-dim">{U.past(Object.keys(s.journal).length - (entry ? 1 : 0))}</summary>
            {Object.values(s.journal).filter((e) => e.date !== localDate).sort((a, b) => b.date.localeCompare(a.date)).map((e) => <div key={e.date} className="mt-2 rounded-lg bg-white/5 p-2"><p className="text-xs text-dim">{fmt(e.date)} · {e.prompt}</p><p>{e.text}</p></div>)}
          </details>
        )}
      </div>
      <PremiumForecast profile={profileOf(s.me)} />
    </div>
  );
}
