import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent } from "@/content";
import { numContent } from "@/content/numerology";
import { numModel, numPaths, type NumModel, type LinkItem, type BlockTable, type TableCell } from "@/lib/numerology";
import { localizedPath, parsePath, routeAlternates, sectionSlug } from "@/lib/i18n-routes";
import { LOCALE_META } from "@/lib/seo";
import { SITE_URL } from "@/lib/site-url";
import { breadcrumb, faqPage, LdJson, abs, ORG_REF } from "@/lib/schema";
import { Calculator, type CalcLabels } from "./Calculator";
import { DuoCalc, NameReport } from "./Personal";
import { SectionWidget } from "@/components/sections/Widget";
import { CONTENT_DATES, SITE_LAUNCH } from "@/lib/content-dates";
import { moonPath } from "@/components/horoscope/art";

/** Static params for one locale's slug folder (other locales get the "_" placeholder that renders a 404). */
export function numParams(lang: string, owner: string) {
  if (lang !== owner) return [{ slug: ["_"] }];
  return numPaths().filter((p) => p !== "/numerology/").map((p) => ({ slug: localizedPath(lang, p).split("/").filter(Boolean).slice(2) }));
}
const internal = (lang: string, slug: string[] = []) => parsePath(`/${lang}/${sectionSlug(lang, "numerology")}/${slug.map(decodeURIComponent).join("/")}${slug.length ? "/" : ""}`)?.[1] ?? "";

export async function numMeta(lang: string, slug?: string[]): Promise<Metadata> {
  const m = numModel(lang, internal(lang, slug));
  return m ? modelMeta(lang, m) : {};
}
export function modelMeta(lang: string, m: NumModel): Metadata {
  const brand = getContent(lang).site.brand; const canonical = localizedPath(lang, m.path); const og = LOCALE_META[lang as "en"]?.og ?? "en_US";
  const img = `${SITE_URL}/og/default/${lang}.jpg`;
  return { title: { absolute: `${m.title} · ${brand}` }, description: m.description, robots: { index: true, follow: true },
    alternates: { canonical, languages: routeAlternates(m.path) },
    openGraph: { type: m.kind === "article" ? "article" : "website", siteName: brand, title: m.title, description: m.description, url: abs(canonical), locale: og, images: [{ url: img, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title: m.title, description: m.description, images: [img] } };
}

const label = "text-[11px]! leading-tight! font-sans font-semibold uppercase tracking-[.16em] text-gold";
const block = "rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3.5 lg:rounded-none lg:border-0 lg:border-t lg:border-gold/15 lg:bg-transparent lg:px-0 lg:pb-0 lg:pt-9";
const h2 = `${label} mb-1.5 lg:mb-3 lg:h-display lg:text-[2rem]! lg:font-medium lg:normal-case lg:tracking-normal lg:text-mist text-balance`;
const p1 = "text-pretty break-words hyphens-auto text-[15px] leading-snug text-mist lg:text-[18px] lg:leading-[1.7] lg:text-mist/90";
const p2 = "mt-2 text-pretty break-words hyphens-auto text-[15px] leading-snug text-mist/80 lg:mt-3 lg:text-[18px] lg:leading-[1.7]";
const pill = "inline-flex h-9 max-w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-white/12 bg-white/[0.05] px-3.5 text-[13px] text-mist/90 hover:border-gold/45";
/** Glue the last two words so a title never ends on a single orphan word. */
const noOrphan = (t: string) => t.replace(/ (\S+)$/, "\u00A0$1");

function Items({ items, cols = "sm:grid-cols-2 lg:grid-cols-3" }: { items: LinkItem[]; cols?: string }) {
  return (
    <ul className={`grid grid-cols-1 gap-x-8 ${cols}`}>
      {items.map((it) => (
        <li key={it.href} className="border-t border-white/10">
          <Link href={it.href} className="group flex items-center gap-3 py-3.5 pr-1">
            {it.big && <span aria-hidden className="h-display w-[3.6rem] shrink-0 text-center text-[1.45rem] leading-none text-gold">{it.big}</span>}
            <span className="min-w-0 flex-1"><span className="block break-words text-[15px] font-medium transition group-hover:text-gold">{it.big ? `${it.label}` : it.label}</span>{it.sub && <span className="mt-0.5 block text-pretty break-words text-[12.5px] leading-snug text-mist/65">{it.sub}</span>}</span>
            <span aria-hidden className="text-mist/40 transition group-hover:translate-x-0.5 group-hover:text-gold">→</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function Cell({ c }: { c: TableCell }) {
  if (typeof c === "string") return c;
  const disc = c.moon !== undefined && <svg viewBox="0 0 32 32" className="mr-1.5 inline-block h-[18px] w-[18px] align-[-4px]" aria-hidden><circle cx="16" cy="16" r="14" fill="#1b1640" stroke="#e9c78a" strokeOpacity=".5" /><path d={moonPath(c.moon, 16, 16, 12)} fill="#f6ecd2" /></svg>;
  return c.href ? <Link href={c.href} className="text-gold underline decoration-gold/30 underline-offset-2 hover:decoration-gold">{disc}{c.text}</Link> : <>{disc}{c.text}</>;
}
function DataTable({ t }: { t: BlockTable }) {
  const td = "py-2 pr-3 align-top last:pr-0";
  return (
    <div className="mt-2 overflow-x-auto lg:mt-4">
      <table className="w-full border-collapse text-left text-[13.5px] leading-snug text-mist/85 lg:text-[16px]">
        {t.caption && <caption className="caption-bottom pt-2 text-left text-[12.5px] leading-snug text-mist/55 lg:text-[13.5px]">{t.caption}</caption>}
        <thead><tr className="border-b border-gold/25">{t.head.map((h) => <th key={h} scope="col" className={`${label} py-1.5 pr-3 last:pr-0`}>{h}</th>)}</tr></thead>
        <tbody>{t.rows.map((r, i) => <tr key={i} className="border-b border-white/10">{r.map((c, k) => k ? <td key={k} className={td}><Cell c={c} /></td> : <th key={k} scope="row" className={`${td} font-medium text-mist`}><Cell c={c} /></th>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

export function NumPage({ lang, slug }: { lang: string; slug?: string[] }) {
  const m = numModel(lang, internal(lang, slug)); if (!m) notFound();
  return <NumView lang={lang} m={m} />;
}

export function NumView({ lang, m }: { lang: string; m: NumModel }) {
  const C = numContent(lang); const U = C.ui; const c = getContent(lang);
  const url = abs(localizedPath(lang, m.path));
  const { personalYear: py, ...rest } = U.calc; const L: CalcLabels = { ...rest, personalYearTpl: py(0).replace("0", "{y}") };
  const names = Object.fromEntries(Object.entries(C.chars).map(([k, v]) => [k, v.name]));
  const pages = numPaths();
  const words = [m.lead, ...m.blocks.flatMap((b) => [...(b.paras ?? []), ...(b.list ?? []), b.quote ?? ""]), ...m.faq.flat()].join(" ").split(/\s+/).filter(Boolean).length;
  const ld: object[] = [breadcrumb(m.crumbs)];
  if (m.faq.length) ld.push(faqPage(m.faq));
  if (m.kind === "article") ld.push({ "@context": "https://schema.org", "@type": "Article", headline: m.title, description: m.description, url, mainEntityOfPage: url, inLanguage: lang, wordCount: words, articleSection: m.sectionName ?? U.section, datePublished: m.published ?? SITE_LAUNCH, dateModified: m.modified ?? CONTENT_DATES.numerology, author: { "@type": "Organization", "@id": ORG_REF["@id"], name: c.site.brand, url: `${SITE_URL}/` }, publisher: ORG_REF, image: [`${SITE_URL}/og/default/${lang}.jpg`], isPartOf: { "@id": `${SITE_URL}/#website` } });
  if (m.kind === "hub" && m.items) ld.push({ "@context": "https://schema.org", "@type": "ItemList", name: m.title, itemListElement: m.items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.label, url: abs(it.href) })) });
  if (m.kind === "calc") ld.push({ "@context": "https://schema.org", "@type": "WebApplication", name: m.title, url, applicationCategory: "LifestyleApplication", operatingSystem: "Any", inLanguage: lang, offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" } });

  const plain = <T extends object>(o: T) => Object.fromEntries(Object.entries(o).filter(([, v]) => typeof v !== "function")) as T;
  const P = { ...C.p3, duo: plain(C.p3.duo), report: plain(C.p3.report) }; const nums = c.nums;
  const duo = <DuoCalc L={{ ...P.duo, go: U.calc.go, read: U.lifePathShort(0).replace(/\s*0$/, ""), cycleTpl: C.p3.duo.cycleLine(1111, 2222, 3333).replace("1111", "{y}").replace("2222", "{a}").replace("3333", "{b}") }} names={names}
    kinds={nums.numberPairKinds as Record<string, string>} deepKinds={c.deep.lifePathPair as Record<string, string>} lpHref={Object.fromEntries(Object.keys(C.chars).filter((k) => pages.includes(`/numerology/life-path/${k}/`)).map((k) => [k, localizedPath(lang, `/numerology/life-path/${k}/`)]))} />;
  const report = m.path === "/numerology/calculator/name/" && <NameReport L={{ ...P.report, name: U.calc.name, namePh: U.calc.namePh, go: U.calc.go, sameTpl: C.p3.report.same(0).replace("0", "{a}"), mixTpl: C.p3.report.mix(1111, 2222).replace("1111", "{a}").replace("2222", "{b}") }} chars={C.chars} karmic={C.karmic}
    lines={{ expression: Object.fromEntries(Object.entries(nums.numbers).map(([k, v]) => [k, v.expression])), soul: Object.fromEntries(Object.entries(nums.numbers).map(([k, v]) => [k, v.soul])) }} />;
  const calcBox = m.calc && (
    <section aria-labelledby="calc-h">
      <h2 id="calc-h" className={`${label} mb-2`}>{m.kind === "calc" ? m.h1 : U.calcCta}</h2>
      {m.kind !== "calc" && <p className="mb-2 text-[13px] text-mist/65">{U.calcCtaSub}</p>}
      {m.calc === "compatibility" ? duo : <Calculator lang={lang} mode={m.calc} L={L} names={names} pages={pages} />}
    </section>
  );
  return (
    <article className="mx-auto max-w-xl space-y-3 lg:relative lg:left-1/2 lg:w-[min(1120px,calc(100vw-4rem))] lg:max-w-none lg:-translate-x-1/2 lg:space-y-0" data-testid="num-page">
      <LdJson data={ld} />
      <nav aria-label="breadcrumb" className="hidden text-[12.5px] text-mist/55 lg:mb-4 lg:block">
        <ol className="flex flex-wrap items-center gap-1.5">{m.crumbs.map(([n, p], i) => <li key={p} className="flex items-center gap-1.5">{i > 0 && <span aria-hidden>›</span>}{i < m.crumbs.length - 1 ? <Link className="hover:text-gold" href={p}>{n}</Link> : <span aria-current="page" className="text-mist/80">{n}</span>}</li>)}</ol>
      </nav>
      <header className="relative overflow-hidden rounded-[28px] border border-gold/20 bg-[radial-gradient(120%_90%_at_80%_0%,rgba(139,108,240,.45),transparent_60%),linear-gradient(170deg,#1d1748,#0e0b26)] px-5 pb-5 pt-5 shadow-[0_30px_80px_-40px_rgba(139,108,240,.9)] lg:rounded-[36px] lg:px-14 lg:py-14">
        {m.big && <span aria-hidden className="pointer-events-none absolute -right-2 -top-3 select-none font-display text-[6.5rem] leading-none text-gold/15 sm:text-[8rem] lg:right-12 lg:top-1/2 lg:-translate-y-1/2 lg:text-[15rem] lg:text-gold/25">{m.big}</span>}
        <div className="relative lg:max-w-[640px]">
          <p className="eyebrow mb-2 text-[11px] tracking-[.14em] lg:mb-4 lg:text-[13px]">{m.eyebrow}</p>
          <h1 className={`h-display text-balance break-words pr-2 ${Math.max(...m.h1.split(" ").map((w) => w.length)) > 11 ? "text-[1.5rem]" : "text-[1.9rem]"} font-medium leading-[1.08] lg:text-[3.2rem]!`}>{noOrphan(m.h1)}</h1>
          <p className="h-display mt-3 text-pretty text-[1.25rem] italic leading-snug text-gold/95 lg:mt-6 lg:text-[2rem] lg:leading-[1.25]">{m.lead}</p>
        </div>
      </header>

      {m.widget && <div className="lg:mt-10"><SectionWidget kind={m.widget} lang={lang} /></div>}
      {m.kind === "calc" && calcBox && <div className="lg:mt-10">{calcBox}</div>}
      {report && <div className="lg:mt-4">{report}</div>}

      <div className="space-y-3 lg:mt-14 lg:grid lg:grid-cols-[minmax(0,680px)_300px] lg:justify-between lg:gap-16 lg:space-y-0">
        <div className="space-y-3 lg:space-y-9">
          {m.items && <section className={`${block} lg:border-t-0 lg:pt-0`} aria-label={m.h1}><Items items={m.items} cols={m.items.length > 8 ? "sm:grid-cols-2" : "sm:grid-cols-1"} /></section>}
          {m.blocks.map((b, i) => b.quote
            ? <figure key={b.id} className="rounded-2xl border border-gold/25 bg-gold/[0.06] px-4 py-4 lg:my-2 lg:rounded-none lg:border-0 lg:border-l-2 lg:border-gold/70 lg:bg-transparent lg:py-1 lg:pl-8"><figcaption className={label}>{b.title}</figcaption><blockquote className="h-display mt-2 text-pretty text-[1.3rem] italic leading-snug text-gold/95 lg:text-[2rem] lg:leading-[1.25]">{b.quote}</blockquote></figure>
            : <section key={b.id} id={b.id} className={`${block} ${i === 0 && !m.items ? "lg:border-t-0 lg:pt-0" : ""}`}>
                <h2 className={h2}>{noOrphan(b.title)}</h2>
                {b.paras?.map((p, k) => <p key={k} className={k ? p2 : p1}>{p}</p>)}
                {b.list && <ul className="mt-1 space-y-1.5 lg:space-y-3">{b.list.map((q) => <li key={q} className="flex gap-2.5 text-pretty text-[15px] leading-snug text-mist/85 lg:text-[18px] lg:leading-[1.6]"><span aria-hidden className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-gold/80 lg:mt-[12px]" />{q}</li>)}</ul>}
                {b.table && <DataTable t={b.table} />}
              </section>)}
          {m.faq.length > 0 && (
            <section className={block} aria-labelledby="faq-h">
              <h2 id="faq-h" className={h2}>{U.sec.faq}</h2>
              <div className="divide-y divide-white/10">{m.faq.map(([q, a]) => <details key={q} className="group py-2.5 lg:py-4"><summary className="flex cursor-pointer list-none items-start justify-between gap-3 text-pretty text-[15px] font-medium lg:text-[18px]"><span className="min-w-0">{q}</span><span aria-hidden className="text-gold transition group-open:rotate-45">+</span></summary><p className="mt-2 text-pretty text-[14.5px] leading-snug text-mist/80 lg:text-[17px] lg:leading-[1.65]">{a}</p></details>)}</div>
            </section>
          )}
        </div>
        <aside className="space-y-3 lg:sticky lg:top-24 lg:self-start lg:space-y-7">
          {m.kind !== "calc" && calcBox}
          {(m.prev || m.next) && <nav className="flex items-center justify-between gap-2" aria-label={U.sec.related}>{m.prev && <Link className={pill} href={m.prev.href} rel="prev">← {m.prev.label}</Link>}{m.next && <Link className={pill} href={m.next.href} rel="next">{m.next.label} →</Link>}</nav>}
          {m.related && m.related.length > 0 && <nav aria-labelledby="rel-h"><h2 id="rel-h" className={`${label} mb-1`}>{m.kind === "article" ? U.sec.related : U.sec.explore}</h2><Items items={m.related} cols="" /></nav>}
        </aside>
      </div>
    </article>
  );
}
