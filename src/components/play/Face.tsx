"use client";
import type { Emotion } from "@/engine/play";

/** Parametric illustrated face (no photos). Each emotion moves brows, lids, mouth and nose like a real micro-expression. */
type P = { browY: number; browTilt: number; lid: number; lower: number; mouthW: number; curve: number; open: number; asym: number; nose: number; cheek: number };
const NEUTRAL: P = { browY: 0, browTilt: 0, lid: 1, lower: 0, mouthW: 1, curve: 0, open: 0, asym: 0, nose: 0, cheek: 0 };
const TARGET: Record<Emotion, Partial<P>> = {
  joy: { curve: 9, mouthW: 1.15, cheek: 1, lower: 0.35, open: 2 },
  sadness: { browTilt: -6, browY: 1, curve: -6, lid: 0.75, mouthW: 0.9 },
  anger: { browTilt: 8, browY: 4, lid: 0.7, curve: -2, mouthW: 0.85, lower: 0.3 },
  fear: { browY: -6, browTilt: -4, lid: 1.35, open: 5, mouthW: 1.1, curve: -1 },
  surprise: { browY: -8, lid: 1.4, open: 9, mouthW: 0.7 },
  disgust: { nose: 1, curve: -3, lower: 0.5, browTilt: 3, browY: 2, asym: 1.5, mouthW: 0.9 },
  contempt: { asym: 6, curve: 1, lid: 0.85 },
  calm: { lid: 0.8, curve: 2 },
};
export function faceParams(e: Emotion | null, k: number): P {
  const t = e ? TARGET[e] : {}; const o = { ...NEUTRAL };
  (Object.keys(NEUTRAL) as (keyof P)[]).forEach((key) => { const v = t[key]; if (v != null) o[key] = NEUTRAL[key] + (v - NEUTRAL[key]) * k; });
  return o;
}

export function Face({ emotion, intensity = 1, skin = "#f2c6a8", hair = "#3b2a4a", className = "" }: { emotion: Emotion | null; intensity?: number; skin?: string; hair?: string; className?: string }) {
  const p = faceParams(emotion, intensity);
  const eye = (cx: number) => {
    const ry = 6 * p.lid;
    return (
      <g>
        <ellipse cx={cx} cy={92} rx={11} ry={Math.max(1.2, ry + 1)} fill="#fff" />
        <circle cx={cx} cy={92} r={Math.min(5.5, Math.max(1.5, ry))} fill="#2a2350" />
        {p.lower > 0 && <path d={`M${cx - 11} ${96 + 2 - p.lower * 3} Q${cx} ${92 + 6 - p.lower * 4} ${cx + 11} ${96 + 2 - p.lower * 3}`} stroke="#c98d77" strokeWidth="1.6" fill="none" opacity={0.7 * Math.min(1, p.lower * 2)} />}
      </g>
    );
  };
  const brow = (cx: number, side: -1 | 1) => {
    const y = 76 + p.browY; const inner = y + p.browTilt * 0.6, outer = y - p.browTilt * 0.4;
    const [x1, y1, x2, y2] = side < 0 ? [cx - 13, outer, cx + 11, inner] : [cx - 11, inner, cx + 13, outer];
    return <path d={`M${x1} ${y1} Q${cx} ${Math.min(y1, y2) - 4} ${x2} ${y2}`} stroke={hair} strokeWidth="4.5" strokeLinecap="round" fill="none" />;
  };
  const mw = 24 * p.mouthW, my = 132;
  const l = 80 - mw, r = 80 + mw, ly = my - p.asym * 0.15, ry = my - p.asym;
  const mouth = p.open > 0.5
    ? `M${l} ${ly} Q80 ${my + p.curve + p.open * 1.4} ${r} ${ry} Q80 ${my + p.curve * 0.3 - p.open * 0.2} ${l} ${ly} Z`
    : `M${l} ${ly} Q80 ${my + p.curve * 1.4} ${r} ${ry}`;
  return (
    <svg viewBox="0 0 160 180" className={className} role="img" aria-label="">
      <defs>
        <radialGradient id="fc-skin" cx="45%" cy="38%" r="70%"><stop offset="0" stopColor="#fff3ea" stopOpacity=".55" /><stop offset=".55" stopColor={skin} /><stop offset="1" stopColor="#c99382" /></radialGradient>
      </defs>
      <path d="M22 86 Q20 26 80 22 Q140 26 138 86 L138 64 Q130 14 80 12 Q30 14 22 64Z" fill={hair} />
      <ellipse cx="80" cy="98" rx="56" ry="68" fill="url(#fc-skin)" />
      <path d="M26 80 Q30 34 80 32 Q128 34 134 78 Q118 50 80 50 Q44 50 26 80Z" fill={hair} opacity=".95" />
      {p.cheek > 0 && <><ellipse cx="46" cy="114" rx="11" ry="6" fill="#ff8fa8" opacity={0.35 * p.cheek} /><ellipse cx="114" cy="114" rx="11" ry="6" fill="#ff8fa8" opacity={0.35 * p.cheek} /></>}
      {brow(55, -1)}{brow(105, 1)}
      {eye(55)}{eye(105)}
      <path d={`M80 98 Q${76 - p.nose * 2} 112 74 116 Q80 ${119 - p.nose * 2} 86 116`} stroke="#b97e6c" strokeWidth="2" fill="none" strokeLinecap="round" />
      {p.nose > 0 && <path d="M70 104 l5 3 M90 104 l-5 3" stroke="#b97e6c" strokeWidth="1.5" opacity={0.8 * p.nose} />}
      <path d={mouth} fill={p.open > 0.5 ? "#7a2e45" : "none"} stroke="#9c4a5a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
