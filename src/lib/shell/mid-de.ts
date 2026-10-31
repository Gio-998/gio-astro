import * as astro from "@/content/de/astro";
import * as nums from "@/content/de/numbers";
import * as daily from "@/content/de/daily";
import * as compat from "@/content/de/compat";
import { landing } from "@/content/de/landing";
import { sky } from "@/content/de/sky";
import { merge } from "./base";
import { enMid } from "./mid";

export default merge(enMid, { landing, sky, daily, astro, nums, compat });
