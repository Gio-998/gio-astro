import { CONTENT_DATES } from "@/lib/content-dates";
import type { Section } from "./types";

/** Moon calendar: /moon-calendar/. */
export const moonCalendar: Section = { key: "moon-calendar", paths: () => [], model: () => null, modified: () => CONTENT_DATES.pages };
