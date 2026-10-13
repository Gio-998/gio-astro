"use client";
import Link from "next/link";
import { RetroMark } from "../RetroMark";
import { useEffect, useMemo, useState } from "react";
import type { Profile } from "@/engine/profile";
import type { StoredPerson } from "@/lib/store";
import { moonPhase } from "@/engine/daily";
import { longitude, type Planet } from "@/engine/astro";
import { SIGN_GLYPH } from "@/engine/zodiac";
import { quizDefs, QUIZ_IDS } from "@/lib/quiz-defs";
import { useContent, useHref, useDate } from "@/lib/content-context";
import { MoonArt } from "../art/MoonArt";
import { haptic } from "@/lib/haptics";

const SLOW: Planet[] = ["mercury", "venus", "mars", "jupiter", "saturn"];
const hues = ["#6d4bd8", "#c0487d", "#2f7d8c", "#b8862f", "#5a3fa8", "#8a3b6e"];

function daysToBirthday(date: string, now: Date) {
  const [, m, d] = date.split("-").map(Number); const y = now.getFullYear();
  const today = new Date(y, now.getMonth(), now.getDate()); let next = new Date(y, m - 1, d);
  if (next < today) next = new Date(y + 1, m - 1, d);
  return Math.round((next.getTime() - today.getTime()) / 864e5);
}

/** Full-screen vertical feed (TikTok grammar): native scroll snap, one card per screen, no JS physics. */
export function TodayFeed({ profile, people, now }: { profile: Profile; people: StoredPerson[]; now: Date }) {
  const { c } = useContent(); const h = useHref(); const fmt = useDate(); const F = c.sky.feed; const A = c.astro; const defs = quizDefs(c);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return; const o = document.body.style.overflow; document.body.style.overflow = "hidden";
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false); window.addEventListener("keydown", k);
    return () => { document.body.style.overflow = o; window.removeEventListener("keydown", k); };
  }, [open]);
  const cards = useMemo(() => {
    const out: { key: string; eyebrow: string; body: React.ReactNode; href?: string }[] = [];
    const week = Array.from({ length: 7 }, (_, i) => { const d = new Date(now.getTime() + i * 864e5); return { d, m: moonPhase(new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12)) }; });
    out.push({ key: "week", eyebrow: F.week, body: (
      <ul className="space-y-2">{week.map(({ d, m }) => (
        <li key={d.toISOString()} className="flex items-center gap-3 rounded-2xl bg-white/[0.06] px-3 py-2">
          <MoonArt angle={m.angle} className="h-8 w-8 shrink-0" />
          <span className="min-w-0 flex-1 truncate text-[15px]">{fmt(d, { weekday: true, year: false })}</span>
          <span className="shrink-0 text-[14px] text-gold">{SIGN_GLYPH[m.moonSign]} {A.signs[m.moonSign].name}</span>
        </li>))}</ul>) });
    const retro = SLOW.filter((p) => { let dd = longitude(p, new Date(now.getTime() + 864e5)) - longitude(p, now); if (dd > 180) dd -= 360; if (dd < -180) dd += 360; return dd < 0; });
    out.push({ key: "retro", eyebrow: F.retro, body: retro.length ? <div className="space-y-3">{retro.map((p) => <p key={p} className="text-[19px] leading-snug text-pretty"><RetroMark className="!ml-0 mr-2 align-[3px]" />{F.retroLine(A.points[p].name)}</p>)}</div> : <p className="text-[22px] leading-snug text-pretty">{F.noRetro}</p> });
    const q = QUIZ_IDS.find((id) => !profile.quiz[defs[id].resultKey as keyof typeof profile.quiz]);
    if (q) out.push({ key: "quiz", eyebrow: F.quiz, body: <><p className="h-display text-[34px] leading-tight text-balance">{defs[q].title}</p><p className="mt-3 text-[17px] text-mist/85 text-pretty">{defs[q].tagline}</p><p className="mt-2 text-sm text-dim">{F.quizLine(defs[q].title, defs[q].minutes)}</p></>, href: h(`/quiz/${q}/`) });
    const bd = people.map((p) => ({ p, d: daysToBirthday(p.date, now) })).filter((x) => x.d <= 14).sort((a, b) => a.d - b.d)[0];
    if (bd) out.push({ key: "bday", eyebrow: F.birthday, body: <p className="h-display text-[32px] leading-tight text-balance">🎂 {F.birthdayLine(bd.p.name, bd.d)}</p>, href: h(`/person/?id=${bd.p.id}`) });
    out.push({ key: "sign", eyebrow: F.sign, body: <><p className="text-6xl text-gold">{SIGN_GLYPH[profile.sun]}</p><p className="h-display mt-2 text-[34px] text-balance">{A.signs[profile.sun].name}</p></>, href: h(`/daily/${profile.sun}/`) });
    return out;
  }, [now, profile, people, F, A, defs, h, fmt]);
  return (
    <>
      <button className="btn-ghost min-h-[52px] w-full print:hidden" onClick={() => { haptic("tick"); setOpen(true); }} data-testid="feed-open">▶ {F.open}</button>
      {open && (
        <div role="dialog" aria-modal="true" aria-label={F.open} className="fixed inset-0 z-[80] bg-[#0b0920]" data-testid="today-feed">
          <button className="absolute right-3 top-[max(12px,env(safe-area-inset-top))] z-10 grid h-11 w-11 place-items-center rounded-full bg-black/40 text-xl backdrop-blur" aria-label={F.close} onClick={() => setOpen(false)}>✕</button>
          <div className="h-[100svh] snap-y snap-mandatory overflow-y-auto overscroll-contain">
            {cards.map((x, i) => (
              <section key={x.key} className="relative flex h-[100svh] snap-start flex-col justify-center overflow-hidden px-6 pb-16 pt-16"
                style={{ background: `radial-gradient(120% 70% at ${20 + i * 15}% ${10 + (i % 3) * 30}%, ${hues[i % hues.length]}88, transparent 65%), linear-gradient(180deg,#120f2e,#0b0920)` }}>
                <p className="eyebrow mb-3">{x.eyebrow}</p>
                <div>{x.body}</div>
                {x.href && <Link href={x.href} onClick={() => setOpen(false)} className="btn-primary mt-6 min-h-[52px] self-start px-8">{F.go} →</Link>}
                {i < cards.length - 1 && <p className="absolute inset-x-0 bottom-6 animate-pulse text-center text-xs text-dim">↑ {F.hint}</p>}
              </section>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
