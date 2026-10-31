import { CONTENT_DATES } from "@/lib/content-dates";
import type { Section } from "./types";

/** Monthly horoscopes: /monthly-horoscope/, /monthly-horoscope/<sign>/. */
export const monthly: Section = { key: "monthly-horoscope", paths: () => [], model: () => null, modified: () => CONTENT_DATES.pages };
