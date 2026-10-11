"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useContent, useHref } from "@/lib/content-context";
import { quizDefs, QuizId } from "@/lib/quiz-defs";
import { repo, useStore, findPerson } from "@/lib/store";
import { EvidenceBadge } from "./ui";
import { QuizResultView } from "./ProfileView";
import { profileOf } from "@/lib/profile";

export function QuizRunner({ id }: { id: QuizId }) {
  const { c } = useContent(); const h = useHref();
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
    <div className="card text-center">
      <p className="mb-4">First, tell us your birth date — it takes 30 seconds. Then come back to this quiz.</p>
      <Link className="btn-primary" href={h("/start/")}>{c.site.common.start}</Link>
    </div>
  );
  const items = def.items;
  const answer = (v: number) => {
    const next = { ...ans, [items[i].id]: v };
    setAns(next);
    if (i + 1 < items.length) setI(i + 1);
    else { repo.saveQuiz(person.id, def.score(next)); setDone(true); }
  };

  if (done) {
    const fresh = findPerson(repo.getState(), person.id)!;
    return (
      <div>
        <div className="mb-4 text-center"><div className="text-4xl">✨</div><h1 className="h-display text-3xl text-gold">Layer unlocked</h1><p className="text-dim">{def.unlocks}</p></div>
        <QuizResultView id={id} profile={profileOf(fresh)} />
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link className="btn-primary" href={h(person.id === "me" ? "/me/" : `/person/?id=${person.id}`)}>See full profile</Link>
          <Link className="btn-ghost" href={h("/quizzes/")}>Next quiz</Link>
        </div>
      </div>
    );
  }

  if (i < 0) return (
    <div className="card">
      <div className="mb-2 flex flex-wrap gap-2"><EvidenceBadge e={def.evidence} /><span className="chip">⏱ {def.minutes} min</span><span className="chip">{items.length} items</span></div>
      <h1 className="h-display mb-2 text-3xl text-gold">{def.title}</h1>
      <p className="mb-2">{def.tagline}</p>
      <p className="mb-4 text-dim">{def.intro}</p>
      {forId !== "me" && <p className="mb-4 rounded-xl bg-white/5 p-3 text-sm">Answering as <b>{person.name}</b>. Hand them the phone — answers should be theirs.</p>}
      <p className="mb-4 text-sm text-dim">Unlocks: {def.unlocks}. Your full result is free and shown right away.</p>
      <button className="btn-primary w-full py-3" onClick={() => setI(0)}>Begin</button>
      {def.note && <p className="mt-4 text-xs text-dim">{def.note}</p>}
    </div>
  );

  const it = items[i];
  const cur = ans[it.id];
  return (
    <div className="card min-h-[420px]">
      <div className="mb-6 flex gap-1" aria-label={`Question ${i + 1} of ${items.length}`}>
        {items.map((_, k) => <span key={k} className={`h-1.5 flex-1 rounded-full ${k < i ? "bg-gold" : k === i ? "bg-rose" : "bg-white/10"}`} />)}
      </div>
      <p className="mb-1 text-xs text-dim">{i + 1} / {items.length}</p>
      <h2 className="h-display mb-6 text-2xl leading-snug">{it.text.replace("{name}", person.name)}</h2>
      {it.kind === "likert" && (
        <div className="grid gap-2">
          {it.scale.map((label, k) => (
            <button key={k} onClick={() => answer(k + 1)} className={`rounded-xl border px-4 py-3 text-left transition ${cur === k + 1 ? "border-gold bg-gold/15" : "border-white/10 hover:bg-white/10"}`}>{label}</button>
          ))}
        </div>
      )}
      {it.kind === "choice" && (
        <div className="grid gap-2">
          {it.options.map((label, k) => (
            <button key={k} onClick={() => answer(k)} className={`rounded-xl border px-4 py-3 text-left transition ${cur === k ? "border-gold bg-gold/15" : "border-white/10 hover:bg-white/10"}`}>{label}</button>
          ))}
        </div>
      )}
      {it.kind === "poles" && (
        <div>
          <div className="mb-3 flex justify-between gap-4 text-sm"><span className="max-w-[45%]">{it.left}</span><span className="max-w-[45%] text-right">{it.right}</span></div>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((v) => (
              <button key={v} onClick={() => answer(v)} className={`h-12 rounded-xl border transition ${cur === v ? "border-gold bg-gold/20" : "border-white/10 hover:bg-white/10"}`} aria-label={`${v} of 5`}>
                <span className="mx-auto block rounded-full bg-mist" style={{ width: 6 + Math.abs(v - 3) * 5, height: 6 + Math.abs(v - 3) * 5 }} />
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="mt-6 flex justify-between">
        <button className="btn-ghost" onClick={() => setI(i - 1)}>{c.site.common.back}</button>
        {cur != null && i + 1 < items.length && <button className="btn-ghost" onClick={() => setI(i + 1)}>{c.site.common.next}</button>}
      </div>
    </div>
  );
}
