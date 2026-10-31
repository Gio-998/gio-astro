import type { PlayContent, DimText } from "../en/play";
import type { PlayDim, PlayFlag, PlayGameId, Emotion, CareMove } from "@/engine/play";
import { plural } from "@/content/horoscope/sr-cases";

const dims: Record<PlayDim, DimText> = {
  risk: {
    name: "Sklonost riziku", poles: ["Oprezno", "Smelo"], word: { low: "oprez", high: "smelost" },
    text: {
      low: "Uvek iznova biraš kamenu stazu. Sigurno ti je draže od sjajnog: radije skupljaš male, izvesne zvezde nego da se kockaš na staklu. Ljudi ti poveravaju plan jer unapred misliš koliko duboko može da se padne.",
      mid: "Mešaš izbore: malo užeta, malo kamena, ponešto stakla kad ti trenutak deluje pravo. Svaki put meriš nagradu naspram pada, a to je dobra navika. Rizik ti ne treba za osećaj života, ali od njega i ne bežiš.",
      high: "Ideš na staklo. Veće zvezde, veći pad, a ti ga i dalje biraš. Prija ti uzbuđenje prave opklade i učiš kroz pokušaje. Samo povremeno proveri da li su i ostali na mostu pristali na istu vožnju.",
    },
    up: "Po odgovorima zvučiš opreznije nego što igraš: na mostovima ideš smelo.",
    down: "Po odgovorima zvučiš odvažnije nego što igraš: na mostovima biraš sigurnu stazu.",
    said: "Iz testa Velikih pet: otvorenost i savesnost.",
  },
  resilience: {
    name: "Oporavak", poles: ["Uzdrmano", "Otporno"], word: { low: "osetljivost posle pada", high: "brz oporavak" },
    text: {
      low: "Pad te ne pušta lako. Kad most pukne, usporavaš ili prelaziš na najsigurniju stazu, a to je vrlo ljudski način da se zaštitiš. Dobro je da to znaš o sebi: posle neuspeha daj sebi trenutak pre nego što odlučiš šta on znači.",
      mid: "Pad te malo uspori, pa nastavljaš. Uzmeš trenutak, prilagodiš se i opet staneš na most. Ta pauza je korisna: učiš iz pukotine, a ne dozvoljavaš joj da bira umesto tebe.",
      high: "Padneš i odmah se vratiš, često na isti most. Neuspehe registruješ, ali te ne vode. To je snaga pod pritiskom. Samo pazi na jedno: ljudima oko tebe možda treba duže da se oporave.",
    },
    up: "Po odgovorima te neuspesi potresu, a posle pada se odmah vraćaš na most.",
    down: "Po odgovorima pritisak lako podnosiš, a pad te u igri očigledno uspori.",
    said: "Iz testa Velikih pet: emocionalna osetljivost.",
  },
  read: {
    name: "Čitanje lica", poles: ["Propušta znake", "Čita lica"], word: { low: "fokus na reči", high: "oko za lica" },
    text: {
      low: "Bljeskove je teško uhvatiti, naročito one suptilne. Mnogi bolje čitaju reči nego lica, i to je u redu. U životu jedno prosto „kako si, stvarno?“ popuni ono što brz pogled propusti.",
      mid: "Hvataš jasne izraze i deo suptilnih. Primećuješ više nego što misliš, najviše kad je nečije osećanje jako. Tihi izrazi (stegnuta vilica, poluosmeh) su sledeći sloj koji možeš da naučiš.",
      high: "Hvataš čak i mikroizraze od pola sekunde. Vidiš osećanje pre nego što je izgovoreno, pa si dobro društvo u teškim trenucima. Zapamti da je čitanje ipak pretpostavka: nežno proveri pre nego što reaguješ.",
    },
    up: "", down: "", said: "",
  },
  empathy: {
    name: "Saosećanje", poles: ["Praktično", "Saosećajno"], word: { low: "praktičnost", high: "saosećanje" },
    text: {
      low: "Kad se prijatelj muči, posežeš za rešenjima ili promenom atmosfere. I to je pažnja: želiš da bol prestane. Ali ponekad ljudi prvo žele da ih neko čuje, pa tek onda da im pomogne. Probaj da prvo imenuješ ono što osećaju, a rešenje ponudiš posle.",
      mid: "Smenjuješ slušanje i pomaganje. Nekad imenuješ osećanje, nekad ideš na rešenje. Instinkt ti kaže da pomogneš kako god može, a možeš da naučiš šta kome treba.",
      high: "Dočekuješ ljude tamo gde jesu: imenuješ osećanje i ostaješ uz njega pre nego što išta popravljaš. Zato se ljudi s tobom osećaju sigurno. Ostavi malo prostora i za sebe, da ne nosiš tuđe oluje.",
    },
    up: "Po odgovorima zvučiš racionalnije nego što igraš: u igri ideš pravo na osećanje.",
    down: "Po odgovorima zvučiš toplije nego što igraš: u igri češće posežeš za rešenjima nego za osećanjima.",
    said: "Iz testa Velikih pet: prijatnost.",
  },
  trust: {
    name: "Poverenje", poles: ["Uzdržano", "Otvorena ruka"], word: { low: "uzdržanost", high: "otvorena ruka" },
    text: {
      low: "Mosu šalješ male iznose, a oprez raste kad jednom zadrži novčiće. Čuvaš svoje dok neko ne zasluži više. To te štiti, ali može i dobre ljude da drži na distanci malo duže nego što treba.",
      mid: "Mosu daješ poštenu šansu i prilagođavaš se kad nešto krene naopako. Poverenje kod tebe prati dokaze: dovoljno otvoreno da pustiš ljude unutra, dovoljno pažljivo da primetiš obrazac. Posle loše runde ne zalupiš vrata.",
      high: "Od početka šalješ velikodušno i tako nastavljaš, čak i kad Mos jednom sve zadrži. Prvo nudiš poverenje, a većina ljudi na to odgovori istom merom. Samo one koji ne uzvrate pogledaj još jednom pre nego što im daš treću šansu.",
    },
    up: "Po odgovorima zvučiš rezervisanije nego što igraš: Mosu mnogo poveravaš.",
    down: "Po odgovorima zvučiš otvorenije nego što igraš: kad su novčići na stolu, povlačiš ruku.",
    said: "Iz testa Stil vezivanja (ili iz prijatnosti).",
  },
  fairness: {
    name: "Pravednost", poles: ["Zadrži više", "Deli na pola"], word: { low: "čuvanje svog", high: "pravednost" },
    text: {
      low: "Kad je red na tebe da deliš, zadržavaš više od pola. Možda ti to deluje kao igra (i jeste), možda Mosa vidiš kao stranca. Vredi primetiti da li isto radiš u pravim dogovorima i da li te to košta dobre volje.",
      mid: "Deliš, mada ne uvek na pola. Stalo ti je do pravde, ali i do toga da te niko ne izradi. Većina ljudi je tu negde.",
      high: "Kad je red na tebe, deliš na pola ili više, čak i kad možeš sve da zadržiš. Pravda ti je važna i kad niko ne gleda, i baš zato te ljudi žele na svojoj strani.",
    },
    up: "U igri deliš pravednije nego što tvoji odgovori govore.",
    down: "Po odgovorima zvučiš darežljivije nego što igraš: kad su novčići tvoji, zadržavaš veći deo.",
    said: "Iz testa Velikih pet: prijatnost.",
  },
  detail: {
    name: "Stil pamćenja", poles: ["Velika slika", "Sitni detalji"], word: { low: "velika slika", high: "oko za detalje" },
    text: {
      low: "Bolje držiš celinu nego sitne činjenice. Prvo vidiš obrazac: suštinu prostorije, tok priče. Udruži se s nekim ko pamti sitnice i bićete odličan tim.",
      mid: "Oblici i detalji ti se vraćaju otprilike jednako. Možeš da se odmakneš i vidiš obrazac, pa da zumiraš kad je važno, i zato lako učiš na različite načine.",
      high: "Boje, položaji, mali trougao u uglu: sve to pamtiš. Tvoje pamćenje voli konkretno. To je zlato za posao koji traži preciznost. S vremena na vreme se odmakni i pitaj šta kaže cela slika.",
    },
    up: "", down: "", said: "",
  },
  speed: {
    name: "Tempo", poles: ["Promišljeno", "Brzo"], word: { low: "promišljenost", high: "brzina" },
    text: {
      low: "Uzimaš vreme pre nego što odgovoriš. Polako i temeljno je pravi stil: proveravaš pre nego što se obavežeš. U brzim razgovorima slobodno reci „daj mi sekund“ i uzmi ga.",
      mid: "Odgovaraš ravnomernim tempom, brzo kad znaš, sporije kad ne znaš. To je zdrava ravnoteža između brzine i pažnje.",
      high: "Odgovaraš brzo i uglavnom tačno. Od viđenog do odluke stižeš u trenu. Drugima možda treba trenutak duže, pa ostavi malo prostora pre nego što popuniš tišinu.",
    },
    up: "", down: "", said: "",
  },
  lead: {
    name: "Vođstvo", poles: ["Prati", "Vodi"], word: { low: "opuštenost", high: "prirodno vođstvo" },
    text: {
      low: "Puštaš druge da govore pre tebe i retko grabiš odluku. Prija ti da grupa sama nađe put, pa je s tobom lako. Ako imaš jaku želju, vredi da je izgovoriš ranije.",
      mid: "Nekad glasaš pre ostalih, nekad čekaš. Vodiš kad ti je ishod važan, a povlačiš se kad nije. Tako se lako uklapaš u grupu.",
      high: "Glasaš pre ostalih i istupaš kad grupa zapne. Ljudi mogu da računaju na tebe da pokreneš stvari. Ostavi prostora i tišima: njihove ideje su često baš one koje bi ti se dopale.",
    },
    up: "Po odgovorima zvučiš povučenije nego što igraš: u grupi se javljaš pre ostalih i donosiš odluku.",
    down: "Po odgovorima zvučiš društvenije nego što igraš: u grupi puštaš druge da odluče.",
    said: "Iz testa Velikih pet: ekstraverzija.",
  },
  conform: {
    name: "Uticaj grupe", poles: ["Nezavisno", "Uz grupu"], word: { low: "nezavisnost", high: "sluh za grupu" },
    text: {
      low: "Kad cela grupa izabere pogrešnu liniju, veruješ svojim očima. Držiš se svog stava pod pritiskom društva. To je dragoceno, naročito kad je cela grupa na korak od greške.",
      mid: "Nekad veruješ svojim očima, nekad grupi. To je iskreno: u klasičnim istraživanjima sa linijama većina ljudi bar jednom popusti. Osećaš to povlačenje, ali mu ne popuštaš uvek.",
      high: "Kad svi ostali izaberu liniju, često je izabereš i ti, čak i kad ti oči govore drugo. Ceniš harmoniju i dobro čitaš atmosferu. Probaj ovo: sledeći put kad se ne slažeš, reci to jednom, ljubazno, i vidi šta će se desiti.",
    },
    up: "Po odgovorima zvučiš nezavisnije nego što igraš: ideš za pogrešnim odgovorom grupe.",
    down: "Po odgovorima više držiš do pravila nego u igri: tamo veruješ svojim očima protiv cele grupe.",
    said: "Iz testa Velikih pet: savesnost i otvorenost.",
  },
  patience: {
    name: "Strpljenje", poles: ["Sada", "Vredi čekati"], word: { low: "sada i ovde", high: "strpljenje" },
    text: {
      low: "U većini rundi odmah uzimaš malu nagradu. Bolje vrabac u ruci nego golub na grani: voliš rezultate koje možeš da opipaš. Zato brzo deluješ i lako te je obradovati. Kad je nešto veliko na stolu, izbroj do deset pre nego što zgrabiš sigurno.",
      mid: "Čekaš kad ti nagrada deluje vredno, a uzimaš brzu kad ne deluje. Računaš u glavi, rundu po rundu. To je pametan način da trošiš svoje vreme.",
      high: "Izdržavaš do većeg fenjera, čak i na dugim čekanjima. Čekanje te ne plaši kad je dobitak jasan, a to je tihi motor iza štednje, treninga i dugih projekata. Samo se postaraj da čekanje bude tvoj izbor, a ne navika.",
    },
    up: "Po odgovorima zvučiš impulsivnije nego što igraš: čekaš veću nagradu.",
    down: "Po odgovorima zvučiš strpljivije nego što igraš: kad vreme teče, grabiš sigurno.",
    said: "Iz testa Velikih pet: savesnost.",
  },
  control: {
    name: "Fokus", poles: ["Brz prst", "Mirna ruka"], word: { low: "brz prst", high: "mirna ruka" },
    text: {
      low: "Palac ti je brži od kočnice: hvataš zvezde, ali i poneki polumesec. Brzina je dar, a prvi potez ti često stigne pre druge misli. Za velike odluke namerno ubaci pauzu.",
      mid: "Hvataš većinu zvezda i puštaš većinu polumeseca. Ponekad te ritam povuče na dodir koji ne želiš. Sasvim normalno, i znak da ti kočnice rade kad treba.",
      high: "Dodiruješ zvezde i zastaješ na polumesecu, uvek iznova. Kočnice su ti dobre: možeš da zaustaviš naviku na pola puta. Zato čuvaš mir u žučnom razgovoru. Spontanost ti i dalje nije zabranjena.",
    },
    up: "Po odgovorima deluješ impulsivnije nego što igraš: kočnice ti drže skoro svaki put.",
    down: "Po odgovorima zvučiš staloženije nego što igraš: ritam te povuče na dodire koje ne želiš.",
    said: "Iz testa Velikih pet: savesnost.",
  },
};

const games: Record<PlayGameId, { name: string; tagline: string; intro: string; how: string[]; measures: string; secs: number }> = {
  bridge: {
    name: "Most", tagline: "Pređi kanjon. Izaberi most. Neki će pući.", secs: 75,
    intro: "Osam prelazaka. Kamen je siguran i daje malo. Uže se malo ljulja. Staklo daje najviše i ponekad pukne. Skupi koliko hoćeš zvezda, nema pogrešnog načina da igraš.",
    how: ["Dodirni most da pređeš", "Pad je deo igre", "Posle pada možeš da staneš i završiš igru"],
    measures: "Koliko rizikuješ i kako se ponašaš odmah posle pada.",
  },
  faces: {
    name: "Soba osećanja", tagline: "Uhvati osećanje za pola sekunde.", secs: 90,
    intro: "Lice bljesne na trenutak, kao pravi izraz u razgovoru. Izaberi osećanje koje je prešlo preko njega. Onda troje prijatelja traži tvoju pažnju, a ti biraš kako da odgovoriš.",
    how: ["Gledaj lice, brzo nestaje", "Izaberi osećanje", "Odgovori prijateljima iskreno, kao u životu"],
    measures: "Koliko dobro čitaš lica i kako dočekuješ nekoga ko se muči.",
  },
  trust: {
    name: "Podela", tagline: "Deli novčiće sa Mosom. Mos odlučuje šta se vraća.", secs: 80,
    intro: "Šta god pošalješ Mosu, utrostruči se. Mos ti onda vrati deo. Ponekad se uloge zamene i ti odlučuješ šta vraćaš. Pravi novčići, izmišljeni ulozi.",
    how: ["Izaberi koliko novčića šalješ", "Gledaj šta Mos radi", "Tvoj izbor, u svakoj rundi"],
    measures: "Koliko veruješ, kako reaguješ kad te neko izneveri i koliko pravedno deliš.",
  },
  memory: {
    name: "Bljesak", tagline: "Vidiš na sekund. Onda kažeš šta je bilo.", secs: 70,
    intro: "Deset brzih bljeskova. Negde treba da zapamtiš oblik, negde te pitamo za sitan detalj. Odgovaraj što brže možeš, ali nemoj da nagađaš nasumično.",
    how: ["Gledaj bljesak", "Odgovori na pitanje", "Brzina se malo računa, tačnost više"],
    measures: "Da li pamtiš veliku sliku ili sitan detalj i koliko brzo obrađuješ.",
  },
  lead: {
    name: "Grupa", tagline: "Troje prijatelja, sedam odluka. Vodiš ili pratiš?", secs: 70,
    intro: "Ana, Teo i Lina odlučuju zajedno s tobom. Glasaj kad hoćeš: pre njih, posle njih ili tek kad vidiš sve.",
    how: ["Njihovi glasovi stižu jedan po jedan", "Dodirni svoj odgovor u bilo kom trenutku", "Neka pitanja imaju tačan odgovor"],
    measures: "Kada se javljaš i koliko izbor grupe utiče na tvoj.",
  },
  wait: {
    name: "Fenjer", tagline: "Malo svetla sada ili više ako sačekaš.", secs: 70,
    intro: "Šest fenjera. Svaki put biraš: uzmi nekoliko zvezda odmah ili sačekaj da se fenjer napuni i dobij više. Dok čekaš, možeš da se predomisliš i uzmeš malu nagradu.",
    how: ["Dodirni Odmah ili Čekaj", "Dok se puni, još možeš da uzmeš malu", "Nema tačnog odgovora, samo tvoj"],
    measures: "Koliko lako čekaš veću nagradu kad je manja odmah tu.",
  },
  focus: {
    name: "Lov na zvezde", tagline: "Dodiruj zvezde. Nikad ne diraj polumesec.", secs: 40,
    intro: "Zvezde i polumeseci bljeskaju u brzom ritmu. Dodirni svaku zlatnu zvezdu što brže možeš. Kad se pojavi crveni polumesec, drži palac mirno.",
    how: ["Zlatna zvezda: dodirni", "Crveni polumesec: ne diraj", "Brzo je namerno"],
    measures: "Koliko dobro možeš da zaustaviš brzu naviku na pola puta: fokus i kontrola impulsa.",
  },
};

const emotions: Record<Emotion, string> = { joy: "Radost", sadness: "Tuga", anger: "Ljutnja", fear: "Strah", surprise: "Iznenađenje", disgust: "Gađenje", contempt: "Prezir", calm: "Smirenost" };

const scenes: { who: string; says: string; moves: Record<CareMove, string> }[] = [
  { who: "Saša", says: "Nisam dobio posao. Baš sam mislio da je moj.", moves: { fix: "Hajde da ti sredimo CV i da se večeras prijaviš na još tri.", name: "Uh, ne. To baš boli kad se već ponadaš.", distract: "Zaboravi, idemo napolje da se zabavimo!", leave: "Dešava se. Naći ćeš nešto.", stay: "Tu sam. Hoćeš da pričamo?" } },
  { who: "Nora", says: "Mama mi je opet u bolnici.", moves: { stay: "Dolazim kod tebe. Ne moraš ništa da pričaš.", fix: "Da li ste tražili drugo mišljenje?", leave: "Sigurno će biti dobro, ne brini.", distract: "Hoćeš da gledamo nešto da skreneš misli?", name: "" } },
  { who: "Luka", says: "Svi su mi zaboravili rođendan.", moves: { distract: "Idemo odmah na tortu, ja častim!", leave: "Rođendani su ionako precenjeni.", name: "Ovo baš peče. Boli kad te svi zaborave.", fix: "Okači podsetnik u grupu na Viberu.", stay: "" } },
];

export const play: PlayContent = {
  meta: { title: "Igre ogledala", description: "Sedam brzih mini-igara koje pokazuju kako stvarno igraš: rizik, poverenje, lica, pamćenje, vođstvo, strpljenje i fokus. Ponašanje, a ne samoprocena." },
  brand: "Igre ogledala",
  hub: {
    eyebrow: "Igre ogledala", titleA: "Kako ", titleB: "stvarno igraš",
    sub: "Upitnici pokazuju kako vidiš sebe. Ovih sedam mini-igara gleda šta radiš: tvoje izbore, tvoj tempo, šta se dešava posle pada. Ukupno oko devet minuta.",
    honest: "Nekoliko minuta igre daje signal o ponašanju, a ne dijagnozu. Umor, rasejanost ili čista zabava? Sve se vidi, pa igraj ponovo kad god hoćeš.",
    progress: (n: number) => `Odigrano ${n} od 7`,
    short: "Sedam brzih igara koje pokazuju kako se stvarno ponašaš.",
    play: "Igraj", replay: "Igraj ponovo", secs: (s: number) => `oko ${Math.round(s / 10) * 10} s`,
    resultTitle: "Kako stvarno igraš", resultEmpty: "Odigraj prvu igru i tvoja kartica počinje da se puni.",
    playNext: "Igraj sledeću igru", allDone: "Svih sedam je odigrano. Ovo je tvoja puna kartica.",
    compare: "Uporedi sa nekim", compareText: "Kad neko drugi igra na tvom telefonu (ili na svom, sa zajedničkim profilom), igre se pojavljuju u vašoj kompatibilnosti.",
    forOther: (n: string) => `Igraš za osobu: ${n}`, needProfile: "Prvo napravi profil, da rezultati ostanu sačuvani.", start: "Počni",
    behaviours: "Šta smo primetili", sayPlay: "Šta kažeš, a kako igraš", sayPlayIntro: "Tvoji odgovori iz upitnika pored onoga što radiš u igrama.",
    sayPlayNone: "Uradi test Velikih pet i ovde ćeš videti gde se tvoja slika o sebi i tvoja igra slažu, a gde razilaze.", takeBigFive: "Uradi Velikih pet",
    matches: (list: string) => `Tvoja igra se slaže sa onim što kažeš za: ${list}.`, saidLabel: "kažeš", playedLabel: "igraš",
    gameTitle: "Igre", detail: "Pročitaj više", flags: { erratic: "Videli smo nekoliko vrlo brzih nizova dodira. Ako je bilo stresa ili žurbe, rezultati mogu da budu malo nepouzdani.", quit: "Posle pada biraš odmor. To je sasvim u redu i vidi se u delu Oporavak.", rushed: "Odgovaraš veoma brzo. Ako ti je samo bilo važno da završiš, igraj ponovo za tačnije čitanje." } as Record<PlayFlag, string>,
    share: "Podeli karticu", backHub: "Sve igre", levels: { low: "nisko", mid: "srednje", high: "visoko" },
    headline: (w: string[]) => (w.length ? w.map((x, i) => (i === 0 ? x[0].toUpperCase() + x.slice(1) : x)).join(", ") : "Uravnoteženo na sve strane"),
    reduced: "Smanjeno kretanje je uključeno, pa igre koriste blage prelaze umesto velikih pokreta.",
  },
  games, dims, emotions, scenes,
  ui: {
    begin: "Počni", next: "Dalje", done: "Vidi rezultat", round: (i: number, n: number) => `${i} / ${n}`, stars: "ukupno", ready: "Idemo",
    bridge: { names: ["Kamena staza", "Viseći most", "Stakleni most"], hints: ["sigurno", "ljulja se", "može da pukne"], pick: "Izaberi most", made: "Na drugoj si strani!", broke: ["", "Uže je puklo!", "Krc! Staklo je popustilo."], gust: "Nalet vetra te je oborio!", again: "Opet si na litici. Izaberi sledeći most.", rest: "Odmori se i završi igru" },
    faces: { watch: "Gledaj lice", what: "Koje je to osećanje?", scene: "Stiže ti poruka:", how: "Kako odgovaraš?" },
    trust: { moss: "Mos", have: (n: number) => `Imaš ${n} ${plural(n, "novčić", "novčića", "novčića")}`, send: "Pošalji", sendQ: "Koliko šalješ Mosu? Usput se utrostruči.", got: (sent: number, back: number) => `Šalješ ${sent}. Mos dobija ${sent * 3} i vraća ${back}.`, kept: (sent: number) => `Šalješ ${sent}. Mos zadržava sve: ${sent * 3}.`, backQ: (pot: number) => `Mos ti šalje 4 novčića. Utrostručili su se na ${pot}. Koliko mu vraćaš?`, splitQ: (pot: number) => `Na stazi nalaziš ${pot} ${plural(pot, "novčić", "novčića", "novčića")}. Mos je odmah tu. Koliko mu daješ?`, thanks: "Mos se smeši.", total: "Tvoji novčići", none: "Ništa ne šalješ? I to je izbor." },
    memory: { shape: "Zapamti oblik", details: "Zapamti detalje", whichShape: "Koji obrazac je to bio?", colourOf: (s: string) => `Koje je boje ${s === "zvezda" ? "bila" : "bio"} ${s}?`, shapes: { circle: "krug", triangle: "trougao", square: "kvadrat", star: "zvezda" }, colours: { gold: "Zlatna", rose: "Ružičasta", aqua: "Tirkizna", violet: "Ljubičasta" } },
    wait: { now: (n: number) => `Uzmi ${n} odmah`, wait: (n: number) => `Čekaj ${n}`, filling: "Fenjer se puni…", grab: (n: number) => `Ipak uzmi ${n}`, got: (n: number) => `+${n} ${plural(n, "zvezda", "zvezde", "zvezda")}`, round: "Fenjer", pick: "Malo sada ili više kasnije?", secs: (s: number) => `${s} s` },
    focus: { ready: "Zlatna zvezda: dodirni. Crveni polumesec: ne mrdaj.", go: "Dodirni!", hold: "Stani", start: "Počni", tapZone: "Dodirni ovde", caught: "Uhvaćeno", oops: "Polumesec!" },
    lead: { friends: ["Ana", "Teo", "Lina"], taste: [{ q: "Filmsko veče. Šta gledamo?", o: ["Komediju", "Triler", "Dokumentarac"] }, { q: "Vikend izlet. Kuda idemo?", o: ["Na planinu", "U banju", "U grad"] }, { q: "Šta ćemo za večeru?", o: ["Picu", "Suši", "Roštilj"] }], line: "Koja linija je iste dužine kao prva?", stuck: "Niko ne može da izabere kafić. Svi se gledaju.", stuckOpts: ["Neka izabere neko drugi", "Ja odlučujem"], volunteer: "Teo: dobro, biram ja.", you: "Ti", waiting: "…" },
  },
  result: { eyebrow: "Tvoj rezultat", nextGame: "Sledeća igra", hub: "Vidi celu karticu", again: "Igraj ponovo" },
  pair: {
    title: "Kako igrate vas dvoje", noteIntro: "Iz mini-igara:", none: "Odigrajte po nekoliko igara da ovo vidite.",
    notes: {
      bothTrust: "Oboje otvoreno verujete. To vezi daje miran oslonac.",
      trustGap: "Jedno poklanja poverenje rano, drugo čeka dokaz. Recite to naglas, da ne bi delovalo lično.",
      bothFair: "Oboje delite pošteno kad je vaš red. Kod novca i kućnih poslova obično ima ravnoteže.",
      fairGap: "Delite različito. Dogovorite se na vreme šta vama dvoma znači „fer“.",
      bothCare: "Kad nekoga boli, oboje prvo idete na osećanja. Teški dani su lakši udvoje.",
      readGap: "Jedno brzo čita lica, drugom trebaju reči. Izgovarajte stvari naglas češće nego što vam se čini potrebnim.",
      riskGap: "Jedno igra smelo, drugo sigurno. Odlično za ravnotežu, zamorno ako niko ne prilagodi tempo.",
      bothBold: "Oboje idete na staklo. Očekujte avanturu i čuvajte jednu zaštitnu mrežu među sobom.",
      bothBounce: "Oboje se brzo vraćate posle pada. Svađe brzo prolaze.",
      bothTender: "Neuspesi ostaju uz vas oboje. Posle teškog trenutka dajte jedno drugom vremena pre nego što išta odlučite.",
      twoLeaders: "Oboje grabite vođstvo. Živo je, a ponekad liči na nadvlačenje konopca. Odlučujte naizmenično.",
      leadFollow: "Jedno istupa, drugo rado prati. Odluke dolaze lako.",
      tempoGap: "Različit tempo: jedno odgovara brzo, drugo prvo razmisli. Ostavite prostora sporijem.",
      patienceGap: "Jedno čeka veću nagradu, drugo je hoće odmah. Velike stvari planirajte zajedno i ostavite mesta za male radosti.",
      memoryMix: "Jedno vidi veliku sliku, drugo čuva detalje. Prirodan tim.",
    } as Record<string, string>,
  },
  timing: {
    title: "Koliko sigurno odgovaraš", certainty: "Sigurnost",
    instant: (n: number, total: number) => `Odmah odgovoreno: ${n} od ${total}`,
    changed: (n: number) => `${n} ${plural(n, "predomišljanje", "predomišljanja", "predomišljanja")}`,
    instantLead: "Na ovo odgovaraš odmah. Brzi odgovori obično pokazuju najjasnije strane tvoje ličnosti:",
    slowLead: "Ovde staješ najduže. Sive zone su normalne i često su najzanimljiviji deo:",
    careless: "Kroz ovo prolaziš veoma brzo. Ako je cilj bio samo da stigneš do kraja, uradi ponovo kasnije za tačnije čitanje.",
    note: "Mereno na ovom uređaju dok odgovaraš; čuva se samo uz tvoje rezultate.",
    levels: { low: "dosta sivih zona", mid: "prilična sigurnost", high: "velika sigurnost" },
  },
  share: { eyebrow: "Igre ogledala", sub: "Kako stvarno igram", footer: "horoscop.si · igraj i ti" },
  book: { title: "Kako igraš", kicker: "Šta tvoji izbori pokazuju u Igrama ogledala", lead: "Upitnici pokazuju kako vidiš sebe. Mini-igre gledaju šta radiš. Evo šta su primetile.", none: "Odigraj nekoliko Igara ogledala i ovo poglavlje će se popuniti onim što tvoje ponašanje pokazuje.", gapTitle: "Šta kažeš, a šta radiš" },
};
