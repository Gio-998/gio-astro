import Link from "next/link";
import { getContent } from "@/content";
import { localizedMeta } from "@/lib/seo";
import { SIGNS, SIGN_GLYPH } from "@/engine/zodiac";
import { PageHero } from "@/components/ui";
import { SignArt } from "@/components/art/SignArt";

export async function generateMetadata({ params }: PageProps<"/[lang]/daily">) {
  const { lang } = await params; const c = getContent(lang); const P = c.day.pub;
  return { title: P.hubTitle, description: P.hubMeta, ...localizedMeta(lang, "/daily/", { title: `${P.hubTitle} · ${c.site.brand}`, description: P.hubMeta, siteName: c.site.brand }) };
}
export default async function Page({ params }: PageProps<"/[lang]/daily">) {
  const { lang } = await params; const c = getContent(lang); const P = c.day.pub;
  return (
    <div>
      <PageHero emblem="moon" img="milkyway" title={P.hubTitle} sub={P.hubSub} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3" data-testid="daily-hub">
        {SIGNS.map((s) => (
          <Link key={s} href={`/${lang}/daily/${s}/`} className="card flex flex-col items-center text-center transition hover:-translate-y-0.5">
            <SignArt sign={s} className="h-16 w-16" />
            <p className="h-display mt-1 text-xl">{SIGN_GLYPH[s]} {c.astro.signs[s].name}</p>
            <p className="text-xs text-dim">{c.astro.signs[s].essence}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
