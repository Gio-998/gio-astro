"use client";
import { useEffect, useMemo, useState } from "react";
import { searchCities, searchOnline, CityHit } from "@/lib/cities";
import type { Place } from "@/lib/store";
import { useContent } from "@/lib/content-context";
import { SheetSelect } from "./controls";

/** Place search: bundled atlas first (fast, offline), then Open-Meteo online unless `online` is off, then manual coordinates. */
export function CityPicker({ value, onChange, online = true }: { value: Place | null; onChange: (p: Place | null) => void; online?: boolean }) {
  const { c, locale } = useContent(); const U = c.ui.privacyControls;
  const [q, setQ] = useState(value?.name ?? "");
  const [open, setOpen] = useState(false);
  const [res, setRes] = useState<{ q: string; hits: CityHit[]; online: boolean; done: boolean } | null>(null);
  const [manual, setManual] = useState(false);
  const term = q.trim();
  useEffect(() => {
    if (!open || term.length < 2) return;
    let alive = true;
    const t = setTimeout(async () => {
      const local = await searchCities(term, locale);
      if (!alive) return;
      setRes({ q: term, hits: local, online: false, done: local.length > 0 || !online });
      if (local.length || !online) return;
      const web = await searchOnline(term, locale);
      if (alive) setRes({ q: term, hits: web, online: true, done: true });
    }, 180);
    return () => { alive = false; clearTimeout(t); };
  }, [term, open, locale, online]);
  const fresh = res && res.q === term;
  const pick = (p: Place, label: string) => { onChange(p); setQ(label); setOpen(false); setManual(false); };
  return (
    <div className="relative">
      <input className="input" placeholder={U.cityPh} value={q} data-testid="city-input" autoComplete="off"
        onFocus={() => setOpen(true)}
        onChange={(e) => { setQ(e.target.value); setOpen(true); if (!e.target.value) onChange(null); }} />
      {value && !manual && <div className="mt-1 text-xs text-dim">📍 {value.name} · {value.lat.toFixed(2)}, {value.lon.toFixed(2)} · {value.tz}</div>}
      {open && term.length >= 2 && !manual && (
        <ul className="absolute z-30 mt-1 max-h-72 w-full overflow-auto rounded-2xl border border-white/10 bg-ink shadow-xl" data-testid="city-results">
          {!fresh && <li className="px-4 py-3 text-sm text-dim">{U.cityLoading}</li>}
          {fresh && !res.done && <li className="px-4 py-3 text-sm text-dim">{U.cityOnline}</li>}
          {fresh && res.done && res.hits.length === 0 && <li className="px-4 py-3 text-sm text-dim">{U.cityNone}</li>}
          {fresh && res.hits.map((h) => (
            <li key={h.label + h.lat}>
              <button type="button" className="flex min-h-[48px] w-full items-center justify-between gap-2 px-4 py-2 text-left text-sm hover:bg-white/10"
                onClick={() => pick({ name: h.name, lat: h.lat, lon: h.lon, tz: h.tz }, h.label)}>
                <span>{h.label}</span>{h.online && <span className="shrink-0 rounded-full border border-white/15 px-2 text-[10px] uppercase tracking-wider text-dim">🌐 {U.cityOnlineTag}</span>}
              </button>
            </li>
          ))}
          <li className="border-t border-white/10">
            <button type="button" className="w-full px-4 py-3 text-left text-sm text-gold hover:bg-white/10" onClick={() => { setManual(true); setOpen(false); }} data-testid="city-manual">📍 {U.cityManual}</button>
          </li>
        </ul>
      )}
      {manual && <ManualPlace initialName={term} onCancel={() => setManual(false)} onUse={(p) => pick(p, p.name)} />}
    </div>
  );
}

function ManualPlace({ initialName, onUse, onCancel }: { initialName: string; onUse: (p: Place) => void; onCancel: () => void }) {
  const { c } = useContent(); const U = c.ui.privacyControls;
  const zones = useMemo(() => { try { return (Intl as unknown as { supportedValuesOf: (k: string) => string[] }).supportedValuesOf("timeZone"); } catch { return ["UTC"]; } }, []);
  const [name, setName] = useState(initialName); const [lat, setLat] = useState(""); const [lon, setLon] = useState("");
  const [tz, setTz] = useState(() => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"); const [err, setErr] = useState("");
  const use = () => {
    // Accept "41.99, 21.43" pasted into the latitude field too.
    const both = lat.match(/^\s*(-?\d+(?:\.\d+)?)\s*[,;\s]\s*(-?\d+(?:\.\d+)?)\s*$/);
    const la = Number((both ? both[1] : lat).replace(",", ".")); const lo = Number((both ? both[2] : lon).replace(",", "."));
    if (!Number.isFinite(la) || !Number.isFinite(lo) || Math.abs(la) > 90 || Math.abs(lo) > 180 || (!lat && !lon)) return setErr(U.badCoords);
    onUse({ name: name.trim() || `${la.toFixed(2)}, ${lo.toFixed(2)}`, lat: Math.round(la * 1e4) / 1e4, lon: Math.round(lo * 1e4) / 1e4, tz });
  };
  return (
    <div className="mt-2 space-y-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3" data-testid="city-manual-form">
      <label className="block text-sm"><span className="label">{U.manualName}</span><input className="input" value={name} onChange={(e) => setName(e.target.value)} /></label>
      <div className="grid grid-cols-2 gap-2">
        <label className="block text-sm"><span className="label">{U.lat}</span><input className="input" inputMode="decimal" placeholder="41.99" value={lat} onChange={(e) => setLat(e.target.value)} data-testid="city-lat" /></label>
        <label className="block text-sm"><span className="label">{U.lon}</span><input className="input" inputMode="decimal" placeholder="21.43" value={lon} onChange={(e) => setLon(e.target.value)} data-testid="city-lon" /></label>
      </div>
      <div className="text-sm"><span className="label">{U.tz}</span><SheetSelect title={U.tz} value={tz} onChange={setTz} options={zones.map((z) => ({ value: z, label: z.replace(/_/g, " ") }))} /></div>
      <p className="text-xs text-dim">{U.coordsHint}</p>
      {err && <p role="alert" className="text-sm text-rose">{err}</p>}
      <div className="flex gap-2"><button type="button" className="btn-primary flex-1" onClick={use} data-testid="city-use">{U.useCoords}</button><button type="button" className="btn-ghost" onClick={onCancel}>✕</button></div>
    </div>
  );
}
