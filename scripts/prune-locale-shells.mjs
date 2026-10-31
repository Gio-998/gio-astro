// Static export renders every [lang] route for every locale. Section folders in another locale's slug
// (e.g. /de/pricing/, /de/ceni/) are never served: vercel.json answers them with a 308 first. Drop them.
import { rmSync, existsSync } from "node:fs";
const SLUGS = { pricing: { en: "pricing", mk: "ceni", de: "preise" }, horoscope: { en: "horoscope", mk: "dneven-horoskop", de: "tageshoroskop" }, numerology: { en: "numerology", mk: "numerologija", de: "numerologie" }, zodiac: { en: "zodiac-signs", mk: "horoskopski-znaci", de: "sternzeichen" }, weekly: { en: "weekly-horoscope", mk: "nedelen-horoskop", de: "wochenhoroskop" }, monthly: { en: "monthly-horoscope", mk: "mesecen-horoskop", de: "monatshoroskop" }, y2027: { en: "horoscope-2027", mk: "horoskop-2027", de: "jahreshoroskop-2027" }, compat: { en: "zodiac-compatibility", mk: "kompatibilnost-na-znaci", de: "partnerhoroskop" }, rising: { en: "rising-sign-calculator", mk: "ascendent-kalkulator", de: "aszendent-berechnen" }, moon: { en: "moon-sign-calculator", mk: "mesecev-znak-kalkulator", de: "mondzeichen-berechnen" }, chart: { en: "birth-chart-calculator", mk: "natalna-karta-kalkulator", de: "geburtshoroskop-berechnen" }, calendar: { en: "moon-calendar", mk: "mesecev-kalendar", de: "mondkalender" }, mercury: { en: "mercury-retrograde", mk: "retrograden-merkur", de: "merkur-ruecklaeufig" } };
let n = 0;
for (const row of Object.values(SLUGS)) for (const l of Object.keys(row)) for (const [o, slug] of Object.entries(row)) {
  if (o === l) continue; const dir = `out/${l}/${slug}`;
  if (existsSync(dir)) { rmSync(dir, { recursive: true, force: true }); n++; }
}
console.log(`prune-locale-shells: removed ${n} wrong-locale folders`);
