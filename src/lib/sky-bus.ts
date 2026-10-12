/** Tiny bus so any screen can steer the global Living Sky without importing it (keeps the WebGL chunk lazy). */
export interface SkyState {
  /** 0..1.5 overall brightness of aurora + nebula (default 1). */
  intensity: number;
  /** Swirl toward the centre (reveals), 0..1. */
  swirl: number;
  /** Optional palette override [a, b, c] as hex; null = house/personal colours from CSS variables. */
  palette: [string, string, string] | null;
}
const DEFAULT: SkyState = { intensity: 1, swirl: 0, palette: null };
let state: SkyState = { ...DEFAULT };
const subs = new Set<(s: SkyState) => void>();
export const getSky = () => state;
export function setSky(p: Partial<SkyState>) { state = { ...state, ...p }; subs.forEach((f) => f(state)); }
export function resetSky() { setSky(DEFAULT); }
export function onSky(f: (s: SkyState) => void) { subs.add(f); return () => { subs.delete(f); }; }
