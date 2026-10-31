import { PrintKit } from "@/components/PrintKit";
import { ExportPdf } from "@/components/ExportPdf";
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Cormorant_Garamond, Inter, Unbounded } from "next/font/google";
import { LivingSky } from "@/components/sky/LivingSky";
import { SvgDefs } from "@/components/art/SvgDefs";
import "../globals.css";
import { LOCALES, isLocale, getContent } from "@/content";
import { ContentProvider } from "@/lib/content-context";
import { Header, Footer } from "@/components/Chrome";
import { RouteScrollTop } from "@/components/RouteScrollTop";
import { SITE_URL } from "@/lib/site-url";
import { CONTACT_EMAIL } from "@/lib/schema";
import { localizedMeta } from "@/lib/seo";
import { PersonalTheme } from "@/components/PersonalTheme";
import { AccountBoot } from "@/components/auth/Auth";
import { BetaGate } from "@/components/auth/Beta";
import { FeedbackButton, UsageBoot } from "@/components/admin/Feedback";

const display = Cormorant_Garamond({ subsets: ["latin", "latin-ext", "cyrillic"], weight: ["400", "500", "600", "700"], style: ["normal", "italic"], variable: "--font-cormorant" });
// Unbounded: variable, Cyrillic-capable display face for caps, numerals and kinetic headlines (Cinzel had no Cyrillic).
const caps = Unbounded({ subsets: ["latin", "latin-ext", "cyrillic"], variable: "--font-unbounded", display: "swap" });
const sans = Inter({ subsets: ["latin", "latin-ext", "cyrillic"], variable: "--font-inter" });

export const dynamicParams = false;
export function generateStaticParams() { return LOCALES.map((lang) => ({ lang })); }

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const c = getContent(lang);
  return {
    metadataBase: new URL(SITE_URL),
    verification: { google: ["lawAZscQq-N7Z2WZ5gPeHdtfwMK02cXhEACtaYUoHvY", "2nXRy-mgheo53M60i3hgsRr0v7lfJqK5L5nuwNmt-lE"] },
    title: { default: `${c.site.brand}: ${c.site.tagline}`, template: `%s · ${c.site.brand}` },
    description: c.site.description,
    // Landing page defaults; every inner page overrides canonical/alternates/OG with its own path (lib/page-meta).
    ...localizedMeta(lang, "/", { title: `${c.site.brand} · ${c.site.tagline}`, description: c.site.description, siteName: c.site.brand }),
  };
}
export const viewport: Viewport = { themeColor: "#0e0b26", width: "device-width", initialScale: 1 };

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const site = getContent(lang).site;
  // Site-level schema on every page: who publishes the site (Organization) and the site itself (WebSite). No sameAs until real profiles exist.
  // One site, one identity: the same @id on every language, so WebSite names the domain and all its languages, not one locale folder.
  const siteLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: site.brand, url: `${SITE_URL}/`, logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png`, width: 512, height: 512 }, email: CONTACT_EMAIL, contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: CONTACT_EMAIL, availableLanguage: [...LOCALES] } },
      { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: site.brand, alternateName: new URL(SITE_URL).hostname, url: `${SITE_URL}/`, inLanguage: [...LOCALES], description: site.description, publisher: { "@id": `${SITE_URL}/#organization` } },
    ],
  };
  return (
    <html lang={lang} data-scroll-behavior="smooth" className={`${display.variable} ${caps.variable} ${sans.variable}`}>
      <body className="font-sans antialiased">
        <noscript><style>{"[data-reveal]{opacity:1!important;transform:none!important;filter:none!important}"}</style></noscript>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteLd) }} />
        <SvgDefs />
        <ContentProvider locale={lang}>
          <LivingSky />
          <PersonalTheme />
          <AccountBoot />
          <UsageBoot />
          <PrintKit />
          <RouteScrollTop />
          <Header />
          <main className="mx-auto w-full max-w-4xl px-4 pb-24 pt-4"><BetaGate>{children}</BetaGate><ExportPdf /></main>
          <Footer />
          <FeedbackButton />
        </ContentProvider>
      </body>
    </html>
  );
}
