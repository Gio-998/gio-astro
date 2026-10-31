import type { site as En } from "../en/site";
export const site: typeof En = {
  months: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
  weekdays: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
  themeOn: "Meine Farben: an", themeOff: "Meine Farben: aus", themeHint: "Färbe die ganze Seite in der Palette deines Elements oder wechsle zurück zum Standard.",
  datePicker: { day: "Tag", month: "Monat", year: "Jahr", done: "Fertig", placeholder: "Datum wählen", title: "Dein Datum", timePh: "Uhrzeit wählen", hour: "Stunde", minute: "Minute" },
  brand: "Horoscop",
  language: "Sprache", languages: { en: "English", mk: "Македонски", de: "Deutsch" },
  startShort: "Los geht's",
  hero: { eyebrow: "Sterne · Zahlen · Elemente · Wissenschaft", see: "Sieh ", words: ["dich selbst", "deine Liebe", "deine Freunde", "deine Familie"], mid: " und die Menschen um dich ", end: "in neuen Farben.", bornOn: "Ich bin geboren am", reveal: "Zeig mir meinen Himmel ✦", sub: "Dein Geburtshoroskop, chinesisches Tierzeichen, Zahlen, Tarot und die Persönlichkeitsforschung, die wirklich trägt. Alles in einem ehrlichen Spiegel für dich und deine Beziehungen. Kostenlos, in 90 Sekunden.", perks: ["✦ Ohne Anmeldung", "✦ Alle Ergebnisse gratis", "✦ Daten bleiben auf deinem Gerät"], orMatch: "Passt ihr zusammen?", scroll: "Scrollen", scrollDown: "Nach unten scrollen" },
  carousel: { prev: "Vorherige Zeichen", next: "Nächste Zeichen", gifts: "Stärken:", edge: "Hier wächst du:", more: "Dein Sonnenzeichen ist nur eine von 18 Perspektiven. Mond, Aszendent, chinesisches Tier und Zahlen erzählen oft eine ganz andere Geschichte.", cta: "Meinen ganzen Himmel sehen ✦" },
  pickCard: { prompt: "Atme tief durch, denk an eine Frage und zieh eine Karte.", today: "Heute:", again: "Neu mischen" },
  skyNow: { title: "Der Himmel gerade jetzt", note: "Live in deinem Browser berechnet, aus den echten Planetenpositionen.", cta: "Was heute für dein Horoskop bedeutet →" },
  footerCols: { astro: "Astrologie", discover: "Entdecken", rel: "Beziehungen", trust: "Vertrauen", chart: "Gratis Geburtshoroskop", me: "Mein Profil", today: "Dein Tag heute", quizzes: "Alle Quizze", match: "Kompatibilität", bond: "Beziehungscheck zu zweit", people: "Gespeicherte Personen", extras: "Extras", blurb: "Jede Perspektive ehrlich gekennzeichnet. Alle Ergebnisse gratis, deine Daten bleiben bei dir." },
  tagline: "Ein ehrlicher Spiegel für dich und deine Beziehungen",
  description: "Gratis Geburtshoroskop, Tageshoroskop, Persönlichkeitsquizze und Kompatibilität für Partner, Freunde und Familie. Alle Ergebnisse sind kostenlos.",
  nav: { today: "Heute", me: "Mein Profil", match: "Kompatibilität", people: "Personen", bond: "Beziehungscheck", quizzes: "Quizze", learn: "So funktioniert's" },
  footer: {
    privacy: "Datenschutz", terms: "AGB", promise: "Unser Versprechen", learn: "Methodik", credits: "Danksagungen",
  },
  common: {
    start: "In 90 Sekunden starten", continue: "Weiter", back: "Zurück", next: "Weiter", save: "Speichern", cancel: "Abbrechen", delete: "Löschen",
    edit: "Bearbeiten", loading: "Lädt…", share: "Karte teilen", download: "Bild speichern", copy: "Kopieren", copied: "Kopiert!",
    unknownTime: "Ich kenne meine Geburtszeit nicht", optional: "optional", free: "Gratis", locked: "Noch nicht freigeschaltet", unlock: "Freischalten",
    minutes: (n: number) => `${n} Min.`, retake: "Nochmal", you: "Du",
  },
};
