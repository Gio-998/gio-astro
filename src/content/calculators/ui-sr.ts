import type { CalcUi } from "./ui";
import { sAcc, sGen, sLoc } from "@/content/horoscope/sr-cases";

/** Labels of the calculator tools in Serbian. Reaches the browser, so it stays as small as the rest of ./ui. */
export const calcUiSr: CalcUi = {
  go: { "rising-sign": "Izračunaj podznak", "moon-sign": "Izračunaj mesečev znak", "birth-chart": "Napravi natalnu kartu" },
  privacy: "Ovo radi u tvom pregledaču. Bez prijave, a podaci se ne čuvaju i ne šalju nikuda.",
  errTime: "Za podznak ti treba vreme rođenja. Bez njega je moguć svaki od dvanaest znakova.",
  errPlace: "Izaberi mesto rođenja. Svaki grad ima svoj horizont.",
  rising: "Tvoj podznak", moon: "Tvoj mesečev znak", moon2: "Ili ovaj mesečev znak",
  window: (from, to) => `Ovaj znak je tamo izlazio od ${from} do ${to}, pa svako vreme rođenja u tom prozoru daje isti podznak.`,
  near: (sign) => `Tvoje vreme je na manje od deset minuta od znaka ${sign}. Ako je zaokruženo, pročitaj i njega.`,
  moonStill: "Mesec je ceo dan ostao u ovom znaku, pa ti za ovaj rezultat ne treba vreme rođenja.",
  moonChanged: (from, to, at) => `Mesec je ovog dana promenio znak: do ${at} bio je u ${sLoc(from)}, a zatim je prešao u ${sAcc(to)}. Bez vremena rođenja može da bude bilo koji od ta dva.`,
  moonChangedKnown: (from, to, at, sign) => `Mesec je tog dana u ${at} prešao iz ${sGen(from)} u ${sAcc(to)}. Tvoje vreme rođenja daje ${sAcc(sign)}.`,
  sunChanged: (from, to, at) => `I Sunce je ovog dana promenilo znak, iz ${sGen(from)} u ${sAcc(to)} u ${at}. Bez vremena rođenja može da bude bilo koji od ta dva.`,
  zone: (zone) => `Nema mesta, pa dan čitamo u vremenskoj zoni tvog uređaja (${zone}).`,
  noTime: "Nema vremena rođenja, pa su planete postavljene za podne, bez podznaka i kuća.",
  noPlace: "Dodaj mesto rođenja da dobiješ podznak i kuće.",
  retro: "retrogradno",
  moreAbout: (sign) => `Više o znaku ${sign}`,
  startTitle: "Želiš potpunije čitanje?", startText: "Lično čitanje povezuje tvoju kartu sa ostatkom tvog profila.", startCta: "Počni lično čitanje",
};
