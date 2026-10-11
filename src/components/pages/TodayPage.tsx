"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useStore, repo } from "@/lib/store";
import { profileOf } from "@/lib/profile";
import { useContent, useHref } from "@/lib/content-context";
import { dailyGuidance } from "@/engine/daily";
import { MAJOR_ARCANA } from "@/engine/tarot";
import { SIGN_GLYPH } from "@/engine/zodiac";

export function TodayPage() {
  const s = useStore(); const { c } = useContent(); const h = useHref();
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);
  const D = c.daily;
  const g = useMemo(() => (s?.me && now ? dailyGuidance(profileOf(s.me), now, D.prompts.length) : null), [s?.me, now, D.prompts.length]);
  const localDate = now ? `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}` : "";
  const entry = s?.journal[localDate];
  const [text, setText] = useState<string | null>(null);
  if (!s || !now) return <p className="text-dim">{c.site.common.loading}</p>;
  if (!s.me || !g) return <div className="card text-center"><p className="mb-3">Daily guidance is personal — add your birth date first.</p><Link className="btn-primary" href={h("/start/")}>{c.site.common.start}</Link></div>;
  const card = c.nums.tarot[MAJOR_ARCANA[g.cardOfDay]];
  const moon = D.moonPhases[g.moon.phase];
  const prompt = D.prompts[g.promptIndex];
  const A = c.astro;
  return (
    <div className="space-y-4">
      <div><p className="text-xs uppercase tracking-widest text-dim">{now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</p><h1 className="h-display text-4xl text-gold">Today for {s.me.name}</h1></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card">
          <p className="text-4xl">{moon.icon}</p>
          <p className="h-display text-2xl">{moon.name} in {A.signs[g.moon.moonSign].name} {SIGN_GLYPH[g.moon.moonSign]}</p>
          <p className="text-sm text-dim">{g.moon.illumination}% lit</p>
          <p className="mt-2 text-sm">{moon.text} The Moon in {A.signs[g.moon.moonSign].name} colours the day with {A.signs[g.moon.moonSign].gifts}.</p>
        </div>
        <div className="card">
          <p className="text-4xl">🂠</p>
          <p className="h-display text-2xl">Card of the day: {card.name}</p>
          <p className="text-sm text-dim">{card.keyword}</p>
          <p className="mt-2 text-sm">{card.birth.replace(/^You /, "Today, you can ").replace(/^Your /, "Today your ")}</p>
        </div>
      </div>
      <div className="card">
        <h2 className="h-display mb-2 text-2xl text-gold">Your sky today</h2>
        {g.transits.length === 0 && <p className="text-sm">A quiet sky for your chart today — a good day to simply live it.</p>}
        {g.transits.map((t, i) => (
          <p key={i} className="mb-2 text-sm"><b>{A.points[t.transiting].name} {D.transitTone[t.type]} your {A.points[t.natal].name}</b> <span className="text-dim">({A.aspects[t.type].symbol} {t.orb.toFixed(1)}°)</span> — {D.transitMood[t.transiting]} meets {A.points[t.natal].governs}. {D.transitAdvice[t.type]}</p>
        ))}
        <p className="mt-2 text-xs text-dim">Computed live from today's real planetary positions against your birth chart.</p>
      </div>
      <div className="card">
        <p className="h-display text-2xl">Personal day {g.personalDay}</p>
        <p className="text-sm">{D.personalDay[g.personalDay]} You're in personal year {g.personalYear}: {c.nums.numbers[g.personalYear].essence}.</p>
      </div>
      <div className="card">
        <h2 className="h-display mb-2 text-2xl text-gold">Journal</h2>
        <p className="mb-2 italic">“{prompt}”</p>
        <textarea className="input h-32" placeholder="A few honest lines…" value={text ?? entry?.text ?? ""} onChange={(e) => setText(e.target.value)} />
        <div className="mt-2 flex items-center gap-3"><button className="btn-primary" onClick={() => { repo.saveJournal({ date: localDate, prompt, text: text ?? "" }); }}>Save</button>{entry && <span className="text-xs text-dim">Saved on this device.</span>}</div>
        {Object.keys(s.journal).length > 1 && (
          <details className="mt-4 text-sm"><summary className="cursor-pointer text-dim">Past entries ({Object.keys(s.journal).length - (entry ? 1 : 0)})</summary>
            {Object.values(s.journal).filter((e) => e.date !== localDate).sort((a, b) => b.date.localeCompare(a.date)).map((e) => <div key={e.date} className="mt-2 rounded-lg bg-white/5 p-2"><p className="text-xs text-dim">{e.date} · {e.prompt}</p><p>{e.text}</p></div>)}
          </details>
        )}
      </div>
    </div>
  );
}
