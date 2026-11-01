"use client";
/** Small pieces shared by the profile screens: folds, today's card, the soft account offer, and calm empty and loading states. */
import Link from "next/link";
import { useId, useMemo, useState, type ReactNode } from "react";
import type { Profile } from "@/engine/profile";
import { dailyGuidance } from "@/engine/daily";
import { accountsEnabled } from "@/lib/supabase";
import { useAccount } from "@/lib/sync";
import { usePrinting } from "@/lib/print";
import { useContent, useDate, useHref } from "@/lib/content-context";
import { Emblem, type EmblemId } from "../art/Emblem";
import { MoonArt } from "../art/MoonArt";

const Chevron = ({ open }: { open: boolean }) => <svg viewBox="0 0 10 6" className={`h-2 w-3 shrink-0 text-gold transition-transform duration-300 ${open ? "rotate-180" : ""}`} aria-hidden><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>;

/** A section that stays closed until asked for. Its content is built on opening, and it opens by itself for printing. */
export function Fold({ title, hint, emblem, defaultOpen = false, small = false, testId, children }: { title: string; hint?: ReactNode; emblem?: EmblemId; defaultOpen?: boolean; small?: boolean; testId?: string; children: ReactNode }) {
  const [state, setOpen] = useState(defaultOpen); const printing = usePrinting(); const open = state || printing; const id = useId();
  const Heading = small ? "h3" : "h2";
  return (
    <section className={`border border-white/12 bg-white/[0.04] transition-colors ${open ? "border-gold/30" : ""} ${small ? "rounded-2xl" : "rounded-3xl"}`} data-testid={testId}>
      <Heading>
        <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)} data-testid={testId ? `${testId}-toggle` : undefined}
          className={`no-print flex w-full items-center gap-3 text-left ${small ? "min-h-[60px] px-3 py-2" : "min-h-[76px] px-4 py-3 sm:px-5"}`}>
          {emblem && <Emblem id={emblem} className={`shrink-0 ${small ? "h-9 w-9" : "h-11 w-11"}`} />}
          <span className="min-w-0 flex-1">
            <span className={`block font-display font-normal leading-tight text-mist ${small ? "text-lg" : "text-[1.4rem]"}`}>{title}</span>
            {hint && <span className="mt-0.5 block truncate text-sm font-normal text-dim">{hint}</span>}
          </span>
          <Chevron open={open} />
        </button>
      </Heading>
      {/* Print hides every button, so the title needs a second home on paper. */}
      <p className={`hidden font-display print:block ${small ? "text-lg" : "text-2xl"}`}>{title}</p>
      <div id={id} hidden={!open} className={small ? "px-2 pb-2 sm:px-3 sm:pb-3" : "px-3 pb-4 sm:px-5 sm:pb-5"}>{open && children}</div>
    </section>
  );
}

/** A plain part inside a fold: smaller than a page section, so folds never shout. */
export function Part({ title, aside, children }: { title: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <div className="mt-6 first:mt-1">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2"><h3 className="font-display text-xl text-gold">{title}</h3>{aside}</div>
      {children}
    </div>
  );
}

/** One glance at today, with the whole reading one tap away. */
export function TodayCard({ profile }: { profile: Profile }) {
  const { c } = useContent(); const h = useHref(); const fmt = useDate(); const D = c.daily; const U = c.ui.today; const A = c.astro;
  // Only rendered once the store has loaded, which never happens on the server, so the clock cannot cause a hydration mismatch.
  const [now] = useState(() => new Date());
  const g = useMemo(() => dailyGuidance(profile, now, D.prompts.length), [profile, now, D.prompts.length]);
  return (
    <Link href={h("/today/")} className="card block !p-4 transition active:scale-[.99] hover:border-gold/40 sm:!p-5" data-testid="me-today">
      <span className="flex items-center gap-4">
        <MoonArt angle={g.moon.angle} className="h-14 w-14 shrink-0" />
        <span className="min-w-0 flex-1">
          <span className="eyebrow block">{fmt(now, { weekday: true, year: false })}</span>
          <span className="mt-0.5 block font-display text-[1.4rem] leading-tight">{U.moonIn(D.moonPhases[g.moon.phase].name, A.signs[g.moon.moonSign].name)}</span>
        </span>
      </span>
      <span className="mt-3 block text-[15px] leading-relaxed text-mist/90">{D.personalDay[g.personalDay]}</span>
      <span className="mt-2 flex min-h-[32px] items-center text-sm text-gold">{c.ui.myProfile.todayCta} →</span>
    </Link>
  );
}

/** The optional account, offered once and softly. It never stands between anyone and a result. */
export function SaveAcrossDevices() {
  const a = useAccount(); const { c } = useContent(); const h = useHref();
  if (!accountsEnabled || !a.ready || a.user) return null;
  return (
    <Link href={h("/account")} className="flex min-h-[68px] items-center gap-3 rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-3 transition hover:border-gold/40" data-testid="me-save">
      <span aria-hidden className="text-xl text-gold">☁︎</span>
      <span className="min-w-0 flex-1"><span className="block font-semibold">{c.ui.auth.chipOut}</span><span className="block text-sm text-dim">{c.ui.myProfile.save}</span></span>
      <span aria-hidden className="text-gold">→</span>
    </Link>
  );
}

/** A screen that needs the birth date: one short ask, with a way forward for anyone who would rather not give it. */
export function NeedBirthDate({ title, text, emblem = "chart", art, testId }: { title: string; text?: string; emblem?: EmblemId; art?: ReactNode; testId?: string }) {
  const { c } = useContent(); const h = useHref(); const M = c.ui.myProfile;
  return (
    <div className="card mx-auto max-w-lg text-center" data-testid={testId ?? "need-birth"}>
      {art ?? <Emblem id={emblem} className="mx-auto mb-3 h-16 w-16 glow-gold" />}
      <h1 className="h-display mb-2 text-4xl text-balance"><span className="text-aurora">{title}</span></h1>
      <p className="mb-5 text-mist/85">{text ?? M.need}</p>
      <Link className="btn-primary w-full !min-h-[48px]" href={h("/start/")}>{c.site.common.start}</Link>
      <Link className="mt-1 inline-flex min-h-[44px] items-center text-sm text-dim underline decoration-dotted underline-offset-4 hover:text-mist" href={h("/quizzes/")}>{M.orTest}</Link>
    </div>
  );
}

/** Holds the shape of the screen while the saved data loads, so nothing jumps. */
export function ScreenLoading() {
  const { c } = useContent();
  return (
    <div role="status" aria-label={c.site.common.loading} className="space-y-4" data-testid="screen-loading">
      <div className="h-48 animate-pulse rounded-[32px] border border-white/10 bg-white/[0.04]" />
      <div className="h-28 animate-pulse rounded-3xl border border-white/10 bg-white/[0.04]" />
      <div className="h-40 animate-pulse rounded-3xl border border-white/10 bg-white/[0.04]" />
    </div>
  );
}
