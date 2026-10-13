"use client";
import Link from "next/link";
import { useState } from "react";
import { useContent, useHref } from "@/lib/content-context";
import { eur } from "@/lib/payments";
import { PLAN_PRICES, RECOMMENDED, REPORT_PRICES, perMonthOfYear, yearlySaving, type PlanId, type ReportId } from "@/lib/pricing";
import { useBetaLocked } from "../auth/Beta";
import { pricingText } from "./text";

const PLANS: PlanId[] = ["free", "plus", "duo"];
const REPORTS: ReportId[] = ["match", "year", "deep"];

function Mark({ v, hi }: { v: string; hi?: boolean }) {
  if (v === "yes") return <span className={hi ? "text-gold" : "text-sage"} aria-label="✓">✓</span>;
  if (v === "no") return <span className="text-dim/50" aria-hidden>·</span>;
  return <span className={hi ? "text-mist" : "text-dim"}>{v}</span>;
}

export function PricingPage() {
  const { locale } = useContent(); const h = useHref(); const T = pricingText(locale); const locked = useBetaLocked();
  const [yearly, setYearly] = useState(true);
  const join = locked ? `${h("/")}#waitlist` : h("/start/");
  const save = yearlySaving("plus");
  const money = (c: number) => eur(c, locale);
  return (
    <div className="space-y-16 pb-10" data-testid="pricing-page">
      <section className="relative pt-4 text-center">
        <p className="eyebrow mb-3">✦ {T.eyebrow}</p>
        <h1 className="h-display mx-auto mb-3 max-w-2xl text-balance text-[clamp(2.2rem,8.5vw,4rem)] leading-[1.02]">{T.title[0]}<span className="italic text-aurora">{T.title[1]}</span></h1>
        <p className="mx-auto mb-7 max-w-md text-balance text-mist/85">{T.sub}</p>
        <div role="group" aria-label={`${T.monthly} / ${T.yearly}`} className="mx-auto inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 p-1 text-sm" data-testid="billing-toggle">
          {([false, true] as const).map((y) => (
            <button key={String(y)} type="button" aria-pressed={yearly === y} onClick={() => setYearly(y)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 font-semibold transition ${yearly === y ? "bg-gold text-plum" : "text-dim hover:text-mist"}`}>
              {y ? T.yearly : T.monthly}
              {y && <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${yearly ? "bg-plum/15 text-plum" : "bg-sage/15 text-sage"}`}>{T.save(save)}</span>}
            </button>
          ))}
        </div>
      </section>

      <section className="grid items-stretch gap-4 md:grid-cols-3 md:gap-5" data-testid="plans">
        {PLANS.map((id) => {
          const p = T.plans[id]; const rec = id === RECOMMENDED; const pr = PLAN_PRICES[id]; const free = pr.month === 0;
          const big = free ? money(0) : yearly ? money(perMonthOfYear(id)) : money(pr.month);
          return (
            <article key={id} data-testid={`plan-${id}`}
              className={`relative flex flex-col rounded-[28px] border p-5 sm:p-6 ${rec ? "order-first border-gold/60 bg-gradient-to-b from-violet/30 via-ink to-ink shadow-[0_30px_80px_-30px_rgba(246,207,122,.55)] md:order-none md:-my-3 md:py-8" : "border-white/12 bg-white/[0.03]"}`}>
              {rec && <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gold px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-plum">✦ {T.recommended}</span>}
              <h2 className="h-display text-3xl">{p.name}</h2>
              <p className="mb-4 truncate text-sm text-dim">{p.line}</p>
              <div className="mb-1 flex items-baseline gap-1.5">
                <span className="h-display text-4xl text-mist whitespace-nowrap!">{big}</span>
                <span className="whitespace-nowrap text-sm text-dim md:text-[13px] lg:text-sm">{free ? T.forever : T.perMonth}</span>
              </div>
              <p className="mb-5 h-5 text-xs text-dim">{!free && (yearly ? T.billedYearly(money(pr.year)) : `${money(pr.year)} ${T.perYear} · ${T.save(yearlySaving(id))}`)}</p>
              <Link href={join} className={`${rec ? "btn-primary" : "btn-ghost"} mb-5 w-full whitespace-nowrap !py-2.5 text-center text-sm md:!px-3 lg:!px-5`} data-testid={`cta-${id}`}>{p.cta}{rec ? " ✦" : ""}</Link>
              {p.lead && <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gold/90">{p.lead}</p>}
              <ul className="space-y-2 text-sm">
                {p.features.map((f) => <li key={f} className="flex gap-2"><span className={rec ? "text-gold" : "text-sage"} aria-hidden>✓</span><span className="text-mist/90">{f}</span></li>)}
              </ul>
            </article>
          );
        })}
      </section>
      <p className="-mt-10 text-center text-xs text-dim" data-testid="payments-soon">{T.soon}</p>

      <section data-testid="reports">
        <p className="eyebrow mb-2 text-center">✦ {T.reports.eyebrow}</p>
        <h2 className="h-display mb-1 text-center text-[clamp(1.8rem,6vw,2.6rem)]">{T.reports.title}</h2>
        <p className="mb-6 text-center text-sm text-dim">{T.reports.sub}</p>
        <div className="grid gap-3 md:grid-cols-3">
          {REPORTS.map((r) => (
            <div key={r} className="flex items-center justify-between gap-3 rounded-2xl border border-white/12 bg-white/[0.03] px-4 py-3.5">
              <div className="min-w-0"><p className="font-semibold text-mist">{T.reports.items[r].name}</p><p className="truncate text-xs text-dim">{T.reports.items[r].line}</p></div>
              <div className="shrink-0 text-right"><p className="h-display text-2xl text-gold">{money(REPORT_PRICES[r])}</p><p className="text-[10px] uppercase tracking-wider text-dim">{T.reports.once}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section data-testid="compare">
        <p className="eyebrow mb-2 text-center">✦ {T.table.eyebrow}</p>
        <h2 className="h-display mb-6 text-center text-[clamp(1.8rem,6vw,2.6rem)]">{T.table.title}</h2>
        <div className="overflow-hidden rounded-[24px] border border-white/12">
          <table className="w-full table-fixed text-[11px] sm:text-sm">
            <colgroup><col className="w-[37%] sm:w-[40%]" /><col /><col /><col /></colgroup>
            <thead className="bg-white/[0.04]">
              <tr>
                <th scope="col" className="px-2 py-3 text-left font-semibold text-dim sm:px-3">{T.table.feature}</th>
                {PLANS.map((id) => <th key={id} scope="col" className={`px-0.5 py-3 text-center text-[10.5px] font-semibold tracking-tight sm:px-1 sm:text-sm sm:tracking-normal ${id === RECOMMENDED ? "bg-gold/10 text-gold" : "text-mist"}`}>{T.plans[id].name}</th>)}
              </tr>
            </thead>
            <tbody>
              {T.table.rows.map(([f, ...cells]) => (
                <tr key={f} className="border-t border-white/[0.07]">
                  <th scope="row" className="py-2.5 pl-2 pr-1 text-left text-[11px] font-normal leading-snug text-mist/90 sm:px-3 sm:text-sm">{f}</th>
                  {cells.map((v, i) => <td key={i} className={`break-words px-0.5 py-2.5 text-center leading-tight sm:px-1 ${PLANS[i] === RECOMMENDED ? "bg-gold/[0.06]" : ""}`}><Mark v={v} hi={PLANS[i] === RECOMMENDED} /></td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto max-w-2xl" data-testid="faq">
        <p className="eyebrow mb-2 text-center">✦ {T.faq.eyebrow}</p>
        <h2 className="h-display mb-6 text-center text-[clamp(1.8rem,6vw,2.6rem)]">{T.faq.title}</h2>
        <div className="space-y-2">
          {T.faq.items.map(([q, a]) => (
            <details key={q} className="group rounded-2xl border border-white/12 bg-white/[0.03] px-4 py-3 open:bg-white/[0.05]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold text-mist">{q}<span className="text-gold transition group-open:rotate-45" aria-hidden>+</span></summary>
              <p className="mt-2 text-sm leading-relaxed text-mist/80">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="rounded-[30px] border border-gold/25 bg-gradient-to-br from-violet/25 via-ink to-rose/15 px-5 py-9 text-center">
        <h2 className="h-display mb-2 text-balance text-[clamp(1.8rem,6vw,2.6rem)]">{T.bottom.title}</h2>
        <p className="mx-auto mb-5 max-w-md text-balance text-sm text-mist/85">{T.bottom.sub}</p>
        <Link href={join} className="btn-primary inline-flex whitespace-nowrap !px-6 !py-2.5 text-sm">{T.bottom.cta} ✦</Link>
      </section>
    </div>
  );
}
