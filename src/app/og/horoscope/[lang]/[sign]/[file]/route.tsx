import { SIGNS, type Sign } from "@/engine/zodiac";
import { HORO_LOCALES, ogUniqueDays } from "@/lib/horoscope";
import { horoscopeImage } from "@/og/horoscope-image";

export const dynamic = "force-static";
export const dynamicParams = false;
export function generateStaticParams() {
  // Generated cards (wide + story) only for today and tomorrow; older and later dates use the lean per-sign JPEG (lib/horoscope ogImage).
  const days = [...ogUniqueDays()];
  return HORO_LOCALES.flatMap((lang) => SIGNS.flatMap((sign) => days.flatMap((d) => (["wide", "story"] as const).map((f) => ({ lang, sign, file: `${d}-${f}.png` })))));
}
export async function GET(_req: Request, { params }: { params: Promise<{ lang: string; sign: string; file: string }> }) {
  const { lang, sign, file } = await params;
  const m = file.match(/^(\d{4}-\d{2}-\d{2})-(wide|story)\.png$/);
  if (!m || !(SIGNS as readonly string[]).includes(sign)) return new Response("Not found", { status: 404 });
  return horoscopeImage(lang, sign as Sign, m[1], m[2] as "wide" | "story");
}
