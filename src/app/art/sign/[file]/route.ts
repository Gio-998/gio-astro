import { SIGNS, type Sign } from "@/engine/zodiac";
import { signHeroSvg } from "@/components/horoscope/art";

/** Static per-sign art (no Moon) as cacheable files, so list pages reference 12 small images instead of inlining 12 SVGs twice (HTML + RSC payload). */
export const dynamic = "force-static";
export const dynamicParams = false;
export function generateStaticParams() { return SIGNS.map((s) => ({ file: `${s}.svg` })); }
export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params; const sign = file.replace(/\.svg$/, "");
  if (!(SIGNS as readonly string[]).includes(sign)) return new Response("Not found", { status: 404 });
  return new Response(signHeroSvg(sign as Sign, 0, { moon: false }), { headers: { "Content-Type": "image/svg+xml; charset=utf-8" } });
}
