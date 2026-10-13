"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { lifePath, nameNumbers, personalYear, reduce, numberHarmony } from "@/engine/numerology";
import { useStore } from "@/lib/store";
import { PremiumGate } from "../premium/Gate";
import type { CharEntry, KarmicEntry } from "@/content/numerology/types";

const KEY = "horoscop:num-birth";
const field = "h-11 w-full min-w-0 rounded-full border border-white/15 bg-white/[0.06] px-4 text-[15px] text-mist outline-none focus:border-gold/60";
const label = "text-[11px] font-semibold uppercase tracking-[.16em] text-gold";
const okDate = (d: string) => /^\d{4}-\d{2}-\d{2}$/.test(d);

/** Birth date from the saved profile, else from this device only (never sent anywhere). */
function useBirth(): [string, (d: string) => void] {
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

export type ReportLabels = { title: string; sub: string; birth: string; name: string; namePh: string; go: string; expression: string; soul: string; personality: string; maturity: string; karmic: string; noKarmic: string; together: string; sameTpl: string; mixTpl: string };
/** Plus: the full name report. Free calculator gives the numbers; this reads them as one narrative (gated like other Premium chapters). */
export function NameReport({ L, chars, karmic, lines }: { L: ReportLabels; chars: Record<number, CharEntry>; karmic: Record<number, KarmicEntry>; lines: { expression: Record<number, string>; soul: Record<number, string> } }) {
  const s = useStore(); const [birth, setBirth] = useBirth(); const [name, setName] = useState(""); const [go, setGo] = useState(false);
  useEffect(() => { if (s?.me?.birthName) setName((n) => n || s.me!.birthName!); }, [s]);
  const nn = go ? nameNumbers(name) : null; const lp = go && okDate(birth) ? lifePath(birth).value : null;
  const mat = nn && lp ? reduce(lp + nn.expression) : null; const kd = okDate(birth) ? [13, 14, 16, 19].find((k) => Number(birth.slice(8, 10)) === k) : undefined;
  const Sec = ({ t, n, ps }: { t: string; n: number; ps: string[] }) => (
    <section className="border-t border-white/10 pt-3 lg:pt-5"><h3 className={`${label} flex items-center gap-2`}><span className="h-display text-[1.6rem] normal-case tracking-normal text-gold">{n}</span>{t}</h3>{ps.map((p, i) => <p key={i} className="mt-1.5 text-pretty text-[15px] leading-snug text-mist/85 lg:text-[17px] lg:leading-[1.65]">{p}</p>)}</section>
  );
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-4 lg:rounded-none lg:border-0 lg:border-t lg:border-gold/15 lg:bg-transparent lg:px-0 lg:pt-9" aria-labelledby="name-report" data-testid="name-report">
      <h2 id="name-report" className="h-display text-balance text-[1.5rem] leading-tight lg:text-[2rem]">{L.title}</h2>
      <p className="mb-3 mt-1 text-[13.5px] text-mist/70">{L.sub}</p>
      <form onSubmit={(e) => { e.preventDefault(); setGo(true); }} className="grid gap-2 sm:grid-cols-[1fr_190px_auto]">
        <label className="min-w-0"><span className="sr-only">{L.name}</span><input className={field} value={name} onChange={(e) => { setName(e.target.value); setGo(false); }} placeholder={L.namePh} autoComplete="name" /></label>
        <label className="min-w-0"><span className="sr-only">{L.birth}</span><input className={field} type="date" value={birth} onChange={(e) => { setBirth(e.target.value); setGo(false); }} aria-label={L.birth} min="1900-01-01" max="2100-12-31" /></label>
        <button type="submit" className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-full bg-gold px-5 text-[14px] font-semibold text-plum">{L.go}</button>
      </form>
      {nn && nn.expression > 0 && (
        <div className="mt-4"><PremiumGate kind="name">
          <div className="space-y-3">
            <Sec t={L.expression} n={nn.expression} ps={[lines.expression[nn.expression], chars[nn.expression].gifts, chars[nn.expression].work]} />
            <Sec t={L.soul} n={nn.soulUrge} ps={[lines.soul[nn.soulUrge] ?? "", chars[nn.soulUrge]?.love ?? ""].filter(Boolean)} />
            <Sec t={L.personality} n={nn.personality} ps={[chars[nn.personality]?.story.split(". ").slice(0, 2).join(". ") + "."]} />
            {mat && <Sec t={L.maturity} n={mat} ps={[chars[mat].gifts, chars[mat].week]} />}
            <section className="border-t border-white/10 pt-3 lg:pt-5"><h3 className={label}>{L.karmic}</h3>{kd ? <><p className="mt-1.5 font-medium text-mist">{karmic[kd].title}</p>{karmic[kd].story.map((p) => <p key={p} className="mt-1.5 text-[15px] leading-snug text-mist/85">{p}</p>)}<p className="mt-1.5 text-[15px] text-gold/90">{karmic[kd].practice}</p></> : <p className="mt-1.5 text-[15px] text-mist/80">{L.noKarmic}</p>}</section>
            <section className="border-t border-white/10 pt-3 lg:pt-5"><h3 className={label}>{L.together}</h3><p className="mt-1.5 text-pretty text-[15px] leading-snug text-mist/85">{nn.expression === nn.soulUrge ? L.sameTpl.replace("{a}", String(nn.expression)) : L.mixTpl.replace("{a}", String(nn.expression)).replace("{b}", String(nn.soulUrge))}</p></section>
          </div>
        </PremiumGate></div>
      )}
    </section>
  );
}

export type DuoLabels = { a: string; b: string; nameA: string; nameB: string; go: string; life: string; deep: string; expr: string; soul: string; cycle: string; cycleTpl: string; same: string; needNames: string; read: string };
/** Free life path match for two dates; Duo deep reading (names, cycles) behind the Premium gate. */
export function DuoCalc({ L, names, kinds, deepKinds, lpHref }: { L: DuoLabels; names: Record<number, string>; kinds: Record<string, string>; deepKinds: Record<string, string>; lpHref: Record<number, string> }) {
  const [a, setA] = useState(""); const [b, setB] = useState(""); const [na, setNa] = useState(""); const [nb, setNb] = useState(""); const [go, setGo] = useState(false);
  const ok = go && okDate(a) && okDate(b); const la = ok ? lifePath(a).value : 0, lb = ok ? lifePath(b).value : 0; const h = ok ? numberHarmony(la, lb) : null;
  const ea = ok && na ? nameNumbers(na) : null, eb = ok && nb ? nameNumbers(nb) : null; const y = new Date().getFullYear();
  const Row = ({ t, x, z }: { t: string; x: number; z: number }) => { const k = numberHarmony(x, z).kind; return <section className="border-t border-white/10 pt-3"><h3 className={label}>{t}: {x} + {z}</h3><p className="mt-1.5 text-[15px] leading-snug text-mist/85">{kinds[k]}</p></section>; };
  return (
    <div className="rounded-2xl border border-gold/25 bg-[linear-gradient(150deg,rgba(233,199,138,.10),rgba(139,108,240,.10))] p-4 lg:rounded-3xl lg:p-6" data-testid="duo-calc">
      <form onSubmit={(e) => { e.preventDefault(); setGo(true); }} className="grid gap-2 sm:grid-cols-2">
        <fieldset className="grid min-w-0 gap-2"><legend className={`${label} mb-1`}>{L.a}</legend><input className={field} type="date" value={a} onChange={(e) => { setA(e.target.value); setGo(false); }} aria-label={L.a} /><input className={field} value={na} onChange={(e) => setNa(e.target.value)} placeholder={L.nameA} aria-label={L.nameA} /></fieldset>
        <fieldset className="grid min-w-0 gap-2"><legend className={`${label} mb-1`}>{L.b}</legend><input className={field} type="date" value={b} onChange={(e) => { setB(e.target.value); setGo(false); }} aria-label={L.b} /><input className={field} value={nb} onChange={(e) => setNb(e.target.value)} placeholder={L.nameB} aria-label={L.nameB} /></fieldset>
        <button type="submit" className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-full bg-gold px-5 text-[14px] font-semibold text-plum sm:col-span-2 sm:justify-self-start">{L.go}</button>
      </form>
      {h && (
        <div className="mt-4 space-y-3" aria-live="polite">
          <section className="border-t border-white/10 pt-3"><h3 className={label}>{L.life}</h3>
            <p className="mt-1 flex flex-wrap items-baseline gap-x-3"><span className="h-display text-[2.2rem] leading-none text-gold">{la} + {lb}</span><span className="text-[13px] text-mist/70">{names[la]} · {names[lb]}</span></p>
            <p className="mt-1.5 text-[15px] leading-snug text-mist/85">{kinds[h.kind]}</p>
            <p className="mt-1 flex flex-wrap gap-3 text-[13px]">{[la, lb].filter((v, i, arr) => arr.indexOf(v) === i).map((v) => lpHref[v] && <Link key={v} className="text-gold underline-offset-4 hover:underline" href={lpHref[v]}>{L.read} {v} →</Link>)}</p>
          </section>
          <PremiumGate kind="duo">
            <div className="space-y-3">
              <section className="border-t border-white/10 pt-3"><h3 className={label}>{L.deep}</h3><p className="mt-1.5 text-[15px] leading-snug text-mist/85">{deepKinds[h.kind]}</p></section>
              {ea && eb && ea.expression > 0 && eb.expression > 0 ? <><Row t={L.expr} x={ea.expression} z={eb.expression} /><Row t={L.soul} x={ea.soulUrge} z={eb.soulUrge} /></> : <p className="text-[13px] text-mist/65">{L.needNames}</p>}
              <section className="border-t border-white/10 pt-3"><h3 className={label}>{L.cycle}</h3><ul className="mt-1.5 space-y-1 text-[15px] text-mist/85">{[y, y + 1, y + 2].map((yy) => { const pa = personalYear(a, yy), pb = personalYear(b, yy); return <li key={yy}>{L.cycleTpl.replace("{y}", String(yy)).replace("{a}", String(pa)).replace("{b}", String(pb))}{pa === pb && <span className="block text-[13px] text-gold/85">{L.same}</span>}</li>; })}</ul></section>
            </div>
          </PremiumGate>
        </div>
      )}
    </div>
  );
}
