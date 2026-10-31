import type { NumContent } from "./en";
import { chars } from "./sr-chars";
import { angel } from "./sr-angel";
import { years, karmic, explain as explain1 } from "./sr-more";
import { explain2 } from "./sr-p2";
import { days, p3, explain3 } from "./sr-p3";
const explain = { ...explain1, ...explain2, ...explain3 };

/** The title and meta functions give the page h1 and a fallback. Search snippets per page live in ./snippets/sr.ts, as in English, so there is no sr-seo.ts. */
const ui: NumContent["ui"] = {
  section: "Numerologija",
  crumbHome: "Početna",
  angelHub: "Anđeoski brojevi", lifePathHub: "Životni put", yearHub: "Lična godina", calcHub: "Kalkulatori", karmicHub: "Karmički dug", masterHub: "Master brojevi",
  angelTitle: (n) => `Anđeoski broj ${n}: značenje u ljubavi i životu`,
  angelMeta: (n, tag) => `Šta znači ${n} kad ga stalno viđaš: ${tag.toLowerCase()}. Ljubav, posao, šta da uradiš i česta pitanja o ovom broju.`,
  lifePathTitle: (n) => `Životni put ${n}: značenje, ljubav i posao`,
  lifePathMeta: (n, name) => `Životni put ${n}, ${name}: karakter, jake strane, senka, ljubav, posao i pitanja koja vredi postaviti sebi.`,
  yearTitle: (n) => `Lična godina ${n}: šta ti godina traži`,
  yearMeta: (n) => `Lična godina ${n} u numerologiji: teme godine, ljubav, posao, zdravlje i kako meseci obično teku od januara do decembra.`,
  number: "Broj", digits: "Cifre u broju", digitsSum: (sum, root) => `Zbir je ${sum}, što se svodi na ${root}.`,
  sec: { mood: "Raspoloženje godine", scene: "Gde možeš da ga vidiš", meaning: "Šta znači", love: "U ljubavi", work: "Posao i novac", act: "Šta da uradiš sada", why: "Zašto se stalno pojavljuje", questions: "Pitanja za razmišljanje", faq: "Česta pitanja", story: "Karakter", gifts: "Darovi", money: "Novac", shadow: "Senka", week: "Kako izgleda u jednoj nedelji", growth: "Rast", practices: "Vežbe", strengths: "Jake strane", shadows: "Pazi na", focus: "Fokus", caution: "Oprezno sa", months: "Kako godina teče", body: "Energija i zdravlje", close: "Do kraja godine", related: "Povezani brojevi", explore: "Istraži dalje", also: "Još anđeoskih brojeva" },
  faq: {
    angelMean: (n) => `Šta znači broj ${n}?`, angelLove: (n) => `Šta znači ${n} u ljubavi?`, angelDo: (n) => `Šta da radim kad vidim ${n}?`, angelWhy: (n) => `Zašto stalno vidim ${n}?`,
    lpMean: (n) => `Šta znači životni put ${n}?`, lpLove: (n) => `S kim se slaže životni put ${n}?`, lpWork: (n) => `Koja zanimanja odgovaraju životnom putu ${n}?`, lpCalc: (n) => `Kako da znam da li je moj životni put ${n}?`,
    lpCalcA: "Svedi mesec, dan i godinu rođenja, saberi ih i svedi zbir, s tim što 11, 22 i 33 ostaju. Besplatni kalkulator pokazuje svaki korak.",
    yrMean: (n) => `Šta je lična godina ${n}?`, yrCalc: "Kako da nađem svoju ličnu godinu?", yrCalcA: "Saberi mesec i dan rođenja sa tekućom godinom, pa zbir svedi na jednu cifru. Kalkulator to radi umesto tebe.",
  },
  calc: {
    birth: "Datum rođenja", name: "Puno ime", namePh: "npr. Ana Petrović", year: "Godina", go: "Izračunaj", invalid: "Unesi ispravan datum.", nameInvalid: "Unesi ime slovima.",
    lifePath: "Tvoj životni put", expression: "Broj izraza", soul: "Broj duše", personality: "Broj ličnosti", personalYear: (y) => `Tvoja lična godina za ${y}.`,
    read: "Pročitaj", steps: "Kako se računa", tryLife: "Kalkulator životnog puta", tryName: "Kalkulator imena", private: "Računa se na tvom uređaju, ništa se ne čuva.",
  },
  pickNumber: "Izaberi broj", lifePathShort: (n) => `Životni put ${n}`, yearShort: (n) => `Godina ${n}`,
  prev: "Prethodni", next: "Sledeći", allAngel: "Svi anđeoski brojevi", allLife: "Svi životni putevi", calcCta: "Nađi svoj broj", calcCtaSub: "Besplatno, za deset sekundi.",
  readFull: "Pročitaj više", see: "Otvori",
  homeEyebrow: "Numerologija", homeTitle: "Šta kažu tvoji brojevi", homeSub: "Anđeoski brojevi, životni put i besplatni kalkulatori.",
  navTitle: "Numerologija", navDesc: "Anđeoski brojevi, životni put, kalkulatori",
  method: "Numerologija je tradicija za razmišljanje, a ne nauka. Čitaj je kao ogledalo.",
};

export const numerology: NumContent = { ui, chars, angel, years, karmic, explain, days, p3 };
