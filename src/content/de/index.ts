/** German content. Anything not yet translated falls back to English via deepMerge in ../index.ts. */
import * as astro from "./astro";
import { site } from "./site";
import { landing } from "./landing";
import * as ui from "./ui";
import { day } from "./day";
import * as daily from "./daily";
import { sky } from "./sky";
import { blog } from "./blog";
export const de = { astro, site, landing, ui, day, daily, sky, blog };

/** Small partials for strings shown in nav and footer; deeper bodies of these pages fall back to English for now. */
export const deNavPartials = {
  you: { metaTitle: "Du, alles auf einen Blick", eyebrow: "Auf einen Blick", title: "Du, alles auf einen Blick" },
  systems: { how: { link: "So funktioniert Horoscop", metaTitle: "So funktioniert Horoscop: Methoden, Belege und Datenschutz", eyebrow: "Offenes Buch", title: "So funktioniert Horoscop" } },
};
