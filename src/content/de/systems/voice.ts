import type { Sign } from "@/engine/zodiac";
import type { AttachStyle } from "@/engine/quizzes";
import type * as En from "@/content/en/systems/voice";
export const chironTheme: Record<Sign, string> = {
  aries: "dein Recht, Raum einzunehmen", taurus: "dich sicher zu fühlen und genug zu haben", gemini: "gehört und ernst genommen zu werden", cancer: "dazuzugehören und umsorgt zu werden",
  leo: "ohne Scham gesehen zu werden", virgo: "so, wie du bist, gut genug zu sein", libra: "dich selbst in einer Beziehung nicht zu verlieren", scorpio: "Nähe zu vertrauen",
  sagittarius: "einen Sinn zu finden, dem du trauen kannst", capricorn: "Ruhe, die du dir nicht verdienen musst", aquarius: "dazuzugehören und trotzdem anders zu bleiben", pisces: "deine Grenzen zu halten, während du alles fühlst",
};
export const attachLens: Record<AttachStyle, string> = {
  secure: "deine überwiegend sichere Bindung", anxious: "deine eher ängstliche Bindung", avoidant: "deine eher vermeidende Bindung", fearful: "dein Hin-und-her-Bindungsmuster",
};
export const attachNervous: Record<AttachStyle, string> = {
  secure: "Dein Nervensystem liest Nähe meist als sicher. Das ist eine Ressource, die du anderen leihen kannst.",
  anxious: "Dein Nervensystem hat gelernt, nach Distanz Ausschau zu halten, was früher einmal Sinn ergab. Ein langsames Ausatmen, länger als das Einatmen, hilft ihm, sich zu beruhigen, bevor du antwortest.",
  avoidant: "Dein Nervensystem hat gelernt, dass es am sichersten ist, sich auf dich selbst zu verlassen. Freiraum hilft dir, zur Ruhe zu kommen; wenn du sagst, wann du zurückkommst, bleiben auch die anderen ruhig.",
  fearful: "Ein Teil von dir greift nach Menschen, ein anderer macht sich bereit. Beide wollen dich schützen. Zu benennen, wer gerade spricht, nimmt die Hitze raus.",
};
export const voice: typeof En.voice = {
  why: "Warum wir das sagen",
  whyClose: "Ausblenden",
  whyLead: "Dieser Satz entsteht aus:",
  opener: (name: string, sun: string, sunEss: string, moon: string, moonEss: string) => `${name}, deine Sonne steht im Zeichen ${sun}, ${sunEss}, und dein Mond im Zeichen ${moon}, ${moonEss}.`,
  chironAttach: (sign: string, attach: string, theme: string) => `Dein Chiron im Zeichen ${sign} und ${attach} zeigen auf dieselbe empfindliche Stelle: ${theme}.`,
  chironMoon: (sign: string, moon: string, theme: string) => `Dein Chiron im Zeichen ${sign} steht neben einem Mond im Zeichen ${moon}: Beide bitten um Sorgfalt rund um ${theme}.`,
  echoLikert: (item: string, strong: boolean) => (strong ? `Du hast gesagt, „${item}“ trifft sehr auf dich zu. Das nehmen wir ernst.` : `Du hast gesagt, „${item}“ passt überhaupt nicht zu dir. Auch das sagt uns etwas.`),
  echoAura: (weather: string, wish: string) => `Bei der Frage nach deinem Gefühlswetter hast du „${weather}“ gewählt, und gewünscht hast du dir mehr „${wish}“.`,
  echoAuraCare: (weatherKey: string): string => (["stormy", "foggy", "cloudy"].includes(weatherKey) ? "Sei heute sanft mit dir. Raues Wetter zieht vorbei, und du musst es nicht allein reparieren." : "Achte darauf, was dir zu diesem Gefühl verholfen hat, damit du es wiederfindest."),
  nodeValidate: (sign: string, trait: string) => `Dein nördlicher Mondknoten im Zeichen ${sign} verlangt nach ${trait}, und deine Antworten zeigen, dass du diesen Muskel schon hast. Nutze ihn diesen Monat bewusst.`,
  nodeChallenge: (sign: string, trait: string, step: string) => `Dein nördlicher Mondknoten im Zeichen ${sign} verlangt nach ${trait}, was dir laut deinen Antworten nicht leichtfällt. Genau darum ist es ein Wachstumsfeld. Fang winzig an: ${step}`,
  nodePlain: (sign: string, north: string) => `Dein nördlicher Mondknoten steht im Zeichen ${sign}: ${north}`,
  compassion: (practice: string) => `Freundlich mit dir zu sein heißt hier nicht, dich aus der Verantwortung zu lassen. Genau das lässt Veränderung bleiben. ${practice}`,
  traitName: { O: "Neugier und Offenheit", C: "beständiger Struktur", E: "Sichtbarkeit und klaren Worten", A: "Geben und Nehmen mit anderen", N: "einer ruhigen Mitte", lowC: "Loslassen von Kontrolle" } as Record<string, string>,
  lvl: { low: "niedrig", mid: "mittel", high: "hoch" } as Record<"low" | "mid" | "high", string>,
  w: {
    sun: (s: string, deg: string) => `Sonne ${deg} ${s}`, moon: (s: string, deg: string) => `Mond ${deg} ${s}`, chiron: (s: string, deg: string) => `Chiron ${deg} ${s}`,
    node: (s: string) => `Nördlicher Mondknoten im Zeichen ${s}`, attach: (name: string, ax: number, av: number) => `Bindungstest: ${name} (Sorge ${ax}, Distanz ${av})`,
    item: (quiz: string, ans: string) => `${quiz}: Du hast „${ans}“ geantwortet`, aura: "Dein Aura-Check-in", trait: (t: string, v: number) => `Big Five ${t}: ${v}/100`,
    birth: (place: string) => `Geburtszeit und Ort: ${place}`, noTime: "Geburtszeit unbekannt (12 Uhr verwendet)", bio: (p: number, e: number, i: number) => `Biorhythmus heute: Körper ${p}, Gefühle ${e}, Kopf ${i}`,
    feast: (f: string) => `Kirchen- und Volkskalender: ${f}`, transit: (t: string) => `Himmel heute: ${t}`, care: (n: string, c: string) => `Zuwendungsstil von ${n}: ${c}`,
    personalDay: (n: number) => `Persönliche Tageszahl ${n}`,
  },
  day: {
    bioHigh: (cycle: string) => `Deine Welle „${cycle}“ ist heute fast ganz oben. Nutze sie, aber verbrauch nicht alles vor Mittag.`,
    bioLow: (cycle: string) => `Deine Welle „${cycle}“ ist heute unten. Das ist ein Rhythmus, kein Urteil: Plane leichter.`,
    feastToday: (f: string, custom: string) => `Heute ist ${f}. ${custom}`,
    nameDayToday: "Heute ist dein Namenstag. Lass dich von anderen verwöhnen.",
    weatherEcho: (weather: string) => `Beim letzten Check-in war dein inneres Wetter „${weather}“. Hat es sich verändert?`,
  },
  book: {
    love: (venus: string, care?: string) => (care ? `Deine Venus im Zeichen ${venus} und dein wichtigster Zuwendungsstil, ${care}, beschreiben dasselbe von zwei Seiten: wie Liebe bei dir ankommt.` : `Deine Venus im Zeichen ${venus} ist hier der Ausgangspunkt: wie du gern geliebt wirst.`),
    mind: (merc: string, extra?: string) => `Du denkst mit Merkur im Zeichen ${merc}${extra ? `, und ${extra}` : ""}. In diesem Kapitel geht es darum, wie dein Kopf arbeitet.`,
    shadow: (lilith: string, shadow?: string) => (shadow ? `Deine Lilith im Zeichen ${lilith} und dein Hauptschatten, ${shadow}, markieren beide die Seiten an dir, denen man gesagt hat, sie sollen sich hinsetzen. Das sind keine Fehler, sondern Energie, die auf eine bessere Aufgabe wartet.` : `Deine Lilith im Zeichen ${lilith} markiert eine Seite an dir, die vielleicht gelernt hat, sich zu verstecken. Lies dieses Kapitel mit Freundlichkeit.`),
    heals: (chiron: string, theme: string) => `Heilung beginnt dort, wohin dein Chiron im Zeichen ${chiron} zeigt: ${theme}.`,
    path: (node: string, lp: number) => `Dein nördlicher Mondknoten im Zeichen ${node} und deine Lebenszahl ${lp} beschreiben beide eine Richtung, kein Schicksal. Den Weg wählst du.`,
    year: (sr: string) => `Dein Solarjahr zeigt auf dieses Thema für das Jahr: ${sr}`,
  },
  bond: {
    care: (a: string, ca: string, b: string, cb: string) => (ca === cb ? `${a} und ${b} haben beide ${ca} gewählt, als Art, wie Zuwendung am besten ankommt. Leicht, das einander zu geben.` : `${a} fühlt sich am meisten umsorgt durch ${ca}, ${b} durch ${cb}. Übersetzt, statt anzunehmen.`),
    attach: (a: string, sa: string, b: string, sb: string) => `${a} neigt zu ${sa}, ${b} zu ${sb}. Wer das weiß, macht aus „du immer…“ ein „ich merke, dass ich…“`,
    chiron: (a: string, ch: string, b: string, moon: string) => `Chiron von ${a} im Zeichen ${ch} und der Mond von ${b} im Zeichen ${moon} teilen ein Element, also versteht ${b} den alten wunden Punkt von ${a} vielleicht ohne Erklärung.`,
    nodes: (a: string, node: string, b: string, sun: string) => `Der nördliche Mondknoten von ${a} im Zeichen ${node} steht im Sonnenzeichen von ${b}, ${sun}. In der Astrologie ist das ein Wachstumskontakt: ${b} ist vielleicht einfach das, was ${a} gerade lernt.`,
  },
};
