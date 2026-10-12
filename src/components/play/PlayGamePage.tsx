"use client";
import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { GAME_DIMS, PLAY_GAMES, playKey, type PlayGameId, type PlayGameResult, type PlayResults } from "@/engine/play";
import { useContent, useHref } from "@/lib/content-context";
import { findPerson, repo, useStore } from "@/lib/store";
import { track } from "@/lib/track";
import { Celebration } from "../art/Celebration";
import { usePlay } from "./text";
import { GameIcon } from "./GameIcon";
import { DimRow } from "./PlayCard";
import { haptic, HAPTIC, useReduce } from "./fx";
import { BridgeGame } from "./games/Bridge";
import { FacesGame } from "./games/Faces";
import { TrustGame } from "./games/Trust";
import { MemoryGame } from "./games/Memory";
import { LeadGame } from "./games/Lead";

const GAMES: Record<PlayGameId, (p: { onDone: (r: PlayGameResult) => void }) => React.ReactNode> = { bridge: BridgeGame, faces: FacesGame, trust: TrustGame, memory: MemoryGame, lead: LeadGame };

export function PlayGamePage({ game }: { game: PlayGameId }) {
  const P = usePlay(); const { c } = useContent(); const h = useHref(); const s = useStore(); const reduce = useReduce();
  const forId = useSearchParams().get("for") ?? "me"; const person = findPerson(s, forId);
  const [phase, setPhase] = useState<"intro" | "play" | "done">("intro"); const [res, setRes] = useState<PlayGameResult | null>(null);
  const [open, setOpen] = useState<string | null>(GAME_DIMS[game][0]); const [run, setRun] = useState(0);
  const G = P.games[game]; const Game = GAMES[game];
  const qs = forId !== "me" ? `?for=${forId}` : "";
  const q = (person?.quiz ?? {}) as PlayResults;
  const next = PLAY_GAMES.find((g) => g !== game && !q[playKey(g)]);

  if (!s) return <p className="text-dim">{c.site.common.loading}</p>;
  if (!person) return <div className="card mx-auto max-w-md text-center"><GameIcon g={game} className="mx-auto mb-3 h-16 w-16" /><p className="mb-4">{P.hub.needProfile}</p><Link className="btn-primary" href={h("/start/")}>{P.hub.start}</Link></div>;

  const onDone = (r: PlayGameResult) => {
    const key = playKey(game);
    repo.saveQuiz(person.id, { [key]: r }, { quizId: key, values: r.raw });
    track("quiz_done", { quiz: key, self: person.id === "me" });
    haptic(HAPTIC.win, reduce); setRes(r); setPhase("done"); window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  if (phase === "play") return <div className="pt-2" key={run}><Game onDone={onDone} /></div>;
  if (phase === "done" && res) return (
    <div className="relative mx-auto max-w-md" data-testid="play-result">
      {!reduce && <Celebration count={20} />}
      <div className="relative mb-5 text-center">
        <div className="pop relative mx-auto mb-3 grid h-24 w-24 place-items-center"><div className="absolute inset-0 animate-pulse-glow rounded-full bg-gold/30 blur-2xl" /><div className="absolute inset-0 rounded-full border border-gold/50 bg-gradient-to-br from-indigo to-ink" /><GameIcon g={game} className="relative h-14 w-14" /></div>
        <p className="eyebrow mb-1">{P.result.eyebrow}</p>
        <h1 className="h-display text-4xl"><span className="italic text-aurora">{G.name}</span></h1>
        <p className="mx-auto mt-1 max-w-sm text-sm text-dim">{G.measures}</p>
      </div>
      <div className="space-y-2">{GAME_DIMS[game].map((d) => res.scores[d] != null && <DimRow key={d} d={d} v={res.scores[d]!} open={open === d} onToggle={() => setOpen(open === d ? null : d)} />)}</div>
      {res.flags.length > 0 && <div className="mt-3 space-y-1">{res.flags.map((f) => <p key={f} className="text-xs text-dim">◦ {P.hub.flags[f]}</p>)}</div>}
      <div className="mt-6 grid gap-2">
        {next && <Link className="btn-primary py-3 text-center" href={h(`/play/${next}/${qs}`)} data-testid="play-next-game">{P.result.nextGame}: {P.games[next].name} →</Link>}
        <Link className={`${next ? "btn-ghost" : "btn-primary"} py-3 text-center`} href={h(`/play/${qs}`)} data-testid="play-to-hub">{P.result.hub}</Link>
        <button type="button" className="py-2 text-sm text-dim underline decoration-dotted underline-offset-4" onClick={() => { setRun(run + 1); setPhase("play"); }}>{P.result.again}</button>
      </div>
      <p className="mt-6 text-center text-xs text-dim">{P.hub.honest}</p>
    </div>
  );
  return (
    <div className="mx-auto max-w-md" data-testid="play-intro">
      <Link href={h(`/play/${qs}`)} className="mb-4 inline-block text-sm text-dim hover:text-gold">← {P.hub.backHub}</Link>
      <div className="relative overflow-hidden rounded-[30px] border border-white/15 bg-gradient-to-b from-violet/20 via-ink/80 to-night p-6 text-center shadow-[0_30px_80px_-40px_rgba(139,108,240,.9)]">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/15 blur-3xl" />
        <div className="relative mx-auto mb-4 grid h-24 w-24 place-items-center rounded-3xl bg-ink/70 ring-1 ring-gold/30 animate-float"><GameIcon g={game} className="h-16 w-16" /></div>
        <p className="eyebrow mb-1">{P.hub.eyebrow} · {P.hub.secs(G.secs)}</p>
        <h1 className="h-display mb-2 text-4xl"><span className="text-aurora">{G.name}</span></h1>
        <p className="mb-4 text-[15px] leading-relaxed text-mist/90">{G.intro}</p>
        <ul className="mb-5 space-y-1.5 text-left text-sm">{G.how.map((x) => <li key={x} className="flex gap-2"><span className="text-gold">✦</span>{x}</li>)}</ul>
        {forId !== "me" && <p className="mb-3 rounded-xl bg-white/5 p-2 text-sm">{P.hub.forOther(person.name)}</p>}
        <button type="button" className="btn-primary w-full py-4 text-lg" onClick={() => { haptic(HAPTIC.tap, reduce); setPhase("play"); }} data-testid="play-begin">{P.ui.begin} ✦</button>
        <p className="mt-3 text-xs text-dim">{G.measures}</p>
        {reduce && <p className="mt-2 text-xs text-dim">{P.hub.reduced}</p>}
      </div>
    </div>
  );
}
