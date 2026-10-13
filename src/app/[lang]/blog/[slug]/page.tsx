import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent, LOCALES } from "@/content";
import { localizedMeta } from "@/lib/seo";
import { BLOG_SLUGS, postFor } from "@/content/blog";
import { formatDate } from "@/lib/dates";
import { SITE_URL } from "@/lib/site-url";

export const dynamicParams = false;
export function generateStaticParams() { return LOCALES.flatMap((lang) => BLOG_SLUGS.map((slug) => ({ lang, slug }))); }
export async function generateMetadata({ params }: PageProps<"/[lang]/blog/[slug]">) {
  const { lang, slug } = await params; const c = getContent(lang); const p = postFor(lang, slug);
  if (!p) return {};
  const m = localizedMeta(lang, `/blog/${slug}/`, { title: p.title, description: p.description, siteName: c.site.brand });
  return { title: p.title, description: p.description, ...m, openGraph: { ...m.openGraph, type: "article", publishedTime: p.date, modifiedTime: p.updated ?? p.date, tags: p.tags } };
}
export default async function Page({ params }: PageProps<"/[lang]/blog/[slug]">) {
  const { lang, slug } = await params; const c = getContent(lang); const p = postFor(lang, slug); const B = c.blog;
  if (!p) notFound();
  const ld = { "@context": "https://schema.org", "@type": "Article", headline: p.title, description: p.description, datePublished: p.date, dateModified: p.updated ?? p.date, inLanguage: lang, keywords: p.tags.join(", "), mainEntityOfPage: `${SITE_URL}/${lang}/blog/${slug}/`, author: { "@type": "Organization", name: c.site.brand }, publisher: { "@type": "Organization", name: c.site.brand } };
  return (
    <article className="prose-soft mx-auto max-w-2xl" data-testid="blog-post">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <p className="text-sm"><Link className="text-dim underline" href={`/${lang}/blog/`}>← {B.back}</Link></p>
      <p className="eyebrow mt-6">{B.published} {formatDate(p.date, c.site.months)} · {B.read(p.minutes)}</p>
      <h1 className="h-display mb-4 text-4xl leading-tight sm:text-5xl">{p.title}</h1>
      <p className="text-lg leading-relaxed text-mist/90">{p.lead}</p>
      {p.blocks.map((b, i) => {
        if (b.t === "h") return <h2 key={i}>{b.text}</h2>;
        if (b.t === "p") return <p key={i}>{b.text}</p>;
        if (b.t === "ul") return <ul key={i}>{b.items.map((x, j) => <li key={j}>{x}</li>)}</ul>;
        if (b.t === "quote") return <blockquote key={i} className="h-display my-6 border-l-2 border-gold/60 pl-4 text-2xl italic">{b.text}</blockquote>;
        return <p key={i} className="not-prose my-6"><Link className="btn-primary" href={`/${lang}${b.href}`}>{b.text} →</Link></p>;
      })}
    </article>
  );
}
