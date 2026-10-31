"use client";
import type { ReactNode } from "react";
import { useContent } from "@/lib/content-context";
import { LeadGate } from "@/components/lead/LeadGate";
import type { StoredPerson } from "@/lib/store";
import { quizViewOf } from "@/lib/profile";
import { RESULT_KEY, RUN_SOURCE, TEST_RUN, type TestId } from "@/lib/test-run";
import { teaserFor, type Teaser } from "@/lib/test-teaser";
import { useGlance } from "../glance/text";
import { useAdaptive } from "../adaptive/text";

function useTeaser() {
  const { c } = useContent(); const G = useGlance(); const A = useAdaptive();
  return (id: TestId, person: StoredPerson) => teaserFor(id, quizViewOf(person), c, G, A);
}

function TeaserCard({ t }: { t: Teaser }) {
  const R = useContent().c.ui.tests.result;
  return (
    <div className="card text-center" data-testid="result-teaser">
      <p className="eyebrow mb-1">{R.preview}</p>
      <h2 className="h-display text-3xl leading-tight text-gold">{t.title}</h2>
      <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-mist/90">{t.text}</p>
    </div>
  );
}

/** One test's full result, behind the lead form for a signed-out visitor who has not left their details yet. */
export function ResultGate({ id, person, children }: { id: TestId; person: StoredPerson; children: ReactNode }) {
  const t = useTeaser()(id, person);
  return <LeadGate source={id} preview={t ? <TeaserCard t={t} /> : undefined}>{children}</LeadGate>;
}

/** Several results on one page get one form: the take-all run, and the test sections of a profile. */
export function ResultsGate({ source = RUN_SOURCE, person, children }: { source?: string; person: StoredPerson; children: ReactNode }) {
  const teaser = useTeaser();
  const first = TEST_RUN.find((id) => person.quiz[RESULT_KEY[id]]);
  const t = first ? teaser(first, person) : null;
  if (!first) return <>{children}</>;
  return <LeadGate source={source} preview={t ? <TeaserCard t={t} /> : undefined}>{children}</LeadGate>;
}
