"use client";
import Link from "next/link";
import { useMemo } from "react";
import type { Profile } from "@/engine/profile";
import type { StoredPerson } from "@/lib/store";
import { useContent, useHref } from "@/lib/content-context";
import { profileSummary } from "@/story/voice";
import { VoiceLines } from "./VoiceLines";
import { useSystems } from "./useSystems";

/** "In your own words": the personal-voice summary near the top of a profile, every line with its why. */
export function VoiceSummary({ person, profile }: { person: StoredPerson; profile: Profile }) {
  const { c } = useContent(); const h = useHref(); const { sys } = useSystems(person, profile);
  const lines = useMemo(() => profileSummary({ c, p: profile, sys, name: person.name, answers: person.answers, aura: person.aura, placeName: person.place?.name ?? null }), [c, profile, sys, person]);
  const V = c.systems.voiceUi;
  return (
    <section className="card mt-4 border-gold/25" data-testid="voice-summary">
      <p className="eyebrow mb-2">✦ {V.title}</p>
      <VoiceLines lines={lines} className="text-[15.5px]" />
      <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-white/10 pt-3 text-xs text-dim">
        <span>🔒 {V.private}</span>
        <Link className="underline decoration-dotted underline-offset-4 hover:text-mist" href={h("/how-it-works/#voice")}>{V.how} →</Link>
      </p>
    </section>
  );
}
