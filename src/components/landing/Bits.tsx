import { Reveal } from "../art/Reveal";

export function SectionHead({ eyebrow, title, sub, light = false, center = true }: { eyebrow: string; title: React.ReactNode; sub?: string; light?: boolean; center?: boolean }) {
  return (
    <Reveal className={`mb-10 ${center ? "mx-auto text-center" : ""} max-w-2xl`}>
      <p className={`eyebrow mb-3 ${light ? "!text-[#9a6b1f]" : ""}`}>{eyebrow}</p>
      <h2 data-fx="words" className={`h-display mb-3 text-[clamp(2.2rem,4.6vw,3.6rem)] font-medium leading-[1.05] ${light ? "text-plum" : ""}`}>{title}</h2>
      {center && <Ornament light={light} />}
      {sub && <p className={`mt-4 text-lg ${light ? "text-[#5f5590]" : "text-dim"}`}>{sub}</p>}
    </Reveal>
  );
}

export function Ornament({ light = false }: { light?: boolean }) {
  const c = light ? "#b8862e" : "#f6cf7a";
  return (
    <svg viewBox="0 0 200 16" className="mx-auto h-4 w-48" aria-hidden>
      <line x1="0" y1="8" x2="82" y2="8" stroke={c} strokeOpacity=".6" />
      <line x1="118" y1="8" x2="200" y2="8" stroke={c} strokeOpacity=".6" />
      <path d="M100 0 l3 5 5 3 -5 3 -3 5 -3 -5 -5 -3 5 -3z" fill={c} />
      <circle cx="88" cy="8" r="1.6" fill={c} /><circle cx="112" cy="8" r="1.6" fill={c} />
    </svg>
  );
}
