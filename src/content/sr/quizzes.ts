export const scale5 = ["Uopšte se ne slažem", "Ne slažem se", "Neutralno", "Slažem se", "Potpuno se slažem"];
export const scaleTrue = ["Ne liči na mene", "Malo", "Donekle", "Uglavnom", "Baš liči na mene"];

/** Mini-IPIP (public domain, ipip.ori.org). Wording adapted to first person, polarity as in the English items. */
export const bigFive: Record<string, string> = {
  e1: "Ja sam duša društva.", a1: "Saosećam sa tuđim osećanjima.", c1: "Obaveze završavam odmah.", n1: "Imam česte promene raspoloženja.", o1: "Imam živu maštu.",
  e2: "Ne pričam mnogo.", a2: "Ne zanimaju me tuđi problemi.", c2: "Često zaboravim da vratim stvari na njihovo mesto.", n2: "Uglavnom se osećam opušteno.", o2: "Ne zanimaju me apstraktne ideje.",
  e3: "Na žurkama pričam sa mnogo različitih ljudi.", a3: "Osećam tuđe emocije.", c3: "Volim red.", n3: "Lako se uzrujam.", o3: "Teško razumem apstraktne ideje.",
  e4: "Držim se po strani.", a4: "Drugi ljudi me baš i ne zanimaju.", c4: "Pravim nered u stvarima.", n4: "Retko se osećam potišteno.", o4: "Nemam dobru maštu.",
};

export const attachment: Record<string, string> = {
  ax1: "Brine me da bliski ljudi ne mare za mene koliko ja marim za njih.",
  av1: "Radije ne pokazujem drugima kako se osećam duboko u sebi.",
  ax2: "Treba mi mnogo potvrda da značim ljudima koje volim.",
  av2: "Lako mi je da se oslonim na ljude koji su mi bliski.",
  ax3: "Kad bliska osoba utihne, plašim se da je razlog neka moja greška.",
  av3: "Postane mi neprijatno kad neko želi mnogo bliskosti sa mnom.",
  ax4: "Retko brinem da će me neko ostaviti ili zameniti.",
  av4: "Sa bliskim ljudima obično o svemu porazgovaram.",
  ax5: "Ponekad insistiram na bliskosti više nego što druga osoba želi.",
};

export const nine: Record<string, string> = {
  t1: "Prema sebi imam visoke standarde i primećujem šta bi trebalo popraviti.", t1b: "Smeta mi kad se nešto radi površno ili nepravedno.",
  t2: "Najviše se osećam kao ja kad pomažem nekome do koga mi je stalo.", t2b: "Često osetim šta drugima treba pre nego što zatraže.",
  t3: "Vuče me želja za rezultatima i volim priznanje kad nešto uradim dobro.", t3b: "Brzo se prilagodim onome što je u datoj situaciji potrebno za uspeh.",
  t4: "Stvari osećam dublje od većine ljudi oko mene.", t4b: "Autentičnost i posebnost mi mnogo znače.",
  t5: "Treba mi vreme nasamo da sve promislim pre nego što se uključim.", t5b: "Volim da do detalja razumem kako stvari funkcionišu.",
  t6: "Držim do odanosti i volim da znam na koga i na šta mogu da računam.", t6b: "Obično predvidim šta može da pođe po zlu i pripremim se za to.",
  t7: "Obožavam nova iskustva, planove i mogućnosti.", t7b: "Radije gledam ono lepo nego što se zadržavam na onome što boli.",
  t8: "Preuzimam vođstvo i štitim ljude do kojih mi je stalo.", t8b: "Govorim direktno i ne volim da me iko kontroliše.",
  t9: "Najvažniji mi je mir, i u meni i oko mene.", t9b: "Lako razumem svačije gledište i puštam da stvari idu svojim tokom.",
};
export const nineOrder = ["t1", "t5", "t9", "t2", "t6", "t3", "t7", "t4", "t8", "t1b", "t5b", "t9b", "t2b", "t6b", "t3b", "t7b", "t4b", "t8b"];

/** One scene per style pair. Keys are "a-b" in CARE order; [option for a, option for b]. */
export const careScenes: Record<string, { q: string; a: string; b: string }> = {
  "words-time": { q: "Rođendan ti je. Šta ti ostaje u sećanju?", a: "Čestitka u kojoj piše šta sve neko voli kod tebe", b: "Ceo dan zajedno, samo vas dvoje" },
  "words-gifts": { q: "Upravo je prošla teška nedelja. Šta ti najviše prija?", a: "Glasovna poruka: „Ponosim se tobom“", b: "Tvoja omiljena grickalica koja te čeka na stolu" },
  "words-help": { q: "Sutra je ispit ili rok. Šta ti više pomaže?", a: "Poruka: „Možeš ti to, verujem u tebe“", b: "Neko skuva večeru da bi ti mogao da nastaviš da radiš" },
  "words-touch": { q: "Razgovor sa šefom je bio težak. Kad dođeš kući, želiš…", a: "Da čuješ „svaka ti čast na tome“", b: "Dug zagrljaj pre nego što iko išta kaže" },
  "time-gifts": { q: "Lenja nedelja. Šta bi je ulepšalo?", a: "Doručak zajedno, bez žurbe i bez ekrana", b: "Knjiga koju je neko izabrao jer ga je podsetila na tebe" },
  "time-help": { q: "Dan selidbe. Šta ti više liči na ljubav?", a: "Neko ostane dokasno samo da sedi sa tobom među kutijama", b: "Neko dođe sa selotejpom i sklopi krevet" },
  "time-touch": { q: "Veče uz film. Najlepše je…", a: "To što je neko oslobodio celo veče za tebe", b: "To što ste sklupčani zajedno pod jednim ćebetom" },
  "gifts-help": { q: "Bolest te oborila u krevet. Šta ti više znači?", a: "Neko ti donese čaj i mali paket za utehu", b: "Neko izvede psa i opere sudove" },
  "gifts-touch": { q: "Neko ti se vraća sa puta. Koji doček pobeđuje?", a: "Mali suvenir biran samo za tebe", b: "Uletiš mu u zagrljaj na vratima" },
  "help-touch": { q: "Stresno jutro pred posao. Šta ga spasava?", a: "Neko ti ispegla košulju i skuva kafu", b: "Tiha ruka na tvojim leđima dok juriš po stanu" },
};
export const careGive: string = "A kako TI najprirodnije pokazuješ brigu?";

export const shadow: Record<string, string> = {
  "pride-s": "Teško mi je da priznam kad nisam u pravu.", "pride-l": "Uživam da drugima odam priznanje koje zaslužuju.",
  "greed-s": "Često osećam da mi treba još (novca, stvari, statusa) pre nego što mogu da se opustim.", "greed-l": "Volim da delim ono što imam, čak i kad me to nešto košta.",
  "desire-s": "Kad nešto jako želim, teško mi je da sačekam.", "desire-l": "Mogu da osećam snažnu želju a da joj ne dozvolim da upravlja mojim izborima.",
  "envy-s": "Tuđi uspeh ume da me zaboli, čak i kad se radujem zbog te osobe.", "envy-l": "Kad vidim da nekome ide dobro, to me inspiriše da rastem.",
  "excess-s": "Često preterujem sa prijatnim stvarima: hranom, skrolovanjem, kupovinom, pićem.", "excess-l": "Znam kad mi je dosta i tada stanem.",
  "anger-s": "Kad osetim da mi je učinjena nepravda, bes se diže brzo i snažno.", "anger-l": "Mogu da sačuvam mir i da slušam čak i kad me nešto frustrira.",
  "inertia-s": "Ono što je važno odlažem do poslednjeg trenutka.", "inertia-l": "Kad se jednom obavežem na nešto, iznesem to do kraja.",
};

export const dosha: Record<string, { q: string; options: [string, string, string] }> = {
  frame: { q: "Moje telo je po prirodi…", options: ["lagano i vitko", "srednje građe i atletsko", "čvrsto i široko"] },
  skin: { q: "Moja koža je obično…", options: ["suva i hladna", "topla, osetljiva, lako se zacrveni", "glatka, meka, malo masna"] },
  appetite: { q: "Moj apetit je…", options: ["neredovan, zaboravljam da jedem", "jak, gubim živce kad ogladnim", "stalan, lako preskočim obrok"] },
  digestion: { q: "Posle jela se obično osećam…", options: ["različito, ponekad naduto", "brzo dobro, ponekad uz gorušicu", "teško i usporeno posle obilnog obroka"] },
  sleep: { q: "Moj san je…", options: ["lak, lako se prekine", "umeren i čvrst", "dubok i dug, teško se budim"] },
  climate: { q: "Vreme koje najmanje volim je…", options: ["hladno i vetrovito", "vruće i sparno", "vlažno i sivo"] },
  pace: { q: "Obično radim…", options: ["brzo, više stvari odjednom", "usredsređeno i sa ciljem", "sporo, postojano, metodično"] },
  speech: { q: "Moj način govora je…", options: ["brz, skačem s teme na temu", "oštar, precizan, ubedljiv", "miran, spor i topao"] },
  stress: { q: "Pod stresom…", options: ["me hvataju strepnja i briga", "me hvataju nervoza ili bes", "se povlačim ili se ukopam"] },
  memory: { q: "Kad nešto učim…", options: ["brzo naučim i brzo zaboravim", "jasno to zapamtim", "sporo učim, ali nikad ne zaboravim"] },
  energy: { q: "Moja energija je…", options: ["u naletima, pa onda padnem", "jaka i gura me ceo dan", "ravnomerna i izdržljiva, ali se sporo pali"] },
  "weather-mood": { q: "Moje raspoloženje najviše liči na…", options: ["promenljiv vetar", "vedar letnji dan", "mirno jezero"] },
};

export const explorer: Record<string, { q: string; left: string; right: string }> = {
  routine: { q: "Kad se pojavi nešto novo, ja…", left: "ostajem uz ono što znam da funkcioniše", right: "radoznalo probam novi pristup" },
  persistence: { q: "Kad plan ne funkcioniše, ja…", left: "još jače guram isti plan", right: "stanem i promenim pravac" },
  simplify: { q: "Kod složenih problema, ja…", left: "tražim jednostavan odgovor", right: "uživam da istražujem nijanse" },
  certainty: { q: "Moja mišljenja su…", left: "obično čvrsta i jasna", right: "uvek otvorena za druge uglove" },
  evidence: { q: "Odlučujem uglavnom na osnovu…", left: "onoga što je ranije uspevalo", right: "novog promišljanja od početka" },
  image: { q: "Najviše mi je stalo do…", left: "toga šta će drugi misliti", right: "onoga što stvarno mislim, pa makar bilo nepopularno" },
};
export const stance: Record<string, string> = {
  conf1: "U grupi prirodno preuzimam vođstvo.",
  conf2: "Često prećutim svoje mišljenje da ne smetam drugima.",
  trust1: "Osećam da pripadam većini grupa u kojima sam.",
  trust2: "Radije ostajem van grupa i radim svoje.",
};

export const bond: Record<string, string> = {
  appreciation: "Osećam da me {name} ceni.",
  trust: "Verujem da će {name} stati uz mene.",
  commitment: "Osećam da {name} ozbiljno shvata našu vezu.",
  repair: "Kad se ne slažemo, nađemo put nazad jedno do drugog.",
  fun: "Zajedno se smejemo i zabavljamo.",
  understood: "Osećam da me {name} razume.",
  safety: "{name} je neko kome bez straha mogu da kažem šta mi treba.",
  growth: "Pomažemo jedno drugom da rastemo i probamo nove stvari.",
};
export const bondDims: Record<string, { name: string; strength: string; growth: string; practice: string }> = {
  appreciation: { name: "Uvažavanje", strength: "Oboje se osećate cenjeno: to je jedan od snažnih pokazatelja trajne veze.", growth: "Uvažavanje se možda gubi u svakodnevici.", practice: "Svako veče ove nedelje podelite jednu konkretnu stvar koju ste cenili." },
  trust: { name: "Poverenje", strength: "Sigurno vam je da se oslanjate jedno na drugo.", growth: "Poverenju možda treba malo nege.", practice: "Dajte jedno malo obećanje i ispunite ga tako da se vidi." },
  commitment: { name: "Posvećenost", strength: "Oboje osećate da je ono drugo tu ozbiljno.", growth: "Možda neko od vas, ili oboje, ne zna kuda ovo vodi.", practice: "Porazgovarajte o tome kako biste voleli da vaša veza izgleda za godinu dana." },
  repair: { name: "Popravka posle sukoba", strength: "Znate kako da se vratite jedno drugom posle trvenja.", growth: "Svađe možda ostaju da vise bez popravke.", practice: "Dogovorite rečenicu za pomirenje, na primer „možemo li ispočetka?“" },
  fun: { name: "Zabava i igra", strength: "Stvarno uživate jedno u drugom.", growth: "Igra je možda pala na dno spiska.", practice: "U narednih 7 dana uradite zajedno nešto novo i smešno." },
  understood: { name: "Osećaj da te razumeju", strength: "Osećate da vidite jedno drugo.", growth: "Osećaj da te razumeju mogao bi da bude jači.", practice: "U sledećem razgovoru probajte rečenicu „koliko te razumem, ti kažeš da…“" },
  safety: { name: "Sigurnost da progovoriš", strength: "Možete bez straha da izgovorite svoje potrebe.", growth: "Da progovoriš možda ti sada deluje rizično.", practice: "Uvedite nedeljni razgovor od 15 minuta u kom oboje možete sve da kažete, ali blago." },
  growth: { name: "Zajednički rast", strength: "Izvlačite ono najbolje jedno iz drugog.", growth: "Možda želite više zajedničkog rasta.", practice: "Izaberite jednu stvar koju ćete ovog meseca zajedno naučiti ili probati." },
};

export const meta: Record<"big-five" | "attachment" | "nine" | "care" | "shadow" | "dosha" | "explorer", { title: string; tagline: string; intro: string; unlocks: string; note?: string }> = {
  "big-five": { title: "Big Five (Velikih pet)", tagline: "Najbolje proveren test ličnosti", intro: "Oceni koliko svaka tvrdnja odgovara tome kakav si inače sada, a ne tome kakav želiš da budeš.", unlocks: "Big Five · četiri temperamenta · stil od četiri slova · preciziranje jin-janga", note: "Stavke: Mini-IPIP (Donnellan i saradnici, 2006) iz javno dostupne baze International Personality Item Pool (ipip.ori.org)." },
  "attachment": { title: "Stil vezivanja", tagline: "Bliskost i prostor u ljubavi", intro: "Razmišljaj o svojim bliskim odnosima uopšte (partneri, bliski prijatelji ili porodica).", unlocks: "Analiza stila vezivanja · uvid u obrazac jurenja i povlačenja", note: "Naše stavke koje mere dve dobro istražene dimenzije (anksioznost i izbegavanje). Kratko sredstvo za razmišljanje, a ne klinički test." },
  "nine": { title: "Devet motivacija", tagline: "Šta te pokreće u srži", intro: "Koliko svaka tvrdnja liči na tebe?", unlocks: "Stil motivacije · krilo · pravci rasta i stresa" },
  "care": { title: "Stilovi brige", tagline: "Kako daješ i primaš brigu", intro: "Izaberi ono što bi ti više značilo. Nema pogrešnih odgovora.", unlocks: "Stilovi brige · mapa prevoda u kompatibilnosti" },
  "shadow": { title: "Senka i svetlo", tagline: "Tvoje slabe tačke i skriveni darovi", intro: "Odgovaraj iskreno. Ovo je privatno i služi tvom rastu. Svaka senka nosi neki dar.", unlocks: "Profil senke i svetla · ples senki u kompatibilnosti", note: "Naše stavke, inspirisane istraživanjima zavisti, pohlepe, besa i samokontrole. Služe samo za razmišljanje i nikad nisu moralna presuda." },
  "dosha": { title: "Tip tela", tagline: "Ajurveda za tvoju energiju", intro: "Izaberi ono što je za tebe važilo veći deo života. Ovo možeš da preskočiš: nije obavezno.", unlocks: "Tip tela i energije · rituali za ravnotežu" },
  "explorer": { title: "Autopilot ili istraživač", tagline: "Kako radi tvoj um", intro: "Povuci prema strani koja ti je bliža.", unlocks: "Um autopilota ili istraživača · mapa društvenog stava" },
};
