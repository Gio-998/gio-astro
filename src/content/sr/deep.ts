/** Serbian frame for the long-form Bond Story (narrative snippets live in ./deep/bond.ts). */
import type { bondUi as EnBondUi } from "../en/deep/bond";
import { sLoc } from "../horoscope/sr-cases";

/** Care style names arrive lowercased in the nominative; after "kroz" and "daje" only these two change. */
const CARE_ACC: Record<string, string> = { "promišljeni pokloni": "promišljene poklone", "fizička nežnost": "fizičku nežnost" };
const careAcc = (s: string) => CARE_ACC[s] ?? s;

export const bondUi: typeof EnBondUi = {
  eyebrow: "Priča o vašoj vezi",
  title: (a: string, b: string) => `${a} i ${b}`,
  chapters: {
    meet: { title: "Prvi utisci", kicker: "Kako se srećete i šta vidite jedno u drugom" },
    talk: { title: "Kako razgovarate", kicker: "Umovi, reči i odluke" },
    heart: { title: "Srca i osećanja", kicker: "Mesečevi znakovi, vezivanje i emotivni ritam" },
    closeness: { title: "Bliskost i hemija", kicker: "Želja, briga i ono što vas privlači" },
    conflict: { title: "Kad se sudarite", kicker: "Vaše tačke trenja i kako do popravke" },
    growth: { title: "Kako rastete jedno uz drugo", kicker: "Vaše supermoći i mesta za rast" },
    path: { title: "Dugi put", kicker: "Kuda ova veza vremenom ide" },
    flags: { title: "Na šta da pazite", kicker: "Iskreni znaci upozorenja i šta da radite" },
    rituals: { title: "Rituali za dvoje", kicker: "Male navike koje ovu vezu drže živom" },
  },
  sunsLine: (a: string, sa: string, b: string, sb: string) => `${a} ima Sunce u ${sLoc(sa)}, a ${b} u ${sLoc(sb)}.`,
  moonsLine: (a: string, sa: string, b: string, sb: string) => `${a} ima Mesec u ${sLoc(sa)}, a ${b} u ${sLoc(sb)}.`,
  mercLine: (a: string, sa: string, b: string, sb: string) => `${a} misli kroz Merkur u ${sLoc(sa)}, a ${b} kroz Merkur u ${sLoc(sb)}.`,
  venusMars: (a: string, va: string, b: string, mb: string) => `${a} donosi Veneru u ${sLoc(va)}, ${b} Mars u ${sLoc(mb)}, i te dve planete se sreću.`,
  aspectsTitle: "Najjače veze između vaših karata",
  attachTitle: (a: string, sa: string, b: string, sb: string) => `${a}: ${sa} stil; ${b}: ${sb} stil.`,
  careTitle: "Kako brinete jedno o drugom",
  careLine: (a: string, ra: string, ga: string) => `${a} se najviše oseća voljeno kroz ${careAcc(ra)}, a prirodno daje ${careAcc(ga)}.`,
  nineLine: (a: string, ta: string, b: string, tb: string) => `${a} u sebi nosi želju ${ta}; ${b} želju ${tb}.`,
  nineTip: "Kad znate najdublju motivaciju jedno drugog, mnoge svađe se pretvaraju u razumevanje: retko se svađate oko sudova, češće oko toga šta ti sudovi znače.",
  traitsTitle: "Vaše ličnosti jedna pored druge",
  superTitle: "Vaše supermoći zajedno",
  edgeTitle: "Vaša mesta za rast",
  scores: (h: number, s: number) => `Kroz sva vaša tumačenja, Harmonija vam je ${h}, a Iskra ${s}.`,
  needQuiz: "Uradite još testova, svako za sebe, da bi ovo poglavlje postalo dublje.",
  vedicLine: (n: number) => `Tradicionalno vedsko slaganje vam daje ${String(n).replace(".", ",")} od 36 poena.`,
  cardLine: (n: string, t: string) => `Vaša zajednička tarot karta je ${n}. ${t}`,
};
