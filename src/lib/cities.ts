import type { Place } from "./store";
type Row = [string, string | 0, string, string, number, number, string, number];
let rows: Row[] | null = null;
let loading: Promise<Row[]> | null = null;

/** Lazy-loads the bundled GeoNames city list (~1 MB gzipped) on first use. */
export function loadCities(): Promise<Row[]> {
  if (rows) return Promise.resolve(rows);
  loading ??= fetch("/data/cities.json").then((r) => r.json()).then((j) => (rows = j.rows as Row[]));
  return loading;
}
import { translit } from "@/engine/translit";
const fold = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ł/g, "l").toLowerCase();

export interface CityHit extends Place { label: string }
export function searchCities(all: Row[], q: string, limit = 8): CityHit[] {
  const n = fold(translit(q.trim()));
  if (n.length < 2) return [];
  const out: CityHit[] = [];
  const contains: CityHit[] = [];
  for (const r of all) {
    const name = fold(r[0]); const ascii = r[1] ? fold(r[1]) : name;
    const hit = { name: r[0], lat: r[4], lon: r[5], tz: r[6], label: `${r[0]}${r[3] ? `, ${r[3]}` : ""}, ${r[2]}` };
    if (name.startsWith(n) || ascii.startsWith(n)) { out.push(hit); if (out.length >= limit) break; }
    else if (contains.length < limit && (name.includes(n) || ascii.includes(n))) contains.push(hit);
  }
  return [...out, ...contains].slice(0, limit);
}
