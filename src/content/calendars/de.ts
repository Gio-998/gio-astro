import type { CalendarCopy } from "./types";

export const de: CalendarCopy = {
  dayShort: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"], and: "und",
  signIn: { aries: "im Widder", taurus: "im Stier", gemini: "in den Zwillingen", cancer: "im Krebs", leo: "im Löwen", virgo: "in der Jungfrau", libra: "in der Waage", scorpio: "im Skorpion", sagittarius: "im Schützen", capricorn: "im Steinbock", aquarius: "im Wassermann", pisces: "in den Fischen" },
  signTo: { aries: "in den Widder", taurus: "in den Stier", gemini: "in die Zwillinge", cancer: "in den Krebs", leo: "in den Löwen", virgo: "in die Jungfrau", libra: "in die Waage", scorpio: "in den Skorpion", sagittarius: "in den Schützen", capricorn: "in den Steinbock", aquarius: "in den Wassermann", pisces: "in die Fische" },
  quarter: { new: "Neumond", "first-quarter": "Erstes Viertel", full: "Vollmond", "last-quarter": "Letztes Viertel" },
  eclipse: { "solar-total": "totale Sonnenfinsternis", "solar-annular": "ringförmige Sonnenfinsternis", "solar-partial": "partielle Sonnenfinsternis", "lunar-total": "totale Mondfinsternis", "lunar-partial": "partielle Mondfinsternis", "lunar-penumbral": "Halbschatten-Mondfinsternis" },
  span: (d, h) => `${d} Tage und ${h} Stunde${h === 1 ? "" : "n"}`,
  pct: (n) => `${n} %`,
  times: (n) => ["", "einmal", "zweimal", "dreimal", "viermal"][n] ?? `${n}-mal`,
  when: (date, time, signIn) => `${date} um ${time} Uhr ${signIn}`,
  links: { daily: "Tageshoroskop", dailySub: "Dein Zeichen heute", monthly: "Monatshoroskop", moonSign: "Mondzeichen berechnen", rising: "Aszendent berechnen", zodiacOf: (n) => `Sternzeichen ${n}`, horoscopeOf: (n) => `Tageshoroskop ${n}`, moonYear: (y) => `Mondkalender ${y}`, mercuryYear: (y) => `Merkur rückläufig ${y}` },

  moon: {
    crumb: "Mondkalender",
    hub: {
      h1: "Mondkalender: die Mondphase heute und was als Nächstes kommt",
      title: "Mondkalender: aktuelle Mondphase, Vollmond, Neumond",
      description: "Die Mondphase heute, der nächste Vollmond und Neumond mit Uhrzeit und Sternzeichen, dazu ein Mondkalender für jeden Monat bis Dezember 2027.",
      blocks: [
        { id: "phases", title: "Die acht Mondphasen, einfach erklärt", paras: ["Der Mond leuchtet nicht selbst. Im Lauf des Monats ändert sich nur, wie viel von seiner sonnenbeschienenen Hälfte wir sehen. Die vier Hauptphasen lassen sich auf die Minute berechnen, die vier dazwischen sind Abschnitte von mehreren Tagen."], list: [
          "Neumond: Der Mond steht zwischen Erde und Sonne und bleibt unsichtbar. Ein stiller Moment, um dir eine Sache vorzunehmen.",
          "Zunehmende Sichel: eine schmale Linie am Abendhimmel. Jetzt zählen die ersten kleinen Schritte.",
          "Erstes Viertel: zunehmender Halbmond. Oft der Punkt, an dem ein Plan auf sein erstes Problem trifft.",
          "Zunehmender Mond: mehr als halb voll und wachsend. Gut, um Begonnenes nachzujustieren.",
          "Vollmond: Die Erde steht zwischen Sonne und Mond, die ganze uns zugewandte Seite ist hell. Vieles wirkt klarer oder wenigstens lauter.",
          "Abnehmender Mond: Das Licht geht langsam zurück. Eine gute Zeit, Gelerntes weiterzugeben.",
          "Letztes Viertel: abnehmender Halbmond. Die Frage lautet, was du ablegen kannst.",
          "Abnehmende Sichel: eine feine Linie vor Sonnenaufgang. Ausruhen, aufräumen, Platz lassen.",
        ] },
        { id: "sign", title: "Was das Mondzeichen dazugibt", paras: [
          "Dein Sternzeichen zeigt, wo die Sonne an deinem Geburtstag stand. Der Mond ist viel schneller: Er läuft in gut 27 Tagen einmal durch den Tierkreis und bleibt rund zweieinhalb Tage in jedem Zeichen. Deshalb wechseln die Einträge in den Monatstabellen so oft.",
          "Ein Neumond fällt immer in das Zeichen, in dem auch die Sonne steht, denn beide stehen dann in einer Linie. Ein Vollmond fällt ins gegenüberliegende Zeichen. Jeder Vollmond verbindet also zwei Themen, etwa Stier und Skorpion oder Zwillinge und Schütze. Darum lesen wir auf den Monatsseiten jede Mondphase für ihr eigenes Zeichen.",
        ] },
        { id: "use", title: "So nutzt du einen Mondkalender zur Selbstreflexion", list: [
          "Schreib beim Neumond einen Satz auf: was du anfangen willst. Nur einen, dann behältst du ihn.",
          "Notier beim ersten Viertel, was dazwischengekommen ist. Dort steckt meist die eigentliche Arbeit.",
          "Lies den Satz beim Vollmond noch einmal. Was siehst du jetzt, was du vorher nicht gesehen hast?",
          "Streich beim letzten Viertel eine Sache, die dir nicht mehr hilft.",
          "Lies nach drei Runden alle Notizen am Stück. Muster fallen erst dann auf.",
        ] },
        { id: "method", title: "Woher die Termine kommen", paras: [
          "Jedes Datum und jede Uhrzeit hier ist berechnet und nirgends abgeschrieben. Wir nutzen die Bibliothek astronomy-engine, denselben Code wie für unser Tageshoroskop, und ein Test rechnet jeden Termin ein zweites Mal nach. Die Zeiten gelten für Berlin, Wien, Zürich und Skopje, also für die mitteleuropäische Zeit.",
          "Ein Mondkalender sagt dir, wo der Mond steht. Was passieren wird, kann er nicht wissen, und einem, der das behauptet, würden wir auch nicht trauen. Manche Kalender bewerten Tage fürs Haareschneiden oder Säen. Das lassen wir weg, weil wir es nicht belegen können. Du bekommst von uns einen genauen Himmel und eine gute Frage dazu.",
        ] },
      ],
      faq: [
        ["Wie lange dauert ein Mondzyklus?", "Etwa 29,5 Tage von Neumond zu Neumond. Die genaue Länge schwankt um mehrere Stunden, weil die Mondbahn kein perfekter Kreis ist. Auf jeder Monatsseite steht die echte Dauer des Zyklus, der dort beginnt."],
        ["Warum zeigen andere Kalender eine etwas andere Uhrzeit?", "Meist liegt es an der Zeitzone oder am Runden auf die Minute. Wir rechnen in mitteleuropäischer Zeit: im Winter MEZ, also UTC+1, im Sommer MESZ, also UTC+2."],
        ["Warum ist das Mondzeichen ein anderes als mein Sternzeichen?", "Beides misst etwas anderes. Dein Sternzeichen ist der Stand der Sonne bei deiner Geburt, der Mond dagegen wechselt alle zwei bis drei Tage das Zeichen. Wo der Mond bei deiner Geburt stand, zeigt dir der Mondzeichen-Rechner."],
        ["Beeinflusst der Vollmond Schlaf und Stimmung?", "Viele sagen das von sich, versprechen können wir es weder in die eine noch in die andere Richtung. Wenn es dich interessiert, schreib drei Zyklen lang kurz auf, wie du schläfst, und schau dir dein eigenes Muster an."],
      ],
    },
    today: (date, phase, n, signIn) => `Heute, ${date}: ${phase}, zu ${n} % beleuchtet, der Mond steht ${signIn}.`,
    todayLabel: "Heute", nowTitle: "Der Mond heute und die nächsten Phasen", monthsTitle: "Mondkalender nach Monaten",
    head: { phase: "Phase", date: "Datum", time: "Uhrzeit", sign: "Zeichen", day: "Tag", moon: "Mond", moonSign: "Mondzeichen", horoscope: "Horoskop", month: "Monat", newMoon: "Neumond", fullMoon: "Vollmond", note: "Hinweis" },
    faqNext: { qFull: "Wann ist der nächste Vollmond?", qNew: "Wann ist der nächste Neumond?", a: (when) => `Am ${when}. Diese Seite wird jede Nacht aktualisiert, die Antwort bleibt also aktuell.` },
    zone: { winter: "Zeiten in MEZ (UTC+1), gültig für Berlin, Wien, Zürich und Skopje.", summer: "Zeiten in MESZ (UTC+2), gültig für Berlin, Wien, Zürich und Skopje.", change: (d) => `Zeiten für Berlin, Wien, Zürich und Skopje. Am ${d} werden die Uhren umgestellt.` },
    month: {
      h1: (m, y) => `Mondkalender ${m} ${y}`,
      title: (m, y) => `Mondkalender ${m} ${y}: Vollmond und Neumond`,
      description: ({ newMoon, full, m, y }) => `Neumond am ${newMoon}, Vollmond am ${full}. Alle Phasen im ${m} ${y} mit Uhrzeit und Mondzeichen für jeden Tag.`,
      lead: ({ newMoons, fulls, m, y }) => `${m} ${y}: Neumond am ${newMoons}, Vollmond am ${fulls}.`,
      phasesTitle: (m, y) => `Mondphasen im ${m} ${y}`, factsTitle: (m, y) => `Der Himmel im ${m} ${y}`, daysTitle: (m, y) => `Der Mond Tag für Tag im ${m} ${y}`,
      lunationTitle: (q, signIn, date) => `${q} ${signIn}, ${date}`,
      daysCaption: "Die Uhrzeit zeigt den Zeichenwechsel des Mondes. Der Link öffnet das Tageshoroskop des Zeichens, in dem der Mond mittags steht. Noch nicht erschienene Tage führen zur aktuellen Seite des Zeichens.",
      cycle: (start, length, next) => `Der Mondzyklus ab dem ${start} dauert ${length}, bis zum nächsten Neumond am ${next}.`,
      sun: (date, signTo) => `Die Sonne wechselt am ${date} ${signTo}.`,
      changes: (m, y, n, from, to) => `Im ${m} ${y} wechselt der Mond ${n}-mal das Zeichen, er beginnt ${from} und endet ${to}.`,
      mercury: (m, y, from, to) => `Merkur ist vom ${from} bis zum ${to} rückläufig, das betrifft auch den ${m} ${y}.`,
      eclipse: (q, date, e) => `Der ${q} vom ${date} fällt mit einer Finsternis zusammen (${e}), die nur in Teilen der Erde zu sehen ist.`,
      qFull: (m, y) => `Wann ist Vollmond im ${m} ${y}?`, qNew: (m, y) => `Wann ist Neumond im ${m} ${y}?`, qHalf: (m, y) => `Wann ist Halbmond im ${m} ${y}?`,
      aFull: (m, y, list) => `Der Vollmond im ${m} ${y} fällt auf ${list}.`, aNew: (m, y, list) => `Der Neumond im ${m} ${y} fällt auf ${list}.`,
      aHalf: (first, last) => `Zunehmender Halbmond (erstes Viertel): ${first}. Abnehmender Halbmond (letztes Viertel): ${last}.`,
    },
    plural: { new: "Neumonde", full: "Vollmonde" },
    twoInMonth: (p, m, y, dates) => `Der ${m} ${y} hat zwei ${p}: am ${dates}.`,
    year: {
      h1: (y) => `Mondkalender ${y}: alle Vollmonde und Neumonde`,
      title: (y) => `Mondkalender ${y}: Vollmond und Neumond, alle Termine`,
      description: (y, f, n) => `Alle ${f} Vollmonde und ${n} Neumonde ${y} mit Datum, Uhrzeit und Sternzeichen, dazu die Finsternisse des Jahres. Übersichtlich in zwei Tabellen.`,
      lead: (y, f, n) => `${y} bringt ${f} Vollmonde und ${n} Neumonde, hier alle der Reihe nach und jeweils mit Sternzeichen.`,
      aboutTitle: (y) => `Das Mondjahr ${y}`, fullTitle: (y) => `Vollmond ${y}: alle Termine`, newTitle: (y) => `Neumond ${y}: alle Termine`, eclipseTitle: (y) => `Finsternisse ${y}`,
      intro: {
        2026: ["Hier findest du jeden Vollmond und Neumond des Jahres 2026 mit Datum, Uhrzeit und Sternzeichen. Die letzten beiden Monate haben eigene Seiten mit allen vier Phasen, dem Mondzeichen für jeden Tag und einem Gedanken zu jeder Mondphase. Die früheren Termine bleiben für deine Unterlagen oder einen Blick zurück stehen.", "Zurückschauen lohnt sich beim Mondkalender besonders. Such dir einen Vollmond vom Jahresanfang heraus und schau in deine Notizen oder Fotos aus dieser Woche. Oft staunt man, worüber man sich damals Sorgen gemacht hat und wie viel davon längst weg ist."],
        2027: ["Das ganze Jahr 2027 auf einen Blick. Jedes Datum führt zu seiner Monatsseite mit allen vier Phasen, dem Mondzeichen Tag für Tag und einem Text, der für das Zeichen der jeweiligen Mondphase geschrieben ist.", "Ein Jahr voller Mondphasen ergibt einen einfachen Planer. Markier dir die Neumonde für alles, was du anfangen willst, und die Vollmonde, um nachzusehen, was daraus geworden ist. Über zwölf Monate kannst du verfolgen, wie die Zeichen durch den Tierkreis wandern und welche Bereiche deines Lebens sie jeweils beleuchten."],
      },
      twice: (p, signIn, y, dates) => `Zwei ${p} stehen ${y} ${signIn}: am ${dates}.`,
      eclipseLine: (date, e, q, signIn) => `${date}: ${e} beim ${q} ${signIn}.`,
      tableCaption: "Zeiten für Berlin, Wien, Zürich und Skopje (MEZ oder MESZ). Ein Datum führt zur Monatsseite, wo es eine gibt.",
      qFull: (y) => `Wie viele Vollmonde gibt es ${y}?`, qNew: (y) => `Wie viele Neumonde gibt es ${y}?`, qEclipse: (y) => `Welche Finsternisse gibt es ${y}?`,
      aCount: (y, n, p, first, last) => `${y} hat ${n} ${p}. Der erste ist am ${first}, der letzte am ${last}.`,
      aEclipse: (list) => `Diese sind jeweils nur in Teilen der Erde zu sehen: ${list}.`,
    },
    reflect: {
      "last-quarter:leo": [
        "Der Mond im Löwen, die Sonne im Skorpion: Stolz und Verschlossenheit ziehen in verschiedene Richtungen. Denk an etwas, wofür du Beifall wolltest und nur Schweigen bekommen hast. Du darfst das ablegen, ohne so zu tun, als wäre es dir egal gewesen. Was würdest du auch dann noch tun, wenn niemand klatscht?",
        "Dieses Viertel fällt ans Ende des Löwen, wenn der Wunsch, gesehen zu werden, fast heruntergebrannt ist. Schau, wo du noch eine Rolle spielst: die gut gelaunte Nachricht in der Gruppe, der Witz über die eigene Müdigkeit. Lass diese Woche einen kleinen Auftritt weg und achte darauf, wer trotzdem bleibt.",
      ],
      "new:scorpio": [
        "Ein Neumond im Skorpion passt zu allem, was du nie posten würdest. Benenne eine Last, die du allein trägst: Schulden, einen alten Groll, die Angst um einen Menschen. Lösen musst du heute Abend nichts. Schreib es auf und darunter, was du dir wünschst, sobald es nicht mehr deinen Alltag bestimmt. Dieser kurze Satz, nur für dich, ist ein guter Anfang für den neuen Zyklus.",
        "Der frühe Skorpion fragt ohne Umschweife, was du eigentlich willst, und zwar ohne die höfliche Fassung. Such dir eine Stelle, an der du ständig sagst, es sei schon in Ordnung. Probier in den nächsten zwei Wochen die ehrliche Variante aus, bei einem Menschen, dem du vertraust. Nähe wächst meist über kleine Geständnisse. Fang klein an und lass dem anderen Zeit für die Antwort.",
      ],
      "first-quarter:aquarius": [
        "Der Wassermann-Mond steht im Quadrat zur Skorpion-Sonne: Kopf gegen Bauch. Was du beim Neumond begonnen hast, verlangt jetzt nach einer Entscheidung, und im Freundeskreis haben alle eine Meinung dazu. Hör sie dir an und prüf dann, wie dein Körper reagiert. Funktioniert ein Plan nur, wenn du ein Gefühl übergehst, ändere den Plan.",
        "Inzwischen ist der Mond im Wassermann angekommen und will frische Luft. Dreht sich eine private Sorge im Kreis, nimm sie mit nach draußen: ein Spaziergang mit einer Freundin, eine schlichte Frage an jemanden mit Abstand zur Sache. Lösen wird das nicht alles, aber der nächste Schritt wird sichtbar.",
      ],
      "full:gemini": [
        "Der Vollmond in den Zwillingen steht der Sonne im Schützen gegenüber: kleine Fakten treffen auf große Überzeugungen. Vielleicht passt eine Geschichte, die du über dein Leben erzählst, nicht mehr zu den Details. Schau dir deine Nachrichten dieses Monats an, den Streit, den du im Kopf immer wieder führst, das Gerücht, das du weitergegeben hast. Was wusstest du wirklich, und was hast du nur gern gesagt? Sprich eine wahre Sache aus und lass das Gespräch enden, ohne es gewinnen zu müssen.",
        "Dieser Zwillinge-Vollmond leuchtet mitten in den Trubel vor den Feiertagen: Listen, Gruppenchats, die Meinung der ganzen Verwandtschaft. Bevor du auf die nächste Nachricht antwortest, zähl nach, wie viele Fäden du gerade hältst und welche drei wirklich zählen. Vermutlich weißt du längst genug. Such dir das eine Gespräch aus, um das du herumschleichst, und führ es freundlich, das Handy im Nebenzimmer.",
      ],
      "last-quarter:virgo": [
        "Ein letztes Viertel in der Jungfrau ist ein guter Moment für ehrliches Kürzen. Geh deine Liste durch und streich alles, was nur draufsteht, weil es sich so gehört. Behalte das, was dir die kommende Woche leichter macht. Eine aufgeräumte Schublade beruhigt einen vollen Kopf oft mehr als ein großer Plan.",
        "Hier prüft der Mond die Maßstäbe, die du dir selbst setzt. Seit wann reicht gut nicht mehr? Nimm eine Aufgabe, die du immer wieder überarbeitest, und erkläre sie für fertig. Die gewonnene Zeit gehört dir, und den fehlenden Feinschliff wird wahrscheinlich niemand bemerken.",
      ],
      "new:sagittarius": [
        "Neumonde im Schützen wollen einen Horizont. Dafür braucht es kein Flugticket: Ein Kurs, eine Sprache, eine Frage, die dich seit Jahren beschäftigt, reichen völlig. Überleg, was du heute glaubst und vor fünf Jahren noch nicht geglaubt hast. Dann nimm dir einen kleinen Schritt in diese Richtung vor und mach ihn noch in dieser Woche.",
        "Unter diesem Neumond fällt auf, wo dein Leben zu klein geworden ist. Das kann ein Ablauf sein, ein Ort oder die Art, wie du dich selbst beschreibst. Schreib drei Ziele auf, die du ansteuern würdest, wenn Geld und Pflicht einen Tag lang schweigen. Meist steckt in einem davon ein Hinweis darauf, was dir fehlt. Dieser Hinweis reicht als Start für den neuen Zyklus.",
      ],
      "first-quarter:pisces": [
        "Der Mond in den Fischen steht im Quadrat zur Schütze-Sonne: große Pläne treffen auf ein müdes Herz. Lässt deine Begeisterung gerade etwas nach, hör erst hin, bevor du weiterdrückst. Manche Ziele brauchen Vertrauen, andere ein Nickerchen. Frag dich, was hier gerade gefragt ist.",
        "Gegen Jahresende verwischt ein erstes Viertel in den Fischen leicht die Grenze zwischen dem, was du willst, und dem, was alle um dich herum wollen. Nimm dir zehn stille Minuten und trenne beides auf einem Blatt Papier. Deine eigene Liste ist vielleicht kürzer. Das darf eine Erleichterung sein.",
      ],
      "full:cancer": [
        "Der Vollmond im Krebs steht der Steinbock-Sonne gegenüber, Zuhause und Pflicht schauen sich an. Wer hält hier eigentlich alles zusammen, und wer hat das bemerkt? Bist du es selbst, sag es. Ist es jemand anderes, bedank dich in klaren Worten. Schau auf den Tisch, an dem ihr esst, auf die Anrufe, die du aufschiebst, auf die Menschen, für die du alles stehen lassen würdest. Die Antwort auf die Frage, wohin du gehörst, sitzt oft genau dort.",
      ],
      "last-quarter:libra": [
        "Zum Jahresausklang lädt das letzte Viertel in der Waage zu einem fairen Blick auf deine Beziehungen ein. Welche waren ausgeglichen, bei welchen hast du innerlich mitgerechnet? Klären musst du jetzt nichts. Benenne eine Sache, die du im neuen Jahr anders verteilen willst, und lass den Rest bis Januar liegen.",
      ],
      "new:capricorn": [
        "Ein Neumond im Steinbock hat die klare, kalte Luft eines ersten Arbeitstags. Spar dir den großen Vorsatz. Such dir etwas aus, das du langsam aufbauen willst: eine Sparroutine, eine Fähigkeit, eine Grenze im Job. Wie sähe das in zwölf Monaten aus, wenn du ihm zehn Minuten am Tag gibst? Stetige, unspektakuläre Arbeit ist das, was dieses Zeichen achtet, und sie zahlt sich zuerst in Selbstachtung aus.",
        "Der letzte Neumond des Jahres fällt in den Steinbock und kann den Wunsch wecken, bis Freitag das ganze Leben zu prüfen. Versuch es mit einer kleineren Frage: Was hast du dieses Jahr getragen, das nie deine Aufgabe war? Gib eines davon zurück. Ein sauberer Anfang beginnt oft mit einer klaren Ansage, was du nicht mehr tust.",
      ],
      "first-quarter:aries": [
        "Der Widder-Mond reibt sich an der Steinbock-Sonne, Geduld und Ungeduld teilen sich ein Zimmer. Wirkt ein neues Ziel jetzt schon zäh, bist du genau richtig. Erledige heute eine Sache, ohne jemanden um Erlaubnis zu fragen, und kehr dann zum langen Plan zurück.",
      ],
      "full:leo": [
        "Unter dem Vollmond im Löwen, gegenüber der Wassermann-Sonne, treffen deine eigenen Wünsche auf die der Gruppe. Vielleicht willst du aufstehen und dich zeigen und fürchtest zugleich, zu viel zu sein. Schau, wo du dich kleiner machst, damit es für andere bequem bleibt. Und schau, wo du den Platz einnimmst, den jemand anderes bräuchte. Beides ist sehenswert. Tu etwas Großzügiges, unter das du auch deinen Namen setzt.",
      ],
      "last-quarter:scorpio": [
        "Der Mond im Skorpion fragt, woran du noch festhältst. Das letzte Viertel ist zum Loslassen da, und gerade dieses Zeichen tut sich damit schwer. Fang klein an: eine Nachricht, die du immer wieder liest, eine Rechnung, die du innerlich offen hältst. Lösch sie und spür nach, was das mit dir macht.",
      ],
      "new:aquarius": [
        "Ein Neumond im Wassermann eignet sich gut, um zu überdenken, mit wem du deine Stunden verbringst. Welche Gruppen bringen dich auf Ideen, welche bringen dir nur Pflichten? Schreib auf, was du an deinem Umfeld ändern würdest, wenn niemand beleidigt sein könnte. Vielleicht willst du irgendwo einsteigen oder dich höflich verabschieden. So oder so reicht für den Anfang eine einzige Nachricht.",
      ],
      "first-quarter:taurus": [
        "Der Stier-Mond steht im Quadrat zur Wassermann-Sonne, und dein Körper stimmt über deine Ideen mit ab. Ein Plan kann am Bildschirm großartig aussehen und sich an einem Dienstagmorgen falsch anfühlen. Frag dich, was er an Schlaf, Geld und Essen kostet. Ändere dann eine praktische Kleinigkeit, damit die Idee wirklich in deine Woche passt.",
      ],
      "full:virgo": [
        "Der Vollmond in der Jungfrau steht der Fische-Sonne gegenüber: die ordentliche Liste gegen das große Gefühl. Vielleicht reparierst du gerade Kleinigkeiten, um etwas Großem auszuweichen, oder du träumst, um etwas Kleinem auszuweichen. Betrachte deine Gewohnheiten, als gehörten sie einer Freundin. Was würdest du ihr behutsam sagen? Nimm dir eine Routine zum Reparieren und eine Sorge zum Loslassen vor, und halte beides auseinander.",
      ],
      "last-quarter:sagittarius": [
        "Ein letztes Viertel im Schützen zeigt manchmal, wie viel an deinem Plan reiner Optimismus war. Das ist kein Schaden. Behalte die Richtung und lass die Frist fallen, die du dir ausgedacht hast. Welches Versprechen könntest du leise neu verhandeln, zuerst mit dir selbst?",
      ],
      "new:pisces": [
        "Ein Neumond in den Fischen ist leise und leicht zu übersehen. Du musst dir kein Ziel setzen. Gönn dir eine langsame Stunde ohne Bildschirm und schau, was auftaucht: ein Lied, ein Name, eine alte Traurigkeit. Schreib es auf, ohne es zu erklären. Wenn hier etwas beginnen darf, dann vielleicht die Gewohnheit, dir selbst zuzuhören, bevor der Tag laut wird.",
      ],
      "first-quarter:gemini": [
        "Der Zwillinge-Mond steht im Quadrat zur Fische-Sonne: Gefühle treffen auf den Drang, sie zu erklären. Gut möglich, dass du diese Woche viel redest und wenig sagst. Schreib drei Sätze darüber auf, was du wirklich willst, und lies sie jemandem vor, der nichts daran reparieren will.",
      ],
      "full:libra": [
        "Der Vollmond in der Waage, gegenüber der Widder-Sonne, stellt das Ich neben das Wir. Dir fällt vielleicht auf, wie oft du allein entscheidest oder wie oft du darauf wartest, dass jemand anderes es tut. Nimm dir eine Beziehung vor und frag, worauf jeder von euch verzichtet hat. Gerecht heißt hier mehr als halbe-halbe. Sag in einem ruhigen Satz, was du brauchst, und frag dann nach dem, was der andere braucht.",
      ],
      "last-quarter:capricorn": [
        "Ein letztes Viertel im Steinbock geht nüchtern ans Aufhören heran. Such dir eine Verpflichtung, die mehr nimmt, als sie gibt. Lässt sie sich beenden, verkleinern oder abgeben? Erledige diese Woche den unangenehmen Papierkram, dann entsteht vielleicht etwas Luft.",
      ],
      "new:aries": [
        "Der Neumond im Widder ist das Nächste, was der Himmel an Startschuss zu bieten hat. Wartest du auf den richtigen Moment, frag dich, worauf genau. Such dir etwas, das du noch vor dem Mittagessen anfangen kannst: ein Anruf, eine Seite, eine Runde um den Block. Halte die Latte niedrig und den Anfang echt. Mut wächst meistens erst, wenn du dich bewegst.",
      ],
      "first-quarter:cancer": [
        "Der Krebs-Mond steht im Quadrat zur Widder-Sonne, dein Antrieb trifft auf dein Bedürfnis nach Sicherheit. Fühlt sich etwas Begonnenes gerade ungeschützt an, prüf, was du zum Weitermachen brauchst. Ein vertrautes Essen, ein Telefonat mit der Familie oder ein früher Abend zählen hier auch als Fortschritt.",
      ],
      "full:scorpio": [
        "Dieser Vollmond steht ganz am Anfang des Skorpions, gegenüber einer Sonne, die gerade erst in den Stier gewechselt ist. Was du besitzt, trifft auf das, was dich besitzt. Schau auf etwas, das du fest im Griff hältst: Geld, einen Menschen, eine Geschichte von früher. Was fürchtest du, wenn du nur um einen Finger lockerer lässt? Hergeben musst du nichts. Die Angst klar zu sehen ist die Aufgabe dieser Nacht.",
        "Einen Monat später steht der Vollmond erneut im Skorpion, diesmal in den letzten Graden, die Sonne ganz am Ende des Stiers. Was dir im April aufgefallen ist, wirkt jetzt vielleicht reif für einen Abschluss. Überleg, was sich seither verändert hat und was nur verschoben wurde. Will ein Kapitel zu Ende gehen, dann freundlich: ein ehrliches Gespräch, ein beglichenes Konto, ein Thema, das du nicht mehr aufwärmst.",
      ],
      "last-quarter:aquarius": [
        "Der Mond im Wassermann hebt dich ein Stück über die Woche. Was wirkt von dort oben überflüssig? Eine Gruppe, zu der du nur aus Gewohnheit gehst, eine Debatte, die dich nicht mehr interessiert. Tritt bei einer davon einen Schritt zurück und schau, ob es jemanden stört.",
      ],
      "new:taurus": [
        "Ein Neumond im Stier beginnt beim Körper und beim Kontostand. Was gibt dir echte Sicherheit, und was sieht nur danach aus? Geh durch deine Wohnung und such dir eine Sache aus, die dir wirklich Freude macht, und eine, die du nur aus schlechtem Gewissen behältst. Pflanz diese Woche etwas ein, koch etwas Langsames oder richte dir einen kleinen, langweiligen Dauerauftrag ein. Beständige Behaglichkeit ist ein gutes Ziel.",
      ],
      "first-quarter:leo": [
        "Der Löwe-Mond steht im Quadrat zur Stier-Sonne: Glänzen wollen trifft auf Bequem-bleiben-wollen. Muss sich für ein Projekt gerade jemand zeigen, dann bist du diese Woche dran. Stell es online, sing das Lied, sprich dein Gehalt an.",
      ],
      "last-quarter:pisces": [
        "Ein letztes Viertel in den Fischen wünscht sich weniger Lärm. Lass eine Pflicht liegen, ohne dich lang zu entschuldigen, und schenk die Zeit dem Ausruhen oder jemandem, der dich braucht. Tränen, Mittagsschlaf und lange Bäder zählen hier als sinnvoll, egal was dein Kalender dazu sagt.",
      ],
      "new:gemini": [
        "Ein Neumond in den Zwillingen liebt frische Ideen, und vor dem Frühstück hast du vielleicht schon fünf. Schreib alle auf und kreise die eine ein, die du morgen gern einer Freundin erklären würdest. Neugier braucht einen Landeplatz. Meld dich für den Kurs an, schick die erste Nachricht, stell die Frage, die dir zu einfach vorkommt. Folge im kommenden Monat diesem einen Faden und schau, wohin er führt.",
      ],
      "first-quarter:virgo": [
        "Der Jungfrau-Mond steht im Quadrat zur Zwillinge-Sonne, all die Ideen treffen auf den Terminkalender. Welche passt tatsächlich hinein? Gib ihr ein Datum und eine erste kleine Aufgabe. Die anderen laufen nicht weg, und eine kurze Liste kommt weiter als eine lange.",
      ],
      "full:sagittarius": [
        "Der Vollmond im Schützen steht der Sonne in den Zwillingen gegenüber: der weite Blick gegen das neueste Detail. Vielleicht hast du genug von Smalltalk und Hunger nach Sinn, oder du bist müde von großen Ideen und brauchst eine Tatsache. Geh nach Möglichkeit nach draußen und schau auf etwas weit Entferntes. Frag dich dann, welche Überzeugung dich dieses Jahr geführt hat und ob sie das noch verdient. Behalte den Teil, der dich freundlicher und mutiger macht.",
      ],
      "last-quarter:aries": [
        "Der Mond im Widder kann den Wunsch wecken, mit Getöse hinzuschmeißen. Halt kurz inne. Ein letztes Viertel verträgt einen sauberen Schnitt besser als einen großen Abgang. Benenne den Streit, mit dem du fertig bist, und beende deinen Teil davon ohne Ansprache.",
      ],
      "new:cancer": [
        "Ein Neumond im Krebs beginnt zu Hause, was auch immer das gerade für dich heißt. Schau, wen du anrufst, wenn etwas schiefgeht, und wer dich anruft. Such dir eine Möglichkeit, deinen Alltag oder dein Familienleben ein wenig sanfter zu machen: ein gemeinsames Essen, ein repariertes Regal, ein Gespräch, das mit der ehrlich gemeinten Frage nach dem Befinden anfängt. Fürsorge, die du einplanst, hält meist länger als die, die du nur fühlst.",
      ],
      "first-quarter:libra": [
        "Der Waage-Mond steht im Quadrat zur Krebs-Sonne: was du deinen Liebsten schuldest, gegen das, was du allen anderen schuldest. Hast du den Frieden zuletzt teuer erkauft, fällt dir das jetzt auf. Sag einmal, was du lieber möchtest, auch wenn es nur eine Kleinigkeit ist, und schau, was passiert.",
      ],
      "full:capricorn": [
        "Der Vollmond im Steinbock steht der Krebs-Sonne gegenüber und legt Arbeit und Zuhause auf dieselbe Waage. Vielleicht siehst du klar, was dein Ehrgeiz den Menschen abverlangt, die du liebst, und was deine Familienroutinen deinen Zielen abverlangen. Keine Seite muss verlieren. Schau ehrlich auf die letzten zwei Wochen: Wo sind deine Stunden hingegangen? Verschieb eine Stunde, für eine Woche, zu der Seite, die dich vermisst hat.",
      ],
      "last-quarter:taurus": [
        "Ein letztes Viertel im Stier fragt, welcher Besitz inzwischen dich besitzt. Das kann ein Schrank voller Vielleichts sein oder die Gewohnheit, Trost zu kaufen. Verschenke diese Woche eine Sache und schau, ob du sie vermisst.",
      ],
      "new:leo": [
        "Bei diesem Neumond im Löwen stehen Sonne und Mond so genau in einer Linie, dass eine Sonnenfinsternis über einen Teil der Erde zieht. Astronomie beiseite, das Zeichen stellt eine klare Frage: Was würdest du tun, wenn dir egal wäre, ob du dich blamierst? Mach etwas mit deinen eigenen Händen und schreib deinen Namen drauf. Zeig es einem Menschen. Freude, die du selbst erzeugst, trägt meist weiter als Lob, das du einsammelst.",
      ],
      "first-quarter:scorpio": [
        "Der Skorpion-Mond steht im Quadrat zur Löwe-Sonne: was du zeigst, gegen das, was du versteckst. Ein Vorhaben, das du gut gelaunt begonnen hast, legt vielleicht gerade einen wunden Punkt frei. Was soll lieber niemand erfahren? Überleg, ob du es einem vertrauten Menschen erzählst. Die Erleichterung kann größer sein als das Risiko.",
      ],
      "full:aquarius": [
        "Der Vollmond im Wassermann, gegenüber der Löwe-Sonne, wiegt deine eigene Geschichte gegen die der Gemeinschaft. Gehörst du zu etwas Größerem, oder stehst du nur daneben? Denk an deine Freundschaften, Vereine, Gruppen. Wer dort kennt dich wirklich? Schreib jemandem, der dich in deinen schlechtesten Momenten erlebt hat und geblieben ist. Überleg dann, was nur du zurückgeben kannst.",
      ],
      "last-quarter:gemini": [
        "Zum letzten Viertel in den Zwillingen sind zu viele Tabs offen, manchmal im wörtlichen Sinn. Schließ einige. Kündige Newsletter, lösch Entwürfe, antworte oder archiviere. Welches Gespräch ist lang genug gelaufen? Bring es freundlich zu Ende.",
      ],
      "new:virgo": [
        "Ein zweiter Neumond im selben Monat ist eine zweite Chance für einen Anfang, diesmal in der Jungfrau. Vergiss die große Geste. Schau auf deine Morgen, deinen Schreibtisch, den Umgang mit deinem Körper. Welche kleine Gewohnheit würde alles andere leichter machen? Fang morgen damit an und halte sie langweilig. Fortschritt nach Art der Jungfrau besteht aus lauter winzigen Reparaturen, und die summieren sich schneller als gedacht.",
      ],
      "first-quarter:sagittarius": [
        "Der Schütze-Mond steht im Quadrat zur Jungfrau-Sonne, und dein sorgfältiger Plan will etwas Auslauf. Steckst du in Details fest, geh für eine Stunde auf Abstand. Wofür ist das ganze Aufräumen eigentlich gut? Ein etwas weiterer Sinn macht die kleinen Aufgaben leichter.",
      ],
      "full:pisces": [
        "Der Vollmond in den Fischen steht der Jungfrau-Sonne gegenüber: Kontrolle gegen Hingabe. Vielleicht hast du hart an den Details gearbeitet und spürst trotzdem, dass dir etwas entgleitet. Lass es zu. Nimm dir einen Abend frei vom Lösen und schau, was du fühlst, wenn du aufhörst. Traurigkeit, Erleichterung und Müdigkeit sind alle nützliche Auskünfte. Wo könntest du mehr vertrauen, und wo würde dich eine klare Grenze schützen?",
      ],
      "last-quarter:cancer": [
        "Dieses Viertel fällt ganz an den Anfang des Krebses, das Sommertempo läuft aus. Welche alte Familienrolle spielst du noch aus Gewohnheit? Du kannst liebevoll sein, ohne ständig in Bereitschaft zu stehen. Gib diese Woche eine kleine Pflicht zurück.",
        "Diesmal erreicht der Mond das Ende des Krebses, die Stimmung ist bereit weiterzuziehen. Sortier eine Kiste mit alten Papieren oder Fotos und behalte nur, was dich wärmt. Erinnerung ist ein guter Gast, und du bestimmst, wie viel Platz sie bekommt.",
      ],
      "new:libra": [
        "Ein Neumond in der Waage beginnt mit der Frage, wie du dich zu anderen verhältst. Wo sagst du Ja und denkst Nein? Such dir eine Beziehung aus, die mehr Gleichgewicht braucht, und fang bei etwas Kleinem und Konkretem an: wer plant, wer zahlt, wer sich zuerst entschuldigt. Dann ist da noch die schöne Seite dieses Zeichens. Ein aufgeräumtes Zimmer oder ein gelungener Gegenstand machen es leichter, fair zu bleiben.",
      ],
      "first-quarter:capricorn": [
        "Der Steinbock-Mond steht im Quadrat zur Waage-Sonne: anderen gefallen gegen Dinge erledigen. Eine Entscheidung, die du um des lieben Friedens willen vertagt hast, ist jetzt vielleicht fällig. Setz dir eine Frist, sag es einem Menschen und nimm in Kauf, dass jemand kurz enttäuscht ist.",
      ],
      "full:aries": [
        "Der Vollmond im Widder steht der Waage-Sonne gegenüber und zeigt den Unterschied zwischen dem, was du willst, und dem, was alle zufriedenstellt. Die Nerven liegen womöglich blank, also geh erst eine Runde, bevor du antwortest. Was hast du um der Harmonie willen heruntergeschluckt? Sag es schlicht und ohne Vorwurf, mit einem Satz, der mit Ich beginnt. Wut zeigt oft nur, dass eine Grenze überschritten wurde, und das ist gut zu wissen.",
      ],
      "full:taurus": [
        "Der Vollmond im Stier steht der Skorpion-Sonne gegenüber und fragt, was dir wirklich Sicherheit gibt. Schau auf das, was du hast: dein Erspartes, deine Gesundheit, die Freundin, die auch um Mitternacht abhebt. Dann schau auf das, wovor du Angst hast, es zu verlieren. Beides darf an einem Abend wahr sein. Tu vor dem Schlafen etwas Langsames und Körperliches, koch, dehn dich, geh eine lange Runde, und lass deinen Körper dich daran erinnern, was trägt.",
      ],
    },
  },

  mercury: {
    crumb: "Merkur rückläufig",
    hub: {
      h1: "Ist Merkur gerade rückläufig?",
      title: "Ist Merkur rückläufig? Aktuelle Termine 2026 und 2027",
      description: "Ist Merkur heute rückläufig? Die Antwort mit Datum, alle Phasen 2026 und 2027 mit Schattenzeiten und Sternzeichen und was du damit anfangen kannst.",
      blocks: [
        { id: "what", title: "Was rückläufig wirklich bedeutet", paras: [
          "Merkur dreht nicht um. Rückläufig ist eine scheinbare Bewegung, die wir nur von der Erde aus sehen. Merkur umrundet die Sonne in etwa 88 Tagen, viel schneller als wir, und überholt uns drei- bis viermal im Jahr auf der Innenbahn. Dabei scheint er stehen zu bleiben, rund drei Wochen lang vor dem Sternenhintergrund rückwärts zu wandern, wieder anzuhalten und dann weiterzuziehen.",
          "Stell dir zwei Läufer auf einer Bahn vor. Du läufst außen, Merkur innen und viel schneller. Meist scheint er in eine Richtung an der gegenüberliegenden Tribüne entlangzuziehen. Jedes Mal, wenn er dich überrundet, zieht er eine Weile in die andere Richtung. Umgedreht hat er nie, nur der Winkel zwischen euch hat sich geändert. Die beiden Wendepunkte heißen Stationen, und die Termine auf dieser Seite sind aus der echten Position des Planeten berechnet.",
        ] },
        { id: "shadow", title: "Was die Schattenphasen sind", paras: [
          "Bevor Merkur anhält, durchläuft er genau das Stück des Tierkreises, das er später rückwärts abgeht. Dieser Anlauf heißt Vorschatten. Nach der Wende läuft er dieselbe Strecke ein drittes Mal, bis er den Punkt erreicht, an dem er zuerst stehen blieb. Das ist der Nachschatten. Astronomisch sind das ganz gewöhnliche Tage. Astrologisch markieren sie das Davor und Danach einer rückläufigen Phase, und weil sie sich leicht berechnen lassen, führen wir sie mit auf.",
        ] },
        { id: "people", title: "Was man damit verbindet", paras: [
          "In der Astrologie steht Merkur für Nachrichten, Reisen, Handel und unser Denken. So wurde der rückläufige Merkur zum Kürzel für alles, was schiefläuft: verlorene Post, ausgefallene Züge, missverstandene Nachrichten, der Ex, der plötzlich wieder schreibt. Die Idee ist alt und taugt gut für Witze.",
          "Nur fallen Züge in jedem Monat aus, und das Gedächtnis merkt sich vor allem das, was zur Geschichte passt. Wir kennen keinen belastbaren Beleg dafür, dass Handys streiken oder Verträge platzen, weil Merkur scheinbar rückwärts läuft, und wir raten dir auch nicht, dein Leben danach umzubauen. Was die Tradition bietet, ist eine regelmäßige Erinnerung, langsamer zu werden und Dinge zu prüfen. Das ist nützlich und kostet nichts.",
        ] },
        { id: "do", title: "Was sich wirklich lohnt", list: [
          "Lies noch einmal durch, bevor du etwas abschickst, vor allem, wenn du wütend geschrieben hast.",
          "Mach ein Backup von Handy und Laptop. Backups sind ohnehin sinnvoll, und der Kalender erinnert dich daran.",
          "Prüf Buchungen, Abfahrtszeiten und Adressen zweimal, bevor du losfährst.",
          "Nimm dir etwas Unerledigtes vor: einen Entwurf, eine Reparatur, einen Kurs, eine offene Antwort.",
          "Frag dich, was du falsch verstanden haben könntest, und wiederhole, was du gehört hast.",
          "Leb normal weiter. Musst du unterschreiben, kaufen oder buchen, lies es sorgfältig und mach es, wie in jedem anderen Monat auch.",
        ] },
        { id: "houses", title: "Wie wir es für dein Zeichen lesen", paras: [
          "Auf jeder Jahresseite steht eine Tabelle für alle zwölf Zeichen. Wir zählen die Häuser ab deinem Sonnenzeichen, ein ganzes Zeichen pro Haus, genau wie im Tageshoroskop. So fällt Merkurs Zeichen für dich in einen Lebensbereich: Geld, Zuhause, Partnerschaft, Arbeit. Kennst du deinen Aszendenten, lies die Tabelle auch für ihn, das passt oft noch besser.",
        ] },
      ],
      faq: [
        ["Ist ein rückläufiger Merkur schlecht?", "Nein. Es ist ein wiederkehrender Anblick am Himmel, der rund drei Wochen dauert. Manche nutzen die Zeit gern, um Dinge zu überprüfen. Fallen dir mehr Pannen auf als sonst, nimm es als Grund, zweimal hinzuschauen, und mach dir keine Sorgen."],
        ["Darf ich bei rückläufigem Merkur Verträge unterschreiben oder verreisen?", "Ja. In diesen Wochen werden jede Menge gute Entscheidungen getroffen. Lies, was du unterschreibst, und prüf deine Buchungen, so wie du es immer tun würdest. Schieb nichts Wichtiges wegen eines Kalendereintrags auf."],
        ["Wie oft ist Merkur rückläufig?", "2026 und 2027 jeweils dreimal, in manchen Kalenderjahren auch viermal. Jede Phase dauert rund drei Wochen. Die genauen Termine stehen auf den Jahresseiten."],
        ["Läuft Merkur wirklich rückwärts?", "Nein. Er umkreist die Sonne immer in derselben Richtung. Von der Erde aus sieht es nur so aus, während er uns auf seiner kleineren, schnelleren Bahn überholt."],
        ["Warum nennen manche Seiten einen anderen Tag?", "Die Stationen fallen auf einen exakten Moment, das Kalenderdatum hängt also von der Zeitzone ab. Wir rechnen in mitteleuropäischer Zeit. Weiter westlich oder östlich kann sich das Datum um einen Tag verschieben."],
      ],
    },
    answer: {
      retrograde: (d) => `Ja. Merkur ist seit dem ${d.since} rückläufig, ${d.signIn}. Am ${d.direct} wird er wieder direktläufig, die Schattenphase endet am ${d.shadowEnd}.`,
      "pre-shadow": (d) => `Noch nicht. Merkur ist seit dem ${d.since} im Vorschatten und wird am ${d.retro} rückläufig, ${d.signIn}.`,
      "post-shadow": (d) => `Nein. Merkur ist seit dem ${d.since} wieder direktläufig. Der Nachschatten dauert noch bis zum ${d.shadowEnd}.`,
      clear: (d) => `Nein. Merkur läuft direkt. Die nächste rückläufige Phase beginnt am ${d.retro} ${d.signIn}, der Vorschatten am ${d.shadowStart}.`,
    },
    asOf: (date) => `Geprüft anhand der berechneten Planetenposition, Stand ${date}. Die Seite wird jede Nacht aktualisiert.`,
    nowTitle: "Merkur im Moment", nextTitle: "Die nächsten Termine: Merkur rückläufig",
    head: { stage: "Abschnitt", date: "Datum", time: "Uhrzeit", position: "Position", period: "Rückläufig", signs: "Zeichen", shadow: "Mit Schatten", sign: "Zeichen", house: "Haus", focus: "Lohnt einen Blick" },
    stage: { preShadow: "Vorschatten beginnt", retro: "Wird rückläufig", direct: "Wird direktläufig", postShadow: "Nachschatten endet", moves: (signTo) => `Läuft zurück ${signTo}` },
    clock: "Zeiten für Berlin, Wien, Zürich und Skopje.",
    range: (from, to) => `${from} bis ${to}`,
    year: {
      h1: (y) => `Merkur rückläufig ${y}: alle Termine und Schattenphasen`,
      title: (y) => `Merkur rückläufig ${y}: Termine und Schattenphasen`,
      description: (y, n) => `Merkur ist ${y} ${n} rückläufig. Alle Stationen, Schattenphasen und Sternzeichen, dazu was jede Phase für dein Zeichen bedeuten kann, Haus für Haus.`,
      lead: (y, n, list) => `Merkur wird ${y} ${n} rückläufig: ${list}.`,
      overviewTitle: (y) => `Merkur rückläufig ${y}: alle Termine`,
      periodTitle: (range, signs) => `${range}: ${signs}`, bySignTitle: (signs) => `Für jedes Zeichen: ${signs}`,
      bySignCaption: "Häuser gezählt ab deinem Sonnenzeichen, ein ganzes Zeichen pro Haus. Zwei Zahlen heißen, dass Merkur während der Phase das Zeichen wechselt.",
      intro: {
        2026: ["2026 bleibt jede rückläufige Phase in einem einzigen Zeichen: Fische, Krebs, dann Skorpion. Alle drei sind Wasserzeichen, die Rückschau dreht sich also eher um Gefühle, Erinnerungen und Vertrauen als um Papierkram. Das ist eine Lesart und keine Vorhersage. Die Termine sind Astronomie, was du daraus machst, bleibt dir überlassen."],
        2027: ["2027 beginnt jede rückläufige Phase in einem Wasserzeichen und rutscht zurück in das Luftzeichen davor: Fische in Wassermann, Krebs in Zwillinge, Skorpion in Waage. Jede Phase hat also zwei Kapitel, und Gefühle werden oft besprochen, bevor die Rückschau endet. Unterwegs wechselt auch dein Haus, deshalb stehen in den Tabellen zwei Zahlen."],
      },
      qWhen: (y) => `Wann ist Merkur ${y} rückläufig?`, aWhen: (y, list) => `${y} ist Merkur rückläufig: ${list}.`,
      qShadow: (y) => `Wann sind die Schattenphasen ${y}?`, aShadow: (list) => `Mit Vor- und Nachschatten sind es diese Zeiträume: ${list}.`,
      qSigns: (y) => `Welche Zeichen berührt der rückläufige Merkur ${y}?`, aSigns: (list) => `Während der rückläufigen Phasen läuft Merkur durch ${list}.`,
    },
    periods: {
      "2026:pisces": {
        paras: ["In den Fischen tauscht Merkur Genauigkeit gegen Stimmung. Gedanken kommen als Bilder und halb erinnerte Lieder, weniger als Listen. Das ist ein gutes Zeitfenster, um nachzulesen, was du gefühlt hast, und nicht nur, was du gesagt hast. Halte ein Notizbuch griffbereit. Alte Träume und liegen gebliebene kreative Arbeit melden sich vielleicht zurück und haben eine Stunde deiner Zeit verdient.", "Praktisch heißt das: Prüf, was die Fische gern verwischen, also Uhrzeiten, Beträge und wer was zugesagt hat. Eine kurze schriftliche Zusammenfassung nach einem Gespräch erspart später viel Rätselraten."],
        bySign: ["Stille Stunden. Alte Sorgen tauchen auf, schreib sie auf, statt nachts daran zu kauen.", "Freunde und Gruppen. Ein eingeschlafener Chat oder ein gemeinsamer Plan braucht ein ehrliches Update.", "Beruf und Ruf. Prüf, was du Chefin oder Kunden zugesagt hast, bevor du mehr versprichst.", "Lernen und Reisen. Prüf Buchungen noch einmal und nimm den abgebrochenen Kurs wieder auf.", "Gemeinsames Geld und Vertrauen. Lies eine Rechnung oder einen Kredit nach und frag dich, was noch offen ist.", "Partnerschaft. Wiederhole, was du gehört hast, bevor du antwortest. Alte Themen wollen eine zweite Runde.", "Alltag. Schau dir an, was dich müde macht, und verbessere bei der Arbeit einen kleinen Ablauf.", "Freude und Flirt. Eine alte Flamme oder ein altes Hobby melden sich. Entscheide, was du davon willst.", "Zuhause und Familie. Besprich eine Wohnungsfrage noch einmal und such die fehlenden Unterlagen.", "Nachrichten und kurze Wege. Antworte langsamer und prüf die Adresse zweimal.", "Geld und Werte. Geh deine Abos durch und frag dich, wofür du wirklich zahlst.", "Du im Spiegel. Überdenke, wie du wirkst, und erlaub dir, deine Meinung zu ändern."],
      },
      "2026:cancer": {
        paras: ["Wenn Merkur rückwärts durch den Krebs läuft, übernimmt das Gedächtnis die Regie. Alte Fotos, Familiengeschichten und der Geruch einer bestimmten Küche sind plötzlich näher als die Aufgaben dieser Woche. Viele nutzen diese Zeit, um die Eltern anzurufen, eine Kiste mit Papieren zu sortieren oder endlich auf eine Nachricht von zu Hause zu antworten.", "Wiederholt sich ein Familiengespräch, achte auf das Gefühl unter den Worten. Deine Reaktion kannst du ändern, auch wenn das Thema gleich bleibt."],
        bySign: ["Dein Zuhause. Familiengespräche drehen sich im Kreis, hör auf das, was unter der alten Klage liegt.", "Geschwister, Nachbarn, kurze Notizen. Schick die nette Nachricht, die du im Kopf längst formuliert hast.", "Dein Umgang mit Geld. Schau, wofür du Trost kaufst und ob er noch tröstet.", "Deine eigenen Stimmungen. Sei diesen Monat langsamer und überdenke eine hastige Entscheidung.", "Der Hinterkopf. Schlaf, Träume und altes Bedauern wollen eine stille Stunde mit dem Notizbuch.", "Dein Kreis. Jemand aus einer alten Gruppe meldet sich vielleicht. Prüf, ob die Verbindung noch passt.", "Beruf trifft Familie. Schau noch einmal, wie du deine Zeit zwischen beiden aufteilst.", "Überzeugungen von zu Hause. Prüf, welche Ansichten deine sind und welche du geerbt hast.", "Gemeinsame Mittel. Familiengeld oder Schulden brauchen ein klares, ruhiges Gespräch.", "Enge Beziehungen. Alte Kränkungen kommen hoch. Frag nach, bevor du zu wissen glaubst, was gemeint war.", "Tägliche Fürsorge. Schau auf Essen, Schlaf und die Arbeiten, die immer an dir hängen bleiben.", "Spiel und Kinder. Hol etwas zurück, das du als Kind geliebt hast, einfach zum Vergnügen."],
      },
      "2026:scorpio": {
        paras: ["Der Skorpion liest zwischen den Zeilen, und eine rückläufige Phase schärft hier das Misstrauen genauso wie die Einsicht. Dir fällt vielleicht auf, was in einem Vertrag, einer Geschichte oder einer Entschuldigung fehlt. Bevor du handelst, frag dich: Weiß ich das, oder fürchte ich es?", "Gut geeignet ist die Phase für Recherche, für eine Zahl, vor der du dich gedrückt hast, und für ehrliche Gespräche über Geld oder Vertrauen. Geh sparsam mit Vorwürfen um. Eine Frage öffnet mehr Türen."],
        bySign: ["Schulden und Vertrauen. Lies das Kleingedruckte bei allem Gemeinsamen und stell die direkte Frage.", "Die Sorgen deines Partners. Etwas Verborgenes kommt ans Licht. Lass ihn ausreden, bevor du reagierst.", "Arbeitsgewohnheiten. Such die echte Ursache des wiederkehrenden Problems, statt es zu flicken.", "Liebe und Kreatives. Ein alter Schwarm oder ein liegen gebliebenes Projekt zieht an dir. Frag dich, warum gerade jetzt.", "Familienthemen und Reparaturen. Schau unter die Dielen, wörtlich oder im übertragenen Sinn.", "Worte mit Schärfe. Lies die spitze Nachricht noch einmal, bevor du sie abschickst.", "Deine Ersparnisse. Finde heraus, wohin das Geld wirklich geht, ohne dich dafür zu schämen.", "Deine eigenen Motive. Du siehst dich vielleicht klarer, als dir lieb ist. Geh freundlich damit um.", "Was du für dich behältst. Gib einer privaten Angst eine Stunde auf Papier.", "Verbündete. Prüf, wem in deiner Gruppe du wirklich vertraust und wen du aus Gewohnheit mitziehst.", "Macht im Job. Überdenke einen Karriereschritt im Stillen, bevor du ihn ankündigst.", "Tiefe Fragen. Nimm dir ein Thema vor, das dich seit Jahren beschäftigt, und lies etwas Schwieriges."],
      },
      "2027:pisces>aquarius": {
        paras: ["Diese Phase beginnt in den Fischen und rutscht unterwegs zurück in den Wassermann. Der erste Teil geht nach innen: Gefühle, Träume, alles, was sich schlecht in eine E-Mail schreiben lässt. Der zweite ist kühler und geselliger, gut, um eine Idee im Freundeskreis zu prüfen oder deinen Platz in einer Gruppe zu überdenken.", "Achte auf die Übergabe. Was du in der ersten Woche still gespürt hast, lässt sich in der dritten vielleicht endlich erklären. Den Tag des Zeichenwechsels findest du in der Tabelle."],
        bySign: ["Von privaten Sorgen zu den Freunden, die sie hören könnten. Lass einen Menschen rein.", "Gruppenpläne werden zu Berufsfragen. Klär, wer tatsächlich was macht.", "Ein beruflicher Neustart führt vielleicht zu einem Kurs oder einer Reise. Vergleich erst die Notizen.", "Große Ideen treffen aufs Budget. Frag, was dein Plan kostet und wer mitzahlt.", "Gemeinsames Geld wird zum Partnergespräch. Bring die Zahlen mit und bleib ruhig im Ton.", "Ein Partnergespräch landet im Alltag. Klär, wer welche Aufgabe übernimmt.", "Routine macht Platz für Spiel. Streich eine Pflicht und nimm ein Hobby wieder auf.", "Liebe trifft Zuhause. Überleg, wen du in deinen privaten Raum lässt.", "Eine Wohnungsfrage will ausgesprochen werden. Ruf die Schwester oder den Nachbarn an.", "Worte werden zu Geld. Lies eine Rechnung, ein Angebot, die Bedingungen eines Jobs noch einmal.", "Deine Werte kommen zu dir zurück. Frag dich, ob deine Ausgaben noch zu dir passen.", "Du beginnst im eigenen Zeichen und endest hinter den Kulissen. Auch Ausruhen gehört zur Rückschau."],
      },
      "2027:cancer>gemini": {
        paras: ["Erst das Zuhause, dann die Schlagzeilen. Merkur läuft zunächst rückwärts durch den Krebs, wo Erinnerung und Familie den Ton angeben, dann rutscht er in die Zwillinge, eines seiner eigenen Zeichen, wo sich Neuigkeiten, Erledigungen und Nachrichten stapeln. Die Zwillinge mögen zudem Doppeldeutiges, lies also vor dem Antworten nach.", "Weil Merkur in den Zwillingen zu Hause ist, kann diese Phase voller wirken als andere. Halte Listen kurz, bestätige Absprachen schriftlich und plane einen Tag Puffer für alles ein, was von den Antworten anderer abhängt."],
        bySign: ["Familiengespräche werden zur Organisation. Einigt euch auf Termine, Fahrten und Schlüssel.", "Nachrichten führen zu Geld. Hak bei dem offenen Gefallen oder der ungeschriebenen Rechnung nach.", "Merkur regiert dein Zeichen und kommt heim. Prüf erst dein Budget, dann deine Pläne.", "Die Phase beginnt bei dir und wendet sich dann nach innen. Lass Platz für Nickerchen und Stille.", "Alte Gefühle kommen hoch, dann helfen Freunde beim Sortieren. Ruf die an, die die Geschichte kennt.", "Dein Herrscher wandert von der Gemeinschaft zum Beruf. Überarbeite ein Ziel, bevor du es vorstellst.", "Berufliche Pflichten weichen größeren Fragen. Frag dich, was dieser Job dich lehrt.", "Eine Überzeugung wird am Ernstfall geprüft. Schau bei Geld und Vertrauen auf die Fakten.", "Gemeinsame Finanzen werden zum Partnergespräch. Sprich die Zahl laut aus.", "Ein Beziehungsthema landet im Kalender. Ändere die kleine Gewohnheit hinter der Reibung.", "Der Arbeitsrhythmus lockert sich. Prüf dein Pensum und lass Zeit für Spaß.", "Kreatives trifft Zuhause. Räum eine Ecke frei, in der das alte Projekt wieder leben kann."],
      },
      "2027:scorpio>libra": {
        paras: ["Ein ernster Anfang und ein diplomatisches Ende. Im Skorpion gräbt Merkur nach dem, was unter der Oberfläche liegt. Sobald er zurück in die Waage läuft, wandert die Frage von dem, was wahr ist, zu dem, was fair ist, und Absprachen mit Partnern oder Kollegen kommen auf den Prüfstand.", "Das ist eine nützliche Reihenfolge. Erst wirst du ehrlich mit dir, dann überlegst du, wie du es so sagst, dass der andere es hören kann. Ein verschobenes Gespräch zur richtigen Zeit ist selten verlorene Zeit."],
        bySign: ["Vertrauensfragen kommen auf den Tisch. Führ das Gespräch mit deinem Partner, statt zu raten.", "Ein angespanntes Gespräch kann in bessere Absprachen münden. Schreib auf, wer was zugesagt hat.", "Merkur führt dein Zeichen. Bring die Abläufe im Job in Ordnung und kehr dann zu dem zurück, was dir Spaß macht.", "Lust trifft Zuhause. Sprich darüber, was du dir vom Familienleben in diesem Herbst wünschst.", "Eine private Familienangelegenheit braucht klare Worte. Such dir die eine Person, der du es zuerst sagst.", "Dein Herrscher zieht durch Gespräche und Geld. Bestätige Zahlen schriftlich, und zwar zweimal.", "Erst kommt dein Budget, dann dein Auftritt. Entscheide, wofür du bekannt sein willst.", "Das Rampenlicht wird bewusst schwächer. Überdenke, wie du auftrittst, und gönn dir eine stille Woche.", "Private Zweifel finden Platz unter Freunden. Bitte um eine ehrliche Meinung.", "Kontakte helfen bei Berufsfragen. Meld dich bei einer früheren Kollegin, bevor du entscheidest.", "Eine Berufsfrage wird grundsätzlich. Schau aufs große Ganze, bevor du den Kurs änderst.", "Eine große Idee braucht den genauen Blick auf Kosten und Verpflichtungen. Frag, wen sie noch betrifft."],
      },
    },
  },
};
