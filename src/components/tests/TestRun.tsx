"use client";
/** Take all tests: one guided run across the questionnaires and Deep Read. Its position comes from results and saved answers, so leaving and coming back needs no state of its own. */
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { MAX_ITEMS } from "@/engine/adaptive";
import { useContent, useHref } from "@/lib/content-context";
import { isPrecisionQuiz, quizDefs, type QuizDef } from "@/lib/quiz-defs";
import { quizViewOf } from "@/lib/profile";
import { subjectOf, useStore, type StoredPerson } from "@/lib/store";
import { TEST_RUN, runFraction, runStatus, type RunStatus, type TestId } from "@/lib/test-run";
import { QuizFlow } from "../QuizRunner";
import { QuizResultView } from "../ProfileView";
import { PrecisionResultView } from "../PrecisionResult";
import { DeepFlow, DeepResultBody } from "../adaptive/DeepRead";
import { useAdaptive } from "../adaptive/text";
import { usePlay } from "../play/text";
import { ResultsGate } from "./ResultGate";

const DEEP_MINUTES = 4;

/** Titles, sizes and minutes for every test in the run. */
export function useRunInfo() {
  const { c } = useContent(); const A = useAdaptive();
  return useMemo(() => {
    const defs = quizDefs(c) as Record<string, QuizDef>;
    const of = (id: TestId) => (id === "adaptive"
      ? { title: A.hub.title, tagline: A.hub.tagline, intro: A.hero.sub, minutes: DEEP_MINUTES, size: MAX_ITEMS }
      : { title: defs[id].title, tagline: defs[id].tagline, intro: defs[id].intro, minutes: defs[id].minutes, size: defs[id].items.length });
    const sizes = Object.fromEntries(TEST_RUN.map((id) => [id, of(id).size])) as Record<TestId, number>;
    const total = TEST_RUN.reduce((n, id) => n + of(id).minutes, 0);
    return { of, sizes, total };
  }, [c, A]);
}

export function RunBar({ st, label }: { st: RunStatus; label?: string }) {
  const { c } = useContent(); const T = c.ui.tests.all; const info = useRunInfo();
  const left = st.rows.filter((r) => r.state !== "done").reduce((n, r) => n + info.of(r.id).minutes, 0);
  return (
    <div className="mb-4" data-testid="run-bar">
      <div className="mb-1.5 flex justify-between gap-3 text-xs text-dim"><span data-testid="run-count">{label ?? T.progress(st.done, st.total)}</span>{left > 0 && <span>{T.left(left)}</span>}</div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-rose to-gold transition-all duration-500" style={{ width: `${Math.round(runFraction(st, info.sizes) * 100)}%` }} /></div>
    </div>
  );
}

/** The way into the run: on /quizzes/ it is a link, in the profile it opens in place. */
export function RunCard({ st, href, onOpen }: { st: RunStatus; href?: string; onOpen?: () => void }) {
  const { c } = useContent(); const T = c.ui.tests.all; const info = useRunInfo();
  const label = st.complete ? T.results : st.started ? T.resume : T.start;
  const cls = "btn-primary mt-1 w-full py-3 text-center text-base sm:w-auto sm:px-8";
  return (
    <section className="mb-5 rounded-[28px] border border-gold/40 bg-gradient-to-br from-violet/30 via-ink/80 to-gold/10 p-5" data-testid="run-card">
      <h2 className="h-display text-3xl leading-tight"><span className="text-aurora">{T.title}</span></h2>
      <p className="mb-3 mt-1 text-sm text-mist/85">{T.sub(st.total, info.total)}</p>
      {st.started && <RunBar st={st} />}
      {href ? <Link className={`${cls} block sm:inline-block`} href={href} data-testid="run-start">{label}</Link> : <button type="button" className={cls} onClick={onOpen} data-testid="run-start">{label}</button>}
    </section>
  );
}

/** Games and Bond Check: never part of the run, always offered after it. */
export function TestExtras() {
  const { c } = useContent(); const E = c.ui.tests.extras; const h = useHref(); const P = usePlay();
  const rows: [string, string, string][] = [["/play/", P.brand, E.games], ["/bond/", c.ui.quizHub.bondTitle, E.bond]];
  return (
    <section className="mt-8" data-testid="test-extras">
      <p className="eyebrow mb-1">✦ {E.title}</p>
      <p className="mb-3 text-sm text-dim">{E.sub}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {rows.map(([href, title, text]) => (
          <Link key={href} href={h(href)} className="block rounded-2xl border border-white/12 bg-white/[0.04] p-3 transition hover:border-gold/40">
            <span className="block font-semibold">{title}</span>
            <span className="block text-sm text-mist/75">{text}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function OneResult({ id, person }: { id: TestId; person: StoredPerson }) {
  const view = quizViewOf(person);
  if (id === "adaptive") return person.quiz.adaptive ? <DeepResultBody r={person.quiz.adaptive} /> : null;
  return isPrecisionQuiz(id) ? <PrecisionResultView id={id} person={person} profile={view} /> : <QuizResultView id={id} profile={view} pid={person.id} />;
}

function RunResults({ person, st, embedded, onMore, onExit }: { person: StoredPerson; st: RunStatus; embedded?: boolean; onMore: () => void; onExit: () => void }) {
  const { c } = useContent(); const T = c.ui.tests.all; const info = useRunInfo(); const Title = embedded ? "h2" : "h1";
  return (
    <div data-testid="run-results">
      <div className="mb-6 text-center">
        <p className="eyebrow mb-1">{T.progress(st.done, st.total)}</p>
        <Title className="h-display text-4xl"><span className="text-aurora">{st.complete ? T.doneTitle : T.partTitle}</span></Title>
        <p className="mt-2 text-sm text-dim">{T.doneSub}</p>
      </div>
      <ResultsGate person={person}>
        <div className="space-y-8">
          {st.rows.filter((r) => r.state === "done").map((r) => (
            <section key={r.id} data-testid={`run-result-${r.id}`}>
              <h2 className="h-display mb-3 text-3xl"><span className="mr-2 text-gold">✦</span>{info.of(r.id).title}</h2>
              <OneResult id={r.id} person={person} />
            </section>
          ))}
        </div>
      </ResultsGate>
      {!st.complete && <button type="button" className="btn-primary mt-6 w-full py-3 text-base" onClick={onMore} data-testid="run-more">{T.more} ✦</button>}
      <button type="button" className="mt-3 w-full py-2 text-sm text-dim underline decoration-dotted underline-offset-4" onClick={onExit} data-testid="run-leave">{c.ui.tests.result.back}</button>
      <TestExtras />
    </div>
  );
}

export function TestRun({ embedded, onExit }: { embedded?: boolean; onExit: () => void }) {
  const { c } = useContent(); const T = c.ui.tests.all; const s = useStore(); const info = useRunInfo();
  const [view, setView] = useState<"step" | "test" | "results">("step");
  const [current, setCurrent] = useState<TestId | null>(null);
  const [finished, setFinished] = useState<TestId | null>(null);
  const top = useRef<HTMLDivElement>(null);
  const go = (v: typeof view) => { setView(v); requestAnimationFrame(() => top.current?.scrollIntoView({ block: "start" })); };
  if (!s) return <p className="text-dim">{c.site.common.loading}</p>;
  const person = subjectOf(s)!; const st = runStatus(person.quiz, s.progress);

  let body;
  if (view === "results" || st.complete) body = <RunResults person={person} st={st} embedded={embedded} onMore={() => go("step")} onExit={onExit} />;
  else if (view === "test" && current) {
    const done = () => { setFinished(current); setCurrent(null); go("step"); };
    const position = st.rows.filter((r) => r.state === "done").length + 1;
    body = (
      <>
        <RunBar st={st} label={T.step(position, st.total)} />
        {current === "adaptive" ? <DeepFlow key={current} embed="run" onFinish={done} /> : <QuizFlow key={current} id={current} embed="run" onFinish={done} />}
        <button type="button" className="mt-4 w-full py-2 text-center text-sm text-dim underline decoration-dotted underline-offset-4" onClick={onExit} data-testid="run-leave">{T.leave}</button>
      </>
    );
  } else {
    const next = st.next!; const n = info.of(next); const open = st.rows.find((r) => r.id === next)!;
    body = (
      <div className="mx-auto max-w-xl" data-testid="run-step">
        {!finished && !st.started && !embedded && <h1 className="h-display mb-2 text-4xl"><span className="text-aurora">{T.title}</span></h1>}
        {!finished && !st.started && !embedded && <p className="mb-4 text-sm text-mist/85">{T.sub(st.total, info.total)}</p>}
        <RunBar st={st} />
        {finished && <p className="mb-3 rounded-2xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm" role="status" data-testid="run-saved">{T.saved(info.of(finished).title)}</p>}
        <div className="card">
          <p className="eyebrow mb-1">{T.nextUp} · {c.ui.quizHub.min(n.minutes)}</p>
          <h2 className="h-display mb-1 text-3xl leading-tight" data-testid="run-next-title">{n.title}</h2>
          <p className="mb-1 text-mist/90">{n.tagline}</p>
          <p className="mb-4 text-sm text-dim">{n.intro}</p>
          <button type="button" className="btn-primary w-full py-3.5 text-base" onClick={() => { setCurrent(next); go("test"); }} data-testid="run-continue">{open.state === "started" || st.done ? T.resume : T.start}</button>
        </div>
        {st.done > 0 && <button type="button" className="btn-ghost mt-3 w-full py-3" onClick={() => go("results")} data-testid="run-stop">{T.stop}</button>}
        <button type="button" className="mt-2 w-full py-2 text-center text-sm text-dim underline decoration-dotted underline-offset-4" onClick={onExit} data-testid="run-leave">{T.leave}</button>
      </div>
    );
  }
  return <div ref={top} className={`scroll-mt-24 ${embedded ? "" : "pt-2"}`} data-testid="test-run">{body}</div>;
}
