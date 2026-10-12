"use client";
import { useRef, useState } from "react";
import type { PairReport } from "@/engine/compat";
import { useContent } from "@/lib/content-context";
import { haptic } from "@/lib/haptics";

type Card = { key: string; name: string; text: string; tip: string; lenses: string; good: boolean };

/** Swipe stack of bond themes: right = "so true", left = "not us". Votes are kept on this device. */
export function BondSwipe({ report, pairKey }: { report: PairReport; pairKey: string }) {
  const { c } = useContent(); const S = c.sky.swipe; const T = c.compat.themes; const L = c.compat.lenses;
  const cards: Card[] = [
    ...report.superpowers.map((x) => ({ key: `+${x.theme}`, name: T[x.theme].name, text: T[x.theme].plus, tip: T[x.theme].practices[0], lenses: x.lenses.map((l) => L[l].name).join(" · "), good: true })),
    ...report.growthEdges.map((x) => ({ key: `-${x.theme}`, name: T[x.theme].name, text: T[x.theme].minus, tip: T[x.theme].practices[1], lenses: x.lenses.map((l) => L[l].name).join(" · "), good: false })),
  ].slice(0, 8);
  const store = `horoscop:bond-votes:${pairKey}`;
  const [i, setI] = useState(0); const [dx, setDx] = useState(0); const start = useRef<number | null>(null); const [drag, setDrag] = useState(false);
  if (!cards.length) return null;
  const vote = (yes: boolean) => {
    haptic(yes ? "success" : "tick");
    try { const v = JSON.parse(localStorage.getItem(store) || "{}"); v[cards[i].key] = yes ? 1 : -1; localStorage.setItem(store, JSON.stringify(v)); } catch { /* ignore */ }
    setDx(0); setI((n) => n + 1);
  };
  const cur = cards[i];
  return (
    <section className="card mb-4 overflow-hidden print:hidden" data-testid="bond-swipe">
      <h2 className="h-display text-2xl text-balance">{S.title}</h2>
      <p className="mb-3 text-[13px] text-dim text-pretty">{S.sub}</p>
      {cur ? (
        <>
          <div className="relative h-[300px]">
            {cards.slice(i + 1, i + 3).reverse().map((x, k, arr) => (
              <div key={x.key} aria-hidden className="absolute inset-0 rounded-3xl border border-white/10 bg-white/[0.04]" style={{ transform: `translateY(${(arr.length - k) * 8}px) scale(${1 - (arr.length - k) * 0.04})` }} />
            ))}
            <div role="group" aria-label={cur.name}
              onPointerDown={(e) => { start.current = e.clientX; setDrag(true); (e.target as HTMLElement).setPointerCapture?.(e.pointerId); }}
              onPointerMove={(e) => { if (start.current !== null) setDx(e.clientX - start.current); }}
              onPointerUp={() => { const d = dx; start.current = null; setDrag(false); if (Math.abs(d) > 90) vote(d > 0); else setDx(0); }}
              className={`absolute inset-0 flex touch-pan-y select-none flex-col rounded-3xl border p-5 shadow-[0_30px_60px_-30px_rgba(0,0,0,.9)] ${cur.good ? "border-gold/40 bg-gradient-to-b from-[#3a2a6e] to-[#1a1442]" : "border-rose/40 bg-gradient-to-b from-[#4a2350] to-[#1a1442]"}`}
              style={{ transform: `translateX(${dx}px) rotate(${dx / 18}deg)`, transition: drag ? "none" : "transform .25s" }}>
              <p className="eyebrow !text-[10px]">{S.count(i + 1, cards.length)} · {cur.good ? S.harmony : S.spark}</p>
              <p className="h-display mt-1 text-[28px] leading-tight text-balance">{cur.name}</p>
              <p className="mt-3 text-[15.5px] leading-relaxed text-pretty">{cur.text}</p>
              <p className="mt-auto text-[13px] text-gold/90 text-pretty">✦ {cur.tip}</p>
              <p className="mt-1 truncate text-[11px] text-dim">{cur.lenses}</p>
              <span className={`pointer-events-none absolute right-4 top-4 rounded-full border-2 border-sage px-3 py-1 text-sm font-bold text-sage transition-opacity ${dx > 40 ? "opacity-100" : "opacity-0"}`}>{S.yes}</span>
              <span className={`pointer-events-none absolute left-4 top-4 rounded-full border-2 border-rose px-3 py-1 text-sm font-bold text-rose transition-opacity ${dx < -40 ? "opacity-100" : "opacity-0"}`}>{S.no}</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button className="btn-ghost min-h-[52px]" onClick={() => vote(false)}>✕ {S.no}</button>
            <button className="btn-primary min-h-[52px]" onClick={() => vote(true)}>♡ {S.yes}</button>
          </div>
        </>
      ) : (
        <div className="py-6 text-center"><p className="text-pretty">{S.done}</p><button className="mt-3 min-h-[44px] text-sm text-gold underline" onClick={() => setI(0)}>{S.again}</button></div>
      )}
    </section>
  );
}
