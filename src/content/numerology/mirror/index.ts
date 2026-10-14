import { mirrorEn } from "./en";
import { mirrorMk } from "./mk";
import { mirrorDe } from "./de";
/** Mirror hour pages, keyed "hh-mm" (for example "11-11"). Each one is written per language, not assembled. */
export type MirrorPage = { title: string; lead: string; sections: { title: string; paras: string[] }[] };
export type MirrorSet = Record<string, MirrorPage>;
export const MIRRORS: Record<string, MirrorSet> = { en: mirrorEn, mk: mirrorMk, de: mirrorDe };
/** Hub copy for /numerology/mirror-hours/. */
export const MIRROR_HUB: Record<string, { title: string; crumb: string; sub: string; intro: string[] }> = {
  en: { title: "Mirror hours: what 11:11, 12:12 and other double times mean", crumb: "Mirror hours", sub: "Why the clock seems to repeat itself, and what each mirror hour can point to in love, work and daily life.", intro: ["A mirror hour is a moment when the hours and minutes on a clock show the same digits, such as 11:11 or 22:22. Many people notice them at turning points. Choose the time you keep seeing to read what it can mean for you, and treat it as a prompt for reflection rather than a prediction."] },
  mk: { title: "Огледални часови: што значат 11:11, 12:12 и другите двојни времиња", crumb: "Огледални часови", sub: "Зошто часовникот како да се повторува и на што може да укаже секој огледален час во љубовта, работата и секојдневието.", intro: ["Огледален час е миг кога часовите и минутите на часовникот ги покажуваат истите цифри, како 11:11 или 22:22. Многу луѓе ги забележуваат во пресвртни моменти. Изберете го времето што постојано го гледате и прочитајте што може да значи, како повод за размислување, а не како предвидување."] },
  de: { title: "Spiegelzahlen auf der Uhr: was 11:11, 12:12 und andere Doppelzeiten bedeuten", crumb: "Spiegelzahlen", sub: "Warum die Uhr sich scheinbar wiederholt und worauf jede Spiegelzeit in Liebe, Arbeit und Alltag hinweisen kann.", intro: ["Eine Spiegelzeit ist ein Moment, in dem Stunden und Minuten auf der Uhr dieselben Ziffern zeigen, etwa 11:11 oder 22:22. Viele Menschen bemerken sie an Wendepunkten. Wähle die Uhrzeit, die du immer wieder siehst, und lies, was sie für dich bedeuten kann, als Anstoß zum Nachdenken und nicht als Vorhersage."] },
};
