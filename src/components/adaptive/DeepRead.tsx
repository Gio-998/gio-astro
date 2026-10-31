"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { TRAITS, type Trait } from "@/engine/bigfive";
import { GUT_LIMIT_MS, MAX_ITEMS, flattenAnswers, nextItem, scoreAdaptive, type AAnswer, type AItem, type AdaptiveResult } from "@/engine/adaptive";
import { useContent, useHref } from "@/lib/content-context";
import { progressKey, repo, subjectOf, useStore, type StoredPerson, type TestProgress } from "@/lib/store";
import { cleanSeq, nextTest, testPath } from "@/lib/test-run";
import { track } from "@/lib/track";
import { PageHero } from "../ui";
import { Celebration } from "../art/Celebration";
import { haptic, HAPTIC, now, useReduce } from "../play/fx";
import { useAdaptive } from "./text";
import { UnifiedGlance } from "./UnifiedGlance";
import { ResultGate } from "../tests/ResultGate";
import type { FlowProps } from "../QuizRunner";

/** Deterministic left/right swap so the "high" option isn't always first. */
const flip = (id: string) => [...id].reduce((s, ch) => s + ch.charCodeAt(0), 0) % 2 === 1;
const lvl = (p: number) => (p >= 62 ? "high" : p <= 38 ? "low" : "mid") as "low" | "mid" | "high";

function Option({ main, cost, costLabel, onClick, testId }: { main: string; cost: string; costLabel: string; onClick: () => void; testId: string }) {
  return (
    <button type="button" onClick={onClick} data-testid={testId}
      className="group relative w-full overflow-hidden rounded-3xl border border-white/12 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-4 text-left transition duration-150 active:scale-[.98] hover:border-gold/50">
      <span className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-violet/25 blur-2xl transition group-hover:bg-gold/25" />
      <span className="relative block text-[16px] font-semibold leading-snug text-mist">{main}</span>
      <span className="relative mt-1.5 block text-[13px] leading-snug text-rose/90"><span className="mr-1 text-[10px] uppercase tracking-[.18em] text-dim">{costLabel}</span>{cost}</span>
    </button>
  );
}

function GutItem({ item, onAnswer }: { item: AItem; onAnswer: (v: 0 | 1 | 2, ms: number) => void }) {
  const A = useAdaptive(); const reduce = useReduce(); const t0 = useRef(0); const done = useRef(false);
  const [left, setLeft] = useState(1);
  useEffect(() => {
    t0.current = now(); done.current = false;
    const id = setInterval(() => {
      const f = 1 - (now() - t0.current) / GUT_LIMIT_MS; setLeft(Math.max(0, f));
      if (f <= 0 && !done.current) { done.current = true; clearInterval(id); haptic(HAPTIC.bad, reduce); onAnswer(0, GUT_LIMIT_MS); }
    }, 50);
    return () => clearInterval(id);
  }, [item.id, onAnswer, reduce]);
  const pick = (v: 1 | 2) => { if (done.current) return; done.current = true; haptic(HAPTIC.tap, reduce); onAnswer(v, Math.round(now() - t0.current)); };
  return (
    <div data-testid="deep-gut">
      <p className="eyebrow mb-2 text-center !text-gold">⚡ {A.ui.gut}</p>
      <div className="mx-auto mb-5 h-1.5 w-full overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-rose to-gold" style={{ width: `${left * 100}%` }} /></div>
      <p className="h-display mb-6 text-balance text-center text-[1.9rem] leading-tight">“{A.gut[item.id]}”</p>
      <div className="grid grid-cols-2 gap-3">
        <button type="button" className="min-h-[64px] rounded-3xl border border-white/15 bg-white/[0.05] text-base font-semibold active:scale-95" onClick={() => pick(2)} data-testid="gut-no">{A.ui.no}</button>
        <button type="button" className="min-h-[64px] rounded-3xl border border-gold/50 bg-gold/15 text-base font-semibold text-gold active:scale-95" onClick={() => pick(1)} data-testid="gut-yes">{A.ui.yes}</button>
      </div>
      <p className="mt-3 text-center text-xs text-dim">{A.ui.gutHint}</p>
    </div>
  );
}

export function TraitSlider({ t, r, i }: { t: Trait; r: AdaptiveResult; i: number }) {
  const A = useAdaptive(); const T = A.traits[t]; const reduce = useReduce(); const p = r.pct[t]; const c = r.conf[t];
  const sureWord = A.result.surely[c >= 0.7 ? 2 : c >= 0.45 ? 1 : 0];
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4" data-testid={`deep-trait-${t}`}>
      <div className="mb-2 flex items-baseline justify-between"><p className="h-display text-xl">{T.name}</p><span className="text-[11px] text-dim">{A.result.sure}: {sureWord}</span></div>
      <div className="mb-1 flex justify-between text-xs text-dim"><span>{T.poles[0]}</span><span>{T.poles[1]}</span></div>
      <div className="relative mb-3 h-3 rounded-full bg-white/[0.07]">
        <motion.span className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold ring-2 ring-white/70" style={{ boxShadow: `0 0 ${6 + 14 * c}px #f6cf7a`, opacity: 0.5 + 0.5 * c }}
          initial={reduce ? false : { left: "50%" }} animate={{ left: `${p}%` }} transition={{ duration: 1, delay: 0.1 * i, ease: [0.16, 1, 0.3, 1] }} />
      </div>
      <p className="text-[14px] leading-relaxed text-mist/90">{T.text[lvl(p)]}</p>
    </div>
  );
}

/** The result itself, also used in the take-all summary. */
export function DeepResultBody({ r }: { r: AdaptiveResult }) {
  const A = useAdaptive(); const R = A.result;
  const same = Math.round(r.consistency * r.twins);
  return (
    <>
      <div className="mb-6 text-center">
        <p className="mt-3 text-sm text-dim">{R.code}</p>
        <p className="h-display mt-1 text-5xl tracking-[.2em] text-gold" data-testid="deep-code">{r.code}</p>
      </div>
      <div className="space-y-3">{TRAITS.map((t, i) => <TraitSlider key={t} t={t} r={r} i={i} />)}</div>
      <div className="mt-4 space-y-1.5 text-sm text-mist/85">
        {r.twins > 0 && <p>✦ {R.consistent(same, r.twins)}</p>}
        {r.gutMs > 0 && <p>✦ {r.gutMs <= 1800 ? R.gutFast : R.gutSlow}</p>}
        {r.flags.map((f) => <p key={f} className="text-xs text-dim">◦ {R.flags[f]}</p>)}
      </div>
    </>
  );
}

function Result({ r, person, fresh, retake, resume, panel, onNext }: { r: AdaptiveResult; person: StoredPerson; fresh: boolean; retake: () => void; resume?: () => void; panel: boolean; onNext?: FlowProps["onNext"] }) {
  const A = useAdaptive(); const { c } = useContent(); const h = useHref(); const reduce = useReduce(); const R = A.result; const T = c.ui.tests;
  const next = nextTest(person.quiz, "adaptive"); const Title = panel ? "h2" : "h1";
  return (
    <div className="mx-auto max-w-xl" data-testid="deep-result">
      {fresh && !reduce && <Celebration count={18} />}
      <div className="mb-6 text-center">
        <p className="eyebrow mb-1">{R.eyebrow}</p>
        <Title className="h-display text-4xl"><span className="text-aurora">{R.title}</span></Title>
      </div>
      <ResultGate id="adaptive" person={person}>
        <DeepResultBody r={r} />
        <div className="mt-8"><UnifiedGlance person={person} isMe={person.id === "me"} /></div>
      </ResultGate>
      <div className="mt-6 grid gap-2">
        {next && (panel && onNext
          ? <button type="button" className="btn-primary py-3 text-center" onClick={() => onNext(next)} data-testid="quiz-next">{c.ui.quiz.nextQuiz} →</button>
          : <Link className="btn-primary py-3 text-center" href={h(`${testPath(next)}${person.id === "me" ? "" : `?for=${person.id}`}`)} data-testid="quiz-next">{c.ui.quiz.nextQuiz} →</Link>)}
        <Link className={`${next ? "btn-ghost" : "btn-primary"} py-3 text-center`} href={h(person.id === "me" ? "/play/" : `/play/?for=${person.id}`)}>{R.play} ✦</Link>
        {!panel && <Link className="btn-ghost py-3 text-center" href={h(person.id === "me" ? "/me/" : `/person/?id=${person.id}`)}>{R.toAll}</Link>}
        {resume && <button type="button" className="py-2 text-sm text-gold underline decoration-dotted underline-offset-4" onClick={resume} data-testid="deep-retake-resume">{T.result.retakeResume}</button>}
        <button type="button" className="py-2 text-sm text-dim underline decoration-dotted underline-offset-4" onClick={retake} data-testid="deep-retake">{T.result.retake}</button>
      </div>
      <p className="mt-6 text-center text-xs text-dim">{R.honest}</p>
    </div>
  );
}

export function DeepRead() {
  const forId = useSearchParams().get("for") ?? "me";
  return <DeepFlow personId={forId} />;
}

export function DeepFlow({ personId = "me", embed, onFinish, onNext }: FlowProps) {
  const A = useAdaptive(); const { c } = useContent(); const h = useHref(); const s = useStore(); const reduce = useReduce(); const T = c.ui.tests;
  const person = subjectOf(s, personId); const key = progressKey(personId, "adaptive"); const saved = s?.progress[key];
  // In a run the questions start at once, from wherever this test was left.
  const [phase, setPhase] = useState<"intro" | "run" | "done">(embed === "run" ? "run" : "intro");
  const [ans, setAns] = useState<AAnswer[]>(() => (embed === "run" ? cleanSeq(repo.getState().progress[key]?.seq) : []));
  const [res, setRes] = useState<AdaptiveResult | null>(null);
  const shown = useRef(0); const [note, setNote] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const item = useMemo(() => (phase === "run" ? nextItem(ans) : null), [phase, ans]);
  useEffect(() => { shown.current = now(); }, [item?.id]);
  const toTop = () => { if (embed) root.current?.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" }); else window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); };

  const finish = (all: AAnswer[]) => {
    if (!person) return;
    const r = scoreAdaptive(all);
    repo.saveQuiz(person.id, { adaptive: r }, { quizId: "adaptive", values: flattenAnswers(all) });
    track("quiz_done", { quiz: "adaptive", self: person.id === "me" });
    haptic(HAPTIC.win, reduce);
    if (onFinish) { onFinish(); return; }
    setRes(r); setPhase("done"); toTop();
  };
  const begin = (p?: TestProgress) => {
    const seq = cleanSeq(p?.seq);
    if (seq.length && !nextItem(seq)) { finish(seq); return; }
    setAns(seq); setRes(null); setPhase("run"); toTop();
  };
  const startOver = () => { repo.clearProgress(personId, "adaptive"); begin(); };
  const answer = (v: 0 | 1 | 2, ms?: number) => {
    if (!item) return;
    const next = [...ans, { id: item.id, v, ms: ms ?? Math.round(now() - shown.current) }];
    if (v === 0) { setNote(A.ui.timeout); setTimeout(() => setNote(null), 1400); }
    if (!nextItem(next)) { finish(next); return; }
    repo.saveProgress({ personId, testId: "adaptive", seq: next });
    setAns(next);
  };
  // Stable callback for the gut timer.
  const answerRef = useRef(answer); useEffect(() => { answerRef.current = answer; });
  const gutAnswer = useMemo(() => (v: 0 | 1 | 2, ms: number) => answerRef.current(v, ms), []);

  if (!s) return <p className="text-dim">{c.site.common.loading}</p>;
  if (!person) return <p className="card mx-auto max-w-lg text-center text-dim">{c.ui.me.notFound}<Link className="underline" href={h("/people/")}>{c.ui.me.back}</Link></p>;
  const result = phase === "done" ? res : phase === "intro" ? person.quiz.adaptive : null;
  if (result) return <div className="scroll-mt-24" ref={root}><Result r={result} person={person} fresh={phase === "done"} retake={startOver} resume={saved ? () => begin(saved) : undefined} panel={embed === "panel"} onNext={onNext} /></div>;

  if (phase === "run" && item) {
    const k = ans.length; const progress = Math.min(0.97, k / (MAX_ITEMS - 2));
    const D = item.kind === "dilemma" ? A.dilemmas[item.id] : null; const swap = flip(item.id);
    const opts = D ? (swap ? [["b", D.b], ["a", D.a]] : [["a", D.a], ["b", D.b]]) as [string, [string, string]][] : [];
    return (
      <div className="mx-auto max-w-md scroll-mt-24 pt-2" ref={root} data-testid="deep-run">
        <div className="relative overflow-hidden rounded-[30px] border border-white/15 bg-gradient-to-b from-ink/90 via-night/95 to-ink/90 p-5 shadow-[0_30px_80px_-40px_rgba(139,108,240,.9)]">
          <div className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full bg-violet/25 blur-3xl" />
          <div className="relative mb-4">
            <div className="mb-1.5 flex justify-between text-[11px] text-dim"><span className="eyebrow !text-[10px]">{progress > 0.75 ? A.ui.almost : A.ui.progress}</span><span>{k + 1}</span></div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10"><motion.div className="h-full rounded-full bg-gradient-to-r from-violet to-gold" animate={{ width: `${progress * 100}%` }} /></div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={item.id} className="relative" initial={reduce ? false : { opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={reduce ? { opacity: 0 } : { opacity: 0, x: -24 }} transition={{ duration: 0.22 }}>
              {item.kind === "gut" ? <GutItem item={item} onAnswer={gutAnswer} /> : (
                <div data-testid="deep-dilemma">
                  {item.twin && <p className="mb-1 text-center text-[11px] text-dim">↺ {A.ui.twin}</p>}
                  <p className="eyebrow mb-2 text-center">{A.ui.dilemma}</p>
                  <p className="h-display mb-5 text-balance text-center text-[1.75rem] leading-tight">{D!.q}</p>
                  <div className="space-y-3">{opts.map(([k2, [main, cost]]) => <Option key={k2} main={main} cost={cost} costLabel={A.ui.cost} testId={`deep-opt-${k2}`} onClick={() => { haptic(HAPTIC.tap, reduce); answer(k2 === "a" ? 1 : 2); }} />)}</div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          <p className="relative mt-3 min-h-[18px] text-center text-xs text-dim" aria-live="polite">{note}</p>
        </div>
      </div>
    );
  }

  const start = saved ? (
    <>
      <p className="mb-3 text-sm text-mist/90" data-testid="deep-resume-note">{T.intro.stoppedDeep(cleanSeq(saved.seq).length)}</p>
      <button type="button" className="btn-primary px-6 py-3.5 text-base" data-testid="deep-resume" onClick={() => { haptic(HAPTIC.tap, reduce); begin(saved); }}>{T.all.resume}</button>
      <button type="button" className="ml-3 text-sm text-dim underline decoration-dotted underline-offset-4" data-testid="deep-over" onClick={startOver}>{T.intro.over}</button>
    </>
  ) : (
    <>
      <button type="button" className="btn-primary px-6 py-3.5 text-base" data-testid="deep-begin" onClick={() => { haptic(HAPTIC.tap, reduce); begin(); }}>{A.begin} ✦</button>
      <span className="ml-3 text-sm text-dim">{A.minutes}</span>
    </>
  );
  return (
    <div className="scroll-mt-24" ref={root} data-testid="deep-intro">
      {embed ? (
        <div className="card mb-4">
          <h2 className="h-display mb-2 text-3xl"><span className="text-aurora">{A.hub.title}</span></h2>
          <p className="mb-4 text-sm text-mist/85">{A.hero.sub}</p>
          {start}
        </div>
      ) : <PageHero eyebrow={A.hero.eyebrow} emblem="big-five" img="orion" title={<>{A.hero.titleA}<span className="italic text-aurora">{A.hero.titleB}</span></>} sub={A.hero.sub}>{start}</PageHero>}
      <ul className="mx-auto mb-8 grid max-w-xl gap-2">{A.how.map((x) => <li key={x} className="flex gap-2 rounded-2xl bg-white/[0.04] px-4 py-3 text-sm"><span className="text-gold">✦</span>{x}</li>)}</ul>
      {!embed && <div className="mx-auto max-w-xl"><UnifiedGlance person={person} isMe={person.id === "me"} /></div>}
    </div>
  );
}
