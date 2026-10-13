import Link from "next/link";
import { getContent } from "@/content";
import { localizedMeta } from "@/lib/seo";
import { postsFor } from "@/content/blog";
import { PageHero } from "@/components/ui";
import { formatDate } from "@/lib/dates";
import { LdJson, ORG_REF, abs } from "@/lib/schema";

export async function generateMetadata({ params }: PageProps<"/[lang]/blog">) {
  const { lang } = await params; const c = getContent(lang); const B = c.blog;
  return { title: B.metaTitle, description: B.meta, ...localizedMeta(lang, "/blog/", { title: `${B.metaTitle} · ${c.site.brand}`, description: B.meta, siteName: c.site.brand }) };
}
export default async function Page({ params }: PageProps<"/[lang]/blog">) {
  const { lang } = await params; const c = getContent(lang); const B = c.blog;
  return (
    <div>
      <LdJson data={{ "@context": "https://schema.org", "@type": "Blog", name: B.title, description: B.meta, url: abs(`/${lang}/blog/`), inLanguage: lang, publisher: ORG_REF, blogPost: postsFor(lang).map((p) => ({ "@type": "BlogPosting", headline: p.title, url: abs(`/${lang}/blog/${p.slug}/`), datePublished: p.date })) }} />
      <PageHero emblem="eye" img="pillars" title={B.title} sub={B.sub} />
      <div className="grid gap-4" data-testid="blog-index">
        {postsFor(lang).map((p) => (
          <Link key={p.slug} href={`/${lang}/blog/${p.slug}/`} className="card block transition hover:-translate-y-0.5">
            <p className="eyebrow mb-1">{formatDate(p.date, c.site.months)} · {B.read(p.minutes)}</p>
            <h2 className="h-display text-2xl leading-tight">{p.title}</h2>
            <p className="mt-1 text-sm text-dim">{p.description}</p>
            <span className="mt-2 inline-block text-sm text-gold">{B.more} →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
