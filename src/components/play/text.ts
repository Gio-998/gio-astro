"use client";
import { useContent } from "@/lib/content-context";
import { playFor } from "./content";
export const usePlay = () => playFor(useContent().locale);
