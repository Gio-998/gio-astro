import { CONTENT_DATES } from "@/lib/content-dates";
import type { Section } from "./types";

/** 2027 yearly horoscopes: /horoscope-2027/, /horoscope-2027/<sign>/. */
export const yearly: Section = { key: "horoscope-2027", paths: () => [], model: () => null, modified: () => CONTENT_DATES.pages };
