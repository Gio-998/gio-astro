import { snippetsEn } from "./en";
import { snippetsDe } from "./de";
import { snippetsSr } from "./sr";
import { numberSnippetsSr } from "./sr-numbers";
import { birthdaySnippetsEn } from "./en-birthdays";
import { birthdaySnippetsDe } from "./de-birthdays";
import { birthdaySnippetsSr } from "./sr-birthdays";
import { pairSnippetsEn } from "./en-pairs";
import { pairSnippetsDe } from "./de-pairs";
import { pairSnippetsSr } from "./sr-pairs";
import type { Snippet, SnippetSet } from "./types";
export type { Snippet, SnippetSet };

/** Written per page and per language. A language without a table keeps the title and description of its page model. */
export const SNIPPETS: Record<string, SnippetSet> = {
  en: { ...snippetsEn, ...birthdaySnippetsEn, ...pairSnippetsEn },
  de: { ...snippetsDe, ...birthdaySnippetsDe, ...pairSnippetsDe },
  sr: { ...snippetsSr, ...numberSnippetsSr, ...birthdaySnippetsSr, ...pairSnippetsSr },
};
export const pageSnippet = (lang: string, key: string): Snippet | undefined => SNIPPETS[lang]?.[key];
