/** Macedonian content. Anything not yet translated falls back to English via deepMerge in ../index.ts. */
import * as astro from "./astro";
import * as quizzes from "./quizzes";
import * as psych from "./psych";
import { site } from "./site";
import { landing } from "./landing";
import { book } from "./book";
import { lensInfo, lensUi } from "./lens";
export const mk = { astro, quizzes, psych, site, landing, book, lensInfo, lensUi };
