"use client";
import { useRef } from "react";

/** Six segmented boxes for a one-time code: paste the whole code anywhere, auto-advance, backspace goes back, arrow keys move. */
export function CodeInput({ value, onChange, onComplete, disabled, label, error }: { value: string; onChange: (v: string) => void; onComplete?: (v: string) => void; disabled?: boolean; label: (i: number) => string; error?: boolean }) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length: 6 }, (_, i) => value[i] ?? "");
  const setAt = (i: number, d: string) => {
    const next = digits.slice(); next[i] = d; const v = next.join("").slice(0, 6);
    onChange(v);
    if (v.replace(/\s/g, "").length === 6 && /^\d{6}$/.test(v)) onComplete?.(v);
  };
  const fill = (raw: string, from = 0) => {
    const only = raw.replace(/\D/g, "").slice(0, 6 - from); if (!only) return;
    const next = digits.slice(); only.split("").forEach((d, k) => { next[from + k] = d; });
    const v = next.join(""); onChange(v);
    refs.current[Math.min(5, from + only.length)]?.focus();
    if (/^\d{6}$/.test(v)) onComplete?.(v);
  };
  return (
    <div className="flex justify-center gap-2 sm:gap-3" role="group" onPaste={(e) => { e.preventDefault(); fill(e.clipboardData.getData("text")); }}>
      {digits.map((d, i) => (
        <input key={i} ref={(el) => { refs.current[i] = el; }} value={d} disabled={disabled} aria-label={label(i + 1)} data-testid={`otp-${i}`}
          inputMode="numeric" autoComplete={i === 0 ? "one-time-code" : "off"} maxLength={i === 0 ? 6 : 1} pattern="[0-9]*"
          className={`h-14 w-11 rounded-2xl border bg-white/[0.08] text-center font-serif text-2xl text-mist outline-none transition sm:h-16 sm:w-14 sm:text-3xl
            focus:border-gold/80 focus:bg-white/[0.14] focus:shadow-[0_0_0_4px_rgba(246,207,122,.18)] ${error ? "border-rose/70 animate-[shake_.3s]" : d ? "border-gold/50" : "border-white/20"}`}
          onFocus={(e) => e.currentTarget.select()}
          onChange={(e) => { const v = e.target.value.replace(/\D/g, ""); if (v.length > 1) return fill(v, i); setAt(i, v); if (v && i < 5) refs.current[i + 1]?.focus(); }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !digits[i] && i > 0) { e.preventDefault(); setAt(i - 1, ""); refs.current[i - 1]?.focus(); }
            else if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
            else if (e.key === "ArrowRight" && i < 5) refs.current[i + 1]?.focus();
          }} />
      ))}
    </div>
  );
}
