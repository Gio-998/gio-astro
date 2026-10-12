"use client";
import Link from "next/link";
import { sayVsPlay, saidDims, type PlayProfile, type SelfReport } from "@/engine/play";
import { useHref } from "@/lib/content-context";
import { usePlay } from "./text";

/** "You say you're careful, you play bold": where questionnaires and play disagree. */
export function SayPlay({ play, self }: { play: PlayProfile; self: SelfReport }) {
  const P = usePlay(); const h = useHref();
  if (!self.bigFive && !self.attachment) return (
    <div className="rounded-2xl border border-dashed border-gold/30 p-4 text-sm text-mist/85">
      <p className="mb-3">{P.hub.sayPlayNone}</p>
      <Link className="btn-ghost !py-2 text-sm" href={h("/quiz/big-five/")}>{P.hub.takeBigFive} →</Link>
    </div>
  );
  const { gaps, matches } = sayVsPlay(play, self); const said = saidDims(self);
  return (
    <div className="space-y-3" data-testid="say-play">
      <p className="text-sm text-dim">{P.hub.sayPlayIntro}</p>
      {gaps.map((g) => {
        const T = P.dims[g.dim]; const line = g.gap > 0 ? T.up : T.down; if (!line) return null;
        return (
          <div key={g.dim} className="rounded-2xl border border-rose/25 bg-gradient-to-br from-rose/10 to-violet/10 p-4">
            <p className="mb-2 font-semibold">{T.name}</p>
            <p className="mb-3 text-[15px] leading-relaxed">{line}</p>
            <div className="relative mb-1 h-2 rounded-full bg-white/10">
              <span className="absolute -top-1 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-white/70 bg-night" style={{ left: `${g.said * 10}%` }} />
              <span className="absolute -top-1.5 h-5 w-5 -translate-x-1/2 rounded-full border-2 border-gold bg-[radial-gradient(circle_at_35%_35%,#fff,#f6cf7a)]" style={{ left: `${g.played * 10}%` }} />
            </div>
            <div className="flex justify-between text-[11px] text-dim"><span>{T.poles[0]}</span><span>○ {P.hub.saidLabel} · ● {P.hub.playedLabel}</span><span>{T.poles[1]}</span></div>
            <p className="mt-2 text-xs text-dim">{T.said}</p>
          </div>
        );
      })}
      {matches.filter((d) => said[d] != null).length > 0 && <p className="text-sm text-sage">✓ {P.hub.matches(matches.map((d) => P.dims[d].name).join(", "))}</p>}
    </div>
  );
}
