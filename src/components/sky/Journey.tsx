"use client";
import Link from "next/link";
import { useContent, useHref } from "@/lib/content-context";
import { haptic } from "@/lib/haptics";

/** Bonds: saved people as stars around you; orbit radius follows the overall resonance. */
export function BondsConstellation({ items }: { items: { id: string; name: string; score: number; color: string }[] }) {
  const { c } = useContent(); const h = useHref(); const B = c.sky.bonds;
  if (items.length === 0) return null;
  const W = 340, cx = W / 2, cy = W / 2;
  return (
    <section className="card mb-4 overflow-hidden" data-testid="bonds-map">
      <h2 className="h-display text-2xl text-balance">{B.map}</h2>
      <p className="mb-2 text-[13px] text-dim text-pretty">{B.mapSub}</p>
      <svg viewBox={`0 0 ${W} ${W}`} className="mx-auto block w-full max-w-[360px]" role="img" aria-label={B.map}>
        <defs><radialGradient id="bc-you"><stop offset="0" stopColor="#ffd77a" /><stop offset="1" stopColor="#ffd77a" stopOpacity="0" /></radialGradient></defs>
        {[60, 105, 150].map((r) => <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,.09)" strokeDasharray="2 6" />)}
        <circle cx={cx} cy={cy} r={34} fill="url(#bc-you)" className="animate-pulse" />
        <circle cx={cx} cy={cy} r={9} fill="#ffd77a" />
        <text x={cx} y={cy + 28} textAnchor="middle" fontSize="12" fill="#f3eefe">{B.you}</text>
        {items.map((p, i) => {
          const r = 55 + (1 - Math.min(1, Math.max(0, p.score / 100))) * 100;
          const a = (i / items.length) * Math.PI * 2 - Math.PI / 2 + 0.4;
          const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
          return (
            <Link key={p.id} href={h(`/match/?b=${p.id}`)} onClick={() => haptic("soft")}>
              <line x1={cx} y1={cy} x2={x} y2={y} stroke={p.color} strokeOpacity=".35" />
              <circle cx={x} cy={y} r={16} fill={p.color} fillOpacity=".25" />
              <circle cx={x} cy={y} r={7} fill={p.color} />
              <text x={x} y={y + 26} textAnchor="middle" fontSize="12" fill="#f3eefe">{p.name.length > 12 ? p.name.slice(0, 11) + "…" : p.name}</text>
              <text x={x} y={y - 14} textAnchor="middle" fontSize="10" fill="#ffd77a">{Math.round(p.score)}</text>
            </Link>
          );
        })}
      </svg>
    </section>
  );
}
