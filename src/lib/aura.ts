/** Map ritual answers + a person's profile to the symbolic aura visual. Pure, no DOM. */
import type { AuraState } from "@/components/aura/Aura";
import type { StoredPerson } from "./store";
import { profileOf } from "./profile";

export const WEATHERS = ["sunny", "cloudy", "stormy", "foggy", "rainbow"] as const;
export const BODIES = ["light", "heavy", "tense", "buzzing", "grounded"] as const;
export const INTENTIONS = ["love", "clarity", "healing", "courage", "peace"] as const;
export type Weather = (typeof WEATHERS)[number]; export type BodyFeel = (typeof BODIES)[number]; export type Intention = (typeof INTENTIONS)[number];
export interface AuraAnswers { energy?: number; weather?: Weather; body?: BodyFeel; intention?: Intention; at?: string }

export const WEATHER_HEART: Record<Weather, { heart: string; turb: number }> = {
  sunny: { heart: "#ffd27a", turb: 0.15 }, cloudy: { heart: "#b9c3e6", turb: 0.35 }, stormy: { heart: "#8a7dff", turb: 0.85 },
  foggy: { heart: "#cfd8e8", turb: 0.25 }, rainbow: { heart: "#ff9ed2", turb: 0.3 },
};
export const BODY_MAP: Record<BodyFeel, { nerves: number; centres: number; focus: number }> = {
  light: { nerves: 0.5, centres: 0.7, focus: 6 }, heavy: { nerves: 0.2, centres: 0.35, focus: 0 }, tense: { nerves: 0.9, centres: 0.45, focus: 2 },
  buzzing: { nerves: 1, centres: 0.8, focus: 4 }, grounded: { nerves: 0.35, centres: 0.6, focus: 0 },
};
export const INTENTION_MAP: Record<Intention, { focus: number; color: string }> = {
  love: { focus: 3, color: "#ff8fb1" }, clarity: { focus: 5, color: "#8fd3ff" }, healing: { focus: 3, color: "#7fe0b0" },
  courage: { focus: 2, color: "#ffb35c" }, peace: { focus: 6, color: "#c9b2ff" },
};
const NEUTRAL = ["#cbbcff", "#f3e3c3", "#a9c8ff", "#e9c6ff", "#ffe2b8"];

/** Build the aura from whatever is known so far (works mid-ritual with partial data). */
export function auraState(opts: { palette?: string[] | null; answers?: AuraAnswers; presence?: number }): AuraState {
  const a = opts.answers ?? {};
  const colors = [...(opts.palette ?? NEUTRAL)];
  if (a.intention) colors[4] = INTENTION_MAP[a.intention].color;
  const w = a.weather ? WEATHER_HEART[a.weather] : null; const b = a.body ? BODY_MAP[a.body] : null;
  return {
    colors, energy: a.energy != null ? 0.15 + (a.energy - 1) * 0.2 : 0.5, turbulence: w?.turb ?? 0.3, heart: w?.heart ?? colors[0],
    nerves: b?.nerves ?? 0.5, centres: b?.centres ?? 0.5, focus: a.intention ? INTENTION_MAP[a.intention].focus : b?.focus ?? null, presence: opts.presence ?? 1,
  };
}
export const auraOf = (p: StoredPerson): AuraState => auraState({ palette: profileOf(p).palette, answers: p.aura });
