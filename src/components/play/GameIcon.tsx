import type { PlayGameId } from "@/engine/play";
/** Small line-art badge per game. */
export function GameIcon({ g, className = "" }: { g: PlayGameId; className?: string }) {
  const S = { fill: "none", stroke: "url(#gi-g)", strokeWidth: 2.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <defs><linearGradient id="gi-g" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#ffe3a8" /><stop offset="1" stopColor="#f6b5cf" /></linearGradient></defs>
      {g === "bridge" && <><path d="M4 30 L12 28 L12 44 M44 30 L36 28 L36 44" {...S} /><path d="M12 28 Q24 38 36 28" {...S} /><path d="M16 31 v-6 M20 33 v-6 M24 34 v-6 M28 33 v-6 M32 31 v-6" {...S} strokeWidth={1.4} /><circle cx="24" cy="12" r="4" {...S} /></>}
      {g === "faces" && <><circle cx="24" cy="24" r="17" {...S} /><path d="M16 20 q3 -3 6 0 M26 20 q3 -3 6 0" {...S} /><path d="M17 30 q7 6 14 0" {...S} /></>}
      {g === "trust" && <><circle cx="17" cy="24" r="10" {...S} /><circle cx="31" cy="24" r="10" {...S} /><path d="M17 20 v8 M31 20 v8" {...S} /></>}
      {g === "memory" && <>{[0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={8 + c * 12} y={8 + r * 12} width="8" height="8" rx="2" {...S} fill={(r + c) % 2 ? "none" : "rgba(246,207,122,.35)"} />))}</>}
      {g === "lead" && <><circle cx="24" cy="12" r="5" {...S} /><circle cx="11" cy="30" r="4" {...S} /><circle cx="37" cy="30" r="4" {...S} /><path d="M24 17 v9 M24 26 L13 34 M24 26 L35 34" {...S} /><path d="M18 42 h12" {...S} /></>}
    </svg>
  );
}
