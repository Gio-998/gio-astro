/** Registry of public URL families added on top of the horoscope and numerology sections. Each family owns one file here. */
import type { Section, SectionModel } from "./types";
import { zodiac } from "./zodiac";
import { weekly } from "./weekly-horoscope";
import { monthly } from "./monthly-horoscope";
import { yearly } from "./horoscope-2027";
import { signCompatibility } from "./sign-compatibility";
import { risingSign } from "./rising-sign";
import { moonSign } from "./moon-sign";
import { birthChart } from "./birth-chart";
import { moonCalendar } from "./moon-calendar";
import { mercuryRetrograde } from "./mercury-retrograde";

export const SECTIONS: Record<string, Section> = Object.fromEntries([zodiac, weekly, monthly, yearly, signCompatibility, risingSign, moonSign, birthChart, moonCalendar, mercuryRetrograde].map((s) => [s.key, s]));
export const sectionModel = (lang: string, path: string): SectionModel | null => SECTIONS[path.split("/")[1]]?.model(lang, path) ?? null;
