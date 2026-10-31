import { pageMeta } from "@/lib/page-meta";
import { EmailAction } from "@/components/lead/EmailAction";
export const generateMetadata = pageMeta("email", { robots: { index: false } });
export default function Page() { return <EmailAction />; }
