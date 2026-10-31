import type { LensId, Band, Archetype, Theme, RelType, Evidence } from "@/engine/compat";
import { plural } from "../horoscope/sr-cases";

export const lenses: Record<LensId, { name: string; short: string }> = {
  western: { name: "Zapadna astrologija", short: "Kako se vaše planete povezuju" },
  vedic: { name: "Vedsko slaganje", short: "Indijsko poređenje po Mesečevim zvezdama" },
  chinese: { name: "Kineski horoskop", short: "Vaše životinje i elementi" },
  numerology: { name: "Numerologija", short: "Šta kažu vaši brojevi" },
  tarot: { name: "Tarot rođenja", short: "Vaše karte i karta vaše veze" },
  yinyang: { name: "Jin i jang", short: "Kako se vaše energije uravnotežuju" },
  bigfive: { name: "Big Five", short: "Najbolje proveren model ličnosti" },
  attachment: { name: "Vezivanje", short: "Bliskost i prostor zajedno" },
  care: { name: "Stilovi brige", short: "Kako dajete i primate brigu" },
  temperament: { name: "Temperament", short: "Četiri klasična temperamenta" },
  nine: { name: "Devet motivacija", short: "Šta vas pokreće duboko u sebi" },
  fourletter: { name: "Četiri slova", short: "Vaš stil u četiri slova" },
  shadow: { name: "Senka i svetlo", short: "Vaše slabe tačke i vrline" },
  dosha: { name: "Tip tela", short: "Ajurveda za vašu energiju" },
  play: { name: "Ogledalo igre", short: "Kako se zaista igrate zajedno" },
};

export const evidence: Record<Evidence, { label: string; icon: string; text: string }> = {
  research: { label: "Podržano istraživanjima", icon: "🔬", text: "Provereni upitnici i istraživanja" },
  popular: { label: "Popularna psihologija", icon: "🧭", text: "Korisno za razmišljanje, malo dokaza" },
  traditional: { label: "Tradicionalno i simbolično", icon: "✨", text: "Stari sistemi, za inspiraciju" },
};

export const relTypes: Record<RelType, { name: string; them: string }> = {
  romantic: { name: "Romantični partner", them: "partner" },
  friend: { name: "Prijatelj", them: "prijatelj" },
  family: { name: "Porodica", them: "član porodice" },
  colleague: { name: "Kolega", them: "kolega" },
};

export const bands: Record<Band, { name: string; text: string }> = {
  "kindred-flow": { name: "Srodni tok", text: "Retka lakoća kroz mnoga tumačenja. Vaš zadatak: ne uzimajte to zdravo za gotovo. Birajte jedno drugo i dalje." },
  "natural-allies": { name: "Prirodni saveznici", text: "Čvrsta osnova sa jasnim mestima za rast na kojima može da se radi. Olakšavate život jedno drugom." },
  "complementary-path": { name: "Dopunski put", text: "Vaše razlike se dopunjuju. Često ćete videti ono što onom drugom promakne." },
  "catalyst-bond": { name: "Veza katalizator", text: "Veza sa mnogo rasta. Traži svesne veštine, a nagrađuje vas brzim napredovanjem." },
  "deep-teacher": { name: "Veza dubokog učenja", text: "Ovde možete najviše da naučite jedno od drugog. Najvažniji su alati i dobrota, zato počnite od vežbi ispod." },
};

export const archetypes: Record<Archetype, { name: string; icon: string; text: string }> = {
  harbor: { name: "Luka", icon: "⚓", text: "Lako i mirno: sigurno mesto kome se vraćaš. Dodaj malo avanture da ostane živo." },
  wildfire: { name: "Divlji plamen", icon: "🔥", text: "Lako i naelektrisano: prirodan tok uz jaku iskru. Zaštitite to dobrim navikama." },
  forge: { name: "Kovačnica", icon: "⚒️", text: "Izazovno i naelektrisano. Kroz trenje oblikujete jedno drugo u nešto jače." },
  garden: { name: "Bašta", icon: "🌱", text: "Spor početak, a svake godine dublje. Ono što zajedno negujete i dalje cveta." },
};

export const themes: Record<Theme, { name: string; plus: string; minus: string; practices: [string, string] }> = {
  communication: { name: "Komunikacija", plus: "Razumete kako ono drugo misli i priča.", minus: "Mislite i govorite na različitim „jezicima“.", practices: ["Ponovite pre odgovora: „Koliko te razumem, ti kažeš da…“", "Uvedite nedeljni razgovor od 20 minuta sa jednim pravilom: bez popravljanja, samo slušanje."] },
  emotional: { name: "Emotivna dubina", plus: "Osećate osećanja onog drugog i umete da idete u dubinu.", minus: "Osećanja možda obrađujete različitom brzinom.", practices: ["Svaki dan „ruža i trn“: podelite jedan lep i jedan težak trenutak.", "Imenujte osećanja uz spisak reči: precizne reči smiruju nervni sistem."] },
  passion: { name: "Strast i privlačnost", plus: "Među vama postoje prava hemija i energija.", minus: "Želja i nagon možda teku različitim ritmom.", practices: ["Isplanirajte zajedno nešto novo: novina ponovo pali privlačnost.", "Otvoreno pričajte o tome zbog čega se svako od vas oseća željeno."] },
  stability: { name: "Stabilnost", plus: "Zajedno gradite sigurnost i pouzdanost.", minus: "Različite potrebe za strukturom i sigurnošću.", practices: ["Napravite jedan zajednički ritual (nedeljni doručak, petkova šetnja).", "Dajte malo obećanje i ispunite ga: poverenje se gradi malim ulozima."] },
  freedom: { name: "Sloboda i prostor", plus: "Dajete jedno drugom prostora da dišete.", minus: "Različite potrebe za prostorom i zajedništvom.", practices: ["Otvoreno se dogovorite o vremenu za sebe, da se prostor ne bi čitao kao odbijanje.", "Koristite vreme povratka: „Treba mi sat vremena, vraćam se u 8.“"] },
  growth: { name: "Rast i avantura", plus: "Širite svet jedno drugom.", minus: "Jedno možda želi promenu, a drugo odmor.", practices: ["Izaberite jednu stvar koju ćete ovog meseca zajedno učiti ili istraživati.", "Pitajte jedno drugo: „Na koji način mogu da podržim tvoj san?“"] },
  nurturing: { name: "Negovanje", plus: "Prirodno brinete jedno o drugom.", minus: "Vaši načini brige možda ne stižu do cilja, zato ih prevedite.", practices: ["Pitajte: „Šta bi ti ove nedelje dalo osećaj da neko brine o tebi?“", "Uradite jedan čin brige na način onog drugog, a ne svoj."] },
  power: { name: "Moć i vođstvo", plus: "Dobro vodite zajedno i poštujete snagu onog drugog.", minus: "Dve jake volje mogu da se otimaju za volan.", practices: ["Podelite oblasti: ko šta vodi.", "U sitnicama se smenjujte u donošenju odluke."] },
  play: { name: "Igra i radost", plus: "Budite vedru stranu jedno kod drugog.", minus: "Punite se i zabavljate na različite načine.", practices: ["Napravite „spisak zabave“ sa po tri ideje i probajte jednu nedeljno.", "Smejte se namerno: podelite jednu smešnu stvar dnevno."] },
  values: { name: "Zajedničke vrednosti", plus: "Vaše dublje vrednosti pokazuju isti pravac.", minus: "Neki prioriteti se razlikuju. Poštovanje je ono što to čini izvodljivim.", practices: ["Neka svako napiše svoje 3 glavne vrednosti, pa ih blago uporedite.", "Razgovarajte o jednom snu za narednih pet godina."] },
  conflict: { name: "Rešavanje sukoba", plus: "Možete da se ne slažete i da se i dalje osećate sigurno.", minus: "Pod stresom reagujete na različite načine.", practices: ["Kad se zahukta, uzmite pauzu sa obećanim vremenom povratka.", "Teške razgovore počinjite blago: „Osećam… zbog… i treba mi…“"] },
  pace: { name: "Ritam i tempo", plus: "Krećete se kroz život usklađenim tempom.", minus: "Jedno od vas je brže, drugo sporije.", practices: ["Dogovorite rokove za odluke, da se niko ne oseća ni požurivano ni zakočeno.", "Primetite šta svaki tempo donosi i zahvalite jedno drugom na tome."] },
};

export const pairCopy = {
  disclaimer: "Ogledalo za razmišljanje, a ne presuda o vašoj vezi. Zvezde postavljaju scenu, psihologija objašnjava obrazac, a priču piše to kako se ponašate jedno prema drugom.",
  scaleNote: "Ocene idu od 45 do 100: svaki par ima nešto da ponudi, pa naša skala počinje od 45. Ocena 72 je tipičan par. Svaka ocena se poredi sa hiljadama nasumičnih parova.",
  harmony: "Harmonija: koliko ovo ide lako i prirodno",
  spark: "Iskra: koliko ima energije, izazova i rasta",
  resonance: "Podudarnost",
  evidenceOnly: "Samo istraživanja",
  evidenceOnlyText: "Zasnovano samo na testovima Big Five i stilu vezivanja, iza kojih stoje stvarna istraživanja odnosa.",
  evidenceOnlyMissing: "Da biste videli ovu ocenu, obe osobe treba da urade testove Big Five i stil vezivanja.",
  superpowers: "Vaše supermoći",
  growthEdges: "Vaša mesta za rast",
  convergence: (n: number, names: string) => `${n} ${plural(n, "različito tumačenje pokazuje", "različita tumačenja pokazuju", "različitih tumačenja pokazuje")} ovde: ${names}.`,
  missing: "Otvori još tumačenja",
  missingText: "Za ova tumačenja potrebni su rezultati testova obe osobe. Pozovi drugu osobu da uradi testove (ili unesi njen kod rezultata).",
};
