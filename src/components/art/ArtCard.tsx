import { Emblem, EmblemId } from "./Emblem";

export const COSMOS = ["cliffs", "orion", "helix", "twinjet", "pillars", "storm", "mountain", "milkyway"] as const;
export type Cosmos = (typeof COSMOS)[number];
export const cosmos = (k: Cosmos, w: 640 | 1280 | 1920 = 640) => {
  const max: Record<Cosmos, number> = { cliffs: 1920, orion: 1920, helix: 1920, twinjet: 1280, pillars: 1280, storm: 1280, mountain: 1280, milkyway: 1280 };
  return `/img/cosmos/${k}-${Math.min(w, max[k])}.webp`;
};

/** Tarot-style arched card: cosmic photo + colour grade + gilded frame + original emblem. */
export function ArtCard({ img, emblem, className = "", children, tint = "violet" }: { img: Cosmos; emblem: EmblemId; className?: string; children?: React.ReactNode; tint?: "violet" | "rose" | "gold" | "aqua" }) {
  const tints = { violet: "from-[#3b2f86]/30 via-[#1c1645]/60 to-[#120f2e]/95", rose: "from-[#f6b5cf]/20 via-[#2b2266]/60 to-[#120f2e]/95", gold: "from-[#f6cf7a]/20 via-[#2b2266]/60 to-[#120f2e]/95", aqua: "from-[#8fe3d6]/20 via-[#2b2266]/60 to-[#120f2e]/95" };
  return (
    <div className={`group relative overflow-hidden rounded-t-[999px] rounded-b-3xl border border-gold/30 bg-ink shadow-[0_30px_60px_-30px_rgba(139,108,240,.8)] ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={cosmos(img)} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-[1.6s] group-hover:scale-110" />
      <div className={`absolute inset-0 bg-gradient-to-b ${tints[tint]}`} />
      <div className="pointer-events-none absolute inset-2 rounded-t-[999px] rounded-b-[20px] border border-gold/40" />
      <div className="relative flex h-full flex-col items-center px-4 pb-5 pt-10 text-center">
        <Emblem id={emblem} className="mb-3 h-20 w-20 glow-gold transition duration-500 group-hover:rotate-[8deg] group-hover:scale-110" />
        {children}
      </div>
    </div>
  );
}
