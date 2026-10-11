import { Suspense } from "react";
import { notFound } from "next/navigation";
import { QuizRunner } from "@/components/QuizRunner";
import { QUIZ_IDS, QuizId, quizDefs } from "@/lib/quiz-defs";
import { getContent, LOCALES } from "@/content";

export const dynamicParams = false;
export function generateStaticParams() { return LOCALES.flatMap((lang) => QUIZ_IDS.map((quiz) => ({ lang, quiz }))); }
export async function generateMetadata({ params }: PageProps<"/[lang]/quiz/[quiz]">) {
  const { lang, quiz } = await params;
  const d = quizDefs(getContent(lang))[quiz as QuizId];
  return d ? { title: getContent(lang).ui.quiz.metaTitle(d.title), description: d.tagline } : {};
}
export default async function Page({ params }: PageProps<"/[lang]/quiz/[quiz]">) {
  const { quiz } = await params;
  if (!(QUIZ_IDS as readonly string[]).includes(quiz)) notFound();
  return <Suspense><QuizRunner id={quiz as QuizId} /></Suspense>;
}
