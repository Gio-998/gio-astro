import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "../globals.css";
import { LOCALES, isLocale, getContent } from "@/content";
import { ContentProvider } from "@/lib/content-context";
import { Header, Footer } from "@/components/Chrome";
import { SITE_URL } from "@/lib/site-url";

const display = Cormorant_Garamond({ subsets: ["latin", "latin-ext"], weight: ["500", "600", "700"], variable: "--font-cormorant" });
const sans = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter" });

export const dynamicParams = false;
export function generateStaticParams() { return LOCALES.map((lang) => ({ lang })); }

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const c = getContent(lang);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: `${c.site.brand} — ${c.site.tagline}`, template: `%s · ${c.site.brand}` },
    description: c.site.description,
    openGraph: { siteName: c.site.brand, type: "website", locale: lang },
    alternates: { languages: Object.fromEntries(LOCALES.map((l) => [l, `/${l}/`])) },
  };
}
export const viewport: Viewport = { themeColor: "#0d0b1f", width: "device-width", initialScale: 1 };

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <html lang={lang} className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans antialiased">
        <ContentProvider locale={lang}>
          <Header />
          <main className="mx-auto w-full max-w-3xl px-4 pb-24 pt-4">{children}</main>
          <Footer />
        </ContentProvider>
      </body>
    </html>
  );
}
