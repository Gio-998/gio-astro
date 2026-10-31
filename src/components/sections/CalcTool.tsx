"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BirthForm } from "@/components/BirthForm";
import { ChartWheel } from "@/components/ChartWheel";
import { RetroMark } from "@/components/RetroMark";
import { CALC_UI, type CalcUi } from "@/content/calculators/ui";
import type { CalcKey } from "@/content/calculators/types";
import { computeChart, type Chart, type Point } from "@/engine/astro";
import { dayChange, moonOfBirth, risingOfBirth, withDeviceZone, type DayChange, type MoonResult, type RisingResult } from "@/engine/calculators";
import type { ResolvedTime } from "@/engine/time";
import { formatDegree, SIGN_GLYPH, type Sign } from "@/engine/zodiac";
import { useContent, useHref } from "@/lib/content-context";
import type { StoredPerson } from "@/lib/store";

type Result =
  | { kind: "rising-sign"; rising: RisingResult }
  | { kind: "moon-sign"; moon: MoonResult; timeKnown: boolean; zone: string | null }
  | { kind: "birth-chart"; chart: Chart; moon: DayChange | null; sun: DayChange | null; zone: string | null };

const ORDER: Point[] = ["sun", "moon", "asc", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto", "node", "mc"];
const note = "rounded-xl border border-gold/30 bg-gold/10 p-3 text-sm";

function calculate(kind: CalcKey, p: StoredPerson): Result {
  const input = { date: p.date, time: p.time, place: p.place, utcOffsetOverride: p.utcOffsetOverride };
  if (kind === "rising-sign") return { kind, rising: risingOfBirth({ ...input, place: p.place! }) };
  // With no place and no manual offset, the day runs in the visitor's own time zone, and the result says so.
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || null;
  const zoned = withDeviceZone(input, tz); const zone = zoned === input ? null : tz;
  if (kind === "moon-sign") return { kind, moon: moonOfBirth(zoned), timeKnown: !!p.time, zone };
  const unknown = !p.time;
  return { kind, chart: computeChart(zoned), moon: unknown ? dayChange("moon", zoned) : null, sun: unknown ? dayChange("sun", zoned) : null, zone };
}

export function CalcTool({ kind, lang }: { kind: CalcKey; lang: string }) {
  const U = CALC_UI[lang] ?? CALC_UI.en;
  const [res, setRes] = useState<Result | null>(null);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => { if (res) box.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, [res]);
  const check = kind === "rising-sign" ? (p: StoredPerson) => (!p.time ? U.errTime : !p.place ? U.errPlace : null) : undefined;
  return (
    <section className="mx-auto max-w-2xl rounded-2xl border border-gold/25 bg-[linear-gradient(150deg,rgba(233,199,138,.10),rgba(139,108,240,.10))] p-4 lg:rounded-3xl lg:p-6" data-testid={`calc-${kind}`}>
      <BirthForm anonymous timeRequired={kind === "rising-sign"} submitLabel={U.go[kind]} check={check} onSubmit={(p) => setRes(calculate(kind, p))} />
      <p className="mt-3 text-xs text-dim">{U.privacy}</p>
      {res && (
        <div ref={box} className="mt-6 scroll-mt-20 space-y-4 border-t border-white/10 pt-6" aria-live="polite" data-testid="calc-result">
          {res.kind === "rising-sign" && <RisingView r={res.rising} U={U} />}
          {res.kind === "moon-sign" && <MoonView res={res} U={U} />}
          {res.kind === "birth-chart" && <ChartView res={res} U={U} />}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="font-medium">{U.startTitle}</p>
            <p className="mb-3 mt-1 text-sm text-mist/80">{U.startText}</p>
            <StartLink U={U} />
          </div>
        </div>
      )}
    </section>
  );
}

function StartLink({ U }: { U: CalcUi }) {
  const h = useHref();
  return <Link className="btn-primary inline-block" href={h("/start/")} prefetch={false}>{U.startCta}</Link>;
}

/** One sign in the result: what it is, the reading for this placement, and the way to its own page. */
function SignCard({ label, sign, lon, text, U }: { label: string; sign: Sign; lon?: number; text: string; U: CalcUi }) {
  const { c } = useContent(); const h = useHref(); const name = c.astro.signs[sign].name;
  return (
    <div className="rounded-2xl border border-gold/25 bg-gold/[0.06] p-4">
      <p className="eyebrow text-[11px] tracking-[.14em]">{label}</p>
      <p className="h-display mt-1 text-3xl"><span aria-hidden className="mr-2 text-gold">{SIGN_GLYPH[sign]}</span>{name}{lon != null && <span className="ml-2 text-lg text-mist/70">{formatDegree(lon)}</span>}</p>
      <p className="mt-2 text-sm leading-snug text-mist/90">{text}</p>
      <Link className="mt-2 inline-block text-sm text-gold underline-offset-4 hover:underline" href={h(`/zodiac/${sign}/`)} prefetch={false}>{U.moreAbout(name)} →</Link>
    </div>
  );
}

/** Clock notes that apply to every tool: a time that fell in a clock change, and the zone used when no place was given. */
function TimeNotes({ time, zone, U }: { time: ResolvedTime; zone?: string | null; U: CalcUi }) {
  const { c } = useContent();
  return <>
    {time.tzNote && <p className={note} data-testid="tz-note">{time.tzNote === "gap" ? c.accuracy.tzGap : c.accuracy.tzAmbiguous}</p>}
    {zone && <p className="text-xs text-dim">{U.zone(zone)}</p>}
  </>;
}

function RisingView({ r, U }: { r: RisingResult; U: CalcUi }) {
  const { c } = useContent(); const A = c.astro;
  return <>
    <SignCard label={U.rising} sign={r.sign} lon={r.lon} text={A.signs[r.sign].rising} U={U} />
    {r.from && r.to && <p className="text-sm text-mist/85" data-testid="rising-window">{U.window(r.from, r.to)}</p>}
    {r.near && <p className={note} data-testid="rising-near">{U.near(A.signs[r.near].name)}</p>}
    <TimeNotes time={r.time} U={U} />
  </>;
}

function MoonView({ res, U }: { res: Extract<Result, { kind: "moon-sign" }>; U: CalcUi }) {
  const { c } = useContent(); const S = c.astro.signs; const { moon: m, timeKnown, zone } = res; const ch = m.change;
  if (ch && !timeKnown) return <>
    <p className={note} data-testid="moon-change">{U.moonChanged(S[ch.from].name, S[ch.to].name, ch.at)}</p>
    <SignCard label={U.moon} sign={ch.from} text={S[ch.from].moon} U={U} />
    <SignCard label={U.moon2} sign={ch.to} text={S[ch.to].moon} U={U} />
    <TimeNotes time={m.time} zone={zone} U={U} />
  </>;
  return <>
    <SignCard label={U.moon} sign={m.sign} lon={timeKnown ? m.lon : undefined} text={S[m.sign].moon} U={U} />
    {ch ? <p className={note} data-testid="moon-change">{U.moonChangedKnown(S[ch.from].name, S[ch.to].name, ch.at, S[m.sign].name)}</p> : !timeKnown && <p className="text-sm text-mist/85">{U.moonStill}</p>}
    <TimeNotes time={m.time} zone={zone} U={U} />
  </>;
}

function ChartView({ res, U }: { res: Extract<Result, { kind: "birth-chart" }>; U: CalcUi }) {
  const { c } = useContent(); const h = useHref(); const A = c.astro; const T = c.ui.chart; const S = A.signs;
  const { chart, moon, sun, zone } = res; const P = chart.placements;
  return <>
    <div className="space-y-3">
      <SignCard label={A.points.sun.name} sign={P.sun!.sign} lon={sun ? undefined : P.sun!.lon} text={S[P.sun!.sign].sun} U={U} />
      <SignCard label={A.points.moon.name} sign={P.moon!.sign} lon={moon ? undefined : P.moon!.lon} text={S[P.moon!.sign].moon} U={U} />
      {P.asc && <SignCard label={A.points.asc.name} sign={P.asc.sign} lon={P.asc.lon} text={S[P.asc.sign].rising} U={U} />}
    </div>
    {moon && <p className={note} data-testid="moon-change">{U.moonChanged(S[moon.from].name, S[moon.to].name, moon.at)}</p>}
    {sun && <p className={note}>{U.sunChanged(S[sun.from].name, S[sun.to].name, sun.at)}</p>}
    {!chart.hasAngles && <p className="text-sm text-mist/85" data-testid="chart-partial">{chart.time.timeKnown ? U.noPlace : U.noTime}</p>}
    <div className="mx-auto max-w-[460px]"><ChartWheel chart={chart} /></div>
    <div className="overflow-x-auto">
      <table className="w-full text-sm" data-testid="chart-table">
        <thead><tr className="text-left text-dim"><th className="py-1 font-normal">{T.point}</th><th className="font-normal">{T.sign}</th><th className="font-normal">{T.degree}</th><th className="font-normal">{T.house}</th></tr></thead>
        <tbody>
          {ORDER.filter((p) => P[p]).map((p) => { const pl = P[p]!; return (
            <tr key={p} className="border-t border-white/5">
              <td className="py-1.5">{A.points[p].glyph} {A.points[p].name}{pl.retrograde && <RetroMark label={U.retro} />}</td>
              <td><Link className="hover:text-gold" href={h(`/zodiac/${pl.sign}/`)} prefetch={false}>{SIGN_GLYPH[pl.sign]} {S[pl.sign].name}</Link></td>
              <td>{formatDegree(pl.lon)}</td>
              <td>{pl.house ?? "·"}</td>
            </tr>
          ); })}
        </tbody>
      </table>
    </div>
    <TimeNotes time={chart.time} zone={zone} U={U} />
  </>;
}
