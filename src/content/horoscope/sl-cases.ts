/**
 * Slovenian case forms. Sign names, planets, Moon phases, weekdays, months and house topics reach the templates in the
 * nominative, and Slovenian wants another case after almost every preposition ("v Biku", "z Venero", "pod polno Luno").
 * Every form lives here once, so a template only names the case it needs. Input this file does not know comes back
 * unchanged, so a seam can look odd but never break. Gemini and Pisces are dual in Slovenian (Dvojčka, Ribi).
 */

/** acc, gen, loc, ins */
const SIGNS: Record<string, [string, string, string, string]> = {
  Oven: ["Ovna", "Ovna", "Ovnu", "Ovnom"],
  Bik: ["Bika", "Bika", "Biku", "Bikom"],
  "Dvojčka": ["Dvojčka", "Dvojčkov", "Dvojčkih", "Dvojčkoma"],
  Rak: ["Raka", "Raka", "Raku", "Rakom"],
  Lev: ["Leva", "Leva", "Levu", "Levom"],
  Devica: ["Devico", "Device", "Devici", "Devico"],
  Tehtnica: ["Tehtnico", "Tehtnice", "Tehtnici", "Tehtnico"],
  "Škorpijon": ["Škorpijona", "Škorpijona", "Škorpijonu", "Škorpijonom"],
  Strelec: ["Strelca", "Strelca", "Strelcu", "Strelcem"],
  Kozorog: ["Kozoroga", "Kozoroga", "Kozorogu", "Kozorogom"],
  Vodnar: ["Vodnarja", "Vodnarja", "Vodnarju", "Vodnarjem"],
  Ribi: ["Ribi", "Rib", "Ribah", "Ribama"],
};
const signForm = (s: string, i: number) => SIGNS[s]?.[i] ?? s;
/** "za Ovna", "vstopi v Škorpijona", "skozi Dvojčka". */
export const sAcc = (s: string) => signForm(s, 0);
/** "iz Ovna", "do Rib". */
export const sGen = (s: string) => signForm(s, 1);
/** "v Biku", "v Ribah". */
export const sLoc = (s: string) => signForm(s, 2);
/** "z Levom". */
export const sIns = (s: string) => signForm(s, 3);

/** "s" before a voiceless consonant, "z" everywhere else: "s Soncem", "z Venero", "s tvojim telesom". */
export const sz = (next: string) => (/^[ptkfhcčsš]/i.test(next) ? "s" : "z");

/** gen, dat, acc, loc, ins */
const BODIES: Record<string, [string, string, string, string, string]> = {
  Sonce: ["Sonca", "Soncu", "Sonce", "Soncu", "Soncem"], Merkur: ["Merkurja", "Merkurju", "Merkur", "Merkurju", "Merkurjem"], Venera: ["Venere", "Veneri", "Venero", "Veneri", "Venero"],
  Mars: ["Marsa", "Marsu", "Mars", "Marsu", "Marsom"], Jupiter: ["Jupitra", "Jupitru", "Jupiter", "Jupitru", "Jupitrom"], Saturn: ["Saturna", "Saturnu", "Saturn", "Saturnu", "Saturnom"],
  Uran: ["Urana", "Uranu", "Uran", "Uranu", "Uranom"], Neptun: ["Neptuna", "Neptunu", "Neptun", "Neptunu", "Neptunom"], Pluton: ["Plutona", "Plutonu", "Pluton", "Plutonu", "Plutonom"],
};
const bodyForm = (b: string, i: number) => BODIES[b]?.[i] ?? b;
export const bGen = (b: string) => bodyForm(b, 0);
export const bDat = (b: string) => bodyForm(b, 1);
export const bAcc = (b: string) => bodyForm(b, 2);
export const bLoc = (b: string) => bodyForm(b, 3);
export const bIns = (b: string) => bodyForm(b, 4);
/** The instrumental with its preposition: "s Soncem", "z Merkurjem". */
export const bWith = (b: string) => `${sz(bodyForm(b, 4))} ${bodyForm(b, 4)}`;

export type TopicCase = "gen" | "dat" | "acc" | "ins" | "loc";
/** One entry per house. Every topic names two or more things, so a template never uses one as the subject of a verb. */
const TOPICS: ({ nom: string } & Record<TopicCase, string>)[] = [
  { nom: "tvoje telo in prvi vtis", gen: "tvojega telesa in prvega vtisa", dat: "tvojemu telesu in prvemu vtisu", acc: "tvoje telo in prvi vtis", ins: "tvojim telesom in prvim vtisom", loc: "tvojem telesu in prvem vtisu" },
  { nom: "denar, vrednote in udobje", gen: "denarja, vrednot in udobja", dat: "denarju, vrednotam in udobju", acc: "denar, vrednote in udobje", ins: "denarjem, vrednotami in udobjem", loc: "denarju, vrednotah in udobju" },
  { nom: "sporočila, bližnji sorodniki in kratke poti", gen: "sporočil, bližnjih sorodnikov in kratkih poti", dat: "sporočilom, bližnjim sorodnikom in kratkim potem", acc: "sporočila, bližnje sorodnike in kratke poti", ins: "sporočili, bližnjimi sorodniki in kratkimi potmi", loc: "sporočilih, bližnjih sorodnikih in kratkih poteh" },
  { nom: "dom in družina", gen: "doma in družine", dat: "domu in družini", acc: "dom in družino", ins: "domom in družino", loc: "domu in družini" },
  { nom: "romantika, zabava in ustvarjanje", gen: "romantike, zabave in ustvarjanja", dat: "romantiki, zabavi in ustvarjanju", acc: "romantiko, zabavo in ustvarjanje", ins: "romantiko, zabavo in ustvarjanjem", loc: "romantiki, zabavi in ustvarjanju" },
  { nom: "vsakdanje delo in zdravje", gen: "vsakdanjega dela in zdravja", dat: "vsakdanjemu delu in zdravju", acc: "vsakdanje delo in zdravje", ins: "vsakdanjim delom in zdravjem", loc: "vsakdanjem delu in zdravju" },
  { nom: "partnerji in dogovori v štiri oči", gen: "partnerjev in dogovorov v štiri oči", dat: "partnerjem in dogovorom v štiri oči", acc: "partnerje in dogovore v štiri oči", ins: "partnerji in dogovori v štiri oči", loc: "partnerjih in dogovorih v štiri oči" },
  { nom: "bližina, skupni denar in globoke spremembe", gen: "bližine, skupnega denarja in globokih sprememb", dat: "bližini, skupnemu denarju in globokim spremembam", acc: "bližino, skupni denar in globoke spremembe", ins: "bližino, skupnim denarjem in globokimi spremembami", loc: "bližini, skupnem denarju in globokih spremembah" },
  { nom: "učenje, potovanja in velike zamisli", gen: "učenja, potovanj in velikih zamisli", dat: "učenju, potovanjem in velikim zamislim", acc: "učenje, potovanja in velike zamisli", ins: "učenjem, potovanji in velikimi zamislimi", loc: "učenju, potovanjih in velikih zamislih" },
  { nom: "kariera in ugled", gen: "kariere in ugleda", dat: "karieri in ugledu", acc: "kariero in ugled", ins: "kariero in ugledom", loc: "karieri in ugledu" },
  { nom: "prijatelji, skupine in upi", gen: "prijateljev, skupin in upov", dat: "prijateljem, skupinam in upom", acc: "prijatelje, skupine in upe", ins: "prijatelji, skupinami in upi", loc: "prijateljih, skupinah in upih" },
  { nom: "počitek, notranji svet in zaključki", gen: "počitka, notranjega sveta in zaključkov", dat: "počitku, notranjemu svetu in zaključkom", acc: "počitek, notranji svet in zaključke", ins: "počitkom, notranjim svetom in zaključki", loc: "počitku, notranjem svetu in zaključkih" },
];
export const TOPIC_NAMES = TOPICS.map((t) => t.nom) as [string, string, string, string, string, string, string, string, string, string, string, string];
/** A house topic in the case a template needs. */
export const tc = (nom: string, form: TopicCase) => TOPICS.find((t) => t.nom === nom)?.[form] ?? nom;
/** "s tvojim telesom in prvim vtisom", "z denarjem, vrednotami in udobjem". */
export const tWith = (nom: string) => { const f = tc(nom, "ins"); return `${sz(f)} ${f}`; };

/** Moon phases, nominative to [gen, loc, ins, acc]. "pod polno Luno", "ob polni Luni". */
const PHASES: Record<string, [string, string, string, string]> = {
  mlaj: ["mlaja", "mlaju", "mlajem", "mlaj"],
  "naraščajoči srp": ["naraščajočega srpa", "naraščajočem srpu", "naraščajočim srpom", "naraščajoči srp"],
  "prvi krajec": ["prvega krajca", "prvem krajcu", "prvim krajcem", "prvi krajec"],
  "naraščajoča Luna": ["naraščajoče Lune", "naraščajoči Luni", "naraščajočo Luno", "naraščajočo Luno"],
  "polna Luna": ["polne Lune", "polni Luni", "polno Luno", "polno Luno"],
  "pojemajoča Luna": ["pojemajoče Lune", "pojemajoči Luni", "pojemajočo Luno", "pojemajočo Luno"],
  "zadnji krajec": ["zadnjega krajca", "zadnjem krajcu", "zadnjim krajcem", "zadnji krajec"],
  "pojemajoči srp": ["pojemajočega srpa", "pojemajočem srpu", "pojemajočim srpom", "pojemajoči srp"],
};
const phaseForm = (p: string, i: number) => PHASES[p]?.[i] ?? p;
export const phGen = (p: string) => phaseForm(p, 0);
export const phLoc = (p: string) => phaseForm(p, 1);
export const phIns = (p: string) => phaseForm(p, 2);
export const phAcc = (p: string) => phaseForm(p, 3);

const WEEKDAY_ACC: Record<string, string> = { sreda: "sredo", sobota: "soboto", nedelja: "nedeljo" };
/** After "v": "v soboto", "v ponedeljek". */
export const dayAcc = (day: string) => WEEKDAY_ACC[day] ?? day;

/** gen, loc */
const MONTHS: Record<string, [string, string]> = {
  januar: ["januarja", "januarju"], februar: ["februarja", "februarju"], marec: ["marca", "marcu"], april: ["aprila", "aprilu"], maj: ["maja", "maju"], junij: ["junija", "juniju"],
  julij: ["julija", "juliju"], avgust: ["avgusta", "avgustu"], september: ["septembra", "septembru"], oktober: ["oktobra", "oktobru"], november: ["novembra", "novembru"], december: ["decembra", "decembru"],
};
export const mGen = (m: string) => MONTHS[m]?.[0] ?? m;
export const mLoc = (m: string) => MONTHS[m]?.[1] ?? m;

const DATE = /(\d{1,2})\.?\s+(\p{L}+)(?:\s+(\d{4}))?/u;
/** A date in any shape formatDate gives ("5. november", "31. oktober 2026") in the genitive, the form after a bare day: "5. novembra", "31. oktobra 2026". */
export const dGen = (d: string) => d.replace(DATE, (_, n: string, m: string, y?: string) => `${n}. ${mGen(m)}${y ? ` ${y}` : ""}`);
/** "november 2026" to "novembru 2026". */
export const myLoc = (monthYear: string) => monthYear.replace(/^\p{L}+/u, mLoc);

/** The Slovenian count has a dual: 1 ura, 2 uri, 3 ure, 5 ur. */
export const plural = (n: number, one: string, two: string, few: string, many: string) => {
  const t = n % 100;
  return t === 1 ? one : t === 2 ? two : t === 3 || t === 4 ? few : many;
};

/** Ordinals are stored as feminine nominative ("prva"): they always count a hiša. */
export const ordLoc = (o: string) => o.replace(/a$/, "i");
export const ordAcc = (o: string) => o.replace(/a$/, "o");
/** House names are stored after "v", in the locative. For a move: "tvoji tretji hiši" to "tvojo tretjo hišo". */
export const houseAcc = (h: string) => h.replace(/^tvoji (\p{L}+)i hiši$/u, "tvojo $1o hišo");
/** Capitalise a sentence start. */
export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
