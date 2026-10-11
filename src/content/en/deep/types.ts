/** Shared shapes for long-form ("deep") content. Every locale implements the same shapes. */
export interface Facets {
  love: string; friends: string; work: string; family: string;
}
export interface DeepEntry extends Partial<Facets> {
  title: string;          // evocative title, e.g. "The spark that starts things"
  quote: string;          // pull quote, second person
  story: string[];        // narrative paragraphs, second person
  daily?: string[];       // "in daily life this looks like…"
  strengths?: string[];
  shadows?: string[];
  growth?: string;
  practices?: string[];
  journal?: string[];
  myth?: string;          // mythic / archetypal theme
}
export interface SignDeep {
  title: string; quote: string; myth: string;
  sun: { story: string[]; daily: string[]; strengths: string[]; shadows: string[]; growth: string; practices: string[]; journal: string[] } & Facets;
  moon: { story: string; needs: string; heals: string; daily: string };
  rising: string;
  venus: string;
  mars: string;
  mercury: string;
  node: string;
}
