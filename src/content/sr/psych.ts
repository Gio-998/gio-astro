import type { Trait, Temperament } from "@/engine/bigfive";
import type { AttachStyle, Care, Dosha, Constitution, Stance } from "@/engine/quizzes";
import type { Axis } from "@/engine/shadow";
import type { ArchetypeAnimal } from "@/engine/profile";

export const traits: Record<Trait, { name: string; plain: string; low: string; mid: string; high: string; inLove: string }> = {
  O: { name: "Otvorenost", plain: "radoznalost i mašta", low: "Voliš ono što je provereno i praktično, i to te drži na zemlji.", mid: "Nove ideje držiš u ravnoteži sa onim što već funkcioniše.", high: "Voliš ideje, umetnost i nova iskustva; rutina ti brzo dosadi.", inLove: "donosi novinu i dubinu razgovora" },
  C: { name: "Savesnost", plain: "pouzdanost i red", low: "Živiš spontano i fleksibilno; planovi su ti samo predlozi.", mid: "Organizuješ se kad je bitno, a opuštaš se kad nije.", high: "Na tebe može da se računa: planiraš i završavaš ono što započneš.", inLove: "donosi pouzdanost, jednu od osobina povezanih sa srećnijim vezama" },
  E: { name: "Ekstraverzija", plain: "društvena energija", low: "Puniš se u samoći i više voliš dubok razgovor u četiri oka.", mid: "Uživaš u ljudima, a treba ti i tvoj mir.", high: "Puniš se među ljudima, lako pričaš i unosiš energiju u prostoriju.", inLove: "donosi toplinu, zabavu i zajedničke aktivnosti" },
  A: { name: "Prijatnost", plain: "toplina i saradnja", low: "Otvoreno kažeš šta misliš, voliš nadmetanje i teško te je pogurati.", mid: "Umeš da budeš blag, a umeš i da se izboriš za sebe.", high: "Imaš toplinu, veruješ ljudima i brzo pomažeš ili oprostiš.", inLove: "donosi dobrotu, koja je snažno povezana sa zadovoljstvom u vezi" },
  N: { name: "Emocionalna osetljivost", plain: "koliko te snažno pogađaju stres i briga", low: "Pod pritiskom čuvaš mir i brzo se vraćaš u formu.", mid: "Stres osećaš kao većina ljudi i obično se dobro oporaviš.", high: "Brigu i povredu osećaš jako; takođe dobro primećuješ emocije.", inLove: "visoka osetljivost traži umirivanje i rituale koji smiruju: to je osobina o kojoj je najvažnije da brinete zajedno" },
};

export const letters: Record<string, string> = {
  E: "Ka ljudima: energija dolazi od društva", I: "Ka sebi: energija dolazi od tišine",
  N: "Mašta: vuku te ideje i obrasci", S: "Praktičnost: vuku te činjenice i ono što je tu i sada",
  F: "Srce: odlučuješ misleći na ljude", T: "Glava: odlučuješ po logici",
  J: "Plan: voliš zaključene stvari i strukturu", P: "Fleksibilnost: voliš opcije i puštaš da stvari teku",
};

export const fourLetterStyles: Record<string, { name: string; text: string }> = {
  INTJ: { name: "Noćni planer", text: "Nezavisan, strateški nastrojen i tiho odlučan; vidi dugu partiju." },
  INTP: { name: "Tihi rešavač zagonetki", text: "Radoznao i analitičan; voli da razume kako se sve uklapa." },
  ENTJ: { name: "Smeli organizator", text: "Odlučan i pun volje; vizije pretvara u planove, a planove u rezultate." },
  ENTP: { name: "Pokretač ideja", text: "Brz, inventivan i razigran; voli debatu i nove mogućnosti." },
  INFJ: { name: "Dubinski slušalac", text: "Pronicljiv i brižan; oseća šta ljudima treba i zašto." },
  INFP: { name: "Unutrašnji pesnik", text: "Idealista blage naravi; vode ga vrednosti i mašta." },
  ENFJ: { name: "Topli okupljač", text: "Ohrabruje druge i usmeren je na ljude; okuplja ih oko zajedničkog cilja." },
  ENFP: { name: "Vedri istraživač", text: "Oduševljen i maštovit; u svakome vidi mogućnosti." },
  ISTJ: { name: "Postojani čuvar", text: "Pouzdan i temeljan; drži obećanja i pazi da sve radi kako treba." },
  ISFJ: { name: "Nežni negovatelj", text: "Ljubazan, odan i pažljiv; pamti šta je ljudima važno." },
  ESTJ: { name: "Jasni direktor", text: "Praktičan i organizovan; pazi da se stvari urade kako valja." },
  ESFJ: { name: "Društveni lepak", text: "Topao i druželjubiv; drži ljude povezanim i zbrinutim." },
  ISTP: { name: "Smireni majstor", text: "Radi rukama i hladne je glave; probleme rešava u trenutku." },
  ISFP: { name: "Tihi umetnik", text: "Nežan i čulan; izražava se kroz lepotu i delovanje." },
  ESTP: { name: "Brzi izvršilac", text: "Pun energije i smeo; uči tako što uskoči." },
  ESFP: { name: "Donosilac radosti", text: "Spontan i zabavan; svaki trenutak čini življim." },
};

export const temperaments: Record<Temperament, { name: string; text: string; tip: string }> = {
  sanguine: { name: "Sangvinik (vazduh)", text: "Društven, optimističan i živahan. Podižeš raspoloženje i živiš u trenutku.", tip: "Svakog dana ispuni jedno obećanje." },
  choleric: { name: "Kolerik (vatra)", text: "Pun volje, intenzivan i odlučan. Guraš stvari napred i snažno osećaš.", tip: "Pre reakcije napravi tri udaha." },
  phlegmatic: { name: "Flegmatik (voda)", text: "Smiren, postojan i lak za saradnju. Donosiš mir i strpljenje.", tip: "Izgovori šta više voliš, čak i kad bi mogao da se povedeš za drugima." },
  melancholic: { name: "Melanholik (zemlja)", text: "Promišljen, dubok i pažljiv. Primećuješ detalje i stvari osećaš do kraja.", tip: "Pre spavanja imenuj jednu stvar koja je dobro prošla." },
};

export const attachment: Record<AttachStyle, { name: string; text: string; need: string; tip: string }> = {
  secure: { name: "Siguran", text: "Uglavnom ti prijaju i bliskost i nezavisnost. Umeš da tražiš ono što ti treba i veruješ da će drugi biti tu.", need: "iskrenost i uzajamno poštovanje", tip: "Tvoj mir je dar: ponudi ga, ali ne nosi sav posao oko popravke na svojim leđima." },
  anxious: { name: "Anksiozan", text: "Voliš duboko i stalno motriš na znake udaljavanja. Kad neko utihne, briga ume da navali.", need: "uveravanje, doslednost i jasni signali", tip: "Pre nego što reaguješ, imenuj strah: „Osećam nesigurnost, možeš li da me umiriš?“" },
  avoidant: { name: "Izbegavajući", text: "Ceniš samostalnost i umeš da se osetiš pritešnjeno kad neko želi mnogo bliskosti.", need: "prostor bez griže savesti i bliskost tvojim tempom", tip: "Reci „treba mi malo vremena, vraćam se u 8“ umesto da nestaneš." },
  fearful: { name: "Privuci-odgurni", text: "Čezneš za bliskošću i istovremeno je se plašiš, pa možda prilaziš ljudima, a onda se udaljavaš.", need: "strpljenje, sigurnost i veoma dosledna dobrota", tip: "Primeti trenutak povlačenja i podeli ga: „Deo mene sada želi da pobegne.“" },
};
export const pursueWithdraw: string = "Kad pod stresom jedna osoba traži bliskost, a druga prostor, može da nastane krug: što jedno više juri, drugo se više povlači. To je obrazac koji parovi najčešće prijavljuju, a i onaj koji se najlakše popravlja. Dogovorite pauzu sa obećanim vremenom povratka.";

export const nineStyles: Record<number, { name: string; core: string; gift: string; growth: string }> = {
  1: { name: "Usavršivač", core: "želi da bude dobar i da radi stvari kako treba", gift: "integritet i visoki standardi", growth: "Napravi mesta za „dovoljno dobro“ i za radost." },
  2: { name: "Pomagač", core: "želi da bude voljen i potreban", gift: "velikodušnost i toplina", growth: "Traži pomoć jednako slobodno kao što je daješ." },
  3: { name: "Ostvarivač", core: "želi da vredi i da uspe", gift: "pokretačka snaga i prilagodljivost", growth: "Dozvoli ljudima da te vide i kad ne nastupaš." },
  4: { name: "Individualista", core: "želi da bude autentičan i shvaćen", gift: "dubina, kreativnost i emotivna iskrenost", growth: "Primeti šta je već lepo u običnim danima." },
  5: { name: "Posmatrač", core: "želi da razume i da bude sposoban", gift: "uvid i mirna objektivnost", growth: "Podeli svoj unutrašnji svet pre nego što osetiš da je sve spremno." },
  6: { name: "Lojalista", core: "želi sigurnost i poverenje", gift: "odanost, pripremljenost i hrabrost kad zagusti", growth: "Svake nedelje malo više veruj svom unutrašnjem glasu." },
  7: { name: "Entuzijasta", core: "želi slobodu i lepa iskustva", gift: "radost, optimizam i ideje", growth: "Ostani uz teško osećanje pet minuta pre nego što kreneš dalje." },
  8: { name: "Zaštitnik", core: "želi snagu i kontrolu nad sopstvenim životom", gift: "hrabrost, direktnost i zaštitnički nagon", growth: "Pokaži mekotu. To je snaga, a ne slabost." },
  9: { name: "Mirotvorac", core: "želi unutrašnji i spoljašnji mir", gift: "prihvatanje i sposobnost da ujedini ljude", growth: "Tvoje mišljenje je važno: ponekad ga reci prvi." },
};
export const nineNote: string = "Stilovi devet motivacija inspirisani su široko korišćenim modelom ličnosti sa devet tipova. Ovo je naš kratak test, a ne zvanični.";

export const care: Record<Care, { name: string; text: string; tip: string }> = {
  words: { name: "Lepe reči", text: "Uvažavanje, ohrabrenje i „ponosim se tobom“ te pune.", tip: "Danas uputi jedan konkretan kompliment." },
  time: { name: "Zajedničko vreme", text: "Puna pažnja (telefoni sklonjeni, pogled gore) znači najviše.", tip: "Isplaniraj 20 minuta bez ometanja." },
  gifts: { name: "Promišljeni pokloni", text: "Sitnica koja kaže „setih se tebe“ deluje kao ljubav koja se vidi.", tip: "Donesi neku malu stvar iz svog dana." },
  help: { name: "Korisna dela", text: "Pomoć oko obaveze, rešen problem ili čaj skuvan bez pitanja deluju kao briga.", tip: "Skini jednu obavezu sa nečijeg spiska." },
  touch: { name: "Fizička nežnost", text: "Zagrljaji, ruka na ramenu, sedenje blizu: dodir to najbolje kaže (uvek uz pristanak).", tip: "Dug zagrljaj: bar 20 sekundi." },
};
export const careNote: string = "Istraživanja ukazuju na to da većina ljudi ceni svih pet načina brige i da „poklapanje“ znači manje od toga da naučite šta ono drugo najviše voli. Koristi ovo kao vodič za prevođenje.";

export const shadowAxes: Record<Axis, { classical: string; virtue: string; shadow: string; gift: string; practice: string }> = {
  pride: { classical: "Gordost", virtue: "Poniznost", shadow: "Teško priznaješ greške; treba ti da budeš u pravu.", gift: "Samopoštovanje i hrabrost da stojiš uspravno.", practice: "Ove nedelje jednom reci „tu imaš pravo“." },
  greed: { classical: "Pohlepa", virtue: "Velikodušnost", shadow: "Osećaš da nikad nije dovoljno i čvrsto držiš ono što imaš.", gift: "Ambicija i sposobnost da obezbediš.", practice: "Pokloni nešto a da nikome ne kažeš." },
  desire: { classical: "Požuda", virtue: "Samokontrola", shadow: "Snažno želiš i deluješ po impulsu.", gift: "Strast, životna snaga i znanje šta želiš.", practice: "Kad naiđe snažan nagon, sačekaj deset minuta, pa onda odluči." },
  envy: { classical: "Zavist", virtue: "Divljenje", shadow: "Tuđi uspeh te peče.", gift: "Signal koji pokazuje šta stvarno želiš za sebe.", practice: "Pretvori jednu zavist u cilj: „koji korak mogu da napravim ka tome?“" },
  excess: { classical: "Proždrljivost", virtue: "Umerenost", shadow: "Preteruješ sa prijatnim stvarima: hranom, ekranima, kupovinom.", gift: "Veliki kapacitet za uživanje.", practice: "Vežbaj „dosta je“: jednom dnevno stani kad se zasitiš." },
  anger: { classical: "Gnev", virtue: "Strpljenje", shadow: "Bes se diže brzo i snažno.", gift: "Strast za pravdom i zaštitom onoga što je važno.", practice: "Imenuj povredu ispod besa pre nego što progovoriš." },
  inertia: { classical: "Lenjost", virtue: "Marljivost", shadow: "Odlažeš ono što je važno.", gift: "Sposobnost da se odmoriš i ne izgoriš.", practice: "Radi najvažniji zadatak samo 10 minuta." },
};
export const shadowDances: Record<string, string> = {
  "power-struggle": "Dva ponosna srca: oboje volite da budete u pravu. Smenjujte se u tome ko prvi omekša.",
  "chase-stonewall": "Kad se jedno zagreje, a drugo zatvori, oboje se osećate nesaslušano. Dogovorite hlađenje i vreme povratka.",
  competition: "Poređenje može da se prikrade. Glasno slavite pobede jedno drugog.",
  "double-fire": "Dve brze naravi prave varnice. Koristite ugovorenu reč da pauzirate svađu.",
  scarcity: "Oboje možete da skliznete u razmišljanje „nije dovoljno“. Napravite zajednički ritual davanja.",
  "double-indulgence": "Jedno drugom podgrevate slabosti. Smislite zabavu koja se ne svodi na trošenje.",
  "stuck-together": "Udobnost može da pređe u plutanje. Izaberite jedan zajednički cilj po sezoni.",
  "comparison-loop": "Pazite na poređenje sa drugima. Spiskovi zahvalnosti pomažu.",
  "no-backing-down": "Bes sreće gordost: niko ne trepće. Rano vežbajte „rečenicu za pomirenje“.",
  "high-heat": "Dve snažne želje. Mnogo strasti, zato neka dogovori budu jasni i blagi.",
};

export const doshas: Record<Dosha, { name: string; element: string; text: string; balance: string }> = {
  vata: { name: "Vata", element: "vazduh i prostor", text: "Brza, kreativna i lagana priroda. Cvetaš uz inspiraciju, ali van ravnoteže umeš da se rasplineš ili da brineš.", balance: "toplina, rutina, hrana koja prizemljuje i dovoljno sna" },
  pitta: { name: "Pitta", element: "vatra i voda", text: "Usredsređena, oštra i odlučna priroda. Dobro vodiš, ali umeš da se pregreješ do razdražljivosti.", balance: "hrana koja hladi, igra bez nadmetanja, vreme u prirodi" },
  kapha: { name: "Kapha", element: "zemlja i voda", text: "Postojana, mirna i puna ljubavi priroda. Izdržavaš i negujš druge, ali umeš da se zaglaviš ili usporiš.", balance: "kretanje, raznovrsnost, lakši obroci i nova iskustva" },
};
export const constitutions: Record<Constitution, string> = {
  vata: "Pretežno Vata: vazdušna i kreativna.", pitta: "Pretežno Pitta: vatrena i usredsređena.", kapha: "Pretežno Kapha: zemljana i postojana.",
  "vata-pitta": "Vata-Pitta: brza i odlučna.", "pitta-kapha": "Pitta-Kapha: snažna i postojana.", "vata-kapha": "Vata-Kapha: blaga i kreativna.",
  tridoshic: "Uravnotežena (tridoša): pomalo od svega.",
};
export const doshaNote: string = "Inspirisano tradicionalnim ajurvedskim idejama, samo za razmišljanje o sebi i za svakodnevne navike. Nije medicinski savet.";

export const explorer = {
  name: "Um autopilota ili istraživača",
  text: "Inspirisano neurokognitivnim pristupom dr Žaka Fradena (Jacques Fradin): svi se prebacujemo između režima „autopilot“ (rutina, sigurnost, ono što je ranije uspevalo) i režima „istraživač“ (radoznalost, nijanse, prilagođavanje). Stres često znači da autopilot pokušava da reši nešto za šta je potreban istraživač.",
  low: "Oslanjaš se na autopilot: efikasno, dosledno, pouzdano. Pod stresom se zapitaj „šta je ovde jedna stvar koju još ne znam?“",
  mid: "Prebacuješ se između oba režima. Primeti koji se javlja pod stresom.",
  high: "Naginješ istraživaču: radoznalost, fleksibilnost, snalaženje u sivim zonama. Ne zaboravi da i rutine mogu da oslobode um.",
  dims: { routine: "Rutina ↔ Radoznalost", persistence: "Upornost ↔ Fleksibilnost", simplify: "Jednostavnost ↔ Nijanse", certainty: "Sigurnost ↔ Otvorenost", evidence: "Iskustvo ↔ Novo promišljanje", image: "Tuđe mišljenje ↔ Svoj stav" } as Record<string, string>,
  note: "Naš kratak upitnik inspirisan objavljenim idejama; nije zvanična procena.",
};
export const stances: Record<Stance, { name: string; text: string }> = {
  "steady-leader": { name: "Postojani vođa", text: "Samopouzdanje i osećaj da si kod kuće u grupi. Preuzimaš vođstvo i povedeš ljude sa sobom. Pazi da i tiši glasovi dobiju prostor." },
  "lone-pathfinder": { name: "Usamljeni pionir", text: "Samopouzdanje i nezavisnost. Više veruješ svom putu nego gomili. Saveznici umnožavaju tvoju snagu." },
  "warm-supporter": { name: "Topli oslonac", text: "Lako se uklapaš i velikodušno podržavaš druge. Tvoje mišljenje zaslužuje isti prostor koji daješ svima ostalima." },
  "quiet-observer": { name: "Tihi posmatrač", text: "Posmatraš sa ivice i vidiš ono što drugi propuste. Mali, sigurni koraci u izražavanju sebe izgradiće samopouzdanje." },
};

export const archetypeAnimals: Record<ArchetypeAnimal, { name: string; text: string }> = {
  lion: { name: "Lav", text: "Blistava hrabrost. Štitiš i vodiš velikim srcem." },
  hawk: { name: "Jastreb", text: "Jasan pogled i brzo delovanje. Vidiš metu i kreneš." },
  "horse-wild": { name: "Divlji konj", text: "Slobodan duh sa velikom izdržljivošću. Trčiš ka onome što voliš." },
  fox: { name: "Lisica", text: "Tiha vatra i pametna toplina. Graciozno prolaziš kroz svaku situaciju." },
  stag: { name: "Jelen", text: "Ponosna, postojana snaga. Dostojanstveno stojiš na svome." },
  bear: { name: "Medved", text: "Zaštitnički, topao i moćan: sigurno mesto kome drugi trče." },
  elephant: { name: "Slon", text: "Pamćenje, odanost i blaga moć. Nikad ne zaboravljaš dobrotu." },
  tortoise: { name: "Kornjača", text: "Strpljiva mudrost: sporo, postojano i uvek stigneš." },
  eagle: { name: "Orao", text: "Velika slika. Dižeš se iznad svega da vidiš kuda sve vodi." },
  hummingbird: { name: "Kolibri", text: "Vedra radost i brz um. Slast nalaziš svuda." },
  raven: { name: "Gavran", text: "Pametan i tajanstven. Razumeš više nego što pokazuješ." },
  dolphin: { name: "Delfin", text: "Razigrana inteligencija i sklad. Bez napora povezuješ ljude." },
  otter: { name: "Vidra", text: "Radost i ljubav. Igraš se, brineš i držiš se za ruke dok plutaš." },
  wolf: { name: "Vuk", text: "Odan instinkt: posvećen svom čoporu i svom putu." },
  whale: { name: "Kit", text: "Duboko osećanje i drevni mir. Tvoja pesma putuje daleko." },
  owl: { name: "Sova", text: "Noćna mudrost. Vidiš u mraku i progovoriš kad je važno." },
};
export const archetypeNote: string = "Tvoja životinja arhetipa je simbol izveden iz tvog najjačeg elementa i ravnoteže jina i janga: poetsko ogledalo, a ne duhovno prisvajanje bilo koje tradicije.";
