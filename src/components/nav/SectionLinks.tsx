import Link from "next/link";
import { localizedPath } from "@/lib/i18n-routes";
import { navFor, siteLinks } from "@/lib/site-links";

/** Server-rendered links to every public reading section, for the home page, hubs and the methodology page. `skip` drops the page it sits on. */
export function SectionLinks({ lang, skip, className = "" }: { lang: string; skip?: string; className?: string }) {
  return (
    <section className={className} aria-labelledby="site-sections" data-testid="section-links">
      <h2 id="site-sections" className="h-display mb-3 text-[1.7rem]! leading-tight! sm:text-[2.2rem]!">{navFor(lang).groups.astrology.linksTitle}</h2>
      <ul className="grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
        {siteLinks(lang).filter((l) => l.href !== skip).map((l) => (
          <li key={l.href} className="border-t border-white/10">
            <Link href={localizedPath(lang, l.href)} className="group flex items-center gap-3 py-3 pr-1">
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-medium transition group-hover:text-gold">{l.title}</span>
                <span className="mt-0.5 block text-pretty text-[12.5px] leading-snug text-mist/65">{l.desc}</span>
              </span>
              <span aria-hidden className="text-mist/40 transition group-hover:translate-x-0.5 group-hover:text-gold">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
