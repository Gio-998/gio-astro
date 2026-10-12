"use client";
import { useMemo, useState } from "react";
import type { Profile } from "@/engine/profile";
import { dailyGuidance } from "@/engine/daily";
import { reduce } from "@/engine/numerology";
import { SIGN_GLYPH } from "@/engine/zodiac";
import { useContent, useDate } from "@/lib/content-context";
import { PremiumGate } from "./Gate";
import { useAccess } from "./access";
import { usePremiumText } from "./bits";

/** Week + month forecast for Today. Premium when locks are on; open to everyone during the beta. */
export function PremiumForecast({ profile }: { profile: Profile }) {
  const { c } = useContent(); const T = usePremiumText(); const F = T.forecast; const fmt = useDate(); const acc = useAccess();
  const [start] = useState(() => new Date());
  const key = JSON.stringify(profile.input);
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start); d.setDate(d.getDate() + i + 1); d.setHours(12, 0, 0, 0);
    return { d, g: dailyGuidance(profile, d, c.daily.prompts.length) };
  }), [key, start, c.daily.prompts.length]); // eslint-disable-line react-hooks/exhaustive-deps -- recompute only when the birth data changes
  const py = days[0].g.personalYear;
  const pm = reduce(py + reduce(start.getMonth() + 1), false);
  const A = c.astro; const D = c.daily;
  return (
    <section className="card" data-testid="premium-forecast">
      <p className="eyebrow mb-1">✦ {F.eyebrow}{!acc.locksOn && <span className="ml-2 normal-case tracking-normal text-sage">· {T.gate.openBeta}</span>}</p>
      <PremiumGate kind="day">
        <h2 className="h-display mb-3 text-3xl">{F.week}</h2>
        <ol className="space-y-2">
          {days.map(({ d, g }) => {
            const t = g.transits[0];
            return (
              <li key={g.date} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                <div className="flex items-baseline justify-between gap-2"><p className="font-semibold">{fmt(d, { weekday: true, year: false })}</p><span className="text-gold">{SIGN_GLYPH[g.moon.moonSign]}</span></div>
                <p className="text-xs text-dim">{F.dayLine(D.moonPhases[g.moon.phase].name, A.signs[g.moon.moonSign].name, g.personalDay)}</p>
                <p className="mt-1 text-sm">{D.personalDay[g.personalDay]}{t ? ` ${D.transitAdvice[t.type]}` : ""}</p>
              </li>
            );
          })}
        </ol>
        <div className="mt-5 rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/10 to-rose/10 p-4">
          <p className="eyebrow mb-1">{F.month}</p>
          <p className="h-display text-2xl">{F.monthTheme(pm, c.nums.numbers[pm].essence)}</p>
          <p className="mt-1 text-sm text-mist/90">{F.monthText}</p>
        </div>
      </PremiumGate>
    </section>
  );
}
