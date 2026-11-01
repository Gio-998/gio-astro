// Post-build check of the structured data in the static export: `npm run build && npm run check:schema`.
// Reads the JSON-LD of every page and checks it against schema.org and Google's rich result rules:
//   type        @type is not a schema.org type this table knows (add it here after checking schema.org)
//   property    property does not exist on that type
//   required    a field Google requires for the rich result is missing
//   date        not ISO 8601, no UTC offset, or an offset that is wrong for Skopje on that date
//   url         not an absolute URL on the site
//   lang        inLanguage differs from the page's language
//   breadcrumb  positions not 1..n, or fewer than two items
//   faq         an FAQ question that does not appear on the page (Google's policy)
//   organization two Organization nodes on one page that disagree
// Exits 1 if any check fails.
import fs from "node:fs";
import path from "node:path";

const OUT = process.argv[2] ?? "out";
const SHOW = 8;
const SITE = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://horoscop.si";
const ZONE = "Europe/Skopje";

const CREATIVE = ["about", "author", "dateCreated", "dateModified", "datePublished", "description", "headline", "image", "inLanguage", "isPartOf", "keywords", "mainEntityOfPage", "name", "publisher", "text", "thumbnailUrl", "url", "wordCount"];
const THING = ["alternateName", "description", "identifier", "image", "name", "sameAs", "url"];
const PAGE = [...CREATIVE, ...THING, "breadcrumb", "mainEntity", "primaryImageOfPage", "speakable"];
/** schema.org properties per type, limited to what a page here could reasonably use. */
const TYPES = {
  Organization: [...THING, "contactPoint", "email", "logo", "telephone", "address", "founder", "foundingDate", "legalName"],
  ImageObject: ["caption", "contentUrl", "height", "url", "width", "name"],
  ContactPoint: ["areaServed", "availableLanguage", "contactType", "email", "telephone", "url"],
  WebSite: [...CREATIVE, ...THING, "potentialAction"],
  WebPage: PAGE, FAQPage: PAGE, CollectionPage: PAGE, AboutPage: PAGE, ContactPage: PAGE,
  BreadcrumbList: ["itemListElement", "name", "numberOfItems"],
  ListItem: ["item", "name", "position", "url"],
  ItemList: [...THING, "itemListElement", "itemListOrder", "numberOfItems"],
  Question: ["acceptedAnswer", "answerCount", "name", "suggestedAnswer", "text"],
  Answer: ["text", "url"],
  Article: [...CREATIVE, ...THING, "articleBody", "articleSection"],
  BlogPosting: [...CREATIVE, ...THING, "articleBody", "articleSection"],
  Blog: [...CREATIVE, ...THING, "blogPost"],
  WebApplication: [...CREATIVE, ...THING, "aggregateRating", "applicationCategory", "browserRequirements", "offers", "operatingSystem"],
  SoftwareApplication: [...CREATIVE, ...THING, "aggregateRating", "applicationCategory", "offers", "operatingSystem"],
  Product: [...THING, "aggregateRating", "brand", "category", "offers", "review", "sku"],
  Brand: [...THING, "logo"],
  Offer: [...THING, "availability", "category", "price", "priceCurrency", "priceSpecification", "priceValidUntil", "validFrom"],
  UnitPriceSpecification: ["billingDuration", "billingIncrement", "price", "priceCurrency", "referenceQuantity", "unitCode", "unitText"],
  QuantitativeValue: ["unitCode", "unitText", "value"],
  Thing: THING,
  Person: [...THING, "email", "jobTitle"],
};
const REQUIRED = {
  Article: ["headline", "image", "datePublished", "author", "publisher"],
  BlogPosting: ["headline", "image", "datePublished", "author", "publisher"],
  Organization: ["name", "url"],
  WebSite: ["name", "url"],
  ListItem: ["position"],
  Question: ["name", "acceptedAnswer"],
  Answer: ["text"],
  Offer: ["price", "priceCurrency"],
  Product: ["name", "offers"],
  WebApplication: ["name", "applicationCategory", "offers"],
};
const DATE_KEYS = ["dateCreated", "dateModified", "datePublished", "foundingDate", "priceValidUntil", "validFrom"];
const URL_KEYS = ["item", "logo", "mainEntityOfPage", "url"];

const offsetAt = (date) => { // "+02:00" for an instant, in Skopje
  const part = new Intl.DateTimeFormat("en-US", { timeZone: ZONE, timeZoneName: "longOffset" }).formatToParts(date).find((p) => p.type === "timeZoneName").value;
  return part === "GMT" ? "+00:00" : part.replace("GMT", "");
};
export function dateProblem(v) {
  if (typeof v !== "string") return "not a string";
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return Number.isNaN(Date.parse(v)) ? "bad date" : null;
  const m = v.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(Z|[+-]\d{2}:\d{2})?$/);
  if (!m) return "not ISO 8601";
  if (!m[1]) return "no UTC offset";
  const at = new Date(v); if (Number.isNaN(at.getTime())) return "bad date";
  return m[1] === "Z" || m[1] === offsetAt(at) ? null : `offset ${m[1]}, Skopje has ${offsetAt(at)}`;
}

/** Every typed node. `listing` marks the short post summaries inside Blog.blogPost, which are not rich results and need no image or author. */
const nodesOf = (v, out = [], listing = false) => {
  if (Array.isArray(v)) v.forEach((x) => nodesOf(x, out, listing));
  else if (v && typeof v === "object") { if (v["@type"]) out.push({ n: v, listing }); Object.entries(v).forEach(([k, x]) => { if (k !== "@context") nodesOf(x, out, k === "blogPost"); }); }
  return out;
};
const stripped = (html) => html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, " ").replace(/<style\b[^>]*>[\s\S]*?<\/style>/g, " ").replace(/<[^>]+>/g, " ").replace(/&#x27;|&#39;/g, "'").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/\s+/g, " ");

/** All problems of one page as [check, message]. */
export function checkPage(html, lang) {
  const bad = []; const say = (k, m) => bad.push([k, m]);
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  const orgs = [];
  for (const b of blocks) {
    let data; try { data = JSON.parse(b[1]); } catch { say("json", "block does not parse"); continue; }
    for (const root of [data].flat()) if (root["@context"] !== "https://schema.org") say("context", `@context is ${root["@context"]}`);
    for (const { n, listing } of nodesOf(data)) {
      for (const t of [n["@type"]].flat()) {
        const props = TYPES[t];
        if (!props) { say("type", t); continue; }
        for (const k of Object.keys(n)) if (!k.startsWith("@") && !props.includes(k)) say("property", `${t}.${k}`);
        if (!listing) for (const k of REQUIRED[t] ?? []) if (n[k] === undefined || n[k] === "") say("required", `${t}.${k}`);
        if (t === "Organization") { orgs.push(n); if (n["@id"] && n.url && !n.logo && orgs.length === 1) say("required", "Organization.logo"); }
        if ((t === "Article" || t === "BlogPosting") && typeof n.headline === "string" && n.headline.length > 110) say("required", `${t}.headline is ${n.headline.length} characters, Google shows 110`);
        if (t === "BreadcrumbList") { const l = n.itemListElement ?? []; if (l.length < 2) say("breadcrumb", `${l.length} item`); if (l.some((x, i) => x.position !== i + 1)) say("breadcrumb", "positions are not 1..n"); if (l.slice(0, -1).some((x) => !x.item)) say("breadcrumb", "item without URL"); }
        if (t === "FAQPage") { const text = stripped(html); for (const q of n.mainEntity ?? []) if (!text.includes(q.name)) say("faq", `not on the page: ${q.name?.slice(0, 60)}`); }
        if (t === "ListItem" && n.item === undefined && n.url === undefined && n.name === undefined) say("required", "ListItem needs item, url or name");
        if (t === "Offer" && n.availability && !/^https:\/\/schema\.org\//.test(n.availability)) say("required", "Offer.availability must be a schema.org URL");
      }
      for (const k of DATE_KEYS) if (n[k] !== undefined) { const p = dateProblem(n[k]); if (p) say("date", `${k}: ${n[k]} (${p})`); }
      if (n.datePublished && n.dateModified && Date.parse(n.dateModified) < Date.parse(n.datePublished)) say("date", `dateModified ${n.dateModified} is before datePublished ${n.datePublished}`);
      for (const k of URL_KEYS) { const v = n[k]; if (typeof v === "string" && !v.startsWith(`${SITE}/`) && v !== SITE) say("url", `${k}: ${v}`); }
      if (n.inLanguage && typeof n.inLanguage === "string" && n.inLanguage !== lang) say("lang", `inLanguage ${n.inLanguage} on a ${lang} page`);
    }
  }
  const key = (o) => o["@id"] ?? o.name;
  for (const a of orgs) for (const b of orgs) if (a !== b && (key(a) === key(b) || a.name === b.name)) for (const f of ["name", "url", "email"]) if (a[f] !== undefined && b[f] !== undefined && a[f] !== b[f] && !bad.some(([k, m]) => k === "organization" && m.startsWith(`${f}:`))) say("organization", `${f}: ${a[f]} vs ${b[f]}`);
  return bad;
}

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) { if (e.name !== "_next" && !e.name.startsWith("__next.")) walk(path.join(dir, e.name), out); }
    else if (e.name === "index.html") out.push(path.join(dir, e.name));
  }
  return out;
}

if (process.argv[1]?.endsWith("check-schema.mjs")) {
  const found = new Map(); const types = new Map(); let pages = 0;
  for (const l of fs.readdirSync(OUT).filter((n) => /^[a-z]{2}$/.test(n) && fs.existsSync(path.join(OUT, n, "index.html")))) {
    for (const file of walk(path.join(OUT, l))) {
      const html = fs.readFileSync(file, "utf8"); pages++;
      for (const m of html.matchAll(/"@type":"([^"]+)"/g)) types.set(m[1], (types.get(m[1]) ?? 0) + 1);
      for (const [k, msg] of checkPage(html, l)) {
        const label = `${k}: ${k === "date" || k === "faq" || k === "url" ? msg.replace(/\d{4}-\d{2}-\d{2}\S*/g, "<date>") : msg}`;
        if (!found.has(label)) found.set(label, { n: 0, first: `/${path.relative(OUT, path.dirname(file)).split(path.sep).join("/")}/` });
        found.get(label).n++;
      }
    }
  }
  console.log(`check:schema: ${pages} pages, types: ${[...types.keys()].sort().join(", ")}`);
  const rows = [...found].sort((a, b) => b[1].n - a[1].n);
  for (const [label, { n, first }] of rows.slice(0, SHOW * 6)) console.error(`  ${label}  (${n} pages, first ${first})`);
  if (rows.length) { console.error(`\ncheck:schema found ${rows.length} kinds of problem.`); process.exit(1); }
  console.log("check:schema: all structured data is valid.");
}
