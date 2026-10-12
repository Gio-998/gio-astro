"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useContent, useHref } from "@/lib/content-context";
import { SKUS, eur, yearlySavePct } from "@/lib/payments";
import { Sheet } from "../controls";
import { useAccess } from "./access";
import { usePremiumText, BuyButton, EarlyAccess, DemoBadge } from "./bits";

export type GateKind = "book" | "bond" | "day";
/** How many chapters stay free when locks are on. */
export const FREE_CHAPTERS: Record<"book" | "bond", number> = { book: 3, bond: 2 };

/** Number of chapters to show in full (Infinity when nothing is locked for this viewer). */
export function useChapterLimit(kind: "book" | "bond"): number {
  const acc = useAccess();
  return acc.has("premium") ? Infinity : FREE_CHAPTERS[kind];
}

/**
 * Locked premium section: the real content, cut short and blurred under a soft fade, with an "Unlock with Premium"
 * card on top. Renders children untouched when the viewer has Premium (or locks are off).
 */
export function PremiumGate({ kind, children, rest = [] }: { kind: GateKind; children: React.ReactNode; rest?: string[] }) {
  const acc = useAccess(); const T = usePremiumText(); const G = T.gate;
  const [open, setOpen] = useState(false);
  if (acc.has("premium")) return <>{children}</>;
  return (
    <div className="relative" data-testid={`gate-${kind}`}>
      <div className="pointer-events-none relative max-h-[340px] select-none overflow-hidden" aria-hidden>
        <div className="[filter:blur(5px)] opacity-80">{children}</div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--gate-fade,#17123d)]" />
      </div>
      <div className="relative -mt-40 px-2 pb-2">
        <div className="mx-auto max-w-md rounded-[28px] border border-gold/40 bg-[#1b1546]/95 p-5 text-center text-mist shadow-[0_30px_80px_-30px_rgba(246,207,122,.55)] backdrop-blur">
          <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-gold to-rose px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-ink">🔒 {G.badge}</span>
          <p className="h-display mb-1 text-2xl leading-tight">{G.titles[kind]}</p>
          <p className="mb-3 text-sm text-dim">{G.texts[kind]}</p>
          {rest.length > 0 && <ul className="mb-4 space-y-1 text-left text-sm">{rest.slice(0, 8).map((t) => <li key={t} className="flex items-center gap-2 rounded-xl bg-white/[0.05] px-3 py-1.5"><span className="text-xs">🔒</span>{t}</li>)}</ul>}
          <button type="button" className="btn-primary w-full py-3" onClick={() => setOpen(true)} data-testid="unlock">✦ {G.unlock}</button>
          {acc.isAdmin && <p className="mt-2 text-[11px] text-gold/80">{T.demo.banner(T.demo.free)}</p>}
        </div>
      </div>
      <UnlockSheet open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

export function UnlockSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const T = usePremiumText(); const G = T.gate; const { locale } = useContent(); const h = useHref(); const acc = useAccess();
  const path = usePathname() || "/";
  const [yearly, setYearly] = useState(true);
  const sku = yearly ? "premium-yearly" : "premium-monthly";
  return (
    <Sheet open={open} onClose={onClose} title={<>✦ {G.sheetTitle}</>} testId="unlock-sheet"
      footer={<div className="space-y-2">
        {acc.isAdmin ? <BuyButton sku={sku} label={`${G.demoCheckout} · ${eur(SKUS[sku].cents, locale)}`} returnTo={path} /> : <EarlyAccess product="premium" />}
        <div className="flex justify-between text-sm"><Link className="text-gold underline-offset-4 hover:underline" href={h("/premium/")}>{G.seePlans} →</Link><button type="button" className="text-dim" onClick={onClose}>{G.later}</button></div>
      </div>}>
      {acc.isAdmin && <div className="mb-2"><DemoBadge /></div>}
      {!acc.isAdmin && <p className="mb-2 rounded-xl border border-gold/30 bg-gold/10 px-3 py-2 text-sm">{T.soon.text}</p>}
      <p className="mb-3 text-sm text-mist/90">{G.sheetLead}</p>
      <div className="mb-3 grid grid-cols-2 gap-2" role="radiogroup" aria-label={T.toggle.label}>
        {([false, true] as const).map((y) => {
          const s = SKUS[y ? "premium-yearly" : "premium-monthly"]; const sel = yearly === y;
          return (
            <button type="button" key={String(y)} role="radio" aria-checked={sel} onClick={() => setYearly(y)}
              className={`relative rounded-2xl border p-3 text-left transition ${sel ? "border-gold bg-gold/10" : "border-white/15 bg-white/[0.04]"}`}>
              {y && <span className="absolute -top-2 right-2 rounded-full bg-sage px-2 py-0.5 text-[10px] font-bold text-ink">{T.toggle.save(yearlySavePct)}</span>}
              <span className="block text-xs text-dim">{y ? T.toggle.yearly : T.toggle.monthly}</span>
              <span className="h-display text-2xl">{eur(s.cents, locale)}</span><span className="text-xs text-dim"> {y ? T.price.perYear : T.price.perMonth}</span>
            </button>
          );
        })}
      </div>
      <ul className="mb-2 space-y-1.5 text-sm">{T.plans.premium.items.map((i) => <li key={i} className="flex gap-2"><span className="text-gold">✦</span>{i}</li>)}</ul>
      <p className="text-xs text-dim">{T.hero.trust.join(" · ")}</p>
    </Sheet>
  );
}
