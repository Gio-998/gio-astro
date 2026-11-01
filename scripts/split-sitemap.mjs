// Postbuild: turns the single sitemap Next writes (src/app/sitemap.ts) into a sitemap index with one file per language and section,
// so Search Console reports indexing for each family on its own. generateSitemaps() writes no index and needs an id on the route, so this runs on the export.
//
//   /sitemap.xml                          the index, the URL Search Console and robots.txt already use
//   /sitemap-de-tageshoroskop.xml         hubs and today's pages of a section, named by the public slug
//   /sitemap-de-tageshoroskop-archive.xml dated pages of the section
//   /sitemap-de-pages.xml                 sections too small to report on (one URL each: privacy, terms, ...)
//
// Files sit in the site root on purpose: the sitemap protocol only lets a file list URLs below its own folder.
// The <url> blocks are moved as they are, so hreflang alternates, lastmod, changefreq and priority stay exactly as sitemap.ts wrote them.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

/** The protocol's limits are 50,000 URLs and 50 MB. Stay well inside them so a family can grow for years without a change here. */
const MAX_URLS = 40000;
const MIN_SECTION = 3;
const DATED = /\/\d{4}-\d{2}-\d{2}\/$/;
const FULL_HEAD = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';
const FULL_TAIL = "</urlset>\n";

const tag = (block, name) => block.match(new RegExp(`<${name}>([^<]*)</${name}>`))?.[1];

/** "sitemap-de-tageshoroskop-archive" for a URL path. */
export function groupOf(pathname) {
  const [, lang, section] = pathname.split("/");
  return { lang, section: section || "home", dated: DATED.test(pathname) };
}

export function splitSitemap(xml) {
  const blocks = [...xml.matchAll(/<url>[\s\S]*?<\/url>\n?/g)].map((m) => m[0]);
  if (!blocks.length) throw new Error("split-sitemap: no <url> entries found");
  const groups = new Map(); const sizes = new Map();
  for (const b of blocks) { const { lang, section } = groupOf(new URL(tag(b, "loc")).pathname); const k = `${lang}/${section}`; sizes.set(k, (sizes.get(k) ?? 0) + 1); }
  for (const b of blocks) {
    const { lang, section, dated } = groupOf(new URL(tag(b, "loc")).pathname);
    const small = (sizes.get(`${lang}/${section}`) ?? 0) < MIN_SECTION;
    const name = `sitemap-${lang}-${small ? "pages" : section}${dated ? "-archive" : ""}`;
    if (!groups.has(name)) groups.set(name, []);
    groups.get(name).push(b);
  }
  const files = [];
  for (const [name, list] of [...groups].sort(([a], [b]) => a.localeCompare(b))) {
    for (let i = 0, part = 1; i < list.length; i += MAX_URLS, part++) {
      const slice = list.slice(i, i + MAX_URLS);
      const lastmod = slice.map((b) => tag(b, "lastmod") ?? "").sort().at(-1);
      files.push({ file: `${name}${list.length > MAX_URLS ? `-${part}` : ""}.xml`, urls: slice.length, lastmod, body: `${FULL_HEAD}${slice.join("")}${FULL_TAIL}` });
    }
  }
  return files;
}

export function indexXml(files, origin) {
  const rows = files.map((f) => `<sitemap>\n<loc>${origin}/${f.file}</loc>\n${f.lastmod ? `<lastmod>${f.lastmod}</lastmod>\n` : ""}</sitemap>\n`).join("");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows}</sitemapindex>\n`;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const OUT = process.argv[2] ?? "out";
  const main = path.join(OUT, "sitemap.xml");
  const xml = fs.readFileSync(main, "utf8");
  if (xml.includes("<sitemapindex")) { console.log("split-sitemap: already an index, nothing to do"); process.exit(0); }
  const files = splitSitemap(xml);
  const origin = new URL(tag(xml, "loc")).origin;
  for (const f of files) fs.writeFileSync(path.join(OUT, f.file), f.body);
  fs.writeFileSync(main, indexXml(files, origin));
  console.log(`split-sitemap: ${files.reduce((a, f) => a + f.urls, 0)} URLs in ${files.length} sitemaps, largest ${Math.max(...files.map((f) => f.urls))}`);
}
