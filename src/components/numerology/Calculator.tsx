"use client";
import Link from "next/link";
import { useState } from "react";
import { lifePath, nameNumbers, personalYear } from "@/engine/numerology";
import { localizedPath } from "@/lib/i18n-routes";
import type { CalcMode } from "@/lib/numerology";

export type CalcLabels = { birth: string; name: string; namePh: string; year: string; go: string; invalid: string; nameInvalid: string; lifePath: string; expression: string; soul: string; personality: string; personalYearTpl: string; read: string; steps: string; private: string };
const field = "h-11 w-full min-w-0 rounded-full border border-white/15 bg-white/[0.06] px-4 text-[15px] text-mist outline-none focus:border-gold/60";
const btn = "inline-flex h-11 shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-gold px-5 text-[14px] font-semibold text-plum hover:brightness-110";

/** Inline numerology calculator. Runs fully on the device; links each result to its meaning page if one exists. */
export function Calculator({ lang, mode, L, names, pages, compact = false }: { lang: string; mode: CalcMode; L: CalcLabels; names: Record<number, string>; pages: string[]; compact?: boolean }) {
  const [birth, setBirth] = useState(""); const [name, setName] = useState(""); const [err, setErr] = useState("");
  const [res, setRes] = useState<{ label: string; n: number; href?: string }[] | null>(null);
  const page = (sec: string, n: number) => { const p = `/numerology/${sec}/${n}/`; const h = `/numerology/${sec}/`; return pages.includes(p) ? localizedPath(lang, p) : pages.includes(h) ? localizedPath(lang, h) : undefined; };
  const year = new Date().getFullYear();
  function run(e: React.FormEvent) {
    e.preventDefault(); setErr("");
    if (mode === "name") {
      const r = nameNumbers(name); if (!r || !r.expression) { setErr(L.nameInvalid); setRes(null); return; }
      setRes([{ label: L.expression, n: r.expression, href: page("expression-number", r.expression) }, { label: L.soul, n: r.soulUrge, href: page("soul-urge-number", r.soulUrge) }, { label: L.personality, n: r.personality, href: page("personality-number", r.personality) }]);
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birth)) { setErr(L.invalid); setRes(null); return; }
    if (mode === "personal-year") { const n = personalYear(birth, year); setRes([{ label: L.personalYearTpl.replace("{y}", String(year)), n, href: page("personal-year", n) }]); return; }
    const r = lifePath(birth); setRes([{ label: L.lifePath, n: r.value, href: page("life-path", r.value) }]);
  }
  return (
    <div className={compact ? "" : "rounded-2xl border border-gold/25 bg-[linear-gradient(150deg,rgba(233,199,138,.10),rgba(139,108,240,.10))] p-4 lg:rounded-3xl lg:p-6"} data-testid="num-calc">
      <form onSubmit={run} className="flex flex-col gap-2 sm:flex-row">
        {mode === "name"
          ? <label className="min-w-0 flex-1"><span className="sr-only">{L.name}</span><input className={field} value={name} onChange={(e) => setName(e.target.value)} placeholder={L.namePh} autoComplete="name" /></label>
          : <label className="min-w-0 flex-1"><span className="sr-only">{L.birth}</span><input className={field} type="date" value={birth} onChange={(e) => setBirth(e.target.value)} min="1900-01-01" max="2100-12-31" aria-label={L.birth} /></label>}
        <button type="submit" className={btn}>{L.go}</button>
      </form>
      {err && <p className="mt-2 text-[13px] text-rose" role="alert">{err}</p>}
      {res && (
        <ul className="mt-3 space-y-2" aria-live="polite">
          {res.map((r) => (
            <li key={r.label} className="flex items-center justify-between gap-3 border-t border-white/10 pt-2">
              <span className="min-w-0"><span className="block text-[12px] uppercase tracking-[.12em] text-gold/85">{r.label}</span><span className="block text-[14px] text-mist/85">{names[r.n] ?? ""}</span></span>
              <span className="flex shrink-0 items-center gap-3"><span className="h-display text-[2.2rem] leading-none text-gold">{r.n}</span>{r.href && <Link href={r.href} className="whitespace-nowrap text-[13px] text-gold underline-offset-4 hover:underline">{L.read} →</Link>}</span>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-2 text-[12px] text-mist/55">{L.private}</p>
    </div>
  );
}
