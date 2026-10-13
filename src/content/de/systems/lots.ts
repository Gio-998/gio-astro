import type { SysMeta } from "@/content/en/systems/meta";
import type { Sign } from "@/engine/zodiac";
import type * as En from "@/content/en/systems/lots";
export const metaExtra: Record<"arabic" | "numextra", SysMeta> = {
  arabic: { name: "Glückspunkt", short: "Lose", evidence: "astronomy",
    what: "Lose sind Punkte aus drei Teilen deines Horoskops. Zuerst nutzten sie hellenistische Astrologen, persische und arabische Astrologen bauten darauf auf, deshalb heißen sie arabische Punkte. Der Glückspunkt gilt als Ort, an dem das Leben leicht und gut versorgt wirkt; der Geistpunkt als das, wonach du bewusst strebst.",
    inputs: "Geburtsdatum, genaue Geburtszeit und Ort (für den Aszendenten).",
    method: "Taggeburt (Sonne über dem Horizont): Glück = Aszendent + Mond − Sonne, Geist = Aszendent + Sonne − Mond. Bei Nachtgeburt werden sie getauscht, wie bei Vettius Valens und Paulus Alexandrinus. Sonne, Mond und Aszendent werden aus genauen astronomischen Daten für deinen Geburtsmoment berechnet.",
    sources: [] },
  numextra: { name: "Zahlen dieses Monats", short: "Zahlen extra", evidence: "popular",
    what: "Drei weitere Zahlen aus der pythagoreischen Numerologie: deine Reifezahl (wer du etwa ab 40 wirst), dein persönlicher Monat und dein persönlicher Tag. Ein Geburtstag am 13., 14., 16. oder 19. gilt als karmischer Schuldtag, gelesen als Lektion, die so lange wiederkommt, bis du sie gelernt hast.",
    inputs: "Geburtsdatum, voller Geburtsname und heutiges Datum.",
    method: "Reife = Lebenszahl + Ausdruckszahl, reduziert (11, 22 und 33 bleiben). Persönlicher Monat = persönliches Jahr + Kalendermonat, reduziert. Persönlicher Tag = persönlicher Monat + Tag des Monats, reduziert. Alles live aus dem heutigen Datum berechnet.",
    sources: [] },
};
export const uiExtra: typeof En.uiExtra = {
  fortune: "Glückspunkt",
  spirit: "Geistpunkt",
  dayBirth: "Taggeburt: Die Sonne stand über dem Horizont",
  nightBirth: "Nachtgeburt: Die Sonne stand unter dem Horizont",
  lotsNeedTime: "Ergänze deine genaue Geburtszeit und deinen Ort, um deine Lose zu sehen.",
  lotsNeedTimeValue: "Braucht Geburtszeit",
  maturity: "Reifezahl",
  maturityNoName: "Ergänze deinen vollen Geburtsnamen, um deine Reifezahl zu sehen.",
  personalMonth: "Persönlicher Monat",
  personalDay: "Persönlicher Tag",
  karmicDebt: (n: number) => `Karmischer Schuldtag ${n}`,
  karmicDebtText: { 13: "Harte Arbeit zahlt sich erst aus, wenn du aufhörst, die Abkürzung zu suchen.", 14: "Freiheit klappt am besten mit ein paar festen Gewohnheiten.", 16: "Stolz zerbricht, damit etwas Ehrlicheres wachsen kann.", 19: "Alles allein zu machen ist die Lektion; um Hilfe zu bitten ist der Ausweg." } as Record<number, string>,
  fromBirthNameDate: "deinem Geburtsdatum, Namen und dem heutigen Datum",
};
export const fortune: Record<Sign, string> = {
  aries: "Leichtigkeit kommt, wenn du selbst anfängst und den ersten Schritt machst.",
  taurus: "Leichtigkeit kommt durch beständigen Komfort, gutes Essen und Dinge zum Anfassen.",
  gemini: "Leichtigkeit kommt durch Gespräche, kurze Reisen und Lernen unterwegs.",
  cancer: "Leichtigkeit kommt aus dem Zuhause, der Familie und Menschen, die sich wie Familie anfühlen.",
  leo: "Leichtigkeit kommt, wenn man dich sieht, du etwas erschaffst und Spaß hast.",
  virgo: "Leichtigkeit kommt aus nützlicher, gut gemachter Arbeit und einem ruhigen Alltag.",
  libra: "Leichtigkeit kommt durch Partner, faire Absprachen und schöne Orte.",
  scorpio: "Leichtigkeit kommt aus der Tiefe: gemeinsames Geld, Vertrauen und echte Nähe.",
  sagittarius: "Leichtigkeit kommt mit Reisen, Lernen und einem großen Bild, an das du glaubst.",
  capricorn: "Leichtigkeit kommt aus langen Zielen, Struktur und verdientem Respekt.",
  aquarius: "Leichtigkeit kommt durch Freunde, Gruppen und Ideen, die ihrer Zeit voraus sind.",
  pisces: "Leichtigkeit kommt in der Stille, in der Kunst und im Helfen, ohne zu zählen.",
};
export const spirit: Record<Sign, string> = {
  aries: "Du wählst Mut und willst die Erste sein.",
  taurus: "Du wählst, etwas Bleibendes zu bauen.",
  gemini: "Du wählst Neugier und viele offene Türen.",
  cancer: "Du wählst, für die Deinen zu sorgen und sie zu schützen.",
  leo: "Du wählst, zu führen und es strahlen zu lassen.",
  virgo: "Du wählst, Dinge zu verbessern, Detail für Detail.",
  libra: "Du wählst Balance und das richtige Gegenüber.",
  scorpio: "Du wählst die Wahrheit, auch wenn sie etwas kostet.",
  sagittarius: "Du wählst Sinn und weite Horizonte.",
  capricorn: "Du wählst Meisterschaft und einen Namen, den du dir verdienst.",
  aquarius: "Du wählst Wandel und deinen eigenen Weg.",
  pisces: "Du wählst Vertrauen, Freundlichkeit und Fantasie.",
};
