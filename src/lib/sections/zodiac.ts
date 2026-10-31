import { CONTENT_DATES } from "@/lib/content-dates";
import type { Section } from "./types";

/** Zodiac sign profiles: /zodiac/, /zodiac/<sign>/. */
export const zodiac: Section = { key: "zodiac", paths: () => [], model: () => null, modified: () => CONTENT_DATES.pages };
