/**
 * Serbian case forms. Sign names, months, weekdays, planets and house topics reach the templates in the nominative, and Serbian
 * wants another case after almost every preposition ("za Ovna", "u Biku", "do 12. novembra"). Every form lives here once, so a
 * template only names the case it needs. Input this file does not know comes back unchanged, so a seam can look odd but never break.
 */

/** acc, gen, dat/loc, ins */
const SIGNS: Record<string, [string, string, string, string]> = {
  Ovan: ["Ovna", "Ovna", "Ovnu", "Ovnom"],
  Bik: ["Bika", "Bika", "Biku", "Bikom"],
  Blizanci: ["Blizance", "Blizanaca", "Blizancima", "Blizancima"],
  Rak: ["Raka", "Raka", "Raku", "Rakom"],
  Lav: ["Lava", "Lava", "Lavu", "Lavom"],
  Devica: ["Devicu", "Device", "Devici", "Devicom"],
  Vaga: ["Vagu", "Vage", "Vagi", "Vagom"],
  "Škorpija": ["Škorpiju", "Škorpije", "Škorpiji", "Škorpijom"],
  Strelac: ["Strelca", "Strelca", "Strelcu", "Strelcem"],
  Jarac: ["Jarca", "Jarca", "Jarcu", "Jarcem"],
  Vodolija: ["Vodoliju", "Vodolije", "Vodoliji", "Vodolijom"],
  Ribe: ["Ribe", "Riba", "Ribama", "Ribama"],
};
const signForm = (s: string, i: number) => SIGNS[s]?.[i] ?? s;
/** "za Ovna", "ulazi u Škorpiju", "kroz Blizance". */
export const sAcc = (s: string) => signForm(s, 0);
/** "iz Ovna", "do Vodolije". */
export const sGen = (s: string) => signForm(s, 1);
/** "u Ovnu", "u Ribama". */
export const sLoc = (s: string) => signForm(s, 2);
/** "sa Vagom". */
export const sIns = (s: string) => signForm(s, 3);

/** gen, dat/loc, ins */
const BODIES: Record<string, [string, string, string]> = {
  Sunce: ["Sunca", "Suncu", "Suncem"], Merkur: ["Merkura", "Merkuru", "Merkurom"], Venera: ["Venere", "Veneri", "Venerom"], Mars: ["Marsa", "Marsu", "Marsom"],
  Jupiter: ["Jupitera", "Jupiteru", "Jupiterom"], Saturn: ["Saturna", "Saturnu", "Saturnom"], Uran: ["Urana", "Uranu", "Uranom"], Neptun: ["Neptuna", "Neptunu", "Neptunom"], Pluton: ["Plutona", "Plutonu", "Plutonom"],
};
/** "nasuprot Jupitera". */
export const bGen = (b: string) => BODIES[b]?.[0] ?? b;
/** "daje podršku Veneri". */
export const bDat = (b: string) => BODIES[b]?.[1] ?? b;
/** "sa Merkurom". */
export const bIns = (b: string) => BODIES[b]?.[2] ?? b;

export type TopicCase = "gen" | "dat" | "acc" | "ins" | "loc";
/** One entry per house. Every topic names two or more things, so a nominative topic always takes a plural verb. */
const TOPICS: ({ nom: string } & Record<TopicCase, string>)[] = [
  { nom: "tvoje telo i prvi utisak", gen: "tvog tela i prvog utiska", dat: "tvom telu i prvom utisku", acc: "tvoje telo i prvi utisak", ins: "tvojim telom i prvim utiskom", loc: "tvom telu i prvom utisku" },
  { nom: "novac, vrednosti i udobnost", gen: "novca, vrednosti i udobnosti", dat: "novcu, vrednostima i udobnosti", acc: "novac, vrednosti i udobnost", ins: "novcem, vrednostima i udobnošću", loc: "novcu, vrednostima i udobnosti" },
  { nom: "poruke, bliski rođaci i kratka putovanja", gen: "poruka, bliskih rođaka i kratkih putovanja", dat: "porukama, bliskim rođacima i kratkim putovanjima", acc: "poruke, bliske rođake i kratka putovanja", ins: "porukama, bliskim rođacima i kratkim putovanjima", loc: "porukama, bliskim rođacima i kratkim putovanjima" },
  { nom: "dom i porodica", gen: "doma i porodice", dat: "domu i porodici", acc: "dom i porodicu", ins: "domom i porodicom", loc: "domu i porodici" },
  { nom: "romansa, zabava i kreativnost", gen: "romanse, zabave i kreativnosti", dat: "romansi, zabavi i kreativnosti", acc: "romansu, zabavu i kreativnost", ins: "romansom, zabavom i kreativnošću", loc: "romansi, zabavi i kreativnosti" },
  { nom: "svakodnevni posao i zdravlje", gen: "svakodnevnog posla i zdravlja", dat: "svakodnevnom poslu i zdravlju", acc: "svakodnevni posao i zdravlje", ins: "svakodnevnim poslom i zdravljem", loc: "svakodnevnom poslu i zdravlju" },
  { nom: "partneri i dogovori u četiri oka", gen: "partnera i dogovora u četiri oka", dat: "partnerima i dogovorima u četiri oka", acc: "partnere i dogovore u četiri oka", ins: "partnerima i dogovorima u četiri oka", loc: "partnerima i dogovorima u četiri oka" },
  { nom: "bliskost, zajednički novac i duboke promene", gen: "bliskosti, zajedničkog novca i dubokih promena", dat: "bliskosti, zajedničkom novcu i dubokim promenama", acc: "bliskost, zajednički novac i duboke promene", ins: "bliskošću, zajedničkim novcem i dubokim promenama", loc: "bliskosti, zajedničkom novcu i dubokim promenama" },
  { nom: "učenje, putovanja i velike ideje", gen: "učenja, putovanja i velikih ideja", dat: "učenju, putovanjima i velikim idejama", acc: "učenje, putovanja i velike ideje", ins: "učenjem, putovanjima i velikim idejama", loc: "učenju, putovanjima i velikim idejama" },
  { nom: "karijera i ugled", gen: "karijere i ugleda", dat: "karijeri i ugledu", acc: "karijeru i ugled", ins: "karijerom i ugledom", loc: "karijeri i ugledu" },
  { nom: "prijatelji, grupe i nade", gen: "prijatelja, grupa i nada", dat: "prijateljima, grupama i nadama", acc: "prijatelje, grupe i nade", ins: "prijateljima, grupama i nadama", loc: "prijateljima, grupama i nadama" },
  { nom: "odmor, unutrašnji svet i završeci", gen: "odmora, unutrašnjeg sveta i završetaka", dat: "odmoru, unutrašnjem svetu i završecima", acc: "odmor, unutrašnji svet i završetke", ins: "odmorom, unutrašnjim svetom i završecima", loc: "odmoru, unutrašnjem svetu i završecima" },
];
export const TOPIC_NAMES = TOPICS.map((t) => t.nom) as [string, string, string, string, string, string, string, string, string, string, string, string];
/** A house topic in the case a template needs. */
export const tc = (nom: string, form: TopicCase) => TOPICS.find((t) => t.nom === nom)?.[form] ?? nom;

const WEEKDAY_ACC: Record<string, string> = { sreda: "sredu", subota: "subotu", nedelja: "nedelju" };
/** "u subotu", "u ponedeljak". */
export const dayAcc = (day: string) => WEEKDAY_ACC[day] ?? day;

/** gen, loc */
const MONTHS: Record<string, [string, string]> = {
  januar: ["januara", "januaru"], februar: ["februara", "februaru"], mart: ["marta", "martu"], april: ["aprila", "aprilu"], maj: ["maja", "maju"], jun: ["juna", "junu"], juni: ["juna", "junu"],
  jul: ["jula", "julu"], juli: ["jula", "julu"], avgust: ["avgusta", "avgustu"], septembar: ["septembra", "septembru"], oktobar: ["oktobra", "oktobru"], novembar: ["novembra", "novembru"], decembar: ["decembra", "decembru"],
};
/** "do 12. novembra". */
export const mGen = (m: string) => MONTHS[m]?.[0] ?? m;
/** "u novembru". */
export const mLoc = (m: string) => MONTHS[m]?.[1] ?? m;

const DATE = /(\d{1,2})\.?\s+(\p{L}+)(?:\s+(\d{4})\.?)?/u;
/** A date in any shape formatDate gives ("5 novembar", "31. oktobar 2026.") in the nominative, with no closing dot. */
export const dNom = (d: string) => d.replace(DATE, (_, n: string, m: string, y?: string) => `${n}. ${m}${y ? ` ${y}` : ""}`);
/** "31. oktobra 2026", with no closing dot: for the end of a sentence, where the full stop closes the year too. */
export const dGen = (d: string) => d.replace(DATE, (_, n: string, m: string, y?: string) => `${n}. ${mGen(m)}${y ? ` ${y}` : ""}`);
/** "31. oktobra 2026.", for the middle of a sentence: a year written in figures is an ordinal and keeps its dot. */
export const dGenMid = (d: string) => d.replace(DATE, (_, n: string, m: string, y?: string) => `${n}. ${mGen(m)}${y ? ` ${y}.` : ""}`);
/** "novembar 2026" to "novembru 2026". */
export const myLoc = (monthYear: string) => monthYear.replace(/^\p{L}+/u, mLoc);

/** The Serbian count: 1 sat, 2 sata, 5 sati, 11 sati, 21 sat, 22 sata. */
export const plural = (n: number, one: string, few: string, many: string) => {
  const t = n % 100; const u = n % 10;
  if (t >= 11 && t <= 14) return many;
  return u === 1 ? one : u >= 2 && u <= 4 ? few : many;
};

/** Ordinals stay feminine nominative in the bank ("prva"): they always count a kuća. */
export const ordLoc = (o: string) => o.replace(/a$/, "oj");
export const ordAcc = (o: string) => o.replace(/a$/, "u");
/** House names are stored after "u", in the locative. For a move: "tvojoj devetoj kući" to "tvoju devetu kuću". */
export const houseAcc = (h: string) => h.replace(/^tvojoj (\p{L}+)oj kući$/u, "tvoju $1u kuću");
