"use client";
/** Public daily motivation for one Sun sign. Prerendered for the build date, then switched to the visitor's own today on load. */
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useContent, useDate, useHref } from "@/lib/content-context";
import { signDay } from "@/story/day";
import type { Sign } from "@/engine/zodiac";
import { SIGN_GLYPH } from "@/engine/zodiac";
import { MoonArt } from "../art/MoonArt";
import { StoryExtras } from "./YourDay";
import { dayNames } from "./names";

export function SignDaily({ sign, buildIso }: { sign: Sign; buildIso: string }) {
  const { c } = useContent(); const P = c.day.pub; const fmt = useDate(); const h = useHref();
  const [base, setBase] = useState(() => new Date(`${buildIso}T12:00:00`));
  const [off, setOff] = useState(0);
  useEffect(() => { const n = new Date(); n.setHours(12, 0, 0, 0); requestAnimationFrame(() => setBase(n)); }, []);
  const d = useMemo(() => { const x = new Date(base); x.setDate(x.getDate() + off); return x; }, [base, off]);
  const r = useMemo(() => signDay(sign, d, c.day, dayNames(c)), [sign, d, c]);
  const ph = c.daily.moonPhases[r.phase];
  return (
    <article className="card" data-testid="sign-daily">
      <div className="mb-3 flex items-center gap-4">
        <MoonArt angle={{ new: 0, "waxing-crescent": 45, "first-quarter": 90, "waxing-gibbous": 135, full: 180, "waning-gibbous": 225, "last-quarter": 270, "waning-crescent": 315 }[r.phase]} className="h-16 w-16 shrink-0" />
        <div>
          <p className="eyebrow">{fmt(r.date, { weekday: true })}</p>
          <p className="text-sm text-dim">{ph.name} · {c.astro.signs[r.moonSign].name} {SIGN_GLYPH[r.moonSign]}</p>
        </div>
      </div>
      <div className="mb-4 grid grid-cols-3 gap-2" role="tablist">
        {([-1, 0, 1] as const).map((o) => (
          <button key={o} role="tab" aria-selected={off === o} onClick={() => setOff(o)} className={`min-h-11 rounded-xl border text-sm ${off === o ? "border-gold bg-gold/15" : "border-white/12 bg-white/[0.04]"}`}>{o === -1 ? P.yesterday : o === 0 ? P.today : P.tomorrow}</button>
        ))}
      </div>
      <div className="space-y-3 text-[1.05rem] leading-relaxed text-mist/90">{r.paragraphs.map((p, i) => <p key={i}>{p}</p>)}</div>
      <StoryExtras motto={r.motto} practice={r.practice} question={r.question} />
      <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm">
        <p className="mb-3">{P.personal}</p>
        <Link className="btn-primary" href={h("/today/")}>{P.cta} →</Link>
      </div>
      <p className="mt-4 text-xs text-dim">{P.method}</p>
    </article>
  );
}
