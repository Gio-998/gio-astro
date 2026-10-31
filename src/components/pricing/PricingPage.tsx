"use client";
import Link from "next/link";
import { useContent, useHref } from "@/lib/content-context";
import { eur } from "@/lib/payments";
import { PLAN_PRICES, REPORT_PRICES, type ReportId } from "@/lib/pricing";
import { pricingText } from "./text";

const REPORTS: ReportId[] = ["match", "year", "deep"];

/** One free card and a short, clearly labelled list of planned prices. Nothing on this page sells or leads to a checkout. */
export function PricingPage() {
  const { locale } = useContent(); const h = useHref(); const T = pricingText(locale); const L = T.later;
  const money = (c: number) => eur(c, locale);
  const row = "flex items-center justify-between gap-3 border-t border-white/10 py-3.5";
  return (
    <div className="mx-auto max-w-2xl space-y-14 pb-6" data-testid="pricing-page">
      <section className="pt-4 text-center">
        <p className="eyebrow mb-3">✦ {T.eyebrow}</p>
        <h1 className="h-display mx-auto mb-3 text-balance text-[clamp(2.2rem,8.5vw,3.6rem)] leading-[1.04]">{T.title[0]}<span className="italic text-aurora">{T.title[1]}</span></h1>
        <p className="mx-auto max-w-md text-balance text-mist/85">{T.sub}</p>
      </section>

      <section className="rounded-[28px] border border-gold/40 bg-gradient-to-b from-violet/25 via-ink to-ink p-5 sm:p-7" data-testid="plan-free">
        <div className="mb-4 flex items-baseline justify-between gap-3">
          <div className="min-w-0"><h2 className="h-display text-3xl">{T.free.name}</h2><p className="text-sm text-dim">{T.free.line}</p></div>
          <p className="h-display shrink-0 whitespace-nowrap text-4xl text-mist">{money(0)}</p>
        </div>
        <ul className="mb-5 grid gap-x-5 gap-y-2 text-[15px] sm:grid-cols-2">
          {T.free.features.map((f) => <li key={f} className="flex gap-2"><span className="text-gold" aria-hidden>✓</span><span className="text-mist/90">{f}</span></li>)}
        </ul>
        <Link href={h("/quizzes/")} className="btn-primary min-h-[52px]! w-full text-base!" data-testid="pricing-start">{T.cta} ✦</Link>
        <p className="mt-3 text-center text-[13px] leading-snug text-dim">{T.free.note}</p>
      </section>

      <section data-testid="planned">
        <p className="eyebrow mb-2">✦ {L.eyebrow}</p>
        <h2 className="h-display mb-2 text-[clamp(1.8rem,6vw,2.4rem)]">{L.title}</h2>
        <p className="mb-5 text-[15px] leading-relaxed text-mist/80">{L.sub}</p>
        <p className="mb-1.5 text-right text-[11px] uppercase tracking-wider text-dim">{L.planned}</p>
        <div className="border-b border-white/10">
          <div className={row}>
            <div className="min-w-0"><p className="font-semibold text-mist">{L.plus.name}</p><p className="text-[13px] text-dim">{L.plus.line}</p></div>
            <div className="shrink-0 text-right"><p className="text-mist/90">{money(PLAN_PRICES.plus.month)} <span className="text-xs text-dim">{L.perMonth}</span></p><p className="text-xs text-dim">{L.orYear(money(PLAN_PRICES.plus.year))}</p></div>
          </div>
          {REPORTS.map((r) => (
            <div key={r} className={row}>
              <div className="min-w-0"><p className="font-semibold text-mist">{L.items[r].name}</p><p className="text-[13px] text-dim">{L.items[r].line}</p></div>
              <div className="shrink-0 text-right"><p className="text-mist/90">{money(REPORT_PRICES[r])}</p><p className="text-xs text-dim">{L.once}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section data-testid="faq">
        <p className="eyebrow mb-2">✦ {T.faq.eyebrow}</p>
        <h2 className="h-display mb-4 text-[clamp(1.8rem,6vw,2.4rem)]">{T.faq.title}</h2>
        <div className="divide-y divide-white/10 border-y border-white/10">
          {T.faq.items.map(([q, a]) => (
            <details key={q} className="group">
              <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-3 py-2 font-medium text-mist">{q}<span className="shrink-0 text-lg text-gold transition group-open:rotate-45" aria-hidden>+</span></summary>
              <p className="pb-4 text-[14.5px] leading-relaxed text-mist/80">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="text-center">
        <h2 className="h-display mb-2 text-balance text-[clamp(1.8rem,6vw,2.6rem)]">{T.bottom.title}</h2>
        <p className="mx-auto mb-5 max-w-md text-balance text-[15px] text-mist/85">{T.bottom.sub}</p>
        <Link href={h("/quizzes/")} className="btn-primary min-h-[52px]! w-full px-8 text-base! sm:w-auto">{T.cta} ✦</Link>
      </section>
    </div>
  );
}
