import { RedirectToPricing, redirectMeta } from "@/components/pricing/RedirectToPricing";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) { const { lang } = await params; return redirectMeta(lang); }
export default async function Page({ params }: { params: Promise<{ lang: string }> }) { const { lang } = await params; return <RedirectToPricing lang={lang} />; }
