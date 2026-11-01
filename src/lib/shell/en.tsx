"use client";
import { ContentProvider } from "@/lib/content-context";
import { registerShell } from "@/lib/content-lazy";
import { enShell, PARTIAL_KEYS } from "./base";

registerShell("en", enShell, PARTIAL_KEYS, () => import("./mid").then((m) => m.enMid));
export const EnContent = ({ children }: { children: React.ReactNode }) => <ContentProvider locale="en">{children}</ContentProvider>;
