import type { CalendarCopy } from "./types";
import { en } from "./en";
import { mk } from "./mk";
import { de } from "./de";

export const CALENDARS: Record<string, CalendarCopy> = { en, mk, de };
export const calendarCopy = (lang: string): CalendarCopy => CALENDARS[lang] ?? en;
/** Bump when that family's copy changes. Published dates are computed and only ever move if the engine does. */
export const MOON_CALENDAR_DATE = "2026-10-31";
export const MERCURY_RETROGRADE_DATE = "2026-10-31";
