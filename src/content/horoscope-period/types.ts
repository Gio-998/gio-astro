import type { Sign } from "@/engine/zodiac";
import type { AspectKind, Body } from "@/engine/skyday";
import type { Quarter } from "@/engine/skyperiod";

export type Twelve<T> = [T, T, T, T, T, T, T, T, T, T, T, T];
export type Three = [string, string, string];
export type PeriodKind = "week" | "month";
export type Placed = "mercury" | "venus" | "mars" | "jupiter" | "saturn";
/** Dates are already localized, e.g. "5 November" or "5. November". */
export interface OpenCtx { sign: string; range: string; topic: string; sunSign: string; house: string }
export interface DescCtx { sign: string; range: string; key: string; best: string }
export interface HubCopy { title: string; h1: (label: string) => string; description: string; lead: (label: string) => string; intro: string[]; skyHead: string; howHead: string; how: string[]; faq: [string, string][] }

/**
 * Hand-written building blocks for weekly and monthly horoscopes, one file per locale. Index of a Twelve = house - 1.
 * Whole entries carry no placeholders, so they read the same way for every sign that reaches that house.
 * The rotation in src/lib/horoscope-period.ts picks a different variant of a Three for each consecutive period.
 */
export interface PeriodBank {
  /** Follows the word "in": "your first house", "deinem ersten Haus", "твојот прв дом". */
  houses: Twelve<string>;
  /** What a planet stands for, usable as the subject of a short clause. */
  rules: Record<Body, string>;
  lunation: Record<Quarter, string>;
  eclipse: Record<"solar" | "lunar", string>;
  dates: {
    /** "2 to 8 November" when m1 === m2, else "28 December to 3 January". */
    range: (d1: number, m1: string, d2: number, m2: string) => string;
    /** "on 5 November". */
    on: (date: string) => string;
    /** "from 4 to 6 November", "from 30 November to 2 December". */
    span: (d1: number, m1: string, d2: number, m2: string) => string;
    /** "Thursday, 5 November, 14:22". */
    timed: (dateWithWeekday: string, time: string) => string;
    /** "November 2026". */
    monthYear: (month: string, year: number) => string;
  };
  ui: {
    /** Section names: "Weekly horoscope", "Monthly horoscope". */
    section: Record<PeriodKind, string>;
    titleWeek: (sign: string) => string;
    titleMonth: (sign: string) => string;
    titleDated: (sign: string, monthYear: string) => string;
    h1Week: (sign: string, range: string) => string;
    h1Month: (sign: string, monthYear: string) => string;
    heads: { short: Record<PeriodKind, string>; sky: string; steps: string; love: string; work: string; well: string; best: string; prompt: Record<PeriodKind, string> };
    /** Top of the sky block: how the dates were computed. */
    skyNote: Record<PeriodKind, string>;
    /** Candidates for the meta description, longest first; the first that fits 120 to 155 characters wins. */
    descWeek: ((c: DescCtx) => string)[];
    descMonth: ((c: DescCtx) => string)[];
    descDated: ((c: DescCtx) => string)[];
    related: { daily: (sign: string) => string; zodiac: (sign: string) => string; year: (sign: string) => string; moon: string; week: string; month: string; hub: Record<PeriodKind, string>; hubDaily: string };
  };
  sky: {
    /** "full Moon in Taurus". */
    lunation: (label: string, sign: string) => string;
    /** "Venus enters Capricorn". */
    ingress: (body: string, sign: string) => string;
    station: Record<"retro" | "direct", (body: string, sign: string) => string>;
    aspect: Record<AspectKind, (a: string, b: string) => string>;
    /** Sentence after an event: "It lands in your eleventh house: friends, groups and hopes." */
    house: (house: string, topic: string) => string;
    /** Sentence after an aspect, built from two `rules` phrases. */
    note: Record<"soft" | "hard" | "conj", (a: string, b: string) => string>;
    /** Page lead: "Full Moon in Taurus on 24 November, in your eleventh house." `event` comes in lower case, the result is capitalized for you. */
    lead: (event: string, on: string, house: string) => string;
    /** Page lead for an aspect, which has no house. */
    leadAspect: (event: string, on: string) => string;
    /** Page lead for a week with no event of its own, from a retrograde still running. `date` is a plain "13 November". */
    leadRetro: (body: string, house: string, date: string) => string;
    /** Short event with its date for the meta description: "full Moon in Taurus on 24 November". */
    key: (event: string, on: string, date: string) => string;
    /** Line for a retrograde that covers part of the period. `date` is a plain "13 November". */
    retro: Record<Placed, (sign: string, date: string) => string>;
    /** Weeks with no lunation: when the next one comes. */
    next: (event: string, on: string, house: string) => string;
    /** How the Moon's light changes across the period. Labels are nominative. */
    phaseArc: Record<PeriodKind, (startLabel: string, startPct: number, endLabel: string, endPct: number) => string>;
  };
  /** First sentence of a page, names the sign and the range. */
  open: Record<PeriodKind, ((c: OpenCtx) => string)[]>;
  /** What it means when the Sun lights up a house. */
  sun: Twelve<Three>;
  /** Moon quarter landing in a house. */
  lunations: Record<Quarter, Twelve<string>>;
  /** One sentence placing a planet in its sign and house, in rotation. `per` is the word for the period ("week"). */
  place: Record<Placed, ((sign: string, house: string, per: string) => string)[]>;
  /** A planet changes sign during the period. `on` is an "on 12 November" phrase. */
  move: (body: string, from: string, houseFrom: string, to: string, houseTo: string, on: string) => string;
  per: Record<PeriodKind, string>;
  mercury: Twelve<Three>; venus: Twelve<Three>; mars: Twelve<Three>; jupiter: Twelve<Three>; saturn: Twelve<Three>;
  /** How to handle a retrograde. Independent of the house. */
  retroNote: Record<"mercury" | "venus" | "mars", Three>;
  /** Love angle of the house the main event lands in. */
  love: Twelve<[string, string]>;
  single: string[]; couple: string[];
  /** Sentences that give the dates the Moon crosses a house. `when` is an "on 5 November" or "from 4 to 6 November" phrase. */
  moon: Record<"love5" | "love7" | "work10" | "money2" | "rest12" | "self1", ((when: string) => string)[]>;
  /** Used when the Moon does not reach any of the houses above in the period. */
  moonFallback: Record<"love" | "work" | "well", string[]>;
  phaseWell: Record<Quarter, Three>;
  well: Record<Sign, Three>;
  /** How a sign tends to handle each Moon quarter. */
  voice: Record<Sign, Record<Quarter, string>>;
  /** Why a day is good with the Moon in that house. */
  best: Twelve<Three>;
  /** One line of the best days list. */
  bestLine: (dateWithWeekday: string, moonSign: string, text: string) => string;
  prompts: Twelve<Three>;
  hub: Record<PeriodKind, HubCopy>;
}
