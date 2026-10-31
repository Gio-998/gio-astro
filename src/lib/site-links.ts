/** The public reading sections as one list, so the footer, the hub link blocks and the crawl test can never drift apart. Safe for client bundles. */
import { nav as en } from "@/content/en/nav";
import { nav as mk } from "@/content/mk/nav";
import { nav as de } from "@/content/de/nav";

export const navFor = (lang: string) => ({ en, mk, de })[lang as "en"] ?? en;
export type SiteLink = { href: string; title: string; desc: string };

/** Internal paths with their labels, daily horoscope first. Turn a href into a URL with localizedPath. */
export function siteLinks(lang: string): SiteLink[] {
  const N = navFor(lang);
  const hubs = ["/sign-compatibility/", "/numerology/"];
  return [{ href: "/horoscope/", title: N.horoscope.label, desc: N.horoscope.desc }, ...N.groups.astrology.items, ...[...N.groups.bonds.items, ...N.groups.numerology.items].filter((i) => hubs.includes(i.href))].map(({ href, title, desc }) => ({ href, title, desc }));
}
