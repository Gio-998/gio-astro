import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getContent, LOCALES } from "@/content";
import { localizedMeta } from "@/lib/seo";
import { PLAY_GAMES, type PlayGameId } from "@/engine/play";
import { playFor } from "@/components/play/content";
import { PlayGamePage } from "@/components/play/PlayGamePage";

export const dynamicParams = false;
export function generateStaticParams() { return LOCALES.flatMap((lang) => PLAY_GAMES.map((game) => ({ lang, game }))); }
export async function generateMetadata({ params }: { params: Promise<{ lang: string; game: string }> }) {
  const { lang, game } = await params; const c = getContent(lang); const P = playFor(lang); const G = P.games[game as PlayGameId];
  if (!G) return {};
  const title = `${G.name} · ${P.meta.title}`;
  return { title, description: G.tagline, ...localizedMeta(lang, `/play/${game}/`, { title: `${title} · ${c.site.brand}`, description: G.tagline, siteName: c.site.brand }) };
}
export default async function Page({ params }: { params: Promise<{ lang: string; game: string }> }) {
  const { game } = await params;
  if (!(PLAY_GAMES as readonly string[]).includes(game)) notFound();
  return <Suspense><PlayGamePage game={game as PlayGameId} /></Suspense>;
}
