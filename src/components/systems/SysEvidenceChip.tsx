"use client";
import { useContent } from "@/lib/content-context";
import type { SysEvidence } from "@/content/en/systems/meta";
const TONE: Record<SysEvidence, string> = { astronomy: "border-sky-300/40 text-sky-200", traditional: "border-gold/40 text-gold", modern: "border-rose/40 text-rose", research: "border-sage/40 text-sage", popular: "border-lilac/40 text-lilac" };
export function SysEvidenceChip({ e, compact = false }: { e: SysEvidence; compact?: boolean }) {
  const { c } = useContent(); const x = c.systems.evidence[e];
  return <span className={`chip ${TONE[e]} ${compact ? "!px-2 !py-0.5 !text-[10px]" : ""}`} title={x.text}>{x.icon}{compact ? "" : ` ${x.label}`}</span>;
}
