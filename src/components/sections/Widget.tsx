"use client";
import dynamic from "next/dynamic";

/** Client tools shown on calculator pages (NumModel.widget). The page's written content is static HTML; the tool, its form and the engine load in their own chunk. */
const CalcTool = dynamic(() => import("./CalcTool").then((m) => m.CalcTool), {
  ssr: false,
  loading: () => <div aria-hidden className="mx-auto min-h-[27rem] max-w-2xl rounded-2xl border border-gold/25 bg-white/[0.03] lg:rounded-3xl" />,
});

export function SectionWidget({ kind, lang }: { kind: "rising-sign" | "moon-sign" | "birth-chart"; lang: string }) {
  return <CalcTool kind={kind} lang={lang} />;
}
