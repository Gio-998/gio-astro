"use client";
import Link from "next/link";
import type { Profile } from "@/engine/profile";
import { useContent, useHref } from "@/lib/content-context";
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
import { ShareButton } from "./ShareButton";
import { useState } from "react";
import { SignArt } from "./art/SignArt";
import { Celebration } from "./art/Celebration";
import { cosmos } from "./art/ArtCard";

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function QuizResultView({ id, profile }: { id: QuizId; profile: Profile }) {
  const { c } = useContent();
  const q = profile.quiz; const P = c.psych;
  if (id === "big-five" && q.bigFive && profile.psych) {
    const fl = profile.psych.fourLetter, t = profile.psych.temperament;
    const style = P.fourLetterStyles[fl.code];
    return (
      <div className="space-y-4">
        <div className="card">
          {TRAITS.map((k) => {
            const v = q.bigFive![k]; const tr = P.traits[k];
            return (
              <div key={k} className="mb-3">
                <Bar value={v} label={`${tr.name} — ${tr.plain}`} right={`${v}th pct`} color={k === "N" ? "bg-rose" : "bg-gold"} />
                <p className="text-sm text-mist/85">{v < 35 ? tr.low : v > 65 ? tr.high : tr.mid}</p>
              </div>
            );
          })}
          <p className="text-xs text-dim">Percentiles are approximate, based on published sample averages. In relationships: kindness, reliability and calm under stress matter most — and all of them can be practised.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="card">
            <div className="mb-1 flex items-center justify-between"><h3 className="font-semibold">Four temperaments</h3><EvidenceBadge e="popular" /></div>
            <p className="h-display text-2xl text-gold">{P.temperaments[t.primary].name}</p>
            <p className="text-sm">{P.temperaments[t.primary].text}</p>
            <p className="mt-1 text-xs text-dim">Secondary: {P.temperaments[t.secondary].name}. Tip: {P.temperaments[t.primary].tip}</p>
          </div>
          <div className="card">
            <div className="mb-1 flex items-center justify-between"><h3 className="font-semibold">Four-letter style</h3><EvidenceBadge e="popular" /></div>
            <p className="h-display text-2xl text-gold">{fl.code} · {style.name}</p>
            <p className="mb-2 text-sm">{style.text}</p>
            {(["EI", "SN", "TF", "JP"] as const).map((d, k) => <p key={d} className="text-xs text-dim">{fl.code[k]} = {P.letters[fl.code[k]]} <span className="opacity-70">(clarity {fl.clarity[d]}%)</span></p>)}
            <p className="mt-2 text-xs text-dim">Derived from your Big Five answers. The letters are a common shorthand — this is not an official type test.</p>
          </div>
        </div>
      </div>
    );
  }
  if (id === "attachment" && q.attachment) {
    const a = q.attachment, x = P.attachment[a.style];
    return (
      <div className="card">
        <p className="h-display text-2xl text-gold">{x.name}</p>
        <p className="mb-3">{x.text}</p>
        <Bar value={a.anxiety} label="Worry about closeness (anxiety)" color="bg-rose" />
        <Bar value={a.avoidance} label="Need for distance (avoidance)" color="bg-sage" />
        <p className="mt-2 text-sm"><b>You need:</b> {x.need}</p>
        <p className="text-sm"><b>Try:</b> {x.tip}</p>
        <p className="mt-2 text-xs text-dim">Attachment can shift over time and differs between relationships. Secure habits can be learned.</p>
      </div>
    );
  }
  if (id === "nine" && q.nine) {
    const n = q.nine, x = P.nineStyles[n.type];
    return (
      <div className="card">
        <p className="h-display text-2xl text-gold">{n.type} · {x.name} <span className="text-base text-dim">(wing {n.wing})</span></p>
        <p>At the core, you {x.core}. Your gift: {x.gift}.</p>
        <p className="mt-2 text-sm"><b>Growth:</b> {x.growth}</p>
        <p className="mt-1 text-sm text-dim">On good days you move toward the strengths of {n.growth} ({P.nineStyles[n.growth].name}); under stress you may take on habits of {n.stress} ({P.nineStyles[n.stress].name}).</p>
        <div className="mt-3 grid grid-cols-9 gap-1">{n.scores.map((s, k) => <div key={k} className="text-center text-xs"><div className="mx-auto mb-1 w-3 rounded bg-gold/70" style={{ height: s * 6 }} />{k + 1}</div>)}</div>
      </div>
    );
  }
  if (id === "care" && q.care) {
    const r = q.care;
    return (
      <div className="card">
        <p className="mb-2">You feel most cared for through <b className="text-gold">{P.care[r.topReceive[0]].name}</b> and <b className="text-gold">{P.care[r.topReceive[1]].name}</b>. You naturally give <b>{P.care[r.give].name}</b>.</p>
        {CARE.map((k) => <Bar key={k} value={(r.receive[k] / 4) * 100} label={P.care[k].name} right={`${r.receive[k]}/4`} />)}
        <p className="mt-2 text-sm">{P.care[r.topReceive[0]].text}</p>
        <p className="mt-2 text-xs text-dim">{P.careNote}</p>
      </div>
    );
  }
  if (id === "shadow" && q.shadow) {
    const r = q.shadow;
    return (
      <div className="card space-y-3">
        <p>Your brightest light: <b className="text-gold">{P.shadowAxes[r.strongestLight].virtue}</b>. Your shadow to befriend: <b className="text-rose">{P.shadowAxes[r.mainShadow].classical}</b> — whose gift is {P.shadowAxes[r.mainShadow].gift.toLowerCase()}</p>
        <p className="text-sm"><b>This week:</b> {P.shadowAxes[r.mainShadow].practice}</p>
        {AXES.map((ax) => {
          const a = r.axes.find((x) => x.axis === ax)!; const t = P.shadowAxes[ax];
          return (
            <div key={ax} className="rounded-xl bg-white/5 p-3">
              <div className="mb-1 text-sm font-semibold">{t.classical} ↔ {t.virtue}</div>
              <div className="grid grid-cols-2 gap-3"><Bar value={a.shadow} label="Shadow" color="bg-rose" /><Bar value={a.light} label="Light" color="bg-gold" /></div>
              <p className="text-xs text-dim">Shadow: {t.shadow} Gift: {t.gift}</p>
            </div>
          );
        })}
      </div>
    );
  }
  if (id === "dosha" && q.dosha) {
    const r = q.dosha;
    return (
      <div className="card">
        <p className="h-display text-2xl text-gold">{P.constitutions[r.constitution]}</p>
        {(["vata", "pitta", "kapha"] as const).map((k) => <Bar key={k} value={r.pct[k]} label={`${P.doshas[k].name} (${P.doshas[k].element})`} right={`${r.pct[k]}%`} />)}
        {r.constitution === "tridoshic"
          ? <p className="mt-2 text-sm">All three energies show up in you fairly evenly — adaptable, with no single pattern dominating. Keep a steady daily rhythm and adjust with the seasons.</p>
          : <><p className="mt-2 text-sm">{P.doshas[r.dominant].text}</p><p className="text-sm"><b>Balancing:</b> {P.doshas[r.dominant].balance}.</p></>}
        <p className="mt-2 text-xs text-dim">{P.doshaNote}</p>
      </div>
    );
  }
  if (id === "explorer" && q.explorer) {
    const r = q.explorer, E = P.explorer;
    return (
      <div className="card space-y-3">
        <p className="font-semibold">{E.name}</p>
        <Dial value={r.explorer} left="Autopilot" right="Explorer" />
        <p className="text-sm">{r.explorer < 40 ? E.low : r.explorer > 60 ? E.high : E.mid}</p>
        <div className="grid gap-1">{Object.entries(r.dims).map(([k, v]) => <Bar key={k} value={v} label={E.dims[k]} color="bg-sage" />)}</div>
        <div className="rounded-xl bg-white/5 p-3">
          <p className="font-semibold">Social stance: <span className="text-gold">{P.stances[r.stance].name}</span></p>
          <p className="text-sm">{P.stances[r.stance].text}</p>
          <div className="relative mt-3 h-40 rounded-xl border border-white/10">
            <span className="absolute left-2 top-1 text-[10px] text-dim">belonging ↑</span><span className="absolute bottom-1 right-2 text-[10px] text-dim">confidence →</span>
            <span className="absolute h-4 w-4 -translate-x-1/2 translate-y-1/2 rounded-full bg-gold" style={{ left: `${r.confidence}%`, bottom: `${r.belonging}%` }} />
          </div>
        </div>
        <p className="text-xs text-dim">{E.text} {E.note}</p>
      </div>
    );
  }
  return null;
}

export function ProfileView({ person, profile, isMe }: { person: StoredPerson; profile: Profile; isMe: boolean }) {
  const { c } = useContent(); const h = useHref();
  const A = c.astro; const defs = quizDefs(c);
  const ch = profile.chinese; const n = profile.numbers;
  const quizFor = (id: QuizId) => h(`/quiz/${id}/${isMe ? "" : `?for=${person.id}`}`);
  const unlocked = QUIZ_IDS.filter((id) => profile.quiz[defs[id].resultKey]);
  const lensCount = 9 + unlocked.length + (unlocked.includes("big-five") ? 2 : 0);
  const fl = profile.psych?.fourLetter;
  const cards = profile.tarot.cards.map((k) => c.nums.tarot[MAJOR_ARCANA[k === 22 ? 0 : k]]);
  const [codeShown, setCodeShown] = useState(false);

  const shareSpec = {
    eyebrow: `${person.name}'s cosmic codex`,
    title: `${A.signs[profile.sun].name} Sun · ${A.signs[profile.moon].name} Moon`,
    subtitle: `${profile.rising ? `${A.signs[profile.rising].name} Rising · ` : ""}${c.chinese.wuxing[ch.element].name} ${c.chinese.animals[ch.animal].name}`,
    lines: [
      `Life Path ${n.lifePath} — ${c.nums.numbers[n.lifePath].name}`,
      `Archetype animal: ${c.psych.archetypeAnimals[profile.archetypeAnimal].name}`,
      `Tarot birth card: ${cards[0].name}`,
      fl ? `${fl.code} · ${c.psych.fourLetterStyles[fl.code].name}` : "",
      profile.quiz.nine ? `Motivation ${profile.quiz.nine.type} · ${c.psych.nineStyles[profile.quiz.nine.type].name}` : "",
    ].filter(Boolean),
    palette: profile.palette, footer: c.site.brand,
  };

  return (
    <div>
      {/* Cover */}
      <div className="relative overflow-hidden rounded-[36px] border border-white/15 p-6 shadow-[0_40px_90px_-40px_rgba(139,108,240,.9)] sm:p-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cosmos("orion", 1280)} alt="" className="absolute inset-0 h-full w-full animate-kenburns object-cover opacity-40" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(120deg, #120f2e 15%, ${profile.palette[0]}55 60%, ${profile.palette[4]}66)` }} />
        {isMe && <Celebration count={18} />}
        <SignArt sign={profile.sun} className="pointer-events-none absolute -right-10 -top-6 h-72 w-72 opacity-70 sm:right-2 sm:h-80 sm:w-80" />
        <div className="relative">
        <p className="eyebrow mb-2">{isMe ? "Your cosmic codex" : "Profile"}</p>
        <h1 className="h-display mb-1 text-5xl sm:text-6xl"><span className="text-aurora">{person.name}</span></h1>
        <p className="h-display mb-5 text-2xl italic text-mist/90">{A.signs[profile.sun].name} Sun · {A.signs[profile.moon].name} Moon{profile.rising ? ` · ${A.signs[profile.rising].name} Rising` : ""}</p>
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="chip text-mist">{SIGN_GLYPH[profile.sun]} {A.signs[profile.sun].name} Sun</span>
          <span className="chip text-mist">☽ {profile.chart.moonAmbiguous ? profile.chart.moonAlternatives.map((s) => A.signs[s].name).join(" or ") : A.signs[profile.moon].name} Moon</span>
          {profile.rising && <span className="chip text-mist">AC {A.signs[profile.rising].name} Rising</span>}
          <span className="chip text-mist">{ANIMAL_GLYPH[ch.animal]} {c.chinese.wuxing[ch.element].name} {c.chinese.animals[ch.animal].name}</span>
          <span className="chip text-mist">#{n.lifePath} Life Path</span>
          <span className="chip text-mist">🜁 {c.psych.archetypeAnimals[profile.archetypeAnimal].name}</span>
          {fl && <span className="chip text-mist">{fl.code}</span>}
          {profile.quiz.nine && <span className="chip text-mist">◎ {profile.quiz.nine.type}w{profile.quiz.nine.wing}</span>}
        </div>
        <div className="mt-5 max-w-sm"><p className="mb-1.5 text-xs uppercase tracking-widest text-dim">Your palette</p><Palette colors={profile.palette} size="h-9" /></div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link className="btn-primary" href={h(`/book/${isMe ? "" : `?id=${person.id}`}`)}>📖 {c.book.title}</Link>
          <ShareButton spec={shareSpec} filename={`${person.name}-codex.png`} />
          <Link className="btn-ghost" href={h(`/chart/?id=${person.id}`)}>Full birth chart</Link>
          {!isMe && <Link className="btn-ghost" href={h(`/match/?b=${person.id}`)}>Compatibility with me</Link>}
          {isMe && <button className="btn-ghost" onClick={() => setCodeShown(!codeShown)}>My profile code</button>}
        </div>
        {codeShown && (
          <div className="mt-3 rounded-xl bg-night/60 p-3 text-xs">
            <p className="mb-1 text-dim">Send this code to someone so they can add you to their People and compare — no account needed. It contains your birth data and quiz results; only share it with people you trust.</p>
            <textarea readOnly className="input h-24 font-mono text-[11px]" value={encodeProfileCode(person)} onFocus={(e) => e.currentTarget.select()} />
          </div>
        )}
        </div>
      </div>

      <div className="card mt-4">
        <div className="mb-2 flex justify-between text-sm"><span className="h-display text-xl">✦ {lensCount} of 18 lenses unlocked</span><span className="text-dim">{unlocked.length}/7 quizzes</span></div>
        <Bar value={(lensCount / 18) * 100} />
        {unlocked.length < 7 && (() => { const next = QUIZ_IDS.find((id) => !unlocked.includes(id))!; return <p className="text-sm text-dim">Next layer: <Link className="text-gold underline" href={quizFor(next)}>{defs[next].title}</Link> ({defs[next].minutes} min)</p>; })()}
      </div>

      <Section title="Core self — Western astrology" aside={<EvidenceBadge e="traditional" />}>
        <div className="grid gap-3">
          {[
            { k: "Sun", s: profile.sun, t: A.signs[profile.sun].sun, deg: profile.chart.placements.sun!.lon },
            { k: "Moon", s: profile.moon, t: A.signs[profile.moon].moon, deg: profile.chart.placements.moon!.lon },
            ...(profile.rising ? [{ k: "Rising", s: profile.rising, t: A.signs[profile.rising].rising, deg: profile.chart.placements.asc!.lon }] : []),
          ].map((x) => (
            <div key={x.k} className="card card-hover flex gap-4">
              <SignArt sign={x.s} className="hidden h-24 w-24 shrink-0 sm:block" animate={false} />
              <div className="flex-1">
              <div className="mb-1 flex items-baseline justify-between"><h3 className="h-display text-2xl">{SIGN_GLYPH[x.s]} {x.k} in <span className="text-gold">{A.signs[x.s].name}</span></h3><span className="text-xs text-dim">{formatDegree(x.deg)} · {c.astro.elements[SIGN_ELEMENT[x.s]].name}</span></div>
              <p className="text-sm">{x.t}</p>
              {x.k === "Sun" && <p className="mt-1 text-xs text-dim">Gifts: {A.signs[x.s].gifts}. Growth: {A.signs[x.s].edge}.</p>}
              </div>
            </div>
          ))}
          {profile.chart.moonAmbiguous && <p className="text-xs text-dim">Without a birth time the Moon could be in {profile.chart.moonAlternatives.map((s) => A.signs[s].name).join(" or ")} — read both and see which feels true.</p>}
          {!profile.rising && <p className="text-xs text-dim">Add a birth time and place to unlock your rising sign and houses.</p>}
        </div>
      </Section>

      <Section title="Chinese zodiac & five elements" aside={<EvidenceBadge e="traditional" />}>
        <div className="card">
          <p className="h-display text-2xl text-gold">{ANIMAL_GLYPH[ch.animal]} {c.chinese.wuxing[ch.element].name} {c.chinese.animals[ch.animal].name} <span className="text-dim">{ANIMAL_HANZI[ch.animal]}</span> · {cap(ch.yinYang)}</p>
          <p className="text-sm">{c.chinese.animals[ch.animal].essence}</p>
          <p className="mt-1 text-xs text-dim">Gifts: {c.chinese.animals[ch.animal].gifts}. Growth: {c.chinese.animals[ch.animal].edge}. Your zodiac year began on {ch.lunarNewYear} (Lunar New Year).</p>
          {ch.conventionsDiffer && <p className="mt-2 rounded-lg bg-white/5 p-2 text-xs">Born between Lunar New Year and the start of spring (Li Chun, ~4 Feb), or the other way round: in the four-pillars (BaZi) convention you'd be a {c.chinese.animals[ch.animalLiChun].name}. We use Lunar New Year, like most people do.</p>}
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-sm font-semibold">Day Master (your "self" element): {c.chinese.wuxing[ch.dayMaster.element].name} ({ch.dayMaster.yinYang})</p>
              <p className="text-xs text-dim">{c.chinese.wuxing[ch.dayMaster.element].text}</p>
              <p className="mt-1 text-xs text-dim">Four pillars: {ch.pillars}{!profile.chart.time.timeKnown && " (hour pillar needs birth time)"}</p>
            </div>
            <div>{WUXING.map((w) => <Bar key={w} value={(ch.balance[w] / 4) * 100} label={c.chinese.wuxing[w].name} right={String(ch.balance[w])} color="bg-sage" />)}</div>
          </div>
        </div>
      </Section>

      <Section title="Vedic Moon" aside={<EvidenceBadge e="traditional" />}>
        <div className="card">
          <p className="h-display text-xl text-gold">Moon in {c.vedic.nakshatras[profile.vedic.nakshatra].name} (pada {profile.vedic.pada}) · {A.signs[profile.vedic.rashi].name} (sidereal)</p>
          <p className="text-sm">Birth star symbol: {c.vedic.nakshatras[profile.vedic.nakshatra].symbol} — {c.vedic.nakshatras[profile.vedic.nakshatra].text}.</p>
          {profile.vedic.lagna && <p className="text-sm">Vedic rising (lagna): {A.signs[profile.vedic.lagna].name}</p>}
          {profile.vedic.ambiguous && <p className="text-xs text-dim">Birth star may differ without birth time.</p>}
          <p className="mt-1 text-xs text-dim">{c.vedic.vedicNote}</p>
        </div>
      </Section>

      <Section title="Numbers & cards" aside={<EvidenceBadge e="traditional" />}>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="card">
            <p className="h-display text-2xl text-gold">Life Path {n.lifePath} · {c.nums.numbers[n.lifePath].name}</p>
            <p className="text-sm">{c.nums.numbers[n.lifePath].lifePath}</p>
            <p className="mt-1 text-xs text-dim">How we got it: {n.lifePathSteps}. Birthday number {n.birthday}. Personal year {n.personalYear} ({new Date().getFullYear()}).</p>
          </div>
          <div className="card">
            {n.name ? (
              <>
                <p className="text-sm"><b>Expression {n.name.expression}</b> — {c.nums.numbers[n.name.expression]?.expression}</p>
                <p className="text-sm"><b>Soul Urge {n.name.soulUrge}</b> — {c.nums.numbers[n.name.soulUrge]?.soul}</p>
                <p className="text-sm"><b>Personality {n.name.personality}</b> — {c.nums.numbers[n.name.personality]?.essence}</p>
                <p className="mt-1 text-xs text-dim">From the name “{person.birthName || person.name}”. Add your full birth name under “Edit” for the traditional reading.</p>
              </>
            ) : <p className="text-sm text-dim">Add a name to unlock Expression and Soul Urge numbers.</p>}
          </div>
          <div className="card sm:col-span-2">
            <p className="h-display text-xl text-gold">Tarot birth card{cards.length > 1 ? "s" : ""}: {cards.map((x) => x.name).join(" · ")}</p>
            {cards.map((x) => <p key={x.name} className="text-sm"><b>{x.name}</b> ({x.keyword}): {x.birth}</p>)}
          </div>
        </div>
      </Section>

      <Section title="Energy, symbol & colour" aside={<EvidenceBadge e="traditional" />}>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="card">
            <p className="mb-2 font-semibold">Yin–yang balance point: {profile.yang}</p>
            <Dial value={profile.yang} left="Yin — receptive" right="Yang — active" />
            <p className="mt-2 text-xs text-dim">Blended from your chart's elements, your Chinese year and day polarity{profile.quiz.bigFive ? ", your extraversion" : ""}{profile.quiz.dosha ? " and your body type" : ""}.</p>
          </div>
          <div className="card">
            <p className="h-display text-xl text-gold">{c.psych.archetypeAnimals[profile.archetypeAnimal].name}</p>
            <p className="text-sm">{c.psych.archetypeAnimals[profile.archetypeAnimal].text}</p>
            <div className="mt-2"><Palette colors={profile.palette} size="h-8" /></div>
            <p className="mt-2 text-xs text-dim">{c.psych.archetypeNote} Strongest element: {A.elements[profile.dominantElement].name}.</p>
          </div>
        </div>
      </Section>

      {QUIZ_IDS.map((id) => (
        <Section key={id} title={defs[id].title} aside={<EvidenceBadge e={defs[id].evidence} />}>
          {profile.quiz[defs[id].resultKey]
            ? <><QuizResultView id={id} profile={profile} /><Link className="mt-2 inline-block text-xs text-dim underline" href={quizFor(id)}>{c.site.common.retake}</Link></>
            : <Locked emblem={id} title={defs[id].title} text={`${defs[id].tagline} Unlocks: ${defs[id].unlocks}.`} href={quizFor(id)} minutes={defs[id].minutes} />}
        </Section>
      ))}
    </div>
  );
}
