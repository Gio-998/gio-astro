"use client";
import type { Chart, Point } from "@/engine/astro";
import { SIGNS, SIGN_GLYPH, SIGN_ELEMENT } from "@/engine/zodiac";
import { useContent } from "@/lib/content-context";

const ELEMENT_FILL: Record<string, string> = { fire: "rgba(242,92,84,.18)", earth: "rgba(107,143,113,.2)", air: "rgba(169,222,249,.15)", water: "rgba(61,90,128,.3)" };

/** Simple natal wheel. Ascendant on the left when known, otherwise 0° Aries on the left. */
export function ChartWheel({ chart, size = 340 }: { chart: Chart; size?: number }) {
  const { c } = useContent();
  const R = size / 2, cx = R, cy = R;
  const asc = chart.placements.asc?.lon ?? 0;
  const ang = (lon: number) => ((180 + (lon - asc)) * Math.PI) / 180; // zodiac runs counter-clockwise from the Ascendant on the left
  const pt = (lon: number, r: number) => [cx + r * Math.cos(ang(lon)), cy - r * Math.sin(ang(lon))];
  const planets = (["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto"] as Point[])
    .map((p) => chart.placements[p]!).sort((a, b) => a.lon - b.lon);
  // simple collision spreading
  const placed: { p: Point; lon: number; disp: number }[] = [];
  for (const pl of planets) {
    let disp = pl.lon;
    const prev = placed[placed.length - 1];
    if (prev && disp - prev.disp < 7) disp = prev.disp + 7;
    placed.push({ p: pl.point, lon: pl.lon, disp });
  }
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto w-full max-w-sm" role="img" aria-label={c.ui.misc.chartWheel}>
      {SIGNS.map((s, i) => {
        const a0 = i * 30, a1 = a0 + 30;
        const [x0, y0] = pt(a0, R - 2), [x1, y1] = pt(a1, R - 2), [x2, y2] = pt(a1, R - 34), [x3, y3] = pt(a0, R - 34);
        const [tx, ty] = pt(a0 + 15, R - 18);
        return (
          <g key={s}>
            <path d={`M${x0},${y0} A${R - 2},${R - 2} 0 0 0 ${x1},${y1} L${x2},${y2} A${R - 34},${R - 34} 0 0 1 ${x3},${y3} Z`} fill={ELEMENT_FILL[SIGN_ELEMENT[s]]} stroke="rgba(255,255,255,.15)" />
            <text x={tx} y={ty + 6} textAnchor="middle" fontSize="16" fill="#ece6ff">{SIGN_GLYPH[s]}</text>
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={R - 34} fill="none" stroke="rgba(255,255,255,.15)" />
      <circle cx={cx} cy={cy} r={R * 0.38} fill="none" stroke="rgba(255,255,255,.08)" />
      {chart.aspects.filter((a) => a.a !== "asc" && a.b !== "asc" && ["square", "trine", "opposition", "sextile"].includes(a.type)).slice(0, 14).map((a, i) => {
        const [x1, y1] = pt(chart.placements[a.a]!.lon, R * 0.38), [x2, y2] = pt(chart.placements[a.b]!.lon, R * 0.38);
        const col = a.type === "trine" || a.type === "sextile" ? "rgba(159,216,203,.55)" : "rgba(240,166,202,.55)";
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={col} strokeWidth="1" />;
      })}
      {placed.map(({ p, lon, disp }) => {
        const [x, y] = pt(disp, R - 56), [tx, ty] = pt(lon, R - 36), [ix, iy] = pt(lon, R - 42);
        return (
          <g key={p}>
            <line x1={tx} y1={ty} x2={ix} y2={iy} stroke="#f3c969" />
            <text x={x} y={y + 6} textAnchor="middle" fontSize="17" fill="#f3c969">{c.astro.points[p].glyph}</text>
          </g>
        );
      })}
      {chart.placements.asc && (() => { const [x, y] = pt(asc, R - 34); const [x2, y2] = pt(asc + 180, R - 34); return <line x1={x} y1={y} x2={x2} y2={y2} stroke="rgba(243,201,105,.5)" strokeDasharray="4 4" />; })()}
    </svg>
  );
}
