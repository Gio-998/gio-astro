import type { ZodiacLang } from "./types";
import { aries } from "./de/aries";
import { taurus } from "./de/taurus";
import { gemini } from "./de/gemini";
import { cancer } from "./de/cancer";
import { leo } from "./de/leo";
import { virgo } from "./de/virgo";
import { libra } from "./de/libra";
import { scorpio } from "./de/scorpio";
import { sagittarius } from "./de/sagittarius";
import { capricorn } from "./de/capricorn";
import { aquarius } from "./de/aquarius";
import { pisces } from "./de/pisces";

export const de: ZodiacLang = {
  hub: {
    metaTitle: "Sternzeichen: alle 12 mit Daten und Eigenschaften",
    description: "Alle 12 Sternzeichen mit Zeitraum und Element, dazu ein kurzer Leitfaden zu Elementen und Qualitäten. So findest du dein Zeichen.",
    h1: "Die 12 Sternzeichen: Daten, Elemente, Eigenschaften",
    crumb: "Sternzeichen",
    lead: "Zwölf Zeichen, vier Elemente, drei Arten, die Dinge anzugehen. Hier findest du deins und das, was dahintersteckt.",
    intro: [
      "Der Tierkreis teilt das Jahr in zwölf gleich große Abschnitte, und in jedem davon steht die Sonne rund einen Monat lang. Dein Sternzeichen sagt also, in welchem Abschnitt die Sonne am Tag deiner Geburt stand. Oben findest du alle zwölf der Reihe nach, von Widder bis Fische, jeweils mit Zeitraum und Element. Hinter jedem Namen steckt ein ausführliches Porträt: Eigenschaften, Stärken und Reibungspunkte, Liebe, Mann und Frau des Zeichens, Freundschaft, Beruf und Geld und die Zeichen, die gut oder schwieriger passen.",
      "Wir verstehen die Sternzeichen als Spiegel. Sie liefern eine Sprache, in der du über dich nachdenken kannst, und weder eine Vorhersage noch ein Urteil. Behalte, was dir weiterhilft, und lass den Rest stehen.",
    ],
    elementsTitle: "Die vier Elemente: was dich antreibt",
    elementsIntro: "Jedes Sternzeichen gehört zu einem der vier Elemente, und zu jedem Element gehören drei Zeichen, gleichmäßig übers Jahr verteilt. Das Element beschreibt, was dich antreibt und wie du reagierst, bevor du nachgedacht hast.",
    elements: {
      fire: "schnell, warm und auf Handlung aus. Feuerzeichen denken in Bewegung, laden sich am Anfang einer Sache auf und gehen ein, wenn nichts passiert.",
      earth: "praktisch, geduldig, körperlich. Erdzeichen glauben, was sich anfassen, rechnen und bauen lässt, und sie brauchen Zeit und Verlässlichkeit.",
      air: "neugierig, gesprächig, beweglich. Luftzeichen sehen Verbindungen zwischen Menschen und Ideen und holen ihre Kraft aus dem Austausch.",
      water: "feinfühlig, treu, mit langem Gedächtnis. Wasserzeichen lesen Stimmungen, bevor jemand etwas sagt, und brauchen Nähe, der sie trauen können.",
    },
    modalitiesTitle: "Die drei Qualitäten: wie ein Zeichen die Dinge angeht",
    modalitiesIntro: "Das Element sagt, welche Energie da ist, die Qualität, was sie mit der Zeit anstellt. Jede der drei Qualitäten kommt viermal vor, einmal pro Element, und sie folgt dem Lauf der Jahreszeiten: Die kardinalen Zeichen eröffnen eine Jahreszeit, die fixen halten ihre Mitte, die veränderlichen leiten zur nächsten über.",
    modalities: {
      cardinal: "eröffnen die Jahreszeiten und fangen an. Sie greifen zuerst zu und geben die Richtung vor, das Zuendebringen überlassen sie gern anderen.",
      fixed: "stehen mitten in der Jahreszeit und halten fest. Sie sind ausdauernd und treu, und was sie stark macht, macht sie auch schwer beweglich.",
      mutable: "schließen die Jahreszeiten ab und passen sich an. Sie wechseln leicht den Plan und verbinden Menschen, schwerer fällt ihnen, sich festzulegen.",
    },
    more: [
      { title: "Warum die Daten um einen Tag schwanken", paras: [
        "Das Jahr hat nicht genau 365 Tage, deshalb erreicht die Sonne die Grenze zwischen zwei Zeichen nicht jedes Jahr zur selben Stunde. Die Zeiträume auf diesen Seiten sind darum Richtwerte, und in Zeitschriften stehen oft leicht andere Tage. Wer nah am Wechsel geboren ist, hat trotzdem kein Mischzeichen: Die Sonne steht entweder noch im einen oder schon im nächsten Zeichen. Klarheit bringt eine Berechnung mit Geburtsjahr, Uhrzeit und Ort.",
      ] },
      { title: "Dein Sternzeichen ist erst der Anfang", paras: [
        "Wer fragt, was du für ein Sternzeichen bist, fragt nach deiner Sonne. Der Mond zeigt, was du fühlst und was dir Sicherheit gibt, der Aszendent, wie andere dich beim ersten Treffen erleben, und die übrigen Planeten steuern ihre eigenen Themen bei. Deshalb können zwei Steinböcke sehr verschieden sein. Passt eine Beschreibung gar nicht zu dir, liegt die Antwort oft in diesen anderen Schichten. Mit dem Aszendenten-Rechner und dem Mondzeichen-Rechner hast du sie in wenigen Minuten.",
      ] },
    ],
    faq: [
      ["Welche Sternzeichen gibt es?", "Zwölf, in dieser Reihenfolge: Widder, Stier, Zwillinge, Krebs, Löwe, Jungfrau, Waage, Skorpion, Schütze, Steinbock, Wassermann und Fische. Die Reihe beginnt mit dem Widder, weil die Sonne zum Frühlingsanfang in dieses Zeichen eintritt."],
      ["Wie finde ich mein Sternzeichen heraus?", "Such deinen Geburtstag in der Liste oben. Das ist dein Sonnenzeichen, also das, was die meisten Menschen mit Sternzeichen meinen. Liegt dein Geburtstag direkt am Wechsel zweier Zeichen, gib Jahr, Uhrzeit und Ort in den Rechner fürs Geburtshoroskop ein."],
      ["Gibt es ein 13. Sternzeichen, den Schlangenträger?", "Der Schlangenträger ist ein echtes Sternbild, durch das die Sonne im Jahreslauf zieht. Die westliche Astrologie arbeitet aber mit dem tropischen Tierkreis, also mit zwölf gleich großen Abschnitten, die an den Jahreszeiten hängen und nicht an den Sternbildern. Sternzeichen und Sternbild sind zwei verschiedene Dinge, und dein Zeichen bleibt dasselbe."],
      ["Was ist der Unterschied zwischen Sternzeichen und Aszendent?", "Das Sternzeichen hängt am Datum und beschreibt deinen Kern. Der Aszendent hängt an der genauen Uhrzeit und am Ort der Geburt und beschreibt den ersten Eindruck, den du machst, und wie du Neues angehst. Beide können in ganz verschiedenen Zeichen stehen."],
      ["Welche Sternzeichen passen zusammen?", "Am leichtesten tun sich meist Zeichen desselben Elements und die benachbarten Elemente Feuer und Luft oder Erde und Wasser. Mehr Reibung gibt es im rechten Winkel, also bei drei Zeichen Abstand. Eine feste Regel ist das nicht. Im Partnerhoroskop findest du jedes Paar einzeln beschrieben."],
      ["Bestimmt mein Sternzeichen meinen Charakter?", "Nein. Ein Sternzeichen ist ein Bild zum Nachdenken und keine wissenschaftlich belegte Beschreibung eines Menschen. Herkunft, Erfahrungen und eigene Entscheidungen prägen dich weit mehr. Viele nutzen die Astrologie, um leichter über sich zu sprechen, und genau so meinen wir sie hier auch."],
    ],
  },
  labels: {
    to: "bis",
    factsTitle: (name) => `${name} auf einen Blick`,
    dates: "Zeitraum",
    element: "Element",
    modality: "Qualität",
    ruler: "Herrscherplanet",
    opposite: "Gegenzeichen",
    traditional: "traditionell",
    modern: "modern",
    bestMatch: "Passt gut",
    hardestMatch: "Viel Reibung",
    profileLink: (name) => `Alles über das Sternzeichen ${name}`,
    daily: (name) => `Tageshoroskop ${name}`,
    weekly: (name) => `Wochenhoroskop ${name}`,
    monthly: (name) => `Monatshoroskop ${name}`,
    yearly: (name) => `Jahreshoroskop 2027 ${name}`,
    compatHub: "Partnerhoroskop",
    compatHubSub: "Jedes Zeichen mit jedem Zeichen",
    dailyHub: "Tageshoroskop",
    dailyHubSub: "Jeden Tag für jedes Zeichen",
    rising: "Aszendent berechnen",
    risingSub: "Wie andere dich erleben",
    moon: "Mondzeichen berechnen",
    moonSub: "Was dir Sicherheit gibt",
    chart: "Geburtshoroskop berechnen",
    chartSub: "Alle Planeten an deinem Geburtstag",
    numerology: "Numerologie",
    numerologySub: "Lebenszahl, persönliches Jahr, Engelszahlen",
  },
  signs: { aries, taurus, gemini, cancer, leo, virgo, libra, scorpio, sagittarius, capricorn, aquarius, pisces },
};
