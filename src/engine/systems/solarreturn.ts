import * as Astronomy from "astronomy-engine";
import { angles, longitude } from "../astro";
import { Sign, signFromLongitude } from "../zodiac";
/**
 * Solar return: the moment the Sun comes back to its exact natal longitude, once a year near the birthday.
 * Found with astronomy-engine's SearchSunLongitude (apparent geocentric longitude, true equinox of date).
 * The return chart's Ascendant uses the birthplace unless another place is given (many astrologers use
 * where you spend the birthday; we say which one we used). Whole-sign houses, like the natal chart.
 */
export interface SolarReturn { year: number; utc: Date; moon: Sign; asc: Sign | null; sunHouse: number | null; place: string | null }
export function solarReturn(natalSunLon: number, year: number, birthMonth: number, place?: { lat: number; lon: number; name: string } | null): SolarReturn {
  const start = Astronomy.MakeTime(new Date(Date.UTC(year, birthMonth - 1, 1) - 20 * 86400000));
  const t = Astronomy.SearchSunLongitude(natalSunLon, start, 80);
  if (!t) throw new Error("solar return not found");
  const utc = t.date;
  const moon = signFromLongitude(longitude("moon", utc));
  let asc: Sign | null = null, sunHouse: number | null = null;
  if (place) {
    const a = angles(utc, place.lat, place.lon).asc; asc = signFromLongitude(a);
    sunHouse = ((Math.floor(natalSunLon / 30) - Math.floor(a / 30) + 12) % 12) + 1;
  }
  return { year, utc, moon, asc, sunHouse, place: place?.name ?? null };
}
