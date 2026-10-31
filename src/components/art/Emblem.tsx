/**
 * Original line-art emblems (gold) for quizzes, lenses and steps. Every drawing lives once in the page sprite (SvgDefs);
 * each <Emblem> is a small <use> reference, so a page with a hundred emblems does not carry a hundred copies of each shape
 * in its HTML and again in the RSC payload.
 */
export type EmblemId = "big-five" | "attachment" | "nine" | "care" | "shadow" | "dosha" | "explorer" | "bond" | "chart" | "sun" | "moon" | "tarot" | "number" | "yinyang" | "chinese" | "vedic" | "palette" | "animal" | "temperament" | "fourletter" | "eye";
/** Written as a keyed object so a new EmblemId that is missing from the sprite fails the type check. */
const SPRITE: Record<EmblemId, true> = { "big-five": true, attachment: true, nine: true, care: true, shadow: true, dosha: true, explorer: true, bond: true, chart: true, sun: true, moon: true, tarot: true, number: true, yinyang: true, chinese: true, vedic: true, palette: true, animal: true, temperament: true, fourletter: true, eye: true };
export const EMBLEM_IDS = Object.keys(SPRITE) as EmblemId[];

const poly = (n: number, r: number, rot = -90, cx = 50, cy = 50) => Array.from({ length: n }, (_, i) => { const a = ((rot + (i * 360) / n) * Math.PI) / 180; return [Math.round((cx + Math.cos(a) * r) * 100) / 100, Math.round((cy + Math.sin(a) * r) * 100) / 100]; });
const pts = (p: number[][]) => p.map((q) => q.join(",")).join(" ");

/** The drawing itself, rendered once per id into the sprite. */
export function emblemBody(id: EmblemId): React.ReactNode {
  const S = { fill: "none", stroke: "url(#em-g)", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  let body: React.ReactNode;
  switch (id) {
    case "big-five": { const o = poly(5, 34), i = poly(5, 14, -54); body = <><polygon points={pts(o.flatMap((p, k) => [p, i[k]]))} {...S} /><circle cx="50" cy="50" r="40" {...S} strokeOpacity=".4" />{o.map((p, k) => <circle key={k} cx={p[0]} cy={p[1]} r="3" fill="#f6cf7a" />)}</>; break; }
    case "attachment": body = <><circle cx="38" cy="50" r="22" {...S} /><circle cx="62" cy="50" r="22" {...S} /><path d="M50 40 q0 10 0 20" {...S} strokeOpacity=".5" /><circle cx="50" cy="50" r="3" fill="#f6b5cf" /></>; break;
    case "nine": { const p = poly(9, 36); body = <><circle cx="50" cy="50" r="36" {...S} strokeOpacity=".5" /><polygon points={pts([p[0], p[3], p[6]])} {...S} /><polyline points={pts([p[1], p[4], p[2], p[8], p[5], p[7], p[1]])} {...S} />{p.map((q, k) => <circle key={k} cx={q[0]} cy={q[1]} r="2.4" fill="#f6cf7a" />)}</>; break; }
    case "care": body = <><path d="M50 74 C20 54 22 30 38 28 C46 27 50 34 50 38 C50 34 54 27 62 28 C78 30 80 54 50 74 Z" {...S} />{poly(8, 42).map((q, k) => { const r = poly(8, 34)[k]; return <line key={k} x1={r[0]} y1={r[1]} x2={q[0]} y2={q[1]} {...S} strokeOpacity=".5" />; })}</>; break;
    case "shadow": body = <><circle cx="50" cy="50" r="30" {...S} /><path d="M50 20 A30 30 0 0 1 50 80 A18 30 0 0 0 50 20 Z" fill="#f6cf7a" fillOpacity=".35" stroke="none" />{poly(12, 40).map((q, k) => { const r = poly(12, 34)[k]; return <line key={k} x1={r[0]} y1={r[1]} x2={q[0]} y2={q[1]} {...S} strokeOpacity=".6" />; })}</>; break;
    case "dosha": body = <>{poly(3, 18).map((q, k) => <path key={k} d={`M${q[0]} ${q[1] - 16} C${q[0] + 12} ${q[1] - 2} ${q[0] + 8} ${q[1] + 12} ${q[0]} ${q[1] + 12} C${q[0] - 8} ${q[1] + 12} ${q[0] - 12} ${q[1] - 2} ${q[0]} ${q[1] - 16} Z`} {...S} />)}<circle cx="50" cy="50" r="40" {...S} strokeOpacity=".4" /></>; break;
    case "explorer": body = <><circle cx="50" cy="50" r="34" {...S} /><polygon points="50,18 56,50 50,82 44,50" {...S} fill="#f6cf7a" fillOpacity=".25" /><polygon points="18,50 50,45 82,50 50,55" {...S} strokeOpacity=".6" /><circle cx="50" cy="50" r="3" fill="#f6cf7a" /></>; break;
    case "bond": body = <><circle cx="36" cy="44" r="16" {...S} /><circle cx="64" cy="56" r="16" {...S} /><path d="M20 80 Q50 60 80 20" {...S} strokeOpacity=".5" strokeDasharray="2 4" /><path d="M50 40 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2z" fill="#f6b5cf" /></>; break;
    case "chart": body = <><circle cx="50" cy="50" r="38" {...S} /><circle cx="50" cy="50" r="28" {...S} strokeOpacity=".5" />{Array.from({ length: 12 }, (_, k) => { const a = (k * 30 * Math.PI) / 180; return <line key={k} x1={Math.round((50 + Math.cos(a) * 28) * 100) / 100} y1={Math.round((50 + Math.sin(a) * 28) * 100) / 100} x2={Math.round((50 + Math.cos(a) * 38) * 100) / 100} y2={Math.round((50 + Math.sin(a) * 38) * 100) / 100} {...S} strokeOpacity=".7" />; })}<polygon points={pts(poly(3, 28, -30))} {...S} strokeOpacity=".6" /></>; break;
    case "sun": body = <><circle cx="50" cy="50" r="16" {...S} /><circle cx="50" cy="50" r="3" fill="#f6cf7a" />{poly(16, 38).map((q, k) => { const r = poly(16, k % 2 ? 26 : 22)[k]; return <line key={k} x1={r[0]} y1={r[1]} x2={q[0]} y2={q[1]} {...S} />; })}</>; break;
    case "moon": body = <><path d="M60 18 A32 32 0 1 0 60 82 A26 32 0 1 1 60 18 Z" {...S} /><path d="M72 30 l1.5 4 4 1.5 -4 1.5 -1.5 4 -1.5 -4 -4 -1.5 4 -1.5z" fill="#f6cf7a" /></>; break;
    case "tarot": body = <><rect x="28" y="14" width="44" height="72" rx="6" {...S} /><rect x="33" y="19" width="34" height="62" rx="3" {...S} strokeOpacity=".5" /><circle cx="50" cy="44" r="10" {...S} /><path d="M40 66 h20" {...S} /></>; break;
    case "number": body = <><circle cx="50" cy="50" r="36" {...S} strokeOpacity=".5" /><text x="50" y="62" textAnchor="middle" fontSize="36" fill="url(#em-g)" fontFamily="serif">7</text>{poly(7, 36).map((q, k) => <circle key={k} cx={q[0]} cy={q[1]} r="2.2" fill="#f6cf7a" />)}</>; break;
    case "yinyang": body = <><circle cx="50" cy="50" r="34" {...S} /><path d="M50 16 A17 17 0 0 1 50 50 A17 17 0 0 0 50 84 A34 34 0 0 1 50 16 Z" fill="#f6cf7a" fillOpacity=".35" stroke="none" /><circle cx="50" cy="33" r="4" fill="#120f2e" stroke="#f6cf7a" /><circle cx="50" cy="67" r="4" fill="#f6cf7a" /></>; break;
    case "chinese": body = <><polygon points={pts(poly(5, 34))} {...S} /><circle cx="50" cy="50" r="40" {...S} strokeOpacity=".4" />{poly(5, 34).map((q, k) => <circle key={k} cx={q[0]} cy={q[1]} r="5" fill={["#8fe3d6", "#ff9f6e", "#e7cf8f", "#fffaf0", "#6fa8ff"][k]} fillOpacity=".8" />)}<polygon points={pts([0, 2, 4, 1, 3].map((k) => poly(5, 34)[k]))} {...S} strokeOpacity=".4" /></>; break;
    case "vedic": body = <>{[0, 45].map((r) => <rect key={r} x="24" y="24" width="52" height="52" transform={`rotate(${r} 50 50)`} {...S} />)}<circle cx="50" cy="50" r="12" {...S} /><circle cx="50" cy="50" r="3" fill="#f6cf7a" /></>; break;
    case "palette": body = <>{poly(6, 22).map((q, k) => <circle key={k} cx={q[0]} cy={q[1]} r="12" fill={["#f6cf7a", "#f6b5cf", "#c9b8ff", "#8fe3d6", "#ffd6b8", "#8b6cf0"][k]} fillOpacity=".55" stroke="#f6cf7a" strokeWidth=".8" />)}</>; break;
    case "animal": body = <><path d="M30 70 Q30 40 50 30 Q70 40 70 70" {...S} /><path d="M38 34 L32 18 L44 28 M62 34 L68 18 L56 28" {...S} /><circle cx="42" cy="50" r="2.5" fill="#f6cf7a" /><circle cx="58" cy="50" r="2.5" fill="#f6cf7a" /><path d="M46 62 Q50 66 54 62" {...S} /></>; break;
    case "temperament": body = <>{[[50, 28], [72, 50], [50, 72], [28, 50]].map(([x, y], k) => <circle key={k} cx={x} cy={y} r="14" {...S} fill={["#ff9f6e", "#8fe3d6", "#a9c8ff", "#e7cf8f"][k]} fillOpacity=".18" />)}</>; break;
    case "fourletter": body = <>{[[30, 30], [70, 30], [30, 70], [70, 70]].map(([x, y], k) => <rect key={k} x={x - 13} y={y - 13} width="26" height="26" rx="6" {...S} />)}<circle cx="50" cy="50" r="4" fill="#f6cf7a" /></>; break;
    case "eye": body = <><path d="M14 50 Q50 14 86 50 Q50 86 14 50 Z" {...S} /><circle cx="50" cy="50" r="12" {...S} /><circle cx="50" cy="50" r="4" fill="#f6cf7a" />{poly(9, 44, -90).slice(0, 5).map((q, k) => { const r = poly(9, 36, -90)[k]; return <line key={k} x1={r[0]} y1={r[1]} x2={q[0]} y2={q[1]} {...S} strokeOpacity=".5" />; })}</>; break;
  }
  return body;
}

export function Emblem({ id, className = "" }: { id: EmblemId; className?: string }) {
  return <svg viewBox="0 0 100 100" className={className} aria-hidden><use href={`#emb-${id}`} /></svg>;
}
