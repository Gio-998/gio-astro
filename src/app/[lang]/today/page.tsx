import { pageMeta } from "@/lib/page-meta";
import { TodayPage } from "@/components/pages/TodayPage";
export const generateMetadata = pageMeta("today", { robots: { index: false } });
export default function Page() { return <TodayPage />; }
