import { HORO_SLUGS } from "@/lib/horo-slugs";
import type { HoroBank } from "./types";
import { slMore } from "./sl-more";
import { TOPIC_NAMES, bGen, bWith, sAcc, sLoc, tc } from "./sl-cases";

/** Sign page descriptions: the phrase people type, then a question only that sign asks. */
const SIGN_META: Record<string, string> = {
  Oven: "Dnevni horoskop za Ovna za danes: kam usmeriti hitrost v ljubezni in pri delu, kdaj skočiti naprej in kdaj je pametneje počakati do jutri.",
  Bik: "Dnevni horoskop za Bika za danes: koliko se splača tvoje potrpljenje, kje varčevati z denarjem in časom ter kaj danes najbolj prija telesu.",
  "Dvojčka": "Dnevni horoskop za Dvojčka za danes: kateri pogovor spremeni dan, katerega sporočila ne kaže odlagati in komu lahko mirno rečeš ne.",
  Rak: "Dnevni horoskop za Raka za danes: kaj potrebuje tvoj dom, kdo od bližnjih čaka na tvojo besedo in kje daš prostor občutku.",
  Lev: "Dnevni horoskop za Leva za danes: kje se pokazati, kdaj oder prepustiti drugim in kaj te v ljubezni res ogreje.",
  Devica: "Dnevni horoskop za Devico za danes: katera podrobnost uredi cel dan in katero skrb lahko mirno pustiš za jutri zjutraj.",
  Tehtnica: "Dnevni horoskop za Tehtnico za danes: kje potrebuješ ravnovesje, v kateri zvezi popustiti in kdaj povedati, kaj res misliš.",
  "Škorpijon": "Dnevni horoskop za Škorpijona za danes: kaj pride na plan, komu zaupati in kaj je končno čas izpustiti.",
  Strelec: "Dnevni horoskop za Strelca za danes: kam te vleče dan, kaj se splača naučiti in kje dobra zamisel sama še ne zadošča.",
  Kozorog: "Dnevni horoskop za Kozoroga za danes: kateri korak vodi navzgor, kje malo popustiti pri delu in kdo si zasluži tvoj čas.",
  Vodnar: "Dnevni horoskop za Vodnarja za danes: katero zamisel velja deliti z drugimi in kateri ljudje so danes pravo društvo zate.",
  Ribi: "Dnevni horoskop za Ribi za danes: kaj ti pravi intuicija, česa ni treba nositi in kje potrebuješ malo tišine.",
};
/** Dated pages share their first half, so each sign closes the snippet in its own words. */
const DAY_CLOSE: Record<string, string> = {
  Oven: "Ljubezen, delo in najboljše ure za prvi korak.", Bik: "Denar, ljubezen in tisto, kar prija telesu.", "Dvojčka": "Pogovori, ljubezen in tvoje najboljše ure.", Rak: "Dom, ljubezen in ljudje, ki te čakajo.",
  Lev: "Ljubezen, delo in tvoj trenutek na odru.", Devica: "Delo, zdravje in podrobnosti, ki štejejo.", Tehtnica: "Zveze, delo in tvoje ravnovesje za danes.", "Škorpijon": "Ljubezen, zaupanje in delo brez olepševanja.",
  Strelec: "Ljubezen, učenje in smer, ki se splača.", Kozorog: "Delo, denar in tvoj naslednji korak.", Vodnar: "Prijatelji, zamisli in ljubezen po tvoje.", Ribi: "Ljubezen, počitek in tisto, kar čutiš.",
};

export const sl: HoroBank = {
  more: slMore,
  slug: HORO_SLUGS.sl.section, signSlug: HORO_SLUGS.sl.signs,
  bodies: { sun: "Sonce", mercury: "Merkur", venus: "Venera", mars: "Mars", jupiter: "Jupiter", saturn: "Saturn", uranus: "Uran", neptune: "Neptun", pluto: "Pluton" },
  phases: { new: "mlaj", "waxing-crescent": "naraščajoči srp", "first-quarter": "prvi krajec", "waxing-gibbous": "naraščajoča Luna", full: "polna Luna", "waning-gibbous": "pojemajoča Luna", "last-quarter": "zadnji krajec", "waning-crescent": "pojemajoči srp" },
  topics: TOPIC_NAMES,
  headline: [
    ["Luna je v tvojem znamenju, zato zaupaj notranjemu glasu.", "Današnji dan teče po tvojem razpoloženju. Naj bo dobro.", "Ljudje te danes opazijo bolj kot običajno."],
    ["Denar in udobje terjata mirno roko.", "Danes se obrestuje tisto, kar že imaš.", "Majhne odločitve o denarju štejejo več, kot se zdi."],
    ["Povej, kar misliš. Danes te bodo slišali.", "Eno samo sporočilo lahko odpre vrata.", "Tvoje besede danes pridejo do cilja hitreje kot običajno."],
    ["Danes se vse začne in konča doma.", "Družinske zadeve terjajo mehkejši glas.", "Pospravi en kot in se ti bo zjasnilo tudi v glavi."],
    ["Igra danes ni izgubljen čas.", "Poigraj se, ustvarjaj, smej se. Tvoja iskra je visoko.", "Naredi eno stvar samo zato, ker ti je všeč."],
    ["Majhne rutine nosijo velik dan.", "Popravi eno navado in vse ostalo bo sledilo.", "Telo pošilja jasne signale. Prisluhni."],
    ["Danes štejejo ljudje, ki so ti nasproti.", "Drug pogled zapolni tvojo slepo pego.", "Srečajta se na pol poti in oba pridobita."],
    ["Nekaj pod površjem želi na plan.", "Zaupanje je danes prava valuta.", "Izpusti eno staro stvar in postalo bo lažje."],
    ["Tvoj um si želi širšega obzorja.", "Nauči se ene nove stvari in ostala bo.", "Oddaljena zamisel se danes zdi čisto blizu."],
    ["Tvoje ime danes nekaj tehta.", "Delo, ki ga pokažeš danes, bo ostalo v spominu.", "Stopi naprej. Nekdo više te opazuje."],
    ["Tvoji ljudje te danes dvignejo više.", "Prijatelj ima manjkajoči košček.", "Povej željo na glas. Pomaga."],
    ["Utihni. Odgovori so v tebi.", "Počitek je danes pametna izbira.", "Preden začneš kaj novega, nekaj dokončaj."],
  ],
  love: [
    "Privlačnost je najmočnejša, ko se ne trudiš. Pusti, da ljudje pridejo k tebi.",
    "Ljubezen je danes skrb: obrok, majhno darilo, čas brez naglice.",
    "Kratko sporočilo lahko ogreje odnos. Prvo pošlji ti.",
    "Bližina raste doma. Miren večer premaga velik načrt.",
    "Romantika je na tvoji strani. Naredi načrt, ki je podoben zmenku.",
    "Ljubezen pokaži z drobnimi dejanji. Danes dejanja štejejo več kot besede.",
    "Partner ali simpatija potrebuje tvojo polno pozornost. Podari jo.",
    "Čustva so globoka. Iskren pogovor vaju zbliža.",
    "Poskusita skupaj kaj novega, četudi je to le nova ulica ali nova pesem.",
    "Spoštovanje je danes privlačno. Drži besedo in to se bo poznalo.",
    "Prijateljstvo in ljubezen se danes dobro prepletata. Pojdi tja, kamor gre družba.",
    "Nekaj, kar čutiš, je še neizrečeno. Najprej si to zapiši.",
  ],
  venus: [
    "Venera v tvojem znamenju doda šarm vsemu, kar počneš.", "Venera ima rada razvajanje, proračun pa naj ostane na očeh.", "Venera osladi tvoje besede. Uporabi jih prijazno.",
    "Venera ogreje dom. Povabi koga na obisk.", "Venera prižge romantiko in zabavo.", "Venera naredi delo prijaznejše. Hvala gre daleč.",
    "Venera postavi partnerje v središče pozornosti.", "Venera poglobi zaupanje v tesnih vezeh.", "Venera ljubi majhno pustolovščino za dva.",
    "Venera ti pomaga narediti dober vtis v službi.", "Venera prinese toplino prijateljev.", "Venera prosi za zasebne, nežne trenutke.",
  ],
  venusRetro: "Venera je retrogradna, zato se lahko vrnejo stari občutki in stare ljubezni. Ne hiti.",
  work: [
    "Tvoje zamisli so ostre. Predstavi jih osebno.", "Številke preveri dvakrat. Majhni prihranki se seštejejo.", "E-pošta, klici in hitra opravila tečejo. Počisti seznam.",
    "Delaj iz mirnega kraja. Urejena miza pomaga.", "Ustvarjalno delo gre dobro. Naj bo zabavno.", "Natančno delo zasije. Popravi, kar so drugi preskočili.",
    "Pogovori in dogovori gredo bolje v štiri oči.", "Preberi drobni tisk. Skupni denar zahteva previdnost.", "Zmaga razmišljanje o širši sliki. Načrtuj naslednji korak.",
    "Spregovori pred ljudmi, ki odločajo.", "Skupinske zamisli danes premagajo samostojne.", "Delaj zbrano, stran od hrupa. Manj sestankov, več opravljenega.",
  ],
  mars: [
    "Mars ti daje zagon. Začni z najtežjo nalogo.", "Mars te žene k zaslužku. Zahtevaj, kar si zaslužiš.", "Mars pospeši pogovore. Ohrani miren ton.",
    "Mars razburka dom. To energijo vloži v popravila.", "Mars podžiga drzne ustvarjalne poteze.", "Mars želi gibanje. Trening izostri tvojo zbranost.",
    "Mars lahko vname trenje z drugimi. Izberi svoje bitke.", "Mars sili v globino. Loti se tistega, čemur se izogibaš.", "Mars želi napredek pri dolgem načrtu.",
    "Mars poganja ambicijo. Pojdi po vidno zmago.", "Mars napolni skupinske projekte z energijo. Vodi enega.", "Mars deluje v ozadju. Tih trud se obrestuje.",
  ],
  mercuryRetro: "Merkur je retrograden: naredi varnostno kopijo datotek in preberi še enkrat, preden pošlješ.",
  marsRetro: "Mars je retrograden, zato najprej popravi, šele nato hiti.",
  well: {
    new: "Energija ob mlaju je nizka in tiha. Počivaj in postavi en sam namen.",
    "waxing-crescent": "Energija raste. Začni majhno navado in jo ohrani lahkotno.",
    "first-quarter": "Pričakuj sunek. Razgibaj telo, da sprostiš napetost.",
    "waxing-gibbous": "Natančno uravnaj, a ne pretiravaj. Spanec je tvoje skrivno orožje.",
    full: "Čustva ob polni Luni dosežejo vrh. Dihaj počasi in pij vodo.",
    "waning-gibbous": "Deli znanje, ki ga imaš. Dolg sprehod te resetira.",
    "last-quarter": "Izpusti eno stvar, ki te izčrpava.",
    "waning-crescent": "Upočasni. Zgodnji počitek se jutri obrestuje.",
  },
  wellEl: { fire: "Luna v ognjenem znamenju želi gibanja in toplote.", earth: "Luna v zemeljskem znamenju ima rada dobro hrano in miren spanec.", air: "Luna v zračnem znamenju potrebuje svež zrak in dober pogovor.", water: "Luna v vodnem znamenju prosi za kopel, jok ali glasbo." },
  colors: { fire: ["Žareče rdeča", "Žafranasta", "Zlata"], earth: ["Mahovnato zelena", "Terakota", "Peščena"], air: ["Nebesno modra", "Sivkasta", "Srebrna"], water: ["Globoka turkizna", "Indigo", "Biserna"] },
  weekdays: ["nedelja", "ponedeljek", "torek", "sreda", "četrtek", "petek", "sobota"],
  sky: {
    moonIn: (s, p, i) => `Luna je v ${sLoc(s)}: ${p}, opoldne osvetljena ${i} %.`,
    moonMoves: (s, t) => `Ob ${t} vstopi v ${sAcc(s)}.`,
    forYou: (t) => `Zate je danes v ospredju vse, kar zadeva ${tc(t, "acc")}.`,
    quarter: {
      new: (s, t, x) => `Mlaj v ${sLoc(s)} ob ${t}. Čist list za ${tc(x, "acc")}.`,
      "first-quarter": (s, t, x) => `Prvi krajec v ${sLoc(s)} ob ${t}. Čas za ukrepanje pri ${tc(x, "loc")}.`,
      full: (s, t, x) => `Polna Luna v ${sLoc(s)} ob ${t}. Pri ${tc(x, "loc")} se vse zaostri.`,
      "last-quarter": (s, t, x) => `Zadnji krajec v ${sLoc(s)} ob ${t}. Odloži, česar pri ${tc(x, "loc")} ne potrebuješ več.`,
    },
    station: {
      retro: (b, s, x) => `${b} danes začne retrogradno gibanje v ${sLoc(s)}. Preglej, kar zadeva ${tc(x, "acc")}, preden greš naprej.`,
      direct: (b, s, x) => `${b} danes preide v direktno gibanje v ${sLoc(s)}. Zataknjeni načrti okoli ${tc(x, "gen")} se začnejo premikati.`,
    },
    ingress: (b, s, x) => `${b} danes vstopi v ${sAcc(s)} in obrne pozornost na ${tc(x, "acc")}.`,
    aspect: {
      conjunction: (a, b) => `${a} se sreča ${bWith(b)}. Dve sili se združita.`,
      sextile: (a, b) => `${a} in ${b} si pomagata. Lahka priložnost.`,
      square: (a, b) => `${a} trči ${bWith(b)}. Trenje, ob katerem rasteš.`,
      trine: (a, b) => `${a} je v skladu ${bWith(b)}. Vse teče gladko.`,
      opposition: (a, b) => `${a} stoji nasproti ${bGen(b)}. Treba je najti ravnovesje.`,
    },
    exactToday: "Natančen je prav danes.",
    retroOngoing: (b, s, x) => `${b} je v ${sLoc(s)} v retrogradnem gibanju, zato bodi pri ${tc(x, "loc")} brez naglice.`,
    inSign: (list, many, s) => `${list} ${many ? (list.includes(",") ? "so" : "sta") : "je"} v ${sLoc(s)}, tvojem znamenju. Dodaten naboj zate.`, and: "in",
    retroSame: (b, s) => `${b} je tudi v ${sLoc(s)} v retrogradnem gibanju, zato daj stvarem čas.`,
    calm: "Danes ni velikih planetnih premikov, zato ton daje Luna.",
  },
  ui: {
    title: (s, d) => `Dnevni horoskop za ${sAcc(s)}, ${d}`,
    shortTitle: (s) => `Horoskop za ${sAcc(s)} danes`,
    signHubMeta: (s) => SIGN_META[s] ?? `Dnevni horoskop za ${sAcc(s)} za danes: ljubezen, delo, počutje, srečna številka in prihodnji dnevi. Brezplačno.`,
    signHubIntro: (s) => `Ta stran vedno prikazuje današnji horoskop za ${sAcc(s)}. Prejšnji dnevi ostanejo spodaj na voljo še dva tedna.`,
    recentDays: "Zadnji dnevi",
    motivationLink: (s) => `Dnevna motivacija za ${sAcc(s)}: ena majhna vaja za danes`,
    description: (s, d, h) => {
      // The closing phrase goes first when the headline is long: a search result shows about 155 characters.
      const base = `Horoskop za ${sAcc(s)} za ${d}. ${h}`; const full = `${base} ${DAY_CLOSE[s] ?? "Ljubezen, delo in počutje."}`;
      return full.length <= 158 ? full : base;
    },
    hubTitle: "Dnevni horoskop", homeEyebrow: "Dnevni horoskop", homeTitle: "Tvoje znamenje danes", homeAll: "Vsa znamenja", hubSub: "Izberi svoje znamenje. Vsak dan znova, izračunano iz resničnega neba.",
    hubSeoTitle: "Dnevni horoskop za vseh 12 znamenj", hubMeta: "Današnji horoskop za vseh 12 znamenj: ljubezen, delo, počutje, srečna številka in najboljše ure. Vsak dan znova, napisan po resničnem nebu.",
    love: "Ljubezen", work: "Delo", well: "Počutje", lucky: "Srečno danes", color: "Barva", number: "Število", window: "Najboljše ure",
    skyTitle: "Nebo danes", moodTitle: "Kako se počutiš danes?", moodSub: "En dotik in stran Danes si to zapomni.",
    moods: ["Odlično", "Mirno", "V redu", "Napeto", "Slabo"],
    ctaTitle: "To je za tvoje znamenje. Tvoja karta je samo tvoja.", ctaSub: "Pridobi brezplačno rojstno karto v dveh minutah.", ctaBtn: "Hočem brezplačno karto",
    yesterday: "Včeraj", tomorrow: "Jutri", others: "Druga znamenja", todayLink: "Danes", moonLabel: "Luna", read: "Preberi",
  },
};
