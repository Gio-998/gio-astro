import type * as En from "../en/astro";

type Names<T> = { [K in keyof T]: { name: string } };

/**
 * Only the names so far. The rest of the Serbian copy gets these in the nominative and declines them in
 * src/content/horoscope/sr-cases.ts, so a name that differs from that table stays undeclined. The full file replaces this one.
 */
export const signs: Names<typeof En.signs> = {
  aries: { name: "Ovan" }, taurus: { name: "Bik" }, gemini: { name: "Blizanci" }, cancer: { name: "Rak" }, leo: { name: "Lav" }, virgo: { name: "Devica" },
  libra: { name: "Vaga" }, scorpio: { name: "Škorpija" }, sagittarius: { name: "Strelac" }, capricorn: { name: "Jarac" }, aquarius: { name: "Vodolija" }, pisces: { name: "Ribe" },
};
export const points: Names<typeof En.points> = {
  sun: { name: "Sunce" }, moon: { name: "Mesec" }, mercury: { name: "Merkur" }, venus: { name: "Venera" }, mars: { name: "Mars" }, jupiter: { name: "Jupiter" }, saturn: { name: "Saturn" },
  uranus: { name: "Uran" }, neptune: { name: "Neptun" }, pluto: { name: "Pluton" }, node: { name: "Severni čvor" }, asc: { name: "Podznak" }, mc: { name: "Sredina neba" },
};
