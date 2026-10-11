import type { Metadata } from "next";
import { DEFAULT_LOCALE } from "@/content";
export const metadata: Metadata = { title: "Mirrorstar", alternates: { canonical: `/${DEFAULT_LOCALE}/` }, other: { refresh: `0;url=/${DEFAULT_LOCALE}/` } };
export default function RootPage() {
  return (
    <main style={{ fontFamily: "system-ui", padding: 40, color: "#ece6ff" }}>
      <meta httpEquiv="refresh" content={`0;url=/${DEFAULT_LOCALE}/`} />
      <a href={`/${DEFAULT_LOCALE}/`}>Continue →</a>
    </main>
  );
}
