/** Pure helpers behind the public rising sign, moon sign and birth chart calculators. Nothing here keeps or sends what it is given. */
import { DateTime } from "luxon";
import { angles, longitude } from "./astro";
import { resolveBirthTime, type BirthInput, type ResolvedTime } from "./time";
import { signFromLongitude, type Sign } from "./zodiac";

const MINUTE = 60000;
const pad = (n: number) => String(n).padStart(2, "0");
const clock = (minuteOfDay: number) => `${pad(Math.floor(minuteOfDay / 60))}:${pad(minuteOfDay % 60)}`;

/** No place given: read the clock in the visitor's own time zone, not UTC, without inventing a place (a place would imply a rising sign). */
export function withDeviceZone(input: BirthInput, tz: string | null | undefined): BirthInput {
  if (input.place || input.utcOffsetOverride != null || !tz) return input;
  const [year, month, day] = input.date.split("-").map(Number);
  const [hour, minute] = (input.time ?? "12:00").split(":").map(Number);
  const dt = DateTime.fromObject({ year, month, day, hour, minute }, { zone: tz });
  return dt.isValid ? { ...input, utcOffsetOverride: dt.offset / 60 } : input;
}

export interface DayChange { from: Sign; to: Sign; /** Local clock time of the first minute in the new sign, HH:mm. */ at: string }

/** The moment a body changed sign during the local birth day, or null. A day is too short for the Sun or Moon to change twice. */
export function dayChange(body: "sun" | "moon", input: BirthInput): DayChange | null {
  const signAt = (m: number) => signFromLongitude(longitude(body, resolveBirthTime({ ...input, time: clock(m) }).utc));
  const from = signAt(0); const to = signAt(1439);
  if (from === to) return null;
  let lo = 0, hi = 1439;
  while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (signAt(mid) === from) lo = mid; else hi = mid; }
  return { from, to, at: clock(hi) };
}

export interface MoonResult { sign: Sign; lon: number; time: ResolvedTime; change: DayChange | null }
/** Moon sign at birth (noon when the time is unknown) plus any sign change that local day. */
export function moonOfBirth(input: BirthInput): MoonResult {
  const time = resolveBirthTime(input); const lon = longitude("moon", time.utc);
  return { sign: signFromLongitude(lon), lon, time, change: dayChange("moon", input) };
}

export interface RisingResult {
  sign: Sign; lon: number; time: ResolvedTime;
  /** Local clock times between which this sign was rising that day; null where it never changes within 12 hours (polar latitudes). */
  from: string | null; to: string | null;
  /** The neighbouring sign, when the birth minute sits within ten minutes of it. */
  near: Sign | null;
}
const EDGE = 10 * MINUTE; const SPAN = 12 * 60 * MINUTE;
/** Rising sign for a known time and place, with the window of birth times that give the same sign. */
export function risingOfBirth(input: BirthInput & { place: NonNullable<BirthInput["place"]> }): RisingResult {
  const time = resolveBirthTime(input); const { lat, lon: geoLon, tz } = input.place; const t0 = time.utc.getTime();
  const signAt = (ms: number) => signFromLongitude(angles(new Date(ms), lat, geoLon).asc);
  const local = (ms: number) => time.offsetSource === "tzdb" ? DateTime.fromMillis(ms, { zone: tz }).toFormat("HH:mm") : new Date(ms + time.offsetMinutes * MINUTE).toISOString().slice(11, 16);
  const lon = angles(time.utc, lat, geoLon).asc; const sign = signFromLongitude(lon);
  let a = t0, b = t0;
  while (t0 - a < SPAN && signAt(a - MINUTE) === sign) a -= MINUTE;
  while (b - t0 < SPAN && signAt(b + MINUTE) === sign) b += MINUTE;
  const open = t0 - a >= SPAN || b - t0 >= SPAN;
  const near = t0 - a < EDGE ? signAt(a - MINUTE) : b - t0 < EDGE ? signAt(b + MINUTE) : null;
  return { sign, lon, time, from: open ? null : local(a), to: open ? null : local(b + MINUTE), near: open ? null : near };
}
