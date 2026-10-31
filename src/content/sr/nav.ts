import type { Nav } from "../en/nav";

export const nav: Nav = {
  aria: { utility: "Jezik i nalog", quick: "Brze radnje", tabs: "Glavni delovi" },
  more: "Više", menu: "Meni", close: "Zatvori", account: "Nalog", language: "Jezik",
  start: "Počni test", login: "Prijavi se", profile: "Moj profil",
  tabs: { horoscope: "Horoskop", tests: "Testovi", match: "Slaganje", numbers: "Brojevi" },
  trust: [
    { icon: "🔒", text: "Podrazumevano privatno", href: "/privacy/" },
    { icon: "✦", text: "Besplatno za korišćenje", href: "/promise/" },
    { icon: "↺", text: "Nalog nije potreban", href: "/promise/" },
  ],
  trustLabel: "Naše obećanje tebi",
  method: "Kako ovo merimo",
  today: { label: "Moj dan", desc: "Tvoje nebo, karta i pitanje za danas" },
  horoscope: { label: "Dnevni horoskop", desc: "Svih dvanaest znakova, po današnjem nebu" },
  pricing: { label: "Cene", desc: "Za sada je sve besplatno" },
  groups: {
    astrology: {
      label: "Horoskop", linksTitle: "Horoskopi, znaci i kalkulatori",
      items: [
        { href: "/weekly-horoscope/", icon: "sun", title: "Nedeljni horoskop", desc: "Tvojih narednih sedam dana, znak po znak" },
        { href: "/monthly-horoscope/", icon: "moon", title: "Mesečni horoskop", desc: "Mesec pred nama za svih dvanaest znakova" },
        { href: "/horoscope-2027/", icon: "eye", title: "Horoskop 2027", desc: "Velike teme godine, po znacima" },
        { href: "/zodiac/", icon: "explorer", title: "Horoskopski znaci", desc: "Datumi, osobine, ljubav i posao za svaki znak" },
        { href: "/birth-chart/", icon: "chart", title: "Natalna karta kalkulator", desc: "Planete i kuće iz tvojih podataka o rođenju" },
        { href: "/rising-sign/", icon: "yinyang", title: "Podznak kalkulator", desc: "Nađi svoj podznak po vremenu i mestu" },
        { href: "/moon-sign/", icon: "moon", title: "Mesečev znak kalkulator", desc: "Gde je Mesec bio u trenutku rođenja" },
        { href: "/moon-calendar/", icon: "moon", title: "Mesečev kalendar", desc: "Mladi i pun Mesec i sve faze" },
        { href: "/mercury-retrograde/", icon: "vedic", title: "Retrogradni Merkur", desc: "Datumi i šta znače" },
      ],
    },
    tests: {
      label: "Testovi",
      allHref: "/quizzes/", allTitle: "Svi testovi", allDesc: "Izaberi jedan, svaki traje do tri minuta",
      play: { href: "/play/", title: "Igre ogledala", desc: "Ponašanje, a ne samoprocena: rizik, poverenje, strpljenje, fokus" },
      deep: { href: "/deep/", title: "Dubinsko čitanje", desc: "Teški izbori i prve reakcije, prilagođava se tebi" },
    },
    bonds: {
      label: "Kompatibilnost",
      items: [
        { href: "/sign-compatibility/", icon: "bond", title: "Slaganje znakova", desc: "Kako se slažu bilo koja dva znaka" },
        { href: "/match/", icon: "care", title: "Uporedi dve osobe", desc: "Po datumima rođenja, uz stvari za probu" },
        { href: "/bond/", icon: "attachment", title: "Provera veze", desc: "Po deset pitanja, odgovarate zajedno" },
      ],
    },
    numerology: {
      label: "Numerologija",
      items: [
        { href: "/numerology/", icon: "number", title: "Numerologija", desc: "Anđeoski brojevi, životni put i kalkulatori" },
        { href: "/numerology/angel-numbers/", icon: "eye", title: "Anđeoski brojevi", desc: "Šta mogu da znače brojevi koji se ponavljaju" },
        { href: "/numerology/calculator/life-path/", icon: "yinyang", title: "Kalkulator životnog puta", desc: "Tvoj broj iz datuma rođenja" },
        { href: "/numerology/life-path/", icon: "sun", title: "Brojevi životnog puta", desc: "Šta svaki broj predstavlja" },
        { href: "/numerology/mirror-hours/", icon: "moon", title: "Ogledalni sati", desc: "Kad ti se 11:11 i 22:22 stalno javljaju" },
        { href: "/numerology/compatibility/", icon: "bond", title: "Kompatibilnost brojeva", desc: "Kako se slažu dva životna puta" },
      ],
    },
    me: {
      label: "Moj profil",
      items: [
        { href: "/me/", icon: "sun", title: "Moj profil", desc: "Znaci, brojevi i rezultati na jednom mestu" },
        { href: "/today/", icon: "moon", title: "Moj dan", desc: "Tvoje nebo, karta i pitanje za danas" },
        { href: "/book/", icon: "eye", title: "Knjiga o tebi", desc: "Tvoje lično čitanje, poglavlje po poglavlje" },
        { href: "/chart/", icon: "chart", title: "Natalna karta", desc: "Ceo točak sa planetama i kućama" },
        { href: "/people/", icon: "care", title: "Ljudi", desc: "Sačuvane osobe, spremne za poređenje" },
        { href: "/account/", icon: "yinyang", title: "Nalog", desc: "Prijava, rezervna kopija i sinhronizacija" },
      ],
    },
    more: {
      label: "Više",
      items: [
        { href: "/blog/", icon: "palette", title: "Blog", desc: "Priče o znacima, ljubavi i unutrašnjem životu" },
        { href: "/how-it-works/", icon: "number", title: "Kako radi", desc: "Kako nastaje svako čitanje" },
        { href: "/learn/", icon: "eye", title: "Metode i izvori", desc: "Proračuni, istraživanja i iskrenost" },
        { href: "/promise/", icon: "temperament", title: "Naše obećanje", desc: "Jasna pravila, iskreni rezultati" },
      ],
    },
  },
};
