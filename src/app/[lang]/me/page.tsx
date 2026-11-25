import { pageMeta } from "@/lib/page-meta";
import { Suspense } from "react";
import { MePage } from "@/components/pages/MePage";
import { ReminderCard } from "@/app-mode";
export const generateMetadata = pageMeta("me", { robots: { index: false } });
// ReminderCard renders only inside the store app (morning reminder settings).
export default function Page() { return <><Suspense><MePage /></Suspense><ReminderCard /></>; }
