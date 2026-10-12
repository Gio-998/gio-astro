"use client";
import { useCallback, useMemo, useRef } from "react";
import { useReducedMotion } from "motion/react";

/** Short vibration where supported (Android Chrome; iOS Safari ignores it). Silent when reduced motion is on. */
export function haptic(pattern: number | number[], reduce?: boolean | null) {
  if (reduce) return;
  try { (navigator as Navigator & { vibrate?: (p: number | number[]) => boolean }).vibrate?.(pattern); } catch { /* not supported */ }
}
export const HAPTIC = { tap: 8, good: [12, 40, 18], bad: [60, 30, 90], win: [10, 30, 10, 30, 40] };

/** Monotonic clock in ms (wrapped so event handlers stay lint-clean). */
export const now = () => performance.now();

/** Records every tap (for erratic-burst detection) and the game's start time. */
export function useTapLog() {
  const taps = useRef<number[]>([]); const t0 = useRef(0);
  const start = useCallback(() => { t0.current = performance.now(); taps.current = []; }, []);
  const tap = useCallback(() => { taps.current.push(performance.now()); }, []);
  const elapsed = useCallback(() => Math.round(performance.now() - t0.current), []);
  return useMemo(() => ({ taps, start, tap, elapsed }), [start, tap, elapsed]);
}
export function useReduce() { return !!useReducedMotion(); }
