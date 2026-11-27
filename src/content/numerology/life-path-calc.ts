/** Direct answer and overview table for the life path calculator page, the page behind searches like "Lebenszahl berechnen". The table itself is built from the life path texts, so only its frame is written here. */
export type LifePathCalcCopy = { label: string; answer: string; tableTitle: string; head: [string, string, string]; caption: string };

export const LIFE_PATH_CALC: Record<string, LifePathCalcCopy> = {
  en: {
    label: "Short answer",
    answer: "To work out your life path number, reduce your birth month, day and year to a single digit each, add the three results and reduce the sum again. Keep 11, 22 and 33 as they are. Example, July 23, 1985: 7 + 5 + 5 = 17, then 1 + 7 = 8. Or use the calculator below.",
    tableTitle: "All life path numbers at a glance",
    head: ["Number", "Type", "Core themes"],
    caption: "11, 22 and 33 are master numbers and are not reduced any further. Read the page of the number and also its root: 2, 4 or 6.",
  },
  de: {
    label: "Kurze Antwort",
    answer: "Deine Lebenszahl berechnest du aus dem Geburtsdatum: Monat, Tag und Jahr kürzt du einzeln auf eine Ziffer, addierst die drei Ergebnisse und kürzt die Summe noch einmal. 11, 22 und 33 bleiben stehen. Beispiel 23.07.1985: 7 + 5 + 5 = 17, also 1 + 7 = 8. Oder nutze den Rechner unten.",
    tableTitle: "Alle Lebenszahlen im Überblick",
    head: ["Lebenszahl", "Typ", "Kernthemen"],
    caption: "11, 22 und 33 sind Meisterzahlen und werden nicht weiter gekürzt. Lies die Seite der Zahl und dazu ihre Grundzahl 2, 4 oder 6.",
  },
  mk: {
    label: "Краток одговор",
    answer: "Бројот на патеката на животот го добиваш од датумот на раѓање: месецот, денот и годината посебно ги сведуваш на една цифра, ги собираш трите резултати и збирот повторно го сведуваш. 11, 22 и 33 се оставаат. Пример, 23 јули 1985: 7 + 5 + 5 = 17, па 1 + 7 = 8. Или користи го калкулаторот подолу.",
    tableTitle: "Сите броеви на патеката на животот накратко",
    head: ["Број", "Тип", "Основни теми"],
    caption: "11, 22 и 33 се мастер броеви и не се сведуваат понатаму. Прочитај ја страницата на бројот, а и на неговиот основен број: 2, 4 или 6.",
  },
  sr: {
    label: "Kratak odgovor",
    answer: "Broj životnog puta dobijaš iz datuma rođenja: mesec, dan i godinu posebno svodiš na jednu cifru, sabereš ta tri rezultata i zbir ponovo svedeš. Ako usput ispadne 11, 22 ili 33, broj ostaje kakav jeste. Primer, 23. jul 1985: 7 + 5 + 5 = 17, pa 1 + 7 = 8. Ili unesi svoj datum u kalkulator ispod.",
    tableTitle: "Svi brojevi životnog puta ukratko",
    head: ["Broj", "Tip", "Osnovne teme"],
    caption: "11, 22 i 33 su master brojevi i ne svode se dalje. Pročitaj stranu tog broja, a i njegovog osnovnog broja: 2, 4 ili 6.",
  },
};
