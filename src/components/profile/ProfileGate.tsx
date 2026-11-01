"use client";
/** The profile screens share one rule: everything personal sits behind one lead form per page, with a teaser in front of it. */
import { useSyncExternalStore, type ReactNode } from "react";
import { useContent } from "@/lib/content-context";
import { accountsEnabled } from "@/lib/supabase";
import { useAccount } from "@/lib/sync";
import { hasLead, subscribeLead } from "@/lib/lead";
import type { Profile } from "@/engine/profile";
import type { StoredPerson } from "@/lib/store";
import { quizViewOf } from "@/lib/profile";
import { RESULT_KEY, TEST_RUN } from "@/lib/test-run";
import { teaserFor, type Teaser } from "@/lib/test-teaser";
import { skyTeaser } from "@/lib/profile-teaser";
import { gateView, LeadGate } from "../lead/LeadGate";
import { TeaserCard } from "../tests/ResultGate";
import { useGlance } from "../glance/text";
import { useAdaptive } from "../adaptive/text";

export const PROFILE_SOURCE = "profile";

/** False for a signed-out visitor who has not left their details: the same answer LeadGate gives, for screens that must plan around the form. */
export function useResultsOpen(): boolean {
  const a = useAccount();
  const stored = useSyncExternalStore(subscribeLead, hasLead, () => false);
  return gateView({ backend: accountsEnabled, ready: a.ready, signedIn: !!a.user, lead: stored, timedOut: false }) === "open";
}

/** A test result if there is one, otherwise the sky, otherwise nothing to preview. */
export function useProfileTeaser(person: StoredPerson, profile?: Profile | null): Teaser | null {
  const { c } = useContent(); const G = useGlance(); const A = useAdaptive();
  const first = TEST_RUN.find((id) => person.quiz[RESULT_KEY[id]]);
  const t = first ? teaserFor(first, quizViewOf(person), c, G, A) : null;
  return t ?? (profile ? skyTeaser(profile, c) : null);
}

/** A gate around a reading whose teaser is already known. */
export function ReadingGate({ teaser, children }: { teaser: Teaser | null; children: ReactNode }) {
  return <LeadGate source={PROFILE_SOURCE} preview={teaser ? <TeaserCard t={teaser} /> : undefined}>{children}</LeadGate>;
}

/** The results of one person. With nothing to preview there is nothing to gate yet, so the children show as they are. */
export function ProfileGate({ person, profile, children }: { person: StoredPerson; profile?: Profile | null; children: ReactNode }) {
  const t = useProfileTeaser(person, profile);
  return t ? <ReadingGate teaser={t}>{children}</ReadingGate> : <>{children}</>;
}
