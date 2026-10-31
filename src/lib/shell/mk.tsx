"use client";
import { ContentProvider } from "@/lib/content-context";
import { registerShell } from "@/lib/content-lazy";
import { site } from "@/content/mk/site";
import * as ui from "@/content/mk/ui";
import * as quizzes from "@/content/mk/quizzes";
import { you, partners } from "@/content/mk/you";
import { how } from "@/content/mk/systems/how";
import { enShell, merge, PARTIAL_KEYS } from "./base";

const shell = merge(enShell, { site, ui, quizzes, you, partners, systems: { how: { link: how.link } } });
registerShell("mk", shell, PARTIAL_KEYS, () => import("./mid-mk").then((m) => m.default));
export const MkContent = ({ children }: { children: React.ReactNode }) => <ContentProvider locale="mk">{children}</ContentProvider>;
