import { calcUiSr } from "./ui-sr";
import type { CalcKey } from "./types";

/** Labels of the calculator tools. Small on purpose: this file is the only calculator copy that reaches the browser. */
export interface CalcUi {
  go: Record<CalcKey, string>;
  privacy: string;
  errTime: string;
  errPlace: string;
  rising: string;
  moon: string;
  moon2: string;
  window: (from: string, to: string) => string;
  near: (sign: string) => string;
  moonStill: string;
  moonChanged: (from: string, to: string, at: string) => string;
  moonChangedKnown: (from: string, to: string, at: string, sign: string) => string;
  sunChanged: (from: string, to: string, at: string) => string;
  zone: (zone: string) => string;
  noTime: string;
  noPlace: string;
  retro: string;
  moreAbout: (sign: string) => string;
  startTitle: string;
  startText: string;
  startCta: string;
}

const en: CalcUi = {
  go: { "rising-sign": "Find my rising sign", "moon-sign": "Find my Moon sign", "birth-chart": "Draw my birth chart" },
  privacy: "This runs in your browser. No sign-in, and your details are not stored or sent anywhere.",
  errTime: "A rising sign needs a birth time. Without one, any of the twelve signs is possible.",
  errPlace: "Please choose your birth place. Every town has its own horizon.",
  rising: "Your rising sign", moon: "Your Moon sign", moon2: "Or this Moon sign",
  window: (from, to) => `This sign was rising there from ${from} to ${to}, so any birth time in that window gives the same rising sign.`,
  near: (sign) => `Your time is within ten minutes of ${sign}. If it was rounded, read that sign too.`,
  moonStill: "The Moon stayed in this sign all day, so you do not need a birth time for this result.",
  moonChanged: (from, to, at) => `The Moon changed sign on this day: it was in ${from} until ${at}, then moved into ${to}. Without a birth time, either one could be yours.`,
  moonChangedKnown: (from, to, at, sign) => `The Moon moved from ${from} into ${to} at ${at} that day. Your birth time gives ${sign}.`,
  sunChanged: (from, to, at) => `The Sun also changed sign on this day, from ${from} to ${to} at ${at}. Without a birth time, either one could be yours.`,
  zone: (zone) => `No place given, so we read the day in your device's time zone (${zone}).`,
  noTime: "No birth time, so the planets are placed for noon and there is no rising sign or houses.",
  noPlace: "Add your birth place to get the rising sign and houses.",
  retro: "retrograde",
  moreAbout: (sign) => `More about ${sign}`,
  startTitle: "Want the fuller reading?", startText: "A personal reading puts your chart together with the rest of your profile.", startCta: "Start your personal reading",
};

const de: CalcUi = {
  go: { "rising-sign": "Aszendent berechnen", "moon-sign": "Mondzeichen berechnen", "birth-chart": "Geburtshoroskop erstellen" },
  privacy: "Das läuft in deinem Browser. Ohne Anmeldung, und deine Angaben werden weder gespeichert noch verschickt.",
  errTime: "Für den Aszendenten brauchst du eine Geburtszeit. Ohne sie ist jedes der zwölf Zeichen möglich.",
  errPlace: "Bitte wähle deinen Geburtsort. Jede Stadt hat ihren eigenen Horizont.",
  rising: "Dein Aszendent", moon: "Dein Mondzeichen", moon2: "Oder dieses Mondzeichen",
  window: (from, to) => `Dieses Zeichen ging dort von ${from} bis ${to} Uhr auf. Jede Geburtszeit in diesem Fenster ergibt denselben Aszendenten.`,
  near: (sign) => `Deine Uhrzeit liegt weniger als zehn Minuten vom Zeichen ${sign} entfernt. War sie gerundet, lies dieses Zeichen auch.`,
  moonStill: "Der Mond blieb den ganzen Tag in diesem Zeichen. Für dieses Ergebnis brauchst du keine Geburtszeit.",
  moonChanged: (from, to, at) => `An diesem Tag wechselte der Mond das Zeichen: Bis ${at} Uhr stand er im Zeichen ${from}, danach im Zeichen ${to}. Ohne Geburtszeit kann beides deines sein.`,
  moonChangedKnown: (from, to, at, sign) => `Der Mond wechselte an diesem Tag um ${at} Uhr vom Zeichen ${from} ins Zeichen ${to}. Deine Geburtszeit ergibt ${sign}.`,
  sunChanged: (from, to, at) => `Auch die Sonne wechselte an diesem Tag das Zeichen, um ${at} Uhr von ${from} zu ${to}. Ohne Geburtszeit kann beides deines sein.`,
  zone: (zone) => `Kein Ort angegeben, darum lesen wir den Tag in der Zeitzone deines Geräts (${zone}).`,
  noTime: "Keine Geburtszeit: Die Planeten stehen für 12 Uhr, Aszendent und Häuser fehlen.",
  noPlace: "Gib deinen Geburtsort an, dann bekommst du auch Aszendent und Häuser.",
  retro: "rückläufig",
  moreAbout: (sign) => `Mehr über ${sign}`,
  startTitle: "Lieber die ganze Deutung?", startText: "Eine persönliche Deutung verbindet dein Horoskop mit dem Rest deines Profils.", startCta: "Persönliche Deutung starten",
};

const mk: CalcUi = {
  go: { "rising-sign": "Пресметај го асцендентот", "moon-sign": "Пресметај го Месечевиот знак", "birth-chart": "Направи натална карта" },
  privacy: "Ова работи во твојот прелистувач. Без најава, а податоците не се зачувуваат и не се праќаат никаде.",
  errTime: "За асцендент ти треба час на раѓање. Без него можен е секој од дванаесетте знаци.",
  errPlace: "Избери го местото на раѓање. Секој град има свој хоризонт.",
  rising: "Твојот асцендент", moon: "Твојот Месечев знак", moon2: "Или овој Месечев знак",
  window: (from, to) => `Овој знак излегувал таму од ${from} до ${to}, па секој час на раѓање во тој прозорец го дава истиот асцендент.`,
  near: (sign) => `Твоето време е на помалку од десет минути од знакот ${sign}. Ако е заокружено, прочитај го и него.`,
  moonStill: "Месечината останала во овој знак цел ден, па за овој резултат не ти треба час на раѓање.",
  moonChanged: (from, to, at) => `Месечината го сменила знакот на овој ден: до ${at} била во ${from}, а потоа премина во ${to}. Без час на раѓање, може да е кој било од двата.`,
  moonChangedKnown: (from, to, at, sign) => `Месечината премина од ${from} во ${to} во ${at} тој ден. Твојот час на раѓање дава ${sign}.`,
  sunChanged: (from, to, at) => `И Сонцето го сменило знакот на овој ден, од ${from} во ${to} во ${at}. Без час на раѓање, може да е кој било од двата.`,
  zone: (zone) => `Нема место, па денот го читаме во временската зона на твојот уред (${zone}).`,
  noTime: "Нема час на раѓање, па планетите се поставени за пладне и нема асцендент и домови.",
  noPlace: "Додај го местото на раѓање за да добиеш асцендент и домови.",
  retro: "ретроградно",
  moreAbout: (sign) => `Повеќе за ${sign}`,
  startTitle: "Сакаш поцелосно читање?", startText: "Личното читање ја поврзува твојата карта со остатокот од твојот профил.", startCta: "Почни лично читање",
};

export const CALC_UI: Record<string, CalcUi> = { en, de, mk, sr: calcUiSr };
