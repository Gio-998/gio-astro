"use client";
import type { PlayGameResult } from "@/engine/play";

export interface GameProps { onDone: (r: PlayGameResult) => void }

/** Phone-first game surface: progress pills, a title line and a tall stage. */
export function GameFrame({ step, total, label, right, children, testId }: { step: number; total: number; label: string; right?: React.ReactNode; children: React.ReactNode; testId?: string }) {
  return (
    <div data-testid={testId} className="relative mx-auto w-full max-w-md select-none overflow-hidden rounded-[30px] border border-white/15 bg-gradient-to-b from-ink/90 via-night/95 to-ink/90 p-4 shadow-[0_30px_80px_-40px_rgba(139,108,240,.9)] [touch-action:manipulation] sm:p-5">
      <div className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full bg-violet/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 h-60 w-60 rounded-full bg-rose/15 blur-3xl" />
      <div className="relative mb-3 flex items-center gap-1" aria-label={`${step} / ${total}`}>
        {Array.from({ length: total }, (_, k) => <span key={k} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${k < step - 1 ? "bg-gradient-to-r from-amber to-gold" : k === step - 1 ? "bg-rose" : "bg-white/10"}`} />)}
      </div>
      <div className="relative mb-3 flex items-center justify-between text-xs text-dim"><span className="eyebrow !text-[10px]">{label}</span>{right}</div>
      <div className="relative">{children}</div>
    </div>
  );
}

/** Big tactile choice button. */
export function Choice({ children, onClick, disabled, active, className = "", testId }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; active?: boolean; className?: string; testId?: string }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} data-testid={testId}
      className={`min-h-[52px] w-full rounded-2xl border px-4 py-3 text-left text-[15px] transition duration-150 active:scale-[.97] disabled:opacity-50 ${active ? "border-gold bg-gold/15 shadow-[0_0_24px_-6px_rgba(246,207,122,.7)]" : "border-white/12 bg-white/[0.05] hover:border-gold/40 hover:bg-white/10"} ${className}`}>
      {children}
    </button>
  );
}
