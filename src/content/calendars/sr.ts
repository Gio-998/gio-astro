import type { CalendarCopy } from "./types";
import { dGen, dGenMid, dNom, mGen, mLoc, plural } from "@/content/horoscope/sr-cases";

/** Datumi stižu iz izračunatih podataka u nominativu, a reči padež biraju ovde: "do 3. novembra", "u novembru". */
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
/** Every date in a list of dates, in the genitive: "9. novembar u Škorpiji" to "9. novembra u Škorpiji". */
const genAll = (s: string) => s.replace(/(\d{1,2})\.?\s+(\p{L}+)/gu, (_, n: string, m: string) => `${n}. ${mGen(m)}`);
const many = (p: string) => (p.startsWith("pun") ? "punih Meseci" : "mladih Meseci");
const qLoc = (q: string) => (q.startsWith("Pun") ? "punom Mesecu" : q.startsWith("Mlad") ? "mladom Mesecu" : q.toLowerCase());

export const sr: CalendarCopy = {
  dayShort: ["ned", "pon", "uto", "sre", "čet", "pet", "sub"], and: "i",
  signIn: { aries: "u Ovnu", taurus: "u Biku", gemini: "u Blizancima", cancer: "u Raku", leo: "u Lavu", virgo: "u Devici", libra: "u Vagi", scorpio: "u Škorpiji", sagittarius: "u Strelcu", capricorn: "u Jarcu", aquarius: "u Vodoliji", pisces: "u Ribama" },
  signTo: { aries: "u Ovna", taurus: "u Bika", gemini: "u Blizance", cancer: "u Raka", leo: "u Lava", virgo: "u Devicu", libra: "u Vagu", scorpio: "u Škorpiju", sagittarius: "u Strelca", capricorn: "u Jarca", aquarius: "u Vodoliju", pisces: "u Ribe" },
  quarter: { new: "Mladi Mesec", "first-quarter": "Prva četvrt", full: "Pun Mesec", "last-quarter": "Poslednja četvrt" },
  eclipse: { "solar-total": "potpuno pomračenje Sunca", "solar-annular": "prstenasto pomračenje Sunca", "solar-partial": "delimično pomračenje Sunca", "lunar-total": "potpuno pomračenje Meseca", "lunar-partial": "delimično pomračenje Meseca", "lunar-penumbral": "polusenčno pomračenje Meseca" },
  span: (d, h) => `${d} ${plural(d, "dan", "dana", "dana")} i ${h} ${plural(h, "sat", "sata", "sati")}`,
  pct: (n) => `${n}%`,
  times: (n) => ["", "jednom", "dvaput", "tri puta", "četiri puta"][n] ?? `${n} puta`,
  when: (date, time, signIn) => `${dNom(date)} u ${time}, ${signIn}`,
  links: { daily: "Dnevni horoskop", dailySub: "Tvoj znak danas", monthly: "Mesečni horoskop", moonSign: "Izračunaj mesečev znak", rising: "Izračunaj podznak", zodiacOf: (n) => `Znak ${n}`, horoscopeOf: (n) => `Dnevni horoskop ${n}`, moonYear: (y) => `Mesečev kalendar ${y}`, mercuryYear: (y) => `Retrogradni Merkur ${y}` },

  moon: {
    crumb: "Mesečev kalendar",
    hub: {
      h1: "Mesečev kalendar: faza danas i šta sledi",
      title: "Mesečev kalendar: faza danas, pun i mladi Mesec",
      description: "Mesečeva faza danas, sledeći pun i mladi Mesec sa tačnim vremenom i znakom i kalendar za svaki mesec do decembra 2027, dan po dan.",
      blocks: [
        { id: "phases", title: "Osam faza prostim rečima", paras: ["Mesec nema svoju svetlost. Tokom meseca se menja samo to koliko njegove osvetljene polovine gleda ka nama. Četiri glavne faze mogu da se izračunaju u minut, a četiri između njih traju po nekoliko dana."], list: [
          "Mladi Mesec: stoji između Zemlje i Sunca i ne može da se vidi. Tih trenutak da izabereš jednu stvar koju želiš da počneš.",
          "Rastući srp: tanka linija na večernjem nebu. Sada se računaju prvi mali koraci.",
          "Prva četvrt: osvetljena polovina. Često baš tu plan sreće prvi problem.",
          "Rastući Mesec: više od polovine i još raste. Dobro vreme da doteraš započeto.",
          "Pun Mesec: Zemlja je između Sunca i Meseca, pa je cela strana ka nama osvetljena. Stvari deluju jasnije, ili bar glasnije.",
          "Opadajući Mesec: svetlost počinje da se povlači. Prirodno vreme da podeliš ono što si naučio.",
          "Poslednja četvrt: opet polovina, ali druga. Pitaj se šta možeš da ostaviš.",
          "Opadajući srp: tanka linija pred zoru. Odmor, sređivanje, malo praznog prostora.",
        ] },
        { id: "sign", title: "Šta dodaje Mesečev znak", paras: [
          "Tvoj horoskopski znak pokazuje gde je Sunce bilo na tvoj rođendan. Mesec je mnogo brži: obiđe zodijak za nešto više od 27 dana i u svakom znaku ostaje oko dva i po dana. Zato se tabele po danima na mesečnim stranicama menjaju tako često.",
          "Mladi Mesec uvek pada u znak u kom je i Sunce, jer su tada njih dvoje u liniji. Pun Mesec pada u suprotan znak, pa svaki spaja dve teme, na primer Bika i Škorpiju ili Blizance i Strelca. Zato na mesečnim stranicama svaku fazu čitamo za njen znak.",
        ] },
        { id: "use", title: "Kako da koristiš kalendar za razmišljanje", list: [
          "Na mladi Mesec zapiši jednu rečenicu o tome šta želiš da počneš. Jednu, da je zapamtiš.",
          "U prvoj četvrti zabeleži šta ti se isprečilo. Obično je tamo pravi posao.",
          "Na pun Mesec pročitaj rečenicu još jednom i pitaj se šta sada vidiš, a ranije nisi.",
          "U poslednjoj četvrti ostavi jednu stvar koja ti više ne pomaže.",
          "Posle tri kruga pročitaj sve beleške odjednom. Obrasci se vide lakše od pojedinačnih trenutaka.",
        ] },
        { id: "method", title: "Odakle su ovi datumi", paras: [
          "Svaki datum i svako vreme ovde su izračunati, a ne prepisani iz tabele. Koristimo biblioteku astronomy-engine, isti kod koji pokreće naš dnevni horoskop, a test sve datume računa još jednom na drugi način. Vremena su po beogradskom vremenu, koje je isto kao u Skoplju, Berlinu i Beču. Ako si u drugoj zoni, dodaj ili oduzmi sate.",
          "Mesečev kalendar govori gde je Mesec. Ne može da kaže šta će se desiti, i takvom kalendaru ne bismo verovali. Neki kalendari ocenjuju dane za šišanje ili sadnju pasulja. To ostavljamo po strani, jer ne možemo da dokažemo. Ono što nudimo je tačno nebo i dobro pitanje uz njega.",
        ] },
      ],
      faq: [
        ["Koliko traje jedan mesečev ciklus?", "Oko 29 i po dana od jednog do drugog mladog Meseca. Tačna dužina varira za nekoliko sati, jer Mesečeva putanja nije savršen krug. Na svakoj mesečnoj stranici stoji stvarna dužina ciklusa koji tamo počinje."],
        ["Zašto drugi kalendari pokazuju malo drugačije vreme?", "Razlika je najčešće u vremenskoj zoni ili u zaokruživanju na minute. Mi prikazujemo vreme u Beogradu: zimi UTC+1, a leti UTC+2."],
        ["Zašto se Mesečev znak razlikuje od mog znaka?", "Mere različite stvari. Tvoj znak je položaj Sunca na tvoj rođendan, a Mesec menja znak na svaka dva do tri dana. Gde je Mesec bio u trenutku tvog rođenja pokazaće ti kalkulator za mesečev znak."],
        ["Da li pun Mesec utiče na san i raspoloženje?", "Neki ljudi kažu da utiče, a mi ne možemo da obećamo ni jedno ni drugo. Ako te zanima, vodi kratke beleške tri ciklusa i pogledaj svoj sopstveni obrazac."],
      ],
    },
    today: (date, phase, n, signIn) => `Danas, ${dNom(date)}: ${phase}, osvetljenost ${n}%, Mesec je ${signIn}.`,
    todayLabel: "Danas", nowTitle: "Mesec danas i sledeće faze", monthsTitle: "Mesečev kalendar po mesecima",
    head: { phase: "Faza", date: "Datum", time: "Vreme", sign: "Znak", day: "Dan", moon: "Mesec", moonSign: "Mesečev znak", horoscope: "Horoskop", month: "Mesec", newMoon: "Mladi Mesec", fullMoon: "Pun Mesec", note: "Napomena" },
    faqNext: { qFull: "Kada je sledeći pun Mesec?", qNew: "Kada je sledeći mladi Mesec?", a: (when) => `Sledeći put: ${when}. Ova stranica se osvežava svake noći, pa odgovor ostaje tačan.` },
    zone: { winter: "Vremena su po beogradskom vremenu, UTC+1, isto kao u Skoplju, Berlinu i Beču.", summer: "Vremena su po beogradskom vremenu, UTC+2, isto kao u Skoplju, Berlinu i Beču.", change: (d) => `Vremena su po beogradskom vremenu. Časovnici se pomeraju ${dGen(d)}.` },
    month: {
      h1: (m, y) => `Mesečev kalendar ${m} ${y}`,
      title: (m, y) => `Mesečev kalendar ${m} ${y}: pun i mladi Mesec`,
      description: ({ newMoon, full, m, y }) => `Mladi Mesec ${genAll(newMoon)}, pun Mesec ${genAll(full)}. Sve faze u ${mLoc(m)} ${y}. sa tačnim vremenom, plus znak Meseca za svaki dan.`,
      lead: ({ newMoons, fulls, m, y }) => `${cap(m)} ${y}: mladi Mesec ${genAll(newMoons)}, pun Mesec ${genAll(fulls)}.`,
      phasesTitle: (m, y) => `Mesečeve faze u ${mLoc(m)} ${y}`, factsTitle: (m, y) => `Nebo u ${mLoc(m)} ${y}`, daysTitle: (m, y) => `Mesec dan po dan u ${mLoc(m)} ${y}`,
      lunationTitle: (q, signIn, date) => `${q} ${signIn}, ${dNom(date)}`,
      daysCaption: "Vreme pokazuje kada Mesec menja znak. Link otvara dnevni horoskop za znak u kom je Mesec u podne. Dani koji još nisu objavljeni vode na tekuću stranicu znaka.",
      cycle: (start, length, next) => `Mesečev ciklus koji počinje ${dGenMid(start)} traje ${length}, do sledećeg mladog Meseca ${dGen(next)}.`,
      sun: (date, signTo) => `Sunce ulazi ${signTo} ${dGen(date)}.`,
      changes: (m, y, n, from, to) => `Mesec menja znak ${n} puta u ${mLoc(m)} ${y}: počinje ${from}, a završava ${to}.`,
      mercury: (m, y, from, to) => `Retrogradni Merkur od ${dGenMid(from)} do ${dGenMid(to)} obuhvata i ${m} ${y}.`,
      eclipse: (q, date, e) => `${cap(e)} ${dGen(date)}, pri ${qLoc(q)}, vidi se samo sa delova Zemlje.`,
      qFull: (m, y) => `Kada je pun Mesec u ${mLoc(m)} ${y}?`, qNew: (m, y) => `Kada je mladi Mesec u ${mLoc(m)} ${y}?`, qHalf: (m, y) => `Kada su Mesečeve četvrti u ${mLoc(m)} ${y}?`,
      aFull: (m, y, list) => `Pun Mesec u ${mLoc(m)} ${y}. pada ovako: ${list}.`, aNew: (m, y, list) => `Mladi Mesec u ${mLoc(m)} ${y}. pada ovako: ${list}.`,
      aHalf: (first, last) => `Prva četvrt: ${first}. Poslednja četvrt: ${last}.`,
    },
    plural: { new: "mlada Meseca", full: "puna Meseca" },
    twoInMonth: (p, m, y, dates) => `U ${mLoc(m)} ${y}. ima dva ${p}: ${dates}.`,
    year: {
      h1: (y) => `Mesečev kalendar ${y}: svi puni i mladi Meseci`,
      title: (y) => `Pun Mesec ${y}: kalendar svih punih i mladih Meseci`,
      description: (y, f, n) => `Svih ${f} punih i ${n} mladih Meseci u ${y}. sa datumom, vremenom i znakom, plus pomračenja te godine. Dve pregledne tabele koje možeš da sačuvaš.`,
      lead: (y, f, n) => `U ${y}. ima ${f} punih i ${n} mladih Meseci, ovde poređanih po redu, svaki sa svojim znakom.`,
      aboutTitle: (y) => `Mesečeva godina ${y}`, fullTitle: (y) => `Kalendar punog Meseca ${y}`, newTitle: (y) => `Mladi Mesec ${y}: svi datumi`, eclipseTitle: (y) => `Pomračenja ${y}`,
      intro: {
        2026: ["Ovde je svaki pun i mladi Mesec u 2026. sa datumom, vremenom i znakom. Poslednja dva meseca imaju svoje stranice sa sve četiri faze, znakom Meseca za svaki dan i tekstom za svaku fazu. Raniji datumi ostaju ovde za tvoje beleške ili za pogled unazad.", "Pogled unazad posebno je koristan sa mesečevim kalendarom. Izaberi pun Mesec s početka godine i pogledaj beleške ili fotografije iz te nedelje. Može da te iznenadi šta te je tada brinulo i koliko toga više nema."],
        2027: ["Cela 2027. na jednom mestu. Svaki datum vodi do svoje mesečne stranice sa sve četiri faze, znakom Meseca dan po dan i tekstom napisanim baš za znak te faze.", "Godina Mesečevih faza je jednostavan planer. Obeleži mlade Mesece za stvari koje želiš da počneš, a pune da proveriš kako su krenule. Za dvanaest meseci videćeš kako se znakovi kreću po krugu i koje delove tvog života svaki od njih osvetljava."],
      },
      twice: (p, signIn, y, dates) => `U ${y}. dva ${p} padaju ${signIn}: ${dates}.`,
      eclipseLine: (date, e, q, signIn) => `${dNom(date)}: ${e}, pri ${qLoc(q)} ${signIn}.`,
      tableCaption: "Vremena su po beogradskom vremenu. Datum vodi na mesečnu stranicu tamo gde ona postoji.",
      qFull: (y) => `Koliko punih Meseci ima u ${y}?`, qNew: (y) => `Koliko mladih Meseci ima u ${y}?`, qEclipse: (y) => `Koja pomračenja ima u ${y}?`,
      aCount: (y, n, p, first, last) => `U ${y}. ima ${n} ${many(p)}. Prvi je ${dGen(first)}, a poslednji ${dGen(last)}.`,
      aEclipse: (list) => `Svako od ovih vidi se samo sa delova Zemlje: ${list}.`,
    },
    reflect: {
      "last-quarter:leo": [
        "Sa Mesecom u Lavu i Suncem u Škorpiji, ponos i privatnost vuku na suprotne strane. Seti se nečega što si uradio zbog aplauza, a dobio tišinu. Možeš to da spustiš, a da se ne pretvaraš da ti nikad nije bilo važno. Pitaj se šta bi i dalje radio kad niko ne bi tapšao.",
        "Ova četvrt pada na sam kraj Lava, kad je želja da te vide skoro dogorela. Primeti gde još uvek glumiš: vesela poruka u grupi, šala koja pokriva umor. Skini jednu malu ulogu ove nedelje i vidi ko ipak ostaje blizu.",
      ],
      "new:scorpio": [
        "Mladi Mesec u Škorpiji odgovara stvarima koje nikad ne bi objavio. Imenuj jedan teret koji nosiš sam: dug, zamerku, strah za nekoga koga voliš. Ne moraš to da rešiš večeras. Zapiši ga, a zatim zapiši šta bi želeo kad ti on ne bi vodio dane. Ta kratka, privatna rečenica je dobar način da se otvori ciklus.",
        "Rana Škorpija ima jednostavan način da pita šta zaista želiš, bez učtive verzije. Izaberi jedno mesto gde stalno govoriš da je sve u redu. Tokom naredne dve nedelje probaj iskrenu verziju sa jednom osobom kojoj veruješ. Bliskost obično raste kroz mala otkrivanja, pa počni malo i daj im vremena da odgovore.",
      ],
      "first-quarter:aquarius": [
        "Vodolija ovde stoji u kvadratu sa Suncem u Škorpiji: glava protiv stomaka. Nešto što si započeo na mladi Mesec sada traži odluku, a prijatelji možda imaju mišljenje. Saslušaj ih, pa proveri kako telo reaguje. Ako plan funkcioniše samo kad ignorišeš osećanje, promeni plan.",
        "Do sada je Mesec stigao u Vodoliju i traži vazduh u prostoriji. Ako se privatna briga pretvorila u krug, izvedi je napolje: šetnja sa prijateljem, jednostavno pitanje za nekoga ko to vidi izdaleka. Širi pogled možda neće rešiti stvar, ali može da pokaže sledeći korak.",
      ],
      "full:gemini": [
        "Pun Mesec u Blizancima stoji naspram Sunca u Strelcu, pa se sitne činjenice sreću sa velikim uverenjima. Možda priča koju pričaš o svom životu više ne odgovara detaljima. Pogledaj poruke koje si poslao ovog meseca, svađu koju stalno vežbaš, tračak koji si preneo dalje. Šta si zaista znao, a šta si samo uživao da kažeš? Izgovori naglas jednu istinitu stvar, pa pusti da se razgovor završi, a da ne moraš da pobediš.",
        "Ovaj pun Mesec u Blizancima obasjava buku sezone: spiskove, Viber grupe, mišljenja svih rođaka. Pre nego što odgovoriš na sledeću poruku, izbroj koliko niti držiš i koje tri su važne. Verovatno već znaš dovoljno. Izaberi jedan razgovor oko kog kružiš i obavi ga toplo, sa telefonom u drugoj sobi.",
      ],
      "last-quarter:virgo": [
        "Poslednja četvrt u Devici je dobar trenutak za iskreno uređivanje. Pogledaj svoju listu i precrtaj ono što postoji samo zato što misliš da treba. Zadrži poslove koji olakšavaju narednu nedelju. Sređivanje jedne fioke može da smiri prezauzetu glavu više od velikog plana.",
        "Ovde Mesec testira standarde koje si sam sebi postavio. Kada je dovoljno dobro prestalo da bude dovoljno dobro? Izaberi jedan posao koji stalno prepravljaš i proglasi ga završenim. Vreme koje dobijaš nazad pripada tebi, a ljudi oko tebe verovatno neće primetiti da nedostaje poslednji sjaj.",
      ],
      "new:sagittarius": [
        "Mladi Meseci u Strelcu žele horizont. Za to ti ne treba avionska karta: dovoljan je kurs, jezik ili pitanje na koje godinama želiš da odgovoriš. Pitaj se u šta sada veruješ, a nisi verovao pre pet godina. Zatim izaberi jedan mali korak ka onome na šta to uverenje pokazuje i napravi ga pre kraja nedelje.",
        "Pod ovim mladim Mesecom primeti gde ti je život postao pretesan. To može da bude rutina, grad ili način na koji opisuješ sebe. Zapiši tri mesta na koja bi otišao kad bi novac i obaveze ćutali jedan dan. Jedno od njih obično krije trag o tome za čim si gladan, a taj trag je dovoljan za početak ciklusa.",
      ],
      "first-quarter:pisces": [
        "Mesec u Ribama stoji u kvadratu sa Suncem u Strelcu: veliki planovi sreću umorno srce. Ako ti je oduševljenje malo opalo, poslušaj pre nego što poguraš. Nekim ciljevima treba vera, a nekima dremka. Pitaj se šta je ovo.",
        "Pred kraj godine prva četvrt u Ribama može da zamuti liniju između onoga što ti želiš i onoga što žele svi oko tebe. Uzmi deset tihih minuta i razdvoj to na papiru. Spisak koji je tvoj možda je kraći, i to je olakšanje.",
      ],
      "full:cancer": [
        "Pun Mesec u Raku, naspram Sunca u Jarcu, stavlja dom i dužnost licem u lice. Ko je sve držao na okupu, i ko je to primetio? Ako si to ti, reci to. Ako je neko drugi, zahvali mu se običnim rečima. Pogledaj sto za kojim jedeš, pozive koje odlažeš, ljude zbog kojih bi sve ostavio. Odgovor na pitanje gde pripadaš obično sedi baš tu.",
      ],
      "last-quarter:libra": [
        "Zatvaranje godine pod poslednjom četvrti u Vagi poziva na pošten pogled na tvoje odnose. Koji su bili ravnopravni, a koji su te ostavili da sabiraš? Ne moraš ništa da rešavaš sada. Imenuj jednu stvar koju želiš drugačije da uravnotežiš naredne godine, a ostalo ostavi za januar.",
      ],
      "new:capricorn": [
        "Mladi Mesec u Jarcu ima čist, hladan vazduh prvog radnog dana. Preskoči veliku novogodišnju odluku. Izaberi jednu stvar koju si spreman da gradiš polako: naviku štednje, veštinu, granicu na poslu. Pitaj se kako bi to izgledalo za dvanaest meseci ako mu daješ deset minuta dnevno. Dosadan, stalan trud je ono što ovaj znak poštuje, a obično ti se prvo vrati kroz samopoštovanje.",
        "Poslednji mladi Mesec u godini pada u Jarac i može da ti probudi želju da do petka prekontrolišeš ceo život. Probaj sa manjim pitanjem: šta si ove godine nosio, a nikad nije bio tvoj posao? Vrati jednu od tih stvari. Čist početak često počinje jasnim opisom onoga što prestaješ da radiš.",
      ],
      "first-quarter:aries": [
        "Ovan ovde gura protiv Sunca u Jarcu, pa strpljenje i nestrpljenje dele sobu. Ako ti nov cilj već deluje sporo, na pravom si mestu. Uradi danas jednu stvar bez traženja dozvole, pa se vrati dugom planu.",
      ],
      "full:leo": [
        "Pod punim Mesecom u Lavu, naspram Sunca u Vodoliji, tvoje želje sreću potrebe grupe. Možda osećaš poriv da ustaneš i kažeš svoje, a i strah da si previše. Pogledaj gde se smanjuješ da bi drugima bilo udobno. Zatim pogledaj gde zauzimaš prostor koji nekom drugom treba. Oboje vredi videti. Uradi jednu velikodušnu stvar koja nosi i tvoje ime.",
      ],
      "last-quarter:scorpio": [
        "Mesec u Škorpiji pita čega se još držiš. Poslednja četvrt je za puštanje, a ovaj znak ne pušta lako. Počni od nečeg malog: izbriši poruku koju stalno čitaš ili prestani da vodiš račun ko ti šta duguje, pa primeti kakav je to osećaj.",
      ],
      "new:aquarius": [
        "Mladi Mesec u Vodoliji je dobro vreme da preispitaš s kim provodiš sate. Koje grupe ti daju ideje, a koje samo obaveze? Zapiši jednu stvar koju bi promenio u svom društvu kad niko ne bi mogao da se uvredi. Možda ćeš hteti da se pridružiš nečemu novom ili da učtivo izađeš iz nečega starog. U oba slučaja počni jednom porukom i pusti ostalo da dođe u svoje vreme.",
      ],
      "first-quarter:taurus": [
        "Bik stoji u kvadratu sa Suncem u Vodoliji, pa i telo ima pravo glasa o tvojim idejama. Plan može divno da izgleda na ekranu, a pogrešno da se oseća u utorak ujutru. Pitaj koliko košta u snu, novcu i obrocima. Zatim napravi jednu praktičnu promenu, da ideja zaista može da živi u tvojoj nedelji.",
      ],
      "full:virgo": [
        "Pun Mesec u Devici, naspram Sunca u Ribama, stavlja urednu listu nasuprot većem osećanju. Možda popravljaš sitnice da bi izbegao nešto veliko, ili sanjariš da bi izbegao nešto malo. Pogledaj svoje dnevne navike kao da su prijateljeve. Na šta bi nežno ukazao? Izaberi jednu rutinu za popravku i jednu brigu za puštanje, i neka to budu dva odvojena posla.",
      ],
      "last-quarter:sagittarius": [
        "Poslednja četvrt u Strelcu može da pokaže koliko je tvog plana bilo optimizam. To nije loše. Zadrži pravac i pusti rok koji si izmislio. Pitaj se koje obećanje možeš tiho da pregovaraš iznova, prvo sa sobom.",
      ],
      "new:pisces": [
        "Mladi Mesec u Ribama je mek i lako ga je propustiti. Nema potrebe za ciljem. Daj sebi jedan spor sat bez ekrana i vidi šta će izaći: pesma, ime, stara tuga. Zapiši to i ne pokušavaj da objasniš. Ako ovde ima šta da se počne, možda je to navika da slušaš sebe pre nego što dan postane glasan.",
      ],
      "first-quarter:gemini": [
        "Blizanci stoje u kvadratu sa Suncem u Ribama: osećanja sreću potrebu da se objasne. Možda ćeš ove nedelje mnogo pričati, a malo reći. Probaj da napišeš tri rečenice o tome šta zaista želiš, pa ih pročitaj nekome ko neće pokušati da ih popravi.",
      ],
      "full:libra": [
        "Pun Mesec u Vagi, naspram Sunca u Ovnu, spaja ja sa mi. Možda ćeš primetiti koliko često odlučuješ sam, ili koliko često čekaš da neko drugi odluči. Pogledaj jednu vezu i pitaj se čega se svako od vas odricao. Pravednost ovde znači više od deljenja na pola. Reci šta ti treba u jednoj mirnoj rečenici, pa pitaj isto i drugu stranu.",
      ],
      "last-quarter:capricorn": [
        "Poslednja četvrt u Jarcu je praktična oko toga šta treba napustiti. Pogledaj jednu obavezu koja uzima više nego što daje. Možeš li da je završiš, smanjiš ili predaš dalje? Sredi neprijatnu papirologiju ove nedelje i možda ćeš naći malo prostora da dišeš.",
      ],
      "new:aries": [
        "Mladi Mesec u Ovnu je najbliže startnom pištolju što nebo ima. Ako čekaš pravi trenutak, pitaj se šta zaista čekaš. Izaberi nešto što možeš da počneš pre ručka: jedan poziv, jednu stranu, jedan krug oko bloka. Neka lestvica bude niska, a početak stvaran. Hrabrost ti obično raste kad se pokreneš, retko pre toga.",
      ],
      "first-quarter:cancer": [
        "Rak stoji u kvadratu sa Suncem u Ovnu, pa tvoj pogon sreće potrebu za sigurnošću. Ako se nešto što si započeo sada oseća izloženo, proveri šta ti treba da nastaviš. Poznat obrok, razgovor sa porodicom ili rano leganje mogu da se računaju kao napredak.",
      ],
      "full:scorpio": [
        "Ovaj pun Mesec stoji na samom početku Škorpije, naspram Sunca koje je upravo ušlo u Bika. Ono što poseduješ sreće ono što poseduje tebe. Pogledaj nešto što čvrsto držiš: novac, osobu, priču o prošlosti. Pitaj se čega se plašiš da bi se desilo kad bi stisak olabavio za jedan prst. Ne moraš ništa da daješ. Da jasno vidiš strah, to je posao ove noći.",
        "Mesec dana kasnije pun Mesec ponovo pada u Škorpiju, ovog puta u njene poslednje stepene, sa Suncem na samom kraju Bika. Nešto što si primetio u aprilu možda je spremno da se završi. Seti se šta se od tada promenilo, a šta je samo premešteno. Ako poglavlje traži kraj, zatvori ga ljubazno: jedan iskren razgovor, jedan sređen račun, jedna stvar koju pristaješ da više ne spominješ.",
      ],
      "last-quarter:aquarius": [
        "Mesec u Vodoliji te malo podiže iznad nedelje. Šta odatle izgleda nepotrebno? Grupa na koju ideš samo iz navike, rasprava do koje ti više nije stalo. Povuci se iz jedne od njih i vidi da li iko ima nešto protiv.",
      ],
      "new:taurus": [
        "Mladi Mesec u Biku počinje od tela i stanja na računu. Šta ti daje sigurnost, a šta samo izgleda kao da treba da je daje? Prođi kroz svoj dom i izaberi jednu stvar koja ti donosi pravo zadovoljstvo i jednu koju čuvaš iz griže savesti. Posadi nešto ove nedelje, skuvaj nešto polako ili otvori štedni račun sa malim, dosadnim iznosom. Stalna udobnost je sasvim dobar cilj.",
      ],
      "first-quarter:leo": [
        "Mesec u Lavu stoji u kvadratu sa Suncem u Biku: želja da zablistaš sreće želju da ostaneš u udobnosti. Ako projekat traži da pokažeš lice, ovo je dobra nedelja za to. Objavi to, otpevaj pesmu, započni razgovor o plati.",
      ],
      "last-quarter:pisces": [
        "Poslednja četvrt u Ribama traži manje buke. Pusti jednu obavezu da prođe bez dugog izvinjenja, a vreme daj odmoru ili nekome kome si potreban. Suze, dremke i duge kupke ovde se računaju kao korisne, šta god da piše u kalendaru.",
      ],
      "new:gemini": [
        "Mladi Mesec u Blizancima voli svežu ideju, a do doručka ih možeš imati pet. Zapiši sve, pa zaokruži onu koju bi sutra rado objasnio prijatelju. Radoznalosti treba mesto za sletanje. Prijavi se na čas, pošalji prvu poruku, postavi pitanje za koje misliš da je previše jednostavno. Tokom narednih mesec dana prati tu jednu nit i vidi kuda vodi.",
      ],
      "first-quarter:virgo": [
        "Devica stoji u kvadratu sa Suncem u Blizancima, pa sve te ideje sreću kalendar. Koju zaista možeš da uklopiš? Daj joj datum i prvi mali zadatak. One koje ostaviš i dalje su tu, a kratka lista stiže dalje od duge.",
      ],
      "full:sagittarius": [
        "Pun Mesec u Strelcu stoji naspram Sunca u Blizancima: dugi pogled protiv poslednjeg detalja. Možda ti je dosta malih razgovora i gladan si smisla, ili ti je dosta velikih ideja i treba ti činjenica. Izađi napolje ako možeš i pogledaj nešto daleko. Zatim se pitaj koje te je uverenje vodilo ove godine i da li to još zaslužuje. Zadrži deo koji te čini ljubaznijim i hrabrijim.",
      ],
      "last-quarter:aries": [
        "Mesec u Ovnu može da ti probudi želju da sve dramatično baciš. Prvo zastani. Poslednjoj četvrti bolje leži čist rez nego predstava. Imenuj svađu sa kojom si završio i okončaj svoj deo bez govora.",
      ],
      "new:cancer": [
        "Mladi Mesec u Raku počinje kod kuće, šta god ti dom sada značio. Pogledaj koga zoveš kad stvari krenu naopako i ko zove tebe. Izaberi jedan način da svoj prostor ili porodični život učiniš malo nežnijim: zajednički obrok, popravljena polica, razgovor koji počinje sa kako si, zaista. Briga koju isplaniraš obično traje duže od one koju samo osećaš.",
      ],
      "first-quarter:libra": [
        "Vaga stoji u kvadratu sa Suncem u Raku: ono što duguješ svojim ljudima protiv onoga što duguješ svima ostalima. Ako si čuvao mir po visokoj ceni, ovo je dobra nedelja da to primetiš. Ponudi jednu iskrenu želju, ma koliko malu, i vidi šta će se desiti.",
      ],
      "full:capricorn": [
        "Pun Mesec u Jarcu, naspram Sunca u Raku, stavlja posao i dom na istu vagu. Možda ćeš jasno videti šta tvoje ambicije traže od ljudi koje voliš, a šta tvoje porodične navike traže od tvojih ciljeva. Nijedna strana ne mora da izgubi. Iskreno pogledaj poslednje dve nedelje: kuda su otišli tvoji sati? Pomeri jedan sat, jednu nedelju, ka strani kojoj nedostaješ.",
      ],
      "last-quarter:taurus": [
        "Poslednja četvrt u Biku pita šta poseduješ, a poseduje tebe. To može da bude orman pun onoga što ti možda zatreba ili navika da kupuješ utehu. Pokloni jednu stvar ove nedelje i vidi da li će ti nedostajati.",
      ],
      "new:leo": [
        "Ovaj mladi Mesec u Lavu stiže sa Suncem i Mesecom tako tačno poravnatim da pomračenje Sunca prelazi preko dela Zemlje. Astronomiju na stranu, znak ima jasno pitanje: šta bi radio kad bi prestao da brineš da ćeš izgledati smešno? Napravi nešto svojim rukama i sa svojim imenom. Pokaži jednoj osobi. Radost koju stvoriš širi se dalje od pohvale koju skupiš.",
      ],
      "first-quarter:scorpio": [
        "Škorpija stoji u kvadratu sa Suncem u Lavu: ono što pokazuješ protiv onoga što kriješ. Nešto što si započeo u dobrom raspoloženju sada može da otkrije osetljivo mesto. Pitaj se šta ne bi voleo da iko sazna i razmisli da to kažeš jednoj osobi od poverenja. Olakšanje može da bude veće od rizika.",
      ],
      "full:aquarius": [
        "Pun Mesec u Vodoliji, naspram Sunca u Lavu, meri tvoju priču naspram priče grupe. Da li si deo nečeg većeg, ili samo stojiš pored toga? Seti se prijatelja, ciljeva i zajednica kojima pripadaš. Koji znaju pravog tebe? Pošalji poruku nekome ko te je video u najgorem izdanju i ostao. Zatim se pitaj šta možeš da vratiš, a što samo ti možeš da daš.",
      ],
      "last-quarter:gemini": [
        "Poslednja četvrt u Blizancima dolazi sa previše otvorenih kartica, ponekad i doslovno. Zatvori neke. Odjavi se sa spiskova, obriši nacrte, odgovori ili arhiviraj. Pitaj se koji je razgovor trajao dovoljno dugo i privedi ga prijateljskom kraju.",
      ],
      "new:virgo": [
        "Drugi mladi Mesec u jednom mesecu daje ti drugu priliku za početak, ovog puta u Devici. Zaboravi veliki gest. Pogledaj svoja jutra, svoj sto, način na koji se ophodiš prema telu. Koja mala navika bi olakšala sve ostalo? Počni sutra i neka bude dosadna. Napredak po meri Device je niz sitnih popravki, a one se sabiraju brže nego što bi očekivao.",
      ],
      "first-quarter:sagittarius": [
        "Strelac stoji u kvadratu sa Suncem u Devici, pa tvoj pažljiv plan traži malo prostora za trčanje. Ako si zaglavio u detaljima, pogledaj stvari izdaleka na jedan sat. Pitaj se čemu služi sve to sređivanje. Malo šira svrha može da olakša sitne poslove.",
      ],
      "full:pisces": [
        "Pun Mesec u Ribama, naspram Sunca u Devici, stavlja kontrolu nasuprot predaji. Možda si naporno radio na detaljima, a ipak osećaš da nešto klizi kroz prste. Pusti ga. Uzmi jedno veče pauze od rešavanja i primeti šta osećaš kad staneš. Tuga, olakšanje i umor su sve korisne informacije. Pitaj se gde bi mogao više da veruješ procesu, a gde bi te jasna granica zaista zaštitila.",
      ],
      "last-quarter:cancer": [
        "Ova poslednja četvrt pada na sam početak Raka, dok se letnji tempo stišava. Koju staru porodičnu ulogu i dalje igraš iz navike? Možeš da voliš, a da ne budeš stalno dežuran. Izaberi jednu malu obavezu koju ćeš vratiti ove nedelje.",
        "Ovog puta Mesec stiže do kraja Raka, pa je raspoloženje spremno da krene dalje. Sredi kutiju starih papira ili fotografija i zadrži samo ono što te greje. Sećanje je dobar gost, a ti odlučuješ koliko mu prostora daješ.",
      ],
      "new:libra": [
        "Mladi Mesec u Vagi počinje pitanjem o tome kako se odnosiš prema drugima. Gde kažeš da, a misliš ne? Izaberi jednu vezu koju želiš da dovedeš u bolju ravnotežu i počni od nečeg malog i konkretnog: ko planira, ko plaća, ko se prvi izvinjava. Zatim pogledaj lepu stranu ovog znaka. Čistija soba ili jedan lep predmet mogu da olakšaju da budeš pravedan prema ljudima.",
      ],
      "first-quarter:capricorn": [
        "Jarac stoji u kvadratu sa Suncem u Vagi: ugađanje drugima sreće završavanje posla. Odluka koju si odlagao da bi sačuvao mir sada možda mora da se donese. Daj sebi rok, reci to jednoj osobi i prihvati da neko može da bude malo razočaran.",
      ],
      "full:aries": [
        "Pun Mesec u Ovnu, naspram Sunca u Vagi, izvlači razliku između onoga što želiš i onoga što sve čini srećnim. Živci mogu da budu tanki, pa prošetaj pre nego što odgovoriš. Šta gutaš zarad sloge? Reci to jednostavno, bez okrivljivanja, počevši rečju ja. Ljutnja je često znak da je granica pređena, a to vredi znati.",
      ],
      "full:taurus": [
        "Pun Mesec u Biku, naspram Sunca u Škorpiji, pita šta ti zaista daje sigurnost. Pogledaj šta imaš: ušteđevinu, zdravlje, prijatelja koji se javlja u ponoć. Zatim pogledaj šta se plašiš da izgubiš. Oboje može da bude istina u istoj noći. Uradi nešto sporo i fizičko pre spavanja, kao kuvanje, istezanje ili dugu šetnju, i pusti telo da te podseti šta je čvrsto.",
      ],
    },
  },

  mercury: {
    crumb: "Retrogradni Merkur",
    hub: {
      h1: "Da li je Merkur sada retrogradan?",
      title: "Da li je Merkur retrogradan? Datumi za 2026. i 2027.",
      description: "Da li je Merkur danas retrogradan? Odgovor sa datumom, svaki period u 2026. i 2027. sa senkom i znakovima i šta s tim da radiš, bez straha.",
      blocks: [
        { id: "what", title: "Šta retrogradno zaista znači", paras: [
          "Merkur se ne okreće nazad. Retrogradnost je prividno kretanje, nešto što vidimo sa Zemlje. Merkur obiđe Sunce za oko 88 dana, mnogo brže od nas, i tri ili četiri puta godišnje nas prestiže sa unutrašnje strane. Dok to radi, izgleda kao da staje, oko tri nedelje se kreće unazad u odnosu na zvezde, ponovo staje i nastavlja dalje.",
          "Zamisli dva trkača na stazi. Ti si u spoljnoj traci, Merkur u unutrašnjoj i mnogo je brži. Većinu vremena izgleda da klizi u jednom pravcu preko dalje tribine. Svaki put kad te prestigne za ceo krug, neko vreme prelazi tribinu u suprotnom pravcu. Nikad se nije okrenuo. Promenio se samo ugao između vas. Astronomi ove dve tačke okreta zovu stanicama, a datumi na ovoj stranici izračunati su iz stvarnog položaja planete.",
        ] },
        { id: "shadow", title: "Šta su periodi senke", paras: [
          "Pre nego što stane, Merkur prelazi isti deo zodijaka kojim će se kasnije vratiti. Taj uvod je senka pre retrogradnosti. Pošto krene napred, treći put prelazi isti teren dok ne prođe tačku u kojoj je prvi put stao. Taj završetak je senka posle retrogradnosti. Astronomski su to obični dani. Astrolozi ih koriste da obeleže ono pre i posle retrogradnosti, a datumi se lako računaju, pa ih navodimo.",
        ] },
        { id: "people", title: "Šta ljudi povezuju s tim", paras: [
          "U astrologiji Merkur predstavlja poruke, putovanja, trgovinu i način na koji mislimo, pa je Merkur koji ide unazad postao skraćenica za pomešane konce: izgubljenu pošiljku, voz koji kasni, pogrešno shvaćenu poruku, bivšeg koji se pojavi niotkuda. Ideja je stara i služi za dobre šale.",
          "Ali vozovi kasne svakog meseca, a pamćenje više voli trenutke koji se uklapaju u priču. Ne znamo ni za jedan ozbiljan dokaz da telefoni otkazuju ili poslovi propadaju zbog Merkurovog prividnog kretanja, i ne bismo ti savetovali da zbog toga preuređuješ život. Ono što tradicija zaista nudi je redovan podsetnik da usporiš i proveriš stvari. To je korisno i ništa ne košta.",
        ] },
        { id: "do", title: "Šta vredi uraditi", list: [
          "Pročitaj pre nego što pošalješ, naročito ono što si pisao ljut.",
          "Napravi rezervnu kopiju telefona i laptopa. Uradi to zato što su kopije dobre, a kalendar neka bude podsetnik.",
          "Proveri rezervacije, vremena i adrese dvaput pre puta.",
          "Vrati se nečemu nezavršenom: nacrtu, popravci, kursu, poruci koju duguješ.",
          "Pitaj se šta si možda pogrešno razumeo. Ponovi šta si čuo.",
          "Nastavi sa stvarnim životom. Ako treba da potpišeš, kupiš ili rezervišeš, pročitaj kako treba i uradi to, kao i svakog drugog meseca.",
        ] },
        { id: "houses", title: "Kako to čitamo za tvoj znak", paras: [
          "Svaka godišnja stranica ima tabelu za svih 12 znakova. Kuće brojimo od tvog Sunčevog znaka, jedan ceo znak po kući, isto kao u dnevnom horoskopu. Merkurov znak onda pada u jednu oblast tvog života: novac, dom, partnere, posao. Ako znaš svoj podznak, pročitaj tabelu i za njega, jer možda bolje odgovara.",
        ] },
      ],
      faq: [
        ["Da li je retrogradni Merkur loš?", "Nije. To je ponavljajući prizor na nebu koji traje oko tri nedelje. Nekim ljudima je to korisna prilika da preispitaju stvari. Ako primetiš više zabuna nego obično, shvati to kao razlog da proveriš dvaput, bez ikakve strepnje."],
        ["Mogu li da potpišem ugovor ili putujem dok je Merkur retrogradan?", "Možeš. U tim nedeljama se donosi mnogo dobrih odluka. Pročitaj šta potpisuješ i proveri rezervacije, sa istom pažnjom kao i inače. Ne odlaži nešto što ti treba zbog datuma u kalendaru."],
        ["Koliko često je Merkur retrogradan?", "Po tri puta i u 2026. i u 2027, a ponekad i četiri puta u kalendarskoj godini. Svaki period traje oko tri nedelje. Na stranicama za svaku godinu su tačni datumi."],
        ["Da li se Merkur zaista kreće unazad?", "Ne. Stalno obilazi Sunce u istom smeru. Sa Zemlje samo izgleda da ide unazad dok nas prestiže na svojoj manjoj, bržoj putanji."],
        ["Zašto neki sajtovi daju drugačiji dan?", "Stanice se dešavaju u jednom tačnom trenutku, pa kalendarski datum zavisi od vremenske zone. Mi prikazujemo beogradsko vreme, isto kao u Berlinu ili Beču. Dalje na zapad ili istok datum može da se pomeri za jedan dan."],
      ],
    },
    answer: {
      retrograde: (d) => `Da. Merkur je retrogradan od ${dGen(d.since)}, ${d.signIn}. Ponovo kreće napred ${dGen(d.direct)}, a senka se završava ${dGen(d.shadowEnd)}.`,
      "pre-shadow": (d) => `Još ne. Merkur je ušao u senku pre retrogradnosti ${dGenMid(d.since)} i postaje retrogradan ${dGen(d.retro)}, ${d.signIn}.`,
      "post-shadow": (d) => `Ne. Merkur je krenuo napred ${dGenMid(d.since)} U senci posle retrogradnosti ostaje do ${dGen(d.shadowEnd)}.`,
      clear: (d) => `Ne. Merkur se kreće napred. Sledeća retrogradnost počinje ${dGen(d.retro)}, ${d.signIn}, a senka pre nje ${dGen(d.shadowStart)}.`,
    },
    asOf: (date) => `Provereno prema izračunatom položaju planete za ${dNom(date)}. Stranica se osvežava svake noći.`,
    nowTitle: "Merkur trenutno", nextTitle: "Sledeći datumi retrogradnog Merkura",
    head: { stage: "Faza", date: "Datum", time: "Vreme", position: "Položaj", period: "Retrogradno", signs: "Znakovi", shadow: "Sa senkom", sign: "Znak", house: "Kuća", focus: "Vredi pogledati" },
    stage: { preShadow: "Početak senke pre retrogradnosti", retro: "Postaje retrogradan", direct: "Kreće napred", postShadow: "Kraj senke posle retrogradnosti", moves: (signTo) => `Vraća se ${signTo}` },
    clock: "Vremena su po beogradskom vremenu, isto kao u Skoplju, Berlinu i Beču.",
    range: (from, to) => `od ${dGen(from)} do ${dGen(to)}`,
    year: {
      h1: (y) => `Retrogradni Merkur ${y}: svi datumi i periodi senke`,
      title: (y) => `Retrogradni Merkur ${y}: datumi, senka i znakovi`,
      description: (y, n) => `Merkur je u ${y}. retrogradan ${n}. Svi datumi stanica, periodi senke i znakovi, plus šta svaki period može da znači za tvoj znak, kuću po kuću.`,
      lead: (y, n, list) => `Merkur je u ${y}. retrogradan ${n}: ${list}.`,
      overviewTitle: (y) => `Datumi retrogradnog Merkura ${y}`,
      periodTitle: (range, signs) => `${cap(range)}: ${signs}`, bySignTitle: (signs) => `Za svaki znak: ${signs}`,
      bySignCaption: "Kuće se broje od tvog Sunčevog znaka, jedan ceo znak po kući. Dva broja znače da Merkur menja znak tokom perioda.",
      intro: {
        2026: ["U 2026. svaka retrogradnost ostaje unutar jednog znaka: Ribe, Rak, pa Škorpija. Sva tri su vodeni znakovi, pa se preispitivanja više tiču osećanja, sećanja i poverenja nego papirologije. To je tumačenje, a ne prognoza. Datumi su astronomija, a šta ćeš s njima uraditi zavisi od tebe."],
        2027: ["U 2027. svaka retrogradnost počinje u vodenom znaku i sklizne nazad u vazdušni znak ispred njega: iz Riba u Vodoliju, iz Raka u Blizance, iz Škorpije u Vagu. Tako svaki period ima dva poglavlja, a osećanja se obično pretresu u razgovoru pre nego što se preispitivanje završi. Tvoja kuća se usput menja, i zato tabele prikazuju dva broja."],
      },
      qWhen: (y) => `Kada je Merkur retrogradan u ${y}?`, aWhen: (y, list) => `U ${y}. Merkur je retrogradan ${list}.`,
      qShadow: (y) => `Kada su periodi Merkurove senke u ${y}?`, aShadow: (list) => `Računajući senku pre i posle retrogradnosti, periodi traju ${list}.`,
      qSigns: (y) => `Kroz koje znakove prolazi retrogradni Merkur u ${y}?`, aSigns: (list) => `Dok je retrogradan, Merkur prolazi kroz ove znakove: ${list}.`,
    },
    periods: {
      "2026:pisces": {
        paras: ["U Ribama Merkur menja preciznost za raspoloženje. Misli dolaze kao slike i napola zapamćene pesme umesto kao spiskovi, pa je ovo prirodan prozor da iznova pročitaš šta si osećao, a ne samo šta si rekao. Drži svesku pri ruci. Stari snovi i nezavršeni kreativni radovi mogu da se vrate i zaslužuju sat tvog vremena.", "S praktične strane, proveri dvaput ono što Ribe vole da zamute: vremena, iznose, ko je na šta pristao. Kratak pisani rezime posle razgovora štedi mnogo kasnijeg nagađanja."],
        bySign: ["Tiho vreme. Stare brige mogu da izađu, pa ih zapiši umesto da ih noću žvaćeš.", "Prijatelji i grupe. Ustajaloj grupi na Viberu ili zajedničkom planu dobro bi došlo iskreno osvežavanje.", "Posao i ugled. Proveri šta si obećao šefu ili klijentu pre nego što obećaš još.", "Učenje i putovanja. Ponovo proveri rezervacije i vrati se kursu koji si napustio.", "Zajednički novac i poverenje. Pročitaj ponovo zajednički račun ili kredit i pitaj šta još duguješ.", "Partneri. Ponovi šta si čuo pre nego što odgovoriš. Starim razgovorima možda treba druga runda.", "Dnevna rutina. Pregledaj navike koje te umaraju i popravi jedan mali sistem na poslu.", "Radost i romansa. Stara ljubav ili stari hobi mogu da se vrate. Odluči šta želiš od toga.", "Dom i porodica. Pretresite ponovo stambeno pitanje i potraži papire koji nedostaju.", "Poruke i kratki putevi. Uspori odgovore i proveri adresu dvaput.", "Novac i vrednosti. Prođi kroz pretplate i pitaj se šta zaista plaćaš.", "Ti, u ogledalu. Preispitaj kako deluješ i daj sebi prostora da promeniš mišljenje."],
      },
      "2026:cancer": {
        paras: ["Dok se Merkur vraća kroz Raka, sećanje vodi glavnu reč. Stare fotografije, porodične priče i miris jedne kuhinje mogu da budu bliži od ovonedeljne liste zadataka. Mnogi koriste retrogradnost u Raku da pozovu roditelja, srede kutiju papira ili konačno odgovore na poruku od kuće.", "Ako se porodični razgovor ponavlja, primeti osećanje ispod reči. Možeš da promeniš kako reaguješ čak i kad tema ostane ista."],
        bySign: ["Domaći teren. Porodični razgovori mogu da se vrate u krug, pa slušaj šta stoji ispod stare žalbe.", "Komšije, braća i sestre, dnevne poruke. Pošalji ljubaznu poruku koju stalno pišeš u glavi.", "Tvoje novčane navike. Pogledaj na šta trošiš zbog utehe i da li te to još teši.", "Tvoja raspoloženja. Dozvoli sebi da ovog meseca budeš sporiji i preispitaj odluku donetu u žurbi.", "Pozadina tvog uma. San, snovi i stara kajanja traže tih sat sa sveskom.", "Tvoje društvo. Neko iz stare grupe može da se javi. Vidi da li veza još odgovara.", "Karijera i porodica se sudaraju. Pogledaj ponovo kako deliš vreme između njih.", "Uverenja iz kuće. Proveri koja su mišljenja tvoja, a koja si nasledio.", "Zajednička sredstva. Porodični novac ili dugovi mogu da traže jasan, miran razgovor.", "Bliske veze. Stare povrede mogu da izađu. Pitaj pre nego što pretpostaviš šta je neko mislio.", "Dnevna briga. Vrati se obrocima, snu i poslovima koji stalno padaju na tebe.", "Igra i deca. Otvori ponovo nešto što si voleo kao dete, samo iz zadovoljstva."],
      },
      "2026:scorpio": {
        paras: ["Škorpija čita između redova, a retrogradnost ovde oštri sumnju koliko i uvid. Možda ćeš primetiti šta je izostavljeno iz ugovora, priče ili izvinjenja. Pre nego što nešto preduzmeš, pitaj se: da li ovo znam, ili ovoga se plašim?", "Ovo je jak period za istraživanje, za suočavanje sa brojkom koju izbegavaš i za iskrene razgovore o novcu ili poverenju. Idi polako sa optužbama. Pitanje otvara više vrata."],
        bySign: ["Dugovi i poverenje. Pročitaj sitna slova na svemu zajedničkom i postavi direktno pitanje.", "Partnerove brige. Nešto skriveno može da izađe. Pusti ga da završi pre nego što odgovoriš.", "Radne navike. Iskopaj pravi uzrok problema koji se ponavlja umesto da ga krpiš.", "Ljubav i kreativnost. Stara simpatija ili napušten projekat mogu da te povuku. Pitaj zašto baš sada.", "Porodične stvari i popravke po kući. Pogledaj ispod daski, doslovno ili ne.", "Reči sa oštricom. Pročitaj ponovo oštru poruku pre nego što je pošalješ.", "Tvoja ušteđevina. Saznaj kuda novac zaista odlazi, bez sramoćenja sebe.", "Tvoji motivi. Možda ćeš videti sebe jasnije nego što je prijatno. Iskoristi to blago.", "Ono što držiš za sebe. Daj privatnom strahu sat vremena na papiru.", "Savezi. Proveri kome u svojoj grupi zaista veruješ, a koga držiš iz navike.", "Moć na poslu. Preispitaj potez u karijeri privatno pre nego što išta objaviš.", "Dubinsko učenje. Vrati se pitanju koje te muči godinama i pročitaj nešto teško."],
      },
      "2027:pisces>aquarius": {
        paras: ["Ovaj period počinje u Ribama i usred puta sklizne nazad u Vodoliju. Prvi deo je unutrašnji: osećanja, snovi, stvari koje bi teško stavio u mejl. Drugi je hladniji i društveniji, dobar za proveru ideje sa prijateljima ili preispitivanje svog mesta u grupi.", "Prati primopredaju. Ono što si privatno osećao prve nedelje može da postane nešto što konačno možeš da objasniš treće. Tabela pokazuje dan kada Merkur menja znak."],
        bySign: ["Od privatnih briga do prijatelja koji mogu da ih čuju. Pusti jednu osobu unutra.", "Grupni planovi prelaze u pitanja o poslu. Proveri ko zaista šta radi.", "Preispitivanje karijere može da dovede do kursa ili puta. Uporedi beleške pre nego što se obavežeš.", "Velike ideje sreću budžet. Pitaj koliko plan košta i ko deli račun.", "Zajednički novac postaje razgovor sa partnerom. Donesi brojke i čuvaj miran ton.", "Razgovor sa partnerom prelazi u dnevne navike. Dogovorite ko koji posao radi.", "Rutina ustupa mesto igri. Pusti jednu obavezu i vrati se hobiju koji ti nedostaje.", "Romansa i dom se sreću. Razmisli koga puštaš u svoj privatni prostor.", "Pitanje doma treba izgovoriti naglas. Pozovi brata ili komšiju kojih se to tiče.", "Reči postaju novac. Pročitaj ponovo fakturu, ponudu, uslove posla.", "Tvoje vrednosti ti se vraćaju. Pitaj se da li tvoji troškovi još liče na tebe.", "Počinješ u svom znaku, a završavaš iza scene. Odmor je deo preispitivanja."],
      },
      "2027:cancer>gemini": {
        paras: ["Prvo dom, pa naslovi. Merkur počinje povratak kroz Raka, gde sećanje i porodica daju ton, a zatim klizi u Blizance, jedan od svojih znakova, gde se gomilaju vesti, poslovi i poruke. Blizanci vole i dvostruko značenje, pa pročitaj pre nego što odgovoriš.", "Pošto su Blizanci Merkurov dom, ovaj period može da bude zauzetiji od drugih. Neka spiskovi budu kratki, potvrdi planove napismeno i ostavi dodatni dan za sve što zavisi od tuđih odgovora."],
        bySign: ["Porodični razgovor prelazi u običnu logistiku. Dogovorite datume, prevoz i ključeve.", "Poruke vode do novca. Podseti na neplaćenu uslugu ili pošalji fakturu.", "Merkur vlada tvojim znakom i vraća se kući. Pregledaj budžet, a zatim svoje planove.", "Period počinje od tebe, a onda se okreće unutra. Ostavi prostora za dremke i privatno razmišljanje.", "Stara osećanja izlaze, a prijatelji pomažu da ih središ. Pozovi onog ko zna priču.", "Tvoja vladajuća planeta ide od zajednice ka karijeri. Preradi cilj pre nego što ga predstaviš.", "Radne obaveze ustupaju mesto većim pitanjima. Pitaj šta te ovaj posao uči.", "Uverenje se testira stvarnim ulogom. Proveri činjenice gde su u igri novac ili poverenje.", "Zajedničke finansije prelaze u razgovor sa partnerom. Izgovori brojku naglas.", "Tema veze pada u tvoj kalendar. Popravi malu dnevnu naviku iza trenja.", "Radni ritam popušta. Pregledaj koliko posla imaš, pa ostavi vreme za nešto zabavno.", "Kreativan rad sreće kućni život. Raščisti ćošak u kom stari projekat može ponovo da živi."],
      },
      "2027:scorpio>libra": {
        paras: ["Ozbiljan početak i diplomatski završetak. U Škorpiji Merkur kopa za onim što je ispod površine. Kad se vrati u Vagu, pitanje se pomera sa onoga što je istina na ono što je pošteno, a dogovori sa partnerima ili kolegama dolaze na proveru.", "To je koristan redosled. Prvo budeš iskren prema sebi, a zatim smisliš kako da to kažeš da druga strana može da čuje. Odložen razgovor koji se desi u pravom trenutku retko je uzaludan."],
        bySign: ["Pitanja poverenja izlaze na otvoreno. Razgovaraj sa partnerom umesto da nagađaš.", "Napet razgovor može da se slegne u bolje dnevne dogovore. Zapiši ko je na šta pristao.", "Merkur vodi tvoj znak. Sredi sisteme na poslu, pa se vrati onome što voliš da praviš.", "Želja sreće dom. Porazgovaraj o tome šta želiš od porodičnog vremena ove jeseni.", "Privatna porodična stvar traži jednostavne reči. Izaberi jednu osobu kojoj ćeš prvo reći.", "Tvoja vladajuća planeta prolazi kroz razgovor i novac. Potvrdi iznose napismeno, dvaput.", "Prvo dolazi budžet, a zatim imidž. Odluči po čemu želiš da te znaju.", "Reflektor namerno bledi. Preispitaj kako se predstavljaš, pa uzmi jednu tihu nedelju.", "Privatne sumnje nalaze mesto među prijateljima. Traži jedno iskreno mišljenje.", "Poznanici pomažu oko pitanja karijere. Potraži bivšeg kolegu pre nego što odlučiš.", "Pitanje karijere postaje filozofsko. Pogledaj dugi rok pre nego što promeniš pravac.", "Velika ideja traži pažljiv pogled na troškove i obaveze. Pitaj koga se još tiče."],
      },
    },
  },
};
