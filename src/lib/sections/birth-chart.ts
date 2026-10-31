import { CONTENT_DATES } from "@/lib/content-dates";
import type { Section } from "./types";

/** Birth chart calculator: /birth-chart/. */
export const birthChart: Section = { key: "birth-chart", paths: () => [], model: () => null, modified: () => CONTENT_DATES.pages };
