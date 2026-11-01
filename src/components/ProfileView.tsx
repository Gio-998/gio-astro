"use client";
import Link from "next/link";
import type { Profile } from "@/engine/profile";
import type { QuizView } from "@/lib/profile";
import { quizViewOf } from "@/lib/profile";
import { useContent, useHref, useDate } from "@/lib/content-context";
import { Bar, Dial, EvidenceBadge, Palette } from "./ui";
import { SIGN_GLYPH, formatDegree, SIGN_ELEMENT } from "@/engine/zodiac";
import { ANIMAL_GLYPH, ANIMAL_HANZI, WUXING } from "@/engine/chinese";
import { MAJOR_ARCANA } from "@/engine/tarot";
import { TRAITS } from "@/engine/bigfive";
import { UnifiedGlance, UnifiedSignal } from "./adaptive/UnifiedGlance";
import { useAdaptive } from "./adaptive/text";
import { CARE } from "@/engine/quizzes";
import { AXES } from "@/engine/shadow";
import type { QuizId } from "@/lib/quiz-defs";
import type { StoredPerson } from "@/lib/store";
import { encodeProfileCode } from "@/lib/store";
import { RESULT_KEY, TEST_RUN, testPath, type TestId } from "@/lib/test-run";
import { teaserFor } from "@/lib/test-teaser";
import { profileSummary } from "@/story/voice";
import { Aura } from "./aura/Aura";
import { auraOf } from "@/lib/aura";
import { ShareButton } from "./ShareButton";
import { ThemeToggle } from "./PersonalTheme";
import { useCallback, useMemo, useState } from "react";
import { SignArt } from "./art/SignArt";
import { Emblem, type EmblemId } from "./art/Emblem";
import { emblemOf } from "./art/precisionArt";
import { LensSheet, LensSheetCtx, useLensSheet } from "./LensSheet";
import { BigFiveShape } from "./glance/BigFiveShape";
import { MethodLink } from "./nav/Trust";
import { Expand, GlanceHead } from "./glance/Expand";
import { useGlance } from "./glance/text";
import { FitCheck, BigFiveSourceNote } from "./FitCheck";
import { VoiceLines } from "./systems/VoiceLines";
import { SystemsSection } from "./systems/SystemsSection";
import { useSystems } from "./systems/useSystems";
import { OneResult, useRunInfo } from "./tests/TestRun";
import { TestsPanel } from "./tests/TestsPanel";
import { TeaserCard } from "./tests/ResultGate";
import { ProfileGate, useProfileTeaser, useResultsOpen } from "./profile/ProfileGate";
import { Fold, Part, SaveAcrossDevices, TodayCard } from "./profile/parts";

/** The readings behind each finished test, opened as sheets from its result. */
const TEST_LENSES: Partial<Record<TestId, string[]>> = { "big-five": ["bigfive", "fourletter", "temperament"], "big-five-long": ["bigfive"], "four-letter": ["fourletter"], attachment: ["attachment"], nine: ["nine"], care: ["care"], shadow: ["shadow"], dosha: ["dosha"], explorer: ["explorer"] };
const TAP = "inline-flex min-h-[44px] items-center gap-1 text-left";
/** The full meanings behind a card, as one quiet row of chips that open in a sheet. */
function MoreLinks({ keys }: { keys: string[] }) {
  const { c } = useContent(); const open = useLensSheet(); const L = c.lensUi.fullMeaning;
  return (
    <div className="mt-3">
      <p className="mb-1.5 text-xs text-dim">{L}</p>
      <div className="flex flex-wrap gap-2">{keys.map((k) => <button key={k} type="button" aria-haspopup="dialog" aria-label={`${L}: ${c.lensInfo[k].name}`} onClick={() => open(k)} className="chip min-h-[44px] !px-4 !text-sm text-mist transition hover:border-gold/60 hover:text-gold">{c.lensInfo[k].name}</button>)}</div>
    </div>
  );
}

const CARE_ICON: Record<string, string> = { words: "💬", time: "⏳", gifts: "🎁", help: "🤝", touch: "🫂" };
const DOSHA_COL = { vata: "#a9c8ff", pitta: "#f6b5cf", kapha: "#9fd8b8" } as const;

function AttachMap({ anxiety, avoidance }: { anxiety: number; avoidance: number }) {
  const G = useGlance();
  return (
    <div className="relative mx-auto h-40 w-40 rounded-2xl border border-white/15 bg-[radial-gradient(circle_at_0%_100%,rgba(159,216,184,.25),transparent_60%),radial-gradient(circle_at_100%_0%,rgba(246,181,207,.22),transparent_60%)]" aria-hidden>
      <div className="absolute inset-x-0 top-1/2 border-t border-white/10" /><div className="absolute inset-y-0 left-1/2 border-l border-white/10" />
      <span className="absolute left-1.5 top-1 text-[10px] text-dim">{G.worry} ↑</span><span className="absolute bottom-1 right-1.5 text-[10px] text-dim">{G.distance} →</span>
      <span className="absolute bottom-1 left-1.5 text-[10px] text-dim">{G.calm}</span>
      <span className="absolute h-5 w-5 -translate-x-1/2 translate-y-1/2 animate-pulse-glow rounded-full bg-[radial-gradient(circle_at_35%_35%,#fff,#f6cf7a)] shadow-[0_0_18px_rgba(246,207,122,.9)]" style={{ left: `${Math.max(6, Math.min(94, avoidance))}%`, bottom: `${Math.max(6, Math.min(94, anxiety))}%` }} />
    </div>
  );
}

function NineRing({ type, wing, growth, stress }: { type: number; wing: number; growth: number; stress: number }) {
  const p = (n: number, r = 62) => { const a = ((-90 + (n % 9) * 40) * Math.PI) / 180; return [80 + r * Math.cos(a), 80 + r * Math.sin(a)] as const; };
  const [tx, ty] = p(type), [gx, gy] = p(growth), [sx, sy] = p(stress);
  return (
    <svg viewBox="0 0 160 160" className="mx-auto h-40 w-40" aria-hidden>
      <circle cx="80" cy="80" r="62" fill="none" stroke="rgba(255,255,255,.12)" />
      <line x1={tx} y1={ty} x2={gx} y2={gy} stroke="#9fd8b8" strokeWidth="1.5" strokeDasharray="3 3" />
      <line x1={tx} y1={ty} x2={sx} y2={sy} stroke="#f6b5cf" strokeWidth="1.5" strokeDasharray="1 3" />
      {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => { const [x, y] = p(n); const on = n === type, w = n === wing; return (
        <g key={n}>
          {on && <circle cx={x} cy={y} r="15" fill="#f6cf7a" opacity=".35" className="animate-pulse-glow" />}
          <circle cx={x} cy={y} r={on ? 11 : w ? 8 : 6} fill={on ? "#f6cf7a" : w ? "rgba(246,207,122,.5)" : "rgba(255,255,255,.15)"} />
          <text x={x} y={y + 3.5} textAnchor="middle" fontSize={on ? 11 : 9} fill={on ? "#1c1645" : "#e9e4ff"} fontWeight="700">{n}</text>
        </g>); })}
    </svg>
  );
}

function DoshaRing({ pct }: { pct: Record<"vata" | "pitta" | "kapha", number> }) {
  const C = 2 * Math.PI * 52; let off = 0;
  return (
    <svg viewBox="0 0 140 140" className="mx-auto h-36 w-36 -rotate-90" aria-hidden>
      <circle cx="70" cy="70" r="52" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="16" />
      {(["vata", "pitta", "kapha"] as const).map((k) => { const len = (C * pct[k]) / 100; const el = <circle key={k} cx="70" cy="70" r="52" fill="none" stroke={DOSHA_COL[k]} strokeWidth="16" strokeDasharray={`${Math.max(0, len - 3)} ${C}`} strokeDashoffset={-off} strokeLinecap="round" />; off += len; return el; })}
    </svg>
  );
}

export function QuizResultView({ id, profile, pid = "me" }: { id: QuizId; profile: QuizView; pid?: string }) {
  const { c } = useContent(); const G = useGlance();
  const q = profile.quiz; const P = c.psych; const U = c.ui.profile;
  if (id === "big-five" && q.bigFive && profile.psych) {
    const fl = profile.psych.fourLetter, t = profile.psych.temperament;
    const style = P.fourLetterStyles[fl.code];
    const letterWord = (l: string) => P.letters[l].split(/[:,]/)[0];
    return (
      <div className="space-y-4">
        <div className="card" data-testid="glance-bigfive">
          <BigFiveShape b={q.bigFive} palette={profile.palette} />
          <Expand more={G.showNumbers} less={G.hideNumbers} testId="bigfive-numbers">
            {TRAITS.map((k) => { const v = q.bigFive![k]; const tr = P.traits[k]; return <Bar key={k} value={v} label={`${tr.name}: ${tr.plain}`} right={U.pct(v)} color={k === "N" ? "bg-rose" : "bg-gold"} />; })}
            <p className="text-xs text-dim">{U.pctNote}</p>
          </Expand>
          <BigFiveSourceNote profile={profile} pid={pid} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="card" data-testid="glance-temperament">
            <div className="mb-2 flex items-center justify-between"><h3 className="text-sm font-semibold text-dim">{U.temperaments}</h3><EvidenceBadge e="popular" /></div>
            <p className="h-display text-[1.75rem] leading-tight text-gold">{P.temperaments[t.primary].name}</p>
            <p className="text-sm">{P.temperaments[t.primary].text}</p>
            <Expand><p className="text-sm text-mist/85">{U.secondaryTip(P.temperaments[t.secondary].name, P.temperaments[t.primary].tip)}</p></Expand>
            <FitCheck kind="temperament" profile={profile} pid={pid} />
          </div>
          <div className="card" data-testid="glance-fourletter">
            <div className="mb-2 flex items-center justify-between"><h3 className="text-sm font-semibold text-dim">{U.fourLetter}</h3><EvidenceBadge e="popular" /></div>
            <p className="h-display text-[1.75rem] leading-tight text-gold">{fl.code} · {style.name}</p>
            <div className="my-2 grid grid-cols-4 gap-1.5">{fl.code.split("").map((l, k) => <div key={k} className="rounded-xl border border-white/10 bg-white/[0.05] px-1 py-2 text-center"><div className="h-display text-xl text-gold">{l}</div><div className="text-[10.5px] leading-tight text-dim">{letterWord(l)}</div></div>)}</div>
            <p className="text-sm">{style.text}</p>
            <Expand>
              {(["EI", "SN", "TF", "JP"] as const).map((d, k) => <p key={d} className="text-xs text-dim">{fl.code[k]} = {P.letters[fl.code[k]]} <span className="opacity-70">{U.clarity(fl.clarity[d])}</span></p>)}
              <p className="mt-2 text-xs text-dim">{U.flNote}</p>
            </Expand>
            <FitCheck kind="fourLetter" profile={profile} pid={pid} />
          </div>
        </div>
      </div>
    );
  }
  if (id === "attachment" && q.attachment) {
    const a = q.attachment, x = P.attachment[a.style];
    return (
      <div className="card" data-testid="glance-attachment">
        <GlanceHead visual={<AttachMap anxiety={a.anxiety} avoidance={a.avoidance} />} title={x.name} line={<><b>{U.youNeed}</b> {x.need}</>} />
        <Expand>
          <p className="mb-3 text-sm">{x.text}</p>
          <Bar value={a.anxiety} label={U.anxiety} color="bg-rose" />
          <Bar value={a.avoidance} label={U.avoidance} color="bg-sage" />
          <p className="mt-2 text-sm"><b>{U.tryLabel}</b> {x.tip}</p>
          <p className="mt-2 text-xs text-dim">{G.attachMap} {U.attachNote}</p>
        </Expand>
        <FitCheck kind="attachment" profile={profile} pid={pid} />
      </div>
    );
  }
  if (id === "nine" && q.nine) {
    const n = q.nine, x = P.nineStyles[n.type];
    return (
      <div className="card" data-testid="glance-nine">
        <GlanceHead visual={<NineRing type={n.type} wing={n.wing} growth={n.growth} stress={n.stress} />} eyebrow={G.nineWing(n.type, n.wing)} title={x.name} line={x.gift.charAt(0).toUpperCase() + x.gift.slice(1) + "."} />
        <Expand>
          <p className="text-sm">{U.nineCore(x.core, x.gift)}</p>
          <p className="mt-2 text-sm"><b>{U.growthLabel}</b> {x.growth}</p>
          <p className="mt-1 text-sm text-dim">{U.nineMoves(n.growth, P.nineStyles[n.growth].name, n.stress, P.nineStyles[n.stress].name)}</p>
          <div className="mt-3 grid grid-cols-9 gap-1">{n.scores.map((s, k) => <div key={k} className="flex flex-col items-center justify-end text-center text-xs" style={{ height: 70 }}><div className="mb-1 w-3 rounded bg-gold/70" style={{ height: Math.max(3, s * 6) }} />{k + 1}</div>)}</div>
        </Expand>
        <FitCheck kind="nine" profile={profile} pid={pid} />
      </div>
    );
  }
  if (id === "care" && q.care) {
    const r = q.care; const [a, b] = r.topReceive;
    return (
      <div className="card" data-testid="glance-care">
        <GlanceHead visual={<div className="flex gap-3">{[a, b].map((k, i) => <div key={k} className={`grid place-items-center rounded-3xl border border-gold/30 bg-gold/10 ${i === 0 ? "h-24 w-24 text-5xl" : "h-20 w-20 self-end text-4xl opacity-90"}`}><span aria-hidden>{CARE_ICON[k]}</span></div>)}</div>}
          title={`${P.care[a].name} · ${P.care[b].name}`} line={<>{G.careHead(P.care[a].name, P.care[b].name)} {G.careGives(P.care[r.give].name)}</>} />
        <Expand>
          {CARE.map((k) => <Bar key={k} value={(r.receive[k] / 4) * 100} label={`${CARE_ICON[k]} ${P.care[k].name}`} right={`${r.receive[k]}/4`} />)}
          <p className="mt-2 text-sm">{P.care[a].text}</p>
          <p className="text-sm"><b>{U.tryLabel}</b> {P.care[a].tip}</p>
          <p className="mt-2 text-xs text-dim">{P.careNote}</p>
        </Expand>
      </div>
    );
  }
  if (id === "shadow" && q.shadow) {
    const r = q.shadow; const L = P.shadowAxes[r.strongestLight], S = P.shadowAxes[r.mainShadow];
    return (
      <div className="card" data-testid="glance-shadow">
        <GlanceHead visual={<div className="flex items-center gap-2"><span className="chip !border-gold/50 !bg-gold/15 !px-4 !py-2 text-base text-gold">☀ {L.virtue}</span><span className="text-dim">·</span><span className="chip !border-rose/50 !bg-rose/10 !px-4 !py-2 text-base text-rose">☾ {S.classical}</span></div>}
          line={G.shadowHead(L.virtue, S.classical)} />
        <p className="mt-3 rounded-2xl bg-white/[0.05] p-3 text-center text-sm"><b>{U.thisWeek}</b> {S.practice}</p>
        <Expand>
          <p className="mb-3 text-sm">{U.brightest}<b className="text-gold">{L.virtue}</b>{U.befriend}<b className="text-rose">{S.classical}</b>{U.whoseGift}{S.gift.toLowerCase()}</p>
          <div className="space-y-3">{AXES.map((ax) => {
            const x = r.axes.find((y) => y.axis === ax)!; const t = P.shadowAxes[ax];
            return (
              <div key={ax} className="rounded-xl bg-white/5 p-3">
                <div className="mb-1 text-sm font-semibold">{t.classical} ↔ {t.virtue}</div>
                <div className="grid grid-cols-2 gap-3"><Bar value={x.shadow} label={U.shadow} color="bg-rose" /><Bar value={x.light} label={U.light} color="bg-gold" /></div>
                <p className="text-xs text-dim">{U.shadowGift(t.shadow, t.gift)}</p>
              </div>
            );
          })}</div>
        </Expand>
      </div>
    );
  }
  if (id === "dosha" && q.dosha) {
    const r = q.dosha;
    const [head, ...rest] = P.constitutions[r.constitution].split(/: /);
    return (
      <div className="card" data-testid="glance-dosha">
        <GlanceHead visual={<DoshaRing pct={r.pct} />} title={head} line={rest.length ? rest.join(": ").replace(/^./, (x) => x.toUpperCase()) : undefined} />
        <div className="mt-2 flex justify-center gap-3 text-xs text-dim">{(["vata", "pitta", "kapha"] as const).map((k) => <span key={k} className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full" style={{ background: DOSHA_COL[k] }} />{P.doshas[k].name}</span>)}</div>
        {r.constitution !== "tridoshic" && <p className="mt-3 text-center text-sm"><b>{U.balancing}</b> {P.doshas[r.dominant].balance}.</p>}
        <Expand>
          {(["vata", "pitta", "kapha"] as const).map((k) => <Bar key={k} value={r.pct[k]} label={`${P.doshas[k].name} (${P.doshas[k].element})`} right={`${r.pct[k]}%`} />)}
          <p className="mt-2 text-sm">{r.constitution === "tridoshic" ? U.tridoshic : P.doshas[r.dominant].text}</p>
          <p className="mt-2 text-xs text-dim">{P.doshaNote}</p>
        </Expand>
      </div>
    );
  }
  if (id === "explorer" && q.explorer) {
    const r = q.explorer, E = P.explorer; const lvl = r.explorer < 40 ? "low" : r.explorer > 60 ? "high" : "mid";
    return (
      <div className="card" data-testid="glance-explorer">
        <GlanceHead eyebrow={E.name} title={G.explorerHead[lvl]} />
        <div className="mx-auto mt-3 max-w-sm"><Dial value={r.explorer} left={U.autopilot} right={U.explorer} /></div>
        <p className="mt-3 text-center text-sm">{E[lvl]}</p>
        <p className="mt-2 text-center text-sm"><span className="text-dim">{U.socialStance}</span><span className="text-gold">{P.stances[r.stance].name}</span></p>
        <Expand>
          <div className="grid gap-1">{Object.entries(r.dims).map(([k, v]) => <Bar key={k} value={v} label={E.dims[k]} color="bg-sage" />)}</div>
          <div className="mt-3 rounded-xl bg-white/5 p-3">
            <p className="text-sm">{P.stances[r.stance].text}</p>
            <div className="relative mt-3 h-40 rounded-xl border border-white/10">
              <span className="absolute left-2 top-1 text-[10px] text-dim">{U.belonging}</span><span className="absolute bottom-1 right-2 text-[10px] text-dim">{U.confidence}</span>
              <span className="absolute h-4 w-4 -translate-x-1/2 translate-y-1/2 rounded-full bg-gold" style={{ left: `${r.confidence}%`, bottom: `${r.belonging}%` }} />
            </div>
          </div>
          <p className="mt-2 text-xs text-dim">{E.text} {E.note}</p>
        </Expand>
      </div>
    );
  }
  return null;
}

type ViewProps = { person: StoredPerson; profile: Profile; isMe: boolean };

/** Every finished test as one row: the headline shows, the full result opens in place. Lens links need a birth date. */
export function TestResults({ person, isMe, lenses }: { person: StoredPerson; isMe: boolean; lenses: boolean }) {
  const { c } = useContent(); const h = useHref(); const G = useGlance(); const A = useAdaptive(); const info = useRunInfo();
  const view = quizViewOf(person); const qs = isMe ? "" : `?for=${person.id}`;
  return (
    <div className="space-y-2" data-testid="me-results">
      {TEST_RUN.filter((id) => person.quiz[RESULT_KEY[id]]).map((id) => (
        <Fold key={id} small title={info.of(id).title} hint={teaserFor(id, view, c, G, A)?.title} emblem={id === "adaptive" ? "big-five" : emblemOf(id)} testId={`me-result-${id}`}>
          <OneResult id={id} person={person} />
          {lenses && TEST_LENSES[id] && <div className="px-1"><MoreLinks keys={TEST_LENSES[id]} /></div>}
          <div className="mt-1 flex flex-wrap items-center gap-x-4 px-1">
            <MethodLink className="!mt-0 min-h-[44px]" />
            <Link className={`${TAP} text-xs text-dim underline`} href={h(`${testPath(id)}${qs}`)}>{c.site.common.retake}</Link>
          </div>
        </Fold>
      ))}
    </div>
  );
}

/** Tests still open for someone else: they answer on this device, so each is a plain link. */
function OpenTests({ person }: { person: StoredPerson }) {
  const { c } = useContent(); const h = useHref(); const info = useRunInfo();
  const open = TEST_RUN.filter((id) => !person.quiz[RESULT_KEY[id]]);
  if (!open.length) return null;
  return (
    <Part title={c.ui.myProfile.testsFor(person.name)}>
      <ul className="grid gap-2 sm:grid-cols-2">
        {open.map((id) => (
          <li key={id}><Link href={h(`${testPath(id)}?for=${person.id}`)} className="flex min-h-[56px] items-center gap-3 rounded-2xl border border-white/12 bg-white/[0.04] px-3 py-2 transition hover:border-gold/40">
            <Emblem id={id === "adaptive" ? "big-five" : emblemOf(id)} className="h-9 w-9 shrink-0" />
            <span className="min-w-0 flex-1"><span className="block truncate font-semibold">{info.of(id).title}</span><span className="block text-xs text-dim">{c.ui.quizHub.min(info.of(id).minutes)}</span></span>
            <span aria-hidden className="text-gold">→</span>
          </Link></li>
        ))}
      </ul>
    </Part>
  );
}

function PersonalityBody({ person, isMe }: { person: StoredPerson; isMe: boolean }) {
  return (
    <div className="space-y-3">
      <UnifiedGlance person={person} isMe={isMe} compact hideNext />
      <TestResults person={person} isMe={isMe} lenses={!!person.date} />
      {!isMe && <OpenTests person={person} />}
    </div>
  );
}

function SkyBody({ profile }: { profile: Profile }) {
  const { c } = useContent(); const A = c.astro; const U = c.ui.profile;
  return (
    <>
      <Part title={U.coreSelf} aside={<EvidenceBadge e="traditional" />}>
        <div className="grid gap-3">
          {[
            { k: "Sun", s: profile.sun, t: A.signs[profile.sun].sun, deg: profile.chart.placements.sun!.lon },
            { k: "Moon", s: profile.moon, t: A.signs[profile.moon].moon, deg: profile.chart.placements.moon!.lon },
            ...(profile.rising ? [{ k: "Rising", s: profile.rising, t: A.signs[profile.rising].rising, deg: profile.chart.placements.asc!.lon }] : []),
          ].map((x) => (
            <div key={x.k} className="card flex gap-4 !p-4">
              <SignArt sign={x.s} className="hidden h-24 w-24 shrink-0 sm:block" animate={false} />
              <div className="min-w-0 flex-1">
                <h4 className="font-display text-xl leading-tight">{SIGN_GLYPH[x.s]} {U.placementTitle[x.k]} <span className="text-gold">{A.signs[x.s].name}</span></h4>
                <p className="mb-1 text-xs text-dim">{formatDegree(x.deg)} · {c.astro.elements[SIGN_ELEMENT[x.s]].name}</p>
                <p className="text-sm">{x.t}</p>
                {x.k === "Sun" && <p className="mt-1 text-xs text-dim">{U.giftsGrowth(A.signs[x.s].gifts, A.signs[x.s].edge)}</p>}
              </div>
            </div>
          ))}
          {profile.chart.moonAmbiguous && <p className="text-xs text-dim">{U.moonMaybe(profile.chart.moonAlternatives.map((s) => A.signs[s].name).join(U.or))}</p>}
          {!profile.rising && <p className="text-xs text-dim">{U.addTime}</p>}
          <MoreLinks keys={["sun", "moon", ...(profile.rising ? ["rising"] : []), "venus", "mars", "mercury"]} />
        </div>
      </Part>
      <Part title={U.vedicTitle} aside={<EvidenceBadge e="traditional" />}>
        <div className="card !p-4">
          <p className="font-display text-xl leading-tight text-gold">{U.vedicMoon(c.vedic.nakshatras[profile.vedic.nakshatra].name, profile.vedic.pada, A.signs[profile.vedic.rashi].name)}</p>
          <p className="mt-1 text-sm">{U.birthStar(c.vedic.nakshatras[profile.vedic.nakshatra].symbol, c.vedic.nakshatras[profile.vedic.nakshatra].text)}</p>
          {profile.vedic.lagna && <p className="text-sm">{U.lagna(A.signs[profile.vedic.lagna].name)}</p>}
          {profile.vedic.ambiguous && <p className="text-xs text-dim">{U.starMayDiffer}</p>}
          <p className="mt-1 text-xs text-dim">{c.vedic.vedicNote}</p>
          <MoreLinks keys={["vedic"]} />
        </div>
      </Part>
    </>
  );
}

function NumbersBody({ person, profile, isMe }: ViewProps) {
  const { c } = useContent(); const fmt = useDate(); const U = c.ui.profile;
  const ch = profile.chinese; const n = profile.numbers;
  const cards = profile.tarot.cards.map((k) => c.nums.tarot[MAJOR_ARCANA[k === 22 ? 0 : k]]);
  return (
    <>
      <Part title={U.numbersTitle} aside={<EvidenceBadge e="traditional" />}>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="card !p-4">
            <p className="font-display text-xl leading-tight text-gold">{U.lifePathHead(n.lifePath, c.nums.numbers[n.lifePath].name)}</p>
            <p className="mt-1 text-sm">{c.nums.numbers[n.lifePath].lifePath}</p>
            <p className="mt-1 text-xs text-dim">{U.howWeGot(n.lifePathSteps, n.birthday, n.personalYear, new Date().getFullYear())}</p>
          </div>
          <div className="card !p-4">
            {n.name ? (
              <>
                <p className="text-sm"><b>{U.expression(n.name.expression)}</b>: {c.nums.numbers[n.name.expression]?.expression}</p>
                <p className="text-sm"><b>{U.soulUrge(n.name.soulUrge)}</b>: {c.nums.numbers[n.name.soulUrge]?.soul}</p>
                <p className="text-sm"><b>{U.personality(n.name.personality)}</b>: {c.nums.numbers[n.name.personality]?.essence}</p>
                <p className="mt-1 text-xs text-dim">{U.fromName(person.birthName || person.name)}</p>
              </>
            ) : <p className="text-sm text-dim">{U.addName}</p>}
          </div>
          <div className="card !p-4 sm:col-span-2">
            <p className="font-display text-xl leading-tight text-gold">{U.tarotCards(cards.length > 1, cards.map((x) => x.name).join(" · "))}</p>
            {cards.map((x) => <p key={x.name} className="mt-1 text-sm"><b>{x.name}</b> ({x.keyword}): {x.birth}</p>)}
            <MoreLinks keys={["tarot", "lifepath", "personalyear"]} />
          </div>
        </div>
      </Part>
      <Part title={U.chineseTitle} aside={<EvidenceBadge e="traditional" />}>
        <div className="card !p-4">
          <p className="font-display text-xl leading-tight text-gold">{ANIMAL_GLYPH[ch.animal]} {c.chinese.wuxing[ch.element].name} {c.chinese.animals[ch.animal].name} <span className="text-dim">{ANIMAL_HANZI[ch.animal]}</span> · {ch.yinYang === "yin" ? U.yin : U.yang}</p>
          <p className="mt-1 text-sm">{c.chinese.animals[ch.animal].essence}</p>
          <p className="mt-1 text-xs text-dim">{U.giftsGrowth(c.chinese.animals[ch.animal].gifts, c.chinese.animals[ch.animal].edge)}{U.zodiacYear(fmt(ch.lunarNewYear))}</p>
          {ch.conventionsDiffer && <p className="mt-2 rounded-lg bg-white/5 p-2 text-xs">{U.liChun(c.chinese.animals[ch.animalLiChun].name)}</p>}
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-sm font-semibold">{U.dayMaster(c.chinese.wuxing[ch.dayMaster.element].name, ch.dayMaster.yinYang === "yin" ? U.yin : U.yang)}</p>
              <p className="text-xs text-dim">{c.chinese.wuxing[ch.dayMaster.element].text}</p>
              <p className="mt-1 text-xs text-dim">{U.pillars(ch.pillars)}{!profile.chart.time.timeKnown && U.hourPillar}{ch.solarTime && ` ${c.accuracy.solarTime(ch.solarTime)}`}{ch.monthAmbiguous && ` ${c.accuracy.monthAmbiguous}`}</p>
            </div>
            <div>{WUXING.map((w) => <Bar key={w} value={(ch.balance[w] / 4) * 100} label={c.chinese.wuxing[w].name} right={String(ch.balance[w])} color="bg-sage" />)}</div>
          </div>
          <MoreLinks keys={["chinese", "wuxing"]} />
        </div>
      </Part>
      <SystemsSection person={person} profile={profile} isMe={isMe} embedded />
    </>
  );
}

function EnergyBody({ person, profile, isMe }: ViewProps) {
  const { c } = useContent(); const h = useHref(); const A = c.astro; const U = c.ui.profile; const R = c.ui.ritual;
  return (
    <div className="grid gap-3">
      {/* Aura: symbolic visual from palette + attunement answers */}
      <div className="card grid items-center gap-4 overflow-hidden !p-4 sm:grid-cols-[minmax(0,240px)_1fr]">
        <div className="relative mx-auto h-60 w-full max-w-[240px]"><Aura data-aura className="h-full w-full" {...auraOf(person)} label={R.auraLabel(person.name)} /></div>
        <div>
          <p className="eyebrow mb-1">✦ {R.auraTitle}</p>
          <p className="mb-3 text-sm text-dim">{R.auraNote}</p>
          {person.aura && <div className="mb-3 flex flex-wrap gap-2 text-xs">
            {person.aura.weather && <span className="chip">{R.weather[person.aura.weather]}</span>}
            {person.aura.body && <span className="chip">{R.body[person.aura.body]}</span>}
            {person.aura.intention && <span className="chip">{R.intent[person.aura.intention]}</span>}
          </div>}
          {isMe && <Link className="btn-ghost !min-h-[44px]" href={h("/start/?attune=1")}>{R.reattune}</Link>}
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="card !p-4">
          <p className="mb-2 font-semibold">{U.yinYangPoint(profile.yang)}</p>
          <Dial value={profile.yang} left={U.yinLabel} right={U.yangLabel} />
          <p className="mt-2 text-xs text-dim">{U.blended(!!profile.quiz.bigFive, !!profile.quiz.dosha)}</p>
        </div>
        <div className="card !p-4">
          <p className="font-display text-xl leading-tight text-gold">{c.psych.archetypeAnimals[profile.archetypeAnimal].name}</p>
          <p className="mt-1 text-sm">{c.psych.archetypeAnimals[profile.archetypeAnimal].text}</p>
          <div className="mt-2"><Palette colors={profile.palette} size="h-8" /></div>
          <p className="mt-2 text-xs text-dim">{c.psych.archetypeNote}{U.strongestEl(A.elements[profile.dominantElement].name)}</p>
          <MoreLinks keys={["animal", "palette", "yinyang"]} />
        </div>
      </div>
    </div>
  );
}

/** Who this is, in a few lines. The rest of the personal voice opens under it. */
function Summary({ person, profile, isMe }: ViewProps) {
  const { c } = useContent(); const h = useHref(); const A = c.astro; const U = c.ui.profile; const V = c.systems.voiceUi; const open = useLensSheet();
  const { sys } = useSystems(person, profile); const resultsOpen = useResultsOpen();
  const lines = useMemo(() => profileSummary({ c, p: profile, sys, name: person.name, answers: person.answers, aura: person.aura, placeName: person.place?.name ?? null }), [c, profile, sys, person]);
  const moon = profile.chart.moonAmbiguous ? profile.chart.moonAlternatives.map((s) => A.signs[s].name).join(U.or) : A.signs[profile.moon].name;
  const chips: [string, string][] = [
    ["sun", `${SIGN_GLYPH[profile.sun]} ${U.sunIn(A.signs[profile.sun].name)}`],
    ["moon", `☽ ${U.moonIn(moon)}`],
    ...(profile.rising ? [["rising", `↑ ${U.risingIn(A.signs[profile.rising].name)}`] as [string, string]] : []),
  ];
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/15 px-5 py-6 sm:px-8 sm:py-8" data-testid="me-summary"
      style={{ background: `radial-gradient(110% 90% at 85% 0%, ${profile.palette[0]}44, transparent 60%), linear-gradient(160deg, #1a1442, #0e0b26)` }}>
      <SignArt sign={profile.sun} className="pointer-events-none absolute -right-10 -top-8 h-44 w-44 opacity-40 sm:right-0 sm:h-56 sm:w-56" animate={false} />
      <div className="relative">
        <p className="eyebrow mb-1">{isMe ? c.ui.pageMeta.me.title : U.profileEyebrow}</p>
        <h1 className="h-display text-5xl leading-none sm:text-6xl"><span className="text-aurora">{person.name}</span></h1>
        <div className="mt-4 flex flex-wrap gap-2">
          {chips.map(([k, label]) => <button key={k} type="button" aria-haspopup="dialog" onClick={() => open(k)} className="chip min-h-[44px] !px-4 !text-sm text-mist transition hover:border-gold/60 hover:text-gold">{label}</button>)}
        </div>
        <p className="mt-4 max-w-2xl text-[15.5px] leading-relaxed text-mist/90">{lines[0].text}</p>
        {resultsOpen && lines.length > 1 && (
          <Expand more={V.title}>
            <VoiceLines lines={lines.slice(1)} className="text-[15.5px]" />
            <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-white/10 pt-3 text-xs text-dim">
              <span>🔒 {V.private}</span>
              <Link className="underline decoration-dotted underline-offset-4 hover:text-mist" href={h("/how-it-works/#voice")}>{V.how} →</Link>
            </p>
          </Expand>
        )}
      </div>
    </section>
  );
}

/** Everything personal, behind one form. While a reading sheet is open that sheet holds the form, so a page never shows two. */
function ProfileResults({ person, profile, isMe, sheetOpen }: ViewProps & { sheetOpen: boolean }) {
  const { c } = useContent(); const M = c.ui.myProfile; const A = c.astro; const U = c.ui.profile;
  const resultsOpen = useResultsOpen(); const teaser = useProfileTeaser(person, profile);
  const done = TEST_RUN.filter((id) => person.quiz[RESULT_KEY[id]]).length;
  const ch = profile.chinese; const S = (s: keyof typeof A.signs) => A.signs[s].name;
  if (sheetOpen && !resultsOpen) return teaser ? <TeaserCard t={teaser} /> : null;
  return (
    <ProfileGate person={person} profile={profile}>
      <div className="space-y-3" data-testid="me-folds">
        {(done > 0 || !isMe) && <Fold emblem="big-five" title={M.folds.personality} hint={done ? M.folds.results(done) : M.folds.noResults} testId="fold-personality"><PersonalityBody person={person} isMe={isMe} /></Fold>}
        <Fold emblem="sun" title={M.folds.sky} hint={[profile.sun, profile.moon, profile.rising].filter((s) => s !== null).map(S).join(" · ")} testId="fold-sky"><SkyBody profile={profile} /></Fold>
        <Fold emblem="number" title={M.folds.numbers} hint={`#${profile.numbers.lifePath} · ${c.chinese.wuxing[ch.element].name} ${c.chinese.animals[ch.animal].name}`} testId="fold-numbers"><NumbersBody person={person} profile={profile} isMe={isMe} /></Fold>
        <Fold emblem="palette" title={M.folds.energy} hint={c.psych.archetypeAnimals[profile.archetypeAnimal].name} testId="fold-energy"><EnergyBody person={person} profile={profile} isMe={isMe} /></Fold>
      </div>
    </ProfileGate>
  );
}

/** The long pages, one tap away. */
function DeepLinks({ person, isMe }: { person: StoredPerson; isMe: boolean }) {
  const { c } = useContent(); const h = useHref(); const U = c.ui.profile; const q = isMe ? "" : `?id=${person.id}`;
  const links: [string, EmblemId, string][] = [
    [`/book/${q}`, "tarot", c.book.title],
    [`/chart/${q}`, "chart", U.fullChart],
    ...(isMe ? [["/you/", "eye", c.you.title], ["/people/", "bond", c.ui.myProfile.people]] as [string, EmblemId, string][] : [[`/match/?b=${person.id}`, "bond", U.compatWithMe]] as [string, EmblemId, string][]),
  ];
  return (
    <nav className="grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label={c.lensUi.related} data-testid="me-deep">
      {links.map(([href, emblem, label]) => (
        <Link key={href} href={h(href)} className="flex min-h-[64px] items-center gap-2.5 rounded-2xl border border-white/12 bg-white/[0.04] px-3 py-2 text-sm font-semibold leading-tight transition active:scale-[.98] hover:border-gold/40">
          <Emblem id={emblem} className="h-8 w-8 shrink-0" /><span className="min-w-0 hyphens-auto [overflow-wrap:anywhere]">{label}</span>
        </Link>
      ))}
    </nav>
  );
}

/** Quiet actions at the end. Sharing and the profile code carry results, so they wait for the form like the results do. */
function ProfileActions({ person, profile, isMe }: ViewProps) {
  const { c } = useContent(); const h = useHref(); const A = c.astro; const U = c.ui.profile; const resultsOpen = useResultsOpen();
  const [codeShown, setCodeShown] = useState(false);
  const ch = profile.chinese; const n = profile.numbers; const fl = profile.psych?.fourLetter;
  const cards = profile.tarot.cards.map((k) => c.nums.tarot[MAJOR_ARCANA[k === 22 ? 0 : k]]);
  const quiet = `${TAP} text-sm text-dim underline decoration-dotted underline-offset-4 hover:text-mist`;
  const shareSpec = {
    eyebrow: U.codexOf(person.name),
    title: `${U.sunIn(A.signs[profile.sun].name)} · ${U.moonIn(A.signs[profile.moon].name)}`,
    subtitle: `${profile.rising ? `${U.risingIn(A.signs[profile.rising].name)} · ` : ""}${c.chinese.wuxing[ch.element].name} ${c.chinese.animals[ch.animal].name}`,
    lines: [
      U.lifePathLine(n.lifePath, c.nums.numbers[n.lifePath].name),
      U.animalLine(c.psych.archetypeAnimals[profile.archetypeAnimal].name),
      U.tarotLine(cards[0].name),
      fl ? `${fl.code} · ${c.psych.fourLetterStyles[fl.code].name}` : "",
      profile.quiz.nine ? U.motivationLine(profile.quiz.nine.type, c.psych.nineStyles[profile.quiz.nine.type].name) : "",
    ].filter(Boolean),
    palette: profile.palette, footer: c.site.brand,
    image: () => document.querySelector<HTMLCanvasElement>("canvas[data-aura]"),
  };
  if (!isMe && !resultsOpen) return null;
  return (
    <div data-testid="me-actions">
      <div className="flex flex-wrap items-center justify-center gap-x-5">
        {isMe && <Link className={quiet} href={h("/start/")}>{c.ui.me.editBirth}</Link>}
        {resultsOpen && <ShareButton spec={shareSpec} filename={`${person.name}-profile.png`} className={quiet} />}
        {isMe && <ThemeToggle className={quiet} />}
        {isMe && resultsOpen && <button type="button" className={quiet} aria-expanded={codeShown} onClick={() => setCodeShown(!codeShown)}>{U.myCode}</button>}
      </div>
      {codeShown && (
        <div className="mt-2 rounded-xl bg-night/60 p-3 text-xs">
          <p className="mb-1 text-dim">{U.codeHelp}</p>
          <textarea readOnly className="input h-24 font-mono text-[11px]" value={encodeProfileCode(person)} onFocus={(e) => e.currentTarget.select()} />
        </div>
      )}
    </div>
  );
}

export function ProfileView({ person, profile, isMe }: ViewProps) {
  const [sheet, setSheet] = useState<string | null>(null);
  const closeSheet = useCallback(() => setSheet(null), [setSheet]);
  const below = (
    <div className="space-y-4">
      <ProfileResults person={person} profile={profile} isMe={isMe} sheetOpen={!!sheet} />
      <DeepLinks person={person} isMe={isMe} />
      {isMe && <SaveAcrossDevices />}
      <ProfileActions person={person} profile={profile} isMe={isMe} />
    </div>
  );
  return (
    <LensSheetCtx.Provider value={setSheet}>
      {isMe && <UnifiedSignal person={person} />}
      <div className="space-y-4" data-testid="profile-view">
        <Summary person={person} profile={profile} isMe={isMe} />
        {isMe && <TodayCard profile={profile} />}
        {isMe ? <TestsPanel>{below}</TestsPanel> : below}
      </div>
      <LensSheet k={sheet} profile={profile} personId={isMe ? undefined : person.id} personName={person.name} onClose={closeSheet} />
    </LensSheetCtx.Provider>
  );
}
