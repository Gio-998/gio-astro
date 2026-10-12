import type { Metadata } from "next";
import { getContent } from "@/content";
import { localizedMeta } from "@/lib/seo";
import { PageHero } from "@/components/ui";
import { PartnersForm } from "@/components/pages/PartnersForm";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params; const c = getContent(lang); const P = c.partners;
  return { title: P.metaTitle, description: P.metaDescription, ...localizedMeta(lang, "/partners/", { title: `${P.metaTitle} · ${c.site.brand}`, description: P.metaDescription, siteName: c.site.brand }) };
}

/** Partner (affiliate) program: 30% via Lemon Squeezy. Demo stage: applications only, no payments. */
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params; const P = getContent(lang).partners;
  return (
    <article className="mx-auto max-w-3xl" data-testid="partners-page">
      <PageHero emblem="sun" img="orion" eyebrow={P.eyebrow} title={<span className="text-balance">{P.title}</span>} sub={P.lead} />
      <p className="mb-6 rounded-2xl border border-gold/30 bg-gold/[0.07] px-4 py-3 text-sm">{P.demo}</p>
      <h2 className="h-display mb-3 text-2xl text-balance sm:text-3xl"><span className="text-gold">✦</span> {P.stepsTitle}</h2>
      <ol className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">{P.steps.map((s) => <li key={s.title} className="card !p-3.5"><span aria-hidden className="text-2xl text-gold">{s.icon}</span><p className="mt-1 font-semibold">{s.title}</p><p className="text-sm text-mist/85">{s.text}</p></li>)}</ol>
      <h2 className="h-display mb-3 mt-10 text-2xl text-balance sm:text-3xl"><span className="text-gold">✦</span> {P.factsTitle}</h2>
      <dl className="grid gap-2">{P.facts.map(([k, v]) => <div key={k} className="card !py-3"><dt className="text-[11px] uppercase tracking-widest text-dim">{k}</dt><dd className="mt-0.5 text-sm">{v}</dd></div>)}</dl>
      <h2 className="h-display mb-3 mt-10 text-2xl text-balance sm:text-3xl"><span className="text-gold">✦</span> {P.rulesTitle}</h2>
      <ul className="grid gap-2">{P.rules.map((r) => <li key={r} className="card !py-3 text-sm">✓ {r}</li>)}</ul>
      <h2 id="apply" className="h-display mb-3 mt-10 scroll-mt-24 text-2xl text-balance sm:text-3xl"><span className="text-gold">✦</span> {P.formTitle}</h2>
      <PartnersForm />
    </article>
  );
}
