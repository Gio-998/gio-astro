"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { ResultReveal } from "./reveal/ResultReveal";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useContent, useHref } from "@/lib/content-context";
import { quizDefs, AnyQuizId, isPrecisionQuiz } from "@/lib/quiz-defs";
import { progressKey, repo, subjectOf, useStore, type TestProgress } from "@/lib/store";
import { EvidenceBadge } from "./ui";
import { AnimatePresence, motion } from "motion/react";
import { ArtCard, cosmos } from "./art/ArtCard";
import { Emblem } from "./art/Emblem";
import { Celebration } from "./art/Celebration";
import { artOf, emblemOf } from "./art/precisionArt";
import { PrecisionResultView } from "./PrecisionResult";
import { QuizResultView } from "./ProfileView";
import { quizViewOf } from "@/lib/profile";
import { cleanValues, nextTest, resumeIndex, testPath, type TestId } from "@/lib/test-run";
import { track } from "@/lib/track";
import { CertaintyCard, useAnswerTiming } from "./play/timing";
import { MethodLink } from "./nav/Trust";
import { ResultGate } from "./tests/ResultGate";

/** Where a test runs. Page: its own route. "panel": inside the profile. "run": inside the take-all run, where results wait for the end. */
export type Embed = "panel" | "run";
export interface FlowProps {
  personId?: string; embed?: Embed;
  /** Run: the test is done. */
  onFinish?: () => void;
  /** Panel: open another test in place instead of following a link. */
  onNext?: (id: TestId) => void;
}

export function QuizRunner({ id }: { id: AnyQuizId }) {
  const forId = useSearchParams().get("for") ?? "me";
  return <QuizFlow id={id} personId={forId} />;
}

export function QuizFlow({ id, personId = "me", embed, onFinish, onNext }: FlowProps & { id: AnyQuizId }) {
  const { c } = useContent(); const h = useHref(); const U = c.ui.quiz; const T = c.ui.tests;
  const def = useMemo(() => quizDefs(c)[id], [c, id]);
  const items = def.items;
  const s = useStore();
  const person = subjectOf(s, personId);
  const key = progressKey(personId, id);
  const saved = s?.progress[key];
  const Title = embed ? "h2" : "h1"; // the page around an embedded test has its own h1
  const reopen = (p?: TestProgress) => { const values = cleanValues(items, p?.values); return { values, index: resumeIndex(items, values) }; };
  // In a run the questions start at once, from wherever this test was left.
  const [first] = useState(() => (embed === "run" ? reopen(repo.getState().progress[key]) : null));
  // "open" lands on the result of a finished test and on the intro of any other.
  const [phase, setPhase] = useState<"open" | "run" | "done">(embed === "run" ? "run" : "open");
  const [i, setI] = useState(first?.index ?? 0);
  const [ans, setAns] = useState<Record<string, number>>(first?.values ?? {});
  // Answer timing + changes of mind (certainty signal, see engine/play/timing.ts).
  const tm = useAnswerTiming();
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => { if (embed === "run") tm.restore(repo.getState().progress[key]?.timing); }, [embed, key, tm]);
  useEffect(() => { const it = items[i]; if (phase === "run" && it) tm.shown(it.id); }, [phase, i, items, tm]);

  const toTop = () => { if (embed) root.current?.scrollIntoView({ block: "start", behavior: "smooth" }); else window.scrollTo({ top: 0, behavior: "smooth" }); };
  const begin = (p?: TestProgress) => { const r = reopen(p); tm.restore(p?.timing); setAns(r.values); setI(r.index); setPhase("run"); toTop(); };
  const startOver = () => { repo.clearProgress(personId, id); begin(); };

  if (!s) return <p className="text-dim">{c.site.common.loading}</p>;
  if (!person) return <p className="card mx-auto max-w-lg text-center text-dim">{c.ui.me.notFound}<Link className="underline" href={h("/people/")}>{c.ui.me.back}</Link></p>;
  const answer = (v: number) => {
    const it = items[i];
    tm.answered(it.id, it.text, v, ans[it.id]);
    const next = { ...ans, [it.id]: v };
    setAns(next);
    if (i + 1 < items.length) { repo.saveProgress({ personId, testId: id, values: next, timing: tm.dump() }); setI(i + 1); return; }
    repo.saveQuiz(person.id, { ...def.score(next), timing: { ...(person.quiz.timing ?? {}), [def.id]: tm.summary() } }, { quizId: def.id, values: next });
    track("quiz_done", { quiz: def.id, self: person.id === "me" });
    if (onFinish) onFinish(); else { setPhase("done"); toTop(); }
  };

  if (phase !== "run" && (phase === "done" || person.quiz[def.resultKey])) {
    const fresh = subjectOf(repo.getState(), personId)!;
    const view = quizViewOf(fresh); const just = phase === "done"; const panel = embed === "panel";
    const next = nextTest(fresh.quiz, id);
    return (
      <div className="relative scroll-mt-24" ref={root} data-testid="quiz-result">
        {just && <Celebration />}
        {just && !panel && <ResultReveal eyebrow={U.unlocked} title={def.title} subtitle={def.unlocks} emblem={String(id)} />}
        <div className="relative mb-8 text-center">
          <div className="pop relative mx-auto mb-4 grid h-24 w-24 place-items-center sm:h-32 sm:w-32">
            <div className="absolute inset-0 animate-pulse-glow rounded-full bg-gold/30 blur-2xl" />
            <div className="absolute inset-0 rounded-full border border-gold/50 bg-gradient-to-br from-indigo to-ink" />
            <Emblem id={emblemOf(id)} className="relative h-14 w-14 glow-gold sm:h-20 sm:w-20" />
          </div>
          <p className="eyebrow mb-2">{U.unlocked}</p>
          <Title className="h-display text-4xl sm:text-5xl"><span className="italic text-aurora">{def.title}</span></Title>
          <p className="mx-auto mt-2 max-w-md text-dim">{def.unlocks}</p>
        </div>
        <ResultGate id={id} person={fresh}>
          {isPrecisionQuiz(id) ? <PrecisionResultView id={id} person={fresh} profile={view} /> : <QuizResultView id={id} profile={view} pid={person.id} />}
          <CertaintyCard t={fresh.quiz.timing?.[def.id]} texts={Object.fromEntries(items.map((x) => [x.id, x.text.replace("{name}", person.name)]))} />
        </ResultGate>
        <div className="mt-3 flex flex-col items-center gap-3"><MethodLink /></div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {next && (panel && onNext
            ? <button type="button" className="btn-primary" onClick={() => onNext(next)} data-testid="quiz-next">{U.nextQuiz} →</button>
            : <Link className="btn-primary" href={h(`${testPath(next)}${personId === "me" ? "" : `?for=${personId}`}`)} data-testid="quiz-next">{U.nextQuiz} →</Link>)}
          {!panel && <Link className={next ? "btn-ghost" : "btn-primary"} href={h(person.id === "me" ? "/me/" : `/person/?id=${person.id}`)}>{U.seeProfile}</Link>}
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-1 text-sm">
          {saved && <button type="button" className="text-gold underline decoration-dotted underline-offset-4" onClick={() => begin(saved)} data-testid="quiz-retake-resume">{T.result.retakeResume}</button>}
          <button type="button" className="text-dim underline decoration-dotted underline-offset-4" onClick={startOver} data-testid="quiz-retake">{T.result.retake}</button>
        </div>
      </div>
    );
  }

  if (phase !== "run") {
    const resume = saved ? reopen(saved).index + 1 : 0;
    return (
      <div className={`scroll-mt-24 ${embed ? "" : "mx-auto grid max-w-4xl items-center gap-8 md:grid-cols-[280px_1fr]"}`} ref={root} data-testid="quiz-intro">
        {!embed && (
          <ArtCard img={artOf(id).img} tint={artOf(id).tint} emblem={emblemOf(id)} className="mx-auto hidden h-[380px] w-[260px] animate-float md:block">
            <p className="mt-auto h-display text-2xl leading-tight">{def.title}</p>
            <p className="text-[10px] uppercase tracking-[0.25em] text-gold/80">{U.qMin(items.length, def.minutes)}</p>
          </ArtCard>
        )}
        <div className="card">
          <div className="mb-3 flex flex-wrap items-center gap-2"><Emblem id={emblemOf(id)} className="h-8 w-8 shrink-0 glow-gold md:hidden" /><EvidenceBadge e={def.evidence} /><span className="chip">{U.min(def.minutes)}</span><span className="chip">{U.items(items.length)}</span></div>
          <Title className="h-display mb-2 text-4xl"><span className="text-aurora">{def.title}</span></Title>
          <p className="mb-2 text-lg">{def.tagline}</p>
          <p className="mb-4 text-dim">{def.intro}</p>
          {personId !== "me" && <p className="mb-4 rounded-xl bg-white/5 p-3 text-sm">{U.answeringA}<b>{person.name}</b>{U.answeringB}</p>}
          {saved ? (
            <>
              <p className="mb-3 text-sm text-mist/90" data-testid="quiz-resume-note">{T.intro.stoppedAt(resume, items.length)}</p>
              <button className="btn-primary w-full py-3.5 text-base" onClick={() => begin(saved)} data-testid="quiz-resume">{T.all.resume}</button>
              <button className="mt-2 w-full py-2 text-sm text-dim underline decoration-dotted underline-offset-4" onClick={startOver} data-testid="quiz-over">{T.intro.over}</button>
            </>
          ) : <button className="btn-primary w-full py-3.5 text-base" onClick={() => begin()} data-testid="quiz-begin">{U.begin}</button>}
          <p className="mt-4 text-sm text-dim">{U.unlocks(def.unlocks)}</p>
          {def.note && <p className="mt-3 text-xs text-dim">{def.note}</p>}
        </div>
      </div>
    );
  }

  const it = items[i];
  const cur = ans[it.id];
  return (
    <div className="card relative mx-auto min-h-[460px] max-w-2xl scroll-mt-24 overflow-hidden" ref={root} data-testid="quiz-run">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={cosmos(artOf(id).img)} alt="" className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover opacity-[0.14]" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 -z-10 h-72 w-72 rounded-full bg-violet/25 blur-3xl" />
      <Emblem id={emblemOf(id)} className="pointer-events-none absolute -right-10 -top-10 -z-10 h-56 w-56 opacity-[0.1]" />
      {items.length > 30 ? (
        <div className="mb-6 h-2 overflow-hidden rounded-full bg-white/10" aria-label={U.qOf(i + 1, items.length)}><div className="h-full rounded-full bg-gradient-to-r from-amber to-gold transition-all duration-500" style={{ width: `${(i / items.length) * 100}%` }} /></div>
      ) : (
      <div className="mb-6 flex items-center gap-1.5" aria-label={U.qOf(i + 1, items.length)}>
        {items.map((_, k) => <span key={k} className={`relative h-2 flex-1 rounded-full transition-all duration-500 ${k < i ? "bg-gradient-to-r from-amber to-gold shadow-[0_0_8px_rgba(246,207,122,.6)]" : k === i ? "bg-rose animate-pulse" : "bg-white/10"}`} />)}
      </div>
      )}
      <p className="eyebrow mb-2" data-testid="quiz-position">{def.title} · {i + 1} / {items.length}</p>
      <AnimatePresence mode="wait">
      <motion.div key={i} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.28 }}>
      <h2 className="h-display mb-7 text-3xl leading-snug">{it.text.replace("{name}", person.name)}</h2>
      {it.kind === "likert" && (
        <div className="grid gap-2">
          {it.scale.map((label, k) => (
            <button key={k} onClick={() => answer(k + 1)} className={`group rounded-2xl border px-5 py-3.5 text-left transition duration-200 hover:translate-x-1 active:scale-[.98] ${cur === k + 1 ? "border-gold bg-gold/15 shadow-[0_0_24px_-6px_rgba(246,207,122,.6)]" : "border-white/12 bg-white/[0.04] hover:border-gold/40 hover:bg-white/10"}`}>{label}</button>
          ))}
        </div>
      )}
      {it.kind === "choice" && (
        <div className="grid gap-2">
          {it.options.map((label, k) => (
            <button key={k} onClick={() => answer(k)} className={`group rounded-2xl border px-5 py-3.5 text-left transition duration-200 hover:translate-x-1 active:scale-[.98] ${cur === k ? "border-gold bg-gold/15 shadow-[0_0_24px_-6px_rgba(246,207,122,.6)]" : "border-white/12 bg-white/[0.04] hover:border-gold/40 hover:bg-white/10"}`}>{label}</button>
          ))}
        </div>
      )}
      {it.kind === "poles" && (
        <div>
          <div className="mb-3 flex justify-between gap-4 text-sm"><span className="max-w-[45%]">{it.left}</span><span className="max-w-[45%] text-right">{it.right}</span></div>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((v) => (
              <button key={v} onClick={() => answer(v)} className={`h-14 rounded-2xl border transition duration-200 hover:-translate-y-0.5 active:scale-95 ${cur === v ? "border-gold bg-gold/20 shadow-[0_0_24px_-6px_rgba(246,207,122,.6)]" : "border-white/12 bg-white/[0.04] hover:border-gold/40 hover:bg-white/10"}`} aria-label={`${v} of 5`}>
                <span className="mx-auto block rounded-full bg-gradient-to-br from-mist to-gold" style={{ width: 6 + Math.abs(v - 3) * 5, height: 6 + Math.abs(v - 3) * 5 }} />
              </button>
            ))}
          </div>
        </div>
      )}
      {it.kind === "pair" && (
        <div>
          {/* Stacked on a phone: two long statements in narrow columns read badly. */}
          <div className="grid gap-3 sm:grid-cols-2" data-testid="pair-statements">
            {[it.a, it.b].map((label, side) => (
              <div key={side} className={`rounded-2xl border p-4 text-[15px] leading-snug ${cur != null && (side === 0 ? cur <= 2 : cur >= 3) ? "border-gold/60 bg-gold/10" : "border-white/12 bg-white/[0.04]"}`}>{label}</div>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2" role="radiogroup" aria-label={it.text}>
            {[1, 2, 3, 4].map((v) => (
              <button key={v} role="radio" aria-checked={cur === v} onClick={() => answer(v)} className={`h-14 rounded-2xl border transition duration-200 hover:-translate-y-0.5 active:scale-95 ${cur === v ? "border-gold bg-gold/20 shadow-[0_0_24px_-6px_rgba(246,207,122,.6)]" : "border-white/12 bg-white/[0.04] hover:border-gold/40 hover:bg-white/10"}`} aria-label={it.scale[v - 1]}>
                <span className="mx-auto block rounded-full bg-gradient-to-br from-mist to-gold" style={{ width: v === 1 || v === 4 ? 18 : 10, height: v === 1 || v === 4 ? 18 : 10 }} />
              </button>
            ))}
          </div>
          <div className="mt-1.5 flex justify-between gap-3 text-[11px] text-dim sm:hidden"><span>{it.scale[0]}</span><span className="text-right">{it.scale[3]}</span></div>
          <p className="mt-2 text-center text-xs text-dim">{it.hint}</p>
        </div>
      )}
      </motion.div>
      </AnimatePresence>
      <div className="mt-6 flex justify-between">
        {i > 0 || embed !== "run" ? <button className="btn-ghost" onClick={() => (i > 0 ? setI(i - 1) : setPhase("open"))}>{c.site.common.back}</button> : <span />}
        {cur != null && i + 1 < items.length && <button className="btn-ghost" onClick={() => setI(i + 1)}>{c.site.common.next}</button>}
      </div>
    </div>
  );
}
