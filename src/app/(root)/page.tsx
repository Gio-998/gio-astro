import type { Metadata } from "next";
import { DEFAULT_LOCALE, LOCALES } from "@/content";
import { languageAlternates } from "@/lib/seo";
/** Store app build: the app opens straight on Today in the saved or system language (no landing page, no meta refresh to /en/). */
const APP_BUILD = process.env.NEXT_PUBLIC_APP_BUILD === "1";
const APP_START = `var L=${JSON.stringify(LOCALES)},l=null;try{l=localStorage.getItem("mirrorstar:lang")}catch(e){}if(L.indexOf(l)<0){var n=(navigator.language||"en").slice(0,2).toLowerCase();l=n==="mk"?"mk":n==="de"?"de":(n==="sr"||n==="hr"||n==="bs"||n==="me")?"sr":"en"}location.replace("/"+l+"/today/")`;

export const metadata: Metadata = APP_BUILD ? { title: "Horoscop", robots: { index: false, follow: false } } : { title: "Horoscop", verification: { google: ["lawAZscQq-N7Z2WZ5gPeHdtfwMK02cXhEACtaYUoHvY", "2nXRy-mgheo53M60i3hgsRr0v7lfJqK5L5nuwNmt-lE"] }, robots: { index: false, follow: true }, alternates: { canonical: `/${DEFAULT_LOCALE}/`, languages: languageAlternates("/") }, other: { refresh: `0;url=/${DEFAULT_LOCALE}/` } };
export default function RootPage() {
  if (APP_BUILD) return <main style={{ background: "#0e0b26", minHeight: "100vh" }}><script dangerouslySetInnerHTML={{ __html: APP_START }} /></main>;
  return (
    <main style={{ fontFamily: "system-ui", padding: 40, color: "#ece6ff" }}>
      {/* Only an explicit saved language choice redirects; browser language just triggers a suggestion banner (no auto-redirects for crawlers). */}
      <script dangerouslySetInnerHTML={{ __html: `try{var l=localStorage.getItem("mirrorstar:lang");if(${JSON.stringify(LOCALES)}.indexOf(l)>=0){location.replace("/"+l+"/")}}catch(e){}` }} />
      <meta httpEquiv="refresh" content={`0;url=/${DEFAULT_LOCALE}/`} />
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- plain links on the no-JS redirect page */}
      <a href={`/${DEFAULT_LOCALE}/`}>Continue →</a> · <a href="/mk/">Продолжи на македонски →</a> · <a href="/sr/">Nastavi na srpskom →</a>
    </main>
  );
}
