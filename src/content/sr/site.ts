import type { Content, DeepPartial } from "..";

/**
 * Only what the rest of the Serbian copy depends on today: lower case month names in the nominative (src/lib/dates.ts and
 * src/content/horoscope/sr-cases.ts read them), the language menu, and the site name lines. The full file replaces this one.
 */
export const site: DeepPartial<Content["site"]> = {
  months: ["januar", "februar", "mart", "april", "maj", "jun", "jul", "avgust", "septembar", "oktobar", "novembar", "decembar"],
  weekdays: ["nedelja", "ponedeljak", "utorak", "sreda", "četvrtak", "petak", "subota"],
  language: "Jezik", languages: { en: "English", mk: "Македонски", de: "Deutsch", sr: "Srpski" },
  tagline: "Iskreno ogledalo za tebe i tvoje odnose",
  description: "Besplatna natalna karta, dnevni horoskop, testovi ličnosti i kompatibilnost za partnere, prijatelje i porodicu. Besplatno i bez naloga.",
};
