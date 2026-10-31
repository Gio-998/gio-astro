import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NumView, modelMeta } from "@/components/numerology/NumPage";
import { localizedPath, parsePath, sectionSlug, servesFolder } from "@/lib/i18n-routes";
import { SECTIONS, sectionModel } from "@/lib/sections";

/** Static params for one locale's slug folder. Static export refuses an empty list, so other locales get the "_" placeholder that renders the 404 page. */
export function sectionParams(section: string, lang: string, owner: string) {
  const hub = `/${section}/`;
  const sub = servesFolder(lang, section, owner) ? SECTIONS[section].paths().filter((p) => p !== hub).map((p) => ({ slug: localizedPath(lang, p).split("/").filter(Boolean).slice(2) })) : [];
  return sub.length ? sub : [{ slug: ["_"] }];
}
const internal = (section: string, lang: string, slug: string[] = []) => parsePath(`/${lang}/${sectionSlug(lang, section)}/${slug.map(decodeURIComponent).join("/")}${slug.length ? "/" : ""}`)?.[1] ?? "";

export async function sectionMeta(section: string, lang: string, slug?: string[]): Promise<Metadata> {
  const m = sectionModel(lang, internal(section, lang, slug));
  return m ? modelMeta(lang, m) : {};
}
export function SectionPage({ section, lang, slug }: { section: string; lang: string; slug?: string[] }) {
  const m = sectionModel(lang, internal(section, lang, slug)); if (!m) notFound();
  return <NumView lang={lang} m={m} />;
}
