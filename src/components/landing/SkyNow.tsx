"use client";
import { useEffect, useState } from "react";
import { longitude, Planet } from "@/engine/astro";
import { moonPhase } from "@/engine/daily";
import { signFromLongitude, SIGN_GLYPH } from "@/engine/zodiac";
import { useContent, useHref } from "@/lib/content-context";
import { MoonArt } from "../art/MoonArt";
import Link from "next/link";

const SHOW: Planet[] = ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn"];

/** Live "the sky right now" widget, computed in the browser. */
export function SkyNow() {
  const { c } = useContent(); const h = useHref(); const A = c.astro;
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => { requestAnimationFrame(() => setNow(new Date())); const id = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(id); }, []);
  if (!now) return <div className="card h-[380px] animate-pulse" />;
  const m = moonPhase(now); const ph = c.daily.moonPhases[m.phase];
  return (
    <div className="grid gap-5 md:grid-cols-[1fr_1.2fr]">
      <div className="card flex flex-col items-center text-center">
        <p className="eyebrow mb-3">{now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</p>
        <MoonArt angle={m.angle} className="mb-3 h-40 w-40 animate-float" />
        <p className="h-display text-3xl">{ph.name} in {A.signs[m.moonSign].name} <span className="text-gold">{SIGN_GLYPH[m.moonSign]}︎</span></p>
        <p className="mb-2 text-sm text-dim">{m.illumination}% illuminated</p>
        <p className="text-mist/90">{ph.text}</p>
      </div>
      <div className="card">
        <p className="eyebrow mb-3">The sky right now</p>
        <ul className="divide-y divide-white/10">
          {SHOW.map((p) => { const lon = longitude(p, now); const s = signFromLongitude(lon); return (
            <li key={p} className="flex items-center justify-between py-2.5">
              <span className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-gold">{A.points[p].glyph}</span>{A.points[p].name}</span>
              <span className="text-mist/90">{SIGN_GLYPH[s]}︎ {A.signs[s].name} <span className="text-dim">{Math.floor(lon % 30)}°</span></span>
            </li>
          ); })}
        </ul>
        <p className="mt-3 text-xs text-dim">Calculated live in your browser from real planetary positions.</p>
        <Link href={h("/today/")} className="btn-ghost mt-4 w-full">See what today means for your chart →</Link>
      </div>
    </div>
  );
}
