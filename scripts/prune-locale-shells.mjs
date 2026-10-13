// Static export renders every [lang] route for every locale. Section folders in another locale's slug
// (e.g. /de/pricing/, /de/ceni/) are never served: vercel.json answers them with a 308 first. Drop them.
import { rmSync, existsSync } from "node:fs";
const SLUGS = { pricing: { en: "pricing", mk: "ceni", de: "preise" }, horoscope: { en: "horoscope", mk: "dneven-horoskop", de: "tageshoroskop" }, numerology: { en: "numerology", mk: "numerologija", de: "numerologie" } };
let n = 0;
for (const row of Object.values(SLUGS)) for (const l of Object.keys(row)) for (const [o, slug] of Object.entries(row)) {
  if (o === l) continue; const dir = `out/${l}/${slug}`;
  if (existsSync(dir)) { rmSync(dir, { recursive: true, force: true }); n++; }
}
console.log(`prune-locale-shells: removed ${n} wrong-locale folders`);
