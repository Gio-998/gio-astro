/** German content. Anything not yet translated falls back to English via deepMerge in ../index.ts. */
import * as astro from "./astro";
import { site } from "./site";
import { landing } from "./landing";
import * as ui from "./ui";
import { day } from "./day";
import * as daily from "./daily";
import { sky } from "./sky";
import { blog } from "./blog";
import * as quizzes from "./quizzes";
import * as psych from "./psych";
import * as nums from "./numbers";
import * as chinese from "./chinese";
import * as vedic from "./vedic";
import * as compat from "./compat";
import { lensInfo, lensUi } from "./lens";
import { book } from "./book";
import { accuracy } from "./accuracy";
import { types } from "./types";
export const de = { astro, site, landing, ui, day, daily, sky, blog, quizzes, psych, nums, chinese, vedic, compat, lensInfo, lensUi, book, accuracy, types };

/** Small partials for strings shown in nav and footer; deeper bodies of these pages fall back to English for now. */
export const deNavPartials = {
  systems: { how: { link: "So funktioniert Horoscop", metaTitle: "So funktioniert Horoscop: Methoden, Belege und Datenschutz", eyebrow: "Offenes Buch", title: "So funktioniert Horoscop" } },
};
