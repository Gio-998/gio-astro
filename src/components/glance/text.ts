"use client";
import { useContent } from "@/lib/content-context";
import { glance as en, type Level } from "@/content/en/glance";
import { glance as mk } from "@/content/mk/glance";
import { glance as de } from "@/content/de/glance";
import { glance as sr } from "@/content/sr/glance";

export const useGlance = () => { const l = useContent().locale; return l === "mk" ? mk : l === "de" ? de : l === "sr" ? sr : en; };
export const levelOf = (v: number): Level => (v < 20 ? "vlow" : v < 40 ? "low" : v <= 60 ? "mid" : v <= 80 ? "high" : "vhigh");
