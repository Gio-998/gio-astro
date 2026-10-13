import type { LensId, Band, Archetype, Theme, RelType, Evidence } from "@/engine/compat";

export const lenses: Record<LensId, { name: string; short: string }> = {
  western: { name: "Westliche Astrologie", short: "Wie eure Planeten sich verbinden" },
  vedic: { name: "Vedischer Abgleich", short: "Indischer Abgleich der Mondsterne" },
  chinese: { name: "Chinesisches Horoskop", short: "Eure Tiere und Elemente" },
  numerology: { name: "Numerologie", short: "Was eure Zahlen sagen" },
  tarot: { name: "Geburtstarot", short: "Eure Karten und eure Verbindungskarte" },
  yinyang: { name: "Yin und Yang", short: "Wie eure Energien sich ausgleichen" },
  bigfive: { name: "Big Five", short: "Das am besten erforschte Persönlichkeitsmodell" },
  attachment: { name: "Bindung", short: "Nähe und Freiraum zu zweit" },
  care: { name: "Zuwendungsstile", short: "Wie ihr Zuwendung gebt und empfangt" },
  temperament: { name: "Temperament", short: "Die vier klassischen Temperamente" },
  nine: { name: "Neun Motive", short: "Was euch tief im Inneren antreibt" },
  fourletter: { name: "Vier Buchstaben", short: "Euer Stil in vier Buchstaben" },
  shadow: { name: "Schatten und Licht", short: "Eure Schwachstellen und Tugenden" },
  dosha: { name: "Körpertyp", short: "Ayurveda für eure Energie" },
  play: { name: "Spielspiegel", short: "Wie ihr wirklich zusammen spielt" },
};

export const evidence: Record<Evidence, { label: string; icon: string; text: string }> = {
  research: { label: "Wissenschaftlich gestützt", icon: "🔬", text: "Geprüfte Fragebögen und Forschung" },
  popular: { label: "Populäre Psychologie", icon: "🧭", text: "Gut zum Nachdenken, wenig Belege" },
  traditional: { label: "Traditionell und symbolisch", icon: "✨", text: "Alte Systeme, zur Inspiration" },
};

export const relTypes: Record<RelType, { name: string; them: string }> = {
  romantic: { name: "Liebesbeziehung", them: "Partner" },
  friend: { name: "Freundschaft", them: "Freund" },
  family: { name: "Familie", them: "Familienmitglied" },
  colleague: { name: "Kollegin oder Kollege", them: "Kollege" },
};

export const bands: Record<Band, { name: string; text: string }> = {
  "kindred-flow": { name: "Seelenfluss", text: "Seltene Leichtigkeit über viele Blickwinkel. Eure Aufgabe: Nehmt es nicht als selbstverständlich. Wählt euch immer wieder." },
  "natural-allies": { name: "Natürliche Verbündete", text: "Eine starke Basis mit klaren, machbaren Wachstumsfeldern. Ihr macht euch das Leben leichter." },
  "complementary-path": { name: "Ergänzender Weg", text: "Eure Unterschiede vervollständigen sich. Oft seht ihr, was der andere übersieht." },
  "catalyst-bond": { name: "Katalysator-Verbindung", text: "Eine Verbindung mit viel Wachstum. Sie verlangt bewusste Fähigkeiten und belohnt euch mit schneller Entwicklung." },
  "deep-teacher": { name: "Tiefe Lehrverbindung", text: "Hier könnt ihr am meisten voneinander lernen. Werkzeuge und Freundlichkeit zählen am meisten, also fangt mit den Übungen unten an." },
};

export const archetypes: Record<Archetype, { name: string; icon: string; text: string }> = {
  harbor: { name: "Der Hafen", icon: "⚓", text: "Leicht und ruhig: ein sicherer Ort zum Heimkommen. Gönnt euch ein bisschen Abenteuer, damit es lebendig bleibt." },
  wildfire: { name: "Das Lauffeuer", icon: "🔥", text: "Leicht und elektrisch: natürlicher Fluss und starke Funken. Schützt es mit guten Gewohnheiten." },
  forge: { name: "Die Schmiede", icon: "⚒️", text: "Herausfordernd und elektrisch. Durch Reibung formt ihr euch zu etwas Stärkerem." },
  garden: { name: "Der Garten", icon: "🌱", text: "Langsamer Start und jedes Jahr tiefer. Was ihr gemeinsam pflegt, blüht weiter." },
};

export const themes: Record<Theme, { name: string; plus: string; minus: string; practices: [string, string] }> = {
  communication: { name: "Kommunikation", plus: "Ihr versteht, wie der andere denkt und spricht.", minus: "Ihr denkt und sprecht in verschiedenen Sprachen.", practices: ["Spiegelt zuerst: Ich höre, dass du sagst… Erst dann antworten.", "Haltet ein wöchentliches 20-Minuten-Gespräch mit einer Regel: nichts lösen, nur zuhören."] },
  emotional: { name: "Emotionale Tiefe", plus: "Ihr spürt die Gefühle des anderen und könnt tief gehen.", minus: "Gefühle werden vielleicht unterschiedlich schnell verarbeitet.", practices: ["Täglich Rose und Dorn: Teilt einen schönen und einen schweren Moment.", "Benennt Gefühle mit einer Wortliste: Genaue Worte beruhigen das Nervensystem."] },
  passion: { name: "Leidenschaft und Anziehung", plus: "Zwischen euch gibt es echte Chemie und Energie.", minus: "Lust und Antrieb laufen vielleicht in verschiedenen Rhythmen.", practices: ["Plant etwas Neues zusammen: Neues entfacht Anziehung wieder.", "Sprecht offen darüber, wodurch ihr euch begehrt fühlt."] },
  stability: { name: "Stabilität", plus: "Ihr baut zusammen Sicherheit und Verlässlichkeit auf.", minus: "Unterschiedliche Bedürfnisse nach Struktur und Sicherheit.", practices: ["Schafft ein gemeinsames Ritual (Sonntagsfrühstück, Freitagsspaziergang).", "Gebt ein kleines Versprechen und haltet es: Vertrauen entsteht in kleinen Einzahlungen."] },
  freedom: { name: "Freiheit und Raum", plus: "Ihr lasst euch gegenseitig Luft zum Atmen.", minus: "Unterschiedliche Bedürfnisse nach Freiraum und Zweisamkeit.", practices: ["Sprecht Zeit für euch offen ab, damit Abstand nicht als Ablehnung ankommt.", "Nennt eine Rückkehrzeit: Ich brauche eine Stunde, um acht bin ich zurück."] },
  growth: { name: "Wachstum und Abenteuer", plus: "Ihr erweitert gegenseitig eure Welt.", minus: "Einer will vielleicht Veränderung, der andere Ruhe.", practices: ["Sucht euch für diesen Monat eine Sache aus, die ihr zusammen lernt oder erkundet.", "Fragt euch: Wie kann ich deinen Traum unterstützen?"] },
  nurturing: { name: "Fürsorge", plus: "Ihr kümmert euch ganz natürlich umeinander.", minus: "Eure Art zu sorgen kommt vielleicht nicht an, also übersetzt sie.", practices: ["Frag: Wodurch würdest du dich diese Woche umsorgt fühlen?", "Tu etwas Liebes in ihrem Stil, nicht in deinem."] },
  power: { name: "Macht und Führung", plus: "Ihr führt gut zusammen und respektiert die Stärke des anderen.", minus: "Zwei starke Willen können ums Steuer kämpfen.", practices: ["Teilt Bereiche auf: Wer führt wo.", "Entscheidet bei Kleinigkeiten abwechselnd."] },
  play: { name: "Spiel und Freude", plus: "Ihr bringt die lustige Seite im anderen hervor.", minus: "Ihr ladet auf verschiedene Arten auf und habt verschieden Spaß.", practices: ["Macht eine Spaßliste mit je drei Ideen und probiert eine pro Woche.", "Lacht mit Absicht: Teilt jeden Tag eine lustige Sache."] },
  values: { name: "Gemeinsame Werte", plus: "Eure tieferen Werte zeigen in dieselbe Richtung.", minus: "Manche Prioritäten unterscheiden sich. Respekt macht es möglich.", practices: ["Schreibt jeder eure drei wichtigsten Werte auf und vergleicht liebevoll.", "Sprecht über einen Traum für die nächsten fünf Jahre."] },
  conflict: { name: "Umgang mit Streit", plus: "Ihr könnt anderer Meinung sein und euch trotzdem sicher fühlen.", minus: "Unter Stress reagiert ihr unterschiedlich.", practices: ["Nutzt eine Auszeit mit fester Rückkehrzeit, wenn es hitzig wird.", "Fangt schwere Gespräche sanft an: Ich fühle… wegen… und ich brauche…"] },
  pace: { name: "Rhythmus und Tempo", plus: "Ihr geht in einem passenden Tempo durchs Leben.", minus: "Einer von euch ist schneller, der andere langsamer.", practices: ["Legt Entscheidungstermine fest, damit sich keiner gehetzt oder ausgebremst fühlt.", "Bemerkt und dankt euch für das, was jedes Tempo mitbringt."] },
};

export const pairCopy = {
  disclaimer: "Ein Spiegel zum Nachdenken, kein Urteil über eure Beziehung. Die Sterne bereiten die Bühne, die Psychologie erklärt das Muster, und wie ihr miteinander umgeht, schreibt die Geschichte.",
  scaleNote: "Die Werte reichen von 45 bis 100: Jede Verbindung hat etwas zu bieten, darum beginnt unsere Skala bei 45. 72 ist ein typisches Paar. Jeder Wert wird mit Tausenden zufälliger Paare verglichen.",
  harmony: "Harmonie: wie leicht und natürlich es sich anfühlt",
  spark: "Funke: wie viel Energie, Herausforderung und Wachstum drinsteckt",
  resonance: "Resonanz",
  evidenceOnly: "Nur wissenschaftlich gestützt",
  evidenceOnlyText: "Nur aus Big Five und Bindung berechnet, hinter denen echte Beziehungsforschung steht.",
  evidenceOnlyMissing: "Beide müssen die Tests zu Big Five und Bindung machen, um diesen Wert zu sehen.",
  superpowers: "Eure Superkräfte",
  growthEdges: "Eure Wachstumsfelder",
  convergence: (n: number, names: string) => `${n} ${n === 1 ? "Blickwinkel zeigt" : "verschiedene Blickwinkel zeigen"} hierher: ${names}.`,
  missing: "Mehr Blickwinkel freischalten",
  missingText: "Diese Blickwinkel brauchen Testergebnisse von beiden. Lade die andere Person zu den Tests ein (oder gib ihren Ergebniscode ein).",
};
