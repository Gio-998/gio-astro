import type { Element } from "@/engine/zodiac";
import type { AttachStyle, Dosha } from "@/engine/quizzes";
import type { Temperament } from "@/engine/bigfive";

type E4 = Record<Element, string>;

/** Element Sunca × element Meseca: kako tvoje jezgro i tvoje emotivno ja razgovaraju. */
export const sunMoon: Record<Element, E4> = {
  fire: {
    fire: "Tvoje suštinsko ja i tvoje emotivno ja gore istim plamenom. Ono što želiš i ono što osećaš retko su u sukobu. Znaš svoje srce i postupaš po njemu. Dar je ogromna životna snaga i iskrenost, a rizik je što u tebi nema vode da te rashladi, pa odmor i razmišljanje moraš da biraš namerno.",
    earth: "Tvoje vatreno jezgro želi avanturu i akciju, a zemljano srce sigurnost, udobnost i stvari koje traju. Možda te povuče smela ideja, a onda ti treba vreme da se uveriš da je čvrsta. Zajedno od tebe prave redak tip: nadahnutog graditelja koji stvarno može da dovede san do kraja.",
    air: "Vatra i vazduh hrane jedno drugo: volju ti raspiruju ideje i razgovor, a osećanja ti brzo prolaze kroz reči. Živahnost, ubedljivost i optimizam su ti prirodni. Rast ti je u tome da dovoljno usporiš da osetiš ono što misliš, a ne samo da misliš ono što osećaš.",
    water: "Tvoje vatreno jezgro je smelo i okrenuto ka spolja, ali srce ti je duboko, osetljivo more. Sa strane se možda vidi samo samopouzdanje; oni bliski znaju koliko osećaš. Para je ono što nastane kad vatra naiđe na vodu. U stanju si da doživiš silovitu strast, a i da te sve preplavi. Poštuj oboje: akcija za vatru, tišina za vodu.",
  },
  earth: {
    fire: "Jezgro ti je postojano i praktično, ali emotivni život ima iskru vatre. Osećaš smelo i reaguješ brzo, pa ponekad iznenadiš one koji su mislili da si samo miran svet. Zemlja daje tvojoj vatri ognjište, a vatra tvojoj zemlji toplinu i motivaciju.",
    earth: "I jezgro i srce su ti od zemlje: prizemljena, odana, praktična i strpljiva. Znaš šta ceniš i postojano gradiš ka tome. Pored tebe se ljudi smire, kao kad se kasno vraćaju kući i vide upaljeno svetlo na terasi. Rizik ti je da se zaglaviš: uzimaj novine u malim dozama da tlo ostane plodno.",
    air: "Tvoje praktično jezgro sreće srce koje sve obrađuje kroz ideje i razgovor. Možda analiziraš svoja osećanja, a onda oko njih praviš razumne planove. Spajaš zdrav razum i radoznalost, što je odlična kombinacija za rešavanje stvarnih problema, sve dok osećanjima dopuštaš da se osete, a ne samo da se razvrstaju.",
    water: "Zemlja i voda prave baštu. Jezgro ti je praktično i postojano, a srce duboko, brižno i intuitivno. Prirodno neguješ ljude i stvari, a najsigurnije se osećaš uz odane ljude i pravi dom. Čuvaj se brige i preterane brižnosti: ti si tlo, a ne cela šuma.",
  },
  air: {
    fire: "Vatreno srce pali tvoje misaono jezgro. Strastveno doživljavaš ideje, ljude i ciljeve i brzo izgovaraš ono što osećaš. Nadahnjuješ ljude, unosiš toplinu i pomalo žuriš. Pusti neka osećanja da se malo krčkaju pre nego što postanu objave.",
    earth: "Tvoje vazdušno jezgro voli ideje, a srce želi čvrsto tlo. Možda sanjaš velike stvari, a sigurno se osećaš tek kad je plan praktičan. To ti daje neobičan dar: ideje pretvaraš u stvarnost. Ne zaboravi da srcu dopustiš da uživa i u jednostavnim udobnostima, a ne samo u planovima.",
    air: "I jezgro i srce žive ti u vazduhu: osećanja razumeš tako što o njima misliš i pričaš, a bliskost ti dolazi tek kroz povezanost umova. Otvorenost, druželjubivost i pravičnost su ti prirodne. Rizik je život u glavi. I tvoje telo i dublja osećanja zaslužuju reč.",
    water: "Tvoje misaono jezgro sreće duboko, emotivno srce. Ljude umeš da razumeš glavom i da ih osetiš intuicijom: moćna mešavina za pisanje, savetovanje ili umetnost. Ponekad um pokuša da objašnjenjima skloni ono što srce zna; pusti ih da razgovaraju.",
  },
  water: {
    fire: "Jezgro ti je duboko i osećajno, ali srce reaguje vatrom: brzo, strastveno, ponekad žestoko. Možda sve osećaš tiho, a onda odjednom kreneš smelo. Strast ti štiti mekoću, a mekoća daje strasti smisao.",
    earth: "Tvoje vodeno jezgro je intuitivno i osećajno, a srce traži čvrsto tlo. Duboko osećaš, a onda se smiruješ rutinom, udobnošću i praktičnom brigom. Brineš o ljudima i ostaješ na nogama, pa te drugi vide kao svoje sigurno mesto.",
    air: "Jezgro ti je duboko i emotivno, ali srce obrađuje stvari sa male distance, kroz razumevanje i razgovor. Možda nešto snažno osetiš, a onda napraviš korak unazad da to analiziraš. To ti daje i empatiju i perspektivu.",
    water: "I jezgro i srce su ti okeani. Osećaš sve, naslućuješ neizgovoreno i voliš celim bićem. Vodi te intuicija. Izazov su granice: da znaš koja su osećanja tvoja. I vodi je potrebna obala da bi snažno tekla.",
  },
};

/** Stil vezivanja × element Venere: kako obrazac vezivanja boji tvoj način voljenja. */
export const attachVenus: Record<AttachStyle, E4> = {
  secure: {
    fire: "Tvoja sigurna osnova daje vatrenoj Veneri nešto dragoceno: strast bez panike. Možeš da juriš, flertuješ i obožavaš a da ti ne treba stalan dokaz zauzvrat.",
    earth: "Sigurnost i zemljana Venera daju ti jednu od najpouzdanijih ljubavi u zodijaku: odanu, čulnu i mirnu. Ne zaboravi da dodaš i poneko iznenađenje.",
    air: "Uz sigurno srce i vazdušnu Veneru ljubav liči na veliko prijateljstvo: iskrena, laka i ravnopravna.",
    water: "Sigurna osnova pušta tvoju vodenu Veneru da voli celim srcem a da se u tome ne udavi. Nežnost te ne rastače: zadržavaš svoj oblik.",
  },
  anxious: {
    fire: "Vatrena Venera voli smelo, a anksiozno vezivanje tu smelost ume da pretvori u jurnjavu. Kad se osećaš nesigurno, zastani pre nego što potrčiš: strast bolje prolazi kad nije prerušeni strah.",
    earth: "Zemljana Venera želi postojanu odanost, a anksiozno vezivanje primećuje svaki njen trzaj. Najviše te umiruju konkretni, dosledni partneri; reci im da je za tebe predvidljivost romantika.",
    air: "Vazdušna Venera voli kroz reči, a zbog anksioznosti možda iznova čitaš svaku Viber poruku. Traži razgovor koji ti treba umesto da dešifruješ onaj koji je stigao.",
    water: "Vodena Venera voli sa potpunom predanošću, a anksioznost ume da probudi strah od oseke. Oslonac u prijateljstvima i rutinama čuva te da ljubav ne postane ceo tvoj okean.",
  },
  avoidant: {
    fire: "Sa vatrenom Venerom snažno osećaš privlačnost, a izbegavajući obrazac ume naglo da je ohladi kad stvari postanu ozbiljne. Primeti trenutak kad želiš da pobegneš. Često dolazi tik pre prave bliskosti.",
    earth: "Zemljana Venera je odana, a izbegavajući obrazac ljubav pokazuje delima, ne osećanjima. Partnerima možda trebaju i reči; i nekoliko njih mnogo znači.",
    air: "Vazdušna Venera i izbegavajuće vezivanje čine da u ljubavi voliš slobodu i prijateljstvo, a osećanja držiš na nivou misli. Tvoja sledeća avantura je da nekome pokažeš mekšu stranu.",
    water: "Vodena Venera mnogo oseća, ali izbegavajući obrazac ume to da sakrije. Možda nekoga snažno voliš sa oprezne udaljenosti. Pusti jednu osobu unutra, polako.",
  },
  fearful: {
    fire: "Vatrena Venera juri ka ljubavi, a strah te vuče nazad: privuci-odgurni koji može da deluje dramatično. Spori, postojani partneri daju tvojoj vatri sigurno ognjište.",
    earth: "Zemljana Venera čezne za stabilnošću, a strah otežava da joj poveruješ. Gradi poverenje kroz mala ispunjena obećanja i pusti vreme da tiho uradi svoje.",
    air: "Vazdušna Venera želi povezanost kroz razgovor, a strah te možda tera da testiraš ili da se povučeš. Često je most upravo to da naglas imenuješ pomešana osećanja.",
    water: "Vodena Venera voli jako i brine jako. Blagi, dosledni ljudi i prijateljstva koja te drže pomažu srcu da nauči da ljubav može da bude sigurna.",
  },
};

/** Emocionalna osetljivost iz Big Five (N) × element Meseca. */
export const sensitivityMoon: Record<"low" | "mid" | "high", E4> = {
  low: { fire: "Vatreni Mesec i miran nervni sistem čine da brzo osetiš i brzo se oporaviš: otporan duh.", earth: "Zemljani Mesec i mirni živci daju ti neobičnu postojanost; u krizama se ljudi oslanjaju na tebe.", air: "Vazdušni Mesec i stabilni živci omogućavaju ti da o osećanjima pričaš jasno i mirno.", water: "Vodeni Mesec oseća sve, a nervni sistem ti ostaje stabilan: dubina bez davljenja." },
  mid: { fire: "Vatreni Mesec plane i smiri se; umerena osetljivost znači da stres osećaš, ali se vraćaš u formu.", earth: "Zemljani Mesec i uravnotežena osetljivost daju ti mir ispod kog ima pravog osećanja.", air: "Vazdušni Mesec ti pomaže da stres razrešiš kroz razgovor, i obično nađeš ravnotežu.", water: "Vodeni Mesec mnogo oseća, a oporavak ti obično donesu vreme i briga." },
  high: { fire: "Vatreni Mesec i visoka osetljivost mogu da učine da emocije deluju kao požar. Najviše ti pomažu fizičko pražnjenje i pauze za hlađenje.", earth: "Zemljani Mesec želi mir, a tvoj osetljivi nervni sistem brine kad ne može da ga nađe. Rutine i priroda te naročito smiruju.", air: "Vazdušni Mesec i visoka osetljivost mogu da pretvore osećanja u misli koje jure. Pisanje i razgovor sa jednom mirnom osobom pomažu da se nebo razbistri.", water: "Vodeni Mesec i visoka osetljivost čine od tebe emotivni okean. Trebaju ti redovna samoća, blagi ljudi i jasne granice, a tvoja empatija je pravi dar." },
};

/** Savesnost × modalitet Sunca: kako radiš. */
export const workStyle: Record<"low" | "mid" | "high", Record<"cardinal" | "fixed" | "mutable", string>> = {
  low: { cardinal: "Tvoje je da pokreneš stvari, i to u slobodnom stilu: sjajno započinješ, a održavanje ti manje prija. Udruži se sa onima koji završavaju.", fixed: "Cilj držiš čvrsto, a metod labavo: pravac je stalan, put se improvizuje.", mutable: "Prilagodljivost ti je u krvi: sjajno ti ide u haosu, a rutina ti je izazov. Spoljašnji rokovi su ti prijatelji." },
  mid: { cardinal: "Započinješ stvari, a kad je važno, umeš da organizuješ i nastavak.", fixed: "Ideš napred uz uravnoteženu disciplinu: upornost bez krutosti.", mutable: "Lako se prilagođavaš, a po potrebi ipak umeš da se organizuješ." },
  high: { cardinal: "Započinješ i završavaš: prirodno vođstvo koje pravi planove i sprovodi ih.", fixed: "Pouzdanost ti je neumorna: kad se obavežeš, ideš do samog kraja.", mutable: "Spajaš fleksibilnost i disciplinu: umeš da menjaš planove a da kvalitet ne pati." },
};

/** Doša × temperament: tvoj obrazac tela i uma. */
export const doshaTemperament: Record<Dosha, Record<Temperament, string>> = {
  vata: { sanguine: "Vazdušno telo, vazdušan um: lakoća, brzina i druželjubivost. Rutine koje prizemljuju čuvaju tvoj sjaj da ne pređe u rasuti umor.", choleric: "Brzo, vazdušno telo sa vatrenim pogonom: u naletima daješ sve od sebe. Pazi na rezerve energije.", melancholic: "Lako telo sa dubokim, promišljenim umom: kreativnost, ali i sklonost brizi. Prijaju ti toplina i rutina.", phlegmatic: "Lako, promenljivo telo sa mirnim temperamentom: neobična ravnoteža. Drži postojan ritam." },
  pitta: { sanguine: "Toplo, snažno telo i druželjubiv um: harizma i energija.", choleric: "Vatra na vatru: oštrina, volja i strast. Vežbe hlađenja i igra čuvaju te od izgaranja.", melancholic: "Toplo, intenzivno telo sa dubokim umom: usredsređenost i perfekcionizam. Ophodi se blago prema sebi.", phlegmatic: "Toplo telo sa mirnim umom: usredsređenost, a ipak postojanost." },
  kapha: { sanguine: "Postojano telo sa druželjubivim umom: toplina, pouzdanost i zabava.", choleric: "Snažno, izdržljivo telo sa umom punim volje: moć i upornost.", melancholic: "Postojano telo sa dubokim umom: odanost i promišljenost. Kretanje i novine ti čuvaju lakoću.", phlegmatic: "Zemlja i voda skroz naskroz: mir, odanost, strpljenje. Podsticaji i kretanje čuvaju ti živost." },
};

/** Kad više sočiva pokazuje na isti element. */
export const elementVoice: E4 = {
  fire: "akcija, hrabrost, oduševljenje i potreba da te vide i da se krećeš",
  earth: "postojanost, odanost, praktičnost i potreba za sigurnošću i stvarnim rezultatima",
  air: "ideje, povezivanje, radoznalost i potreba za slobodom i razgovorom",
  water: "osećanje, intuicija, dubina i potreba za bliskošću i smislom",
};
export const elementMissing: E4 = {
  fire: "Kad je vatre malo, motivaciju i samopotvrđivanje možda treba negovati. Toplinu donose sunce, kretanje, muzika i mala smela dela.",
  earth: "Kad je zemlje malo, pažnju možda traže praktične rutine i telo. Prizemljuju redovni obroci, priroda i jednostavni planovi.",
  air: "Kad je vazduha malo, pažnju možda traže perspektiva i komunikacija. Lakoću donose čitanje, razgovor i svež vazduh.",
  water: "Kad je vode malo, pažnju možda traže osećanja i odmor. Tok donose voda, muzika, umetnost i nežno provedeno vreme.",
};
export const elementBoost: E4 = {
  fire: "Vazdušni i vatreni ljudi te obično podižu: vazduh raspiruje tvoj plamen idejama i slobodom, a vatra prati tvoj tempo. Zemlja i voda te smiruju i produbljuju: manje je lako, ali često donosi više rasta.",
  earth: "Vodeni i zemljani ljudi te obično podižu: voda hrani tvoje tlo, a zemlja deli tvoj ritam. Vatra i vazduh donose kretanje i nadahnuće koji bi ti inače promakli.",
  air: "Vatreni i vazdušni ljudi te obično podižu: vatra daje tvojim idejama žar, a vazduh deli tvoju ljubav prema razgovoru. Zemlja i voda te prizemljuju i produbljuju.",
  water: "Zemljani i vodeni ljudi te obično podižu: zemlja daje tvojoj vodi obalu, a voda razume bez reči. Vatra i vazduh donose energiju i perspektivu.",
};
export const elementRitual: E4 = {
  fire: "Ritual vatre: zapali sveću pri izlasku ili zalasku sunca, imenuj jedan hrabar čin za taj dan i pokreći telo dok ti ne postane toplo.",
  earth: "Ritual zemlje: hodaj bosih nogu, neguj biljku ili polako kuvaj, a pritom imenuj tri stvari na kojima zahvaljuješ svom telu.",
  air: "Ritual vazduha: otvori prozor, napravi deset sporih udaha i pet minuta piši slobodno, bez zaustavljanja.",
  water: "Ritual vode: okupaj se ili se polako istuširaj, zamisli kako dan otpada sa tebe i poslušaj jedno muzičko delo zatvorenih očiju.",
};

export const attachBoost: Record<AttachStyle, string> = {
  secure: "Podižu te ljudi koji su takođe sigurni, a anksioznim ili izbegavajućim prijateljima možeš da budeš prisustvo koje leči, dok god je trud zajednički.",
  anxious: "Najviše te podižu sigurni, dosledni ljudi koji odgovaraju na poruke, drže obećanja i kažu šta osećaju. Uzbudljivi, ali nepredvidivi ljudi pre hrane anksioznost nego što je leče.",
  avoidant: "Najviše te podižu sigurni ljudi koji ti daju prostor a da te za to ne kažnjavaju i koji te nežno pozivaju bliže.",
  fearful: "Najviše te podižu mirni, strpljivi, dosledni ljudi, kao i prijateljstva koja te drže i koja umeju da leče koliko i romansa.",
};
export const attachHeal: Record<AttachStyle, string> = {
  secure: "Lečiš se kroz iskren razgovor i pouzdanu povezanost i tako što svoje potrebe ne guraš pod tepih.",
  anxious: "Lečiš se gradeći unutrašnju sigurnost: samoumirivanje, prijateljstva koja te drže i odnosi u kojima se dela poklapaju sa rečima.",
  avoidant: "Lečiš se tako što puštaš male količine brige unutra i otkrivaš da nečija potreba za tobom ne mora da znači zamku.",
  fearful: "Lečiš se sporo i sigurno, uz dosledne, pouzdane ljude, vežbe prizemljenja i, ako je stari bol težak, dobrog terapeuta.",
};
export const doshaBoost: Record<Dosha, string> = {
  vata: "Prizemljeni, topli, postojani ljudi (često tip Kapha) pomažu ti da se slegneš; drugi vazdušni tipovi pale ideje, ali vas oboje mogu da ostave rasute.",
  pitta: "Mirni, rashlađujući, opušteni ljudi pomažu ti da omekšaš; drugi vatreni tipovi te nadahnjuju, ali umeju da se takmiče.",
  kapha: "Živahni, energični ljudi (tipovi Vata ili Pitta) pokreću te; drugi postojani tipovi prijaju kao topla soba, ali vas oboje mogu da zadrže u mestu.",
};

/** Jupiter (rast) i Saturn (lekcije) po solarnoj kući, računato od tvog sunčevog znaka. */
export const jupiterHouse: string[] = [
  "Jupiter prolazi kroz tvoj sopstveni znak: godina ličnog rasta, samopouzdanja i novih početaka. Kad naiđe prilika da rasteš, reci „da“.",
  "Jupiter prolazi kroz tvoju kuću resursa: prilike da rastu prihodi, veštine i osećaj sopstvene vrednosti. Ulaži u ono što ceniš.",
  "Jupiter prolazi kroz tvoju kuću komunikacije: učenje, pisanje, kratka putovanja i dobri razgovori otvaraju vrata.",
  "Jupiter prolazi kroz tvoju kuću doma: dobro vreme za porodicu, novi dom ili pomirenje sa svojim korenima.",
  "Jupiter prolazi kroz tvoju kuću radosti: romansa, kreativnost, igra i deca donose blagoslov. Zabavljaj se više.",
  "Jupiter prolazi kroz tvoju kuću rada i zdravlja: prostor za bolje rutine, zdravije navike i svakodnevni posao koji više ispunjava.",
  "Jupiter prolazi kroz tvoju kuću partnerstva: odnosi rastu, a važni ljudi mogu da uđu u tvoj život.",
  "Jupiter prolazi kroz tvoju kuću dubine: šire se bliskost, zajednički resursi i unutrašnji preobražaj.",
  "Jupiter prolazi kroz tvoju kuću horizonata: zovu te putovanja, učenje i velike ideje.",
  "Jupiter prolazi kroz tvoju kuću karijere: moguća su priznanja i profesionalni rast. Nišani više.",
  "Jupiter prolazi kroz tvoju kuću prijateljstva: cvetaju zajednica, mreže kontakata i nade za budućnost.",
  "Jupiter prolazi kroz tvoju kuću unutrašnjeg sveta: tiša godina duhovnog rasta, odmora i pripreme za novi ciklus.",
];
export const saturnHouse: string[] = [
  "Saturn prolazi kroz tvoj sopstveni znak: ozbiljno vreme sazrevanja. Preuzmi odgovornost za to ko postaješ.",
  "Saturn testira tvoje finansije i osećaj vrednosti: napravi budžet, razvijaj veštine, ceni sebe realno.",
  "Saturn traži disciplinu u učenju i komunikaciji: uči, piši, govori ono što misliš.",
  "Saturn radi na tvojim temeljima: dom, porodične obaveze i unutrašnja sigurnost traže strukturu.",
  "Saturn traži posvećenost u ljubavi i kreativnosti: ozbiljni projekti, ozbiljna srca.",
  "Saturn sređuje tvoj rad i zdravlje: postojane rutine sada se isplaćuju godinama.",
  "Saturn testira partnerstva: obaveze se produbljuju ili završavaju. Jasnoća u odnosima.",
  "Saturn prolazi kroz tvoju kuću dubine: zajednički novac, bliskost i stari strahovi traže pošten rad.",
  "Saturn daje strukturu tvojim uverenjima i učenju: dugi kursevi, ozbiljna putovanja, zrela filozofija.",
  "Saturn prolazi kroz sektor tvoje karijere: težak rad, odgovornost i stvarni autoritet.",
  "Saturn testira prijateljstva i ciljeve: manje prijatelja, ali pravih; realne dugoročne nade.",
  "Saturn prolazi kroz tvoj unutrašnji svet: odmor, zatvaranje i tiha priprema. Pusti ono što je gotovo.",
];
