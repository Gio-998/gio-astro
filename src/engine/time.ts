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
  /**
   * Set when the clock time is unusual for that zone and date:
   * "gap" = the time never existed (clocks jumped forward, e.g. 02:30 on a spring DST night),
   * "ambiguous" = the time happened twice (clocks went back); we use the first (summer-time) occurrence.
   */
  tzNote?: "gap" | "ambiguous" | null;
}

/** Offset (minutes) of a zone long before standard time existed, i.e. the reference city's local mean time. */
const lmtCache = new Map<string, number>();
function zoneLmt(tz: string): number | null {
  if (!lmtCache.has(tz)) {
    const dt = DateTime.fromObject({ year: 1801, month: 1, day: 1 }, { zone: tz });
    lmtCache.set(tz, dt.isValid ? dt.offset : NaN);
  }
  const v = lmtCache.get(tz)!;
  return Number.isNaN(v) ? null : v;
}

/**
 * Convert a local civil birth date/time to UT.
 * - Uses the IANA zone history (via Luxon/Intl) so DST and historical offsets apply.
 * - While a zone was on local mean time the tz database only knows the LMT of the zone's reference city
 *   (e.g. Berlin for all of Germany), so we compute mean time from the birthplace longitude instead.
 * - DST gaps (a clock time that never happened) and overlaps (a time that happened twice) are flagged in tzNote.
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
  let tzNote: ResolvedTime["tzNote"] = null;
  if (dt.isValid && timeKnown) {
    if (dt.hour !== hh || dt.minute !== (mm || 0)) tzNote = "gap";
    else if (dt.getPossibleOffsets().length > 1) tzNote = "ambiguous";
  }
  // While a zone is still on local mean time (LMT), the tz database only knows the LMT of its reference city
  // (Berlin for all of Germany, Moscow for most of western Russia). Use the birthplace's own mean time instead.
  const lmt = zoneLmt(input.place.tz);
  if (!dt.isValid || (lmt != null && Math.abs(off - lmt) < 0.01 && off % 15 !== 0)) {
    off = (input.place.lon / 15) * 60;
    source = "local-mean-time";
  }
  return { utc: new Date(naive.getTime() - off * 60000), offsetMinutes: off, offsetSource: source, timeKnown, tzNote };
}
