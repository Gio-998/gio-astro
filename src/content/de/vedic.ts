import type { Nakshatra } from "@/engine/vedic";

export const nakshatras: Record<Nakshatra, { name: string; symbol: string; text: string }> = {
  ashwini: { name: "Ashwini", symbol: "Pferdekopf", text: "schnelle Heilerin, fängt rasch an und hilft rasch" },
  bharani: { name: "Bharani", symbol: "Mutterschoß", text: "Trägerin des Lebens, intensiv und verantwortungsvoll" },
  krittika: { name: "Krittika", symbol: "Klinge / Flamme", text: "scharf, reinigend, ehrlich bis zur Schmerzgrenze" },
  rohini: { name: "Rohini", symbol: "Wagen", text: "fruchtbar, charmant, liebt Schönheit und Komfort" },
  mrigashira: { name: "Mrigashira", symbol: "Hirschkopf", text: "suchend, sanft, neugierig" },
  ardra: { name: "Ardra", symbol: "Träne", text: "stürmische Erneuerung, Tiefe durch Schwierigkeiten" },
  punarvasu: { name: "Punarvasu", symbol: "Köcher mit Pfeilen", text: "Rückkehr des Lichts, Optimismus, Zuhause" },
  pushya: { name: "Pushya", symbol: "Kuheuter", text: "nährend, beschützend, hingebungsvoll" },
  ashlesha: { name: "Ashlesha", symbol: "eingerollte Schlange", text: "scharfsinnig, hypnotisch, schützt, was sie liebt" },
  magha: { name: "Magha", symbol: "Thron", text: "königlich, ehrt Ahnen und Tradition" },
  "purva-phalguni": { name: "Purva Phalguni", symbol: "Vorderbeine eines Bettes", text: "Genuss, Ruhe, Kreativität und Romantik" },
  "uttara-phalguni": { name: "Uttara Phalguni", symbol: "Hinterbeine eines Bettes", text: "treue Partnerschaft und großzügige Unterstützung" },
  hasta: { name: "Hasta", symbol: "Hand", text: "geschickt, handwerklich begabt, humorvoll" },
  chitra: { name: "Chitra", symbol: "leuchtendes Juwel", text: "künstlerisch, brillant, baut schöne Dinge" },
  swati: { name: "Swati", symbol: "junger Trieb im Wind", text: "unabhängig, flexibel, diplomatisch" },
  vishakha: { name: "Vishakha", symbol: "Triumphbogen", text: "entschlossen, zielstrebig, leidenschaftlich" },
  anuradha: { name: "Anuradha", symbol: "Lotus", text: "hingebungsvolle Freundschaft, blüht an schweren Orten" },
  jyeshtha: { name: "Jyeshtha", symbol: "Ohrring / Schirm", text: "beschützende Ältere, verantwortungsvoll, stolz" },
  mula: { name: "Mula", symbol: "gebundene Wurzeln", text: "geht an die Wurzel, sucht die Wahrheit" },
  "purva-ashadha": { name: "Purva Ashadha", symbol: "Fächer", text: "unbesiegbare Begeisterung, überzeugend" },
  "uttara-ashadha": { name: "Uttara Ashadha", symbol: "Elefantenstoßzahn", text: "dauerhafter Sieg, prinzipientreu" },
  shravana: { name: "Shravana", symbol: "Ohr", text: "hört zu und lernt, verbindet Menschen" },
  dhanishta: { name: "Dhanishta", symbol: "Trommel", text: "rhythmisch, musikalisch, großzügig" },
  shatabhisha: { name: "Shatabhisha", symbol: "leerer Kreis", text: "Heilerin, unabhängig, geheimnisvoll" },
  "purva-bhadrapada": { name: "Purva Bhadrapada", symbol: "Vorderteil einer Totenbahre", text: "intensive Idealistin, eine Kraft des Wandels" },
  "uttara-bhadrapada": { name: "Uttara Bhadrapada", symbol: "Hinterteil einer Totenbahre", text: "tiefe Ruhe, Weisheit, Selbstbeherrschung" },
  revati: { name: "Revati", symbol: "Fisch / Trommel", text: "sanfte Wegweiserin, mitfühlend, sichere Reisen" },
};

export const kootas: Record<string, { name: string; plain: string }> = {
  varna: { name: "Varna", plain: "spirituelles Temperament und Ego im Einklang" },
  vashya: { name: "Vashya", plain: "natürliche Anziehung und Einfluss" },
  tara: { name: "Tara", plain: "Glück des Geburtssterns und gemeinsames Wohlbefinden" },
  yoni: { name: "Yoni", plain: "instinktive und körperliche Nähe" },
  maitri: { name: "Graha Maitri", plain: "Freundschaft der Herrscher der Mondzeichen: gleiche Wellenlänge im Kopf" },
  gana: { name: "Gana", plain: "Wesensart: sanft, menschlich oder wild" },
  bhakoot: { name: "Bhakoot", plain: "emotionale und familiäre Harmonie aus dem Abstand der Mondzeichen" },
  nadi: { name: "Nadi", plain: "Energiekonstitution: traditionell am stärksten gewichtet" },
};

export const vedicCautions: Record<string, string> = {
  nadi: "Die Tradition kennt das Muster der gleichen Nadi: symbolisch gelesen als zwei ähnliche Energien, die bewusste Abwechslung und Sorge um Gesundheit und Ruhe des anderen brauchen.",
  bhakoot: "Die Tradition sieht einen Abstand der Mondzeichen, der bei Familie und Geld besondere Geduld verlangt.",
  manglik: "Die Tradition sieht eine Betonung des Mars in nur einem Horoskop (Manglik). Das wird als Unterschied in der Intensität gelesen: Lenkt sie in gemeinsame Bewegung und klare Absprachen.",
};
export const vedicCancellations: Record<string, string> = {
  "nadi-different-pada": "Traditionelle Aufhebung: gleicher Geburtsstern, aber ein anderes Viertel (Pada).",
  "nadi-same-sign": "Traditionelle Aufhebung: gleiches Mondzeichen mit unterschiedlichen Geburtssternen.",
  "bhakoot-friendly-lords": "Traditionelle Aufhebung: Die Herrscher der Mondzeichen sind befreundet oder dieselben.",
  "manglik-both": "Traditionelle Aufhebung: Beide Horoskope sind Manglik, was sich laut Tradition ausgleicht.",
};
export const vedicNote: string = "Die vedische (siderische) Astrologie nutzt den Lahiri-Tierkreis, etwa 24° hinter dem westlichen, daher kann dein vedisches Mondzeichen abweichen. Guna Milan ist ein traditionelles System mit 36 Punkten; ab 18 gilt als annehmbar, ab 25 als gut und ab 32 als ausgezeichnet. Rein symbolisch.";
export const gunaLabel: string = "Guna Milan";
