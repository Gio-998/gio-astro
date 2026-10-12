"use client";
import { useEffect, useRef, useState } from "react";
import { Aura } from "./Aura";
import { auraOf } from "@/lib/aura";
import type { StoredPerson } from "@/lib/store";
import { useContent } from "@/lib/content-context";

/** Two symbolic auras that drift together and blend when scrolled into view; harmony sets how far they merge. */
export function AuraPair({ a, b, harmony }: { a: StoredPerson; b: StoredPerson; harmony: number }) {
  const { c } = useContent(); const ref = useRef<HTMLDivElement>(null); const [seen, setSeen] = useState(false);
  useEffect(() => { const el = ref.current; if (!el) return; const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { threshold: 0.4 }); io.observe(el); return () => io.disconnect(); }, []);
  const target = 0.35 + Math.max(0, Math.min(100, harmony)) / 100 * 0.55;
  return (
    <div ref={ref} className="card mb-4 text-center">
      <p className="eyebrow mb-1">✦ {c.ui.ritual.bondAura}</p>
      <div className="relative mx-auto h-56 w-full max-w-lg sm:h-64">
        <Aura className="h-full w-full" body={false} {...auraOf(a)} partner={auraOf(b)} merge={seen ? target : 0} label={`${a.name} & ${b.name}`} />
        <span className="absolute bottom-2 left-4 text-xs text-dim">{a.name}</span><span className="absolute bottom-2 right-4 text-xs text-dim">{b.name}</span>
      </div>
      <p className="text-xs text-dim">{c.ui.ritual.auraNote}</p>
    </div>
  );
}
