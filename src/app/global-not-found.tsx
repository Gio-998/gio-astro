import "./globals.css";
import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";

const display = Cormorant_Garamond({ subsets: ["latin", "latin-ext", "cyrillic"], weight: ["500", "600"], style: ["normal", "italic"], variable: "--font-cormorant", preload: false });
const sans = Inter({ subsets: ["latin", "latin-ext", "cyrillic"], variable: "--font-inter", preload: false });

export const metadata: Metadata = { title: "404 · Horoscop", robots: { index: false, follow: true } };

/** One static 404 for every unmatched URL. All languages ship in the HTML; a tiny script shows the one that matches the URL (/mk/... gets Macedonian). */
const T = {
  en: { eye: "Error 404", h: ["This page is not ", "in our sky"], p: "The link may be old or mistyped. Everything else is where you left it.", home: "Back to home", today: "See today's sky" },
  mk: { eye: "Грешка 404", h: ["Оваа страница ја нема ", "на нашето небо"], p: "Врската можеби е стара или погрешно напишана. Сè друго е таму каде што беше.", home: "Кон почетна", today: "Небото денес" },
  de: { eye: "Fehler 404", h: ["Diese Seite steht nicht ", "an unserem Himmel"], p: "Der Link ist vielleicht alt oder vertippt. Alles andere ist da, wo du es gelassen hast.", home: "Zur Startseite", today: "Der Himmel heute" },
} as const;
const pick = `try{var m=location.pathname.match(/^\\/(en|mk|de)(\\/|$)/),s=localStorage.getItem("mirrorstar:lang"),l=m?m[1]:(s==="mk"||s==="de"?s:"en");document.documentElement.lang=l;document.documentElement.dataset.nf=l}catch(e){}`;

function Block({ l }: { l: "en" | "mk" | "de" }) {
  const t = T[l];
  return (
    <section data-nf-lang={l} lang={l} className="nf-block mx-auto max-w-lg text-center">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[.22em] text-gold">✦ {t.eye}</p>
      <h1 className="h-display mb-4 text-balance text-[clamp(2.2rem,9vw,3.4rem)] leading-[1.05] text-mist">{t.h[0]}<span className="italic text-aurora">{t.h[1]}</span></h1>
      <p className="mx-auto mb-8 max-w-sm text-balance text-mist/80">{t.p}</p>
      <div className="flex flex-wrap justify-center gap-3">
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- plain links: this page renders outside the app layouts */}
        <a className="btn-primary whitespace-nowrap !px-6 !py-2.5 text-sm" href={`/${l}/`}>{t.home}</a>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a className="btn-ghost whitespace-nowrap !px-6 !py-2.5 text-sm" href={`/${l}/today/`}>{t.today}</a>
      </div>
    </section>
  );
}

export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: pick }} />
        <style>{`html[data-nf] .nf-block{display:none}html[data-nf=en] .nf-block[data-nf-lang=en],html[data-nf=mk] .nf-block[data-nf-lang=mk],html[data-nf=de] .nf-block[data-nf-lang=de]{display:block}html:not([data-nf]) .nf-block:not([data-nf-lang=en]){display:none}`}</style>
      </head>
      <body className="font-sans antialiased" style={{ minHeight: "100vh", background: "radial-gradient(120% 80% at 50% 0%, #3a2a7a 0%, #1a1440 45%, #0e0b26 100%)" }}>
        <header className="mx-auto flex max-w-4xl items-center px-4 py-4">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/" className="flex items-center gap-2 text-mist" aria-label="Horoscop">
            <svg viewBox="0 0 40 40" className="h-9 w-9" aria-hidden>
              <defs><linearGradient id="nf-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f6cf7a" /><stop offset="1" stopColor="#e8a6c8" /></linearGradient></defs>
              <circle cx="20" cy="20" r="18" fill="none" stroke="url(#nf-g)" strokeWidth="1.2" />
              <path d="M26 9 A12 12 0 1 0 26 31 A9.5 12 0 1 1 26 9 Z" fill="url(#nf-g)" opacity=".9" />
              <path d="M27 17 l1 3 3 1 -3 1 -1 3 -1 -3 -3 -1 3 -1z" fill="#fffaf0" />
            </svg>
            <span className="h-display text-xl">Horoscop</span>
          </a>
        </header>
        <main className="px-5 pb-24 pt-[12vh]">
          <Block l="en" />
          <Block l="mk" />
          <Block l="de" />
        </main>
      </body>
    </html>
  );
}
