import type { NumContent } from "./en";
import { chars } from "./de-chars";
import { angel } from "./de-angel";
import { years, karmic, explain } from "./de-more";

const ui: NumContent["ui"] = {
  section: "Numerologie",
  crumbHome: "Start",
  angelHub: "Engelszahlen", lifePathHub: "Lebenszahl", yearHub: "Persönliches Jahr", calcHub: "Rechner", karmicHub: "Karmische Schuld", masterHub: "Meisterzahlen",
  angelTitle: (n) => `Engelszahl ${n}: Bedeutung in Liebe und Leben`,
  angelMeta: (n, tag) => `Was ${n} bedeutet, wenn du die Zahl ständig siehst: ${tag}. Liebe, Beruf, was du jetzt tun kannst und häufige Fragen.`,
  lifePathTitle: (n) => `Lebenszahl ${n}: Bedeutung, Liebe und Beruf`,
  lifePathMeta: (n, name) => `Lebenszahl ${n}, ${name}: Charakter, Stärken, Schattenseite, Liebe, Beruf und Fragen an dich selbst.`,
  yearTitle: (n) => `Persönliches Jahr ${n}: was das Jahr von dir will`,
  yearMeta: (n) => `Persönliches Jahr ${n} in der Numerologie: Themen, Liebe, Beruf, Gesundheit und wie die Monate meist verlaufen.`,
  number: "Zahl", digits: "Die Ziffern darin", digitsSum: (sum, root) => `Zusammengezählt: ${sum}, reduziert ergibt das ${root}.`,
  sec: { scene: "Wo du sie sehen könntest", meaning: "Was sie bedeutet", love: "In der Liebe", work: "Beruf und Geld", act: "Was du jetzt tun kannst", why: "Warum sie immer wieder auftaucht", questions: "Fragen zum Nachdenken", faq: "Häufige Fragen", story: "Der Charakter", gifts: "Gaben", money: "Geld", shadow: "Die Schattenseite", week: "So zeigt sie sich in einer Woche", growth: "Wachstum", practices: "Übungen", strengths: "Stärken", shadows: "Achte auf", focus: "Fokus", caution: "Vorsicht bei", months: "Wie das Jahr verläuft", body: "Energie und Gesundheit", close: "Zum Jahresende", related: "Verwandte Zahlen", explore: "Weiter entdecken", also: "Mehr Engelszahlen" },
  faq: {
    angelMean: (n) => `Was bedeutet ${n}?`, angelLove: (n) => `Was bedeutet ${n} in der Liebe?`, angelDo: (n) => `Was soll ich tun, wenn ich ${n} sehe?`, angelWhy: (n) => `Warum sehe ich ständig ${n}?`,
    lpMean: (n) => `Was bedeutet Lebenszahl ${n}?`, lpLove: (n) => `Mit wem passt Lebenszahl ${n} zusammen?`, lpWork: (n) => `Welche Berufe passen zur Lebenszahl ${n}?`, lpCalc: (n) => `Woher weiß ich, ob meine Lebenszahl ${n} ist?`,
    lpCalcA: "Addiere den reduzierten Monat, Tag und das Jahr deines Geburtsdatums und reduziere die Summe, wobei 11, 22 und 33 erhalten bleiben. Unser kostenloser Rechner zeigt jeden Schritt.",
    yrMean: (n) => `Was ist ein persönliches Jahr ${n}?`, yrCalc: "Wie finde ich mein persönliches Jahr?", yrCalcA: "Addiere Geburtsmonat und Geburtstag zum laufenden Jahr und reduziere die Summe auf eine Ziffer. Der Rechner erledigt das für dich.",
  },
  calc: {
    birth: "Geburtsdatum", name: "Vollständiger Name", namePh: "z. B. Anna Weber", year: "Jahr", go: "Berechnen", invalid: "Bitte gib ein gültiges Datum ein.", nameInvalid: "Bitte gib einen Namen mit Buchstaben ein.",
    lifePath: "Deine Lebenszahl", expression: "Ausdruckszahl", soul: "Seelenzahl", personality: "Persönlichkeitszahl", personalYear: (y) => `Dein persönliches Jahr ${y}`,
    read: "Bedeutung lesen", steps: "So wird gerechnet", tryLife: "Lebenszahl Rechner", tryName: "Namensrechner", private: "Auf deinem Gerät berechnet, nichts wird gespeichert.",
  },
  pickNumber: "Wähle eine Zahl", lifePathShort: (n) => `Lebenszahl ${n}`, yearShort: (n) => `Jahr ${n}`,
  prev: "Zurück", next: "Weiter", allAngel: "Alle Engelszahlen", allLife: "Alle Lebenszahlen", calcCta: "Finde deine eigene Zahl", calcCtaSub: "Kostenlos, in zehn Sekunden.",
  readFull: "Weiterlesen", see: "Öffnen",
  homeEyebrow: "Numerologie", homeTitle: "Was deine Zahlen sagen", homeSub: "Engelszahlen, deine Lebenszahl und kostenlose Rechner.",
  navTitle: "Numerologie", navDesc: "Engelszahlen, Lebenszahl und Rechner",
  method: "Numerologie ist eine Tradition zum Nachdenken, keine Wissenschaft. Lies sie wie einen Spiegel.",
};

export const numerology: NumContent = { ui, chars, angel, years, karmic, explain };
