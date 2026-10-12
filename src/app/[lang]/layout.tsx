import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Cormorant_Garamond, Inter, Cinzel } from "next/font/google";
import { Starfield } from "@/components/art/Starfield";
import { SvgDefs } from "@/components/art/SvgDefs";
import "../globals.css";
import { LOCALES, isLocale, getContent } from "@/content";
import { ContentProvider } from "@/lib/content-context";
import { Header, Footer } from "@/components/Chrome";
import { SITE_URL } from "@/lib/site-url";
import { localizedMeta } from "@/lib/seo";
import { PersonalTheme } from "@/components/PersonalTheme";
import { AccountBoot } from "@/components/auth/Auth";
import { BetaGate } from "@/components/auth/Beta";
import { LangSuggest } from "@/components/LangSuggest";

const display = Cormorant_Garamond({ subsets: ["latin", "latin-ext", "cyrillic"], weight: ["400", "500", "600", "700"], style: ["normal", "italic"], variable: "--font-cormorant" });
const caps = Cinzel({ subsets: ["latin", "latin-ext"], weight: ["500", "600"], variable: "--font-cinzel" });
const sans = Inter({ subsets: ["latin", "latin-ext", "cyrillic"], variable: "--font-inter" });

export const dynamicParams = false;
export function generateStaticParams() { return LOCALES.map((lang) => ({ lang })); }

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const c = getContent(lang);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: `${c.site.brand}: ${c.site.tagline}`, template: `%s · ${c.site.brand}` },
    description: c.site.description,
    // Landing page defaults; every inner page overrides canonical/alternates/OG with its own path (lib/page-meta).
    ...localizedMeta(lang, "/", { title: `${c.site.brand} · ${c.site.tagline}`, description: c.site.description, siteName: c.site.brand }),
  };
}
export const viewport: Viewport = { themeColor: "#1c1645", width: "device-width", initialScale: 1 };

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <html lang={lang} className={`${display.variable} ${caps.variable} ${sans.variable}`}>
      <body className="font-sans antialiased">
        <noscript><style>{"[data-reveal]{opacity:1!important;transform:none!important;filter:none!important}"}</style></noscript>
        <SvgDefs />
        <ContentProvider locale={lang}>
          <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
            <Starfield density={0.00009} shooting={false} />
            <div className="absolute -left-40 top-1/3 h-[520px] w-[520px] rounded-full bg-violet/20 blur-[120px] animate-pulse-glow" />
            <div className="absolute -right-40 bottom-0 h-[480px] w-[480px] rounded-full bg-rose/10 blur-[120px] animate-pulse-glow [animation-delay:2s]" />
          </div>
          <PersonalTheme />
          <AccountBoot />
          <Header />
          <main className="mx-auto w-full max-w-4xl px-4 pb-24 pt-4"><LangSuggest /><BetaGate>{children}</BetaGate></main>
          <Footer />
        </ContentProvider>
      </body>
    </html>
  );
}
