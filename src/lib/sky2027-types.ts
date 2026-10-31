import type { Sign } from "@/engine/zodiac";

export type SkyBody = "sun" | "mercury" | "venus" | "mars" | "jupiter" | "saturn" | "uranus" | "neptune" | "pluto";
/** All dates are YYYY-MM-DD and all times HH:mm in Europe/Skopje, the same clock as Germany, Austria and Switzerland. */
export type SkyPlace = { body: SkyBody; sign: Sign; deg: number; retro: boolean };
export type SkyIngress = { body: SkyBody; sign: Sign; date: string; time: string; retro: boolean };
export type SkyStation = { body: SkyBody; dir: "retro" | "direct"; date: string; time: string; sign: Sign; deg: number };
export type SkyMoon = { kind: "new" | "full"; date: string; time: string; sign: Sign; deg: number };
export type SkyEclipse = { kind: "solar" | "lunar"; type: "total" | "annular" | "partial" | "penumbral"; date: string; time: string; sign: Sign; deg: number };
/** `alt` is the height of the Sun or Moon in degrees at peak (negative means below the horizon), `covered` the percent of the Sun's disc hidden. */
export type SkyEclipseView = { place: string; kind: "solar" | "lunar"; date: string; time: string; alt: number; covered?: number };
export type SkySlowAspect ={ a: SkyBody; b: SkyBody; type: "conjunction" | "sextile" | "square" | "trine" | "opposition"; date: string; signA: Sign; signB: Sign; degA: number; degB: number };
export interface SkyData {
  zone: string;
  /** Where each body stands at the first and last moment of the year. */
  start: SkyPlace[]; end: SkyPlace[];
  ingresses: SkyIngress[]; stations: SkyStation[]; moons: SkyMoon[]; eclipses: SkyEclipse[]; eclipseViews: SkyEclipseView[]; slowAspects: SkySlowAspect[];
}
