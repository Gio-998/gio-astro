"use client";
import { useContent } from "@/lib/content-context";
import { adaptive as en } from "@/content/en/adaptive";
import { adaptive as mk } from "@/content/mk/adaptive";
import { adaptive as de } from "@/content/de/adaptive";
export const adaptiveFor = (locale: string) => (locale === "mk" ? mk : locale === "de" ? de : en);
export const useAdaptive = () => adaptiveFor(useContent().locale);
