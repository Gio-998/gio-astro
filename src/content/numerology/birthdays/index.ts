import { bdayEn } from "./en";
import { bdayMk } from "./mk";
import { bdayDe } from "./de";
export type BdayPage = { title: string; lead: string; sections: { title: string; paras: string[] }[] };
export type BdaySet = Record<number, BdayPage>;
export const BIRTHDAYS: Record<string, BdaySet> = { en: bdayEn, mk: bdayMk, de: bdayDe };
