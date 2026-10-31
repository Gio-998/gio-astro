"use client";
import Link from "next/link";
import { PLAY_GAMES, playKey, type PlayResults } from "@/engine/play";
import { useHref } from "@/lib/content-context";
import { subjectOf, useStore } from "@/lib/store";
import { usePlay } from "./text";
import { GameIcon } from "./GameIcon";

/** Entry tile for Play Mirror on the quizzes hub. */
export function PlayBanner() {
  const P = usePlay(); const h = useHref(); const s = useStore();
  const q = (subjectOf(s)?.quiz ?? {}) as PlayResults; const n = PLAY_GAMES.filter((g) => q[playKey(g)]).length;
  return (
    <Link href={h("/play/")} data-testid="play-banner" className="group relative mb-5 block overflow-hidden rounded-[28px] border border-gold/30 bg-gradient-to-br from-violet/30 via-ink/80 to-rose/20 p-5 transition active:scale-[.99] hover:border-gold/60">
      <div className="pointer-events-none absolute -right-10 -top-12 h-44 w-44 rounded-full bg-gold/20 blur-3xl transition group-hover:bg-gold/30" />
      <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="order-3 flex shrink-0 gap-1.5 max-sm:items-center sm:order-none">{PLAY_GAMES.slice(0, 3).map((g) => <span key={g} className="grid h-10 w-10 place-items-center rounded-2xl bg-ink/70 ring-1 ring-white/15 sm:h-11 sm:w-11"><GameIcon g={g} className="h-6 w-6 sm:h-7 sm:w-7" /></span>)}</div>
        <div className="order-1 min-w-0 flex-1 sm:order-none">
          <p className="eyebrow mb-1">✦ {P.hub.progress(n)}</p>
          <p className="h-display whitespace-nowrap text-2xl leading-tight">{P.brand}</p>
          <p className="mt-1 text-sm text-mist/80 [text-wrap:pretty] sm:hidden">{P.hub.short}</p>
          <p className="hidden text-sm text-mist/80 [text-wrap:pretty] sm:block">{P.meta.description}</p>
        </div>
        <span className="btn-primary order-4 shrink-0 whitespace-nowrap !px-5 !py-2 text-sm max-sm:-mt-[52px] max-sm:self-end sm:order-none sm:!px-4">{P.hub.play} →</span>
      </div>
    </Link>
  );
}
