import * as Astronomy from "astronomy-engine";
import { Sign, signFromLongitude, SIGN_ELEMENT, SIGN_MODALITY, Element, Modality } from "./zodiac";
import { BirthInput, resolveBirthTime, ResolvedTime } from "./time";

export const PLANETS = [
  "sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto", "node",
] as const;
export type Planet = (typeof PLANETS)[number];
export type Point = Planet | "asc" | "mc";

const BODY: Partial<Record<Planet, Astronomy.Body>> = {
  mercury: Astronomy.Body.Mercury, venus: Astronomy.Body.Venus, mars: Astronomy.Body.Mars,
  jupiter: Astronomy.Body.Jupiter, saturn: Astronomy.Body.Saturn, uranus: Astronomy.Body.Uranus,
  neptune: Astronomy.Body.Neptune, pluto: Astronomy.Body.Pluto,
};

const norm = (x: number) => ((x % 360) + 360) % 360;
const rad = Math.PI / 180;

/** Geocentric apparent ecliptic longitude (true equinox of date), degrees. */
export function longitude(p: Planet, date: Date): number {
  const t = Astronomy.MakeTime(date);
  if (p === "sun") return norm(Astronomy.SunPosition(t).elon);
  if (p === "moon") return norm(Astronomy.EclipticGeoMoon(t).lon);
  if (p === "node") return meanNode(t);
  const vec = Astronomy.GeoVector(BODY[p]!, t, true);
  return norm(Astronomy.Ecliptic(vec).elon);
}

/** Mean lunar ascending node (Meeus, Astronomical Algorithms ch. 47). */
export function meanNode(t: Astronomy.AstroTime): number {
  const T = t.tt / 36525;
  return norm(125.0445479 - 1934.1362891 * T + 0.0020754 * T * T + (T * T * T) / 467441 - (T * T * T * T) / 60616000);
}

/** Ascendant and Midheaven (degrees) for a UT instant and geographic position. */
export function angles(date: Date, lat: number, lon: number): { asc: number; mc: number; ramc: number } {
  const t = Astronomy.MakeTime(date);
  const gast = Astronomy.SiderealTime(t); // hours
  const ramc = norm(gast * 15 + lon);
  const eps = Astronomy.e_tilt(t).tobl * rad;
  const r = ramc * rad;
  const phi = lat * rad;
  let mc = Math.atan2(Math.sin(r), Math.cos(r) * Math.cos(eps)) / rad;
  mc = norm(mc);
  let asc = Math.atan2(Math.cos(r), -(Math.sin(r) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps))) / rad;
  asc = norm(asc);
  return { asc, mc, ramc };
}

export interface Placement {
  point: Point;
  lon: number;
  sign: Sign;
  retrograde?: boolean;
  house?: number; // whole-sign house, when time+place known
}

export interface Aspect {
  a: Point;
  b: Point;
  type: AspectType;
  orb: number;
  exact: number;
}

export type AspectType = "conjunction" | "sextile" | "square" | "trine" | "opposition";
export const ASPECTS: { type: AspectType; angle: number }[] = [
  { type: "conjunction", angle: 0 },
  { type: "sextile", angle: 60 },
  { type: "square", angle: 90 },
  { type: "trine", angle: 120 },
  { type: "opposition", angle: 180 },
];

export function maxOrb(a: Point, b: Point, type: AspectType): number {
  if (type === "sextile") return 4;
  const lum = (p: Point) => p === "sun" || p === "moon";
  return lum(a) || lum(b) ? 8 : 6;
}

export function findAspect(lonA: number, lonB: number, a: Point, b: Point): Aspect | null {
  let sep = Math.abs(norm(lonA) - norm(lonB));
  if (sep > 180) sep = 360 - sep;
  for (const asp of ASPECTS) {
    const orb = Math.abs(sep - asp.angle);
    if (orb <= maxOrb(a, b, asp.type)) return { a, b, type: asp.type, orb, exact: asp.angle };
  }
  return null;
}

export interface Chart {
  input: BirthInput;
  time: ResolvedTime;
  placements: Record<Point, Placement | undefined>;
  aspects: Aspect[];
  /** True when the Moon changes sign during the birth day (only meaningful if time unknown). */
  moonAmbiguous: boolean;
  moonAlternatives: Sign[];
  elementBalance: Record<Element, number>;
  modalityBalance: Record<Modality, number>;
  hasAngles: boolean;
}

/** Compute a natal chart. Houses: Whole Sign (robust at every latitude). */
export function computeChart(input: BirthInput): Chart {
  const time = resolveBirthTime(input);
  const placements = {} as Record<Point, Placement | undefined>;
  for (const p of PLANETS) {
    const lon = longitude(p, time.utc);
    let retrograde: boolean | undefined;
    if (p !== "sun" && p !== "moon" && p !== "node") {
      const before = longitude(p, new Date(time.utc.getTime() - 43200000));
      const after = longitude(p, new Date(time.utc.getTime() + 43200000));
      let delta = after - before;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      retrograde = delta < 0;
    }
    placements[p] = { point: p, lon, sign: signFromLongitude(lon), retrograde };
  }

  const hasAngles = time.timeKnown && !!input.place;
  if (hasAngles && input.place) {
    const { asc, mc } = angles(time.utc, input.place.lat, input.place.lon);
    placements.asc = { point: "asc", lon: asc, sign: signFromLongitude(asc) };
    placements.mc = { point: "mc", lon: mc, sign: signFromLongitude(mc) };
    const ascIdx = Math.floor(asc / 30);
    for (const p of [...PLANETS, "mc"] as Point[]) {
      const pl = placements[p];
      if (pl) pl.house = ((Math.floor(pl.lon / 30) - ascIdx + 12) % 12) + 1;
    }
    placements.asc.house = 1;
  }

  // Moon sign ambiguity when birth time is unknown: check the full local day.
  let moonAmbiguous = false;
  const moonAlternatives: Sign[] = [placements.moon!.sign];
  if (!time.timeKnown) {
    for (const hhmm of ["00:00", "23:59"]) {
      const t2 = resolveBirthTime({ ...input, time: hhmm });
      const s = signFromLongitude(longitude("moon", t2.utc));
      if (!moonAlternatives.includes(s)) { moonAlternatives.push(s); moonAmbiguous = true; }
    }
  }

  const aspects: Aspect[] = [];
  const pts = (Object.keys(placements) as Point[]).filter((p) => placements[p] && p !== "node" && p !== "mc");
  for (let i = 0; i < pts.length; i++)
    for (let j = i + 1; j < pts.length; j++) {
      const a = findAspect(placements[pts[i]]!.lon, placements[pts[j]]!.lon, pts[i], pts[j]);
      if (a) aspects.push(a);
    }
  aspects.sort((x, y) => x.orb - y.orb);

  const elementBalance: Record<Element, number> = { fire: 0, earth: 0, air: 0, water: 0 };
  const modalityBalance: Record<Modality, number> = { cardinal: 0, fixed: 0, mutable: 0 };
  const weights: Partial<Record<Point, number>> = { sun: 3, moon: 3, asc: 3, mercury: 2, venus: 2, mars: 2, jupiter: 1, saturn: 1 };
  for (const [p, w] of Object.entries(weights) as [Point, number][]) {
    const pl = placements[p];
    if (!pl) continue;
    elementBalance[SIGN_ELEMENT[pl.sign]] += w;
    modalityBalance[SIGN_MODALITY[pl.sign]] += w;
  }

  return { input, time, placements, aspects, moonAmbiguous, moonAlternatives, elementBalance, modalityBalance, hasAngles };
}

/** Sun sign only (fast path for SEO tools / calibration). */
export function sunSignForDate(date: string): Sign {
  return signFromLongitude(longitude("sun", resolveBirthTime({ date, time: null }).utc));
}
