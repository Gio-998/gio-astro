// Builds public/data/cities.json from GeoNames cities15000 (CC BY 4.0, https://www.geonames.org/).
// Usage: node scripts/build-cities.mjs /path/to/geonames-dir
import fs from "node:fs";
import path from "node:path";
const dir = process.argv[2] ?? "../data";
const countries = {};
for (const line of fs.readFileSync(path.join(dir, "countryInfo.txt"), "utf8").split("\n")) {
  if (!line || line.startsWith("#")) continue;
  const c = line.split("\t");
  countries[c[0]] = c[4];
}
const admin1 = {};
for (const line of fs.readFileSync(path.join(dir, "admin1CodesASCII.txt"), "utf8").split("\n")) {
  if (!line) continue;
  const c = line.split("\t");
  admin1[c[0]] = c[2];
}
const rows = [];
for (const line of fs.readFileSync(path.join(dir, "cities15000.txt"), "utf8").split("\n")) {
  if (!line) continue;
  const c = line.split("\t");
  const [name, ascii, lat, lon, cc, a1, pop, tz] = [c[1], c[2], +c[4], +c[5], c[8], c[10], +c[14], c[17]];
  if (!tz) continue;
  rows.push([name, ascii === name ? 0 : ascii, countries[cc] ?? cc, admin1[`${cc}.${a1}`] ?? "", Math.round(lat * 1e4) / 1e4, Math.round(lon * 1e4) / 1e4, tz, pop]);
}
rows.sort((a, b) => b[7] - a[7]);
const out = { attribution: "City data © GeoNames (geonames.org), CC BY 4.0", fields: ["name", "ascii", "country", "region", "lat", "lon", "tz", "pop"], rows };
fs.writeFileSync("public/data/cities.json", JSON.stringify(out));
console.log(rows.length, "cities", (fs.statSync("public/data/cities.json").size / 1e6).toFixed(2), "MB");
