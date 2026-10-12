"use client";
import { useId, useState } from "react";
import { useGlance } from "./text";

/** Collapsed details under a one-glance summary. Smooth height via the grid-rows trick. */
export function Expand({ children, more, less, defaultOpen = false, className = "", testId }: { children: React.ReactNode; more?: string; less?: string; defaultOpen?: boolean; className?: string; testId?: string }) {
  const G = useGlance(); const [open, setOpen] = useState(defaultOpen); const id = useId();
  return (
    <div className={className}>
      <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)} data-testid={testId}
        className="group mt-3 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 text-sm text-mist transition hover:border-gold/50 hover:text-gold">
        <span>{open ? (less ?? G.showLess) : (more ?? G.showMore)}</span>
        <span className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} aria-hidden>⌄</span>
      </button>
      <div id={id} className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="min-h-0 overflow-hidden"><div className="pt-3">{open && children}</div></div>
      </div>
    </div>
  );
}

/** Summary card: eyebrow, big title, one-line headline, optional visual. */
export function GlanceHead({ eyebrow, title, line, visual, testId }: { eyebrow?: string; title?: React.ReactNode; line?: React.ReactNode; visual?: React.ReactNode; testId?: string }) {
  return (
    <div data-testid={testId} className="flex flex-col items-center gap-3 text-center">
      {visual}
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      {title && <p className="h-display text-[1.9rem] leading-tight text-gold">{title}</p>}
      {line && <p className="max-w-md text-[15px] leading-relaxed text-mist/90">{line}</p>}
    </div>
  );
}
