"use client";
import { ContentProvider } from "@/lib/content-context";
import { registerShell } from "@/lib/content-lazy";
import { site } from "@/content/sr/site";
import * as ui from "@/content/sr/ui";
import * as quizzes from "@/content/sr/quizzes";
import { you, partners } from "@/content/sr/you";
import { how } from "@/content/sr/systems/how";
import { enShell, merge, PARTIAL_KEYS } from "./base";

const shell = merge(enShell, { site, ui, quizzes, you, partners, systems: { how: { link: how.link } } });
registerShell("sr", shell, PARTIAL_KEYS, () => import("./mid-sr").then((m) => m.default));
export const SrContent = ({ children }: { children: React.ReactNode }) => <ContentProvider locale="sr">{children}</ContentProvider>;
