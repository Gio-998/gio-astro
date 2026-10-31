import { getContent } from "@/content";
import { SIGNS, SIGN_GLYPH, type Sign } from "@/engine/zodiac";
import { MONTHLY_PATH as M, currentMonth, monthPeriod, periodBank, periodHub, periodPage, publishedMonths } from "@/lib/horoscope-period";
import { localizedPath } from "@/lib/i18n-routes";
import type { Section, SectionModel } from "./types";

const monthName = (lang: string, ym: string) => periodBank(lang).dates.monthYear(getContent(lang).site.months[Number(ym.slice(5)) - 1], Number(ym.slice(0, 4)));
const monthLink = (lang: string, sign: Sign, ym: string) => ({ href: localizedPath(lang, `${M}${sign}/${ym}/`), label: monthName(lang, ym) });

/** A dated page never claims a change in the future: next month's page dates from the month it first appears in. */
function modified(path: string): string {
  const ym = path.match(/\/(\d{4}-\d{2})\/$/)?.[1]; const now = currentMonth().start;
  return ym && `${ym}-01` < now ? `${ym}-01` : now;
}

/** Monthly horoscopes: /monthly-horoscope/, /monthly-horoscope/<sign>/ (always the current month) and /monthly-horoscope/<sign>/<yyyy-mm>/ (kept online once published). */
function model(lang: string, path: string): SectionModel | null {
  const month = currentMonth(); const [, item, ym, ...rest] = path.split("/").filter(Boolean);
  if (!item) return periodHub(lang, month, M);
  if (rest.length || !SIGNS.includes(item as Sign)) return null;
  const sign = item as Sign; const months = publishedMonths();
  if (!ym) return periodPage(lang, path, sign, month, M, { modified: month.start, extra: [...months].reverse().map((m) => ({ ...monthLink(lang, sign, m), big: SIGN_GLYPH[sign] })) });
  const i = months.indexOf(ym); if (i < 0) return null;
  return periodPage(lang, path, sign, monthPeriod(ym), M, { dated: ym, modified: modified(path), prev: months[i - 1] ? monthLink(lang, sign, months[i - 1]) : undefined, next: months[i + 1] ? monthLink(lang, sign, months[i + 1]) : undefined });
}
export const monthly: Section = { key: "monthly-horoscope", paths: () => [M, ...SIGNS.map((s) => `${M}${s}/`), ...SIGNS.flatMap((s) => publishedMonths().map((m) => `${M}${s}/${m}/`))], model, modified };
