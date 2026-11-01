import type { Trait, Temperament } from "@/engine/bigfive";
import type { AttachStyle, Care, Dosha, Constitution, Stance } from "@/engine/quizzes";
import type { Axis } from "@/engine/shadow";
import type { ArchetypeAnimal } from "@/engine/profile";

export const traits: Record<Trait, { name: string; plain: string; low: string; mid: string; high: string; inLove: string }> = {
  O: { name: "Offenheit", plain: "Neugier und Fantasie", low: "Du magst Bewährtes und Praktisches und bringst Bodenhaftung mit.", mid: "Du verbindest neue Ideen mit dem, was schon funktioniert.", high: "Du liebst Ideen, Kunst und neue Erfahrungen; Routine langweilt dich schnell.", inLove: "bringt Neues und tiefe Gespräche" },
  C: { name: "Gewissenhaftigkeit", plain: "Verlässlichkeit und Ordnung", low: "Du bist spontan und flexibel; Pläne sind eher Vorschläge.", mid: "Du bist organisiert, wenn es zählt, und locker, wenn nicht.", high: "Du bist verlässlich, planst und ziehst Dinge durch.", inLove: "bringt Verlässlichkeit, eine Eigenschaft, die mit glücklicheren Beziehungen zusammenhängt" },
  E: { name: "Extraversion", plain: "soziale Energie", low: "Du lädst allein auf und magst tiefe Gespräche unter vier Augen.", mid: "Du magst Menschen und brauchst auch deine Ruhe.", high: "Du lädst bei Menschen auf, redest leicht und bringst Energie in den Raum.", inLove: "bringt Wärme, Spaß und gemeinsame Erlebnisse" },
  A: { name: "Verträglichkeit", plain: "Wärme und Kooperation", low: "Du bist direkt, ehrgeizig und lässt dich nicht herumschubsen.", mid: "Du bist freundlich und kannst trotzdem standhaft bleiben.", high: "Du bist warmherzig, vertrauensvoll und hilfst oder verzeihst schnell.", inLove: "bringt Freundlichkeit, die stark mit Zufriedenheit in Beziehungen zusammenhängt" },
  N: { name: "Emotionale Empfindsamkeit", plain: "wie stark dich Stress und Sorgen treffen", low: "Du bleibst unter Druck ruhig und fängst dich schnell.", mid: "Du spürst Stress wie die meisten und erholst dich meist gut.", high: "Sorgen und Verletzungen spürst du intensiv; dafür nimmst du Gefühle sehr fein wahr.", inLove: "hohe Empfindsamkeit wünscht sich Bestätigung und beruhigende Rituale: die wichtigste Eigenschaft, um die ihr euch gemeinsam kümmert" },
};

export const letters: Record<string, string> = {
  E: "Nach außen: Energie durch Menschen", I: "Nach innen: Energie durch Ruhe",
  N: "Fantasievoll: zieht es zu Ideen und Mustern", S: "Praktisch: zieht es zu Fakten und dem Hier und Jetzt",
  F: "Herzgesteuert: entscheidet mit Blick auf Menschen", T: "Kopfgesteuert: entscheidet mit Blick auf Logik",
  J: "Geplant: mag Abschluss und Struktur", P: "Flexibel: mag Optionen und lässt sich treiben",
};

export const fourLetterStyles: Record<string, { name: string; text: string }> = {
  INTJ: { name: "Der Nachtplaner", text: "Unabhängig, strategisch und still entschlossen; denkt weit voraus." },
  INTP: { name: "Der stille Tüftler", text: "Neugierig und analytisch; will verstehen, wie alles zusammenpasst." },
  ENTJ: { name: "Der kühne Organisator", text: "Entschlossen und ehrgeizig; macht aus Visionen Pläne und aus Plänen Ergebnisse." },
  ENTP: { name: "Der Ideenfunke", text: "Schnell, erfinderisch und verspielt; liebt Debatten und neue Möglichkeiten." },
  INFJ: { name: "Der tiefe Zuhörer", text: "Einfühlsam und fürsorglich; spürt, was Menschen brauchen und warum." },
  INFP: { name: "Der innere Poet", text: "Idealistisch und sanft; folgt Werten und Fantasie." },
  ENFJ: { name: "Der warme Antreiber", text: "Ermutigend und menschenorientiert; bringt andere für eine Sache zusammen." },
  ENFP: { name: "Der strahlende Entdecker", text: "Begeistert und fantasievoll; sieht in jedem Potenzial." },
  ISTJ: { name: "Der beständige Hüter", text: "Verlässlich und gründlich; hält Versprechen und hält den Laden am Laufen." },
  ISFJ: { name: "Der sanfte Kümmerer", text: "Freundlich, loyal und aufmerksam; merkt sich, was Menschen wichtig ist." },
  ESTJ: { name: "Der klare Macher", text: "Praktisch und organisiert; sorgt dafür, dass Dinge richtig erledigt werden." },
  ESFJ: { name: "Der soziale Kitt", text: "Warm und gesellig; hält Menschen verbunden und umsorgt." },
  ISTP: { name: "Der ruhige Löser", text: "Praktisch und gelassen; löst Probleme im Moment." },
  ISFP: { name: "Der stille Künstler", text: "Sanft und sinnlich; drückt sich durch Schönheit und Taten aus." },
  ESTP: { name: "Der schnelle Anpacker", text: "Energiegeladen und mutig; lernt, indem er einfach loslegt." },
  ESFP: { name: "Der Freudebringer", text: "Spontan und lustig; macht jeden Moment lebendiger." },
};

export const temperaments: Record<Temperament, { name: string; text: string; tip: string }> = {
  sanguine: { name: "Sanguiniker (Luft)", text: "Gesellig, optimistisch und lebhaft. Du hebst die Stimmung und lebst im Moment.", tip: "Halte jeden Tag ein Versprechen ein." },
  choleric: { name: "Choleriker (Feuer)", text: "Ehrgeizig, intensiv und entschlossen. Du bringst Dinge voran und fühlst stark.", tip: "Atme dreimal durch, bevor du reagierst." },
  phlegmatic: { name: "Phlegmatiker (Wasser)", text: "Ruhig, beständig und unkompliziert. Du bringst Frieden und Geduld.", tip: "Sag deinen Wunsch laut, auch wenn du einfach mitgehen könntest." },
  melancholic: { name: "Melancholiker (Erde)", text: "Nachdenklich, tief und sorgfältig. Du siehst Details und fühlst Dinge ganz.", tip: "Nenne vor dem Schlafen eine Sache, die gut lief." },
};

export const attachment: Record<AttachStyle, { name: string; text: string; need: string; tip: string }> = {
  secure: { name: "Sicher", text: "Mit Nähe und Unabhängigkeit fühlst du dich meist wohl. Du kannst sagen, was du brauchst, und vertraust darauf, dass andere da sind.", need: "Ehrlichkeit und gegenseitigen Respekt", tip: "Deine Ruhe ist ein Geschenk: Biete sie an, aber trag die Versöhnung nicht allein." },
  anxious: { name: "Eher ängstlich", text: "Du liebst tief und achtest auf Zeichen von Distanz. Wenn jemand still wird, können Sorgen schnell kommen.", need: "Bestätigung, Beständigkeit und klare Signale", tip: "Benenne die Angst, bevor du reagierst: Ich bin unsicher, kannst du mich beruhigen?" },
  avoidant: { name: "Eher vermeidend", text: "Dir ist Selbstständigkeit wichtig, und viel Nähe kann sich schnell eng anfühlen.", need: "Freiraum ohne schlechtes Gewissen und Nähe in deinem Tempo", tip: "Sag: Ich brauche kurz Zeit, um acht bin ich wieder da. Statt einfach zu verschwinden." },
  fearful: { name: "Hin und her", text: "Du sehnst dich nach Nähe und fürchtest sie zugleich, also gehst du vielleicht auf Menschen zu und dann wieder weg.", need: "Geduld, Sicherheit und sehr beständige Freundlichkeit", tip: "Bemerke den Moment des Rückzugs und teile ihn: Ein Teil von mir will gerade weglaufen." },
};
export const pursueWithdraw: string = "Wenn einer unter Stress Nähe sucht und der andere Abstand, kann eine Schleife entstehen: Je mehr der eine sucht, desto mehr zieht sich der andere zurück. Es ist das häufigste Muster, von dem Paare berichten, und das am besten lösbare. Vereinbart eine Auszeit mit fester Rückkehrzeit.";

export const nineStyles: Record<number, { name: string; core: string; gift: string; growth: string }> = {
  1: { name: "Der Verbesserer", core: "will gut sein und Dinge richtig machen", gift: "Integrität und hohe Ansprüche", growth: "Mach Platz für gut genug und für Freude." },
  2: { name: "Der Helfer", core: "will geliebt und gebraucht werden", gift: "Großzügigkeit und Wärme", growth: "Bitte so frei um Hilfe, wie du sie gibst." },
  3: { name: "Der Macher", core: "will wertvoll und erfolgreich sein", gift: "Antrieb und Anpassungsfähigkeit", growth: "Lass dich sehen, auch wenn du gerade nichts leistest." },
  4: { name: "Der Individualist", core: "will echt sein und verstanden werden", gift: "Tiefe, Kreativität und emotionale Ehrlichkeit", growth: "Achte auf das Schöne, das schon in ganz normalen Tagen steckt." },
  5: { name: "Der Beobachter", core: "will verstehen und kompetent sein", gift: "Einsicht und ruhige Sachlichkeit", growth: "Teile deine Innenwelt, bevor du dich ganz bereit fühlst." },
  6: { name: "Der Loyale", core: "will Sicherheit und Vertrauen", gift: "Loyalität, gute Vorbereitung und Mut, wenn es brennt", growth: "Vertrau deiner inneren Stimme jede Woche ein bisschen mehr." },
  7: { name: "Der Enthusiast", core: "will Freiheit und schöne Erlebnisse", gift: "Freude, Optimismus und Ideen", growth: "Bleib fünf Minuten bei einem schweren Gefühl, bevor du weitergehst." },
  8: { name: "Der Beschützer", core: "will Stärke und Kontrolle über das eigene Leben", gift: "Mut, Direktheit und Schutz für andere", growth: "Zeig Weichheit. Das ist Stärke, keine Schwäche." },
  9: { name: "Der Friedensstifter", core: "will inneren und äußeren Frieden", gift: "Annahme und die Gabe, Menschen zu verbinden", growth: "Deine Meinung zählt: Sag sie ruhig mal zuerst." },
};
export const nineNote: string = "Die neun Motive sind angelehnt an das weit verbreitete Modell der neun Persönlichkeitstypen. Das ist unser eigener kurzer Test, kein offizieller.";

export const care: Record<Care, { name: string; text: string; tip: string }> = {
  words: { name: "Liebe Worte", text: "Wertschätzung, Ermutigung und ein Ich bin stolz auf dich füllen deinen Akku.", tip: "Mach heute ein konkretes Kompliment." },
  time: { name: "Gemeinsame Zeit", text: "Ungeteilte Aufmerksamkeit (Handy weg, Blick nach oben) bedeutet dir am meisten.", tip: "Plane 20 Minuten ohne Ablenkung." },
  gifts: { name: "Durchdachte Geschenke", text: "Eine Kleinigkeit, die zeigt, ich hab an dich gedacht, fühlt sich an wie sichtbare Liebe.", tip: "Bring eine winzige Kleinigkeit von deinem Tag mit." },
  help: { name: "Hilfreiche Taten", text: "Hilfe bei einer Aufgabe, ein gelöstes Problem oder ein ungefragt gekochter Tee fühlt sich fürsorglich an.", tip: "Nimm eine Aufgabe von ihrer Liste." },
  touch: { name: "Körperliche Nähe", text: "Umarmungen, eine Hand auf der Schulter, nah beieinander sitzen: Berührung sagt es am besten (immer mit Einverständnis).", tip: "Eine lange Umarmung: mindestens 20 Sekunden." },
};
export const careNote: string = "Forschung deutet darauf hin, dass die meisten Menschen alle fünf Arten von Zuwendung schätzen, und dass es weniger auf Übereinstimmung ankommt als darauf, die Lieblingsarten des anderen zu lernen (Impett, Park & Muise, 2024). Nutze das als Übersetzungshilfe.";

export const shadowAxes: Record<Axis, { classical: string; virtue: string; shadow: string; gift: string; practice: string }> = {
  pride: { classical: "Stolz", virtue: "Demut", shadow: "Fehler schwer zugeben; recht haben müssen.", gift: "Selbstachtung und der Mut, aufrecht zu stehen.", practice: "Sag diese Woche einmal: Da hattest du recht." },
  greed: { classical: "Gier", virtue: "Großzügigkeit", shadow: "Das Gefühl, es ist nie genug; festhalten.", gift: "Ehrgeiz und die Fähigkeit, für andere zu sorgen.", practice: "Verschenk etwas, ohne es jemandem zu erzählen." },
  desire: { classical: "Wollust", virtue: "Selbstbeherrschung", shadow: "Stark wollen und aus dem Impuls handeln.", gift: "Leidenschaft, Lebenskraft und wissen, was du willst.", practice: "Wenn ein starker Drang kommt, warte zehn Minuten und entscheide dann." },
  envy: { classical: "Neid", virtue: "Bewunderung", shadow: "Der Erfolg anderer tut weh.", gift: "Ein Signal, das zeigt, was du dir wirklich wünschst.", practice: "Mach aus einem Neid ein Ziel: Welchen Schritt kann ich dahin gehen?" },
  excess: { classical: "Völlerei", virtue: "Maß", shadow: "Bei Angenehmem übertreiben: Essen, Bildschirm, Shoppen.", gift: "Eine große Fähigkeit zu genießen.", practice: "Übe genug: Hör einmal am Tag auf, wenn du satt bist." },
  anger: { classical: "Zorn", virtue: "Geduld", shadow: "Wut, die schnell und stark aufsteigt.", gift: "Leidenschaft für Gerechtigkeit und den Schutz dessen, was zählt.", practice: "Benenne die Verletzung unter der Wut, bevor du sprichst." },
  inertia: { classical: "Trägheit", virtue: "Fleiß", shadow: "Wichtiges aufschieben.", gift: "Die Fähigkeit zu ruhen und nicht auszubrennen.", practice: "Mach die wichtigste Aufgabe nur 10 Minuten lang." },
};
export const shadowDances: Record<string, string> = {
  "power-struggle": "Zwei stolze Herzen: Ihr habt beide gern recht. Wechselt euch ab, wer zuerst weich wird.",
  "chase-stonewall": "Wenn einer hochkocht und der andere dichtmacht, fühlen sich beide ungehört. Vereinbart eine Abkühlpause und eine Rückkehrzeit.",
  competition: "Vergleiche können sich einschleichen. Feiert die Erfolge des anderen laut.",
  "double-fire": "Zwei hitzige Gemüter lassen Funken fliegen. Nutzt ein Codewort, um Streit zu pausieren.",
  scarcity: "Ihr rutscht beide leicht ins Nie-genug-Denken. Schafft ein gemeinsames Ritual der Großzügigkeit.",
  "double-indulgence": "Ihr bestärkt euch gegenseitig beim Gönnen. Sucht Spaß, der nichts mit Konsum zu tun hat.",
  "stuck-together": "Bequemlichkeit kann zum Stillstand werden. Wählt pro Jahreszeit ein gemeinsames Ziel.",
  "comparison-loop": "Achtet darauf, euch nicht mit anderen zu vergleichen. Dankbarkeitslisten helfen.",
  "no-backing-down": "Wut trifft auf Stolz: Keiner gibt nach. Übt den Versöhnungssatz früh.",
  "high-heat": "Zwei starke Begierden. Viel Leidenschaft, also haltet Absprachen klar und freundlich.",
};

export const doshas: Record<Dosha, { name: string; element: string; text: string; balance: string }> = {
  vata: { name: "Vata", element: "Luft und Raum", text: "Schnell, kreativ und leicht. Du blühst durch Inspiration auf, kannst aber zerstreut oder besorgt werden, wenn du aus dem Gleichgewicht bist.", balance: "Wärme, Routine, erdendes Essen und genug Schlaf" },
  pitta: { name: "Pitta", element: "Feuer und Wasser", text: "Fokussiert, scharf und ehrgeizig. Du führst gut, kannst aber überhitzen und gereizt werden.", balance: "kühlendes Essen, Spiel ohne Wettkampf, Zeit in der Natur" },
  kapha: { name: "Kapha", element: "Erde und Wasser", text: "Beständig, ruhig und liebevoll. Du hältst durch und nährst andere, kannst aber festhängen oder träge werden.", balance: "Bewegung, Abwechslung, leichtere Mahlzeiten und neue Erlebnisse" },
};
export const constitutions: Record<Constitution, string> = {
  vata: "Vor allem Vata: luftig und kreativ.", pitta: "Vor allem Pitta: feurig und fokussiert.", kapha: "Vor allem Kapha: erdig und beständig.",
  "vata-pitta": "Vata-Pitta: schnell und ehrgeizig.", "pitta-kapha": "Pitta-Kapha: stark und beständig.", "vata-kapha": "Vata-Kapha: sanft und kreativ.",
  tridoshic: "Ausgeglichen (tridoshisch): von allem ein bisschen.",
};
export const doshaNote: string = "Angelehnt an traditionelle Ideen des Ayurveda, nur zur Selbstreflexion und für Wohlfühlroutinen. Keine medizinische Beratung.";

export const explorer = {
  name: "Autopilot oder Entdeckergeist",
  text: "Angelehnt an den neurokognitiven Ansatz von Dr. Jacques Fradin: Wir alle wechseln zwischen einem Autopilot-Modus (Routine, Gewissheit, was schon funktioniert hat) und einem Entdecker-Modus (Neugier, Feinheiten, Anpassung). Stress heißt oft, dass der Autopilot etwas lösen will, das den Entdecker braucht.",
  low: "Du setzt eher auf den Autopiloten: effizient, beständig, verlässlich. Frag dich unter Stress: Was weiß ich hier noch nicht?",
  mid: "Du wechselst zwischen beiden Modi. Achte darauf, welcher unter Stress auftaucht.",
  high: "Du bist eher Entdecker: neugierig, flexibel, entspannt mit Grauzonen. Denk daran, dass Routinen auch deinen Kopf freimachen können.",
  dims: { routine: "Routine ↔ Neugier", persistence: "Ausdauer ↔ Flexibilität", simplify: "Einfachheit ↔ Feinheit", certainty: "Gewissheit ↔ Offenheit", evidence: "Erfahrung ↔ Neues Denken", image: "Meinung anderer ↔ Eigene Sicht" } as Record<string, string>,
  note: "Eigener kurzer Fragebogen, angelehnt an veröffentlichte Ideen; keine offizielle Diagnostik.",
};
export const stances: Record<Stance, { name: string; text: string }> = {
  "steady-leader": { name: "Ruhige Führung", text: "Selbstbewusst und in Gruppen zu Hause. Du gehst voran und nimmst Menschen mit. Achte darauf, dass auch leisere Stimmen Raum bekommen." },
  "lone-pathfinder": { name: "Einsame Pfadfinderin", text: "Selbstbewusst und unabhängig. Du vertraust deinem Weg mehr als dem der Masse. Verbündete vervielfachen deine Stärke." },
  "warm-supporter": { name: "Warme Stütze", text: "Du gehörst leicht dazu und unterstützt andere großzügig. Deine Meinung verdient denselben Raum, den du allen anderen gibst." },
  "quiet-observer": { name: "Stille Beobachterin", text: "Du schaust vom Rand aus zu und siehst, was andere übersehen. Kleine, sichere Schritte, dich zu zeigen, stärken dein Selbstvertrauen." },
};

export const archetypeAnimals: Record<ArchetypeAnimal, { name: string; text: string }> = {
  lion: { name: "Löwe", text: "Strahlender Mut. Du beschützt und führst mit großem Herzen." },
  hawk: { name: "Falke", text: "Klare Sicht und schnelles Handeln. Du siehst das Ziel und legst los." },
  "horse-wild": { name: "Wildpferd", text: "Freier Geist mit langem Atem. Du rennst auf das zu, was du liebst." },
  fox: { name: "Fuchs", text: "Stilles Feuer und kluge Wärme. Du bewegst dich elegant durch jede Lage." },
  stag: { name: "Hirsch", text: "Stolze, ruhige Stärke. Du stehst mit Würde zu dir." },
  bear: { name: "Bär", text: "Beschützend, warm und kraftvoll: der sichere Ort, zu dem andere laufen." },
  elephant: { name: "Elefant", text: "Gedächtnis, Treue und sanfte Kraft. Freundlichkeit vergisst du nie." },
  tortoise: { name: "Schildkröte", text: "Geduldige Weisheit: langsam, beständig und kommt immer an." },
  eagle: { name: "Adler", text: "Das große Ganze. Du steigst auf und siehst, wohin alles führt." },
  hummingbird: { name: "Kolibri", text: "Helle Freude und flinker Kopf. Du findest überall etwas Süßes." },
  raven: { name: "Rabe", text: "Klug und geheimnisvoll. Du verstehst mehr, als du zeigst." },
  dolphin: { name: "Delfin", text: "Verspielte Klugheit und Harmonie. Du verbindest Menschen mühelos." },
  otter: { name: "Otter", text: "Fröhlich und liebevoll. Du spielst, sorgst dich und hältst beim Treiben Händchen." },
  wolf: { name: "Wolf", text: "Treuer Instinkt: deinem Rudel und deinem eigenen Weg ergeben." },
  whale: { name: "Wal", text: "Tiefes Fühlen und uralte Ruhe. Dein Lied reicht weit." },
  owl: { name: "Eule", text: "Nachtweisheit. Du siehst im Dunkeln und sprichst, wenn es zählt." },
};
export const archetypeNote: string = "Dein Krafttier ist ein Symbol aus deinem stärksten Element und deiner Yin-Yang-Balance: ein poetischer Spiegel, kein spiritueller Anspruch auf irgendeine Tradition.";
