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

export function PeoplePage() {
  const s = useStore(); const { c } = useContent(); const h = useHref();
  const [mode, setMode] = useState<"list" | "add" | "code">("list");
  const [code, setCode] = useState(""); const [err, setErr] = useState("");
  if (!s) return <p className="text-dim">{c.site.common.loading}</p>;
  const defs = quizDefs(c);
  return (
    <div>
      <div className="mb-4 flex items-center justify-between"><h1 className="h-display text-4xl text-gold">People</h1>
        {mode === "list" && <div className="flex gap-2"><button className="btn-primary" onClick={() => setMode("add")}>+ Add</button><button className="btn-ghost" onClick={() => setMode("code")}>Paste code</button></div>}
      </div>
      <p className="mb-4 text-sm text-dim">Partners, friends, family, colleagues — anyone you want to understand better. Their data stays on this device. Best practice: ask them first, or send them the app so they can add their own answers.</p>
      {mode === "add" && <div className="card mb-4"><BirthForm askRelType submitLabel="Add person" onSubmit={(p) => { repo.savePerson(p); setMode("list"); }} /><button className="btn-ghost mt-3" onClick={() => setMode("list")}>{c.site.common.cancel}</button></div>}
      {mode === "code" && (
        <div className="card mb-4 space-y-3">
          <p className="text-sm">Ask them to open <b>My profile → My profile code</b> and send it to you. It includes their quiz results, so all lenses unlock.</p>
          <textarea className="input h-28 font-mono text-xs" value={code} onChange={(e) => setCode(e.target.value)} placeholder="MS1.…" />
          {err && <p className="text-sm text-rose">{err}</p>}
          <div className="flex gap-2">
            <button className="btn-primary" onClick={() => { const d = decodeProfileCode(code); if (!d) return setErr("That code doesn't look right — copy it again in full."); repo.savePerson({ ...d, id: newId(), createdAt: new Date().toISOString(), relType: "friend" }); setCode(""); setMode("list"); }}>Add</button>
            <button className="btn-ghost" onClick={() => setMode("list")}>{c.site.common.cancel}</button>
          </div>
        </div>
      )}
      {s.people.length === 0 && mode === "list" && <div className="card text-center text-dim">No one here yet. Add someone to see your compatibility across every lens.</div>}
      <div className="grid gap-3">
        {s.people.map((p) => {
          const pr = profileOf(p); const n = QUIZ_IDS.filter((id) => p.quiz[defs[id].resultKey]).length;
          return (
            <div key={p.id} className="card">
              <div className="flex items-center justify-between gap-2">
                <Link href={h(`/person/?id=${p.id}`)} className="min-w-0">
                  <p className="truncate text-lg font-semibold">{p.name} <span className="text-sm text-dim">· {c.compat.relTypes[p.relType ?? "friend"].name}</span></p>
                  <p className="text-sm text-dim">{SIGN_GLYPH[pr.sun]} {c.astro.signs[pr.sun].name} · {ANIMAL_GLYPH[pr.chinese.animal]} {c.chinese.animals[pr.chinese.animal].name} · LP {pr.numbers.lifePath} · {n}/7 quizzes</p>
                </Link>
                <Link className="btn-primary shrink-0" href={h(`/match/?b=${p.id}`)}>Compare</Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
