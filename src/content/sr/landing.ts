import type { landing as En } from "../en/landing";
export const landing: typeof En = {
  signs: { more: "Još sa neba" },
  tests: { eyebrow: "Testovi ličnosti", title: ["Sedam kratkih testova, ", "svi besplatni", ""], sub: "Svaki traje od jednog do tri minuta. Bez naloga i bez datuma rođenja: izaberi test i prvo pitanje je odmah pred tobom.", all: "Pogledaj sve testove" },
  pairs: {
    eyebrow: "Kompatibilnost", title: ["Kako se dve osobe ", "uklapaju", ""], sub: "Počni od znakova ili uporedi dve stvarne osobe po datumima rođenja.",
    cards: [
      { t: "Slaganje znakova", d: "Bilo koja dva znaka, jednostavnim rečima." },
      { t: "Uporedi dve osobe", d: "Dovoljni su datumi rođenja. Rezultati testova dodaju dubinu." },
      { t: "Provera veze", d: "Po deset pitanja, jedno pored drugog." },
    ],
  },
  how: {
    eyebrow: "Kako radi", title: ["Tri jednostavna koraka", "", ""], more: "Kako nastaje svako čitanje",
    steps: [
      ["Izaberi test", "Počinje odmah. Napredak se čuva na ovom uređaju posle svakog odgovora, pa možeš da staneš i vratiš se kasnije."],
      ["Vidi svoj rezultat", "Kratak pregled se pojavljuje odmah. Ostavi ime i mejl i otvara se ceo rezultat. To radiš jednom po uređaju."],
      ["Idi dalje ako želiš", "Dodaj datum rođenja za svoju kartu, svoj dan i kompatibilnost. Pitamo samo kad je stranici to zaista potrebno."],
    ] as [string, string][],
  },
  trust: {
    eyebrow: "Naše obećanje", title: ["Nada bez lažne sigurnosti. ", "Vrednost bez zamki.", ""], read: "Pročitaj obećanje",
    items: ["Za sada besplatno, bez kartice i bez naplate na kraju", "Astrologija i numerologija su ogledala za razmišljanje, nikad predviđanja", "Kažemo šta ima istraživanja iza sebe, a šta je tradicija", "Bez lažne hitnosti, bez „vidovnjak kuca“, bez lažnih utisaka"],
  },
  faqTitle: "Dobro je da znaš",
  faq: [
    ["Da li je zaista besplatno?", "Da. Svaki test, karta i izveštaj o kompatibilnosti ovde su trenutno besplatni, bez kartice i bez naplate na kraju. Kasnije mogu da stignu opcioni plaćeni dodaci, a njihove cene ćemo prvo objaviti."],
    ["Da li mi treba nalog?", "Ne. Testovi, horoskopi i numerologija rade i bez njega. Opcioni besplatan nalog čuva rezervnu kopiju tvog profila i sinhronizuje je između uređaja."],
    ["Zašto tražite moje ime i mejl?", "Posle testa odmah vidiš kratak pregled. Ime i mejl zatim otvaraju ceo rezultat, a posle toga svaki drugi rezultat na ovom uređaju ostaje otvoren. Rezultati se prikazuju na ekranu, a reklamni mejlovi su poseban izbor koji možeš da preskočiš."],
    ["Gde se čuvaju moji podaci?", "Tvoji odgovori i rezultati ostaju u pregledaču, na tvom uređaju, osim ako izabereš nalog koji ih čuva u EU. Ako ostaviš ime i mejl, čuvamo njih, ali nikad tvoje odgovore. Sve možeš da izvezeš ili obrišeš kad god želiš."],
    ["Da li mi treba datum ili vreme rođenja?", "Za testove ne. Za kartu je dovoljan datum rođenja da počneš. Vreme i mesto dodaju podznak, kuće i precizniji položaj Meseca."],
    ["Može li astrologija da predvidi s kim ću se slagati?", "Ne, i nikad se nećemo praviti da može. Astrologija i numerologija su dobra ogledala za razmišljanje. Zato imamo i testove potkrepljene istraživanjima (Velikih pet, stil vezivanja) i svaki pošteno označavamo."],
  ] as [string, string][],
  cta: { title: ["Počni kad ", "tebi odgovara", "."], sub: "Izaberi test i vidi šta će izaći. Besplatno je i počinje odmah." },
};
