import type { Nakshatra } from "@/engine/vedic";

export const nakshatras: Record<Nakshatra, { name: string; symbol: string; text: string }> = {
  ashwini: { name: "Ašvini", symbol: "konjska glava", text: "brzi iscelitelj, spreman da započne i pomogne" },
  bharani: { name: "Bharani", symbol: "materica", text: "nosilac života, intenzivan i odgovoran" },
  krittika: { name: "Kritika", symbol: "sečivo / plamen", text: "oštra, pročišćava, iskrena do reza" },
  rohini: { name: "Rohini", symbol: "kočija", text: "plodna, šarmantna, voli lepotu i udobnost" },
  mrigashira: { name: "Mrigašira", symbol: "glava jelena", text: "traga, blaga, radoznala" },
  ardra: { name: "Ardra", symbol: "suza", text: "olujna obnova, dubina kroz teškoće" },
  punarvasu: { name: "Punarvasu", symbol: "tobolac sa strelama", text: "povratak svetla, optimizam, dom" },
  pushya: { name: "Pušja", symbol: "kravlje vime", text: "hrani, štiti, posvećena" },
  ashlesha: { name: "Ašleša", symbol: "sklupčana zmija", text: "pronicljiva, hipnotična, štiti ono što voli" },
  magha: { name: "Maga", symbol: "presto", text: "kraljevska, poštuje pretke i tradiciju" },
  "purva-phalguni": { name: "Purva Falguni", symbol: "prednje noge kreveta", text: "zadovoljstvo, odmor, kreativnost i romansa" },
  "uttara-phalguni": { name: "Utara Falguni", symbol: "zadnje noge kreveta", text: "odano partnerstvo i velikodušna podrška" },
  hasta: { name: "Hasta", symbol: "šaka", text: "vešta, spretnih ruku, duhovita" },
  chitra: { name: "Čitra", symbol: "blistavi dragulj", text: "umetnička, sjajna, gradi lepe stvari" },
  swati: { name: "Svati", symbol: "mladi izdanak na vetru", text: "nezavisna, fleksibilna, diplomatična" },
  vishakha: { name: "Višaka", symbol: "slavoluk", text: "odlučna, usmerena na cilj, strastvena" },
  anuradha: { name: "Anuradha", symbol: "lotos", text: "odano prijateljstvo, cveta na teškim mestima" },
  jyeshtha: { name: "Džješta", symbol: "minđuša / suncobran", text: "zaštitnički starešina, odgovorna, ponosna" },
  mula: { name: "Mula", symbol: "vezano korenje", text: "ide do korena, tragač za istinom" },
  "purva-ashadha": { name: "Purva Ašada", symbol: "lepeza", text: "nepobedivo oduševljenje, ubedljiva" },
  "uttara-ashadha": { name: "Utara Ašada", symbol: "slonova kljova", text: "trajna pobeda, načelna" },
  shravana: { name: "Šravana", symbol: "uvo", text: "sluša i uči, povezuje ljude" },
  dhanishta: { name: "Daništa", symbol: "bubanj", text: "ritmična, muzikalna, velikodušna" },
  shatabhisha: { name: "Šatabiša", symbol: "prazan krug", text: "isceliteljka, nezavisna, tajanstvena" },
  "purva-bhadrapada": { name: "Purva Badrapada", symbol: "prednji deo pogrebnog odra", text: "intenzivan idealista, snaga promene" },
  "uttara-bhadrapada": { name: "Utara Badrapada", symbol: "zadnji deo pogrebnog odra", text: "duboki mir, mudrost, samokontrola" },
  revati: { name: "Revati", symbol: "riba / bubanj", text: "blagi vodič, saosećajna, srećan put" },
};

export const kootas: Record<string, { name: string; plain: string }> = {
  varna: { name: "Varna", plain: "slaganje duhovnog temperamenta i ega" },
  vashya: { name: "Vašja", plain: "prirodna privlačnost i uticaj" },
  tara: { name: "Tara", plain: "sreća rodne zvezde i zajedničko blagostanje" },
  yoni: { name: "Joni", plain: "instinktivna i fizička bliskost" },
  maitri: { name: "Graha Maitri", plain: "prijateljstvo vladara Mesečevih znakova: mentalna talasna dužina" },
  gana: { name: "Gana", plain: "priroda: blaga, ljudska ili žestoka" },
  bhakoot: { name: "Bakut", plain: "emotivni i porodični sklad iz razmaka Mesečevih znakova" },
  nadi: { name: "Nadi", plain: "energetska konstitucija: tradicionalno ima najveću težinu" },
};

export const vedicCautions: Record<string, string> = {
  nadi: "Tradicija beleži obrazac „isti Nadi“: simbolično ga čitamo kao dve slične energije kojima trebaju svesna raznovrsnost i briga o zdravlju i odmoru onog drugog.",
  bhakoot: "Tradicija beleži razmak Mesečevih znakova koji traži dodatno strpljenje u porodičnim i novčanim stvarima.",
  manglik: "Tradicija beleži naglašen Mars u samo jednoj karti (Manglik). Čita se kao razlika u intenzitetu: usmerite je u zajedničku fizičku aktivnost i jasne dogovore.",
};
export const vedicCancellations: Record<string, string> = {
  "nadi-different-pada": "Tradicionalno poništavanje: ista rodna zvezda, ali različita četvrtina (pada).",
  "nadi-same-sign": "Tradicionalno poništavanje: isti Mesečev znak uz različite rodne zvezde.",
  "bhakoot-friendly-lords": "Tradicionalno poništavanje: vladari Mesečevih znakova su prijatelji ili isti.",
  "manglik-both": "Tradicionalno poništavanje: obe karte su Manglik, što se po tradiciji uravnotežuje.",
};
export const vedicNote: string = "Vedska (sideralna) astrologija koristi Lahiri zodijak, oko 24° iza zapadnog, pa tvoj vedski Mesečev znak može da bude drugačiji. Guna Milan je tradicionalni sistem od 36 poena; po tradiciji je 18+ prihvatljivo, 25+ dobro, a 32+ odlično. Samo simbolično.";
export const gunaLabel: string = "Guna Milan";
