import { Suspense } from "react";
import { notFound } from "next/navigation";
import { QuizRunner } from "@/components/QuizRunner";
import { QUIZ_IDS, QuizId, quizDefs } from "@/lib/quiz-defs";
import { getContent, LOCALES } from "@/content";
import { localizedMeta } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() { return LOCALES.flatMap((lang) => QUIZ_IDS.map((quiz) => ({ lang, quiz }))); }
export async function generateMetadata({ params }: PageProps<"/[lang]/quiz/[quiz]">) {
  const { lang, quiz } = await params;
  const d = quizDefs(getContent(lang))[quiz as QuizId];
  const c = getContent(lang); const title = c.ui.quiz.metaTitle(d?.title ?? "");
  return d ? { title, description: d.tagline, ...localizedMeta(lang, `/quiz/${quiz}/`, { title: `${title} · ${c.site.brand}`, description: d.tagline, siteName: c.site.brand }) } : {};
}
export default async function Page({ params }: PageProps<"/[lang]/quiz/[quiz]">) {
  const { quiz } = await params;
  if (!(QUIZ_IDS as readonly string[]).includes(quiz)) notFound();
  return <Suspense><QuizRunner id={quiz as QuizId} /></Suspense>;
}
