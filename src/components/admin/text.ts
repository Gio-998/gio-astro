"use client";
import { useContent } from "@/lib/content-context";
import { admin as en } from "@/content/en/admin";
import { admin as mk } from "@/content/mk/admin";
export const useAdminText = () => (useContent().locale === "mk" ? mk : en);
