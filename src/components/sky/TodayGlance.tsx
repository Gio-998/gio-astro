"use client";
import type { Daily } from "@/engine/daily";
import { useContent } from "@/lib/content-context";
import { SIGN_GLYPH } from "@/engine/zodiac";
import { MAJOR_ARCANA } from "@/engine/tarot";
import { MoonArt } from "../art/MoonArt";

/** Four live tiles you can read in two seconds, plus one nudge for the day. Phone first: 2x2 grid. */
export function TodayGlance({ g }: { g: Daily }) {
  const { c } = useContent(); const G = c.sky.glance; const A = c.astro; const D = c.daily;
  const t = g.transits[0];
  const tiles = [
    { k: G.moon, v: <><MoonArt angle={g.moon.angle} className="mr-1.5 inline-block h-6 w-6 align-[-6px]" />{A.signs[g.moon.moonSign].name} {SIGN_GLYPH[g.moon.moonSign]}</>, s: `${D.moonPhases[g.moon.phase].name} · ${g.moon.illumination}%` },
    { k: G.number, v: <span className="font-display text-3xl text-gold">{g.personalDay}</span>, s: c.nums.numbers[g.personalDay]?.essence ?? "" },
    { k: G.card, v: c.nums.tarot[MAJOR_ARCANA[g.cardOfDay]].name, s: c.nums.tarot[MAJOR_ARCANA[g.cardOfDay]].keyword },
    { k: G.sky, v: t ? <>{A.points[t.transiting].name} {A.aspects[t.type].symbol} {A.points[t.natal].name}</> : G.quiet, s: t ? `${t.orb.toFixed(1)}°` : "" },
  ];
  const nudge = G.nudge(g.personalDay);
  return (
    <section aria-label={G.title} data-testid="today-glance">
      <div className="grid grid-cols-2 gap-2.5">
        {tiles.map((x) => (
          <div key={x.k} className="rounded-2xl border border-white/12 bg-white/[0.06] p-3 backdrop-blur-md">
            <p className="eyebrow !text-[10px]">{x.k}</p>
            <p className="mt-1 text-[15px] font-semibold leading-tight text-balance">{x.v}</p>
            {x.s && <p className="mt-0.5 truncate text-[12px] text-dim">{x.s}</p>}
          </div>
        ))}
      </div>
      {nudge && <p className="mt-2.5 rounded-2xl border border-gold/30 bg-gold/[0.07] px-4 py-3 text-[15px] text-pretty"><span className="eyebrow mr-2 !text-[10px]">{G.nudgeLabel}</span>{nudge}</p>}
    </section>
  );
}
