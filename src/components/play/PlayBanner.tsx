"use client";
import Link from "next/link";
import { PLAY_GAMES, playKey, type PlayResults } from "@/engine/play";
import { useHref } from "@/lib/content-context";
import { useStore } from "@/lib/store";
import { usePlay } from "./text";
import { GameIcon } from "./GameIcon";

/** Entry tile for Play Mirror on the quizzes hub. */
export function PlayBanner() {
  const P = usePlay(); const h = useHref(); const s = useStore();
  const q = (s?.me?.quiz ?? {}) as PlayResults; const n = PLAY_GAMES.filter((g) => q[playKey(g)]).length;
  return (
    <Link href={h("/play/")} data-testid="play-banner" className="group relative mb-5 block overflow-hidden rounded-[28px] border border-gold/30 bg-gradient-to-br from-violet/30 via-ink/80 to-rose/20 p-5 transition active:scale-[.99] hover:border-gold/60">
      <div className="pointer-events-none absolute -right-10 -top-12 h-44 w-44 rounded-full bg-gold/20 blur-3xl transition group-hover:bg-gold/30" />
      <div className="relative flex items-center gap-4">
        <div className="hidden shrink-0 gap-1 min-[380px]:flex">{PLAY_GAMES.slice(0, 3).map((g) => <span key={g} className="grid h-11 w-11 place-items-center rounded-2xl bg-ink/70 ring-1 ring-white/15"><GameIcon g={g} className="h-7 w-7" /></span>)}</div>
        <div className="min-w-0 flex-1">
          <p className="eyebrow mb-0.5">✦ {P.hub.progress(n)}</p>
          <p className="h-display text-2xl leading-tight">{P.brand}</p>
          <p className="text-sm text-mist/80">{P.meta.description}</p>
        </div>
        <span className="btn-primary shrink-0 !px-4 !py-2 text-sm">{P.hub.play} →</span>
      </div>
    </Link>
  );
}
