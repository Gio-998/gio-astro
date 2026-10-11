"use client";
import Link from "next/link";
import { useContent, useHref } from "@/lib/content-context";
import { quizDefs, QUIZ_IDS } from "@/lib/quiz-defs";
import { QUIZ_ART } from "../art/quizArt";
import { useStore } from "@/lib/store";
import { EvidenceBadge, PageHero } from "../ui";
import { ArtCard } from "../art/ArtCard";
import { Reveal } from "../art/Reveal";


export function QuizHub() {
  const { c } = useContent(); const h = useHref(); const s = useStore();
  const defs = quizDefs(c);
  const doneCount = QUIZ_IDS.filter((id) => s?.me?.quiz[defs[id].resultKey]).length;
  return (
    <div>
      <PageHero eyebrow="Seven quizzes · every result free" emblem="tarot" img="helix" title={<>Little rituals of <span className="italic text-aurora">self-discovery</span></>}
        sub="Every result is shown in full, free, the moment you finish. No email, no paywall at the end. Each one unlocks a new layer of your profile and your compatibility reports.">
        {s?.me && <div className="flex items-center gap-3"><div className="h-2 w-40 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-rose to-gold" style={{ width: `${(doneCount / 7) * 100}%` }} /></div><span className="text-sm text-dim">{doneCount} of 7 layers unlocked</span></div>}
      </PageHero>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {QUIZ_IDS.map((id, i) => {
          const d = defs[id]; const done = !!s?.me?.quiz[d.resultKey];
          return (
            <Reveal key={id} delay={(i % 3) * 0.06}>
              <Link href={h(`/quiz/${id}/`)} className="block h-full">
                <ArtCard img={QUIZ_ART[id].img} tint={QUIZ_ART[id].tint} emblem={id} className="h-full min-h-[330px] transition duration-500 hover:-translate-y-2">
                  <div className="mb-2 flex flex-wrap justify-center gap-1.5"><EvidenceBadge e={d.evidence} /><span className="chip">⏱ {d.minutes} min</span></div>
                  <p className="h-display mb-1 text-2xl leading-tight">{done ? "✓ " : ""}{d.title}</p>
                  <p className="mb-3 text-xs text-mist/75">{d.tagline}</p>
                  <span className={`mt-auto ${done ? "btn-ghost" : "btn-primary"} !py-1.5 text-xs`}>{done ? "Retake" : "Begin"} →</span>
                </ArtCard>
              </Link>
            </Reveal>
          );
        })}
        <Reveal delay={0.12}>
          <Link href={h("/bond/")} className="block h-full">
            <ArtCard img="twinjet" tint="rose" emblem="bond" className="h-full min-h-[330px] transition duration-500 hover:-translate-y-2">
              <div className="mb-2 flex flex-wrap justify-center gap-1.5"><EvidenceBadge e="research" /><span className="chip">⏱ 3 min each</span></div>
              <p className="h-display mb-1 text-2xl leading-tight">Bond Check (for two)</p>
              <p className="mb-3 text-xs text-mist/75">Both of you answer 8 questions about your bond — see strengths, gaps and practices side by side.</p>
              <span className="btn-primary mt-auto !py-1.5 text-xs">Begin →</span>
            </ArtCard>
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
