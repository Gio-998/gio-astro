import { describe, it, expect, afterEach } from "vitest";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { splitSitemap, indexXml } from "../scripts/split-sitemap.mjs";
import { trimExport, dropNotFoundCopies, cutoffDate, KEEP_DAYS } from "../scripts/trim-export.mjs";
import { changedUrls, parseSitemap, KEY } from "../scripts/indexnow.mjs";
import { checkPage, dateProblem } from "../scripts/check-schema.mjs";
import robots from "@/app/robots";

const url = (loc: string, lastmod = "2026-10-30") => `<url>\n<loc>https://horoscop.si${loc}</loc>\n<xhtml:link rel="alternate" hreflang="de" href="https://horoscop.si/de/x/" />\n<lastmod>${lastmod}</lastmod>\n<changefreq>daily</changefreq>\n<priority>0.7</priority>\n</url>\n`;
const sitemap = (...u: string[]) => `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${u.join("")}</urlset>\n`;

describe("sitemap split", () => {
  const xml = sitemap(url("/en/horoscope/"), url("/en/horoscope/leo/"), url("/en/horoscope/leo/2026-10-01/", "2026-10-01"), url("/en/horoscope/leo/2026-10-02/", "2026-10-02"), url("/en/horoscope/leo/2026-10-03/", "2026-10-03"), url("/de/tageshoroskop/"), url("/de/tageshoroskop/loewe/"), url("/de/tageshoroskop/loewe/2026-10-01/", "2026-10-01"), url("/en/privacy/", "2026-10-11"), url("/en/"));
  const files = splitSitemap(xml);
  const by = (f: string) => files.find((x: { file: string }) => x.file === f)!;
  it("makes one file per language and section, with dated pages apart", () => {
    expect(files.map((f: { file: string }) => f.file).sort()).toEqual(["sitemap-de-tageshoroskop-archive.xml", "sitemap-de-tageshoroskop.xml", "sitemap-en-horoscope-archive.xml", "sitemap-en-horoscope.xml", "sitemap-en-pages.xml"]);
    expect(by("sitemap-en-horoscope-archive.xml").urls).toBe(3);
  });
  it("loses no URL and keeps hreflang and lastmod", () => {
    expect(files.reduce((a: number, f: { urls: number }) => a + f.urls, 0)).toBe(10);
    const body = by("sitemap-en-horoscope-archive.xml").body;
    expect(body).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"');
    expect(body).toContain('hreflang="de"');
    expect(body).toContain("<lastmod>2026-10-02</lastmod>");
  });
  it("gives each file in the index the newest lastmod of its URLs", () => {
    const index = indexXml(files, "https://horoscop.si");
    expect(index).toContain("<sitemapindex");
    expect(index).toContain("<loc>https://horoscop.si/sitemap-en-horoscope-archive.xml</loc>\n<lastmod>2026-10-03</lastmod>");
  });
  it("keeps a sitemap file below the protocol limit", () => {
    const many = sitemap(...Array.from({ length: 40005 }, (_, i) => url(`/en/numerology/${i}/`)));
    const parts = splitSitemap(many);
    expect(parts.map((f: { urls: number }) => f.urls)).toEqual([40000, 5]);
  });
});

describe("export trim", () => {
  let dir = "";
  afterEach(() => { if (dir) rmSync(dir, { recursive: true, force: true }); });
  const page = (rel: string, flat: boolean) => {
    const p = path.join(dir, rel); mkdirSync(p, { recursive: true });
    for (const f of ["index.html", "index.txt", "__next._full.txt", "__next._tree.txt"]) writeFileSync(path.join(p, f), "x");
    if (flat) writeFileSync(path.join(p, "__next.$d$lang.__PAGE__.txt"), "x"); // what a Linux build writes
    else { mkdirSync(path.join(p, "__next.$d$lang"), { recursive: true }); writeFileSync(path.join(p, "__next.$d$lang", "__PAGE__.txt"), "x"); } // what a Windows build writes
    return p;
  };
  it("keeps every page's HTML, strips old dates and only the unused copy elsewhere", () => {
    dir = mkdtempSync(path.join(tmpdir(), "trim-"));
    const oldFlat = page("en/horoscope/leo/2026-10-01", true); const oldNested = page("de/tageshoroskop/loewe/2026-10-01", false);
    for (const l of ["en", "de"]) writeFileSync(path.join(dir, l, "index.html"), "x");
    const edge = page("en/horoscope/leo/2026-10-24", true); const recent = page("en/horoscope/leo/2026-10-30", true); const other = page("en/numerology/life-path/1", true); const month = page("en/moon-calendar/2026-10", true);
    const { full, old } = trimExport(dir, "2026-10-24");
    for (const p of [oldFlat, oldNested, edge, recent, other, month]) { expect(existsSync(path.join(p, "index.html"))).toBe(true); expect(existsSync(path.join(p, "__next._full.txt"))).toBe(false); }
    for (const p of [oldFlat, oldNested]) { for (const f of ["index.txt", "__next._tree.txt", "__next.$d$lang.__PAGE__.txt", "__next.$d$lang"]) expect(existsSync(path.join(p, f)), f).toBe(false); }
    for (const p of [edge, recent, other, month]) for (const f of ["index.txt", "__next._tree.txt", "__next.$d$lang.__PAGE__.txt"]) expect(existsSync(path.join(p, f)), f).toBe(true);
    expect(old.pages).toBe(2); expect(full.items).toBe(6);
  });
  it("drops the not-found copies and never the 404 page", () => {
    dir = mkdtempSync(path.join(tmpdir(), "trim-"));
    writeFileSync(path.join(dir, "404.html"), "x"); page("_not-found", false); page("404", false);
    dropNotFoundCopies(dir);
    expect(existsSync(path.join(dir, "404.html"))).toBe(true); expect(existsSync(path.join(dir, "_not-found"))).toBe(false); expect(existsSync(path.join(dir, "404"))).toBe(false);
  });
  it("counts days in Skopje and agrees with the page links", () => {
    expect(cutoffDate(new Date("2026-10-31T23:30:00Z"))).toBe("2026-10-25"); // already 1 November in Skopje
    const links = readFileSync("src/components/DayLink.tsx", "utf8");
    expect(links).toContain(`const ROUTER_DAYS = ${KEEP_DAYS};`);
  });
});

describe("IndexNow", () => {
  const entries = [
    { loc: "https://horoscop.si/en/horoscope/", lastmod: "2026-10-31" },
    { loc: "https://horoscop.si/en/horoscope/leo/2026-11-04/", lastmod: "2026-10-31" },
    { loc: "https://horoscop.si/en/horoscope/leo/2026-11-03/", lastmod: "2026-10-31" },
    { loc: "https://horoscop.si/en/numerology/", lastmod: "2026-10-20" },
  ];
  it("sends what this build changed and of the dated pages only the new day", () => {
    expect(changedUrls(entries, "2026-10-31", "2026-11-04")).toEqual(["https://horoscop.si/en/horoscope/", "https://horoscop.si/en/horoscope/leo/2026-11-04/"]);
  });
  it("publishes its key at the site root", () => {
    expect(readFileSync(`public/${KEY}.txt`, "utf8").trim()).toBe(KEY);
    expect(KEY).toMatch(/^[a-z0-9]{8,128}$/);
  });
  it("reads a sitemap and a sitemap index alike", () => {
    expect(parseSitemap("<sitemap><loc>a</loc><lastmod>b</lastmod></sitemap><url><loc>c</loc></url>")).toEqual([{ loc: "a", lastmod: "b" }, { loc: "c", lastmod: undefined }]);
  });
  it("only runs from the nightly workflow, never from the build", () => {
    const pkg = readFileSync("package.json", "utf8");
    expect(pkg).not.toContain("indexnow");
    expect(readFileSync(".github/workflows/nightly-rebuild.yml", "utf8")).toContain("node scripts/indexnow.mjs --send");
  });
});

describe("site headers", () => {
  const cfg = JSON.parse(readFileSync("vercel.json", "utf8")) as { routes: { src?: string; continue?: boolean; headers?: Record<string, string> }[] };
  it("sets the security headers on every response, before any redirect", () => {
    const all = cfg.routes[0];
    expect(all.src).toBe("/(.*)"); expect(all.continue).toBe(true);
    for (const h of ["Strict-Transport-Security", "X-Content-Type-Options", "Referrer-Policy", "Permissions-Policy", "Content-Security-Policy", "Content-Security-Policy-Report-Only"]) expect(all.headers, h).toHaveProperty(h);
  });
  it("gives build assets and fonts a long immutable cache", () => {
    const r = cfg.routes.find((x) => x.src === "/_next/static/(.*)");
    expect(r?.headers?.["Cache-Control"]).toContain("immutable"); expect(r?.continue).toBe(true);
  });
});

describe("robots", () => {
  const r = robots();
  it("points at the sitemap index and only keeps crawlers off router payloads", () => {
    expect(r.sitemap).toMatch(/\/sitemap\.xml$/);
    const rule = [r.rules].flat()[0]; expect(rule.allow).toBe("/");
    expect(rule.disallow).toEqual(["/*index.txt$", "/*__next."]);
  });
});

describe("structured data check", () => {
  const page = (ld: object, body = "") => `<html><head><script type="application/ld+json">${JSON.stringify(ld)}</script></head><body>${body}</body></html>`;
  const art = { "@context": "https://schema.org", "@type": "Article", headline: "x", image: ["https://horoscop.si/a.png"], datePublished: "2026-10-01T00:00:00+02:00", author: { "@type": "Organization", name: "H", url: "https://horoscop.si/" }, publisher: { "@id": "https://horoscop.si/#organization" }, inLanguage: "en" };
  const kinds = (html: string, lang = "en") => checkPage(html, lang).map(([k]: [string, string]) => k);
  it("accepts a clean page", () => expect(kinds(page(art))).toEqual([]));
  it("knows Skopje's offset on both sides of the clock change", () => {
    expect(dateProblem("2026-10-24T00:00:00+02:00")).toBeNull();
    expect(dateProblem("2026-10-26T00:00:00+01:00")).toBeNull();
    expect(dateProblem("2026-10-26T00:00:00+02:00")).toContain("+01:00");
    expect(dateProblem("2026-10-26T00:00:00")).toBe("no UTC offset");
    expect(dateProblem("2026-10-26")).toBeNull();
  });
  it("catches a wrong type, a wrong property and a missing field", () => {
    expect(kinds(page({ "@context": "https://schema.org", "@type": "Artikel" }))).toEqual(["type"]);
    expect(kinds(page({ ...art, rating: 5 }))).toEqual(["property"]);
    const { headline: _, ...noHeadline } = art;
    expect(kinds(page(noHeadline))).toEqual(["required"]);
  });
  it("catches an FAQ that is not on the page", () => {
    const faq = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [{ "@type": "Question", name: "Why?", acceptedAnswer: { "@type": "Answer", text: "Because." } }] };
    expect(kinds(page(faq, "<p>Why?</p>"))).toEqual([]);
    expect(kinds(page(faq, "<p>Nothing</p>"))).toEqual(["faq"]);
  });
  it("catches two organizations that disagree", () => {
    const a = { "@context": "https://schema.org", "@type": "Organization", "@id": "https://horoscop.si/#organization", name: "H", url: "https://horoscop.si/", logo: "https://horoscop.si/l.png" };
    expect(kinds(page([a, { ...art, author: { "@type": "Organization", name: "H", url: "https://horoscop.si" } }]))).toContain("organization");
  });
});
