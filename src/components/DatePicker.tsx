"use client";
import { useState } from "react";
import { useContent } from "@/lib/content-context";
import { daysInMonth, isoOf, formatDate } from "@/lib/dates";

/** Friendly date picker: day / month-name / year selects. Value is ISO yyyy-mm-dd ("" when incomplete). */
export function DatePicker({ value, onChange, minYear = 1900, maxYear = new Date().getFullYear() + 1, id, compact }: { value: string; onChange: (iso: string) => void; minYear?: number; maxYear?: number; id?: string; compact?: boolean }) {
  const { c } = useContent(); const months = c.site.months; const L = c.site.datePicker;
  const init = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const [y, setY] = useState(init ? Number(init[1]) : 0);
  const [m, setM] = useState(init ? Number(init[2]) : 0);
  const [d, setD] = useState(init ? Number(init[3]) : 0);
  const emit = (ny: number, nm: number, nd: number) => {
    const max = ny && nm ? daysInMonth(ny, nm) : 31; const dd = Math.min(nd, max);
    if (dd !== nd) setD(dd);
    onChange(ny && nm && dd ? isoOf(ny, nm, dd) : "");
  };
  const maxD = y && m ? daysInMonth(y, m) : 31;
  const lo = y ? Math.min(minYear, y) : minYear;
  const years: number[] = []; for (let k = maxYear; k >= lo; k--) years.push(k);
  return (
    <div>
      <div className="grid grid-cols-[0.8fr_1.5fr_1fr] gap-2" id={id}>
        <select aria-label={L.day} className="input !px-3" value={d || ""} onChange={(e) => { const v = Number(e.target.value); setD(v); emit(y, m, v); }}>
          <option value="">{L.day}</option>
          {Array.from({ length: maxD }, (_, i) => i + 1).map((k) => <option key={k} value={k}>{k}</option>)}
        </select>
        <select aria-label={L.month} className="input !px-3" value={m || ""} onChange={(e) => { const v = Number(e.target.value); setM(v); emit(y, v, d); }}>
          <option value="">{L.month}</option>
          {months.map((name, i) => <option key={i} value={i + 1}>{name}</option>)}
        </select>
        <select aria-label={L.year} className="input !px-3" value={y || ""} onChange={(e) => { const v = Number(e.target.value); setY(v); emit(v, m, d); }}>
          <option value="">{L.year}</option>
          {years.map((k) => <option key={k} value={k}>{k}</option>)}
        </select>
      </div>
      {!compact && y && m && d ? <p className="mt-1 text-xs text-gold/90">✦ {formatDate(isoOf(y, m, Math.min(d, maxD)), months)}</p> : null}
    </div>
  );
}
