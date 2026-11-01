"use client";
import Link from "next/link";
import { useCallback, useState } from "react";
import type { Profile } from "@/engine/profile";
import type { StoredPerson } from "@/lib/store";
import { useContent, useHref } from "@/lib/content-context";
import { useLensSheet } from "../LensSheet";
import { suggestMk, SystemKey } from "@/engine/systems";
import type { SysCard, SysCardKey } from "@/story/systems";
import { SystemSheet } from "./SystemSheet";
import { SysEvidenceChip } from "./SysEvidenceChip";
import { useSystems } from "./useSystems";
import { ANIMAL_GLYPH } from "@/engine/chinese";

/** "Every sky, every calendar": the extra systems, ordered by the cultural lens rule, phone-first cards + sheets. */
export function SystemsSection({ person, profile, embedded }: { person: StoredPerson; profile: Profile; isMe?: boolean; embedded?: boolean }) {
  const { c, locale } = useContent(); const h = useHref(); const U = c.systems.ui; const openLens = useLensSheet();
  const { culture, cards } = useSystems(person, profile);
  const [open, setOpen] = useState<SysCard | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const featured = culture.featured.slice(0, 4);
  const place = person.place?.name;
  const tile = (k: SystemKey, big = false) => {
    if (k === "chinese" || k === "vedic") {
      const name = c.lensInfo[k].name;
      const value = k === "chinese" ? `${ANIMAL_GLYPH[profile.chinese.animal]} ${c.chinese.wuxing[profile.chinese.element].name} ${c.chinese.animals[profile.chinese.animal].name}` : `☾ ${c.vedic.nakshatras[profile.vedic.nakshatra].name}`;
      return <button key={k} type="button" onClick={() => openLens(k)} className={tileCls(big)} data-testid={`sys-${k}`}><span className="text-xs uppercase tracking-widest text-dim">{name}</span><span className="h-display mt-1 text-xl leading-tight text-gold">{value}</span></button>;
    }
    const card = cards[k as SysCardKey]; if (!card) return null;
    return (
      <button key={k} type="button" aria-haspopup="dialog" onClick={() => setOpen(card)} className={tileCls(big)} data-testid={`sys-${k}`}>
        <span className="flex w-full items-start justify-between gap-2"><span className="text-[11px] uppercase tracking-widest text-dim">{card.name}</span><SysEvidenceChip e={card.evidence} compact /></span>
        <span className="mt-1 flex items-center gap-2"><span aria-hidden className={`${big ? "text-4xl" : "text-2xl"} text-gold`}>{card.glyph}</span><span className={`h-display leading-tight ${big ? "text-2xl" : "text-lg"}`}>{card.value}</span></span>
        <span className={`mt-1 text-left text-sm text-mist/85 ${big ? "line-clamp-3" : "line-clamp-2"}`}>{card.line}</span>
        {big && <span className="mt-2 text-[11px] text-dim">🔒 {card.provenance}</span>}
      </button>
    );
  };
  return (
    <section className={embedded ? "mt-6" : "mt-12"} data-testid="systems-section" id="systems">
      <div className={embedded ? "mb-3" : "mb-3 border-b border-white/10 pb-3"}>
        {embedded ? <h3 className="font-display text-xl text-gold">{U.sectionTitle}</h3> : <h2 className="h-display text-3xl"><span className="mr-2 text-gold">✦</span>{U.sectionTitle}</h2>}
        <p className="mt-1 text-sm text-dim">{U.sectionLead}</p>
      </div>
      {suggestMk({ birthTz: person.place?.tz, locale, browserLangs: typeof navigator !== "undefined" ? navigator.languages : [] }) && (
        <Link href={`/mk/me/`} lang="mk" className="mb-3 flex items-center gap-2 rounded-2xl border border-gold/30 bg-gold/[0.07] px-4 py-3 text-sm"><span aria-hidden>🇲🇰</span><span>{U.readInMk}</span><span className="ml-auto underline">МК →</span></Link>
      )}
      {featured.length > 0 && (
        <>
          <p className="mb-2 text-sm"><span className="text-gold">✧</span> {place ? U.featuredFor(place) : U.featuredFor("")} <span className="text-dim">({[...new Set(featured.flatMap((k) => culture.why[k] ?? []))].map((w) => U.featuredWhy[w]).join(", ")})</span></p>
          <div className="-mx-4 mb-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0" data-testid="systems-featured">
            {featured.map((k) => <div key={k} className="w-[78%] shrink-0 snap-start sm:w-auto">{tile(k, true)}</div>)}
          </div>
        </>
      )}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {culture.order.filter((k) => !featured.includes(k) && k !== "chinese" && k !== "vedic").map((k) => tile(k))}
      </div>
      <details className="mt-3 text-xs text-dim"><summary className="cursor-pointer underline decoration-dotted">{U.orderRule}</summary><p className="mt-1">{U.orderRuleText} <Link className="underline" href={h("/how-it-works/#culture")}>{c.systems.how.link}</Link></p></details>
      <SystemSheet card={open} onClose={close} />
    </section>
  );
}
const tileCls = (big: boolean) => `card card-hover flex h-full w-full flex-col items-start text-left transition active:scale-[.98] ${big ? "!p-5 border-gold/30" : "!p-3.5"}`;
