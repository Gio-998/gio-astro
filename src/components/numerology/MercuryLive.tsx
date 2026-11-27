"use client";
import { useEffect, useState } from "react";
import { liveIndex } from "@/lib/live-answer";
import type { LiveAnswer } from "@/lib/numerology";

/**
 * "Is Mercury retrograde right now?" The static page already holds the answer for the day it was built (so crawlers and
 * visitors without scripts read a real answer). In the browser the answer is picked again for the visitor's clock, so a page
 * served from a cache a day or two old is still right.
 */
export function MercuryLive({ live, className, label, lead }: { live: LiveAnswer; className?: string; label?: string; lead?: boolean }) {
  const [i, setI] = useState(live.initial);
  useEffect(() => {
    const tick = () => setI(liveIndex(live.timeline, Date.now()));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [live]);
  const e = live.timeline[i];
  if (lead) return <p aria-live="polite" data-testid="mercury-live" data-state={e.retro ? "retrograde" : "direct"} className="h-display mt-3 text-pretty text-[1.25rem] italic leading-snug text-gold/95 lg:mt-6 lg:text-[2rem] lg:leading-[1.25]">{e.text}</p>;
  return (
    <section aria-labelledby="live-h" data-testid="mercury-live" className={`rounded-2xl border border-gold/30 bg-gold/[0.07] px-4 py-3.5 lg:rounded-3xl lg:px-8 lg:py-6 ${className ?? ""}`}>
      <h2 id="live-h" className={`${label ?? ""} mb-1.5 lg:mb-2`}>{live.question}</h2>
      <p aria-live="polite" className="flex items-start gap-2.5 text-pretty text-[16px] leading-snug text-mist lg:text-[20px] lg:leading-[1.55]">
        <span aria-hidden className={`mt-[7px] h-2.5 w-2.5 shrink-0 rounded-full lg:mt-[10px] ${e.retro ? "bg-gold" : "bg-mist/40"}`} />
        <span data-state={e.retro ? "retrograde" : "direct"}>{e.text}</span>
      </p>
      <p className="mt-2 text-[12.5px] leading-snug text-mist/55 lg:text-[13.5px]">{live.note}</p>
    </section>
  );
}
