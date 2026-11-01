import * as astro from "@/content/mk/astro";
import * as nums from "@/content/mk/numbers";
import * as daily from "@/content/mk/daily";
import * as compat from "@/content/mk/compat";
import { landing } from "@/content/mk/landing";
import { sky } from "@/content/mk/sky";
import { merge } from "./base";
import { enMid } from "./mid";

export default merge(enMid, { landing, sky, daily, astro, nums, compat });
