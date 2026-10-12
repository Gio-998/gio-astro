"use client";
import { useMemo } from "react";
import type { StoredPerson } from "@/lib/store";
import { profileOf } from "@/lib/profile";
import { useContent } from "@/lib/content-context";
import { dayLines } from "@/story/voice";
import { todayBiorhythm } from "@/engine/systems";
import { feastOn } from "@/engine/systems/feasts";
import { VoiceLines } from "./VoiceLines";
import { BioBars } from "./SystemSheet";
import { useSystems } from "./useSystems";

/** Personal-voice lines for Today: rhythm, the church/folk calendar, name day, inner weather. */
export function YourDayVoice({ person, now, personalDay }: { person: StoredPerson; now: Date; personalDay: number }) {
  const { c } = useContent(); const profile = useMemo(() => profileOf(person), [person]);
  const { sys, culture } = useSystems(person, profile);
  const bio = todayBiorhythm(profile, now);
  const feastToday = culture.featured.includes("nameday") || culture.featured.includes("slavic") ? feastOn(now) : null;
  const isNameDay = !!sys.nameDay && sys.nameDay.daysUntil === 0;
  const lines = dayLines({ c, p: profile, sys, name: person.name, aura: person.aura }, { bio, feast: feastToday, isNameDay, personalDay });
  return (
    <div className="card" data-testid="your-day-voice">
      <h2 className="h-display mb-2 text-3xl"><span className="text-gold">✦</span>{c.systems.voiceUi.dayTitle}</h2>
      <BioBars bio={bio} />
      {lines.length > 0 && <VoiceLines lines={lines} className="mt-3 text-sm" />}
      <p className="mt-3 text-xs text-dim">{c.systems.meta.biorhythm.evidence === "modern" ? `${c.systems.evidence.modern.icon} ${c.systems.voiceUi.bioNote}` : ""}</p>
    </div>
  );
}
