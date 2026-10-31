"use client";
import { useMemo } from "react";
import type { Profile } from "@/engine/profile";
import type { StoredPerson } from "@/lib/store";
import { computeSystems, cultureOrder } from "@/engine/systems";
import { useContent } from "@/lib/content-context";
import { buildSystemCards } from "@/story/systems";

export const firstNameOf = (p: StoredPerson) => ((p.noName ? "" : p.name) || p.birthName || "").trim().split(/\s+/)[0] ?? "";

/** Systems, cards and cultural order for one person, memoised. Browser languages are read on the client only. */
export function useSystems(person: StoredPerson, profile: Profile) {
  const { c, locale } = useContent();
  return useMemo(() => {
    const firstName = firstNameOf(person);
    const sys = computeSystems(profile, { firstName });
    const langs = typeof navigator !== "undefined" ? navigator.languages ?? [navigator.language] : [];
    const culture = cultureOrder({ birthTz: person.place?.tz, locale, browserLangs: langs });
    const cards = buildSystemCards(profile, sys, c, { placeName: person.place?.name ?? null, firstName, locale });
    return { sys, culture, cards, firstName };
  }, [person, profile, c, locale]);
}
