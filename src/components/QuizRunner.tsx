"use client";
import { useMemo, useState } from "react";
import { ResultReveal } from "./reveal/ResultReveal";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useContent, useHref } from "@/lib/content-context";
import { quizDefs, AnyQuizId, isPrecisionQuiz } from "@/lib/quiz-defs";
import { repo, useStore, findPerson } from "@/lib/store";
import { EvidenceBadge } from "./ui";
import { AnimatePresence, motion } from "motion/react";
import { ArtCard, cosmos } from "./art/ArtCard";
import { Emblem } from "./art/Emblem";
import { Celebration } from "./art/Celebration";
import { artOf, emblemOf } from "./art/precisionArt";
import { PrecisionResultView } from "./PrecisionResult";
import { QuizResultView } from "./ProfileView";
import { profileOf } from "@/lib/profile";
import { track } from "@/lib/track";
import { MethodLink, TrustStrip } from "./nav/Trust";

export function QuizRunner({ id }: { id: AnyQuizId }) {
  const { c } = useContent(); const h = useHref(); const U = c.ui.quiz;
  const def = useMemo(() => quizDefs(c)[id], [c, id]);
  const params = useSearchParams();
  const forId = params.get("for") ?? "me";
  const s = useStore();
  const person = findPerson(s, forId);
  const [i, setI] = useState(-1);
  const [ans, setAns] = useState<Record<string, number>>({});
  const [done, setDone] = useState(false);

  if (!s) return <p className="text-dim">{c.site.common.loading}</p>;
  if (!person) return (
    <div className="card mx-auto max-w-lg text-center">
      <Emblem id={emblemOf(id)} className="mx-auto mb-4 h-20 w-20 glow-gold" />
      <p className="mb-4">{U.birthFirst}</p>
      <Link className="btn-primary" href={h("/start/")}>{c.site.common.start}</Link>
    </div>
  );
  const items = def.items;
  const answer = (v: number) => {
    const next = { ...ans, [items[i].id]: v };
    setAns(next);
    if (i + 1 < items.length) setI(i + 1);
    else { repo.saveQuiz(person.id, def.score(next), { quizId: def.id, values: next }); track("quiz_done", { quiz: def.id, self: person.id === "me" }); setDone(true); window.scrollTo({ top: 0, behavior: "smooth" }); }
  };

  if (done) {
    const fresh = findPerson(repo.getState(), person.id)!;
    return (
      <div className="relative">
        <Celebration />
        <ResultReveal eyebrow={U.unlocked} title={def.title} subtitle={def.unlocks} emblem={String(id)} />
        <div className="relative mb-8 text-center">
          <div className="pop relative mx-auto mb-4 grid h-32 w-32 place-items-center">
            <div className="absolute inset-0 animate-pulse-glow rounded-full bg-gold/30 blur-2xl" />
            <div className="absolute inset-0 rounded-full border border-gold/50 bg-gradient-to-br from-indigo to-ink" />
            <Emblem id={emblemOf(id)} className="relative h-20 w-20 glow-gold" />
          </div>
          <p className="eyebrow mb-2">{U.unlocked}</p>
          <h1 className="h-display text-4xl sm:text-5xl"><span className="italic text-aurora">{def.title}</span></h1>
          <p className="mx-auto mt-2 max-w-md text-dim">{def.unlocks}</p>
        </div>
        {isPrecisionQuiz(id) ? <PrecisionResultView id={id} person={fresh} profile={profileOf(fresh)} /> : <QuizResultView id={id} profile={profileOf(fresh)} pid={person.id} />}
        <div className="mt-3 flex flex-col items-center gap-3"><MethodLink /><TrustStrip center /></div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link className="btn-primary" href={h(person.id === "me" ? "/me/" : `/person/?id=${person.id}`)}>{U.seeProfile}</Link>
          <Link className="btn-ghost" href={h("/quizzes/")}>{U.nextQuiz}</Link>
        </div>
      </div>
    );
  }

  if (i < 0) return (
    <div className="mx-auto grid max-w-4xl items-center gap-8 md:grid-cols-[280px_1fr]">
      <ArtCard img={artOf(id).img} tint={artOf(id).tint} emblem={emblemOf(id)} className="mx-auto h-[380px] w-[260px] animate-float">
        <p className="mt-auto h-display text-2xl leading-tight">{def.title}</p>
        <p className="text-[10px] uppercase tracking-[0.25em] text-gold/80">{U.qMin(items.length, def.minutes)}</p>
      </ArtCard>
    <div className="card">
      <div className="mb-3 flex flex-wrap gap-2"><EvidenceBadge e={def.evidence} /><span className="chip">{U.min(def.minutes)}</span><span className="chip">{U.items(items.length)}</span></div>
      <h1 className="h-display mb-2 text-4xl"><span className="text-aurora">{def.title}</span></h1>
      <p className="mb-2 text-lg">{def.tagline}</p>
      <p className="mb-4 text-dim">{def.intro}</p>
      {forId !== "me" && <p className="mb-4 rounded-xl bg-white/5 p-3 text-sm">{U.answeringA}<b>{person.name}</b>{U.answeringB}</p>}
      <p className="mb-4 text-sm text-dim">{U.unlocks(def.unlocks)}</p>
      <button className="btn-primary w-full py-3.5 text-base" onClick={() => setI(0)}>{U.begin}</button>
      {def.note && <p className="mt-4 text-xs text-dim">{def.note}</p>}
    </div>
    </div>
  );

  const it = items[i];
  const cur = ans[it.id];
  return (
    <div className="card relative mx-auto min-h-[460px] max-w-2xl overflow-hidden">
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
      <p className="eyebrow mb-2">{def.title} · {i + 1} / {items.length}</p>
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
          <div className="grid grid-cols-2 gap-3">
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
          <p className="mt-2 text-center text-xs text-dim">{it.hint}</p>
        </div>
      )}
      </motion.div>
      </AnimatePresence>
      <div className="mt-6 flex justify-between">
        <button className="btn-ghost" onClick={() => setI(i - 1)}>{c.site.common.back}</button>
        {cur != null && i + 1 < items.length && <button className="btn-ghost" onClick={() => setI(i + 1)}>{c.site.common.next}</button>}
      </div>
    </div>
  );
}
