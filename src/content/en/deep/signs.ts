import type { Sign } from "@/engine/zodiac";
import type { SignDeep } from "./types";
import { aries, taurus, gemini, cancer } from "./signs-a";
import { leo, virgo, libra, scorpio } from "./signs-b";
import { sagittarius, capricorn, aquarius, pisces } from "./signs-c";
export const signDeep: Record<Sign, SignDeep> = { aries, taurus, gemini, cancer, leo, virgo, libra, scorpio, sagittarius, capricorn, aquarius, pisces };
