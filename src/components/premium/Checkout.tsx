"use client";
import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useContent, useHref } from "@/lib/content-context";
import { useStore } from "@/lib/store";
import { useAccount } from "@/lib/sync";
import { SKUS, eur, getProvider, isSku, skusOf, yearlySavePct, type Sku } from "@/lib/payments";
import { Celebration } from "../art/Celebration";
import { Check, SheetSelect } from "../controls";
import { useAccess, addDemoGrant } from "./access";
import { usePremiumText, EarlyAccess, DemoBadge, Eur, TrustStrip } from "./bits";

const COUNTRIES = ["MK", "SI", "EU", "XX"] as const;
const COUNTRY_LABEL: Record<string, Record<(typeof COUNTRIES)[number], string>> = {
  en: { MK: "North Macedonia", SI: "Slovenia", EU: "Another EU country", XX: "Outside the EU" },
  mk: { MK: "Северна Македонија", SI: "Словенија", EU: "Друга земја од ЕУ", XX: "Надвор од ЕУ" },
};

export function CheckoutPage() {
  const T = usePremiumText(); const C = T.checkout; const acc = useAccess(); const { c, locale } = useContent(); const h = useHref();
  const params = useSearchParams(); const a = useAccount(); const s = useStore();
  const initial: Sku = isSku(params.get("sku")) ? (params.get("sku") as Sku) : "premium-yearly";
  const ret = params.get("return"); const safeReturn = ret && /^\/(en|mk)\/[\w\-/]*$/.test(ret) ? ret : null;
  const [sku, setSku] = useState<Sku>(initial);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Record<string, string>>({});
  const [people, setPeople] = useState<string[]>([]);
  const [busy, setBusy] = useState(false); const [order, setOrder] = useState("");
  const product = SKUS[sku].product;
  const name = product === "premium" ? "Premium" : T.products[product].name;
  const set = (k: string) => (e: { target: { value: string } }) => setForm({ ...form, [k]: e.target.value });

  if (!acc.ready) return <p className="py-16 text-center text-dim">{c.site.common.loading}</p>;
  if (!acc.isAdmin) return (
    <div className="mx-auto max-w-md space-y-4 py-6 text-center" data-testid="checkout-closed">
      <p className="eyebrow">{T.soon.eyebrow}</p>
      <h1 className="h-display text-4xl">{C.closed}</h1>
      <p className="text-dim">{C.closedText}</p>
      <EarlyAccess product={product} />
      <Link className="text-sm text-gold underline" href={h("/premium/")}>{T.gate.seePlans} →</Link>
    </div>
  );

  const all = s ? [...(s.me ? [s.me] : []), ...s.people] : [];
  const options = skusOf(product);
  const optLabel = (k: Sku) => product === "premium" ? (SKUS[k].interval === "year" ? `${T.toggle.yearly} · ${T.toggle.save(yearlySavePct)}` : T.toggle.monthly) : T.products[product].options?.[k]?.label ?? name;
  const done = () => safeReturn ?? h(product === "premium" ? "/book/" : product === "couple-deep-dive" ? "/match/" : `/premium/${product}/`);

  const pay = async () => {
    setBusy(true);
    const r = await getProvider().openCheckout({ sku, userId: a.user?.id ?? "", email: form.email || a.user?.email, locale, successUrl: done(), meta: { people: people.join(","), ...form } });
    setBusy(false);
    if (r.status === "success") { addDemoGrant({ product, sku, orderId: r.orderId, at: new Date().toISOString() }); setOrder(r.orderId); setStep(3); }
  };

  return (
    <div className="mx-auto max-w-lg space-y-5 pb-10" data-testid="checkout">
      <div className="flex items-center justify-between gap-2"><h1 className="h-display text-4xl">{C.title}</h1><DemoBadge /></div>
      <ol className="flex gap-1.5" aria-label={C.title}>{C.steps.map((st, i) => (
        <li key={st} className="flex-1"><span className={`block h-1.5 rounded-full ${i < step ? "bg-gold" : i === step ? "bg-rose" : "bg-white/10"}`} /><span className={`mt-1 block text-[11px] ${i === step ? "text-mist" : "text-dim"}`}>{st}</span></li>
      ))}</ol>

      {step === 0 && <div className="card space-y-3" data-testid="step-choose">
        <p className="font-semibold">{C.choose}</p>
        <p className="h-display text-2xl text-gold">{name}</p>
        <div className="grid gap-2" role="radiogroup">{options.map((k) => (
          <button type="button" key={k} role="radio" aria-checked={sku === k} onClick={() => setSku(k)} className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left ${sku === k ? "border-gold bg-gold/10" : "border-white/15 bg-white/[0.04]"}`}>
            <span className="text-sm font-medium">{optLabel(k)}</span><Eur cents={SKUS[k].cents} className="font-semibold" hintClass="text-[11px] text-dim" />
          </button>
        ))}</div>
        <button type="button" className="btn-primary w-full py-3" onClick={() => setStep(1)} data-testid="next">{C.next}</button>
      </div>}

      {step === 1 && <form className="card space-y-3" data-testid="step-details" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
        <p className="font-semibold">{C.details}</p>
        <label className="block"><span className="label">{C.name}</span><input className="input" value={form.name ?? ""} onChange={set("name")} autoComplete="name" /></label>
        <label className="block"><span className="label">{C.email}</span><input className="input" type="email" value={form.email ?? a.user?.email ?? ""} onChange={set("email")} autoComplete="email" /></label>
        <div><span className="label">{C.country}</span>
          <SheetSelect title={C.country} value={(form.country as (typeof COUNTRIES)[number]) ?? (locale === "mk" ? "MK" : "")} onChange={(v) => setForm({ ...form, country: v })} options={COUNTRIES.map((k) => ({ value: k, label: COUNTRY_LABEL[locale === "mk" ? "mk" : "en"][k] }))} />
          <p className="mt-1 text-xs text-dim">{C.countryHint}</p></div>
        {product === "couple-deep-dive" && all.length > 0 && <div><span className="label">{C.partner}</span><SheetSelect title={C.partner} value={people[0] ?? ""} onChange={(v) => setPeople([v])} options={all.filter((p) => p.id !== "me").map((p) => ({ value: p.id, label: p.name }))} /></div>}
        {product === "constellation" && <div><span className="label">{C.people}</span><div className="grid gap-1.5">{all.map((p) => (
          <label key={p.id} className="flex items-center gap-3 rounded-xl bg-white/[0.04] px-3 py-2 text-sm"><Check checked={people.includes(p.id)} onChange={(v) => setPeople(v ? [...people, p.id].slice(0, 6) : people.filter((x) => x !== p.id))} />{p.name}</label>
        ))}</div></div>}
        {product === "gift-card" && <>
          <label className="block"><span className="label">{C.giftTo}</span><input className="input" value={form.giftTo ?? ""} onChange={set("giftTo")} /></label>
          <label className="block"><span className="label">{C.giftMsg}</span><textarea className="input h-24" maxLength={280} value={form.giftMsg ?? ""} onChange={set("giftMsg")} /></label>
          <label className="block"><span className="label">{C.giftDate}</span><input className="input" type="date" value={form.giftDate ?? ""} onChange={set("giftDate")} /></label>
        </>}
        {product === "session" && <>
          <label className="block"><span className="label">{C.session.topic}</span><textarea className="input h-24" value={form.topic ?? ""} onChange={set("topic")} /></label>
          <label className="block"><span className="label">{C.session.times}</span><input className="input" value={form.times ?? ""} onChange={set("times")} placeholder={locale === "mk" ? "пр. вт или чет навечер" : "e.g. Tue or Thu evening"} /></label>
          <div><span className="label">{C.session.lang}</span><SheetSelect title={C.session.lang} value={(form.lang as "en" | "mk") ?? locale} onChange={(v) => setForm({ ...form, lang: v })} options={[{ value: "en", label: "English" }, { value: "mk", label: "Македонски" }]} /></div>
        </>}
        {product === "hardcover" && <label className="block"><span className="label">{C.shipping}</span><textarea className="input h-24" value={form.address ?? ""} onChange={set("address")} autoComplete="street-address" /></label>}
        <div className="flex gap-2"><button type="button" className="btn-ghost flex-1" onClick={() => setStep(0)}>{C.back}</button><button className="btn-primary flex-[2] py-3" data-testid="next">{C.next}</button></div>
      </form>}

      {step === 2 && <div className="card space-y-4" data-testid="step-pay">
        <p className="font-semibold">{C.payment}</p>
        <div className="rounded-2xl border border-dashed border-amber/50 bg-amber/10 p-4 text-sm">⚙ {C.demoCard}</div>
        <div className="space-y-1 rounded-2xl bg-white/[0.05] p-4 text-sm">
          <div className="flex justify-between"><span>{name} · {optLabel(sku)}</span><Eur cents={SKUS[sku].cents} hintClass="hidden" /></div>
          <div className="flex justify-between border-t border-white/10 pt-2 font-semibold"><span>{C.total} <span className="font-normal text-dim">({C.vatIncl})</span></span><Eur cents={SKUS[sku].cents} hintClass="text-[11px] font-normal text-dim" /></div>
        </div>
        <p className="text-xs text-dim">{C.agree}</p>
        <button type="button" className="btn-primary w-full py-3.5 text-base" disabled={busy} onClick={pay} data-testid="pay">{busy ? C.paying : C.pay(eur(SKUS[sku].cents, locale))}</button>
        <button type="button" className="btn-ghost w-full" onClick={() => setStep(1)} disabled={busy}>{C.back}</button>
      </div>}

      {step === 3 && <div className="card relative overflow-hidden py-10 text-center" data-testid="step-done">
        <Celebration />
        <div className="mx-auto mb-3 grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-gold to-rose text-3xl text-ink">✓</div>
        <h2 className="h-display mb-2 text-3xl">{C.successTitle}</h2>
        <p className="mx-auto mb-2 max-w-sm text-sm text-dim">{C.successText}</p>
        <p className="mb-5 text-xs text-dim">{C.order}: {order}</p>
        <Link className="btn-primary px-8 py-3" href={done()} data-testid="open-unlocked">{C.open} →</Link>
      </div>}

      {step < 3 && <TrustStrip />}
    </div>
  );
}
