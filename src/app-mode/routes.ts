/**
 * Which first-level routes (internal English names, see lib/i18n-routes) ship inside the store app.
 * scripts/build-app.mjs deletes every other folder from out-app/, and NativeBoot opens links to them on the website instead.
 * Left out on purpose: the dated horoscope archive, blog, admin, partners, pricing and checkout, and the SEO sections
 * whose pages are written for one build date (weekly, monthly, 2027, moon calendar, retrograde, numerology, sign pages, compatibility).
 */
import { parsePath } from "../lib/i18n-routes.ts";

export const APP_SECTIONS: readonly string[] = [
  "", "today", "daily", "horoscope", "me", "you", "person", "people", "start", "chart", "quizzes", "quiz", "deep", "play",
  "match", "bond", "book", "lens", "challenge", "invite", "account", "auth", "reset", "privacy", "terms", "how-it-works", "learn", "promise",
  "rising-sign", "moon-sign", "birth-chart",
];
const KEEP = new Set(APP_SECTIONS);

/** True when a site path (e.g. /mk/dneven-horoskop/oven/) is inside the app bundle. Dated horoscope pages are never bundled. */
export function isBundled(pathname: string): boolean {
  if (!/^\/[a-z]{2}(\/|$)/.test(pathname)) return pathname === "/" || pathname === "";
  const p = parsePath(pathname.endsWith("/") ? pathname : `${pathname}/`);
  if (!p) return false;
  const parts = p[1].split("/");
  if (!KEEP.has(parts[1] ?? "")) return false;
  if (parts[1] === "horoscope" && /^\d{4}-\d{2}-\d{2}$/.test(parts[3] ?? "")) return false;
  return true;
}
