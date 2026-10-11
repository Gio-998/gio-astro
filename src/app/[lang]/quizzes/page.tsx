import { pageMeta } from "@/lib/page-meta";
import { QuizHub } from "@/components/pages/QuizHub";
export const generateMetadata = pageMeta("quizzes");
export default function Page() { return <QuizHub />; }
