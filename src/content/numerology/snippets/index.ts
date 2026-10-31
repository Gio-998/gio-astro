import { snippetsEn } from "./en";
import { snippetsDe } from "./de";
import { birthdaySnippetsEn } from "./en-birthdays";
import { birthdaySnippetsDe } from "./de-birthdays";
import { pairSnippetsEn } from "./en-pairs";
import { pairSnippetsDe } from "./de-pairs";
import type { Snippet, SnippetSet } from "./types";
export type { Snippet, SnippetSet };

/** Written per page and per language. A language without a table keeps the title and description of its page model. */
export const SNIPPETS: Record<string, SnippetSet> = {
  en: { ...snippetsEn, ...birthdaySnippetsEn, ...pairSnippetsEn },
  de: { ...snippetsDe, ...birthdaySnippetsDe, ...pairSnippetsDe },
};
export const pageSnippet = (lang: string, key: string): Snippet | undefined => SNIPPETS[lang]?.[key];
