/** Second step of the lazy content: the texts of the landing page, base language. See lib/content-lazy.ts. */
import * as astro from "@/content/en/astro";
import * as nums from "@/content/en/numbers";
import * as daily from "@/content/en/daily";
import * as compat from "@/content/en/compat";
import { landing } from "@/content/en/landing";
import { sky } from "@/content/en/sky";

export const enMid = { landing, sky, daily, astro, nums, compat };
