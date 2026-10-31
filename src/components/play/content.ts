import { play as en } from "@/content/en/play";
import { play as mk } from "@/content/mk/play";
import { play as de } from "@/content/de/play";
import { play as sr } from "@/content/sr/play";
import { contents, type Content } from "@/content";
export type { PlayContent } from "@/content/en/play";
/** Play Mirror copy for a locale (kept out of the shared content index so it stays self-contained). */
export const playFor = (locale: string) => (locale === "mk" ? mk : locale === "de" ? de : locale === "sr" ? sr : en);
/** Same, from a Content object (used by non-React builders like the Book of You). */
export const playForContent = (c: Content) => (c === contents.mk ? mk : c === contents.de ? de : c === contents.sr ? sr : en);
