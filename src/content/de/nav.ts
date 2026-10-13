import type { Nav } from "../en/nav";
export const nav: Nav = {
  aria: { utility: "Sprache und Konto", quick: "Schnellzugriff", tabs: "Hauptbereiche" },
  more: "Mehr", menu: "Menü", close: "Schließen", account: "Konto", language: "Sprache",
  trust: [
    { icon: "🔒", text: "Privat von Anfang an", href: "/privacy/" },
    { icon: "✦", text: "Volle Ergebnisse gratis", href: "/promise/" },
    { icon: "↺", text: "Jederzeit kündbar", href: "/promise/" },
  ],
  trustLabel: "Unser Versprechen an dich",
  method: "So wird das gemessen",
  today: { label: "Heute", desc: "Dein Himmel, deine Karte, dein Impuls" },
  horoscope: { label: "Tageshoroskop", desc: "Alle 12 Zeichen, jeden Tag neu" },
  pricing: { label: "Preise", desc: "Pläne, Reports und was gratis bleibt" },
  groups: {
    me: {
      label: "Ich", feature: { title: "Dein ganzes Ich auf einer Seite", text: "Zeichen, Zahlen, Aura und alle Testergebnisse auf einen Blick.", cta: "Mein Profil öffnen" },
      items: [
        { href: "/me/", icon: "sun", title: "Mein Profil", desc: "Zeichen, Zahlen und Ergebnisse an einem Ort" },
        { href: "/book/", icon: "eye", title: "Das Buch über dich", desc: "Deine persönliche Deutung, Kapitel für Kapitel" },
        { href: "/chart/", icon: "chart", title: "Geburtshoroskop", desc: "Das ganze Rad mit Planeten und Häusern" },
        { href: "/start/?attune=1", icon: "yinyang", title: "Aura neu abstimmen", desc: "Lass deine Aura zu deiner Stimmung passen" },
      ],
    },
    bonds: {
      label: "Beziehungen", feature: { title: "Wer passt zu dir, und wie?", text: "Vergleiche alle, die du liebst, mit denen du arbeitest oder über die du grübelst.", cta: "Passung prüfen" },
      items: [
        { href: "/match/", icon: "bond", title: "Kompatibilität", desc: "Zwei Menschen, alle Perspektiven, mit Tipps" },
        { href: "/bond/", icon: "attachment", title: "Beziehungscheck", desc: "Acht Fragen, die ihr gemeinsam beantwortet" },
        { href: "/people/", icon: "care", title: "Personen", desc: "Alle Gespeicherten, bereit zum Vergleich" },
        { href: "/play/", icon: "tarot", title: "Spielspiegel", desc: "Sieben kurze Spiele, die zeigen, wie du handelst" },
      ],
    },
    tests: {
      label: "Tests", feature: { title: "Sieben kurze Tests", text: "Jeder fügt deinem Profil eine Ebene hinzu. Volle Ergebnisse gratis.", cta: "Alle Tests ansehen" },
      allHref: "/quizzes/", allTitle: "Alle Tests", allDesc: "Such dir einen aus, je drei Minuten",
      play: { href: "/play/", title: "Play-Mirror-Spiele", desc: "Verhalten statt Selbstbild: Risiko, Vertrauen, Geduld, Fokus" },
      deep: { href: "/deep/", title: "Tiefenlesung", desc: "Schwere Entscheidungen und Bauchgefühl, passt sich dir an" },
    },
    discover: {
      label: "Entdecken", feature: { title: "Ehrlich gebaut", text: "Wie jede Zahl entsteht, was die Wissenschaft sagt und was nicht.", cta: "So funktioniert's" },
      items: [
        { href: "/daily/", icon: "moon", title: "Täglich nach Zeichen", desc: "Der heutige Impuls für alle 12 Zeichen" },
        { href: "/blog/", icon: "palette", title: "Blog", desc: "Geschichten über Zeichen, Liebe und Innenleben" },
        { href: "/learn/", icon: "number", title: "So funktioniert's", desc: "Methoden und Ehrlichkeit" },
        { href: "/promise/", icon: "temperament", title: "Unser Versprechen", desc: "Klare Preise, ehrliche Ergebnisse" },
      ],
    },
  },
};
