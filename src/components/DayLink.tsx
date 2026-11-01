import Link from "next/link";
import { addDays, todayIso } from "@/engine/skyday";

/** Keep equal to KEEP_DAYS in scripts/trim-export.mjs. */
const ROUTER_DAYS = 7;

/**
 * Link to a page that may be a dated horoscope. Dates older than a week have no router payload in the export (they stay online as plain HTML),
 * so they get a normal link and a normal page load. A <Link> would prefetch files that are not there. Server components only.
 */
export function DayLink({ href, ...a }: { href: string } & Omit<React.ComponentProps<"a">, "href">) {
  const date = href.match(/\/(\d{4}-\d{2}-\d{2})\/$/)?.[1];
  return date && date < addDays(todayIso(), -ROUTER_DAYS) ? <a href={href} {...a} /> : <Link href={href} {...a} />;
}
