import type { Animal, WuXing, AnimalRelation, ElementRelation } from "@/engine/chinese";

export const animals: Record<Animal, { name: string; essence: string; gifts: string; edge: string }> = {
  rat: { name: "Ratte", essence: "Schlagfertig, einfallsreich und charmant. Du siehst Chancen, bevor andere die Tür bemerken.", gifts: "Klugheit, Anpassungsfähigkeit, Treue zu deinen Leuten", edge: "Sorgen und zu viel Planen" },
  ox: { name: "Büffel", essence: "Geduldig, verlässlich und stark. Du gewinnst durch stetigen Einsatz und hältst dein Wort.", gifts: "Verlässlichkeit, Ausdauer, Ehrlichkeit", edge: "Sturheit, wenn Wandel nötig ist" },
  tiger: { name: "Tiger", essence: "Mutig, leidenschaftlich und anziehend. Du schützt die Schwächeren und handelst aus Überzeugung.", gifts: "Mut, Ausstrahlung, Großzügigkeit", edge: "Ungeduld und Rastlosigkeit" },
  rabbit: { name: "Hase", essence: "Sanft, elegant und feinfühlig. Wo du dich niederlässt, entstehen Frieden und Schönheit.", gifts: "Freundlichkeit, Taktgefühl, guter Geschmack", edge: "Konflikten ausweichen, die eigentlich sein müssen" },
  dragon: { name: "Drache", essence: "Kühn, visionär und voller Lebenskraft. Du träumst groß und inspirierst andere, dir zu folgen.", gifts: "Selbstvertrauen, Energie, Weitblick", edge: "Ungeduld und Stolz" },
  snake: { name: "Schlange", essence: "Weise, intuitiv und gefasst. Du liest einen Raum schnell und bewegst dich mit stiller Anmut darin.", gifts: "Einsicht, Ruhe, Eleganz", edge: "Heimlichkeit und Misstrauen" },
  horse: { name: "Pferd", essence: "Freiheitsliebend, warm und energiegeladen. Du brauchst Weite, Bewegung und ehrliche Gesellschaft.", gifts: "Begeisterung, Unabhängigkeit, Fröhlichkeit", edge: "Rastlosigkeit und wenig Geduld" },
  goat: { name: "Ziege", essence: "Sanft, künstlerisch und gutherzig. Du bringst Weichheit, Kreativität und Fürsorge.", gifts: "Mitgefühl, Kreativität, Harmonie", edge: "Sorgen und Unentschlossenheit" },
  monkey: { name: "Affe", essence: "Klug, verspielt und erfinderisch. Du löst Probleme mit Humor und frischen Ideen.", gifts: "Einfallsreichtum, Witz, Neugier", edge: "Unruhe und Schabernack" },
  rooster: { name: "Hahn", essence: "Aufmerksam, fleißig und ehrlich. Du bist stolz darauf, Dinge richtig zu machen.", gifts: "Genauigkeit, Mut, Offenheit", edge: "Kritik und Perfektionismus" },
  dog: { name: "Hund", essence: "Treu, gerecht und beschützend. Du stehst zu deinen Menschen und deinen Prinzipien.", gifts: "Treue, Ehrlichkeit, Gerechtigkeitssinn", edge: "Ängstlichkeit und Pessimismus" },
  pig: { name: "Schwein", essence: "Großzügig, aufrichtig und lebensfroh. Du genießt das Leben und willst alle am Tisch haben.", gifts: "Wärme, Großzügigkeit, Toleranz", edge: "Naivität und zu viel Genuss" },
};

export const wuxing: Record<WuXing, { name: string; text: string; color: string }> = {
  wood: { name: "Holz", text: "Wachstum, Güte und Planung: die Energie des Frühlings", color: "grün" },
  fire: { name: "Feuer", text: "Leidenschaft, Freude und Sichtbarkeit: die Energie des Sommers", color: "rot" },
  earth: { name: "Erde", text: "Stabilität, Fürsorge und Vertrauen: die Energie des Spätsommers", color: "gelb" },
  metal: { name: "Metall", text: "Klarheit, Struktur und Integrität: die Energie des Herbstes", color: "weiß" },
  water: { name: "Wasser", text: "Weisheit, Tiefe und Fluss: die Energie des Winters", color: "schwarz/blau" },
};

export const animalRelations: Record<AnimalRelation, { name: string; text: string }> = {
  "six-harmony": { name: "Heimliche Freunde (Sechs Harmonien)", text: "Die Tradition nennt das eines der sechs harmonischen Paare: ein stilles, natürliches Bündnis, in dem jeder den blinden Fleck des anderen abdeckt." },
  trine: { name: "Trigon im selben Team", text: "Ihr gehört zur selben Dreiergruppe mit gemeinsamen Werten und Rhythmus: Verständnis kommt leicht." },
  same: { name: "Spiegeltiere", text: "Ihr teilt ein Tier und erkennt euch daher schnell wieder: Stärken und sture Gewohnheiten inklusive." },
  neutral: { name: "Offenes Feld", text: "Die Tradition sieht hier keinen starken Zug in eine Richtung. Diese Verbindung prägt vor allem das, was ihr aufbaut." },
  harm: { name: "Empfindliches Paar", text: "Die Tradition warnt hier vor kleinen Missverständnissen. Klare Worte und Freundlichkeit bei Kleinigkeiten machen den Unterschied." },
  clash: { name: "Magnetische Gegensätze", text: "Ihr steht euch im Tierkreis gegenüber. Das bringt Anziehung und Herausforderung: starke Funken und viel, was ihr von der Art des anderen lernen könnt." },
};

export const elementRelations: Record<ElementRelation, string> = {
  generating: "Ein Element nährt das andere (wie Holz das Feuer): ein natürlich unterstützender Fluss.",
  same: "Ihr teilt ein Element: leichtes Verständnis, und gemeinsame Gewohnheiten können sich verstärken.",
  controlling: "Ein Element formt das andere (wie Wasser das Feuer beruhigt). Mit Respekt bringt das Struktur und Wachstum, ohne Respekt Reibung.",
};
