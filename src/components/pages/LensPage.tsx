"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useStore, findPerson } from "@/lib/store";
import { profileOf } from "@/lib/profile";
import { useContent, useHref } from "@/lib/content-context";
import { buildLens, LENS_KEYS, LensKey } from "@/story/lens";
import { quizDefs } from "@/lib/quiz-defs";
import { Blocks } from "../story/Blocks";
import { useReadTheme, usePrintExpand } from "../story/BookView";
import { SignArt } from "../art/SignArt";
import { Emblem } from "../art/Emblem";
import { QuizResultView } from "../ProfileView";
import { Locked } from "../ui";
import { cosmos } from "../art/ArtCard";

export function LensPageView() {
  const s = useStore(); const { c } = useContent(); const h = useHref(); const sp = useSearchParams();
  const id = sp.get("id") || "me"; const k = (sp.get("k") || "sunmoon") as LensKey;
  const person = findPerson(s, id);
  const profile = person ? profileOf(person) : null;
  const page = profile && (LENS_KEYS as readonly string[]).includes(k) ? buildLens(k, profile, c) : null;
  const [theme] = useReadTheme(); usePrintExpand();
  if (!s) return <p className="text-dim">{c.site.common.loading}</p>;
  if (!person || !profile || !page) return <p className="text-dim"><Link className="underline" href={h("/start/")}>{c.site.common.start}</Link></p>;
  const L = c.lensUi; const defs = quizDefs(c); const isMe = person.id === "me";
  const q = id !== "me" ? `&id=${id}` : "";
  return (
    <div className={`book book-${theme}`}>
      <div className="relative mb-6 overflow-hidden rounded-[32px] border border-white/15 px-6 py-9 sm:px-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cosmos("pillars", 1280)} alt="" className="absolute inset-0 h-full w-full animate-kenburns object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-r from-night via-night/85 to-indigo/30" />
        <div className="relative flex items-center gap-6">
          <div className="min-w-0 flex-1">
            <p className="eyebrow mb-2">{page.name}</p>
            <h1 className="h-display mb-1 text-[clamp(2rem,5vw,3.3rem)] leading-[1.05]">{page.title}</h1>
            <p className="text-sm text-dim">{isMe ? L.forYouMe : L.forYou(person.name)}</p>
          </div>
          <div className="shrink-0">{page.art.kind === "sign" ? <SignArt sign={page.art.sign} className="h-28 w-28 sm:h-36 sm:w-36" /> : <Emblem id={page.art.id} className="h-24 w-24 animate-float glow-gold sm:h-32 sm:w-32" />}</div>
        </div>
      </div>

      <div className="card mb-6">
        <p className="eyebrow mb-2">✦ {L.inPlainWords}</p>
        <p className="text-[1.05rem] leading-relaxed text-mist/90">{page.what}</p>
      </div>

      {page.quiz && page.blocks && <div className="mb-6"><QuizResultView id={page.quiz} profile={profile} /></div>}

      {page.blocks ? (
        <div className="reading-surface">
          <div className="reading"><Blocks blocks={page.blocks} forId={id} /></div>
        </div>
      ) : page.quiz && (
        <Locked emblem={page.quiz} title={defs[page.quiz].title} text={`${L.notUnlocked} ${defs[page.quiz].tagline}`} href={h(`/quiz/${page.quiz}/${isMe ? "" : `?for=${id}`}`)} minutes={defs[page.quiz].minutes} />
      )}

      <div className="mt-8 flex flex-wrap gap-2">
        <Link className="btn-primary" href={h(`/book/${isMe ? "" : `?id=${id}`}#ch-${page.chapter}`)}>📖 {L.related} — {c.book.chapters[page.chapter].title}</Link>
        <Link className="btn-ghost" href={h(isMe ? "/me/" : `/person/?id=${id}`)}>← {L.back}</Link>
      </div>
      <div className="mt-8 flex flex-wrap gap-1.5">
        {LENS_KEYS.filter((x) => x !== k).map((x) => <Link key={x} href={h(`/lens/?k=${x}${q}`)} className="chip hover:text-gold">{c.lensInfo[x].name}</Link>)}
      </div>
    </div>
  );
}
