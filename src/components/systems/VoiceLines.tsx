"use client";
import { createContext, useContext, useState } from "react";
import type { VoiceLine } from "@/story/voice";
import { useContent } from "@/lib/content-context";

const MARK: Record<VoiceLine["kind"], string> = { open: "✦", connect: "⟡", echo: "❝", validate: "✓", challenge: "➶", care: "♡" };

/** One personal sentence with a tap-to-reveal "why we say this" list of the data behind it. */
export function VoiceLineView({ line, className = "" }: { line: VoiceLine; className?: string }) {
  const { c } = useContent(); const V = c.systems.voice; const [open, setOpen] = useState(false);
  return (
    <div className={`group ${className}`} data-testid="voice-line">
      <p className="leading-relaxed"><span aria-hidden className="mr-1.5 text-gold">{MARK[line.kind]}</span>{line.text}{" "}
        <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="ml-0.5 inline-flex min-h-[32px] items-center rounded-full border border-white/15 px-2 text-[11px] uppercase tracking-wider text-dim align-middle transition hover:border-gold/50 hover:text-gold">
          {open ? V.whyClose : `ⓘ ${V.why}`}
        </button>
      </p>
      {open && (
        <div className="mt-2 rounded-xl border border-gold/25 bg-gold/[0.06] px-3 py-2 text-xs">
          <p className="mb-1 text-dim">{V.whyLead}</p>
          <ul className="flex flex-wrap gap-1.5">{line.why.filter(Boolean).map((w, i) => <li key={i} className="chip !text-[11px] text-mist">{w}</li>)}</ul>
        </div>
      )}
    </div>
  );
}
export function VoiceLines({ lines, className = "" }: { lines: VoiceLine[]; className?: string }) {
  return <div className={`space-y-3 ${className}`}>{lines.map((l, i) => <VoiceLineView key={i} line={l} />)}</div>;
}

/** Per-chapter personal openers for Book of You / Bond Story (provided by the page, read by BookView). */
export const VoiceOpenersCtx = createContext<Record<string, VoiceLine>>({});
export function ChapterOpener({ id }: { id: string }) {
  const line = useContext(VoiceOpenersCtx)[id];
  return line ? <div className="not-reading mb-4 rounded-2xl border border-gold/25 bg-gold/[0.05] px-4 py-3 text-[15px]" data-testid="chapter-opener"><VoiceLineView line={line} /></div> : null;
}
