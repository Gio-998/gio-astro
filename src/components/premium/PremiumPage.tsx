"use client";
import Link from "next/link";
import { useState } from "react";
import { useContent, useHref } from "@/lib/content-context";
import { OFFERS, SKUS, eur, skusOf, yearlySavePct, type ProductId } from "@/lib/payments";
import { Aura } from "../aura/Aura";
import { Reveal } from "../art/Reveal";
import { ArtCard } from "../art/ArtCard";
import { useAccess } from "./access";
import { MkdLine } from "./Mkd";
import { usePremiumText, BuyButton, DemoBadge, DemoControls, Eur, TrustStrip } from "./bits";
import { LOOK } from "./text";

export const fromPrice = (p: ProductId) => Math.min(...skusOf(p).map((s) => SKUS[s].cents));

export function AdminDemoBar() {
  const acc = useAccess(); const T = usePremiumText(); const h = useHref();
  if (!acc.isAdmin) return null;
  return (
    <div className="mb-6 space-y-3" data-testid="admin-demo-bar">
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-amber/40 bg-amber/10 px-4 py-2.5 text-sm"><DemoBadge /><span className="flex-1">{T.demo.adminNote}</span><Link className="text-gold underline" href={h("/admin/premium/")}>{T.demo.panel} →</Link></div>
      <DemoControls compact />
    </div>
  );
}

function Mark({ v }: { v: string }) {
  if (v === "yes") return <span className="text-sage" aria-label="yes">✓</span>;
  if (v === "no") return <span className="text-dim/60" aria-label="no">·</span>;
  return <span>{v}</span>;
}

export function PremiumPage() {
  const T = usePremiumText(); const { locale } = useContent(); const h = useHref(); const acc = useAccess();
  const [yearly, setYearly] = useState(true);
  const sku = yearly ? "premium-yearly" : "premium-monthly";
  const P = T.plans;
  return (
    <div className="space-y-16" data-testid="premium-page">
      <div>
        <AdminDemoBar />
        {/* Hero */}
        <section className="relative overflow-hidden rounded-[36px] border border-gold/25 bg-gradient-to-br from-violet/30 via-ink to-rose/20 px-5 pb-8 pt-10 text-center shadow-[0_40px_100px_-40px_rgba(246,207,122,.45)] sm:px-10">
          <div className="pointer-events-none absolute inset-x-0 -top-10 mx-auto h-72 w-56 opacity-80" aria-hidden><Aura className="h-full w-full" colors={["#ffd38a", "#f6b5cf", "#c9b8ff", "#8fe3d6", "#fffaf0"]} energy={0.8} heart="#ffd27a" label="" /></div>
          <div className="relative pt-48 sm:pt-44">
            <p className="eyebrow mb-3">✦ {T.hero.eyebrow}</p>
            <h1 className="h-display mb-3 text-[clamp(2.4rem,9vw,4.4rem)] leading-[0.98]">{T.hero.titleA}<span className="italic text-aurora">{T.hero.titleB}</span></h1>
            <p className="mx-auto mb-6 max-w-xl text-mist/85">{T.hero.sub}</p>
            <div className="mx-auto flex max-w-sm flex-col gap-2">
              <a href="#plans" className="btn-primary py-3.5 text-base">{acc.isAdmin ? T.hero.ctaDemo : T.hero.ctaSoon} ✦</a>
              <a href="#offers" className="btn-ghost py-3">{T.hero.seeOffers}</a>
            </div>
            <div className="mt-5 flex flex-wrap justify-center gap-2">{T.hero.trust.map((t) => <span key={t} className="chip !text-mist">✓ {t}</span>)}</div>
          </div>
        </section>
      </div>

      <TrustStrip />

      {/* Plans */}
      <section id="plans" className="scroll-mt-24">
        <div className="mx-auto mb-6 flex w-full max-w-xs items-center rounded-full border border-white/15 bg-white/[0.05] p-1" role="radiogroup" aria-label={T.toggle.label}>
          {([false, true] as const).map((y) => (
            <button type="button" key={String(y)} role="radio" aria-checked={yearly === y} onClick={() => setYearly(y)} data-testid={y ? "toggle-yearly" : "toggle-monthly"}
              className={`relative flex-1 rounded-full px-3 py-2.5 text-sm transition ${yearly === y ? "bg-gradient-to-r from-gold to-rose font-semibold text-ink shadow" : "text-dim"}`}>
              {y ? T.toggle.yearly : T.toggle.monthly}
              {y && <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${yearly ? "bg-ink/20" : "bg-sage text-ink"}`}>{T.toggle.save(yearlySavePct)}</span>}
            </button>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Reveal><div className="card h-full">
            <div className="flex items-center justify-between"><p className="h-display text-3xl">{P.free.name}</p><span className="chip">{P.free.tag}</span></div>
            <p className="mb-3 text-sm text-dim">{P.free.lead}</p>
            <p className="mb-4"><span className="h-display text-4xl">{P.free.price}</span></p>
            <ul className="mb-5 space-y-2 text-sm">{P.free.items.map((i) => <li key={i} className="flex gap-2"><span className="text-sage">✓</span>{i}</li>)}</ul>
            <Link href={h("/start/")} className="btn-ghost w-full py-3">{P.free.cta}</Link>
          </div></Reveal>
          <Reveal delay={0.06} className="order-first md:order-none"><div className="relative h-full overflow-hidden rounded-[28px] border-2 border-gold/60 bg-gradient-to-b from-[#2a2163] to-[#17123d] p-6 shadow-[0_30px_80px_-30px_rgba(246,207,122,.6)]" data-testid="plan-premium">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/20 blur-3xl" aria-hidden />
            <div className="relative flex items-center justify-between"><p className="h-display text-3xl text-aurora">{P.premium.name}</p><span className="rounded-full bg-gradient-to-r from-gold to-rose px-3 py-1 text-xs font-bold text-ink">{P.premium.tag}</span></div>
            <p className="relative mb-3 text-sm text-dim">{P.premium.lead}</p>
            <p className="relative" data-testid="premium-price"><Eur cents={SKUS[sku].cents} className="h-display text-5xl" hintClass="block text-xs text-dim sm:inline" /><span className="ml-1 text-sm text-dim">{yearly ? T.price.perYear : T.price.perMonth}</span></p>
            <p className="relative mb-4 h-5 text-xs text-sage">{yearly ? T.price.yearlyEq(eur(Math.round(SKUS["premium-yearly"].cents / 12), locale)) : ""}</p>
            <ul className="relative mb-5 space-y-2 text-sm">{P.premium.items.map((i) => <li key={i} className="flex gap-2"><span className="text-gold">✦</span>{i}</li>)}</ul>
            <div className="relative"><BuyButton sku={sku} returnTo={h("/book/")} /></div>
            <p className="relative mt-3 text-center text-xs text-dim">{T.hero.trust.join(" · ")}</p>
          </div></Reveal>
        </div>
        <p className="mt-3 text-center text-xs text-dim">{T.price.vat}</p>
      </section>

      {/* Included */}
      <section>
        <h2 className="h-display mb-5 text-center text-4xl">{T.included.title}</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {T.included.items.map((it, i) => (
            <Reveal key={it.title} delay={i * 0.04}><div className="card h-full"><div className="mb-2 grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-gold/30 to-rose/20 text-xl">{it.icon}</div><p className="mb-1 font-semibold">{it.title}</p><p className="text-sm text-dim">{it.text}</p></div></Reveal>
          ))}
        </div>
      </section>

      {/* Compare */}
      <section>
        <h2 className="h-display mb-4 text-center text-4xl">{T.compare.title}</h2>
        <div className="overflow-hidden rounded-[24px] border border-white/12 bg-white/[0.03]">
          <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-2 border-b border-white/10 bg-white/[0.05] px-4 py-3 text-xs font-semibold uppercase tracking-wider"><span /><span className="text-center text-dim">{T.compare.free}</span><span className="text-center text-gold">{T.compare.premium}</span></div>
          {T.compare.rows.map(([l, f, p]) => (
            <div key={l} className="grid grid-cols-[1.4fr_1fr_1fr] items-center gap-2 border-b border-white/5 px-4 py-3 text-sm last:border-0"><span>{l}</span><span className="text-center text-dim"><Mark v={f} /></span><span className="text-center font-medium"><Mark v={p} /></span></div>
          ))}
        </div>
      </section>

      {/* Promises */}
      <section className="rounded-[32px] border border-sage/30 bg-gradient-to-br from-sage/10 to-transparent p-5 sm:p-8">
        <h2 className="h-display mb-4 text-4xl">{T.promises.title}</h2>
        <div className="grid gap-4 sm:grid-cols-2">{T.promises.items.map((p) => <div key={p.title}><p className="mb-1 font-semibold text-sage">✓ {p.title}</p><p className="text-sm text-mist/85">{p.text}</p></div>)}</div>
      </section>

      {/* Offers */}
      <section id="offers" className="scroll-mt-24">
        <p className="eyebrow mb-2 text-center">✦ {T.offers.eyebrow}</p>
        <h2 className="h-display mb-2 text-center text-[clamp(2rem,6.5vw,3.4rem)] leading-tight">{T.offers.title}</h2>
        <p className="mx-auto mb-6 max-w-xl text-center text-dim">{T.offers.sub}</p>
        <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 no-scrollbar sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
          {OFFERS.map((id) => <OfferCard key={id} id={id} />)}
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="h-display mb-4 text-center text-4xl">{T.faq.title}</h2>
        <div className="mx-auto max-w-2xl space-y-2">{T.faq.items.map((f) => (
          <details key={f.q} className="group rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-3"><summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-medium">{f.q}<span className="text-gold transition group-open:rotate-45">+</span></summary><p className="mt-2 text-sm text-mist/85">{f.a}</p></details>
        ))}</div>
      </section>

      {/* Final CTA */}
      <section className="rounded-[32px] border border-gold/30 bg-gradient-to-br from-violet/25 to-rose/15 p-6 text-center">
        {acc.isAdmin ? <p className="mb-3"><DemoBadge /></p> : <p className="eyebrow mb-2">{T.soon.eyebrow}</p>}
        <p className="h-display mb-2 text-3xl">{acc.isAdmin ? T.gate.sheetTitle : T.soon.title}</p>
        <p className="mx-auto mb-4 max-w-md text-sm text-dim">{acc.isAdmin ? T.gate.sheetLead : T.soon.text}</p>
        <div className="mx-auto max-w-sm"><BuyButton sku={sku} returnTo={h("/book/")} /></div>
      </section>
    </div>
  );
}

export function OfferCard({ id }: { id: Exclude<ProductId, "premium"> }) {
  const T = usePremiumText(); const { locale } = useContent(); const h = useHref(); const o = T.products[id]; const L = LOOK[id];
  const multi = skusOf(id).length > 1;
  return (
    <Link href={h(`/premium/${id}/`)} className="group block w-[78vw] max-w-[320px] shrink-0 snap-center sm:w-auto sm:max-w-none" data-testid={`offer-${id}`}>
      <ArtCard img={L.img} emblem={L.emblem} tint={L.tint} className="h-full min-h-[360px]">
        {o.badge && <span className="mb-2 rounded-full bg-gradient-to-r from-gold to-rose px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink">{o.badge}</span>}
        <p className="h-display text-2xl leading-tight">{o.name}</p>
        <p className="mb-3 mt-1 text-sm text-mist/80">{o.short}</p>
        <div className="mt-auto flex w-full items-center justify-between gap-2 border-t border-white/15 pt-3">
          <span className="text-left"><span className="h-display text-2xl text-gold">{multi ? T.price.from(eur(fromPrice(id), locale)) : eur(fromPrice(id), locale)}</span><MkdLine cents={fromPrice(id)} /></span>
          <span className="text-sm text-mist underline-offset-4 group-hover:underline">{T.offers.view} →</span>
        </div>
      </ArtCard>
    </Link>
  );
}
