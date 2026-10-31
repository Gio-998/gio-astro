import type { SnippetSet } from "./types";

/**
 * Serbian search snippets, one line per page. Keys and limits are explained in ./types.ts.
 * Angel numbers and mirror hours live in ./sr-numbers.ts. Birthday days, number pairs and 2027 years live in their own files.
 */
export const snippetsSr: SnippetSet = {
  // Hubs
  "hub": { title: "Numerologija: značenje brojeva i besplatni kalkulatori", description: "Anđeoski brojevi, ogledalni sati, životni put i lična godina, objašnjeni prostim rečima. Uz to besplatni kalkulatori koji ništa ne čuvaju." },
  "angel-numbers": { title: "Anđeoski brojevi značenje: 111, 222, 1111 i ostali", description: "Od 111 preko 1212 do 4444: šta svaki anđeoski broj znači u ljubavi i na poslu, zašto ti se javlja baš sada i šta možeš da probaš kad ga vidiš." },
  "mirror-hours": { title: "Ogledalni sati značenje: 11:11, 12:12 i ostali", description: "Zašto stalno vidiš 11:11 ili 22:22 i na šta svaki ogledalni sat može da ukaže u ljubavi, na poslu i u svakodnevici. Izaberi svoje vreme na satu." },
  "life-path": { title: "Životni put 1 do 9, 11, 22 i 33: značenje brojeva", description: "Životni put se računa iz punog datuma rođenja i opisuje tvoj osnovni pravac. Ovde su jake strane, ljubav, posao i senka svakog broja, od jedinice do 33." },
  "personal-year": { title: "Lična godina 1 do 9: izračunaj svoju i vidi šta nosi", description: "Tvoja godina u ciklusu od devet: saberi mesec i dan rođenja sa tekućom godinom, svedi zbir i pročitaj šta ti lična godina obično donosi." },
  "personal-year-2027": { title: "Lična godina 2027: izračunaj broj i pročitaj značenje", description: "Svedi mesec i dan rođenja, dodaj 2 i svedi još jednom: to je tvoja lična godina za 2027. Uz kalkulator i vodič za ljubav, posao, novac i energiju." },
  "master-numbers": { title: "Master brojevi značenje: 11, 22 i 33", description: "Zašto se 11, 22 i 33 ne svode na jednu cifru: veći darovi, teži zahtevi. Šta intuitivac, master graditelj i master učitelj traže od ljudi koji ih nose." },
  "karmic-debt": { title: "Karmički dug 13, 14, 16 i 19: značenje brojeva", description: "Brojevi 13, 14, 16 i 19 zovu se karmički dug, ali nisu kazna nego teme za rast. Kako da nađeš svoj broj i jedna vežba za početak." },
  "compatibility": { title: "Slaganje životnih puteva: svih 78 parova brojeva", description: "Koliko se slažu vaši životni putevi: svih 78 parova objašnjeno za ljubav, prijateljstvo i posao, uz kalkulator koji oba broja nalazi iz datuma rođenja." },
  "personal-day": { title: "Lični dan u numerologiji: nađi temu današnjeg dana", description: "Datum rođenja i današnji datum daju broj od 1 do 9. On danu daje malu temu: podsticaj da počneš, sačekaš, stvaraš ili nešto privedeš kraju." },
  "expression-number": { title: "Broj izraza: talenti skriveni u tvom imenu", description: "Broj izraza, poznat i kao broj sudbine, računa se iz svih slova punog imena. Pokazuje kakav alat nosiš sa sobom na životnom putu i kako završavaš stvari." },
  "soul-urge-number": { title: "Broj duše u numerologiji: šta te pokreće iznutra", description: "Broj duše, ili želja srca, dolazi iz samoglasnika u tvom imenu i pokazuje za čim čezneš kad nikome ništa ne dokazuješ. Uz kalkulator za ime i prezime." },
  "personality-number": { title: "Broj ličnosti: kako te drugi vide na prvi pogled", description: "Broj ličnosti dolazi iz suglasnika u imenu i pokazuje utisak koji ostavljaš pre nego što te ljudi upoznaju. Zamisli ga kao ulazna vrata tvoje kuće." },
  "birthday-number": { title: "Broj rođendana: značenje svakog dana od 1 do 31", description: "Dan tvog rođenja u numerologiji se čita kao jedan poseban dar. Nađi svoj dan od 1 do 31 i vidi koji talenat dodaje. Računanje nije potrebno." },
  "maturity-number": { title: "Broj zrelosti: ko postaješ s godinama", description: "Životni put plus broj izraza daju broj zrelosti, za koji se kaže da jača negde od četrdesetih. Može da objasni kasnu promenu pravca ili poziva." },

  // Calculators
  "calculator": { title: "Numerološki kalkulator: životni put, ime, lična godina", description: "Izračunaj životni put, brojeve imena, ličnu godinu i slaganje brojeva za par sekundi. Besplatno, a sve što uneseš ostaje na tvom uređaju." },
  "calculator/life-path": { title: "Kalkulator životnog puta: izračunaj broj besplatno", description: "Unesi datum rođenja i za par sekundi dobij broj životnog puta, računajući i master brojeve 11, 22 i 33. Besplatno, bez čuvanja podataka, uz rešen primer." },
  "calculator/name": { title: "Kalkulator imena: numerologija imena i prezimena", description: "Ime i prezime daju tri broja: izraza, duše i ličnosti. Upiši ih, slova č, ć, š, ž i đ se preračunaju sama, pa pročitaj šta svaki broj govori o tebi." },
  "calculator/personal-year": { title: "Kalkulator lične godine: nađi svoj broj besplatno", description: "Unesi datum rođenja i vidi u kojoj si godini devetogodišnjeg ciklusa, od svežeg početka do zatvaranja. Bez čuvanja podataka, uz značenje tvoje godine." },
  "calculator/compatibility": { title: "Kalkulator kompatibilnosti brojeva za dve osobe", description: "Uporedi dva datuma rođenja i vidi kako se slažu vaši životni putevi: isti broj, prijateljski par ili suprotnost. Osnovni rezultat je besplatan." },

  // Life path numbers
  "life-path/1": { title: "Životni put 1 značenje: neko mora da krene prvi", description: "Životni put 1, Pionir: krećeš bez cele mape, a drugi idu za tobom. Senka je odbijanje pomoći. U ljubavi najviše naučiš kad pustiš drugog da vodi." },
  "life-path/2": { title: "Životni put 2 značenje: tihi mirotvorac", description: "Životni put 2, Mirotvorac: čitaš ljude i pored tebe se osećaju bezbedno. U ljubavi živiš od sitnih znakova pažnje. Tvoj rast je da kažeš šta ti treba." },
  "life-path/3": { title: "Životni put 3 značenje: reči, boje i smeh", description: "Životni put 3, Pripovedač: osećanja pretvaraš u reči i smeh. U ljubavi ti treba igra. Senka je deset sjajnih početaka i malo stvari dovedenih do kraja." },
  "life-path/4": { title: "Životni put 4 značenje: snovi sa temeljima", description: "Životni put 4, Graditelj: kad drugi paniče, ti napraviš spisak. U ljubavi brigu pokazuješ delima i treba ti neko ko u tome vidi romantiku." },
  "life-path/5": { title: "Životni put 5 značenje: život u svim ukusima", description: "Životni put 5, Slobodni duh: učiš radeći i ostaješ tamo gde te niko ne drži u kavezu. Koji poslovi ti odgovaraju i zašto i dubina može da bude avantura." },
  "life-path/6": { title: "Životni put 6 značenje: ljubav koja se vidi u delima", description: "Životni put 6, Negovatelj: primetiš šta treba pre nego što iko zamoli. Tvoj rast u ljubavi je da više ne moraš da je zaslužuješ tolikim davanjem." },
  "life-path/7": { title: "Životni put 7 značenje: pitanje ispod pitanja", description: "Životni put 7, Tragalac: ispod buke nalaziš obrazac. Ljubavi trebaju poverenje, prostor i lako ćutanje. Senka ti je izolacija koju zoveš nezavisnošću." },
  "life-path/8": { title: "Životni put 8 značenje: moć otvorene ruke", description: "Životni put 8, Snaga: nosiš ono što bi druge slomilo. Zašto merenje svoje vrednosti rezultatima ne vodi nikud dobro, ni na poslu ni u ljubavi." },
  "life-path/9": { title: "Životni put 9 značenje: daj i pusti", description: "Životni put 9, Humanista: vidiš čoveka iza ponašanja. Tvoj rast u ljubavi je da voliš stvarnu, nesavršenu osobu pred sobom, a ne ideju o njoj." },
  "life-path/11": { title: "Životni put 11 značenje: prizemlji inspiraciju", description: "Životni put 11, master broj intuicije: daješ ljudima reči za ono što osećaju. Senka je nervno preopterećenje, a ovde piše kako da nađeš čvrsto tlo." },
  "life-path/22": { title: "Životni put 22 značenje: san nacrtan u razmeri", description: "Životni put 22, Master graditelj: velika vizija plus disciplina. Senka je osećaj da je sve manje od ogromnog neuspeh. Šta te drži stabilnim pod tim pritiskom." },
  "life-path/33": { title: "Životni put 33 značenje: ljubav koja uči druge", description: "Životni put 33, Master učitelj: vodiš primerom, a ne pravilima. Senka je samožrtvovanje, pa je važno da biraš ljude koji ti uzvraćaju brigu." },

  // Personal years
  "personal-year/1": { title: "Lična godina 1 značenje: godina novih početaka", description: "Lična godina 1 liči na peron sa novom kartom u ruci: lako i pomalo nervozno. Prvi meseci nagrađuju jasne odluke, a do decembra imaš šta da pokažeš." },
  "personal-year/2": { title: "Lična godina 2 značenje: strpljenje i partnerstvo", description: "U ličnoj godini 2 čekaš da testo naraste: toplota i vreme rade ostalo. Dobra godina za obavezu, mirenje i slušanje, a loša za žurbu." },
  "personal-year/3": { title: "Lična godina 3 značenje: izražavanje i radost", description: "U ličnoj godini 3 prozori su otvoreni: društvo, stvaranje, vidljivost. Kako da je iskoristiš i zašto jesen traži izbor koje projekte završiti." },
  "personal-year/4": { title: "Lična godina 4 značenje: postavljanje temelja", description: "U ličnoj godini 4 deluje da se ništa ne dešava, a zidovi rastu cigla po cigla. Šta je sada važno za novac, zdravlje i dom, i zašto se doslednost isplati." },
  "personal-year/5": { title: "Lična godina 5 značenje: promena i sloboda", description: "U ličnoj godini 5 kofer se pakuje na brzinu: planovi se menjaju, a s njima i ti. Kretanje obično kreće s proleća, a jesen pomaže da izabereš šta ostaje." },
  "personal-year/6": { title: "Lična godina 6 značenje: ljubav i odgovornost", description: "U ličnoj godini 6 ljubav je u središtu: veridbe, selidbe, razgovori do kasno. Podeli teret s drugima i zakaži odmor kao termin kod lekara." },
  "personal-year/7": { title: "Lična godina 7 značenje: tišina i rad na sebi", description: "Lična godina 7 liči na brvnaru na Tari punu knjiga. Buka opada, a odmor postaje koristan rad. Zašto sada ne vredi terati rezultate na silu." },
  "personal-year/8": { title: "Lična godina 8 značenje: moć i žetva", description: "Lična godina 8 je vreme žetve: stiže trud iz prošlih sezona, a s njim i pitanje šta s tim dalje. Kako da tražiš koliko vrediš i ne sagoriš usput." },
  "personal-year/9": { title: "Lična godina 9 značenje: završavanje i puštanje", description: "Lična godina 9 liči na kraj letovanja: raščisti, oprosti, napravi mesto i ne kreći u velike početke. Posle nje stiže nova lična godina 1." },

  // Karmic debt
  "karmic-debt/13": { title: "Karmički dug 13: rad koji oslobađa", description: "Broj 13 se svodi na 4 i nosi staru lekciju o trudu: ništa ne ide lako, ali ono što gradiš polako ostaje čvrsto. Uz vežbu od trideset dana." },
  "karmic-debt/14": { title: "Karmički dug 14: sloboda sa središtem", description: "Broj 14 se svodi na 5 i nosi lekciju o preterivanju i samokontroli: uživaj u slobodi a da se u njoj ne izgubiš. Uz jedan dnevni ritual koji se ne menja." },
  "karmic-debt/16": { title: "Karmički dug 16: kula i ponovna gradnja", description: "Broj 16 se svodi na 7 i nosi staru sliku kule koju je pogodio grom: ego pada da bi se sagradilo nešto istinitije. Uz vežbu koju radiš jednom nedeljno." },
  "karmic-debt/19": { title: "Karmički dug 19: snaga koja uključuje druge", description: "Broj 19 se svodi na 1 i pita kako da stojiš na svojim nogama a da druge ne isključiš. Vežba: zatraži pomoć za jednu stvar i primi je do kraja." },
};
