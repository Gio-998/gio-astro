import { HubPage, hubMeta } from "@/components/horoscope/routes";

export const generateMetadata = () => hubMeta("sl");
export default function Page() { return <HubPage lang="sl" />; }
