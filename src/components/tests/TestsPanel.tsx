"use client";
/** Tests inside the profile: every test with its status, run in place, so the visitor never has to leave /me/. */
import { useRef, useState } from "react";
import { useContent } from "@/lib/content-context";
import { subjectOf, useStore } from "@/lib/store";
import { runStatus, type RunRow, type TestId } from "@/lib/test-run";
import { Emblem } from "../art/Emblem";
import { emblemOf } from "../art/precisionArt";
import { QuizFlow } from "../QuizRunner";
import { DeepFlow } from "../adaptive/DeepRead";
import { RunCard, TestExtras, TestRun, useRunInfo } from "./TestRun";

const SHORT_LIST = 3;
const byPriority = (r: RunRow) => (r.state === "started" ? 0 : r.state === "todo" ? 1 : 2);

export function TestsPanel({ full }: { full?: boolean }) {
  const { c } = useContent(); const T = c.ui.tests; const s = useStore(); const info = useRunInfo();
  const [open, setOpen] = useState<TestId | "all" | null>(null);
  const [showAll, setShowAll] = useState(!!full);
  const root = useRef<HTMLElement>(null);
  const show = (x: typeof open) => { setOpen(x); requestAnimationFrame(() => root.current?.scrollIntoView({ block: "start" })); };
  if (!s) return null;
  const person = subjectOf(s)!; const st = runStatus(person.quiz, s.progress);
  const rows = showAll ? st.rows : [...st.rows].sort((a, b) => byPriority(a) - byPriority(b)).slice(0, SHORT_LIST);

  let body;
  if (open === "all") body = <TestRun embedded onExit={() => show(null)} />;
  else if (open) body = open === "adaptive" ? <DeepFlow key={open} embed="panel" onNext={show} /> : <QuizFlow key={open} id={open} embed="panel" onNext={show} />;
  else body = (
    <>
      <RunCard st={st} onOpen={() => show("all")} />
      <ul className="grid gap-2 sm:grid-cols-2">
        {rows.map((r) => (
          <li key={r.id}>
            <button type="button" onClick={() => show(r.id)} data-testid={`me-test-${r.id}`} className="flex w-full items-center gap-3 rounded-2xl border border-white/12 bg-white/[0.04] p-3 text-left transition active:scale-[.99] hover:border-gold/40">
              <Emblem id={r.id === "adaptive" ? "big-five" : emblemOf(r.id)} className="h-10 w-10 shrink-0" />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold">{r.state === "done" ? "✓ " : ""}{info.of(r.id).title}</span>
                <span className="block text-xs text-dim" data-testid={`me-test-status-${r.id}`}>{r.state === "done" ? T.status.done : r.state === "started" ? T.status.answered(r.answered) : c.ui.quizHub.min(info.of(r.id).minutes)}</span>
              </span>
              <span className={`shrink-0 text-xs ${r.state === "todo" ? "text-gold" : "text-mist/80"}`}>{r.state === "done" ? T.status.open : r.state === "started" ? T.status.resume : T.status.begin} →</span>
            </button>
          </li>
        ))}
      </ul>
      {!full && <button type="button" className="mt-2 text-sm text-gold underline decoration-dotted underline-offset-4" onClick={() => setShowAll(!showAll)} aria-expanded={showAll} data-testid="me-tests-more">{showAll ? T.status.showLess : T.status.showAll(st.total)}</button>}
      <TestExtras />
    </>
  );
  return (
    <section ref={root} className="mb-6 scroll-mt-24" data-testid="me-tests">
      {(!full || open) && (
        <div className="mb-3 flex items-baseline justify-between gap-3">
          {full ? <span /> : <h2 className="h-display text-3xl"><span className="mr-2 text-gold">✦</span>{T.me.title}</h2>}
          {open && <button type="button" className="shrink-0 text-sm text-dim underline decoration-dotted underline-offset-4" onClick={() => show(null)} data-testid="me-tests-back">{T.result.back}</button>}
        </div>
      )}
      {body}
    </section>
  );
}
