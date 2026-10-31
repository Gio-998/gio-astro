import type { ZodiacLang } from "./types";
import { aries } from "./sr/aries";
import { taurus } from "./sr/taurus";
import { gemini } from "./sr/gemini";
import { cancer } from "./sr/cancer";
import { leo } from "./sr/leo";
import { virgo } from "./sr/virgo";
import { libra } from "./sr/libra";
import { scorpio } from "./sr/scorpio";
import { sagittarius } from "./sr/sagittarius";
import { capricorn } from "./sr/capricorn";
import { aquarius } from "./sr/aquarius";
import { pisces } from "./sr/pisces";

export const sr: ZodiacLang = {
  hub: {
    metaTitle: "Karakteristike horoskopskih znakova: datumi i elementi",
    description: "Karakteristike horoskopskih znakova: svih 12 sa datumima i elementima, kratak vodič kroz vatru, zemlju, vazduh i vodu i kako da nađeš svoj znak.",
    h1: "Horoskopski znakovi: karakteristike svih 12 znakova",
    crumb: "Horoskopski znakovi",
    lead: "Dvanaest načina da se bude čovek. Nađi svoj datum, pa znak čitaj kao ogledalo, bez obaveze da mu veruješ u svemu.",
    intro: [
      "Horoskopski znakovi su dvanaest jednakih delova puta koji Sunce tokom godine pređe preko neba. Svakog dana u godini Sunce stoji u jednom od njih, pa tvoj znak zapravo govori gde se Sunce nalazilo na dan tvog rođenja. Iznad je svih dvanaest po redu, sa datumima i elementom. Svaki link vodi na celu stranicu o tom znaku: karakter, ljubav, muškarac i žena, prijateljstvo, posao i novac, i sa kojim znakovima je slaganje lakše ili teže.",
      "Znakove ovde tretiramo kao ogledalo za razmišljanje. Oni nude jezik kojim možeš da govoriš o sebi, a ne presudu o tome ko si i šta će ti se desiti. Zadrži ono što ti pomaže da se bolje razumeš, a ostalo slobodno ostavi.",
    ],
    elementsTitle: "Četiri elementa: kako znak doživljava stvari",
    elementsIntro: "Svaki znak pripada jednom od četiri elementa. Element pokazuje odakle ti dolazi snaga i kako reaguješ pre nego što razmisliš. Svaki element ima po tri znaka, raspoređena ravnomerno kroz godinu.",
    elements: {
      fire: "brzi, topli i okrenuti delanju. Misle dok se kreću i pune se kad nešto počinje. Treba im cilj i prostor, a uče da zastanu dovoljno dugo da čuju druge.",
      earth: "praktični i strpljivi. Veruju onome što može da se dodirne, izračuna i izgradi. Treba im sigurnost i vreme, a uče da puste ono što je prestalo da služi.",
      air: "radoznali i pričljivi. Vide veze među ljudima i idejama i pune se razgovorom. Treba im prostor za misao, a uče da ostanu uz osećanje i kad nema šta da se kaže.",
      water: "osetljivi i verni. Čitaju ton, ćutanje i atmosferu u prostoriji i dugo pamte. Treba im bliskost i poverenje, a uče da razlikuju šta je njihovo, a šta tuđe.",
    },
    modalitiesTitle: "Tri modaliteta: kako znak ulazi u posao",
    modalitiesIntro: "Ako element govori kakva je snaga, modalitet govori šta ona radi sa vremenom. Svaki modalitet ima po četiri znaka, po jedan iz svakog elementa, a odgovara početku, sredini i kraju godišnjeg doba.",
    modalities: {
      cardinal: "otvaraju godišnja doba i pokreću stvari. Prvi se hvataju zadatka i daju pravac, a završetak ponekad prepuste drugima.",
      fixed: "stoje na sredini godišnjeg doba i drže stvari na okupu. Izdržljivi su, odani i teško se pomeraju, pa im je najveća snaga ujedno i najveća prepreka.",
      mutable: "zatvaraju godišnja doba i prilagođavaju se. Lako menjaju plan i povezuju ljude, a teže im je da stanu na jedno mesto i izaberu.",
    },
    more: [
      {
        title: "Zašto se datumi znakova razlikuju za jedan dan",
        paras: [
          "Godina nema tačno 365 dana, pa Sunce ne prelazi granicu dva znaka svake godine u isti sat. Zato su datumi na ovim stranicama približni, a isti dan u različitim godinama može da pripadne različitim znakovima. Ako ti je rođendan na samom početku ili kraju perioda, vredi proveriti tačan položaj u natalnoj karti, sa godinom, vremenom i mestom rođenja.",
        ],
      },
      {
        title: "Sunčev znak je samo početak",
        paras: [
          "Kad te neko pita „koji si znak“, pita te samo za Sunce. Mesec pokazuje kako se osećaš i šta ti daje sigurnost, podznak kako te drugi vide pri prvom susretu, a ostale planete dodaju svoje teme. Zato dve osobe istog znaka mogu mnogo da se razlikuju. Ako ti neki opis nikako ne leži, odgovor je obično u tim drugim slojevima, a kalkulatori za podznak i mesečev znak pokazaće ti ih za nekoliko minuta.",
        ],
      },
    ],
    faq: [
      ["Koji su horoskopski znakovi po redu?", "Po redu: Ovan, Bik, Blizanci, Rak, Lav, Devica, Vaga, Škorpija, Strelac, Jarac, Vodolija i Ribe. Red počinje od Ovna jer se zodijačka godina računa od prolećne ravnodnevice, kad Sunce ulazi u taj znak."],
      ["Kako da nađem svoj horoskopski znak?", "Pronađi dan i mesec rođenja na spisku iznad. To je tvoj sunčev znak. Ako ti je rođendan baš na dan promene, unesi godinu, vreme i mesto u natalnu kartu, pa ćeš videti na kojoj strani granice je stajalo Sunce."],
      ["Postoji li 13. znak, Zmijonosac?", "Zmijonosac je sazvežđe kroz koje Sunce zaista prolazi, ali zapadna astrologija koristi tropski zodijak sa dvanaest jednakih delova vezanih za godišnja doba, a ne za sazvežđa. Zato u ovom sistemu znakova ostaje dvanaest i tvoj znak se ne menja."],
      ["Koja je razlika između sunčevog znaka i podznaka?", "Sunčev znak zavisi od datuma i opisuje tvoje jezgro. Podznak zavisi od tačnog vremena i mesta rođenja i opisuje prvi utisak i način na koji ulaziš u nove situacije. To mogu da budu dva sasvim različita znaka."],
      ["Da li horoskopski znak određuje karakter?", "Ne. Znak je simbolički jezik za razmišljanje, a ne naučno dokazan opis ličnosti. Čoveka oblikuju porodica, iskustvo i izbori. Mnogi koriste horoskop da bi lakše govorili o sebi, i upravo tako ga i mi nudimo."],
    ],
  },
  labels: {
    to: "do",
    factsTitle: (name) => `${name} ukratko`,
    dates: "Datumi",
    element: "Element",
    modality: "Modalitet",
    ruler: "Vladajuća planeta",
    opposite: "Suprotan znak",
    traditional: "tradicionalna",
    modern: "moderna",
    bestMatch: "Najbolji spoj",
    hardestMatch: "Najteži spoj",
    profileLink: (name) => `Sve o znaku ${name}`,
    daily: (name) => `Dnevni horoskop ${name}`,
    weekly: (name) => `Nedeljni horoskop ${name}`,
    monthly: (name) => `Mesečni horoskop ${name}`,
    yearly: (name) => `Horoskop 2027 ${name}`,
    compatHub: "Kompatibilnost znakova",
    compatHubSub: "Svaki par u zodijaku",
    dailyHub: "Dnevni horoskop",
    dailyHubSub: "Svakog dana za svaki znak",
    rising: "Kalkulator podznaka",
    risingSub: "Kako te drugi vide",
    moon: "Kalkulator mesečevog znaka",
    moonSub: "Šta ti daje sigurnost",
    chart: "Natalna karta",
    chartSub: "Sve planete na dan tvog rođenja",
    numerology: "Numerologija",
    numerologySub: "Životni put, lična godina, anđeoski brojevi",
  },
  signs: { aries, taurus, gemini, cancer, leo, virgo, libra, scorpio, sagittarius, capricorn, aquarius, pisces },
};
