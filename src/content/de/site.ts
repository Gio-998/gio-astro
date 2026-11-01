import type { site as En } from "../en/site";
export const site: typeof En = {
  months: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
  weekdays: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
  themeOn: "Meine Farben: an", themeOff: "Meine Farben: aus", themeHint: "Färbe die ganze Seite in der Palette deines Elements oder wechsle zurück zum Standard.",
  datePicker: { day: "Tag", month: "Monat", year: "Jahr", done: "Fertig", placeholder: "Datum wählen", title: "Dein Datum", timePh: "Uhrzeit wählen", hour: "Stunde", minute: "Minute" },
  brand: "Horoscop",
  language: "Sprache", languages: { en: "English", mk: "Македонски", de: "Deutsch", sr: "Srpski" },
  hero: { title: ["Sieh dich und die Menschen um dich ", "in neuen Farben."], sub: "Tageshoroskope, kurze Persönlichkeitstests und Numerologie an einem ehrlichen Ort.", daily: "Tageshoroskop lesen", perks: ["Gratis", "Kein Konto nötig", "Tests starten sofort"] },
  footerCols: { astro: "Astrologie", discover: "Tests und Werkzeuge", trust: "Über uns", chart: "Profil erstellen", quizzes: "Alle Tests", match: "Zwei Menschen vergleichen", bond: "Beziehungscheck zu zweit", notes: "Tagesimpuls nach Sternzeichen", blurb: "Gratis nutzbar, kein Konto nötig, und immer klar, was Forschung ist und was Tradition." },
  tagline: "Ein ehrlicher Spiegel für dich und deine Beziehungen",
  description: "Gratis Geburtshoroskop, Tageshoroskop, Persönlichkeitstests und Kompatibilität für Partner, Freunde und Familie. Kostenlos und ohne Konto.",
  footer: {
    privacy: "Datenschutz", terms: "AGB", promise: "Unser Versprechen", learn: "Methodik", credits: "Danksagungen",
  },
  common: {
    start: "Geburtsdatum eingeben", continue: "Weiter", back: "Zurück", next: "Weiter", save: "Speichern", cancel: "Abbrechen", delete: "Löschen",
    edit: "Bearbeiten", loading: "Lädt…", share: "Karte teilen", download: "Bild speichern", copy: "Kopieren", copied: "Kopiert!",
    unknownTime: "Ich kenne meine Geburtszeit nicht", optional: "optional", free: "Gratis", locked: "Noch nicht freigeschaltet", unlock: "Freischalten",
    minutes: (n: number) => `${n} Min.`, retake: "Nochmal", you: "Du",
  },
};
