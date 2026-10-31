// Static export renders every [lang] route for every locale. Section folders in another locale's slug
// (e.g. /de/pricing/, /de/ceni/) are never served: vercel.json answers them with a 308 first. Drop them.
import { rmSync, existsSync } from "node:fs";
const SLUGS = { pricing: { en: "pricing", mk: "ceni", de: "preise", sr: "cene" }, horoscope: { en: "horoscope", mk: "dneven-horoskop", de: "tageshoroskop", sr: "dnevni-horoskop" }, numerology: { en: "numerology", mk: "numerologija", de: "numerologie", sr: "numerologija" }, zodiac: { en: "zodiac-signs", mk: "horoskopski-znaci", de: "sternzeichen", sr: "horoskopski-znakovi" }, weekly: { en: "weekly-horoscope", mk: "nedelen-horoskop", de: "wochenhoroskop", sr: "nedeljni-horoskop" }, monthly: { en: "monthly-horoscope", mk: "mesecen-horoskop", de: "monatshoroskop", sr: "mesecni-horoskop" }, y2027: { en: "horoscope-2027", mk: "horoskop-2027", de: "jahreshoroskop-2027", sr: "horoskop-2027" }, compat: { en: "zodiac-compatibility", mk: "kompatibilnost-na-znaci", de: "partnerhoroskop", sr: "kompatibilnost-znakova" }, rising: { en: "rising-sign-calculator", mk: "ascendent-kalkulator", de: "aszendent-berechnen", sr: "podznak-kalkulator" }, moon: { en: "moon-sign-calculator", mk: "mesecev-znak-kalkulator", de: "mondzeichen-berechnen", sr: "mesecev-znak-kalkulator" }, chart: { en: "birth-chart-calculator", mk: "natalna-karta-kalkulator", de: "geburtshoroskop-berechnen", sr: "natalna-karta-kalkulator" }, calendar: { en: "moon-calendar", mk: "mesecev-kalendar", de: "mondkalender", sr: "mesecev-kalendar" }, mercury: { en: "mercury-retrograde", mk: "retrograden-merkur", de: "merkur-ruecklaeufig", sr: "retrogradni-merkur" } };
let n = 0;
for (const row of Object.values(SLUGS)) for (const l of Object.keys(row)) for (const slug of Object.values(row)) {
  if (slug === row[l]) continue; // own slug, possibly shared: mk and sr both use numerologija
  const dir = `out/${l}/${slug}`;
  if (existsSync(dir)) { rmSync(dir, { recursive: true, force: true }); n++; }
}
console.log(`prune-locale-shells: removed ${n} wrong-locale folders`);
