import { inline } from "@/content/sr/inline";

/** BCP 47 tag for Intl calls. Plain "sr" gives Cyrillic month names, and Serbian on this site is Latin. */
export const intlLocale = (locale = "en") => ({ mk: "mk-MK", de: "de-DE", sr: inline.dateLocale } as Record<string, string>)[locale] ?? "en-GB";
