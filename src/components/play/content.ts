import { play as en } from "@/content/en/play";
import { play as mk } from "@/content/mk/play";
import { contents, type Content } from "@/content";
export type { PlayContent } from "@/content/en/play";
/** Play Mirror copy for a locale (kept out of the shared content index so it stays self-contained). */
export const playFor = (locale: string) => (locale === "mk" ? mk : en);
/** Same, from a Content object (used by non-React builders like the Book of You). */
export const playForContent = (c: Content) => (c === contents.mk ? mk : en);
