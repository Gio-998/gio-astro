import type { AspectKind } from "@/engine/skyday";
import type { MoonPhase } from "@/engine/daily";

/** Day context for rotating lead lines: real weekday, real Moon sign and phase, topic of the Moon's house. */
export interface DayCtx { day: string; moon: string; phase: string; topic: string }
type F = (c: DayCtx) => string;
type P = (topic: string) => string;
export type LeadSection = "overview" | "love" | "single" | "couple" | "work" | "money" | "well" | "friends";
/**
 * Rotating pools that keep each day's reading fresh. Picks are deterministic by date and sign and never
 * repeat on consecutive days (pools of 7+ never repeat inside a week).
 */
export interface HoroVariety {
  headline: F[]; // 10+
  lead: Record<LeadSection, F[]>; // 8 each
  planet: Record<"mercury" | "venus" | "mars" | "jupiter" | "saturn", P[]>; // 8 each, topic of the planet's house
  retro: Record<"mercury" | "venus" | "mars", string[]>; // 4 each
  moonAspect: Record<AspectKind, ((planet: string, time: string) => string)[]>; // 3 each
  weekday: [string, string, string, string, string, string, string]; // Sunday first
  dayTip: string[]; dayLove: string[]; dayPeople: string[]; // 7 each, Sunday first
  tip: string[]; bodyTip: string[]; // 8 each
  best: [string[], string[], string[]]; // morning, midday, evening; 3 each
  avoid: ((phase: string) => string)[]; // 8
  whyMoon: ((ord: string, sign: string) => string)[]; // 6
  /** Phase wording used inside the pools when it differs from the bank's phase names (German dative). */
  phaseForm?: Record<MoonPhase, string>;
  whySun: ((sign: string, ord: string) => string)[]; // 8
}
