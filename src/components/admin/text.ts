"use client";
import { useContent } from "@/lib/content-context";
import { admin as en } from "@/content/en/admin";
import { admin as mk } from "@/content/mk/admin";
import { admin as sr } from "@/content/sr/admin";
export const useAdminText = () => { const l = useContent().locale; return l === "mk" ? mk : l === "sr" ? sr : en; };
