import type { Element } from "@/engine/zodiac";
import type { AttachStyle, Dosha } from "@/engine/quizzes";
import type { Temperament } from "@/engine/bigfive";

type E4 = Record<Element, string>;

export const sunMoon: Record<Element, E4> = {
  fire: {
    fire: "Dein Kern und dein Gefühlsleben brennen mit demselben Feuer. Was du willst und was du fühlst, steht selten im Konflikt. Du kennst dein Herz und handelst danach. Die Gabe ist enorme Lebenskraft und Ehrlichkeit; das Risiko: Es gibt kein inneres Wasser, das dich abkühlt, also musst du Ruhe und Nachdenken bewusst wählen.",
    earth: "Dein feuriger Kern will Abenteuer und Tat, dein erdiges Herz will Sicherheit, Behaglichkeit und Dinge, die bleiben. Vielleicht spürst du den Sog einer kühnen Idee und brauchst dann Zeit, um sicherzugehen, dass sie trägt. Zusammen machen sie dich zu etwas Seltenem: jemand, der inspiriert baut und den Traum wirklich zu Ende bringt.",
    air: "Feuer und Luft nähren einander: Dein Wille wird von Ideen und Gesprächen angefacht, und deine Gefühle bewegen sich schnell durch Worte. Du bist lebendig, überzeugend und optimistisch. Dein Wachstum ist, langsam genug zu werden, um zu fühlen, was du denkst, und nicht nur zu denken, was du fühlst.",
    water: "Dein feuriger Kern ist kühn und nach außen gerichtet, doch dein Herz ist ein tiefes, empfindsames Meer. Außenstehende sehen vielleicht nur das Selbstvertrauen; wer dir nah ist, weiß, wie viel du fühlst. Dampf entsteht, wenn Feuer auf Wasser trifft. Du bist zu intensiver Leidenschaft fähig und kannst dich auch überflutet fühlen. Ehre beides: Tat für das Feuer, Stille für das Wasser.",
  },
  earth: {
    fire: "Dein Kern ist beständig und praktisch, aber dein Gefühlsleben trägt einen Funken Feuer. Du fühlst mutig und reagierst schnell und überraschst manchmal Menschen, die dich für ruhig hielten. Die Erde gibt deinem Feuer einen Herd; das Feuer gibt deiner Erde Wärme und Antrieb.",
    earth: "Dein Kern und dein Herz sind beide aus Erde: geerdet, treu, praktisch und geduldig. Du weißt, was dir wichtig ist, und baust stetig darauf hin. Menschen finden dich beruhigend, wie ein Licht, das vor der Tür brennt. Dein Risiko ist, festzustecken: Gönn dir kleine Portionen Neues, damit der Boden fruchtbar bleibt.",
    air: "Dein praktischer Kern trifft auf ein Herz, das über Ideen und Gespräche verarbeitet. Vielleicht analysierst du deine Gefühle und baust dann vernünftige Pläne darum. Du verbindest gesunden Menschenverstand mit Neugier: eine feine Mischung, um echte Probleme zu lösen, solange du die Gefühle auch fühlst und nicht nur sortierst.",
    water: "Erde und Wasser ergeben einen Garten. Dein Kern ist praktisch und beständig; dein Herz ist tief, fürsorglich und intuitiv. Du nährst ganz natürlich Menschen und Dinge und fühlst dich mit treuen Menschen und einem echten Zuhause am sichersten. Hüte dich vor Sorgen und zu viel Fürsorge; du bist der Boden, nicht der ganze Wald.",
  },
  air: {
    fire: "Dein denkender Kern wird von einem feurigen Herzen entzündet. Du fühlst leidenschaftlich für Ideen, Menschen und Anliegen und sprichst deine Gefühle schnell aus. Du bist inspirierend, warm und ein bisschen ungeduldig. Lass manche Gefühle köcheln, bevor sie zu Erklärungen werden.",
    earth: "Dein luftiger Kern liebt Ideen, dein Herz will festen Boden. Vielleicht träumst du groß und fühlst dich erst sicher, wenn der Plan praktisch ist. Das gibt dir eine besondere Gabe: Ideen wahr zu machen. Denk daran, deinem Herzen auch einfache Freuden zu gönnen, nicht nur Pläne.",
    air: "Dein Kern und dein Herz leben beide in der Luft: Du verstehst Gefühle, indem du über sie nachdenkst und redest, und du brauchst geistige Verbindung, um dich nah zu fühlen. Du bist offen, gesellig und fair. Das Risiko ist, im Kopf zu leben. Auch dein Körper und deine tieferen Gefühle verdienen eine Stimme.",
    water: "Dein denkender Kern trifft auf ein tiefes, gefühlvolles Herz. Du kannst Menschen mit dem Verstand begreifen und intuitiv spüren: eine starke Mischung fürs Schreiben, Beraten oder die Kunst. Manchmal versucht der Kopf wegzuerklären, was das Herz weiß; lass die beiden miteinander reden.",
  },
  water: {
    fire: "Dein Kern ist tief und gefühlvoll, aber dein Herz reagiert mit Feuer: schnell, leidenschaftlich, manchmal heftig. Vielleicht bist du empfindsam und dann plötzlich kühn. Deine Leidenschaft schützt deine Weichheit; deine Weichheit gibt deiner Leidenschaft Sinn.",
    earth: "Dein Wasserkern ist intuitiv und gefühlvoll, und dein Herz sucht festen Boden. Du fühlst tief und beruhigst dich dann durch Routine, Behaglichkeit und praktische Fürsorge. Du kümmerst dich um Menschen und bleibst beständig, darum sehen andere in dir ihren sicheren Ort.",
    air: "Dein Kern ist tief und emotional, aber dein Herz verarbeitet mit etwas Abstand, durch Verstehen und Reden. Vielleicht fühlst du Dinge intensiv und trittst dann zurück, um sie zu analysieren. Das gibt dir Einfühlung und Weitblick zugleich.",
    water: "Dein Kern und dein Herz sind beide Ozeane. Du fühlst alles, spürst das Unausgesprochene und liebst mit deinem ganzen Wesen. Intuition leitet dich. Die Herausforderung sind Grenzen: zu wissen, welche Gefühle deine sind. Auch Wasser braucht ein Ufer, um kraftvoll zu fließen.",
  },
};

export const attachVenus: Record<AttachStyle, E4> = {
  secure: {
    fire: "Deine sichere Basis schenkt deiner feurigen Venus etwas Kostbares: Leidenschaft ohne Panik. Du kannst werben, flirten und anbeten, ohne ständig Beweise zurück zu brauchen.",
    earth: "Sicherheit plus erdige Venus machen dich zu einem der verlässlichsten Liebesmenschen im Tierkreis: treu, sinnlich und ruhig. Denk daran, Überraschungen einzubauen.",
    air: "Dein sicheres Herz und deine luftige Venus lassen Liebe wie eine großartige Freundschaft wirken: ehrlich, leicht und gleichberechtigt.",
    water: "Deine sichere Basis lässt deine wässrige Venus mit ganzem Herzen lieben, ohne darin zu ertrinken. Du kannst zärtlich sein und trotzdem in deiner Form bleiben.",
  },
  anxious: {
    fire: "Deine feurige Venus liebt kühn, und deine ängstliche Bindung kann aus dieser Kühnheit ein Hinterherjagen machen. Wenn du unsicher bist, halte inne, bevor du jemandem nachläufst: Leidenschaft kommt besser an, wenn sie keine verkleidete Angst ist.",
    earth: "Deine erdige Venus will beständige Treue, und deine ängstliche Bindung bemerkt jedes Wackeln darin. Konkrete, beständige Menschen beruhigen dich am meisten; sag ihnen, dass Verlässlichkeit für dich Romantik ist.",
    air: "Deine luftige Venus liebt durch Worte, und Angst lässt dich vielleicht jede Nachricht zehnmal lesen. Bitte um das Gespräch, das du brauchst, statt das zu entschlüsseln, das du bekommen hast.",
    water: "Deine wässrige Venus liebt mit totaler Hingabe, und Angst lässt dich fürchten, dass die Flut zurückgeht. Halt in Freundschaften und Routinen sorgt dafür, dass deine Liebe nicht dein ganzer Ozean wird.",
  },
  avoidant: {
    fire: "Deine feurige Venus spürt Anziehung stark, und dein vermeidendes Muster kühlt sie vielleicht plötzlich ab, wenn es ernst wird. Achte auf den Moment, in dem du weglaufen willst. Er kommt oft genau vor echter Nähe.",
    earth: "Deine erdige Venus ist treu, und dein vermeidendes Muster zeigt Liebe durch Taten statt durch Gefühle. Dein Gegenüber braucht vielleicht auch Worte; ein paar bewirken viel.",
    air: "Luftige Venus plus vermeidende Bindung lassen dich in der Liebe Freiheit und Freundschaft lieben und Gefühle im Kopf halten. Jemandem deine weichere Seite zu zeigen ist dein nächstes Abenteuer.",
    water: "Deine wässrige Venus fühlt sehr viel, aber dein vermeidendes Muster versteckt es vielleicht. Vielleicht liebst du jemanden intensiv aus vorsichtiger Entfernung. Lass einen Menschen herein, langsam.",
  },
  fearful: {
    fire: "Deine feurige Venus stürmt auf die Liebe zu, während Angst dich zurückzieht: ein Hin und Her, das sich dramatisch anfühlen kann. Ruhige, beständige Menschen geben deinem Feuer einen sicheren Herd.",
    earth: "Deine erdige Venus sehnt sich nach Stabilität, und Angst macht es schwer, ihr zu trauen. Bau Vertrauen über kleine, gehaltene Versprechen auf und lass die Zeit ihre leise Arbeit tun.",
    air: "Deine luftige Venus will Verbindung durch Gespräch, und Angst lässt dich vielleicht testen oder dich zurückziehen. Deine gemischten Gefühle laut zu benennen ist oft die Brücke.",
    water: "Deine wässrige Venus liebt stark und sorgt sich stark. Sanfte, beständige Menschen und tragende Freundschaften helfen deinem Herzen zu lernen, dass Liebe sicher sein kann.",
  },
};

export const sensitivityMoon: Record<"low" | "mid" | "high", E4> = {
  low: { fire: "Dein feuriger Mond und dein ruhiges Nervensystem lassen dich schnell fühlen und schnell erholen: ein widerstandsfähiger Geist.", earth: "Dein erdiger Mond und deine ruhigen Nerven machen dich ungewöhnlich beständig; in Krisen stützen sich Menschen auf dich.", air: "Dein luftiger Mond und deine ruhigen Nerven lassen dich klar und gelassen über Gefühle sprechen.", water: "Dein wässriger Mond fühlt alles, und trotzdem bleibt dein Nervensystem ruhig: Tiefe, ohne zu ertrinken." },
  mid: { fire: "Dein feuriger Mond lodert auf und beruhigt sich; deine mittlere Empfindsamkeit heißt, du spürst Stress, kommst aber zurück.", earth: "Dein erdiger Mond und deine ausgewogene Empfindsamkeit geben dir Ruhe mit echtem Gefühl darunter.", air: "Dein luftiger Mond hilft dir, Stress wegzureden, und meist findest du dein Gleichgewicht.", water: "Dein wässriger Mond fühlt viel, und meist erholst du dich mit Zeit und Fürsorge." },
  high: { fire: "Dein feuriger Mond und deine hohe Empfindsamkeit können Gefühle wie ein Lauffeuer wirken lassen. Bewegung und kühlende Pausen sind deine beste Medizin.", earth: "Dein erdiger Mond will Ruhe, und dein empfindsames Nervensystem sorgt sich, wenn es sie nicht findet. Routinen und Natur sind für dich besonders heilsam.", air: "Dein luftiger Mond und deine hohe Empfindsamkeit können Gefühle in rasende Gedanken verwandeln. Schreiben und Reden mit einem ruhigen Menschen klären den Himmel.", water: "Dein wässriger Mond und deine hohe Empfindsamkeit machen dich zu einem Gefühlsozean. Du brauchst regelmäßig Zeit allein, sanfte Menschen und klare Grenzen, und deine Einfühlung ist ein echtes Geschenk." },
};

export const workStyle: Record<"low" | "mid" | "high", Record<"cardinal" | "fixed" | "mutable", string>> = {
  low: { cardinal: "Du startest gern und arbeitest flexibel: brillant beim Anstoßen, weniger begeistert vom Dranbleiben. Tu dich mit Menschen zusammen, die gern abschließen.", fixed: "Du bist beständig im Ziel, aber locker in der Methode: treu dem Ziel, improvisierend auf dem Weg.", mutable: "Du bist durch und durch anpassungsfähig: stark im Chaos, herausgefordert von Routine. Feste Fristen von außen sind deine Freunde." },
  mid: { cardinal: "Du stößt Dinge an und kannst auch das Dranbleiben organisieren, wenn es zählt.", fixed: "Du bleibst mit ausgewogener Disziplin dran: beharrlich, ohne starr zu sein.", mutable: "Du passt dich leicht an und kannst dich trotzdem organisieren, wenn es nötig ist." },
  high: { cardinal: "Du fängst an und bringst zu Ende: eine natürliche Führungskraft, die Pläne macht und umsetzt.", fixed: "Du bist unerschütterlich verlässlich: Wenn du zugesagt hast, ziehst du es bis zum Ende durch.", mutable: "Du verbindest Flexibilität mit Disziplin: Du kannst Pläne anpassen, ohne an Qualität zu verlieren." },
};

export const doshaTemperament: Record<Dosha, Record<Temperament, string>> = {
  vata: { sanguine: "Luftiger Körper, luftiger Geist: Du bist leicht, schnell und gesellig. Erdende Routinen sorgen dafür, dass dein Funkeln nicht zu zerstreuter Müdigkeit wird.", choleric: "Ein schneller, luftiger Körper mit feurigem Antrieb: Du gibst in Schüben alles. Achte auf deine Energiereserven.", melancholic: "Ein leichter Körper mit tiefem, nachdenklichem Geist: kreativ, aber anfällig für Sorgen. Wärme und Routine beruhigen dich.", phlegmatic: "Ein leichter, wechselhafter Körper mit ruhigem Temperament: ein ungewöhnliches Gleichgewicht. Halte einen beständigen Rhythmus." },
  pitta: { sanguine: "Ein warmer, kräftiger Körper und ein geselliger Geist: charismatisch und energiegeladen.", choleric: "Feuer auf Feuer: scharf, getrieben und leidenschaftlich. Kühlende Gewohnheiten und Spiel bewahren dich vor dem Ausbrennen.", melancholic: "Ein warmer, intensiver Körper mit tiefem Geist: fokussiert und perfektionistisch. Sei sanft mit dir.", phlegmatic: "Ein warmer Körper mit ruhigem Geist: fokussiert und doch beständig." },
  kapha: { sanguine: "Ein beständiger Körper mit geselligem Geist: warm, verlässlich und lustig.", choleric: "Ein starker, ausdauernder Körper mit getriebenem Geist: kraftvoll und beharrlich.", melancholic: "Ein beständiger Körper mit tiefem Geist: treu und nachdenklich. Bewegung und Neues halten dich leicht.", phlegmatic: "Durch und durch Erde und Wasser: ruhig, treu, geduldig. Anregung und Bewegung halten dich lebendig." },
};

export const elementVoice: E4 = {
  fire: "Tat, Mut, Begeisterung und das Bedürfnis, gesehen zu werden und dich zu bewegen",
  earth: "Beständigkeit, Treue, Praxis und das Bedürfnis nach Sicherheit und echten Ergebnissen",
  air: "Ideen, Verbindung, Neugier und das Bedürfnis nach Freiheit und Gespräch",
  water: "Gefühl, Intuition, Tiefe und das Bedürfnis nach Nähe und Sinn",
};
export const elementMissing: E4 = {
  fire: "Mit wenig Feuer wollen Antrieb und Selbstbehauptung vielleicht gepflegt werden. Sonne, Bewegung, Musik und kleine mutige Taten bringen Wärme.",
  earth: "Mit wenig Erde brauchen praktische Routinen und der Körper vielleicht Aufmerksamkeit. Regelmäßige Mahlzeiten, Natur und einfache Pläne erden dich.",
  air: "Mit wenig Luft brauchen Weitblick und Kommunikation vielleicht Aufmerksamkeit. Lesen, Reden und frische Luft bringen Leichtigkeit.",
  water: "Mit wenig Wasser brauchen Gefühle und Ruhe vielleicht Aufmerksamkeit. Wasser, Musik, Kunst und zärtliche Zeit bringen Fluss.",
};
export const elementBoost: E4 = {
  fire: "Luft und Feuermenschen stärken dich meist: Luft facht deine Flamme mit Ideen und Freiheit an, Feuer hält dein Tempo. Erde und Wasser stabilisieren und vertiefen dich: weniger leicht, oft mehr Wachstum.",
  earth: "Wasser und Erdmenschen stärken dich meist: Wasser nährt deinen Boden, Erde teilt deinen Rhythmus. Feuer und Luft bringen Bewegung und Inspiration, die dir sonst fehlen könnten.",
  air: "Feuer und Luftmenschen stärken dich meist: Feuer gibt deinen Ideen Hitze, Luft teilt deine Freude am Reden. Erde und Wasser erden und vertiefen dich.",
  water: "Erd und Wassermenschen stärken dich meist: Erde gibt deinem Wasser ein Ufer, Wasser versteht ohne Worte. Feuer und Luft bringen Energie und Weitblick.",
};
export const elementRitual: E4 = {
  fire: "Feuerritual: Zünde bei Sonnenaufgang oder untergang eine Kerze an, nenne eine mutige Tat für den Tag und beweg deinen Körper, bis dir warm ist.",
  earth: "Erdritual: Geh barfuß, pflege eine Pflanze oder koch langsam und nenne drei Dinge an deinem Körper, für die du dankbar bist.",
  air: "Luftritual: Öffne ein Fenster, atme zehnmal langsam und schreib fünf Minuten frei, ohne anzuhalten.",
  water: "Wasserritual: Nimm ein langsames Bad oder eine Dusche, stell dir vor, wie du den Tag loslässt, und hör ein Musikstück mit geschlossenen Augen.",
};

export const attachBoost: Record<AttachStyle, string> = {
  secure: "Dich stärken Menschen, die ebenfalls sicher gebunden sind, und du kannst für ängstliche oder vermeidende Freunde heilsam sein, solange die Mühe geteilt wird.",
  anxious: "Am meisten stärken dich sichere, beständige Menschen, die antworten, Versprechen halten und sagen, was sie fühlen. Aufregende, aber unberechenbare Menschen füttern eher die Angst, als sie zu heilen.",
  avoidant: "Am meisten stärken dich sichere Menschen, die dir Raum lassen, ohne dich dafür zu bestrafen, und dich sanft näher einladen.",
  fearful: "Am meisten stärken dich ruhige, geduldige, beständige Menschen und tragende Freundschaften, die so heilsam sein können wie Romantik.",
};
export const attachHeal: Record<AttachStyle, string> = {
  secure: "Du heilst durch ehrliche Gespräche und verlässliche Verbindung und indem du deine eigenen Bedürfnisse auf dem Tisch lässt.",
  anxious: "Du heilst, indem du innere Sicherheit aufbaust: dich selbst beruhigen, Freundschaften, die dich halten, und Beziehungen, in denen Taten zu Worten passen.",
  avoidant: "Du heilst, indem du kleine Mengen Fürsorge hereinlässt und entdeckst, dass gebraucht zu werden nicht heißen muss, gefangen zu sein.",
  fearful: "Du heilst langsam und sicher mit beständigen, sicheren Menschen, erdenden Gewohnheiten und, wenn alter Schmerz schwer wiegt, einer guten Therapie.",
};
export const doshaBoost: Record<Dosha, string> = {
  vata: "Geerdete, warme, beständige Menschen (oft Kapha) helfen dir anzukommen; andere luftige Typen zünden Ideen, können euch beide aber zerstreuen.",
  pitta: "Ruhige, kühlende, entspannte Menschen helfen dir weicher zu werden; andere Feuertypen inspirieren dich, können aber konkurrieren.",
  kapha: "Lebhafte, energiegeladene Menschen (Vata oder Pitta) bringen dich in Bewegung; andere beständige Typen fühlen sich gemütlich an, können euch aber beide stillhalten.",
};

export const jupiterHouse: string[] = [
  "Jupiter wandert durch dein eigenes Zeichen: ein Jahr persönlichen Wachstums, Selbstvertrauens und neuer Anfänge. Sag Ja zu Chancen, über dich hinauszuwachsen.",
  "Jupiter wandert durch dein Haus der Ressourcen: Chancen, Einkommen, Fähigkeiten und Selbstwert wachsen zu lassen. Investiere in das, was dir wichtig ist.",
  "Jupiter wandert durch dein Haus der Kommunikation: Lernen, Schreiben, kurze Reisen und gute Gespräche öffnen Türen.",
  "Jupiter wandert durch dein Haus des Zuhauses: eine gute Zeit für Familie, ein neues Zuhause oder das Heilen deiner Wurzeln.",
  "Jupiter wandert durch dein Haus der Freude: Romantik, Kreativität, Spiel und Kinder bringen Segen. Hab mehr Spaß.",
  "Jupiter wandert durch dein Haus von Arbeit und Gesundheit: bessere Routinen, ein gesünderer Körper und erfüllendere tägliche Arbeit.",
  "Jupiter wandert durch dein Haus der Partnerschaft: Beziehungen wachsen, und wichtige Menschen treten vielleicht in dein Leben.",
  "Jupiter wandert durch dein Haus der Tiefe: Nähe, geteilte Ressourcen und innere Verwandlung wachsen.",
  "Jupiter wandert durch dein Haus der Horizonte: Reisen, Studium und große Ideen rufen dich.",
  "Jupiter wandert durch dein Haus des Berufs: Anerkennung und beruflicher Aufstieg sind möglich. Ziel höher.",
  "Jupiter wandert durch dein Haus der Freundschaft: Gemeinschaft, Netzwerke und Hoffnungen für die Zukunft blühen.",
  "Jupiter wandert durch dein Haus der inneren Welt: ein ruhigeres Jahr spirituellen Wachstums, der Erholung und Vorbereitung auf einen neuen Zyklus.",
];
export const saturnHouse: string[] = [
  "Saturn wandert durch dein eigenes Zeichen: eine ernste, reifende Zeit. Übernimm Verantwortung für den Menschen, der du wirst.",
  "Saturn prüft deine Finanzen und deinen Selbstwert: Plane dein Budget, bau Fähigkeiten auf, schätz dich realistisch.",
  "Saturn verlangt Disziplin beim Lernen und Kommunizieren: Lerne, schreib, sag, was du meinst.",
  "Saturn arbeitet an deinem Fundament: Zuhause, Familienpflichten und innere Sicherheit brauchen Struktur.",
  "Saturn verlangt Verbindlichkeit in Liebe und Kreativität: ernsthafte Projekte, ernsthafte Herzen.",
  "Saturn ordnet deine Arbeit und Gesundheit: Beständige Routinen zahlen sich jetzt jahrelang aus.",
  "Saturn prüft Partnerschaften: Bindungen vertiefen sich oder enden. Klarheit in Beziehungen.",
  "Saturn wandert durch dein Haus der Tiefe: Gemeinsames Geld, Nähe und alte Ängste verlangen ehrliche Arbeit.",
  "Saturn strukturiert deine Überzeugungen und Studien: lange Kurse, ernsthafte Reisen, eine reife Lebensphilosophie.",
  "Saturn wandert durch deinen Berufsbereich: harte Arbeit, Verantwortung und echte Autorität.",
  "Saturn prüft Freundschaften und Ziele: weniger, aber echtere Freunde; realistische langfristige Hoffnungen.",
  "Saturn wandert durch deine innere Welt: Ruhe, Abschluss und stille Vorbereitung. Lass los, was vollendet ist.",
];
