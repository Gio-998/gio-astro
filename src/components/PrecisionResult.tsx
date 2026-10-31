"use client";
/** Results of the precision quizzes (28-item four-letter quiz, 50-item Big Five) and the "Sharper results" links. */
import Link from "next/link";
import type { Profile } from "@/engine/profile";
import type { QuizView } from "@/lib/profile";
import type { StoredPerson } from "@/lib/store";
import { useContent, useHref } from "@/lib/content-context";
import { PRECISION_QUIZ_IDS, PrecisionQuizId, quizDefs } from "@/lib/quiz-defs";
import { DICHOTOMIES } from "@/engine/fourletter-quiz";
import { Bar, EvidenceBadge } from "./ui";
import { Emblem } from "./art/Emblem";
import { emblemOf } from "./art/precisionArt";
import { FitCheck, BigFiveSourceNote } from "./FitCheck";
import { QuizResultView } from "./ProfileView";

export function FourLetterCard({ profile, pid = "me" }: { profile: QuizView; pid?: string }) {
  const { c } = useContent(); const P = c.psych; const R = c.types.result; const U = c.ui.profile;
  const fl = profile.fourLetter; if (!fl) return null;
  const quiz = profile.quiz.fourLetter;
  const style = P.fourLetterStyles[fl.code];
  const clarity = quiz?.clarity ?? fl.clarity;
  const borderline = DICHOTOMIES.some((d) => clarity[d] < 15);
  return (
    <div className="card" data-testid="fourletter-card">
      <div className="mb-2 flex items-center justify-between"><h3 className="text-sm font-semibold text-dim">{U.fourLetter}</h3><EvidenceBadge e="popular" /></div>
      <p className="h-display text-[1.75rem] leading-tight text-gold">{fl.code} · {style?.name}</p>
      <p className="mt-1 text-sm">{style?.text}</p>
      {quiz && (
        <div className="mt-3 grid gap-1">
          {DICHOTOMIES.map((d) => {
            const letter = quiz.code[DICHOTOMIES.indexOf(d)];
            return <Bar key={d} value={50 + (quiz.sums[d] / 14) * 50} label={`${d[0]} ${P.letters[d[0]].split(/[:,]/)[0]} ↔ ${P.letters[d[1]].split(/[:,]/)[0]} ${d[1]}`} right={R.clarityLine(letter, R.clarityWord(quiz.clarity[d]), quiz.clarity[d])} />;
          })}
        </div>
      )}
      {borderline && <p className="mt-2 text-xs text-dim">{R.borderline}</p>}
      <FitCheck kind="fourLetter" profile={profile} pid={pid} />
    </div>
  );
}

export function PrecisionResultView({ id, person, profile }: { id: PrecisionQuizId; person: StoredPerson; profile: QuizView }) {
  if (id === "four-letter") return <FourLetterCard profile={profile} pid={person.id} />;
  return <div><QuizResultView id="big-five" profile={profile} pid={person.id} /><BigFiveSourceNote profile={profile} pid={person.id} /></div>;
}

/** Links to the two longer quizzes; shows the four-letter card when there is no Big Five card to carry it. */
export function PrecisionSection({ person, profile }: { person: StoredPerson; profile: Profile }) {
  const { c } = useContent(); const h = useHref(); const T = c.types; const defs = quizDefs(c);
  const forQ = person.id === "me" ? "" : `?for=${person.id}`;
  return (
    <section className="mt-12" data-testid="precision-section">
      <div className="mb-4 border-b border-white/10 pb-3"><h2 className="h-display text-3xl"><span className="mr-2 text-gold">✦</span>{T.hub.title}</h2><p className="text-sm text-dim">{T.hub.sub}</p></div>
      {profile.quiz.fourLetter && !profile.psych && <div className="mb-4"><FourLetterCard profile={profile} pid={person.id} /></div>}
      <PrecisionLinks forQ={forQ} done={(id) => !!profile.quiz[defs[id].resultKey]} h={h} />
    </section>
  );
}

export function PrecisionLinks({ forQ = "", done, h }: { forQ?: string; done: (id: PrecisionQuizId) => boolean; h: (p: string) => string }) {
  const { c } = useContent(); const defs = quizDefs(c); const U = c.ui.quizHub;
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {PRECISION_QUIZ_IDS.map((id) => {
        const d = defs[id]; const ok = done(id);
        return (
          <Link key={id} href={h(`/quiz/${id}/${forQ}`)} className="card flex items-center gap-3 transition hover:-translate-y-0.5" data-testid={`precision-${id}`}>
            <Emblem id={emblemOf(id)} className="h-14 w-14 shrink-0 glow-gold" />
            <div className="min-w-0">
              <p className="h-display text-xl leading-tight">{ok ? "✓ " : ""}{d.title}</p>
              <p className="text-xs text-dim">{d.tagline}</p>
              <span className="mt-1 inline-block text-xs text-gold">{ok ? c.ui.tests.status.open : U.begin} · {U.min(d.minutes)} →</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
