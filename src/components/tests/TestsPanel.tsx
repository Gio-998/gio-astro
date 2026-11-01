"use client";
/** Tests inside the profile: progress and the next step first, the full list one tap away, run in place, so the visitor never has to leave /me/. */
import { useRef, useState, type ReactNode } from "react";
import { useContent } from "@/lib/content-context";
import { subjectOf, useStore } from "@/lib/store";
import { runStatus, type TestId } from "@/lib/test-run";
import { Emblem } from "../art/Emblem";
import { emblemOf } from "../art/precisionArt";
import { QuizFlow } from "../QuizRunner";
import { DeepFlow } from "../adaptive/DeepRead";
import { RunBar, TestExtras, TestRun, useRunInfo } from "./TestRun";

const emblemFor = (id: TestId) => (id === "adaptive" ? "big-five" : emblemOf(id));

/** `children` is the rest of the page. It steps aside while a test is open, so nothing competes with the test and its result, and a page never shows a second lead form. */
export function TestsPanel({ children }: { children?: ReactNode }) {
  const { c } = useContent(); const T = c.ui.tests; const s = useStore(); const info = useRunInfo();
  const [open, setOpen] = useState<TestId | "all" | null>(null);
  const [showAll, setShowAll] = useState(false);
  const root = useRef<HTMLElement>(null);
  const show = (x: typeof open) => { setOpen(x); requestAnimationFrame(() => root.current?.scrollIntoView({ block: "start" })); };
  if (!s) return null;
  const person = subjectOf(s)!; const st = runStatus(person.quiz, s.progress);
  const next = st.next ? st.rows.find((r) => r.id === st.next)! : null;

  let body;
  if (open === "all") body = <TestRun embedded onExit={() => show(null)} />;
  else if (open) body = open === "adaptive" ? <DeepFlow key={open} embed="panel" onNext={show} /> : <QuizFlow key={open} id={open} embed="panel" onNext={show} />;
  else body = (
    <div className="card !p-4 sm:!p-5">
      <h2 className="h-display mb-1 text-3xl leading-tight"><span className="text-aurora">{T.me.title}</span></h2>
      {st.started ? <div className="mt-2"><RunBar st={st} /></div> : <p className="mb-3 text-sm text-mist/85">{T.all.sub(st.total, info.total)}</p>}
      {next ? (
        <button type="button" onClick={() => show(next.id)} data-testid="me-next-test" className="flex min-h-[76px] w-full items-center gap-3 rounded-2xl border border-gold/40 bg-gold/[0.08] px-3 py-2.5 text-left transition active:scale-[.99] hover:border-gold/70">
          <Emblem id={emblemFor(next.id)} className="h-9 w-9 shrink-0" />
          <span className="min-w-0 flex-1">
            <span className="eyebrow block truncate">{T.all.nextUp}</span>
            <span className="mt-0.5 block truncate font-display text-[1.3rem] leading-tight">{info.of(next.id).title}</span>
          </span>
          <span className="shrink-0 text-right">
            <span className="block text-sm font-semibold text-gold">{next.state === "started" ? T.status.resume : T.status.begin} →</span>
            <span className="block text-xs text-dim">{c.ui.quizHub.min(info.of(next.id).minutes)}</span>
          </span>
        </button>
      ) : <button type="button" className="btn-primary w-full !min-h-[48px]" onClick={() => show("all")} data-testid="run-start">{T.all.results}</button>}
      <div className="mt-1 flex flex-wrap items-center gap-x-5">
        {next && <button type="button" className="inline-flex min-h-[44px] items-center text-sm text-gold underline decoration-dotted underline-offset-4" onClick={() => show("all")} data-testid="run-start">{T.all.title}</button>}
        <button type="button" className="inline-flex min-h-[44px] items-center text-sm text-dim underline decoration-dotted underline-offset-4" onClick={() => setShowAll(!showAll)} aria-expanded={showAll} data-testid="me-tests-more">{showAll ? T.status.showLess : T.status.showAll(st.total)}</button>
      </div>
      {showAll && (
        <>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            {st.rows.map((r) => (
              <li key={r.id}>
                <button type="button" onClick={() => show(r.id)} data-testid={`me-test-${r.id}`} className="flex min-h-[60px] w-full items-center gap-3 rounded-2xl border border-white/12 bg-white/[0.04] p-3 text-left transition active:scale-[.99] hover:border-gold/40">
                  <Emblem id={emblemFor(r.id)} className="h-10 w-10 shrink-0" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{r.state === "done" ? "✓ " : ""}{info.of(r.id).title}</span>
                    <span className="block text-xs text-dim" data-testid={`me-test-status-${r.id}`}>{r.state === "done" ? T.status.done : r.state === "started" ? T.status.answered(r.answered) : c.ui.quizHub.min(info.of(r.id).minutes)}</span>
                  </span>
                  <span className={`shrink-0 text-xs ${r.state === "todo" ? "text-gold" : "text-mist/80"}`}>{r.state === "done" ? T.status.open : r.state === "started" ? T.status.resume : T.status.begin} →</span>
                </button>
              </li>
            ))}
          </ul>
          <TestExtras />
        </>
      )}
    </div>
  );
  return (
    <>
      <section ref={root} className={`scroll-mt-24 ${children && !open ? "mb-4" : ""}`} data-testid="me-tests">
        {open && (
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h2 className="h-display text-3xl"><span className="mr-2 text-gold">✦</span>{T.me.title}</h2>
            <button type="button" className="inline-flex min-h-[44px] shrink-0 items-center text-sm text-dim underline decoration-dotted underline-offset-4" onClick={() => show(null)} data-testid="me-tests-back">{T.result.back}</button>
          </div>
        )}
        {body}
      </section>
      {!open && children}
    </>
  );
}
