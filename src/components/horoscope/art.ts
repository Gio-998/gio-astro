/** Standalone SVG art for the daily horoscope (page hero + generated share images). Same style for all 12 signs:
 * twilight orb in the element colour, gold orbit rings with 12 ticks, the gilded constellation, today's Moon phase. */
import { CONSTELLATIONS, ELEMENT_COLORS } from "@/components/art/constellations";
import { SIGN_ELEMENT, type Sign } from "@/engine/zodiac";

const r2 = (n: number) => Math.round(n * 100) / 100;
export function moonPath(angle: number, cx: number, cy: number, r: number): string {
  const t = (angle * Math.PI) / 180; const waxing = angle < 180; const rx = r2(Math.abs(Math.cos(t)) * r); const gibbous = Math.cos(t) < 0;
  const termSweep = waxing ? (gibbous ? 1 : 0) : (gibbous ? 0 : 1);
  return `M ${cx} ${cy - r} A ${r} ${r} 0 0 ${waxing ? 1 : 0} ${cx} ${cy + r} A ${rx} ${r} 0 0 ${termSweep} ${cx} ${cy - r} Z`;
}

export function signHeroSvg(sign: Sign, moonAngle: number, opts: { moon?: boolean } = {}): string {
  const k = CONSTELLATIONS[sign]; const el = ELEMENT_COLORS[SIGN_ELEMENT[sign]]; const id = `hz-${sign}`;
  const pts = k.s.map(([x, y]) => [r2(40 + x * 1.2), r2(40 + y * 1.2)]);
  const ticks = Array.from({ length: 12 }, (_, i) => { const a = (i * 30 - 90) * Math.PI / 180; return `<line x1="${r2(100 + Math.cos(a) * 92)}" y1="${r2(100 + Math.sin(a) * 92)}" x2="${r2(100 + Math.cos(a) * 97)}" y2="${r2(100 + Math.sin(a) * 97)}" stroke="#e9c78a" stroke-opacity=".55" stroke-width="1"/>`; }).join("");
  const dust = Array.from({ length: 26 }, (_, i) => { const a = i * 2.39996; const rr = 30 + ((i * 37) % 60); return `<circle cx="${r2(100 + Math.cos(a) * rr)}" cy="${r2(100 + Math.sin(a) * rr)}" r="${i % 5 === 0 ? 0.9 : 0.5}" fill="#fff" fill-opacity="${i % 3 === 0 ? 0.7 : 0.35}"/>`; }).join("");
  const lines = k.l.map(([a, b]) => `<line x1="${pts[a][0]}" y1="${pts[a][1]}" x2="${pts[b][0]}" y2="${pts[b][1]}" stroke="url(#${id}-g)" stroke-width="1.3" stroke-linecap="round" stroke-opacity=".9"/>`).join("");
  const stars = k.s.map(([, , m], i) => `<circle cx="${pts[i][0]}" cy="${pts[i][1]}" r="${m === 1 ? 3.6 : m === 2 ? 2.6 : 1.8}" fill="#fff8e6" filter="url(#${id}-glow)"/>`).join("");
  const moon = opts.moon === false ? "" : `<g transform="translate(150 22)"><circle cx="16" cy="16" r="15" fill="#1b1640" stroke="#e9c78a" stroke-opacity=".5" stroke-width=".8"/><path d="${moonPath(moonAngle, 16, 16, 13)}" fill="#f6ecd2"/></g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><defs>`
    + `<radialGradient id="${id}-o" cx="42%" cy="36%" r="68%"><stop offset="0" stop-color="${el.b}" stop-opacity=".6"/><stop offset=".55" stop-color="${el.a}" stop-opacity=".22"/><stop offset="1" stop-color="#120f2e" stop-opacity="0"/></radialGradient>`
    + `<linearGradient id="${id}-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe7b0"/><stop offset="1" stop-color="#e9b44c"/></linearGradient>`
    + `<filter id="${id}-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`
    + `<circle cx="100" cy="100" r="98" fill="url(#${id}-o)"/>`
    + `<circle cx="100" cy="100" r="94" fill="none" stroke="#e9c78a" stroke-opacity=".35" stroke-width=".7"/>`
    + `<circle cx="100" cy="100" r="80" fill="none" stroke="${el.b}" stroke-opacity=".3" stroke-width=".6" stroke-dasharray="1 4"/>`
    + `<circle cx="100" cy="100" r="62" fill="none" stroke="#e9c78a" stroke-opacity=".14" stroke-width=".6"/>`
    + ticks + dust + lines + stars + moon + `</svg>`;
}
export const svgDataUri = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
