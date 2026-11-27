/** JSON-LD of a page model (breadcrumb, FAQ, Article / WebPage with real dates, list, tool). Pure data, so tests can parse it without rendering. */
import { getContent } from "@/content";
import { numContent } from "@/content/numerology";
import { CONTENT_DATES, SITE_LAUNCH } from "@/lib/content-dates";
import { localizedPath } from "@/lib/i18n-routes";
import { abs, breadcrumb, faqPage, ORG_REF } from "@/lib/schema";
import { SITE_URL } from "@/lib/site-url";
import type { NumModel } from "@/lib/numerology";

/** Words on a page, for Article.wordCount. */
export const modelWords = (m: NumModel) => [m.lead, m.answer?.text ?? "", ...m.blocks.flatMap((b) => [...(b.paras ?? []), ...(b.list ?? []), b.quote ?? ""]), ...m.faq.flat()].join(" ").split(/\s+/).filter(Boolean).length;

export function numLd(lang: string, m: NumModel, words = modelWords(m)): object[] {
  const U = numContent(lang).ui; const c = getContent(lang);
  const url = abs(localizedPath(lang, m.path));
  const published = m.published ?? SITE_LAUNCH; const modified = m.modified ?? CONTENT_DATES.numerology;
  const ld: object[] = [breadcrumb(m.crumbs)];
  if (m.faq.length) ld.push(faqPage(m.faq));
  if (m.kind === "article") ld.push({ "@context": "https://schema.org", "@type": "Article", headline: m.title, description: m.description, url, mainEntityOfPage: url, inLanguage: lang, wordCount: words, articleSection: m.sectionName ?? U.section, datePublished: published, dateModified: modified, author: { "@type": "Organization", "@id": ORG_REF["@id"], name: c.site.brand, url: `${SITE_URL}/` }, publisher: ORG_REF, image: [`${SITE_URL}/og/default/${lang}.jpg`], isPartOf: { "@id": `${SITE_URL}/#website` } });
  else ld.push({ "@context": "https://schema.org", "@type": "WebPage", name: m.title, description: m.description, url, inLanguage: lang, datePublished: published, dateModified: modified, isPartOf: { "@id": `${SITE_URL}/#website` }, publisher: ORG_REF });
  if (m.kind === "hub" && m.items) ld.push({ "@context": "https://schema.org", "@type": "ItemList", name: m.title, itemListElement: m.items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.label, url: abs(it.href) })) });
  if (m.kind === "calc") ld.push({ "@context": "https://schema.org", "@type": "WebApplication", name: m.title, url, applicationCategory: "LifestyleApplication", operatingSystem: "Any", inLanguage: lang, offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" } });
  return ld;
}
