import type * as En from "../../en/systems/voice";
import { sLoc } from "../../horoscope/sr-cases";

/** Stands alone on the Chiron card and always follows a colon in voice sentences, so each theme is a nominative phrase or a clause. */
export const chironTheme: typeof En.chironTheme = {
  aries: "tvoje pravo da zauzmeš prostor", taurus: "da se osećaš sigurno i da imaš dovoljno", gemini: "da te čuju i shvate ozbiljno", cancer: "da pripadaš i da neko brine o tebi",
  leo: "da te vide, a da te ne bude stid", virgo: "da vrediš i ovako, bez popravki", libra: "da u vezi ne izgubiš sebe", scorpio: "poverenje u bliskost",
  sagittarius: "da nađeš smisao kome možeš da veruješ", capricorn: "odmor koji ne moraš da zaslužiš", aquarius: "da pripadaš i da pritom zadržiš svoju posebnost", pisces: "da čuvaš svoje granice dok osećaš sve",
};
/** Second subject of chironAttach, in the nominative. */
export const attachLens: typeof En.attachLens = {
  secure: "tvoj uglavnom siguran stil vezivanja", anxious: "tvoj stil vezivanja koji naginje anksioznom", avoidant: "tvoj stil vezivanja koji naginje izbegavanju", fearful: "tvoj obrazac privuci-odgurni",
};
export const attachNervous: typeof En.attachNervous = {
  secure: "Tvoj nervni sistem bliskost uglavnom čita kao bezbednu. To je resurs koji možeš da pozajmiš drugima.",
  anxious: "Tvoj nervni sistem je naučio da traži znake udaljavanja, a to je nekad imalo smisla. Spor izdah, duži od udaha, može da mu pomogne da se smiri pre nego što odgovoriš.",
  avoidant: "Tvoj nervni sistem je naučio da je najbezbednije da se oslanjaš na sebe. Prostor ti pomaže da se smiriš, a kad kažeš kad ćeš se vratiti, mirni su i drugi.",
  fearful: "Deo tebe poseže ka ljudima, a deo se steže. Oba dela pokušavaju da te zaštite. Kad imenuješ koji od njih trenutno govori, to može da skine vrelinu.",
};

export const voice: typeof En.voice = {
  why: "Zašto ovo kažemo",
  whyClose: "Sakrij",
  whyLead: "Ova rečenica dolazi iz:",
  opener: (name: string, sun: string, sunEss: string, moon: string, moonEss: string) => `${name}, Sunce ti je u ${sLoc(sun)} (${sunEss}), a Mesec u ${sLoc(moon)} (${moonEss}).`,
  chironAttach: (sign: string, attach: string, theme: string) => `Tvoj Hiron u ${sLoc(sign)} i ${attach} pokazuju na isto osetljivo mesto: ${theme}.`,
  chironMoon: (sign: string, moon: string, theme: string) => `Tvoj Hiron u ${sLoc(sign)} stoji pored Meseca u ${sLoc(moon)} i oba traže pažnju na istoj temi: ${theme}.`,
  echoLikert: (item: string, strong: boolean) => (strong ? `Tvrdnja „${item}“ te, po tvom odgovoru, potpuno opisuje. To uzimamo ozbiljno.` : `Tvrdnja „${item}“ te, po tvom odgovoru, uopšte ne opisuje. I to nam nešto govori.`),
  echoAura: (weather: string, wish: string) => `Kad smo te pitali kakvo ti je emotivno vreme, izbor je bio „${weather}“, a želja da u životu bude više ovoga: „${wish}“.`,
  echoAuraCare: (weatherKey: string): string => (["stormy", "foggy", "cloudy"].includes(weatherKey) ? "Postupaj danas nežno prema sebi. Loše vreme prolazi i ne moraš sve da popravljaš bez ičije pomoći." : "Primeti šta ti je pomoglo da se ovako osećaš, da to možeš ponovo da nađeš."),
  nodeValidate: (sign: string, trait: string) => `Tvoj Severni čvor u ${sLoc(sign)} traži ${trait}, a tvoji odgovori pokazuju da taj mišić već imaš. Ovog meseca ga koristi namerno.`,
  nodeChallenge: (sign: string, trait: string, step: string) => `Tvoj Severni čvor u ${sLoc(sign)} traži ${trait}, a po tvojim odgovorima to ti ne ide lako. Upravo tome služi mesto za rast. Počni sasvim malo: ${step}`,
  nodePlain: (sign: string, north: string) => `Tvoj Severni čvor je u ${sLoc(sign)}, pa ${north}`,
  compassion: (practice: string) => `Blagost prema sebi ovde ne znači da sebi sve progledaš kroz prste. Zahvaljujući njoj promena ostaje trajna. ${practice}`,
  /** Follows "traži": every value reads as an accusative or a clause. */
  traitName: { O: "radoznalost i otvorenost", C: "postojan red", E: "da se pojaviš i progovoriš", A: "davanje i primanje sa drugima", N: "mirno središte", lowC: "popuštanje kontrole" },
  lvl: { low: "nisko", mid: "srednje", high: "visoko" },
  // Why-chips
  w: {
    sun: (s: string, deg: string) => `Sunce ${deg} ${s}`, moon: (s: string, deg: string) => `Mesec ${deg} ${s}`, chiron: (s: string, deg: string) => `Hiron ${deg} ${s}`,
    node: (s: string) => `Severni čvor u ${sLoc(s)}`, attach: (name: string, ax: number, av: number) => `Test vezivanja: ${name} (anksioznost ${ax}, izbegavanje ${av})`,
    item: (quiz: string, ans: string) => `${quiz}: tvoj odgovor je „${ans}“`, aura: "Tvoja provera aure", trait: (t: string, v: number) => `Velikih pet, ${t}: ${v}/100`,
    birth: (place: string) => `Vreme i mesto rođenja: ${place}`, noTime: "Vreme rođenja nije poznato (uzeto je podne)", bio: (p: number, e: number, i: number) => `Bioritam danas: telo ${p}, osećanja ${e}, um ${i}`,
    feast: (f: string) => `Crkveni i narodni kalendar: ${f}`, transit: (t: string) => `Nebo danas: ${t}`, care: (n: string, c: string) => `${n}, stil brige: ${c}`,
    personalDay: (n: number) => `Lični dan broj ${n}`,
  },
  day: {
    bioHigh: (cycle: string) => `Tvoj ${cycle} talas je danas blizu vrha. Iskoristi ga, ali nemoj sve da potrošiš do podne.`,
    bioLow: (cycle: string) => `Tvoj ${cycle} talas je danas nizak. To je ritam, a ne presuda: isplaniraj lakši dan.`,
    /** `f` may be plural (Blagovesti, Cveti), so the verb must not agree with it. */
    feastToday: (f: string, custom: string) => `U kalendaru danas piše: ${f}. ${custom}`,
    nameDayToday: "Danas ti je imendan. Pusti ljude da te časte.",
    weatherEcho: (weather: string) => `Na poslednjoj proveri unutrašnje vreme ti je bilo „${weather}“. Da li se promenilo?`,
  },
  book: {
    love: (venus: string, care?: string) => (care ? `Tvoja Venera u ${sLoc(venus)} i tvoj glavni stil brige, ${care}, opisuju isto sa dve strane: kako ljubav stiže do tebe.` : `Tvoja Venera u ${sLoc(venus)} je ovde polazna tačka: kako voliš da te vole.`),
    mind: (merc: string, extra?: string) => `Misliš kroz Merkura u ${sLoc(merc)}${extra ? `, a tu je i ${extra}` : ""}. Ovo poglavlje govori o tome kako ti radi glava.`,
    shadow: (lilith: string, shadow?: string) => (shadow ? `Tvoja Lilit u ${sLoc(lilith)} i tvoja glavna senka, ${shadow}, obeležavaju delove tebe kojima je rečeno da sednu. To nisu mane, to je energija koja čeka bolji posao.` : `Tvoja Lilit u ${sLoc(lilith)} obeležava deo tebe koji je možda naučio da se krije. Čitaj ovo poglavlje blago prema sebi.`),
    heals: (chiron: string, theme: string) => `Isceljenje počinje tamo gde pokazuje tvoj Hiron u ${sLoc(chiron)}: ${theme}.`,
    path: (node: string, lp: number) => `Tvoj Severni čvor u ${sLoc(node)} i životni put ${lp} opisuju pravac, a ne sudbinu. Put biraš ti.`,
    year: (sr: string) => `Tvoj sunčev povratak pokazuje ovu temu za godinu: ${sr}`,
  },
  /** Names cannot be declined: each stands in the nominative, and the care or attachment word follows "kao" or sits in quotes. */
  bond: {
    care: (a: string, ca: string, b: string, cb: string) => (ca === cb ? `${a} i ${b}: kod oboje briga najlakše stiže kao ${ca}. To možete lako da date jedno drugom.` : `${a}: briga najlakše stiže kao ${ca}. ${b}: kao ${cb}. Prevodite jedno drugom, nemojte da pretpostavljate.`),
    attach: (a: string, sa: string, b: string, sb: string) => `${a} naginje stilu „${sa}“, a ${b} stilu „${sb}“. Kad to znate, „ti uvek…“ postaje „primećujem da ja…“`,
    chiron: (a: string, ch: string, b: string, moon: string) => `${a} ima Hirona u ${sLoc(ch)}, a ${b} Meseca u ${sLoc(moon)}. Deli ih isti element, pa ${b} možda bez objašnjavanja razume staro bolno mesto koje ${a} nosi.`,
    nodes: (a: string, node: string, b: string, sun: string) => `${a} ima Severni čvor u ${sLoc(node)}, a ${b} je po sunčevom znaku ${sun}. U astrologiji je to „dodir rasta“: ${b} je možda upravo ono što ${a} uči.`,
  },
};
