import { SIGNS, type Sign } from "@/engine/zodiac";
import { WEEKLY_PATH as W, currentWeek, periodHub, periodPage } from "@/lib/horoscope-period";
import type { Section, SectionModel } from "./types";

/** Weekly horoscopes: /weekly-horoscope/, /weekly-horoscope/<sign>/. Each sign page keeps its URL and always shows the current Monday to Sunday. */
function model(lang: string, path: string): SectionModel | null {
  const week = currentWeek(); const [, item, ...rest] = path.split("/").filter(Boolean);
  if (!item) return periodHub(lang, week, W);
  if (rest.length || !SIGNS.includes(item as Sign)) return null;
  return periodPage(lang, path, item as Sign, week, W, { modified: week.start });
}
export const weekly: Section = { key: "weekly-horoscope", paths: () => [W, ...SIGNS.map((s) => `${W}${s}/`)], model, modified: () => currentWeek().start };
