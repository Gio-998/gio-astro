import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent, LOCALES } from "@/content";
import { localizedMeta } from "@/lib/seo";
import { SIGNS, SIGN_GLYPH, type Sign } from "@/engine/zodiac";
import { PageHero } from "@/components/ui";
import { SignDaily } from "@/components/day/SignDaily";
import { SITE_URL } from "@/lib/site-url";
import { horoPath } from "@/lib/horoscope";
import { breadcrumb, ORG_REF } from "@/lib/schema";

export const dynamicParams = false;
export function generateStaticParams() { return LOCALES.flatMap((lang) => SIGNS.map((sign) => ({ lang, sign }))); }
const buildIso = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };

export async function generateMetadata({ params }: PageProps<"/[lang]/daily/[sign]">) {
  const { lang, sign } = await params; const c = getContent(lang);
  if (!(SIGNS as readonly string[]).includes(sign)) return {};
  const name = c.astro.signs[sign as Sign].name; const title = c.day.pub.signTitle(name); const description = c.day.pub.signMeta(name);
  return { title, description, ...localizedMeta(lang, `/daily/${sign}/`, { title: `${title} · ${c.site.brand}`, description, siteName: c.site.brand }) };
}

export default async function Page({ params }: PageProps<"/[lang]/daily/[sign]">) {
  const { lang, sign } = await params;
  if (!(SIGNS as readonly string[]).includes(sign)) notFound();
  const c = getContent(lang); const s = sign as Sign; const S = c.astro.signs[s]; const P = c.day.pub;
  const ld = { "@context": "https://schema.org", "@type": "WebPage", name: P.signTitle(S.name), description: P.signMeta(S.name), inLanguage: lang, url: `${SITE_URL}/${lang}/daily/${s}/`, isPartOf: { "@id": `${SITE_URL}/#website` }, publisher: ORG_REF };
  const crumbs = breadcrumb([[c.site.brand, `/${lang}/`], [P.hubTitle, `/${lang}/daily/`], [P.signTitle(S.name), `/${lang}/daily/${s}/`]]);
  return (
    <div className="space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([ld, crumbs]) }} />
      <PageHero eyebrow={`${SIGN_GLYPH[s]} ${S.name}`} emblem="sun" img="milkyway" title={P.signTitle(S.name)} sub={S.essence} />
      <SignDaily sign={s} buildIso={buildIso()} />
      <p className="text-sm"><Link className="text-gold underline-offset-4 hover:underline" href={horoPath(lang, s)}>{P.horoLink(S.name)} →</Link></p>
      <section className="card">
        <h2 className="h-display mb-2 text-2xl">{P.about(S.name)}</h2>
        <p className="text-sm leading-relaxed">{S.sun}</p>
        <p className="mt-2 text-sm text-dim">{S.gifts}</p>
      </section>
      <nav aria-label={P.other}>
        <p className="eyebrow mb-2">{P.other}</p>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
          {SIGNS.filter((x) => x !== s).map((x) => <Link key={x} href={`/${lang}/daily/${x}/`} className="flex min-h-11 flex-col items-center justify-center rounded-xl border border-white/12 bg-white/[0.04] px-1 py-2 text-center text-xs hover:border-gold/40"><span className="text-lg text-gold">{SIGN_GLYPH[x]}</span>{c.astro.signs[x].name}</Link>)}
        </div>
      </nav>
    </div>
  );
}
