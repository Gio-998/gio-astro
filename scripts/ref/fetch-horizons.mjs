// Fetch reference planet longitudes from NASA/JPL Horizons (https://ssd.jpl.nasa.gov/api/horizons.api).
// Quantity 31 = observer-centred apparent ecliptic longitude/latitude of date. Centre 500@399 = geocentre.
// Output: tests/fixtures/horizons.json (golden values for tests/accuracy.test.ts).
import { writeFileSync } from "node:fs";
const BODIES = { sun: "10", moon: "301", mercury: "199", venus: "299", mars: "499", jupiter: "599", saturn: "699", uranus: "799", neptune: "899", pluto: "999" };
// 30 instants spread 1901..2059 at odd hours (deterministic).
const instants = [];
for (let i = 0; i < 30; i++) {
  const y = 1901 + Math.floor(i * 5.3), m = (i * 7) % 12, d = 1 + ((i * 11) % 28), h = (i * 5) % 24, mi = (i * 17) % 60;
  instants.push(new Date(Date.UTC(y, m, d, h, mi)));
}
const jd = (dt) => dt.getTime() / 86400000 + 2440587.5;
const out = { source: "NASA/JPL Horizons API, quantity 31 (apparent ecliptic lon of date), centre 500@399, UT", fetched: new Date().toISOString(), instants: instants.map((d) => d.toISOString()), lon: {} };
for (const [name, id] of Object.entries(BODIES)) {
  const tl = instants.map((d) => `'${jd(d).toFixed(6)}'`).join("%20");
  const url = `https://ssd.jpl.nasa.gov/api/horizons.api?format=text&COMMAND='${id}'&CENTER='500@399'&EPHEM_TYPE='OBSERVER'&TLIST=${tl}&TLIST_TYPE='JD'&TIME_TYPE='UT'&QUANTITIES='31'&ANG_FORMAT='DEG'&EXTRA_PREC='YES'&OBJ_DATA='NO'&CSV_FORMAT='YES'`;
  const txt = await (await fetch(url)).text();
  const body = txt.split("$$SOE")[1]?.split("$$EOE")[0];
  if (!body) throw new Error(name + "\n" + txt.slice(0, 2000));
  const rows = body.trim().split("\n").map((l) => l.split(",").map((s) => s.trim()));
  out.lon[name] = rows.map((r) => Number(r[r.length - 3] || r[3]));
  console.log(name, rows[0]);
}
writeFileSync("tests/fixtures/horizons.json", JSON.stringify(out, null, 1));
