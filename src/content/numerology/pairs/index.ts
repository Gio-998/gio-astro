import { pairEn } from "./en";
import { pairMk } from "./mk";
import { pairDe } from "./de";
/** Life path compatibility pages, keyed "a-and-b" with a before b in LIFE order (1..9, 11, 22, 33). */
export type PairPage = { title: string; lead: string; sections: { title: string; paras: string[] }[] };
export type PairSet = Record<string, PairPage>;
export const PAIRS: Record<string, PairSet> = { en: pairEn, mk: pairMk, de: pairDe };
/** Hub copy for /numerology/compatibility/. */
export const PAIR_HUB: Record<string, { title: string; crumb: string; sub: string; intro: string[] }> = {
  en: { title: "Life path compatibility: every number pair", crumb: "Compatibility", sub: "How two life path numbers meet in love, friendship and work, pair by pair.", intro: ["Every pair of life path numbers has its own rhythm. Pick the pair that matches you and the person you have in mind, or use the calculator to find both numbers from your birth dates."] },
  mk: { title: "Компатибилност по патека на животот: секој пар броеви", crumb: "Компатибилност", sub: "Како се среќаваат две патеки на животот во љубовта, пријателството и работата. Избери го вашиот пар од 78 комбинации на броеви.", intro: ["Секој пар патеки на животот има свој ритам. Избери го парот што одговара на тебе и на личноста на која мислиш, или со калкулаторот пресметај ги двата броја од датумите на раѓање.", "На латиница го наоѓаш ова како numeroloska kompatibilnost."] },
  de: { title: "Lebenszahl Kompatibilität: jedes Zahlenpaar", crumb: "Kompatibilität", sub: "Wie zwei Lebenszahlen in Liebe, Freundschaft und Arbeit zusammenfinden, Paar für Paar.", intro: ["Jedes Paar von Lebenszahlen hat seinen eigenen Rhythmus. Wähle das Paar, das zu dir und dem Menschen passt, an den du denkst, oder finde beide Zahlen mit dem Rechner aus euren Geburtsdaten."] },
};
