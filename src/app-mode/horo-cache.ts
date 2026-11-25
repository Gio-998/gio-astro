/**
 * Store app only. Short summaries of the horoscopes the app has computed or shown, kept for 14 days.
 * The full text is always computed on the device (lib/horoscope reading()), so the app works offline without this cache;
 * the cache makes the widget and morning reminders cheap (no recomputation) and keeps what was loaded across restarts.
 */
import { reading } from "@/lib/horoscope";
import { addDays, todayIso } from "@/engine/skyday";
import { SIGN_GLYPH, type Sign } from "@/engine/zodiac";

export const CACHE_KEY = "horoscop:cache:v1";
export const KEEP_DAYS = 14;
export type CachedReading = { lang: string; sign: Sign; iso: string; signName: string; glyph: string; headline: string; overview: string; moonLine: string; luckyNumber: number; luckyColor: string };

type Cache = Record<string, CachedReading>;
const keyOf = (lang: string, sign: Sign, iso: string) => `${lang}:${sign}:${iso}`;
function load(): Cache { try { return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}") as Cache; } catch { return {}; } }
function save(c: Cache) { try { localStorage.setItem(CACHE_KEY, JSON.stringify(c)); } catch {} }

/** Drops entries older than KEEP_DAYS before today (Europe/Skopje). Future days (widget, reminders) stay. */
export function prune(c: Cache, today = todayIso()): Cache {
  const oldest = addDays(today, -KEEP_DAYS);
  return Object.fromEntries(Object.entries(c).filter(([, v]) => v.iso >= oldest));
}

/** Cached summary, computed and stored when missing. */
export function cachedReading(lang: string, sign: Sign, iso: string): CachedReading {
  const c = load(); const k = keyOf(lang, sign, iso);
  if (c[k]) return c[k];
  const r = reading(lang, sign, iso);
  const v: CachedReading = { lang, sign, iso, signName: r.signName, glyph: SIGN_GLYPH[sign], headline: r.headline, overview: r.overview, moonLine: r.moonLine, luckyNumber: r.lucky.number, luckyColor: r.lucky.color };
  save(prune({ ...c, [k]: v }));
  return v;
}

export function clearCache() { try { localStorage.removeItem(CACHE_KEY); } catch {} }
