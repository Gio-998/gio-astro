"use client";
import Link from "next/link";
import { useContent, useHref } from "@/lib/content-context";
import { quizDefs, QUIZ_IDS } from "@/lib/quiz-defs";
import { useStore } from "@/lib/store";
import { EvidenceBadge } from "../ui";

export function QuizHub() {
  const { c } = useContent(); const h = useHref(); const s = useStore();
  const defs = quizDefs(c);
  return (
    <div>
      <h1 className="h-display mb-1 text-4xl text-gold">Quizzes</h1>
      <p className="mb-6 text-dim">Every result is shown in full, free, the moment you finish. No email, no paywall at the end. Each one unlocks a new layer of your profile and your compatibility reports.</p>
      <div className="grid gap-3">
        {QUIZ_IDS.map((id) => {
          const d = defs[id]; const done = !!s?.me?.quiz[d.resultKey];
          return (
            <Link key={id} href={h(`/quiz/${id}/`)} className="card flex items-center justify-between gap-3 hover:border-gold/40">
              <div>
                <div className="mb-1 flex flex-wrap items-center gap-2"><span className="font-semibold">{done ? "✓ " : ""}{d.title}</span><EvidenceBadge e={d.evidence} /><span className="chip">⏱ {d.minutes} min</span></div>
                <p className="text-sm text-dim">{d.tagline}</p>
              </div>
              <span className="text-gold">{done ? "Retake" : "Start"} →</span>
            </Link>
          );
        })}
        <Link href={h("/bond/")} className="card flex items-center justify-between gap-3 hover:border-gold/40">
          <div><div className="mb-1 flex flex-wrap items-center gap-2"><span className="font-semibold">Bond Check (for two)</span><EvidenceBadge e="research" /><span className="chip">⏱ 3 min each</span></div><p className="text-sm text-dim">Both of you answer 8 questions about your bond — see strengths, gaps and practices side by side.</p></div>
          <span className="text-gold">Start →</span>
        </Link>
      </div>
    </div>
  );
}
