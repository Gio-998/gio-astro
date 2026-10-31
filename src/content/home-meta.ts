/**
 * Search title and description of the home page. The title is used as written, without the " · Horoscop" suffix, because it
 * starts with the brand. A language without a row keeps the layout default (brand plus tagline, site.description).
 */
export const HOME_META: Record<string, { title: string; description: string }> = {
  en: { title: "Horoscop: daily horoscope, birth chart and numerology", description: "Your daily horoscope for all 12 signs, a birth chart from real planetary positions, angel numbers, life path and compatibility. Honest, and free to read." },
  de: { title: "Horoscop: Tageshoroskop, Geburtshoroskop, Numerologie", description: "Dein Tageshoroskop für alle 12 Sternzeichen, Geburtshoroskop aus echten Planetenpositionen, Engelszahlen, Lebenszahl und Kompatibilität. Ehrlich und gratis." },
  sr: { title: "Horoscop: dnevni horoskop, natalna karta, numerologija", description: "Tvoj dnevni horoskop za svih 12 znakova, natalna karta iz pravih položaja planeta, anđeoski brojevi, životni put i kompatibilnost. Iskreno i besplatno." },
};
