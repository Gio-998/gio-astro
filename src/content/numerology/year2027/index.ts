import { year2027En } from "./en";
import { year2027Mk } from "./mk";
import { year2027De } from "./de";
import { year2027Sr, year2027HubSr } from "./sr";
/** Personal year pages for 2027, keyed "1" to "9". Written per language, not assembled. */
export type Year2027Page = { title: string; lead: string; sections: { title: string; paras: string[] }[] };
export type Year2027Set = Record<string, Year2027Page>;
export const YEAR2027: Record<string, Year2027Set> = { en: year2027En, mk: year2027Mk, de: year2027De, sr: year2027Sr };
/** Hub copy for /numerology/personal-year-2027/. */
export const YEAR2027_HUB: Record<string, { title: string; crumb: string; sub: string; intro: string[] }> = {
  en: { title: "Personal year 2027: what your number brings next year", crumb: "Personal year 2027", sub: "Find your personal year number for 2027 and read what it can mean for love, work, money and energy, season by season.", intro: ["Your personal year number shows where you stand in a nine year cycle. To find it for 2027, reduce your birth month and your birth day to single digits, add 2 (because 2 + 0 + 2 + 7 = 11, which reduces to 2) and reduce the total once more. The calculator below does the sum for you.", "The universal year 2027 adds up to 11, a master number linked with insight and inspiration, so every personal year carries a little extra intuition this time. Choose your number to read a full guide for the year ahead."] },
  mk: { title: "Лична година 2027: што ти носи твојот број", crumb: "Лична година 2027", sub: "Пресметај го својот број на лична година за 2027 и прочитај што може да значи за љубовта, работата, парите и енергијата, сезона по сезона.", intro: ["Бројот на личната година покажува каде стоиш во деветгодишниот циклус. За 2027, сведи ги месецот и денот на раѓање на едноцифрени броеви, додај 2 (бидејќи 2 + 0 + 2 + 7 = 11, што се сведува на 2) и уште еднаш сведи го збирот. Калкулаторот подолу ја прави сметката наместо тебе.", "Универзалната 2027 дава збир 11, мајсторски број поврзан со увидот и инспирацијата, па секоја лична година овојпат носи малку повеќе интуиција. Избери го својот број и прочитај цел водич за годината што доаѓа.", "На латиница се пишува licna godina 2027."] },
  de: { title: "Persönliches Jahr 2027: was deine Zahl im nächsten Jahr bringt", crumb: "Persönliches Jahr 2027", sub: "Finde deine persönliche Jahreszahl für 2027 und lies, was sie für Liebe, Arbeit, Geld und Energie bedeuten kann, Abschnitt für Abschnitt.", intro: ["Deine persönliche Jahreszahl zeigt, wo du in einem Zyklus von neun Jahren stehst. Für 2027 reduzierst du Geburtsmonat und Geburtstag auf einstellige Zahlen, addierst 2 (denn 2 + 0 + 2 + 7 = 11, und daraus wird 2) und reduzierst die Summe noch einmal. Der Rechner unten nimmt dir die Rechnung ab.", "Das Weltjahr 2027 hat die Quersumme 11, eine Meisterzahl der Einsicht und Inspiration, deshalb trägt diesmal jedes persönliche Jahr etwas mehr Intuition in sich. Wähle deine Zahl und lies einen ausführlichen Begleiter für das kommende Jahr."] },
  sr: year2027HubSr,
};

type Faq = [string, string][];
/** Questions for the hub and for each number's page. A number page answers from its own written sections (so nothing is retyped), the hub's three answers are written here. */
export const YEAR2027_FAQ: Record<string, { hub: Faq; you: (n: number) => string; love: (n: number) => string; work: (n: number) => string }> = {
  en: {
    hub: [
      ["How do I calculate my personal year number for 2027?", "Reduce your birth month and your birth day to single digits, add 2, and reduce the total once more. For March 14 that is 3 + 5 + 2 = 10, which becomes 1. The calculator on this page does the sum in a second."],
      ["Why does 2027 add up to 11?", "The digits of 2027 give 2 + 0 + 2 + 7 = 11, a master number of insight and inspiration. In the sum it is reduced to 2, and your own number still runs from 1 to 9. The 11 adds a little extra intuition to every personal year but does not change which year you are in."],
      ["Does my personal year start on January 1 or on my birthday?", "Here it follows the calendar year, so personal year 2027 runs from January 1 to December 31, 2027. Some numerologists start the new year on the birthday. If yours falls early in the year, read the number before it too, because the change can show up before or after the date."],
    ],
    you: (n) => `Am I in a personal year ${n} in 2027?`, love: (n) => `What does personal year ${n} mean for love in 2027?`, work: (n) => `What does personal year ${n} mean for work and money in 2027?`,
  },
  de: {
    hub: [
      ["Wie berechne ich meine persönliche Jahreszahl für 2027?", "Reduziere Geburtsmonat und Geburtstag auf einstellige Zahlen, addiere 2 und reduziere die Summe noch einmal. Beim 14. März ist das 3 + 5 + 2 = 10, also 1. Der Rechner auf dieser Seite nimmt dir die Rechnung in einer Sekunde ab."],
      ["Warum hat 2027 die Quersumme 11?", "Die Ziffern von 2027 ergeben 2 + 0 + 2 + 7 = 11, eine Meisterzahl der Einsicht und Inspiration. In der Rechnung wird sie zu 2 reduziert, und deine eigene Zahl liegt weiter zwischen 1 und 9. Die 11 bringt in jedes persönliche Jahr etwas mehr Intuition, ändert aber nicht, in welchem Jahr du stehst."],
      ["Beginnt mein persönliches Jahr am 1. Januar oder an meinem Geburtstag?", "Hier gilt das Kalenderjahr, das persönliche Jahr 2027 läuft also vom 1. Januar bis zum 31. Dezember 2027. Manche Numerologen lassen das neue Jahr am Geburtstag beginnen. Fällt deiner früh im Jahr, lies auch die vorherige Zahl, denn der Wechsel kann sich schon vorher oder erst danach zeigen."],
    ],
    you: (n) => `Habe ich 2027 ein persönliches Jahr ${n}?`, love: (n) => `Was bedeutet das persönliche Jahr ${n} 2027 für die Liebe?`, work: (n) => `Was bedeutet das persönliche Jahr ${n} 2027 für Arbeit und Geld?`,
  },
  mk: {
    hub: [
      ["Како да го пресметам бројот на личната година за 2027?", "Сведи ги месецот и денот на раѓање на едноцифрени броеви, додај 2 и збирот сведи го уште еднаш. За 14 март тоа е 3 + 5 + 2 = 10, значи 1. Калкулаторот на оваа страница ја прави сметката за секунда."],
      ["Зошто 2027 дава збир 11?", "Цифрите на 2027 даваат 2 + 0 + 2 + 7 = 11, мајсторски број на увид и инспирација. Во сметката се сведува на 2, а твојот број останува од 1 до 9. Бројот 11 носи малку повеќе интуиција во секоја лична година, но не менува во која година се наоѓаш."],
      ["Дали личната година почнува на 1 јануари или на роденден?", "Овде важи календарската година, па личната година 2027 трае од 1 јануари до 31 декември 2027. Некои нумеролози ја започнуваат новата година на роденден. Ако твојот е рано во годината, прочитај го и претходниот број, бидејќи промената може да се почувствува пред датумот или по него."],
    ],
    you: (n) => `Дали во 2027 имам лична година ${n}?`, love: (n) => `Што значи личната година ${n} за љубовта во 2027?`, work: (n) => `Што значи личната година ${n} за работата и парите во 2027?`,
  },
  sr: {
    hub: [
      ["Kako da izračunam broj lične godine za 2027?", "Svedi mesec i dan rođenja na jednocifrene brojeve, dodaj 2 i zbir svedi još jednom. Za 14. mart to je 3 + 5 + 2 = 10, dakle 1. Kalkulator na ovoj strani to izračuna za sekundu."],
      ["Zašto 2027. daje zbir 11?", "Cifre broja 2027 daju 2 + 0 + 2 + 7 = 11, master broj uvida i inspiracije. U računu se svodi na 2, a tvoj broj i dalje ide od 1 do 9. Jedanaestica unosi malo više intuicije u svaku ličnu godinu, ali ne menja u kojoj si godini."],
      ["Da li lična godina počinje 1. januara ili na rođendan?", "Ovde važi kalendarska godina, pa lična godina 2027. traje od 1. januara do 31. decembra 2027. Neki numerolozi novu godinu počinju na rođendan. Ako je tvoj rano u godini, pročitaj i prethodni broj, jer se promena može osetiti pre datuma ili posle njega."],
    ],
    you: (n) => `Da li u 2027. imam ličnu godinu ${n}?`, love: (n) => `Šta lična godina ${n} znači za ljubav u 2027?`, work: (n) => `Šta lična godina ${n} znači za posao i novac u 2027?`,
  },
};
