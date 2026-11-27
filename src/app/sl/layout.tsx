import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, Unbounded } from "next/font/google";
import { LivingSky } from "@/components/sky/LivingSky";
import { PageSprite } from "@/components/art/SvgDefs";
import "../globals.css";
import { getContent } from "@/content";
import { PARTIAL_UI } from "@/content/partial-ui";
import { PartialHeader, PartialFooter } from "@/components/partial/PartialChrome";
import { RouteScrollTop } from "@/components/RouteScrollTop";
import { SITE_URL } from "@/lib/site-url";
import { CONTACT_EMAIL } from "@/lib/schema";

// The Slovenian test locale (see src/lib/partial-scope.ts) is its own root layout: slim chrome, no account, no app, and none of the sections the other languages have.
const display = Cormorant_Garamond({ subsets: ["latin", "latin-ext", "cyrillic"], weight: ["400", "500", "600", "700"], style: ["normal", "italic"], variable: "--font-cormorant", preload: false });
const caps = Unbounded({ subsets: ["latin", "latin-ext", "cyrillic"], variable: "--font-unbounded", display: "swap", preload: false });
const sans = Inter({ subsets: ["latin"], variable: "--font-inter" });

const LOCALE = "sl" as const;
export function generateMetadata(): Metadata {
  const site = getContent(LOCALE).site; const U = PARTIAL_UI[LOCALE];
  return {
    metadataBase: new URL(SITE_URL),
    verification: { google: ["lawAZscQq-N7Z2WZ5gPeHdtfwMK02cXhEACtaYUoHvY", "2nXRy-mgheo53M60i3hgsRr0v7lfJqK5L5nuwNmt-lE"] },
    title: { default: `${site.brand}: ${U.tagline}`, template: `%s · ${site.brand}` },
    description: U.description,
  };
}
export const viewport: Viewport = { themeColor: "#0e0b26", width: "device-width", initialScale: 1 };

export default function SlLayout({ children }: { children: React.ReactNode }) {
  const site = getContent(LOCALE).site; const U = PARTIAL_UI[LOCALE];
  const siteLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: site.brand, url: `${SITE_URL}/`, logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png`, width: 512, height: 512 }, email: CONTACT_EMAIL },
      { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: site.brand, alternateName: new URL(SITE_URL).hostname, url: `${SITE_URL}/`, inLanguage: U.htmlLang, description: U.description, publisher: { "@id": `${SITE_URL}/#organization` } },
    ],
  };
  return (
    <html lang={U.htmlLang} data-scroll-behavior="smooth" className={`${display.variable} ${caps.variable} ${sans.variable}`}>
      <body className="font-sans antialiased">
        <noscript><style>{"[data-reveal]{opacity:1!important;transform:none!important;filter:none!important}"}</style></noscript>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteLd) }} />
        <PageSprite />
        <LivingSky />
        <RouteScrollTop />
        <PartialHeader locale={LOCALE} />
        <main className="mx-auto w-full max-w-4xl px-4 pb-24 pt-4">{children}</main>
        <PartialFooter locale={LOCALE} />
      </body>
    </html>
  );
}
