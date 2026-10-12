import { pageMeta } from "@/lib/page-meta";
import { AccountPage } from "@/components/auth/Auth";
export const generateMetadata = pageMeta("account", { robots: { index: false } });
export default function Page() { return <AccountPage />; }
