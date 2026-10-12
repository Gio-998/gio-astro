export type BlogBlock = { t: "p"; text: string } | { t: "h"; text: string } | { t: "ul"; items: string[] } | { t: "quote"; text: string } | { t: "cta"; text: string; href: string };
export interface BlogPost {
  slug: string; title: string; description: string; date: string; updated?: string; minutes: number; tags: string[];
  lead: string; blocks: BlogBlock[]; sources?: string[];
}
