"use client";
import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { PLAY_GAMES, playKey, playProfile, type PlayResults } from "@/engine/play";
import { useContent, useHref } from "@/lib/content-context";
import { findPerson, useStore } from "@/lib/store";
import { PageHero } from "../ui";
import { Reveal } from "../art/Reveal";
import { usePlay } from "./text";
import { PlayCard } from "./PlayCard";
import { SayPlay } from "./SayPlay";
import { GameIcon } from "./GameIcon";
import { sharePlayStory } from "./share";
import { track } from "@/lib/track";
import { UnifiedGlance } from "../adaptive/UnifiedGlance";

export function PlayHub() {
  const P = usePlay(); const { c } = useContent(); const h = useHref(); const s = useStore();
  const forId = useSearchParams().get("for") ?? "me"; const person = findPerson(s, forId);
  const q = (person?.quiz ?? {}) as PlayResults; const prof = playProfile(q);
  const done = PLAY_GAMES.filter((g) => q[playKey(g)]); const next = PLAY_GAMES.find((g) => !q[playKey(g)]);
  const [sharing, setSharing] = useState(false);
  const qs = forId !== "me" ? `?for=${forId}` : "";
  return (
    <div data-testid="play-hub">
      <PageHero eyebrow={P.hub.eyebrow} emblem="explorer" img="storm" title={<>{P.hub.titleA}<span className="italic text-aurora">{P.hub.titleB}</span></>} sub={P.hub.sub}>
        <div className="flex flex-wrap items-center gap-3">
          <div className="h-2 w-40 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-rose to-gold transition-all" style={{ width: `${(done.length / PLAY_GAMES.length) * 100}%` }} /></div>
          <span className="text-sm text-dim">{P.hub.progress(done.length)}</span>
          {person && next && <Link href={h(`/play/${next}/${qs}`)} className="btn-primary !py-2 text-sm" data-testid="play-next">{done.length ? P.hub.playNext : P.hub.play} ✦</Link>}
        </div>
      </PageHero>
      {forId !== "me" && person && <p className="mb-4 rounded-xl bg-white/5 p-3 text-sm">{P.hub.forOther(person.name)}</p>}
      {s && !person && (
        <div className="card mb-6 text-center"><p className="mb-4">{P.hub.needProfile}</p><Link className="btn-primary" href={h("/start/")}>{P.hub.start}</Link></div>
      )}
      <p className="eyebrow mb-3">✦ {P.hub.gameTitle}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {PLAY_GAMES.map((g, i) => {
          const G = P.games[g]; const isDone = !!q[playKey(g)];
          return (
            <Reveal key={g} delay={(i % 2) * 0.06}>
              <Link href={h(`/play/${g}/${qs}`)} data-testid={`play-tile-${g}`} className="group relative flex items-center gap-4 overflow-hidden rounded-[26px] border border-white/12 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-4 transition active:scale-[.98] hover:border-gold/40">
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-violet/20 blur-2xl transition group-hover:bg-gold/20" />
                <div className="relative grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-ink/70 ring-1 ring-white/15"><GameIcon g={g} className="h-11 w-11" /></div>
                <div className="relative min-w-0 flex-1">
                  <p className="h-display text-2xl leading-tight">{isDone ? "✓ " : ""}{G.name}</p>
                  <p className="text-sm text-mist/75">{G.tagline}</p>
                  <p className="mt-1 text-xs text-dim">{P.hub.secs(G.secs)}</p>
                </div>
                <span className={`relative ${isDone ? "btn-ghost" : "btn-primary"} !px-3 !py-1.5 text-xs`}>{isDone ? P.hub.replay : P.hub.play}</span>
              </Link>
            </Reveal>
          );
        })}
      </div>
      <section className="mt-10">
        <div className="relative overflow-hidden rounded-[30px] border border-gold/20 bg-gradient-to-b from-violet/15 via-white/[0.03] to-rose/10 p-5 sm:p-8">
          {prof ? <PlayCard profile={prof} said={undefined} /> : <p className="py-6 text-center text-dim">{P.hub.resultEmpty}</p>}
          {prof && (
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button type="button" className="btn-primary" disabled={sharing} data-testid="play-share" onClick={async () => { setSharing(true); await sharePlayStory(prof, P, person?.name ?? ""); track("share_card", { kind: "play" }); setSharing(false); }}>{sharing ? "…" : "⇪"} {P.hub.share}</button>
              <Link className="btn-ghost" href={h("/match/")}>{P.hub.compare}</Link>
            </div>
          )}
          {prof && prof.flags.length > 0 && <div className="mt-4 space-y-1">{prof.flags.map((f) => <p key={f} className="text-xs text-dim">◦ {P.hub.flags[f]}</p>)}</div>}
        </div>
      </section>
      {person && <div className="mt-8"><UnifiedGlance person={person} isMe={forId === "me"} compact /></div>}
      {prof && person && (
        <section className="mt-8">
          <h2 className="h-display mb-3 text-3xl"><span className="mr-2 text-gold">✦</span>{P.hub.sayPlay}</h2>
          <SayPlay play={prof} self={{ bigFive: person.quiz.bigFive, attachment: person.quiz.attachment }} />
        </section>
      )}
      <p className="mt-8 text-xs leading-relaxed text-dim">{P.hub.honest} {P.hub.compareText}</p>
      <p className="sr-only">{c.site.brand}</p>
    </div>
  );
}
