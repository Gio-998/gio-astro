import type { Metadata } from "next";
import { InvitePage } from "@/components/pages/InvitePage";
import { getContent } from "@/content";
import { localizedMeta } from "@/lib/seo";

const COPY: Record<string, { title: string; description: string }> = {
  en: { title: "How do we match?", description: "A personal invite: compare your two charts." },
  mk: { title: "Колку се совпаѓаме?", description: "Лична покана: спореди ги вашите две карти." },
  de: { title: "Wie gut passen wir?", description: "Eine persönliche Einladung: Vergleicht eure beiden Horoskope." },
  sr: { title: "Koliko se slažemo?", description: "Lična pozivnica: uporedite svoje dve karte." },
};
/** The layout's title template adds the site name once; canonical and hreflang point at the invite page itself. Invites stay out of the index. */
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const m = COPY[lang] ?? COPY.en; const brand = getContent(lang).site.brand;
  return { title: m.title, description: m.description, ...localizedMeta(lang, "/invite/", { title: `${m.title} · ${brand}`, description: m.description, siteName: brand }), robots: { index: false, follow: true } };
}
export default function Page() { return <InvitePage />; }
