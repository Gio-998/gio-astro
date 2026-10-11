"use client";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useStore, findPerson, repo } from "@/lib/store";
import { profileOf } from "@/lib/profile";
import { ProfileView } from "../ProfileView";
import { useContent, useHref } from "@/lib/content-context";
import { useState } from "react";
import { BirthForm } from "../BirthForm";

export function MePage() {
  const s = useStore(); const { c } = useContent(); const h = useHref();
  if (!s) return <p className="text-dim">{c.site.common.loading}</p>;
  if (!s.me) return (
    <div className="card text-center">
      <h1 className="h-display mb-2 text-3xl text-gold">Let's meet you</h1>
      <p className="mb-4 text-dim">Your profile is built from your birth date in seconds.</p>
      <Link className="btn-primary" href={h("/start/")}>{c.site.common.start}</Link>
    </div>
  );
  return (
    <div>
      <ProfileView person={s.me} profile={profileOf(s.me)} isMe />
      <div className="mt-8 flex flex-wrap gap-2">
        <Link className="btn-ghost" href={h("/start/")}>{c.site.common.edit} birth details</Link>
        <Link className="btn-ghost" href={h("/today/")}>Today's guidance →</Link>
        <Link className="btn-ghost" href={h("/people/")}>Add people →</Link>
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
  if (!p) return <p className="text-dim">Person not found. <Link className="underline" href={h("/people/")}>Back to People</Link></p>;
  if (editing) return <div className="card"><BirthForm initial={p} askRelType submitLabel={c.site.common.save} onSubmit={(np) => { repo.savePerson(np); setEditing(false); }} /></div>;
  return (
    <div>
      <ProfileView person={p} profile={profileOf(p)} isMe={p.id === "me"} />
      <div className="mt-8 flex flex-wrap gap-2">
        <button className="btn-ghost" onClick={() => setEditing(true)}>{c.site.common.edit}</button>
        <Link className="btn-ghost" href={h(`/bond/?b=${p.id}`)}>Bond Check together</Link>
        <button className="btn-ghost text-rose" onClick={() => { if (confirm(`Delete ${p.name}? This removes their data from this device.`)) { repo.deletePerson(p.id); router.push(h("/people/")); } }}>{c.site.common.delete}</button>
      </div>
    </div>
  );
}
