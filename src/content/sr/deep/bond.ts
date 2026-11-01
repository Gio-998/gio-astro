/** Srpski tekstovi za Priču o vezi (okvir bondUi je u ../deep.ts). */
import type { PairKey } from "../../en/deep/bond";

/** Nazivi stilova brige stižu malim slovima u nominativu; „daje“ traži akuzativ, a samo se ova dva menjaju. */
const CARE_ACC: Record<string, string> = { "promišljeni pokloni": "promišljene poklone", "fizička nežnost": "fizičku nežnost" };
const careAcc = (s: string) => CARE_ACC[s] ?? s;

export const meetPair: Record<PairKey, string> = {
  "fire-fire": "Dve vatre se prepoznaju odmah. Prvi susreti su često glasni, topli i brzi: šale, planovi, osećaj „pa gde si ti do sada?“ Podstičete hrabrost jedno u drugom. Prva lekcija je da i dvama plamenovima trebaju vazduh i odmor, inače veče izgori jednako brzo kao što je počelo.",
  "earth-fire": "Vatra stiže sa varnicama, a zemlja posmatra i odlučuje. Vatri u početku zemlja možda deluje malo spora, zemlji vatra malo previše, a ipak su oboje potajno impresionirani: vatra postojanošću zemlje, zemlja smelošću vatre. Kad to proradi, vatra donosi ideje, a zemlja ih ostvaruje.",
  "air-fire": "Vazduh i vatra se sreću kao vetar i plamen: odmah je živo. Razgovor juri, ideje se množe, smeh dolazi lako. Vazduh daje vatri perspektivu i reči, a vatra vazduhu toplinu i pravac. Ovo je jedna od prirodno najuzbudljivijih kombinacija, a vaš posao je da sve to ostane na zemlji.",
  "fire-water": "Vatra i voda prave paru. Prvi susret je često silovit: privlačnost, opčinjenost, ponekad zbunjenost. Vatru vuče dubina vode, a vodu toplina i hrabrost vatre. Zajedno možete da se osećate veoma živo i veoma neshvaćeno. Blagost je most.",
  "earth-earth": "Dve zemlje se osećaju sigurno gotovo odmah. Manje je vatrometa, a više poverenja: zajedničke vrednosti, zajednički ritam, osećaj da je ova osoba stvarna. Zajedno gradite brzo i dobro. Prva lekcija vam je da u tlu sačuvate malo novine.",
  "air-earth": "Vazduh stiže sa idejama, a zemlja pita kako bi to radilo. Prvi susreti mogu da liče na zanimljivu debatu. Vazduhu zemlja možda deluje preoprezno, zemlji vazduh previše apstraktno, ali svako popunjava ono što drugom fali: vazduh širi zemlji horizont, a zemlja vazdušnim planovima daje noge.",
  "earth-water": "Zemlja i voda se sreću kao obala i njena reka: prirodno. Udobnost i briga javljaju se rano. Voda se oseća sigurno uz postojanost zemlje, a zemlja omekša uz toplinu vode. Malo koja kombinacija ovoliko neguje oboje.",
  "air-air": "Dva vazduha se sreću u razgovoru i nastavljaju da pričaju. Brzo razumete kako onaj drugi misli, delite ideje, smejete se istim stvarima i dajete jedno drugom slobodu. Prvo pitanje je dubina: ko će dovoljno da uspori da oseti, a ne samo da misli?",
  "air-water": "Vazduh misli, voda oseća. U početku svako sa zanimanjem gleda u svet onog drugog: vazduh u intuiciju vode, voda u jasnoću vazduha. Možete mnogo da naučite jedno od drugog, a možda ćete se osećati i kao da govorite različitim jezicima. Strpljenje od toga pravi lep prevod.",
  "water-water": "Dve vode se osete pre nego što iko progovori. Tu su empatija, intuicija i osećaj da te neko razume bez objašnjavanja. Veza može veoma brzo da postane veoma bliska. Lekcija su granice: da znate čija su čija osećanja.",
};
export const heartPair: Record<PairKey, string> = {
  "fire-fire": "Emotivno oboje brzo reagujete i brzo se oporavljate. Osećanja se izgovaraju direktno, što stvari drži iskrenim, a može da dovede i do naglih plamenova. Voljeno se osećate kroz oduševljenje, pažnju i zajedničku akciju.",
  "earth-fire": "Jedno srce plane, drugo smiruje. Vatra osećanja doživljava brzo i glasno, a zemlja ih obrađuje sporo i praktično. Vatri treba da zemlja uzvrati toplinom, a ne samo mirom; zemlji treba da joj vatra da vremena.",
  "air-fire": "Vaši emotivni stilovi su laki i brzi: osećanja razrešite razgovorom, oraspoložite jedno drugo i idete dalje. Rizik je da preskočite dublja, sporija osećanja kojima treba više od šale.",
  "fire-water": "Osećanja vatre planu i prođu, a osećanja vode teku duboko i traju. Vatra možda ne shvata koliko dugo voda nosi povredu, a voda možda ne shvata da je vatra već oprostila. Mnogo pomaže da osećanja blago imenujete i da se kasnije ponovo javite jedno drugom.",
  "earth-earth": "Emotivni život vam je postojan i odan. Brigu pokazujete prisustvom i praktičnom pomoći, a drame su retke. Rizik je da osećanja nikad i ne izgovorite naglas.",
  "air-earth": "Vazduh osećanja razume tako što o njima priča, a zemlja tako što nešto uradi povodom njih. Vazduhu može da se čini da zemlja ćuti, a zemlji da vazduh previše analizira. I jedno i drugo je briga, samo na različitim dijalektima.",
  "earth-water": "Srca vam se prirodno uklapaju: voda duboko oseća, zemlja postojano drži. Vodi treba da zemlja ponekad pokaže emociju, a ne samo stabilnost; zemlji treba da voda veruje da je i mir ljubav.",
  "air-air": "Osećanja obrađujete kroz razgovor i ideje. Dobro razumete jedno drugo, a mesto za rast vam je da osećanjima dopustite da se osete, a ne samo objasne.",
  "air-water": "Voda prvo oseća pa objašnjava, a vazduh prvo objašnjava pa oseća. Vodi vazduh može da deluje udaljeno, a vazduhu voda preplavljujuće. Prevodite blago: „Hoću da kažem…“, „Osećam…“.",
  "water-water": "Dva duboka srca: snažno osećate raspoloženja jedno drugog i prirodno se tešite. U teškim vremenima možete da potonete zajedno; neko od vas ponekad mora da bude obala.",
};
export const talkPair: Record<PairKey, string> = {
  "fire-fire": "Pričate brzo, oduševljeno upadate jedno drugom u reč i brzo odlučujete. Odlično za planiranje avantura, manje kad oboje morate da budete saslušani u isto vreme. Smenjujte se.",
  "earth-fire": "Vatra priča o mogućnostima, zemlja o praktičnim stvarima. Vatri može da se čini da je neko koči, a zemlji da je neko požuruje. Kad dogovorite „vreme za ideje“ i „vreme za plan“, postajete strašan tim.",
  "air-fire": "Umovi vam zajedno varniče: debate, šale, ideje. Retko će vam biti dosadno. Pazite da veliki razgovori završe odlukom, a ne samo uzbuđenjem.",
  "fire-water": "Vatra govori direktno, a voda čuje ton i ono između redova. Gruba rečenica vatre može da povredi vodu, a vatri mogu da promaknu nagoveštaji vode. Direktnost sa mekoćom je vaš zajednički jezik.",
  "earth-earth": "Govorite jednostavno i mislite ono što kažete. Manje reči, više slaganja. Setite se da pričate i o snovima, a ne samo o organizaciji.",
  "air-earth": "Vazduh baca ideje, zemlja ih procenjuje. Kad to radite dobro, tako nastaju dobre odluke. Kad to radite loše, vazduh se oseća kritikovano, a zemlja nesaslušano. Recite u kom ste režimu.",
  "earth-water": "Zemlja govori činjenicama, voda osećanjima. Razumete se bolje nego što mislite. Pitajte češće „šta ti treba?“ nego „šta je problem?“.",
  "air-air": "Mogli biste da pričate celu noć, i verovatno to i radite. Komunikacija vam je zadovoljstvo. Zamka je da pričate o svemu osim o onoj jednoj neprijatnoj stvari.",
  "air-water": "Vazduh koristi logiku, voda intuiciju. Možete lepo da se dopunjujete ako vazduh sluša osećanje ispod reči, a voda se usudi da stvari kaže jednostavno.",
  "water-water": "Često se razumete bez reči. To je dar, a i zamka, jer pretpostavke zamenjuju pitanja. Svejedno izgovarajte i ono što se podrazumeva.",
};
export const desirePair: Record<PairKey, string> = {
  "fire-fire": "Privlačnost između dve vatre je trenutna i razigrana: izazov, jurnjava i smeh. Održavajte je živom kroz avanture.",
  "earth-fire": "Vatra donosi smelost, zemlja čulnost i strpljenje. Hemija raste polako i može oboje da vas iznenadi.",
  "air-fire": "Želja počinje u glavi: zadirkivanje, flert i zabava. Nastavite da iznenađujete jedno drugo.",
  "fire-water": "Magnetično i silovito: strast vatre sreće dubinu vode. Emotivna sigurnost čini da hemija potraje.",
  "earth-earth": "Spora, čulna, odana privlačnost. Udobnost nije neprijatelj želje, rutina jeste. Planirajte novine.",
  "air-earth": "Vazduh privlači mirno prisustvo zemlje, a zemlju lakoća vazduha. Hemija raste kroz zajednička iskustva.",
  "earth-water": "Nežno i čulno: dodir, bliskost i sigurnost hrane želju. Ovo je hemija koja vas oboje hrani.",
  "air-air": "Privlačnost kroz ideje, humor i slobodu. Flertujte rečima i setite se i tela.",
  "air-water": "Lakoća vazduha intrigira vodu, a dubina vode opčinjava vazduh. Hemiji trebaju i razgovor i nežnost.",
  "water-water": "Duboka, emotivna, gotovo telepatska privlačnost. Intimnost se gradi na osećaju sigurnosti.",
};

export const attachPair: Record<string, { text: string; flag?: string }> = {
  "secure-secure": { text: "Oboje se prilično sigurno osećate i u bliskosti i u prostoru. Sukobi su neprijatni, ali nisu katastrofa; umete da popravite stvari. To je čvrsta osnova za dugoročnu sreću." },
  "anxious-secure": { text: "Postojanost sigurnog partnera vremenom može da umiri strahove anksioznog. Ta kombinacija može da leči kad sigurni nudi uveravanje, a anksiozni uči da mu veruje." },
  "avoidant-secure": { text: "Sigurni partner daje izbegavajućem prostor bez kazne i nežno poziva na bliskost. Vremenom to može da omekša izbegavajući obrazac." },
  "fearful-secure": { text: "Doslednost sigurnog partnera može mnogo da leči onoga sa stilom privuci-odgurni, ako su oboje strpljivi sa tim klatnom." },
  "anxious-anxious": { text: "Oboje žudite za bliskošću i uveravanjem. Razumete strahove jedno drugog i umete da ih probudite. Zajedno vam treba dodatni mir: sporiji odgovori, jasno uveravanje, zajedničko umirivanje.", flag: "Dva anksiozna srca mogu da se zavrte u spiralu. Ako svađa počne sa „nije te briga“, zastanite, dišite i uverite jedno drugo pre nego što nastavite razgovor." },
  "anxious-avoidant": { text: "Ovo je klasičan ples jurenja i povlačenja: što jedno više poseže, drugo se više povlači, a što se drugo više povlači, prvo više poseže. Veoma je čest, a sa njim može dobro da se radi čim ga vidite.", flag: "Pazite na krug jurenja i povlačenja. Anksiozni partner vežba samoumirivanje, izbegavajući vežba da kaže „treba mi sat vremena, pa se vraćam“ i da se stvarno vrati." },
  "anxious-fearful": { text: "Oboje čeznete za bliskošću i brinete zbog nje. Možda bol jedno drugog razumete iznutra. Doslednost i blagost su neophodni." , flag: "Pomešani signali mogu da pojačaju brigu na obe strane. Dogovorite jednostavne, jasne navike javljanja." },
  "avoidant-avoidant": { text: "Oboje cenite nezavisnost i dajete jedno drugom mnogo prostora. Mirno je i bez drame, ali postoji rizik da se udaljite a da to ne primetite.", flag: "Razdaljina može tiho da raste. Planirajte pravu bliskost i pričajte o osećanjima i kad vam se čini da nije potrebno." },
  "avoidant-fearful": { text: "Jedno se štiti distancom, a drugo se ljulja između čežnje i opreznosti. Oboma pomažu strpljenje, jasnoća i mali koraci ka bliskosti." , flag: "Kad se oboje povučete u isto vreme, niko se ne javlja. Unapred odlučite ko šalje prvu poruku posle svađe." },
  "fearful-fearful": { text: "Oboje znate kako je želeti bliskost i plašiti je se. To zajedničko razumevanje može da ide veoma duboko, a traži i mnogo blagosti i, često, podršku spolja.", flag: "Možete jedno drugom da budete okidač. Idite polako i razmislite o podršci terapeuta ili prijatelja od poverenja." },
};

export const lifePathPair: Record<"mirror" | "family" | "friendly" | "contrast", string> = {
  mirror: "Imate isti broj životnog puta. Životne lekcije jedno drugog razumete iznutra, a možda i ponavljate iste slepe tačke.",
  family: "Vaši životni putevi pripadaju istoj porodici brojeva: životni ritam i vrednosti obično vam se prirodno usklade.",
  friendly: "Vaši životni putevi su po tradiciji „prijatelji“: različiti drumovi koji podržavaju jedan drugog.",
  contrast: "Vaši životni putevi su prilično različiti: pokazaćete jedno drugom načine života koje sami ne biste izabrali, i to je uzbudljivo i poučno.",
};
export const chinesePair: Record<string, string> = {
  "six-harmony": "U kineskoj tradiciji vaše životinje čine par „tajnih prijatelja“. To je jedna od veza sa najviše podrške na celom krugu. Obično štitite i dopunjujete jedno drugo.",
  trine: "Vaše životinje pripadaju istoj trojci: prirodni saveznici koji dele stil i tempo.",
  same: "Imate istu životinju: velika bliskost, iste snage i ista tvrdoglava mesta.",
  neutral: "Vaše životinje su po tradiciji neutralne: vezu oblikuje ono što gradite, a ne sudbina.",
  harm: "Tradicija kaže da vaše životinje mogu da se pogrešno razumeju u sitnicama. Jasna komunikacija rešava većinu toga.",
  clash: "Vaše životinje stoje jedna naspram druge na krugu: par „sudara“. To znači magnetizam i trenje: svet vidite sa suprotnih strana i možete najviše da naučite jedno od drugog.",
};
export const traitPair: Record<string, { same: string; diff: string }> = {
  O: { same: "Imate sličan apetit za novinama i idejama, pa planovi i razgovori idu lako.", diff: "Jedno od vas voli novine, drugo bira poznato: jedno donosi avanturu, drugo korene." },
  C: { same: "Imate slične standarde za red i pouzdanost: manje svađa oko kućnih poslova i planova.", diff: "Jedno planira, drugo improvizuje. Dogovorite šta mora da se isplanira, a šta može da ostane labavo." },
  E: { same: "Društvene baterije su vam slične. Slažete se koliko ljudi i koliko tišine vam treba.", diff: "Jedno se puni među ljudima, drugo u samoći. Otvoreno pregovarajte o vremenu za društvo; niko tu nije kriv." },
  A: { same: "Imate sličnu ravnotežu mekoće i direktnosti, pa vam je sukob poznat teren.", diff: "Jedno od vas je blaže, drugo direktnije. Blažem treba istina rečena sa dobrotom; direktnom treba da blaže progovori." },
  N: { same: "Slično reagujete na stres. Razumete brige jedno drugog (ili mir).", diff: "Jedno snažno oseća stres, drugo ostaje mirno. Mirno može da bude sidro; osetljivo može da uči emotivnoj svesnosti." },
};

export const relIntro: Record<string, (a: string, b: string) => string> = {
  romantic: (a, b) => `${a} i ${b} kao par. Ovo je vaša priča: kako se srećete, pričate, želite, svađate i rastete. Svaka veza ima svoju klimu. Evo vaše, pročitane kroz nebo, stare kalendare i vaše sopstvene odgovore.`,
  friend: (a, b) => `${a} i ${b} kao prijatelji. Ovo je vaša priča: kakvo prijateljstvo pravite, kako podržavate jedno drugo i zbog čega ono traje.`,
  family: (a, b) => `${a} i ${b} kao porodica. Ovo je vaša priča: stari obrasci, duboka odanost i načini na koje možete da lečite i podižete jedno drugo.`,
  colleague: (a, b) => `${a} i ${b} kao kolege. Ovo je vaša priča: kako zajedno mislite, odlučujete i gradite i kako da izvučete najviše iz svojih razlika.`,
};
export const archetypeLong: Record<string, string> = {
  harbor: "Dugoročno, vaša veza teži da postane luka: sigurno, mirno mesto na koje se vraćate. To je retko i dragoceno. Rizik svake luke je da brodovi nikad ne isplove: stalno unosite nova iskustva, nove razgovore, nove avanture, da sigurnost nikad ne pređe u mirovanje.",
  wildfire: "Vremenom vaša veza ima sve da postane divlji plamen: laka i naelektrisana u isto vreme. Tečete i varničite. Čuvajte je odmorom, dobrotom i iskrenim razgovorom, jer jake vatre traže negu, a malo je veza ovako živih.",
  forge: "Na dugom putu vaša veza radi kao kovačnica: toplota i pritisak oblikuju oboje. Nije uvek lako, ali retko je dosadno i može oboje da vas učini jačim. Ključ je poštovanje: trenje koje oštri, a ne ranjava.",
  garden: "Godinama gledano, vaša veza je bašta: sporije cveta i postaje dublja sa svakom sezonom negovanja. Vremenom urastate jedno u drugo. Strpljenje, mali rituali i zahvalnost su vam voda i sunčeva svetlost.",
};
export const rituals: Record<string, string[]> = {
  romantic: ["Izlazak jednom nedeljno, a telefoni ostaju u drugoj sobi.", "Svakog nedeljnog popodneva 10 minuta za pitanje „kako smo?“.", "Svakog jutra jedna rečenica zahvalnosti.", "Svakog meseca zajedno novo iskustvo."],
  friend: ["Stalna kafa jednom mesečno, termin koji oboje čuvate.", "Pošaljite jedno drugom na Viber nešto što vas je podsetilo na tu osobu.", "Naglas proslavite male pobede jedno drugog.", "Svake sezone uradite zajedno nešto novo."],
  family: ["Redovan poziv ili ručak u stalno vreme.", "Pri svakoj poseti podelite jednu uspomenu ili porodičnu priču.", "Pitajte o sadašnjosti, a ne samo o prošlosti.", "Zahvalite jedno drugom na nečem konkretnom."],
  colleague: ["Kratak nedeljni sastanak o prioritetima, a ne samo o zadacima.", "Pri podeli posla imenujte snage jedno drugog.", "Unapred odlučite kako se rešavaju neslaganja.", "Zajedno proslavite završene projekte."],
};
export const flags = {
  fireWater: "Vrelina vatre i vode: svađe mogu brzo da provriju. Ohladite se pre nego što ih rešavate.",
  bothLowA: "Oboje ste prilično direktni. Iskrenost je dobra: namerno dodajte toplinu, naročito u sukobu.",
  bothHighN: "Oboje snažno osećate stres. U teškim nedeljama dogovorite se da budete blagi i da se smenjujete u ulozi smirenog.",
  careMismatch: (a: string, b: string, ga: string, gb: string) => `Stilovi brige se mimoilaze: ${a} daje ${careAcc(ga)}, a najviše traži nešto drugo, dok ${b} daje ${careAcc(gb)}. Možda svako od vas voli na način koji ono drugo ne registruje. Recite jedno drugom tačno šta vam prija.`,
  sameShadow: (s: string) => `Delite istu glavnu senku (${s}). Razumećete je jedno kod drugog, a možda ćete je i pojačavati. Imenujte je blago kad se pojavi.`,
  clash: "Kineski par „sudara“: možda ćete na predvidive načine pritiskati jedno drugom dugmad. Zastanite pre reakcije.",
  none: "Nema jakih znakova upozorenja u vašim tumačenjima. Držite se osnova: dobrota, iskrenost i popravka posle sukoba.",
};
