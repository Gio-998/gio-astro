"use client";
import Link from "next/link";
import { useContent, useHref } from "@/lib/content-context";
import { quizDefs, QUIZ_IDS } from "@/lib/quiz-defs";
import { QUIZ_ART } from "../art/quizArt";
import { useStore } from "@/lib/store";
import { EvidenceBadge, PageHero } from "../ui";
import { ArtCard } from "../art/ArtCard";
import { Reveal } from "../art/Reveal";
import { PrecisionLinks } from "../PrecisionResult";
import { PlayBanner } from "../play/PlayBanner";


export function QuizHub() {
  const { c } = useContent(); const h = useHref(); const s = useStore();
  const defs = quizDefs(c); const U = c.ui.quizHub;
  const doneCount = QUIZ_IDS.filter((id) => s?.me?.quiz[defs[id].resultKey]).length;
  return (
    <div>
      <PageHero eyebrow={U.eyebrow} emblem="tarot" img="helix" title={<>{U.titleA}<span className="italic text-aurora">{U.titleB}</span></>}
        sub={U.sub}>
        {s?.me && <div className="flex items-center gap-3"><div className="h-2 w-40 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-rose to-gold" style={{ width: `${(doneCount / 7) * 100}%` }} /></div><span className="text-sm text-dim">{U.layers(doneCount)}</span></div>}
      </PageHero>
      <PlayBanner />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {QUIZ_IDS.map((id, i) => {
          const d = defs[id]; const done = !!s?.me?.quiz[d.resultKey];
          return (
            <Reveal key={id} delay={(i % 3) * 0.06}>
              <Link href={h(`/quiz/${id}/`)} className="block h-full">
                <ArtCard img={QUIZ_ART[id].img} tint={QUIZ_ART[id].tint} emblem={id} className="h-full min-h-[330px] transition duration-500 hover:-translate-y-2">
                  <div className="mb-2 flex flex-wrap justify-center gap-1.5"><EvidenceBadge e={d.evidence} /><span className="chip">{U.min(d.minutes)}</span></div>
                  <p className="h-display mb-1 text-2xl leading-tight">{done ? "✓ " : ""}{d.title}</p>
                  <p className="mb-3 text-xs text-mist/75">{d.tagline}</p>
                  <span className={`mt-auto ${done ? "btn-ghost" : "btn-primary"} !py-1.5 text-xs`}>{done ? U.retake : U.begin} →</span>
                </ArtCard>
              </Link>
            </Reveal>
          );
        })}
        <Reveal delay={0.12}>
          <Link href={h("/bond/")} className="block h-full">
            <ArtCard img="twinjet" tint="rose" emblem="bond" className="h-full min-h-[330px] transition duration-500 hover:-translate-y-2">
              <div className="mb-2 flex flex-wrap justify-center gap-1.5"><EvidenceBadge e="research" /><span className="chip">{U.each}</span></div>
              <p className="h-display mb-1 text-2xl leading-tight">{U.bondTitle}</p>
              <p className="mb-3 text-xs text-mist/75">{U.bondText}</p>
              <span className="btn-primary mt-auto !py-1.5 text-xs">{U.begin} →</span>
            </ArtCard>
          </Link>
        </Reveal>
      </div>
      <div className="mt-10" data-testid="precision-hub">
        <h2 className="h-display mb-1 text-3xl"><span className="mr-2 text-gold">✦</span>{c.types.hub.title}</h2>
        <p className="mb-4 text-sm text-dim">{c.types.hub.sub}</p>
        <PrecisionLinks h={h} done={(id) => !!s?.me?.quiz[defs[id].resultKey]} />
      </div>
    </div>
  );
}
