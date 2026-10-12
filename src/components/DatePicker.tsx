"use client";
import { useState } from "react";
import { useContent } from "@/lib/content-context";
import { daysInMonth, isoOf, formatDate } from "@/lib/dates";
import { FieldButton, Sheet, Wheel } from "./controls";

/**
 * Friendly date picker: a field showing "12 October 1995" that opens a bottom sheet with
 * day / month-name / year wheels. Value is ISO yyyy-mm-dd ("" when not chosen yet).
 */
export function DatePicker({ value, onChange, minYear = 1900, maxYear = new Date().getFullYear() + 1, id, compact }: { value: string; onChange: (iso: string) => void; minYear?: number; maxYear?: number; id?: string; compact?: boolean }) {
  const { c } = useContent(); const months = c.site.months; const L = c.site.datePicker;
  const init = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const [open, setOpen] = useState(false);
  const [y, setY] = useState(init ? Number(init[1]) : Math.min(maxYear, 1995));
  const [m, setM] = useState(init ? Number(init[2]) : 1);
  const [d, setD] = useState(init ? Number(init[3]) : 1);
  const maxD = daysInMonth(y, m); const dd = Math.min(d, maxD);
  const lo = Math.min(minYear, y);
  const years: [number, number][] = []; for (let k = lo; k <= maxYear; k++) years.push([k, k]);
  const days = Array.from({ length: maxD }, (_, i) => [i + 1, i + 1] as [number, number]);
  const monthItems = months.map((name, i) => [i + 1, name] as [number, string]);
  const done = () => { onChange(isoOf(y, m, dd)); setOpen(false); };
  return (
    <div id={id}>
      <FieldButton onClick={() => setOpen(true)} placeholder={L.placeholder} testId="date-field" label={L.placeholder}>{value ? `📅 ${formatDate(value, months)}` : null}</FieldButton>
      <Sheet open={open} onClose={() => setOpen(false)} title={L.title} testId="date-sheet"
        footer={<button type="button" className="btn-primary w-full py-3" onClick={done} data-testid="date-done">{L.done} · {formatDate(isoOf(y, m, dd), months)}</button>}>
        <div className="grid grid-cols-[0.7fr_1.6fr_1fr] gap-1 py-2 text-xs uppercase tracking-widest text-dim"><span className="text-center">{L.day}</span><span className="text-center">{L.month}</span><span className="text-center">{L.year}</span></div>
        <div className="grid grid-cols-[0.7fr_1.6fr_1fr] gap-1 pb-2">
          <Wheel items={days} value={dd} onChange={setD} label={L.day} testId="wheel-day" />
          <Wheel items={monthItems} value={m} onChange={setM} label={L.month} testId="wheel-month" />
          <Wheel items={years} value={y} onChange={setY} label={L.year} testId="wheel-year" />
        </div>
      </Sheet>
      {!compact && value ? <p className="sr-only">{formatDate(value, months)}</p> : null}
    </div>
  );
}
