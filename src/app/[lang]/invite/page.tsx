import type { Metadata } from "next";
import { InvitePage } from "@/components/pages/InvitePage";
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (lang === "de") return { title: "Wie gut passen wir? · Horoscop", description: "Eine persönliche Einladung: Vergleicht eure beiden Horoskope.", robots: { index: false } };
  return lang === "mk"
    ? { title: "Колку се совпаѓаме? · Horoscop", description: "Лична покана: спореди ги вашите две карти.", robots: { index: false } }
    : { title: "How do we match? · Horoscop", description: "A personal invite: compare your two charts.", robots: { index: false } };
}
export default function Page() { return <InvitePage />; }
