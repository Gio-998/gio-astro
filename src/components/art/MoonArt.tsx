"use client";
import { useId } from "react";
/** Moon disc with correct phase shading. angle: 0 = new, 180 = full (astronomy-engine MoonPhase). */
export function MoonArt({ angle, className = "" }: { angle: number; className?: string }) {
  const uid = useId().replace(/:/g, ""); const r = 46, cx = 50, cy = 50;
  const t = (angle * Math.PI) / 180;
  const waxing = angle < 180;
  const rx = Math.abs(Math.cos(t)) * r;
  // lit limb on the right while waxing (northern hemisphere view)
  const limbSweep = waxing ? 1 : 0;
  const gibbous = Math.cos(t) < 0;
  const termSweep = waxing ? (gibbous ? 1 : 0) : (gibbous ? 0 : 1);
  const d = `M ${cx} ${cy - r} A ${r} ${r} 0 0 ${limbSweep} ${cx} ${cy + r} A ${rx} ${r} 0 0 ${termSweep} ${cx} ${cy - r} Z`;
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <defs>
        <radialGradient id={`ml${uid}`} cx="40%" cy="38%" r="70%"><stop offset="0" stopColor="#fffaf0" /><stop offset=".7" stopColor="#f3e6c8" /><stop offset="1" stopColor="#d9c39a" /></radialGradient>
        <filter id={`mg${uid}`} x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="4" /></filter>
      </defs>
      <circle cx={cx} cy={cy} r={r + 3} fill="#c9b8ff" opacity=".35" filter={`url(#mg${uid})`} />
      <radialGradient id={`md${uid}`} cx="60%" cy="40%" r="75%"><stop offset="0" stopColor="#5a4aa8" /><stop offset="1" stopColor="#241c5a" /></radialGradient>
      <circle cx={cx} cy={cy} r={r} fill={`url(#md${uid})`} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#ffe7b0" strokeOpacity=".45" strokeWidth="1.2" />
      <circle cx={cx} cy={cy} r={r + 5} fill="none" stroke="#f6cf7a" strokeOpacity=".25" strokeWidth=".6" strokeDasharray="1 3" />
      <clipPath id={`mc${uid}`}><path d={d} /></clipPath>
      <path d={d} fill={`url(#ml${uid})`} />
      <g fill="#c9a96e" opacity=".22" clipPath={`url(#mc${uid})`}><circle cx="38" cy="40" r="6" /><circle cx="60" cy="62" r="8" /><circle cx="62" cy="34" r="4" /><circle cx="40" cy="66" r="3.5" /></g>
    </svg>
  );
}
