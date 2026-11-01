import type { PlayContent, DimText } from "../en/play";
import type { PlayDim, PlayFlag, PlayGameId, Emotion, CareMove } from "@/engine/play";

const dims: Record<PlayDim, DimText> = {
  risk: {
    name: "Risikofreude", poles: ["Vorsichtig", "Kühn"], word: { low: "vorsichtig", high: "kühn" },
    text: {
      low: "Du hast immer wieder den Steinweg genommen. Beständig schlägt für dich glänzend: Du sammelst lieber kleine, sichere Sterne, als auf Glas zu setzen. Man vertraut dir den Plan an, weil du darüber nachdenkst, wo der Boden ist.",
      mid: "Du hast gemischt: mal Seil, mal Stein, ein bisschen Glas, wenn der Moment passte. Du wägst jedes Mal Gewinn gegen Fall ab, eine gute Gewohnheit. Du brauchst kein Risiko, um dich lebendig zu fühlen, und du läufst auch nicht davor weg.",
      high: "Du bist aufs Glas gegangen. Größere Sterne, tieferer Fall, und du hast es immer wieder gewählt. Du magst den Kick einer echten Wette und lernst durch Ausprobieren. Prüf nur ab und zu, ob die anderen auf der Brücke dieselbe Fahrt gebucht haben.",
    },
    up: "Deine Antworten lassen dich vorsichtiger klingen, als du gespielt hast: Auf den Brücken warst du kühn.",
    down: "Deine Antworten lassen dich abenteuerlustiger klingen, als du gespielt hast: Auf den Brücken hast du den sicheren Weg gewählt.",
    said: "Aus deinem Big Five Test: Offenheit und wie geplant du bist.",
  },
  resilience: {
    name: "Rückfederung", poles: ["Erschüttert", "Elastisch"], word: { low: "nach einem Sturz empfindlich", high: "schnell wieder oben" },
    text: {
      low: "Ein Sturz ist dir nachgegangen. Nachdem die Brücke brach, bist du langsamer geworden oder auf den sichersten Weg gewechselt, eine sehr menschliche Art, dich zu schützen. Gut, das über dich zu wissen: Gönn dir nach einem Rückschlag einen Moment, bevor du entscheidest, was er bedeutet.",
      mid: "Ein Sturz hat dich etwas gebremst, dann bist du weitergegangen. Du hast kurz innegehalten, dich angepasst und bist wieder auf eine Brücke. Diese Pause ist nützlich: Du lernst aus dem Riss, ohne dass er jede Wahl für dich trifft.",
      high: "Du bist gefallen und sofort wieder raus, oft auf dieselbe Brücke. Rückschläge kommen an, aber sie steuern dich nicht. Das ist eine Stärke unter Druck. Eins solltest du im Blick behalten: Menschen um dich brauchen vielleicht länger als du, um sich zu erholen.",
    },
    up: "Deine Antworten deuten an, dass Rückschläge dich aus der Bahn werfen, doch nach einem Sturz warst du sofort wieder auf der Brücke.",
    down: "Deine Antworten deuten an, dass du unter Druck ruhig bleibst, doch ein Sturz hat dich im Spiel deutlich gebremst.",
    said: "Aus deinem Big Five Test: emotionale Gelassenheit.",
  },
  read: {
    name: "Gesichter lesen", poles: ["Übersieht Signale", "Liest Gesichter"], word: { low: "auf Worte fokussiert", high: "scharf im Gesichterlesen" },
    text: {
      low: "Die Blitze waren schwer zu erwischen, besonders die feinen. Viele Menschen lesen Worte besser als Gesichter, und das ist in Ordnung. Im echten Leben füllt ein einfaches „Wie geht es dir wirklich?“ die Lücke, die ein schneller Blick lässt.",
      mid: "Du hast die klaren Ausdrücke erwischt und einige der feinen. Du bemerkst mehr, als du vielleicht denkst, vor allem wenn ein Gefühl stark ist. Die leisen (ein angespannter Kiefer, ein halbes Lächeln) sind deine nächste Ebene des Lesens.",
      high: "Du hast sogar die Mikroausdrücke von einer halben Sekunde erwischt. Du siehst ein Gefühl, bevor es ausgesprochen ist, und bist darum gute Gesellschaft in schweren Momenten. Denk daran, dass auch eine Deutung eine Vermutung bleibt: Prüf sie sanft, bevor du danach handelst.",
    },
    up: "", down: "", said: "",
  },
  empathy: {
    name: "Einfühlung", poles: ["Praktisch", "Eingestimmt"], word: { low: "praktisch", high: "eingestimmt" },
    text: {
      low: "Wenn jemandem schlecht ging, hast du nach Lösungen oder Ablenkung gegriffen. Auch das ist Fürsorge: Du willst, dass der Schmerz aufhört. Manchmal wollen Menschen aber erst gehört werden, bevor man ihnen hilft. Versuch, erst zu benennen, was sie fühlen, und dann die Lösung anzubieten.",
      mid: "Du hast zwischen Zuhören und Helfen gewechselt. Mal hast du das Gefühl benannt, mal eine Lösung gesucht. Dein Instinkt ist zu helfen, auf welche Art auch immer, und du kannst lernen, was jeder Mensch braucht.",
      high: "Du hast Menschen dort abgeholt, wo sie waren: das Gefühl benannt und dabei geblieben, bevor du etwas reparieren wolltest. Genau deshalb fühlen sich Menschen bei dir sicher. Halt auch ein bisschen Raum für dich frei, damit du nicht das Wetter aller trägst.",
    },
    up: "Deine Antworten klingen nüchterner, als du gespielt hast: Im Spiel bist du direkt aufs Gefühl gegangen.",
    down: "Deine Antworten klingen wärmer, als du gespielt hast: Im Spiel hast du eher nach Lösungen als nach Gefühlen gegriffen.",
    said: "Aus deinem Big Five Test: Verträglichkeit.",
  },
  trust: {
    name: "Vertrauen", poles: ["Zurückhaltend", "Großzügig"], word: { low: "zurückhaltend", high: "großzügig im Vertrauen" },
    text: {
      low: "Du hast Moos kleine Beträge geschickt und wurdest noch vorsichtiger, nachdem Moos die Münzen einmal behalten hat. Du schützt, was dir gehört, bis sich jemand mehr verdient. Das hält dich sicher; es kann gute Menschen aber auch etwas länger als nötig auf Abstand halten.",
      mid: "Du hast Moos eine faire Chance gegeben und dich angepasst, als es schiefging. Vertrauen folgt bei dir Beweisen: offen genug, um Menschen hereinzulassen, vorsichtig genug, um ein Muster zu bemerken. Nach der schlechten Runde hast du die Tür nicht zugeschlagen.",
      high: "Du hast von Anfang an großzügig geschickt und damit weitergemacht, auch nachdem Moos einmal alles behalten hat. Du gehst mit Vertrauen voran, und die meisten Menschen wachsen daran. Achte nur darauf, dass die, die es nicht tun, einen zweiten Blick bekommen, bevor sie eine dritte Chance kriegen.",
    },
    up: "Deine Antworten klingen zurückhaltender, als du gespielt hast: Du hast Moos viel anvertraut.",
    down: "Deine Antworten klingen offener, als du gespielt hast: Als Münzen auf dem Spiel standen, hast du dich zurückgehalten.",
    said: "Aus deinen Antworten zur Bindung (oder Verträglichkeit).",
  },
  fairness: {
    name: "Fairness", poles: ["Behält mehr", "Teilt gerecht"], word: { low: "selbstschützend", high: "fair" },
    text: {
      low: "Als du teilen durftest, hast du mehr als die Hälfte behalten. Vielleicht fühlte es sich wie ein Spiel an (war es auch), vielleicht hast du Moos als fremd gesehen. Es lohnt sich zu beobachten, ob du das bei echten Abmachungen auch tust und ob es dich Wohlwollen kostet.",
      mid: "Du hast geteilt, wenn auch nicht immer die Hälfte. Dir ist Fairness wichtig und auch, nicht ausgenutzt zu werden. Die meisten Menschen landen hier.",
      high: "Als du dran warst, hast du gerecht oder großzügiger geteilt, auch wenn du alles hättest behalten können. Fairness ist dir wichtig, auch wenn niemand zusieht, und genau darum wollen Menschen dich auf ihrer Seite.",
    },
    up: "Im Spiel hast du gerechter geteilt, als deine Antworten vermuten lassen.",
    down: "Deine Antworten klingen großzügiger, als du gespielt hast: Als die Münzen dir gehörten, hast du den größeren Teil behalten.",
    said: "Aus deinem Big Five Test: Verträglichkeit.",
  },
  detail: {
    name: "Gedächtnisstil", poles: ["Großes Bild", "Feine Details"], word: { low: "mit Blick fürs Ganze", high: "detailscharf" },
    text: {
      low: "Du hast die Gesamtform besser behalten als die kleinen Fakten. Du siehst zuerst das Muster: den Eindruck eines Raums, den Bogen einer Geschichte. Tu dich mit jemandem zusammen, der die Belege aufhebt, dann seid ihr ein großartiges Team.",
      mid: "Formen und Details kamen etwa gleich gut zurück. Du kannst herauszoomen, um das Muster zu sehen, und hineinzoomen, wenn es zählt, das macht dich zu einem flexiblen Lernmenschen.",
      high: "Farben, Positionen, das kleine Dreieck in der Ecke: Du hast sie behalten. Dein Gedächtnis liebt Einzelheiten. Gold wert für Arbeit, die Präzision braucht. Tritt ab und zu zurück und frag, was das ganze Bild sagt.",
    },
    up: "", down: "", said: "",
  },
  speed: {
    name: "Tempo", poles: ["Bedächtig", "Schnell"], word: { low: "bedächtig", high: "schnell" },
    text: {
      low: "Du hast dir Zeit genommen, bevor du geantwortet hast. Langsam und gründlich ist ein echter Stil: Du prüfst, bevor du dich festlegst. In schnellen Gesprächen ist es völlig in Ordnung zu sagen „Gib mir eine Sekunde“ und sie dir zu nehmen.",
      mid: "Du hast in ruhigem Tempo geantwortet, schnell, wenn du sicher warst, langsamer, wenn nicht. Ein gesundes Gleichgewicht zwischen Tempo und Sorgfalt.",
      high: "Du hast schnell und meist richtig geantwortet. Dein Kopf kommt schnell vom Sehen zum Entscheiden. Andere brauchen vielleicht einen Moment länger, also lass etwas Raum, bevor du die Stille füllst.",
    },
    up: "", down: "", said: "",
  },
  lead: {
    name: "Führung", poles: ["Folgt", "Übernimmt"], word: { low: "entspannt", high: "geborene Führungskraft" },
    text: {
      low: "Du hast die anderen zuerst reden lassen und selten die Entscheidung an dich gerissen. Du lässt die Gruppe gern ihren Weg finden, und darum ist es leicht mit dir. Wenn du eine starke Vorliebe hast, lohnt es sich, sie früher laut zu sagen.",
      mid: "Mal hast du zuerst abgestimmt, mal gewartet. Du führst, wenn dir das Ergebnis wichtig ist, und trittst zurück, wenn nicht. Eine flexible Art, in einer Gruppe zu sein.",
      high: "Du hast vor den anderen abgestimmt und übernommen, als die Gruppe feststeckte. Man kann sich darauf verlassen, dass du Dinge in Gang bringst. Lass auch den Leiseren Raum zu reden; ihre Ideen sind oft genau die, die dir gefallen hätten.",
    },
    up: "Deine Antworten klingen zurückhaltender, als du gespielt hast: In der Gruppe hast du dich zuerst geäußert und entschieden.",
    down: "Deine Antworten klingen geselliger, als du gespielt hast: In der Gruppe hast du andere entscheiden lassen.",
    said: "Aus deinem Big Five Test: Extraversion.",
  },
  conform: {
    name: "Gruppensog", poles: ["Unabhängig", "Geht mit der Gruppe"], word: { low: "unabhängig", high: "im Einklang mit der Gruppe" },
    text: {
      low: "Als die ganze Gruppe die falsche Linie gewählt hat, hast du deinen eigenen Augen vertraut. Du hältst deine Sicht auch unter sozialem Druck. Das ist wertvoll, besonders wenn der Raum gerade einen Fehler machen will.",
      mid: "Mal bist du deinen Augen gefolgt, mal der Gruppe. Das ist ehrlich: In Solomon Aschs klassischen Linienstudien gehen die meisten mindestens einmal mit. Du spürst den Sog und gibst ihm nicht immer nach.",
      high: "Wenn alle anderen eine Linie gewählt haben, hast du sie oft auch gewählt, selbst wenn deine Augen etwas anderes sagten. Du schätzt Harmonie und liest den Raum. Probier das: Wenn du das nächste Mal anderer Meinung bist, sag es einmal, freundlich, und schau, was passiert.",
    },
    up: "Deine Antworten klingen unabhängiger, als du gespielt hast: Du bist der falschen Antwort der Gruppe gefolgt.",
    down: "Deine Antworten klingen angepasster, als du gespielt hast: Du bist gegen die ganze Gruppe bei deinen eigenen Augen geblieben.",
    said: "Aus deinem Big Five Test: Offenheit und wie geplant du bist.",
  },
  patience: {
    name: "Geduld", poles: ["Jetzt", "Das Warten wert"], word: { low: "im Moment", high: "geduldig" },
    text: {
      low: "Du hast in den meisten Runden den kleinen Gewinn sofort genommen. Lieber den Spatz in der Hand: Du magst Ergebnisse, die du festhalten kannst. Das macht dich schnell im Handeln und leicht zufriedenzustellen. Wenn etwas Großes auf dem Tisch liegt, zähl bis zehn, bevor du das Sichere schnappst.",
      mid: "Du hast gewartet, wenn sich der Gewinn lohnte, und das Schnelle genommen, wenn nicht. Du rechnest im Kopf, Runde für Runde. Eine vernünftige Art, deine Zeit einzusetzen.",
      high: "Du hast auf die größere Laterne gewartet, auch bei langen Wartezeiten. Aufschub schreckt dich nicht, wenn der Lohn klar ist, und das ist der stille Motor hinter Ersparnissen, Training und langen Projekten. Achte nur darauf, dass das Warten deine Wahl ist, nicht eine Gewohnheit.",
    },
    up: "Deine Antworten klingen impulsiver, als du gespielt hast: Du hast auf den größeren Gewinn gewartet.",
    down: "Deine Antworten klingen geduldiger, als du gespielt hast: Als der Timer lief, hast du das Sichere geschnappt.",
    said: "Aus deinem Big Five Test: wie geplant du bist.",
  },
  control: {
    name: "Fokus", poles: ["Schneller Finger", "Ruhige Hand"], word: { low: "schnell am Abzug", high: "mit ruhiger Hand" },
    text: {
      low: "Dein Daumen war schneller als deine Bremse: Du hast die Sterne erwischt und auch ein paar Monde. Tempo ist eine Gabe, und dein erster Schritt kommt oft vor deinem zweiten Gedanken. Bau bei großen Entscheidungen bewusst eine Pause ein.",
      mid: "Du hast die meisten Sterne erwischt und die meisten Monde vorbeigelassen. Ab und zu hat dich der Rhythmus zu einem Tippen verleitet, das du nicht wolltest. Völlig normal und ein Zeichen, dass deine Bremse funktioniert, wenn du sie brauchst.",
      high: "Du hast die Sterne angetippt und bei den Monden stillgehalten, immer wieder. Deine Bremse ist gut: Du kannst eine Gewohnheit mitten im Ablauf stoppen. Das hält dich auch in hitzigen Gesprächen ruhig. Spontan sein darfst du trotzdem.",
    },
    up: "Deine Antworten klingen impulsiver, als du gespielt hast: Deine Bremse hat fast jedes Mal gehalten.",
    down: "Deine Antworten klingen beherrschter, als du gespielt hast: Der Rhythmus hat dich zu Tippern verleitet, die du nicht wolltest.",
    said: "Aus deinem Big Five Test: wie geplant du bist.",
  },
};

const games: Record<PlayGameId, { name: string; tagline: string; intro: string; how: string[]; measures: string; secs: number }> = {
  bridge: {
    name: "Die Brücke", tagline: "Überquere die Schlucht. Wähl deine Brücke. Manche brechen.", secs: 75,
    intro: "Acht Überquerungen. Stein ist sicher und klein. Seil wackelt ein bisschen. Glas bringt am meisten und bricht manchmal. Sammle so viele Sterne, wie du willst; es gibt keine falsche Art zu spielen.",
    how: ["Tippe auf eine Brücke, um sie zu überqueren", "Stürzen gehört zum Spiel", "Nach einem Sturz kannst du jederzeit ausruhen und das Spiel beenden"],
    measures: "Wie viel Risiko du eingehst und wie du dich direkt nach einem Sturz verhältst.",
  },
  faces: {
    name: "Gefühlsraum", tagline: "Fang ein Gefühl in einer halben Sekunde.", secs: 90,
    intro: "Ein Gesicht blitzt kurz auf, wie ein echter Ausdruck im Gespräch. Wähl das Gefühl, das du gesehen hast. Dann brauchen dich drei Freunde, und du entscheidest, wie du antwortest.",
    how: ["Schau auf das Gesicht, es verschwindet schnell", "Wähl, was du gesehen hast", "Antworte den Freunden so, wie du es wirklich tun würdest"],
    measures: "Wie gut du Gesichter liest und wie du jemandem begegnest, dem es schlecht geht.",
  },
  trust: {
    name: "Teilen", tagline: "Teile Münzen mit Moos. Moos entscheidet, was zurückkommt.", secs: 80,
    intro: "Was du Moos schickst, verdreifacht sich. Moos schickt dann etwas zurück. Manchmal tauschen sich die Rollen, und du entscheidest, was du zurückgibst. Echte Münzen, ausgedachter Einsatz.",
    how: ["Wähl, wie viele Münzen du schickst", "Schau, was Moos macht", "Deine Wahl, jede Runde"],
    measures: "Wie sehr du vertraust, wie du auf Enttäuschung reagierst und wie fair du teilst.",
  },
  memory: {
    name: "Blitz", tagline: "Sieh es eine Sekunde lang. Dann sag uns, was es war.", secs: 70,
    intro: "Zehn schnelle Blitze. Manche wollen, dass du dir eine Form merkst, manche fragen nach einem winzigen Detail. Antworte so schnell du kannst, ohne wild zu raten.",
    how: ["Schau auf den Blitz", "Beantworte die Frage", "Tempo zählt ein bisschen, Genauigkeit mehr"],
    measures: "Ob du dir das große Muster oder das kleine Detail merkst und wie schnell du verarbeitest.",
  },
  lead: {
    name: "Die Gruppe", tagline: "Drei Freunde, sieben Entscheidungen. Führst du oder folgst du?", secs: 70,
    intro: "Ava, Teo und Lina entscheiden gemeinsam mit dir. Stimm ab, wann du willst: vor ihnen, nach ihnen oder erst, wenn du alle gesehen hast.",
    how: ["Ihre Stimmen erscheinen nacheinander", "Tippe jederzeit auf deine Antwort", "Manche Fragen haben eine richtige Antwort"],
    measures: "Wann du dich äußerst und wie stark die Wahl der Gruppe an deiner zieht.",
  },
  wait: {
    name: "Die Laterne", tagline: "Ein kleines Licht jetzt oder ein größeres, wenn du wartest.", secs: 70,
    intro: "Sechs Laternen. Jedes Mal wählst du: ein paar Sterne sofort oder warten, bis die Laterne voll ist, und mehr bekommen. Während du wartest, kannst du es dir anders überlegen und den kleinen Gewinn nehmen.",
    how: ["Tippe auf Jetzt oder Warten", "Während sie sich füllt, kannst du noch den kleinen nehmen", "Es gibt keine richtige Antwort, nur deine"],
    measures: "Wie leicht du auf eine größere Belohnung wartest, wenn eine kleinere direkt vor dir liegt.",
  },
  focus: {
    name: "Sternenfang", tagline: "Tippe auf die Sterne. Nie auf den Mond.", secs: 40,
    intro: "Sterne und Monde blitzen in schnellem Rhythmus auf. Tippe so schnell du kannst auf jeden goldenen Stern. Wenn ein roter Mond erscheint, halt den Daumen still.",
    how: ["Goldener Stern: tippen", "Roter Mond: nicht tippen", "Es ist absichtlich schnell"],
    measures: "Wie gut du eine schnelle Gewohnheit mittendrin stoppen kannst: Fokus und Impulskontrolle.",
  },
};

const emotions: Record<Emotion, string> = { joy: "Freude", sadness: "Traurigkeit", anger: "Wut", fear: "Angst", surprise: "Überraschung", disgust: "Ekel", contempt: "Verachtung", calm: "Ruhe" };

const scenes: { who: string; says: string; moves: Record<CareMove, string> }[] = [
  { who: "Sam", says: "Ich hab den Job nicht bekommen. Ich war mir echt sicher.", moves: { fix: "Lass uns deinen Lebenslauf aufpolieren und heute Abend noch drei Bewerbungen schicken.", name: "Oh nein. Das ist niederschmetternd, nachdem du dir solche Hoffnungen gemacht hast.", distract: "Vergiss es, lass uns ausgehen und Spaß haben!", leave: "So was passiert. Du findest schon was.", stay: "Ich bin da. Willst du darüber reden?" } },
  { who: "Nora", says: "Meine Mama ist schon wieder im Krankenhaus.", moves: { stay: "Ich komm vorbei. Du musst nicht reden.", fix: "Hast du nach einer zweiten Meinung gefragt?", leave: "Bestimmt wird alles gut, mach dir keine Sorgen.", distract: "Willst du was schauen, um auf andere Gedanken zu kommen?", name: "" } },
  { who: "Leo", says: "Alle haben meinen Geburtstag vergessen.", moves: { distract: "Lass uns sofort Kuchen holen, ich lad dich ein!", leave: "Geburtstage werden eh überbewertet.", name: "Das tut echt weh. Sich vergessen zu fühlen schmerzt.", fix: "Schreib eine Erinnerung in den Gruppenchat.", stay: "" } },
];

export const play: PlayContent = {
  meta: { title: "Spielspiegel", description: "Sieben schnelle Minispiele, die zeigen, wie du wirklich spielst: Risiko, Vertrauen, Gesichter, Gedächtnis, Führung, Geduld und Fokus. Verhalten statt Selbstauskunft." },
  brand: "Spielspiegel",
  hub: {
    eyebrow: "Spielspiegel", titleA: "Wie du ", titleB: "wirklich spielst",
    sub: "Fragebögen zeigen, wie du dich selbst siehst. Diese sieben Minispiele beobachten, was du tust: deine Entscheidungen, dein Timing, was nach einem Sturz passiert. Insgesamt etwa neun Minuten.",
    honest: "Ein Verhaltenssignal aus ein paar Minuten Spiel, keine Diagnose. Müde, abgelenkt oder einfach nur Spaß dabei? Das zeigt sich alles, also spiel ein Spiel nochmal, wann immer du willst.",
    progress: (n: number) => `${n} von 7 gespielt`,
    short: "Sieben schnelle Spiele, die zeigen, wie du wirklich handelst.",
    play: "Spielen", replay: "Nochmal spielen", secs: (s: number) => `etwa ${Math.round(s / 10) * 10} Sek.`,
    resultTitle: "Wie du wirklich spielst", resultEmpty: "Spiel dein erstes Spiel, dann füllt sich deine Karte.",
    playNext: "Nächstes Spiel spielen", allDone: "Alle sieben gespielt. Das ist deine ganze Karte.",
    compare: "Mit jemandem vergleichen", compareText: "Wenn jemand anderes auf deinem Handy spielt (oder auf dem eigenen, mit gemeinsamem Profil), erscheint der Spielblick in eurer Kompatibilität.",
    forOther: (n: string) => `Du spielst für ${n}`, needProfile: "Leg zuerst dein Profil an, damit deine Ergebnisse einen Platz haben.", start: "Los",
    behaviours: "Was uns aufgefallen ist", sayPlay: "Was du sagst und wie du spielst", sayPlayIntro: "Deine Antworten aus den Fragebögen neben dem, was du in den Spielen getan hast.",
    sayPlayNone: "Mach den Big Five Test, dann zeigt dieser Teil, wo dein Selbstbild und dein Spiel übereinstimmen oder auseinandergehen.", takeBigFive: "Big Five Test machen",
    matches: (list: string) => `Dein Spiel passt zu dem, was du sagst über: ${list}.`, saidLabel: "du sagst", playedLabel: "du spielst",
    gameTitle: "Spiele", detail: "Mehr lesen", flags: { erratic: "Wir haben ein paar sehr schnelle Tippserien gesehen. Wenn du gestresst oder in Eile warst, sind die Werte vielleicht etwas ungenau.", quit: "Du hast nach einem Sturz ausgeruht. Das ist eine gültige Wahl, und sie zeigt sich bei der Rückfederung.", rushed: "Du hast sehr schnell geantwortet. Wenn du nur durchgetippt hast, spiel nochmal für ein genaueres Bild." } as Record<PlayFlag, string>,
    share: "Karte teilen", backHub: "Alle Spiele", levels: { low: "niedrig", mid: "mittel", high: "hoch" },
    headline: (w: string[]) => (w.length ? w.map((x, i) => (i === 0 ? x[0].toUpperCase() + x.slice(1) : x)).join(", ") : "Rundum ausgewogen"),
    reduced: "Reduzierte Bewegung ist an, darum nutzen die Spiele sanfte Übergänge statt großer Bewegungen.",
  },
  games, dims, emotions, scenes,
  ui: {
    begin: "Los geht’s", next: "Weiter", done: "Mein Ergebnis zeigen", round: (i: number, n: number) => `${i} / ${n}`, stars: "Sterne", ready: "Ich bin bereit",
    bridge: { names: ["Steinweg", "Seilbrücke", "Glasbrücke"], hints: ["sicher", "wackelig", "kann brechen"], pick: "Wähl eine Brücke", made: "Geschafft!", broke: ["", "Das Seil ist gerissen!", "Knack! Das Glas hat nachgegeben."], gust: "Ein Windstoß hat dich runtergeweht!", again: "Du bist wieder auf der Klippe. Wähl deine nächste Brücke.", rest: "Hier ausruhen und das Spiel beenden" },
    faces: { watch: "Schau auf das Gesicht", what: "Was hast du gesehen?", scene: "Jemand schreibt dir:", how: "Wie antwortest du?" },
    trust: { moss: "Moos", have: (n: number) => `Du hast ${n} Münzen`, send: "Schicken", sendQ: "Wie viele schickst du Moos? Unterwegs verdreifachen sie sich.", got: (sent: number, back: number) => `Du hast ${sent} geschickt. Moos hat ${sent * 3} bekommen und ${back} zurückgeschickt.`, kept: (sent: number) => `Du hast ${sent} geschickt. Moos hat alle ${sent * 3} behalten.`, backQ: (pot: number) => `Moos hat dir 4 Münzen geschickt. Sie haben sich auf ${pot} verdreifacht. Wie viele schickst du zurück?`, splitQ: (pot: number) => `Du hast ${pot} Münzen auf dem Weg gefunden. Moos steht direkt daneben. Wie viele teilst du?`, thanks: "Moos lächelt.", total: "Deine Münzen", none: "Nichts zu schicken? Auch das ist eine Wahl." },
    memory: { shape: "Merk dir die Form", details: "Merk dir die Details", whichShape: "Welches Muster hast du gesehen?", colourOf: (s: string) => `Welche Farbe hatte ${s}?`, shapes: { circle: "der Kreis", triangle: "das Dreieck", square: "das Quadrat", star: "der Stern" }, colours: { gold: "Gold", rose: "Rosa", aqua: "Türkis", violet: "Violett" } },
    wait: { now: (n: number) => `${n} jetzt nehmen`, wait: (n: number) => `Auf ${n} warten`, filling: "Die Laterne füllt sich …", grab: (n: number) => `Doch ${n} nehmen`, got: (n: number) => `+${n} Sterne`, round: "Laterne", pick: "Klein jetzt oder größer später?", secs: (s: number) => `${s} Sek.` },
    focus: { ready: "Goldener Stern: tippen. Roter Mond: stillhalten.", go: "Tippen!", hold: "Halt", start: "Start", tapZone: "Hier tippen", caught: "Gefangen", oops: "Mond!" },
    lead: { friends: ["Ava", "Teo", "Lina"], taste: [{ q: "Filmabend. Was schauen wir?", o: ["Komödie", "Thriller", "Doku"] }, { q: "Wochenendausflug. Wohin?", o: ["Berge", "Meer", "Stadt"] }, { q: "Abendessen heute?", o: ["Pizza", "Sushi", "Tacos"] }], line: "Welche Linie ist genauso lang wie die erste?", stuck: "Niemand kann sich für ein Café entscheiden. Alle schauen sich an.", stuckOpts: ["Jemand anderes soll wählen", "Ich entscheide"], volunteer: "Teo: Na gut, ich wähle.", you: "Du", waiting: "…" },
  },
  result: { eyebrow: "Dein Ergebnis", nextGame: "Nächstes Spiel", hub: "Deine ganze Karte ansehen", again: "Nochmal spielen" },
  pair: {
    title: "Wie ihr beide spielt", noteIntro: "Aus den Minispielen:", none: "Spielt jeder ein paar Spiele, um das zu sehen.",
    notes: {
      bothTrust: "Ihr vertraut beide offen. Das gibt der Verbindung einen ruhigen Boden.",
      trustGap: "Einer von euch verschenkt Vertrauen früh, der andere wartet auf Beweise. Sprecht es aus, damit es sich nicht persönlich anfühlt.",
      bothFair: "Ihr teilt beide fair, wenn ihr dran seid. Geld und Haushalt fühlen sich meist ausgeglichen an.",
      fairGap: "Ihr teilt unterschiedlich. Klärt früh, was „fair“ für euch zwei bedeutet.",
      bothCare: "Ihr geht beide mit Gefühl voran, wenn jemand leidet. Schwere Tage sind zusammen weicher.",
      readGap: "Einer von euch liest Gesichter schnell, der andere braucht Worte. Sagt Dinge öfter laut, als es nötig scheint.",
      riskGap: "Einer von euch spielt kühn, der andere sicher. Toll fürs Gleichgewicht, anstrengend, wenn niemand das Tempo anpasst.",
      bothBold: "Ihr geht beide aufs Glas. Rechnet mit Abenteuern und behaltet ein Sicherheitsnetz zwischen euch.",
      bothBounce: "Ihr kommt beide nach einem Sturz schnell wieder hoch. Streit verfliegt schnell.",
      bothTender: "Rückschläge gehen euch beiden nach. Gebt euch nach einem schweren Moment Zeit, bevor ihr etwas entscheidet.",
      twoLeaders: "Ihr übernehmt beide gern die Führung. Lebendig und manchmal ein Tauziehen. Wechselt euch beim Entscheiden ab.",
      leadFollow: "Einer von euch übernimmt, der andere folgt gern. Entscheidungen fallen leicht.",
      tempoGap: "Unterschiedliches Tempo: Einer antwortet schnell, der andere denkt erst nach. Lasst dem Langsameren Raum.",
      patienceGap: "Einer von euch wartet auf den größeren Gewinn, der andere mag es sofort. Plant die großen Dinge gemeinsam und lasst Platz für kleine Freuden.",
      memoryMix: "Einer von euch sieht das große Bild, der andere behält die Details. Ein natürliches Team.",
    } as Record<string, string>,
  },
  timing: {
    title: "Wie sicher du warst", certainty: "Sicherheit",
    instant: (n: number, total: number) => `${n} von ${total} sofort beantwortet`,
    changed: (n: number) => (n === 1 ? "1 Meinungswechsel" : `${n} Meinungswechsel`),
    instantLead: "Diese hast du sofort beantwortet. Schnelle Antworten zeigen meist auf die klarsten Seiten von dir:",
    slowLead: "Hier hast du am längsten gezögert. Grauzonen sind normal und oft das Spannendste:",
    careless: "Du bist sehr schnell hindurchgegangen. Wenn du nur getippt hast, um ans Ende zu kommen, mach es später nochmal für ein genaueres Bild.",
    note: "Auf diesem Gerät gemessen, während du geantwortet hast; nur zusammen mit deinen Ergebnissen gespeichert.",
    levels: { low: "viele Grauzonen", mid: "ziemlich sicher", high: "sehr sicher" },
  },
  share: { eyebrow: "Spielspiegel", sub: "Wie ich wirklich spiele", footer: "horoscop.si · spiel die Spiele" },
  book: { title: "Wie du spielst", kicker: "Was deine Entscheidungen im Spielspiegel gezeigt haben", lead: "Fragebögen zeigen, wie du dich selbst siehst. Die Minispiele haben beobachtet, was du getan hast. Hier ist, was ihnen aufgefallen ist.", none: "Spiel ein paar Spiele im Spielspiegel, dann füllt sich dieses Kapitel mit dem, was dein Verhalten zeigt.", gapTitle: "Sagen und Spielen" },
};
