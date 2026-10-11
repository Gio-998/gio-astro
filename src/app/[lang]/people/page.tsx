import { pageMeta } from "@/lib/page-meta";
import { PeoplePage } from "@/components/pages/PeoplePage";
export const generateMetadata = pageMeta("people", { robots: { index: false } });
export default function Page() { return <PeoplePage />; }
