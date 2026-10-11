import { DateTime } from "luxon";

export interface BirthInput {
  /** YYYY-MM-DD */
  date: string;
  /** HH:mm, or null when unknown */
  time: string | null;
  /** Place, needed for Ascendant and exact local→UT conversion */
  place?: { name: string; lat: number; lon: number; tz: string } | null;
  /** Manual UTC offset in hours (overrides the time-zone database), e.g. 1 or -5.5 */
  utcOffsetOverride?: number | null;
}

export interface ResolvedTime {
  utc: Date;
  /** offset in minutes applied (local = utc + offset) */
  offsetMinutes: number;
  /** how the offset was obtained */
  offsetSource: "override" | "tzdb" | "local-mean-time" | "assumed-utc";
  timeKnown: boolean;
}

/**
 * Convert a local civil birth date/time to UT.
 * - Uses the IANA zone history (via Luxon/Intl) so DST and historical offsets apply.
 * - Before 1900 most places used local mean time; the tz database only knows the LMT of the
 *   zone's reference city (e.g. Berlin for all of Germany), so we compute LMT from the birthplace longitude.
 * - Unknown time → 12:00 local (by convention), flagged as timeKnown=false.
 */
export function resolveBirthTime(input: BirthInput, fallbackTime = "12:00"): ResolvedTime {
  const [y, m, d] = input.date.split("-").map(Number);
  const timeKnown = !!input.time;
  const [hh, mm] = (input.time ?? fallbackTime).split(":").map(Number);
  const asUtcMs = Date.UTC(y, m - 1, d, hh, mm || 0, 0);
  // Date.UTC treats years 0..99 as 1900+, guard for completeness
  const naive = new Date(asUtcMs);
  if (y < 100) naive.setUTCFullYear(y);

  if (input.utcOffsetOverride != null && Number.isFinite(input.utcOffsetOverride)) {
    const off = Math.round(input.utcOffsetOverride * 60);
    return { utc: new Date(naive.getTime() - off * 60000), offsetMinutes: off, offsetSource: "override", timeKnown };
  }
  if (!input.place) {
    return { utc: naive, offsetMinutes: 0, offsetSource: "assumed-utc", timeKnown };
  }
  const dt = DateTime.fromObject({ year: y, month: m, day: d, hour: hh, minute: mm || 0 }, { zone: input.place.tz });
  let off = dt.isValid ? dt.offset : 0;
  let source: ResolvedTime["offsetSource"] = "tzdb";
  if (!dt.isValid || (y < 1900 && off % 15 !== 0)) {
    off = Math.round((input.place.lon / 15) * 60);
    source = "local-mean-time";
  }
  return { utc: new Date(naive.getTime() - off * 60000), offsetMinutes: off, offsetSource: source, timeKnown };
}
