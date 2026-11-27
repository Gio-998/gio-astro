import { MonthlyPage, monthlyMeta } from "@/components/partial/routes";

export const generateMetadata = () => monthlyMeta("sl");
export default function Page() { return <MonthlyPage lang="sl" />; }
