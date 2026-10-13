import type { MajorCard } from "@/engine/tarot";

export const numbers: Record<number, { name: string; essence: string; lifePath: string; expression: string; soul: string }> = {
  1: { name: "Die Pionierin", essence: "Unabhängigkeit, Anfänge, Wille", lifePath: "Dein Weg ist, dein eigenes Leben zu führen: Dinge anzufangen, deinem Urteil zu vertrauen und zu lernen, dass Stärke auch heißt, um Hilfe zu bitten.", expression: "Du drückst dich durch Initiative und Originalität aus.", soul: "Tief in dir sehnst du dich danach, frei deinen eigenen Weg zu wählen." },
  2: { name: "Die Friedensstifterin", essence: "Partnerschaft, Feingefühl, Balance", lifePath: "Dein Weg ist Verbindung. Du wächst durch Zusammenarbeit, Zuhören und die leise Kraft, Menschen Sicherheit zu geben.", expression: "Du drückst dich durch Taktgefühl, Fürsorge und Teamgeist aus.", soul: "Tief in dir sehnst du dich nach einem echten Gegenüber und einem friedlichen Zuhause." },
  3: { name: "Die Erzählerin", essence: "Freude, Ausdruck, Kreativität", lifePath: "Dein Weg ist, dich auszudrücken (durch Worte, Kunst, Humor oder Stil) und anderen Leichtigkeit zu bringen, ohne deine Tiefe zu verstecken.", expression: "Du drückst dich durch Worte, Kreativität und Charme aus.", soul: "Tief in dir sehnst du dich danach, zu erschaffen und so gemocht zu werden, wie du bist." },
  4: { name: "Die Baumeisterin", essence: "Ordnung, Einsatz, Fundamente", lifePath: "Dein Weg ist, etwas Solides und Dauerhaftes zu bauen, und zu lernen, dass auch Ruhe zum Fundament gehört.", expression: "Du drückst dich durch Verlässlichkeit und praktisches Können aus.", soul: "Tief in dir sehnst du dich nach Stabilität und Arbeit, die etwas bedeutet." },
  5: { name: "Der freie Geist", essence: "Wandel, Abenteuer, Sinne", lifePath: "Dein Weg ist Freiheit und Erfahrung. Du wächst durch Entdecken, Anpassen und durch die Verpflichtungen, die dich frei machen.", expression: "Du drückst dich durch Vielseitigkeit und Abenteuer aus.", soul: "Tief in dir sehnst du dich nach Abwechslung und Raum zum Streifen." },
  6: { name: "Die Fürsorgliche", essence: "Liebe, Verantwortung, Zuhause", lifePath: "Dein Weg ist gelebte Liebe: für Menschen und Schönheit sorgen und lernen, dass auch du Fürsorge verdienst.", expression: "Du drückst dich durch Fürsorge, Schönheit und Verantwortung aus.", soul: "Tief in dir sehnst du dich nach einem liebevollen Kreis, in dem es allen gut geht." },
  7: { name: "Die Suchende", essence: "Weisheit, Alleinsein, Tiefe", lifePath: "Dein Weg ist Verstehen: Lernen, Intuition und innere Ruhe bringen dir Antworten, und Vertrauen bringt dir Menschen.", expression: "Du drückst dich durch Analyse, Tiefe und Einsicht aus.", soul: "Tief in dir sehnst du dich nach Wahrheit und Zeit für dich, um sie zu finden." },
  8: { name: "Das Kraftpaket", essence: "Ehrgeiz, Meisterschaft, Fülle", lifePath: "Dein Weg ist, gut mit Macht und Mitteln umzugehen: Erfolg aufzubauen und ihn großzügig einzusetzen.", expression: "Du drückst dich durch Führung und Ergebnisse aus.", soul: "Tief in dir sehnst du dich nach Erfolg, Sicherheit und Respekt." },
  9: { name: "Die Menschenfreundin", essence: "Mitgefühl, Vollendung, Weisheit", lifePath: "Dein Weg ist, etwas Größerem zu dienen: zu geben, zu verzeihen und mit Würde loszulassen.", expression: "Du drückst dich durch Mitgefühl und weiten Blick aus.", soul: "Tief in dir sehnst du dich danach, die Welt freundlicher zu machen." },
  11: { name: "Die Intuitive (Meisterzahl 11)", essence: "Inspiration, Feingefühl, Vision", lifePath: "Eine Meisterzahl: ein Weg mit gesteigerter Intuition und Inspiration. Du trägst die Sanftheit der 2 mit einer Extraladung in dir: Sie zu erden ist deine Aufgabe.", expression: "Du drückst dich durch Inspiration und Einsicht aus.", soul: "Tief in dir sehnst du dich danach, in anderen etwas zu wecken." },
  22: { name: "Die Meisterbaumeisterin (Meisterzahl 22)", essence: "verwirklichte Vision", lifePath: "Eine Meisterzahl: große Träume mit der Bodenständigkeit der 4. Dein Weg ist, Dinge zu bauen, die vielen Menschen helfen. Stein für Stein.", expression: "Du drückst dich aus, indem du Visionen Struktur gibst.", soul: "Tief in dir sehnst du dich danach, etwas Bleibendes zu hinterlassen." },
  33: { name: "Die Meisterlehrerin (Meisterzahl 33)", essence: "mitfühlender Dienst", lifePath: "Eine Meisterzahl: die liebevolle Fürsorge der 6, verstärkt. Dein Weg ist, durch dein Vorbild zu heilen und zu lehren, mit gesunden Grenzen.", expression: "Du drückst dich durch hingebungsvolle Fürsorge und Lehren aus.", soul: "Tief in dir sehnst du dich danach, alle um dich herum aufzurichten." },
};

export const numberPairKinds: Record<string, string> = {
  mirror: "Gleiche Zahl: Ihr erkennt euch im anderen wieder und findet leicht einen gemeinsamen Rhythmus, braucht aber jemanden, der einen anderen Blick mitbringt.",
  family: "Gleiche Zahlenfamilie: Eure Grundantriebe zeigen in dieselbe Richtung, also fühlt sich Zusammenarbeit natürlich an.",
  friendly: "Ein traditionell freundliches Paar: verschieden, aber ergänzend. Jeder bringt etwas mit, das der andere genießt.",
  contrast: "Gegensätzliche Zahlen: Ihr habt verschiedene Tempi und schätzt verschiedene Dinge. Hier gibt es viel zu lernen, und Geduld zahlt sich aus.",
};

export const families: Record<string, string> = { mind: "Kopfzahlen (1·5·7)", heart: "Herzzahlen (3·6·9)", builder: "Baumeisterzahlen (2·4·8)" };

export const tarot: Record<MajorCard, { name: string; keyword: string; birth: string }> = {
  fool: { name: "Der Narr", keyword: "Neuanfang", birth: "Du trägst den Mut der Anfänger in dir: Vertrauen, Spiel und Sprünge ins Unbekannte." },
  magician: { name: "Der Magier", keyword: "Dinge geschehen lassen", birth: "Du hast die Gabe, Ideen mit Fokus und Können wahr werden zu lassen." },
  "high-priestess": { name: "Die Hohepriesterin", keyword: "inneres Wissen", birth: "Du weißt mehr, als du sagst: Intuition und stille Weisheit leiten dich." },
  empress: { name: "Die Herrscherin", keyword: "Fülle und Fürsorge", birth: "Du nährst, erschaffst und machst das Leben üppig und einladend." },
  emperor: { name: "Der Herrscher", keyword: "Struktur und Schutz", birth: "Du bringst Ordnung, Führung und einen sicheren Rahmen für andere." },
  hierophant: { name: "Der Hierophant", keyword: "Lehre und Tradition", birth: "Dir sind Sinn, Lernen und das Weitergeben von Wichtigem wertvoll." },
  lovers: { name: "Die Liebenden", keyword: "Wahl und Verbindung", birth: "Dein Leben wird von Herzensentscheidungen und tiefen Bindungen geprägt." },
  chariot: { name: "Der Wagen", keyword: "Willenskraft", birth: "Du kommst voran, indem du starke, gegensätzliche Kräfte in eine Richtung lenkst." },
  strength: { name: "Die Kraft", keyword: "sanfte Stärke", birth: "Deine Stärke ist weich und beständig: Mut, der zähmt statt zwingt." },
  hermit: { name: "Der Eremit", keyword: "inneres Licht", birth: "Du findest Wahrheit im Alleinsein und leuchtest später anderen den Weg." },
  wheel: { name: "Das Rad des Schicksals", keyword: "Zyklen", birth: "Du hast ein Gespür für Timing und Wandel. Du wächst, indem du die Wendungen mitnimmst." },
  justice: { name: "Die Gerechtigkeit", keyword: "Fairness", birth: "Du lebst nach Fairness, Wahrheit und Verantwortung für deine Entscheidungen." },
  "hanged-one": { name: "Der Gehängte", keyword: "neue Perspektive", birth: "Du siehst, was andere übersehen, weil du innehältst und aus einem anderen Winkel schaust." },
  death: { name: "Der Tod", keyword: "Verwandlung", birth: "Du kannst Enden gut gestalten, die Raum für Neues schaffen (es geht um Wandel, nicht um Verlust)." },
  temperance: { name: "Die Mäßigkeit", keyword: "Balance", birth: "Du verbindest Gegensätze geduldig und heilst, indem du den Mittelweg findest." },
  devil: { name: "Der Teufel", keyword: "Begierde und Schatten", birth: "Du verstehst Abhängigkeit und Versuchung und kannst darum anderen helfen, sich zu befreien." },
  tower: { name: "Der Turm", keyword: "Durchbruch", birth: "Du räumst Falsches weg, damit etwas Wahreres entstehen kann." },
  star: { name: "Der Stern", keyword: "Hoffnung", birth: "Du trägst Hoffnung und Erneuerung in dir. Menschen fühlen sich bei dir leichter." },
  moon: { name: "Der Mond", keyword: "Träume und Intuition", birth: "Du findest deinen Weg durchs Unklare mit Fantasie und Feingefühl." },
  sun: { name: "Die Sonne", keyword: "Freude", birth: "Du strahlst Wärme, Lebenskraft und kindliche Freude aus." },
  judgement: { name: "Das Gericht", keyword: "Erwachen", birth: "Du bist gerufen, dich einer Aufgabe zu stellen und der Vergangenheit zu verzeihen." },
  world: { name: "Die Welt", keyword: "Ganzheit", birth: "Du suchst Vollendung: das ganze Bild zusammenzubringen." },
};
