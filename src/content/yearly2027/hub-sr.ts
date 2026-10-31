import type { YearlyHub } from "./types";

/** Serbian hub copy. It sits apart from hub.ts so that file stays untouched until the locale is wired in. */
export const hubSr: YearlyHub = {
  crumb: "Horoskop 2027",
  h1: "Horoskop 2027: pravo nebo ove godine, znak po znak",
  metaTitle: "Horoskop 2027: svih 12 znakova, ljubav, posao, novac",
  description: "Horoskop 2027 za svih 12 znakova, sa pravog neba: Saturn u Ovnu, Jupiter u Devici od 26. jula, pomračenje Sunca 2. avgusta. Pronađi svoju godinu.",
  lead: "Saturn cele godine ostaje u Ovnu, Jupiter 26. jula prelazi iz Lava u Devicu, a 2. avgusta sledi potpuno pomračenje Sunca. Izaberi svoj znak i vidi šta to dotiče kod tebe.",
  bigPicture: {
    title: "Velika slika 2027. godine",
    paras: [
      "Većina godišnjih horoskopa mogla bi da se preštampa za bilo koju godinu. Ovi ne mogu. Izračunali smo gde planete zaista stoje u 2027, a zatim za svaki znak videli koji deo života dotiče svako kretanje. Zato isti datum znači jedno na stranici za Lava, a sasvim drugo na stranici za Ribe.",
      "Spora pozadina je mirna. Saturn i Neptun su cele godine u Ovnu, Uran u Blizancima, Pluton u Vodoliji. Raspoloženje menja Jupiter: prvu polovinu godine provodi u Lavu, 13. aprila postaje direktan, a 26. jula ulazi u Devicu. Prosto rečeno, pitanje se pomera sa „ko me vidi“ na „šta zaista funkcioniše“.",
      "Dva puta, 3. aprila i 12. jula, Jupiter i Saturn stoje u tačnom trigonu, lakom uglu između planete koja širi stvari i planete koja im daje trajnost. Jupiter zatim 10. septembra pravi kvadrat sa Uranom, nemirniji ugao koji ume da protrese planove pravljene na brzinu.",
      "Mars daje godini spor početak. Postaje retrogradan 10. januara u Devici, 21. februara se vraća u Lava, a 1. aprila ponovo postaje direktan. Merkur je retrogradan tri puta: od 9. februara do 3. marta, od 10. juna do 4. jula i od 7. oktobra do 28. oktobra. Venera u 2027. godini uopšte ne postaje retrogradna.",
      "Godinu obeležava pet pomračenja. Prstenasto pomračenje Sunca 6. februara u Vodoliji ne vidi se iz Evrope. Potpuno pomračenje Sunca 2. avgusta, na 9° Lava, kod nas se vidi kao delimično: na vrhuncu Mesec pokriva oko 66% Sunca gledano iz Skoplja i oko 47% gledano iz Beča, a Srbija je između te dve vrednosti, sa većim delom pokrivenim na jugu nego na severu. Tri pomračenja Meseca, 21. februara, 18. jula i 17. avgusta, polusenčna su i toliko bleda da ih većina ljudi i ne primeti.",
    ],
  },
  datesTitle: "Glavni datumi u 2027",
  datesIntro: "Računato po srednjoevropskom vremenu. Svaka stranica za znak prevodi ove datume u deo života koji kod tebe dotiču.",
  howTo: {
    title: "Kako da čitaš svoj horoskop za 2027",
    paras: [
      "Svaka stranica broji kuće od tvog sunčevog znaka, jedan znak za jednu kuću. Ako je Jupiter u Devici, to je za Devicu 1. kuća, za Strelca 10. kuća, a za Ribe 7. kuća. Dakle ista planeta nekome može da znači nov početak, drugome pitanje karijere, a trećem temu u vezi.",
      "Ako znaš svoj podznak, pročitaj i tu stranicu. Ona često bolje odgovara svakodnevici, dok sunčev znak više opisuje veliki pravac godine.",
      "Sve ovo čitaj kao ogledalo, a ne kao prognozu. Raspored na nebu opisuje temu za razmišljanje. Ne može da ti kaže šta će se dogoditi, a ono što uradiš sa tom temom ostaje tvoje.",
    ],
  },
  signsLabel: "Svih 12 znakova u 2027",
  method: { title: "Kako su izračunati ovi datumi", para: "Svaki datum na ovoj stranici dolazi iz našeg računa neba, koji zaista izračunava planete za 2027, umesto da prepisuje tabelu. Datumi su po srednjoevropskom vremenu, kao u Beogradu, pa na drugim mestima događaj može da padne dan ranije ili kasnije. Kuće se broje od tvog sunčevog znaka, jedan znak za jednu kuću. Sve ovo čitaj kao ogledalo za razmišljanje, a ne kao prognozu." },
  faq: [
    ["Kada je Merkur retrogradan u 2027?", "Merkur je retrogradan tri puta: od 9. februara do 3. marta, od 10. juna do 4. jula i od 7. oktobra do 28. oktobra. Svaki od ovih perioda počinje u vodenom znaku, a završava se u vazdušnom, što dobro odgovara ponovnom čitanju, prepravljanju i drugim razgovorima."],
    ["Da li je Venera retrogradna u 2027?", "Nije. Venera je postala direktna 14. novembra 2026. i tokom 2027. godine se nijednom ne zaustavlja. Ravnomerno prolazi kroz znakove, pa je koristan kalendar za pitanja ljubavi i novca."],
    ["Kada su pomračenja u 2027?", "Ima ih pet: prstenasto pomračenje Sunca 6. februara, polusenčna pomračenja Meseca 21. februara, 18. jula i 17. avgusta, i potpuno pomračenje Sunca 2. avgusta. Iz Evrope se lako vidi samo ono od 2. avgusta, kao delimično pomračenje pred podne."],
    ["Koja je najveća astrološka promena u 2027?", "Ulazak Jupitera u Devicu 26. jula. Ostale spore planete cele godine ostaju u jednom znaku, pa je ovo najjasnija prelomna tačka, a pada samo nedelju dana pre potpunog pomračenja Sunca 2. avgusta."],
    ["Da li su ovo predviđanja?", "Nisu. Stranice opisuju stvarne položaje planeta i teme koje astrologija povezuje s njima. To su podsticaji za razmišljanje, i ništa ovde ne može da ti obeća ishod u ljubavi, novcu ili zdravlju."],
  ],
  links: { zodiac: "profil znaka", daily: "dnevni horoskop", weekly: "nedeljni horoskop", monthly: "mesečni horoskop", personalYear: "Lična godina 2027", personalYearSub: "Tvoj broj za ovu godinu", mercury: "Retrogradni Merkur", mercurySub: "Svi datumi i šta znače", rising: "Kalkulator podznaka", risingSub: "Pročitaj i drugu stranicu za 2027" },
  sky: {
    bodies: { mars: "Mars", mercury: "Merkur", jupiter: "Jupiter", saturn: "Saturn" },
    // Genitive: the list prints "9° Lava" and "ulazi u znak Device".
    signsIn: { aries: "Ovna", taurus: "Bika", gemini: "Blizanaca", cancer: "Raka", leo: "Lava", virgo: "Device", libra: "Vage", scorpio: "Škorpije", sagittarius: "Strelca", capricorn: "Jarca", aquarius: "Vodolije", pisces: "Riba" },
    months: ["januar", "februar", "mart", "april", "maj", "jun", "jul", "avgust", "septembar", "oktobar", "novembar", "decembar"], date: "{d}. {m}",
    enters: "{a} ulazi u znak {s}", retro: "{a} postaje retrogradan na {p}", direct: "{a} postaje direktan na {p}", eclipses: { "annular-solar": "Prstenasto pomračenje Sunca na {p}", "total-solar": "Potpuno pomračenje Sunca na {p}", "penumbral-lunar": "Polusenčno pomračenje Meseca na {p}" }, trine: "Jupiter u trigonu sa Saturnom na {p}", square: "Jupiter u kvadratu sa Uranom na {p}",
  },
};
