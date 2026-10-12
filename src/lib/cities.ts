import type { Place } from "./store";
/**
 * City search over the bundled GeoNames cities500 index (CC BY 4.0), split into lazy-loaded chunks by
 * the first two letters of every searchable name (see scripts/build-cities.mjs). Falls back to the free
 * Open-Meteo geocoding API (no key) when nothing local matches.
 */
// [name, cyrillicName|0, countryCode, region, lat, lon, tz, population, extraKeys?]
type Row = [string, string | 0, string, string, number, number, string, number, string?];
type Meta = { countries: Record<string, string>; prefixes: string[] };

const CYR: Record<string, string> = { а: "a", б: "b", в: "v", г: "g", д: "d", ѓ: "gj", е: "e", ж: "zh", з: "z", ѕ: "dz", и: "i", ј: "j", к: "k", л: "l", љ: "lj", м: "m", н: "n", њ: "nj", о: "o", п: "p", р: "r", с: "s", т: "t", ќ: "kj", у: "u", ф: "f", х: "h", ц: "c", ч: "ch", џ: "dzh", ш: "sh", ђ: "dj", ћ: "c", й: "j", ы: "y", э: "e", ю: "yu", я: "ya", щ: "shch", ъ: "", ь: "", ё: "e", є: "ye", і: "i", ї: "yi", ґ: "g" };
/** Search key: lower case, Cyrillic → Latin, accents dropped. Must match `key()` in scripts/build-cities.mjs. */
export const key = (s: string) => s.toLowerCase().replace(/[\u0400-\u04FF]/g, (ch) => CYR[ch] ?? ch).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ł/g, "l").replace(/ß/g, "ss").replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();

let meta: Promise<Meta> | null = null;
const chunks = new Map<string, Promise<Row[]>>();
const loadMeta = () => (meta ??= fetch("/data/cities/meta.json").then((r) => r.json()));
function loadChunk(p: string): Promise<Row[]> {
  if (!chunks.has(p)) chunks.set(p, loadMeta().then((m) => (m.prefixes.includes(p) ? fetch(`/data/cities/${p}.json`).then((r) => r.json()) : [])).catch(() => { chunks.delete(p); return []; }));
  return chunks.get(p)!;
}

export interface CityHit extends Place { label: string; online?: boolean }

export async function searchCities(q: string, locale = "en", limit = 8): Promise<CityHit[]> {
  const k = key(q); if (k.length < 2) return [];
  const [rows, m] = await Promise.all([loadChunk(k.slice(0, 2)), loadMeta()]);
  const exact: CityHit[] = [], pre: CityHit[] = [];
  for (const r of rows) {
    const own = key(r[0]); const extra = r[8] ? r[8].split("|") : [];
    const isExact = own === k || extra.includes(k);
    if (!isExact && !own.startsWith(k) && !own.split(" ").some((w) => w.startsWith(k)) && !extra.some((x) => x.startsWith(k))) continue;
    const shown = locale === "mk" && r[1] ? r[1] : r[0];
    const hit: CityHit = { name: shown, lat: r[4], lon: r[5], tz: r[6], label: [shown, r[3], m.countries[r[2]] ?? r[2]].filter(Boolean).join(", ") };
    (isExact ? exact : pre).push(hit);
    if (exact.length >= limit) break;
  }
  return [...exact, ...pre].slice(0, limit); // rows are sorted by population, so bigger places come first
}

/** Free fallback (Open-Meteo / GeoNames full dump, includes small villages). */
export async function searchOnline(q: string, locale = "en", limit = 8): Promise<CityHit[]> {
  try {
    const r = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q.trim())}&count=${limit}&language=${locale}&format=json`);
    const j = (await r.json()) as { results?: { name: string; latitude: number; longitude: number; timezone?: string; admin1?: string; country?: string }[] };
    return (j.results ?? []).filter((x) => x.timezone).map((x) => ({ name: x.name, lat: Math.round(x.latitude * 1e3) / 1e3, lon: Math.round(x.longitude * 1e3) / 1e3, tz: x.timezone!, label: [x.name, x.admin1, x.country].filter(Boolean).join(", "), online: true }));
  } catch { return []; }
}
