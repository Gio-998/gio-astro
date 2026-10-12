import type { Sign, Element } from "@/engine/zodiac";
import type { MoonPhase } from "@/engine/daily";
import type { Body, AspectKind } from "@/engine/skyday";
import type { HoroMore } from "./more-types";

type Twelve<T> = [T, T, T, T, T, T, T, T, T, T, T, T];
/** Hand-written building blocks for the public daily horoscope, one file per locale. Index = house - 1. */
export interface HoroBank {
  more: HoroMore;
  slug: string; signSlug: Record<Sign, string>;
  bodies: Record<Body, string>; phases: Record<MoonPhase, string>; topics: Twelve<string>;
  headline: Twelve<[string, string, string]>;
  love: Twelve<string>; venus: Twelve<string>; venusRetro: string;
  work: Twelve<string>; mars: Twelve<string>; mercuryRetro: string; marsRetro: string;
  well: Record<MoonPhase, string>; wellEl: Record<Element, string>;
  colors: Record<Element, [string, string, string]>;
  weekdays: string[];
  sky: {
    moonIn: (sign: string, phase: string, illum: number) => string; moonMoves: (sign: string, time: string) => string; forYou: (topic: string) => string;
    quarter: Record<"new" | "first-quarter" | "full" | "last-quarter", (sign: string, time: string, topic: string) => string>;
    station: Record<"retro" | "direct", (body: string, sign: string, topic: string) => string>;
    ingress: (body: string, sign: string, topic: string) => string;
    aspect: Record<AspectKind, (a: string, b: string) => string>; exactToday: string;
    retroOngoing: (body: string, sign: string, topic: string) => string; calm: string;
    inSign: (list: string, many: boolean, sign: string) => string; retroSame: (body: string, sign: string) => string; and: string;
  };
  ui: {
    title: (sign: string, date: string) => string; shortTitle: (sign: string) => string; description: (sign: string, date: string, headline: string) => string;
    hubTitle: string; hubSub: string; homeEyebrow: string; homeTitle: string; homeAll: string; love: string; work: string; well: string; lucky: string; color: string; number: string; window: string;
    skyTitle: string; moodTitle: string; moodSub: string; moods: [string, string, string, string, string];
    ctaTitle: string; ctaSub: string; ctaBtn: string; yesterday: string; tomorrow: string; others: string; todayLink: string; moonLabel: string; read: string;
  };
}
