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
import { ShareButton } from "./ShareButton";
import { ThemeToggle } from "./PersonalTheme";
import { useState } from "react";
import { SignArt } from "./art/SignArt";
import { Celebration } from "./art/Celebration";
import { cosmos } from "./art/ArtCard";

const QUIZ_LENS: Record<QuizId, string> = { "big-five": "bigfive", attachment: "attachment", nine: "nine", care: "care", shadow: "shadow", dosha: "dosha", explorer: "explorer" };
function MoreLink({ k, pid }: { k: string; pid?: string }) {
  const { c } = useContent(); const h = useHref();
  return <Link href={h(`/lens/?k=${k}${pid ? `&id=${pid}` : ""}`)} className="mt-2 inline-block text-sm text-gold underline decoration-dotted underline-offset-4">{c.lensUi.fullMeaning}: {c.lensInfo[k].name} →</Link>;
}

export function QuizResultView({ id, profile }: { id: QuizId; profile: Profile }) {
  const { c } = useContent();
  const q = profile.quiz; const P = c.psych; const U = c.ui.profile;
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
                <Bar value={v} label={`${tr.name} — ${tr.plain}`} right={U.pct(v)} color={k === "N" ? "bg-rose" : "bg-gold"} />
                <p className="text-sm text-mist/85">{v < 35 ? tr.low : v > 65 ? tr.high : tr.mid}</p>
              </div>
            );
          })}
          <p className="text-xs text-dim">{U.pctNote}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="card">
            <div className="mb-1 flex items-center justify-between"><h3 className="font-semibold">{U.temperaments}</h3><EvidenceBadge e="popular" /></div>
            <p className="h-display text-2xl text-gold">{P.temperaments[t.primary].name}</p>
            <p className="text-sm">{P.temperaments[t.primary].text}</p>
            <p className="mt-1 text-xs text-dim">{U.secondaryTip(P.temperaments[t.secondary].name, P.temperaments[t.primary].tip)}</p>
          </div>
          <div className="card">
            <div className="mb-1 flex items-center justify-between"><h3 className="font-semibold">{U.fourLetter}</h3><EvidenceBadge e="popular" /></div>
            <p className="h-display text-2xl text-gold">{fl.code} · {style.name}</p>
            <p className="mb-2 text-sm">{style.text}</p>
            {(["EI", "SN", "TF", "JP"] as const).map((d, k) => <p key={d} className="text-xs text-dim">{fl.code[k]} = {P.letters[fl.code[k]]} <span className="opacity-70">{U.clarity(fl.clarity[d])}</span></p>)}
            <p className="mt-2 text-xs text-dim">{U.flNote}</p>
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
        <Bar value={a.anxiety} label={U.anxiety} color="bg-rose" />
        <Bar value={a.avoidance} label={U.avoidance} color="bg-sage" />
        <p className="mt-2 text-sm"><b>{U.youNeed}</b> {x.need}</p>
        <p className="text-sm"><b>{U.tryLabel}</b> {x.tip}</p>
        <p className="mt-2 text-xs text-dim">{U.attachNote}</p>
      </div>
    );
  }
  if (id === "nine" && q.nine) {
    const n = q.nine, x = P.nineStyles[n.type];
    return (
      <div className="card">
        <p className="h-display text-2xl text-gold">{n.type} · {x.name} <span className="text-base text-dim">{U.wing(n.wing)}</span></p>
        <p>{U.nineCore(x.core, x.gift)}</p>
        <p className="mt-2 text-sm"><b>{U.growthLabel}</b> {x.growth}</p>
        <p className="mt-1 text-sm text-dim">{U.nineMoves(n.growth, P.nineStyles[n.growth].name, n.stress, P.nineStyles[n.stress].name)}</p>
        <div className="mt-3 grid grid-cols-9 gap-1">{n.scores.map((s, k) => <div key={k} className="text-center text-xs"><div className="mx-auto mb-1 w-3 rounded bg-gold/70" style={{ height: s * 6 }} />{k + 1}</div>)}</div>
      </div>
    );
  }
  if (id === "care" && q.care) {
    const r = q.care;
    return (
      <div className="card">
        <p className="mb-2">{U.careA}<b className="text-gold">{P.care[r.topReceive[0]].name}</b>{U.careAnd}<b className="text-gold">{P.care[r.topReceive[1]].name}</b>{U.careGive}<b>{P.care[r.give].name}</b>{U.careEnd}</p>
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
        <p>{U.brightest}<b className="text-gold">{P.shadowAxes[r.strongestLight].virtue}</b>{U.befriend}<b className="text-rose">{P.shadowAxes[r.mainShadow].classical}</b>{U.whoseGift}{P.shadowAxes[r.mainShadow].gift.toLowerCase()}</p>
        <p className="text-sm"><b>{U.thisWeek}</b> {P.shadowAxes[r.mainShadow].practice}</p>
        {AXES.map((ax) => {
          const a = r.axes.find((x) => x.axis === ax)!; const t = P.shadowAxes[ax];
          return (
            <div key={ax} className="rounded-xl bg-white/5 p-3">
              <div className="mb-1 text-sm font-semibold">{t.classical} ↔ {t.virtue}</div>
              <div className="grid grid-cols-2 gap-3"><Bar value={a.shadow} label={U.shadow} color="bg-rose" /><Bar value={a.light} label={U.light} color="bg-gold" /></div>
              <p className="text-xs text-dim">{U.shadowGift(t.shadow, t.gift)}</p>
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
          ? <p className="mt-2 text-sm">{U.tridoshic}</p>
          : <><p className="mt-2 text-sm">{P.doshas[r.dominant].text}</p><p className="text-sm"><b>{U.balancing}</b> {P.doshas[r.dominant].balance}.</p></>}
        <p className="mt-2 text-xs text-dim">{P.doshaNote}</p>
      </div>
    );
  }
  if (id === "explorer" && q.explorer) {
    const r = q.explorer, E = P.explorer;
    return (
      <div className="card space-y-3">
        <p className="font-semibold">{E.name}</p>
        <Dial value={r.explorer} left={U.autopilot} right={U.explorer} />
        <p className="text-sm">{r.explorer < 40 ? E.low : r.explorer > 60 ? E.high : E.mid}</p>
        <div className="grid gap-1">{Object.entries(r.dims).map(([k, v]) => <Bar key={k} value={v} label={E.dims[k]} color="bg-sage" />)}</div>
        <div className="rounded-xl bg-white/5 p-3">
          <p className="font-semibold">{U.socialStance}<span className="text-gold">{P.stances[r.stance].name}</span></p>
          <p className="text-sm">{P.stances[r.stance].text}</p>
          <div className="relative mt-3 h-40 rounded-xl border border-white/10">
            <span className="absolute left-2 top-1 text-[10px] text-dim">{U.belonging}</span><span className="absolute bottom-1 right-2 text-[10px] text-dim">{U.confidence}</span>
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
  const { c } = useContent(); const h = useHref(); const fmt = useDate();
  const A = c.astro; const defs = quizDefs(c); const U = c.ui.profile;
  const ch = profile.chinese; const n = profile.numbers;
  const quizFor = (id: QuizId) => h(`/quiz/${id}/${isMe ? "" : `?for=${person.id}`}`);
  const unlocked = QUIZ_IDS.filter((id) => profile.quiz[defs[id].resultKey]);
  const lensCount = 9 + unlocked.length + (unlocked.includes("big-five") ? 2 : 0);
  const fl = profile.psych?.fourLetter;
  const cards = profile.tarot.cards.map((k) => c.nums.tarot[MAJOR_ARCANA[k === 22 ? 0 : k]]);
  const [codeShown, setCodeShown] = useState(false);
  const lens = (k: string) => h(`/lens/?k=${k}${isMe ? "" : `&id=${person.id}`}`);

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
        <p className="eyebrow mb-2">{isMe ? U.yourCodex : U.profileEyebrow}</p>
        <h1 className="h-display mb-1 text-5xl sm:text-6xl"><span className="text-aurora">{person.name}</span></h1>
        <p className="h-display mb-5 text-2xl italic text-mist/90">{U.sunIn(A.signs[profile.sun].name)} · {U.moonIn(A.signs[profile.moon].name)}{profile.rising ? ` · ${U.risingIn(A.signs[profile.rising].name)}` : ""}</p>
        <Link href={lens("sunmoon")} className="mb-4 inline-block text-sm text-gold underline decoration-dotted underline-offset-4">ⓘ {c.lensUi.explainer}</Link>
        <div className="flex flex-wrap gap-2 text-sm">
          <Link href={lens("sun")} className="chip text-mist hover:border-gold/60 hover:text-gold">{SIGN_GLYPH[profile.sun]} {U.sunIn(A.signs[profile.sun].name)}</Link>
          <Link href={lens("moon")} className="chip text-mist hover:border-gold/60 hover:text-gold">☽ {U.moonIn(profile.chart.moonAmbiguous ? profile.chart.moonAlternatives.map((s) => A.signs[s].name).join(U.or) : A.signs[profile.moon].name)}</Link>
          {profile.rising && <Link href={lens("rising")} className="chip text-mist hover:border-gold/60 hover:text-gold">AC {U.risingIn(A.signs[profile.rising].name)}</Link>}
          <Link href={lens("chinese")} className="chip text-mist hover:border-gold/60 hover:text-gold">{ANIMAL_GLYPH[ch.animal]} {c.chinese.wuxing[ch.element].name} {c.chinese.animals[ch.animal].name}</Link>
          <Link href={lens("lifepath")} className="chip text-mist hover:border-gold/60 hover:text-gold">#{n.lifePath} {c.lensInfo.lifepath.name}</Link>
          <Link href={lens("animal")} className="chip text-mist hover:border-gold/60 hover:text-gold">🜁 {c.psych.archetypeAnimals[profile.archetypeAnimal].name}</Link>
          {fl && <Link href={lens("fourletter")} className="chip text-mist hover:border-gold/60 hover:text-gold">{fl.code} · {c.lensInfo.fourletter.name}</Link>}
          {profile.quiz.nine && <Link href={lens("nine")} className="chip text-mist hover:border-gold/60 hover:text-gold">◎ {profile.quiz.nine.type}w{profile.quiz.nine.wing} · {c.psych.nineStyles[profile.quiz.nine.type].name}</Link>}
          {profile.quiz.attachment && <Link href={lens("attachment")} className="chip text-mist hover:border-gold/60 hover:text-gold">♡ {c.psych.attachment[profile.quiz.attachment.style].name}</Link>}
          {profile.quiz.dosha && <Link href={lens("dosha")} className="chip text-mist hover:border-gold/60 hover:text-gold">❋ {c.psych.constitutions[profile.quiz.dosha.constitution].split(" — ")[0]}</Link>}
        </div>
        <p className="mt-2 text-xs text-dim">{c.lensUi.tapHint}</p>
        <Link href={lens("palette")} className="mt-5 block max-w-sm transition hover:opacity-90"><p className="mb-1.5 text-xs uppercase tracking-widest text-dim">{U.yourPalette}</p><Palette colors={profile.palette} size="h-9" /></Link>
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
              <p className="mt-1 text-xs text-dim">{U.pillars(ch.pillars)}{!profile.chart.time.timeKnown && U.hourPillar}</p>
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
                <p className="text-sm"><b>{U.expression(n.name.expression)}</b> — {c.nums.numbers[n.name.expression]?.expression}</p>
                <p className="text-sm"><b>{U.soulUrge(n.name.soulUrge)}</b> — {c.nums.numbers[n.name.soulUrge]?.soul}</p>
                <p className="text-sm"><b>{U.personality(n.name.personality)}</b> — {c.nums.numbers[n.name.personality]?.essence}</p>
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
            ? <><QuizResultView id={id} profile={profile} /><div className="flex flex-wrap items-baseline gap-x-4"><MoreLink pid={isMe ? undefined : person.id} k={QUIZ_LENS[id]} />{id === "big-five" && <><MoreLink pid={isMe ? undefined : person.id} k="fourletter" /><MoreLink pid={isMe ? undefined : person.id} k="temperament" /></>}<Link className="mt-2 inline-block text-xs text-dim underline" href={quizFor(id)}>{c.site.common.retake}</Link></div></>
            : <Locked emblem={id} title={defs[id].title} text={U.unlocksText(defs[id].tagline, defs[id].unlocks)} href={quizFor(id)} minutes={defs[id].minutes} />}
        </Section>
      ))}
    </div>
  );
}
