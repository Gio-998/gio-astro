"use client";
import { useState } from "react";
import { MAJOR_ARCANA } from "@/engine/tarot";
import { useContent } from "@/lib/content-context";
import { Emblem } from "../art/Emblem";
import { cosmos } from "../art/ArtCard";

/** Free interactive "pick a card" — three face-down cards, one flips to a Major Arcana reflection. */
const randomCard = () => Math.floor(Math.random() * 22);

export function PickACard() {
  const { c } = useContent();
  const [picked, setPicked] = useState<number | null>(null);
  const [card, setCard] = useState(0);
  const pick = (i: number) => { if (picked != null) return; setCard(randomCard()); setPicked(i); };
  const t = c.nums.tarot[MAJOR_ARCANA[card]];
  return (
    <div>
      <div className="flex justify-center gap-3 sm:gap-5" style={{ perspective: 1200 }}>
        {[0, 1, 2].map((i) => {
          const flipped = picked === i;
          return (
            <button key={i} onClick={() => pick(i)} aria-label={`Card ${i + 1}`} disabled={picked != null && !flipped}
              className={`relative h-48 w-32 transition duration-700 [transform-style:preserve-3d] sm:h-60 sm:w-40 ${flipped ? "[transform:rotateY(180deg)_translateY(-10px)]" : picked != null ? "opacity-40" : "hover:-translate-y-2 hover:rotate-[-2deg]"}`}>
              <span className="absolute inset-0 overflow-hidden rounded-2xl border border-gold/50 bg-gradient-to-br from-indigo to-ink [backface-visibility:hidden]">
                <span className="absolute inset-2 rounded-xl border border-gold/30" />
                <span className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(246,207,122,.25),transparent_60%)]" />
                <Emblem id="eye" className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 animate-pulse-glow" />
              </span>
              <span className="absolute inset-0 flex flex-col items-center justify-end overflow-hidden rounded-2xl border border-gold/60 p-3 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cosmos("orion")} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-70" />
                <span className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                <Emblem id="sun" className="absolute left-1/2 top-6 h-14 w-14 -translate-x-1/2 glow-gold" />
                <span className="relative w-full font-display leading-[1.1] text-gold [overflow-wrap:anywhere] [text-wrap:balance]" style={{ fontSize: t.name.length > 13 ? "13px" : t.name.length > 10 ? "15px" : "18px" }}>{t.name}</span>
                <span className="relative mt-0.5 w-full text-[11px] leading-tight text-mist/80 [overflow-wrap:anywhere]">{t.keyword}</span>
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-6 min-h-[84px] text-center">
        {picked == null ? <p className="text-dim">{c.site.pickCard.prompt}</p> : (
          <div className="rise mx-auto max-w-lg">
            <p className="text-mist/90"><b className="text-gold">{t.name}</b>: {c.site.pickCard.today} {t.birth}</p>
            <button className="mt-3 text-sm text-dim underline underline-offset-4 hover:text-gold" onClick={() => setPicked(null)}>{c.site.pickCard.again}</button>
          </div>
        )}
      </div>
    </div>
  );
}
