"use client";
import { CONSTELLATIONS, ELEMENT_COLORS } from "./constellations";
import { SIGN_ELEMENT, SIGN_GLYPH, Sign } from "@/engine/zodiac";

/**
 * Original illustrated sign: element-coloured orb, halo rings, self-drawing constellation and a gilded glyph.
 * Decorative (the sign's name is always in the text beside it). A client component so server pages reference it instead of
 * repeating every star in the RSC payload.
 */
export function SignArt({ sign, className = "", animate = true, showGlyph = true }: { sign: Sign; className?: string; animate?: boolean; showGlyph?: boolean }) {
  const k = CONSTELLATIONS[sign]; const el = ELEMENT_COLORS[SIGN_ELEMENT[sign]]; const id = `sa-${sign}`;
  const pts = k.s.map(([x, y]) => [Math.round((30 + x * 1.4) * 100) / 100, Math.round((34 + y * 1.4) * 100) / 100]);
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <defs>
        <radialGradient id={`${id}-orb`} cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor={el.b} stopOpacity=".55" />
          <stop offset=".55" stopColor={el.a} stopOpacity=".22" />
          <stop offset="1" stopColor="#120f2e" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="96" fill={`url(#${id}-orb)`} />
      <circle cx="100" cy="100" r="88" fill="none" stroke={el.b} strokeOpacity=".35" strokeWidth=".6" strokeDasharray="1 4" />
      <circle cx="100" cy="100" r="74" fill="none" stroke={el.b} strokeOpacity=".18" strokeWidth=".6" />
      {showGlyph && <text x="100" y="128" textAnchor="middle" fontSize="92" fill={el.b} fillOpacity=".13" fontFamily="serif">{SIGN_GLYPH[sign]}</text>}
      {k.l.map(([a, b], i) => {
        const [x1, y1] = pts[a], [x2, y2] = pts[b]; const len = Math.hypot(x2 - x1, y2 - y1);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#sa-gold)" strokeWidth="1.1" strokeLinecap="round" strokeOpacity=".85"
          className={animate ? "draw-line" : undefined} style={animate ? ({ "--len": len, animationDelay: `${i * 0.18}s` } as React.CSSProperties) : undefined} />;
      })}
      {k.s.map(([, , m], i) => (
        <g key={i} filter="url(#sa-glow)">
          <circle cx={pts[i][0]} cy={pts[i][1]} r={m === 1 ? 3.4 : m === 2 ? 2.4 : 1.6} fill="#fff8e6"
            className={animate ? "animate-twinkle" : undefined} style={animate ? { animationDelay: `${(i * 0.7) % 3}s` } : undefined} />
        </g>
      ))}
    </svg>
  );
}
