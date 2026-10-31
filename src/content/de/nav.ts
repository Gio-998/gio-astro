import type { Nav } from "../en/nav";
export const nav: Nav = {
  aria: { utility: "Sprache und Konto", quick: "Schnellzugriff", tabs: "Hauptbereiche" },
  more: "Mehr", menu: "Menü", close: "Schließen", account: "Konto", language: "Sprache",
  start: "Test starten", login: "Anmelden", profile: "Mein Profil",
  tabs: { horoscope: "Horoskop", tests: "Tests", match: "Partner", numbers: "Zahlen" },
  trust: [
    { icon: "🔒", text: "Privat von Anfang an", href: "/privacy/" },
    { icon: "✦", text: "Gratis nutzbar", href: "/promise/" },
    { icon: "↺", text: "Kein Konto nötig", href: "/promise/" },
  ],
  trustLabel: "Unser Versprechen an dich",
  method: "So wird das gemessen",
  today: { label: "Mein Tag", desc: "Dein Himmel, deine Karte, dein Impuls für heute" },
  horoscope: { label: "Tageshoroskop", desc: "Alle 12 Zeichen, jeden Tag neu" },
  pricing: { label: "Preise", desc: "Im Moment ist alles gratis" },
  groups: {
    astrology: {
      label: "Horoskop", linksTitle: "Horoskope, Sternzeichen und Rechner",
      items: [
        { href: "/weekly-horoscope/", icon: "sun", title: "Wochenhoroskop", desc: "Deine nächsten sieben Tage, Zeichen für Zeichen" },
        { href: "/monthly-horoscope/", icon: "moon", title: "Monatshoroskop", desc: "Der kommende Monat für alle 12 Zeichen" },
        { href: "/horoscope-2027/", icon: "eye", title: "Jahreshoroskop 2027", desc: "Die großen Themen des Jahres je Sternzeichen" },
        { href: "/zodiac/", icon: "explorer", title: "Sternzeichen", desc: "Daten, Eigenschaften, Liebe und Beruf" },
        { href: "/birth-chart/", icon: "chart", title: "Geburtshoroskop berechnen", desc: "Planeten und Häuser aus deinen Geburtsdaten" },
        { href: "/rising-sign/", icon: "yinyang", title: "Aszendent berechnen", desc: "Aus Geburtszeit und Geburtsort" },
        { href: "/moon-sign/", icon: "moon", title: "Mondzeichen berechnen", desc: "Wo der Mond bei deiner Geburt stand" },
        { href: "/moon-calendar/", icon: "moon", title: "Mondkalender", desc: "Neumond, Vollmond und alle Mondphasen" },
        { href: "/mercury-retrograde/", icon: "vedic", title: "Merkur rückläufig", desc: "Die Termine und was sie bedeuten" },
      ],
    },
    tests: {
      label: "Tests",
      allHref: "/quizzes/", allTitle: "Alle Tests", allDesc: "Such dir einen aus, je ein bis drei Minuten",
      play: { href: "/play/", title: "Play-Mirror-Spiele", desc: "Verhalten statt Selbstbild: Risiko, Vertrauen, Geduld, Fokus" },
      deep: { href: "/deep/", title: "Tiefenlesung", desc: "Schwere Entscheidungen und Bauchgefühl, passt sich dir an" },
    },
    bonds: {
      label: "Kompatibilität",
      items: [
        { href: "/sign-compatibility/", icon: "bond", title: "Partnerhoroskop", desc: "Wie gut zwei Sternzeichen zusammenpassen" },
        { href: "/match/", icon: "care", title: "Zwei Menschen vergleichen", desc: "Aus den Geburtsdaten, mit Ideen zum Ausprobieren" },
        { href: "/bond/", icon: "attachment", title: "Beziehungscheck", desc: "Je zehn Fragen, gemeinsam beantwortet" },
      ],
    },
    numerology: {
      label: "Numerologie",
      items: [
        { href: "/numerology/", icon: "number", title: "Numerologie", desc: "Engelszahlen, Lebenszahl und Rechner" },
        { href: "/numerology/angel-numbers/", icon: "eye", title: "Engelszahlen", desc: "Was sich wiederholende Zahlen bedeuten können" },
        { href: "/numerology/calculator/life-path/", icon: "yinyang", title: "Lebenszahl berechnen", desc: "Deine Zahl aus dem Geburtsdatum" },
        { href: "/numerology/life-path/", icon: "sun", title: "Lebenszahlen", desc: "Wofür jede Zahl steht" },
        { href: "/numerology/mirror-hours/", icon: "moon", title: "Spiegelzahlen", desc: "Wenn dir 11:11 oder 22:22 immer wieder begegnet" },
        { href: "/numerology/compatibility/", icon: "bond", title: "Zahlen und Partnerschaft", desc: "Wie zwei Lebenszahlen zusammenpassen" },
      ],
    },
    me: {
      label: "Mein Profil",
      items: [
        { href: "/me/", icon: "sun", title: "Mein Profil", desc: "Zeichen, Zahlen und Ergebnisse an einem Ort" },
        { href: "/today/", icon: "moon", title: "Mein Tag", desc: "Dein Himmel, deine Karte, dein Impuls für heute" },
        { href: "/book/", icon: "eye", title: "Das Buch über dich", desc: "Deine persönliche Deutung, Kapitel für Kapitel" },
        { href: "/chart/", icon: "chart", title: "Geburtshoroskop", desc: "Das ganze Rad mit Planeten und Häusern" },
        { href: "/people/", icon: "care", title: "Personen", desc: "Alle Gespeicherten, bereit zum Vergleich" },
        { href: "/account/", icon: "yinyang", title: "Konto", desc: "Anmelden, sichern und synchronisieren" },
      ],
    },
    more: {
      label: "Mehr",
      items: [
        { href: "/blog/", icon: "palette", title: "Blog", desc: "Geschichten über Zeichen, Liebe und Innenleben" },
        { href: "/how-it-works/", icon: "number", title: "So funktioniert's", desc: "Wie jede Deutung entsteht" },
        { href: "/learn/", icon: "eye", title: "Methoden und Quellen", desc: "Berechnungen, Studien und Ehrlichkeit" },
        { href: "/promise/", icon: "temperament", title: "Unser Versprechen", desc: "Klare Regeln, ehrliche Ergebnisse" },
      ],
    },
  },
};
