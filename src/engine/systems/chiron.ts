import * as Astronomy from "astronomy-engine";
import { CHIRON_ELEMENTS } from "./chiron-elements";
import { norm360 } from "./util";

/**
 * Geocentric ecliptic longitude of 2060 Chiron (true equinox of date), degrees.
 * Method: nearest JPL Horizons osculating element set (100-day grid, 1899-2101), two-body Kepler propagation
 * over at most 50 days, heliocentric J2000 ecliptic → equatorial, minus the Earth's heliocentric vector
 * from astronomy-engine, one light-time iteration, then astronomy-engine's Ecliptic() for the equinox of date.
 * Accuracy against Horizons apparent positions: better than 0.02° (see tests/systems.test.ts).
 * Outside 1899-2101 it returns null (we say so instead of guessing).
 */
const K = Math.PI / 180;
const EPS_J2000 = 23.4392911 * K;
const C_AU_PER_DAY = 173.1446327;

function helioJ2000Eq(jd: number): [number, number, number] | null {
  const first = CHIRON_ELEMENTS[0][0], last = CHIRON_ELEMENTS[CHIRON_ELEMENTS.length - 1][0];
  if (jd < first - 50 || jd > last + 50) return null;
  const i = Math.max(0, Math.min(CHIRON_ELEMENTS.length - 1, Math.round((jd - first) / 100)));
  const [jd0, e, a, inc, node, peri, M0, n] = CHIRON_ELEMENTS[i];
  const M = norm360(M0 + n * (jd - jd0)) * K;
  let E = M;
  for (let k = 0; k < 30; k++) { const dE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E)); E -= dE; if (Math.abs(dE) < 1e-12) break; }
  const xv = a * (Math.cos(E) - e), yv = a * Math.sqrt(1 - e * e) * Math.sin(E);
  const v = Math.atan2(yv, xv), r = Math.hypot(xv, yv);
  const O = node * K, w = peri * K, I = inc * K, u = v + w;
  const x = r * (Math.cos(O) * Math.cos(u) - Math.sin(O) * Math.sin(u) * Math.cos(I));
  const y = r * (Math.sin(O) * Math.cos(u) + Math.cos(O) * Math.sin(u) * Math.cos(I));
  const z = r * Math.sin(u) * Math.sin(I);
  return [x, y * Math.cos(EPS_J2000) - z * Math.sin(EPS_J2000), y * Math.sin(EPS_J2000) + z * Math.cos(EPS_J2000)];
}

export function chironLongitude(date: Date): number | null {
  const t = Astronomy.MakeTime(date);
  const jd = t.tt + 2451545.0;
  const earth = Astronomy.HelioVector(Astronomy.Body.Earth, t);
  let p = helioJ2000Eq(jd); if (!p) return null;
  for (let k = 0; k < 2; k++) {
    const dist = Math.hypot(p[0] - earth.x, p[1] - earth.y, p[2] - earth.z);
    p = helioJ2000Eq(jd - dist / C_AU_PER_DAY)!;
  }
  const geo = new Astronomy.Vector(p[0] - earth.x, p[1] - earth.y, p[2] - earth.z, t);
  return norm360(Astronomy.Ecliptic(geo).elon);
}

/** Retrograde if the geocentric longitude decreases across ±12 hours. */
export function chironRetrograde(date: Date): boolean | null {
  const a = chironLongitude(new Date(date.getTime() - 43200000)), b = chironLongitude(new Date(date.getTime() + 43200000));
  if (a == null || b == null) return null;
  let d = b - a; if (d > 180) d -= 360; if (d < -180) d += 360;
  return d < 0;
}
