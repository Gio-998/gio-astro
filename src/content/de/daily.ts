import type * as En from "../en/daily";

export const moonPhases: typeof En.moonPhases = {
  new: { name: "Neumond", icon: "🌑", text: "Ein leeres Blatt. Setz dir eine leise Absicht." },
  "waxing-crescent": { name: "Zunehmende Sichel", icon: "🌒", text: "Kleine erste Schritte. Nähre, was du begonnen hast." },
  "first-quarter": { name: "Erstes Viertel", icon: "🌓", text: "Ein Moment der Wahl: Geh durch ein wenig Widerstand." },
  "waxing-gibbous": { name: "Zunehmender Mond", icon: "🌔", text: "Verfeinern und anpassen. Fast geschafft." },
  full: { name: "Vollmond", icon: "🌕", text: "Dinge kommen ans Licht. Gefühle sind stark: sei sanft." },
  "waning-gibbous": { name: "Abnehmender Mond", icon: "🌖", text: "Teile, was du gelernt hast. Dankbarkeit wächst." },
  "last-quarter": { name: "Letztes Viertel", icon: "🌗", text: "Lass los, was nicht mehr passt." },
  "waning-crescent": { name: "Abnehmende Sichel", icon: "🌘", text: "Ruh dich aus und schau zurück, bevor der nächste Zyklus beginnt." },
};

export const transitTone: typeof En.transitTone = {
  conjunction: "trifft", sextile: "unterstützt sanft", square: "fordert heraus", trine: "fließt mit", opposition: "steht gegenüber",
};
export const transitMood: typeof En.transitMood = {
  sun: "Aufmerksamkeit und Lebenskraft", moon: "deine Tagesstimmung", mercury: "Gespräche und Denken", venus: "Liebe, Genuss und Schönheit",
  mars: "Antrieb und Ungeduld", jupiter: "Wachstum und Großzügigkeit", saturn: "Verantwortung und Grenzen", uranus: "Überraschungen und Freiheit",
  neptune: "Träume und Empfindsamkeit", pluto: "tiefe Veränderung und Intensität",
};
export const transitAdvice: typeof En.transitAdvice = {
  conjunction: "Lenk diese Energie bewusst: Sie ist heute stark.",
  sextile: "Ein kleiner Einsatz bringt einen leichten Erfolg.",
  square: "Reibung ist ein Signal fürs Wachsen: Halte inne, bevor du reagierst.",
  trine: "Es läuft. Nutz es für etwas, das du vor dir herschiebst.",
  opposition: "Such die Balance: Jemand anderes spiegelt dich vielleicht.",
};

export const personalDay: typeof En.personalDay = {
  1: "Ein Tag zum Anfangen: Sag Ja zu einem Neustart.", 2: "Ein Tag für Zusammenarbeit und sanftes Zuhören.", 3: "Ein Tag, um dich auszudrücken und zu spielen.",
  4: "Ein Tag zum Bauen: Stetige Arbeit zahlt sich aus.", 5: "Ein Tag für Veränderung: Probier etwas anderes.", 6: "Ein Tag für Fürsorge: Zuhause und deine Liebsten.",
  7: "Ein Tag zum Nachdenken: Nimm dir stille Zeit.", 8: "Ein Tag für Ehrgeiz: Mach einen mutigen, praktischen Schritt.", 9: "Ein Tag zum Abschließen und Loslassen.",
};

export const prompts: typeof En.prompts = [
  "Welche Beziehung hat mir diese Woche Energie gegeben, und warum?",
  "Was brauche ich gerade, worum ich noch nicht gebeten habe?",
  "Wann habe ich mich zuletzt wirklich verstanden gefühlt? Was hat das möglich gemacht?",
  "Welche Geschichte erzähle ich mir über einen Menschen, der mir nahe ist? Ist das die ganze Geschichte?",
  "Was würde meine liebste Freundin heute zu mir sagen?",
  "Woran halte ich fest, das ich sanft ablegen könnte?",
  "Bei wem fühle ich mich am meisten wie ich selbst?",
  "Welches kleine Versprechen kann ich mir heute halten?",
  "Wo in meinem Körper spüre ich Stress, und was braucht er?",
  "Was hat mir ein Streit vor Kurzem darüber gezeigt, was mir wichtig ist?",
  "Welcher meiner Schatten hat sich zuletzt gezeigt, und welche Gabe steckte dahinter?",
  "Wie würde „genug“ heute für mich aussehen?",
  "Wen könnte ich diese Woche laut wertschätzen?",
  "Worauf bin ich gerade neugierig?",
  "Welche Grenze würde meinen Frieden schützen?",
  "Wann schalte ich auf Autopilot, und was würde mein Entdeckergeist stattdessen tun?",
  "Was hat mich zuletzt zum Lachen gebracht? Wie bekomme ich mehr davon?",
  "Welche Beziehung heilt mich, und wie kann ich sie pflegen?",
  "Was traue ich mich nicht zu wollen?",
  "Was würde ich heute tun, wenn ich mir ganz vertrauen würde?",
  "Welches Muster wiederhole ich in Beziehungen? Wozu dient es?",
  "Was bedeutet Zuhause gerade für mich?",
  "Wessen Meinung über mich zählt zu viel, und wessen zu wenig?",
  "Was habe ich von jemandem gelernt, der ganz anders ist als ich?",
  "Welcher Teil meines Horoskops (oder Profils) fühlt sich heute am wahrsten an?",
  "Was kann ich vergeben, mir selbst oder jemand anderem?",
  "Was würde den morgigen Tag leichter machen?",
  "Wo gebe ich mehr, als ich bekomme, oder umgekehrt?",
  "Was will mein inneres Kind spielen?",
  "Wofür bin ich heute in meinem Körper dankbar?",
];
