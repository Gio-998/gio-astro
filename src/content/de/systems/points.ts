import type { Sign } from "@/engine/zodiac";
type BySign<T> = Record<Sign, T>;

export const chiron: BySign<{ wound: string; gift: string; practice: string }> = {
  aries: { wound: "Ein leiser Zweifel an deinem Recht, Raum einzunehmen, Dinge zuerst zu wollen, einfach da zu sein, ohne es dir zu verdienen.", gift: "Du hilfst anderen, ihren Mut zu finden, weil du von innen weißt, wie viel Mut ein kleiner erster Schritt kostet.", practice: "Mach einmal am Tag etwas zuerst: zuerst sprechen, zuerst wählen, zuerst fragen. Merk, dass nichts kaputtgeht." },
  taurus: { wound: "Sorge, nicht genug zu haben, nicht genug zu sein oder in deinem eigenen Körper nicht sicher zu sein. Komfort fühlt sich entweder unerreichbar an oder unmöglich loszulassen.", gift: "Du lehrst Beständigkeit. Menschen entspannen sich bei dir, weil du weißt, wie man Sicherheit langsam und echt aufbaut.", practice: "Leg vor einer Entscheidung über Geld oder Essen eine Hand auf den Bauch und atme dreimal langsam. Dann entscheide." },
  gemini: { wound: "Das Gefühl, deine Worte oder dein Kopf seien zu viel, zu sprunghaft oder nicht klug genug, oft weil man dich korrigiert oder dir nicht zugehört hat.", gift: "Du wirst die Person, die Dinge freundlich erklärt und anderen das Gefühl gibt, klug statt klein zu sein.", practice: "Schreib jeden Tag einen ehrlichen Satz, den niemand bewertet. Heb ihn auf." },
  cancer: { wound: "Ein alter Schmerz rund ums Dazugehören und Umsorgtwerden. Vielleicht hast du gelernt, für andere zu sorgen, damit du nicht um Fürsorge bitten musst.", gift: "Du weißt, wie man Menschen ein Zuhause gibt, einen Raum, ein Essen, eine Stimme, die sagt: Hier darfst du ausruhen.", practice: "Lass dich diese Woche von einer Person auf kleine Art umsorgen, ohne es am selben Tag zurückzuzahlen." },
  leo: { wound: "Angst, nicht gesehen zu werden, oder dass Gesehenwerden Scham bringt. Strahlen kann sich riskant anfühlen.", gift: "Du bemerkst die Leisen und gibst ihnen eine Bühne. Deine Wärme macht andere mutig.", practice: "Teile etwas, das du gemacht hast, bevor es sich fertig anfühlt, und lass die Reaktion sein, wie sie ist." },
  virgo: { wound: "Das Gefühl, nur in Ordnung zu sein, wenn du nützlich oder fehlerlos bist. Fehler fühlen sich an wie ein Beweis für etwas.", gift: "Genaue, sanfte Hilfe. Du kannst reparieren, was kaputt ist, ohne dass sich jemand kaputt fühlt.", practice: "Lass eine Aufgabe absichtlich bei gut genug. Schreib danach auf, was wirklich passiert ist." },
  libra: { wound: "Dich selbst zu verlieren, um den Frieden zu wahren, oder das Gefühl, Liebe sei nur sicher, wenn du zustimmst.", gift: "Du kannst zwei Seiten fair halten und zeigst anderen, dass ein freundliches Nein eine Beziehung schützen kann.", practice: "Wenn dich jemand fragt, was du willst, antworte innerhalb von drei Sekunden. Umentscheiden kannst du dich später noch." },
  scorpio: { wound: "Gebrochenes Vertrauen oder das Gefühl, dass Nähe zu Verlust führt. Vielleicht bewachst du deine Tiefen sehr sorgfältig.", gift: "Du kannst bei Menschen in ihren schwersten Momenten bleiben, ohne zurückzuweichen. Du weißt, dass man Krisen überlebt.", practice: "Erzähl einer sicheren Person eine wahre Sache, die du sonst versteckst. Fang klein an." },
  sagittarius: { wound: "Zweifel daran, was du glauben sollst oder wohin du gehst, manchmal nachdem dich ein Glaube, eine Lehrerin oder ein Plan enttäuscht hat.", gift: "Du hilfst Menschen, einen eigenen Sinn zu finden, keinen geliehenen. Ehrliche Hoffnung statt Parolen.", practice: "Schreib drei Dinge auf, die du aus eigener Erfahrung weißt, nicht von anderen." },
  capricorn: { wound: "Das Gefühl, früh erwachsen werden zu müssen, zu viel zu tragen oder deinen Wert durch Leistung beweisen zu müssen.", gift: "Du wirst eine Autorität, die Menschen schützt, fest und fair, mit Raum für Ruhe.", practice: "Trag Ruhe in deinen Kalender ein wie einen Termin und halte sie wie ein Versprechen." },
  aquarius: { wound: "Das Gefühl, der Außenseiter zu sein, oder wählen zu müssen zwischen Dazugehören und du selbst sein.", gift: "Du baust Gruppen, in die verschiedene Menschen passen. Du machst Schrägsein sicher.", practice: "Such dir einen Ort, online oder echt, an dem dein schräges Interesse normal ist. Geh zweimal hin." },
  pisces: { wound: "Alles auf einmal zu fühlen, mit schwachen Grenzen, sodass die Stimmungen anderer hereinfluten. Flucht wirkt dann wie die einzige Tür.", gift: "Tiefes Mitgefühl mit Grenzen: Du kannst freundlich sein, ohne zu ertrinken, und zeigst anderen, wie das geht.", practice: "Wasch dir nach einem anstrengenden Gespräch langsam die Hände und nenne drei Dinge, die du siehst. So kommt deine Grenze zurück." },
};

export const nodes: BySign<{ north: string; south: string; step: string }> = {
  aries: { north: "Wachsen zur Unabhängigkeit: selbst entscheiden und handeln, ohne auf Erlaubnis zu warten.", south: "Vertrautes Terrain ist, anderen zu gefallen und die Balance zu halten, manchmal auf Kosten eigener Wünsche.", step: "Triff diese Woche eine Entscheidung, ohne jemanden zu fragen." },
  taurus: { north: "Wachsen zu einfachen, beständigen Werten: dein Körper, dein Tempo, was wirklich dir gehört.", south: "Vertrautes Terrain sind Intensität und Krisen, das Verschmelzen mit den Bedürfnissen und dem Geld anderer.", step: "Such dir eine ruhige tägliche Gewohnheit und halte sie neun Tage durch." },
  gemini: { north: "Wachsen zu Neugier und Gespräch: fragen, zuhören, bei vielen kleinen Wahrheiten bleiben.", south: "Vertrautes Terrain ist, dir sicher zu sein, die große Antwort zu haben und weiterzuziehen, bevor die Details kommen.", step: "Stell bei der nächsten Meinungsverschiedenheit zwei Fragen, bevor du deine Sicht sagst." },
  cancer: { north: "Wachsen zu Weichheit und Zuhause: Gefühle, Familie (gewählt oder gegeben) und umsorgt werden.", south: "Vertrautes Terrain sind Kontrolle, Status und alles allein zusammenhalten.", step: "Sag heute einmal laut „ich fühle“ statt „ich denke“." },
  leo: { north: "Wachsen zu Freude und sichtbarem Selbstausdruck: erschaffen, spielen, im Licht stehen.", south: "Vertrautes Terrain ist, in der Gruppe aufzugehen und kühle Distanz zu halten.", step: "Mach etwas nur aus Spaß und zeig es einer Person." },
  virgo: { north: "Wachsen zu praktischer Fürsorge: Routinen, Gesundheit, nützliche Arbeit, gut gemacht.", south: "Vertrautes Terrain ist Treibenlassen, Träumen und Flüchten, wenn das Leben schwer wird.", step: "Wähle eine kleine tägliche Aufgabe und erledige sie jeden Tag zur selben Zeit." },
  libra: { north: "Wachsen zur Partnerschaft: Kompromisse, Zuhören und andere genauso wichtig nehmen wie dich.", south: "Vertrautes Terrain ist, allein loszuziehen und schnell nach eigenen Regeln zu handeln.", step: "Frag einen nahen Menschen, was er diese Woche braucht, und handle danach." },
  scorpio: { north: "Wachsen zur Tiefe: ehrliche Nähe, geteilte Ressourcen und alte Dinge enden lassen.", south: "Vertrautes Terrain sind Komfort, Festhalten und ein sicheres, vorhersehbares Leben.", step: "Lass einen Gegenstand oder eine Gewohnheit los, die du nur aus Gewohnheit behältst." },
  sagittarius: { north: "Wachsen zum Sinn: große Fragen, Reisen mit Körper oder Kopf, dem eigenen Kompass trauen.", south: "Vertrautes Terrain ist, Fakten und Meinungen zu sammeln, ohne dich je für eine zu entscheiden.", step: "Nenne einen Glaubenssatz, nach dem du lebst. Schreib auf, warum er deiner ist." },
  capricorn: { north: "Wachsen zur Verantwortung in der Welt: Ziele, Struktur und jemand sein, auf den sich andere stützen können.", south: "Vertrautes Terrain ist, im Familiennest und seinen Stimmungen zu bleiben.", step: "Setz dir ein öffentliches Ziel mit Datum und erzähl einer Person davon." },
  aquarius: { north: "Wachsen zu Gemeinschaft und Zukunft: Freundschaften, Anliegen, deine eigenen schrägen Ideen.", south: "Vertrautes Terrain ist, Applaus zu brauchen und alles persönlich zu nehmen.", step: "Mach bei einem Gruppenprojekt mit, in dem du nicht der Star bist." },
  pisces: { north: "Wachsen zu Hingabe und Mitgefühl: Intuition, Ruhe, Kunst und Vertrauen in das, was du nicht kontrollieren kannst.", south: "Vertrautes Terrain sind Sorgen, Reparieren und Perfektionieren jedes Details.", step: "Verbring jeden Tag zwanzig Minuten ohne Plan und ohne Handy." },
};

export const lilith: BySign<{ text: string; reclaim: string }> = {
  aries: { text: "Deine Wut und dein Drang, Erste zu sein, wurden vielleicht „zu viel“ genannt.", reclaim: "Steh zu deinem Feuer: Sag ein klares Nein und ein klares Ich will, ohne dich zu entschuldigen." },
  taurus: { text: "Genuss, Komfort und der Wunsch nach schönen Dingen tragen vielleicht einen Hauch schlechtes Gewissen.", reclaim: "Genieße deinen Körper und deine Sinne mit Absicht. Ruhe zählt." },
  gemini: { text: "Deine spitze Zunge, deine Fragen oder deine vielen Interessen wurden vielleicht zum Schweigen gebracht.", reclaim: "Sag den wahren Satz, freundlich. Behalte drei Hobbys, wenn du drei willst." },
  cancer: { text: "Deine Bedürfnisse und Stimmungen haben sich vielleicht wie eine Last für andere angefühlt.", reclaim: "Fürsorge zu brauchen ist menschlich. Bitte einfach darum." },
  leo: { text: "Der Wunsch nach Aufmerksamkeit und Bewunderung wurde vielleicht als Eitelkeit abgetan.", reclaim: "Lass dich sehen. Applaus zu wollen ist erlaubt." },
  virgo: { text: "Deine Ansprüche oder deine chaotische, unperfekte Seite wurden vielleicht bewertet.", reclaim: "Behalte deine Ansprüche und lass die Scham fallen. Beides kann zusammen leben." },
  libra: { text: "Dein Wunsch, geliebt zu werden, und dein Talent für Charme wurden vielleicht falsch genannt.", reclaim: "Schönheit und Harmonie sind echte Bedürfnisse. Wähle sie für dich, nicht nur für andere." },
  scorpio: { text: "Deine Intensität, Sexualität und dein Bedürfnis nach Wahrheit machen Menschen vielleicht Angst, dich eingeschlossen.", reclaim: "Tiefe ist keine Gefahr. Such dir Menschen, die ihr begegnen können." },
  sagittarius: { text: "Deine Wildheit, Direktheit und dein Freiheitsdrang wurden vielleicht früh gezähmt.", reclaim: "Lass ein Stück der Landkarte leer. Fahr manchmal allein irgendwohin, wo du noch nie warst." },
  capricorn: { text: "Dein Ehrgeiz und dein Wunsch nach Einfluss wurden vielleicht als kalt gesehen.", reclaim: "Wünsch dir Erfolg ganz offen. Führe fair und behalte deine Wärme." },
  aquarius: { text: "Dein Anderssein und deine Weigerung, dich anzupassen, wurden vielleicht bestraft.", reclaim: "Sei mit Absicht die Ausnahme, mit Freunden, die dich genau dafür mögen." },
  pisces: { text: "Deine Empfindsamkeit, deine Fantasien und deine spirituelle Seite wurden vielleicht als unwirklich abgetan.", reclaim: "Gib deiner Innenwelt eine Form: Musik, Kunst, Gebet, ein Notizbuch." },
};

export const solarYear: BySign<string> = {
  aries: "Ein Jahr der Neuanfänge und mutigen Schritte. Fang an, bevor du dich bereit fühlst.",
  taurus: "Ein Jahr, um etwas Beständiges aufzubauen: Geld, Körper, Gemütlichkeit zu Hause. Langsam ist in Ordnung.",
  gemini: "Ein Jahr voller Lernen, Nachrichten und kurzer Reisen. Sag Ja zu Gesprächen.",
  cancer: "Ein Jahr rund um Zuhause, Familie und Gefühle. Pflege dein Nest.",
  leo: "Ein Jahr, um zu erschaffen und gesehen zu werden. Lass mindestens einmal pro Woche die Freude führen.",
  virgo: "Ein Jahr der Routinen, Gesundheit und besseren Abläufe. Kleine Verbesserungen summieren sich.",
  libra: "Ein Jahr der Partnerschaft und Balance. Wen du wählst, zählt.",
  scorpio: "Ein Jahr der Tiefe und Verwandlung. Etwas endet, damit etwas Wahreres wachsen kann.",
  sagittarius: "Ein Jahr weiter Horizonte: Reisen, Lernen, Überzeugungen, die du echt prüfst.",
  capricorn: "Ein Jahr der Arbeit, Ziele und Verantwortung. Dein Einsatz wird sichtbar.",
  aquarius: "Ein Jahr der Freunde, Gruppen und Zukunftspläne. Finde deine Leute.",
  pisces: "Ein Jahr der Ruhe, Fantasie und des Loslassens. Hör auf deine leisere Seite.",
};
