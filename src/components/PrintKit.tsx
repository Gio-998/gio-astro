"use client";
import { useEffect, useState } from "react";
import { Logo } from "./Chrome";
import { useContent } from "@/lib/content-context";
import { usePrinting } from "@/lib/print";

/** Branded band that only appears in print / Save as PDF, and opens every <details> so the full text prints. */
export function PrintKit() {
  const { locale } = useContent(); const printing = usePrinting();
  const [date, setDate] = useState("");
  useEffect(() => {
    if (!printing) return;
    setDate(new Intl.DateTimeFormat(locale === "mk" ? "mk-MK" : "en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date()));
    const closed = [...document.querySelectorAll("details:not([open])")];
    closed.forEach((d) => d.setAttribute("open", ""));
    return () => closed.forEach((d) => d.removeAttribute("open"));
  }, [printing, locale]);
  return (
    <div className="print-only print-brand" aria-hidden>
      <span className="flex items-center gap-2"><Logo className="h-7 w-7" /><span className="print-brand-name">Horoscop</span></span>
      <span className="print-brand-meta">horoscop.si{date && <> · {date}</>}</span>
    </div>
  );
}
