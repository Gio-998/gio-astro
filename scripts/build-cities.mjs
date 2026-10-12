// Builds the lazy-loaded city index from GeoNames cities500 (CC BY 4.0, https://www.geonames.org/).
// Output: public/data/cities/<prefix>.json, one chunk per 2-letter search prefix (latin, folded),
// plus public/data/cities/meta.json (countries, attribution). Each city is indexed under the start of
// its name, ASCII name, every word, and its Latin/Cyrillic alternate names (so "Скопје", "Shtip", "Štip" all work).
// Usage: node scripts/build-cities.mjs [/path/to/geonames-dir]   (needs cities500.txt, countryInfo.txt, admin1CodesASCII.txt)
import fs from "node:fs";
import path from "node:path";
const dir = process.argv[2] ?? "../data";
const OUT = "public/data/cities";
const CYR = { а: "a", б: "b", в: "v", г: "g", д: "d", ѓ: "gj", е: "e", ж: "zh", з: "z", ѕ: "dz", и: "i", ј: "j", к: "k", л: "l", љ: "lj", м: "m", н: "n", њ: "nj", о: "o", п: "p", р: "r", с: "s", т: "t", ќ: "kj", у: "u", ф: "f", х: "h", ц: "c", ч: "ch", џ: "dzh", ш: "sh", ђ: "dj", ћ: "c", й: "j", ы: "y", э: "e", ю: "yu", я: "ya", щ: "shch", ъ: "", ь: "", ё: "e", є: "ye", і: "i", ї: "yi", ґ: "g" };
// Keep in sync with src/lib/cities.ts `key()`.
const key = (s) => s.toLowerCase().replace(/[\u0400-\u04FF]/g, (ch) => CYR[ch] ?? ch).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ł/g, "l").replace(/ß/g, "ss").replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
const countries = {};
for (const line of fs.readFileSync(path.join(dir, "countryInfo.txt"), "utf8").split("\n")) { if (!line || line.startsWith("#")) continue; const c = line.split("\t"); countries[c[0]] = c[4]; }
const admin1 = {};
for (const line of fs.readFileSync(path.join(dir, "admin1CodesASCII.txt"), "utf8").split("\n")) { if (!line) continue; const c = line.split("\t"); admin1[c[0]] = c[2]; }
const chunks = new Map(); let n = 0;
const okAlt = (a) => a.length >= 2 && a.length <= 40 && /^[\p{Script=Latin}\p{Script=Cyrillic}\s.'’-]+$/u.test(a) && !/^[A-Z]{2,4}$/.test(a);
for (const line of fs.readFileSync(path.join(dir, "cities500.txt"), "utf8").split("\n")) {
  if (!line) continue;
  const c = line.split("\t");
  const [name, ascii, alts, lat, lon, cc, a1, pop, tz] = [c[1], c[2], c[3], +c[4], +c[5], c[8], c[10], +c[14], c[17]];
  if (!tz) continue; n++;
  const keys = new Set();
  // Alternate names: local Cyrillic spellings for every place (max 3); other Latin spellings only for bigger cities (exonyms like "Wien").
  const al = alts ? alts.split(",").filter(okAlt) : [];
  const cyrAlts = al.filter((a) => /[\u0400-\u04FF]/.test(a)).slice(0, 3);
  const latin = al.filter((a) => !/[\u0400-\u04FF]/.test(a));
  const latAlts = pop >= 200000 ? latin.slice(0, 120) : pop >= 50000 ? latin.slice(0, 6) : latin.filter((a) => /[^\x00-\x7F]/.test(a)).slice(0, 3); // small places: local diacritic spellings (Štip, Vevčani)
  const names = [name, ascii, ...cyrAlts, ...latAlts];
  for (const nm of names) { const k = key(nm); if (!k) continue; keys.add(k); for (const w of k.split(" ").slice(1)) if (w.length >= 2) keys.add(w); }
  // Cyrillic display name for South-Slavic countries (used in the Macedonian UI).
  const cyr = ["MK", "RS", "BG", "ME", "BA"].includes(cc) ? (alts.split(",").filter((a) => /^[\u0400-\u04FF\s-]+$/.test(a)).sort((a, b) => Number(key(b) === key(ascii)) - Number(key(a) === key(ascii)))[0] ?? 0) : 0;
  const base = [name, cyr, cc, admin1[`${cc}.${a1}`] ?? "", Math.round(lat * 1e3) / 1e3, Math.round(lon * 1e3) / 1e3, tz, pop];
  const by = new Map();
  for (const k of keys) { const p = k.slice(0, 2); if (p.length < 2 || p.includes(" ")) continue; if (!by.has(p)) by.set(p, []); by.get(p).push(k); }
  // Each chunk row only carries the keys that start with that chunk's prefix; the ASCII name key is implied (empty list = ascii name).
  const own = key(ascii || name);
  for (const [p, ks] of by) { if (!chunks.has(p)) chunks.set(p, []); const extra = ks.filter((k) => k !== own); chunks.get(p).push(extra.length ? [...base, extra.join("|")] : base); }
}
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
let bytes = 0, biggest = ["", 0];
for (const [p, rows] of chunks) {
  rows.sort((a, b) => b[7] - a[7]);
  const file = path.join(OUT, `${p.replace(/ /g, "_")}.json`); const s = JSON.stringify(rows); fs.writeFileSync(file, s); bytes += s.length;
  if (s.length > biggest[1]) biggest = [p, s.length];
}
fs.writeFileSync(path.join(OUT, "meta.json"), JSON.stringify({ attribution: "City data © GeoNames (geonames.org), CC BY 4.0", fields: ["name", "cyr", "cc", "region", "lat", "lon", "tz", "pop", "keys?"], countries, prefixes: [...chunks.keys()].sort() }));
console.log(n, "cities in", chunks.size, "chunks,", (bytes / 1e6).toFixed(1), "MB total; biggest", biggest[0], (biggest[1] / 1e3).toFixed(0), "kB");
