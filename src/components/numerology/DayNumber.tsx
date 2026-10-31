"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { personalYear, reduce } from "@/engine/numerology";
import { useStore } from "@/lib/store";

const KEY = "horoscop:num-birth";
export const field = "h-11 w-full min-w-0 rounded-full border border-white/15 bg-white/[0.06] px-4 text-[15px] text-mist outline-none focus:border-gold/60";
export const label = "text-[11px] font-semibold uppercase tracking-[.16em] text-gold";
export const okDate = (d: string) => /^\d{4}-\d{2}-\d{2}$/.test(d);

/** Birth date from the saved profile, else from this device only (never sent anywhere). */
export function useBirth(): [string, (d: string) => void] {
  const s = useStore(); const [local, setLocal] = useState("");
  useEffect(() => { try { setLocal(localStorage.getItem(KEY) ?? ""); } catch { /* private mode */ } }, []);
  const set = (d: string) => { setLocal(d); try { if (okDate(d)) localStorage.setItem(KEY, d); } catch { /* ignore */ } };
  return [s?.me?.date && okDate(s.me.date) ? s.me.date : local, set];
}
export function personalDay(birth: string, iso: string) {
  const [y, m, d] = iso.split("-").map(Number); const py = personalYear(birth, y); const pm = reduce(py + m, false);
  return { py, pm, pd: reduce(pm + d, false) };
}

export type DayLabels = { title: string; intro: string; need: string; link: string; year: string; month: string; birth: string };
/** "Your number of the day" block for the daily horoscope. */
export function DayNumber({ iso, L, days, names, href }: { iso: string; L: DayLabels; days: Record<number, string[]>; names: Record<number, string>; href: string }) {
  const [birth, setBirth] = useBirth();
  const r = okDate(birth) ? personalDay(birth, iso) : null; const d = Number(iso.slice(8, 10)); const m = Number(iso.slice(5, 7));
  return (
    <section className="rounded-2xl border border-gold/25 bg-gold/[0.05] px-4 py-3.5 lg:rounded-3xl lg:px-5" data-testid="day-number">
      <h2 className={`${label} mb-1`}>✦ {L.title}</h2>
      {r ? (
        <>
          <p className="flex items-center gap-3"><span className="h-display text-[2.6rem] leading-none text-gold">{r.pd}</span><span className="min-w-0 text-[13px] leading-snug text-mist/70">{names[r.pd]}<br />{L.year.replace("{n}", String(r.py))}, {L.month.replace("{n}", String(r.pm))}</span></p>
          <p className="mt-2 text-pretty text-[14px] leading-snug text-mist/85">{days[r.pd][(d + m) % days[r.pd].length]}</p>
        </>
      ) : (
        <>
          <p className="mb-2 text-[13px] leading-snug text-mist/70">{L.need}</p>
          <label><span className="sr-only">{L.birth}</span><input type="date" className={field} aria-label={L.birth} onChange={(e) => setBirth(e.target.value)} min="1900-01-01" max="2100-12-31" /></label>
        </>
      )}
      <p className="mt-2 text-[13px]"><Link className="text-gold underline-offset-4 hover:underline" href={href}>{L.link} →</Link></p>
    </section>
  );
}
