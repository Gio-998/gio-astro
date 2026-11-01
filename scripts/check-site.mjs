// Post-build crawl of the static export: `npm run build && npm run check:site`.
// Walks the real HTML from each language's home page and checks it against out/sitemap.xml:
//   orphan       sitemap page that no other page links to
//   unreachable  sitemap page the crawl never gets to from a home page
//   missing      sitemap page with no HTML file
//   noindex      sitemap page that tells Google not to index it
//   canonical    canonical is not the page's own URL
//   hreflang     language versions incomplete, or no x-default
//   lang         <html lang> differs from the URL's language
//   broken      a link on any page ends on no page, or on a blank notFound() shell
//   redirected  a link on any page goes through a redirect (no trailing slash, another language's slug)
//   asset       an image, stylesheet, script or og:image on any page has no file
//   title       two sitemap pages share a <title>
//   description two sitemap pages share a meta description
//   heavy       a page's HTML is over MAX_HTML
//   leadcopy    a page's title, description or visible text breaks a rule in lead-copy-rules.mjs
// Reads /sitemap.xml as a sitemap index (scripts/split-sitemap.mjs) or as a single file.
// Exits 1 if any check fails.
import fs from "node:fs";
import path from "node:path";
import { leadCopyProblem } from "./lead-copy-rules.mjs";

const OUT = process.argv[2] ?? "out";
if (!fs.existsSync(path.join(OUT, "sitemap.xml"))) { console.error(`No ${OUT}/sitemap.xml: run npm run build first.`); process.exit(1); }
const LOCALES = fs.readdirSync(OUT).filter((n) => /^[a-z]{2}$/.test(n) && fs.existsSync(path.join(OUT, n, "index.html")));
const HOMES = LOCALES.map((l) => `/${l}/`);
const SHOW = 15;
const MAX_HTML = 200 * 1024;
/** Static export still writes a file for a route that calls notFound(): a noindex shell with an empty body. So an existing file is not proof of a page. */
const isBlank = (body) => !body.slice(body.indexOf("<body")).replace(/<style\b[^>]*>[\s\S]*?<\/style>/g, "").replace(/<[^>]+>/g, "").trim();

const fileOf = (p) => path.join(OUT, decodeURI(p), "index.html");
const clean = (href) => href.replace(/&amp;/g, "&").split(/[?#]/)[0];
const inLocale = new RegExp(`^/(${LOCALES.join("|")})(/|$)`);
const isPage = (p) => inLocale.test(p) && !/\.[a-z0-9]+$/i.test(p);
const attr = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`, "i"))?.[1];

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else if (e.name === "index.html") out.push(p);
  }
  return out;
}
const toUrlPath = (file) => `/${path.relative(OUT, path.dirname(file)).split(path.sep).join("/")}/`;

const locs = (file) => [...fs.readFileSync(file, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
const isIndex = fs.readFileSync(path.join(OUT, "sitemap.xml"), "utf8").includes("<sitemapindex");
const sitemapFiles = isIndex ? locs(path.join(OUT, "sitemap.xml")) : ["/sitemap.xml"];
const sitemap = sitemapFiles.filter((f) => fs.existsSync(path.join(OUT, f))).flatMap((f) => locs(path.join(OUT, f)));
const listed = new Set(sitemap);
const pages = LOCALES.flatMap((l) => (fs.existsSync(path.join(OUT, l)) ? walk(path.join(OUT, l)) : []));

const links = new Map(); const inbound = new Map(); const dead = new Map(); const stubs = new Set(); const assets = new Map(); const titles = new Map(); const descriptions = new Map();
const bad = { missing: [], noindex: [], canonical: [], hreflang: [], lang: [], heavy: [], leadcopy: [] };
sitemapFiles.filter((f) => !fs.existsSync(path.join(OUT, f))).forEach((f) => bad.missing.push(f));
const decode = (t) => t.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"');
const note = (map, key, url) => { if (!map.has(key)) map.set(key, []); map.get(key).push(url); };
const assetOf = (src) => { let p; try { p = new URL(src, "https://horoscop.si"); } catch { return null; } return p.origin === "https://horoscop.si" || p.origin === process.env.NEXT_PUBLIC_SITE_URL ? decodeURI(p.pathname) : null; };
for (const file of pages) {
  const url = toUrlPath(file); const html = fs.readFileSync(file, "utf8");
  const bytes = fs.statSync(file).size; if (bytes > MAX_HTML) bad.heavy.push(`${url} ${(bytes / 1024).toFixed(0)} KB`);
  // Rendered markup only: the RSC payload at the end repeats hrefs that are not links.
  const body = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "");
  if (isBlank(body)) stubs.add(url);
  // What a visitor reads, and what a search result shows. Admin pages are gated, and their labels are meant to say waitlist.
  if (!/^\/[a-z]{2}\/admin\//.test(url)) {
    const shown = decode(`${html.match(/<title>([^<]*)<\/title>/)?.[1] ?? ""} ${html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? ""} ${body.replace(/<style\b[^>]*>[\s\S]*?<\/style>/g, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")}`);
    const hit = leadCopyProblem(shown); if (hit) bad.leadcopy.push(`${url} ${hit[1]}: "${hit[0]}"`);
  }
  const out = new Set([...body.matchAll(/<a\b[^>]*>/g)].map((m) => attr(m[0], "href")).filter((h) => h?.startsWith("/")).map(clean).filter(isPage));
  links.set(url, out);
  // Files a page loads. The file behind /foo?x=1 is /foo; query strings on fonts and icons are cache keys.
  for (const m of html.matchAll(/<(?:img|script|link|source)\b[^>]*>/g)) { if (/\brel="(?:canonical|alternate)"/.test(m[0])) continue; const v = attr(m[0], "src") ?? attr(m[0], "href"); const a = v && !v.startsWith("data:") ? assetOf(v) : null; if (a && !isPage(a) && !assets.has(a)) assets.set(a, url); }
  for (const m of html.matchAll(/<meta\b[^>]*property="og:image"[^>]*>/g)) { const a = assetOf(attr(m[0], "content") ?? ""); if (a && !assets.has(a)) assets.set(a, url); }
  for (const t of out) if (t !== url) { if (!inbound.has(t)) inbound.set(t, 0); inbound.set(t, inbound.get(t) + 1); }
  if (!listed.has(url)) continue;
  const head = html.slice(0, html.indexOf("</head>"));
  const title = head.match(/<title>([^<]*)<\/title>/)?.[1]; if (title) note(titles, decode(title), url);
  const description = head.match(/<meta name="description" content="([^"]*)"/)?.[1]; if (description) note(descriptions, decode(description), url);
  const tags = [...head.matchAll(/<(?:link|meta)\b[^>]*>/g)].map((m) => m[0]);
  if (tags.some((t) => attr(t, "name") === "robots" && /noindex/i.test(attr(t, "content") ?? ""))) bad.noindex.push(url);
  const canonical = tags.find((t) => attr(t, "rel") === "canonical"); const self = canonical && new URL(attr(canonical, "href"), "https://x").pathname;
  if (self !== url) bad.canonical.push(`${url} -> ${self ?? "none"}`);
  const alt = Object.fromEntries(tags.filter((t) => attr(t, "rel") === "alternate" && attr(t, "hreflang")).map((t) => [attr(t, "hreflang"), new URL(attr(t, "href"), "https://x").pathname]));
  if (!LOCALES.every((l) => alt[l]) || alt["x-default"] !== alt.en || !Object.values(alt).includes(url)) bad.hreflang.push(`${url} has ${Object.keys(alt).join(",") || "none"}`);
  const lang = html.match(/<html\b[^>]*\blang="([^"]+)"/)?.[1];
  if (lang !== url.split("/")[1]) bad.lang.push(`${url} has ${lang}`);
}
for (const p of sitemap) if (!fs.existsSync(fileOf(p))) bad.missing.push(p);
const redirected = new Map();
for (const [from, out] of links) for (const t of out) {
  if (fs.existsSync(fileOf(t)) && !stubs.has(t)) continue;
  if (!t.endsWith("/") && fs.existsSync(fileOf(`${t}/`))) { if (!redirected.has(t)) redirected.set(t, from); continue; }
  if (!dead.has(t)) dead.set(t, from);
}
bad.broken = [...dead].map(([t, from]) => `${t}  (first seen on ${from})`);
bad.redirected = [...redirected].map(([t, from]) => `${t}  (first seen on ${from})`);
bad.asset = [...assets].filter(([a]) => !fs.existsSync(path.join(OUT, a))).map(([a, from]) => `${a}  (first seen on ${from})`);
bad.title = [...titles].filter(([, u]) => u.length > 1).map(([t, u]) => `"${t}" on ${u.length} pages: ${u.slice(0, 3).join(" ")}`);
bad.description = [...descriptions].filter(([, u]) => u.length > 1).map(([t, u]) => `"${t.slice(0, 70)}" on ${u.length} pages: ${u.slice(0, 3).join(" ")}`);

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
console.log(`HTML files in ${OUT}: ${walk(OUT).length}. Sitemap URLs: ${sitemap.length} in ${sitemapFiles.length} file${sitemapFiles.length === 1 ? "" : "s"}.`);
console.log(`Home page: ${HOMES.map((h) => `${h} ${kb(size(h))}`).join(", ")}. Sitemap page average: ${kb(avg(sizes))}, largest: ${kb(Math.max(...sizes))}.`);
console.log(`Click depth from a home page: average ${avg(reached)}, deepest ${Math.max(...reached)}.`);
let failed = 0;
for (const [name, list] of Object.entries(bad)) {
  if (!list.length) continue;
  failed += list.length; console.error(`${name}: ${list.length}`);
  for (const x of list.slice(0, SHOW)) console.error(`  ${x}`);
}
if (failed) { console.error(`\ncheck:site found ${failed} problem(s).`); process.exit(1); }
console.log("check:site: every sitemap page is linked, reachable, indexable, unique and correctly tagged; no broken links or assets.");
