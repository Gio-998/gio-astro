import type { Sign, Element } from "@/engine/zodiac";
import type { MoonPhase } from "@/engine/daily";
import type { Body } from "@/engine/skyday";

type Twelve<T> = [T, T, T, T, T, T, T, T, T, T, T, T];
/** Extra hand-written blocks for the long-form daily reading. Twelve = by house (index = house - 1). */
export interface HoroMore {
  ordinal: Twelve<string>;
  theme: Twelve<[string, string]>; phaseMood: Record<MoonPhase, string>; elMood: Record<Element, string>; close: [string, string, string, string];
  single: Twelve<[string, string]>; couple: Twelve<[string, string]>;
  money: Twelve<string>; jupiter: Twelve<string>;
  body: Record<Sign, string>; saturn: Twelve<string>; family: Record<MoonPhase, string>; signNote: Record<Sign, string>;
  sunWhy: (sign: string, ord: string) => string;
  friends: Twelve<[string, string]>;
  houseWhy: Twelve<string>; planetWhy: Record<Body, string>;
  why: {
    moon: (ord: string, sign: string) => string; pace: string;
    retro: (body: string, meaning: string, ord: string) => string; station: (body: string, meaning: string, dir: "retro" | "direct", ord: string) => string;
    ingress: (body: string, meaning: string, sign: string, ord: string) => string; quarter: (q: string, ord: string) => string;
  };
  quarterName: Record<"new" | "first-quarter" | "full" | "last-quarter", string>;
  bestBy: [string, string, string]; avoid: Record<MoonPhase, string>; avoidRetro: Record<"mercury" | "venus" | "mars", string>;
  prompt: Twelve<[string, string]>;
  week: { ingress: (body: string, sign: string, topic: string) => string; station: (body: string, dir: "retro" | "direct", sign: string) => string; quarter: (q: string, sign: string, topic: string) => string; on: (date: string) => string; none: string };
  ui: { overview: string; love: string; single: string; couple: string; workMoney: string; well: string; friends: string; why: string; timing: string; best: string; avoid: string; prompt: string; week: string; how: string; howText: string; howLink: string; planets: string; retroMark: string };
}
