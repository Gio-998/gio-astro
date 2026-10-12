"use client";
import Link from "next/link";
import type { Profile } from "@/engine/profile";
import { useContent, useHref, useDate } from "@/lib/content-context";
import { Bar, Dial, EvidenceBadge, Locked, Palette, Section } from "./ui";
import { SIGN_GLYPH, formatDegree, SIGN_ELEMENT } from "@/engine/zodiac";
import { ANIMAL_GLYPH, ANIMAL_HANZI, WUXING } from "@/engine/chinese";
import { MAJOR_ARCANA } from "@/engine/tarot";
import { TRAITS } from "@/engine/bigfive";
import { CARE } from "@/engine/quizzes";
import { AXES } from "@/engine/shadow";
import { quizDefs, QUIZ_IDS, QuizId } from "@/lib/quiz-defs";
import type { StoredPerson } from "@/lib/store";
import { encodeProfileCode } from "@/lib/store";
import { Aura } from "./aura/Aura";
import { auraOf } from "@/lib/aura";
import { ShareButton } from "./ShareButton";
import { ThemeToggle } from "./PersonalTheme";
import { useCallback, useState } from "react";
import { SignArt } from "./art/SignArt";
import { Celebration } from "./art/Celebration";
import { cosmos } from "./art/ArtCard";
import { LensSheet, LensSheetCtx, useLensSheet } from "./LensSheet";
import { BigFiveShape } from "./glance/BigFiveShape";
import { MethodLink } from "./nav/Trust";
import { Expand, GlanceHead } from "./glance/Expand";
import { useGlance } from "./glance/text";
import { FitCheck, BigFiveSourceNote } from "./FitCheck";
import { PrecisionSection } from "./PrecisionResult";

const QUIZ_LENS: Record<QuizId, string> = { "big-five": "bigfive", attachment: "attachment", nine: "nine", care: "care", shadow: "shadow", dosha: "dosha", explorer: "explorer" };
function MoreLink({ k }: { k: string; pid?: string }) {
  const { c } = useContent(); const open = useLensSheet();
  return <button type="button" onClick={() => open(k)} className="mt-2 inline-block text-left text-sm text-gold underline decoration-dotted underline-offset-4">{c.lensUi.fullMeaning}: {c.lensInfo[k].name} ↓</button>;
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

export function QuizResultView({ id, profile, pid = "me" }: { id: QuizId; profile: Profile; pid?: string }) {
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

export function ProfileView({ person, profile, isMe }: { person: StoredPerson; profile: Profile; isMe: boolean }) {
  const { c } = useContent(); const h = useHref(); const fmt = useDate();
  const A = c.astro; const defs = quizDefs(c); const U = c.ui.profile;
  const ch = profile.chinese; const n = profile.numbers;
  const quizFor = (id: QuizId) => h(`/quiz/${id}/${isMe ? "" : `?for=${person.id}`}`);
  const unlocked = QUIZ_IDS.filter((id) => profile.quiz[defs[id].resultKey]);
  const lensCount = 9 + unlocked.length + (unlocked.includes("big-five") ? 2 : 0);
  const fl = profile.psych?.fourLetter;
  const cards = profile.tarot.cards.map((k) => c.nums.tarot[MAJOR_ARCANA[k === 22 ? 0 : k]]);
  const [codeShown, setCodeShown] = useState(false);
  const [sheet, setSheet] = useState<string | null>(null);
  const closeSheet = useCallback(() => setSheet(null), [setSheet]);

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

  return (
    <LensSheetCtx.Provider value={setSheet}>
    <div>
      {/* Cover */}
      <div className="relative overflow-hidden rounded-[36px] border border-white/15 p-6 shadow-[0_40px_90px_-40px_rgba(139,108,240,.9)] sm:p-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cosmos("orion", 1280)} alt="" className="absolute inset-0 h-full w-full animate-kenburns object-cover opacity-40" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(120deg, #120f2e 15%, ${profile.palette[0]}55 60%, ${profile.palette[4]}66)` }} />
        {isMe && <Celebration count={18} />}
        <SignArt sign={profile.sun} className="pointer-events-none absolute -right-10 -top-6 h-72 w-72 opacity-70 sm:right-2 sm:h-80 sm:w-80" />
        <div className="relative">
        <p className="eyebrow mb-2">{isMe ? U.yourCodex : U.profileEyebrow}</p>
        <h1 className="h-display mb-1 text-5xl sm:text-6xl"><span className="text-aurora">{person.name}</span></h1>
        <p className="h-display mb-5 text-2xl italic text-mist/90">{U.sunIn(A.signs[profile.sun].name)} · {U.moonIn(A.signs[profile.moon].name)}{profile.rising ? ` · ${U.risingIn(A.signs[profile.rising].name)}` : ""}</p>
        <button type="button" aria-haspopup="dialog" onClick={() => setSheet("sunmoon")} className="mb-4 inline-block text-sm text-gold underline decoration-dotted underline-offset-4 text-left">ⓘ {c.lensUi.explainer}</button>
        <div className="flex flex-wrap gap-2 text-sm">
          <button type="button" aria-haspopup="dialog" onClick={() => setSheet("sun")} className="chip text-mist hover:border-gold/60 hover:text-gold">{SIGN_GLYPH[profile.sun]} {U.sunIn(A.signs[profile.sun].name)}</button>
          <button type="button" aria-haspopup="dialog" onClick={() => setSheet("moon")} className="chip text-mist hover:border-gold/60 hover:text-gold">☽ {U.moonIn(profile.chart.moonAmbiguous ? profile.chart.moonAlternatives.map((s) => A.signs[s].name).join(U.or) : A.signs[profile.moon].name)}</button>
          {profile.rising && <button type="button" aria-haspopup="dialog" onClick={() => setSheet("rising")} className="chip text-mist hover:border-gold/60 hover:text-gold">AC {U.risingIn(A.signs[profile.rising].name)}</button>}
          <button type="button" aria-haspopup="dialog" onClick={() => setSheet("chinese")} className="chip text-mist hover:border-gold/60 hover:text-gold">{ANIMAL_GLYPH[ch.animal]} {c.chinese.wuxing[ch.element].name} {c.chinese.animals[ch.animal].name}</button>
          <button type="button" aria-haspopup="dialog" onClick={() => setSheet("lifepath")} className="chip text-mist hover:border-gold/60 hover:text-gold">#{n.lifePath} {c.lensInfo.lifepath.name}</button>
          <button type="button" aria-haspopup="dialog" onClick={() => setSheet("animal")} className="chip text-mist hover:border-gold/60 hover:text-gold">🜁 {c.psych.archetypeAnimals[profile.archetypeAnimal].name}</button>
          {fl && <button type="button" aria-haspopup="dialog" onClick={() => setSheet("fourletter")} className="chip text-mist hover:border-gold/60 hover:text-gold">{fl.code} · {c.lensInfo.fourletter.name}</button>}
          {profile.quiz.nine && <button type="button" aria-haspopup="dialog" onClick={() => setSheet("nine")} className="chip text-mist hover:border-gold/60 hover:text-gold">◎ {profile.quiz.nine.type}w{profile.quiz.nine.wing} · {c.psych.nineStyles[profile.quiz.nine.type].name}</button>}
          {profile.quiz.attachment && <button type="button" aria-haspopup="dialog" onClick={() => setSheet("attachment")} className="chip text-mist hover:border-gold/60 hover:text-gold">♡ {c.psych.attachment[profile.quiz.attachment.style].name}</button>}
          {profile.quiz.dosha && <button type="button" aria-haspopup="dialog" onClick={() => setSheet("dosha")} className="chip text-mist hover:border-gold/60 hover:text-gold">❋ {c.psych.constitutions[profile.quiz.dosha.constitution].split(/: | — /)[0]}</button>}
        </div>
        <p className="mt-2 text-xs text-dim">{c.lensUi.tapHint}</p>
        <button type="button" aria-haspopup="dialog" onClick={() => setSheet("palette")} className="mt-5 block max-w-sm transition hover:opacity-90 text-left"><span className="mb-1.5 block text-xs uppercase tracking-widest text-dim">{U.yourPalette}</span><Palette colors={profile.palette} size="h-9" /></button>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link className="btn-primary" href={h(`/book/${isMe ? "" : `?id=${person.id}`}`)}>📖 {c.book.title}</Link>
          {isMe && <ThemeToggle />}
          <ShareButton spec={shareSpec} filename={`${person.name}-codex.png`} />
          <Link className="btn-ghost" href={h(`/chart/?id=${person.id}`)}>{U.fullChart}</Link>
          {!isMe && <Link className="btn-ghost" href={h(`/match/?b=${person.id}`)}>{U.compatWithMe}</Link>}
          {isMe && <button className="btn-ghost" onClick={() => setCodeShown(!codeShown)}>{U.myCode}</button>}
        </div>
        {codeShown && (
          <div className="mt-3 rounded-xl bg-night/60 p-3 text-xs">
            <p className="mb-1 text-dim">{U.codeHelp}</p>
            <textarea readOnly className="input h-24 font-mono text-[11px]" value={encodeProfileCode(person)} onFocus={(e) => e.currentTarget.select()} />
          </div>
        )}
        </div>
      </div>

      {/* Aura: symbolic visual from palette + attunement answers */}
      <div className="card mt-4 grid items-center gap-4 overflow-hidden sm:grid-cols-[minmax(0,280px)_1fr]">
        <div className="relative mx-auto h-72 w-full max-w-[280px]"><Aura data-aura className="h-full w-full" {...auraOf(person)} label={c.ui.ritual.auraLabel(person.name)} /></div>
        <div>
          <p className="eyebrow mb-1">✦ {c.ui.ritual.auraTitle}</p>
          <p className="mb-3 text-sm text-dim">{c.ui.ritual.auraNote}</p>
          {person.aura && <div className="mb-3 flex flex-wrap gap-2 text-xs">
            {person.aura.weather && <span className="chip">{c.ui.ritual.weather[person.aura.weather]}</span>}
            {person.aura.body && <span className="chip">{c.ui.ritual.body[person.aura.body]}</span>}
            {person.aura.intention && <span className="chip">{c.ui.ritual.intent[person.aura.intention]}</span>}
          </div>}
          {isMe && <Link className="btn-ghost" href={h("/start/?attune=1")}>{c.ui.ritual.reattune}</Link>}
        </div>
      </div>

      <div className="card mt-4">
        <div className="mb-2 flex justify-between text-sm"><span className="h-display text-xl">{U.lensesUnlocked(lensCount, 18)}</span><span className="text-dim">{U.quizzesDone(unlocked.length)}</span></div>
        <Bar value={(lensCount / 18) * 100} />
        {unlocked.length < 7 && (() => { const next = QUIZ_IDS.find((id) => !unlocked.includes(id))!; return <p className="text-sm text-dim">{U.nextLayer}<Link className="text-gold underline" href={quizFor(next)}>{defs[next].title}</Link> {U.minutes(defs[next].minutes)}</p>; })()}
      </div>

      <Section title={U.coreSelf} aside={<EvidenceBadge e="traditional" />}>
        <div className="grid gap-3">
          {[
            { k: "Sun", s: profile.sun, t: A.signs[profile.sun].sun, deg: profile.chart.placements.sun!.lon },
            { k: "Moon", s: profile.moon, t: A.signs[profile.moon].moon, deg: profile.chart.placements.moon!.lon },
            ...(profile.rising ? [{ k: "Rising", s: profile.rising, t: A.signs[profile.rising].rising, deg: profile.chart.placements.asc!.lon }] : []),
          ].map((x) => (
            <div key={x.k} className="card card-hover flex gap-4">
              <SignArt sign={x.s} className="hidden h-24 w-24 shrink-0 sm:block" animate={false} />
              <div className="flex-1">
              <div className="mb-1 flex items-baseline justify-between"><h3 className="h-display text-2xl">{SIGN_GLYPH[x.s]} {U.placementTitle[x.k]} <span className="text-gold">{A.signs[x.s].name}</span></h3><span className="text-xs text-dim">{formatDegree(x.deg)} · {c.astro.elements[SIGN_ELEMENT[x.s]].name}</span></div>
              <p className="text-sm">{x.t}</p>
              {x.k === "Sun" && <p className="mt-1 text-xs text-dim">{U.giftsGrowth(A.signs[x.s].gifts, A.signs[x.s].edge)}</p>}
              </div>
            </div>
          ))}
          {profile.chart.moonAmbiguous && <p className="text-xs text-dim">{U.moonMaybe(profile.chart.moonAlternatives.map((s) => A.signs[s].name).join(U.or))}</p>}
          {!profile.rising && <p className="text-xs text-dim">{U.addTime}</p>}
          <div className="flex flex-wrap gap-x-4"><MoreLink pid={isMe ? undefined : person.id} k="sun" /><MoreLink pid={isMe ? undefined : person.id} k="moon" />{profile.rising && <MoreLink pid={isMe ? undefined : person.id} k="rising" />}<MoreLink pid={isMe ? undefined : person.id} k="venus" /><MoreLink pid={isMe ? undefined : person.id} k="mars" /><MoreLink pid={isMe ? undefined : person.id} k="mercury" /></div>
        </div>
      </Section>

      <Section title={U.chineseTitle} aside={<EvidenceBadge e="traditional" />}>
        <div className="card">
          <p className="h-display text-2xl text-gold">{ANIMAL_GLYPH[ch.animal]} {c.chinese.wuxing[ch.element].name} {c.chinese.animals[ch.animal].name} <span className="text-dim">{ANIMAL_HANZI[ch.animal]}</span> · {ch.yinYang === "yin" ? U.yin : U.yang}</p>
          <p className="text-sm">{c.chinese.animals[ch.animal].essence}</p>
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
          <div className="flex flex-wrap gap-x-4"><MoreLink pid={isMe ? undefined : person.id} k="chinese" /><MoreLink pid={isMe ? undefined : person.id} k="wuxing" /></div>
        </div>
      </Section>

      <Section title={U.vedicTitle} aside={<EvidenceBadge e="traditional" />}>
        <div className="card">
          <p className="h-display text-xl text-gold">{U.vedicMoon(c.vedic.nakshatras[profile.vedic.nakshatra].name, profile.vedic.pada, A.signs[profile.vedic.rashi].name)}</p>
          <p className="text-sm">{U.birthStar(c.vedic.nakshatras[profile.vedic.nakshatra].symbol, c.vedic.nakshatras[profile.vedic.nakshatra].text)}</p>
          {profile.vedic.lagna && <p className="text-sm">{U.lagna(A.signs[profile.vedic.lagna].name)}</p>}
          {profile.vedic.ambiguous && <p className="text-xs text-dim">{U.starMayDiffer}</p>}
          <p className="mt-1 text-xs text-dim">{c.vedic.vedicNote}</p>
          <MoreLink pid={isMe ? undefined : person.id} k="vedic" />
        </div>
      </Section>

      <Section title={U.numbersTitle} aside={<EvidenceBadge e="traditional" />}>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="card">
            <p className="h-display text-2xl text-gold">{U.lifePathHead(n.lifePath, c.nums.numbers[n.lifePath].name)}</p>
            <p className="text-sm">{c.nums.numbers[n.lifePath].lifePath}</p>
            <p className="mt-1 text-xs text-dim">{U.howWeGot(n.lifePathSteps, n.birthday, n.personalYear, new Date().getFullYear())}</p>
          </div>
          <div className="card">
            {n.name ? (
              <>
                <p className="text-sm"><b>{U.expression(n.name.expression)}</b>: {c.nums.numbers[n.name.expression]?.expression}</p>
                <p className="text-sm"><b>{U.soulUrge(n.name.soulUrge)}</b>: {c.nums.numbers[n.name.soulUrge]?.soul}</p>
                <p className="text-sm"><b>{U.personality(n.name.personality)}</b>: {c.nums.numbers[n.name.personality]?.essence}</p>
                <p className="mt-1 text-xs text-dim">{U.fromName(person.birthName || person.name)}</p>
              </>
            ) : <p className="text-sm text-dim">{U.addName}</p>}
          </div>
          <div className="card sm:col-span-2">
            <p className="h-display text-xl text-gold">{U.tarotCards(cards.length > 1, cards.map((x) => x.name).join(" · "))}</p>
            {cards.map((x) => <p key={x.name} className="text-sm"><b>{x.name}</b> ({x.keyword}): {x.birth}</p>)}
            <div className="flex flex-wrap gap-x-4"><MoreLink pid={isMe ? undefined : person.id} k="tarot" /><MoreLink pid={isMe ? undefined : person.id} k="lifepath" /><MoreLink pid={isMe ? undefined : person.id} k="personalyear" /></div>
          </div>
        </div>
      </Section>

      <Section title={U.energyTitle} aside={<EvidenceBadge e="traditional" />}>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="card">
            <p className="mb-2 font-semibold">{U.yinYangPoint(profile.yang)}</p>
            <Dial value={profile.yang} left={U.yinLabel} right={U.yangLabel} />
            <p className="mt-2 text-xs text-dim">{U.blended(!!profile.quiz.bigFive, !!profile.quiz.dosha)}</p>
          </div>
          <div className="card">
            <p className="h-display text-xl text-gold">{c.psych.archetypeAnimals[profile.archetypeAnimal].name}</p>
            <p className="text-sm">{c.psych.archetypeAnimals[profile.archetypeAnimal].text}</p>
            <div className="mt-2"><Palette colors={profile.palette} size="h-8" /></div>
            <p className="mt-2 text-xs text-dim">{c.psych.archetypeNote}{U.strongestEl(A.elements[profile.dominantElement].name)}</p>
            <div className="flex flex-wrap gap-x-4"><MoreLink pid={isMe ? undefined : person.id} k="animal" /><MoreLink pid={isMe ? undefined : person.id} k="palette" /><MoreLink pid={isMe ? undefined : person.id} k="yinyang" /></div>
          </div>
        </div>
      </Section>

      {QUIZ_IDS.map((id) => (
        <Section key={id} title={defs[id].title} aside={<EvidenceBadge e={defs[id].evidence} />}>
          {profile.quiz[defs[id].resultKey]
            ? <><QuizResultView id={id} profile={profile} pid={person.id} /><div className="flex flex-wrap items-baseline gap-x-4"><MoreLink pid={isMe ? undefined : person.id} k={QUIZ_LENS[id]} />{id === "big-five" && <><MoreLink pid={isMe ? undefined : person.id} k="fourletter" /><MoreLink pid={isMe ? undefined : person.id} k="temperament" /></>}<MethodLink /><Link className="mt-2 inline-block text-xs text-dim underline" href={quizFor(id)}>{c.site.common.retake}</Link></div></>
            : <Locked emblem={id} title={defs[id].title} text={U.unlocksText(defs[id].tagline, defs[id].unlocks)} href={quizFor(id)} minutes={defs[id].minutes} />}
        </Section>
      ))}
      <PrecisionSection person={person} profile={profile} />
      <LensSheet k={sheet} profile={profile} personId={isMe ? undefined : person.id} personName={person.name} onClose={closeSheet} />
    </div>
    </LensSheetCtx.Provider>
  );
}
