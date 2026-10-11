/** Macedonian content. Anything not yet translated falls back to English via deepMerge in ../index.ts. */
import * as astro from "./astro";
import * as quizzes from "./quizzes";
import * as psych from "./psych";
import * as chinese from "./chinese";
import * as vedic from "./vedic";
import * as nums from "./numbers";
import * as compat from "./compat";
import * as daily from "./daily";
import * as ui from "./ui";
import { site } from "./site";
import { landing } from "./landing";
import { book } from "./book";
import { lensInfo, lensUi } from "./lens";
export const mk = { astro, quizzes, psych, chinese, vedic, nums, compat, daily, ui, site, landing, book, lensInfo, lensUi };
