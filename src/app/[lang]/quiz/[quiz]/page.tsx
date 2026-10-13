import { Suspense } from "react";
import { notFound } from "next/navigation";
import { QuizRunner } from "@/components/QuizRunner";
import { ALL_QUIZ_IDS, AnyQuizId, quizDefs } from "@/lib/quiz-defs";
import { getContent, LOCALES } from "@/content";
import { localizedMeta } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() { return LOCALES.flatMap((lang) => ALL_QUIZ_IDS.map((quiz) => ({ lang, quiz }))); }
export async function generateMetadata({ params }: PageProps<"/[lang]/quiz/[quiz]">) {
  const { lang, quiz } = await params;
  const d = quizDefs(getContent(lang))[quiz as AnyQuizId];
  const c = getContent(lang); const title = c.ui.quiz.metaTitle(d?.title ?? "");
  return d ? { title, description: d.tagline, ...localizedMeta(lang, `/quiz/${quiz}/`, { title: `${title} · ${c.site.brand}`, description: d.tagline, siteName: c.site.brand }) } : {};
}
export default async function Page({ params }: PageProps<"/[lang]/quiz/[quiz]">) {
  const { lang, quiz } = await params;
  if (!(ALL_QUIZ_IDS as readonly string[]).includes(quiz)) notFound();
  const d = quizDefs(getContent(lang))[quiz as AnyQuizId];
  // Server-rendered intro (title + tagline + intro) in the static HTML; the client runner replaces it on load,
  // so there is exactly one h1 at any time and crawlers/screen readers get a real heading without JS.
  const intro = (
    <div className="mx-auto max-w-xl py-6 text-center" data-testid="quiz-static-intro">
      <h1 className="h-display mb-2 text-4xl"><span className="text-aurora">{d.title}</span></h1>
      <p className="mb-2 text-mist/85">{d.tagline}</p>
      <p className="text-dim">{d.intro}</p>
    </div>
  );
  return <Suspense fallback={intro}><QuizRunner id={quiz as AnyQuizId} /></Suspense>;
}
