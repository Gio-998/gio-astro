/** Small JSON-LD builders shared by page templates. The Organization/WebSite nodes live in the [lang] layout (@id refs below). */
import { SITE_URL } from "./site-url";

export const ORG_REF = { "@id": `${SITE_URL}/#organization` };
/** The same Organization as the layout's node, for fields where Google wants a name on the spot (author). */
export const orgAuthor = (name: string) => ({ "@type": "Organization", ...ORG_REF, name, url: `${SITE_URL}/` });
export const CONTACT_EMAIL = "contact@horoscop.si";
export const abs = (p: string) => (p.startsWith("http") ? p : `${SITE_URL}${p}`);
/** BreadcrumbList from [name, path] pairs (first = home). */
export function breadcrumb(items: [string, string][]) {
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: abs(path) })) };
}
export function faqPage(items: [string, string][]) {
  return { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: items.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) };
}
/** Renders one or more JSON-LD objects. */
export function LdJson({ data }: { data: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
