import type { Metadata } from "next";
import { DEFAULT_LOCALE } from "@/content";
export const metadata: Metadata = { title: "Mirrorstar", alternates: { canonical: `/${DEFAULT_LOCALE}/` }, other: { refresh: `0;url=/${DEFAULT_LOCALE}/` } };
export default function RootPage() {
  return (
    <main style={{ fontFamily: "system-ui", padding: 40, color: "#ece6ff" }}>
      {/* Saved language choice (or a Macedonian browser) wins over the default; no-JS falls back to the meta refresh. */}
      <script dangerouslySetInnerHTML={{ __html: `try{var l=localStorage.getItem("mirrorstar:lang");if(!l){l=(navigator.language||"").toLowerCase().indexOf("mk")===0?"mk":""}if(l==="mk"||l==="en"){location.replace("/"+l+"/")}}catch(e){}` }} />
      <meta httpEquiv="refresh" content={`0;url=/${DEFAULT_LOCALE}/`} />
      <a href={`/${DEFAULT_LOCALE}/`}>Continue →</a> · <a href="/mk/">Продолжи на македонски →</a>
    </main>
  );
}
