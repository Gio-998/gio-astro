// Postbuild: takes router payload files out of the export that no visitor needs, so keeping every date online stays affordable.
// HTML is never touched. Every page keeps its index.html, so a crawler or a direct visit sees exactly the same page.
//
// What Next's client router reads in output: "export" (client/components/segment-cache/cache.js, router-reducer/fetch-server-response.js):
//   <page>/index.txt            full payload, fetched on a link click when no prefetch is cached
//   <page>/__next._tree.txt     route tree, fetched by a prefetch
//   <page>/__next.<segment>/... segment payload, fetched by a prefetch
//   <page>/__next._full.txt     byte-for-byte copy of index.txt, written by the prerender and never fetched by the client
//
// So __next._full.txt goes everywhere. On dated horoscope pages older than KEEP_DAYS the rest goes too: a click there fetches index.txt,
// gets a 404 and the router falls back to a full page load (doMpaNavigation). DailyHoroscope links those dates with plain <a> tags, so nothing is prefetched.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

export const KEEP_DAYS = 7;
/** Must match SKY_ZONE in src/engine/skyday.ts: "today" is a Skopje date everywhere on the site. */
const ZONE = "Europe/Skopje";
const DATED = /^\d{4}-\d{2}-\d{2}$/;
const isPayload = (name) => name === "index.txt" || name.startsWith("__next.");

/** Today's date in Skopje, minus `days`, as yyyy-mm-dd. */
export function cutoffDate(now = new Date(), days = KEEP_DAYS) {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
  const d = new Date(`${today}T12:00:00Z`); d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

const dirs = (p) => fs.readdirSync(p, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name);
const size = (p) => (fs.statSync(p).isDirectory() ? fs.readdirSync(p).reduce((a, n) => a + size(path.join(p, n)), 0) : fs.statSync(p).size);
function remove(p, tally) { tally.bytes += size(p); tally.items++; fs.rmSync(p, { recursive: true, force: true }); }

/** Every page folder in the export. Skips the build's static assets and the payload folders themselves. */
function eachFolder(dir, visit) {
  visit(dir);
  for (const name of dirs(dir)) if (name !== "_next" && !name.startsWith("__next.")) eachFolder(path.join(dir, name), visit);
}

/** Dated horoscope pages: <lang>/<section>/<sign>/<yyyy-mm-dd>/, whatever the section is called in that language. */
function datedPages(out) {
  const pages = [];
  const isLang = (name) => /^[a-z]{2}$/.test(name) && fs.existsSync(path.join(out, name, "index.html"));
  for (const lang of dirs(out).filter(isLang)) for (const section of dirs(path.join(out, lang))) {
    const root = path.join(out, lang, section);
    for (const sign of dirs(root)) for (const date of dirs(path.join(root, sign))) if (DATED.test(date)) pages.push({ date, dir: path.join(root, sign, date) });
  }
  return pages;
}

/** @returns {{ full: {items:number,bytes:number}, old: {pages:number,items:number,bytes:number} }} */
export function trimExport(out, cutoff = cutoffDate()) {
  const full = { items: 0, bytes: 0 }; const old = { pages: 0, items: 0, bytes: 0 };
  eachFolder(out, (dir) => { const f = path.join(dir, "__next._full.txt"); if (fs.existsSync(f)) remove(f, full); });
  for (const { date, dir } of datedPages(out)) {
    if (date >= cutoff || !fs.existsSync(path.join(dir, "index.html"))) continue;
    for (const name of fs.readdirSync(dir)) if (isPayload(name)) remove(path.join(dir, name), old);
    old.pages++;
  }
  return { full, old };
}

/** The not-found route also exports as a page. Only /404.html is ever served for it, so these copies would answer 200 at /_not-found/ and /404/. */
export function dropNotFoundCopies(out) {
  for (const d of ["_not-found", "404"]) fs.rmSync(path.join(out, d), { recursive: true, force: true });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const OUT = process.argv[2] ?? "out";
  if (!fs.existsSync(path.join(OUT, "404.html"))) { console.error(`trim-export: no ${OUT}/404.html, leaving the export alone`); process.exit(1); }
  const cutoff = cutoffDate();
  const { full, old } = trimExport(OUT, cutoff);
  dropNotFoundCopies(OUT);
  const mb = (n) => `${(n / 1048576).toFixed(1)} MB`;
  console.log(`trim-export: removed ${full.items} unused __next._full.txt (${mb(full.bytes)}) and the router payloads of ${old.pages} dated pages before ${cutoff} (${mb(old.bytes)})`);
}
