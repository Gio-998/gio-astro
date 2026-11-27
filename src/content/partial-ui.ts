/** Interface text for the partial test locales (see src/lib/partial-scope.ts): the slim header and footer, the home page and the section labels the shared views need. */
import type { PartialLocale } from "@/lib/partial-scope";

export interface PartialUi {
  /** BCP 47 tag for <html lang>. */
  htmlLang: string;
  tagline: string;
  description: string;
  nav: { daily: string; monthly: string };
  footer: { blurb: string; daily: string; monthly: string; privacy: string; terms: string; contact: string };
  sec: { faq: string; related: string; explore: string };
  home: { title: string; h1: string; lead: string; intro: string[]; dailyHead: string; monthlyHead: string; monthlySub: string; allSigns: string; note: string };
}

export const PARTIAL_UI: Record<PartialLocale, PartialUi> = {
  sl: {
    htmlLang: "sl",
    tagline: "Horoskop iz pravega neba",
    description: "Dnevni in mesečni horoskop za vseh 12 znamenj, izračunan iz pravih položajev planetov in Lune. Brez splošnih fraz, vsak dan drugačno besedilo.",
    nav: { daily: "Dnevni horoskop", monthly: "Mesečni horoskop" },
    footer: { blurb: "Horoskop, izračunan iz pravega neba nad Srednjo Evropo. Besedila so napisana ročno, položaji planetov pa se preračunajo vsak dan.", daily: "Dnevni horoskop", monthly: "Mesečni horoskop", privacy: "Zasebnost (angleško)", terms: "Pogoji uporabe (angleško)", contact: "Pišite nam" },
    sec: { faq: "Pogosta vprašanja", related: "Še za tvoje znamenje", explore: "Odkrij več" },
    home: {
      title: "Horoskop za vsak dan in mesec",
      h1: "Horoskop iz pravega neba",
      lead: "Vsak dan znova izračunamo, kje sta Luna in planeti, in iz tega napišemo besedilo za tvoje znamenje.",
      intro: [
        "Dnevni horoskop spremlja Luno iz dneva v dan: v katerem znamenju je, kolikšen del diska je osvetljen in s katerimi planeti se sreča. Vsako branje je zato drugačno, tudi za dve zaporedni jutri.",
        "Mesečni horoskop pogleda dlje: mlaje, ščipe, menjave znamenj in retrogradna obdobja, preslikana na tvoje hiše. Tako Oven in Rak dobita o istem ščipu različen nasvet.",
      ],
      dailyHead: "Dnevni horoskop za vsa znamenja",
      monthlyHead: "Mesečni horoskop",
      monthlySub: "Kaj nebo prinaša tvojemu znamenju ta mesec.",
      allSigns: "Vsa znamenja",
      note: "Horoskop je namenjen razmisleku in zabavi, ne napovedi prihodnosti.",
    },
  },
};
