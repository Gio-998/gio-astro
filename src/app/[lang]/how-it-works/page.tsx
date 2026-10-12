import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/content";
import { localizedMeta } from "@/lib/seo";
import { PageHero } from "@/components/ui";
import type { SysMeta, SysEvidence } from "@/content/en/systems/meta";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params; const c = getContent(lang); const H = c.systems.how;
  return { title: H.metaTitle, description: H.metaDescription, ...localizedMeta(lang, "/how-it-works/", { title: `${H.metaTitle} · ${c.site.brand}`, description: H.metaDescription, siteName: c.site.brand }) };
}

const TONE: Record<SysEvidence, string> = { astronomy: "border-sky-300/40 text-sky-200", traditional: "border-gold/40 text-gold", modern: "border-rose/40 text-rose", research: "border-sage/40 text-sage", popular: "border-lilac/40 text-lilac" };
const ORDER = ["chiron", "nodes", "lilith", "sundegree", "solarreturn", "biorhythm", "nameday", "slavic", "ninestar", "iching", "mayan", "celtic", "norse", "egyptian", "kabbalah", "arabic", "numextra"];

/** Public methodology page: every lens with inputs, method, evidence and sources; cultural order rule; privacy. Server-rendered, no JS needed. */
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params; const c = getContent(lang); const H = c.systems.how; const E = c.systems.evidence;
  const href = (p: string) => `/${lang}${p}`;
  const lenses: [string, SysMeta][] = [...Object.entries(H.core), ...ORDER.map((k) => [k, c.systems.meta[k]] as [string, SysMeta])];
  const Lens = ({ id, m }: { id: string; m: SysMeta }) => (
    <details id={id} className="card scroll-mt-24 !p-0 open:border-gold/30">
      <summary className="flex min-h-[56px] cursor-pointer list-none items-center gap-3 px-4 py-3">
        <span className={`chip shrink-0 ${TONE[m.evidence]}`} title={E[m.evidence].label}>{E[m.evidence].icon}</span>
        <span className="flex-1 font-semibold">{m.name}</span><span aria-hidden className="text-dim">⌄</span>
      </summary>
      <div className="space-y-2 border-t border-white/10 px-4 py-3 text-sm">
        <p>{m.what}</p>
        <p><b>{H.inputs}:</b> {m.inputs}</p>
        <p><b>{H.calc}:</b> {m.method}</p>
        <p><b>{H.evidence}:</b> {E[m.evidence].icon} {E[m.evidence].label}. {E[m.evidence].text}</p>
        <div><b>{H.sources}:</b><ul className="mt-1 list-disc pl-5 text-dim">{m.sources.map((s) => <li key={s}>{s}</li>)}</ul></div>
      </div>
    </details>
  );
  return (
    <article className="mx-auto max-w-3xl">
      <PageHero emblem="chart" img="orion" eyebrow={H.eyebrow} title={<>{H.title}</>} sub={H.lead} />
      <nav className="mb-6 flex snap-x gap-2 overflow-x-auto pb-1 text-sm" aria-label={H.title}>
        {[["principles", H.principlesTitle], ["voice", H.voiceTitle], ["culture", H.cultureTitle], ["labels", H.evidenceTitle], ["lenses", H.lensesTitle], ["privacy", H.privacyTitle]].map(([id, t]) => <a key={id} href={`#${id}`} className="chip shrink-0 snap-start whitespace-nowrap text-mist hover:border-gold/60 hover:text-gold">{t}</a>)}
      </nav>

      <section id="principles" className="scroll-mt-24">
        <h2 className="h-display mb-3 text-3xl"><span className="text-gold">✦</span> {H.principlesTitle}</h2>
        <div className="grid gap-3 sm:grid-cols-2">{H.principles.map((p) => <div key={p.title} className="card"><p className="mb-1 text-lg"><span aria-hidden className="mr-2">{p.icon}</span><b>{p.title}</b></p><p className="text-sm text-mist/90">{p.text}</p></div>)}</div>
      </section>

      <section id="voice" className="mt-10 scroll-mt-24">
        <h2 className="h-display mb-3 text-3xl"><span className="text-gold">✦</span> {H.voiceTitle}</h2>
        <p className="mb-3">{H.voiceText}</p>
        <ul className="grid gap-2">{H.voiceRules.map((r) => <li key={r} className="card !py-3 text-sm">✓ {r}</li>)}</ul>
      </section>

      <section id="culture" className="mt-10 scroll-mt-24">
        <h2 className="h-display mb-3 text-3xl"><span className="text-gold">✦</span> {H.cultureTitle}</h2>
        <p className="mb-3">{H.cultureText}</p>
        <ol className="card mb-2 list-decimal space-y-1 pl-8 text-sm">{H.cultureRule.map((r) => <li key={r}>{r}</li>)}</ol>
        <p className="text-xs text-dim">🔒 {H.cultureData}</p>
      </section>

      <section id="labels" className="mt-10 scroll-mt-24">
        <h2 className="h-display mb-3 text-3xl"><span className="text-gold">✦</span> {H.evidenceTitle}</h2>
        <div className="grid gap-2">{(Object.keys(E) as SysEvidence[]).map((k) => <div key={k} className="card flex items-start gap-3 !py-3"><span className={`chip shrink-0 ${TONE[k]}`}>{E[k].icon} {E[k].label}</span><p className="text-sm text-mist/90">{E[k].text}</p></div>)}</div>
      </section>

      <section id="lenses" className="mt-10 scroll-mt-24">
        <h2 className="h-display mb-3 text-3xl"><span className="text-gold">✦</span> {H.lensesTitle}</h2>
        <div className="grid gap-2">{lenses.map(([id, m]) => <Lens key={id} id={id} m={m} />)}</div>
      </section>

      <section id="privacy" className="mt-10 scroll-mt-24">
        <h2 className="h-display mb-3 text-3xl"><span className="text-gold">✦</span> {H.privacyTitle}</h2>
        <ul className="grid gap-2">{H.privacy.map((p) => <li key={p} className="card !py-3 text-sm">🔒 {p}</li>)}</ul>
        <p className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm"><Link className="text-gold underline" href={href("/privacy/")}>{H.privacyLink} →</Link><Link className="text-gold underline" href={href("/learn/")}>{H.learnLink} →</Link><Link className="text-gold underline" href={href("/promise/")}>{c.site.footer.promise} →</Link></p>
        <p className="mt-6 text-xs text-dim">{H.updated}</p>
      </section>
    </article>
  );
}
