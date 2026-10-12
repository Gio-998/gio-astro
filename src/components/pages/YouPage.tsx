"use client";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { profileOf } from "@/lib/profile";
import { useContent, useHref } from "@/lib/content-context";
import { SIGN_GLYPH } from "@/engine/zodiac";
import { ANIMAL_GLYPH } from "@/engine/chinese";
import { rarity, bigNumber } from "@/engine/rarity";
import { MAJOR_ARCANA } from "@/engine/tarot";
import { useSystems } from "../systems/useSystems";
import { SystemSheet } from "../systems/SystemSheet";
import type { SysCard, SysCardKey } from "@/story/systems";
import type { StoredPerson } from "@/lib/store";
import type { Profile } from "@/engine/profile";

/** "You, all in one": every lens as one glanceable picture, plus the rarity score. Phone first, no tables. */
export function YouPage() {
  const s = useStore(); const { c } = useContent(); const h = useHref(); const Y = c.you;
  if (!s) return <p className="text-dim">{c.site.common.loading}</p>;
  if (!s.me) return (
    <div className="card text-center" data-testid="you-empty">
      <h1 className="h-display mb-2 text-4xl text-balance"><span className="text-aurora">{Y.title}</span></h1>
      <p className="mb-4 text-dim">{Y.empty}</p>
      <Link className="btn-primary" href={h("/start/")}>{Y.start}</Link>
    </div>
  );
  return <YouView person={s.me} profile={profileOf(s.me)} />;
}

function Tile({ glyph, label, value, href, onClick, testid }: { glyph: string; label: string; value: string; href?: string; onClick?: () => void; testid?: string }) {
  const inner = (<>
    <span aria-hidden className="text-2xl leading-none text-gold">{glyph}</span>
    <span className="mt-2 text-[11px] uppercase tracking-widest text-dim">{label}</span>
    <span className="h-display mt-0.5 text-lg leading-tight text-balance">{value}</span>
  </>);
  const cls = "card card-hover flex h-full min-h-[112px] w-full flex-col items-start !p-3.5 text-left transition active:scale-[.98]";
  return href ? <Link href={href} className={cls} data-testid={testid}>{inner}</Link> : <button type="button" onClick={onClick} className={cls} data-testid={testid}>{inner}</button>;
}
const Section = ({ title, lead, children }: { title: string; lead?: string; children: React.ReactNode }) => (
  <section className="mt-8">
    <h2 className="h-display text-2xl text-balance sm:text-3xl"><span className="mr-2 text-gold">✦</span>{title}</h2>
    {lead && <p className="mt-1 text-sm text-dim">{lead}</p>}
    <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">{children}</div>
  </section>
);

function YouView({ person, profile: p }: { person: StoredPerson; profile: Profile }) {
  const { c, locale } = useContent(); const h = useHref(); const Y = c.you; const A = c.astro;
  const { culture, cards } = useSystems(person, p);
  const r = useMemo(() => rarity(p), [p]);
  const [open, setOpen] = useState<SysCard | null>(null); const close = useCallback(() => setOpen(null), []);
  const trad = culture.order.filter((k): k is SysCardKey => k !== "chinese" && k !== "vedic" && !!cards[k as SysCardKey]).slice(0, 8);
  const name = (person.name || "").trim().split(/\s+/)[0];
  const fl = p.fourLetter?.code; const style = fl ? c.psych.fourLetterStyles[fl] : null;
  const k0 = p.tarot.cards[0]; const tarot = c.nums.tarot[MAJOR_ARCANA[k0 === 22 ? 0 : k0]];
  return (
    <article className="mx-auto max-w-3xl" data-testid="you-page">
      <header className="relative overflow-hidden rounded-[32px] border border-white/15 bg-gradient-to-br from-indigo/60 via-ink to-ink px-5 py-7 sm:px-8">
        <p className="eyebrow">{Y.eyebrow}</p>
        <h1 className="h-display mt-1 text-4xl leading-tight text-balance sm:text-5xl">{name ? <span className="text-aurora">{name}</span> : Y.title}</h1>
        <p className="mt-2 text-mist/90 text-pretty">{Y.lead}</p>
        <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-2xl" aria-label={`${A.signs[p.sun].name}, ${A.signs[p.moon].name}${p.rising ? `, ${A.signs[p.rising].name}` : ""}`}>
          <span>☉ {SIGN_GLYPH[p.sun]}</span><span>☽ {SIGN_GLYPH[p.moon]}</span>{p.rising && <span>↑ {SIGN_GLYPH[p.rising]}</span>}<span>{ANIMAL_GLYPH[p.chinese.animal]}</span><span className="font-mono text-gold">{p.numbers.lifePath}</span>
        </p>
      </header>

      <section className="mt-6 rounded-[28px] border border-gold/30 bg-gold/[0.06] p-5 sm:p-7" data-testid="rarity">
        <p className="eyebrow">{Y.rarityTitle}</p>
        <p className="mt-1 text-sm text-dim">{Y.rarityLead}</p>
        <p className="h-display mt-3 text-4xl leading-none text-gold sm:text-5xl"><span className="text-2xl text-mist">{Y.oneIn} </span>{bigNumber(r.oneIn, locale)}</p>
        <p className="mt-2 font-semibold">{Y.levels[r.level]}</p>
        <div className="mt-2 flex gap-1" aria-hidden>{[1, 2, 3, 4, 5].map((i) => <span key={i} className={`h-2 flex-1 rounded-full ${i <= r.level ? "bg-gradient-to-r from-amber to-gold" : "bg-white/10"}`} />)}</div>
        <p className="mt-3 text-sm text-mist/90">{Y.sharers(r.sharers < 1 ? "0" : bigNumber(r.sharers, locale))}</p>
        <div className="mt-4 flex flex-wrap gap-2">{r.factors.map((f) => (
          <span key={f.key} className={`chip ${f === r.rarest ? "border-gold/60 text-gold" : "text-mist"}`}>{Y.factor[f.key]} · {Y.oneIn} {f.oneIn}</span>
        ))}</div>
        <details className="mt-3 text-xs text-dim"><summary className="cursor-pointer underline decoration-dotted">{Y.rarityHow}</summary><p className="mt-1">{Y.rarityHowText}</p></details>
      </section>

      <Section title={Y.sky}>
        <Tile glyph={SIGN_GLYPH[p.sun]} label={Y.sun} value={A.signs[p.sun].name} href={h("/chart/")} />
        <Tile glyph={SIGN_GLYPH[p.moon]} label={Y.moon} value={A.signs[p.moon].name} href={h("/chart/")} />
        <Tile glyph={p.rising ? SIGN_GLYPH[p.rising] : "↑"} label={Y.rising} value={p.rising ? A.signs[p.rising].name : Y.risingUnknown} href={h(p.rising ? "/chart/" : "/start/")} />
        <Tile glyph="✧" label={Y.element} value={A.elements[p.dominantElement].name} href={h("/chart/")} />
      </Section>

      <Section title={Y.numbers}>
        <Tile glyph="#" label={Y.lifePath} value={`${p.numbers.lifePath} · ${c.nums.numbers[p.numbers.lifePath].name}`} href={h("/me/")} />
        <Tile glyph="◷" label={Y.personalYear} value={`${p.numbers.personalYear} · ${c.nums.numbers[p.numbers.personalYear].name}`} href={h("/me/")} />
        <Tile glyph="🂠" label={Y.tarot} value={tarot?.name ?? "?"} href={h("/me/")} />
        <Tile glyph={ANIMAL_GLYPH[p.chinese.animal]} label={Y.east} value={`${c.chinese.wuxing[p.chinese.element].name} ${c.chinese.animals[p.chinese.animal].name}`} href={h("/me/")} />
      </Section>

      <Section title={Y.traditions} lead={Y.traditionsLead(culture.featured.length ? person.place?.name ?? "" : "")}>
        {trad.map((k) => { const cd = cards[k]!; return <Tile key={k} glyph={cd.glyph} label={cd.name} value={cd.value} onClick={() => setOpen(cd)} testid={`you-sys-${k}`} />; })}
      </Section>

      <section className="mt-8">
        <h2 className="h-display text-2xl text-balance sm:text-3xl"><span className="mr-2 text-gold">✦</span>{Y.mind}</h2>
        {style && fl ? (
          <Link href={h("/me/")} className="card card-hover mt-3 block"><p className="h-display text-2xl text-gold">{fl} · {style.name}</p><p className="mt-1 line-clamp-2 text-sm text-mist/85">{style.text}</p></Link>
        ) : (
          <div className="card mt-3 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-mist/90">{Y.mindEmpty}</p><Link className="btn-ghost" href={h("/quizzes/")}>{Y.mindCta}</Link></div>
        )}
      </section>

      <p className="mt-8 text-center"><Link className="btn-primary" href={h("/me/")}>{Y.allDetails}</Link></p>
      <SystemSheet card={open} onClose={close} />
    </article>
  );
}
