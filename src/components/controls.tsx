"use client";
/**
 * Custom, phone-first form controls. No native <select>, date/time inputs or raw checkboxes in the UI:
 * - Sheet: bottom sheet on phones, centred card on wider screens
 * - SheetSelect: tappable field that opens a list of options in a Sheet
 * - Wheel: scroll-snap wheel column (used by the date and time pickers)
 * - TimePicker: hour/minute wheels in a Sheet
 * - Toggle: on/off switch; Check: styled checkbox; Segmented: segmented control
 */
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useContent } from "@/lib/content-context";

const noop = () => () => {};
/** true after hydration (portals need document). */
export function useMounted() { return useSyncExternalStore(noop, () => true, () => false); }

export function Sheet({ open, onClose, title, children, footer, testId }: { open: boolean; onClose: () => void; title?: React.ReactNode; children: React.ReactNode; footer?: React.ReactNode; testId?: string }) {
  const reduce = useReducedMotion(); const close = useContent().c.lensUi.close; const mounted = useMounted();
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    const prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, onClose]);
  if (!mounted) return null;
  // Portal to <body>: cards use backdrop-filter, which would trap position:fixed inside them.
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button type="button" aria-label={close} className="absolute inset-0 bg-[#07051a]/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div role="dialog" aria-modal="true" data-testid={testId}
            className="relative flex max-h-[85dvh] w-full flex-col overflow-hidden rounded-t-[28px] border border-white/15 bg-[#17123d] shadow-[0_-20px_80px_-20px_rgba(139,108,240,.7)] sm:max-w-md sm:rounded-[28px]"
            initial={reduce ? { opacity: 0 } : { y: "100%" }} animate={reduce ? { opacity: 1 } : { y: 0 }} exit={reduce ? { opacity: 0 } : { y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}>
            <div className="flex justify-center pt-2.5 sm:hidden" aria-hidden><span className="h-1.5 w-12 rounded-full bg-white/25" /></div>
            {title && <div className="flex items-center justify-between gap-3 px-5 pb-2 pt-3"><p className="h-display text-xl">{title}</p><button type="button" onClick={onClose} aria-label={close} className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-dim hover:text-gold">✕</button></div>}
            <div className={`overflow-y-auto overscroll-contain px-4 ${footer ? "pb-3" : "pb-[max(1rem,env(safe-area-inset-bottom))]"}`}>{children}</div>
            {footer && <div className="border-t border-white/10 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  , document.body);
}

/** Looks like an input; opens a Sheet. */
export function FieldButton({ children, onClick, disabled, placeholder, testId, label }: { children?: React.ReactNode; onClick: () => void; disabled?: boolean; placeholder?: string; testId?: string; label?: string }) {
  return (
    <button type="button" disabled={disabled} onClick={onClick} aria-haspopup="dialog" aria-label={label} data-testid={testId}
      className="input flex w-full items-center justify-between gap-2 text-left disabled:cursor-not-allowed disabled:opacity-50">
      <span className={children ? "truncate" : "truncate text-dim"}>{children || placeholder}</span>
      <span aria-hidden className="text-gold/80">▾</span>
    </button>
  );
}

export type Opt<T extends string> = { value: T; label: React.ReactNode; hint?: React.ReactNode; icon?: React.ReactNode };
export function SheetSelect<T extends string>({ value, options, onChange, title, placeholder, testId }: { value: T | ""; options: Opt<T>[]; onChange: (v: T) => void; title: React.ReactNode; placeholder?: string; testId?: string }) {
  const [open, setOpen] = useState(false); const cur = options.find((o) => o.value === value);
  return (
    <>
      <FieldButton onClick={() => setOpen(true)} placeholder={placeholder} testId={testId}>{cur ? <>{cur.icon && <span className="mr-2">{cur.icon}</span>}{cur.label}</> : null}</FieldButton>
      <Sheet open={open} onClose={() => setOpen(false)} title={title} testId={testId && `${testId}-sheet`}>
        <ul role="listbox" className="space-y-1.5 py-1">
          {options.map((o) => {
            const sel = o.value === value;
            return (
              <li key={o.value}>
                <button type="button" role="option" aria-selected={sel} onClick={() => { onChange(o.value); setOpen(false); }}
                  className={`flex min-h-[52px] w-full items-center gap-3 rounded-2xl border px-4 py-2.5 text-left transition ${sel ? "border-gold/70 bg-gold/15 text-gold" : "border-white/10 bg-white/[0.04] hover:border-white/30"}`}>
                  {o.icon && <span className="text-xl">{o.icon}</span>}
                  <span className="flex-1"><span className="block">{o.label}</span>{o.hint && <span className="block text-xs text-dim">{o.hint}</span>}</span>
                  {sel && <span aria-hidden>✓</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </Sheet>
    </>
  );
}

const ITEM = 44;
/** Scroll-snap wheel. `items` are [value, label]. Tapping an item selects it too. */
export function Wheel<V extends number>({ items, value, onChange, label, testId }: { items: [V, React.ReactNode][]; value: V; onChange: (v: V) => void; label: string; testId?: string }) {
  const ref = useRef<HTMLDivElement>(null); const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idx = Math.max(0, items.findIndex(([v]) => v === value));
  useEffect(() => { const el = ref.current; if (el && Math.abs(el.scrollTop - idx * ITEM) > 2) el.scrollTo({ top: idx * ITEM }); }, [idx]);
  const onScroll = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const el = ref.current; if (!el) return;
      const i = Math.min(items.length - 1, Math.max(0, Math.round(el.scrollTop / ITEM)));
      if (items[i][0] !== value) onChange(items[i][0]);
    }, 90);
  };
  const step = (d: number) => { const i = Math.min(items.length - 1, Math.max(0, idx + d)); onChange(items[i][0]); ref.current?.scrollTo({ top: i * ITEM, behavior: "smooth" }); };
  return (
    <div className="relative flex-1">
      <div className="pointer-events-none absolute inset-x-1 top-1/2 h-11 -translate-y-1/2 rounded-xl border border-gold/40 bg-gold/10" aria-hidden />
      <div ref={ref} onScroll={onScroll} role="listbox" aria-label={label} tabIndex={0} data-testid={testId}
        onKeyDown={(e) => { if (e.key === "ArrowDown") { e.preventDefault(); step(1); } if (e.key === "ArrowUp") { e.preventDefault(); step(-1); } }}
        className="no-scrollbar relative h-[220px] snap-y snap-mandatory overflow-y-auto overscroll-contain outline-none [mask-image:linear-gradient(transparent,#000_30%,#000_70%,transparent)]"
        style={{ paddingTop: ITEM * 2, paddingBottom: ITEM * 2 }}>
        {items.map(([v, l], i) => (
          <button type="button" key={v} role="option" aria-selected={i === idx} data-value={v}
            onClick={() => { onChange(v); ref.current?.scrollTo({ top: i * ITEM, behavior: "smooth" }); }}
            className={`block h-11 w-full snap-center text-center text-lg transition ${i === idx ? "font-semibold text-gold" : "text-mist/60"}`}>{l}</button>
        ))}
      </div>
    </div>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");
/** "HH:MM" or "" when not set. */
export function TimePicker({ value, onChange, disabled, testId }: { value: string; onChange: (v: string) => void; disabled?: boolean; testId?: string }) {
  const L = useContent().c.site.datePicker; const [open, setOpen] = useState(false);
  const m = value.match(/^(\d{1,2}):(\d{2})/); const [hh, setH] = useState(m ? Number(m[1]) : 12); const [mm, setM] = useState(m ? Number(m[2]) : 0);
  const hours = Array.from({ length: 24 }, (_, i) => [i, pad(i)] as [number, string]);
  const mins = Array.from({ length: 60 }, (_, i) => [i, pad(i)] as [number, string]);
  return (
    <>
      <FieldButton disabled={disabled} onClick={() => setOpen(true)} placeholder={L.timePh} testId={testId} label={L.timePh}>{value && !disabled ? `🕰 ${value}` : null}</FieldButton>
      <Sheet open={open} onClose={() => setOpen(false)} title={L.timePh} testId={testId && `${testId}-sheet`}
        footer={<button type="button" className="btn-primary w-full py-3" data-testid={testId && `${testId}-done`} onClick={() => { onChange(`${pad(hh)}:${pad(mm)}`); setOpen(false); }}>{L.done} ✦</button>}>
        <div className="flex items-center gap-2 py-2">
          <Wheel items={hours} value={hh} onChange={setH} label={L.hour} />
          <span className="h-display text-2xl text-gold">:</span>
          <Wheel items={mins} value={mm} onChange={setM} label={L.minute} />
        </div>
      </Sheet>
    </>
  );
}

export function Toggle({ checked, onChange, children, testId }: { checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode; testId?: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} data-testid={testId} className="flex min-h-[44px] items-center gap-3 text-left text-sm text-dim">
      <span className={`relative inline-flex h-7 w-12 shrink-0 rounded-full border transition ${checked ? "border-gold/70 bg-gold/70" : "border-white/20 bg-white/10"}`}>
        <span className={`absolute top-0.5 h-[22px] w-[22px] rounded-full bg-white shadow transition-all ${checked ? "left-[calc(100%-24px)]" : "left-0.5"}`} />
      </span>
      <span>{children}</span>
    </button>
  );
}

export { Check } from "./check";

export function Segmented<T extends string | number>({ options, value, onChange, label, testId }: { options: { value: T; label: React.ReactNode }[]; value: T | undefined; onChange: (v: T) => void; label: string; testId?: string }) {
  return (
    <div role="radiogroup" aria-label={label} data-testid={testId} className="flex gap-1 rounded-2xl border border-white/15 bg-white/[0.04] p-1">
      {options.map((o) => {
        const sel = o.value === value;
        return (
          <button type="button" key={String(o.value)} role="radio" aria-checked={sel} onClick={() => onChange(o.value)}
            className={`min-h-[44px] flex-1 rounded-xl px-2 text-sm transition ${sel ? "bg-gold text-night font-semibold shadow" : "text-mist/80 hover:bg-white/10"}`}>{o.label}</button>
        );
      })}
    </div>
  );
}
