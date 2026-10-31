import type { Glance } from "../en/glance";

export const glance: Glance = {
  levels: { vlow: "veoma nisko", low: "nisko", mid: "uravnoteženo", high: "visoko", vhigh: "veoma visoko" },
  /** Nouns, not adjectives: the headline stays correct for every reader without knowing their gender. */
  words: {
    O: { hi: "radoznalost", lo: "prizemljenost" },
    C: { hi: "pouzdanost", lo: "slobodan duh" },
    E: { hi: "druželjubivost", lo: "okrenutost sebi" },
    A: { hi: "toplina", lo: "iskrenost" },
    N: { hi: "snažna osećanja", lo: "mirnoća pod pritiskom" },
  },
  short: { O: "Otvorenost", C: "Pouzdanost", E: "Društvena energija", A: "Toplina", N: "Osetljivost" },
  headline: (w: string[]) => {
    if (!w.length) return "Uravnoteženo u svemu: prilagođavaš se društvu u kom si.";
    const s = w.length === 1 ? w[0] : `${w.slice(0, -1).join(", ")} i ${w[w.length - 1]}`;
    return s.charAt(0).toUpperCase() + s.slice(1) + ".";
  },
  shapeLabel: "Oblik tvoje ličnosti",
  tapTrait: "Dodirni osobinu da vidiš šta znači za tebe.",
  inLove: "U odnosima:",
  showMore: "Prikaži detalje", showLess: "Sakrij detalje",
  showNumbers: "Prikaži tačne rezultate", hideNumbers: "Sakrij tačne rezultate",
  // Attachment map
  closeness: "bliskost", distance: "prostor", calm: "mir", worry: "briga",
  attachMap: "Gde se nalaziš: briga oko bliskosti (gore) i potreba za prostorom (desno).",
  // Nine
  nineWing: (t: number, w: number) => `Tip ${t}, sa dodirom tipa ${w}`,
  nineArrows: (g: number, s: number) => `Raste ka tipu ${g} · stres vuče ka tipu ${s}`,
  // Care
  careHead: (a: string, b: string) => `Najviše ti prija: ${a.toLowerCase()} i ${b.toLowerCase()}.`,
  careGives: (g: string) => `Ljubav pokazuješ ovako: ${g.toLowerCase()}.`,
  // Shadow
  shadowHead: (light: string, shadow: string) => `Tvoje svetlo: ${light.toLowerCase()}. Senka s kojom vredi da se sprijateljiš: ${shadow.toLowerCase()}.`,
  // Dosha
  doshaMix: "Tvoja mešavina",
  // Explorer
  explorerHead: { low: "Više autopilot", mid: "Smenjuješ oba načina", high: "Više istraživač" },
  // Compatibility
  pairHead: (sp: string, gr: string) => `Najveća snaga: ${sp.toLowerCase()}. Prostor za rast: ${gr.toLowerCase()}.`,
  pairDetails: "Snage i tačke rasta", pairLenses: "Čitanje po čitanje",
};
