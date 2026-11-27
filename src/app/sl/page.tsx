import { PartialHome, homeMeta } from "@/components/partial/routes";

export const generateMetadata = () => homeMeta("sl");
export default function Page() { return <PartialHome lang="sl" />; }
