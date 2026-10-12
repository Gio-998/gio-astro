"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { AXES, unifiedProfile, type Axis, type Unified } from "@/engine/unified";
import type { StoredPerson } from "@/lib/store";
import { profileOf } from "@/lib/profile";
import { useHref } from "@/lib/content-context";
import { sb } from "@/lib/supabase";
import { useAccount } from "@/lib/sync";
import { useAdaptive } from "./text";
import { useReduce } from "../play/fx";

const COL: Record<Axis, string> = { energy: "#f6cf7a", curiosity: "#c9b8ff", structure: "#a9c8ff", warmth: "#f6b5cf", steadiness: "#8fe3d6", daring: "#ffb38a" };

/** Store the latest blend for signed-in users (own row only, RLS). Skips when nothing changed. */
function useSaveSignal(u: Unified, isMe: boolean) {
  const acct = useAccount();
  useEffect(() => {
    const uid = acct.user?.id; const c = sb();
    if (!isMe || !uid || !c || !u.sources.length || acct.status === "off" || acct.error === "consent") return;
    const body = { axes: Object.fromEntries(AXES.map((a) => [a, u.axes[a] ? { v: u.axes[a]!.value, s: u.axes[a]!.sure } : null])), sure: u.sure, level: u.level, sources: u.sources };
    const sig = JSON.stringify(body); const key = `horoscop:signal:${uid}`;
    try { if (localStorage.getItem(key) === sig) return; } catch { /* private mode */ }
    const t = setTimeout(() => {
      c.from("profile_signals").upsert({ user_id: uid, ...body, updated_at: new Date().toISOString() }).then(({ error }) => { if (!error) try { localStorage.setItem(key, sig); } catch { /* ignore */ } });
    }, 800);
    return () => clearTimeout(t);
  }, [acct.user?.id, acct.status, acct.error, isMe, u]);
}

/** Confidence ring: four arcs that light up as we get surer. */
function SureRing({ level, sure }: { level: number; sure: number }) {
  const reduce = useReduce(); const r = 34, C = 2 * Math.PI * r; const seg = C / 4;
  return (
    <svg viewBox="0 0 88 88" className="h-24 w-24 shrink-0" aria-hidden>
      <defs><linearGradient id="ug-r" x1="0" x2="1"><stop offset="0" stopColor="#f6b5cf" /><stop offset="1" stopColor="#f6cf7a" /></linearGradient></defs>
      {[0, 1, 2, 3].map((k) => (
        <motion.circle key={k} cx="44" cy="44" r={r} fill="none" strokeWidth="7" strokeLinecap="round" transform={`rotate(${-90 + k * 90 + 6} 44 44)`}
          stroke={k <= level ? "url(#ug-r)" : "rgba(255,255,255,.1)"} strokeDasharray={`${seg - 16} ${C}`}
          initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 * k }} />
      ))}
      <circle cx="44" cy="44" r={10 + 12 * sure} fill="#f6cf7a" opacity={0.18 + 0.5 * sure} style={{ filter: "blur(6px)" }} />
      <circle cx="44" cy="44" r="4" fill="#fff6d6" />
    </svg>
  );
}

/** One axis: two pole words, a track, and a glowing dot. Fuzzier, dimmer dot = less sure. */
function AxisRow({ a, sig, i }: { a: Axis; sig: Unified["axes"][Axis]; i: number }) {
  const A = useAdaptive().unified; const reduce = useReduce(); const X = A.axes[a];
  const sure = sig?.sure ?? 0; const v = sig?.value ?? 50;
  return (
    <div data-testid={`unified-${a}`}>
      <div className="mb-1 flex items-baseline justify-between text-xs"><span className={v < 42 && sig ? "text-mist" : "text-dim"}>{X.poles[0]}</span><span className="eyebrow !text-[10px]">{X.name}</span><span className={v > 58 && sig ? "text-mist" : "text-dim"}>{X.poles[1]}</span></div>
      <div className="relative h-3 rounded-full bg-white/[0.07]">
        <div className="absolute inset-y-0 left-1/2 w-px bg-white/15" />
        {sig ? (
          <motion.div className="absolute top-1/2" initial={reduce ? false : { left: "50%", opacity: 0 }} animate={{ left: `${v}%`, opacity: 1 }} transition={{ duration: 0.9, delay: 0.08 * i, ease: [0.16, 1, 0.3, 1] }}>
            <span className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ width: 70 - 46 * sure, height: 12, background: COL[a], opacity: 0.25 + 0.2 * (1 - sure), filter: `blur(${2 + 6 * (1 - sure)}px)` }} />
            <span className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white/70" style={{ background: COL[a], opacity: 0.45 + 0.55 * sure, boxShadow: `0 0 ${6 + 14 * sure}px ${COL[a]}` }} />
          </motion.div>
        ) : <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20" />}
      </div>
      {sig && (sig.sure < 0.35 || sig.spread >= 22) && <p className="mt-1 text-[11px] text-dim">◦ {sig.spread >= 22 ? A.mixed : A.unsure}</p>}
    </div>
  );
}

export function UnifiedGlance({ person, isMe = true, compact = false }: { person: StoredPerson; isMe?: boolean; compact?: boolean }) {
  const A = useAdaptive().unified; const h = useHref();
  const u = useMemo(() => {
    let el = null; try { el = profileOf(person).chart.elementBalance; } catch { /* no chart */ }
    return unifiedProfile(person.quiz, el);
  }, [person]);
  useSaveSignal(u, isMe);
  const [open, setOpen] = useState(!compact);
  const qs = isMe ? "" : `?for=${person.id}`;
  const hasTests = u.sources.some((s) => s !== "chart");
  return (
    <section data-testid="unified-glance" className="relative overflow-hidden rounded-[30px] border border-gold/20 bg-gradient-to-b from-violet/20 via-white/[0.03] to-rose/10 p-5 sm:p-7">
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gold/10 blur-3xl" />
      <div className="relative flex items-center gap-4">
        <SureRing level={u.level} sure={u.sure} />
        <div className="min-w-0">
          <p className="eyebrow mb-0.5">✦ {A.eyebrow}</p>
          <p className="h-display text-2xl leading-tight sm:text-3xl"><span className="text-aurora">{A.levels[u.level]}</span></p>
          <p className="mt-1 text-xs text-dim">{A.sureLabel}: {A.levelText[u.level]}</p>
        </div>
      </div>
      {!hasTests && <p className="relative mt-4 text-sm text-mist/85">{A.empty}</p>}
      {open ? (
        <div className="relative mt-5 space-y-4">{AXES.map((a, i) => <AxisRow key={a} a={a} sig={u.axes[a]} i={i} />)}</div>
      ) : (
        <button type="button" className="relative mt-4 text-sm text-gold underline decoration-dotted underline-offset-4" onClick={() => setOpen(true)}>{A.title} →</button>
      )}
      <div className="relative mt-5 flex flex-wrap gap-1.5" aria-label={A.from}>
        {u.sources.map((s) => <span key={s} className="chip !text-[11px]">✓ {A.sources[s]}</span>)}
      </div>
      {u.next && (
        <div className="relative mt-4 flex flex-wrap items-center gap-3 border-t border-white/10 pt-4">
          <span className="text-sm text-dim">{A.nextLead}</span>
          <Link className="btn-primary !py-2 text-sm" href={h(`${A.next[u.next][1]}${qs}`)} data-testid="unified-next">{A.next[u.next][0]} ✦</Link>
        </div>
      )}
    </section>
  );
}
