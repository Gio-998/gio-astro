"use client";
import Link from "next/link";
import { useState } from "react";
import { useContent, useHref } from "@/lib/content-context";
import { SKUS, skusOf, type ProductId, type Sku } from "@/lib/payments";
import { ArtCard } from "../art/ArtCard";
import { Reveal } from "../art/Reveal";
import { usePremiumText, BuyButton, Eur, TrustStrip, DemoBadge } from "./bits";
import { AdminDemoBar, OfferCard } from "./PremiumPage";
import { useAccess } from "./access";
import { LOOK } from "./text";
import { OFFERS } from "@/lib/payments";

export function ProductPage({ id }: { id: Exclude<ProductId, "premium"> }) {
  const T = usePremiumText(); const U = T.productUi; const o = T.products[id]; const L = LOOK[id]; const h = useHref(); const acc = useAccess();
  useContent();
  const skus = skusOf(id);
  const [sku, setSku] = useState<Sku>(skus[skus.length - 1]);
  const cents = SKUS[sku].cents;
  return (
    <div className="space-y-12 pb-16" data-testid={`product-${id}`}>
      <div>
        <AdminDemoBar />
        <Link href={h("/premium/")} className="mb-4 inline-block text-sm text-dim hover:text-gold">← {U.back}</Link>
        <section className="grid items-center gap-6 md:grid-cols-[260px_1fr]">
          <ArtCard img={L.img} emblem={L.emblem} tint={L.tint} className="mx-auto h-[300px] w-[220px] md:h-[360px] md:w-[260px]">
            <p className="mt-auto h-display text-xl text-gold">{o.name}</p>
          </ArtCard>
          <div className="text-center md:text-left">
            {o.badge && <span className="mb-2 inline-block rounded-full bg-gradient-to-r from-gold to-rose px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink">{o.badge}</span>}
            <h1 className="h-display mb-2 text-[clamp(2.3rem,9vw,3.8rem)] leading-[1]">{o.name}</h1>
            <p className="mb-4 text-lg italic text-mist/85">{o.tagline}</p>
            <p><Eur cents={cents} className="h-display text-5xl text-gold" /></p>
            <p className="mb-4 text-xs text-dim">{U.once} · {T.price.vat}</p>
            <BuySection id={id} skus={skus} sku={sku} setSku={setSku} />
          </div>
        </section>
      </div>

      <TrustStrip />

      <section className="mx-auto max-w-2xl space-y-4 text-[1.05rem] leading-relaxed text-mist/90">
        {o.pitch.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
      </section>

      <section>
        <h2 className="h-display mb-3 text-3xl">{U.youGet}</h2>
        <ul className="grid gap-2 sm:grid-cols-2">{o.youGet.map((g) => <li key={g} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm"><span className="text-gold">✦</span>{g}</li>)}</ul>
      </section>

      <section>
        <h2 className="h-display mb-1 text-3xl">{o.sampleTitle}</h2>
        <p className="mb-3 text-sm text-dim">{o.sampleNote}</p>
        <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 no-scrollbar" data-testid="sample-pages">
          {o.sample.map((pg, i) => (
            <Reveal key={pg.heading} delay={i * 0.05} className="w-[82vw] max-w-[360px] shrink-0 snap-center">
              <article className="paper-surface relative h-full min-h-[300px] rounded-[22px] px-5 pb-8 pt-6">
                <p className="mb-2 font-[family-name:var(--font-cinzel)] text-[10px] uppercase tracking-[0.25em] text-[#b8862f]">{o.name} · {i + 1}/{o.sample.length}</p>
                <h3 className="h-display mb-3 text-2xl leading-tight text-[#6a3f8f]">{pg.heading}</h3>
                <p className="h-display text-[1.12rem] leading-relaxed">{pg.body}</p>
                <span className="absolute bottom-3 right-4 text-xs text-[#b8862f]">✦</span>
              </article>
            </Reveal>
          ))}
        </div>
        {o.sample.length > 1 && <p className="text-center text-xs text-dim sm:hidden">{U.swipe} →</p>}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <h2 className="h-display mb-3 text-2xl">{U.format}</h2>
          <dl className="divide-y divide-white/10 text-sm">{o.format.map(([k, v]) => <div key={k} className="flex justify-between gap-4 py-2"><dt className="text-dim">{k}</dt><dd className="text-right">{v}</dd></div>)}</dl>
        </div>
        <div className="card">
          <h2 className="h-display mb-3 text-2xl">{U.forWho}</h2>
          <p className="text-sm text-mist/90">{o.forWho}</p>
        </div>
      </section>

      <section>
        <h2 className="h-display mb-3 text-3xl">{U.faq}</h2>
        <div className="space-y-2">{[...o.faq, ...T.faq.items.slice(0, 2)].map((f) => (
          <details key={f.q} className="group rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-3"><summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-medium">{f.q}<span className="text-gold transition group-open:rotate-45">+</span></summary><p className="mt-2 text-sm text-mist/85">{f.a}</p></details>
        ))}</div>
      </section>

      <section id="buy" className="scroll-mt-24 rounded-[32px] border border-gold/30 bg-gradient-to-br from-violet/25 to-rose/15 p-6 text-center">
        {acc.isAdmin ? <DemoBadge className="mb-2" /> : <p className="eyebrow mb-2">{T.soon.eyebrow}</p>}
        <p className="h-display mb-1 text-3xl">{o.name}</p>
        <p className="mb-4"><Eur cents={cents} className="h-display text-3xl text-gold" /></p>
        {!acc.isAdmin && <p className="mx-auto mb-4 max-w-md text-sm text-dim">{T.soon.text}</p>}
        <div className="mx-auto max-w-sm"><BuyButton sku={sku} /></div>
      </section>

      <section>
        <h2 className="h-display mb-3 text-2xl">{T.offers.title}</h2>
        <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-3 no-scrollbar">{OFFERS.filter((x) => x !== id).map((x) => <OfferCard key={x} id={x} />)}</div>
      </section>

    </div>
  );
}

function BuySection({ id, skus, sku, setSku }: { id: ProductId; skus: Sku[]; sku: Sku; setSku: (s: Sku) => void }) {
  const T = usePremiumText(); const o = T.products[id];
  return (
    <div className="mx-auto max-w-sm space-y-3 md:mx-0">
      {skus.length > 1 && o.options && (
        <div role="radiogroup" aria-label={T.productUi.choose} className="grid gap-2">
          {skus.map((s) => (
            <button type="button" key={s} role="radio" aria-checked={sku === s} onClick={() => setSku(s)} data-testid={`opt-${s}`}
              className={`rounded-2xl border px-4 py-3 text-left transition ${sku === s ? "border-gold bg-gold/10" : "border-white/15 bg-white/[0.04]"}`}>
              <span className="flex items-center justify-between gap-2"><span className="font-semibold">{o.options![s]?.label}</span><Eur cents={SKUS[s].cents} className="text-gold" hintClass="text-[11px] text-dim" /></span>
              <span className="block text-xs text-dim">{o.options![s]?.note}</span>
            </button>
          ))}
        </div>
      )}
      <BuyButton sku={sku} />
    </div>
  );
}
