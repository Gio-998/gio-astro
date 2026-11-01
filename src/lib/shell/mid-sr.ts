import * as astro from "@/content/sr/astro";
import * as nums from "@/content/sr/numbers";
import * as daily from "@/content/sr/daily";
import * as compat from "@/content/sr/compat";
import { landing } from "@/content/sr/landing";
import { sky } from "@/content/sr/sky";
import { merge } from "./base";
import { enMid } from "./mid";

export default merge(enMid, { landing, sky, daily, astro, nums, compat });
