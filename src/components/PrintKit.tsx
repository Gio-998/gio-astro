"use client";
import { useEffect } from "react";
import { Logo } from "./Chrome";
import { useContent, useDate } from "@/lib/content-context";
import { usePrinting } from "@/lib/print";
import { ExportPdf } from "./ExportPdf";

/** Branded band that only appears in print / Save as PDF, and opens every <details> so the full text prints. */
export function PrintKit() {
  const { locale } = useContent(); const fmt = useDate(); const printing = usePrinting();
  const date = printing ? fmt(new Date(), { year: true }) : "";
  useEffect(() => {
    if (!printing) return;
    const closed = [...document.querySelectorAll("details:not([open])")];
    closed.forEach((d) => d.setAttribute("open", ""));
    // Tall blocks may flow across pages; short ones stay whole (see @media print in globals.css).
    const tall = [...document.querySelectorAll<HTMLElement>(".card, .rounded-2xl, .rounded-3xl, .toc-card")].filter((el) => el.offsetHeight > 650);
    tall.forEach((el) => el.classList.add("print-split"));
    return () => { closed.forEach((d) => d.removeAttribute("open")); tall.forEach((el) => el.classList.remove("print-split")); };
  }, [printing]);
  return (
    <>
    <ExportPdf />
    <div className="print-only print-brand" aria-hidden>
      <span className="flex items-center gap-2"><Logo className="h-7 w-7" /><span className="print-brand-name">Horoscop</span></span>
      <span className="print-brand-meta">horoscop.si{date && <> · {date}</>}</span>
    </div>
    </>
  );
}
