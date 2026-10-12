"use client";
import { PLAY_DIMS, type PlayDim } from "@/engine/play";
import type { PlayLensDetail } from "@/engine/play/compat";
import { usePlay } from "./text";

/** Detail panel for the Play lens in a compatibility report: both people's markers on each shared dimension. */
export function PairPlay({ detail, na, nb }: { detail: Record<string, unknown>; na: string; nb: string }) {
  const P = usePlay(); const d = detail as unknown as PlayLensDetail;
  const dims = PLAY_DIMS.filter((x) => d.shared?.includes(x)) as PlayDim[];
  return (
    <div className="space-y-3 text-sm" data-testid="pair-play">
      {d.notes?.length > 0 && <div><p className="mb-1 font-semibold">{P.pair.noteIntro}</p>{d.notes.map((n) => <p key={n}>• {P.pair.notes[n]}</p>)}</div>}
      {dims.map((x) => (
        <div key={x}>
          <div className="mb-1 flex justify-between text-xs text-dim"><span>{P.dims[x].poles[0]}</span><span className="text-mist">{P.dims[x].name}</span><span>{P.dims[x].poles[1]}</span></div>
          <div className="relative h-2 rounded-full bg-white/10">
            <span title={na} className="absolute -top-1 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-gold bg-gold/60" style={{ left: `${d.a[x]! * 10}%` }} />
            <span title={nb} className="absolute -top-1 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-rose bg-rose/60" style={{ left: `${d.b[x]! * 10}%` }} />
          </div>
        </div>
      ))}
      <p className="text-xs text-dim"><span className="text-gold">●</span> {na} · <span className="text-rose">●</span> {nb}. {P.hub.honest}</p>
    </div>
  );
}
