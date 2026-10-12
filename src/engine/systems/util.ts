/** Shared helpers for the extra "systems" lenses. Pure functions, no I/O. */
export const norm360 = (x: number) => ((x % 360) + 360) % 360;
export const ymd = (date: string) => date.split("-").map(Number) as [number, number, number];

/** Julian Day Number (integer, noon-based) of a Gregorian civil date. Fliegel & Van Flandern (1968). */
export function jdn(y: number, m: number, d: number): number {
  const a = Math.floor((14 - m) / 12), yy = y + 4800 - a, mm = m + 12 * a - 3;
  return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
}
/** Day of year index for month/day, using a leap year so Feb 29 has its own slot (1..366). */
export function mdIndex(m: number, d: number): number {
  const cum = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];
  return cum[m - 1] + d;
}
/** Pick the entry whose [startMonth, startDay] is the latest one on or before (m, d), wrapping the year. */
export function byStartDates<T extends { start: [number, number] }>(list: readonly T[], m: number, d: number): T {
  const k = mdIndex(m, d);
  const sorted = [...list].sort((a, b) => mdIndex(...a.start) - mdIndex(...b.start));
  let hit = sorted[sorted.length - 1];
  for (const e of sorted) if (mdIndex(...e.start) <= k) hit = e;
  return hit;
}
/** Easter Sunday (Orthodox, Julian computus) as a Gregorian date, valid 1900-2099 (Julian + 13 days). Meeus, Astronomical Algorithms ch. 8. */
export function orthodoxEaster(year: number): { m: number; d: number } {
  const a = year % 4, b = year % 7, c = year % 19;
  const dd = (19 * c + 15) % 30, e = (2 * a + 4 * b - dd + 34) % 7;
  const month = Math.floor((dd + e + 114) / 31), day = ((dd + e + 114) % 31) + 1; // Julian
  // Julian to Gregorian gap: 13 days in 1900-2099, 14 from March 2100 (Easter is always after March 1).
  const gap = Math.floor(year / 100) - Math.floor(year / 400) - 2;
  const g = new Date(Date.UTC(year, month - 1, day + gap));
  return { m: g.getUTCMonth() + 1, d: g.getUTCDate() };
}
export function addDays(y: number, m: number, d: number, n: number): { y: number; m: number; d: number } {
  const t = new Date(Date.UTC(y, m - 1, d + n));
  return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() };
}
