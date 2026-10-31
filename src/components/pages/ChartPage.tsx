"use client";
import Link from "next/link";
import { RetroMark } from "../RetroMark";
import { useSearchParams } from "next/navigation";
import { useStore, findPerson } from "@/lib/store";
import { profileOf } from "@/lib/profile";
import { ChartWheel } from "../ChartWheel";
import { useContent, useHref, useDate } from "@/lib/content-context";
import { formatDegree, SIGN_GLYPH } from "@/engine/zodiac";
import type { Point } from "@/engine/astro";
import { EvidenceBadge, PageHero } from "../ui";

const ORDER: Point[] = ["sun", "moon", "asc", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto", "node", "mc"];

export function ChartPage() {
  const s = useStore(); const { c, locale } = useContent(); const h = useHref(); const fmt = useDate(); const U = c.ui.chart;
  const id = useSearchParams().get("id") ?? "me";
  if (!s) return <p className="text-dim">{c.site.common.loading}</p>;
  const person = findPerson(s, id);
  if (!person) return <div className="card text-center"><p className="mb-3">{U.addDetails}</p><Link className="btn-primary" href={h("/start/")}>{c.site.common.start}</Link></div>;
  const pr = profileOf(person); const ch = pr.chart; const A = c.astro;
  const t = ch.time;
  return (
    <div>
      <PageHero eyebrow={U.eyebrow} img="milkyway" emblem="chart" title={<><span className="text-aurora">{person.name}</span>{U.titleSuffix}</>} sub={<EvidenceBadge e="traditional" />} />
      <p className="mb-4 text-sm text-dim">
        {fmt(person.date)} {person.time ?? U.timeUnknown} {person.place ? `· ${person.place.name}` : U.noPlace} ·
        UTC{t.offsetMinutes >= 0 ? "+" : "−"}{Math.floor(Math.round(Math.abs(t.offsetMinutes)) / 60)}:{String(Math.round(Math.abs(t.offsetMinutes)) % 60).padStart(2, "0")} ({U.src[t.offsetSource] ?? U.src.assumed}){U.system}
      </p>
      {t.tzNote && <p className="mb-4 rounded-xl border border-gold/30 bg-gold/10 p-3 text-sm" data-testid="tz-note">{t.tzNote === "gap" ? c.accuracy.tzGap : c.accuracy.tzAmbiguous}</p>}
      <div className="card relative overflow-hidden"><div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,108,240,.25),transparent_65%)]" /><div className="relative mx-auto max-w-[460px]"><ChartWheel chart={ch} /></div></div>
      <div className="card mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-dim"><th className="py-1">{U.point}</th><th>{U.sign}</th><th>{U.degree}</th><th>{U.house}</th></tr></thead>
          <tbody>
            {ORDER.filter((p) => ch.placements[p]).map((p) => { const pl = ch.placements[p]!; return (
              <tr key={p} className="border-t border-white/5"><td className="py-1.5">{A.points[p].glyph} {A.points[p].name}{pl.retrograde && <RetroMark label={locale === "mk" ? "ретроградно" : locale === "de" ? "rückläufig" : locale === "sr" ? "retrogradno" : "retrograde"} />}</td><td>{SIGN_GLYPH[pl.sign]} {A.signs[pl.sign].name}</td><td>{formatDegree(pl.lon)}</td><td>{pl.house ?? "·"}</td></tr>
            ); })}
          </tbody>
        </table>
      </div>
      <h2 className="h-display mt-12 mb-4 text-3xl"><span className="text-gold">✦</span>{U.placements}</h2>
      <div className="space-y-3">
        {ORDER.filter((p) => ch.placements[p] && p !== "mc").map((p) => { const pl = ch.placements[p]!; const sg = A.signs[pl.sign]; return (
          <div key={p} className="card card-hover">
            <h3 className="h-display text-xl"><span className="mr-2 inline-grid h-8 w-8 place-items-center rounded-full bg-white/10 text-gold">{A.points[p].glyph}</span>{U.inSign(A.points[p].name)}<span className="text-gold">{sg.name}</span>{pl.house ? U.houseN(pl.house) : ""}</h3>
            <p className="text-sm">{p === "sun" ? sg.sun : p === "moon" ? sg.moon : p === "asc" ? sg.rising : U.planetText(A.points[p].name, A.points[p].governs, sg.name, sg.essence, sg.gifts, sg.edge)}</p>
            {pl.house && p !== "asc" && <p className="mt-1 text-xs text-dim">{U.houseLine(pl.house, A.houses[pl.house - 1])}</p>}
          </div>
        ); })}
      </div>
      <h2 className="h-display mt-12 mb-4 text-3xl"><span className="text-gold">✦</span>{U.aspectsTitle}</h2>
      <div className="space-y-2">
        {ch.aspects.slice(0, 12).map((a, i) => (
          <div key={i} className="card !py-3 text-sm">
            <b>{A.points[a.a].name} {A.aspects[a.type].symbol} {A.points[a.b].name}</b> <span className="text-dim">{U.orb(A.aspects[a.type].name, a.orb.toFixed(1))}</span>: {A.aspects[a.type].natal}.
          </div>
        ))}
      </div>
      <p className="mt-6 text-xs text-dim">{U.foot}</p>
    </div>
  );
}
