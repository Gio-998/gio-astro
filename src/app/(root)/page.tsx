import type { Metadata } from "next";
import { DEFAULT_LOCALE } from "@/content";
import { languageAlternates } from "@/lib/seo";
export const metadata: Metadata = { title: "Horoscop", verification: { google: ["lawAZscQq-N7Z2WZ5gPeHdtfwMK02cXhEACtaYUoHvY", "2nXRy-mgheo53M60i3hgsRr0v7lfJqK5L5nuwNmt-lE"] }, robots: { index: false, follow: true }, alternates: { canonical: `/${DEFAULT_LOCALE}/`, languages: languageAlternates("/") }, other: { refresh: `0;url=/${DEFAULT_LOCALE}/` } };
export default function RootPage() {
  return (
    <main style={{ fontFamily: "system-ui", padding: 40, color: "#ece6ff" }}>
      {/* Only an explicit saved language choice redirects; browser language just triggers a suggestion banner (no auto-redirects for crawlers). */}
      <script dangerouslySetInnerHTML={{ __html: `try{var l=localStorage.getItem("mirrorstar:lang");if(l==="mk"||l==="en"){location.replace("/"+l+"/")}}catch(e){}` }} />
      <meta httpEquiv="refresh" content={`0;url=/${DEFAULT_LOCALE}/`} />
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- plain links on the no-JS redirect page */}
      <a href={`/${DEFAULT_LOCALE}/`}>Continue →</a> · <a href="/mk/">Продолжи на македонски →</a>
    </main>
  );
}
