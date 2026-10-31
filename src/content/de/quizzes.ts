export const scale5 = ["Stimmt gar nicht", "Stimmt eher nicht", "Neutral", "Stimmt eher", "Stimmt genau"];
export const scaleTrue = ["Gar nicht ich", "Ein bisschen", "Teilweise", "Meistens", "Total ich"];

/** Mini-IPIP (gemeinfrei, ipip.ori.org), in der Ich-Form. */
export const bigFive: Record<string, string> = {
  e1: "Auf Partys bin ich der Mittelpunkt.", a1: "Ich fühle mit, wenn es anderen schlecht geht.", c1: "Aufgaben erledige ich sofort.", n1: "Meine Stimmung schwankt oft.", o1: "Ich habe eine lebhafte Fantasie.",
  e2: "Ich rede nicht viel.", a2: "Die Probleme anderer interessieren mich nicht.", c2: "Ich vergesse oft, Dinge an ihren Platz zurückzulegen.", n2: "Meistens bin ich entspannt.", o2: "Abstrakte Ideen interessieren mich nicht.",
  e3: "Auf Partys rede ich mit vielen verschiedenen Leuten.", a3: "Ich spüre, was andere fühlen.", c3: "Ich mag Ordnung.", n3: "Mich bringt schnell etwas aus der Fassung.", o3: "Abstrakte Ideen fallen mir schwer.",
  e4: "Ich halte mich lieber im Hintergrund.", a4: "Andere Menschen interessieren mich eigentlich nicht.", c4: "Ich bringe Dinge oft durcheinander.", n4: "Ich bin selten niedergeschlagen.", o4: "Meine Fantasie ist nicht besonders gut.",
};

export const attachment: Record<string, string> = {
  ax1: "Ich mache mir Sorgen, dass mir nahe Menschen weniger an mir liegt als mir an ihnen.",
  av1: "Ich zeige anderen lieber nicht, wie es tief in mir aussieht.",
  ax2: "Ich brauche oft die Bestätigung, dass ich den Menschen, die ich liebe, wichtig bin.",
  av2: "Es fällt mir leicht, mich auf nahe Menschen zu verlassen.",
  ax3: "Wenn jemand, der mir nahe ist, still wird, fürchte ich, etwas falsch gemacht zu haben.",
  av3: "Mir wird unwohl, wenn jemand sehr viel Nähe will.",
  ax4: "Ich habe selten Angst, verlassen oder ersetzt zu werden.",
  av4: "Mit Menschen, die mir nahe sind, rede ich Dinge meistens durch.",
  ax5: "Manchmal suche ich mehr Nähe, als der andere möchte.",
};

export const nine: Record<string, string> = {
  t1: "Ich habe hohe Ansprüche an mich und sehe, was besser werden sollte.", t1b: "Es stört mich, wenn Dinge schlampig oder unfair gemacht werden.",
  t2: "Ich bin am meisten ich selbst, wenn ich jemandem helfe, der mir wichtig ist.", t2b: "Ich spüre oft, was andere brauchen, bevor sie fragen.",
  t3: "Ich will etwas erreichen und mag es, wenn man meine Leistung sieht.", t3b: "Ich passe mich schnell an das an, was eine Situation zum Erfolg braucht.",
  t4: "Ich fühle Dinge tiefer als die meisten um mich herum.", t4b: "Echt und einzigartig zu sein ist mir sehr wichtig.",
  t5: "Ich brauche Zeit allein, um nachzudenken, bevor ich mich einbringe.", t5b: "Ich will verstehen, wie Dinge funktionieren, und zwar gründlich.",
  t6: "Ich bin loyal und weiß gern, auf wen und was ich mich verlassen kann.", t6b: "Ich sehe oft voraus, was schiefgehen könnte, und bereite mich vor.",
  t7: "Ich liebe neue Erlebnisse, Pläne und Möglichkeiten.", t7b: "Ich bleibe lieber positiv, statt bei Schmerz zu verweilen.",
  t8: "Ich übernehme die Führung und beschütze Menschen, die mir wichtig sind.", t8b: "Ich sage Dinge direkt und lasse mich nicht gern kontrollieren.",
  t9: "Frieden in mir und um mich herum ist mir am wichtigsten.", t9b: "Ich sehe leicht jede Sichtweise und lasse mich treiben.",
};
export const nineOrder = ["t1", "t5", "t9", "t2", "t6", "t3", "t7", "t4", "t8", "t1b", "t5b", "t9b", "t2b", "t6b", "t3b", "t7b", "t4b", "t8b"];

export const careScenes: Record<string, { q: string; a: string; b: string }> = {
  "words-time": { q: "Du hast Geburtstag. Was bleibt dir im Kopf?", a: "Eine Karte, in der steht, was sie an dir lieben", b: "Ein ganzer Tag nur zu zweit" },
  "words-gifts": { q: "Eine harte Woche ist vorbei. Was tut dir am besten?", a: "Eine Sprachnachricht: Ich bin stolz auf dich", b: "Dein Lieblingssnack wartet auf deinem Schreibtisch" },
  "words-help": { q: "Morgen ist Prüfung oder Abgabe. Was hilft mehr?", a: "Eine Nachricht: Du schaffst das, ich glaub an dich", b: "Jemand kocht, damit du weiterarbeiten kannst" },
  "words-touch": { q: "Du hattest Stress mit deiner Chefin. Zu Hause willst du…", a: "Hören: Das hast du richtig gut gemacht", b: "Eine lange Umarmung, bevor irgendwer redet" },
  "time-gifts": { q: "Ein fauler Sonntag. Was macht ihn perfekt?", a: "Zusammen frühstücken, ohne Eile, ohne Handy", b: "Ein Buch, bei dem sie an dich gedacht haben" },
  "time-help": { q: "Umzugstag. Was fühlt sich nach Liebe an?", a: "Sie bleiben lange, nur um mit dir zwischen den Kisten zu sitzen", b: "Sie kommen mit Klebeband und bauen das Bett auf" },
  "time-touch": { q: "Filmabend. Das Schönste daran ist…", a: "Dass sie sich den ganzen Abend für dich freigehalten haben", b: "Zusammen unter einer Decke zu kuscheln" },
  "gifts-help": { q: "Du liegst krank im Bett. Was fühlt sich fürsorglicher an?", a: "Sie bringen dir Tee und ein kleines Wohlfühlpaket", b: "Sie gehen mit deinem Hund raus und spülen ab" },
  "gifts-touch": { q: "Sie kommen von einer Reise zurück. Welche Begrüßung gewinnt?", a: "Ein kleines Mitbringsel, nur für dich ausgesucht", b: "Dir an der Tür in die Arme fallen" },
  "help-touch": { q: "Ein stressiger Morgen vor der Arbeit. Was rettet ihn?", a: "Sie bügeln dein Hemd und machen dir Kaffee", b: "Eine ruhige Hand auf deinem Rücken, während du herumwirbelst" },
};
export const careGive: string = "Und wie zeigst DU am liebsten, dass dir jemand wichtig ist?";

export const shadow: Record<string, string> = {
  "pride-s": "Es fällt mir schwer zuzugeben, wenn ich falschliege.", "pride-l": "Ich gönne anderen gern die Anerkennung, die sie verdienen.",
  "greed-s": "Ich habe oft das Gefühl, mehr zu brauchen (Geld, Dinge, Status), bevor ich entspannen kann.", "greed-l": "Ich teile gern, was ich habe, auch wenn es mich etwas kostet.",
  "desire-s": "Wenn ich etwas stark will, fällt mir Warten schwer.", "desire-l": "Ich kann starkes Verlangen spüren, ohne dass es meine Entscheidungen lenkt.",
  "envy-s": "Der Erfolg anderer kann wehtun, selbst wenn ich mich für sie freue.", "envy-l": "Wenn es jemandem gut geht, spornt mich das an zu wachsen.",
  "excess-s": "Bei angenehmen Dingen übertreibe ich gern: Essen, Scrollen, Shoppen, Drinks.", "excess-l": "Ich merke, wann es genug ist, und höre auf.",
  "anger-s": "Wenn ich mich ungerecht behandelt fühle, kommt die Wut schnell und heftig.", "anger-l": "Ich bleibe ruhig und höre zu, auch wenn ich frustriert bin.",
  "inertia-s": "Wichtige Dinge schiebe ich bis zur letzten Minute auf.", "inertia-l": "Wenn ich mich auf etwas einlasse, ziehe ich es durch.",
};

export const dosha: Record<string, { q: string; options: [string, string, string] }> = {
  frame: { q: "Mein Körperbau ist von Natur aus…", options: ["leicht und schlank", "mittel und sportlich", "kräftig und breit"] },
  skin: { q: "Meine Haut ist eher…", options: ["trocken und kühl", "warm, empfindlich, rötet sich schnell", "glatt, weich, etwas fettig"] },
  appetite: { q: "Mein Appetit ist…", options: ["unregelmäßig, ich vergesse zu essen", "stark, hungrig werde ich gereizt", "gleichmäßig, eine Mahlzeit auslassen ist kein Problem"] },
  digestion: { q: "Nach dem Essen fühle ich mich meist…", options: ["unterschiedlich, manchmal aufgebläht", "schnell wieder gut, manchmal Sodbrennen", "schwer und träge nach großen Portionen"] },
  sleep: { q: "Mein Schlaf ist…", options: ["leicht, schnell unterbrochen", "mittel und erholsam", "tief und lang, ich wache schwer auf"] },
  climate: { q: "Am wenigsten mag ich Wetter, das…", options: ["kalt und windig ist", "heiß und schwül ist", "feucht und grau ist"] },
  pace: { q: "Ich arbeite meistens…", options: ["schnell, vieles gleichzeitig", "fokussiert und zielstrebig", "langsam, stetig, methodisch"] },
  speech: { q: "Meine Art zu sprechen ist…", options: ["schnell, springe zwischen Themen", "scharf, präzise, überzeugend", "ruhig, langsam und warm"] },
  stress: { q: "Unter Stress werde ich…", options: ["ängstlich und besorgt", "gereizt oder wütend", "zurückgezogen oder stur"] },
  memory: { q: "Wenn ich etwas lerne…", options: ["lerne ich schnell und vergesse schnell", "merke ich es mir klar", "lerne ich langsam, vergesse aber nie"] },
  energy: { q: "Meine Energie kommt…", options: ["in Schüben, dann bin ich platt", "kräftig und den ganzen Tag über", "gleichmäßig mit viel Ausdauer, langsamer Start"] },
  "weather-mood": { q: "Meine Stimmung ist am ehesten wie…", options: ["wechselhafter Wind", "ein heller Sommertag", "ein stiller See"] },
};

export const explorer: Record<string, { q: string; left: string; right: string }> = {
  routine: { q: "Wenn etwas Neues auftaucht, …", left: "bleibe ich bei dem, was funktioniert", right: "werde ich neugierig und probiere Neues" },
  persistence: { q: "Wenn ein Plan nicht klappt, …", left: "ziehe ich ihn noch härter durch", right: "trete ich zurück und ändere den Kurs" },
  simplify: { q: "Bei komplexen Problemen…", left: "suche ich die einfache Antwort", right: "mag ich es, die Feinheiten zu erkunden" },
  certainty: { q: "Meine Meinungen sind…", left: "meist fest und klar", right: "immer offen für andere Blickwinkel" },
  evidence: { q: "Ich entscheide vor allem nach…", left: "dem, was schon funktioniert hat", right: "frischem Nachdenken" },
  image: { q: "Am wichtigsten ist mir…", left: "was andere denken", right: "was ich wirklich denke, auch wenn es unbeliebt ist" },
};
export const stance: Record<string, string> = {
  conf1: "In einer Gruppe übernehme ich ganz natürlich die Führung.",
  conf2: "Ich halte meine Meinung oft zurück, um andere nicht zu stören.",
  trust1: "In den meisten Gruppen fühle ich mich zugehörig.",
  trust2: "Ich bleibe lieber außerhalb von Gruppen und mache mein eigenes Ding.",
};

export const bond: Record<string, string> = {
  appreciation: "Ich fühle mich von {name} wertgeschätzt.",
  trust: "Ich vertraue darauf, dass {name} hinter mir steht.",
  commitment: "Ich spüre, dass {name} zu unserer Verbindung steht.",
  repair: "Wenn wir streiten, finden wir wieder zueinander.",
  fun: "Wir lachen viel und haben Spaß zusammen.",
  understood: "Ich fühle mich von {name} verstanden.",
  safety: "Ich kann {name} ohne Angst sagen, was ich brauche.",
  growth: "Wir helfen einander zu wachsen und Neues zu probieren.",
};
export const bondDims: Record<string, { name: string; strength: string; growth: string; practice: string }> = {
  appreciation: { name: "Wertschätzung", strength: "Ihr fühlt euch beide geschätzt: ein starker Hinweis auf eine dauerhafte Verbindung.", growth: "Die Wertschätzung geht im Alltag vielleicht unter.", practice: "Erzählt euch diese Woche jeden Abend eine konkrete Sache, die ihr am anderen geschätzt habt." },
  trust: { name: "Vertrauen", strength: "Ihr fühlt euch sicher, euch aufeinander zu verlassen.", growth: "Das Vertrauen braucht vielleicht etwas Pflege.", practice: "Gib ein kleines Versprechen und halte es sichtbar." },
  commitment: { name: "Verbindlichkeit", strength: "Ihr spürt beide, dass der andere es ernst meint.", growth: "Einer von euch ist vielleicht unsicher, wohin das führt.", practice: "Sprecht darüber, wie eure Verbindung in einem Jahr aussehen soll." },
  repair: { name: "Versöhnung nach Streit", strength: "Ihr wisst, wie ihr nach Reibung wieder zusammenfindet.", growth: "Streit bleibt vielleicht ohne Versöhnung hängen.", practice: "Einigt euch auf einen Versöhnungssatz, etwa: Fangen wir nochmal an?" },
  fun: { name: "Spaß und Leichtigkeit", strength: "Ihr genießt einander wirklich.", growth: "Das Spielerische ist vielleicht nach hinten gerutscht.", practice: "Macht innerhalb von 7 Tagen etwas Neues und Albernes zusammen." },
  understood: { name: "Sich verstanden fühlen", strength: "Ihr fühlt euch voneinander gesehen.", growth: "Das Gefühl, verstanden zu werden, könnte stärker sein.", practice: "Probiere im nächsten Gespräch: Ich höre, dass du sagst…" },
  safety: { name: "Sicher sprechen können", strength: "Ihr könnt Bedürfnisse ohne Angst aussprechen.", growth: "Etwas anzusprechen fühlt sich gerade vielleicht riskant an.", practice: "Legt einen wöchentlichen 15-Minuten-Check-in fest, in dem beide liebevoll alles sagen dürfen." },
  growth: { name: "Gemeinsam wachsen", strength: "Ihr bringt das Beste im anderen hervor.", growth: "Ihr wünscht euch vielleicht mehr gemeinsames Wachstum.", practice: "Sucht euch für diesen Monat eine Sache aus, die ihr zusammen lernt oder ausprobiert." },
};

export const meta: Record<"big-five" | "attachment" | "nine" | "care" | "shadow" | "dosha" | "explorer", { title: string; tagline: string; intro: string; unlocks: string; note?: string }> = {
  "big-five": { title: "Big Five", tagline: "Der am besten erforschte Persönlichkeitstest", intro: "Bewerte, wie gut jede Aussage dich im Allgemeinen beschreibt, so wie du jetzt bist, nicht wie du gern wärst.", unlocks: "Big Five · vier Temperamente · Vier-Buchstaben-Stil · Yin-Yang-Feinschliff", note: "Aussagen: Mini-IPIP (Donnellan et al., 2006) aus dem gemeinfreien International Personality Item Pool (ipip.ori.org)." },
  "attachment": { title: "Bindungsstil", tagline: "Nähe und Freiraum in der Liebe", intro: "Denk an deine engen Beziehungen insgesamt (Partner, enge Freunde oder Familie).", unlocks: "Bindungsstil · Einsicht in Verfolgen und Rückzug", note: "Eigene Aussagen zu den zwei gut erforschten Dimensionen (Angst und Vermeidung). Ein kurzes Werkzeug zur Selbstreflexion, kein klinischer Test." },
  "nine": { title: "Neun Motive", tagline: "Was dich im Kern antreibt", intro: "Wie sehr trifft jede Aussage auf dich zu?", unlocks: "Neun-Motive-Stil · Flügel · Richtung bei Wachstum und Stress" },
  "care": { title: "Zuwendungsstile", tagline: "Wie du Zuwendung gibst und empfängst", intro: "Wähle, was dir mehr bedeuten würde. Es gibt keine falschen Antworten.", unlocks: "Zuwendungsstile · Übersetzungskarte im Partnercheck" },
  "shadow": { title: "Schatten und Licht", tagline: "Deine Schwachstellen und verborgenen Gaben", intro: "Sei ehrlich. Das bleibt privat und dient deinem Wachstum. Jeder Schatten trägt eine Gabe.", unlocks: "Schatten-und-Licht-Profil · Schattentanz im Partnercheck", note: "Eigene Aussagen, angelehnt an Forschung zu Neid, Gier, Wut und Selbstkontrolle. Nur zur Reflexion, nie ein moralisches Urteil." },
  "dosha": { title: "Körpertyp", tagline: "Ayurveda für deine Energie", intro: "Wähle, was den größten Teil deines Lebens am meisten auf dich zutraf. Diesen Test kannst du überspringen, er ist freiwillig.", unlocks: "Körper- und Energietyp · ausgleichende Rituale" },
  "explorer": { title: "Autopilot oder Entdecker", tagline: "Wie dein Kopf arbeitet", intro: "Schieb den Regler zu der Seite, die eher zu dir passt.", unlocks: "Autopilot- oder Entdeckergeist · Karte deiner sozialen Haltung" },
};
