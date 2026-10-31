"use client";
import { ContentProvider } from "@/lib/content-context";
import { registerShell } from "@/lib/content-lazy";
import { site } from "@/content/de/site";
import * as ui from "@/content/de/ui";
import * as quizzes from "@/content/de/quizzes";
import { you, partners } from "@/content/de/you";
import { how } from "@/content/de/systems/how";
import { enShell, merge, PARTIAL_KEYS } from "./base";

const shell = merge(enShell, { site, ui, quizzes, you, partners, systems: { how: { link: how.link } } });
registerShell("de", shell, PARTIAL_KEYS, () => import("./mid-de").then((m) => m.default));
export const DeContent = ({ children }: { children: React.ReactNode }) => <ContentProvider locale="de">{children}</ContentProvider>;
