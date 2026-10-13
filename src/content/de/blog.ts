import type { blog as En } from "../en/extra/blog";
export const blog: typeof En = {
  title: "Blog",
  metaTitle: "Blog über Astrologie und Persönlichkeit",
  sub: "Verständliche Artikel über Astrologie, Persönlichkeit und Beziehungen.",
  meta: "Artikel über Geburtshoroskope, Persönlichkeitstypen und das, was Beziehungen wirklich trägt, in klarer Sprache.",
  read: (n: number) => `${n} Min. Lesezeit`,
  back: "Alle Artikel",
  sources: "Quellen",
  published: "Veröffentlicht",
  more: "Weiterlesen",
};
