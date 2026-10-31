import { CONTENT_DATES } from "@/lib/content-dates";
import type { Section } from "./types";

/** Weekly horoscopes: /weekly-horoscope/, /weekly-horoscope/<sign>/. */
export const weekly: Section = { key: "weekly-horoscope", paths: () => [], model: () => null, modified: () => CONTENT_DATES.pages };
