"use client";
import dynamic from "next/dynamic";

// NumPage renders every numerology page, but only two of them show these forms. Without this split the premium gate and its animation library load on all of them.
export const DuoCalc = dynamic(() => import("./Personal").then((m) => m.DuoCalc));
export const NameReport = dynamic(() => import("./Personal").then((m) => m.NameReport));
