import type { Animal, WuXing, AnimalRelation, ElementRelation } from "@/engine/chinese";

export const animals: Record<Animal, { name: string; essence: string; gifts: string; edge: string }> = {
  rat: { name: "Pacov", essence: "Bistar, snalažljiv i šarmantan. Prilike uočavaš pre nego što drugi vide vrata.", gifts: "pamet, prilagodljivost, odanost svom krugu", edge: "briga i preterano planiranje" },
  ox: { name: "Bik", essence: "Strpljiv, pouzdan i snažan. Pobeđuješ upornim radom i držiš reč.", gifts: "pouzdanost, izdržljivost, iskrenost", edge: "tvrdoglavost kad je potrebna promena" },
  tiger: { name: "Tigar", essence: "Hrabar, strastven i magnetičan. Štitiš slabije i deluješ po uverenju.", gifts: "hrabrost, harizma, velikodušnost", edge: "impulsivnost i nemir" },
  rabbit: { name: "Zec", essence: "Blag, elegantan i pronicljiv. Stvaraš mir i lepotu gde god se skrasiš.", gifts: "dobrota, takt, dobar ukus", edge: "izbegavanje sukoba koji mora da se desi" },
  dragon: { name: "Zmaj", essence: "Smeo, vizionar i pun životne snage. Sanjaš veliko i inspirišeš druge da te prate.", gifts: "samopouzdanje, energija, vizija", edge: "nestrpljenje i gordost" },
  snake: { name: "Zmija", essence: "Mudar, intuitivan i pribran. Brzo pročitaš prostoriju i krećeš se kroz nju sa tihom gracioznošću.", gifts: "uvid, smirenost, elegancija", edge: "tajnovitost i sumnjičavost" },
  horse: { name: "Konj", essence: "Slobodnog duha, topao i pun energije. Trebaju ti otvoren prostor, kretanje i iskreno društvo.", gifts: "oduševljenje, nezavisnost, vedrina", edge: "nemir i kratko strpljenje" },
  goat: { name: "Koza", essence: "Blag, umetnički nastrojen i dobrog srca. Donosiš mekoću, kreativnost i brigu.", gifts: "saosećanje, kreativnost, sklad", edge: "briga i neodlučnost" },
  monkey: { name: "Majmun", essence: "Pametan, razigran i inventivan. Probleme rešavaš humorom i svežim idejama.", gifts: "domišljatost, duhovitost, radoznalost", edge: "nemir i nestašluk" },
  rooster: { name: "Petao", essence: "Pažljiv posmatrač, vredan i iskren. Ponosiš se time što stvari radiš kako treba.", gifts: "preciznost, hrabrost, otvorenost", edge: "kritičnost i perfekcionizam" },
  dog: { name: "Pas", essence: "Odan, pravedan i zaštitnički nastrojen. Staješ uz svoje ljude i svoja načela.", gifts: "odanost, iskrenost, osećaj za pravdu", edge: "strepnja i pesimizam" },
  pig: { name: "Svinja", essence: "Velikodušan, iskren i voliš zabavu. Uživaš u životu i želiš sve za stolom.", gifts: "toplina, velikodušnost, tolerancija", edge: "naivnost i preterivanje u uživanju" },
};

export const wuxing: Record<WuXing, { name: string; text: string; color: string }> = {
  wood: { name: "Drvo", text: "rast, dobrota i planiranje: energija proleća", color: "zelena" },
  fire: { name: "Vatra", text: "strast, radost i vidljivost: energija leta", color: "crvena" },
  earth: { name: "Zemlja", text: "stabilnost, briga i poverenje: energija poznog leta", color: "žuta" },
  metal: { name: "Metal", text: "jasnoća, struktura i integritet: energija jeseni", color: "bela" },
  water: { name: "Voda", text: "mudrost, dubina i tok: energija zime", color: "crna/plava" },
};

export const animalRelations: Record<AnimalRelation, { name: string; text: string }> = {
  "six-harmony": { name: "Tajni prijatelji (Šest harmonija)", text: "Tradicija ovo naziva jednim od šest skladnih parova: tiho, prirodno savezništvo u kom svako pokriva slepu tačku onog drugog." },
  trine: { name: "Trigon istog tima", text: "Pripadate istoj grupi od tri znaka koja deli vrednosti i ritam: razumevanje dolazi lako." },
  same: { name: "Životinje ogledala", text: "Delite istu životinju, pa se brzo prepoznajete, zajedno sa jakim stranama i tvrdoglavim navikama." },
  neutral: { name: "Otvoreno polje", text: "Tradicija ne daje jak znak ni na jednu stranu. Ovu vezu uglavnom oblikuje ono što gradite." },
  harm: { name: "Osetljiv par", text: "Tradicija ovde ukazuje na sitne nesporazume. Jasne reči i dobrota u malim stvarima prave razliku." },
  clash: { name: "Magnetne suprotnosti", text: "Stojite jedno naspram drugog na zodijačkom krugu. To donosi privlačnost i izazov: jaku iskru i mnogo toga što možete da naučite jedno od drugog." },
};

export const elementRelations: Record<ElementRelation, string> = {
  generating: "Jedan element hrani drugi (kao što drvo hrani vatru): prirodan tok podrške.",
  same: "Delite isti element: razumevanje je lako, a zajedničke navike mogu da se pojačaju.",
  controlling: "Jedan element oblikuje drugi (kao što voda smiruje vatru). To daje strukturu i rast kad se poštuje, a trenje kad se ignoriše.",
};
