// Static reference data for the 12 Western signs. Names/keys are locale-neutral ids;
// display text lives in src/content/<locale>.

export const SIGNS = [
  "aries", "taurus", "gemini", "cancer", "leo", "virgo",
  "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces",
] as const;
export type Sign = (typeof SIGNS)[number];

export type Element = "fire" | "earth" | "air" | "water";
export type Modality = "cardinal" | "fixed" | "mutable";

export const SIGN_ELEMENT: Record<Sign, Element> = {
  aries: "fire", taurus: "earth", gemini: "air", cancer: "water",
  leo: "fire", virgo: "earth", libra: "air", scorpio: "water",
  sagittarius: "fire", capricorn: "earth", aquarius: "air", pisces: "water",
};

export const SIGN_MODALITY: Record<Sign, Modality> = {
  aries: "cardinal", taurus: "fixed", gemini: "mutable", cancer: "cardinal",
  leo: "fixed", virgo: "mutable", libra: "cardinal", scorpio: "fixed",
  sagittarius: "mutable", capricorn: "cardinal", aquarius: "fixed", pisces: "mutable",
};

/** Traditional + modern rulers (display only). */
export const SIGN_RULER: Record<Sign, string> = {
  aries: "Mars", taurus: "Venus", gemini: "Mercury", cancer: "Moon",
  leo: "Sun", virgo: "Mercury", libra: "Venus", scorpio: "Mars & Pluto",
  sagittarius: "Jupiter", capricorn: "Saturn", aquarius: "Saturn & Uranus", pisces: "Jupiter & Neptune",
};

export const SIGN_GLYPH: Record<Sign, string> = {
  aries: "♈\uFE0E", taurus: "♉\uFE0E", gemini: "♊\uFE0E", cancer: "♋\uFE0E", leo: "♌\uFE0E", virgo: "♍\uFE0E",
  libra: "♎\uFE0E", scorpio: "♏\uFE0E", sagittarius: "♐\uFE0E", capricorn: "♑\uFE0E", aquarius: "♒\uFE0E", pisces: "♓\uFE0E",
};

/** Approximate tropical Sun-sign date ranges (exact boundary varies by year — the chart tool computes it). */
export const SIGN_DATES: Record<Sign, [string, string]> = {
  aries: ["Mar 21", "Apr 19"], taurus: ["Apr 20", "May 20"], gemini: ["May 21", "Jun 20"],
  cancer: ["Jun 21", "Jul 22"], leo: ["Jul 23", "Aug 22"], virgo: ["Aug 23", "Sep 22"],
  libra: ["Sep 23", "Oct 22"], scorpio: ["Oct 23", "Nov 21"], sagittarius: ["Nov 22", "Dec 21"],
  capricorn: ["Dec 22", "Jan 19"], aquarius: ["Jan 20", "Feb 18"], pisces: ["Feb 19", "Mar 20"],
};

/** Yang (fire/air) vs yin (earth/water) polarity. */
export const isYangSign = (s: Sign) => SIGN_ELEMENT[s] === "fire" || SIGN_ELEMENT[s] === "air";

export function signFromLongitude(lon: number): Sign {
  const l = ((lon % 360) + 360) % 360;
  return SIGNS[Math.floor(l / 30)];
}
export const degreeInSign = (lon: number) => (((lon % 360) + 360) % 360) % 30;

export function formatDegree(lon: number): string {
  const d = degreeInSign(lon);
  let deg = Math.floor(d);
  let min = Math.round((d - deg) * 60);
  if (min === 60) { deg += 1; min = 0; }
  return `${deg}°${String(min).padStart(2, "0")}′`;
}

/** Number of signs from a to b counted the short way, 0..6. */
export function signDistance(a: Sign, b: Sign): number {
  const d = Math.abs(SIGNS.indexOf(a) - SIGNS.indexOf(b));
  return Math.min(d, 12 - d);
}

/** Canonical pair slug in zodiac order: "aries-and-leo". */
export function signPairSlug(a: Sign, b: Sign): string {
  const [x, y] = SIGNS.indexOf(a) <= SIGNS.indexOf(b) ? [a, b] : [b, a];
  return `${x}-and-${y}`;
}

export function allSignPairs(): [Sign, Sign][] {
  const out: [Sign, Sign][] = [];
  for (let i = 0; i < 12; i++) for (let j = i; j < 12; j++) out.push([SIGNS[i], SIGNS[j]]);
  return out;
}
