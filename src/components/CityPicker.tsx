"use client";
import { useMemo, useState } from "react";
import { loadCities, searchCities, CityHit } from "@/lib/cities";
import type { Place } from "@/lib/store";
import { useContent } from "@/lib/content-context";

export function CityPicker({ value, onChange }: { value: Place | null; onChange: (p: Place | null) => void }) {
  const U = useContent().c.ui.privacyControls;
  const [q, setQ] = useState(value?.name ?? "");
  const [rows, setRows] = useState<Awaited<ReturnType<typeof loadCities>> | null>(null);
  const [open, setOpen] = useState(false);
  const hits: CityHit[] = useMemo(() => (rows && open ? searchCities(rows, q) : []), [q, rows, open]);
  return (
    <div className="relative">
      <input className="input" placeholder={U.cityPh} value={q}
        onFocus={() => { setOpen(true); loadCities().then(setRows); }}
        onChange={(e) => { setQ(e.target.value); setOpen(true); if (!e.target.value) onChange(null); }} />
      {value && <div className="mt-1 text-xs text-dim">📍 {value.name} · {value.lat.toFixed(2)}, {value.lon.toFixed(2)} · {value.tz}</div>}
      {open && q.length >= 2 && (
        <ul className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-white/10 bg-ink shadow-xl">
          {!rows && <li className="px-4 py-2 text-sm text-dim">{U.cityLoading}</li>}
          {rows && hits.length === 0 && <li className="px-4 py-2 text-sm text-dim">{U.cityNone}</li>}
          {hits.map((h) => (
            <li key={h.label + h.lat}>
              <button type="button" className="w-full px-4 py-2 text-left text-sm hover:bg-white/10"
                onClick={() => { onChange({ name: h.name, lat: h.lat, lon: h.lon, tz: h.tz }); setQ(h.label); setOpen(false); }}>{h.label}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
