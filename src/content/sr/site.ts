import type { site as En } from "../en/site";
export const site: typeof En = {
  months: ["januar", "februar", "mart", "april", "maj", "jun", "jul", "avgust", "septembar", "oktobar", "novembar", "decembar"],
  weekdays: ["nedelja", "ponedeljak", "utorak", "sreda", "četvrtak", "petak", "subota"],
  themeOn: "Moje boje: uključene", themeOff: "Moje boje: isključene", themeHint: "Oboj ceo sajt svojom ličnom paletom po elementu ili se vrati na podrazumevani izgled.",
  datePicker: { day: "Dan", month: "Mesec", year: "Godina", done: "Gotovo", placeholder: "Izaberi datum", title: "Tvoj datum", timePh: "Izaberi vreme", hour: "Sat", minute: "Minut" },
  brand: "Horoscop",
  language: "Jezik", languages: { en: "English", mk: "Македонски", de: "Deutsch", sr: "Srpski" },
  hero: { title: ["Vidi sebe i ljude oko sebe ", "u novom svetlu."], sub: "Dnevni horoskop, kratki testovi ličnosti i numerologija, iskreno i na jednom mestu.", daily: "Pročitaj današnji horoskop", perks: ["Besplatno", "Bez naloga", "Testovi počinju odmah"] },
  footerCols: { astro: "Astrologija", discover: "Testovi i alati", trust: "O nama", chart: "Napravi profil", quizzes: "Svi testovi", match: "Uporedi dve osobe", bond: "Provera veze za dvoje", notes: "Današnja poruka po znaku", blurb: "Besplatno je, bez naloga, i uvek jasno kažemo šta je istraživanje, a šta tradicija." },
  tagline: "Iskreno ogledalo za tebe i tvoje odnose",
  description: "Natalna karta, dnevni horoskop, testovi ličnosti i kompatibilnost za partnere, prijatelje i porodicu. Besplatno i bez naloga.",
  footer: {
    privacy: "Privatnost", terms: "Uslovi", promise: "Naše obećanje", learn: "Metodologija", credits: "Zasluge",
  },
  common: {
    start: "Počni za 30 sekundi", continue: "Nastavi", back: "Nazad", next: "Dalje", save: "Sačuvaj", cancel: "Otkaži", delete: "Obriši",
    edit: "Izmeni", loading: "Učitava se…", share: "Podeli karticu", download: "Preuzmi sliku", copy: "Kopiraj", copied: "Kopirano!",
    unknownTime: "Ne znam vreme rođenja", optional: "nije obavezno", free: "Besplatno", locked: "Još nije otključano", unlock: "Otključaj",
    minutes: (n: number) => `${n} min`, retake: "Ponovi", you: "Ti",
  },
};
