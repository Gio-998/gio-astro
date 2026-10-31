// Post-build crawl of the static export: `npm run build && npm run check:site`.
// Walks the real HTML from each language's home page and checks it against out/sitemap.xml:
//   orphan       sitemap page that no other page links to
//   unreachable  sitemap page the crawl never gets to from a home page
//   missing      sitemap page with no HTML file
//   noindex      sitemap page that tells Google not to index it
//   canonical    canonical is not the page's own URL
//   hreflang     language versions incomplete, or no x-default
//   lang         <html lang> differs from the URL's language
// Links that end on no page, or on a blank notFound() shell, are listed as a warning, because sections still being filled are linked on purpose.
// Exits 1 if any check fails.
import fs from "node:fs";
import path from "node:path";

const OUT = process.argv[2] ?? "out";
const LOCALES = ["en", "mk", "de", "sr"];
/** Every page has these. Serbian comes on top only where the sitemap lists a Serbian page. */
const ALWAYS = ["en", "mk", "de"];
const HOMES = LOCALES.map((l) => `/${l}/`);
const SHOW = 15;
/** Static export still writes a file for a route that calls notFound(): a noindex shell with an empty body. So an existing file is not proof of a page. */
const isBlank = (body) => !body.slice(body.indexOf("<body")).replace(/<style\b[^>]*>[\s\S]*?<\/style>/g, "").replace(/<[^>]+>/g, "").trim();

const fileOf = (p) => path.join(OUT, decodeURI(p), "index.html");
const clean = (href) => href.replace(/&amp;/g, "&").split(/[?#]/)[0];
const isPage = (p) => /^\/(en|mk|de|sr)(\/|$)/.test(p) && !/\.[a-z0-9]+$/i.test(p);
const attr = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`, "i"))?.[1];

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else if (e.name === "index.html") out.push(p);
  }
  return out;
}
const toUrlPath = (file) => `/${path.relative(OUT, path.dirname(file)).split(path.sep).join("/")}/`;

if (!fs.existsSync(path.join(OUT, "sitemap.xml"))) { console.error(`No ${OUT}/sitemap.xml: run npm run build first.`); process.exit(1); }
const xml = fs.readFileSync(path.join(OUT, "sitemap.xml"), "utf8");
const sitemap = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
/** Language versions per URL, as the sitemap states them, so a page and the sitemap cannot disagree. */
const sitemapLangs = new Map([...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => [new URL(m[1].match(/<loc>([^<]+)<\/loc>/)[1]).pathname, [...m[1].matchAll(/hreflang="([^"]+)"/g)].map((x) => x[1]).filter((x) => x !== "x-default").sort()]));
const listed = new Set(sitemap);
const pages = LOCALES.flatMap((l) => (fs.existsSync(path.join(OUT, l)) ? walk(path.join(OUT, l)) : []));

const links = new Map(); const inbound = new Map(); const dead = new Map(); const stubs = new Set();
const bad = { missing: [], noindex: [], canonical: [], hreflang: [], lang: [] };
for (const file of pages) {
  const url = toUrlPath(file); const html = fs.readFileSync(file, "utf8");
  // Rendered markup only: the RSC payload at the end repeats hrefs that are not links.
  const body = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "");
  if (isBlank(body)) stubs.add(url);
  const out = new Set([...body.matchAll(/<a\b[^>]*>/g)].map((m) => attr(m[0], "href")).filter((h) => h?.startsWith("/")).map(clean).filter(isPage));
  links.set(url, out);
  for (const t of out) if (t !== url) { if (!inbound.has(t)) inbound.set(t, 0); inbound.set(t, inbound.get(t) + 1); }
  if (!listed.has(url)) continue;
  const head = html.slice(0, html.indexOf("</head>"));
  const tags = [...head.matchAll(/<(?:link|meta)\b[^>]*>/g)].map((m) => m[0]);
  if (tags.some((t) => attr(t, "name") === "robots" && /noindex/i.test(attr(t, "content") ?? ""))) bad.noindex.push(url);
  const canonical = tags.find((t) => attr(t, "rel") === "canonical"); const self = canonical && new URL(attr(canonical, "href"), "https://x").pathname;
  if (self !== url) bad.canonical.push(`${url} -> ${self ?? "none"}`);
  const alt = Object.fromEntries(tags.filter((t) => attr(t, "rel") === "alternate" && attr(t, "hreflang")).map((t) => [attr(t, "hreflang"), new URL(attr(t, "href"), "https://x").pathname]));
  const langs = Object.keys(alt).filter((l) => l !== "x-default").sort();
  if (!ALWAYS.every((l) => alt[l]) || !alt["x-default"] || !Object.values(alt).includes(url) || langs.join() !== (sitemapLangs.get(url) ?? []).join()) bad.hreflang.push(`${url} has ${Object.keys(alt).join(",") || "none"}`);
  if (alt["x-default"] !== alt.en) bad.hreflang.push(`${url} has x-default ${alt["x-default"]}`);
  const lang = html.match(/<html\b[^>]*\blang="([^"]+)"/)?.[1];
  if (lang !== url.split("/")[1]) bad.lang.push(`${url} has ${lang}`);
}
for (const p of sitemap) if (!fs.existsSync(fileOf(p))) bad.missing.push(p);
for (const [from, out] of links) for (const t of out) if (!fs.existsSync(fileOf(t)) || stubs.has(t)) { if (!dead.has(t)) dead.set(t, from); }

const depth = new Map(HOMES.map((h) => [h, 0]));
for (let queue = [...HOMES]; queue.length;) {
  const next = [];
  for (const p of queue) for (const t of links.get(p) ?? []) if (!depth.has(t)) { depth.set(t, depth.get(p) + 1); next.push(t); }
  queue = next;
}
bad.orphan = sitemap.filter((p) => !HOMES.includes(p) && !inbound.get(p));
bad.unreachable = sitemap.filter((p) => !depth.has(p));

const size = (p) => fs.statSync(fileOf(p)).size;
const avg = (a) => Math.round(a.reduce((x, y) => x + y, 0) / (a.length || 1));
const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
const sizes = sitemap.filter((p) => fs.existsSync(fileOf(p))).map(size);
const reached = sitemap.filter((p) => depth.has(p)).map((p) => depth.get(p));
console.log(`HTML files in ${OUT}: ${walk(OUT).length}. Sitemap URLs: ${sitemap.length}.`);
console.log(`Home page: ${HOMES.map((h) => `${h} ${kb(size(h))}`).join(", ")}. Sitemap page average: ${kb(avg(sizes))}, largest: ${kb(Math.max(...sizes))}.`);
console.log(`Click depth from a home page: average ${avg(reached)}, deepest ${Math.max(...reached)}.`);
if (dead.size) { console.warn(`Warning: ${dead.size} linked URLs have no page (expected only for sections not filled yet):`); for (const [t, from] of [...dead].slice(0, SHOW)) console.warn(`  ${t}  (first seen on ${from})`); }
let failed = 0;
for (const [name, list] of Object.entries(bad)) {
  if (!list.length) continue;
  failed += list.length; console.error(`${name}: ${list.length}`);
  for (const x of list.slice(0, SHOW)) console.error(`  ${x}`);
}
if (failed) { console.error(`\ncheck:site found ${failed} problem(s).`); process.exit(1); }
console.log("check:site: every sitemap page is linked, reachable, indexable and correctly tagged.");
