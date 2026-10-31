import type { PairKey } from "../../en/deep/bond";
import type { bondUi as EnBondUi } from "../../en/deep/bond";

export const meetPair: Record<PairKey, string> = {
  "fire-fire": "Zwei Feuer erkennen sich sofort. Erste Treffen sind oft laut, warm und schnell: Witze, Pläne, ein Gefühl von „Wo warst du denn bisher?“ Ihr stärkt gegenseitig euren Mut. Die frühe Lektion: Auch zwei Flammen brauchen Luft und Ruhe, sonst brennt der Abend so schnell aus, wie er begonnen hat.",
  "earth-fire": "Feuer kommt mit Funken; Erde schaut zu und entscheidet. Anfangs findet Feuer die Erde vielleicht etwas langsam und Erde das Feuer etwas viel, und doch sind beide still beeindruckt: Feuer von der Beständigkeit der Erde, Erde vom Mut des Feuers. Wenn es klappt, bringt Feuer die Ideen und Erde macht sie wahr.",
  "air-fire": "Luft und Feuer treffen sich wie Wind und Flamme: sofort lebendig. Gespräche rasen, Ideen vermehren sich, Lachen kommt leicht. Luft gibt dem Feuer Weitblick und Worte; Feuer gibt der Luft Wärme und Richtung. Eine der aufregendsten Verbindungen überhaupt: Die Aufgabe ist, sie geerdet zu halten.",
  "fire-water": "Feuer und Wasser ergeben Dampf. Das erste Treffen ist oft intensiv: Anziehung, Faszination, manchmal Verwirrung. Feuer fühlt sich von der Tiefe des Wassers angezogen, Wasser von Wärme und Mut des Feuers. Ihr könnt euch zusammen sehr lebendig fühlen und sehr missverstanden. Sanftheit ist die Brücke.",
  "earth-earth": "Zwei Erden fühlen sich fast sofort sicher. Weniger Feuerwerk, mehr Vertrauen: gemeinsame Werte, gemeinsamer Rhythmus, das Gefühl, dass dieser Mensch echt ist. Ihr baut schnell und gut zusammen. Eure frühe Lektion: Haltet ein bisschen Neues im Boden.",
  "air-earth": "Luft kommt mit Ideen; Erde fragt, wie sie funktionieren würden. Erste Treffen können sich wie eine spannende Debatte anfühlen. Luft findet Erde vielleicht zu vorsichtig, Erde findet Luft zu abstrakt, aber jede ergänzt, was der anderen fehlt: Luft weitet den Horizont der Erde, Erde gibt den Plänen der Luft Beine.",
  "earth-water": "Erde und Wasser treffen sich wie ein Ufer und sein Fluss: ganz natürlich. Schon früh gibt es ein Gefühl von Geborgenheit und Fürsorge. Wasser fühlt sich von der Beständigkeit der Erde gehalten; Erde wird durch die Wärme des Wassers weicher. Eine der nährendsten Verbindungen überhaupt.",
  "air-air": "Zwei Lüfte treffen sich im Gespräch und reden einfach weiter. Ihr versteht schnell, wie der andere denkt, teilt Ideen, lacht über dieselben Dinge und lasst euch Freiheit. Die frühe Frage ist die Tiefe: Wer wird langsam genug, um zu fühlen, nicht nur zu denken?",
  "air-water": "Luft denkt, Wasser fühlt. Anfangs ist jede von der Welt der anderen fasziniert: Luft von der Intuition des Wassers, Wasser von der Klarheit der Luft. Ihr könnt einander viel beibringen und habt vielleicht auch das Gefühl, verschiedene Sprachen zu sprechen. Geduld macht daraus eine wunderschöne Übersetzung.",
  "water-water": "Zwei Wasser spüren einander, bevor ein Wort fällt. Da ist Einfühlung, Intuition und das Gefühl, verstanden zu werden, ohne etwas erklären zu müssen. Die Bindung kann sehr schnell sehr eng werden. Die Lektion sind Grenzen: zu wissen, wessen Gefühle wessen sind.",
};
export const heartPair: Record<PairKey, string> = {
  "fire-fire": "Emotional reagiert ihr beide schnell und erholt euch schnell. Gefühle werden direkt gezeigt, das hält die Dinge ehrlich und kann zu plötzlichem Aufflammen führen. Geliebt fühlt ihr euch durch Begeisterung, Aufmerksamkeit und gemeinsames Tun.",
  "earth-fire": "Ein Herz flammt auf, das andere hält ruhig. Feuer fühlt schnell und laut; Erde verarbeitet langsam und praktisch. Feuer braucht von der Erde Wärme, nicht nur Ruhe; Erde braucht vom Feuer Zeit.",
  "air-fire": "Eure Gefühlsstile sind leicht und schnell: Ihr redet Gefühle durch, muntert euch auf und macht weiter. Das Risiko ist, die tieferen, langsameren Gefühle zu überspringen, die mehr brauchen als einen Witz.",
  "fire-water": "Die Gefühle des Feuers lodern und vergehen; die des Wassers gehen tief und bleiben. Feuer merkt vielleicht nicht, wie lange Wasser eine Verletzung trägt; Wasser merkt vielleicht nicht, dass Feuer längst verziehen hat. Gefühle sanft zu benennen und später nachzufragen hilft sehr.",
  "earth-earth": "Euer Gefühlsleben ist beständig und treu. Ihr zeigt Fürsorge durch Dasein und praktische Hilfe und macht selten Drama. Das Risiko ist, Gefühle gar nicht laut auszusprechen.",
  "air-earth": "Luft versteht Gefühle, indem sie darüber redet; Erde, indem sie etwas dagegen tut. Luft findet die Erde vielleicht schweigsam; Erde findet, Luft analysiert zu viel. Beides ist Fürsorge, nur in verschiedenen Dialekten.",
  "earth-water": "Eure Herzen passen ganz natürlich: Wasser fühlt tief, Erde hält beständig. Wasser braucht von der Erde manchmal sichtbare Gefühle, nicht nur Stabilität; Erde braucht vom Wasser das Vertrauen, dass Ruhe auch Liebe ist.",
  "air-air": "Ihr verarbeitet Gefühle über Gespräche und Ideen. Ihr versteht euch gut: Die Aufgabe ist, Gefühle auch zu fühlen, nicht nur zu erklären.",
  "air-water": "Wasser fühlt zuerst und erklärt später; Luft erklärt zuerst und fühlt später. Wasser erlebt Luft vielleicht als distanziert; Luft erlebt Wasser als überwältigend. Übersetzt sanft: „Was ich meine, ist …“, „Was ich fühle, ist …“.",
  "water-water": "Zwei tiefe Herzen: Ihr spürt die Stimmungen des anderen intensiv und tröstet euch ganz natürlich. In schweren Zeiten sinkt ihr vielleicht beide zusammen; einer von euch muss manchmal das Ufer sein.",
};
export const talkPair: Record<PairKey, string> = {
  "fire-fire": "Ihr redet schnell, unterbrecht euch voller Begeisterung und entscheidet rasch. Super, um Abenteuer zu planen; weniger super, wenn beide gleichzeitig gehört werden wollen. Wechselt euch ab.",
  "earth-fire": "Feuer spricht in Möglichkeiten, Erde in Machbarkeiten. Feuer fühlt sich vielleicht gebremst, Erde gehetzt. Wenn ihr Ideenzeit und Planzeit vereinbart, seid ihr ein starkes Team.",
  "air-fire": "Eure Köpfe funkeln zusammen: Debatten, Witze, Ideen. Langweilig wird es selten. Sorgt dafür, dass große Gespräche mit einer Entscheidung enden, nicht nur mit Begeisterung.",
  "fire-water": "Feuer spricht direkt; Wasser hört Ton und Untertext. Ein unverblümter Satz vom Feuer kann das Wasser verletzen, und Andeutungen des Wassers überhört das Feuer. Direktheit mit Sanftheit ist eure gemeinsame Sprache.",
  "earth-earth": "Ihr sprecht klar und meint, was ihr sagt. Weniger Worte, mehr Einigkeit. Denkt daran, auch über Träume zu reden, nicht nur über Organisatorisches.",
  "air-earth": "Luft sammelt Ideen; Erde bewertet. Gut gemacht entstehen so gute Entscheidungen. Schlecht gemacht fühlt sich Luft kritisiert und Erde ungehört. Sagt, in welchem Modus ihr gerade seid.",
  "earth-water": "Erde spricht in Fakten, Wasser in Gefühlen. Ihr versteht euch besser, als ihr denkt. Fragt öfter „Was brauchst du?“ als „Was ist das Problem?“.",
  "air-air": "Ihr könntet die ganze Nacht reden, und tut es wahrscheinlich auch. Eure Kommunikation ist ein Vergnügen. Die Falle ist, über alles zu reden außer über das eine unangenehme Thema.",
  "air-water": "Luft nutzt Logik, Wasser Intuition. Ihr ergänzt euch wunderbar, wenn Luft auf das Gefühl unter den Worten hört und Wasser wagt, Dinge klar auszusprechen.",
  "water-water": "Ihr versteht euch oft ohne Worte. Das ist ein Geschenk und eine Falle, weil Annahmen Fragen ersetzen. Sagt das Offensichtliche trotzdem.",
};
export const desirePair: Record<PairKey, string> = {
  "fire-fire": "Die Anziehung zwischen zwei Feuern ist sofort da und verspielt: Herausforderung, Jagd und Lachen. Haltet sie mit Abenteuern lebendig.",
  "earth-fire": "Feuer bringt Kühnheit, Erde Sinnlichkeit und Geduld. Die Chemie wächst langsam und kann euch beide überraschen.",
  "air-fire": "Begehren beginnt im Kopf: Necken, Flirten und Spaß. Überrascht euch immer wieder.",
  "fire-water": "Magnetisch und intensiv: Die Leidenschaft des Feuers trifft die Tiefe des Wassers. Emotionale Sicherheit lässt die Chemie bleiben.",
  "earth-earth": "Eine langsame, sinnliche, treue Anziehung. Geborgenheit ist nicht der Feind des Begehrens, Routine schon. Plant Neues ein.",
  "air-earth": "Luft fühlt sich von der ruhigen Präsenz der Erde angezogen, Erde von der Leichtigkeit der Luft. Die Chemie wächst durch gemeinsame Erlebnisse.",
  "earth-water": "Zärtlich und sinnlich: Berührung, Nähe und Sicherheit nähren das Begehren. Eine sehr nährende Chemie.",
  "air-air": "Anziehung durch Ideen, Humor und Freiheit. Flirtet mit Worten und vergesst den Körper nicht.",
  "air-water": "Die Leichtigkeit der Luft macht das Wasser neugierig; die Tiefe des Wassers fasziniert die Luft. Die Chemie braucht Gespräch und Zärtlichkeit.",
  "water-water": "Tiefe, emotionale, fast telepathische Anziehung. Nähe baut darauf, sich sicher zu fühlen.",
};

export const attachPair: Record<string, { text: string; flag?: string }> = {
  "secure-secure": { text: "Ihr fühlt euch beide ziemlich sicher mit Nähe und mit Abstand. Konflikte sind unangenehm, aber keine Katastrophe; ihr könnt reparieren. Das ist die stärkste Grundlage für langfristiges Glück, die die Forschung kennt." },
  "anxious-secure": { text: "Die Beständigkeit des sicher gebundenen Menschen kann die Ängste des ängstlichen mit der Zeit beruhigen. Das kann heilsam sein, wenn der eine Bestätigung gibt und der andere lernt, ihr zu vertrauen." },
  "avoidant-secure": { text: "Der sicher gebundene Mensch gibt dem vermeidenden Raum ohne Strafe und lädt sanft zu Nähe ein. Mit der Zeit kann das vermeidende Muster weicher werden." },
  "fearful-secure": { text: "Die Beständigkeit des sicher gebundenen Menschen kann für den ängstlich vermeidenden sehr heilsam sein, wenn beide mit dem Hin und Her geduldig sind." },
  "anxious-anxious": { text: "Ihr sehnt euch beide nach Nähe und Bestätigung. Ihr versteht die Ängste des anderen und könnt sie auch auslösen. Zusammen braucht ihr extra Ruhe: langsame Antworten, klare Bestätigung, gemeinsames Beruhigen.", flag: "Zwei ängstliche Herzen können sich gegenseitig hochschaukeln. Wenn ein Streit mit „Dir ist es egal“ beginnt: innehalten, atmen und bestätigen, bevor ihr diskutiert." },
  "anxious-avoidant": { text: "Das ist der klassische Tanz aus Verfolgen und Zurückziehen: Je mehr der eine sucht, desto mehr zieht sich der andere zurück, und je mehr der sich zurückzieht, desto mehr sucht der erste. Sehr häufig und gut lösbar, sobald ihr es seht.", flag: "Achtet auf die Schleife aus Verfolgen und Zurückziehen. Der ängstliche Mensch übt, sich selbst zu beruhigen; der vermeidende übt zu sagen: „Ich brauche eine Stunde, dann komme ich zurück.“ Und kommt dann zurück." },
  "anxious-fearful": { text: "Ihr sehnt euch beide nach Nähe und macht euch Sorgen darum. Vielleicht versteht ihr den Schmerz des anderen ganz genau. Beständigkeit und Sanftheit sind entscheidend.", flag: "Gemischte Signale können die Sorgen auf beiden Seiten verstärken. Vereinbart einfache, klare Gewohnheiten, um nachzufragen." },
  "avoidant-avoidant": { text: "Ihr schätzt beide Unabhängigkeit und lasst euch viel Raum. Ruhig und dramaarm, aber mit dem Risiko, auseinanderzudriften, ohne es zu merken.", flag: "Distanz kann leise wachsen. Plant echte Nähe ein und redet über Gefühle, auch wenn es unnötig scheint." },
  "avoidant-fearful": { text: "Der eine schützt sich durch Abstand, der andere schwankt zwischen Sehnsucht und Vorsicht. Geduld, Klarheit und kleine Schritte zur Nähe helfen beiden.", flag: "Wenn beide gleichzeitig zurückweichen, meldet sich niemand. Legt vorher fest, wer nach einem Streit die erste Nachricht schickt." },
  "fearful-fearful": { text: "Ihr kennt beide das Gefühl, Nähe zu wollen und zu fürchten. Dieses gemeinsame Verständnis kann sehr tief gehen, und es braucht auch viel Sanftheit und oft Unterstützung von außen.", flag: "Ihr könnt euch gegenseitig triggern. Geht langsam und überlegt euch Unterstützung durch Therapie oder vertraute Freunde." },
};

export const lifePathPair: Record<"mirror" | "family" | "friendly" | "contrast", string> = {
  mirror: "Ihr geht dieselbe Lebenszahl. Ihr versteht die Lebenslektionen des anderen von innen und wiederholt vielleicht auch die blinden Flecken des anderen.",
  family: "Eure Lebenszahlen gehören zur selben Zahlenfamilie: Lebensrhythmus und Werte passen meist ganz natürlich zusammen.",
  friendly: "Eure Lebenszahlen gelten traditionell als befreundet: verschiedene Wege, die einander stützen.",
  contrast: "Eure Lebenszahlen sind ziemlich verschieden: Ihr zeigt einander Lebensweisen, die der andere allein nicht wählen würde, spannend und lehrreich.",
};
export const chinesePair: Record<string, string> = {
  "six-harmony": "In der chinesischen Tradition bilden eure Tiere ein Paar „geheimer Freunde“. Eine der stärksten Verbindungen auf dem Rad. Ihr schützt und ergänzt euch meist gegenseitig.",
  trine: "Eure Tiere gehören zum selben Dreierteam: natürliche Verbündete mit ähnlichem Stil und Tempo.",
  same: "Ihr habt dasselbe Tier: tiefe Vertrautheit, dieselben Stärken und dieselben sturen Stellen.",
  neutral: "Eure Tiere sind in der Tradition neutral: Die Verbindung wird von dem geprägt, was ihr baut, nicht vom Schicksal.",
  harm: "Laut Tradition können sich eure Tiere in kleinen Dingen missverstehen. Klare Kommunikation löst das meiste.",
  clash: "Eure Tiere stehen sich auf dem Rad gegenüber: ein Gegensatzpaar. Das heißt Anziehung und Reibung: Ihr seht die Welt von entgegengesetzten Seiten und könnt am meisten voneinander lernen.",
};
export const traitPair: Record<string, { same: string; diff: string }> = {
  O: { same: "Ihr habt einen ähnlichen Hunger nach Neuem und Ideen, darum fallen Pläne und Gespräche leicht.", diff: "Einer von euch liebt Neues, der andere das Vertraute: Einer bringt Abenteuer, der andere Wurzeln." },
  C: { same: "Ihr habt ähnliche Ansprüche an Ordnung und Verlässlichkeit: weniger Streit über Haushalt und Pläne.", diff: "Einer plant, der andere improvisiert. Einigt euch, was geplant werden muss und was locker bleiben darf." },
  E: { same: "Eure sozialen Akkus sind ähnlich. Ihr seid euch einig, wie viele Menschen und wie viel Ruhe ihr braucht.", diff: "Einer lädt bei Menschen auf, der andere allein. Verhandelt soziale Zeit offen; keiner liegt falsch." },
  A: { same: "Ihr habt ein ähnliches Verhältnis von Sanftheit und Direktheit, darum fühlen sich Konflikte vertraut an.", diff: "Einer von euch ist sanfter, der andere direkter. Der Sanftere braucht die Wahrheit freundlich gesagt; der Direkte braucht, dass der Sanftere sich äußert." },
  N: { same: "Ihr reagiert ähnlich auf Stress. Ihr versteht die Sorgen (oder die Ruhe) des anderen.", diff: "Einer spürt Stress stark, der andere bleibt ruhig. Der Ruhige kann ein Anker sein; der Empfindsame kann emotionale Achtsamkeit lehren." },
};

export const relIntro: Record<string, (a: string, b: string) => string> = {
  romantic: (a, b) => `Das ist die Geschichte von ${a} und ${b} als Paar: wie ihr euch begegnet, redet, begehrt, streitet und wachst. Jede Verbindung hat ihr eigenes Wetter. Hier ist eures, gelesen durch den Himmel, die alten Kalender und eure eigenen Antworten.`,
  friend: (a, b) => `Das ist die Geschichte von ${a} und ${b} als Freunde: welche Art Freundschaft ihr schließt, wie ihr euch stützt und was sie dauerhaft macht.`,
  family: (a, b) => `Das ist die Geschichte von ${a} und ${b} als Familie: die alten Muster, die tiefe Treue und die Wege, wie ihr einander heilen und stärken könnt.`,
  colleague: (a, b) => `Das ist die Geschichte von ${a} und ${b} als Kollegen: wie ihr zusammen denkt, entscheidet und baut und wie ihr das Beste aus euren Unterschieden macht.`,
};
export const archetypeLong: Record<string, string> = {
  harbor: "Langfristig wird eure Verbindung meist zu einem Hafen: ein sicherer, ruhiger Ort zum Heimkommen. Das ist selten und kostbar. Das Risiko jedes Hafens ist, dass die Schiffe ihn nie verlassen: Bringt immer wieder neue Erlebnisse, neue Gespräche, neue Abenteuer hinein, damit Sicherheit nie zu Stillstand wird.",
  wildfire: "Langfristig hat eure Verbindung das Zeug zu einem Lauffeuer: leicht und elektrisch zugleich. Ihr fließt und ihr funkt. Schützt sie mit Ruhe, Freundlichkeit und ehrlichen Gesprächen, denn starke Feuer brauchen Pflege, und nur wenige Verbindungen sind so lebendig.",
  forge: "Langfristig wirkt eure Verbindung wie eine Schmiede: Hitze und Druck formen euch beide. Es ist nicht immer leicht, aber selten langweilig, und es kann euch beide stärker machen. Der Schlüssel ist Respekt: Reibung, die schärft statt verletzt.",
  garden: "Langfristig ist eure Verbindung ein Garten: Sie blüht langsamer und wird mit jeder Saison tiefer, in der ihr sie pflegt. Ihr wachst mit der Zeit ineinander. Geduld, kleine Rituale und Wertschätzung sind euer Wasser und Sonnenlicht.",
};
export const rituals: Record<string, string[]> = {
  romantic: ["Ein wöchentliches Date, die Handys in einem anderen Raum.", "Jeden Sonntag zehn Minuten „Wie geht es uns?“.", "Jeden Morgen ein Satz der Wertschätzung.", "Jeden Monat ein neues gemeinsames Erlebnis."],
  friend: ["Ein festes monatliches Treffen, das ihr beide schützt.", "Schickt euch etwas, das euch an den anderen erinnert hat.", "Feiert die kleinen Erfolge des anderen laut.", "Macht jede Jahreszeit etwas Neues zusammen."],
  family: ["Ein regelmäßiger Anruf oder ein Essen zu einer festen Zeit.", "Teilt bei jedem Besuch eine Erinnerung oder Familiengeschichte.", "Fragt nach der Gegenwart, nicht nur nach der Vergangenheit.", "Dankt einander für etwas Konkretes."],
  colleague: ["Ein kurzer wöchentlicher Abgleich über Prioritäten, nicht nur Aufgaben.", "Nennt die Stärken des anderen, wenn ihr Arbeit verteilt.", "Legt vorher fest, wie Meinungsverschiedenheiten entschieden werden.", "Feiert abgeschlossene Projekte zusammen."],
};
export const flags = {
  fireWater: "Hitze aus Feuer und Wasser: Streit kann schnell hochkochen. Kühlt ab, bevor ihr es klärt.",
  bothLowA: "Ihr seid beide ziemlich direkt. Ehrlichkeit ist gut: Fügt bewusst Wärme hinzu, besonders im Streit.",
  bothHighN: "Ihr spürt beide Stress stark. In harten Wochen: Seid sanft und wechselt euch ab, wer der Ruhige ist.",
  careMismatch: (a: string, b: string, ga: string, gb: string) => `Unterschiedliche Fürsorge: ${a} gibt ${ga}, braucht aber am meisten etwas anderes, und ${b} gibt ${gb}. Vielleicht liebt ihr beide auf eine Art, die der andere gar nicht bemerkt. Sagt einander genau, was bei euch ankommt.`,
  sameShadow: (s: string) => `Ihr teilt denselben Hauptschatten (${s}). Ihr erkennt ihn beim anderen und verstärkt ihn vielleicht. Benennt ihn freundlich, wenn er sich zeigt.`,
  clash: "Chinesisches Gegensatzpaar: Ihr drückt vielleicht auf vorhersehbare Weise die Knöpfe des anderen. Haltet inne, bevor ihr reagiert.",
  none: "Keine starken Warnzeichen in euren Blickwinkeln. Bleibt bei den Grundlagen: Freundlichkeit, Ehrlichkeit und Versöhnung nach Streit.",
};
export const bondUi: typeof EnBondUi = {
  eyebrow: "Eure Beziehungsgeschichte",
  title: (a: string, b: string) => `${a} & ${b}`,
  chapters: {
    meet: { title: "Erste Eindrücke", kicker: "Wie ihr euch begegnet und was ihr ineinander seht" },
    talk: { title: "Wie ihr redet", kicker: "Köpfe, Worte und Entscheidungen" },
    heart: { title: "Herzen und Gefühle", kicker: "Monde, Bindung und emotionaler Rhythmus" },
    closeness: { title: "Nähe und Chemie", kicker: "Begehren, Fürsorge und was euch zueinander zieht" },
    conflict: { title: "Wenn ihr aneinandergeratet", kicker: "Eure Reibungspunkte und wie ihr euch versöhnt" },
    growth: { title: "Wie ihr einander wachsen lasst", kicker: "Eure Superkräfte und Wachstumsfelder" },
    path: { title: "Der lange Weg", kicker: "Wohin diese Verbindung mit der Zeit meist führt" },
    flags: { title: "Worauf ihr achten solltet", kicker: "Ehrliche Warnzeichen und was ihr tun könnt" },
    rituals: { title: "Rituale für zwei", kicker: "Kleine Gewohnheiten, die diese Verbindung lebendig halten" },
  },
  sunsLine: (a: string, sa: string, b: string, sb: string) => `Die Sonne von ${a} steht im Zeichen ${sa}, die von ${b} im Zeichen ${sb}.`,
  moonsLine: (a: string, sa: string, b: string, sb: string) => `Der Mond von ${a} steht im Zeichen ${sa}, der von ${b} im Zeichen ${sb}.`,
  mercLine: (a: string, sa: string, b: string, sb: string) => `${a} denkt mit Merkur im Zeichen ${sa}, ${b} mit Merkur im Zeichen ${sb}.`,
  venusMars: (a: string, va: string, b: string, mb: string) => `Die Venus von ${a} im Zeichen ${va} trifft den Mars von ${b} im Zeichen ${mb}.`,
  aspectsTitle: "Die stärksten Verbindungen zwischen euren Horoskopen",
  attachTitle: (a: string, sa: string, b: string, sb: string) => `${a}: ${sa}. ${b}: ${sb}.`,
  careTitle: "Wie ihr füreinander sorgt",
  careLine: (a: string, ra: string, ga: string) => `${a} fühlt sich am meisten geliebt durch ${ra} und gibt ganz natürlich ${ga}.`,
  nineLine: (a: string, ta: string, b: string, tb: string) => `${a} wird vom Wunsch bewegt, ${ta}; ${b} vom Wunsch, ${tb}.`,
  nineTip: "Die tiefste Motivation des anderen zu kennen verwandelt viele Streits in Verständnis: Selten streitet ihr wirklich über den Abwasch, öfter darüber, was der Abwasch bedeutet.",
  traitsTitle: "Eure Persönlichkeiten nebeneinander",
  superTitle: "Eure gemeinsamen Superkräfte",
  edgeTitle: "Eure Wachstumsfelder",
  scores: (h: number, s: number) => `Über alle Blickwinkel hinweg liegt eure Harmonie bei ${h} und euer Funke bei ${s}.`,
  needQuiz: "Macht mehr Tests (ihr beide), um dieses Kapitel zu vertiefen.",
  vedicLine: (n: number) => `Der traditionelle vedische Abgleich gibt euch ${n} von 36 Punkten.`,
  cardLine: (n: string, t: string) => `Eure gemeinsame Tarotkarte ist ${n}: ${t}`,
};
