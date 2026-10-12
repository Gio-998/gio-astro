"use client";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useStore, findPerson, repo } from "@/lib/store";
import { profileOf } from "@/lib/profile";
import { ProfileView } from "../ProfileView";
import { useContent, useHref } from "@/lib/content-context";
import { useState } from "react";
import { BirthForm } from "../BirthForm";
import { MeJourney, ViewToggle, useMeView } from "../sky/Journey";

export function MePage() {
  const s = useStore(); const { c } = useContent(); const h = useHref();
  const [view, setView] = useMeView();
  if (!s) return <p className="text-dim">{c.site.common.loading}</p>;
  if (!s.me) return (
    <div className="card text-center">
      <h1 className="h-display mb-2 text-4xl"><span className="text-aurora">{c.ui.me.meet}</span></h1>
      <p className="mb-4 text-dim">{c.ui.me.built}</p>
      <Link className="btn-primary" href={h("/start/")}>{c.site.common.start}</Link>
    </div>
  );
  return (
    <div>
      <div className="mb-3 flex justify-end"><ViewToggle value={view} onChange={setView} /></div>
      {view === "path"
        ? <MeJourney person={s.me} profile={profileOf(s.me)} onClassic={() => { setView("classic"); window.scrollTo({ top: 0 }); }} />
        : <ProfileView person={s.me} profile={profileOf(s.me)} isMe />}
      <div className="mt-8 flex flex-wrap gap-2">
        <Link className="btn-primary" href={h("/you/")}>✦ {c.you.title}</Link>
        <Link className="btn-ghost" href={h("/start/")}>{c.ui.me.editBirth}</Link>
        <Link className="btn-ghost" href={h("/today/")}>{c.ui.me.today}</Link>
        <Link className="btn-ghost" href={h("/people/")}>{c.ui.me.addPeople}</Link>
      </div>
    </div>
  );
}

export function PersonPage() {
  const s = useStore(); const { c } = useContent(); const h = useHref(); const router = useRouter();
  const id = useSearchParams().get("id");
  const [editing, setEditing] = useState(false);
  if (!s) return <p className="text-dim">{c.site.common.loading}</p>;
  const p = findPerson(s, id);
  if (!p) return <p className="text-dim">{c.ui.me.notFound}<Link className="underline" href={h("/people/")}>{c.ui.me.back}</Link></p>;
  if (editing) return <div className="card"><BirthForm initial={p} askRelType submitLabel={c.site.common.save} onSubmit={(np) => { repo.savePerson(np); setEditing(false); }} /></div>;
  return (
    <div>
      <ProfileView person={p} profile={profileOf(p)} isMe={p.id === "me"} />
      <div className="mt-8 flex flex-wrap gap-2">
        <button className="btn-ghost" onClick={() => setEditing(true)}>{c.site.common.edit}</button>
        <Link className="btn-ghost" href={h(`/bond/?b=${p.id}`)}>{c.ui.me.bondTogether}</Link>
        <button className="btn-ghost text-rose" onClick={() => { if (confirm(c.ui.me.confirmDelete(p.name))) { repo.deletePerson(p.id); router.push(h("/people/")); } }}>{c.site.common.delete}</button>
      </div>
    </div>
  );
}
