/** Shapes for the public numerology pages. Every locale fills the same shapes (MK written natively, not translated). */
export type QA = [string, string];
/** The character of one number (0 to 9 and the masters 11, 22, 33). Used by life path, angel and personal year pages. */
export interface CharEntry {
  name: string; essence: string;
  story: string; gifts: string; love: string; work: string; money: string; shadow: string; week: string;
  questions: string[];
}
/** One angel number page. Every field is unique to that number. */
export interface AngelEntry { tag: string; scene: string; meaning: string[]; love: string; work: string; act: string; why: string }
/** Extra story for a personal year 1 to 9 (adds to the existing yearly text). */
export interface YearEntry { scene: string; months: string; love: string; work: string; body: string; close: string }
/** A hub or explainer page. */
export interface Explainer { title: string; sub: string; intro: string[]; how: string[]; faq: QA[] }
export interface KarmicEntry { title: string; story: string[]; lesson: string; practice: string }
