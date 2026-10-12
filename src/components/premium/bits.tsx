"use client";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { sb } from "@/lib/supabase";
import { useContent, useHref } from "@/lib/content-context";
import { SKUS, eur, groupThousands, type ProductId, type Sku } from "@/lib/payments";
import { Waitlist } from "../auth/Beta";
import { Segmented } from "../controls";
import { premiumText } from "./text";
import { useAccess, setPreview, clearDemoGrants, type PreviewPlan } from "./access";

export function usePremiumText() { return premiumText(useContent().locale); }

export function DemoBadge({ className = "" }: { className?: string }) {
  const T = usePremiumText();
  return <span className={`inline-flex items-center gap-1 rounded-full border border-amber/60 bg-amber/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-gold ${className}`} data-testid="demo-badge">● {T.demo.badge}</span>;
}

/** Admin → demo checkout link. Everyone else → early access. */
export function BuyButton({ sku, label, className = "btn-primary w-full py-3", returnTo }: { sku: Sku; label?: string; className?: string; returnTo?: string }) {
  const acc = useAccess(); const T = usePremiumText(); const h = useHref(); const { locale } = useContent();
  if (acc.isAdmin) {
    const q = new URLSearchParams({ sku, ...(returnTo ? { return: returnTo } : {}) });
    return <Link className={className} href={`${h("/premium/checkout/")}?${q}`} data-testid={`buy-${sku}`}>{label ?? T.checkout.pay(eur(SKUS[sku].cents, locale))}</Link>;
  }
  return <EarlyAccess product={SKUS[sku].product} className={className} />;
}

/** "Join early access": signed-in users get a one-tap list entry, visitors leave an email on the waitlist. */
export function EarlyAccess({ product, className = "btn-primary w-full py-3" }: { product: ProductId; className?: string }) {
  const T = usePremiumText(); const acc = useAccess(); const { locale } = useContent();
  const [state, setState] = useState<"idle" | "busy" | "done" | "email">("idle");
  if (state === "done") return <p role="status" className="rounded-2xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm" data-testid="early-done">✦ {T.soon.joined}</p>;
  if (state === "email") return <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-left"><p className="mb-2 text-sm text-dim">{T.soon.orEmail}</p><Waitlist source={`premium:${product}`} /></div>;
  const join = async () => {
    if (!acc.signedIn) { setState("email"); return; }
    setState("busy");
    const c = sb() as unknown as SupabaseClient | null;
    const r = c ? await c.from("premium_interest").insert({ product, locale }) : null;
    setState(!r || !r.error || r.error.code === "23505" ? "done" : "idle");
  };
  return <button type="button" className={className} onClick={join} disabled={state === "busy"} data-testid={`early-${product}`}>{state === "busy" ? "…" : `✦ ${T.soon.join}`}</button>;
}

export function DemoControls({ compact = false }: { compact?: boolean }) {
  const acc = useAccess(); const T = usePremiumText(); const D = T.demo;
  if (!acc.isAdmin) return null;
  return (
    <div className="rounded-3xl border border-amber/40 bg-amber/[0.07] p-4" data-testid="demo-controls">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-semibold text-gold">⚙ {D.controls}</p><DemoBadge /></div>
      <p className="label">{D.previewAs}</p>
      <Segmented<"off" | "free" | "premium"> label={D.previewAs} testId="preview-plan" value={acc.preview ?? "off"} onChange={(v) => setPreview(v === "off" ? null : (v as PreviewPlan))}
        options={[{ value: "off", label: D.off }, { value: "free", label: D.free }, { value: "premium", label: D.premium }]} />
      <p className="mt-2 text-xs text-dim">{D.previewHint}</p>
      {!compact && <div className="mt-3 border-t border-white/10 pt-3 text-sm">
        <p className="mb-1 text-dim">{D.grants}</p>
        {acc.grants.length === 0 ? <p className="text-xs text-dim">{D.noGrants}</p> : <ul className="space-y-1 text-xs">{acc.grants.map((g) => <li key={g.orderId} className="flex justify-between gap-2"><span>{T.products[g.product]?.name ?? "Premium"} · {g.sku}</span><span className="text-dim">{g.orderId}</span></li>)}</ul>}
        {acc.grants.length > 0 && <button type="button" className="mt-2 text-xs text-rose underline" onClick={clearDemoGrants}>{D.clear}</button>}
      </div>}
    </div>
  );
}

export function Price({ cents, suffix, className = "" }: { cents: number; suffix?: string; className?: string }) {
  const { locale } = useContent();
  return <span className={className}><span className="h-display text-4xl text-mist">{eur(cents, locale)}</span>{suffix && <span className="ml-1 text-sm text-dim">{suffix}</span>}</span>;
}

// ---------- MKD hint for visitors in North Macedonia ----------
/** Fixed reference rate (the denar is pegged to the euro at about 61.5). Display only; you always pay in EUR. */
export const MKD_PER_EUR = 61.5;
const noSub = () => () => {};
function inMacedonia(): boolean {
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone === "Europe/Skopje"; } catch { return false; }
}
export function useShowMkd(): boolean {
  const { locale } = useContent();
  const tz = useSyncExternalStore(noSub, inMacedonia, () => false);
  return locale === "mk" || tz;
}
export const mkd = (cents: number, locale: string) => `${groupThousands(Math.round((cents / 100) * MKD_PER_EUR / 10) * 10, locale === "mk" ? "." : ",")} ${locale === "mk" ? "ден." : "MKD"}`;

/** "€49" plus, for North Macedonia, "about 3,010 MKD". */
export function Eur({ cents, className = "", hintClass = "text-xs text-dim" }: { cents: number; className?: string; hintClass?: string }) {
  const { locale } = useContent(); const show = useShowMkd(); const T = usePremiumText();
  return <><span className={className}>{eur(cents, locale)}</span>{show && <span className={`ml-1.5 whitespace-nowrap ${hintClass}`} data-testid="mkd">({T.mkd(mkd(cents, locale))})</span>}</>;
}

export function TrustStrip({ className = "" }: { className?: string }) {
  const T = usePremiumText();
  return (
    <section className={`rounded-[28px] border border-sage/30 bg-gradient-to-br from-sage/[0.08] to-white/[0.02] p-4 sm:p-6 ${className}`} data-testid="trust-strip">
      <p className="eyebrow mb-3 !text-sage">✓ {T.trustStrip.title}</p>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {T.trustStrip.items.map((t) => (
          <li key={t.title} className="flex gap-3 lg:flex-col lg:gap-1.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-sage/40 bg-sage/10 text-sm text-sage">{t.icon}</span>
            <span><span className="block text-sm font-semibold">{t.title}</span><span className="block text-xs leading-snug text-mist/75">{t.text}</span></span>
          </li>
        ))}
      </ul>
    </section>
  );
}
