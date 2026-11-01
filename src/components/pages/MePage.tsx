"use client";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useStore, findPerson, repo, subjectOf, type State } from "@/lib/store";
import { profileOf } from "@/lib/profile";
import { runStatus } from "@/lib/test-run";
import { ProfileView, TestResults } from "../ProfileView";
import { useContent, useHref } from "@/lib/content-context";
import { useState } from "react";
import { BirthForm } from "../BirthForm";
import { TestsPanel } from "../tests/TestsPanel";
import { ProfileGate } from "../profile/ProfileGate";
import { Fold, SaveAcrossDevices, ScreenLoading } from "../profile/parts";

/** No birth date yet: the tests come first, results sit under them, and the birth date is one short offer further down. */
function GuestProfile({ s }: { s: State }) {
  const { c } = useContent(); const h = useHref(); const T = c.ui.tests.me; const M = c.ui.myProfile;
  const person = subjectOf(s)!; const done = runStatus(person.quiz, s.progress).done;
  return (
    <div className="space-y-4" data-testid="me-guest">
      <header className="px-1 pt-2 text-center">
        <h1 className="h-display mb-1 text-4xl"><span className="text-aurora">{c.ui.pageMeta.me.title}</span></h1>
        <p className="text-dim">{done ? M.guestResults : T.sub}</p>
      </header>
      <TestsPanel>
        <div className="space-y-4">
          {done > 0 && (
            <ProfileGate person={person}>
              <Fold emblem="big-five" defaultOpen title={M.folds.personality} hint={M.folds.results(done)} testId="fold-personality"><TestResults person={person} isMe lenses={false} /></Fold>
            </ProfileGate>
          )}
          <div className="card flex flex-col items-center gap-3 !p-4 text-center sm:flex-row sm:text-left" data-testid="me-birth-prompt">
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-[1.4rem] leading-tight">{T.birthTitle}</h2>
              <p className="mt-0.5 text-sm text-dim">{T.birthText}</p>
            </div>
            <Link className="btn-ghost !min-h-[44px] w-full sm:w-auto" href={h("/start/")}>{T.birthCta}</Link>
          </div>
          <SaveAcrossDevices />
        </div>
      </TestsPanel>
    </div>
  );
}

export function MePage() {
  const s = useStore();
  if (!s) return <ScreenLoading />;
  if (!s.me) return <GuestProfile s={s} />;
  return <ProfileView person={s.me} profile={profileOf(s.me)} isMe />;
}

export function PersonPage() {
  const s = useStore(); const { c } = useContent(); const h = useHref(); const router = useRouter();
  const id = useSearchParams().get("id");
  const [editing, setEditing] = useState(false);
  if (!s) return <ScreenLoading />;
  const p = findPerson(s, id);
  if (!p) return <div className="card mx-auto max-w-lg text-center" data-testid="person-missing"><p className="mb-4 text-mist/90">{c.ui.me.notFound}</p><Link className="btn-primary !min-h-[48px]" href={h("/people/")}>{c.ui.me.back}</Link></div>;
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
