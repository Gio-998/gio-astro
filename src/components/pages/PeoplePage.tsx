"use client";
import Link from "next/link";
import { useState } from "react";
import { useStore, repo, decodeProfileCode, newId } from "@/lib/store";
import { profileOf } from "@/lib/profile";
import { useContent, useHref } from "@/lib/content-context";
import { BirthForm } from "../BirthForm";
import { SIGN_GLYPH } from "@/engine/zodiac";
import { ANIMAL_GLYPH } from "@/engine/chinese";
import { quizDefs, QUIZ_IDS } from "@/lib/quiz-defs";
import { PageHero } from "../ui";
import { BondsConstellation } from "../sky/Journey";
import { comparePair } from "@/engine/compat";

export function PeoplePage() {
  const s = useStore(); const { c } = useContent(); const h = useHref(); const U = c.ui.people;
  const [mode, setMode] = useState<"list" | "add" | "code">("list");
  const [code, setCode] = useState(""); const [err, setErr] = useState("");
  if (!s) return <p className="text-dim">{c.site.common.loading}</p>;
  const defs = quizDefs(c);
  return (
    <div>
      <PageHero eyebrow={U.eyebrow} img="storm" emblem="attachment" title={<>{U.titleA}<span className="italic text-aurora">{U.titleB}</span></>}
        sub={U.sub}>
        {mode === "list" && <div className="flex gap-2"><button className="btn-primary" onClick={() => setMode("add")}>{U.add}</button><button className="btn-ghost" onClick={() => setMode("code")}>{U.paste}</button></div>}
      </PageHero>
      <p className="mb-4 text-sm text-dim">{U.intro}</p>
      {mode === "add" && <div className="card mb-4"><BirthForm askRelType submitLabel={U.addPerson} onSubmit={(p) => { repo.savePerson(p); setMode("list"); }} /><button className="btn-ghost mt-3" onClick={() => setMode("list")}>{c.site.common.cancel}</button></div>}
      {mode === "code" && (
        <div className="card mb-4 space-y-3">
          <p className="text-sm">{U.askA}<b>{U.askB}</b>{U.askC}</p>
          <textarea className="input h-28 font-mono text-xs" value={code} onChange={(e) => setCode(e.target.value)} placeholder="MS1.…" />
          {err && <p className="text-sm text-rose">{err}</p>}
          <div className="flex gap-2">
            <button className="btn-primary" onClick={() => { const d = decodeProfileCode(code); if (!d) return setErr(U.badCode); repo.savePerson({ ...d, id: newId(), createdAt: new Date().toISOString(), relType: "friend", importedCode: code.trim() }); setCode(""); setMode("list"); }}>{U.addBtn}</button>
            <button className="btn-ghost" onClick={() => setMode("list")}>{c.site.common.cancel}</button>
          </div>
        </div>
      )}
      {s.me && mode === "list" && <BondsConstellation items={s.people.slice(0, 12).map((p) => { const pr = profileOf(p); let score = 50; try { score = comparePair(profileOf(s.me!), pr, p.relType ?? "friend").resonance; } catch { /* keep middle orbit */ } return { id: p.id, name: p.name, score, color: pr.palette[0] }; })} />}
      {s.people.length === 0 && mode === "list" && <div className="card text-center text-dim">{U.empty}</div>}
      <div className="grid gap-3">
        {s.people.map((p) => {
          const pr = profileOf(p); const n = QUIZ_IDS.filter((id) => p.quiz[defs[id].resultKey]).length;
          return (
            <div key={p.id} className="card">
              <div className="flex items-center justify-between gap-2">
                <Link href={h(`/person/?id=${p.id}`)} className="min-w-0">
                  <p className="truncate text-lg font-semibold">{p.name} <span className="text-sm text-dim">· {c.compat.relTypes[p.relType ?? "friend"].name}</span></p>
                  <p className="text-sm text-dim">{SIGN_GLYPH[pr.sun]} {c.astro.signs[pr.sun].name} · {ANIMAL_GLYPH[pr.chinese.animal]} {c.chinese.animals[pr.chinese.animal].name} · {U.lp(pr.numbers.lifePath)} · {U.quizzes(n)}</p>
                </Link>
                <Link className="btn-primary shrink-0" href={h(`/match/?b=${p.id}`)}>{U.compare}</Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
